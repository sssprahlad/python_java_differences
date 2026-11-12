import React, { useState, useEffect, useRef } from 'react';

let pyodidePromise = null;

function loadPyodideScript() {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load Pyodide'));
    document.head.appendChild(script);
  });
}

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await loadPyodideScript();
      return await window.loadPyodide();
    })();
  }
  return pyodidePromise;
}

const RUNNABLE = /python|django|sqlite/i;
const isRunnable = (label) => RUNNABLE.test(label);

function Playground({ section, initialCode, initialLang, onClose }) {
  const columns = section.columns || [];
  const firstTopic = section.topics[0];

  const [codes, setCodes] = useState(() => {
    const init = {};
    columns.forEach((c) => {
      init[c.key] = firstTopic?.[c.key]?.code || '';
    });
    return init;
  });
  const [activeKey, setActiveKey] = useState(columns[0]?.key);
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const outputRef = useRef(null);

  const activeCol = columns.find((c) => c.key === activeKey) || columns[0];
  const runnableCol = columns.find((c) => isRunnable(c.label));

  // Update code when a new "Practice" click happens while open
  useEffect(() => {
    if (initialCode) {
      const col = columns.find((c) => c.label === initialLang);
      if (col) {
        setCodes((prev) => ({ ...prev, [col.key]: initialCode }));
        setActiveKey(col.key);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, initialLang]);

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [output]);

  const runCode = async () => {
    const langLabel = activeCol.label;
    const code = codes[activeKey] || '';

    if (!isRunnable(langLabel)) {
      setOutput(
        `ℹ️  "${langLabel}" code can't run in the browser.\n\n` +
        `To practise it:\n` +
        `• Copy the code into your IDE / project\n` +
        `• Install the runtime (node, jdk, dotnet…) and run it locally\n` +
        `• Test APIs with Postman or a browser\n\n` +
        (runnableCol
          ? `For quick in-browser practice, switch to the ${runnableCol.label} tab — it runs right here via Pyodide.`
          : `Only runnable snippets are supported in the browser playground.`)
      );
      return;
    }

    setRunning(true);
    setOutput('⏳ Loading Python runtime (first run downloads ~10 MB)…');
    try {
      const pyodide = await getPyodide();
      setOutput('▶ Running…');
      pyodide.globals.set('__code__', code);
      // Feed stdin via a simple input() shim
      pyodide.globals.set('__input__', () => {
        const v = window.prompt('Python input():');
        return v === null ? '' : v;
      });
      await pyodide.runPythonAsync(
        'import sys, io\n' +
        '__stdout__ = io.StringIO()\n' +
        'sys.stdout = __stdout__\n' +
        'try:\n' +
        '    _input = input\n' +
        '    input = __input__\n' +
        'except Exception:\n' +
        '    pass\n' +
        'try:\n' +
        '    exec(compile(__code__, "<playground>", "exec"))\n' +
        'except Exception as e:\n' +
        '    print("Traceback:", type(e).__name__, "-", e)\n' +
        'finally:\n' +
        '    sys.stdout = sys.__stdout__\n' +
        '    _out = __stdout__.getvalue()\n' +
        '    del __stdout__\n'
      );
      const captured = pyodide.globals.get('_out');
      setOutput(captured || '(no output)');
      pyodide.runPython('del _out');
    } catch (err) {
      setOutput('❌ Error: ' + (err.message || err));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="playground-overlay" onClick={onClose}>
      <div className="playground-modal" onClick={(e) => e.stopPropagation()}>
        <div className="playground-header">
          <h3>🛠️ Code Playground — {section.section.title}</h3>
          <button className="pg-close" onClick={onClose}>✕</button>
        </div>

        <div className="pg-tabs">
          {columns.map((col) => (
            <button
              key={col.key}
              className={`pg-tab ${activeKey === col.key ? 'active' : ''}`}
              style={{ '--accent': col.color }}
              onClick={() => setActiveKey(col.key)}
            >
              {col.label} {isRunnable(col.label) ? '· runs in browser' : '· local only'}
            </button>
          ))}
        </div>

        <textarea
          className="pg-editor"
          value={codes[activeKey] || ''}
          onChange={(e) => setCodes((prev) => ({ ...prev, [activeKey]: e.target.value }))}
          spellCheck="false"
        />

        <div className="pg-actions">
          <button className="pg-run" onClick={runCode} disabled={running}>
            {running ? 'Running…' : '▶ Run Code'}
          </button>
          <button
            className="pg-clear"
            onClick={() => setOutput('')}
          >
            Clear output
          </button>
        </div>

        <div className="pg-output" ref={outputRef}>
          <div className="pg-output-label">Output</div>
          <pre>{output || '// Click "Run Code" to execute (Python/Django/SQLite run in-browser via Pyodide)'}</pre>
        </div>
      </div>
    </div>
  );
}

export default Playground;
