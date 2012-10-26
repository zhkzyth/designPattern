var blogModule = (function (my) {
    var _private = my._private = my._private || {},

        _seal = my._seal = my._seal || function () {
            delete my._private;
            delete my._seal;
            delete my._unseal;

        },

        _unseal = my._unseal = my._unseal || function () {
            my._private = _private;
            my._seal = _seal;
            my._unseal = _unseal;
        };

    return my;
} (blogModule || {}));