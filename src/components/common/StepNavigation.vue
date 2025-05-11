<template>
  <div class="step-navigation">
    <button @click="goBack" :disabled="isFirstStep">Back</button>
    <button @click="goNext" :disabled="isLastStep">Next</button>
  </div>
</template>

<script>
import './StepNavigation.css';

export default {
  props: {
    currentStep: {
      type: Number,
      required: true
    },
    totalSteps: {
      type: Number,
      required: true
    }
  },
  computed: {
    isFirstStep() {
      return this.currentStep === 0;
    },
    isLastStep() {
      return this.currentStep === this.totalSteps - 1;
    }
  },
  methods: {
    goBack() {
      this.$emit('navigate', this.currentStep - 1);
    },
    goNext() {
      this.$emit('navigate', this.currentStep + 1);
    }
  }
};
</script>