const Store = require('./store.js')

const cpu = require('./model/cpu.js')
const ram = require('./model/ram.js')
const vga = require('./model/vga.js')
const other = require('./model/other.js')

class Game {
  constructor () {
    this.store = new Store('user.dat')

    /* 튜토리얼 1, 2, 3 진행 체크 */
    this.tutorialIdx = 0

    /* 1초당 코인 갯수 */
    this.coinPerSecond = 0

    /* 보너스 코인 갯수 */
    this.boostCoinPerSecond = 0

    /* 보너스 코인 % */
    this.coinBoostPercent = 0

    /* 부스트 지속 시간 */
    this.boostTime = 0

    /* 게임 이어서 하기(false: 파일 없음, true: 이어서하기 가능) */
    this.load = false

    /* Drawer 메뉴 열기/닫기 */
    this.drawer = false

    /* 팝업창 열기/닫기 */
    this.popupComputer = false
    this.popupPhone = false
    this.popupStore = false

    /* 다이얼로그 타입 */
    this.dialogType = ''

    /* Interval 반복 객체 */
    this.loop = null

    /* 부품별 1초당 코인 채굴량 */
    this.cpuCoin = 0
    this.ramCoin = 0
    this.vgaCoin = 0

    /* 부품별 오버클럭 추가 코인 채굴량 */
    this.cpuBoostCoin = 0
    this.ramBoostCoin = 0
    this.vgaBoostCoin = 0

    /* 오버클럭 비용 */
    this.cpuOverclock = 0
    this.ramOverclock = 0
    this.vgaOverclock = 0

    /* 1 BTC 당 가격 */
    this.coinPrice = 10

    /* 효과음 Elements */
    this.coinSound = document.getElementById('coin-sound')
    this.computerSound = document.getElementById('computer-sound')
    this.doorSound = document.getElementById('door-sound')
    this.phoneSound = document.getElementById('phone-sound')
    this.shopSound = document.getElementById('shop-sound')
  }

  /**
   * @description 인스턴스 초기화
   */
  init () {
    if (this.store.check()) {
      this.store.load()
      this.load = true
    } else {
      let button = document.getElementById('continue-button')
      button.classList.remove('menu-text')
      button.classList.add('disable-text')
    }
  }

