<template>
  <div id="notify">{{ message }}</div>
</template>

<script>
export default {
  name: 'notify',
  /* 알림에 표시할 데이터 */
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
