<template>
  <div class="file-uploader">
    <label :for="inputId" class="file-label">
      <slot>
        <div class="upload-placeholder">
          <span class="upload-icon">📎</span>
          <span>Click to upload file</span>
        </div>
      </slot>
      <input
        type="file"
        :id="inputId"
        :accept="acceptedTypes"
        @change="handleFileChange"
        class="file-input"
      />
    </label>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useFileValidation } from '@/composables/useFileValidation';
import './FileUploader.css';

export default {
  props: {
    acceptedTypes: {
      type: String,
      default: 'image/*',
    },
    maxSize: {
      type: [String, Number],
      default: '2MB', // Default to 2MB
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['file-selected'],
  setup(props, { emit }) {
    const fileName = ref('');
    const inputId = `file-uploader-${Math.random().toString(36).substr(2, 9)}`;

    const maxSizeInBytes = computed(() => {
      if (typeof props.maxSize === 'number') {
        return props.maxSize;
      }
      
      const sizeStr = props.maxSize.toString();
      const size = parseFloat(sizeStr);
      
      if (sizeStr.toLowerCase().includes('kb')) {
        return size * 1024;
      } else if (sizeStr.toLowerCase().includes('mb')) {
        return size * 1024 * 1024;
      } else if (sizeStr.toLowerCase().includes('gb')) {
        return size * 1024 * 1024 * 1024;
      }
      
      return size;
    });

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      
      if (file) {
        // Check file type
        const validTypes = props.acceptedTypes.split(',').map(type => type.trim());
        const isValidType = validTypes.some(type => {
          if (type.includes('/*')) {
            const mainType = type.split('/')[0];
            return file.type.startsWith(`${mainType}/`);
          }
          return file.type === type;
        });

        // Check file size
        const isValidSize = file.size <= maxSizeInBytes.value;

        if (!isValidType) {
          emit('file-selected', null);
        } else if (!isValidSize) {
          emit('file-selected', null);
        } else {
          fileName.value = file.name;
          emit('file-selected', file);
        }
      }
    };

    return {
      fileName,
      inputId,
      handleFileChange,
    };
  },
};
</script>