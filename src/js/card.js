define([], function() {
    var uniq = 0;

    var Card = function(attrs) {
        return _.extend({}, attrs, {
            max_health : attrs.health,
            id : uniq++
        });
    };

    return Card;
});