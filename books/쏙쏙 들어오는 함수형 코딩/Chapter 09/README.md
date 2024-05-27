# 계층형 설계 2

계층형 설계 패턴 네 가지 중

-   직접 구현
-   추상화 벽
-   작은 인터페이스
-   편리한 계층

직접 구현은 앞에서 확인했다. 남은 패턴을 확인해보자

## 패턴2 추상화 벽

추상화 벽은 세부 구현을 감춘 함수로 이루어진 계층이다. 추상화 벽에 있는 함수를 사용할 때는 구현을 전혀 몰라도 함수를 사용할 수 있다. 이 추상화 벽이 해결하는 문제중 하나는 팀 간 책임을 명확하게 나눌 수 있다는 것이다.

|           |                       |               |                    |            |                  |
| --------- | --------------------- | ------------- | ------------------ | ---------- | ---------------- |
| 마케팅 팀 | gets_free_shipping()  | cartTax()     |                    |            |                  |
| 추상화 벽 | remove_item_by_name() | calc_total()  | isInCart()         | add_item() | setPriceByName() |
| 개발 팀   | slice()               | indexOfItem() | add_element_last() | arraySet() |

개발 팀에서 추상화 벽을 만들면 마케팅 팀은 반복문이나 배열을 다루지 않고 추상화 벽에 있는 함수를 가져다 사용할 수 있으며 개발 팀은 마케팅 팀이 추상화 벽에 있는 함수를 어떻게 쓰는지 신경 쓰지 않고 일 할 수 있다.

### 장바구니 데이터 구조 바꾸기

개발 팀에서 성능 개선을 위해 장바구니 데이터 구조를 배열에서 해시 맵으로 바꾸기로 했다.

```javascript
function add_item(cart, item) {
    return objectset(cart, item.name);
}

function calc_total(cart) {
    let total = 0;
    const names = Object.keys(cart);

    for (let i = 0; i < names.length; i++) {
        const item = cart[names[i]];
        total += item.price;
    }

    return total;
}

function setPriceByName(cart, name, price) {
    if(isInCart(cart, name)) {
        const item = cart[name];
        const copy = setPrice(item, price);
        return objectSet(cart, name, copy);
    } else {
        const item = make_item(name, price);
        return opjectSet(cart, name, item);
    }
}

function remove_item_by_name(cart, name) {
    return objectDelete(cart, name);
}

function isInCart(cart, name) {
    return cart.hasOwnProperty(name);
}
```

장바구니 데이터 구조를 배열에서 객체로 바꾸어 반복문을 사용할 필요가 없고 더 작고 깔끔하게 만들었다. 이때 데이터 구조를 바꾸기 위해 바꾼 함수들은 모두 추상화 벽에 들어있는 것으로 마케팅 팀이나 다른 팀은 원래 쓰고 있던 코드를 고치지 않고 그대로 써도 아무런 영향이 없다.

### 추상화 벽을 사용하기 좋은 경우

* **쉽게 구현을 바꾸기 위해**   
    프로토타입 구현이나 이후 바뀔 것으로 예상되는 코드를 쓸때, 임시로 데이터를 만들어서 처리해야 할 때 쓰기 좋다.

* **코드를 읽고 쓰기 쉽게 만들기 위해**   
    추상화벽을 사용해 구체적이고 세부적인 것을 감추면 다른 것에 신경쓰지 않고 쉽게 생산적인 코드를 만들 수 있다.

* **팀 간에 조율해야 할 것을 줄이기 위해**   
    이 예시에서 개발팀은 마케팅 팀에게 이야기하지 않고 코드를 고쳤다. 마케팅팀도 개발팀에게 확인할 필요 없이 쉽게 마케팅 코드를 만둘었다. 각 팀 간에 구체적인 내용을 서로 신경 쓰지 않고 빠르게 일 할 수 있다.   

## 패턴3 작은 인터페이스

마케팅 팀에서 시계 할인을 하려고 한다. 장바구니 제품 금액 총합이 100달러를 넘고 장바구니에 시계가 있으면 시계를 10% 할인해줘야 한다. 할인 받을 수 있는 사람을 결정하는 코드가 필요하다.

### 시계 할인 마케팅 코드를 구현할 위치
시계 할인 마케팅 코드를 구현할 위치는 두 가지가 있다.

* **추상화 벽에 만들기**   
    직접 장바구니에 접근할 수 있지만 같은 계층에 있는 함수를 사용할 수 없다.
    ```javascript
    function getsWatchDiscount(cart) {
        let total = 0;
        const names = Object.keys(cart);
        for(let i = 0; i < names.length; i++) {
            const item = cart[names[i]];
            total += item.price;
        }

        return total > 100 && cart.hasOwnProperty("watch");
    }
    ```

* **추상화 벽 위에 만들기**   
    장바구니에 접근할 수 없기 떄문에 추상화 벽에 있는 함수를 사용해야 한다.
    ```javascript
    function getsWatchDiscount(cart) {
        const total = calcTotal(cart);
        const hasWatch = isInCart("watch");
        return total > 100 && hasWatch;
    }
    ```

결론은 추상화 벽 위에 만드는 것이 더 좋다. 추상화 벽에 만들면 반복문을 사용하고 시스템 하위 계층 코드가 늘어나기 때문이다. 또한 이 코드는 마케팅을 위한 코드이기 때문에 마케팀 팀이 관리해야하고 마케팅 팀은 추상화 벽을 신경쓰지 않아야 하기 떄문에 추상화 벽에 만드는 것보다 그 위에 만든는 것이 더 좋은 것이다.

이처럼 새로운 기능을 만들 때 하위 계층에 추가하거나 고치는 것보다 상위 계층에 만드는 것을 작은 인터페이스 패턴이라고 한다.