const Store = require('./store.js')

const cpu = require('./model/cpu.js')
const ram = require('./model/ram.js')
const vga = require('./model/vga.js')

class Game {
  constructor () {
    this.store = new Store('user.dat')

    /* 초당 코인 갯수 */
    this.coinPerSecond = 0

    /* 게임 이어서 하기(false: 파일 없음, true: 이어서하기 가능) */
    this.load = false
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
      this.coinPerSecond = cpu[cpuNum].coin + ram[ramNum].coin + vga[vgaNum].coin
    }

    /* 세이브파일에 저장된 정보 보여주기 */
    document.getElementById('own-money').textContent = this.store.getData('money') + ' 원'
    document.getElementById('own-coin').textContent = this.store.getData('coin') + ' BTC'
    document.getElementById('coin-per-second').textContent = this.coinPerSecond + ' BTC/s'
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
   * @description 게임 시작
   */
  start () {
    /* 1초마다 1번 실행 */
    let time = 0
    setInterval (() => {
      console.log(time++)
    }, 1000)
  }
}

module.exports = Game
