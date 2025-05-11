<template>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      :stroke="color"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      :aria-label="title ? title : 'Check Circle Icon'"
    >
      <title v-if="title">{{ title }}</title>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="8 12 11 15 16 9"></polyline>
    </svg>
  </template>
  
  <script>
  export default {
    name: "CheckCircleIcon",
    props: {
      size: {
        type: [Number, String],
        default: 24
      },
      color: {
        type: String,
        default: "currentColor"
      },
      strokeWidth: {
        type: [Number, String],
        default: 2
      },
      title: {
        type: String,
        default: ""
      }
    }
  };
  </script>