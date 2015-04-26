"use strict";

module.exports = Essay;
function Essay() {
}

Essay.prototype.add = function (child, id, scope) {
    var components = scope.components;
    if (id === "items:option") {
        components.item.value = child.value;
    } else if (id === "this") {
        components.items.options = ["Guten Tag, Welt!", "Auf Widerseh'n, Welt!"];
        window.addEventListener("keypress", this);
        window.addEventListener("keyup", this);
        window.addEventListener("keydown", this);
    }
};

Essay.prototype.handleEvent = function (event) {
    this.scope.components.items.handleEvent(event);
};
