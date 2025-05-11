<template>
  <div class="verification-summary">
    <h2>Review & Verify</h2>
    <p class="section-description">Please review your information and verify to complete the process</p>
    
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-header">
          <h3>Personal Details</h3>
          <button class="edit-btn" @click="editPersonal">Edit</button>
        </div>
        <div v-if="personalDetailsError" class="status-message error">
          <IconAlertCircle class="status-icon" size="20" color="#e74c3c" />
          <span class="status-text">{{ personalDetailsError }}</span>
        </div>
        
        <div class="profile-section">
          <div class="profile-image-container" v-if="profilePreviewUrl">
            <img :src="profilePreviewUrl" alt="Profile" class="profile-image" />
          </div>
          <div class="profile-image-placeholder" v-else>
            <IconUser size="32" color="#7f8c8d" />
          </div>
          
          <div class="profile-details">
            <div class="detail-row">
              <IconUser class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Name</label>
                <p>{{ store.personalDetails.name || 'Not provided' }}</p>
              </div>
            </div>
            
            <div class="detail-row">
              <IconMail class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Email</label>
                <p>{{ store.personalDetails.email || 'Not provided' }}</p>
              </div>
            </div>
            
            <div class="detail-row">
              <IconPhone class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Phone</label>
                <p>{{ store.personalDetails.phone || 'Not provided' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary-card">
        <div class="card-header">
          <h3>Business Details</h3>
          <button class="edit-btn" @click="editBusiness">Edit</button>
        </div>
        <div v-if="businessDetailsError" class="status-message error">
          <IconAlertCircle class="status-icon" size="20" color="#e74c3c" />
          <span class="status-text">{{ businessDetailsError }}</span>
        </div>
        
        <div class="business-section">
          <div class="business-logo-container" v-if="businessLogoUrl">
            <img :src="businessLogoUrl" alt="Business Logo" class="business-logo" />
          </div>
          <div class="business-logo-placeholder" v-else>
            <IconBuilding size="32" color="#7f8c8d" />
          </div>
          
          <div class="business-details">
            <div class="detail-row">
              <IconBuilding class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Business Name</label>
                <p>{{ store.businessDetails.businessName || 'Not provided' }}</p>
              </div>
            </div>
            
            <div class="detail-row">
              <IconIndustry class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Industry</label>
                <p>{{ store.businessDetails.industry || 'Not provided' }}</p>
              </div>
            </div>
            
            <div class="detail-row">
              <IconUsers class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Company Size</label>
                <p>{{ store.businessDetails.companySize || 'Not provided' }} employees</p>
              </div>
            </div>
            
            <div class="detail-row">
              <IconDocument class="detail-icon" size="18" color="#7f8c8d" />
              <div class="detail-content">
                <label>Document</label>
                <p>{{ documentName || 'No document uploaded' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="verification-container">
      <h3>Verify Your Identity</h3>
      <p>We've sent a verification code to your email address. Please enter it below to complete the process.</p>
      <p class="test-hint"><small>For testing purposes, use code: <strong>123456</strong></small></p>
      
      <div class="verification-code-input">
        <label for="verificationCode">Verification Code</label>
        <div class="input-with-button">
          <input 
            type="text" 
            v-model="verificationCode" 
            id="verificationCode" 
            placeholder="Enter 6-digit code"
            maxlength="6"
          />
          <button @click="verifyCode" class="verify-btn">Verify</button>
        </div>
        
        <div class="resend-container">
          <button @click="resendCode" class="resend-btn" :disabled="countdown > 0">
            {{ countdown > 0 ? 'Resend Code' : 'Resend Code' }}
          </button>
          <span class="timer" v-if="countdown > 0">{{ countdown }}s</span>
        </div>
      </div>
      
      <div class="verification-status">
        <div v-if="verificationStatus === 'success'" class="status-message success">
          <IconCheckCircle class="status-icon" size="20" color="#27ae60" />
          <span class="status-text">Verification successful!</span>
        </div>
        <div v-else-if="verificationStatus === 'error'" class="status-message error">
          <IconAlertCircle class="status-icon" size="20" color="#e74c3c" />
          <span class="status-text">Invalid verification code. Please try again.</span>
        </div>
      </div>
      
      <div class="terms-checkbox">
        <input type="checkbox" id="terms" v-model="agreeToTerms" />
        <label for="terms">I agree to the <a href="#" @click.prevent="showTerms">Terms and Conditions</a></label>
      </div>
      
      <button 
        @click="submitData" 
        class="submit-btn" 
        :disabled="loading || verificationStatus !== 'success' || !agreeToTerms">
        <span v-if="!loading">Submit</span>
        <LoadingIndicator v-else size="small" color="#ffffff" />
      </button>
    </div>

    <div class="completion-message" v-if="submissionStatus === 'success'">
      <div class="success-icon">
        <IconCheckCircle size="30" color="white" />
      </div>
      <h3>Submission Complete!</h3>
      <p>Thank you for completing the onboarding process. You will receive a confirmation email shortly.</p>
    </div>
    
    <Toast 
      :visible="toast.visible"
      :message="toast.message"
      :type="toast.type"
      :duration="3000"
      @close="closeToast"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding';
import { personalDetailsSchema, businessDetailsSchema } from '@/composables/useFormValidation';
import { useFormValidation } from '@/composables/useFormValidation';

import IconUser from '@/components/icons/IconUser.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconPhone from '@/components/icons/IconPhone.vue';
import IconBuilding from '@/components/icons/IconBuilding.vue';
import IconIndustry from '@/components/icons/IconIndustry.vue';
import IconUsers from '@/components/icons/IconUsers.vue';
import IconDocument from '@/components/icons/IconDocument.vue';
import IconCheckCircle from '@/components/icons/IconCheckCircle.vue';
import IconAlertCircle from '@/components/icons/IconAlertCircle.vue';
import Toast from '@/components/common/Toast.vue';
import LoadingIndicator from '@/components/common/LoadingIndicator.vue';
import './VerificationSummary.css';

export default {
  components: {
    IconUser,
    IconMail,
    IconPhone,
    IconBuilding,
    IconIndustry,
    IconUsers,
    IconDocument,
    IconCheckCircle,
    IconAlertCircle,
    Toast,
    LoadingIndicator
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['next', 'back', 'submit'],
  setup(props, { emit }) {
    const store = useOnboardingStore();
    const { validate } = useFormValidation();

    const verificationCode = ref('');
    const loading = ref(false);
    const agreeToTerms = ref(false);
    const verificationStatus = ref(null);
    const submissionStatus = ref(null);
    const countdown = ref(0);
    let countdownTimer = null;
    
    const toast = ref({
      visible: false,
      message: '',
      type: 'info'
    });
    
    const showToast = (message, type = 'info') => {
      toast.value = {
        visible: true,
        message,
        type
      };
    };
    
    const closeToast = () => {
      toast.value.visible = false;
    };

    const personalDetailsError = computed(() => {
      const errors = validate(store.personalDetails, personalDetailsSchema);
      if (Array.isArray(errors)) {
        return errors.map(e => e.message).join(', ');
      }
      
      if (store.error && store.error.personalDetails) {
        return store.error.personalDetails;
      }
      return null; 
    });

    const businessDetailsError = computed(() => {
      const errors = validate(store.businessDetails, businessDetailsSchema);
      if (Array.isArray(errors)) {
        return errors.map(e => e.message).join(', ');
      }
      
      if (store.error && store.error.businessDetails) {
        return store.error.businessDetails;
      }
      return null;
    });

    const profilePreviewUrl = computed(() => {
      if (store.personalDetails.profileImage instanceof File) {
        return URL.createObjectURL(store.personalDetails.profileImage);
      } else if (typeof store.personalDetails.profileImage === 'string' && store.personalDetails.profileImage) {
        return store.personalDetails.profileImage;
      }
      
      if (store.fileMetadata?.profileImage) {
        return "https://via.placeholder.com/150?text=Profile";
      }
      
      return null;
    });
    
    const businessLogoUrl = computed(() => {
      if (store.businessDetails.businessLogo instanceof File) {
        return URL.createObjectURL(store.businessDetails.businessLogo);
      } else if (typeof store.businessDetails.businessLogo === 'string' && store.businessDetails.businessLogo) {
        return store.businessDetails.businessLogo;
      }
      
      if (store.businessDetails.businessName) {
        return "https://via.placeholder.com/150?text=Business+Logo";
      }
      
      return null;
    });
    
    const documentName = computed(() => {
      if (store.businessDetails.document instanceof File) {
        return store.businessDetails.document.name;
      }
      
      if (store.businessDetails.documentName) {
        return store.businessDetails.documentName;
      }
      
      if (store.fileMetadata?.document?.name) {
        return store.fileMetadata.document.name;
      }
      
      return null;
    });

    const editPersonal = () => {
      emit('back');
      emit('back');
    };
    
    const editBusiness = () => {
      emit('back');
    };
    
    const verifyCode = async () => {
      if (!verificationCode.value) {
        verificationStatus.value = 'error';
        return;
      }
      
      try {
        loading.value = true;
        
        await store.verifyCode(verificationCode.value);
        verificationStatus.value = 'success';
        showToast('Code verification successful', 'success');
      } catch (error) {
        verificationStatus.value = 'error';
        showToast('Invalid verification code', 'error');
      } finally {
        loading.value = false;
      }
    };
    
    const resendCode = async () => {
      if (countdown.value > 0) return;
      
      try {
        showToast('Sending verification code...', 'info');
        
        await store.sendVerificationCode();
        
        showToast(`Verification code sent to ${store.personalDetails.email}`, 'success');
        
        countdown.value = 30;
        countdownTimer = setInterval(() => {
          countdown.value--;
          if (countdown.value <= 0) {
            clearInterval(countdownTimer);
          }
        }, 1000);
      } catch (error) {
        console.error('Failed to resend code:', error);
        showToast('Failed to send verification code', 'error');
      }
    };
    
    const showTerms = () => {
      alert('Terms and Conditions would be shown here');
    };
    
    const submitData = async () => {
      if (verificationStatus.value !== 'success' || !agreeToTerms.value) {
        showToast('Please verify your code and agree to the terms before submitting.', 'error');
        return;
      }
      
      loading.value = true;
      showToast('Submitting your information...', 'info');
      
      try {
        const response = await store.submitOnboardingData();
        if (response.success) {
          submissionStatus.value = 'success';
          showToast('Submission successful! Thank you for completing the onboarding process.', 'success');
          
          setTimeout(() => {
            verificationCode.value = '';
            agreeToTerms.value = false;
            
            emit('submit');
          }, 2000);
        } else {
          submissionStatus.value = 'error';
          const errorMessage = response.message || 'Submission failed. Please try again.';
          showToast(errorMessage, 'error');
        }
      } catch (error) {
        submissionStatus.value = 'error';
        const errorMessage = error.message || 'An unexpected error occurred during submission. Please try again.';
        showToast(errorMessage, 'error');
      } finally {
        loading.value = false;
      }
    };
    
    onMounted(() => {
      if (store.personalDetails.email && !store.isVerified) {
        setTimeout(() => {
          resendCode();
        }, 500);
      }
      
      const storedCode = sessionStorage.getItem('verification-code');
      if (storedCode && store.isVerified) {
        verificationStatus.value = 'success';
      }
    });
    
    onUnmounted(() => {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
      
      if (profilePreviewUrl.value && profilePreviewUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreviewUrl.value);
      }
      
      if (businessLogoUrl.value && businessLogoUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(businessLogoUrl.value);
      }
    });

    return {
      store,
      verificationCode,
      loading,
      agreeToTerms,
      verificationStatus,
      submissionStatus,
      countdown,
      profilePreviewUrl,
      businessLogoUrl,
      documentName,
      editPersonal,
      editBusiness,
      verifyCode,
      resendCode,
      showTerms,
      submitData,
      toast,
      showToast,
      closeToast,
      personalDetailsError,
      businessDetailsError
    };
  },
};
</script>