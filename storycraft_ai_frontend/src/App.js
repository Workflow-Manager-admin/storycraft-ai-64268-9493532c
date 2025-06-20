import React from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol">*</span> StoryCraft AI
            </div>
            <button className="btn" tabIndex={0}>Menu</button>
          </div>
        </div>
      </nav>
      <main>
        <div className="main-container">
          {/* Section 1: Story Input & Theme */}
          <section className="section section-story">
            <h2 className="section-title">Story Input & Theme</h2>
            <div className="section-content">
              <input
                className="input-title"
                type="text"
                placeholder="Enter your story title..."
                disabled
              />
              <textarea
                className="input-body"
                placeholder="Describe your story idea here..."
                disabled
              />
              <button className="btn accent" disabled>Generate Random Theme</button>
            </div>
          </section>
          {/* Section 2: Character Visuals */}
          <section className="section section-characters">
            <h2 className="section-title">Character Visuals</h2>
            <div className="section-content character-placeholders">
              <div className="character-avatar-placeholder">[Avatar 1]</div>
              <div className="character-avatar-placeholder">[Avatar 2]</div>
              <div className="character-avatar-placeholder">[Avatar 3]</div>
            </div>
            <button className="btn secondary" disabled>Auto-Generate Characters</button>
          </section>
          {/* Section 3: Scene/Comic Images */}
          <section className="section section-scenes">
            <h2 className="section-title">Scene / Comic Images</h2>
            <div className="section-content scene-placeholder">
              <div className="comic-image-placeholder">[Scene Image 1]</div>
              <div className="comic-image-placeholder">[Scene Image 2]</div>
              <div className="comic-image-placeholder">[Scene Image 3]</div>
            </div>
            <button className="btn primary" disabled>Generate Scene Images</button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;