const electron = require('electron')
const path = require('path')
const fs = require('fs')

/* 파일 저장, 불러오기 클래스 */
class Store {
  /**
   * @description 클래스 생성자
   * @param {string} fileName 세이브 파일 명
   */
  constructor (fileName) {
    this.userDataPath = (electron.app || electron.remote.app).getPath('userData')
    this.userData = null
    this.fileName = fileName
  }

  /**
   * @description 세이브파일 불러오기
   */
  load () {
    console.log(path.join(this.userDataPath, this.fileName))
  }

  /**
   * @description 세이브파일 저장하기
   */
  save () {
    if (this.userData) {
      fs.writeFileSync(path.join(this.userDataPath, this.fileName), JSON.stringify(this.userData))
    } else {
      console.log('유저 데이터가 없습니다.')
    }
  }

   /**
   * @description 세이브파일 새로 생성
   */
  create () {
    // TODO: 새 파일 생성
  }
}

class Game {
  constructor () {
    this.store = new Store('user.dat')
  }

  /**
   * @description 게임 초기화
   */
  init () {
    this.store.load()
  }
}

/* DOM 로딩 완료 후 */
window.onload = function () {
  /* 게임 인스턴스 생성 */
  const game = new Game()
  /* 초기화 */
  game.init()

  /* 종료 버튼 이벤트 등록 */
  document.getElementById('exit-button').onclick = function () {
    /* Electron 종료 */
    electron.remote.getCurrentWindow().close()
  }
}
