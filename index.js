// Proses import dependensi yang dibutuhkan
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

import 'dotenv/config';

// mulai persiapkan project kita
// 
// 1. inisialisasi express

const app = express();
const ai  = new GoogleGenAI({});

// 2. inisialisasi middleware yang dibutuhkan

app.use(cors());
// app.use(multer());
app.use(express.json());

// 3. inisialisasi endpoint
// [HTTP method: GET, POST, PUT, PATCH, DELETE]
// .get() --> untuk mendapatkan data
// .post() --> untuk mengirim data
// .put() --> untuk mengupdate/menimpa data secara keseluruhan
// .patch() --> untuk mengupdate data secara parsial
// .delete() --> untuk menghapus data

// Endpoint POST /chat
app.post(
    '/chat', // http://localhost:[PORT]/chat
    async (req, res) => {
        const { body } = req;
        const { prompt } = body;

        // guard clouse -- satpam
        if (!prompt || typeof prompt !== 'string') {
            res.status(400).json({
                message: "Promp harus diisi dan bertipe string!",
                data: null,
                succes: false
            });
            return;
        }

        // dagingnya (logic)
        try {
            // 3rd party API -- Google Gemini API
            const aiResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ]
            });

            res.status(200).json({
                succes: true,
                data: aiResponse.text,
                message: "Berhail ditanggapi dari AI"
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({
                succes: false,
                data: null,
                message: e.message || "Gagal mendapatkan tanggapan dari AI"
            });
        }
    }
);

// Entrypoint
app.listen(3000, () => {
    console.log("I LOVE YOU 3000");
});