  /**
   * @description 게임 초기화
   */
  gameInit () {
    /* HTML: 아이디가 main인 영역 숨기기 */
    document.getElementById('main').style['display'] = 'none'

    /* HTML: 아이디가 city인 영역 숨기기 */
    document.getElementById('city').style['display'] = 'none'

    /* HTML: 아이디가 game인 영역 보이기 */
    document.getElementById('game').style['display'] = 'block'

    /* HTML: 아이디가 home인 영역 보이기 */
    document.getElementById('home').style['display'] = 'block'

    /* 튜토리얼 영역 */
    if (this.store.getData('tutorial') === 1) {
      this.tutorialIdx = 0
      document.getElementById('tutorial').style['display'] = 'block'
      document.getElementById('tutorial-1').classList.remove('tutorial-hide')
      document.getElementById('tutorial-2').classList.add('tutorial-hide')
      document.getElementById('tutorial-3').classList.add('tutorial-hide')
      document.getElementById('tutorial-4').classList.add('tutorial-hide')
      document.getElementById('tutorial-exit').classList.add('tutorial-hide')

      /* 튜토리얼 다음 버튼 */
      document.getElementById('tutorial-next').onclick = () => {
        if (this.tutorialIdx === 0) {
          document.getElementById('tutorial-1').classList.add('tutorial-hide')
          document.getElementById('tutorial-2').classList.remove('tutorial-hide')
          this.togglePopupComputer()
          this.tutorialIdx = 1
        } else if (this.tutorialIdx === 1) {
          this.togglePopupComputer()
          document.getElementById('tutorial-2').classList.add('tutorial-hide')
          document.getElementById('tutorial-3').classList.remove('tutorial-hide')
          this.tutorialIdx = 2
        } else {
          this.city()
          document.getElementById('tutorial-3').classList.add('tutorial-hide')
          document.getElementById('tutorial-4').classList.remove('tutorial-hide')
          document.getElementById('tutorial-exit').classList.remove('tutorial-hide')
        }
      }
    }

    /* 코인 시세 변경 */
    this.refreshCoin()

    /* 1초당 채굴되는 코인 량 계산 */
    this.calcCoinPerSecond()

    /* 세이브파일에 저장된 정보 보여주기 */
    this.update()

    /* 컴퓨터 클릭시 이벤트 */
    document.getElementById('my-computer').onclick = () => {
      this.togglePopupComputer()
    }

    /* 핸드폰 클릭시 이벤트 */
    document.getElementById('phone').onclick = () => {
      this.togglePopupPhone()
    }

    /* 문 클릭시 이벤트 */
    document.getElementById('door').onclick = () => {
      if (this.popupComputer) {
        this.togglePopupComputer()
      }

      if (this.popupPhone) {
        this.togglePopupPhone()
      }

      this.city()
    }

    /* 컴퓨터 팝업 닫기 버튼 이벤트 */
    document.getElementById('popup-computer-close').onclick = () => {
      this.togglePopupComputer()
    }

    /* 핸드폰 팝업 닫기 버튼 이벤트 */
    document.getElementById('phone-exit').onclick = () => {
      this.togglePopupPhone()
    }

    /* 게임 종료 버튼 이벤트 */
    document.getElementById('game-exit').onclick = () => {
      this.showDialog('정말 종료하시겠습니까?', 'exitGame')
    }

    /* 튜토리얼 종료 버튼 이벤트 */
    document.getElementById('tutorial-exit').onclick = () => {
      this.store.setData('tutorial', 0)
      document.getElementById('tutorial').style['display'] = 'none'
      this.home()
      this.showNotify('지급된 5000원으로 CPU, 램, 그래픽카드를 구매하세요!')
    }

    /* 램 매장 클릭시 이벤트 */
    document.getElementById('ram-store').onclick = () => {
      this.togglePopupStore('램 매장', 'ram')
    }

    /* CPU 매장 클릭시 이벤트 */
    document.getElementById('cpu-store').onclick = () => {
      this.togglePopupStore('CPU 매장', 'cpu')
    }

    /* 그래픽카드 매장 클릭시 이벤트 */
    document.getElementById('vga-store').onclick = () => {
      this.togglePopupStore('그래픽카드 매장', 'vga')
    }

    /* 기타 소모품 매장 클릭시 이벤트 */
    document.getElementById('other-store').onclick = () => {
      this.togglePopupStore('소모품 매장', 'other')
    }

    /* 매장 팝업 닫기 버튼 이벤트 */
    document.getElementById('popup-store-close').onclick = () => {
      this.togglePopupStore()
    }

    /* CPU 오버클럭 버튼 */
    document.getElementById('cpu-overclock').onclick = () => {
      if (!this.checkModules()) {
        this.showNotify('CPU, 램, 그래픽카드가 모두 있어야 오버클럭 할 수 있습니다.')
        return
      }

      if (this.store.getData('money') - this.cpuOverclock >= 0) {
        if (this.store.getData('cpuLv') + 1 <= 10) {
          this.coinSound.play()

          /* 비용 차감 */
          this.store.setData('money', this.store.getData('money') - this.cpuOverclock)

          /* 오버클럭 레벨 증가 */
          this.store.setData('cpuLv', this.store.getData('cpuLv') + 1)

          /* 초당 채굴량 계산 */
          this.calcCoinPerSecond()

          this.boostCoinUpdate()

          this.updateHeaderInfo()

          this.updateComputerPopup()
          this.save()
        } else {
          this.showNotify('이미 최대 레벨에 도달했습니다.')
        }
      } else {
        this.showNotify('현금이 부족합니다.')
      }
    }

    /* 램 오버클럭 버튼 */
    document.getElementById('ram-overclock').onclick = () => {
      if (!this.checkModules()) {
        this.showNotify('CPU, 램, 그래픽카드가 모두 있어야 오버클럭 할 수 있습니다.')
        return
      }

      if (this.store.getData('money') - this.ramOverclock >= 0) {
        if (this.store.getData('ramLv') + 1 <= 10) {
          this.coinSound.play()

          /* 비용 차감 */
          this.store.setData('money', this.store.getData('money') - this.ramOverclock)

          /* 오버클럭 레벨 증가 */
          this.store.setData('ramLv', this.store.getData('ramLv') + 1)

          /* 초당 채굴량 계산 */
          this.calcCoinPerSecond()

          this.boostCoinUpdate()

          this.updateHeaderInfo()

          this.updateComputerPopup()
          this.save()
        } else {
          this.showNotify('이미 최대 레벨에 도달했습니다.')
        }
      } else {
        this.showNotify('현금이 부족합니다.')
      }
    }

    /* 그래픽카드 오버클럭 버튼 */
    document.getElementById('vga-overclock').onclick = () => {
      if (!this.checkModules()) {
        this.showNotify('CPU, 램, 그래픽카드가 모두 있어야 오버클럭 할 z수 있습니다.')
        return
      }

      if (this.store.getData('money') - this.vgaOverclock >= 0) {
        if (this.store.getData('vgaLv') + 1 <= 10) {
          this.coinSound.play()

          /* 비용 차감 */
          this.store.setData('money', this.store.getData('money') - this.vgaOverclock)

          /* 오버클럭 레벨 증가 */
          this.store.setData('vgaLv', this.store.getData('vgaLv') + 1)

          /* 초당 채굴량 계산 */
          this.calcCoinPerSecond()

          this.boostCoinUpdate()

          this.updateHeaderInfo()

          this.updateComputerPopup()
          this.save()
        } else {
          this.showNotify('이미 최대 레벨에 도달했습니다.')
        }
      } else {
        this.showNotify('현금이 부족합니다.')
      }
    }
  }

