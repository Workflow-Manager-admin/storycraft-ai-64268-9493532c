import React, { useState, useCallback } from 'react';
import './App.css';

/**
 * Get a Dicebear avatar URL using the 'adventurer' sprite for randomness.
 * Uses a random seed on each call.
 */
function getRandomDicebearUrl() {
  // We'll use Math.random + Date.now for a unique-ish seed on every re-generation
  const seed = `${Math.floor(Math.random() * 1000000)}_${Date.now()}`;
  // Example using 'adventurer' sprite set, feel free to swap to other sets
  // https://api.dicebear.com/7.x/adventurer/svg?seed=SEED
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
}

// PUBLIC_INTERFACE
function App() {
  // State to hold avatar src
  const [avatarUrl, setAvatarUrl] = useState(() => getRandomDicebearUrl());

  // Handler to regenerate avatar image
  const handleRegenerate = useCallback(() => {
    setAvatarUrl(getRandomDicebearUrl());
  }, []);

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
            <div className="section-content character-placeholders" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="character-avatar-placeholder" style={{
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--secondary) 60%, var(--primary) 100%)',
                border: '2.5px solid #fff',
                width: 90,
                height: 90
              }}>
                {/* Avatar */}
                <img
                  src={avatarUrl}
                  alt="Character Avatar"
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: '50%',
                    background: '#fff'
                  }}
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <button className="btn secondary" style={{marginTop: 18}} onClick={handleRegenerate}>Regenerate Avatar</button>
            </div>
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