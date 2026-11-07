import React from 'react';
import CodeBlock from './CodeBlock';

function ComparisonView({ topic, leftLabel, rightLabel, leftColor, rightColor, onRunInPlayground }) {
  return (
    <article className="comparison-view">
      <header className="topic-header">
        <h2>{topic.title}</h2>
        <p className="topic-learn">🎯 {topic.learn}</p>
      </header>

      <div className="compare-columns">
        <section className="compare-col" style={{ '--accent': leftColor }}>
          <div className="col-heading">
            <span className="lang-badge" style={{ background: leftColor }}>{leftLabel}</span>
          </div>
          <p className="col-definition">{topic.python.definition}</p>
          <CodeBlock
            code={topic.python.code}
            language={leftLabel}
            onRunInPlayground={(code) => onRunInPlayground(code, leftLabel)}
          />
        </section>

        <div className="compare-divider" aria-hidden="true">
          <span className="divider-line" />
          <span className="divider-badge">VS</span>
          <span className="divider-line" />
        </div>

        <section className="compare-col" style={{ '--accent': rightColor }}>
          <div className="col-heading">
            <span className="lang-badge" style={{ background: rightColor }}>{rightLabel}</span>
          </div>
          <p className="col-definition">{topic.java.definition}</p>
          <CodeBlock
            code={topic.java.code}
            language={rightLabel}
            onRunInPlayground={(code) => onRunInPlayground(code, rightLabel)}
          />
        </section>
      </div>

      {topic.resources && topic.resources.length > 0 && (
        <footer className="topic-resources">
          <strong>📚 Learn more:</strong>
          {topic.resources.map((r, i) => (
            <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
              {r.label} ↗
            </a>
          ))}
        </footer>
      )}
    </article>
  );
}

export default ComparisonView;