  /**
   * @description 모든 부품 보유 여부
   */
  checkModules () {
    const cpuLv = this.store.getData('cpu')
    const ramLv = this.store.getData('ram')
    const vgaLv = this.store.getData('vga')

    return (cpuLv > -1 && ramLv > -1 && vgaLv > -1)
  }

  /**
   * @description 오버클럭 가능 여부 확인
   * @param {number} percent 코인 부스트 %
   * @param {boolean} duplicate 코인 부스트 중복 가능 여부
   */
  coinBoost (percent, duplicate) {
    /* 중복 가능 부스트인 경우 누적 */
    if (duplicate) {
      this.coinBoostPercent += percent
      this.showNotify(percent + ' % 부스트가 추가되었습니다.')
    } else {
      /* 중복 불가능 부스트인 경우 % 대체 */
      this.coinBoostPercent = percent
      this.showNotify(percent + ' % 부스트가 적용되었습니다.')
    }

    /* 상단에 추가 코인 정보 업데이트 */
    this.boostCoinUpdate()

    document.getElementById('coin-per-second-boost').style['display'] = 'block'
    document.getElementById('coin-per-second-boost').textContent = '+ ' + this.boostCoinPerSecond

    /* 60초간 부스트 */
    this.boostTime = 60
  }

  /**
   * @description 부스트로 얻는 코인 량 계산
   */
  boostCoinUpdate () {
    this.boostCoinPerSecond = (this.coinPerSecond * (this.coinBoostPercent/100)).toFixed(3)
  }

  /**
   * @description 1초당 채굴되는 코인 량 계산
   */
  calcCoinPerSecond () {
    /* 세이브파일에 저장된 컴퓨터 부품 종류 번호 */
    const cpuNum = this.store.getData('cpu')
    const ramNum = this.store.getData('ram')
    const vgaNum = this.store.getData('vga')

    const cpuLv = this.store.getData('cpuLv')
    const ramLv = this.store.getData('ramLv')
    const vgaLv = this.store.getData('vgaLv')

    /* 부품 번호 중 -1이 하나도 없을 경우 */
    if (cpuNum !== -1 && vgaNum !== -1 && ramNum !== -1) {
      /* 부품 기본 채굴량 */
      this.cpuCoin = cpu[cpuNum].coin
      this.ramCoin = ram[ramNum].coin
      this.vgaCoin = vga[vgaNum].coin

      /* 오버클럭 레벨 1당 해당 부품의 채굴량 10% 증가 */
      this.cpuBoostCoin = cpu[cpuNum].coin * ((cpuLv) / 10)
      this.ramBoostCoin = ram[ramNum].coin * ((ramLv) / 10)
      this.vgaBoostCoin = vga[vgaNum].coin * ((vgaLv) / 10)

      const cpuTotal = this.cpuCoin + this.cpuBoostCoin
      const ramTotal = this.ramCoin + this.ramBoostCoin
      const vgaTotal = this.vgaCoin + this.vgaBoostCoin

      this.coinPerSecond = parseFloat(cpuTotal + ramTotal + vgaTotal).toFixed(3)
    } else {
      this.coinPerSecond = 0
    }
  }

