export const CONVERSATION_STAGES ={
    INITIAL: 'initial',
    IDENTIFY_CHANGE: 'identify_change',
    STYLE_QUESTIONS: 'style_questions',
    DETAIL_QUESTIONS: 'detail_questions',
    PHOTO_UPLOAD: 'photo_upload',
    GENERATE_PROMPT: 'generate_prompt',
    GENERATING: 'generating'
};

export function createInitialProjectContext() {
    return {
        roomType: null,
        currentChange: null,
        style: null,
        materials: {},
        finishes: {},
        existingElements: [],
        photos: [],
        questionsAnswered: new Set(),
        promptDraft: null,
        sessionToken: null
    };
}

export function updateProjectContext(currentContext, updates) {
    return {
        ...currentContext,
        ...updates,

        materials: { ...currentContext.materials, ...(updates.materials || {}) },
        finishes: { ...currentContext.finishes, ...(updates.finishes || {}) },
        existingElements: updates.existingElements 
        ? [...currentContext.existingElements, ...updates.existingElements]
        : currentContext.existingElements,
        photos: updates.photos !== undefined 
        ? updates.photos 
        : currentContext.photos,
        questionsAnswered: updates.questionsAnswered
        ? new Set([...currentContext.questionsAnswered, ...updates.questionsAnswered])
        : currentContext.questionsAnswered
    }
}

export function getNextStage(currentStage, projectContext) {
    switch (currentStage) {
        case CONVERSATION_STAGES.INITIAL:
          return projectContext.roomType ? CONVERSATION_STAGES.IDENTIFY_CHANGE : CONVERSATION_STAGES.INITIAL;
        
        case CONVERSATION_STAGES.IDENTIFY_CHANGE:
          return projectContext.currentChange ? CONVERSATION_STAGES.STYLE_QUESTIONS : CONVERSATION_STAGES.IDENTIFY_CHANGE;
        
        case CONVERSATION_STAGES.STYLE_QUESTIONS:
          return projectContext.style ? CONVERSATION_STAGES.DETAIL_QUESTIONS : CONVERSATION_STAGES.STYLE_QUESTIONS;
        
        case CONVERSATION_STAGES.DETAIL_QUESTIONS:
          // Transition to photo upload when we have minimum context (room, change, style)
          if (hasMinimumContext(projectContext)) {
            return CONVERSATION_STAGES.PHOTO_UPLOAD;
          }
          return CONVERSATION_STAGES.DETAIL_QUESTIONS;
        
        case CONVERSATION_STAGES.PHOTO_UPLOAD:
          // Once photos are uploaded, move to prompt generation
          if (projectContext.photos.length > 0) {
            return CONVERSATION_STAGES.GENERATE_PROMPT;
          }
          return CONVERSATION_STAGES.PHOTO_UPLOAD;
        
        case CONVERSATION_STAGES.GENERATE_PROMPT:
          return CONVERSATION_STAGES.GENERATING;
        
        default:
          return currentStage;
      }
}

export function hasMinimumContext(projectContext) {
    return !!(
        projectContext.roomType &&
        projectContext.currentChange &&
        projectContext.style
    );
}

