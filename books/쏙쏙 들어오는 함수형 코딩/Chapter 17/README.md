# 타임라인 조율하기

이전 챕터에서 자원을 안전하게 공유하기 위해 큐를 만들고 재사용 가능한 함수로 만들면서 개선했다. 그런데 문제가 하나 생겼다.

## 버그가 있습니다!

장바구니에 큐를 적용해서 열심히 기능을 만들어 놨는데 속도를 개선해달라는 요청 때문에 코드를 수정했다. 그러자 새로운 버그가 생겼다.

이번에는 제품을 하나만 추가해도 잘못된 장바구니 금액이 표시된다.

```javascript
// 속도를 개선한 코드
function add_item_to_cart(item) {
    cart = add_item(cart, item);
    update_total_queue(cart);
}

function calc_cart_total(cart, callback) {
    let total = 0;
    cost_ajax(cart, function (cost) {
        total += cost;
        // 이 부분에서 괄호가 닫힌다.
    });

    shipping_ajax(cart, function (shipping) {
        total += shipping;
        callback(total);
    });
}

function calc_cart_worker(cart, done) {
    calc_cart_total(cart, function (total) {
        update_total_dom(total);
        done(total);
    });
}

const update_total_queue = DroppingQueue(1, calc_cart_worker);
```

위 코드에서 `cost_ajax`함수를 호출하는 부분의 괄호가 옮겨졌다. 이전에는 `cost_ajax`함수의 콜백 안에 `shipping_ajax`가 있었다.  
때문에 `cost_ajax`함수와 `shipping_ajax`함수가 거의 동시에 실행된다. 여기서 버그가 생기는 것
