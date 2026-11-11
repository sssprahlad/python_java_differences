import React, { useEffect } from 'react';

function Home({ sections, onOpenSection, onOpenTopic,selectedSection,setSelectedSection }) {


  // if(selectedSection !== null){
  //     sections?.map((section) => {
  //       if(section.id === selectedSection) {
  //         setSelectedSection(section);
  //       }
  //     });
  
  // }

  useEffect(() => {
  if (selectedSection !== null) {
    const selected = sections?.find(
      (section) => section.id === selectedSection
    );

    setSelectedSection(selected || null);
  }
}, [selectedSection, sections]);


  return (
    <div className="home-view">
      <div className="home-hero">
        <h2>Master Python &amp; Java — Side by Side</h2>
        <p>
          Every topic below compares <strong>Python</strong> and <strong>Java</strong> with simple
          definitions and copy-paste code. Then dive into <strong>Django vs Spring Boot</strong>
          for backend development. Search any topic, switch themes, and practise code in the
          built-in playground.
        </p>
      </div>

      <div className="section-cards">
        {sections.map(({ section, topics }) => (
          <div className="section-card" key={section.id}>
            <div className="section-card-header" style={{ background: `linear-gradient(135deg, ${section.id === 'django-spring' ? '#0c4b33' : section.id === 'database' ? '#4a3f8f' : '#1f4e79'}, #16202e)` }}>
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