  /**
   * @description 알림 띄우기
   * @param {string} message 알림에 띄울 메시지
   */
  showNotify (message) {
    let notify = document.getElementById('notify')
    notify.style['display'] = 'block'
    notify.textContent = message

    /* 3초뒤에 자동 숨김 */
    setTimeout(() => {
      notify.style['display'] = 'none'
    }, 3000)
  }

  /**
   * @description 다이얼로그 띄우기
   * @param {string} message 다이얼로그에 띄울 메시지
   * @param {string} type 다이얼로그 타입(구분 문자열)
   */
  showDialog (message, type) {
    /* 다이얼로그 창 띄우기 */
    document.getElementById('dialog-message').textContent = message
    document.getElementById('dialog').style['display'] = 'block'
    this.dialogType = type
  }

  /**
   * @description 컴퓨터 정보 팝업 토글
   */
  togglePopupComputer () {
    let popup = document.getElementById('popup-computer')
    popup.classList.remove('popup-hide')
    popup.classList.remove('popup-show')

    if (this.popupComputer) {
      popup.classList.add('popup-hide')
    } else {
      /* 컴퓨터 효과음 재생 */
      this.computerSound.play()

      this.updateComputerPopup()
      popup.classList.add('popup-show')
    }
    this.popupComputer = !this.popupComputer
  }

  /**
   * @description 컴퓨터 정보 팝업 정보 갱신
   */
  updateComputerPopup () {
    let cpuIdx = this.store.getData('cpu')
    let ramIdx = this.store.getData('ram')
    let vgaIdx = this.store.getData('vga')

    let cpuLv = this.store.getData('cpuLv')
    let ramLv = this.store.getData('ramLv')
    let vgaLv = this.store.getData('vgaLv')

    /* 오버클럭 비용 */
    this.cpuOverclock = cpu[cpuIdx] ? Math.floor((cpuLv + 1) * 0.05 * cpu[cpuIdx].price) : 0
    this.ramOverclock = ram[ramIdx] ? Math.floor((ramLv + 1) * 0.05 * ram[ramIdx].price) : 0
    this.vgaOverclock = vga[vgaIdx] ? Math.floor((vgaLv + 1) * 0.05 * vga[vgaIdx].price) : 0

    document.getElementById('psu-level').textContent = this.store.getData('psu')

    document.getElementById('my-cpu-image').src = './static/' + (cpu[cpuIdx] ? cpu[cpuIdx].src : 'broken.png')
    document.getElementById('cpu-name-info').textContent = cpu[cpuIdx] ? cpu[cpuIdx].name : '고장 남'
    document.getElementById('cpu-coin').textContent = cpu[cpuIdx] ? (this.cpuCoin + this.cpuBoostCoin).toFixed(3) : 0
    document.getElementById('cpu-level').textContent = cpuLv
    document.getElementById('cpu-levelup-price').textContent = this.cpuOverclock

    document.getElementById('my-ram-image').src = './static/' + (ram[ramIdx] ? ram[ramIdx].src : 'broken.png')
    document.getElementById('ram-name-info').textContent = ram[ramIdx] ? ram[ramIdx].name : '고장 남'
    document.getElementById('ram-coin').textContent = ram[ramIdx] ? (this.ramCoin + this.ramBoostCoin).toFixed(3) : 0
    document.getElementById('ram-level').textContent = ramLv
    document.getElementById('ram-levelup-price').textContent = this.ramOverclock

    document.getElementById('my-vga-image').src = './static/' + (vga[vgaIdx] ? vga[vgaIdx].src : 'broken.png')
    document.getElementById('vga-name-info').textContent = vga[vgaIdx] ? vga[vgaIdx].name : '고장 남'
    document.getElementById('vga-coin').textContent = vga[vgaIdx] ? (this.vgaCoin + this.vgaBoostCoin).toFixed(3) : 0
    document.getElementById('vga-level').textContent = vgaLv
    document.getElementById('vga-levelup-price').textContent = this.vgaOverclock
  }

