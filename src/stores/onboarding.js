import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  submitOnboardingData as apiSubmitOnboardingData,
  sendVerificationCode,
  validateVerificationCode
} from '../api/mockServices';

const STORAGE_KEY = 'onboarding-data';

export const useOnboardingStore = defineStore('onboarding', {
  state: () => {
    sessionStorage.removeItem('verification-code');
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    const defaultState = {
      currentStep: 0,
      personalDetails: {
        name: '',
        email: '',
        phone: '',
        profileImage: null,
      },
      businessDetails: {
        businessName: '',
        businessLogo: null,
        industry: '',
        companySize: '',
        document: null,
        documentName: '',
      },
      verificationCode: '',
      isVerified: false,
      loading: false,
      error: null, // General error
      errors: { // Granular errors
        personalDetails: null,
        businessDetails: null,
      },
      fileMetadata: {},
    };

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        
        return {
          ...defaultState,
          currentStep: parsedData.currentStep || 0,
          personalDetails: {
            ...defaultState.personalDetails,
            name: parsedData.personalDetails?.name || '',
            email: parsedData.personalDetails?.email || '',
            phone: parsedData.personalDetails?.phone || '',
            profileImage: null,
          },
          businessDetails: {
            ...defaultState.businessDetails,
            businessName: parsedData.businessDetails?.businessName || '',
            industry: parsedData.businessDetails?.industry || '',
            companySize: parsedData.businessDetails?.companySize || '',
            documentName: parsedData.businessDetails?.documentName || '',
            businessLogo: null,
            document: null,
          },
          fileMetadata: parsedData.fileMetadata || {},
          isVerified: parsedData.isVerified || false, // Persist verification status
          errors: parsedData.errors || defaultState.errors, // Correctly load errors from storage
        };
      } catch (e) {
        return defaultState;
      }
    }
    
    return defaultState;
  },
  actions: {
    setCurrentStep(step) {
      this.currentStep = step;
      this._saveToStorage();
    },
    updatePersonalDetails(details) {
      this.personalDetails = { 
        ...this.personalDetails, 
        name: details.name !== undefined ? details.name : this.personalDetails.name,
        email: details.email !== undefined ? details.email : this.personalDetails.email,
        phone: details.phone !== undefined ? details.phone : this.personalDetails.phone,
        profileImage: details.profileImage !== undefined ? details.profileImage : this.personalDetails.profileImage,
      };
      
      if (details.profileImage instanceof File) {
        if (!this.fileMetadata) this.fileMetadata = {};
        this.fileMetadata.profileImage = {
          name: details.profileImage.name,
          type: details.profileImage.type,
          size: details.profileImage.size
        };
      } else if (details.profileImage === null && this.fileMetadata?.profileImage) {
        delete this.fileMetadata.profileImage;
      }
      
      this.clearPersonalDetailsErrors(); // Clear errors when details are updated
      this._saveToStorage();
    },
    updateBusinessDetails(details) {
      this.businessDetails = { 
        ...this.businessDetails,
        businessName: details.businessName !== undefined ? details.businessName : this.businessDetails.businessName,
        industry: details.industry !== undefined ? details.industry : this.businessDetails.industry,
        companySize: details.companySize !== undefined ? details.companySize : this.businessDetails.companySize,
        documentName: details.documentName !== undefined ? details.documentName : this.businessDetails.documentName,
        businessLogo: details.businessLogo !== undefined ? details.businessLogo : this.businessDetails.businessLogo,
        document: details.document !== undefined ? details.document : this.businessDetails.document,
      };
      
      if (!this.fileMetadata) this.fileMetadata = {};
      
      if (details.businessLogo instanceof File) {
        this.fileMetadata.businessLogo = {
          name: details.businessLogo.name,
          type: details.businessLogo.type,
          size: details.businessLogo.size
        };
      } else if (details.businessLogo === null && this.fileMetadata?.businessLogo) {
        delete this.fileMetadata.businessLogo;
      }
      
      if (details.document instanceof File) {
        this.fileMetadata.document = {
          name: details.document.name,
          type: details.document.type,
          size: details.document.size
        };
      } else if (details.document === null && this.fileMetadata?.document) {
        delete this.fileMetadata.document;
      }
      
      this.clearBusinessDetailsErrors(); // Clear errors when details are updated
      this._saveToStorage();
    },
    setVerificationCode(code) {
      this.verificationCode = code;
      this._saveToStorage();
    },
    setVerified(isVerified) {
      this.isVerified = isVerified;
      this._saveToStorage();
    },
    setLoading(isLoading) {
      this.loading = isLoading;
    },
    setError(errorMessage) { // General error
      this.error = errorMessage;
    },
    setPersonalDetailsErrors(errors) {
      this.errors.personalDetails = errors;
      this._saveToStorage();
    },
    clearPersonalDetailsErrors() {
      this.errors.personalDetails = null;
      this._saveToStorage();
    },
    setBusinessDetailsErrors(errors) {
      this.errors.businessDetails = errors;
      this._saveToStorage();
    },
    clearBusinessDetailsErrors() {
      this.errors.businessDetails = null;
      this._saveToStorage();
    },
    async sendVerificationCode() {
      try {
        this.setLoading(true);
        const response = await sendVerificationCode(this.personalDetails.email);
        sessionStorage.setItem('verification-code', response.code);
        this.setLoading(false);
        return response;
      } catch (error) {
        this.setError(error.message || 'Failed to send verification code');
        this.setLoading(false);
        throw error;
      }
    },
    async verifyCode(inputCode) {
      try {
        this.setLoading(true);
        const response = await validateVerificationCode(inputCode);
        if (response.success) {
          this.setVerified(true);
        }
        this.setLoading(false);
        return response;
      } catch (error) {
        this.setError(error.message || 'Failed to verify code');
        this.setLoading(false);
        throw error;
      }
    },
    async submitOnboardingData() {
      try {
        this.setLoading(true);
        
        const submissionData = {
          personalDetails: {
            name: this.personalDetails.name,
            email: this.personalDetails.email,
            phone: this.personalDetails.phone,
            profileImageMeta: this.fileMetadata?.profileImage || null,
          },
          businessDetails: {
            businessName: this.businessDetails.businessName,
            industry: this.businessDetails.industry,
            companySize: this.businessDetails.companySize,
            businessLogoMeta: this.fileMetadata?.businessLogo || null,
            documentMeta: this.fileMetadata?.document || null,
            documentName: this.businessDetails.documentName,
          },
          verified: this.isVerified,
        };
        
        const response = await apiSubmitOnboardingData(submissionData);
        
        if (response.success) {
          localStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem('verification-code');
        }
        
        this.setLoading(false);
        return response;
      } catch (error) {
        this.setError(error.message || 'Failed to submit onboarding data');
        this.setLoading(false);
        throw error;
      }
    },
    clearData() {
      this.currentStep = 0;
      this.personalDetails = {
        name: '',
        email: '',
        phone: '',
        profileImage: null,
      };
      this.businessDetails = {
        businessName: '',
        businessLogo: null,
        industry: '',
        companySize: '',
        document: null,
        documentName: '',
      };
      this.verificationCode = '';
      this.isVerified = false;
      this.loading = false;
      this.error = null;
      this.errors = { personalDetails: null, businessDetails: null }; // Reset granular errors
      this.fileMetadata = {};
      
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('verification-code');
    },
    _saveToStorage() {
      const stateToSave = {
        currentStep: this.currentStep,
        personalDetails: {
          name: this.personalDetails.name,
          email: this.personalDetails.email,
          phone: this.personalDetails.phone,
          // profileImage is not saved directly, metadata is used
        },
        businessDetails: {
          businessName: this.businessDetails.businessName,
          industry: this.businessDetails.industry,
          companySize: this.businessDetails.companySize,
          documentName: this.businessDetails.documentName,
           // businessLogo and document are not saved directly, metadata is used
        },
        fileMetadata: this.fileMetadata || {},
        isVerified: this.isVerified,
        errors: this.errors, 
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  },
});