import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

////////////////////////////////////////////////////////////////////////////////
/**
 * PUBLIC_INTERFACE
 * Feature: Short Stories Page
 * Adds interactive UX for user prompt, word count, generation, display and regeneration.
 */
function ShortStories() {
  const WORD_COUNT_PRESETS = [
    { label: "Short", value: 50 },
    { label: "Medium", value: 120 },
    { label: "Long", value: 250 }
  ];

  // --- STATE ---
  const [prompt, setPrompt] = React.useState("");
  const [wordCount, setWordCount] = React.useState(WORD_COUNT_PRESETS[0].value);
  const [status, setStatus] = React.useState("idle"); // 'idle'|'loading'|'success'|'error'
  const [story, setStory] = React.useState("");
  const [error, setError] = React.useState(null);

  // For accessibility/demo: Pre-filled sample
  const EXAMPLE_PROMPT = 'A mouse discovers a magical doorway in an old teapot.';

  // --- MOCKED AI GENERATION LOGIC ---
  // In production, you would call a real AI API here.
  function generateFakeStory(promptText, count) {
    // We'll just "simulate" a story from the prompt and word count
    const sentences = [
      "Once upon a time, ",
      "In a land not so far away, ",
      "Deep in a cozy kitchen, ",
      "Unexpectedly, ",
      "With a heart full of curiosity, "
    ];
    let words = promptText
      ? [sentences[Math.floor(Math.random() * sentences.length)] + promptText]
      : ["Once upon a time, something magical happened."];
    // Generate text of approximate length:
    while (words.join(" ").split(" ").length < count) {
      words.push(
        [
          "The adventure grew more curious by the moment.",
          "A twist of fate opened doors to new worlds.",
          "Magic sparkled in every shadow.",
          "What started as an ordinary day soon changed everything.",
        ][Math.floor(Math.random() * 4)]
      );
    }
    // Trim and return (simulate a real story)
    return words.join(" ").split(" ").slice(0, count).join(" ") + ".";
  }

  // --- HANDLERS ---
  const handleChangePrompt = e => setPrompt(e.target.value);

  const handleChangeWordCount = val => setWordCount(val);

  const handleUseExample = () => setPrompt(EXAMPLE_PROMPT);

  // Main AI story generation handler
  const handleGenerate = async () => {
    setStatus("loading");
    setStory("");
    setError(null);
    // Simulate async API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 600));
      // Simulate random error, 5% chance
      if (Math.random() < 0.05) throw new Error("AI model busy. Try again!");
      const storyText = generateFakeStory(prompt, wordCount);
      setStory(storyText);
      setStatus("success");
    } catch (e) {
      setStatus("error");
      setError(e.message || "Failed to generate story.");
      setStory("");
    }
  };

  // For regeneration: run again with same prompt/wordCount
  const handleRegenerate = () => handleGenerate();

  // Keyboard accessibility: Enter triggers generation in prompt box
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey && status !== "loading") {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div
      className="container"
      style={{
        marginTop: 110,
        marginBottom: 32,
        minHeight: "62vh",
        maxWidth: 620,
        background: "linear-gradient(90deg, #fff, #fff8ef 75%, #ffe6c5 100%)",
        borderRadius: "13px",
        boxShadow: "0 4px 23px rgba(245,166,35,0.09)",
        border: "1.2px solid #fae1bb",
        padding: "2.5em 2.3em 2.5em 2.3em",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: 18
      }}
      aria-label="Short Stories"
    >
      <span style={{ fontSize: "2.1rem", color: "var(--accent)" }} role="img" aria-label="Books">📚</span>
      <h1
        className="section-title"
        style={{
          color: "var(--accent)",
          fontWeight: 800,
          fontSize: "2.1rem",
          margin: "0 0 10px 0"
        }}
      >
        Create Your Short Story
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1.07rem", margin: 0 }}>
        Spark your creativity in seconds! With StoryBot, you can quickly write delightful tales across any genre or style. Pick a prompt, set your word count, and click to begin.
      </p>
      <div style={{ margin: "13px 0", width: "100%" }}>
        <div style={{ fontWeight: 600, color: "var(--primary)", marginBottom: 5 }}>Try This Prompt:</div>
        <div
          style={{
            background: "#fff4eb",
            border: "1.3px solid #ffd3ab",
            borderRadius: 7,
            fontWeight: 500,
            padding: "12px 16px",
            fontSize: "1rem",
            color: "var(--accent)",
            marginBottom: 6,
            maxWidth: 410,
            cursor: "pointer",
            userSelect: "none"
          }}
          onClick={handleUseExample}
          tabIndex={0}
          role="button"
          aria-label="Use example story prompt"
          onKeyDown={e => { if (e.key === " " || e.key === "Enter") handleUseExample(); }}
        >
          "{EXAMPLE_PROMPT}"
          <span style={{
            marginLeft: 8,
            fontSize: "0.99em",
            opacity: 0.71,
            color: "var(--primary)",
            fontWeight: 400
          }}>
            (Click to use)
          </span>
        </div>
      </div>
      <div style={{ width: "100%" }}>
        <label htmlFor="story-prompt-field" style={{
          fontWeight: 600, color: "var(--primary)", fontSize: "1.06rem", marginRight: 7, paddingBottom: 2, display: "block"
        }}>
          Your Story Prompt:
        </label>
        <textarea
          id="story-prompt-field"
          className="input-body"
          placeholder="Describe your story idea (or click the sample above)..."
          style={{ width: "100%", marginBottom: 10, background: "#f7fbff" }}
          value={prompt}
          onChange={handleChangePrompt}
          rows={3}
          maxLength={228}
          aria-label="Story idea prompt"
          disabled={status === "loading"}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div>
        <span style={{ fontWeight: 600, color: "var(--primary)", marginRight: 11 }}>
          Pick word count:
        </span>
        {WORD_COUNT_PRESETS.map(opt => (
          <button
            className="btn"
            style={{
              marginRight: 10,
              background: wordCount === opt.value ? "var(--accent)" : "var(--surface)",
              color: wordCount === opt.value ? "#fff" : "var(--accent)",
              border: "1px solid var(--accent)",
              fontWeight: 600,
              fontSize: "0.98rem",
              padding: "6px 20px",
              minWidth: 0,
              outline: wordCount === opt.value ? "2.5px solid var(--accent)" : undefined,
              boxShadow: wordCount === opt.value ? "0 2px 11px #f5a62314" : undefined
            }}
            key={opt.value}
            tabIndex={0}
            onClick={() => handleChangeWordCount(opt.value)}
            aria-pressed={wordCount === opt.value}
            disabled={status === "loading"}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        className="btn accent"
        style={{
          marginTop: 20,
          minWidth: 185,
          fontSize: "1.15rem",
        }}
        tabIndex={0}
        aria-label="Start Writing a Story"
        onClick={handleGenerate}
        disabled={!prompt.trim() || status === "loading"}
      >
        {status === 'loading' ? (
          <>
            <span className="spinner" style={{
              marginRight: 8,
              width: 15, height: 15,
              border: "2.2px solid #fff", borderTop: "2.2px solid var(--primary)",
              borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite"
            }} />
            Generating...
          </>
        ) : "Generate Story"}
      </button>
      {/* Story/Results/Errors */}
      {(status === "success" || status === "error" || status === "loading") && (
        <div
          style={{
            marginTop: 24,
            width: "100%",
            background: "#fffbee",
            border: "1.5px solid #ffd889",
            borderRadius: 8,
            padding: "25px 19px 22px 19px",
            minHeight: 75,
            fontSize: "1.1rem",
            color: "var(--text-color)",
            boxShadow: "0 2px 12px #f5a62310",
            position: "relative"
          }}
          aria-live="polite"
          tabIndex={0}
        >
          {status === "loading" && (
            <div>
              <span className="spinner" style={{
                marginRight: 9,
                width: 17, height: 17,
                border: "2.2px solid #eee", borderTop: "2.2px solid var(--accent)",
                borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite"
              }} />
              StoryBot is writing your story...
            </div>
          )}
          {status === "error" && (
            <div style={{ color: "#db2525", fontWeight: 700 }}>
              <span role="img" aria-label="Error" style={{marginRight: 8}}>❌</span>
              {error || "An error occurred."}
              <button
                className="btn"
                style={{
                  marginLeft: 18,
                  fontWeight: 600,
                  fontSize: "0.98rem", background: "#fff6f6", color: "#db2525", border: "1.3px solid #db2525" }}
                onClick={handleRegenerate}
                disabled={status === "loading"}
                tabIndex={0}
              >
                Try Again
              </button>
            </div>
          )}
          {status === "success" && (
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.09rem", color: "var(--accent)", letterSpacing: "-0.02em", marginBottom: 5 }}>
                Your Story
              </div>
              <div style={{ fontSize: "1.18rem", color: "#46361c", marginBottom: 9, whiteSpace: "pre-line" }}>
                {story}
              </div>
              <button
                className="btn"
                style={{
                  fontWeight: 600, fontSize: "0.97rem",
                  background: "#ffe5b7", color: "var(--accent)",
                  border: "1.3px solid #ffd395"
                }}
                onClick={handleRegenerate}
                tabIndex={0}
                aria-label="Regenerate this story"
                disabled={status === "loading"}
              >
                Regenerate Story
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
// Feature: Plot Twist Generator Page
function PlotTwistGenerator() {
  const sampleTwists = [
    "The villain is actually the protagonist’s best friend.",
    "What seemed like magic was only advanced technology.",
    "The real treasure was the journey, not the prize.",
  ];
  return (
    <div
      className="container"
      style={{
        marginTop: 110,
        marginBottom: 32,
        minHeight: '62vh',
        maxWidth: 620,
        background: 'linear-gradient(95deg, #f9fdff 78%, #e4fffb 100%)',
        borderRadius: '13px',
        boxShadow: '0 4px 23px rgba(80,227,194,0.10)',
        border: '1.2px solid #caf7ee',
        padding: '2.5em 2.3em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 18
      }}
      aria-label="Plot Twist Generator"
    >
      <span style={{ fontSize: '2.1rem', color: 'var(--secondary)' }} role="img" aria-label="Twist symbol">🔀</span>
      <h1
        className="section-title"
        style={{
          color: 'var(--secondary)',
          fontWeight: 800,
          fontSize: '2rem',
          margin: '0 0 10px 0'
        }}
      >
        Add a Wild Plot Twist!
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.07rem', margin: 0 }}>
        Supercharge your stories with unpredictable surprises. Instantly generate fresh, creative twists to keep your readers eagerly flipping pages.
      </p>
      <div style={{
        fontWeight: 600, color: 'var(--primary)'
      }}>Sample Twists:</div>
      <ul style={{ margin: '4px 0 0 0', padding: '0 0 0 18px', color: 'var(--text-secondary)', fontSize: '1.01rem' }}>
        {sampleTwists.map((t, i) => (
          <li key={i} style={{ marginBottom: 2 }}>{t}</li>
        ))}
      </ul>
      <div style={{
        margin: '14px 0 0 0',
        color: 'var(--secondary)',
        background: '#f5fffa',
        border: '1px solid #d7f6ea',
        borderRadius: 7,
        fontSize: '0.99rem',
        padding: '11px 15px',
        maxWidth: 410
      }}>
        Try our generator to break writer’s block and wow your readers!
      </div>
      <button
        className="btn secondary"
        style={{
          marginTop: 17,
          minWidth: 185,
          fontSize: '1.15rem',
        }}
        tabIndex={0}
        aria-label="Generate a Twist"
      >
        Generate a Twist
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
// Feature: Storytone Selector Page
function StorytoneSelector() {
  // List of example tones/genres and emoji icons
  const tones = [
    { name: 'Funny', emoji: '😂', desc: 'Quirky, playful & lighthearted.' },
    { name: 'Spooky', emoji: '👻', desc: 'Creepy, tense & mysterious.' },
    { name: 'Dramatic', emoji: '🎭', desc: 'Emotional, intense & heartfelt.' },
    { name: 'Adventurous', emoji: '🧭', desc: 'Bold, daring & action-packed.' },
    { name: 'Mysterious', emoji: '🕵️‍♂️', desc: 'Enigmatic & full of secrets.' },
  ];
  return (
    <div
      className="container"
      style={{
        marginTop: 110,
        marginBottom: 32,
        minHeight: '62vh',
        maxWidth: 670,
        background: 'linear-gradient(94deg, #f6fbff 78%, #e0ecfb 100%)',
        borderRadius: '13px',
        boxShadow: '0 4px 23px rgba(74,144,226,0.10)',
        border: '1.2px solid #cae0f7',
        padding: '2.5em 2.3em 2.3em 2.3em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 18
      }}
      aria-label="Storytone Selector"
    >
      <span style={{ fontSize: '2.1rem', color: 'var(--primary)' }} role="img" aria-label="Palette">🎨</span>
      <h1
        className="section-title"
        style={{
          color: 'var(--primary)',
          fontWeight: 800,
          fontSize: '2rem',
          margin: '0 0 8px 0'
        }}
      >
        Choose Your Story’s Style!
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.07rem', margin: 0 }}>
        Preview fun tones & genres below. Pick the mood to match your tale! Icons show the flavor—click to try one (feature coming soon).
      </p>
      <div style={{
        display: 'flex',
        gap: 18,
        margin: '12px 0 0 0',
        flexWrap: 'wrap'
      }}>
        {tones.map(tone => (
          <div key={tone.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#fff',
              border: '1.2px solid var(--border-color)',
              borderRadius: '9px',
              boxShadow: '0 2px 10px rgba(74,144,226,0.05)',
              padding: '13px 16px 10px 16px',
              minWidth: 83,
              marginBottom: 8,
              transition: 'box-shadow 0.18s, border-color 0.16s'
            }}>
            <span style={{
              fontSize: '2.3rem',
              color: 'var(--primary)',
              marginBottom: 3,
              filter: tone.name === 'Spooky' ? 'opacity(0.84) grayscale(0.3)' : '',
            }} role="img" aria-label={tone.name}>{tone.emoji}</span>
            <span style={{
              color: 'var(--primary)',
              fontWeight: 670,
              fontSize: '1.02rem'
            }}>{tone.name}</span>
            <span style={{
              color: 'var(--text-secondary)',
              fontSize: '0.97rem',
              marginTop: 3,
              textAlign: 'center',
              maxWidth: 100
            }}>{tone.desc}</span>
            <button
              className="btn"
              style={{
                marginTop: 7,
                fontSize: '0.94rem',
                padding: '4.5px 16px',
                background: 'var(--background)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)'
              }}
              disabled
              tabIndex={-1}
            >Preview</button>
          </div>
        ))}
      </div>
      <button
        className="btn primary"
        style={{
          marginTop: 14,
          minWidth: 185,
          fontSize: '1.14rem',
        }}
        tabIndex={0}
        aria-label="Preview Styles"
      >
        Preview Styles
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
// Feature: Character Creator Page
function CharacterCreator() {
  const exampleFields = [
    { label: 'Name', desc: 'e.g. Captain Daisy' },
    { label: 'Role', desc: 'e.g. Villain, Sidekick, Hero' },
    { label: 'Age', desc: 'Numeric or "timeless"' },
    { label: 'Favorite Thing', desc: 'e.g. Cheese, Gadgets, Cats' },
    { label: 'Quirk', desc: 'e.g. Talks in rhyme, never runs, always smiles' }
  ];
  return (
    <div
      className="container"
      style={{
        marginTop: 110,
        marginBottom: 32,
        minHeight: '62vh',
        maxWidth: 670,
        background: 'linear-gradient(93deg, #fff, #ffffff 65%, #e5fdfb 100%)',
        borderRadius: '13px',
        boxShadow: '0 4px 23px rgba(80,227,194,0.10)',
        border: '1.2px solid #b8f7e6',
        padding: '2.5em 2.3em 2.3em 2.3em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        gap: 18
      }}
      aria-label="Character Creator"
    >
      <span style={{ fontSize: '2.1rem', color: 'var(--secondary)' }} role="img" aria-label="Character creation">🧑‍🔬</span>
      <h1
        className="section-title"
        style={{
          color: 'var(--secondary)',
          fontWeight: 800,
          fontSize: '2rem',
          margin: '0 0 10px 0'
        }}
      >
        Build Your Own Character
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.07rem', margin: 0 }}>
        Bring your ideas to life by designing custom characters! Choose names, roles, quirks, and more—plus, get a unique avatar for each persona.
      </p>
      <div style={{
        marginTop: 8,
        border: '1px solid #b4f5e3',
        background: '#f7fffd',
        borderRadius: 6,
        padding: '13px 17px 8px 17px',
        maxWidth: 405
      }}>
        <div style={{ fontWeight: 600, color: 'var(--secondary)', marginBottom: 6 }}>Example Fields:</div>
        {exampleFields.map((f, i) => (
          <div key={f.label} style={{
            fontSize: '1.01rem',
            marginBottom: 5,
            color: 'var(--primary)',
            display: 'flex',
            flexDirection: 'row',
            gap: 8
          }}>
            <span style={{
              width: 94, fontWeight: 640, color: 'var(--secondary)'
            }}>{f.label}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{f.desc}</span>
          </div>
        ))}
      </div>
      <div style={{
        color: 'var(--secondary)',
        fontSize: '1rem',
        maxWidth: 420
      }}>
        Click below to start building your character—name them, set their quirks, and let our AI conjure up a matching look!
      </div>
      <button
        className="btn secondary"
        style={{
          marginTop: 14,
          minWidth: 185,
          fontSize: '1.14rem',
        }}
        tabIndex={0}
        aria-label="Create Character"
      >
        Create Character
      </button>
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