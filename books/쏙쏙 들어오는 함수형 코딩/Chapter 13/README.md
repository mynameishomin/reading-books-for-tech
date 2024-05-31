# 함수형 도구 체이닝


## 우수 고객 중 가장 비싼 구매를 알려주세요.

고객 커뮤니케이션팀에게 데이터 요청이 들어왔다.

> 우수 고객 중 가장 비싼 구매를 알려주세요.

이렇게 복잡한 요청의 경우 함수형 도구 하나로만 작업할 수는 없고 여러 단계로 엮은 `체인`으로 복합적인 계산을 통해 해결할 수 있다.

아래 단계처럼 나누고 순서대로 실행하면 된다.

1. 우수 고객(3개 이상 구매)를 거른다 `filter`.
2. 우수 고객을 가장 비싼 구매로 바꾼다 `map`.   
    이때 `reduce`를 사용해서 가장 비싼 구매를 찾는다.

```javascript
function biggestPurchasesBestCustomers(custommers) {
    // 1단계 우수 고객 뽑기 filter 사용
    const bestCustomers = filter(customers, function(customer) {
        return customer.purchases.length >= 3;
    });

    // 2단계 가잔 비싼 구매로 바꾸기 map 사용
    const biggestPurchases = map(bestCustomers, function(customer) {
        // 가장 비싼 구매 찾기 reduce 사용
        return reduce(customer.purchases, {total: 0}, function(biggestSoFar, purchase) {
            if(biggestSoFar.total > purchase.total) {
                return biggestSoFar;
            } else {
                return purchase;
            }
        });
    });

    return biggestPurchases;
}
```

위 코드는 잘 동작하지만 `map`을 사용하는 부분에서 콜백과 리턴이 중첩되어 함수가 너무 커졌다. 멈추지 말고 개선해보자.   

우선 중첩된 콜백은 읽기 힘들기 때문에 가장 비싼 구매를 찾는 코드를 콜백으로 분리하자.

```javascript
maxKey(customer.purchases, {total: 0}, function(purchase) {
    return purchase.total;
});

function maxKey(array, init, f) {
    return reduce(array, init, function(biggestSoFar, element) {
        if(f(biggestSoFar) > f(element)) {
            return biggestSoFar;
        } else {
            return element;
        }
    });
}
```

`maxKey`함수는 가장 큰 값을 비교할 key를 함수로 지정할 수 있다. 위 코드에서는 `purchase.total` 값을 비교할 키로 지정했다. 이 `maxKey`함수를 적용해보자.

```javascript
function biggestPurchasesBestCustomers(custommers) {
    const bestCustomers = filter(customers, function(customer) {
        return customer.purchases.length >= 3;
    });

    // 2단계 가잔 비싼 구매로 바꾸기 map 사용
    const biggestPurchases = map(bestCustomers, function(customer) {
        // 가장 비싼 구매 찾기 reduce 사용
        return maxKey(customer.purchases, {total: 0}, function(purchase) {
            return purchase.total;
        });
    });

    return biggestPurchases;
}
```

`maxKey` 덕분에 `reduce`가 구체적으로 무엇을 하는지 명확해졌다. 그러나 여전히 중첩된 리턴이 있기 때문에 읽기 어렵다. 이를 해결하기 위한 두가지 방법을 살펴보자.

### 체인을 명확하게 만들기 1: 단계에 이름 붙이기

앞에서 만들었던 코드 각 단계의 고차 함수를 빼내어 이름을 붙일 수 있다.

```javascript
// 콜백, 리턴 중첩이 살아지고 코드가 간결하며 모여있어 의미를 이해하기 쉽다.
function biggestPurchasesBestCustomers(customers) {
    const bestCustomers = selectBestCustomers(customers);
    const biggestPurchases = getBiggestPurchases(bestCustomers);
    return biggestPurchases;
}

function selectBestCustomers(customers) {
    return filter(customers, function() {
        return customer.purchases.length >= 3;
    });
}

function getBiggestPurchases(customers) {
    return map(customers, getBiggestPurchase);
}

function getBiggestPurchase(customer) {
    return maxKey(customer.purchases, {total: 0}, function(purchase) {
        return purchase.total;
    });
}
```

각 단계에 이름을 붙여서 훨씬 명확해졌으며 빼낸 함수가 어떤 역할을 하는지 알아보기도 쉽다. 그러나 여전히 콜백 함수는 인라인으로 사용하고 있다. 인라인으로 정의된 콜백은 재사용이 불가능하다! 이를 해결하기 위해 두 번째 방법을 살펴보자.

