export default function Loading() {
	return (
		<div className="min-h-screen bg-muted">
			<div className="max-w-6xl mx-auto px-4 py-8">
				<div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
					<div className="h-64 md:h-96 bg-accent animate-pulse" />
					<div className="p-6">
						<div className="h-8 bg-accent rounded animate-pulse mb-4" />
						<div className="flex items-center gap-4 mb-4">
							<div className="w-12 h-12 rounded-full bg-accent animate-pulse" />
							<div className="space-y-2">
								<div className="h-4 w-32 bg-accent rounded animate-pulse" />
								<div className="h-3 w-24 bg-accent rounded animate-pulse" />
							</div>
						</div>
						<div className="h-20 bg-accent rounded animate-pulse mb-6" />
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="h-16 bg-accent rounded animate-pulse"
								/>
							))}
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 h-96 bg-white rounded-xl shadow-lg animate-pulse" />
					<div className="lg:col-span-1 h-96 bg-white rounded-xl shadow-lg animate-pulse" />
				</div>
			</div>
		</div>
	);
}
