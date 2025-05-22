import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

export async function askOpenAI(prompt) {

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: "system", content: "You are a renovation advisor for a home improvement platform called Ureno. You help users choose materials, paint colors, and layout ideas based on their project. Offer suggestions that are realistic, affordable, and match modern design trends. Ask follow-up questions if needed."},
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