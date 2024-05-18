# 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기

## 동작을 읽기, 쓰기 또는 둘 다로 분류하기

함수의 동작을 읽기, 쓰기 또는 둘 다로 분류할 수 있다.

-   **읽기**: 데이터를 바꾸지 않고 정보를 꺼내는 것. 데이터가 바뀌지 않기 때문에 다루기 쉽고 인자에만 의존해 정보를 가져온다면 계산이라고 할 수 있다.
-   **쓰기**: 데이터를 바꾼다. 바뀌는 값은 어디에서 어떻게 사용될 지 모르기 때문에 값이 바뀌지 않도록 원칙이 필요하다.

## 카피-온-라이트 원칙 세 단계

카피-온-라이트를 적용하면 기존 값이 바뀌지 않게 불변성을 유지하면서 새로운 값을 만들 수 있다.

1. 복사본 만들기
2. 복사본 변경하기(원하는 만큼)
3. 복사본 리턴하기

이전에 만든 `add_element_last`함수를 보자

```javascript
function add_element_last(array, elem) {
    // 1. 복사본 만들기
    const new_array = array.slice();
    // 2. 복사본 바꾸기
    new_array.push(elem);
    // 3. 복사본 리턴하기
    return new_array;
}
```

이 함수는 카피-온-라이트가 적용되었고 기존 값을 바꾸지 않고 필요한 정보를 리턴했으므로 읽기 동작을 하는 함수다. 카피-온-라이트를 적용하면 쓰기를 읽기로 바꿀 수 있다.

## 카피-온-라이트로 쓰기를 읽기로 바꾸기

아래는 장바구니에 있는 제품을 제거하는 MegaMart의 코드이다.

```javascript
function remove_item_by_name(cart, name) {
    const idx = null;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            idx = i;
        }
    }

    if (idx !== null) {
        cart.splice(idx, 1);
    }
}
```

이 코드에서 `cart.splice(idx, 1);` 이 부분은 장바구니를 면경하는데 만약 전역 변수 `shopping_cart`를 인자로 넘겼다면 전역 변수가 바뀌게 된다. 여기에 카피-온-라이트를 적용해보자.

```javascript
function remove_item_by_name(cart, name) {
    const new_cart = cart.slice();
    const idx = null;
    for (let i = 0; i < new_cart.length; i++) {
        if (new_cart[i].name === name) {
            idx = i;
        }
    }

    if (idx !== null) {
        new_cart.splice(idx, 1);
    }

    return new_cart;
}
```

인자 `cart`를 복사해서 `new_cart`를 만들었고 값을 변경한 후 리턴했다. 따라서 전역 변수가 바뀔 수 없으며 완벽하게 읽기 동작이 되었다. 이렇게 카피-온-라이트를 적용하면 쓰기를 읽기로 바꿀 수 있다.

## 쓰기를 하면서 읽기도 하는 동작

함수의 동작은 읽기, 쓰기 두가지만 있는 것이 아니라 둘 다 하는 경우도 있다.

```javascript
const a = [1, 2, 3, 4];
const b = a.shift();
console.log(b); // 1
console.log(a); // [2, 3, 4]
```

`shift`메서드는 기존 배열을 바꾸면서 배열의 첫 번째 항목을 리턴하는 읽기와 쓰기 동작을 같이 하는 메서드다.

이런 경우 두 가지 접근법이 있다.

## 1. 함수를 분리하기.

함수를 분리할 때는 두 가지 단계를 거쳐 분리할 수 있는데 먼저 쓰기에서 읽기를 분리하고 쓰기에 카피-온-라이트를 적용해 읽기로 바꾼다. `shift`메서드가 하는 읽기 동작은 배열의 첫 번째 요소를 리턴하는 것이므로 똑같은 기능을 하는 함수를 만들면 그만이다.

```javascript
function first_element(array) {
    return array[0];
}
```

이렇게 만든 `first_element`함수는 배열의 첫 번째 요소를 리턴할 뿐 기존 배열을 바꾸지 않는 읽기 동작만 하므로 계산이다.  
`shift`메서드가 하는 쓰기 동작은 새로운 함수로 감싸서 새로운 함수를 만든 후 카피-온-라이트를 적용하여 읽기 동작으로 바꾸면 된다.

```javascript
function drop_first(array) {
    const array_copy = array.slice();
    array_copy.shift();
    return array_copy;
}
```

이렇게 읽기와 쓰기를 모두 하는 `shift`메서드를 함수를 분리해서 모두 읽기 동작, 계산으로 만들었다.

## 2. 값을 두 개 리턴하는 함수로 만들기

새로운 함수를 만들고 역시 카피-온-라이트를 적용하여 변경된 새로운 배열과 배열의 첫 번째 요소를 함께 객체로 리턴한다.

```javascript
function shift(array) {
    const array_copy = array.slice();
    const first = array_copy.shift();
    return {
        first: first,
        array: array_copy,
    };
}
```

🤔 사실 이건 값을 두 개 리턴한다기 보다 값 두 개를 객체로 묶어서 리턴한다고 보는 게 맞겠다.

🤔 객체 말고 배열로 리턴하는 방법도 있겠다. react에서 많은 hook들이 하듯이

```javascript
function shift(array) {
    const array_copy = array.slice();
    const first = array_copy.shift();
    return [first, array_copy];
}
```

## 불변 데이터 구조를 읽는 것은 계산이다.

변하지 않는 데이터 구조를 읽는 것은 계산이고 언제든지 변경 가능한 데이터를 읽는 것은 액션이다. 호출 시점에 데이터가 어떻게 바뀌어 있을지 보장할 수 없기 때문. 쓰기 동작은 데이터를 변경 가능한 구조로 만들기 때문에 쓰기를 읽기로 만들어서 계산을 늘리고 액션을 줄여야 한다.
