'use server';

/**
 * @fileOverview AI-powered tool to discover spending patterns in user expenses.
 *
 * - discoverExpensePatterns - A function that analyzes expense data and suggests spending patterns.
 * - DiscoverExpensePatternsInput - The input type for the discoverExpensePatterns function.
 * - DiscoverExpensePatternsOutput - The return type for the discoverExpensePatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverExpensePatternsInputSchema = z.object({
  expenses: z
    .string()
    .describe('JSON string of an array of expense objects, each with category, subcategory, payment method, amount, and date.'),
});
export type DiscoverExpensePatternsInput = z.infer<
  typeof DiscoverExpensePatternsInputSchema
>;

const DiscoverExpensePatternsOutputSchema = z.object({
  patterns: z
    .string()
    .describe('A summary of discovered spending patterns in the user expenses.'),
});
export type DiscoverExpensePatternsOutput = z.infer<
  typeof DiscoverExpensePatternsOutputSchema
>;

export async function discoverExpensePatterns(
  input: DiscoverExpensePatternsInput
): Promise<DiscoverExpensePatternsOutput> {
  return discoverExpensePatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'discoverExpensePatternsPrompt',
  input: {schema: DiscoverExpensePatternsInputSchema},
  output: {schema: DiscoverExpensePatternsOutputSchema},
  prompt: `You are a personal finance expert. Analyze the following expenses and identify any spending patterns.

Expenses: {{{expenses}}}

Provide a concise summary of the identified spending patterns.`,
});

const discoverExpensePatternsFlow = ai.defineFlow(
  {
    name: 'discoverExpensePatternsFlow',
    inputSchema: DiscoverExpensePatternsInputSchema,
    outputSchema: DiscoverExpensePatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
