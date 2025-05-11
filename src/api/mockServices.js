import { ref } from 'vue';

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Transportation',
  'Real Estate',
  'Hospitality',
  'Construction',
  'Energy',
];

const mockVerificationCode = '123456';

export const fetchIndustries = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(industries);
    }, 1000);
  });
};

export const sendVerificationCode = (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email) {
        resolve({ success: true, code: mockVerificationCode });
      } else {
        reject({ success: false, message: 'Invalid email address' });
      }
    }, 1000);
  });
};

export const validateVerificationCode = (inputCode) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (inputCode === mockVerificationCode) {
        resolve({ success: true });
      } else {
        reject({ success: false, message: 'Invalid verification code' });
      }
    }, 1000);
  });
};

export const submitOnboardingData = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a random error for submission
      const shouldFail = Math.random() < 0.3; // 30% chance of failure

      if (shouldFail) {
        reject({ success: false, message: 'Mock API Error: The server is currently busy. Please try again later.' });
      } else if (data) {
        resolve({ success: true });
      } else {
        reject({ success: false, message: 'Submission failed: No data provided.' });
      }
    }, 1000);
  });
};