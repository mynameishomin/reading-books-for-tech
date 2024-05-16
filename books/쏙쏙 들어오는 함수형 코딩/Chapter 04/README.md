# 액션에서 계산 빼내기

가상의 온라인 쇼핑몰 MegaMart.com의 코드를 가지고 액션에서 계산을 빼내는 법을 알아보자.

쇼핑 중에 장바구니에 담겨 있는 제품 금액 합계를 볼 수 있는 것은 MegaMart의 중요한 기능이다.

**장바구니 금액 계산 코드**

```javascript
// 장바구니 제품 배열
const shopping_cart = [];
// 장바구니 제품 금액 합계
let shopping_cart_total = 0;

// 장바구니에 제품 추가 제품 총 금액 계산
function add_item_to_cart(name, price) {
    shopping_cart.push({
        name: name,
        price: price,
    });
    calc_cart_total();
}

// 장바구니 제품 총 금액 계산 후 dom 업데이트
function calc_cart_total() {
    shopping_cart_total = 0;
    for (let i = 0; i < shopping_cart.length; i++) {
        const item = shopping_cart[i];
        shopping_cart_total += item.price;
    }
    set_cart_total_dom();
}
```

## 무료 배송비 계산하기

새로운 요구사항으로 장바구니에 넣었을 경우 제품 총 금액이 20달러가 넘어 무료 배송이 가능한 제품에 아이콘 표시 기능이 생겼다. 이를 절차적인 방법으로 구현했다.

```javascript
function update_shipping_icons() {
    // 페이지에 있는 모든 버튼을 대상으로 반복문 적용
    const buy_buttons = get_buy_buttons_dom();
    for (let i = 0; i < buy_buttons.length; i++) {
        const button = buy_buttons[i];
        const item = button.item;
        // 무료 배송 가능 여부를 판단해 아이콘을 보여주거나 보여주지 않는다.
        if (item.price + shopping_cart_total >= 20) {
            button.show_free_shipping_icon();
        } else {
            button.hide_free_shipping_icon();
        }
    }
}
```

이미 만들었던 `calc_cart_total`함수에 새로 만든 함수를 추가한다.

```javascript
function calc_cart_total() {
    shopping_cart_total = 0;
    for (let i = 0; i < shopping_cart.length; i++) {
        const item = shopping_cart[i];
        shopping_cart_total += item.price;
    }
    set_cart_total_dom();
    // 새로 만든 함수
    update_shipping_icons();
}
```

## 세금 계산하기

다음 요구 사항이 생겼다. 장바구니 제품 총 금액이 바뀔 때마다 세금을 다시 계산해라!

```javascript
function update_tax_dom() {
    // 장바구니 제품 총 금액에 세금 10%를 곱해서 dom 업데이트
    set_tax_dom(shopping_cart_total * 0.1);
}
```

다시 이미 만들었던 `calc_cart_total`함수에 새로 만든 함수를 추가한다.

```javascript
function calc_cart_total() {
    shopping_cart_total = 0;
    for (let i = 0; i < shopping_cart.length; i++) {
        const item = shopping_cart[i];
        shopping_cart_total += item.price;
    }
    set_cart_total_dom();
    update_shipping_icons();
    // 새로 만든 함수
    update_tax_dom();
}
```

## 테스트하기 쉽게 만들기

위에서 만든 코드를 테스트 하기 위해선 아래와 같은 과정이 필요하다.

1. 브라우저 설정하기
2. 페이지 로드하기
3. 장바구니에 제품 담기 버튼 클릭
4. DOM이 업데이트될 때까지 기다리기
5. DOM에서 값 가져오기
6. 가져온 문자열 값을 숫자로 바꾸기
7. 예상하는 값과 비교하기

`update_tax_dom`함수에서 테스트가 필요한 비즈니스 규칙은 `shopping_cart_total * 0.1` 이 부분 뿐인데 위에서 설명한 많은 과정을 거처 힘들게 테스트를 해야 하는 상황이 생겼다! 이를 개선하기 위해 두 가지를 제안한다.

-   DOM 업데이트와 비즈니스 규칙은 분리되어야 한다.
-   전역 변수가 없어야 한다.

## 재사용하기 쉽게 만들기

