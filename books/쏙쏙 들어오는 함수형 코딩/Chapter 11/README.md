# 일급 함수 Ⅱ

## 카피-온-라이트 리팩터링

이전에 살펴봤던 카피-온-라이트 패턴에도 마찬가지로 함수 본문을 콜백으로 바꾸기 리팩터링 패턴을 사용할 수 있다.

카피-온-라이트의 동작 단계는 아래와 같다.

1. 복사본 만들기
2. 복사본 변경하기
3. 복사본 리턴하기

카피-온-라이트 패턴에도 이 리팩터링 패턴을 적용하려면 우선 함수의 본문, 앞부분, 뒷부분을 확인해야 하는데 여기서는 복사본 변경하기가 본문이며 그 앞뒤로 구분할 수 있다.

## 배열에 대한 카피-온-라이트 리팩터링

```javascript
function arraySet(array, idx, value) {
    const copy = array.slice();
    copy[idx] = value;
    return copy;
}

function push(array, elem) {
    const copy = array.slice();
    copy.push(elem);
    return copy;
}

function drop_last(array) {
    const copy = array.slice();
    copy.pop();
    return copy;
}

function drop_first(array) {
    const copy = array.slice();
    copy.shift();
    return copy;
}
```

위 네 개 함수들은 서로 비슷한 모양을 하고 있으며 각 함수의 모양이 함수의 본문, 앞부분, 뒷부분으로 잘 나누어져 있는 걸 확인할 수 있다. 이 함수들을 리팩터링 해보자.

```javascript
function arraySet(array, idx, value) {
    return withArrayCopy(array, function (copy) {
        copy[idx] = value;
    });
}

function withArrayCopy(array, modify) {
    const copy = array.slice();
    modify(copy);
    return copy;
}
```

배열을 복사, 변경, 리턴하는 함수를 따로 빼내었고 변경하는 부분을 인자 `modify`로 받아서 처리했다. 카피-온-라이트 패턴에 대한 동작이 표준화 되었으며 이 함수는 재사용성이 아주 높다.

## 함수를 리턴하는 함수

챕터 10에서 `withLogging` 함수를 만들었다. 이 함수는 에러 로그를 남기기 위한 함수로 중복된 `try/catch`문을 없앨 수 있었다. 하지만 여전히 모든 코드를 `withLogging` 함수로 감싸야 한다는 문제가 있다.

```javascript
withLogging(function () {
    // 중복
    saveUserData(user);
}); // 중복

withLogging(function () {
    // 중복
    fetchProduct(productID);
}); // 중복
```

에러 로그가 필요한 모든 부분을 위와 같은 식으로 감쌌을 경우 결국 인자로 전달되는 함수가 호출하는 함수를 제외하고는 중복이 생길 수밖에 없다. 결국 이 방법에는 두 가지 문제가 있다.

-   어떤 부분에 로그를 남기는 것을 까먹을 수 있다.
-   모든 코드를 `withLogging`함수로 감싸야한다.(중복이 생긴다.)

이 문제를 해결하기 위해 코드를 다시 정리해보자.

**원래 코드**

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

원래 코드에서 `try` 블럭에 있는 함수는 로그를 남기지 않는 함수 이므로 이름에 명확하게 남겨주자.

**이름을 명확하게 바꿈**

```javascript
try {
    saveUserDataNoLogging(user);
} catch (error) {
    logToSnapErrors(error);
}

try {
    fetchProductNoLogging(productId);
} catch (error) {
    logToSnapErrors(error);
}
```

그리고 각 `try/catch`문을 함수로 감싸고 이 함수는 로그를 남길 수 있으니 이름을 붙여준다.

**로그를 남기는 함수**

```javascript
function saveUserDataWithLogging(user) {
    try {
        saveUserDataNoLogging(user);
    } catch (error) {
        logToSnapErrors(error);
    }
}

function fetchProductWithLogging(productId) {
    try {
        fetchProductNoLogging(productId);
    } catch (error) {
        logToSnapErrors(error);
    }
}
```

이렇게 해서 기존에 로그를 남기지 않던 함수는 수정하지 않고 로그를 로그를 남길 수 있는 함수를 새로 만들었다. 하지만 여전히 중복이 존재한다. 여기서 함수 본문을 콜백으로 바꾸기 리팩터링을 적용해보자.

**함수 본문을 콜백으로 바꾸기**

```javascript
function wrapLogging(f) {
    return function (arg) {
        try {
            f(arg);
        } catch (error) {
            logToSnapErrors(error);
        }
    };
}

const saveUserDataWithLogging = wrapLogging(saveUserDataNoLogging);
```

`wrapLogging`함수는 인자로 함수 `f`를 받고 `try/catch`로 감싸서 함수로 리턴한다. 앞서 **로그를 남기는 함수**를 만들었을 때 처럼 중복이 생기지 않고 여러 함수에 로그를 남기는 버전으로 쉽게 만들 수 있게 된 것이다.

```javascript
const saveUserDataWithLogging = wrapLogging(saveUserDataNoLogging);
const fetchProductWithLogging = wrapLogging(fetchProductNoLogging);
// ... 얼마든지 만들 수 있다.
```
