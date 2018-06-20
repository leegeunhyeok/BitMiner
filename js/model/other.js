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
    name: '파워서플라이 Lv.2',
    price: 10000,
    info: '레벨 업',
    psu: 2,
    level: 1,
    always: false,
    src: 'psu/2.png'
  },
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
    price: 300,
    info: '1분간 채굴량 +25%',
    duplicate: false,
    boost: 25,
    level: 1,
    always: true,
    src: 'other/t_2.png'
  }
]
