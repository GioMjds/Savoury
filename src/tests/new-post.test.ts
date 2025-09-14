import {
	convertToMinutes,
	convertFromMinutes,
	formatTimeDisplay,
	validateRecipeForm,
	validateIngredients,
	validateInstructions,
	validateTimeAndServings,
} from '@/utils/validation';

describe('Time Conversion Utilities', () => {
	describe('convertToMinutes', () => {
		it('should convert minutes correctly', () => {
			expect(convertToMinutes(30, 'minutes')).toBe(30);
			expect(convertToMinutes(0, 'minutes')).toBe(0);
			expect(convertToMinutes(60, 'minutes')).toBe(60);
		});

		it('should convert hours to minutes correctly', () => {
			expect(convertToMinutes(1, 'hours')).toBe(60);
			expect(convertToMinutes(2, 'hours')).toBe(120);
			expect(convertToMinutes(0.5, 'hours')).toBe(30);
		});

		it('should convert days to minutes correctly', () => {
			expect(convertToMinutes(1, 'days')).toBe(1440);
			expect(convertToMinutes(2, 'days')).toBe(2880);
			expect(convertToMinutes(0.5, 'days')).toBe(720);
		});

		it('should handle edge cases', () => {
			expect(convertToMinutes(0, 'hours')).toBe(0);
			expect(convertToMinutes(0, 'days')).toBe(0);
		});
	});

	describe('convertFromMinutes', () => {
		it('should convert minutes to appropriate units', () => {
			expect(convertFromMinutes(30)).toEqual({ value: 30, unit: 'minutes' });
			expect(convertFromMinutes(45)).toEqual({ value: 45, unit: 'minutes' });
			expect(convertFromMinutes(59)).toEqual({ value: 59, unit: 'minutes' });
		});

		it('should convert to hours when >= 60 minutes', () => {
			expect(convertFromMinutes(60)).toEqual({ value: 1, unit: 'hours' });
			expect(convertFromMinutes(120)).toEqual({ value: 2, unit: 'hours' });
			expect(convertFromMinutes(90)).toEqual({ value: 1.5, unit: 'hours' });
		});

		it('should convert to days when >= 1440 minutes', () => {
			expect(convertFromMinutes(1440)).toEqual({ value: 1, unit: 'days' });
			expect(convertFromMinutes(2880)).toEqual({ value: 2, unit: 'days' });
			expect(convertFromMinutes(1500)).toEqual({ value: 1.0, unit: 'days' });
		});

		it('should handle edge cases', () => {
			expect(convertFromMinutes(0)).toEqual({ value: 0, unit: 'minutes' });
			expect(convertFromMinutes(1)).toEqual({ value: 1, unit: 'minutes' });
		});
	});

	describe('formatTimeDisplay', () => {
		it('should format time correctly', () => {
			expect(formatTimeDisplay(1, 'minutes')).toBe('1 min');
			expect(formatTimeDisplay(2, 'minutes')).toBe('2 mins');
			expect(formatTimeDisplay(1, 'hours')).toBe('1 hr');
			expect(formatTimeDisplay(2, 'hours')).toBe('2 hrs');
			expect(formatTimeDisplay(1, 'days')).toBe('1 day');
			expect(formatTimeDisplay(2, 'days')).toBe('2 days');
		});

		it('should handle null/undefined values', () => {
			expect(formatTimeDisplay(null, 'minutes')).toBe('N/A');
			expect(formatTimeDisplay(1, null)).toBe('N/A');
			expect(formatTimeDisplay(null, null)).toBe('N/A');
		});

		it('should handle unknown units', () => {
			expect(formatTimeDisplay(1, 'unknown')).toBe('1 unknown');
		});
	});
});

