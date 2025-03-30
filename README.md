# Lokal Job App

A React Native mobile application built with Expo that allows users to browse and bookmark job listings.

## Features

- Browse jobs with infinite scroll
- View detailed job information
- Bookmark favorite jobs
- Offline access to bookmarked jobs
- Call employers directly from the app

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Studio (for Android development)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd LokalJobApp
```

2. Install dependencies:
```bash
npm install
```

## Running the App

1. Start the development server:
```bash
npm start
```

2. Run on specific platform:
- For iOS (requires macOS):
```bash
npm run ios
```
- For Android:
```bash
npm run android
```
- For web:
```bash
npm run web
```

## Project Structure

```
src/
  ├── components/      # Reusable UI components
  ├── screens/        # Screen components
  ├── navigation/     # Navigation configuration
  ├── services/       # API services
  ├── utils/          # Utility functions
  └── constants/      # Constants and theme
```

## Technologies Used

- React Native
- Expo
- React Navigation
- AsyncStorage
- Axios

## API Endpoint

The app uses the following API endpoint for job listings:
```
https://testapi.getlokalapp.com/common/jobs?page=1
``` 