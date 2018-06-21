<template>
  <div id="notify">{{ message }}</div>
</template>

<script>
export default {
  name: 'notify',
  props: ['message']
}
</script>

<style>
#notify {
  position: absolute;
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 5px;
  color: #000;
  z-index: 6;
  bottom: 5px;
  left: 5px;
}
</style>
