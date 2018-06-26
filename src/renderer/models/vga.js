/**
 * 게임 내에 있는 그래픽카드 목록
 * name: 그래픽카드 상품 이름
 * price: 가격(원)
 * coin: 초당 코인 수
 * level: 파워서플라이 제한 레벨
 * src: 이미지 경로
 */

/**
 * 증가 폭: (0.25 * 2 * psu) * 아이템 순번
 * */
/**
 * PSU 레벨 증가
 * 이전 가격 * 2
 * */
module.exports = [
  {
    name: 'AND Radeo 9500',
    price: 500,
    coin: 0.25,
    level: 1,
    src: 'vga/1.png'
  },
  {
    name: 'Nvidio GT100',
    price: 1000,
    coin: 0.75,
    level: 1,
    src: 'vga/2.png'
  },
  {
    name: 'AND Radeo X700',
    price: 2000,
    coin: 1.25,
    level: 1,
    src: 'vga/3.png'
  },
  {
    name: 'Nvidio GT200',
    price: 8000,
    coin: 2.5,
    level: 2,
    src: 'vga/4.png'
  },
  {
    name: 'AND Radeo X1800',
    price: 25000,
    coin: 3.5,
    level: 2,
    src: 'vga/5.png'
  },
  {
    name: 'Nvidio GTS250',
    price: 70000,
    coin: 4.5,
    level: 2,
    src: 'vga/6.png'
  },
  {
    name: 'AND Radeo HD4570',
    price: 150000,
    coin: 6.5,
    level: 2,
    src: 'vga/7.png'
  },
  {
    name: 'Nvidio GTS450',
    price: 275000,
    coin: 7.5,
    level: 2,
    src: 'vga/8.png'
  },
  {
    name: 'AND Radeo HD6570',
    price: 400000,
    coin: 8.5,
    level: 2,
    src: 'vga/9.png'
  },
  {
    name: 'Nvidio GTX580',
    price: 900000,
    coin: 19,
    level: 3,
    src: 'vga/10.png'
  },
  {
    name: 'AND Radeo R9 280X',
    price: 1500000,
    coin: 20.5,
    level: 3,
    src: 'vga/11.png'
  },
  {
    name: 'Nvidio GTX780ti',
    price: 2400000,
    coin: 22,
    level: 3,
    src: 'vga/12.png'
  }
]
