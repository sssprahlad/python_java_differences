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

const PYTHONISH = /python|django/i;

function Playground({ section, initialCode, initialLang, onClose }) {
  const [leftCode, setLeftCode] = useState(initialCode || section.topics[0]?.python.code || '');
  const [rightCode, setRightCode] = useState(section.topics[0]?.java.code || '');
  const [activeTab, setActiveTab] = useState(initialLang === section.rightLabel ? 'right' : 'left');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [loadingPyodide, setLoadingPyodide] = useState(false);
  const outputRef = useRef(null);

  // Update codes when a new "Practice" click happens while open
  useEffect(() => {
    if (initialCode) {
      if (initialLang === section.rightLabel) {
        setRightCode(initialCode);
        setActiveTab('right');
      } else {
        setLeftCode(initialCode);
        setActiveTab('left');
      }
    }
  }, [initialCode, initialLang, section]);

  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [output]);

  const runCode = async () => {
    const isLeft = activeTab === 'left';
    const langLabel = isLeft ? section.leftLabel : section.rightLabel;
    const code = isLeft ? leftCode : rightCode;

    if (!PYTHONISH.test(langLabel) && !/sqlite/i.test(langLabel)) {
      setOutput(
        `ℹ️  "${langLabel}" code runs on a server/JVM, not in the browser.\n\n` +
        `To practise it:\n` +
        `• Copy the code into your IDE / project\n` +
        `• Run it locally (e.g. mvn spring-boot:run, python manage.py runserver)\n` +
        `• Test the API endpoints with Postman\n\n` +
        `For quick practice, switch to the ${section.leftLabel} tab — Python runs right here in your browser via Pyodide.`
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
      setLoadingPyodide(false);
    }
  };

  const leftIsPython = PYTHONISH.test(section.leftLabel) || /sqlite/i.test(section.leftLabel);
  const rightIsPython = PYTHONISH.test(section.rightLabel) || /sqlite/i.test(section.rightLabel);

  return (
    <div className="playground-overlay" onClick={onClose}>
      <div className="playground-modal" onClick={(e) => e.stopPropagation()}>
        <div className="playground-header">
          <h3>🛠️ Code Playground — {section.section.title}</h3>
          <button className="pg-close" onClick={onClose}>✕</button>
        </div>

        <div className="pg-tabs">
          <button
            className={`pg-tab ${activeTab === 'left' ? 'active' : ''}`}
            style={{ '--accent': section.leftColor }}
            onClick={() => setActiveTab('left')}
          >
            {section.leftLabel} {leftIsPython ? '· runs in browser' : '· server-side'}
          </button>
          <button
            className={`pg-tab ${activeTab === 'right' ? 'active' : ''}`}
            style={{ '--accent': section.rightColor }}
            onClick={() => setActiveTab('right')}
          >
            {section.rightLabel} {rightIsPython ? '· runs in browser' : '· server-side'}
          </button>
        </div>

        <textarea
          className="pg-editor"
          value={activeTab === 'left' ? leftCode : rightCode}
          onChange={(e) => activeTab === 'left' ? setLeftCode(e.target.value) : setRightCode(e.target.value)}
          spellCheck="false"
        />

        <div className="pg-actions">
          <button className="pg-run" onClick={runCode} disabled={running || loadingPyodide}>
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
          <pre>{output || '// Click "Run Code" to execute (Python runs in-browser via Pyodide)'}</pre>
        </div>
      </div>
    </div>
  );
}

export default Playground;
