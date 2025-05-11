<template>
  <IconBase iconName="industry" :size="size" :color="color">
    <path d="M2 20h20" />
    <path d="M5 8h3v12H5z" />
    <path d="M12 4h3v16h-3z" />
    <path d="M19 12h3v8h-3z" />
  </IconBase>
</template>

<script>
import IconBase from './IconBase.vue';

export default {
  name: 'IconIndustry',
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