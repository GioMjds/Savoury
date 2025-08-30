'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock, 
    faUsers, 
    faUtensils,
    faListUl,
    faTasks,
    faEye
} from '@fortawesome/free-solid-svg-icons';
import { formatCategory } from '@/utils/formaters';

interface IngredientInput {
	quantity?: number | string;
	unit?: string;
	ingredient_name: string;
}

interface PostPreviewProps {
	title?: string;
	description?: string;
	imagePreview?: string | null;
	prepTime: number;
	cookTime: number;
	servings: number;
	category?: string;
	ingredients?: IngredientInput[];
	instructions?: { value: string }[];
    fullName: string;
	username?: string;
    profileImage: string;
}

const PostPreview = ({
	title = '',
	description = '',
	imagePreview,
	prepTime,
	cookTime,
	servings,
	category,
	ingredients = [],
	instructions = [],
    fullName,
	username,
	profileImage
}: PostPreviewProps) => {
	const totalTime = (prepTime || 0) + (cookTime || 0);
	const validIngredients = ingredients.filter(ing => ing.ingredient_name?.trim());
	const validInstructions = instructions.filter(inst => inst.value?.trim());
    const completionScore = Math.round(
        ((title ? 15 : 0) + 
         (description ? 10 : 0) + 
         (imagePreview ? 20 : 0) + 
         (prepTime ? 5 : 0) + 
         (cookTime ? 5 : 0) + 
         (servings ? 5 : 0) + 
         (category ? 10 : 0) + 
         (validIngredients.length * 2) + 
         (validInstructions.length * 2)) / 1.5
    );

	return (
        <div className="space-y-6">
            {/* Completion Progress */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-xl p-4"
            >
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4 text-primary" />
                        Recipe Preview
                    </h3>
                    <div className="text-sm font-medium text-primary">
                        {completionScore}% Complete
                    </div>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-2">
                    <motion.div 
                        className="bg-gradient-to-r from-primary to-primary-hover h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(completionScore, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-border"
            >
                {/* Enhanced Header */}
                <div className="bg-gradient-to-r from-primary/5 via-primary-light/5 to-primary/5 p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/20">
                                <Image 
                                    src={profileImage}
                                    alt={`Profile image of ${username}`}
                                    width={48}
                                    height={48}
                                    priority
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                                <FontAwesomeIcon icon={faUtensils} className="w-2 h-2 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-lg font-bold text-foreground leading-tight">{fullName}</h1>
                            <p className="text-sm text-muted">@{username} • Creating a new recipe</p>
                        </div>
                        <div className="text-xs text-muted bg-white/50 px-3 py-1 rounded-full">
                            Preview Mode
                        </div>
                    </div>
                </div>

                {/* Enhanced Recipe Image */}
                <div className="relative h-72 bg-gradient-to-br from-accent via-muted to-primary-lighter">
                    {imagePreview ? (
                        <>
                            <Image
                                src={imagePreview}
                                alt={'Recipe preview'}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <motion.div 
                                className="text-center"
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <FontAwesomeIcon icon={faUtensils} className="w-16 h-16 text-primary/40 mx-auto mb-3" />
                                <p className="text-primary/60 font-medium">Upload your delicious creation</p>
                                <p className="text-sm text-muted mt-1">Recipe image will appear here</p>
                            </motion.div>
                        </div>
                    )}
                    
                    {/* Category & Stats Overlay */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {category && (
                            <div className="bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-white/20">
                                {formatCategory(category)}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                            {totalTime > 0 && (
                                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
                                    {totalTime}m
                                </div>
                            )}
                            {servings > 0 && (
                                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                                    <FontAwesomeIcon icon={faUsers} className="w-3 h-3" />
                                    {servings}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-8">
                    {/* Title and Description */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                            {title || (
                                <span className="text-muted italic">Enter your recipe title...</span>
                            )}
                        </h2>
                        <p className="text-muted leading-relaxed">
                            {description || (
                                <span className="italic">Add a mouth-watering description of your recipe...</span>
                            )}
                        </p>
                    </div>

                    {/* Enhanced Recipe Stats */}
                    <div className="bg-gradient-to-r from-muted/30 to-accent/30 rounded-2xl p-6 mb-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            Cooking Details
                        </h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-muted mb-1">Prep Time</p>
                                <p className="text-xl font-bold text-foreground">
                                    {prepTime > 0 ? `${prepTime}m` : '--'}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <FontAwesomeIcon icon={faUtensils} className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-muted mb-1">Cook Time</p>
                                <p className="text-xl font-bold text-foreground">
                                    {cookTime > 0 ? `${cookTime}m` : '--'}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                                    <FontAwesomeIcon icon={faUsers} className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-muted mb-1">Servings</p>
                                <p className="text-xl font-bold text-foreground">
                                    {servings > 0 ? servings : '--'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Enhanced Ingredients */}
                        <div className="bg-gradient-to-br from-success-light/30 to-success-light/10 rounded-2xl p-6 border border-success-light/30">
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faListUl} className="w-4 h-4 text-success" />
                                </div>
                                Ingredients ({validIngredients.length})
                            </h4>
                            <div className="space-y-3">
                                {validIngredients.length > 0 ? (
                                    <>
                                        {validIngredients.slice(0, 6).map((ingredient, index) => (
                                            <motion.div 
                                                key={index} 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-white/60 rounded-lg p-3 flex items-center gap-3 shadow-sm border border-white/40"
                                            >
                                                <div className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
                                                <span className="text-sm text-foreground">
                                                    <span className="font-semibold">
                                                        {ingredient.quantity && `${ingredient.quantity} `}
                                                        {ingredient.unit && `${ingredient.unit} `}
                                                    </span>
                                                    {ingredient.ingredient_name}
                                                </span>
                                            </motion.div>
                                        ))}
                                        {validIngredients.length > 6 && (
                                            <div className="text-center py-2">
                                                <span className="text-sm text-success font-medium bg-success-light/50 px-3 py-1 rounded-full">
                                                    +{validIngredients.length - 6} more ingredients
                                                </span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FontAwesomeIcon icon={faListUl} className="w-5 h-5 text-success/50" />
                                        </div>
                                        <p className="text-success/60 font-medium">No ingredients added yet</p>
                                        <p className="text-xs text-muted mt-1">Start adding ingredients to see them here</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enhanced Instructions */}
                        <div className="bg-gradient-to-br from-info-light/30 to-info-light/10 rounded-2xl p-6 border border-info-light/30">
                            <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 bg-info/20 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon icon={faTasks} className="w-4 h-4 text-info" />
                                </div>
                                Instructions ({validInstructions.length})
                            </h4>
                            <div className="space-y-3">
                                {validInstructions.length > 0 ? (
                                    <>
                                        {validInstructions.slice(0, 4).map((instruction, index) => (
                                            <motion.div 
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.15 }}
                                                className="bg-white/60 rounded-lg p-4 shadow-sm border border-white/40"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-6 h-6 bg-info rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-sm text-foreground leading-relaxed">
                                                        {instruction.value}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {validInstructions.length > 4 && (
                                            <div className="text-center py-2">
                                                <span className="text-sm text-info font-medium bg-info-light/50 px-3 py-1 rounded-full">
                                                    +{validInstructions.length - 4} more steps
                                                </span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FontAwesomeIcon icon={faTasks} className="w-5 h-5 text-info/50" />
                                        </div>
                                        <p className="text-info/60 font-medium">No instructions added yet</p>
                                        <p className="text-xs text-muted mt-1">Add cooking steps to see them here</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recipe Completion Status */}
                    {(validIngredients.length > 0 || validInstructions.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="mt-8 bg-gradient-to-r from-primary/5 to-primary-light/5 rounded-2xl p-6 border border-primary/10"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-lg font-semibold text-foreground mb-1">
                                        Your Recipe is Taking Shape! 🍳
                                    </h4>
                                    <p className="text-sm text-muted">
                                        {completionScore < 50 && "Keep adding details to make your recipe shine"}
                                        {completionScore >= 50 && completionScore < 80 && "Looking good! A few more details will perfect it"}
                                        {completionScore >= 80 && "Excellent! Your recipe is almost ready to share"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary mb-1">
                                        {completionScore}%
                                    </div>
                                    <div className="text-xs text-muted">Complete</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
	)
}

export default PostPreview;