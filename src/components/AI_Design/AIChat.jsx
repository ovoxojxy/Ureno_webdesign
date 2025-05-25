import React, { useState, useEffect, useRef } from 'react'
import { getAIResponse } from '../../../services/aiService'

const AIChat = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
        </div>
        
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