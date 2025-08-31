'use client';

import { useState, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTimes, 
    faCamera, 
    faPlus,
    faTrash,
    faSpinner,
    faSave
} from '@fortawesome/free-solid-svg-icons';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { user } from '@/services/User';
import { getSocialLinkInfo, isValidUrl, formatUrl } from '@/utils/socialLinks';
import Image from 'next/image';

interface SocialLink {
    id: string;
    label: string;
    url: string;
}

interface EditProfileFormData {
    email: string;
    username: string;
    fullname: string;
    bio?: string;
    socialLinks: SocialLink[];
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: {
        user_id: number;
        email: string;
        username: string;
        fullname: string;
        profile_image: string;
        cover_photo?: string;
        bio?: string;
        social_links?: Record<string, string> | { [key: string]: string } | any;
    };
}

const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
        opacity: 1, 
        scale: 1
    },
    exit: { 
        opacity: 0, 
        scale: 0.8
    }
};

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

const EditProfileModal = ({ isOpen, onClose, userProfile }: EditProfileModalProps) => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [profileImagePreview, setProfileImagePreview] = useState<string>(userProfile.profile_image);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>(userProfile?.cover_photo || '');
    const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
    const [selectedCoverPhoto, setSelectedCoverPhoto] = useState<File | null>(null);
    
    const profileImageRef = useRef<HTMLInputElement>(null);
    const coverPhotoRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();

    const convertSocialLinksToArray = (socialLinks?: Record<string, string> | { [key: string]: string } | any): SocialLink[] => {
        if (!socialLinks || typeof socialLinks !== 'object') return [];
        
        return Object.entries(socialLinks)
            .filter(([_, url]) => url && typeof url === 'string' && url.trim() !== '')
            .map(([label, url], index) => ({
                id: `${label}_${index}`,
                label,
                url: url as string
            }));
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        watch
    } = useForm<EditProfileFormData>({
        defaultValues: {
            email: userProfile.email,
            username: userProfile.username,
            fullname: userProfile.fullname,
            bio: userProfile.bio || '',
            socialLinks: convertSocialLinksToArray(userProfile.social_links)
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'socialLinks'
    });

    const watchedSocialLinks = watch('socialLinks');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size must be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            const previewUrl = URL.createObjectURL(file);
            
            if (type === 'profile') {
                setSelectedProfileImage(file);
                setProfileImagePreview(previewUrl);
            } else {
                setSelectedCoverPhoto(file);
                setCoverPhotoPreview(previewUrl);
            }
        }
    };

    const onSubmit = async (data: EditProfileFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            
            formData.append('email', data.email);
            formData.append('username', data.username);
            formData.append('fullname', data.fullname);
            formData.append('bio', data.bio || '');
            
            const socialLinksObject: Record<string, string> = {};
            data.socialLinks.forEach((link) => {
                if (link.url && link.url.trim() !== '' && link.label && link.label.trim() !== '') {
                    if (isValidUrl(link.url)) {
                        socialLinksObject[link.label] = formatUrl(link.url);
                    }
                }
            });
            
            if (Object.keys(socialLinksObject).length > 0) {
                formData.append('social_links', JSON.stringify(socialLinksObject));
            }

            if (selectedProfileImage) {
                formData.append('profile_image', selectedProfileImage);
            }
            
            if (selectedCoverPhoto) {
                formData.append('cover_photo', selectedCoverPhoto);
            }

            await user.editUserProfile(userProfile.user_id, formData);

            await queryClient.invalidateQueries({ 
                queryKey: ['profile', userProfile.user_id] 
            });
            
            toast.success('Profile updated successfully!');
            onClose();
        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        reset();
        setProfileImagePreview(userProfile.profile_image);
        setCoverPhotoPreview(userProfile.cover_photo || '');
        setSelectedProfileImage(null);
        setSelectedCoverPhoto(null);
        onClose();
    };

    const addSocialLink = () => {
        append({
            id: `new_${Date.now()}`,
            label: '',
            url: ''
        });
    };

    return (
        <AnimatePresence mode='wait'>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={handleModalClose}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-border p-6 rounded-t-xl z-10">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            {/* Cover Photo Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">Cover Photo</h3>
                                <div className="relative">
                                    <div className="h-32 bg-gradient-to-r from-primary-lighter to-primary-light rounded-lg overflow-hidden">
                                        {coverPhotoPreview && (
                                            <Image
                                                src={coverPhotoPreview}
                                                width={640}
                                                height={256}
                                                priority
                                                alt="Cover Photo"
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => coverPhotoRef.current?.click()}
                                        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg shadow-md transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faCamera} />
                                    </button>
                                    <input
                                        type="file"
                                        ref={coverPhotoRef}
                                        accept="image/*"
                                        onChange={(e) => handleFileSelect(e, 'cover')}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Profile Image Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">Profile Image</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Image
                                            src={profileImagePreview}
                                            alt="Profile"
                                            width={80}
                                            height={80}
                                            priority
                                            className="w-20 h-20 rounded-full object-cover border-2 border-border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => profileImageRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 bg-primary hover:bg-primary-hover text-white p-1.5 rounded-full shadow-md transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faCamera} size="sm" />
                                        </button>
                                        <input
                                            type="file"
                                            ref={profileImageRef}
                                            accept="image/*"
                                            onChange={(e) => handleFileSelect(e, 'profile')}
                                            className="hidden"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Click the camera icon to update your profile image</p>
                                        <p className="text-xs text-gray-400">Max file size: 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            {...register('fullname', { required: 'Full name is required' })}
                                            className="w-full px-3 py-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullname && (
                                            <p className="text-error text-sm mt-1">{errors.fullname.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            {...register('username', { required: 'Username is required' })}
                                            className="w-full px-3 py-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your username"
                                        />
                                        {errors.username && (
                                            <p className="text-error text-sm mt-1">{errors.username.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        {...register('email', { 
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        className="w-full px-3 py-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="text-error text-sm mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        {...register('bio')}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
                                    <button
                                        type="button"
                                        onClick={addSocialLink}
                                        className="flex items-center cursor-pointer gap-2 px-3 py-1 bg-primary hover:bg-primary-hover text-accent rounded-md transition-colors text-sm"
                                    >
                                        <FontAwesomeIcon icon={faPlus} size="sm" />
                                        <span>Add Link</span>
                                    </button>
                                </div>

                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {fields.map((field, index) => {
                                        const url = watchedSocialLinks[index]?.url || '';
                                        const socialInfo = getSocialLinkInfo(url);
                                        
                                        return (
                                            <div key={field.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex-shrink-0">
                                                    <FontAwesomeIcon 
                                                        icon={socialInfo.icon} 
                                                        className="w-5 h-5"
                                                        style={{ color: url ? socialInfo.color : '#666666' }}
                                                    />
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        {...register(`socialLinks.${index}.label` as const, {
                                                            required: 'Label is required if URL is provided'
                                                        })}
                                                        className="px-3 py-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                        placeholder="Label (e.g., Instagram, Website)"
                                                    />
                                                    <input
                                                        type="url"
                                                        {...register(`socialLinks.${index}.url` as const)}
                                                        className="px-3 py-2 border border-input-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                        placeholder="https://example.com"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="flex-shrink-0 p-2 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} size="sm" />
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {fields.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <p className="text-sm">No social links added yet.</p>
                                            <p className="text-xs mt-1">Click "Add Link" to get started.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 cursor-pointer bg-primary hover:bg-primary-hover text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                            <span>Updating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faSave} />
                                            <span>Update Profile</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;