import { useState } from 'react';
import ResultCard from './components/ResultCard';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to summarize.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>Text Summarizer</h1>
      <textarea 
        rows="8" 
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        placeholder="Paste your unstructured text here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button 
        onClick={handleSummarize} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        {loading ? 'Analyzing...' : 'Summarize Text'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      {result && <ResultCard data={result} />}
    </div>
  );
}

export default App;