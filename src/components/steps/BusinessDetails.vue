<template>
  <div class="business-details">
    <h2>Tell us about your business</h2>
    <p class="section-description">Please provide information about your company</p>
    
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group">
        <label for="businessName">Business Name</label>
        <div class="input-with-icon">
          <IconBuilding class="input-icon" size="20" color="#95a5a6" />
          <input 
            id="businessName" 
            type="text" 
            v-model="formData.businessName" 
            placeholder="Enter your business name" 
            
          />
        </div>
        <p class="error-message" v-if="errors.businessName">{{ errors.businessName }}</p>
      </div>
      
      <div class="form-group">
        <label>Business Logo</label>
        <div class="logo-upload-container">
          <div class="logo-preview" v-if="logoPreview">
            <img :src="logoPreview" alt="Logo Preview" />
            <button type="button" class="remove-image" @click="removeLogo">×</button>
          </div>
          <FileUploader
            v-else
            @file-selected="handleLogoUpload"
            :error="fileError.logo || errors.businessLogo"
            acceptedTypes="image/jpeg,image/png"
            maxSize="2MB"
            class="logo-uploader"
          >
            <div class="upload-placeholder">
              <IconImage class="upload-icon" size="32" color="#7f8c8d" />
              <span class="upload-text">Upload Business Logo</span>
              <small>JPG or PNG, max 2MB</small>
            </div>
          </FileUploader>
        </div>
        <p class="error-message" v-if="fileError.logo || errors.businessLogo">{{ fileError.logo || errors.businessLogo }}</p>
      </div>
      
      <div class="form-group">
        <label for="industry">Industry</label>
        <div class="select-with-icon">
          <IconIndustry class="input-icon" size="20" color="#95a5a6" />
          <select id="industry" v-model="formData.industry"  class="styled-select">
            <option value="" disabled>Select your industry</option>
            <option v-for="industry in industries" :key="industry.id" :value="industry.name">
              {{ industry.name }}
            </option>
          </select>
        </div>
        <p class="error-message" v-if="errors.industry">{{ errors.industry }}</p>
      </div>
      
      <div class="form-group">
        <label for="companySize">Company Size</label>
        <div class="select-with-icon">
          <IconUsers class="input-icon" size="20" color="#95a5a6" />
          <select id="companySize" v-model="formData.companySize" class="styled-select">
            <option value="" disabled>Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>
        <p class="error-message" v-if="errors.companySize">{{ errors.companySize }}</p>
      </div>
      
      <div class="form-group">
        <label>Business Document</label>
        <div class="document-upload-container">
          <div class="document-preview" v-if="documentNamePreview">
            <div class="document-info">
              <IconDocument class="document-icon" size="30" color="#3498db" />
              <span class="document-name">{{ documentNamePreview }}</span>
            </div>
            <button type="button" class="remove-document" @click="removeDocument">×</button>
          </div>
          <FileUploader
            v-else
            @file-selected="handleDocumentUpload"
            :error="fileError.document || errors.document"
            acceptedTypes="application/pdf"
            maxSize="5MB"
            class="document-uploader"
          >
            <div class="upload-placeholder">
              <IconDocument class="upload-icon" size="32" color="#7f8c8d" />
              <span class="upload-text">Upload Business Document</span>
              <small>PDF only, max 5MB</small>
            </div>
          </FileUploader>
        </div>
        <p class="error-message" v-if="fileError.document || errors.document">{{ fileError.document || errors.document }}</p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useOnboardingStore } from '@/stores/onboarding';
import FileUploader from '../common/FileUploader.vue';
import { fetchIndustries } from '../../api/mockServices'; // Assuming this is the correct path
import { useFormValidation, businessDetailsSchema } from '@/composables/useFormValidation';
import IconBuilding from '@/components/icons/IconBuilding.vue';
import IconImage from '@/components/icons/IconImage.vue';
import IconIndustry from '@/components/icons/IconIndustry.vue';
import IconUsers from '@/components/icons/IconUsers.vue';
import IconDocument from '@/components/icons/IconDocument.vue';
import './BusinessDetails.css';

