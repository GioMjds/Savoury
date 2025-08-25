'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { FC, MouseEvent, useCallback } from 'react';

interface ModalProps {
	title: string;
	description: string;
	onCancel: () => void;
	onConfirm: () => void;
	cancelText: string;
	confirmText: string;
	className?: string;
	isOpen: boolean;
	loading: boolean;
	loadingText: string;
}

const Modal: FC<ModalProps> = ({
	title,
	description,
	onCancel,
	onConfirm,
	cancelText,
	confirmText,
	className,
	isOpen,
	loading,
	loadingText,
}) => {
	const handleCancel = useCallback(() => {
		onCancel();
	}, [onCancel]);

	const handleConfirm = useCallback(() => {
		onConfirm();
	}, [onConfirm]);

	const handleBackdropClick = (e: MouseEvent) => {
		if (e.target === e.currentTarget) handleCancel();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence mode="wait">
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					onClick={handleBackdropClick}
				>
					<motion.div
						className={`bg-background rounded-lg shadow-xl max-w-md w-full overflow-hidden ${
							className || ''
						}`}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{
							type: 'spring',
							damping: 20,
							stiffness: 300,
						}}
					>
						<div className="p-6">
							<h3 className="text-xl font-semibold text-foreground mb-2">
								{title}
							</h3>
							<p className="text-muted mb-6">{description}</p>

							<div className="flex justify-end space-x-3">
								<button
									type="button"
									onClick={handleCancel}
									disabled={loading}
									className="px-4 py-2 text-sm font-medium text-foreground bg-accent hover:bg-muted rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
								>
									{cancelText}
								</button>
								<button
									type="button"
									onClick={handleConfirm}
									disabled={loading}
									className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
								>
									{loading ? (
										<>
											<svg
												className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
												></circle>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											{loadingText}
										</>
									) : (
										confirmText
									)}
								</button>
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
