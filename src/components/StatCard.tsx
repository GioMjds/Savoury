interface StatCardProps {
	icon: string;
	label: string;
	value: string;
}

export default function StatCard({
	icon,
	label,
	value,
}: StatCardProps) {
	return (
		<div className="bg-muted rounded-lg p-4 text-center">
			<div className="text-2xl mb-2">{icon}</div>
			<div className="text-xs text-muted mb-1">{label}</div>
			<div className="text-sm font-semibold text-foreground">{value}</div>
		</div>
	);
}