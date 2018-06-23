/**
 * 게임 내에 있는 램 목록
 * name: 램 상품 이름
 * price: 가격(원)
 * coin: 초당 코인 수
 * level: 파워서플라이 제한 레벨
 * src: 이미지 경로
 */

module.exports = [
  {
    name: 'Hinix DDR-200',
    price: 500,
    coin: 0.1,
    level: 1,
    src: 'ram/1.png'
  },
  {
    name: 'Sasung DDR-266',
    price: 700,
    coin: 0.15,
    level: 1,
    src: 'ram/2.png'
  },
  {
    name: 'Sasung DDR-333',
    price: 1000,
    coin: 0.2,
    level: 1,
    src: 'ram/3.png'
  },
  {
    name: 'Sasung DDR2-400',
    price: 3500,
    coin: 0.4,
    level: 2,
    src: 'ram/4.png'
  },
  {
    name: 'Hinix DDR2-800',
    price: 6000,
    coin: 0.75,
    level: 2,
    src: 'ram/5.png'
  }
]