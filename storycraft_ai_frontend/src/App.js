import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

// Placeholder pages for each feature
function ShortStories() {
  // PUBLIC_INTERFACE
  return (
    <div className="container" style={{marginTop: 100, minHeight: '50vh'}}>
      <h2>Short Stories</h2>
      <p>This is the Short Stories feature page. Start creating your story soon!</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function PlotTwistGenerator() {
  return (
    <div className="container" style={{marginTop: 100, minHeight: '50vh'}}>
      <h2>Plot Twist Generator</h2>
      <p>Surprise elements will appear here! Placeholder for Plot Twist Generator.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function StorytoneSelector() {
  return (
    <div className="container" style={{marginTop: 100, minHeight: '50vh'}}>
      <h2>Storytone Selector</h2>
      <p>Set your narrative style and tone here. Placeholder for Storytone Selector.</p>
    </div>
  );
}

// PUBLIC_INTERFACE
function CharacterCreator() {
  return (
    <div className="container" style={{marginTop: 100, minHeight: '50vh'}}>
      <h2>Character Creator</h2>
      <p>Design and generate characters here. Placeholder for Character Creator.</p>
    </div>
  );
}

// Navigation bar with React Router links
function NavigationBar() {
  // PUBLIC_INTERFACE
  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <span className="logo-symbol">*</span> StoryCraft AI
          </Link>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link className="btn" to="/short-stories" tabIndex={0}>Short Stories</Link>
            <Link className="btn" to="/plot-twist" tabIndex={0}>Plot Twist Generator</Link>
            <Link className="btn" to="/storytone" tabIndex={0}>Storytone Selector</Link>
            <Link className="btn" to="/character-creator" tabIndex={0}>Character Creator</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

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

/**
 * Fetch a random comic/scene image from Pixabay or Unsplash.
 * Preference: Pixabay (no key). Unsplash is fallback.
 * Uses images with 'comic,scene,cartoon,adventure' keywords for "comic-style".
 */
// PUBLIC_INTERFACE
function useSceneImage() {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // Tries fetching from Pixabay with no key, falls back to Unsplash
  const fetchImage = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    let got = false;

    // Pixabay (try, non-auth)
    try {
      const q = encodeURIComponent('comic scene cartoon adventure');
      const resp = await fetch(
        `https://pixabay.com/api/?key=31248734-3b322047d3e24e6067d41fae5&q=${q}&image_type=photo,illustration&orientation=horizontal&safesearch=true&per_page=50`
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data?.hits?.length > 0) {
          // Pick random image
          const img = data.hits[Math.floor(Math.random() * data.hits.length)];
          setImgUrl(img.webformatURL || img.previewURL);
          got = true;
        }
      }
    } catch {
      // continue to fallback
    }

    // Unsplash fallback (only if Pixabay failed)
    if (!got) {
      try {
        const keywords = "comic,adventure,cartoon,scene";
        const seed = Date.now() + "_" + Math.floor(Math.random() * 99999);
        const url = `https://source.unsplash.com/480x525/?${keywords}&sig=${seed}`;
        setImgUrl(url);
      } catch {
        setFetchError(true);
      }
    }
    setLoading(false);
  }, []);

  // load on mount
  React.useEffect(() => { fetchImage(); }, [fetchImage]);

  return { imgUrl, loading, fetchError, fetchImage };
}

// PUBLIC_INTERFACE
function useStoryTheme() {
  /**
   * React hook to fetch a random story theme using BoredAPI.
   * Returns { theme, loading, error, regenerate }
   */
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // Fetches a new random theme from BoredAPI
  const fetchTheme = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('https://www.boredapi.com/api/activity?type=recreational');
      if (!resp.ok) throw new Error('API unavailable');
      const data = await resp.json();
      let idea = data.activity;
      // Remove "Learn to", "Try", or "Go" or verbs for a more theme-like prompt
      idea = idea.replace(/^(Learn to|Try|Go|Learn|Do)\s+/i, '');
      setTheme(idea);
    } catch (e) {
      setError('Unable to generate theme. Please try again.');
      setTheme('');
    }
    setLoading(false);
  }, []);

  // Load on mount
  useEffect(() => { fetchTheme(); }, [fetchTheme]);
  return { theme, loading, error, regenerate: fetchTheme };
}

