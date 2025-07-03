// The use server directive is required for all flow files.
'use server';

/**
 * @fileOverview Suggests subcategories for a given expense category to help users categorize their expenses more easily.
 *
 * - suggestSubcategories - A function that suggests subcategories for a given expense category.
 * - SuggestSubcategoriesInput - The input type for the suggestSubcategories function.
 * - SuggestSubcategoriesOutput - The return type for the suggestSubcategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSubcategoriesInputSchema = z.object({
  category: z.string().describe('The main category of the expense.'),
  description: z.string().describe('A description of the expense item.'),
  exampleSubcategories: z.array(z.string()).optional().describe('A list of example subcategories for the given category.'),
});
export type SuggestSubcategoriesInput = z.infer<typeof SuggestSubcategoriesInputSchema>;

const SuggestSubcategoriesOutputSchema = z.object({
  subcategories: z.array(z.string()).describe('A list of suggested subcategories for the given expense category.'),
});
export type SuggestSubcategoriesOutput = z.infer<typeof SuggestSubcategoriesOutputSchema>;

export async function suggestSubcategories(input: SuggestSubcategoriesInput): Promise<SuggestSubcategoriesOutput> {
  return suggestSubcategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSubcategoriesPrompt',
  input: {schema: SuggestSubcategoriesInputSchema},
  output: {schema: SuggestSubcategoriesOutputSchema},
  prompt: `You are an expert in personal finance and expense categorization.

  The user will provide you with an expense category and a description of the expense.
  You will suggest a list of subcategories that the expense could belong to.

  Category: {{{category}}}
  Description: {{{description}}}

  {{#if exampleSubcategories}}
  Here are some example subcategories for this category:
  {{#each exampleSubcategories}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Suggest a list of subcategories for this expense:
  `, 
});

const suggestSubcategoriesFlow = ai.defineFlow(
  {
    name: 'suggestSubcategoriesFlow',
    inputSchema: SuggestSubcategoriesInputSchema,
    outputSchema: SuggestSubcategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
