# 중첩된 데이터에 함수형 도구 사용하기

## 필드명을 명시적을 만들기

MegaMart 마케팅 팀은 챕터 10에서 배운 내용으로 코드를 리팩터링 했다.

```javascript
// 원래 코드
// Quantity, 수량 필드명이 함수 이름에 있는 암묵적 인자로 있다.
function incrementQuantity(item) {
    const quantity = item["quantity"];
    const newQuantity = quantity + 1;
    const newItem = objectSet(item, "quantity", newQuantity);
    return newItem;
}

// Size, 크기 필드명이 함수 이름에 있는 암묵적 인자로 있다.
function incrementSize(item) {
    const size = item["size"];
    const newSize = size + 1;
    const newItem = objectSet(item, "size", newQuantity);
    return newItem;
}


// 리팩터링한 코드
function incrementField(item, field) {
    const value = item[field];
    const newValue = value + 1;
    const newItem = objectSet(item, field, newValue);
    return newItem;
}
```

앞에서 배운 암묵적 인자를 들어내기 리팩터링으로 함수 이름에 있는 암묵적 인자 필드명을 인자로 만들었다. 덕분에 중복이 많이 줄어들었다. 하지만 또 다시 다른 중복이 생겨났다.

```javascript
function incrementField(item, field) {
    const value = item[field];
    const newValue = value + 1;
    const newItem = objectSet(item, field, newValue);
    return newItem;
}

function decrementField(item, field) {
    const value = item[field];
    const newValue = value - 1;
    const newItem = objectSet(item, field, newValue);
    return newItem;
}

function doubleField(item, field) {
    const value = item[field];
    const newValue = value * 2;
    const newItem = objectSet(item, field, newValue);
    return newItem;
}

function halveField(item, field) {
    const value = item[field];
    const newValue = value / 2;
    const newItem = objectSet(item, field, newValue);
    return newItem;
}
```

위 네 가지 함수는 함수 본문에서 `newValue`를 만드는 줄을 빼면 모두 똑같은 코드로 중복이다. 이런 함수들은 각 함수가 하는 일이 함수 이름에 들어있으며(증가, 감소, 곱하기, 나누가) 마찬가지로 암묵적 인자를 드러내기 리팩터링, 함수 본문을 콜백으로 바꾸기를 적용할 수 있다.

## update() 도출하기

```javascript
function incrementField(item, field) {
    return update(item, field, function(value) {
        return value + 1;
    });
}

// object: 객체
// key: 바꿀 값의 키
// modify: 바꿀 동작
function update(object, key, modify) {
    const value = object[key]; // 바꿀 값 조회
    const newValue = modify(value); // 값 바꾸기
    const newObject = objectSet(object, key, newValue); // 바꾼 값 설정
    return newObject; // 카피-온-라이트
}
```

위 코드는 암묵적 인자를 들어내기 리팩터링으로 함수 이름과 똑같은 동작을 명시적인 인자로 받게 바꿨다. 다만 이때 바꿔야 할 인자가 전처럼 값이 아니라 동작(`value + 1`, `value - 1` 등)이다. 따라서 함수 본문을 콜백으로 바꾸기 리팩터링으로 이 동작을 인자 `modify`로 넘겨 받았다.

여기서 만든 `update`함수는 해시 맵 대신 쓰고 있는 객체를 다루는 중요한 함수형 도구이다.

## 중첩된 데이터에 update() 사용하기

`update`함수는 꽤 잘 만들어진 함수같다. 하지만 객체 안에 객체가 있는 아래와 같은 중첩 구조에서도 쓸 수 있을까?

```javascript
const shirt = {
    name: "shirt",
    price: 13,
    options: {
        color: "blue",
        size: 3
    }
};

function incrementSize(item) {
    const options = item.options; // 조회
    const size = options.size; // 조회
    const newSize = size + 1; // 변경
    const newOptions = objectSet(options, "size", newSize); // 설정
    const newItem = objectSet(item, "options", newOptions); // 설정
    return newItem;
}
```

위 코드를 보자. `shirt` 객체 안에 있는 `options`객체의 속성 `size` 값을 바꿔야 하는 상황이다.

* `shirt`에서 `options` 조회
* `options`에서 `size` 조회
* `size` 변경
* 바뀐 `size`을 새로운 `newOptions`로 설정
* `newOptions`으로 새로운 `newItem` 설정

여기서 가운데 조회, 변경, 설정 한 묶음을 볼 수 있는데 이걸 `update`로 바꿀 수 있다.

```javascript
function incrementSize(item) {
    const options = item.options; // 조회
    const newOptions = update(options, "size", increment); // 변경
    const newItem = objectSet(item, "options", newOptions); // 설정
    return newItem;
}
```

