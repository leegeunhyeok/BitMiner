const electron = require('electron')

/* DOM 로딩 완료 후 */
window.onload = function () {
  const Game = require('./game.js')
  const game = new Game('user.dat')
  game.init()

  /* 이어서하기 버튼 이벤트 등록 */
  document.getElementById('continue-button').onclick = function () {
    game.continue()
  }

  /* 새로하기 이벤트 등록 */
  document.getElementById('new-button').onclick = function () {
    /* 다이얼로그 창 띄우기 */
    document.getElementById('dialog-message').textContent = '정말 새로 시작하시겠습니까?'
    document.getElementById('dialog').style['display'] = 'block'
    game.dialogType = 'newGame'
  }

  /* 정보 버튼 이벤트 등록 */
  document.getElementById('info-button').onclick = function () {
    document.getElementById('dialog').style['display'] = 'none'
    document.getElementById('menu-button-area').style['display'] = 'none'
    document.getElementById('information').style['display'] = 'block'
  }

  /* 최신 버전 확인 */
  document.getElementById('lastest-version').onclick = function () {
    electron.remote.shell.openExternal('https://github.com/leegeunhyeok/BitMiner/releases/latest')
  }

  /* 정보 닫기 버튼 이벤트 등록 */
  document.getElementById('information-exit').onclick = function () {
    document.getElementById('menu-button-area').style['display'] = 'block'
    document.getElementById('information').style['display'] = 'none'
  }

  /* 종료 버튼 이벤트 등록 */
  document.getElementById('exit-button').onclick = function () {
    /* Electron 종료 */
    electron.remote.getCurrentWindow().close()
  }

  /* 다이얼로그 예 버튼 이벤트 등록 */
  document.getElementById('dialog-yes').onclick = function () {
    /* 다이얼로그 창 닫기 */
    document.getElementById('dialog').style['display'] = 'none'

    if (game.dialogType === 'newGame') {
      game.newGame()
    } else if (game.dialogType === 'exitGame') {
      game.exit()
    }
  }

  /* 다이얼로그 아니오 버튼 이벤트 등록 */
  document.getElementById('dialog-no').onclick = function () {
    /* 다이얼로그 창 닫기 */
    document.getElementById('dialog').style['display'] = 'none'
  }
}
