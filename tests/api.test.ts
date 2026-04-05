import supertest from 'supertest';
import app from '../src/app';
import { db } from '../src/utils/db';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

const request = supertest(app);

describe('Finance Data Processing API', () => {
    let adminToken = '';
    let viewerToken = '';
    let recordId = '';

    beforeAll(async () => {
        // Clear DB for a clean slate
        await db.financialRecord.deleteMany();
        await db.user.deleteMany();

        // Create Admin
        await request.post('/api/auth/register').send({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN'
        });
        
        const loginRes = await request.post('/api/auth/login').send({
            email: 'admin@example.com',
            password: 'password123'
        });
        adminToken = loginRes.body.data.token;

        // Create Viewer
        await request.post('/api/auth/register').send({
            name: 'Viewer User',
            email: 'viewer@example.com',
            password: 'password123',
            role: 'VIEWER'
        });
        
        const viewerLogin = await request.post('/api/auth/login').send({
            email: 'viewer@example.com',
            password: 'password123'
        });
        viewerToken = viewerLogin.body.data.token;
    });

    afterAll(async () => {
        await db.financialRecord.deleteMany();
        await db.user.deleteMany();
        await db.$disconnect();
    });

    it('should prevent VIEWER from creating a record', async () => {
        const res = await request.post('/api/records')
            .set('Authorization', `Bearer ${viewerToken}`)
            .send({
                amount: 1500,
                type: 'INCOME',
                category: 'Salary',
                date: '2023-10-01'
            });
        
        expect(res.status).toBe(403);
    });

    it('should allow ADMIN to create a record', async () => {
        const res = await request.post('/api/records')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                amount: 1500,
                type: 'INCOME',
                category: 'Salary',
                date: '2023-10-01',
                notes: 'October Salary'
            });

        expect(res.status).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        recordId = res.body.data.id;
    });

    it('should validate inputs using Zod', async () => {
        const res = await request.post('/api/records')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                amount: -500, // Invalid: must be positive
                type: 'INVALID_TYPE',
                category: '',
                date: 'not-a-date'
            });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe('fail');
        const validationErrors = res.body.errors || res.body.issues;
        expect(Array.isArray(validationErrors)).toBe(true);
        expect(validationErrors.length).toBeGreaterThan(0);
    });

    it('should get analytics summary for ADMIN', async () => {
        // Add expense
        await request.post('/api/records')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                amount: 500,
                type: 'EXPENSE',
                category: 'Groceries',
                date: '2023-10-05'
            });

        const res = await request.get('/api/analytics/summary')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.totalIncome).toBe(1500);
        expect(res.body.data.totalExpenses).toBe(500);
        expect(res.body.data.netBalance).toBe(1000);
    });

    it('should prevent VIEWER from getting analytics summary', async () => {
        const res = await request.get('/api/analytics/summary')
            .set('Authorization', `Bearer ${viewerToken}`);

        expect(res.status).toBe(403);
    });
});
