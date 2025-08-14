import React, { useState } from "react";
import { generateImage } from '../../../services/aiService'

const AIImageGenerator = () => {
    const [prompt, setPrompt] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = await generateImage(prompt)
            setImageUrl(url)
        } catch (error){
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
            placeholder="Describe the room or design you want to visualize..."
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </form>

        {imageUrl && (
          <div className="image-result">
            <h3>Generated Image:</h3>
            <img src={imageUrl} alt="AI Generated" />
          </div>
        )}
      </div>
    );
}

export default AIImageGenerator