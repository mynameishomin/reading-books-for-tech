# 신뢰할 수 없는 코드를 쓰면서 불변성 지키기

앞에서 카피-온-라이트를 적용해서 불변성을 유지하는 방법을 배웠다. 그러나 이를 적용할 수 없는 코드를 사용해야 하는 경우가 생길 수 있다. 바꿀 수 없는 라이브러리 혹은 레거시 코드가 그 예다. 만약 이들이 데이터를 변경 가능하게 만든다면 어떻게 해야할까?

## 레거시 코드와 불변성

MegaMart에서 블랙프라이데이 세일을 준비하여 고객이 장바구니에 물건을 담을 때 행사 가격이 적용되도록 해야한다.

```javascript
function add_item_to_cart(name, price) {
    const item = make_cart_item(name, price);
    shopping_cart = add_item(shopping_cart, item);
    const total = calc_total(cart);
    set_cart_total_dom(total);
    update_shipping_icons(cart);
    update_tax_dom(total);
    // 블랙 프라이데이를 위한 함수 추가
    black_friday_promotion(shopping_cart);
}
```

이미 만들어져있고 잘 동작하는 `black_friday_promotion`함수를 추가했다. 하지만 이 함수는 장바구니 데이터를 변경하며 지금 당장 수정할 수도 없다. 이때 카피-온-라이트 원칙을 지키고 안전하게 함수를 사용할 수 있는 원칙이 있다. 이를 방어적 복사라고 한다.

## 방어적 복사 구현하기

우리가 지금까지 카피-온-라이트를 적용하여 만든 코드는 불변성이 지켜지는 안전지대에 있다. 하지만 안전지대에 `black_friday_promotion`함수가 들어오면서 안전지대에서 나가는 데이터도 잠재적으로 바뀔 수 있기 때문에 방어적 복사를 이용해야 한다.

```javascript
function add_item_to_cart(name, price) {
    const item = make_cart_item(name, price);
    shopping_cart = add_item(shopping_cart, item);
    const total = calc_total(cart);
    set_cart_total_dom(total);
    update_shipping_icons(cart);
    update_tax_dom(total);
    // 값을 넘기기 전에 깊은 복사 (나가는 값)
    const cart_copy = deepCopy(shopping_cart);
    black_friday_promotion(cart_copy);
    // 바뀐 복사본 복사 (들어오는 값)
    shopping_cart = deepCopy(cart_copy);
}
```

`black_friday_promotion`함수 인자로 `shopping_cart` 자체가 아닌 깊은 복사를 통해 `cart_copy`를 넘겼다. 따라서 `black_friday_promotion`함수는 원본 데이터를 바꾸지 못하게 됐다. 또한 `black_friday_promotion`함수가 바꾼 `cart_copy`값을 다시 깊은 복사본으로 만들어 `shopping_cart`에 할당해주면서 원본 데이터가 잠재적으로 바뀌지 않게 방어적 복사를 구현했다.

### 방어적 복사 규칙

-   데이터가 안전한 코드에서 나갈 때 복사하기.

    1. 불변성 데이터를 위한 깊은 복사본을 만들고
    2. 신리할 수 없는 코드로 복사본을 전달

-   안전한 코드로 데이터가 들어올 때 복사하기.
    1. 변경될 수도 있는 데이터가 들어오면 깊은 복사본을 만들어 안전한 코드로 전달.
    2. 복사본을 안전한 코드에서 사용

## 신뢰할 수 없는 코드 감싸기

방어적 복사를 적용해 코드를 안전하게 만들었지만. 나중에 코드를 다시 봤을 때 깊은 복사를 왜 하는지 모를 수 있고, 다른 곳에서 `black_friday_promotion`함수를 또 쓸 경우 방어적 복사를 구현하지 않을 수 있다. 따라서 따로 방어적 복사 코드를 분리하면 더 안전하게 함수를 사용할 수 있다.

```javascript
function black_friday_promotion_safe() {
    const cart_copy = deepCopy(cart);
    black_friday_promotion(cart_copy);
    return deepCopy(cart_copy);
}
```

새로운 함수 `black_friday_promotion_safe`를 만들어서 내부적으로 나가는 값, 들어오는 값을 방어적 복사로 구현했다. 이제 `black_friday_promotion`대신 이 함수를 사용하면 안전하다.

## 깊은 복사는 얕은 복사보다 비싸다.

앞에서 카피-온-라이트를 적용하면서 얕은 복사를 사용할 때는 바뀌지 않은 값이라면 참조를 통해 원본과 복사본이 데이터를 공유했으나 방어적 복사에서 사용한 깊은 복사는 모든 데이터를 복사하기 때문에 비용이 많이 든다. 따라서 카피-온-라이트를 적용할 수 없는 곳에서만 사용해야한다.

## 자바스크립트에서 깊은 복사를 구현하는 것은 어렵다.

아래는 완벽하지 않지만 깊은 복사가 어떻게 동작하는지 보여주는 간단한 구현이다.

```javascript
function deepCopy(thing) {
    if (Array.isArray(thing)) {
        const copy = [];
        for (let i = 0; i < thing.length; i++) {
            // deepCopy 재귀 호출
            copy.push(deepCopy(thing[i]));
        }
        return copy;
    } else if (thing === null) {
        return null;
    } else if (typeof thing === "object") {
        const copy = {};
        const keys = Object.keys(thing);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            // deepCopy 재귀 호출
            copy[key] = deepCopy(thing[key]);
        }
        return copy;
    } else {
        return thing;
    }
}
```

🤔 그냥 JSON.parse, JSON.stringify 쓰는 게 더 깔끔하고 편할 것 같은데 왜 이런 재귀 함수를 만들어 쓰나 했더니 성능 면에서 약 10%정도 빠르다고 한다.
