# Vite React Art Exhibition Platform

This project is a React-based web application using Vite as the build tool. The platform enables users to create, manage, and explore virtual art exhibitions. The app integrates Firebase for authentication (with email verification) and fetches data from two external APIs (Harvard Art Museums and the Art Institute of Chicago) to showcase artworks.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Live Page](#live-page)
- [Authentication](#authentication)
  - [Test User Accounts](#test-user-accounts)
- [API Integration](#api-integration)
- [Scripts](#scripts)
- [Future Improvements](#future-improvements)

## Project Overview

This art exhibition platform allows users to explore various artworks sourced from external APIs and create their own virtual exhibitions. Users can register, log in, and verify their email addresses using Firebase. Additionally, they can manage their exhibitions, including creating, editing, and deleting exhibitions.

## Tech Stack

- **React** with Vite for fast development
- **Firebase** for authentication (email verification on signup/signin)
- **Tailwind CSS** for styling the UI
- **Axios** for making API requests
- **React Router** for client-side routing
- **Environment Variables** for managing API keys and URLs securely
- **External APIs**:
  - Harvard Art Museums API
  - Art Institute of Chicago API

## Features

- User authentication (sign up, log in, email verification) using Firebase
- Create, view, and edit, your account
- Integration with Harvard Art Museums and Art Institute of Chicago for artwork data
- Create, view, edit, and delete art exhibitions
- Responsive and visually appealing UI with Tailwind CSS
- Whitelisted test user accounts for review

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v16 or later)
- NPM (v7 or later) or Yarn
- Firebase account for authentication setup

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/semih-suran/art-gallerry.git
   cd art-exhibition-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # OR
   yarn install
   ```

### Environment Variables

Create a `.env` file in the root of the project to store your environment variables. Example:

```env
VITE_HARVARD_API_BASE_URL=https://api.harvardartmuseums.org
VITE_HARVARD_API=your-harvard-api-key
VITE_CHICAGO_API_BASE_URL=https://api.artic.edu/api/v1
VITE_SEMIH_BASE_URL=https://your-backend-url/api
VITE_FIREBASE_apiKey=your-api-key
VITE_FIREBASE_authDomain=your-domain
VITE_FIREBASE_projectId=your-project-id
VITE_FIREBASE_storageBucket=your-key
VITE_FIREBASE_messagingSenderId=your-sender-id
VITE_FIREBASE_appId=your-app-id

# Use the local backend URL for development
# VITE_SEMIH_BASE_URL=http://localhost:9090/api
```

### Running Locally

To run the project in development mode:

```bash
npm run dev
# OR
yarn dev
```

This will start the Vite development server, and you can view the app in your browser at `http://localhost:5173`.

## Live Page

The project can be accessed live through the link:

- https://exhibition-curator-semih.netlify.app/

## Authentication

The project uses Firebase for user authentication, including email verification. New users must verify their email address before accessing certain features of the application.

### Test User Accounts

Here are some test user accounts that can be used to review the application:

1. **Test User 1**:
   - Email: `wilomezi@polkaroad.net`
   - Password: `123456`
2. **Test User 2**:
   - Email: `zisogetu@cyclelove.cc`
   - Password: `123456`

**Note**: Please ensure that these email addresses are whitelisted in your Firebase project for testing purposes.

## API Integration

The project integrates with the following APIs for artwork data:

1. **Harvard Art Museums API**: Fetches artwork information using `fetchHarvardArt` and `fetchHarvardArtworkById` functions.
   - https://github.com/harvardartmuseums/api-docs
2. **Art Institute of Chicago API**: Fetches artwork data using `fetchArtInstitute` and `fetchArtInstituteArtworkById` functions.
   - https://api.artic.edu/docs/

API requests are managed in the `api.js` file using Axios. Make sure to update the environment variables with your API keys.

## Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the project for production.
- **`npm run preview`**: Serves the production build locally for preview.
- **`npm run lint`**: Lints the project files using ESLint.

## Future Improvements

- Add more user roles (e.g., Admin) with additional privileges.
- Implement image uploads for user exhibitions.
- sort URLs for edit-exhibition/:id and view-exhibition/:id instead of exhibition/:id
- loading animations (while searching)
- "view" and "add" buttons on each search result item
- edit exhibition page (add/remove exhibitions needs working on)
- view exhibition page (SHARE button and [conditional rendering >>] EDIT button)
- random ordered, sliding/streaming animation for all exhibitions on home page (small)
- all buttons should change, new colors / text styles
- My Account page (editable details)
