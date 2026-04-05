"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./utils/db");
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await db_1.db.$connect();
        console.log('Connected to Database');
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
});
