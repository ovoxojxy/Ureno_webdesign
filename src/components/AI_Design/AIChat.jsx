import React, { useState, useEffect, useRef } from 'react'
import { getAIResponse } from '../../../services/aiService'
import { generateWorld, pollOperation } from '../../../services/worldLabsService'
import { pollUntilComplete } from '../../lib/worldPolling'

const AIChat = ({ onWorldGenerated, onImageUpload, onGenerationStatusChange }) => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null) // Store uploaded image file
  const [imagePreview, setImagePreview] = useState(null) // Store image preview URL
  const [isGeneratingWorld, setIsGeneratingWorld] = useState(false) // Track world generation
  const [worldGenerationStatus, setWorldGenerationStatus] = useState(null) // Store generation status
  const [roomType, setRoomType] = useState('')
  const [budget, setBudget] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: "Hi! I'm Ureno AI Assistant. I can help you with renovation ideas, budget planning, and design suggestions. What would you like to know about your project?",
      isPersonal: false,
      timestamp: formatTime()
    }
    setMessages([welcomeMessage])
  }, [])

  const formatTime = () => {
    const now = new Date()
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isPersonal: true,
      timestamp: formatTime()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const fullPrompt = (() => {
      if (roomType && budget) {
        return `I am planning a ${roomType} renovation with a budget of $${budget}. ${inputValue}`
      } else if (roomType) {
        return `I am planning a ${roomType} renovation. ${inputValue}`
      } else if (budget) {
        return `I am planning a renovation with a budget of $${budget}. ${inputValue}`
      } else {
        return `I am planning a renovation. ${inputValue}`
      }
    })()

    try {
      const aiResponse = await getAIResponse(fullPrompt)
      
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          isPersonal: false,
          timestamp: formatTime()
        }
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error:', error)
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isPersonal: false,
          timestamp: formatTime()
        }
        setMessages(prev => [...prev, errorMessage])
        setIsLoading(false)
      }, 1000)
    }

    setInputValue('')
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size should be less than 10MB')
        return
      }
      
      setUploadedImage(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const preview = reader.result
        setImagePreview(preview)
        // Notify parent component
        if (onImageUpload) {
          onImageUpload(file, preview)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setUploadedImage(null)
    setImagePreview(null)
    // Notify parent component
    if (onImageUpload) {
      onImageUpload(null, null)
    }
  }

  const handleGenerateWorld = async () => {
    if (!uploadedImage && !imagePreview) {
      alert('Please upload an image first')
      return
    }

    setIsGeneratingWorld(true)
    const initialStatus = 'Starting world generation...'
    setWorldGenerationStatus(initialStatus)
    if (onGenerationStatusChange) {
      onGenerationStatusChange(initialStatus)
    }

    try {
      // For now, we'll use image URL if available, or we need to upload to a service
      // For simplicity, let's create an object URL from the file
      let imageUrl = imagePreview
      
      // If we have a file, we could upload it first, but for now let's use base64
      // Note: World Labs API needs a public URL, so in production you'd upload to Firebase Storage first
      // For testing, we'll need to handle this differently - let's use a placeholder approach
      
      // For now, let's generate from text prompt instead, using the image description
      // Or we can add image upload to Firebase Storage first
      
      // Simplified approach: Generate world with text description for now
      // In Phase 4, we'll add proper image upload to media assets
      
      const operation = await generateWorld({
        type: 'text',
        textPrompt: `A ${roomType || 'modern'} room based on uploaded image: ${inputValue || 'renovation design'}`,
        displayName: `World from ${roomType || 'room'} design`
      })

      const startedStatus = 'World generation started. This will take about 5 minutes...'
      setWorldGenerationStatus(startedStatus)
      if (onGenerationStatusChange) {
        onGenerationStatusChange(startedStatus)
      }

      // Poll for completion
      const completed = await pollUntilComplete(
        operation.operation_id,
        pollOperation,
        {
          onProgress: (op) => {
            const progress = op.metadata?.progress
            if (progress) {
              const status = `${progress.status}: ${progress.description || 'Generating...'}`
              setWorldGenerationStatus(status)
              if (onGenerationStatusChange) {
                onGenerationStatusChange(status)
              }
            }
          }
        }
      )

      const successStatus = 'World generated successfully!'
      setWorldGenerationStatus(successStatus)
      if (onGenerationStatusChange) {
        onGenerationStatusChange(successStatus)
      }
      
      // Store the world ID for later use
      const worldId = completed.metadata?.world_id
      if (worldId) {
        // Notify parent component
        if (onWorldGenerated) {
          onWorldGenerated(worldId)
        }
      }

    } catch (error) {
      console.error('World generation error:', error)
      const errorStatus = `Error: ${error.message}`
      setWorldGenerationStatus(errorStatus)
      if (onGenerationStatusChange) {
        onGenerationStatusChange(errorStatus)
      }
      alert('Failed to generate world. Please try again.')
    } finally {
      setIsGeneratingWorld(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const styles = {
    container: {
      margin: 0,
      padding: 0,
      height: '100vh',
      background: 'linear-gradient(135deg, #000000, #404040, #ffffff)',
      backgroundSize: 'cover',
      fontFamily: "'Open Sans', sans-serif",
      fontSize: '12px',
      lineHeight: 1.3,
      overflow: 'hidden',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bg: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
      backgroundImage: 'url("background.jpeg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 0',
      filter: 'blur(80px)',
      transform: 'scale(1.2)'
    },
    chat: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '350px',
      height: '80vh',
      maxHeight: '600px',
      zIndex: 2,
      overflow: 'hidden',
      boxShadow: '0 5px 30px rgba(0, 0, 0, .2)',
      background: 'rgba(0, 0, 0, .5)',
      borderRadius: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column'
    },
    chatTitle: {
      flex: '0 1 60px',
      position: 'relative',
      zIndex: 2,
      background: 'rgba(0, 0, 0, 0.2)',
      color: '#fff',
      textTransform: 'uppercase',
      textAlign: 'left',
      padding: '10px 10px 10px 60px'
    },
    titleH1: {
      fontWeight: 'normal',
      fontSize: '12px',
      margin: 0,
      padding: 0
    },
    titleH2: {
      color: 'rgba(255, 255, 255, .5)',
      fontSize: '9px',
      letterSpacing: '1px',
      fontWeight: 'normal',
      margin: 0,
      padding: 0
    },
    avatar: {
      position: 'absolute',
      zIndex: 1,
      top: '10px',
      left: '15px',
      borderRadius: '30px',
      width: '35px',
      height: '35px',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      border: '2px solid rgba(255, 255, 255, 0.24)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #000000, #404040)',
      fontSize: '18px'
    },
    settingsBar: {
      background: 'rgba(0, 0, 0, 0.1)',
      padding: '8px 10px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      gap: '10px',
      fontSize: '10px'
    },
    settingItem: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px'
    },
    settingLabel: {
      color: 'rgba(255, 255, 255, .7)',
      fontSize: '8px'
    },
    settingSelect: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: 'white',
      fontSize: '9px',
      padding: '2px 4px',
      borderRadius: '4px',
      outline: 'none'
    },
    settingInput: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: 'white',
      fontSize: '9px',
      padding: '2px 4px',
      borderRadius: '4px',
      outline: 'none',
      width: '60px'
    },
    messages: {
      flex: '1 1 auto',
      color: 'rgba(255, 255, 255, .5)',
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    },
    messagesContent: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '101%',
      width: '100%',
      overflowY: 'auto',
      padding: '0 10px'
    },
    message: {
      clear: 'both',
      float: 'left',
      padding: '8px 12px',
      borderRadius: '12px 12px 12px 4px',
      background: 'rgba(0, 0, 0, .3)',
      margin: '8px 0',
      fontSize: '11px',
      lineHeight: 1.4,
      marginLeft: '40px',
      position: 'relative',
      textShadow: '0 1px 1px rgba(0, 0, 0, .2)',
      animation: 'bounce 500ms linear both',
      maxWidth: '250px',
      wordWrap: 'break-word'
    },
    messagePersonal: {
      float: 'right',
      color: '#fff',
      textAlign: 'right',
      background: 'linear-gradient(135deg, #000000, #404040)',
      borderRadius: '12px 12px 4px 12px',
      marginLeft: 0,
      marginRight: '10px'
    },
    messageAvatar: {
      position: 'absolute',
      zIndex: 1,
      bottom: '-15px',
      left: '-35px',
      borderRadius: '30px',
      width: '25px',
      height: '25px',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      border: '2px solid rgba(255, 255, 255, 0.24)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #000000, #404040)',
      fontSize: '12px',
      color: 'white'
    },
    timestamp: {
      position: 'absolute',
      bottom: '-15px',
      fontSize: '8px',
      color: 'rgba(255, 255, 255, .3)',
      left: 0
    },
    timestampPersonal: {
      right: 0,
      left: 'auto'
    },
    messageBox: {
      flex: '0 1 50px',
      width: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '12px',
      position: 'relative'
    },
    messageInput: {
      background: 'none',
      border: 'none',
      outline: 'none',
      resize: 'none',
      color: 'rgba(255, 255, 255, .7)',
      fontSize: '11px',
      height: '20px',
      margin: 0,
      paddingRight: '60px',
      width: '100%',
      boxSizing: 'border-box'
    },
    messageSubmit: {
      position: 'absolute',
      zIndex: 1,
      top: '12px',
      right: '12px',
      color: '#fff',
      border: 'none',
      background: '#248A52',
      fontSize: '10px',
      textTransform: 'uppercase',
      lineHeight: 1,
      padding: '8px 12px',
      borderRadius: '10px',
      outline: 'none',
      transition: 'background .2s ease',
      cursor: 'pointer'
    },
    loadingMessage: {
      clear: 'both',
      float: 'left',
      padding: '8px 12px',
      borderRadius: '12px 12px 12px 4px',
      background: 'rgba(0, 0, 0, .3)',
      margin: '8px 0',
      fontSize: '11px',
      lineHeight: 1.4,
      marginLeft: '40px',
      position: 'relative',
      textShadow: '0 1px 1px rgba(0, 0, 0, .2)'
    },
    loadingDots: {
      display: 'block',
      fontSize: 0,
      width: '20px',
      height: '10px',
      position: 'relative'
    },
    loadingDot: {
      display: 'inline-block',
      width: '3px',
      height: '3px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, .5)',
      margin: '0 1px',
      animation: 'ball 0.45s cubic-bezier(0, 0, 0.15, 1) alternate infinite'
    }
  }

  const keyframes = `
    @keyframes bounce { 
      0% { transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      4.7% { transform: matrix3d(0.45, 0, 0, 0, 0, 0.45, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      9.41% { transform: matrix3d(0.883, 0, 0, 0, 0, 0.883, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      14.11% { transform: matrix3d(1.141, 0, 0, 0, 0, 1.141, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      18.72% { transform: matrix3d(1.212, 0, 0, 0, 0, 1.212, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      24.32% { transform: matrix3d(1.151, 0, 0, 0, 0, 1.151, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      29.93% { transform: matrix3d(1.048, 0, 0, 0, 0, 1.048, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      35.54% { transform: matrix3d(0.979, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      41.04% { transform: matrix3d(0.961, 0, 0, 0, 0, 0.961, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      52.15% { transform: matrix3d(0.991, 0, 0, 0, 0, 0.991, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      63.26% { transform: matrix3d(1.007, 0, 0, 0, 0, 1.007, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      85.49% { transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
      100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1); } 
    }

    @keyframes ball { 
      from {
        transform: translateY(0) scaleY(.8);
      }
      to {
        transform: translateY(-10px);
      }
    }
  `

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.bg}></div>
      <div style={styles.chat}>
        <div style={styles.chatTitle}>
          <h1 style={styles.titleH1}>Ureno AI Assistant</h1>
          <h2 style={styles.titleH2}>Renovation Helper</h2>
          <div style={styles.avatar}>
            🏠
          </div>
        </div>
        
        <div style={styles.settingsBar}>
          <div style={styles.settingItem}>
            <label style={styles.settingLabel}>Room Type:</label>
            <select 
              style={styles.settingSelect} 
              value={roomType} 
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">Any Room</option>
              <option>Kitchen</option>
              <option>Bathroom</option>
              <option>Living Room</option>
              <option>Bedroom</option>
              <option>Basement</option>
            </select>
          </div>
          <div style={styles.settingItem}>
            <label style={styles.settingLabel}>Budget ($):</label>
            <input
              style={styles.settingInput}
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="10000"
            />
          </div>
          <div style={styles.settingItem}>
            <label style={styles.settingLabel} htmlFor="image-upload">
              📷 Upload Photo
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label
              htmlFor="image-upload"
              style={{
                ...styles.settingSelect,
                cursor: 'pointer',
                textAlign: 'center',
                padding: '4px 8px'
              }}
            >
              Choose File
            </label>
          </div>
        </div>  {/* Line 551 - settingsBar closes */}
        
        {/* Image Preview and Generate Button */}
        {imagePreview && (
          <div style={{
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '10px',
            margin: '10px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <img 
                src={imagePreview} 
                alt="Uploaded room" 
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ color: 'white', fontSize: '10px', marginBottom: '4px' }}>
                  {uploadedImage?.name || 'Uploaded image'}
                </div>
                <button
                  onClick={handleRemoveImage}
                  style={{
                    background: 'rgba(255, 0, 0, 0.3)',
                    border: 'none',
                    color: 'white',
                    fontSize: '9px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              onClick={handleGenerateWorld}
              disabled={isGeneratingWorld}
              style={{
                width: '100%',
                background: isGeneratingWorld ? '#666' : '#248A52',
                border: 'none',
                color: 'white',
                fontSize: '11px',
                padding: '8px',
                borderRadius: '6px',
                cursor: isGeneratingWorld ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                fontWeight: 'bold'
              }}
            >
              {isGeneratingWorld ? 'Generating 3D World...' : 'Generate 3D World'}
            </button>
            {worldGenerationStatus && (
              <div style={{
                marginTop: '8px',
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}>
                {worldGenerationStatus}
              </div>
            )}
          </div>
        )}
        
        <div style={styles.messages}>
          <div style={styles.messagesContent}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                style={{
                  ...styles.message,
                  ...(message.isPersonal ? styles.messagePersonal : {})
                }}
              >
                {!message.isPersonal && (
                  <div style={styles.messageAvatar}>
                    🤖
                  </div>
                )}
                {message.text}
                <div style={{
                  ...styles.timestamp,
                  ...(message.isPersonal ? styles.timestampPersonal : {})
                }}>
                  {message.timestamp}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={styles.loadingMessage}>
                <div style={styles.messageAvatar}>
                  🤖
                </div>
                <div style={styles.loadingDots}>
                  <span style={{...styles.loadingDot, animationDelay: '0s'}}></span>
                  <span style={{...styles.loadingDot, animationDelay: '0.15s'}}></span>
                  <span style={{...styles.loadingDot, animationDelay: '0.3s'}}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div style={styles.messageBox}>
          <textarea 
            type="text" 
            style={styles.messageInput}
            placeholder="Ask about your renovation..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            type="submit" 
            style={styles.messageSubmit}
            onClick={handleSendMessage}
            onMouseEnter={(e) => e.target.style.background = '#1D7745'}
            onMouseLeave={(e) => e.target.style.background = '#248A52'}
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIChat