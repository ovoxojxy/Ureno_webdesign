import axios from 'axios';
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '../.env' });
dotenv.config({ path: '.env' });

export async function askOpenAI(prompt) {

    console.log("Loaded OpenAI key:", process.env.OPENAI_API_KEY ? "✔️" : "❌");

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: "system", content: "You are a renovation advisor for a home improvement platform called Ureno. You help users choose materials, paint colors, and layout ideas based on their project. Offer suggestions that are realistic, affordable, and match modern design trends. Ask follow-up questions if needed. When users discuss specific rooms or design concepts, suggest that they can upload a photo and generate a 3D visualization of their renovation ideas to better visualize the space. Mention that 3D world generation is available to help them see their design concepts come to life. Be enthusiastic but natural when suggesting this feature."},
            { role: "user", content: prompt}],
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        })

        return response.data.choices[0].message.content;
    } catch (err) {
        console.error("OpenAI API Error:", err.response?.data || err.message || err)
        throw err
    }
}

/**
 * Guided renovation conversation function
 * Provides structured conversation flow based on project context and current stage
 * @param {Array} conversationHistory - Array of {role: string, content: string} messages
 * @param {Object} projectContext - Current project context from conversationState
 * @param {string} currentStage - Current conversation stage
 * @returns {Promise<string>} LLM response message
 */
export async function askGuidedRenovationQuestion(conversationHistory, projectContext, currentStage) {
    console.log("🎯 Guided conversation - Stage:", currentStage);
    console.log("📋 Context:", {
        roomType: projectContext.roomType,
        currentChange: projectContext.currentChange,
        style: projectContext.style
    });

    const systemPrompt = `You are a renovation visualization assistant for Ureno, a home improvement platform. Your role is to guide users through a structured conversation to collect information needed for 3D world generation.

CONVERSATION FLOW:
1. INITIAL - Welcome and identify what room/project they're working on
2. IDENTIFY_CHANGE - Ask what specific element they want to change (countertops, cabinets, paint, flooring, etc.)
3. STYLE_QUESTIONS - Ask about style preferences (modern, traditional, rustic, minimalist, etc.)
4. DETAIL_QUESTIONS - Ask about:
   - Specific materials/colors (e.g., "dark granite", "white cabinets")
   - Finishes (e.g., "matte", "polished", "flat-panel")
   - Existing elements to keep (e.g., "keep appliances", "keep backsplash")
5. PHOTO_GUIDANCE - Request photos with specific instructions for multi-angle capture
   - Specify how many photos needed
   - Describe the angles/positions (front, back, left, right, etc.)
   - Explain the order to upload them

CURRENT STAGE: ${currentStage}
CURRENT PROJECT CONTEXT:
- Room Type: ${projectContext.roomType || 'Not specified'}
- Change Being Made: ${projectContext.currentChange || 'Not specified'}
- Style: ${projectContext.style || 'Not specified'}
- Materials: ${JSON.stringify(projectContext.materials)}
- Finishes: ${JSON.stringify(projectContext.finishes)}
- Existing Elements to Keep: ${projectContext.existingElements.join(', ') || 'None specified'}

GUIDELINES:
- Ask ONE focused question at a time (or 2-3 related questions max)
- Be conversational, friendly, and helpful
- Don't ask about photos until you have all the design details (room type, change, style, materials, finishes)
- When ready for photos (after collecting all design details), be very specific:
  * Tell them exactly how many photos you need
  * Describe each angle clearly (e.g., "front view", "right side", "back view")
  * Explain the order to upload them
- Keep responses concise (2-3 sentences max)
- Acknowledge what the user has already told you when relevant
- Guide the conversation naturally toward the next piece of needed information

Based on the current stage and what information has been collected, ask the next appropriate question to move the conversation forward.`;

    const messages = [
        { role: "system", content: systemPrompt }
    ];

    conversationHistory.forEach(msg => {
        if (msg.role === 'user' || msg.role === 'assistant') {
            messages.push({
                role: msg.role,
                content: msg.content || msg.text
            });
        }
    });

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: messages,
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const llmResponse = response.data.choices[0].message.content;
        console.log("✅ LLM Response:", llmResponse.substring(0, 100) + "...");
        
        return llmResponse;
    } catch (err) {
        console.error("❌ OpenAI API Error (guided conversation):", err.response?.data || err.message || err);
        throw err;
    }
}

/**
 * Extract structured project context from user's natural language message
 * Uses LLM to parse user input and extract relevant information
 * @param {string} userMessage
 * @param {Object} currentContext
 * @param {string} currentStage
 * @returns {Promise<Object>}
 */

export async function extractProjectContext(userMessage, currentContext, currentStage) {
    console.log("Extracting context from:", userMessage.substring(0, 50) + "...");
    console.log("Current context:", {
        roomType: currentContext.roomType,
        currentChange: currentContext.currentChange,
        style: currentContext.style
    });

    const systemPrompt = `You are a context extraction assistant for a renovation visualization platform. Your job is to parse user messages and extract structured information about their renovation project.

CURRENT CONVERSATION STAGE: ${currentStage}
CURRENT CONTEXT:
- Room Type: ${currentContext.roomType || 'Not specified'}
- Change Being Made: ${currentContext.currentChange || 'Not specified'}
- Style: ${currentContext.style || 'Not specified'}
- Materials: ${JSON.stringify(currentContext.materials)}
- Finishes: ${JSON.stringify(currentContext.finishes)}
- Existing Elements: ${(currentContext.existingElements || []).join(', ') || 'None'}

EXTRACTION RULES:
1. Only extract NEW information that wasn't already in the current context
2. If the user mentions a room type (kitchen, bathroom, living room, bedroom, etc.), extract it as "roomType"
3. If the user mentions what they want to change (countertops, cabinets, paint, flooring, backsplash, etc.), extract it as "currentChange"
4. If the user mentions style (modern, traditional, rustic, minimalist, contemporary, etc.), extract it as "style"
5. For materials: Extract specific materials mentioned (e.g., "dark granite", "white cabinets", "hardwood floors")
   - Format as object: { "countertops": "dark granite", "cabinets": "white" }
   - Only include materials for elements they're changing
6. For finishes: Extract finish details (matte, polished, flat-panel, glossy, textured, etc.)
   - Format as object: { "countertops": "matte", "cabinets": "flat-panel" }
7. For existing elements: Extract things they want to keep (e.g., "keep appliances", "keep backsplash", "keep lighting")
   - Format as array: ["stainless steel appliances", "white backsplash"]

IMPORTANT:
- Return ONLY a valid JSON object with the fields you extracted
- Do NOT include fields that haven't changed
- Use null for fields you want to clear/reset
- If you extract nothing new, return an empty object: {}
- Be specific and accurate - don't infer too much

Response format (JSON only, no explanation):
{
  "roomType": "kitchen" | null,
  "currentChange": "countertops" | null,
  "style": "modern" | null,
  "materials": { "countertops": "dark granite" } | {},
  "finishes": { "countertops": "matte" } | {},
  "existingElements": ["appliances"] | []
}`;

try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4-turbo',
        messages: [
            {role: "system", content: systemPrompt},
            {role: "user", content: `Extract context from this user message: "${userMessage}"`}
        ],
        temperature: 0.3,
        response_format: { type: "json_object"}
    }, {
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        }
    });

    const extractedText = response.data.choices[0].message.content;
    console.log("Extracted JSON:", extractedText);

    let extracted;
    try {
        extracted = JSON.parse(extractedText);
    } catch (parseError) {
        console.error("❌ Failed to parse extracted JSON:", parseError);
        // Try to extract JSON from the response if it's wrapped in text
        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            extracted = JSON.parse(jsonMatch[0]);
        } else {
            console.warn("⚠️ Could not parse extraction, returning empty object");
            return {};
        }
    }
    const cleanedExtraction = {
        ...(extracted.roomType !== undefined && { roomType: extracted.roomType }),
        ...(extracted.currentChange !== undefined && { currentChange: extracted.currentChange }),
        ...(extracted.style !== undefined && { style: extracted.style }),
        ...(Object.keys(extracted.materials || {}).length > 0 && { materials: extracted.materials }),
        ...(Object.keys(extracted.finishes || {}).length > 0 && { finishes: extracted.finishes }),
        ...(Array.isArray(extracted.existingElements) && extracted.existingElements.length > 0 && { 
            existingElements: extracted.existingElements 
        })
    };
    console.log("✅ Cleaned extraction:", cleanedExtraction);
        return cleanedExtraction;

    } catch (err) {
        console.error("❌ OpenAI API Error (context extraction):", err.response?.data || err.message || err);
        // Return empty object on error - don't break the conversation flow
        return {};
    }
}