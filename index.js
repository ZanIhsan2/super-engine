// Proses import dependensi yang dibutuhkan
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import 'dotenv/config';

// 1. inisialisasi express
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. inisialisasi middleware yang dibutuhkan
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 3. inisialisasi endpoint
// [HTTP method: GET, POST, PUT, PATCH, DELETE]
// .get() --> untuk mendapatkan data
// .post() --> untuk mengirim data
// .put() --> untuk mengupdate/menimpa data secara keseluruhan
// .patch() --> untuk mengupdate data secara parsial
// .delete() --> untuk menghapus data

// Endpoint POST /chat
app.post('/chat', async (req, res) => {
    console.log("Body masuk:", req.body);
    const { conversation } = req.body || {};

    // Validasi format body
    if (!conversation || !Array.isArray(conversation)) {
        res.status(400).json({
            message: "Percakapan harus valid!",
            data: null,
            succes: false
        });
        return;
    }

    const conversationValid = conversation.every((message) => {
        if (!message) return false;
        if (typeof message !== 'object' || Array.isArray(message)) return false;

        const keys = Object.keys(message);
        const keyLengthIsValid = keys.length === 2;
        const keyControlValidName = keys.every(key => ['role', 'text'].includes(key));

        if (!keyLengthIsValid || !keyControlValidName) return false;

        const { role, text } = message;
        const roleIsValid = ['user', 'model'].includes(role);
        const textIsValid = typeof text === 'string' && text.length > 0;

        return roleIsValid && textIsValid;
    });

    if (!conversationValid) {
        res.status(400).json({
            message: "Percakapan harus valid!",
            data: null,
            succes: false
        });
        return;
    }

    const content = conversation.map(({ role, text }) => ({
        role,
        parts: [{ text }]
    }));

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const aiResponse = await model.generateContent({
            contents: content,
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1024,
                topP: 0.95,
                topK: 40
            }
        });

        res.status(200).json({
            succes: true,
            data: aiResponse.response.text(),
            message: "Berhasil ditanggapi dari AI"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            succes: false,
            data: null,
            message: e.message || "Gagal mendapatkan tanggapan dari AI"
        });
    }
});

// Entrypoint
app.listen(3000, () => {
    console.log("I LOVE YOU 3000");
});