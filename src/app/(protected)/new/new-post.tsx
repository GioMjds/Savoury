"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { feed } from "@/services/Feed";

type NewRecipeForm = {
    title: string;
    description?: string;
    image_url?: string;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
};

export default function PostNewRecipe() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<NewRecipeForm>();

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: NewRecipeForm) => {
            return feed.postNewRecipe({ ...data });
        },
        onSuccess: () => {
            reset();
            setImagePreview(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to post recipe.");
        },
    });

    const onSubmit = (data: NewRecipeForm) => {
        mutation.mutate(data);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white border border-[var(--color-border)] rounded-xl shadow-lg p-8 max-w-max mx-auto w-full"
            >
                <h1 className="text-2xl font-bold mb-6 text-primary">Create a New Recipe</h1>

                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-foreground">Title *</label>
                    <input
                        type="text"
                        {...register("title", { required: "Title is required" })}
                        className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-md focus-ring"
                        placeholder="Recipe title"
                    />
                    {errors.title && <span className="text-error text-xs mt-1">{errors.title.message}</span>}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                    <textarea
                        {...register("description")}
                        className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-md focus-ring"
                        placeholder="Describe your recipe..."
                        rows={3}
                    />
                </div>

                {/* Image URL */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-foreground">Image URL</label>
                    <input
                        type="url"
                        {...register("image_url")}
                        className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-md focus-ring"
                        placeholder="https://your-image-url.com"
                        onChange={e => setImagePreview(e.target.value)}
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 rounded-md border border-[var(--color-border)] object-cover h-32 w-full"
                            onError={() => setImagePreview(null)}
                        />
                    )}
                </div>

                {/* Prep Time */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-foreground">Prep Time (minutes)</label>
                    <input
                        type="number"
                        min={0}
                        {...register("prep_time_minutes")}
                        className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-md focus-ring"
                        placeholder="e.g. 15"
                    />
                </div>

                {/* Cook Time */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-foreground">Cook Time (minutes)</label>
                    <input
                        type="number"
                        min={0}
                        {...register("cook_time_minutes")}
                        className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-md focus-ring"
                        placeholder="e.g. 30"
                    />
                </div>

                {/* Servings */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1 text-foreground">Servings</label>
                    <input
                        type="number"
                        min={1}
                        {...register("servings")}
                        className="w-full px-3 py-2 border border-[var(--color-input-border)] rounded-md focus-ring"
                        placeholder="e.g. 4"
                    />
                </div>

                <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    disabled={isSubmitting || mutation.isPending}
                    className="w-full bg-primary text-white py-2 rounded-md shadow focus-ring font-semibold text-lg transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? "Posting..." : "Post Recipe"}
                </motion.button>
            </form>
        </motion.div>
    );
}