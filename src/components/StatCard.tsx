import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StatCardProps {
	icon: IconDefinition;
	label: string;
	value: string | number;
}

export default function StatCard({
	icon,
	label,
	value,
}: StatCardProps) {
	return (
		<div className="bg-muted rounded-lg p-4 text-center">
			<FontAwesomeIcon icon={icon} className="text-2xl mb-2 text-foreground" />
			<div className="text-xs text-muted mb-1">{label}</div>
			<div className="text-sm font-semibold text-foreground">{value}</div>
		</div>
	);
}