import { db } from '../utils/db';

export const getDashboardSummary = async () => {
    const records = await db.financialRecord.findMany();

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};

    records.forEach((record: any) => {
        if (record.type === 'INCOME') {
            totalIncome += record.amount;
        } else if (record.type === 'EXPENSE') {
            totalExpenses += record.amount;
        }

        categoryTotals[record.category] = (categoryTotals[record.category] || 0) + record.amount;
    });

    const netBalance = totalIncome - totalExpenses;

    // Recent activity (last 5 records)
    const recentActivity = await db.financialRecord.findMany({
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
