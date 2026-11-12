import React from 'react';
import CodeBlock from './CodeBlock';

function ComparisonView({ topic, onRunInPlayground, section, onBack, selectedSection }) {
  const columns = section.columns || [];
  const backTitle = selectedSection?.title || section.section?.title || 'section';

  return (
    <article className="comparison-view">
      <header className="topic-header">
        <h2>{topic.title}</h2>
        <p className="topic-learn">🎯 {topic.learn}</p>
        <button
          className="back-btn"
          style={{ marginTop: '1rem' }}
          onClick={onBack}
        >
          ← Back to <strong>{backTitle}</strong>
        </button>
      </header>

      <div className="compare-columns">
        {columns.map((col, i) => {
          const content = topic[col.key];
          if (!content) return null;
          return (
            <React.Fragment key={col.key}>
              {i > 0 && (
                <div className="compare-divider" aria-hidden="true">
                  <span className="divider-line" />
                  <span className="divider-badge">VS</span>
                  <span className="divider-line" />
                </div>
              )}
              <section className="compare-col" style={{ '--accent': col.color }}>
                <div className="col-heading">
                  <span className="lang-badge" style={{ background: col.color }}>{col.label}</span>
                </div>
                <p className="col-definition">{content.definition}</p>
                <CodeBlock
                  code={content.code}
                  language={col.label}
                  onRunInPlayground={(code) => onRunInPlayground(code, col.label)}
                />
              </section>
            </React.Fragment>
          );
        })}
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
