import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ComparisonView from './components/ComparisonView';
import Playground from './components/Playground';
import Home from './components/Home';
import SectionOverview from './components/SectionOverview';
import './styles/main.css';

import basicsData from './data/basics.json';
import advancedData from './data/advanced.json';
import databaseData from './data/database.json';
import djangoSpringData from './data/django-spring.json';
import javaCoreA from './data/java-core-a.json';
import javaCoreB from './data/java-core-b.json';
import springAnnotations from './data/spring-annotations.json';

const SECTIONS = [basicsData, advancedData, databaseData, djangoSpringData, javaCoreA, javaCoreB, springAnnotations];

function App() {
  const [theme, setTheme] = useState('dark');
  const [query, setQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [playground, setPlayground] = useState(null); // { section, code, lang }

  const activeSection = useMemo(
    () => SECTIONS.find((s) => s.section.id === activeSectionId) || null,
    [activeSectionId]
  );

  const activeTopic = useMemo(() => {
    if (!activeSection || !activeTopicId) return null;
    return activeSection.topics.find((t) => t.id === activeTopicId) || null;
  }, [activeSection, activeTopicId]);

  const openTopic = (sectionId, topicId) => {
    setActiveSectionId(sectionId);
    setActiveTopicId(topicId);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openSection = (sectionId) => {
    setActiveSectionId(sectionId);
    setActiveTopicId(null);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPlayground = (code, langLabel) => {
    setPlayground({ section: activeSection, code, lang: langLabel });
  };

  return (
    <div className="app" data-theme={theme}>
      <Header
        query={query}
        onQueryChange={setQuery}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div className="app-body">
        <Sidebar
          sections={SECTIONS}
          query={query}
          activeSectionId={activeSectionId}
          activeTopicId={activeTopicId}
          onSelectTopic={openTopic}
          onSelectSection={openSection}
        />

        <main className="main-content">
          {activeTopic && activeSection ? (
            <ComparisonView
              topic={activeTopic}
              leftLabel={activeSection.leftLabel}
              rightLabel={activeSection.rightLabel}
              leftColor={activeSection.leftColor}
              rightColor={activeSection.rightColor}
              onRunInPlayground={openPlayground}
            />
          ) : activeSection ? (
            <SectionOverview
              section={activeSection}
              onOpenTopic={openTopic}
              onBack={() => { setActiveSectionId(null); setActiveTopicId(null); }}
            />
          ) : (
            <Home sections={SECTIONS} onOpenSection={openSection} onOpenTopic={openTopic} />
          )}
        </main>
      </div>

      {playground && (
        <Playground
          section={playground.section}
          initialCode={playground.code}
          initialLang={playground.lang}
          onClose={() => setPlayground(null)}
        />
      )}
    </div>
  );
}

export default App;
