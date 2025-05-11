import axios from 'axios';
import * as mockServices from './mockServices';

const API_BASE_URL = 'https://mockapi.example.com'; 
const USE_MOCK_API = true; // Toggle between real API and mock services

export const fetchIndustries = async () => {
    if (USE_MOCK_API) {
        return mockServices.fetchIndustries();
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/industries`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch industries');
    }
};

export const submitOnboardingData = async (data) => {
    if (USE_MOCK_API) {
        return mockServices.submitOnboardingData(data);
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/onboarding`, data);
        return response.data;
    } catch (error) {
        throw new Error('Failed to submit onboarding data');
    }
};

export const sendVerificationCode = async (email) => {
    if (USE_MOCK_API) {
        return mockServices.sendVerificationCode(email);
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/send-verification`, { email });
        return response.data;
    } catch (error) {
        throw new Error('Failed to send verification code');
    }
};

export const validateVerificationCode = async (code) => {
    if (USE_MOCK_API) {
        return mockServices.validateVerificationCode(code);
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/validate-verification`, { code });
        return response.data;
    } catch (error) {
        throw new Error('Failed to validate verification code');
    }
};