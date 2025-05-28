import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';

    dotenv.config();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Hello from ESModule Express!');
    });

    const PORT = process.env.HTTP_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
    