describe('Recipe Form Validation', () => {
	describe('validateRecipeForm', () => {
		it('should validate valid recipe data', () => {
			const validData = {
				title: 'Delicious Pasta Recipe',
				description: 'This is a wonderful pasta recipe that everyone will love. It takes about 30 minutes to prepare.',
				category: 'dinner',
			};

			const errors = validateRecipeForm(validData);
			expect(Object.keys(errors)).toHaveLength(0);
		});

		describe('title validation', () => {
			it('should require title', () => {
				const data = {
					description: 'Valid description that is long enough',
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.title).toBe('Recipe title is required');
			});

			it('should require minimum title length', () => {
				const data = {
					title: 'AB',
					description: 'Valid description that is long enough',
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.title).toBe('Title must be at least 3 characters');
			});

			it('should enforce maximum title length', () => {
				const data = {
					title: 'A'.repeat(101),
					description: 'Valid description that is long enough',
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.title).toBe('Title must be less than 100 characters');
			});

			it('should reject invalid characters in title', () => {
				const data = {
					title: 'Recipe with <script>alert("xss")</script>',
					description: 'Valid description that is long enough',
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.title).toBe('Title contains invalid characters');
			});

			it('should allow valid characters in title', () => {
				const data = {
					title: "Grandma's Famous Chocolate Chip Cookies (Best Recipe!)",
					description: 'Valid description that is long enough',
					category: 'dessert',
				};

				const errors = validateRecipeForm(data);
				expect(errors.title).toBeUndefined();
			});
		});

		describe('description validation', () => {
			it('should require description', () => {
				const data = {
					title: 'Valid Title',
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.description).toBe('Recipe description is required');
			});

			it('should require minimum description length', () => {
				const data = {
					title: 'Valid Title',
					description: 'Too short',
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.description).toBe('Description must be at least 20 characters');
			});

			it('should enforce maximum description length', () => {
				const data = {
					title: 'Valid Title',
					description: 'A'.repeat(2001),
					category: 'dinner',
				};

				const errors = validateRecipeForm(data);
				expect(errors.description).toBe('Description must be less than 2000 characters');
			});
		});

		describe('category validation', () => {
			it('should require category', () => {
				const data = {
					title: 'Valid Title',
					description: 'Valid description that is long enough',
				};

				const errors = validateRecipeForm(data);
				expect(errors.category).toBe('Please select a category');
			});

			it('should accept valid category', () => {
				const data = {
					title: 'Valid Title',
					description: 'Valid description that is long enough',
					category: 'breakfast',
				};

				const errors = validateRecipeForm(data);
				expect(errors.category).toBeUndefined();
			});
		});
	});
});

describe('Ingredients Validation', () => {
	describe('validateIngredients', () => {
		it('should validate valid ingredients', () => {
			const validIngredients = [
				{ quantity: '2', unit: 'cups', ingredient_name: 'flour' },
				{ quantity: '1', unit: 'tsp', ingredient_name: 'salt' },
				{ quantity: '', unit: '', ingredient_name: 'pepper to taste' },
			];

			const errors = validateIngredients(validIngredients);
			expect(Object.keys(errors)).toHaveLength(0);
		});

		it('should require at least one ingredient', () => {
			const errors = validateIngredients([]);
			expect(errors.ingredients).toBe('At least one ingredient is required');
		});

		it('should handle null/undefined ingredients', () => {
			const errors = validateIngredients(null as any);
			expect(errors.ingredients).toBe('At least one ingredient is required');
		});

		it('should require at least one valid ingredient', () => {
			const invalidIngredients = [
				{ quantity: '2', unit: 'cups', ingredient_name: '' },
				{ quantity: '1', unit: 'tsp', ingredient_name: '   ' },
			];

			const errors = validateIngredients(invalidIngredients);
			expect(errors.ingredients).toBe('At least one valid ingredient is required');
		});

		it('should validate quantity as number', () => {
			const ingredients = [
				{ quantity: 'invalid', unit: 'cups', ingredient_name: 'flour' },
				{ quantity: '2', unit: 'tsp', ingredient_name: 'salt' },
			];

			const errors = validateIngredients(ingredients);
			expect(errors['ingredients.0.quantity']).toBe('Quantity must be a number');
		});

		it('should require unit when quantity is specified', () => {
			const ingredients = [
				{ quantity: '2', unit: '', ingredient_name: 'flour' },
			];

			const errors = validateIngredients(ingredients);
			expect(errors['ingredients.0.unit']).toBe('Unit is required when quantity is specified');
		});

		it('should allow ingredients without quantity and unit', () => {
			const ingredients = [
				{ quantity: '', unit: '', ingredient_name: 'salt to taste' },
			];

			const errors = validateIngredients(ingredients);
			expect(Object.keys(errors)).toHaveLength(0);
		});
	});
});

