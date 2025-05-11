<template>
  <IconBase 
    icon-name="close" 
    :size="size" 
    :color="color" 
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :stroke-linecap="strokeLinecap"
    :stroke-linejoin="strokeLinejoin"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </IconBase>
</template>

<script>
import IconBase from './IconBase.vue';

export default {
  name: 'IconClose',
  components: {
    IconBase
  },
  props: {
    size: {
      type: [Number, String],
      default: 20
    },
    color: {
      type: String,
      default: 'currentColor'
    },
    stroke: {
      type: String,
      default: 'currentColor'
    },
    strokeWidth: {
      type: [Number, String],
      default: 2
    },
    strokeLinecap: {
      type: String,
      default: 'round'
    },
    strokeLinejoin: {
      type: String,
      default: 'round'
    }
  }
}
</script>