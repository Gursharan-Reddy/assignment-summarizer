function ResultCard({ data }) {
  const { summary, keyPoints, sentiment } = data;

  const sentimentColor = 
    sentiment === 'positive' ? 'green' : 
    sentiment === 'negative' ? 'red' : 'gray';

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9', color: '#333' }}>
      <h2>Results</h2>
      <p><strong>Summary:</strong> {summary}</p>
      
      <strong>Key Points:</strong>
      <ul>
        {keyPoints && keyPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      
      <p>
        <strong>Sentiment: </strong> 
        <span style={{ color: sentimentColor, fontWeight: 'bold', textTransform: 'capitalize' }}>
          {sentiment}
        </span>
      </p>
    </div>
  );
}

export default ResultCard;