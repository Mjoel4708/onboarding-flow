<template>
  <IconBase iconName="building" :size="size" :color="color">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22V4" />
    <path d="M15 22V4" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="8" y1="7" x2="8" y2="7.01" />
    <line x1="16" y1="7" x2="16" y2="7.01" />
    <line x1="8" y1="17" x2="8" y2="17.01" />
    <line x1="16" y1="17" x2="16" y2="17.01" />
  </IconBase>
</template>

<script>
import IconBase from './IconBase.vue';

export default {
  name: 'IconBuilding',
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