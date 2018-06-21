/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

/**
 * 현재 디렉토리의 index.js 파일을 제외한 나머지 모듈들을 하나로 묶어서 modules에 저장합니다.
 */

const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\.js)/g, '').toLowerCase()] = files(key).default
})

export default modules
