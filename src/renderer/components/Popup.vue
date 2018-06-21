<template>
  <div id="popup">
    <button class="popup-close" @click="$emit('closePopup')">x</button>
    <div class="popup-title">{{ title }}</div>
    <div class="popup-content">
      <!-- 팝업 내용 영역 -->
      <popup-computer v-if="type === 'computer'"></popup-computer>
      <popup-store v-if="type === 'store'"></popup-store>
      <popup-other-store v-if="type === 'other'"></popup-other-store>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup',
  props: ['title', 'type'],
  date () {
    return {}
  },
  components: {
    'popup-computer': require('@/components/PopupComputer').default,
    'popup-store': require('@/components/PopupStore').default,
    'popup-other-store': require('@/components/PopupOther').default
  }
}
</script>

<style>
/* 팝업 CSS */

#popup {
  position: absolute;
  width: 350px;
  height: 250px;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 10px;
  padding-top: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  text-align: center;
  z-index: 4;
}

/* 팝업 X 버튼 */
.popup-close {
  outline: none;
  cursor: pointer;
  position: absolute;
  top: 1px;
  right: 10px;
  color: #e45641;
  font-weight: bold;
  font-size: 1.3rem;
  border: none;
  background-color: #fff;
}

/* 팝업 상단 제목 */
.popup-title {
  font-weight: bold;
  font-size: 1.4rem;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
}

/* 팝업 내용 */
.popup-content {
  height: 180px;
  overflow-y: auto;
}

/* 팝업 내용 영역 스크롤바 스타일 */
.popup-content::-webkit-scrollbar {
  width: 2px;
}

.popup-content::-webkit-scrollbar-thumb {
  background-color: rgb(175, 175, 175);
}

</style>
