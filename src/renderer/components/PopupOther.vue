<template>
  <div id="other-store">
    <div id="popup-store-list" class="popup-content">
      <div class="popup-item" v-for="(data, i) in dataList" :key="i">
        <img :src="'./static/' + data.src" class="item-img">
        <div class="store-item-name"> {{ data.name }} </div>
        <div class="store-sub-item"> {{ data.info }} </div>
        <div class="store-sub-item">가격: {{ data.price }} 원</div>
        <div class="store-limit">PSU 제한: {{ data.level }} 레벨 </div>
        <div class="store-duplicate"> {{ data.duplicate ? '중복사용 가능' : '' }} </div>
        <button class="buy-button" @click="buy(data)" v-if="data.always || psuLevel < data.psu">구매</button>
        <button class="buy-button" disabled v-else>매진</button>
      </div>
    </div>
  </div>
</template>

<script>
import Other from '../models/other.js'

export default {
  name: 'store-other',
  data () {
    return {
      /* 기타 매장 데이터 */
      dataList: Other
    }
  },
  computed: {
    /* 유저의 PSU 레벨 */
    psuLevel () {
      return this.$store.state.userdata.data.psu
    }
  },
  methods: {
    /**
     * @description 구매 버튼
     * @param {any} 구매한 제품 데이터 객체
     * 객체 형식은 ../models/other.js 에서 확인 가능
     */
    buy (data) {
      const money = this.$store.state.userdata.data.money
      const psu = this.$store.state.userdata.data.psu

      const cpuIdx = this.$store.state.userdata.data.cpu
      const ramIdx = this.$store.state.userdata.data.ram
      const vgaIdx = this.$store.state.userdata.data.vga

      if (cpuIdx === -1 || ramIdx === -1 || vgaIdx === -1) {
        this.$emit('notify', 'CPU, 램, 그래픽카드가 모두 있어야 구매할 수 있습니다.')
        return
      }

      if (data.level > psu) {
        this.$emit('notify', '파워서플라이 레벨이 낮습니다.')
        return
      }

      if (money - data.price >= 0) {
        document.getElementById('coin-effect').play()
        this.$store.commit('SET_DATA', {key: 'money', value: (money - data.price)})
        if (data.psu) {
          this.$store.commit('SET_DATA', {key: 'psu', value: data.psu})
          this.$emit('notify', `파워서플라이 레벨 업 ${data.psu - 1} > ${data.psu}`)
        } else if (data.boost) {
          if (data.duplicate) {
            this.$store.commit('BOOST', this.$store.state.info.boostPercent + data.boost)
            this.$emit('notify', `${data.boost} % 부스트가 추가되었습니다.`)
          } else {
            this.$store.commit('BOOST', data.boost)
            this.$emit('notify', `${data.boost} % 부스트가 적용되었습니다.`)
          }
          this.$store.commit('BOOST_UPDATE')
        }
        this.$emit('save')
      } else {
        this.$emit('notify', '보유중인 현금이 부족합니다.')
      }
    }
  }
}
</script>

<style>

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

/* PSU 레벨 제한 */
.store-limit {
  color: #e45641;
  font-size: 0.8rem;
  margin-top: 5px;
}

/* 부스트 아이템 중복 사용가능 여부 */
.store-duplicate {
  color: #44b3c2;
  font-size: 0.8rem;
  margin-top: 5px;
}

</style>
