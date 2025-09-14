/**
 * Converts a time value to minutes from various time units.
 * 
 * This utility function standardizes time values by converting them to minutes,
 * which is useful for database storage and time calculations.
 * 
 * @param value - The numeric time value to convert
 * @param unit - The unit of time ('minutes', 'hours', or 'days')
 * @returns The time value converted to minutes
 * 
 * @example
 * ```typescript
 * // Convert 2 hours to minutes
 * const minutes = convertToMinutes(2, 'hours'); // Returns: 120
 * 
 * // Convert 1.5 days to minutes
 * const minutes = convertToMinutes(1.5, 'days'); // Returns: 2160
 * 
 * // Minutes remain unchanged
 * const minutes = convertToMinutes(30, 'minutes'); // Returns: 30
 * ```
 */
export const convertToMinutes = (
	value: number,
	unit: 'minutes' | 'hours' | 'days'
): number => {
	switch (unit) {
		case 'minutes':
			return value;
		case 'hours':
			return value * 60;
		case 'days':
			return value * 60 * 24;
		default:
			return value;
	}
};

/**
 * Converts minutes to the most appropriate time unit (minutes, hours, or days).
 * 
 * This function automatically determines the best unit representation for a given
 * number of minutes, making time values more human-readable.
 * 
 * @param minutes - The number of minutes to convert
 * @returns An object containing the converted value and appropriate unit
 * 
 * @example
 * ```typescript
 * // Short duration stays in minutes
 * const result = convertFromMinutes(45); 
 * // Returns: { value: 45, unit: 'minutes' }
 * 
 * // Medium duration converts to hours
 * const result = convertFromMinutes(120); 
 * // Returns: { value: 2, unit: 'hours' }
 * 
 * // Long duration converts to days
 * const result = convertFromMinutes(1440); 
 * // Returns: { value: 1, unit: 'days' }
 * 
 * // Fractional hours are handled
 * const result = convertFromMinutes(90); 
 * // Returns: { value: 1.5, unit: 'hours' }
 * ```
 */
export const convertFromMinutes = (
	minutes: number
): { value: number; unit: 'minutes' | 'hours' | 'days' } => {
	if (minutes >= 1440) {
		// 24+ hours
		const days = Math.floor(minutes / 1440);
		const remainingHours = Math.floor((minutes % 1440) / 60);
		return remainingHours > 0
			? {
					value: parseFloat(
						`${days}.${Math.round((remainingHours / 24) * 10)}`
					),
					unit: 'days',
			  }
			: { value: days, unit: 'days' };
	} else if (minutes >= 60) {
		// 60+ minutes
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes > 0
			? {
					value: parseFloat(
						`${hours}.${Math.round((remainingMinutes / 60) * 10)}`
					),
					unit: 'hours',
			  }
			: { value: hours, unit: 'hours' };
	} else {
		return { value: minutes, unit: 'minutes' };
	}
};

/**
 * Formats time values for user-friendly display.
 * 
 * This function takes a time value and unit and formats them into a readable string
 * with appropriate abbreviations and pluralization.
 * 
 * @param value - The numeric time value (can be null)
 * @param unit - The time unit string (can be null)
 * @returns A formatted string representation of the time, or 'N/A' if invalid
 * 
 * @example
 * ```typescript
 * // Single units use singular abbreviations
 * const display = formatTimeDisplay(1, 'minutes'); // Returns: "1 min"
 * const display = formatTimeDisplay(1, 'hours');   // Returns: "1 hr"
 * const display = formatTimeDisplay(1, 'days');    // Returns: "1 day"
 * 
 * // Multiple units use plural abbreviations
 * const display = formatTimeDisplay(30, 'minutes'); // Returns: "30 mins"
 * const display = formatTimeDisplay(2, 'hours');    // Returns: "2 hrs"
 * const display = formatTimeDisplay(3, 'days');     // Returns: "3 days"
 * 
 * // Invalid values return N/A
 * const display = formatTimeDisplay(null, 'minutes'); // Returns: "N/A"
 * const display = formatTimeDisplay(5, null);         // Returns: "N/A"
 * ```
 */
export const formatTimeDisplay = (
	value: number | null,
	unit: string | null
): string => {
	if (!value || !unit) return 'N/A';

	const unitMap: Record<string, string> = {
		minutes: value === 1 ? 'min' : 'mins',
		hours: value === 1 ? 'hr' : 'hrs',
		days: value === 1 ? 'day' : 'days',
	};

	return `${value} ${unitMap[unit] || unit}`;
};

// ========================================================================================
// RECIPE FORM VALIDATION FUNCTIONS
// ========================================================================================

