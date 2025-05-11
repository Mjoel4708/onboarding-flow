<template>
  <div id="app">
    <OnboardingFlow />
  </div>
</template>

<script>
import OnboardingFlow from './views/OnboardingFlow.vue';
import './App.css';

export default {
  name: 'App',
  components: {
    OnboardingFlow
  }
};
</script>