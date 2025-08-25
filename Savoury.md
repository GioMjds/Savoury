"Savoury: Unlock your Flavor" - Your Modern Food Recipe Sharing Platform



#### **Problem Definition**



**Purpose:**

\- The core purpose of the "Savoury" project is to **bridge the gap between culinary inspiration and execution**. It is designed to be more than just a recipe database; it is a dynamic platform that empowers users to become both creators and curators of their own culinary world.



**What problem I am trying to solve?**



1\. **Discovery \& Curation**

\- Many people struggle to find new and exciting recipes that match their specific tastes, dietary needs, or skill level. A user's search history is often lost, and there's no central place to save and organize recipes found online. Savoury solves this by providing a platform where users can discover new recipes, filter them based on preferences, and curate their own personal digital cookbook by saving favorites.



2\. **Inefficient Recipe Sharing**

\- The process of sharing a recipe can be clunky, often involving sending multiple links or typing out long, unstructured text messages. Savoury provides a structured format for recipe submission, making it easy for users to share their creations in a standardized, readable way. This eliminates the need for manual formatting and ensures all necessary information, such as ingredients and instructions, is clearly presented.



3\. **Lack of Community and Feedback**

\- For home cooks, there's often a lack of community and a way to get feedback on their dishes. Savoury addresses this by allowing users to comment on and rate recipes. This creates a feedback loop that helps creators improve their cooking and provides social proof for a recipe's quality.



4\. **Data Silos \& Disorganization**

\- Recipes are scattered across countless websites, apps, and even physical notebooks. This creates a data silos problem where a user's culinary knowledge is fragmented and disorganized. Savoury centralizes this information, creating a single, organized hub for all of a user's recipes and culinary inspiration.



**Who will use this?**



1\. Home Cooks

2\. Food Bloggers/Vloggers and Content Creators

3\. People with Specific Dietary Needs

4\. Students and Young Professionals



**Why does it matter?**



It matters because "Savoury" addresses key pain points in the food and technology landscape, creating value for both individuals and the broader culinary community



1\. **Democratizing Culinary Knowledge**

\- The app breaks down barriers by making high-quality, diverse recipes accessible to everyone, regardless of skill level. It shifts the focus from professional, celebrity-driven content to a community-driven model where anyone can be a creator. This not only empowers home cooks to share their heritage and unique creations but also provides a vast, authentic resource for others.



2\. **Fostering Connection and Community**

\- In a world of fast food and pre-packaged meals, Savoury brings people together through a shared passion for food. It transforms the often-solitary act of cooking into a social experience. The platform becomes a space for connection, where users can celebrate successes, troubleshoot challenges, and learn from one another, creating a sense of belonging for a global community of food lovers.



3\. **Promoting Culinary Exploration and Creativity**

\- Savoury inspires people to get back into the kitchen and experiment with new ingredients and techniques. By providing a structured, easy-to-use platform, it encourages users to explore different cuisines and get creative with their cooking. The app helps users move beyond the mundane and discover the joy of creating something new, transforming cooking from a necessity into a rewarding hobby.



### **User \& Requirements Gathering**



**Functional and Non-Functional Requirements:**



**Functional Req (What the system does)**

**User Management:**

* User registration, login, and profile creation.
* Password management (change, reset)
* Personalized user profiles to display saved recipes and submissions
* User-to-user following functionality



**Recipe Functionality:**

* CRUD functionality for recipes.
* Structured input fields for recipe details (title, description, times, servings).
* Support for adding multiple ingredients with quantities and units.
* Support for adding a list of numbered instructions.
* Image upload for each recipe.



**Search and Discovery:**

* Keyword-based search across all recipes.
* Advanced filtering options (e.g., by prep time, dietary tags, rating)
* Categorization of recipes (e.g., breakfast, dinner, dessert).



**Social and Community:**

* A rating system (e.g., 1-5 stars) for recipes.
* A commenting system for users to provide feedback.
* A "Save" or "Favorite" feature for users to bookmark recipes.
* Sharing options to external platforms



**Non-Functional Requirements (How the system performs)**

**Performance:**

* Search results should load within a few seconds, even with a large number of recipes.
* Recipe pages should load quickly, with images optimized for web viewing.
* The platform must handle concurrent users without significant latency.



**Security:**

* User passwords must be securely hashed.
* Data transmission between the client and server should be encrypted (HTTPS).
* Robust input validation to prevent SQL injection and other common attacks.
* Access control should ensure users can only modify their own recipes and profile data.



