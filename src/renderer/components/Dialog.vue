<template>
  <div id="dialog">
    <div id="dialog-message">
      {{ message }}
    </div>
    <div id="dialog-button-area">
      <button id="dialog-yes" class="dialog-button" @click="$emit('closeDialog', true)">예</button>
      <button id="dialog-no" class="dialog-button" @click="$emit('closeDialog', false)">아니오</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-view',
  /* 대화창에 표시될 메시지 */
  props: ['message']
}
</script>

<style>
#dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 10px;
  padding-top: 40px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  color: #000;
  width: 260px;
  height: 150px;
  z-index: 5;
  text-align: center;
}

/* 다이얼로그 버튼 영역 */
#dialog-button-area {
  position: absolute;
  left: 50%;
  bottom: 5px;
  transform: translateX(-50%);
}

/* 다이얼로그 버튼 */
.dialog-button {
  font-family: 'pixel';
  cursor: pointer;
  outline: none;
  border: 1px solid #fff;
  border-radius: 5px;
  padding: 5px 10px;
  transition: .5s;
}

/* 예 버튼 */
#dialog-yes {
  background-color: #44b3c2;
  color: #fff;
}

#dialog-yes:hover {
  background-color: #fff;
  color: #44b3c2;
  border: 1px solid #44b3c2;
}

/* 아니오 버튼 */
#dialog-no {
  background-color: #e45641;
  color: #fff;
  border: 1px solid #e45641;
}

#dialog-no:hover {
  background-color: #fff;
  color: #e45641;
}
</style>
