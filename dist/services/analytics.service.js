"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const db_1 = require("../utils/db");
const getDashboardSummary = async () => {
    const records = await db_1.db.financialRecord.findMany();
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals = {};
    records.forEach((record) => {
        if (record.type === 'INCOME') {
            totalIncome += record.amount;
        }
        else if (record.type === 'EXPENSE') {
            totalExpenses += record.amount;
        }
        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
    });
    const netBalance = totalIncome - totalExpenses;
    // Recent activity (last 5 records)
    const recentActivity = await db_1.db.financialRecord.findMany({
        orderBy: { date: 'desc' },
        take: 5
    });
    return {
        totalIncome,
        totalExpenses,
        netBalance,
        categoryTotals,
        recentActivity
    };
};
exports.getDashboardSummary = getDashboardSummary;