**Scalability:**

* The database and backend architecture must be designed to scale to accommodate a growing number of users and recipes.
* The system should be able to handle a high volume of reads (recipe views) and writes (new recipes, comments, ratings).



**Usability:**

* The user interface (UI) should be intuitive and easy to navigate for both tech-savvy and non-tech-savvy users.
* The design should be responsive, providing a consistent experience on desktop, tablet, and mobile devices.



**Reliability:**

* The system should have minimal downtime.
* Regular backups of the database should be performed to prevent data loss.
* Error handling should be in place to provide clear feedback to users when something goes wrong.



### **Core Features**



**User Management \& Authentication:**

* **User Registration \& Login:** Allow users to create an account and log in securely.
* **User Profiles:** A dedicated page for each user to display their submitted recipes, saved favorites, and a brief bio.
* **Password Management:** Secure password hashing and a "forgot password" flow.
* **Profile Editing:** Users can update their personal information and profile picture.



**Recipe Management:**

* **Recipe Submission:** A form for users to upload new recipes, including a title, description, serving size, cook time, and image.
* **Ingredient \& Instruction Input:** Structured fields for adding ingredients with quantities and units, and step-by-step instructions.
* **Recipe Viewing:** A dedicated page for each recipe that displays all its details in a clean, readable format.
* **Editing \& Deleting:** Users can edit or delete their own recipes.



**Discovery \& Search:**

* **Global Search:** A powerful search bar that allows users to find recipes by name, ingredients, or a combination of both.
* **Filtering \& Sorting:** Enable users to filter recipes by criteria like dietary preferences (e.g., vegetarian, vegan, gluten-free), cuisine type, cook time, and average rating.
* **Homepage Feed:** A dynamic feed on the homepage that displays new and trending recipes.



**Social \& User Interaction:**

* **Ratings \& Reviews:** Users can rate a recipe (e.g., 1-5 stars) and leave a comment.
* **Liking \& Saving:** A "save" or "favorite" button that allows users to bookmark recipes to their profile.
* **Sharing:** The ability to share recipes on social media or via a direct link.
* **Commenting:** Ability for users to comment to a specific recipe ideas



##### **Database Design**



**DB Type - PostgreSQL**



**Entities:**

* **Users:** The central entity representing a person using the app.
* **Recipes:** The primary content entity, representing a dish.
* **Ingredients:** A list of all unique ingredients.
* **Instructions:** The steps for making a recipe.
* **Comments:** User-generated text feedback on a recipe.
* **Ratings:** User-generated star ratings for a recipe.



**Relationships:**

* **User to Recipes:** A one-to-many relationship. One user can create many recipes.
* **Recipe to Instructions:** A one-to-many relationship. One recipe has many numbered instructions.
* **Recipe to Ingredients:** A many-to-many relationship, handled by the recipe\_ingredients join table. A recipe can have many ingredients, and an ingredient can be used in many recipes.
* **User to Comments:** A one-to-many relationship. One user can leave many comments.
* **Recipe to Comments:** A one-to-many relationship. One recipe can have many comments.
* **User to Ratings:** A one-to-many relationship. One user can give many ratings.
* **Recipe to Ratings:** A one-to-many relationship. One recipe can receive many ratings.



**Indexing for Performance:**



**Foreign Keys:** The most critical indexes are on foreign key columns (user\_id, recipe\_id, ingredient\_id). These are essential for fast joins, which are a fundamental part of a relational database.



**users** table:

* Index on username and email for quick user lookups during login.
* Index on created\_at to efficiently query recently registered users.



**recipes** table:

* Index on title to accelerate recipe search queries.
* Index on user\_id (the foreign key) to quickly find all recipes by a specific user.
* Index on average\_rating and created\_at to efficiently sort recipes by popularity or recency.



**recipe\_ingredients** table:

* A composite index on (recipe\_id, ingredient\_id) is vital for the unique constraint and to efficiently look up ingredients for a specific recipe.



**instructions** table:

* An index on recipe\_id (the foreign key) is critical for retrieving all steps for a recipe.



**comments** table:

* Indexes on recipe\_id and user\_id to quickly find all comments for a recipe or all comments left by a user.
* A composite index on (recipe\_id, created\_at) can optimize queries that fetch the latest comments for a recipe.



**ratings** table:

* A composite index on (user\_id, recipe\_id) to enforce the unique constraint and prevent a user from rating the same recipe multiple times.
* An index on recipe\_id to quickly calculate a recipe's average rating.
