export const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

export const itemVariants = {
	hidden: { y: 50, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: 'spring' as const,
			stiffness: 80,
			damping: 12,
		},
	},
};

export const floatingVariants = {
	animate: {
		y: [-10, 10, -10],
		transition: {
			duration: 6,
			repeat: Infinity,
			ease: 'easeInOut' as const,
		},
	},
};

export const featuresContent = [
	{
		icon: '📚',
		title: 'Recipe Library',
		description: 'Access thousands of tested recipes from around the world',
	},
	{
		icon: '👥',
		title: 'Community Driven',
		description:
			'Connect with fellow food enthusiasts and share your favorites',
	},
	{
		icon: '⭐',
		title: 'Smart Features',
		description:
			'Get personalized recommendations based on your taste preferences',
	},
];
