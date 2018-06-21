<template>
  <div id="tutorial">
    <div id="tutorial-1" v-if="tutorial === 1">
      <div id="tutorial-info" class="tutorial">
        보유중인 현금과 코인, 1초당 채굴되는 코인 수를 확인하실 수 있습니다.
      </div>
      <div id="tutorial-computer" class="tutorial">
        내 컴퓨터를 누르면<br>
        컴퓨터 부품 정보와<br>
        오버클럭(강화)을<br>
        할 수 있습니다.
      </div>
      <div id="tutorial-phone" class="tutorial">
        스마트폰을 누른 후<br>
        가상화폐 거래소에서<br>
        보유중인 코인을<br>
        판매할 수 있습니다<br>
      </div>
      <div id="tutorial-door" class="tutorial">
        현관문을 눌러서<br>
        외출할 수 있습니다.<br>
        컴퓨터 부품과<br>
        아이템을 구매<br>
        할 수 있습니다.
      </div>
    </div>
    <div id="tutorial-2" v-if="tutorial === 2">
      <div id="tutorial-overclock" class="tutorial">
        컴퓨터 부품을 오버클럭하면<br>
        해당 부품 채굴량의<br>
        10% 만큼 효과가 증가합니다.
      </div>
    </div>
    <div id="tutorial-3" v-if="tutorial === 3">
      <div id="tutorial-boost" class="tutorial">
        부스트 아이템 구매 시 일정 %의 코인이 추가로 채굴됩니다.<br>
        <br>
        부스트 아이템은 1분 동안 지속됩니다.
      </div>
    </div>
    <div id="tutorial-4" v-if="tutorial === 4">
      <div id="tutorial-store" class="tutorial">
        각 매장에서 컴퓨터 부품을<br>
        구매할 수 있습니다.<br>
        <br>
        CPU, 램, 그래픽카드 모두<br>
        구매한 후 가상화폐를<br>
        채굴할 수 있습니다.
      </div>
    </div>
    <div id="tutorial-next" @click="next" v-if="tutorial !== 4"></div>
    <div id="tutorial-exit" @click="exit" v-else></div>
  </div>
</template>

<script>
export default {
  name: 'tutorial',
  data () {
    return {
      tutorial: 1
    }
  },
  created () {
    this.tutorial = 1
  },
  methods: {
    next () {
      this.tutorial++
      if (this.tutorial === 4) {
        this.$emit('changeLocation', 'city')
      }
    },
    exit () {
      this.$emit('changeLocation', 'home')
      this.$emit('notify', '지급된 5000원으로 CPU, 램, 그래픽카드를 구매하세요!')
      this.$emit('exitTutorial')
    }
  }
}
</script>

<style>
#tutorial {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
}

.tutorial {
    position: absolute;
    display: inline-block;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    padding: 10px;
}

/* 튜토리얼 다음 버튼 */
#tutorial-next {
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #44b3c2;
  border: 1px solid #44b3c2;
  color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  transition: .5s;
}

#tutorial-next::before {
  content: '다음'
}

#tutorial-next:hover {
  background-color: #fff;
  color: #44b3c2;
}

/* 튜토리얼 종료 버튼 */
#tutorial-exit {
  cursor: pointer;
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #c54040;
  border: 1px solid #c54040;
  color: #fff;
  border-radius: 5px;
  padding: 5px 10px;
  transition: .5s;
}

#tutorial-exit::before {
  content: '튜토리얼 닫기'
}

#tutorial-exit:hover {
  background-color: #fff;
  color: #c54040;
}

#tutorial-info {
  top: 5px;
  left: 5px;
}

#tutorial-computer {
  top: 230px;
  left: 45px;
}

#tutorial-phone {
  bottom: 40px;
  left: 380px;
}

#tutorial-door {
  top: 200px;
  right: 15px;
}

#tutorial-overclock {
  top: 200px;
  left: 50px;
}

#tutorial-boost {
  top: 50px;
  left: 10px;
}

#tutorial-store {
  top: 140px;
  left: 270px;
}

.tutorial-hide {
  display: none;
}
</style>
