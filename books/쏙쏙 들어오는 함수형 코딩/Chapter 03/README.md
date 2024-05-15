# 액션과 계산, 데이터의 차이를 알기

이번 Chapter 03에서는 현실 세계의 문제를 통해 코드에서 액션과 계산, 데이터를 구분해내고, 일반적으로 코드에 액션이 너무 많은 반면에 계산은 거의 없는 이유를 알 수 있다.

## 액션과 계산, 데이터

함수형 프로그래밍에서는 액션과 계산, 데이터를 아래와 같이 구분한다.

| 액션                                   | 계산                                         | 데이터                                             |
| :------------------------------------- | :------------------------------------------- | :------------------------------------------------- |
| 실행 시점과 횟수에 의존                | 입력으로 출력을 계산                         | 이벤트에 대한 사실                                 |
| 부수 효과가 있는 함수로 부르기도 한다. | 순수 함수라고 부르기도 한다.                 |                                                    |
| 예) 이메일 보내기, 데이터베이스 읽기   | 최대값 찾기, 이메일 주소가 올바른지 확인하기 | 사용자가 입력한 이메일 주소, API로 받은 값 그 자체 |

## 일상 생활에 액션과 계산, 데이터를 적용하기

장보기를 예로 들어 장보기 과정을 나누면 아래와 같이 나눌 수 있다.

1. 냉장고 확인하기
2. 운전해서 상점으로 가기
3. 필요한 것 구입하기
4. 운전해서 집으로 오기

이렇게 나눈 과정 모두 액션으로 볼 수 있는데 사실 액션과 계산, 데이터는 이렇게 단순하지 않다.

### 냉장고 확인하기

냉장고를 확인하기는 언제 확인했냐에 따라 냉장고 안에 무엇이 들어있는 지 다를 수 있기 때문에 분명한 액션이지만, 냉장고를 확인했을 때 알 수 있는 내용물들은 데이터로 볼 수 있다.

### 운전해서 상점으로 가기

운전은 분명한 액션이지만, 이 역시 상점의 위치, 상점까지 가는 경로는 데이터로 볼 수 있다.

### 필요한 것 구입하기

구입 역시 액션이지만 이 경우 냉장고 확인하기에서 얻은 데이터를 갖고 여러 단계로 나눌 수 있다.

|        |                                |
| :----- | :----------------------------- |
| 데이터 | 현재 재고                      |
| 데이터 | 필요한 재고                    |
| 계산   | 필요한 재고에서 현재 재고 빼기 |
| 데이터 | 장보기 목록                    |
| 액션   | 목록에 있는 것 구입하기        |

이렇게 나누는 작업을 반복하면 액션과 계산, 데이터를 더 많이 찾을 수 있다. 예를 들면 냉장고 확인하기를 냉장실 확인하기, 냉동실 확인하기로 나눌 수도 있다. 이를 바탕으로 다음에서 함수형 사고를 적용해보자.

## 새로 만드는 코드에 함수형 사고 적용하기

아래는 쿠폰 구독 서비스 사용자의 이메일 데이터베이스와 쿠폰 데이터베이스다. 구독자를 늘리기 위해 친구 추천 10명을 하면 더 좋은 쿠폰을 보내주려고 한다.

**이메일 데이터베이스 테이블**

| email             | rec_count |
| :---------------- | :-------- |
| jong@coldmail.com | 2         |
| sam@pmail.co      | 16        |
| linda1989@oal.com | 1         |

**쿠폰 데이터베이스 테이블**

| coupon      | rank |
| :---------- | :--- |
| MAYDISCOUNT | good |
| 10PERCENT   | bad  |
| PROMOTION45 | best |

### 쿠폰 보내는 과정 그려보기

#### 1. 구독자 목록 조회하기

데이터베이스에서 구독자 목록을 조회하는 것은 액션, 조회한 목록 자체는 데이터이다.

#### 2. 쿠폰 목록 조회하기

마찬가지로 쿠폰 목록을 조회하는 것은 액션, 조회한 목록은 데이터이다.

#### 3. 보내야 할 이메일 목록 만들기

앞에서 얻은 데이터 구독자 목록, 쿠폰 목록을 가지고 어떤 이메일로 어떤 쿠폰을 보낼지 만드는 것은 계산이고 계산 결과로 나온 이메일 목록은 데이터이다.

#### 4. 이메일 전송하기

이메일 전송은 액션이고 앞에서 필요한 작업을 끝냈기 때문에 말 그대로 전송만 하면 된다.

### 이메일 목록 만들기 살펴보기

구독자 데이터, 쿠폰 데이터로 보내야 할 이메일 목록을 만드는 부분을 더 작은 계산으로 나눌 수 있다. 먼저 쿠폰 목록에서 `good` 쿠폰과, `bad` 쿠폰을 선택할 수 있고 구독자 데이터에서 `rec_count`를 기준으로 구독자가 받을 쿠폰 등급을 선택할 수 있다.  
이런 식으로 계산을 나누면 구현하기 쉬울 뿐만 아니라, 각 단계를 테스트 하기도 쉬워진다.

### 쿠폰 보내는 과정 구현하기

#### 구독자 데이터

구독자 데이터베이스에 있는 각 행은 javascript에서 객체로 표현할 수 있다.

```javascript
const subscriber = {
    email: "mynameishomin@gmail.com",
    rec_count: 16,
};
```

#### 쿠폰 등급

```javascript
const rank1 = "best";
const rank2 = "good";
```

#### 쿠폰 등급을 결정하는 함수

각 구독자에게 보낼 쿠폰 등급을 결정하는 것은 계산이며 함수로 구현할 수 있다. 다만 이때 만드는 함수는 계산 역할을 하므로 호출 시점, 횟수와 상관 없이 같은 값이 입력되면 항상 같은 값을 출력하는 순수 함수여야 한다.