// PUBLIC_INTERFACE
function App() {
  // State to hold avatar src
  const [avatarUrl, setAvatarUrl] = useState(() => getRandomDicebearUrl());
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Handler to regenerate avatar image with feedback
  const handleRegenerate = useCallback(() => {
    setAvatarLoading(true);
    // Pre-load the new image (for live transition/feedback)
    const newUrl = getRandomDicebearUrl();
    const img = new window.Image();
    img.src = newUrl;
    img.onload = () => {
      setAvatarUrl(newUrl);
      setAvatarLoading(false);
    };
    img.onerror = () => {
      // fallback: update anyway after 1s timeout for broken avatar fetch (rare)
      setTimeout(() => {
        setAvatarUrl(newUrl);
        setAvatarLoading(false);
      }, 1000);
    };
  }, []);

  // Scene/Comic Images state/hooks
  const {
    imgUrl: sceneImageUrl,
    loading: sceneLoading,
    fetchError: sceneError,
    fetchImage: refreshSceneImage,
  } = useSceneImage();

  // Story theme state/hook
  const {
    theme: storyTheme,
    loading: themeLoading,
    error: themeError,
    regenerate: regenerateTheme,
  } = useStoryTheme();

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

      {/* Hero section: Headline + intro paragraph */}
      <section
        className="container"
        style={{
          marginTop: 88,
          marginBottom: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          alignItems: 'start',
          maxWidth: 890,
        }}
        aria-label="Homepage Introduction"
      >
        <header style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          {/* Headline */}
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--primary)',
              margin: 0,
              lineHeight: 1.11,
              letterSpacing: '-1px',
              textShadow: '0 2px 16px #e0edff45',
              textWrap: 'balance',
              background: 'linear-gradient(92deg, var(--primary) 60%, var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            tabIndex={0}
          >
            Unleash Your Imagination with StoryBot!
          </h1>
          {/* Intro paragraph */}
          <p
            style={{
              fontSize: '1.32rem',
              margin: '16px 0 0 0',
              fontWeight: 450,
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              maxWidth: 650,
              letterSpacing: '-0.12px'
            }}
            tabIndex={0}
          >
            Create short stories, design vibrant characters, and generate comic-style scenes using the power of AI. StoryBot gives you prompts, avatars, and art generation to bring your stories to life – instantly.
          </p>
        </header>
      </section>

      {/* Key Features Section */}
      <section
        className="container"
        style={{
          marginTop: 0,
          marginBottom: 46,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          alignItems: 'flex-start',
          maxWidth: 890,
        }}
        aria-label="Key Features"
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--secondary)',
            letterSpacing: '-0.8px',
            margin: 0,
            marginBottom: 10
          }}
          tabIndex={0}
        >
          Key Features
        </h2>
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 25,
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          {/* Feature 1 */}
          <div
            style={{
              background: 'linear-gradient(90deg, #fff, #fffaf5 88%, #fff4e4 100%)',
              border: '1.4px solid var(--border-color)',
              borderRadius: 14,
              boxShadow: '0 2px 10px rgba(245,166,35,0.07)',
              minWidth: 198,
              flex: '1 1 210px',
              maxWidth: 255,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              padding: '20px 18px 18px 18px',
              transition: 'box-shadow 0.18s, border-color 0.17s',
            }}
            tabIndex={0}
            aria-label="Short Stories feature"
          >
            <span style={{ fontSize: '2.06rem', marginBottom: 7, color: 'var(--accent)' }} role="img" aria-label="Short Stories">📚</span>
            <span style={{ fontWeight: 600, fontSize: '1.16rem', color: 'var(--accent)' }}>Short Stories</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.03rem' }}>
              Instantly craft creative short stories with AI-generated prompts and inspiration.
            </span>
          </div>
          {/* Feature 2 */}
          <div
            style={{
              background: 'linear-gradient(90deg, #f9fdff 80%, #e8fcfb 100%)',
              border: '1.4px solid var(--border-color)',
              borderRadius: 14,
              boxShadow: '0 2px 10px rgba(80,227,194,0.07)',
              minWidth: 198,
              flex: '1 1 210px',
              maxWidth: 255,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              padding: '20px 18px 18px 18px',
              transition: 'box-shadow 0.18s, border-color 0.17s',
            }}
            tabIndex={0}
            aria-label="Plot Twist Generator feature"
          >
            <span style={{ fontSize: '2.06rem', marginBottom: 7, color: 'var(--secondary)' }} role="img" aria-label="Plot Twist Generator">🔀</span>
            <span style={{ fontWeight: 600, fontSize: '1.16rem', color: 'var(--secondary)' }}>Plot Twist Generator</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.03rem' }}>
              Instantly surprise your stories with AI-driven unpredictable plot twists.
            </span>
          </div>
          {/* Feature 3 */}
          <div
            style={{
              background: 'linear-gradient(90deg, #f6fbff 80%, #e0ecfb 100%)',
              border: '1.4px solid var(--border-color)',
              borderRadius: 14,
              boxShadow: '0 2px 10px rgba(74,144,226,0.07)',
              minWidth: 198,
              flex: '1 1 210px',
              maxWidth: 255,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              padding: '20px 18px 18px 18px',
              transition: 'box-shadow 0.18s, border-color 0.17s',
            }}
            tabIndex={0}
            aria-label="Storytone Selector feature"
          >
            <span style={{ fontSize: '2.06rem', marginBottom: 7, color: 'var(--primary)' }} role="img" aria-label="Storytone Selector">🎨</span>
            <span style={{ fontWeight: 600, fontSize: '1.16rem', color: 'var(--primary)' }}>Storytone Selector</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.03rem' }}>
              Choose your story’s mood—funny, spooky, dramatic, or mysterious—with a simple click.
            </span>
          </div>
          {/* Feature 4 */}
          <div
            style={{
              background: 'linear-gradient(90deg, #fff, #f8fffc 90%, #e3fbee 100%)',
              border: '1.4px solid var(--border-color)',
              borderRadius: 14,
              boxShadow: '0 2px 10px rgba(80,227,194,0.08)',
              minWidth: 198,
              flex: '1 1 210px',
              maxWidth: 255,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              padding: '20px 18px 18px 18px',
              transition: 'box-shadow 0.18s, border-color 0.17s',
            }}
            tabIndex={0}
            aria-label="Character Creator feature"
          >
            <span style={{ fontSize: '2.06rem', marginBottom: 7, color: 'var(--secondary)' }} role="img" aria-label="Character Creator">🧑‍🎤</span>
            <span style={{ fontWeight: 600, fontSize: '1.16rem', color: 'var(--secondary)' }}>Character Creator</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.03rem' }}>
              Instantly generate unique character visuals and personalities using avatars and AI.
            </span>
          </div>
        </div>
      </section>

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
                aria-disabled="true"
              />
              <textarea
                className="input-body"
                placeholder="Describe your story idea here..."
                disabled
                aria-disabled="true"
              />
              {/* Story Theme Display + Regenerate Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 8 }}>
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#f5faff',
                    border: '1.5px solid var(--border-color)',
                    borderRadius: 7,
                    fontSize: '1rem',
                    color: 'var(--primary)',
                    minHeight: 28,
                    fontWeight: 500,
                    letterSpacing: '-0.2px',
                    transition: 'opacity 0.17s',
                    opacity: themeLoading ? 0.68 : 1.0,
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                  }}
                  aria-live="polite"
                  aria-busy={themeLoading ? "true" : "false"}
                  tabIndex={0}
                >
                  {themeLoading && (
                    <>
                      <span className="spinner" style={{
                        marginRight: 8, width: 14, height: 14, border: "2px solid #ddd", borderTop: "2px solid var(--accent)",
                        borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite",
                      }}></span>
                      Generating story theme...
                    </>
                  )}
                  {!themeLoading && storyTheme && <span>🎯 {storyTheme}</span>}
                  {!themeLoading && themeError && (
                    <span style={{ color: '#da2828', fontWeight: 500 }}>
                      {themeError}
                    </span>
                  )}
                </div>
                <button
                  className="btn accent"
                  onClick={regenerateTheme}
                  disabled={themeLoading}
                  aria-busy={themeLoading ? "true" : undefined}
                  aria-label="Regenerate story theme"
                  style={{
                    minWidth: 170,
                    marginTop: 2,
                    alignSelf: 'flex-start'
                  }}
                >
                  {themeLoading ? (
                    <>
                      <span className="spinner" style={{
                        marginRight: 6, width: 13, height: 13, border: "2px solid #fff", borderTop: "2px solid var(--primary)",
                        borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite",
                        verticalAlign: 'middle'
                      }} />
                      Regenerating...
                    </>
                  ) : "Regenerate Story Theme"}
                </button>
              </div>
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
                height: 90,
                position: 'relative'
              }}>
                {/* Avatar */}
                {avatarLoading ? (
                  <span className="spinner" style={{
                    width: 38, height: 38,
                    border: "3px solid #eee", borderTop: "3px solid var(--secondary)",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 1s linear infinite"
                  }} aria-label="Loading avatar" />
                ) : (
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
                )}
              </div>
              <button
                className="btn secondary"
                style={{ marginTop: 18, minWidth: 170 }}
                onClick={handleRegenerate}
                disabled={avatarLoading}
                aria-busy={avatarLoading ? "true" : undefined}
                aria-label="Regenerate character avatar"
              >
                {avatarLoading ? (
                  <>
                    <span className="spinner" style={{
                      marginRight: 6, width: 13, height: 13, border: "2px solid #fff", borderTop: "2px solid var(--secondary)",
                      borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite",
                      verticalAlign: 'middle'
                    }} />
                    Regenerating...
                  </>
                ) : "Regenerate Avatar"}
              </button>
            </div>
          </section>
          {/* Section 3: Scene/Comic Images */}
          <section className="section section-scenes">
            <h2 className="section-title">Scene / Comic Images</h2>
            <div className="section-content scene-placeholder" style={{ minHeight: 100 }}>
              {sceneLoading && (
                <div className="comic-image-placeholder" aria-busy="true" aria-label="Loading scene">
                  <span className="spinner" style={{
                    marginRight: 7, width: 15, height: 15,
                    border: "2px solid #eee", borderTop: "2px solid var(--primary)",
                    borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite"
                  }} />
                  Loading...
                </div>
              )}
              {!sceneLoading && sceneImageUrl && (
                <div
                  className="comic-image-placeholder"
                  style={{
                    padding: 0,
                    borderRadius: 12,
                    minWidth: 85,
                    minHeight: 93,
                    aspectRatio: '0.9',
                    background: '#f0f6fc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1.5px 8px rgba(34,123,218,0.09)',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={sceneImageUrl}
                    alt="Scene Comic"
                    style={{
                      width: 84,
                      minHeight: 92,
                      objectFit: 'cover',
                      borderRadius: 10,
                      display: 'block'
                    }}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              )}
              {!sceneLoading && sceneError && (
                <div className="comic-image-placeholder"
                  aria-label="Error loading scene"
                  style={{ color: '#da2828', fontWeight: 700, fontSize: '1rem' }}>
                  Error loading image
                </div>
              )}
            </div>
            <button
              className="btn primary"
              onClick={refreshSceneImage}
              style={{
                marginTop: 15,
                alignSelf: 'flex-start',
                minWidth: 140
              }}
              disabled={sceneLoading}
              aria-busy={sceneLoading ? "true" : undefined}
              aria-label="Regenerate comic scene"
            >
              {sceneLoading ? (
                <>
                  <span className="spinner" style={{
                    marginRight: 6, width: 13, height: 13,
                    border: "2px solid #fff", borderTop: "2px solid var(--primary)",
                    borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite",
                    verticalAlign: 'middle'
                  }} />
                  Regenerating...
                </>
              ) : "Regenerate Scene"}
            </button>
          </section>
        </div>
      </main>
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        `}
      </style>
    </div>
  );
}

export default App;