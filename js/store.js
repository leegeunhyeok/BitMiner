const electron = require('electron')
const path = require('path')
const fs = require('fs')

const defaultSaveData = {
  /* 게임 내 진행 일 수 */
  'days': 0,
  /* 보유 코인 수 */
  'coin': 0,
  /* 보유 현금 */
  'money': 5000,
  /* CPU 종류 */
  'cpu': -1,
  /* CPU 레벨 */
  'cpuLv': 1,
  /* 램 종류 */
  'ram': -1,
  /* 램 레벨 */
  'ramLv': 1,
  /* 그래픽카드 종류 */
  'vga': -1,
  /* 그래픽카드 레벨 */
  'vgaLv': 1,
  /* 파워서플라이 레벨 */
  'psu': 1
}

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
    try {
      this.userData = JSON.parse(fs.readFileSync(path.join(this.userDataPath, this.fileName)))
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * @description 세이브파일 저장하기
   */
  save () {
    if (this.userData) {
      try {
        fs.writeFileSync(path.join(this.userDataPath, this.fileName), JSON.stringify(this.userData), 'utf-8')
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('유저 데이터가 없습니다.')
    }
  }

  /**
   * @description 세이브파일 새로 생성
   */
  create () {
    try {
      fs.writeFileSync(path.join(this.userDataPath, this.fileName), JSON.stringify(defaultSaveData), 'utf-8')
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * @description 세이브파일 존재 유무 확인
   * @return {boolean} 파일 존재 유무
   */
  check () {
    return fs.existsSync(path.join(this.userDataPath, this.fileName))
  }

  /**
   * @description 로드한 세이브파일 데이터에서 Key 값 불러오기
   * @return {any} Key 값에 해당하는 Value
   */
  getData (key) {
    return this.userData[key]
  }

  /**
   * @description 로드한 세이브파일의 해당 Key의 값을 설정
   */
  setData (key, value) {
    this.userData[key] = value
  }
}

module.exports = Store