  /**
   * @description 핸드폰 영역 팝업 토글
   */
  togglePopupPhone () {
    let popup = document.getElementById('popup-phone')
    popup.classList.remove('popup-hide')
    popup.classList.remove('popup-show')

    if (this.popupPhone) {
      popup.classList.add('popup-hide')
    } else {
      /* 핸드폰 효과음 재생 */
      this.phoneSound.play()

      /* 기존 입력된 데이터가 있을 수 있으므로 초기화 */
      document.getElementById('sell-count').value = ''
      document.getElementById('prediction-money').textContent = 0

      /* 1 BTC 당 가격 */
      document.getElementById('coin-price').textContent = this.coinPrice

      /* 예상 수익금 */
      document.getElementById('sell-count').onkeyup = () => {
        const count = document.getElementById('sell-count').value
        const prediction = parseInt(count) * this.coinPrice
        document.getElementById('prediction-money').textContent = isNaN(prediction) ? 0 : prediction
      }

      /* 매도 버튼 */
      document.getElementById('sell-button').onclick = () => {
        const price = this.coinPrice
        const count = parseInt(document.getElementById('sell-count').value)

        if (isNaN(count)) {
          this.showNotify('정확하게 입력해주세요')
          return
        }

        if (this.store.getData('coin') < count) {
          this.showNotify('최대 매도가능 갯수를 초과했습니다.')
        } else {
          if (count < 1) {
            this.showNotify('갯수는 1개 이상 입력해주세요')
            return
          }

          /* 코인 효과음 재생 */
          this.coinSound.play()

          /* 매도한 코인 수 만큼 차감하고 해당 수익금만큼 현금 누적 */
          this.store.setData('coin', (this.store.getData('coin') - count).toFixed(3))
          this.store.setData('money', this.store.getData('money') + count * price)
          this.save()

          this.updateHeaderInfo()

          this.showNotify('매도 거래가 완료되었습니다.')
          this.togglePopupPhone()
        }
      }

      popup.classList.add('popup-show')
    }
    this.popupPhone = !this.popupPhone
  }

  /**
   * @description 매장 팝업 토글
   * @param {string} title 매장 타이틀
   * @param {string} store 매장 유형
   */
  togglePopupStore (title, store) {
    let popup = document.getElementById('popup-store')
    popup.classList.remove('popup-hide')
    popup.classList.remove('popup-show')

    if (this.popupStore) {
      popup.classList.add('popup-hide')
    } else {
      /* 상점 효과음 재생 */
      this.shopSound.play()

      this.updateStorePopup(title, store)
      popup.classList.add('popup-show')
    }
    this.popupStore = !this.popupStore
  }

