Sonicpad.ai

Sonicpad.ai is a Next.js-based web application designed to create, manage, and test AI-powered bots with document upload and attachment capabilities. This project allows users to build bots, upload documents to train them, attach documents to specific bots, test bot functionality, and integrate an AI widget into websites. The application is hosted at https://dev.sonicpad.ai.

Features





Bot Creation: Easily create AI-powered bots with customizable settings.



Document Upload: Upload documents (e.g., PDFs, Word, text) to train your bots.



Document Attachment: Attach specific documents to individual bots for targeted responses.



Bot Testing: Test your bots directly within the platform to ensure they respond accurately.



AI Widget: Embed an AI-powered chat widget into your website for seamless user interaction.



Responsive Design: Built with Next.js for a responsive and optimized user experience.

Usage

Bot Creation





Navigate to the "Create Bot" section of the app.



Fill in the required details (e.g., bot name, description, status) using the provided form.



Submit the form to create a new bot.

Document Upload





Go to the "Upload Documents" section.



Upload files (PDFs, Word documents, or text) to be used as a knowledge base for your bots.



The uploaded documents will be processed and made available for bot training.

Attach Documents to Bots





In the bot management section, select a bot.



Choose the "Attach Documents" option.



Select the relevant uploaded documents to link to the bot for more accurate responses.

Bot Testing





Access the "Test Bot" feature within the bot management section.



Interact with the bot by asking questions or giving commands to verify its performance.



Review the bot's responses and adjust the attached documents or settings as needed.

AI Widget Integration





Generate the AI widget embed code from the "Widget" section.



Copy the provided script and paste it into your website's HTML to integrate the chat widget.



Customize the widget's appearance (e.g., colors, position) as needed.

Project Structure





app/page.js: The main page of the application. Start editing here to modify the homepage.



components/: Contains reusable components like BotForm and CreateBot.



lib/api/: API functions for bot creation (createBot), fetching bots (getBots), and subscription checks (checkSubscriptionStatus).



context/: Authentication context (AuthContext) for managing user sessions.



public/: Static assets like images and fonts.



styles/: CSS files for styling the application.

This project uses next/font to automatically optimize and load Geist, a font family by Vercel.