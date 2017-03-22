var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var monsterJason = [
    { id: "monster.png", health: 5 }
];
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster(id, health) {
        var _this = _super.call(this) || this;
        _this.id = id;
        _this.health = health;
        _this.healthMax = health;
        _this.bitmap = new engine.Bitmap();
        _this.bitmap.texture = id;
        _this.addChild(_this.bitmap);
        _this.touchEnabled = true;
        return _this;
    }
    Monster.prototype.healthChange = function (change) {
        this.health += change;
        if (this.health == 0) {
            GameScene.getCurrentScene().killMonster(this);
            GameScene.getCurrentScene().getCommandList().pass();
        }
    };
    Monster.prototype.getId = function () {
        return this.id;
    };
    Monster.prototype.getHealth = function () {
        return this.health;
    };
    return Monster;
}(engine.DisplayObjectContainer));
var MonsterFactory = (function () {
    function MonsterFactory() {
    }
    MonsterFactory.createOneMonster = function (id) {
        for (var i = 0; i < monsterJason.length; i++) {
            if (monsterJason[i].id.match(id)) {
                return new Monster(monsterJason[i].id, monsterJason[i].health);
            }
        }
    };
    return MonsterFactory;
}());
