<template>
  <IconBase iconName="alert-circle" :size="size" :color="color">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </IconBase>
</template>

<script>
import IconBase from './IconBase.vue';

export default {
  name: 'IconAlertCircle',
  components: { IconBase },
  props: {
    size: {
      type: [Number, String],
      default: 18
    },
    color: {
      type: String,
      default: 'currentColor'
    }
  }
}
</script>