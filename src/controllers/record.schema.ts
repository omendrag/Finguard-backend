import z from 'zod';

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(1),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    notes: z.string().optional()
  })
});

export const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().min(1).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").optional(),
    notes: z.string().optional()
  })
});

export const filterRecordSchema = z.object({
  query: z.object({
    type: z.enum(['INCOME', 'EXPENSE']).optional(),
    category: z.string().optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").optional(),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date format").optional(),
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional()
  })
});
