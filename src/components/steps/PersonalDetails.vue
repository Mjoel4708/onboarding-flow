<template>
  <div class="personal-details">
    <h2>Tell us about yourself</h2>
    <p class="section-description">Please provide your personal information to get started</p>
    
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label for="name">Full Name</label>
        <div class="input-with-icon">
          <IconUser class="input-icon" size="20" color="#95a5a6" />
          <input 
            id="name" 
            type="text" 
            v-model="formData.name" 
            placeholder="Enter your full name" 
            
          />
        </div>
        <p class="error-message" v-if="errors.name">{{ errors.name }}</p>
      </div>
      
      <div class="form-group">
        <label for="email">Email Address</label>
        <div class="input-with-icon">
          <IconMail class="input-icon" size="20" color="#95a5a6" />
          <input 
            id="email" 
            type="email" 
            v-model="formData.email" 
            placeholder="Enter your email address" 
            
          />
        </div>
        <p class="error-message" v-if="errors.email">{{ errors.email }}</p>
      </div>
      
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <div class="input-with-icon">
          <IconPhone class="input-icon" size="20" color="#95a5a6" />
          <input 
            id="phone" 
            type="tel" 
            v-model="formData.phone" 
            placeholder="Enter your phone number" 
            
          />
        </div>
        <p class="error-message" v-if="errors.phone">{{ errors.phone }}</p>
      </div>
      
      <div class="form-group">
        <label for="profileImage">Profile Picture</label>
        <div class="profile-upload-container">
          <div class="profile-preview" v-if="profilePreview">
            <img :src="profilePreview" alt="Profile Preview" />
            <button type="button" class="remove-image" @click="removeImage">×</button>
          </div>
          <FileUploader
            v-else
            @file-selected="handleFileUpload"
            :error="fileError || errors.profileImage"
            acceptedTypes="image/jpeg, image/png"
            maxSize="2MB"
            class="profile-uploader"
          >
            <template v-slot:default>
              <div class="upload-placeholder">
                <IconCamera class="upload-icon" size="32" color="#7f8c8d" />
                <span class="upload-text">Upload Profile Picture</span>
                <small>JPG or PNG, max 2MB</small>
              </div>
            </template>
          </FileUploader>
        </div>
        <p class="error-message" v-if="fileError || errors.profileImage">{{ fileError || errors.profileImage }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useFormValidation, personalDetailsSchema } from '@/composables/useFormValidation';
import FileUploader from '@/components/common/FileUploader.vue';
import { useOnboardingStore } from '@/stores/onboarding';
import IconUser from '@/components/icons/IconUser.vue';
import IconMail from '@/components/icons/IconMail.vue';
import IconPhone from '@/components/icons/IconPhone.vue';
import IconCamera from '@/components/icons/IconCamera.vue';
import './PersonalDetails.css';

export default {
  name: 'PersonalDetails',
  components: {
    FileUploader,
    IconUser,
    IconMail,
    IconPhone,
    IconCamera
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    triggerValidation: { // Prop to trigger validation from parent
      type: Boolean,
      default: false,
    }
  },
  emits: ['next', 'back', 'validation-complete'],
  setup(props, { emit }) {
    const store = useOnboardingStore();
    
    const formData = ref({
      name: store.personalDetails.name || '',
      email: store.personalDetails.email || '',
      phone: store.personalDetails.phone || '',
      profileImage: store.personalDetails.profileImage || null,
    });
    
    const fileError = ref(null); // For FileUploader specific errors
    const errors = ref({}); // For Zod validation errors

    const { validate } = useFormValidation();
    
    const profilePreview = ref(null);

    const setProfilePreview = (file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (typeof file === 'string' && file) {
        profilePreview.value = file;
      } else {
        profilePreview.value = null;
      }
    };

    onMounted(() => {
      // Initialize form data from store and set preview
      formData.value = {
        name: store.personalDetails.name || '',
        email: store.personalDetails.email || '',
        phone: store.personalDetails.phone || '',
        profileImage: store.personalDetails.profileImage || null,
      };
      setProfilePreview(store.personalDetails.profileImage);

      // Set initial errors from store if any
      if (store.errors.personalDetails) {
        errors.value = store.errors.personalDetails;
      }
    });
    
    const handleFileUpload = (file) => {
      fileError.value = null; // Clear previous FileUploader error
      errors.value.profileImage = null; // Clear previous Zod error for profileImage
      if (file) {
        formData.value.profileImage = file;
        setProfilePreview(file);
      } else {
        // FileUploader itself might emit an error, or we can set one here
        fileError.value = 'Invalid file type or size selected.';
        formData.value.profileImage = null; // Ensure it's null if invalid
        setProfilePreview(null);
      }
    };
    
    const removeImage = () => {
      formData.value.profileImage = null;
      profilePreview.value = null;
      fileError.value = null;
      errors.value.profileImage = null; 
    };

    const validateForm = () => {
      const result = validate(formData.value, personalDetailsSchema);
      if (result === true) {
        errors.value = {};
        store.clearPersonalDetailsErrors();
        return true;
      } else {
        const newErrors = {};
        result.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        errors.value = newErrors;
        store.setPersonalDetailsErrors(newErrors);
        return false;
      }
    };
    
    const handleSubmit = () => { // This is called by form @submit.prevent, can be used for internal validation if needed
      // This method is less relevant if validation is primarily parent-driven
      if (validateForm()) {
        store.updatePersonalDetails(formData.value);
        // emit('next'); // Parent will handle emitting next
      }
    };

    watch(() => formData.value, (newValue) => {
      store.updatePersonalDetails(newValue); // Keep store updated for persistence
      // Optionally, re-validate on change, or wait for explicit trigger
      // validateForm(); 
    }, { deep: true });

    watch(() => props.triggerValidation, (shouldValidate) => {
      if (shouldValidate) {
        const isValid = validateForm();
        emit('validation-complete', isValid);
      }
    });
    
    // Update profilePreview when store.personalDetails.profileImage changes (e.g. on load)
    watch(() => store.personalDetails.profileImage, (newImage) => {
        setProfilePreview(newImage);
        // If the store image is null (e.g. after loading from storage where only metadata exists)
        // and formData still holds a File object, this might need reconciliation
        // or rely on onMounted to set the initial state correctly.
    });


    // Expose a method for the parent to call to trigger validation and proceed
    const attemptProceed = () => {
      if (validateForm()) {
        store.updatePersonalDetails(formData.value); // Ensure latest data is in store
        emit('next');
      }
    };

    return {
      formData,
      fileError,
      errors,
      profilePreview,
      handleFileUpload,
      removeImage,
      handleSubmit, // Keep if form has its own submit button (not in this design)
      // nextStep, // Replaced by parent-driven navigation
      // prevStep, // Parent handles this
      attemptProceed, // Expose this for parent
      validateForm, // Expose for parent if needed, or rely on triggerValidation
    };
  },
};
</script>