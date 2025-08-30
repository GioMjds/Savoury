import { motion } from 'framer-motion';

interface TabButtonProps {
	active: boolean;
	onClick: () => void;
	icon: string;
	label: string;
}

export default function TabButton({
	active,
	onClick,
	icon,
	label,
}: TabButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
				active
					? 'text-primary bg-primary-lighter'
					: 'text-muted hover:text-foreground hover:bg-accent'
			}`}
		>
			<span>{icon}</span>
			<span>{label}</span>
			{active && (
				<motion.div
					layoutId="activeTab"
					className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
				/>
			)}
		</button>
	);
}
