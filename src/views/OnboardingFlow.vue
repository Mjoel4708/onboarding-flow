<template>
  <div class="onboarding-container">
    <div class="onboarding-card">
      <!-- Step Indicator -->
      <div class="step-indicator">
        <div class="progress-bar">
          <div class="progress-fill" :style="{width: `${(currentStep / (totalSteps - 1)) * 100}%`}"></div>
        </div>
        <div class="step-circles">
          <div 
            v-for="step in totalSteps" 
            :key="step"
            class="step-item"
          >
            <div 
              class="step-circle" 
              :class="{
                'active': currentStep === step - 1,
                'completed': currentStep > step - 1
              }"
            >
              {{ step }}
            </div>
            <div class="step-label">
              <span v-if="step === 1">Personal</span>
              <span v-if="step === 2">Business</span>
              <span v-if="step === 3">Verify</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="onboarding-content">
        <transition name="fade" mode="out-in">
          <component 
            :is="currentStepComponent" 
            :data="aggregatedData" 
            @next="nextStep" 
            @back="prevStep" 
            @submit="submitData" 
          />
        </transition>
      </div>

      <!-- Navigation Buttons -->
      <div class="onboarding-footer" v-if="!isLoading">
        <button 
          v-if="currentStep > 0 && !isSubmitted" 
          @click="prevStep" 
          class="btn btn-secondary"
        >
          Back
        </button>
        <button 
          v-if="currentStep < totalSteps - 1 && !isSubmitted" 
          @click="validateAndNext" 
          class="btn btn-primary"
        >
          Continue
        </button>
        <button 
          v-if="isSubmitted" 
          @click="resetForm" 
          class="btn btn-primary"
        >
          Finish
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-overlay">
      <LoadingIndicator />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import PersonalDetails from '../components/steps/PersonalDetails.vue';
import BusinessDetails from '../components/steps/BusinessDetails.vue';
import VerificationSummary from '../components/steps/VerificationSummary.vue';
import LoadingIndicator from '../components/common/LoadingIndicator.vue';
import { useOnboardingStore } from '../stores/onboarding';
import './OnboardingFlow.css';

export default {
  components: {
    PersonalDetails,
    BusinessDetails,
    VerificationSummary,
    LoadingIndicator
  },
  setup() {
    const store = useOnboardingStore();
    const isLoading = ref(false);
    const isSubmitted = ref(false);
    
    const currentStep = ref(store.currentStep);
    const totalSteps = 3;

    const aggregatedData = computed(() => ({
      personalDetails: store.personalDetails,
      businessDetails: store.businessDetails,
      fileMetadata: store.fileMetadata
    }));

    const currentStepComponent = computed(() => {
      switch (currentStep.value) {
        case 0:
          return 'PersonalDetails';
        case 1:
          return 'BusinessDetails';
        case 2:
          return 'VerificationSummary';
        default:
          return null;
      }
    });

    const canSubmit = computed(() => {
      return store.isVerified;
    });

    const validateAndNext = () => {
      nextStep();
    };

    const nextStep = () => {
      if (currentStep.value < totalSteps - 1) {
        currentStep.value++;
        store.setCurrentStep(currentStep.value);
      }
    };

    const prevStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--;
        store.setCurrentStep(currentStep.value);
      }
    };

    const submitData = async () => {
      if (!canSubmit.value) {
        alert('Please complete verification before submitting.');
        return;
      }

      isLoading.value = true;
      try {
        await store.submitOnboardingData();
        setTimeout(() => {
          isLoading.value = false;
          isSubmitted.value = true;
          alert('Onboarding completed successfully!');
        }, 1500);
      } catch (error) {
        isLoading.value = false;
        alert('Submission failed. Please try again.');
      }
    };

    const resetForm = () => {
      isSubmitted.value = false;
      currentStep.value = 0;
      store.clearData(); // Use the existing clearData method to reset all form data
    };
    
    watch(() => store.currentStep, (newStep) => {
      if (newStep !== currentStep.value) {
        currentStep.value = newStep;
      }
    });

    onMounted(() => {
      if (store.currentStep !== currentStep.value) {
        currentStep.value = store.currentStep;
      }
    });

    return {
      currentStepComponent,
      aggregatedData,
      nextStep,
      prevStep,
      validateAndNext,
      submitData,
      resetForm,
      currentStep,
      totalSteps,
      isLoading,
      canSubmit,
      isSubmitted,
    };
  },
};
</script>