const Store = require('./store.js')

const cpu = require('./model/cpu.js')
const ram = require('./model/ram.js')
const vga = require('./model/vga.js')

class Game {
  constructor () {
    this.store = new Store('user.dat')

    /* 1초당 코인 갯수 */
    this.coinPerSecond = 0

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

    /* 오버클럭 비용 */
    this.cpuOverclock = 0
    this.ramOverclock = 0
    this.vgaOverclock = 0
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
      document.getElementById('tutorial').style['display'] = 'block'

      /* 튜토리얼 다음 버튼 */
      document.getElementById('tutorial-next').onclick = () => {
        this.city()
        document.getElementById('tutorial-1').style['display'] = 'none'
        document.getElementById('tutorial-2').classList.remove('tutorial-hide')
        document.getElementById('tutorial-exit').classList.remove('tutorial-hide')
      }
    }

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

    /* 컴퓨터 팝업 닫기 버튼 이벤트 */
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

    console.log(cpu[cpuNum], cpu, cpuNum)

    /* 부품 번호 중 -1이 하나도 없을 경우 */
    if (cpuNum !== -1 && vgaNum !== -1 && ramNum !== -1) {
      /* 오버클럭 레벨 1당 해당 부품의 채굴량 10% 증가 */
      const cpuCoin = cpu[cpuNum].coin + cpu[cpuNum].coin * ((cpuLv) / 10)
      const ramCoin = ram[ramNum].coin + ram[ramNum].coin * ((ramLv) / 10)
      const vgaCoin = vga[vgaNum].coin + vga[vgaNum].coin * ((vgaLv) / 10)

      this.coinPerSecond = cpuCoin + ramCoin + vgaCoin
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
      const sound = new Audio('./static/computer.mp3')
      sound.play()

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

    this.cpuOverclock = cpu[cpuIdx] ? cpuLv * 2.5 * cpu[cpuIdx].price : 0
    this.ramOverclock = ram[ramIdx] ? ramLv * 2.5 * ram[ramIdx].price : 0
    this.vgaOverclock = vga[vgaIdx] ? vgaLv * 2.5 * vga[vgaIdx].price : 0

    document.getElementById('psu-level').textContent = this.store.getData('psu')

    document.getElementById('cpu-name-info').textContent = cpu[cpuIdx] ? cpu[cpuIdx].name : '고장 남'
    document.getElementById('cpu-level').textContent = cpuLv
    document.getElementById('cpu-levelup-price').textContent = this.cpuOverclock

    document.getElementById('ram-name-info').textContent = ram[ramIdx] ? ram[ramIdx].name : '고장 남'
    document.getElementById('ram-level').textContent = ramLv
    document.getElementById('ram-levelup-price').textContent = this.ramOverclock

    document.getElementById('vga-name-info').textContent = vga[vgaIdx] ? vga[vgaIdx].name : '고장 남'
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
      const sound = new Audio('./static/phone.mp3')
      sound.play()

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
      const sound = new Audio('./static/shop.mp3')
      sound.play()

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
      dataSet = []
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

      let itemCoin = document.createElement('div')
      let itemCoinText = document.createTextNode(`채굴량: ${data.coin} BTC/s`)
      itemCoin.classList.add('store-sub-item')
      itemCoin.appendChild(itemCoinText)

      let itemPrice = document.createElement('div')
      let itemPriceText = document.createTextNode(data.price + '원')
      itemPrice.classList.add('store-sub-item')
      itemPrice.appendChild(itemPriceText)

      let levelLimit = document.createElement("div")
      let levelLimitText = document.createTextNode(`PSU 제한 레벨: ${data.level}`)
      levelLimit.classList.add('store-limit')
      levelLimit.appendChild(levelLimitText)

      let buyButton = document.createElement('button')
      let buyButtonText = document.createTextNode(myIdx >= idx ? '매진' : '구매하기')
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
            const sound = new Audio('./static/coin.mp3')
            sound.play()

            /* 구매 후 현금 저장 */
            this.store.setData('money', money - data.price)

            /* 구매한 항목 저장 */
            this.store.setData(store, tempIdx)

            /* 1초당 채굴하는 코인 량 계산 */
            this.calcCoinPerSecond()

            /* 상점 팝업 닫기 */
            this.togglePopupStore()

            /* 세이브파일에 저장된 정보 보여주기 */
            document.getElementById('own-money').textContent = this.store.getData('money') + ' 원'
            document.getElementById('own-coin').textContent = this.store.getData('coin') + ' BTC'
            document.getElementById('coin-per-second').textContent = this.coinPerSecond + ' BTC/s'

            /* 알림 띄우기 */
            this.showNotify(data.name + ' 구매 완료')
          } else {
            /* 알림 띄우기 */
            this.showNotify('보유 현금이 부족합니다.')
          }
        }
      }
      buyButton.appendChild(buyButtonText)
      buyButton.disabled = !(idx > myIdx)
      buyButton.classList.add('buy-button')

      item.appendChild(itemImg)
      item.appendChild(itemName)
      item.appendChild(itemCoin)
      item.appendChild(itemPrice)
      item.appendChild(levelLimit)
      item.appendChild(buyButton)
      item.classList.add('popup-item')

      list.appendChild(item)
      idx++
    }
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
    const sound = new Audio('./static/door.mp3')
    sound.play()

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

      /* 1분에 한번 저장 */
      if (time % 60 === 0) {
        this.store.save()
      }
      time++
    }, 1000)
  }

  /**
   * @description 게임 진행 상태 업데이트
   */
  update () {
    /* 1초당 코인 수 만큼 누적 */
    this.store.setData('coin', (parseFloat(this.store.getData('coin')) + this.coinPerSecond).toFixed(2))

    /* 세이브파일에 저장된 정보 보여주기 */
    document.getElementById('own-money').textContent = this.store.getData('money') + ' 원'
    document.getElementById('own-coin').textContent = this.store.getData('coin') + ' BTC'
    document.getElementById('coin-per-second').textContent = this.coinPerSecond + ' BTC/s'
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
