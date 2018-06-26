/**
 * 게임 내에 있는 램 목록
 * name: 램 상품 이름
 * price: 가격(원)
 * coin: 초당 코인 수
 * level: 파워서플라이 제한 레벨
 * src: 이미지 경로
 */

/**
 * 증가 폭: (0.1 * 2 * psu) * 아이템 순번
 * */
/**
 * PSU 레벨 증가
 * 이전 가격 * 2
 * */
module.exports = [
  {
    name: 'Hinix DDR-200',
    price: 200,
    coin: 0.1,
    level: 1,
    src: 'ram/1.png'
  },
  {
    name: 'Sasung DDR-266',
    price: 700,
    coin: 0.3,
    level: 1,
    src: 'ram/2.png'
  },
  {
    name: 'Sasung DDR-333',
    price: 2000,
    coin: 0.5,
    level: 1,
    src: 'ram/3.png'
  },
  {
    name: 'Sasung DDR2-400',
    price: 10000,
    coin: 1,
    level: 2,
    src: 'ram/4.png'
  },
  {
    name: 'Hinix DDR2-800',
    price: 30000,
    coin: 1.4,
    level: 2,
    src: 'ram/5.png'
  },
  {
    name: 'Hinix DDR3-800D',
    price: 60000,
    coin: 1.8,
    level: 2,
    src: 'ram/6.png'
  },
  {
    name: 'Sasung DDR3-1333',
    price: 180000,
    coin: 3.6,
    level: 3,
    src: 'ram/7.png'
  },
  {
    name: 'Hinix DDR3-1866',
    price: 300000,
    coin: 4.2,
    level: 3,
    src: 'ram/8.png'
  },
  {
    name: 'Corsor DDR3-2133 Dominator',
    price: 462000,
    coin: 4.8,
    level: 3,
    src: 'ram/9.png'
  }
]
