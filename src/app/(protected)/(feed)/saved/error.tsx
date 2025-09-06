'use client';

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
	return (
		<div>
			<h1>Error Occurred</h1>
			<p>{error.message}</p>
			<button onClick={reset}>Try Again</button>
		</div>
	);
}