export default {
  components: {
    FileUploader,
    IconBuilding,
    IconImage,
    IconIndustry,
    IconUsers,
    IconDocument
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
    const { validate } = useFormValidation();
    
    const formData = ref({
      businessName: store.businessDetails.businessName || '',
      businessLogo: store.businessDetails.businessLogo || null,
      industry: store.businessDetails.industry || '',
      companySize: store.businessDetails.companySize || null,
      document: store.businessDetails.document || null,
      documentName: store.businessDetails.documentName || '' // Keep for store updates
    });
    
    const errors = ref({}); // For Zod validation errors
    const fileError = ref({ logo: null, document: null }); // For FileUploader specific errors
    
    const industries = ref([]);
    const logoPreview = ref(null);

    const setLogoPreview = (file) => {
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          logoPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      } else if (typeof file === 'string' && file) {
        logoPreview.value = file;
      } else {
        logoPreview.value = null;
      }
    };

    // This computed is for display in the template if a document is selected
    const documentNamePreview = computed(() => {
      if (formData.value.document instanceof File) {
        return formData.value.document.name;
      }
      return formData.value.documentName || null; // Show stored name if no file object
    });

    onMounted(async () => {
      formData.value = {
        businessName: store.businessDetails.businessName || '',
        businessLogo: store.businessDetails.businessLogo || null,
        industry: store.businessDetails.industry || '',
        companySize: store.businessDetails.companySize || null,
        document: store.businessDetails.document || null,
        documentName: store.businessDetails.documentName || ''
      };
      setLogoPreview(store.businessDetails.businessLogo);
      // documentNamePreview is computed, so it will update based on formData

      if (store.errors.businessDetails) {
        errors.value = store.errors.businessDetails;
      }

      try {
        const fetchedIndustries = await fetchIndustries();
        industries.value = fetchedIndustries.map((name, index) => ({ 
          id: index + 1, 
          name 
        }));
      } catch (error) {
        console.error('Failed to fetch industries:', error);
        // Fallback industries
        industries.value = [
          { id: 1, name: 'Technology' },
          { id: 2, name: 'Finance' },
          { id: 3, name: 'Healthcare' }
        ];
      }
    });

    const handleLogoUpload = (file) => {
      fileError.value.logo = null;
      errors.value.businessLogo = null;
      if (file) {
        formData.value.businessLogo = file;
        setLogoPreview(file);
      } else {
        fileError.value.logo = 'Invalid file type or size for logo.';
        formData.value.businessLogo = null;
        setLogoPreview(null);
      }
    };

    const removeLogo = () => {
      formData.value.businessLogo = null;
      setLogoPreview(null);
      fileError.value.logo = null;
      errors.value.businessLogo = null;
    };

    const handleDocumentUpload = (file) => {
      fileError.value.document = null;
      errors.value.document = null;
      if (file) {
        formData.value.document = file;
        formData.value.documentName = file.name; // Update documentName in formData
      } else {
        fileError.value.document = 'Invalid file type or size for document.';
        formData.value.document = null;
        formData.value.documentName = ''; // Clear documentName
      }
    };

    const removeDocument = () => {
      formData.value.document = null;
      formData.value.documentName = '';
      fileError.value.document = null;
      errors.value.document = null;
    };

    const validateForm = () => {
      // Ensure documentName is correctly passed for validation if document is not a File instance
      const dataToValidate = {
        ...formData.value,
        // The schema expects `document` to be a File or undefined.
        // If `document` is a string (metadata), it shouldn't be passed directly to Zod `instanceof(File)`
        // The current schema expects a File object for `document` and `businessLogo`.
        // If you intend to validate based on metadata when a File object isn't present, the schema needs adjustment.
        // For now, we assume `document` and `businessLogo` in `formData` are either File or null.
      };

      const result = validate(dataToValidate, businessDetailsSchema);
      if (result === true) {
        errors.value = {};
        store.clearBusinessDetailsErrors();
        return true;
      } else {
        const newErrors = {};
        result.forEach(err => {
          newErrors[err.path[0]] = err.message;
        });
        errors.value = newErrors;
        store.setBusinessDetailsErrors(newErrors);
        return false;
      }
    };

    watch(() => formData.value, (newValue) => {
      // When formData changes, update the store.
      // This includes documentName which is part of businessDetails in the store.
      store.updateBusinessDetails(newValue);
    }, { deep: true });

    watch(() => props.triggerValidation, (shouldValidate) => {
      if (shouldValidate) {
        const isValid = validateForm();
        emit('validation-complete', isValid);
      }
    });

    // Watch for changes from the store to update local component state (e.g., after loading from storage)
    watch(() => store.businessDetails.businessLogo, (newLogo) => {
        setLogoPreview(newLogo);
    });
     watch(() => store.businessDetails.documentName, (newName) => {
        // If the document in store is just metadata (name), and we don't have a File object locally
        if (! (formData.value.document instanceof File)) {
            formData.value.documentName = newName || '';
        }
    });

    const handleSubmit = () => {
      // This method is less relevant if validation is primarily parent-driven
      if (validateForm()) {
        store.updateBusinessDetails(formData.value);
        // emit('next'); // Parent will handle emitting next
      }
    };

    // Expose a method for the parent to call to trigger validation and proceed
    const attemptProceed = () => {
      if (validateForm()) {
        store.updateBusinessDetails(formData.value); // Ensure latest data is in store
        emit('next');
      }
    };

    return {
      formData,
      errors,
      fileError,
      industries,
      logoPreview,
      documentNamePreview, // Use this for display
      handleLogoUpload,
      removeLogo,
      handleDocumentUpload,
      removeDocument,
      handleSubmit,
      attemptProceed,
      validateForm,
    };
  },
};
</script>