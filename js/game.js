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
    this.popup = false

    /* 다이얼로그 타입 */
    this.dialogType = ''
  }

  /**
   * @description 인스턴스 초기화
   */
  init () {
    if (this.store.check()) {
      this.store.load()
      this.load = true
    } else {
      this.store.create()
    }
  }

  /**
   * @description 게임 초기화
   */
  gameInit () {
    /* HTML: 아이디가 main인 영역 숨기기 */
    document.getElementById('main').style['display'] = 'none'

    /* HTML: 아이디가 game인 영역 보이기 */
    document.getElementById('game').style['display'] = 'block'

    /* 세이브파일에 저장된 컴퓨터 부품 종류 번호 */
    const cpuNum = this.store.getData('cpu')
    const ramNum = this.store.getData('ram')
    const vgaNum = this.store.getData('vga')

    /* 부품 번호 중 -1이 하나도 없을 경우 */
    if (cpuNum !== -1 && vgaNum !== -1 && ramNum !== -1) {
      console.log('코인 채굴 가능 PC')
      this.coinPerSecond = cpu[cpuNum].coin + ram[ramNum].coin + vga[vgaNum].coin
    }

    /* 세이브파일에 저장된 정보 보여주기 */
    this.update()

    /* 컴퓨터 클릭시 이벤트 */
    document.getElementById('my-computer').onclick = () => {
      const sound = new Audio('./static/computer.mp3')
      sound.play();

      let popup = document.getElementById('popup')
      document.getElementById('popup-title').textContent = '내 컴퓨터'
      popup.classList.remove('popup-hide')
      popup.classList.remove('popup-show')

      if (this.popup) {
        popup.classList.add('popup-hide')
      } else {
        popup.classList.add('popup-show')
      }
      this.popup = !this.popup
    }

    /* 문 클릭시 이벤트 */
    document.getElementById('door').onclick = () => {
      const sound = new Audio('./static/door.mp3')
      sound.play();
    }

    document.getElementById('popup-close').onclick = () => {
      this.popup = false
      popup.classList.remove('popup-show')
      popup.classList.add('popup-hide')
    }

    /* 게임 종료 버튼 이벤트 */
    document.getElementById('game-exit').onclick = () => {
      console.log('exit')
      this.showDialog('정말 종료하시겠습니까?', 'exitGame')
    }
  }

  /**
   * @description 다이얼로그 띄우기
   * @param {string} message 다이얼로그에 띄울 메시지
   * @param {string} message 다이얼로그 타입(구분 문자열)
   */
  showDialog (message, type) {
    /* 다이얼로그 창 띄우기 */
    document.getElementById('dialog-message').textContent = message
    document.getElementById('dialog').style['display'] = 'block'
    this.dialogType = type
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
      console.log('세이브파일이 없습니다.')
    }
  }

  /**
   * @description 게임 새로 시작
   */
  newGame () {
    this.store.create()
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
    setInterval (() => {
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
    this.store.setData('coin', this.store.getData('coin') + this.coinPerSecond)

    /* 세이브파일에 저장된 정보 보여주기 */
    document.getElementById('own-money').textContent = this.store.getData('money') + ' 원'
    document.getElementById('own-coin').textContent = this.store.getData('coin') + ' BTC'
    document.getElementById('coin-per-second').textContent = this.coinPerSecond + ' BTC/s'
  }
}

module.exports = Game
