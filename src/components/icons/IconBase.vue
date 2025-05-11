<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :aria-labelledby="iconName"
    role="presentation"
    :fill="color"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    :stroke-linecap="strokeLinecap"
    :stroke-linejoin="strokeLinejoin"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g :fill="color" :stroke="stroke">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IconBase',
  props: {
    iconName: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 18
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