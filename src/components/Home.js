import React from 'react';

function Home({ sections, onOpenSection, onOpenTopic,selectedSection,setSelectedSection }) {

  return (
    <div className="home-view">
      <div className="home-hero">
        <h2>Master Multiple Languages — Side by Side</h2>
        <p>
          Every topic below compares languages and frameworks head-to-head —
          <strong> Python vs Java</strong>, <strong>Node.js vs Django vs Spring Boot</strong>,
          <strong> React vs Angular vs Next.js vs TypeScript</strong>, <strong>CSS vs Tailwind</strong>,
          key-value stores and databases. Search any topic, switch themes, and practise
          code in the built-in playground.
        </p>
      </div>

      <div className="section-cards">
        {sections.map(({ section, topics }) => (
          <div className="section-card" key={section.id}>
            <div className="section-card-header" style={{ background: `linear-gradient(135deg, ${section.color || (section.id === 'django-spring' ? '#0c4b33' : section.id === 'database' ? '#4a3f8f' : '#1f4e79')}, #16202e)` }}>
              <h3>{section.title}</h3>
              <p>{section.subtitle}</p>
            </div>
            <div className="section-card-body">
              <span className="topic-total">{topics.length} topics</span>
              <div className="topic-chips">
                {topics.slice(0, 8).map((t) => (
                  <button key={t.id} className="topic-chip" onClick={() => { setSelectedSection(section); onOpenTopic(section.id, t.id) }}>
                    {t.title}
                  </button>
                ))}
                {topics.length > 8 && <span className="topic-chip more">+{topics.length - 8} more</span>}
              </div>
              <button className="section-open" onClick={() => { onOpenSection(section.id); setSelectedSection(section) }}>
                Browse all topics →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
