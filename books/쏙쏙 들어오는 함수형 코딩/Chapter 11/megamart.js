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

function setPriceByName(cart, name, price) {
    const item = cart[name];
    const newItem = objectSet(item, "price", price);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setShippingByName(cart, name, ship) {
    const item = cart[name];
    const newItem = objectSet(item, "shipping", ship);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setQuantityByName(cart, name, quant) {
    const item = cart[name];
    const newItem = objectSet(item, "quantity", ship);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setTaxByName(cart, name, tax) {
    const item = cart[name];
    const newItem = objectSet(item, "tax", tax);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

function setFieldByName(cart, name, field, value) {
    if (!validItemFieelds.includes(field)) {
        throw "Not a vaild item field: " + field;
    }
    const item = cart[name];
    const newItem = objectSet(item, field, value);
    const newCart = objectSet(cart, name, newItem);
    return newCart;
}

cart = setFieldByName(cart, "shoe", "price", 13);
cart = setFieldByName(cart, "shoe", "quantity", 3);
cart = setFieldByName(cart, "shoe", "shipping", 0);
cart = setFieldByName(cart, "shoe", "tax", 2.34);

function objectSet(object, key, value) {
    const copy = Object.assign({}, object);
    copy[key] = value;
    return copy;
}

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

function withLogging() {
    try {
        saveUserData(user);
    } catch (error) {
        logToSnapErrors(error);
    }
}
