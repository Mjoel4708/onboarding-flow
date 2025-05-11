<template>
  <Teleport to="body">
    <div 
      v-if="visible"
      class="toast-container"
      :class="[position, type]"
    >
      <div class="toast-content">
        <div class="toast-icon" v-if="type === 'success'">
          <IconCheckCircle />
        </div>
        <div class="toast-icon" v-else-if="type === 'error'">
          <IconAlertCircle />
        </div>
        <div class="toast-icon" v-else-if="type === 'info'">
          <IconAlertCircle />
        </div>
        <div class="toast-message">{{ message }}</div>
        <button class="toast-close" @click="closeToast" title="Close">
          <IconClose :size="16" />
        </button>
      </div>
      <div class="toast-progress" v-if="autoClose">
        <div class="progress-bar" ref="progressBar"></div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import IconCheckCircle from '../icons/IconCheckCircle.vue';
import IconAlertCircle from '../icons/IconAlertCircle.vue';
import IconClose from '../icons/IconClose.vue';
import './Toast.css';

export default {
  name: 'Toast',
  components: {
    IconCheckCircle,
    IconAlertCircle,
    IconClose
  },
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'error'].includes(value)
    },
    position: {
      type: String,
      default: 'top',
      validator: (value) => ['top', 'bottom'].includes(value)
    },
    duration: {
      type: Number,
      default: 300
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const progressBar = ref(null);
    let timeout = null;
    
    const startTimer = () => {
      if (props.autoClose && props.visible) {
        // Reset any existing timeout
        if (timeout) {
          clearTimeout(timeout);
        }
        
        // Animate progress bar
        if (progressBar.value) {
          progressBar.value.style.transition = `width ${props.duration}ms linear`;
          progressBar.value.style.width = '0%';
        }
        
        timeout = setTimeout(() => {
          emit('close');
        }, props.duration);
      }
    };
    
    const closeToast = () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      emit('close');
    };
    
    // Watch for visibility changes
    watch(() => props.visible, (newValue) => {
      if (newValue) {
        // Reset progress bar
        if (progressBar.value) {
          progressBar.value.style.transition = 'none';
          progressBar.value.style.width = '100%';
          
          // Force reflow
          progressBar.value.offsetHeight;
          
          // Start the timer
          startTimer();
        }
      }
    });
    
    onMounted(() => {
      if (props.visible) {
        startTimer();
      }
    });
    
    onUnmounted(() => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
    
    return {
      progressBar,
      closeToast
    };
  }
};
</script>