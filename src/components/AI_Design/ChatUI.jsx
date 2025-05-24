import React, { useState, useEffect, useRef } from 'react';
import './ChatUI.module.css'

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fakeMessageIndex, setFakeMessageIndex] = useState(0);
  const messagesEndRef = useRef(null);

  const fakeMessages = [
    'Hi there, I\'m Fabio and you?',
    'Nice to meet you',
    'How are you?',
    'Not too bad, thanks',
    'What do you do?',
    'That\'s awesome',
    'Codepen is a nice place to stay',
    'I think you\'re a nice person',
    'Why do you think that?',
    'Can you explain?',
    'Anyway I\'ve gotta go now',
    'It was a pleasure chat with you',
    'Time to make a new codepen',
    'Bye',
    ':)'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial fake message
    const timer = setTimeout(() => {
      addFakeMessage();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const addFakeMessage = () => {
    if (inputValue !== '' || fakeMessageIndex >= fakeMessages.length) return;

    setIsLoading(true);
    
    const delay = 1000 + Math.random() * 2000;
    setTimeout(() => {
      setIsLoading(false);
      const newMessage = {
        id: Date.now(),
        text: fakeMessages[fakeMessageIndex],
        isPersonal: false,
        timestamp: formatTime()
      };
      setMessages(prev => [...prev, newMessage]);
      setFakeMessageIndex(prev => prev + 1);
    }, delay);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      isPersonal: true,
      timestamp: formatTime()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Trigger fake response
    setTimeout(() => {
      addFakeMessage();
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
      width: '300px',
      height: '80vh',
      maxHeight: '500px',
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
      flex: '0 1 45px',
      position: 'relative',
      zIndex: 2,
      background: 'rgba(0, 0, 0, 0.2)',
      color: '#fff',
      textTransform: 'uppercase',
      textAlign: 'left',
      padding: '10px 10px 10px 50px'
    },
    titleH1: {
      fontWeight: 'normal',
      fontSize: '10px',
      margin: 0,
      padding: 0
    },
    titleH2: {
      color: 'rgba(255, 255, 255, .5)',
      fontSize: '8px',
      letterSpacing: '1px',
      fontWeight: 'normal',
      margin: 0,
      padding: 0
    },
    avatar: {
      position: 'absolute',
      zIndex: 1,
      top: '8px',
      left: '9px',
      borderRadius: '30px',
      width: '30px',
      height: '30px',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      border: '2px solid rgba(255, 255, 255, 0.24)'
    },
    avatarImg: {
      width: '100%',
      height: 'auto'
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
      padding: '6px 10px 7px',
      borderRadius: '10px 10px 10px 0',
      background: 'rgba(0, 0, 0, .3)',
      margin: '8px 0',
      fontSize: '11px',
      lineHeight: 1.4,
      marginLeft: '35px',
      position: 'relative',
      textShadow: '0 1px 1px rgba(0, 0, 0, .2)',
      animation: 'bounce 500ms linear both'
    },
    messagePersonal: {
      float: 'right',
      color: '#fff',
      textAlign: 'right',
      background: 'linear-gradient(135deg, #000000, #404040, #ffffff)',
      borderRadius: '10px 10px 0 10px',
      marginLeft: 0,
      marginRight: '10px'
    },
    messageAvatar: {
      position: 'absolute',
      zIndex: 1,
      bottom: '-15px',
      left: '-35px',
      borderRadius: '30px',
      width: '30px',
      height: '30px',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      border: '2px solid rgba(255, 255, 255, 0.24)'
    },
    timestamp: {
      position: 'absolute',
      bottom: '-15px',
      fontSize: '9px',
      color: 'rgba(255, 255, 255, .3)',
      left: 0
    },
    timestampPersonal: {
      right: 0,
      left: 'auto'
    },
    messageBox: {
      flex: '0 1 40px',
      width: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '10px',
      position: 'relative'
    },
    messageInput: {
      background: 'none',
      border: 'none',
      outline: 'none',
      resize: 'none',
      color: 'rgba(255, 255, 255, .7)',
      fontSize: '11px',
      height: '17px',
      margin: 0,
      paddingRight: '20px',
      width: '265px'
    },
    messageSubmit: {
      position: 'absolute',
      zIndex: 1,
      top: '9px',
      right: '10px',
      color: '#fff',
      border: 'none',
      background: '#248A52',
      fontSize: '10px',
      textTransform: 'uppercase',
      lineHeight: 1,
      padding: '6px 10px',
      borderRadius: '10px',
      outline: 'none',
      transition: 'background .2s ease',
      cursor: 'pointer'
    },
    loadingMessage: {
      clear: 'both',
      float: 'left',
      padding: '6px 10px 7px',
      borderRadius: '10px 10px 10px 0',
      background: 'rgba(0, 0, 0, .3)',
      margin: '8px 0',
      fontSize: '11px',
      lineHeight: 1.4,
      marginLeft: '35px',
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
  };

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
      100% { transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); } 
    }

    @keyframes ball { 
      from {
        transform: translateY(0) scaleY(.8);
      }
      to {
        transform: translateY(-10px);
      }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.bg}></div>
      <div style={styles.chat}>
        <div style={styles.chatTitle}>
          <h1 style={styles.titleH1}>Fabio Ottaviani</h1>
          <h2 style={styles.titleH2}>Supah</h2>
          <figure style={styles.avatar}>
            <img 
              src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" 
              alt="Avatar"
              style={styles.avatarImg}
            />
          </figure>
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
                  <figure style={styles.messageAvatar}>
                    <img 
                      src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" 
                      alt="Avatar"
                      style={styles.avatarImg}
                    />
                  </figure>
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
                <figure style={styles.messageAvatar}>
                  <img 
                    src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/156381/profile/profile-80.jpg" 
                    alt="Avatar"
                    style={styles.avatarImg}
                  />
                </figure>
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
            placeholder="Type message..."
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
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;