/**
 * Validates the basic recipe form fields (title, description, category).
 * 
 * This function performs comprehensive validation on the core recipe information,
 * ensuring data quality and security before submission.
 * 
 * **Validation Rules:**
 * - **Title**: Required, 3-100 characters, alphanumeric with safe punctuation only
 * - **Description**: Required, 20-2000 characters
 * - **Category**: Required, must be selected
 * 
 * @param data - The recipe form data object
 * @param data.title - The recipe title
 * @param data.description - The recipe description
 * @param data.category - The recipe category
 * @returns An object mapping field names to error messages (empty if valid)
 * 
 * @example
 * ```typescript
 * // Valid recipe data
 * const validData = {
 *   title: "Grandma's Chocolate Chip Cookies",
 *   description: "These are the most delicious cookies you'll ever taste...",
 *   category: "dessert"
 * };
 * const errors = validateRecipeForm(validData);
 * // Returns: {} (no errors)
 * 
 * // Invalid recipe data
 * const invalidData = {
 *   title: "AB", // Too short
 *   description: "Short", // Too short
 *   category: "" // Missing
 * };
 * const errors = validateRecipeForm(invalidData);
 * // Returns: {
 * //   title: "Title must be at least 3 characters",
 * //   description: "Description must be at least 20 characters",
 * //   category: "Please select a category"
 * // }
 * 
 * // Check for errors before proceeding
 * if (Object.keys(errors).length > 0) {
 *   console.log("Validation failed:", errors);
 *   return;
 * }
 * ```
 */