```javascript
function subCouponRank(subscriber) {
    if (subscriber.rec_count > 10) {
        return "best";
    } else {
        return "good";
    }
}
```

#### 쿠폰 데이터

```javascript
const coupon = {
    code: "10PERCENT",
    rank: "bad",
};
```

#### 특정 등급의 쿠폰을 선택하는 함수

이것 역시 계산이며 함수로 구현해야 한다

```javascript
function selectCouponsByRank(coupons, rank) {
    const ret = [];
    for (let i = 0; i < coupons.length; i++) {
        const coupon = coupons[i];
        if (coupon.rank === rank) {
            ret.push(coupon.code);
        }
    }
    return ret;
}
```

#### 보낼 이메일

보낼 이메일 자체는 그저 데이터일 뿐이다.

```javascript
const message = {
    from: "newsletter@coupondog.co",
    to: "mynameishomin@gmail.com",
    subject: "Your weekly coupons inside",
    body: "Here are your coupons ...",
};
```

#### 구독자가 받을 이메일 계획

각 구독자에게보낼 이메일을 만드는 함수 역시 계산이며 이때 인자로 구독자, good 쿠폰 목록, bad 쿠폰 목록을 인자로 받아야하고 출력은 위에서 본 이메일 데이터가 되어야 한다.

```javascript
function emailForSubscriber(subscriber, goods, bests) {
    const rank = subCouponRank(subscriber);
    if (rank === "best") {
        return {
            from: "newsletter@coupondog.co",
            to: subscriber.email,
            subject: "Your best weekly coupons inside",
            body: "Here are the best coupons: " + bests.join(", "),
        };
    } else {
        return {
            from: "newsletter@coupondog.co",
            to: subscriber.email,
            subject: "Your good weekly coupons inside",
            body: "Here are the good coupons: " + goods.join(", "),
        };
    }
}
```

#### 보낼 이메일 준비하기

앞에서 이메일을 생성하는 계산을 만들었으니 전체 이메일 목록을 만드는 계산을 만들 수 있다.

```javascript
function emailsForSubscriber(subscribers, goods, bests) {
    const emails = [];
    for (let i = 0; i < subscribers.length; i++) {
        const subscriber = subscribers[i];
        const email = emailForSubscriber(subscriber, goods, bests);
        emails.push(email);
    }
    return emails;
}
```

#### 이메일 보내기

이메일 보내기는 액션이고 계산과 마찬가지로 함수로 구현한다. 때문에 함수만 보고 액션인지 계산인지 알아보기는 쉽지 않다.

```javascript
function sendIssue() {
    const coupons = fetchCouponsFromDB();
    const goodCoupons = selectCouponsByRank(coupons, "good");
    const bestCoupons = selectCouponsByRank(coupons, "best");
    const subscriber = fetchSubscribersFromDB();
    const emails = emailsForSubscribers(subscribers, goodCoupons, bestCoupons);
    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        emailSystem.send(email);
    }
}
```

이렇게 모든 기능을 코드로 구현했다. 액션은 단 한 개뿐이며 나머지는 모두 계산, 데이터이다. 그리고 이를 액션 하나로 묶었다. 이처럼 데이터, 계산, 액션 순서로 구현하는 것이 함수형 프로그래밍의 일반적인 구현 순서이다.

## 이미 있는 코드에 함수형 사고 적용하기

```javascript
function figuerPayout(affiliate) {
    const owed = affiliate.sales * affiliate.commisstion;
    if (owed > 100) {
        // 송금하는 액션
        sendPayout(affiliate.bank_code, owed);
    }
}

function affiliatePayout(affiliates) {
    for (let i = 0; i < affiliates.length; i++) {
        figuerPayout(affiliates[i]);
    }
}

function main(affiliates) {
    affiliatePayout(affiliates);
}
```

위 코드는 수수료를 보내기 위해 은행에 송금하는 액션을 구현한 코드이다. 이 코드를 만든 사람은 코드 내에 액션이 하나만 있고 나머지는 게산이므로 함수형 코드라고 이야기 하지만 이 코드는 함수형 코드라고 보기 어렵다.

먼저 `sendPayout` 함수가 액션이므로 이 함수를 호출하고 있는 `figuerPayout` 함수도 액션이 된다. 당연하게도 `figuerPayout`를 호출하면 `sendPayout`가 호출될 것이기 때문이다. 같은 이유로 `figuerPayout`를 호출하고 있는 `affiliatePayout`도 액션이며 `affiliatePayout`를 호출하고 있는 `main`도 액션이다. 코드 전체가 액션으로 물들었다!

## 다양한 형태의 액션

-   **함수 호출**  
    `alert("Hello, world!");`  
    alert 창이 뜨는 것도 액션이다.
-   **메서드 호출**  
    `console.log("Hello, world!");`  
    콘솔에 출력하는 것도 액션이다.
-   **생성자**  
    `new Date();`  
    날짜 객체를 생성할 때마다 시간에 따라 다른 값을 가지기 때문에 액션이다.
-   **표현식**  
    참조하는 값들이 공유되고 변경 가능한 변수라면 값을 읽는 시점에 값이 다를 수 있으므로 액션이다.
    ```javascript
    y;
    user.first_name;
    stack[0];
    ```
-   **상태**
    공유되는 값을 할당하거나 프로퍼티를 지우는 것은 다른 코드에 영향을 줄 수 있기 때문에 액션이다.
    ```javascript
    z = 3;
    delete user.first_name;
    ```

이 모든 것이 액션이며 얼마나 어떻게 부르는지에 따라 다른 결과를 낼 수 있으며 코드 전체로 퍼지기 쉽다.
