import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

export const formatTime = (value?: number, unit?: string) => {
	if (!value || !unit) return 'N/A';
	
	const unitMap: Record<string, string> = {
		'minutes': value === 1 ? 'min' : 'mins',
		'hours': value === 1 ? 'hr' : 'hrs', 
		'days': value === 1 ? 'day' : 'days'
	};
	
	return `${value} ${unitMap[unit] || unit}`;
};

// Legacy function for backward compatibility (converts minutes to readable format)
export const formatTimeMinutes = (minutes?: number) => {
	if (!minutes) return 'N/A';
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	if (hours > 0) return `${hours}h ${mins}m`;
	return `${mins}m`;
};

export const formatCategory = (category: string) => {
	const categoryMappings: Record<string, string> = {
		breakfast: '🌅 Breakfast',
		lunch: '🥪 Lunch',
		dinner: '🍽️ Dinner',
		dessert: '🍰 Dessert',
		appetizer: '🥗 Appetizer',
		snack: '🍿 Snack',
		soup: '🍜 Soup',
		beverage: '☕ Beverage',
		salad: '🥙 Salad',
		side_dish: '🍚 Side Dish',
	};

	return (
		categoryMappings[category.toLowerCase()] ||
		category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
	);
};

export const formatGender = (gender: string) => {
	switch (gender.toLowerCase()) {
		case 'male':
			return { label: 'Male', icon: faMars, color: '#3b82f6' };
		case 'female':
			return { label: 'Female', icon: faVenus, color: '#ec4899' };
		default:
			return { label: 'Other', icon: null };
	}
};

export const formatTimeAgo = (dateString: string) => {
	const now = new Date();
	const notificationDate = new Date(dateString);
	const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

	if (diffInSeconds < 60) return 'just now';
	if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
	if (diffInSeconds < 86400)
		return `${Math.floor(diffInSeconds / 3600)}h ago`;
	if (diffInSeconds < 604800)
		return `${Math.floor(diffInSeconds / 86400)}d ago`;

	return notificationDate.toLocaleDateString();
};
