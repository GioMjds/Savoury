'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers, faUtensils } from '@fortawesome/free-solid-svg-icons';
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

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="bg-white rounded-xl shadow-lg overflow-hidden border border-border"
		>
			{/* Header */}
			<div className="p-4 border-b border-border">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
						<Image 
                            src={profileImage}
                            alt={`Profile image of ${username}`}
                            width={40}
                            height={40}
                            priority
                            className="object-cover"
                        />
					</div>
                    <div className="flex flex-col">
                        <h1 className="text-base font-semibold text-foreground leading-tight">{fullName}</h1>
                        <h3 className="text-xs text-muted-foreground leading-tight">@{username}</h3>
                    </div>
				</div>
			</div>

			{/* Recipe Image */}
			<div className="relative h-64 bg-muted">
				{imagePreview ? (
					<Image
						src={imagePreview}
						alt={title || 'Recipe preview'}
						fill
						className="object-cover"
					/>
				) : (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<FontAwesomeIcon icon={faUtensils} className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
							<p className="text-muted-foreground">Recipe image will appear here</p>
						</div>
					</div>
				)}
				{category && (
					<div className="absolute top-4 left-4">
						<span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
							{formatCategory(category)}
						</span>
					</div>
				)}
			</div>

			{/* Recipe Content */}
			<div className="p-6">
				{/* Title and Description */}
				<div className="mb-4">
					<h2 className="text-xl font-bold text-foreground mb-2">
						{title || 'Your Recipe Title'}
					</h2>
					{description && (
						<p className="text-muted-foreground line-clamp-3">{description}</p>
					)}
				</div>

				{/* Recipe Stats */}
				<div className="flex items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-primary" />
                        <span className="text-foreground">
                            Prep: {prepTime > 0 ? prepTime : 'N/A'} mins
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-primary" />
                        <span className="text-foreground">
                            Cook: {cookTime > 0 ? cookTime : 'N/A'} mins
                        </span>
                    </div>
					<div className="flex items-center gap-2">
						<FontAwesomeIcon icon={faUsers} className="w-4 h-4 text-primary" />
						<span className="text-foreground">{servings > 0 ? servings : 'N/A'} servings</span>
					</div>
				</div>

				{/* Quick Overview */}
				<div className="grid grid-cols-2 gap-4">
					{/* Ingredients Preview */}
					<div>
						<h4 className="font-semibold text-foreground mb-2 text-sm">
							Ingredients ({validIngredients.length})
						</h4>
						<div className="space-y-1">
							{validIngredients.slice(0, 4).map((ingredient, index) => (
								<div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
									<div className="w-1 h-1 bg-primary rounded-full" />
									<span className="line-clamp-1">
										{ingredient.quantity && `${ingredient.quantity} `}
										{ingredient.unit && `${ingredient.unit} `}
										{ingredient.ingredient_name}
									</span>
								</div>
							))}
							{validIngredients.length > 4 && (
								<p className="text-xs text-primary font-medium">
									+{validIngredients.length - 4} more ingredients
								</p>
							)}
							{validIngredients.length === 0 && (
								<p className="text-xs text-muted-foreground">No ingredients added yet</p>
							)}
						</div>
					</div>

					{/* Instructions Preview */}
					<div>
						<h4 className="font-semibold text-foreground mb-2 text-sm">
							Instructions ({validInstructions.length})
						</h4>
						<div className="space-y-1">
							{validInstructions.slice(0, 3).map((instruction, index) => (
								<div key={index} className="text-xs text-muted-foreground flex gap-2">
									<span className="font-medium text-primary min-w-[12px]">{index + 1}.</span>
									<span className="line-clamp-2">{instruction.value}</span>
								</div>
							))}
							{validInstructions.length > 3 && (
								<p className="text-xs text-primary font-medium">
									+{validInstructions.length - 3} more steps
								</p>
							)}
							{validInstructions.length === 0 && (
								<p className="text-xs text-muted-foreground">No instructions added yet</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default PostPreview;