  /**
   * @description 매장 데이터 갱신
   * @param {string} title 매장 타이틀
   * @param {string} store 매장 유형
   */
  updateStorePopup (title, store) {
    document.getElementById('popup-store-title').textContent = title
    let list = document.getElementById('popup-store-list')
    list.innerHTML = ''

    let dataSet = null
    let idx = 0
    let myIdx = 0
    if (store === 'ram') {
      dataSet = ram
      myIdx = this.store.getData('ram')
    } else if (store === 'cpu') {
      dataSet = cpu
      myIdx = this.store.getData('cpu')
    } else if (store === 'vga') {
      dataSet = vga
      myIdx = this.store.getData('vga')
    } else if (store === 'other') {
      dataSet = other
    }

    for (let data of dataSet) {
      let item = document.createElement('div')

      let itemImg = document.createElement('img')
      itemImg.src = './static/' + data.src
      itemImg.classList.add('item-img')

      let itemName = document.createElement('div')
      let itemNameText = document.createTextNode(data.name)
      itemName.classList.add('store-item-name')
      itemName.appendChild(itemNameText)

      let itemCoin = null
      let itemCoinText = null
      let itemDuplicate = null
      let itemDuplicateText = null
      if (store !== 'other') {
        itemCoin = document.createElement('div')
        itemCoinText = document.createTextNode(`채굴량: ${data.coin} BTC/s`)
        itemCoin.classList.add('store-sub-item')
        itemCoin.appendChild(itemCoinText)
      } else {
        itemDuplicate = document.createElement('div')
        itemDuplicate.classList.add('store-sub-item-2')
        if (data.duplicate === undefined) {
          itemDuplicateText = document.createTextNode('한정판매 상품')
        } else {
          itemDuplicateText = document.createTextNode(data.duplicate ? '중복사용 가능' : '중복 사용 불가능')
        }
        itemDuplicate.appendChild(itemDuplicateText)

        itemCoin = document.createElement('div')
        itemCoinText = document.createTextNode(data.info)
        itemCoin.classList.add('store-sub-item')
        itemCoin.appendChild(itemCoinText)
      }

      let itemPrice = document.createElement('div')
      let itemPriceText = document.createTextNode(data.price + '원')
      itemPrice.classList.add('store-sub-item')
      itemPrice.appendChild(itemPriceText)

      let levelLimit = document.createElement('div')
      let levelLimitText = document.createTextNode(`PSU 제한 레벨: ${data.level}`)
      levelLimit.classList.add('store-limit')
      levelLimit.appendChild(levelLimitText)

      let buyButton = document.createElement('button')
      let buyButtonText = null

      /* 기타 소모품 매장이 아닌 경우 */
      /* CPU, 램, 그래픽카드 매장 */
      if (store !== 'other') {
        buyButtonText = document.createTextNode(myIdx >= idx ? '매진' : '구매하기')
        if (!(myIdx >= idx)) {
          /* 인덱스 데이터 임시저장 */
          const tempIdx = idx

          /* 구매 버튼 */
          buyButton.onclick = () => {
            const money = this.store.getData('money')
            const psu = this.store.getData('psu')
            if (psu < data.level) {
              /* 알림 띄우기 */
              this.showNotify('파워서플라이 레벨이 낮습니다.')
            } else if (money - data.price >= 0) { // 구매
              /* 구매 효과음 재생 */
              this.coinSound.play()

              /* 구매 후 현금 저장 */
              this.store.setData('money', money - data.price)

              /* 구매한 항목 저장 */
              this.store.setData(store, tempIdx)

              /* 1초당 채굴하는 코인 량 계산 */
              this.calcCoinPerSecond()

              /* 상점 팝업 닫기 */
              this.togglePopupStore()

              /* 상단의 보유 현금, 코인 등 정보 갱신 */
              this.updateHeaderInfo()

              /* 알림 띄우기 */
              this.showNotify(data.name + ' 구매 완료')
            } else {
              /* 알림 띄우기 */
              this.showNotify('보유 현금이 부족합니다.')
            }
          }
        }
        buyButton.disabled = !(idx > myIdx)
      } else {
        /* 상시 판매 상품이 아닌 경우 (파워서플라이) */
        if (!data.always) {
          buyButtonText = document.createTextNode(this.store.getData('psu') >= data.psu ? '매진' : '구매하기')
        } else {
          buyButtonText = document.createTextNode('구매하기')
        }

        /* 구매 버튼 */
        buyButton.onclick = () => {
          console.log(!this.checkModules())
          if (!this.checkModules()) {
            this.showNotify('CPU, 램, 그래픽카드가 모두 있어야 구매할 수 있습니다.')
            return
          }

          console.log('buy')

          const money = this.store.getData('money')
          const psu = this.store.getData('psu')
          const psuLevel = data.psu
          
          if (psu < data.level) {
            /* 알림 띄우기 */
            this.showNotify('파워서플라이 레벨이 낮습니다.')
          } else if (money - data.price >= 0) { // 구매
            /* 구매 효과음 재생 */
            this.coinSound.play()

            /* 구매 후 현금 저장 */
            this.store.setData('money', money - data.price)

            /* 파워서플라이 구매한 경우 세이브파일에 저장 */
            if (psuLevel) {
              /* 구매한 항목 저장 */
              this.store.setData('psu', psuLevel)
            } else {
              /* 소모품인 경우 부스트 적용 */
              this.coinBoost(data.boost, data.duplicate)
            }

            /* 1초당 채굴하는 코인 량 계산 */
            this.calcCoinPerSecond()

            /* 상점 팝업 닫기 */
            this.togglePopupStore()

            /* 상단의 보유 현금, 코인 등 정보 갱신 */
            this.updateHeaderInfo()

            /* 알림 띄우기 */
            this.showNotify(data.name + ' 구매 완료')
          } else {
            /* 알림 띄우기 */
            this.showNotify('보유 현금이 부족합니다.')
          }
        }
      }

      buyButton.appendChild(buyButtonText)
      buyButton.classList.add('buy-button')

      item.appendChild(itemImg)
      item.appendChild(itemName)
      item.appendChild(itemCoin)
      /* 소모품인 경우만 중복가능 텍스트 추가 */
      if (store === 'other') {
        item.appendChild(itemDuplicate)
      }
      item.appendChild(itemPrice)
      item.appendChild(levelLimit)
      item.appendChild(buyButton)
      item.classList.add('popup-item')

      list.appendChild(item)
      idx++
    }
  }

