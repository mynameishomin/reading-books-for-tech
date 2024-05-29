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

챕터 10에서 `withLogging` 함수를 만들었다.
