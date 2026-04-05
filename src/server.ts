import app from './app';
import { db } from './utils/db';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db.$connect();
        console.log('Connected to Database');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
});
