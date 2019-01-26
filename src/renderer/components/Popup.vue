<template>
  <div id="popup">
    <button class="popup-close" @click="$emit('closePopup')">x</button>
    <div class="popup-title">{{ title }}</div>
    <div class="popup-content">
      <!-- 팝업 내용 영역 -->
      <popup-computer v-if="type === 'computer'" @notify="notify" @save="$emit('save')" @playSound="$emit('playSound', $event)"/>
      <popup-estate v-else-if="type === 'estate'" @notify="notify" @save="$emit('save')"  @playSound="$emit('playSound', $event)"/>
      <popup-electonic v-else-if="type === 'electronic'" @notify="notify" @save="$emit('save')"  @playSound="$emit('playSound', $event)"/>
      <popup-other-store v-else-if="other" @notify="notify" @save="$emit('save')" @playSound="$emit('playSound', $event)"/>
      <popup-store v-else-if="store" :type="type" @notify="notify" @save="$emit('save')"  @playSound="$emit('playSound', $event)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'popup',
  /* 팝업 제목, 유형 */
  props: {
    title: String,
    type: String
  },
  computed: {
    /* type에 store 문자가 있는지 확인 */
    store () {
      return this.type.toLowerCase().search('store') !== -1
    },
    /* type에 other 문자가 있는지 확인 */
    other () {
      return this.type.toLowerCase().search('other') !== -1
    }
  },
  components: {
    'popup-computer': require('@/components/PopupComputer').default,
    'popup-estate': require('@/components/PopupEstate').default,
    'popup-store': require('@/components/PopupStore').default,
    'popup-other-store': require('@/components/PopupOther').default,
    'popup-electonic': require('@/components/PopupElectronic').default
  },
  methods: {
    /**
     * @description 상위 컴포넌트에게 message 와 함께 notify 이벤트를 발생
     * @param {string} message 알림에 표시할 문자열
     */
    notify (message) {
      this.$emit('notify', message)
    }
  }
}
</script>

<style>
/* 팝업 CSS */

#popup {
  position: absolute;
  width: 350px;
  height: 320px;
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
  height: 250px;
  overflow-y: auto;
}

/* 팝업 내용 영역 스크롤바 스타일 */
.popup-content::-webkit-scrollbar {
  width: 2px;
}

.popup-content::-webkit-scrollbar-thumb {
  background-color: rgb(175, 175, 175);
}

/* 팝업 내 아이템 */
.popup-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  margin: 5px 0px;
}

/* 팝업 아이템 내의 하위 항목 (상세정보) */
.popup-sub-item {
  margin: 5px 0;
}

.popup-sub-item-2 {
  margin: 5px 0;
  color: #e45641;
}

/* 컴퓨터 부품 명 */
.module-name {
  margin: 10px 0;
  color: #44b3c2;
}


/* 구매 버튼 */
.buy-button {
  cursor: pointer;
  outline: none;
  border: 1px solid #50b970;
  background-color: #50b970;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 10px 0px;
  transition: .5s;
}

.buy-button:hover {
  background-color: #fff;
  color: #50b970;
}

/* 구매 버튼 비활성화 */
.buy-button:disabled {
  cursor: unset;
  background-color: #888;
  border: 1px solid #888;
  color: #000;
}

.buy-button:disabled:hover {
  background-color: #888;
  color: #000;
}

</style>