자, 가운데에 있던 조회, 변경, 설정 한 묶음을 `update`로 바꾼 코드다. 여기서 다시 한번 조회, 변경, 설정 한 묶음이 보인다. 따라서 이것도 다시 `update`로 바꿀 수 있다는 뜻이다.

```javascript
function incrementSize(item) {
    return update(item, "options", function(options) {
        return update(item, "size", increment);
    })
}
```

이렇게 해서 중첩된 객체에는 `update`도 중첩으로 쓸 수 있다는 걸 알았다.

## update2() 도출하기

위에서 만든 코드 역시 함수 안에 `"options", "size"`처럼 암묵적 인자가 있다. 따라서 암묵적 인자를 들어내기 리팩터링으로 바꿔보자

```javascript
function incremenetSize(item) {
    return update2(item, "options", "size", function(size) {
        return size + 1;
    });
}

function update2(object, key1, key2, modify) {
    return update(object, key1, function(value1) {
        return update(value1, key2, modify);
    });
}
```

`"options", "size"`를 인자 `key1, key2`로 받게 바꿨다. 그러나 이번엔 또 새로운 문제가 생겼다.

## incrementSizeByName()을 만드는 네 가지 방법

`shirt`객체는 장바구니 `cart`객체 안에 있어서 아래와 같은 데이터가 된다.

```javascript
const cart = {
    shirt: {
        name: "shirt",
        price: 13,
        options: {
            color: "blue",
            size: 3
        }
    }
}
```

이제 세 번이 중첩된다! 으악! 그만! 이걸 어떻게 해결할까

**방법1: update()와 incrementSize()로 만들기**
```javascript
function incrementSizeByName(cart, name) {
    return update(cart, name, incremenetSize);
}
```
앞에서 이미 두 번 중첩된 객체의 `size`를 바꾸는 함수 `incremenetSize`를 만들었기 때문에 `update`와 조합해서 만들 수 있다.


**방법2: update()와 update2()로 만들기**
```javascript
function incrementSizeByName(cart, name) {
    return update(cart, name, function(item) {
        return update2(item, "options", "size", function(size) {
            return size + 1;
        });
    });
}
```

**방법3: update()로 만들기**
```javascript
function incrementSizeByName(cart, name) {
    return update(cart, name, function(item) {
        return update(item, "options", function(options) {
            return update(options, "size", function(size) {
                return size + 1;
            });
        });
    });
}
```
ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ 미친것 같다.

**방법4: 조회하고 바꾸고 설정하는 것을 직접 만들기**
```javascript
function incrementSizeByName(cart, name) {
    const itme = cart[name];
    const options = item.options;
    const size = options.size;
    const newSize = size + 1;
    const newOptions = objectSet(optinos, "size", newSize);
    const newItem = objectSet(item, "options", newOptions);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}
```
조회, 변경, 설정 코드를 직접 만들 수도 있다. 마음에 안들지만 이전에 포트폴리오 사이트 만들면서 notion DB API 쓸 때 이런 식으로 만들었던 것 같다.

## update3() 도출하기

으악! 도출하지마 미친짓이야!

## nestedUpdate() 도출하기

그렇다. update2, 3 이런 거 만들기 시작하면 4, 5, 6 끝이 없다. 중첩된 개수에 상관 없이 쓸 수 있는 함수를 만들어보자.

먼저 패턴을 찾아보자 `updateX`는 `update` 안에서 `updateX - 1`을 불러주면 된다.

```javascript
// update2는 키 두 개를 사용하고 update1을 호출한다.
function update2(object, key1, key2, modify) {
    return update(object, key1, function(value1) {
        return update1(value1, key2, modify);
    });
}

// update1은 키 한 개를 사용하고 update0을 호출한다.
function update1(object, key1, modify) {
    return update(object, key1, function(value1) {
        return update0(value1, modify);
    });
}
```

여기서 `update0`은 패턴이 조금 다르다. 우선 사용하는 키가 없기 떄문에 `update`를 호출할 수 없고 X - 1의 결과가 -1이 되기 때문에 경로 길이를 표현할 수 없다. 즉 `update0`은 아래 코드와 같이 그냥 `modify`를 호출하는 함수가 된다.

```javascript
function update0(value, modify) {
    return modify(value);
}
```

이런 `updateX`에는 또 다시 함수 이름에 있는 암묵적 인자가 있는 문제가 생긴다. 항상 함수 이름에 있는 숫자와 `key` 개수가 똑같다. 이를 해결하기 위해 명시적 인자 `depth`를 추가해서 `updateX`함수를 만들었다.

```javascript
function updateX(object, depth, key1, key2, key3, modify) {
    return update(object, key1, function(value1) {
        // updateX 재귀 호출
        return updateX(value1, depth - 1, key2, key3, modify)
    });
}
```