### 체인을 명확하게 만들기 2: 콜백에 이름 붙이기

아래 코드는 **체인을 명확하게 만들기 1: 단계에 이름 붙이기**에서 수정했던 코드를 다시 전으로 돌리고 **콜백에 이름 붙이기**를 적용한 코드다.

```javascript
function biggestPurchasesBestCustomers(customers) {
    const bestCustomers = filter(customers, isGoodCustomer);
    const biggestPurchases = map(bestCustomers, getBiggestPurchase);
    return biggestPurchases;
}

function isGoodCustomer(customer) {
    return customer.purchases.length >= 3;
}

function getBiggestPurchase(customer) {
    return maxKey(customer.purchases, {total: 0}, getPurchaseTotal);
}

function getPurchaseTotal(purchase) {
    return purchase.total;
}
```

**단계에 이름 붙이기**와는 다르게 이번엔 콜백에 이름을 붙여서 재사용할 수 있는 함수를 만들었다. 위에서 살펴본 두 가지 방법을 서로 비교해보자.

### 체인을 명확하게 만들기 3: 두 방법을 비교

일반적으로 두 번째 방법이 더 명확하고 재사용하기에도 더 좋다. 또한 콜백 단계가 중첩되는 것도 막을 수 있다. 물론 함수형 프로그래머라면 두 가지 방법을 모두 시대해서 어떤 방법이 더 좋은지 코드를 비교하고 결정해야 한다.

## 반복문을 함수형 도구로 리팩터링하기

지금까지는 새로운 요구 사항을 처리하는 코드를 함수형 도구로 만드는 것이었다. 하지만 어떤 경우 이미 있는 반복문을 리팩터링해야 할 수도 있다. 이때는 어떻게 해야 할까?

**전략 1: 이해하고 다시 만들기**   
반복문이 어떤 일을 하는지 파악하고 그 구현을 다 잊어버리는 것이다. 그리고 지금까지 배운 내용을 생각하며 처음부터 다시 만드는 것이다.   

**전략 2: 단서를 찾아 리팩터링**   
이미 있는 코드를 이해할 수 없는 경우 반복문 하나를 선택해서 조금씩 함수형 도구 체인으로 바꿔나가면 된다.

아래 예제를 보자

```javascript
const answer = [];
const window = 5;

for(let i = 0; i < array.length; i++) {
    let sum = 0;
    let count = 0;

    for(let w = 0; w < window; w++) {
        const idx = i + w;
        if(idx < array.length>) {
            sum += array[idx];
            count += 1;
        }
    }
    answer.push(sum/count);
}
```

이런 코드를 전부 이해하지 못하더라도 리팩터링 할 수 있는 코드를 선택할 수 있는 단서는 찾을 수 있다.

우선 바깥쪽 반복문은 원래 배열 크기만큼 새로운 배열을 만드는 것을 볼 수 있다. 여기서는 `map`을 사용할 수 있겠다.

안쪽 반복문은 반복문을 돌면서 특정 값을 만들고 있기 때문에 `reduce`를 사용할 수 있겠다.

안쪽 반복문 부터 리팩터링 해보자.

### 팁 1: 데이터 만들기

일반적으로 반복문을 쓸 때는 인덱스 i 값을 사용한다. 만약 0부터 10까지 세는 반복문 코드에서 인덱스 i 값을 배열로 만든다면 여기에서도 함수형 도구를 사용할 수 있다. 우선 인덱스를 배열 데이터로 만들어보자.

```javascript
const answer = [];
const window = 5;

for(let i = 0; i < array.length; i++) {
    let sum = 0;
    let count = 0;

    // 인덱스를 하위 배열로 만든다.
    const subArray = array.slice(i, i + window);
    // 하위 배열을 반복문으로 돈다.
    for(let w = 0; w < subArray.length; w++) {
        sum += subArray[w];
        count += 1;
    }

    answer.push(sum/count);
}
```

### 팁 2: 한 번에 전체 배열을 조작하기

이제 안쪽 반복문은 `subArray`배열 전체를 돌고 있기 때문에 함수형 도구를 쓸 수 있다. 우선 안쪽 반복문이 무엇을 하는 지 확인해보자.   

