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

      const items = [
        {
          name: '파워서플라이',
          index: 0,
          level: this.store.getData('psu')
        },
        {
          name: 'CPU',
          index: this.store.getData('cpu'),
          level: this.store.getData('cpuLv')
        },
        {
          name: '램',
          index: this.store.getData('ram'),
          level: this.store.getData('ramLv')
        },
        {
          name: '그래픽카드',
          index: this.store.getData('vga'),
          level: this.store.getData('vgaLv')
        }
      ]

      this.showPopup('내 컴퓨터', items)
    }

    /* 문 클릭시 이벤트 */
    document.getElementById('door').onclick = () => {
      const sound = new Audio('./static/door.mp3')
      sound.play();
    }

    /* 팝업 닫기 버튼 이벤트 */
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
   * @description 알림 띄우기
   * @param {string} message 알림에 띄울 메시지
   */
  showNotify (message) {
    let el = document.getElementById('notify')
    console.log(el.style)
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
   * @description 팝업 띄우기
   * @param {string} title 팝업에 띄울 제목
   * @param {array} items 팝업에 표시할 부품 리스트
   */
  showPopup (title, items) {
    let popup = document.getElementById('popup')
    document.getElementById('popup-title').textContent = title
    popup.classList.remove('popup-hide')
    popup.classList.remove('popup-show')

    if (this.popup) {
      popup.classList.add('popup-hide')
    } else {
      if (items !== 0) {
        let content = document.getElementById('popup-content')

        /* 기존 내용 비우기 */
        content.innerHTML = ''

        /* 아이템 목록 추가 */
        for (let item of items) {
          /* 부품 정보 영역 */
          let itemArea = document.createElement('div')
          itemArea.classList.add('popup-item')

          /* 부품 종류 */
          let itemName = document.createElement('b')

          /* 부품 유형 */
          let titleText = document.createTextNode(item.name)
          itemName.appendChild(titleText)

          itemArea.appendChild(itemName)
          
          /* 부품 명, 부품 레벨 */
          let moduleText = null
          let moduleLevelText = document.createTextNode('오버클럭 레벨: ' + item.level)

          /* 인덱스가 -1 이면 고장 */
          if (item.index === -1) {
            moduleText = document.createTextNode('고장 남')
          } else {
            if (item.name === '파워서플라이') {
              moduleText = document.createTextNode('')
            } else if (item.name === 'CPU') {
              moduleText = document.createTextNode(cpu[item.index])
            } else if (item.name === '램') {
              moduleText = document.createTextNode(ram[item.index])
            } else if (item.name === '그래픽카드') {
              moduleText = document.createTextNode(vga[item.index])
            }
          }

          /* 제품 이름 */
          let moduleInfoArea = document.createElement('div')
          moduleInfoArea.appendChild(moduleText)

          /* 부품 오버클럭 레벨 */
          let moduleLevelArea = document.createElement('div')
          moduleLevelArea.classList.add('popup-sub-item')
          moduleLevelArea.appendChild(moduleLevelText)

          moduleInfoArea.appendChild(moduleLevelArea)
          itemArea.appendChild(moduleInfoArea)
          content.appendChild(itemArea)
        }
      }
      popup.classList.add('popup-show')
    }
    this.popup = !this.popup
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
      console.log('no file', this.load)
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