describe('Instructions Validation', () => {
	describe('validateInstructions', () => {
		it('should validate valid instructions', () => {
			const validInstructions = [
				{ value: 'Preheat oven to 350°F' },
				{ value: 'Mix all dry ingredients in a large bowl' },
				{ value: 'Bake for 25-30 minutes until golden brown' },
			];

			const errors = validateInstructions(validInstructions);
			expect(Object.keys(errors)).toHaveLength(0);
		});

		it('should require at least one instruction', () => {
			const errors = validateInstructions([]);
			expect(errors.instructions).toBe('At least one instruction step is required');
		});

		it('should handle null/undefined instructions', () => {
			const errors = validateInstructions(null as any);
			expect(errors.instructions).toBe('At least one instruction step is required');
		});

		it('should require at least one valid instruction', () => {
			const invalidInstructions = [
				{ value: '' },
				{ value: '   ' },
			];

			const errors = validateInstructions(invalidInstructions);
			expect(errors.instructions).toBe('At least one valid instruction step is required');
		});

		it('should enforce maximum number of instructions', () => {
			const tooManyInstructions = Array(31).fill({ value: 'Valid instruction step' });

			const errors = validateInstructions(tooManyInstructions);
			expect(errors.instructions).toBe('Maximum of 30 instruction steps allowed');
		});

		it('should validate minimum instruction length', () => {
			const instructions = [
				{ value: 'Mix' }, // Too short
				{ value: 'This is a valid instruction' },
			];

			const errors = validateInstructions(instructions);
			expect(errors['instructions.0.value']).toBe('Instruction must be at least 5 characters');
		});

		it('should allow exactly 30 instructions', () => {
			const maxInstructions = Array(30).fill({ value: 'Valid instruction step' });

			const errors = validateInstructions(maxInstructions);
			expect(errors.instructions).toBeUndefined();
		});
	});
});

describe('Time and Servings Validation', () => {
	describe('validateTimeAndServings', () => {
		it('should validate valid time and servings data', () => {
			const errors = validateTimeAndServings(30, 'minutes', 45, 'minutes', 4);
			expect(Object.keys(errors)).toHaveLength(0);
		});

		describe('prep time validation', () => {
			it('should allow negative prep time (not validated)', () => {
				const errors = validateTimeAndServings(-10, 'minutes');
				expect(errors.prep_time_value).toBeUndefined();
			});

			it('should reject excessive prep time', () => {
				const errors = validateTimeAndServings(31, 'days'); // > 30 days
				expect(errors.prep_time_value).toBe('Prep time exceeds maximum (30 days)');
			});

			it('should require unit when prep time value is provided', () => {
				const errors = validateTimeAndServings(30, undefined);
				expect(errors.prep_time_unit).toBe('Time unit is required when time value is specified');
			});

			it('should allow zero prep time', () => {
				const errors = validateTimeAndServings(0, 'minutes');
				expect(errors.prep_time_value).toBeUndefined();
			});

			it('should allow maximum prep time (30 days)', () => {
				const errors = validateTimeAndServings(30, 'days');
				expect(errors.prep_time_value).toBeUndefined();
			});

			it('should validate only positive prep time values', () => {
				const errors = validateTimeAndServings(15, 'minutes');
				expect(errors.prep_time_value).toBeUndefined();
			});
		});

		describe('cook time validation', () => {
			it('should allow negative cook time (not validated)', () => {
				const errors = validateTimeAndServings(undefined, undefined, -15, 'minutes');
				expect(errors.cook_time_value).toBeUndefined();
			});

			it('should reject excessive cook time', () => {
				const errors = validateTimeAndServings(undefined, undefined, 31, 'days');
				expect(errors.cook_time_value).toBe('Cook time exceeds maximum (30 days)');
			});

			it('should require unit when cook time value is provided', () => {
				const errors = validateTimeAndServings(undefined, undefined, 45, undefined);
				expect(errors.cook_time_unit).toBe('Time unit is required when time value is specified');
			});

			it('should allow zero cook time', () => {
				const errors = validateTimeAndServings(undefined, undefined, 0, 'minutes');
				expect(errors.cook_time_value).toBeUndefined();
			});

			it('should validate only positive cook time values', () => {
				const errors = validateTimeAndServings(undefined, undefined, 20, 'minutes');
				expect(errors.cook_time_value).toBeUndefined();
			});
		});

		describe('servings validation', () => {
			it('should reject zero or negative servings', () => {
				const errors1 = validateTimeAndServings(undefined, undefined, undefined, undefined, 0);
				expect(errors1.servings).toBe('Servings must be at least 1');

				const errors2 = validateTimeAndServings(undefined, undefined, undefined, undefined, -2);
				expect(errors2.servings).toBe('Servings must be at least 1');
			});

			it('should reject unrealistic servings', () => {
				const errors = validateTimeAndServings(undefined, undefined, undefined, undefined, 101);
				expect(errors.servings).toBe('Servings value seems unrealistic (max 100)');
			});

			it('should allow valid servings', () => {
				const errors1 = validateTimeAndServings(undefined, undefined, undefined, undefined, 1);
				expect(errors1.servings).toBeUndefined();

				const errors2 = validateTimeAndServings(undefined, undefined, undefined, undefined, 50);
				expect(errors2.servings).toBeUndefined();

				const errors3 = validateTimeAndServings(undefined, undefined, undefined, undefined, 100);
				expect(errors3.servings).toBeUndefined();
			});
		});

		it('should handle undefined values gracefully', () => {
			const errors = validateTimeAndServings();
			expect(Object.keys(errors)).toHaveLength(0);
		});

		it('should validate multiple fields simultaneously', () => {
			const errors = validateTimeAndServings(5, undefined, 31, 'days', 0);
			expect(errors.prep_time_unit).toBe('Time unit is required when time value is specified');
			expect(errors.cook_time_value).toBe('Cook time exceeds maximum (30 days)');
			expect(errors.servings).toBe('Servings must be at least 1');
		});
	});
});