export const validateRecipeForm = (data: any) => {
	const errors: Record<string, string> = {};

	// Title validation
	if (!data.title) {
		errors.title = 'Recipe title is required';
	} else if (data.title.length < 3) {
		errors.title = 'Title must be at least 3 characters';
	} else if (data.title.length > 100) {
		errors.title = 'Title must be less than 100 characters';
	} else if (!/^[a-zA-Z0-9\s.,!?&()'"-]+$/.test(data.title)) {
		errors.title = 'Title contains invalid characters';
	}

	// Description validation
	if (!data.description) {
		errors.description = 'Recipe description is required';
	} else if (data.description.length < 20) {
		errors.description = 'Description must be at least 20 characters';
	} else if (data.description.length > 2000) {
		errors.description = 'Description must be less than 2000 characters';
	}

	// Category validation
	if (!data.category) {
		errors.category = 'Please select a category';
	}

	return errors;
};

/**
 * Validates recipe ingredients array for completeness and data quality.
 * 
 * This function ensures that the recipe has valid ingredients with proper
 * quantity and unit specifications when provided.
 * 
 * **Validation Rules:**
 * - At least one ingredient with a valid name is required
 * - Quantity must be a valid number if provided
 * - Unit is required when quantity is specified
 * - Empty or whitespace-only ingredient names are ignored
 * 
 * @param ingredients - Array of ingredient objects
 * @param ingredients[].ingredient_name - The name of the ingredient
 * @param ingredients[].quantity - The quantity (optional, string or number)
 * @param ingredients[].unit - The measurement unit (optional)
 * @returns An object mapping field names to error messages (empty if valid)
 * 
 * @example
 * ```typescript
 * // Valid ingredients
 * const validIngredients = [
 *   { quantity: "2", unit: "cups", ingredient_name: "flour" },
 *   { quantity: "1", unit: "tsp", ingredient_name: "salt" },
 *   { quantity: "", unit: "", ingredient_name: "pepper to taste" }
 * ];
 * const errors = validateIngredients(validIngredients);
 * // Returns: {} (no errors)
 * 
 * // Invalid ingredients
 * const invalidIngredients = [
 *   { quantity: "abc", unit: "cups", ingredient_name: "flour" }, // Invalid quantity
 *   { quantity: "2", unit: "", ingredient_name: "sugar" }       // Missing unit
 * ];
 * const errors = validateIngredients(invalidIngredients);
 * // Returns: {
 * //   "ingredients.0.quantity": "Quantity must be a number",
 * //   "ingredients.1.unit": "Unit is required when quantity is specified"
 * // }
 * 
 * // Empty ingredients array
 * const errors = validateIngredients([]);
 * // Returns: { ingredients: "At least one ingredient is required" }
 * 
 * // Usage in form validation
 * const ingredientErrors = validateIngredients(formData.ingredients);
 * if (ingredientErrors.ingredients) {
 *   showError(ingredientErrors.ingredients);
 * }
 * // Check for individual field errors
 * Object.keys(ingredientErrors).forEach(key => {
 *   if (key.startsWith('ingredients.')) {
 *     showFieldError(key, ingredientErrors[key]);
 *   }
 * });
 * ```
 */
export const validateIngredients = (ingredients: any[]) => {
	const errors: Record<string, string> = {};

	if (!ingredients || ingredients.length === 0) {
		errors.ingredients = 'At least one ingredient is required';
		return errors;
	}

	// Check if any valid ingredients exist (with ingredient_name)
	const validIngredients = ingredients.filter(
		(ing) => ing.ingredient_name && ing.ingredient_name.trim()
	);

	if (validIngredients.length === 0) {
		errors.ingredients = 'At least one valid ingredient is required';
	}

	// Validate individual ingredients
	ingredients.forEach((ingredient, index) => {
		if (ingredient.quantity && isNaN(Number(ingredient.quantity))) {
			errors[`ingredients.${index}.quantity`] =
				'Quantity must be a number';
		}

		if (ingredient.quantity && !ingredient.unit) {
			errors[`ingredients.${index}.unit`] =
				'Unit is required when quantity is specified';
		}
	});

	return errors;
};

/**
 * Validates recipe instruction steps for completeness and quality.
 * 
 * This function ensures that the recipe has clear, detailed instructions
 * that are helpful for users following the recipe.
 * 
 * **Validation Rules:**
 * - At least one instruction with valid text is required
 * - Individual instructions must be at least 5 characters long
 * - Maximum of 30 instruction steps allowed
 * - Empty or whitespace-only instructions are ignored
 * 
 * @param instructions - Array of instruction objects
 * @param instructions[].value - The instruction text
 * @returns An object mapping field names to error messages (empty if valid)
 * 
 * @example
 * ```typescript
 * // Valid instructions
 * const validInstructions = [
 *   { value: "Preheat oven to 350°F" },
 *   { value: "Mix all dry ingredients in a large bowl" },
 *   { value: "Bake for 25-30 minutes until golden brown" }
 * ];
 * const errors = validateInstructions(validInstructions);
 * // Returns: {} (no errors)
 * 
 * // Invalid instructions
 * const invalidInstructions = [
 *   { value: "Mix" }, // Too short
 *   { value: "" }     // Empty
 * ];
 * const errors = validateInstructions(invalidInstructions);
 * // Returns: {
 * //   instructions: "At least one valid instruction step is required",
 * //   "instructions.0.value": "Instruction must be at least 5 characters"
 * // }
 * 
 * // Too many instructions
 * const tooManyInstructions = Array(31).fill({ value: "Valid instruction step" });
 * const errors = validateInstructions(tooManyInstructions);
 * // Returns: { instructions: "Maximum of 30 instruction steps allowed" }
 * 
 * // Usage in form validation
 * const instructionErrors = validateInstructions(formData.instructions);
 * if (instructionErrors.instructions) {
 *   showError(instructionErrors.instructions);
 * }
 * // Handle individual step errors
 * Object.keys(instructionErrors).forEach(key => {
 *   if (key.startsWith('instructions.') && key.includes('.value')) {
 *     const stepIndex = key.split('.')[1];
 *     showStepError(stepIndex, instructionErrors[key]);
 *   }
 * });
 * ```
 */
export const validateInstructions = (instructions: any[]) => {
	const errors: Record<string, string> = {};

	if (!instructions || instructions.length === 0) {
		errors.instructions = 'At least one instruction step is required';
		return errors;
	}

	// Check if any valid instructions exist
	const validInstructions = instructions.filter(
		(inst) => inst.value && inst.value.trim()
	);

	if (validInstructions.length === 0) {
		errors.instructions = 'At least one valid instruction step is required';
	}

	// Maximum reasonable number of steps
	if (instructions.length > 30) {
		errors.instructions = 'Maximum of 30 instruction steps allowed';
	}

	// Validate individual instructions
	instructions.forEach((instruction, index) => {
		if (instruction.value && instruction.value.trim().length < 5) {
			errors[`instructions.${index}.value`] =
				'Instruction must be at least 5 characters';
		}
	});

	return errors;
};

/**
 * Validates preparation time, cooking time, and servings for a recipe.
 *
 * This function validates time and serving information to ensure realistic
 * and practical recipe specifications. It helps maintain data quality and
 * provides meaningful constraints for recipe creation.
 * 
 * **Validation Rules:**
 * - **Time Values**: Only positive values (> 0) are validated; zero/negative values are ignored
 * - **Time Units**: Required when corresponding time value is provided
 * - **Maximum Time**: 30 days (43,200 minutes) per time field
 * - **Servings**: Must be between 1 and 100 (inclusive)
 *
 * **Important Notes:**
 * - This function only validates positive time values (> 0)
 * - Zero or negative time values are considered "not specified" and skip validation
 * - Time limits help prevent unrealistic recipe specifications
 * - All parameters are optional; validation only occurs when values are provided
 *
 * @param prepTimeValue - The numeric value for preparation time (optional)
 * @param prepTimeUnit - The unit for preparation time ('minutes', 'hours', or 'days'; optional)
 * @param cookTimeValue - The numeric value for cooking time (optional)
 * @param cookTimeUnit - The unit for cooking time ('minutes', 'hours', or 'days'; optional)
 * @param servings - The number of servings (optional)
 * @returns An object containing error messages for invalid fields (empty if all valid)
 *
 * @example
 * ```typescript
 * // Valid time and servings
 * const errors = validateTimeAndServings(30, 'minutes', 45, 'minutes', 4);
 * // Returns: {} (no errors)
 * 
 * // Missing time units
 * const errors = validateTimeAndServings(30, undefined, 45, undefined, 4);
 * // Returns: {
 * //   prep_time_unit: "Time unit is required when time value is specified",
 * //   cook_time_unit: "Time unit is required when time value is specified"
 * // }
 * 
 * // Excessive time values
 * const errors = validateTimeAndServings(31, 'days', 32, 'days', 150);
 * // Returns: {
 * //   prep_time_value: "Prep time exceeds maximum (30 days)",
 * //   cook_time_value: "Cook time exceeds maximum (30 days)",
 * //   servings: "Servings value seems unrealistic (max 100)"
 * // }
 * 
 * // Invalid servings
 * const errors = validateTimeAndServings(undefined, undefined, undefined, undefined, 0);
 * // Returns: { servings: "Servings must be at least 1" }
 * 
 * // Zero/negative times are not validated (considered not specified)
 * const errors = validateTimeAndServings(0, 'minutes', -5, 'hours', 4);
 * // Returns: {} (no errors - zero/negative times are ignored)
 * 
 * // Complete validation example
 * const formData = {
 *   prepTime: 30,
 *   prepUnit: 'minutes',
 *   cookTime: 45,
 *   cookUnit: 'minutes',
 *   servings: 6
 * };
 * 
 * const timeErrors = validateTimeAndServings(
 *   formData.prepTime,
 *   formData.prepUnit,
 *   formData.cookTime,
 *   formData.cookUnit,
 *   formData.servings
 * );
 * 
 * if (Object.keys(timeErrors).length > 0) {
 *   // Handle validation errors
 *   Object.keys(timeErrors).forEach(field => {
 *     showFieldError(field, timeErrors[field]);
 *   });
 *   return false;
 * }
 * 
 * // Validation passed, proceed with form submission
 * return true;
 * ```
 */
export const validateTimeAndServings = (
	prepTimeValue?: number,
	prepTimeUnit?: string,
	cookTimeValue?: number,
	cookTimeUnit?: string,
	servings?: number
) => {
	const errors: Record<string, string> = {};

	// Prep time validation
	if (prepTimeValue !== undefined && prepTimeValue > 0) {
		if (prepTimeValue < 0) {
			errors.prep_time_value = 'Prep time cannot be negative';
		} else {
			const prepTimeInMinutes = convertToMinutes(
				prepTimeValue,
				prepTimeUnit as 'minutes' | 'hours' | 'days'
			);
			if (prepTimeInMinutes > 43200) {
				// 30 days
				errors.prep_time_value = 'Prep time exceeds maximum (30 days)';
			}
		}

		if (!prepTimeUnit) {
			errors.prep_time_unit =
				'Time unit is required when time value is specified';
		}
	}

	// Cook time validation
	if (cookTimeValue !== undefined && cookTimeValue > 0) {
		if (cookTimeValue < 0) {
			errors.cook_time_value = 'Cook time cannot be negative';
		} else {
			const cookTimeInMinutes = convertToMinutes(
				cookTimeValue,
				cookTimeUnit as 'minutes' | 'hours' | 'days'
			);
			if (cookTimeInMinutes > 43200) {
				// 30 days
				errors.cook_time_value = 'Cook time exceeds maximum (30 days)';
			}
		}

		if (!cookTimeUnit) {
			errors.cook_time_unit =
				'Time unit is required when time value is specified';
		}
	}

	// Servings validation
	if (servings !== undefined) {
		if (servings <= 0) {
			errors.servings = 'Servings must be at least 1';
		} else if (servings > 100) {
			errors.servings = 'Servings value seems unrealistic (max 100)';
		}
	}

	return errors;
};