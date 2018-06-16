const electron = require('electron')
const path = require('path')
const fs = require('fs')

/* 파일 저장, 불러오기 클래스 */
class Store {
  /* Electron 유저 데이터 경로 저장 */
  constructor (fileName) {
    this.userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.userData = null
    this.fileName = fileName
  }

  /* 불러오기 */
  load () {
    console.log(path.join(this.userDataPath, this.fileName))
  }

  /* 저장 */
  save () {
    if (this.userData) {
      fs.writeFileSync(path.join(this.userDataPath, this.fileName), JSON.stringify(this.userData))
    } else {
      console.log('유저 데이터가 없습니다.')
    }
  }

  /* 파일 생성 */
  create () {
    // TODO: 새 파일 생성
  }
}

class Game {
  constructor () {
    this.store = new Store('user.dat')
  }

  /* 초기화 */
  init () {
    this.store.load()
  }
}

window.onload = function () {
  const game = new Game()
  game.init()

  /* 버튼 이벤트 등록 */
  document.getElementById('exit-button').onclick = function () {
    electron.remote.getCurrentWindow().close()
  }
}