인자를 명시적으로 만들었지만 문제가 또 생겼다. depth와 key의 개수가 맞지 않을 경우 버그가 생길 것이다. 여기서 중요한 것은 키, 개수, 순서가 중요하다는 것이다. 이것은 배열 자료 구조가 필요하다는 뜻이므로 아래 코드로 바꿨다


```javascript
function updateX(object, keys, modify) {
    // 첫 번째 키로 update 호출
    const key1 = keys[0];
    // 나머지 키로 재귀 호출
    const resetOfKeys = drop_first(keys);
    return update(object, key1, function(value1) {
        return updateX(value1, resetOfKeys, modify);
    });
}
```

앞에서 `update0`는 `update`를 호출하지 않고 그냥 `modyfy`를 호출하는 함수라고 했다. 따라서 keys 배열 길이가 0인 경우 처리를 해주고 조금 더 일반적인 이름 `nestedUpdate`로 이름을 바꿨다.

```javascript
function nestedUpdate(object, keys, modify) {
    if(keys.length === 0) {
        return modify(object);
    }

    const key1 = keys[0];
    const resetOfKeys = drop_first(keys);
    return update(object, key1, function(value1) {
        return nestedUpdate(value1, resetOfKeys, modify);
    });
}
```

## 안전한 재귀 사용법

재귀는 다른 반복문 처럼 무한 반복에 빠질 수 있다. 따라서 아래 가이드를 따라서 사용하자.

1. **종료조건**   
    재귀를 멈추려면 종료 조건이 필요하다. 또한 종료 조건은 재귀가 멈춰야 하는 곳에 있어야 한다.
    앞에서 만든 `nestedUpdate`함수의 아래 코드가 그 예다.
    ```javascript
    if(keys.length === 0) {
        return modify(object);
    }
    ```

2. **재귀 호출**   
    당연하게도 재귀 함수는 함수 본문에 하나 이상의 재귀 호출이 있어야 한다.

3. **종료 조건에 다가가기**   
    재귀 함수를 만들 때 최소 하나 이상의 인자가 줄어들어야 한다. 그래야 종료 조건에 가까워질 수 있다. 만약 종료 조건이 빈 배열이라면 각 단계에서 배열 항목을 없애야 한다. 만약 재귀 호출에 같은 인자를 그대로 전달한다면 무한 반복에 빠질 가능성이 높아진다.

## 재귀 함수가 적합한 이유

그동안 배열 처리를 위해 for 반복문을 사용했다. 그러나 이번에는 배열이 아니라 중첩된 객체 데이터를 다뤄야 했다. 배열을 처리할 때는 배열의 처음부터 끝까지 처리하면 됐다. 하지만 중첩된 객체 데이터를 다룰 때는 재귀 함수를 써서 점점 더 깊게 들어갔다가 최종 깊이에 도착하면 다시 점점 올라오면서 카피-온-라이트 원칙에 따라 복사본을 만들어야 했기 때문이다. 비교하면 아래와 같다.   

**배열 반복**   
조회 - 바꾸기 - 설정 - 조회 - 바꾸기 - 설정 - 조회 - 바꾸기 - 설정 - 조회 - 바꾸기 - 설정   

**객체 재귀**   
조회 - 조회 - 조회 - 조회 - 바꾸기 - 설정 - 설정 - 설정 - 설정

## 깊이 중첩된 구조를 설계할 때 생각할 점

```javascript
nestedUpdate(blogCategory, ["post", "12", "author", "name"], captalize);
```

이 코드는 블로그에 있는 정보를 가저와 글쓴이 이름을 대문자로 바꾸는 일을 한다. 코드를 쓸 때는 이해하기 쉽지만 나중에도 이렇게 길게 연결된 키를 잘 이해할 수 없을 수도 있다. 따라서 이때 챕터 9에서 봤던 추상화 벽을 쓰면 도움이 된다.

## 깊이 중첩된 데이터에 추상화 벽 사용하기

추상화 벽을 통해 주어진 ID로 블로그를 변경하는 함수를 만들어보자

```javascript
function updatePostById(category, id, modifyPost) {
    return nestedUpdate(category, ["posts", "id", modifyPost]);
}

function updateAuthor(post, modifyUser) {
    return update(user, "author", modifyUser);
}

function capitalizeName(user) {
    return update(user, "name", capitalize);
}

updatePostById(blogCategory, "12", function(post) {
    return updateAuthor(post, capitalizeName)
});
```

이렇게 만든 함수는 이름이 명확해졌으므로 각 함수가 무슨 일을 기억하기 쉬워졌고 어떤 키가 있는지 자세히 알 필요가 없어졌다.
