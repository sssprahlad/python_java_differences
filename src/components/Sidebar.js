import React from 'react';

function Sidebar({ sections, query, activeSectionId, activeTopicId, onSelectTopic, onSelectSection }) {
  const q = query.trim().toLowerCase();

  return (
    <nav className="sidebar">
      {sections.map((section) => {
        const filteredTopics = q
          ? section.topics.filter(
              (t) =>
                t.title.toLowerCase().includes(q) ||
                t.learn.toLowerCase().includes(q) ||
                (t.python.definition + t.python.code).toLowerCase().includes(q) ||
                (t.java.definition + t.java.code).toLowerCase().includes(q)
            )
          : section.topics;

        if (q && filteredTopics.length === 0) return null;

        return (
          <div className="sidebar-section" key={section.section.id}>
            <button
              className={`sidebar-section-title ${activeSectionId === section.section.id && !activeTopicId ? 'active' : ''}`}
              onClick={() => onSelectSection(section.section.id)}
            >
              {section.section.title}
              <span className="topic-count">{filteredTopics.length}</span>
            </button>
            <ul className="sidebar-topics">
              {filteredTopics.map((topic) => (
                <li key={topic.id}>
                  <button
                    className={`sidebar-topic ${activeTopicId === topic.id ? 'active' : ''}`}
                    onClick={() => onSelectTopic(section.section.id, topic.id)}
                  >
                    {topic.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {q && sections.every((s) => s.topics.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.learn.toLowerCase().includes(q) ||
        (t.python.definition + t.python.code).toLowerCase().includes(q) ||
        (t.java.definition + t.java.code).toLowerCase().includes(q)
      ).length === 0) && <p className="no-results">No topics match “{query}”.</p>}
    </nav>
  );
}

export default Sidebar;
