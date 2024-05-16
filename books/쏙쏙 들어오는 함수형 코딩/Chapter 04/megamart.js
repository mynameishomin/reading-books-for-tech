const shopping_cart = [];
let shopping_cart_total = 0;

function add_item_to_cart(name, price) {
    shopping_cart = add_item(shopping_cart, name, price);
    calc_cart_total();
}

function calc_cart_total() {
    shopping_cart_total = calc_total(shopping_cart);
    set_cart_total_dom();
    update_shipping_icons();
    update_tax_dom();
}

function update_shipping_icons() {
    const buy_buttons = get_buy_buttons_dom();
    for (let i = 0; i < buy_buttons.length; i++) {
        const button = buy_buttons[i];
        const item = button.item;
        if (gets_free_shipping(shopping_cart_total, item.price)) {
            button.show_free_shipping_icon();
        } else {
            button.hide_free_shipping_icon();
        }
    }
}

function update_tax_dom() {
    set_tax_dom(calc_tax(shopping_cart_total));
}

function add_item(cart, name, price) {
    const new_cart = cart.slice();
    new_cart.push({
        name: name,
        price: price,
    });
    return new_cart;
}

function calc_total(cart) {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        total += item.price;
    }
    return total;
}

function gets_free_shipping(total, item_price) {
    return item_price + total >= 20;
}

function calc_tax(amount) {
    return amount * 0.1;
}
