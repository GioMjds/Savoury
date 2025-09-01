import { faMars, faVenus } from "@fortawesome/free-solid-svg-icons";

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatTime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

export const formatCategory = (category: string) => {
    const categoryMappings: Record<string, string> = {
        'breakfast': '🌅 Breakfast',
        'lunch': '🥪 Lunch', 
        'dinner': '🍽️ Dinner',
        'dessert': '🍰 Dessert',
        'appetizer': '🥗 Appetizer',
        'snack': '🍿 Snack',
        'soup': '🍜 Soup',
        'beverage': '☕ Beverage',
        'salad': '🥙 Salad',
        'side_dish': '🍚 Side Dish'
    };

    return categoryMappings[category.toLowerCase()] || category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export const formatGender = (gender: string) => {
    switch (gender.toLowerCase()) {
        case 'male':
            return { label: 'Male', icon: faMars, color: '#3b82f6' };
        case 'female':
            return { label: 'Female', icon: faVenus, color: '#ec4899' };
        default:
            return { label: 'Other', icon: null };
    }
}