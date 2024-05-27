# 일급 함수 Ⅰ

추상화 벽은 마케팅팀이 사용하기 좋은 API였지만 생각만큼 잘 안됐다. 개발팀과 협의 없이 일할 수 있었지만 데이터 구조에 직접 접근할 수 없어진 지금은 마케팅 팀이 할 수 없는 일이 있어서 새로운 API를 개발팀에게 요청해야 하는 경우가 생겼다. 이제는 추상화 벽이 잘 작동하지 않는 것 같다. 아래는 마케팅 팀의 요구사항이다. 이보다 더 많은 요구 사항이 있다.

-   장바구니에 있는 제품값을 설정하는 기능
-   장바구니에 있는 제품 개수를 설정하는 기능
-   장바구니에 있는 제품에 배송을 설정하는 기능

## 코드의 냄새: 함수 이름에 있는 암묵적 인자

개발팀은 요구사항에 맞춰 열심히 함수를 만들었다.

```javascript
function setPriceByName(cart, name, price) {
    const item = cart[name];
    const newItem = objectSet(item, "price", price);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setShippingByName(cart, name, ship) {
    const item = cart[name];
    const newItem = objectSet(item, "shipping", ship);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setQuantityByName(cart, name, quant) {
    const item = cart[name];
    const newItem = objectSet(item, "quantity", ship);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setTaxByName(cart, name, tax) {
    const item = cart[name];
    const newItem = objectSet(item, "tax", tax);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}
```

만든 모든 함수는 비슷하다. 새로 만든 함수는 `objectSet`함수를 쓸 때 전달하는 문자열과 필드에 들어갈 값 뿐이다. 인자만 다를 뿐 나머지는 동일하다. 뿐만 아니라 그 문자열이 함수 이름에 포함된다. 이는 값을 명시적으로 전달하지 않고 함수 이름의 일부로 전달하는 **함수 이름에 있는 암묵적 인자**다.

## 리팩터링: 암묵적 인자 드러내기

아래는 암묵적 인자 드러내기 단계다.

1. 함수 이름에 있는 암묵적 인자를 확인한다.
2. 명시적인 인자를 추가한다.
3. 함수 본문에 하드 코딩된 값을 새로운 인자로 바꿉니다.
4. 함수를 부르는 곳을 고친다.

```javascript
function setFieldByName(cart, name, field, value) {
    const item = cart[name];
    const newItem = objectSet(item, field, value);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

cart = setFieldByName(cart, "shoe", "price", 13);
cart = setFieldByName(cart, "shoe", "quantity", 3);
cart = setFieldByName(cart, "shoe", "shipping", 0);
cart = setFieldByName(cart, "shoe", "tax", 2.34);
```

비슷하던 함수를 `setFieldByName`함수 하나로 리팩터링 했다. 리팩터링 전에는 필드 이름이 함수에 암묵적으로 있었지만 여기서는 인자로 넘기고 받는 값으로 만들었다. 값은 변수나 배열에 담을 수 있고 이걸 **일급**이라고 부른다.

## 필드 이름을 문자열로 사용하면 버그가 생기지 않을까?

`setFieldByName`함수를 쓸 때 문자열로 전달하는 필드 이름에 오타가 있거나 없는 필드라면 어떻게 될까? 이럴 경우 확실히 문제가 될 수 있다. 그래서 올바른 필드 이름이 맞는지 검사하는 코드를 추가했다.

```javascript
function setFieldByName(cart, name, field, value) {
    // 필드 이름 검사
    if (!validItemFieelds.includes(field)) {
        throw "Not a vaild item field: " + field;
    }
    const item = cart[name];
    const newItem = objectSet(item, field, value);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}
```

## 어떤 문법이든 일급 함수로 바꿀 수 있다.

자바스크립트에는 변수나 배열에 담을 수 없는, **일급**이 아닌 것이 있다. 예를 들면 + 연산자 같은 거 말이다. 하지만 + 연산자와 같은 함수를 만들 수는 있다.

```javascript
function plus(a, b) {
    return a + b;
}
```

위 함수는 + 연산자와 똑같은 기능을 한다. 자바스크립트에서 함수는 일급 값이므로 + 연산자를 일급 값으로 만든 것이다. 이런 함수가 쓸데없어 보이기도 하지만 일급으로 만들면 강력한 힘이 생긴다는 것을 알게 될 것이다.

## 리팩터링: 함수 본문을 콜백으로 바꾸기

에러 로그 시스템을 만들기 위해 중요한 코드를 try/catch 문으로 감싸는 작업을 했다. 고생해서 만든 코드는 아래와 같다.

```javascript
try {
    saveUserData(user);
} catch (error) {
    logToSnapErrors(error);
}

try {
    fetchProduct(productId);
} catch (error) {
    logToSnapErrors(error);
}
```

`logToSnapErrors`함수는 에러 로그를 남기는 함수다. 이때 코드를 보면 중복이 많은 것을 알 수 있다. 앞으로도 이런 코드를 계속 만들어야 할까? 여기서 함수 본문을 콜백우로 바꾸기를 적용할 수 있다.

### 본문과 본문의 앞, 뒤를 구분한다.

위 코드에서는 각 함수에 두번 째 줄만이 다른 함수의 본문이고 그 앞과 뒤는 중복되는 코드인 걸 알 수 있다.

### 전체를 함수로 빼내기

코드 전체를 함수 하나로 뺐냈다.

```javascript
function withLogging() {
    try {
        saveUserData(user);
    } catch (error) {
        logToSnapErrors(error);
    }
}

withLogging();
```

###
