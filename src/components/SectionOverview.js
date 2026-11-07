import React from 'react';

function SectionOverview({ section, onOpenTopic, onBack }) {
  return (
    <div className="home-view">
      <button className="back-btn" onClick={onBack}>← All sections</button>
      <div className="home-hero">
        <h2>{section.section.title}</h2>
        <p>{section.section.subtitle}</p>
      </div>
      <div className="topic-grid">
        {section.topics.map((t) => (
          <button key={t.id} className="topic-card" onClick={() => onOpenTopic(section.section.id, t.id)}>
            <h4>{t.title}</h4>
            <p>{t.learn}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SectionOverview;
