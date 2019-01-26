<template>
  <div id="message-notify">
    <div>
      <img src="@/assets/message.png"> iSee 메신저
    </div>
    <div class="isee-message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'message',
  /* 메시지에 표시할 데이터 */
  props: {
    message: String
  }
}
</script>

<style>
#message-notify {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 5px;
  color: #000;
  z-index: 6;
}

#message-notify img {
  float: left;
  margin-right: 5px;
  width: 20px;
}

.isee-message {
  text-align: left;
}
</style>