describe('Integration Tests', () => {
	describe('Complete recipe validation', () => {
		it('should validate a complete valid recipe', () => {
			const recipeData = {
				title: 'Classic Chocolate Chip Cookies',
				description: 'These are the best chocolate chip cookies you will ever taste. Crispy on the outside, chewy on the inside.',
				category: 'dessert',
			};

			const ingredients = [
				{ quantity: '2', unit: 'cups', ingredient_name: 'all-purpose flour' },
				{ quantity: '1', unit: 'tsp', ingredient_name: 'baking soda' },
				{ quantity: '1', unit: 'cup', ingredient_name: 'butter' },
				{ quantity: '2', unit: 'cups', ingredient_name: 'chocolate chips' },
			];

			const instructions = [
				{ value: 'Preheat oven to 375°F (190°C)' },
				{ value: 'Mix flour and baking soda in a bowl' },
				{ value: 'Cream butter and sugars until fluffy' },
				{ value: 'Combine wet and dry ingredients' },
				{ value: 'Fold in chocolate chips' },
				{ value: 'Drop onto baking sheet and bake for 9-11 minutes' },
			];

			const formErrors = validateRecipeForm(recipeData);
			const ingredientErrors = validateIngredients(ingredients);
			const instructionErrors = validateInstructions(instructions);
			const timeErrors = validateTimeAndServings(15, 'minutes', 10, 'minutes', 24);

			expect(Object.keys(formErrors)).toHaveLength(0);
			expect(Object.keys(ingredientErrors)).toHaveLength(0);
			expect(Object.keys(instructionErrors)).toHaveLength(0);
			expect(Object.keys(timeErrors)).toHaveLength(0);
		});

		it('should collect all validation errors', () => {
			const recipeData = {
				title: 'AB', // Too short
				description: 'Short', // Too short
				category: '', // Missing
			};

			const ingredients = [
				{ quantity: 'invalid', unit: '', ingredient_name: '' }, // Multiple errors
			];

			const instructions = [
				{ value: 'Mix' }, // Too short
			];

			const formErrors = validateRecipeForm(recipeData);
			const ingredientErrors = validateIngredients(ingredients);
			const instructionErrors = validateInstructions(instructions);
			const timeErrors = validateTimeAndServings(10, undefined, undefined, undefined, 0);

			expect(formErrors.title).toBeDefined();
			expect(formErrors.description).toBeDefined();
			expect(formErrors.category).toBeDefined();
			expect(ingredientErrors.ingredients).toBeDefined();
			expect(ingredientErrors['ingredients.0.quantity']).toBeDefined();
			expect(instructionErrors['instructions.0.value']).toBeDefined();
			expect(timeErrors.prep_time_unit).toBeDefined();
			expect(timeErrors.servings).toBeDefined();
		});
	});
});