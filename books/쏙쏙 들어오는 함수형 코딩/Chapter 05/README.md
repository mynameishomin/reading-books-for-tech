# 더 좋은 액션 만들기

## 암묵적 입력과 출력 줄이기

인자가 아닌 모든 입력은 암묵적 입력이고 리턴값이 아닌 모든 출력은 암묵적 출력이다. 이 암묵적 입출력을 모두 제거한 함수를 계산이라 불렀고 이는 액션에도 적용할 수 있다. 액션에서 모든 암묵적 입출력을 제거할 수 없더라도 줄일 수 있는 만큼 줄이면 테스트하기 쉽고 재사용하기 쉬워진다.

```javascript
// 원래 코드
function update_shipping_icons() {
    const buy_buttons = get_buy_buttons_dom();
    for (let i = 0; i < buy_buttons.length; i++) {
        const button = buy_buttons[i];
        const item = button.item;
        // 전역 변수 shopping_cart를 읽고 있다.
        const new_cart = add_item(shopping_cart, item.name, item.price);
        if (gets_free_shipping(new_cart)) {
            button.show_free_shipping_icon();
        } else {
            button.hide_free_shipping_icon();
        }
    }
}

// 바꾼 코드
function update_shipping_icons(cart) {
    const buy_buttons = get_buy_buttons_dom();
    for (let i = 0; i < buy_buttons.length; i++) {
        const button = buy_buttons[i];
        const item = button.item;
        // 전역 변수 shopping_cart 대신 인자로 cart를 받도록 바꿨다.
        const new_cart = add_item(cart, item.name, item.price);
        if (gets_free_shipping(new_cart)) {
            button.show_free_shipping_icon();
        } else {
            button.hide_free_shipping_icon();
        }
    }
}
```

## add_item()을 분리해 더 좋은 설계 만들기

아래 함수는 앞에서 장바구니에 제품을 추가하는 한가지 일만 하는 함수처럼 보이지만 사실 더 나눌 수 있다.

```javascript
function add_item(cart, name, price) {
    // 1. 배열을 복사한다.
    const new_cart = cart.slice();
    // 2. item 객체를 만든다.
    // 3. 복사본에 item을 추가한다.
    new_cart.push({
        name: name,
        price: price,
    });
    // 4. 복사본을 리턴한다.
    return new_cart;
}
```

또한 `add_item`함수는 장바구니 `cart` 구조와 제품 `item` 구조를 모두 알고 있으므로 의미 있는 계층으로 분리하면 더 좋을 것이다.

```javascript
function make_cart_item(name, price) {
    // 2. item 객체를 만듭니다.
    return {
        name: name,
        price: price,
    };
}

function add_item(cart, item) {
    // 1. 배열을 복사합니다.
    const new_cart = cart.slice();
    // 3. 복사본에 item을 추가한다.
    new_cart.push(item);
    // 4. 복사본을 리턴한다.
    return new_cart;
}
```

자, `add_item`함수는 `cart` 구조만 알고 있게 바꿨고 `item`구조만 알고 있는 `make_cart_item`함수를 만들었다. 여기서 `add_item`함수는 단순히 배열에 항목을 추가하는 함수이므로 다른 일반적인 배열에서도 쓸 수 있다. 다만 지금은 인자 이름이 일반적이지 않기 때문에 장바구니 정보만을 넘겨야 쓸 수 있는 것으로 착각하기 쉽다. 따라서 이름을 바꿔줄 필요가 있다.

```javascript
function add_element_last(array, elem) {
    const new_array = array.slice();
    new_array.push(elem);
    return new_array;
}

function add_item(cart, item) {
    return add_element_last(cart, item);
}
```

다른 어떤 배열에서도 쓸 수 있도록 함수 이름과 인자 이름을 바꿔 `add_element_last` 함수를 만들었다. 이렇게 재사용 가능한 함수를 유틸리티 함수라고 부른다. 그리고 그 함수를 이용해 `add_item`함수를 더 단순하게 만들었다.
