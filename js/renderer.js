const electron = require('electron')

/* DOM 로딩 완료 후 */
window.onload = function () {
  const Game = require('./game.js')
  const game = new Game('user.dat')
  game.init()

  /* 다이얼로그 유형(새 게임시작, 아이템 구매 여부 등) */
  var dialogType = ''

  /* 이어서하기 버튼 이벤트 등록 */
  document.getElementById('continue-button').onclick = function () {
    game.continue()
  }

  /* 새로하기 이벤트 등록 */
  document.getElementById('new-button').onclick = function () {
    /* 다이얼로그 창 띄우기 */
    document.getElementById('dialog-message').textContent = '정말 새로 시작하시겠습니까?'
    document.getElementById('dialog').style['display'] = 'block'
    dialogType = 'newGame'
  }

  /* 정보 버튼 이벤트 등록 */
  document.getElementById('info-button').onclick = function () {
    console.log('정보 버튼 눌림')
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
    
    if (dialogType === 'newGame') {
      game.newGame()
    }
  }

  /* 다이얼로그 아니오 버튼 이벤트 등록 */
  document.getElementById('dialog-no').onclick = function () {
    /* 다이얼로그 창 닫기 */
    document.getElementById('dialog').style['display'] = 'none'
  }
}