결제팀과 배송팀이 위 코드를 재사용하려고 했으나 위 코드는 전역 변수와 DOM에 의존적이기 때문에 실패했다. 이를 위해서 한 가지 제안을 더 추가한다.

-   함수가 결과값을 리턴해야 한다.

## 액션과 계산, 데이터를 구분하기

우선 앞서 본 코드는 전역 변수를 참조하고 DOM에 의존하고 있기 때문에 코드 전체가 액션이다. 이것을 함수형 프로그래밍으로 리팩터링 해보자.

## 함수가 액션이 되는 경우

함수에는 입력과 출력이 있다. 다시 입력은 명시적 입력과 암묵적 입력, 출력 역시 명시적 출력과 암묵적 출력이 있다. 명시적 입출력은 우리가 흔히 알고 있는 함수의 인자와 리턴 값이다. 그렇다면 암묵적 입출력은 무엇일까?

```javascript
let total = 0;
function add_to_total(amount) {
    // 전역 변수를 읽는 것은 암묵적 입력, 콘솔에 로그를 남기는 것은 암묵적 출력
    console.log("Old total: " + total);
    // 전역 변수를 바꾸는 것도 암묵적 출력
    total += amount;
    return total;
}
```

함수에 암묵적 입출력이 있으면 그 함수는 액션이 된다. 반대로 함수에서 암묵적 입출력을 없애면 그 함수는 계산이 된다! 따라서 액션 함수에서 암묵적 입력은 인자로 바꾸고 암묵적 출력은 리턴값으로 바꿔서 계산으로 만들 수 있는 것이다!

## 액션에서 계산 빼내기

앞에서 만들었던 `calc_cart_total`함수를 바꿔보자

```javascript
function calc_cart_total() {
    calc_total();
    set_cart_total_dom();
    update_shipping_icons();
    update_tax_dom();
}

function calc_total() {
    shopping_cart_total = 0;
    for (let i = 0; i < shopping_cart.length; i++) {
        const item = shopping_cart[i];
        shopping_cart_total += item.price;
    }
}
```

`calc_cart_total`함수 일부를 새로 만든 `calc_total`함수로 옮겼다. 이런 리팩터링을 **서브루틴 추출하기**라고 한다. 기존 코드와 동작은 동일하다. 그러나 새 함수에는 암묵적 입출력이 있기 때문에 아직 액션이다.

```javascript
function calc_cart_total() {
    shopping_cart_total = calc_total(shopping_cart);
    set_cart_total_dom();
    update_shipping_icons();
    update_tax_dom();
}

function calc_total(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price;
    }
    return total;
}
```

`calc_total`함수에서 전역 변수 `shopping_cart_total`을 없애 암묵적 출력을 없애고 전역 변수 `shopping_cart`를 없애 암묵적 입력을 없앴다. 이제 `calc_total`함수에는 명시적 입출력만 있으므로 계산이 되었다. 이런 식으로 리팩터링해서 아래와 같은 코드를 얻었다.

```javascript
const shopping_cart = [];
let shopping_cart_total = 0;

function add_item_to_cart(name, price) {
    shopping_cart = add_item(shopping_cart, name, price);
    calc_cart_total();
}

function calc_cart_total() {
    shopping_cart_total = calc_total(shopping_cart);
    set_cart_total_dom();
    update_shipping_icons();
    update_tax_dom();
}

function update_shipping_icons() {
    const buy_buttons = get_buy_buttons_dom();
    for (let i = 0; i < buy_buttons.length; i++) {
        const button = buy_buttons[i];
        const item = button.item;
        if (gets_free_shipping(shopping_cart_total, item.price)) {
            button.show_free_shipping_icon();
        } else {
            button.hide_free_shipping_icon();
        }
    }
}

function update_tax_dom() {
    set_tax_dom(calc_tax(shopping_cart_total));
}

function add_item(cart, name, price) {
    const new_cart = cart.slice();
    new_cart.push({
        name: name,
        price: price,
    });
    return new_cart;
}

function calc_total(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price;
    }
    return total;
}

function gets_free_shipping(total, item_price) {
    return item_price + total >= 20;
}

function calc_tax(amount) {
    return amount * 0.1;
}
```

함수형 프로그래밍을 적용하면 액션에서 계산을 빼내어 액션은 줄이고 계산을 늘릴 수 있다. 늘어난 액션은 재사용하기 쉽고 테스트하기 쉽다.
