import React, { useState } from 'react';

function CodeBlock({ code, language, onRunInPlayground }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{language}</span>
        <div className="code-actions">
          {onRunInPlayground && (
            <button className="code-btn" onClick={() => onRunInPlayground(code, language)}>
              ▶ Practice
            </button>
          )}
          <button className="code-btn" onClick={copy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}

export default CodeBlock;
