/**
 * 게임 내에 있는 소모품, 기타 아이템 모곩
 * name: 상품 이름
 * price: 가격(원)
 * info: 상품 정보
 * duplicate: 중복 가능 부스트 여부
 * boost: 부스트 % (소모품만 해당)
 * psu: 파워서플라이 레벨 (소모품은 없음)
 * level: 파워서플라이 제한 레벨
 * src: 이미지 경로
 */

module.exports = [
  {
    name: '저렴한 서멀컴파운드',
    price: 100,
    info: '1분간 채굴량 +10%',
    duplicate: false,
    boost: 10,
    level: 1,
    always: true,
    src: 'other/t_1.png'
  },
  {
    name: '쓸만한 서멀컴파운드',
    price: 500,
    info: '1분간 채굴량 +25%',
    duplicate: false,
    boost: 25,
    level: 1,
    always: true,
    src: 'other/t_2.png'
  },
  {
    name: '파워서플라이 Lv.2',
    price: 20000,
    info: '코인 최대 시세 +10',
    psu: 2,
    level: 1,
    always: false,
    src: 'psu/2.png'
  },
  {
    name: '파워서플라이 Lv.3',
    price: 200000,
    info: '코인 최대 시세 +10',
    psu: 3,
    level: 2,
    always: false,
    src: 'psu/3.png'
  },
  {
    name: '파워서플라이 Lv.4',
    price: 1000000,
    info: '코인 최대 시세 +10',
    psu: 4,
    level: 3,
    always: false,
    src: 'psu/4.png'
  },
  {
    name: '파워서플라이 Lv.5',
    price: 2500000,
    info: '코인 최대 시세 +10',
    psu: 5,
    level: 4,
    always: false,
    src: 'psu/5.png'
  }
]
