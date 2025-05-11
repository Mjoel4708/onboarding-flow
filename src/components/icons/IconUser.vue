<template>
  <IconBase iconName="user" :size="size" :color="color">
    <circle cx="12" cy="7" r="4" />
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
  </IconBase>
</template>

<script>
import IconBase from './IconBase.vue';

export default {
  name: 'IconUser',
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