import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'devsnap_snippets_v1';

const INITIAL_SNIPPETS = [
  {
    id: '1',
    title: 'Force Push Current Branch',
    tag: 'git',
    code: 'git push -u origin main --force'
  },
  {
    id: '2',
    title: 'Kill Process on Port 5173 (Windows)',
    tag: 'terminal',
    code: 'netstat -ano | findstr :5173\ntaskkill /PID <PID> /F'
  },
  {
    id: '3',
    title: 'Debounce Hook Utility',
    tag: 'react',
    code: 'useEffect(() => {\n  const timer = setTimeout(() => setDebounced(val), 300);\n  return () => clearTimeout(timer);\n}, [val]);'
  }
];

export default function App() {
  const [snippets, setSnippets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SNIPPETS;
    } catch {
      return INITIAL_SNIPPETS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('git');
  const [code, setCode] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    } catch (err) {
      console.error('Storage error:', err);
    }
  }, [snippets]);

  const handleAddSnippet = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    const newSnippet = {
      id: Date.now().toString(),
      title: title.trim(),
      tag: tag.trim().toLowerCase() || 'general',
      code: code.trim()
    };

    setSnippets([newSnippet, ...snippets]);
    setTitle('');
    setCode('');
  };

  const handleDelete = (id) => {
    setSnippets(snippets.filter(s => s.id !== id));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Extract unique tags dynamically
  const tags = ['all', ...new Set(snippets.map(s => s.tag))];

  // Filter snippets by tag and search string
  const filteredSnippets = snippets.filter(s => {
    const matchesTag = selectedTag === 'all' || s.tag === selectedTag;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 20px', fontFamily: 'monospace', backgroundColor: '#070a13', color: '#f8fafc', minHeight: '90vh' }}>
      
      {/* Header */}
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#38bdf8' }}>
            ⚡ DevSnap Snippet Vault
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>
            Fast, local-first command & code snippet manager with instant search.
          </p>
        </div>
        <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '6px 12px', borderRadius: '6px' }}>
          {snippets.length} Stored Snippets
        </span>
      </header>

      {/* Add Snippet Form */}
      <form onSubmit={handleAddSnippet} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '18px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Snippet title (e.g. Docker Prune All)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 2, minWidth: '200px', padding: '9px 12px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }}
          />
          <input
            type="text"
            placeholder="Tag (e.g. git, react, sql)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={{ flex: 1, minWidth: '120px', padding: '9px 12px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#38bdf8', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }}
          />
        </div>

        <textarea
          rows="3"
          placeholder="Paste command or code block here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#a78bfa', fontSize: '12px', fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            style={{ padding: '8px 18px', backgroundColor: '#38bdf8', color: '#070a13', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
          >
            Save Snippet ➕
          </button>
        </div>
      </form>

      {/* Search & Tag Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                backgroundColor: selectedTag === t ? '#1e293b' : 'transparent',
                color: selectedTag === t ? '#38bdf8' : '#64748b'
              }}
            >
              #{t}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search snippets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '7px 12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', color: '#fff', fontSize: '12px', fontFamily: 'monospace', minWidth: '220px', outline: 'none' }}
        />
      </div>

      {/* Snippets Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredSnippets.map(item => (
          <div
            key={item.id}
            style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{item.title}</strong>
                <span style={{ fontSize: '10px', color: '#38bdf8', backgroundColor: '#070a13', border: '1px solid #1e293b', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {item.tag}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleCopy(item.id, item.code)}
                  style={{ padding: '4px 10px', backgroundColor: copiedId === item.id ? '#10b981' : '#1e293b', color: copiedId === item.id ? '#070a13' : '#cbd5e1', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  {copiedId === item.id ? 'Copied ✓' : 'Copy 📋'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{ padding: '4px 8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '5px', fontSize: '11px', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            </div>

            <pre style={{ margin: 0, padding: '12px', backgroundColor: '#070a13', border: '1px solid #1e293b', borderRadius: '6px', color: '#a78bfa', fontSize: '12px', overflowX: 'auto', lineHeight: '1.5' }}>
              <code>{item.code}</code>
            </pre>
          </div>
        ))}

        {filteredSnippets.length === 0 && (
          <div style={{ textAlign: 'center', color: '#475569', fontSize: '12px', padding: '40px 0', border: '1px dashed #1e293b', borderRadius: '10px' }}>
            No snippets match your current filter or search query.
          </div>
        )}
      </div>

    </div>
  );
}