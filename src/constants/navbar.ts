import { faPlusCircle, faBell, faBookmark } from '@fortawesome/free-solid-svg-icons';

export interface AuthenticatedNavbar {
	href: string;
	label: string;
	icon: any;
	ariaLabel: string;
	hoverScale: number;
	tapScale: number;
}

export const authenticatedNavbarItems: AuthenticatedNavbar[] = [
	{
		href: '/new',
		label: 'Post',
		icon: faPlusCircle,
		ariaLabel: 'Post a new recipe',
		hoverScale: 1.05,
		tapScale: 0.98,
	},
    {
        href: '/saved',
        label: 'Saved',
        icon: faBookmark,
        ariaLabel: 'View saved recipes',
        hoverScale: 1.05,
        tapScale: 0.98,
    },
	{
		href: '/notifications',
		label: 'Notifications',
		icon: faBell,
		ariaLabel: 'View notifications',
		hoverScale: 1.05,
		tapScale: 0.95,
	},
];
