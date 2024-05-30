# 함수형 반복

함수형 프로그래밍에서 가장 강력하고 많이 쓰이는 추상 함수 `map`, `filter`, `reduce`에 대해 알아보자. 함수형 프로그래머는 반복문 대신 이 세 가지 함수가 모든 작업의 기반이 된다.

## 함수형 도구:map()

```javascript
function map(array, f) {
    const newArray = [];
    forEach(array, function (element) {
        newArray.push(element);
    });
    return newArray;
}
```

`map`함수는 X값이 있는 배열을 Y값이 있는 배열로 변환한다고 볼 수 있다. 이때 변환시켜주는 함수가 필요한데 이 함수는 X를 인자로 받고 Y를 리턴해야 한다. 이때 중요한 것은 `map`에 인자로 넘기는 함수가 계산이어야 `map`을 사용하는 코드도 게산이다. 만약 액션을 넘긴다면 당연히 그 액션이 퍼질 것이다.

## 함수형 도구: filter()

```javascript
function filter(array, f) {
    const newArray = [];
    forEach(array, function (element) {
        if (f(element)) {
            newArray.push(element);
        }
    });
    return newArray;
}
```

`filter`함수는 배열에서 일부 항목을 선택하는 함수다. 위에서 본 `map`과는 다르게 X값이 있는 배열에 `filter`를 적용해도 X값이 있는 배열이 나온다. 다만 조건에 맞는 요소만 남겨서 리턴하기 때문에 원본 배열에서 항목이 더 적어질 수 있다.

`filter`함수에 인자로 들어갈 인자 역시 함수인데 이 함수는 배열에 요소 X를 인자로 받고 불리언 타입 `true, false`를 리턴하는 함수여야 한다.

## 함수형 도구: reduce()

```javascript
function reduce(array, init, f) {
    let accum = init;
    forEach(array, function (element) {
        accum = f(accum, element);
    });
    return accum;
}
```

`reduce`함수는 배열을 돌면서 값을 누적하는 작업을 수행하는데 이때 **누적**이라는 것은 추상적인 것으로 더하기, 빼기, 문자열 합치기 등 여러 작업이 될 수 있다.

`reduce`에 인자로 전달된 함수는 초깃값과 현재 요소값을 기준으로 작업을 수행해서 새로운 값을 리턴하는데 이때 이 값이 다음 요소에서 초깃값 대신 사용된다. 즉 작업이 계속 누적된는 것이다.
