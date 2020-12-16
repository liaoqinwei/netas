"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
function clone(obj, deep) {
    if (deep === void 0) { deep = false; }
    var newObj = obj instanceof Array ? [] : Object.create(null), item, key;
    for (key in obj) {
        item = obj[key];
        // Array / Object
        if (typeof item === 'object' && item != null && deep)
            item = clone(item, deep);
        // Symbol / Date / RegExp
        if (typeof item === 'symbol')
            // @ts-ignore
            item = Symbol(item.description);
        else if (item instanceof Date)
            item = new Date(item.getTime());
        else if (item instanceof RegExp)
            item = new RegExp(item.source, item.flags);
        newObj[key] = item;
    }
    return newObj;
}
exports.clone = clone;
