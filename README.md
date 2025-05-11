# Vue Onboarding Flow

This project implements a multi-step onboarding flow for a SaaS dashboard using Vue 3. The onboarding process collects user and business information, verifies the user's identity, and simulates data submission to a server.

## Project Structure

```
vue-onboarding-flow
├── public
│   └── favicon.ico
├── src
│   ├── api
│   │   ├── index.js
│   │   └── mockServices.js
│   ├── assets
│   │   └── logo.svg
│   ├── components
│   │   ├── common
│   │   │   ├── FileUploader.css
│   │   │   ├── FileUploader.vue
│   │   │   ├── LoadingIndicator.css
│   │   │   ├── LoadingIndicator.vue
│   │   │   ├── StepNavigation.css
│   │   │   ├── StepNavigation.vue
│   │   │   ├── Toast.css
│   │   │   └── Toast.vue
│   │   ├── icons
│   │   │   ├── IconAlertCircle.vue
│   │   │   ├── IconBase.vue
│   │   │   ├── IconBuilding.vue
│   │   │   ├── IconCamera.vue
│   │   │   ├── IconCheckCircle.vue
│   │   │   ├── IconClose.vue
│   │   │   ├── IconDocument.vue
│   │   │   ├── IconImage.vue
│   │   │   ├── IconIndustry.vue
│   │   │   ├── IconMail.vue
│   │   │   ├── IconPhone.vue
│   │   │   ├── IconUser.vue
│   │   │   └── IconUsers.vue
│   │   └── steps
│   │       ├── BusinessDetails.css
│   │       ├── BusinessDetails.vue
│   │       ├── PersonalDetails.css
│   │       ├── PersonalDetails.vue
│   │       ├── VerificationSummary.css
│   │       └── VerificationSummary.vue
│   ├── composables
│   │   ├── useFileValidation.js
│   │   └── useFormValidation.js
│   ├── schemas
│   │   ├── businessSchema.js
│   │   ├── businessSchema.spec.js
│   │   ├── personalSchema.js
│   │   ├── personalSchema.spec.js
│   │   ├── verificationSchema.js
│   │   └── verificationSchema.spec.js
│   ├── stores
│   │   └── onboarding.js
│   ├── views
│   │   ├── OnboardingFlow.css
│   │   └── OnboardingFlow.vue
│   ├── App.css
│   ├── App.vue
│   └── main.js
├── .eslintrc.js
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd vue-onboarding-flow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` (or the port specified in the terminal).

## Overview of Development Process

The onboarding flow is divided into three main steps:

1. **Personal Details**: Collects user information such as name, email, phone number, and profile image upload.
2. **Business Details**: Gathers business information including business name, logo, industry (fetched from a mock API), company size, and document upload.
3. **Verification & Summary**: Simulates email verification and displays a summary of all collected data before submission.

Each step is implemented as a standalone component, utilizing props and emits for data handling and state management. The global state is managed using Pinia, allowing for seamless navigation and data persistence.

## UI Components

The project includes several reusable UI components:

1. **Toast**: Provides feedback to users through non-intrusive notification messages. Features include:
   - Different types (success, error, info)
   - Configurable positioning (top, bottom)
   - Auto-close with progress indicator
   - Close button for manual dismissal

2. **LoadingIndicator**: Displays a loading spinner during asynchronous operations.

3. **StepNavigation**: Handles navigation between onboarding steps with validation.

4. **FileUploader**: Allows users to upload and preview image and document files.

## Icon System

The project uses a systematic approach to SVG icons:

- **IconBase**: Base component that sets up common SVG properties and styling
- Multiple specialized icon components built on top of IconBase for consistent styling
- Icons include: user, business, checkmark, alert, close, document, and more

## API Mocking

API interactions are simulated using mock services defined in `src/api/mockServices.js`. This includes:

- Fetching industry options
- Sending and validating email verification codes
- Mock submission of onboarding data

Both successful and error responses are handled to ensure robust testing of the onboarding flow.

## Bonus Features

- **Autosave**: The form state is saved to localStorage, allowing users to restore their progress on refresh.
- **Unit Tests**: Unit tests are implemented for the validation logic in at least one of the step components.
- **Toast Notifications**: Provides feedback to users throughout the onboarding process.

## Running Unit Tests

To run the unit tests, use the following command:
```
npm run test
```

This will execute the test suite and provide feedback on the validation logic and component functionality.

## Conclusion

This project demonstrates a structured approach to building a multi-step onboarding flow in Vue 3, focusing on componentization, state management, and user experience.