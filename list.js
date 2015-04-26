"use strict";

module.exports = List;
function List() {
    this._value = null;
    this._index = null;
    this._activeIteration = null;
    this._selectedIteration = null;
}

Object.defineProperty(List.prototype, "options", {
    get: function () {
        return this.scope.components.options.value;
    },
    set: function (options) {
        this.scope.components.options.value = options;
        this.value = null;
    }
});

Object.defineProperty(List.prototype, "value", {
    get: function () {
        return this._value;
    },
    set: function (value) {
        if (value === this._value) {
            return;
        }
        var index;
        if (value == null) {
            index = null;
        } else {
            index = this.options.indexOf(value);
            if (index < 0) {
                throw new Error("Can't select a value that is not an option");
            }
        }
        this._value = value;
        this.index = index;
    }
});

Object.defineProperty(List.prototype, "index", {
    get: function () {
        return this._index;
    },
    set: function (index) {
        if (index === this._index) {
            return;
        }
        if (this._activeIteration) {
            this._activeIteration.scope.components.option.actualNode.classList.remove("list-item-active");
        }
        var value;
        if (index == null) {
            value = null;
        } else {
            this._activeIteration = this.scope.components.options.iterations[index];
            this._activeIteration.scope.components.option.actualNode.classList.add("list-item-active");
            value = this._activeIteration.value;
        }
        this._index = index;
        this.value = value;
    }
});

List.prototype.handleEvent = function handleEvent(event) {
    var key = event.key || String.fromCharCode(event.charCode);
    var keyCode = event.keyCode || event.charCode;
    if (event.type === "keypress") {
        if (key === "j") {
            return this.handleDownCommand();
        } else if (key === "k") {
            return this.handleUpCommand();
        }
    } else if (event.type === "keydown") {
        if (keyCode === 27) {
            this.value = null;
        } else if (keyCode === 38) {
            return this.handleUpCommand();
        } else if (keyCode === 40) {
            return this.handleDownCommand();
        }
    }
};

List.prototype.handleUpCommand = function handleUpCommand() {
    var index;
    if (this._index == null) {
        index = 0;
    } else {
        index = Math.max(this._index - 1, 0);
    }
    this.index = index;
};

List.prototype.handleDownCommand = function handleDownCommand() {
    var index;
    if (this._index == null) {
        index = 0;
    } else {
        index = Math.min(this._index + 1, this.scope.components.options.value.length - 1);
    }
    this.index = index;
};
