import { 
    faInstagram,
    faTwitter,
    faFacebook,
    faYoutube,
    faGithub,
    faLinkedin,
    faTiktok,
    faSnapchat,
    faPinterest,
    faDiscord,
    faReddit,
    faTwitch
} from '@fortawesome/free-brands-svg-icons';
import { 
    faGlobe,
    faEnvelope,
    faLink
} from '@fortawesome/free-solid-svg-icons';

export interface SocialPlatform {
    name: string;
    icon: any;
    color: string;
    pattern: RegExp;
}

// Social media platform configurations
export const socialPlatforms: SocialPlatform[] = [
    {
        name: 'Instagram',
        icon: faInstagram,
        color: '#E4405F',
        pattern: /(?:https?:\/\/)?(?:www\.)?instagram\.com\/.+/i
    },
    {
        name: 'Twitter',
        icon: faTwitter,
        color: '#1DA1F2',
        pattern: /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/.+/i
    },
    {
        name: 'Facebook',
        icon: faFacebook,
        color: '#1877F2',
        pattern: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/.+/i
    },
    {
        name: 'YouTube',
        icon: faYoutube,
        color: '#FF0000',
        pattern: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/.+/i
    },
    {
        name: 'GitHub',
        icon: faGithub,
        color: '#333333',
        pattern: /(?:https?:\/\/)?(?:www\.)?github\.com\/.+/i
    },
    {
        name: 'LinkedIn',
        icon: faLinkedin,
        color: '#0A66C2',
        pattern: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/.+/i
    },
    {
        name: 'TikTok',
        icon: faTiktok,
        color: '#000000',
        pattern: /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/.+/i
    },
    {
        name: 'Snapchat',
        icon: faSnapchat,
        color: '#FFFC00',
        pattern: /(?:https?:\/\/)?(?:www\.)?snapchat\.com\/.+/i
    },
    {
        name: 'Pinterest',
        icon: faPinterest,
        color: '#E60023',
        pattern: /(?:https?:\/\/)?(?:www\.)?pinterest\.com\/.+/i
    },
    {
        name: 'Discord',
        icon: faDiscord,
        color: '#5865F2',
        pattern: /(?:https?:\/\/)?(?:www\.)?discord\.(?:gg|com)\/.+/i
    },
    {
        name: 'Reddit',
        icon: faReddit,
        color: '#FF4500',
        pattern: /(?:https?:\/\/)?(?:www\.)?reddit\.com\/.+/i
    },
    {
        name: 'Twitch',
        icon: faTwitch,
        color: '#9146FF',
        pattern: /(?:https?:\/\/)?(?:www\.)?twitch\.tv\/.+/i
    }
];

/**
 * Detect social platform based on URL
 */
export const detectSocialPlatform = (url: string): SocialPlatform | null => {
    if (!url) return null;

    for (const platform of socialPlatforms) {
        if (platform.pattern.test(url)) {
            return platform;
        }
    }

    return null;
};

/**
 * Get icon and color for a social link
 */
export const getSocialLinkInfo = (url: string) => {
    const platform = detectSocialPlatform(url);
    
    if (platform) {
        return {
            icon: platform.icon,
            color: platform.color,
            name: platform.name
        };
    }

    // Default for unknown links
    if (url.includes('mailto:')) {
        return {
            icon: faEnvelope,
            color: '#666666',
            name: 'Email'
        };
    }

    return {
        icon: faGlobe,
        color: '#666666',
        name: 'Website'
    };
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    
    try {
        // Add protocol if missing
        const urlToTest = url.startsWith('http') ? url : `https://${url}`;
        new URL(urlToTest);
        return true;
    } catch {
        // Check if it's an email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(url);
    }
};

/**
 * Format URL to ensure it has proper protocol
 */
export const formatUrl = (url: string): string => {
    if (!url) return '';
    
    if (url.includes('mailto:') || url.startsWith('http')) {
        return url;
    }
    
    // Check if it's an email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(url)) {
        return `mailto:${url}`;
    }
    
    return url.startsWith('//') ? `https:${url}` : `https://${url}`;
};
