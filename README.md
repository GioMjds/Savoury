# Savoury: Unlock Your Flavor

"Savoury: Unlock your Flavor" is a modern, full-stack web application designed to be a dynamic and community-driven platform for sharing and discovering food recipes. It empowers users to create, share, and curate their culinary experiences, transforming the way people connect with food.

## Table of Contents

- [Problem Definition](#problem-definition)
- [User & Requirements Gathering](#user--requirements-gathering)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [Contributing](#contributing)
- [License](#license)

## Problem Definition

### Purpose

The core purpose of the "Savoury" project is to **bridge the gap between culinary inspiration and execution**. It is designed to be more than just a recipe database; it is a dynamic platform that empowers users to become both creators and curators of their own culinary world.

### What problem is this project trying to solve?

1.  **Discovery & Curation**: Many people struggle to find new and exciting recipes that match their specific tastes, dietary needs, or skill level. Savoury provides a platform where users can discover new recipes, filter them based on preferences, and curate their own personal digital cookbook.

2.  **Inefficient Recipe Sharing**: Sharing recipes can be clunky. Savoury provides a structured format for recipe submission, making it easy for users to share their creations in a standardized, readable way.

3.  **Lack of Community and Feedback**: Savoury allows users to comment on and rate recipes, creating a feedback loop that helps creators improve and provides social proof for a recipe's quality.

4.  **Data Silos & Disorganization**: Recipes are scattered across countless websites and apps. Savoury centralizes this information, creating a single, organized hub for all of a user's recipes and culinary inspiration.

### Who will use this?

-   **Home Cooks**
-   **Food Bloggers/Vloggers and Content Creators**
-   **People with Specific Dietary Needs**
-   **Students and Young Professionals**

### Why does it matter?

"Savoury" addresses key pain points in the food and technology landscape by:

1.  **Democratizing Culinary Knowledge**: Making diverse recipes accessible to everyone, regardless of skill level.
2.  **Fostering Connection and Community**: Transforming the solitary act of cooking into a social experience.
3.  **Promoting Culinary Exploration and Creativity**: Inspiring people to experiment with new ingredients and techniques.

## User & Requirements Gathering

### Functional Requirements

-   **User Management**: User registration, login, profile creation, password management, and user-to-user following.
-   **Recipe Functionality**: CRUD for recipes, structured input for details, ingredients, instructions, and image uploads.
-   **Search and Discovery**: Keyword-based search, advanced filtering, and categorization.
-   **Social and Community**: Rating system, commenting, "Save/Favorite" feature, and sharing options.

### Non-Functional Requirements

-   **Performance**: Fast page loads, quick search results, and low latency under concurrent use.
-   **Security**: Secure password hashing, encrypted data transmission (HTTPS), and robust input validation.
-   **Scalability**: Architecture designed to handle a growing number of users and recipes.
-   **Usability**: Intuitive and responsive UI for all devices.
-   **Reliability**: Minimal downtime and regular database backups.

## Core Features

-   **User Management & Authentication**: Secure registration, login, and profile editing.
-   **Recipe Management**: Easy recipe submission, viewing, editing, and deletion.
-   **Discovery & Search**: Powerful global search with filtering and sorting.
-   **Social & User Interaction**: Ratings, reviews, saving/liking, and sharing.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) 15 (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Database**: [Prisma](https://www.prisma.io/) ORM with [PostgreSQL](https://www.postgresql.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **State Management**: [Tanstack Query](https://tanstack.com/query/latest)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   [pnpm](https://pnpm.io/installation)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/GioMjds/Savoury.git
    cd Savoury
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables (e.g., database URL, NextAuth secret).
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    NEXTAUTH_SECRET="your-secret-here"
    ```

4.  **Run database migrations:**
    ```sh
    pnpm prisma migrate dev
    ```

5.  **Start the development server:**
    ```sh
    pnpm run dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Project Structure

The project follows a standard Next.js App Router structure, organized for scalability and maintainability.

-   **`prisma/`**: Contains the database schema (`schema.prisma`) and migration files. This is where the data models and database structure are defined.

-   **`public/`**: Stores static assets that are publicly accessible, such as images (`savoury-logo.png`), fonts, and icons.

-   **`src/`**: The main source code directory for the application.

    -   **`app/`**: The core of the Next.js application, using the App Router.
        -   **`(protected)/`**: Route group for pages and layouts that require user authentication.
        -   **`(public)/`**: Route group for publicly accessible pages like the landing page, about, and contact.
        -   **`api/`**: Contains all backend API routes for handling data mutations, authentication, and business logic.
        -   `globals.css`: Global stylesheets and CSS variable definitions.
        -   `layout.tsx`: The root layout for the entire application.

    -   **`components/`**: Contains reusable UI components (e.g., `Modal.tsx`, `SearchBar.tsx`) used across the application. These are primarily client components.

    -   **`configs/`**: Holds configuration files for external services and libraries, such as `axios.ts` for HTTP requests and `email.ts` for mail services.

    -   **`constants/`**: Stores project-wide constants, such as navigation links or predefined values (`homepage.ts`).

    -   **`hooks/`**: Contains custom React hooks to encapsulate and reuse stateful logic.

    -   **`layouts/`**: Includes major layout components like `Navbar.tsx` and `Footer.tsx` that define the structure of pages.

    -   **`lib/`**: Core libraries and utility functions, including the Prisma client instance (`prisma.ts`), authentication logic (`auth.ts`), and Cloudinary configuration.

    -   **`providers/`**: Wraps the application with context providers, such as `TanstackQueryProvider` for server state management.

    -   **`services/`**: Contains modules for interacting with the backend API, abstracting data-fetching logic (e.g., `Auth.ts`, `Feed.ts`).

    -   **`types/`**: Holds all custom TypeScript type definitions and interfaces, ensuring type safety across the project.

    -   **`utils/`**: Includes utility functions for common tasks like formatting dates (`formaters.ts`) or validating inputs (`regex.ts`).

## Database Design

-   **DB Type**: PostgreSQL
-   **Entities**: `Users`, `Recipes`, `Ingredients`, `Instructions`, `Comments`, `Ratings`.
-   **Relationships**:
    -   One-to-Many: `User` to `Recipes`, `Recipe` to `Instructions`, `User` to `Comments`, `Recipe` to `Comments`.
    -   Many-to-Many: `Recipe` to `Ingredients`.

### Indexing for Performance

-   **Foreign Keys**: Indexes on `user_id`, `recipe_id` for fast joins.
-   **`users` table**: Indexes on `username` and `email` for quick lookups.
-   **`recipes` table**: Indexes on `title` for search and `average_rating` for sorting.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
