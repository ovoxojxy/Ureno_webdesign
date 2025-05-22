import axios from 'axios';

export async function generateImage(prompt) {
    const response = await axios.post('https://api.openai.com/v1/images/generations', {
        prompt,
        n: 1,
        size: "1024x1024",
    },
    {
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
        }
    }
)
return response.data.data[0].url;
}