  /**
   * @description 상단의 보유 현금, 코인 등 정보 갱신
   */
  updateHeaderInfo () {
    /* 세이브파일에 저장된 정보 보여주기 */
    document.getElementById('boost-percent').textContent = this.boost + ' %'
    document.getElementById('own-money').textContent = this.store.getData('money') + ' 원'
    document.getElementById('own-coin').textContent = this.store.getData('coin') + ' BTC'
    document.getElementById('coin-per-second').textContent = this.coinPerSecond + ' BTC/s'

    document.getElementById('boost-percent').textContent = (this.boostTime > 0 && this.coinBoostPercent > 0 ? this.coinBoostPercent : 0) + ' %'
    document.getElementById('boost-time').textContent = this.boostTime + ' 초'
  }

  /**
   * @description 1 BTC 시세 변경
   */
  refreshCoin () {
    /* 파워 서플라이 1 레벨당 코인 변동 폭 변경 */
    /* Lv.1 : 1 ~ 10 */
    /* Lv.2 : 1 ~ 20 */
    /* Lv.3 : 1 ~ 30 */
    const psuLevel = this.store.getData('psu')
    this.coinPrice = Math.floor(Math.random() * (psuLevel * 10)) + 1
    /* 1 BTC 당 가격 */
    document.getElementById('coin-price').textContent = this.coinPrice
  }

  /**
   * @description 집으로 이동
   */
  home () {
    if (this.popupStore) {
      this.togglePopupStore()
    }

    /* 집 안 영역 보이기 */
    document.getElementById('home').style['display'] = 'block'

    /* 도시 영역 숨기기 */
    document.getElementById('city').style['display'] = 'none'

    /* 내 컴퓨터 영역 갱신 */
    this.updateComputerPopup()
  }

  /**
   * @description 도시(야외)로 이동
   */
  city () {
    /* 문 여는 효과음 재생 */
    this.doorSound.play()

    /* 집 안 영역 숨기기 */
    document.getElementById('home').style['display'] = 'none'

    /* 도시 영역 보이기 */
    document.getElementById('city').style['display'] = 'block'

    /* 집으로 돌아오는 버튼 이벤트 */
    document.getElementById('go-to-home').onclick = () => {
      this.home()
    }
  }

  /**
   * @description 게임 이어서 진행
   */
  continue () {
    if (this.load) {
      /* 게임 초기화 */
      this.gameInit()

      /* 게임 시작 */
      this.start()
    } else {
      this.showNotify('세이브파일이 없습니다.')
    }
  }

  /**
   * @description 게임 새로 시작
   */
  newGame () {
    this.load = true
    let button = document.getElementById('continue-button')
    button.classList.add('menu-text')
    button.classList.remove('disable-text')

    /* 파일 생성 */
    this.store.create()

    /* 생성한 파일 로드 */
    this.store.load()

    /* 이어서 진행 */
    this.continue()
  }

  /**
   * @description 게임 진행상태 저장
   */
  save () {
    this.store.save()
  }

  /**
   * @description 게임 시작
   */
  start () {
    /* 1초마다 1번 실행 */
    let time = 0
    this.loop = setInterval(() => {
      this.update()

      /* 1분에 한번 코인 시세 변경 및 저장 */
      if (time % 60 === 0) {
        this.refreshCoin()
        this.store.save()
      }

      if (this.boostTime > 0) {
        this.boostTime--
      }
      time++
    }, 1000)
  }

  /**
   * @description 게임 진행 상태 업데이트
   */
  update () {
    /* 1초당 코인 수 만큼 누적 */
    const defaultCoin = parseFloat(this.coinPerSecond)
    const boostCoin = parseFloat(this.boostCoinPerSecond)

    this.store.setData('coin', (parseFloat(this.store.getData('coin')) + defaultCoin + boostCoin).toFixed(3))

    this.updateHeaderInfo()

    if (this.boostTime === 0) {
      this.coinBoostPercent = 0
      this.boostCoinPerSecond = 0
      document.getElementById('coin-per-second-boost').style['display'] = 'none';
    }
  }

  /**
   * @description 게임 종료
   */
  exit () {
    /* Interval 종료 */
    clearInterval(this.loop)

    /* 게임 저장 */
    this.save()

    /* HTML: 아이디가 main인 영역 보이기 */
    document.getElementById('main').style['display'] = 'block'

    /* HTML: 아이디가 game인 영역 숨기기 */
    document.getElementById('game').style['display'] = 'none'
  }
}

module.exports = Game
