import React, { useState } from 'react'
import { getAIResponse } from '../../../services/aiService'
const AIChat = () => {
    const [prompt, setPrompt] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

    try {
        const aiReponse = await getAIResponse(prompt)
        setResponse(aiReponse)
    } catch (error) {
        console.error('Error:', error)
    } finally {
        setLoading(false)
    }
}

return (
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about your renovation project..."
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </form>

        {response && (
          <div className="response">
            <h3>Response:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
    );
  };

export default AIChat