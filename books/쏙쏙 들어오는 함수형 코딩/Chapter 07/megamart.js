const shopping_cart = [];
let shopping_cart_total = 0;

function add_item_to_cart(name, price) {
    const item = make_cart_item(name, price);
    shopping_cart = add_item(shopping_cart, item);
    const total = calc_total(cart);
    set_cart_total_dom(total);
    update_shipping_icons(cart);
    update_tax_dom(total);
    shopping_cart = black_friday_promotion_safe(cart_copy);
}

function black_friday_promotion_safe() {
    const cart_copy = deepCopy(cart);
    black_friday_promotion(cart_copy);
    return deepCopy(cart_copy);
}

function update_shipping_icons(cart) {
    const buy_buttons = get_buy_buttons_dom();
    for (let i = 0; i < buy_buttons.length; i++) {
        const button = buy_buttons[i];
        const item = button.item;
        const new_cart = add_item(cart, item);
        if (gets_free_shipping(new_cart)) {
            button.show_free_shipping_icon();
        } else {
            button.hide_free_shipping_icon();
        }
    }
}

function update_tax_dom(total) {
    set_tax_dom(calc_tax(total));
}

function make_cart_item(name, price) {
    return {
        name: name,
        price: price,
    };
}

function add_item(cart, item) {
    return add_element_last(cart, item);
}

function add_element_last(array, elem) {
    const new_array = array.slice();
    new_array.push(elem);
    return new_array;
}

function calc_total(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price;
    }
    return total;
}

function gets_free_shipping(cart) {
    return calc_total(cart) >= 20;
}

function calc_tax(amount) {
    return amount * 0.1;
}

function remove_item_by_name(cart, name) {
    const new_cart = cart.slice();
    const idx = null;
    for (let i = 0; i < new_cart.length; i++) {
        if (new_cart[i].name === name) {
            idx = i;
        }
    }

    if (idx !== null) {
        new_cart.splice(idx, 1);
    }

    return new_cart;
}

function drop_first(array) {
    array.shift();
}

function deepCopy(thing) {
    if (Array.isArray(thing)) {
        const copy = [];
        for (let i = 0; i < thing.length; i++) {
            copy.push(deepCopy(thing[i]));
        }
        return copy;
    } else if (thing === null) {
        return null;
    } else if (typeof thing === "object") {
        const copy = {};
        const keys = Object.keys(thing);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            copy[key] = deepCopy(thing[key]);
        }
        return copy;
    } else {
        return thing;
    }
}
