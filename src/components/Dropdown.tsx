'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, ReactNode, useRef, useEffect } from 'react';
import Image from 'next/image';

interface DropdownItem {
	label: string;
	onClick?: () => void;
	href?: string;
	icon?: ReactNode;
	variant?: 'default' | 'danger';
	disabled?: boolean;
}

interface CustomDropdownProps {
	userDetails?: {
		id?: string;
		fullname?: string;
		email?: string;
		username?: string;
		profile_image?: string;
	};
	options: DropdownItem[];
	position?: 'top' | 'bottom' | 'left' | 'right';
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
}

const Dropdown: FC<CustomDropdownProps> = ({
	userDetails,
	options,
	position = 'bottom',
	isOpen,
	onToggle,
	onClose,
}) => {
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [onClose]);

	const getPositionClasses = () => {
		switch (position) {
			case 'top':
				return 'bottom-full mb-2 right-0';
			case 'left':
				return 'right-full mr-2 top-0';
			case 'right':
				return 'left-full ml-2 top-0';
			case 'bottom':
			default:
				return 'top-full mt-2 right-0';
		}
	};

	const handleItemClick = (item: DropdownItem) => {
		if (!item.disabled) {
			item.onClick?.();
			onClose();
		}
	};

	return (
		<div ref={dropdownRef} className="relative">
			<div onClick={onToggle} />
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.15 }}
						className={`absolute ${getPositionClasses()} w-48 bg-white rounded-lg shadow-lg border border-border py-1 z-50`}
					>
						{/* User Info Header */}
						{userDetails && (
							<div className="px-4 py-2 border-b border-border">
								<div className="flex items-center gap-3">
									<div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
										<Image
											src={userDetails?.profile_image as string}
											alt="Profile Image"
											fill
											priority
											className="object-cover"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-foreground truncate">
											{userDetails?.fullname}
										</p>
										<p className="text-xs text-gray-500 truncate">
											@{userDetails?.username}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Dropdown Items */}
						{options.map((item, index) => (
							<div key={index}>
								{item.href ? (
									<Link
										href={item.href}
										className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors
                                            ${item.variant === 'danger'
												? 'text-error hover:bg-error-light'
												: 'text-foreground hover:bg-accent'
											}
                                            ${item.disabled
												? 'opacity-50 cursor-not-allowed'
												: 'cursor-pointer'
											}
                                        `}
										onClick={() => !item.disabled && onClose()}
									>
										{item.icon && (
											<span className="text-base">
												{item.icon}
											</span>
										)}
										{item.label}
									</Link>
								) : (
									<button
										onClick={() => handleItemClick(item)}
										disabled={item.disabled}
										className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm transition-colors
                                            ${item.variant === 'danger'
												? 'text-error hover:bg-error-light'
												: 'text-foreground hover:bg-accent'
											}
                                            ${item.disabled
												? 'opacity-50 cursor-not-allowed'
												: 'cursor-pointer'
											}
                                        `}
									>
										{item.icon && (
											<span className="text-base">
												{item.icon}
											</span>
										)}
										{item.label}
									</button>
								)}
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default Dropdown;
