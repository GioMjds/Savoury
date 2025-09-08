// Recipe Post form validation (to be passed in my current /new recipe post page)

// Time unit conversion utilities
export const convertToMinutes = (value: number, unit: 'minutes' | 'hours' | 'days'): number => {
  switch (unit) {
    case 'minutes': return value;
    case 'hours': return value * 60;
    case 'days': return value * 60 * 24;
    default: return value;
  }
}

export const convertFromMinutes = (minutes: number): { value: number; unit: 'minutes' | 'hours' | 'days' } => {
  if (minutes >= 1440) { // 24+ hours
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 
      ? { value: parseFloat(`${days}.${Math.round((remainingHours / 24) * 10)}`), unit: 'days' }
      : { value: days, unit: 'days' };
  } else if (minutes >= 60) { // 60+ minutes
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? { value: parseFloat(`${hours}.${Math.round((remainingMinutes / 60) * 10)}`), unit: 'hours' }
      : { value: hours, unit: 'hours' };
  } else {
    return { value: minutes, unit: 'minutes' };
  }
}

export const formatTimeDisplay = (value: number | null, unit: string | null): string => {
  if (!value || !unit) return 'N/A';
  
  const unitMap: Record<string, string> = {
    'minutes': value === 1 ? 'min' : 'mins',
    'hours': value === 1 ? 'hr' : 'hrs', 
    'days': value === 1 ? 'day' : 'days'
  };
  
  return `${value} ${unitMap[unit] || unit}`;
}

// Recipe form validation
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
}

export const validateIngredients = (ingredients: any[]) => {
  const errors: Record<string, string> = {};
  
  if (!ingredients || ingredients.length === 0) {
    errors.ingredients = 'At least one ingredient is required';
    return errors;
  }
  
  // Check if any valid ingredients exist (with ingredient_name)
  const validIngredients = ingredients.filter(
    ing => ing.ingredient_name && ing.ingredient_name.trim()
  );
  
  if (validIngredients.length === 0) {
    errors.ingredients = 'At least one valid ingredient is required';
  }
  
  // Validate individual ingredients
  ingredients.forEach((ingredient, index) => {
    if (ingredient.quantity && isNaN(Number(ingredient.quantity))) {
      errors[`ingredients.${index}.quantity`] = 'Quantity must be a number';
    }
    
    if (ingredient.quantity && !ingredient.unit) {
      errors[`ingredients.${index}.unit`] = 'Unit is required when quantity is specified';
    }
  });
  
  return errors;
}

export const validateInstructions = (instructions: any[]) => {
  const errors: Record<string, string> = {};
  
  if (!instructions || instructions.length === 0) {
    errors.instructions = 'At least one instruction step is required';
    return errors;
  }
  
  // Check if any valid instructions exist
  const validInstructions = instructions.filter(
    inst => inst.value && inst.value.trim()
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
      errors[`instructions.${index}.value`] = 'Instruction must be at least 5 characters';
    }
  });
  
  return errors;
}

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
      const prepTimeInMinutes = convertToMinutes(prepTimeValue, prepTimeUnit as 'minutes' | 'hours' | 'days');
      if (prepTimeInMinutes > 43200) { // 30 days
        errors.prep_time_value = 'Prep time exceeds maximum (30 days)';
      }
    }
    
    if (!prepTimeUnit) {
      errors.prep_time_unit = 'Time unit is required when time value is specified';
    }
  }
  
  // Cook time validation
  if (cookTimeValue !== undefined && cookTimeValue > 0) {
    if (cookTimeValue < 0) {
      errors.cook_time_value = 'Cook time cannot be negative';
    } else {
      const cookTimeInMinutes = convertToMinutes(cookTimeValue, cookTimeUnit as 'minutes' | 'hours' | 'days');
      if (cookTimeInMinutes > 43200) { // 30 days
        errors.cook_time_value = 'Cook time exceeds maximum (30 days)';
      }
    }
    
    if (!cookTimeUnit) {
      errors.cook_time_unit = 'Time unit is required when time value is specified';
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
}
