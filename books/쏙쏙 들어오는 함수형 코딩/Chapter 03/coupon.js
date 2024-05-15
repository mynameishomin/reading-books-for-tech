function subCouponRank(subscriber) {
    if (subscriber.rec_count > 10) {
        return "best";
    } else {
        return "good";
    }
}

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

function emailsForSubscribers(subscribers, goods, bests) {
    const emails = [];
    for (let i = 0; i < subscribers.length; i++) {
        const subscriber = subscribers[i];
        const email = emailForSubscriber(subscriber, goods, bests);
        emails.push(email);
    }
    return emails;
}

function sendIssue() {
    const coupons = fetchCouponsFromDB();
    const goodCoupons = selectCouponsByRank(coupons, "good");
    const bestCoupons = selectCouponsByRank(coupons, "best");
    const subscribers = fetchSubscribersFromDB();
    const emails = emailsForSubscribers(subscribers, goodCoupons, bestCoupons);
    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        emailSystem.send(email);
    }
}
