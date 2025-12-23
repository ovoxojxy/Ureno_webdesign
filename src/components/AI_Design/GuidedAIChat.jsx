import React, { useState, useEffect, useRef } from 'react';
import {
  CONVERSATION_STAGES,
  createInitialProjectContext,
  updateProjectContext,
  getNextStage,
  hasMinimumContext
} from '../../lib/conversationState';

import { askGuidedRenovation } from '../../../services/aiService';
import PhotoLabelingGrid from './PhotoLabelingGrid';
import { hasAllRequiredPhotos } from '../../lib/photoCoverage';
// import { generateWorldFromMultipleImages } from '../../../services/worldLabsService';

const GuidedAIChat = ({
  onWorldGenerated,
  onImageUpload,
  onGenerationStatusChange
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [currentStage, setCurrentStage] = useState(CONVERSATION_STAGES.INITIAL);
  const [projectContext, setProjectContext] = useState(createInitialProjectContext());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hi! I'm Ureno's renovation visualization assistant. I'll guide you through collecting the information needed to create a 3D visualization of your renovation project. What room or area are you looking to renovate?",
      isPersonal: false,
      timestamp: formatTime()
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
  
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isPersonal: true,
      timestamp: formatTime()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    const userInput = inputValue;
    setInputValue('');
  
    try {
     
    const result = await askGuidedRenovation(
        userInput,
        [...messages, userMessage], // Include the new user message
        projectContext,
        currentStage
    );
  
      // Add the LLM response to messages
      const botMessage = {
        id: Date.now() + 1,
        text: result.response,
        isPersonal: false,
        timestamp: formatTime()
      };
      setMessages(prev => [...prev, botMessage]);
  
      // Update project context with extracted information
      setProjectContext(result.updatedContext);
  
      // Update current stage based on new context
      const nextStage = getNextStage(currentStage, result.updatedContext);
      if (nextStage !== currentStage) {
        setCurrentStage(nextStage);
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        isPersonal: false,
        timestamp: formatTime()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle photo upload completion
  const handlePhotosComplete = (uploadedPhotos) => {
    // Update project context with uploaded photos
    setProjectContext(prev => ({
      ...prev,
      photos: uploadedPhotos
    }));
    
    // Update stage - will automatically transition to GENERATE_PROMPT via getNextStage
    const updatedContext = {
      ...projectContext,
      photos: uploadedPhotos
    };
    const nextStage = getNextStage(CONVERSATION_STAGES.PHOTO_UPLOAD, updatedContext);
    setCurrentStage(nextStage);
  };

  // Styles (similar to original AIChat)
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      padding: '15px',
      margin: '10px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    header: {
      color: 'white',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    stageIndicator: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '10px',
      marginBottom: '10px',
      fontStyle: 'italic'
    },
    messages: {
      flex: '1',
      overflowY: 'auto',
      marginBottom: '15px',
      paddingRight: '5px'
    },
    messagesContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    message: {
      color: 'white',
      fontSize: '12px',
      padding: '8px 12px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      maxWidth: '80%',
      position: 'relative',
      wordWrap: 'break-word'
    },
    messagePersonal: {
      background: '#248A52',
      marginLeft: 'auto',
      textAlign: 'right'
    },
    messageAvatar: {
      display: 'inline-block',
      marginRight: '8px',
      fontSize: '16px'
    },
    timestamp: {
      fontSize: '8px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: '4px'
    },
    timestampPersonal: {
      textAlign: 'right'
    },
    loadingMessage: {
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      fontSize: '12px',
      padding: '8px 12px',
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      maxWidth: '80%'
    },
    loadingDots: {
      display: 'flex',
      gap: '4px'
    },
    loadingDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.5)',
      animation: 'pulse 1.4s infinite ease-in-out'
    },
    messageBox: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end'
    },
    messageInput: {
      flex: '1',
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      padding: '10px',
      color: 'white',
      fontSize: '12px',
      resize: 'none',
      minHeight: '40px',
      maxHeight: '100px',
      fontFamily: 'inherit'
    },
    messageSubmit: {
      background: '#248A52',
      border: 'none',
      color: 'white',
      fontSize: '11px',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      textTransform: 'uppercase',
      fontWeight: 'bold',
      transition: 'background 0.2s ease'
    }
  };

  const getStageDisplayName = (stage) => {
    const stageNames = {
      [CONVERSATION_STAGES.INITIAL]: 'Getting Started',
      [CONVERSATION_STAGES.IDENTIFY_CHANGE]: 'Identifying Changes',
      [CONVERSATION_STAGES.STYLE_QUESTIONS]: 'Style & Preferences',
      [CONVERSATION_STAGES.DETAIL_QUESTIONS]: 'Details & Finishes',
      [CONVERSATION_STAGES.PHOTO_UPLOAD]: 'Uploading Photos',
      [CONVERSATION_STAGES.GENERATE_PROMPT]: 'Preparing Generation',
      [CONVERSATION_STAGES.GENERATING]: 'Generating 3D World'
    };
    return stageNames[stage] || stage;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        Guided Renovation Assistant
      </div>

      <div style={styles.stageIndicator}>
        Stage: {getStageDisplayName(currentStage)}
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          fontSize: '9px',
          color: 'rgba(255, 255, 255, 0.4)',
          marginBottom: '10px',
          padding: '5px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '4px'
        }}>
          <div>Room: {projectContext.roomType || 'Not set'}</div>
          <div>Change: {projectContext.currentChange || 'Not set'}</div>
          <div>Style: {projectContext.style || 'Not set'}</div>
          <div>Photos: {projectContext.photos.length}</div>
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
                <span style={{ ...styles.loadingDot, animationDelay: '0s' }}></span>
                <span style={{ ...styles.loadingDot, animationDelay: '0.15s' }}></span>
                <span style={{ ...styles.loadingDot, animationDelay: '0.3s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Photo upload UI - show when we have minimum context (room, change, style) */}
      {(hasMinimumContext(projectContext) || currentStage === CONVERSATION_STAGES.PHOTO_UPLOAD) && (
        <PhotoLabelingGrid
          onPhotosComplete={handlePhotosComplete}
          existingPhotos={projectContext.photos || []}
        />
      )}

      <div style={styles.messageBox}>
        <textarea
          style={styles.messageInput}
          placeholder="Type your response..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || currentStage === CONVERSATION_STAGES.GENERATING || currentStage === CONVERSATION_STAGES.PHOTO_UPLOAD}
        />
        <button
          style={styles.messageSubmit}
          onClick={handleSendMessage}
          onMouseEnter={(e) => e.target.style.background = '#1D7745'}
          onMouseLeave={(e) => e.target.style.background = '#248A52'}
          disabled={isLoading || currentStage === CONVERSATION_STAGES.GENERATING || currentStage === CONVERSATION_STAGES.PHOTO_UPLOAD}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>

      {/* Add keyframe animation for loading dots */}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default GuidedAIChat;