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

    /* 컴퓨터 팝업창 열기/닫기 */
    this.popupComputer = false

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
    }

    calcCoinPerSecond()

    /* 세이브파일에 저장된 정보 보여주기 */
    this.update()

    /* 컴퓨터 클릭시 이벤트 */
    document.getElementById('my-computer').onclick = () => {
      const sound = new Audio('./static/computer.mp3')
      sound.play()
      this.showPopupComputer()
    }

    /* 문 클릭시 이벤트 */
    document.getElementById('door').onclick = () => {
      const sound = new Audio('./static/door.mp3')
      sound.play()

      this.city()
    }

    /* 컴퓨터 팝업 닫기 버튼 이벤트 */
    document.getElementById('popup-computer-close').onclick = () => {
      this.popup = false
      document.getElementById('popup-computer').classList.remove('popup-show')
      document.getElementById('popup-computer').classList.add('popup-hide')
    }

    /* 게임 종료 버튼 이벤트 */
    document.getElementById('game-exit').onclick = () => {
      this.showDialog('정말 종료하시겠습니까?', 'exitGame')
    }

    /* 튜토리얼 종료 버튼 이벤트 */
    document.getElementById('tutorial-exit').onclick = () => {
      this.store.setData('tutorial', 0)
      document.getElementById('tutorial').style['display'] = 'none'
    }

    /* 램 매장 클릭시 이벤트 */
    document.getElementById('ram-store').onclick = () => {
      console.log('RAM')
    }

    /* CPU 매장 클릭시 이벤트 */
    document.getElementById('cpu-store').onclick = () => {
      console.log('CPU')
    }

    /* 그래픽카드 매장 클릭시 이벤트 */
    document.getElementById('vga-store').onclick = () => {
      console.log('VGA')
    }

    document.getElementById('other-store').onclick = () => {
      
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
   * @description 컴퓨터 정보 팝업 띄우기
   */
  showPopupComputer () {
    let popup = document.getElementById('popup-computer')
    popup.classList.remove('popup-hide')
    popup.classList.remove('popup-show')

    if (this.popupComputer) {
      popup.classList.add('popup-hide')
    } else {
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
   * @description 도시(야외)로 이동
   */
  city () {
    /* 집 안 영역 숨기기 */
    document.getElementById('home').style['display'] = 'none'

    /* 도시 영역 보이기 */
    document.getElementById('city').style['display'] = 'block'

    /* 집으로 돌아오는 버튼 이벤트 */
    document.getElementById('go-to-home').onclick = () => {
      /* 집 안 영역 보이기 */
      document.getElementById('home').style['display'] = 'block'

      /* 도시 영역 숨기기 */
      document.getElementById('city').style['display'] = 'none'
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