`subArray`배열을 돌면서 모든 값을 더하고 더한 값을 갯수로 나누고 있다. 평균을 구하는 것이다. `reduce`를 사용한 `average`함수를 만들어서 사용해보자.

```javascript
const answer = [];
const window = 5;

for(let i = 0; i < array.length; i++) {
    const subArray = array.slice(i, i + window);
    answer.push(average(subArray));
}

function average(numbers) {
    return reduce(numbers, 0, plus) / numbers.length;
}

function plus(a, b) {
    return a + b;
}
```

이렇게 반복문 하나를 없앴다! 나머지 반복문 하나도 배열 전체를 돌면서 원래 배열과 똑같은 길이를 가진 배열을 만들고 있기 떄문에 `map`을 쓰면 될 것 같다. 하지만 반복문 안쪽에서 배열 인덱스를 사용하고 있기 떄문에 당장은 쓸 수 없을 것 같다. 어떻게 해야할지 알아보자.

### 팁 3: 작은 단계로 나누기

먼저 원래와 똑같이 인덱스를 쓸 수 있게 인덱스를 배열 데이터로 만드는 일이 필요하다(팁 1). 그리고 만든 배열에 함수형 도구를 써보자(팁 2).

```javascript
const indices = [];
for(let i = 0; i < array.length; i++) {
    indices.push(i);
}

const window = 5;
const answer = map(indices, function(i) {
    const subArray = array.slice(i, i + window);
    return average(subArray);
});
```

위 코드에서는 인덱스를 `indices` 배열로 만드는 단계가 하나 추가되었다. 자세히 보니 `map`에 넘기는 콜백이 두 가지 일을 하는 것 같다. 이걸 다시 작은 단계로 나눠보자.

```javascript
function range(start, end) {
    const ret = [];
    for(let i = start; i < end; i++) {
        ret.push(i);
    }
    return ret;
}

const indices = range(0, array,length);

const window = 5;
const windows = map(indices, function(i) {
    return array.slice(i, i + window);
});
const answer = map(windows, average);
```

인덱스를 배열로 만드는 유용한 함수 `range`를 만들었다. 이제 모든 코드는 한가지 일만 하고 있고 함수형 도구를 사용해서 명확한 일을 하고있다.


## 다양한 함수형 도구

위에서 만든 `range`함수는 함수형 프로그래머가 잘 쓰는 함수형 도구 중 하나다. 이것 말고도 다양한 함수형 도구가 있다.

### pluck()

```javascript
function pluck(array, field) {
    return map(array, function(object) {
        return object[field]
    });
}
```

배열에 있는 값 중 특정 필드를 가져오기 위해 매번 콜백을 작성하지 않고 `pluck`을 사용할 수 있다.

### concat()

```javascript
function concat(arrays) {
    const ret = [];
    forEach(arrays, function(array) {
        forEach(array, function(element) {
            ret.push(element);
        });
    });
    return ret;
}
```

`concat`은 중첩된 배열을 한 단계로 만들어준다.

### freQuenciesBy()와 groupBy()

```javascript
function frequenciesBy(array, f) {
    const ret = {};
    forEach(array, function() {
        const key = f(element);
        if(ret[key]) {
            ret[key] += 1;
        } else ret[key] = 1;
    });
    return ret;
}

function groupBy(array, f) {
    const ret = {};
    forEach(array, function(element) {
        const key = f(element);
        if(ret[key]) {
            ret[key].push(element);
        } else {
            ret[key] = [element];
        }
    });
    return ret;
}
```

`frequenciesBy`함수는 콜백으로 받은 함수가 리턴하는 결과에 따라 요소 개수를 세고 `groupBy`함수는 콜백으로 받은 함수가 리턴하는 결과에 따라 요소를 그룹으로 묶는다.


## 메서드 연산자로 정렬하기

함수형 도구를 체이닝할 떄 코드 정렬을 어떻게 할 것인지 고민될 수 있다. 이때 점 연산자를 써서 수직으로 정렬하는 것은 보기에도 좋고 그렇게 연결되어 있다는 것은 함수형 도구를 잘 쓰고 있다는 뜻이다. 아래는 정렬 예시 코드이다.

```javascript
// ES6 
function movingAverage(numbers) {
    return numbers
            .map((_e, i) => numbers.slice(i, i + window))
            .map(average);
}

// Lodash
function movingAverage(numbers) {
    return _.chain(numbers)
            .map(function(_e, i) {return numbers.slice(i, i + window)})
            .map(average)
            .value();
}
```




