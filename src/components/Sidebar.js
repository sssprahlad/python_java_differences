import React from 'react';

function topicHaystack(section, topic) {
  let text = `${topic.title} ${topic.learn}`.toLowerCase();
  (section.columns || []).forEach((col) => {
    const c = topic[col.key];
    if (c) text += ` ${col.label} ${c.definition} ${c.code}`.toLowerCase();
  });
  return text;
}

function Sidebar({ sections, query, activeSectionId, activeTopicId, onSelectTopic, onSelectSection }) {
  const q = query.trim().toLowerCase();

  return (
    <nav className="sidebar">
      {sections.map((section) => {
        const filteredTopics = q
          ? section.topics.filter((t) => topicHaystack(section, t).includes(q))
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
      {q && sections.every((s) => s.topics.every((t) => !topicHaystack(s, t).includes(q))) && (
        <p className="no-results">No topics match “{query}”.</p>
      )}
    </nav>
  );
}

export default Sidebar;
