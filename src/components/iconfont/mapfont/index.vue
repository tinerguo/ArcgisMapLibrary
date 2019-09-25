<template>
  <i class="iconfont" :class="`${name}`" aria-hidden="true"></i>
</template>

<script>
import './font/iconfont.css';
export default {
    name: 'mapFont',
    props: {
        name: {
            type: String,
            required: false,
            default: ''
        }
    }
};
</script>
