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
var HeroDetailsPanel = (function (_super) {
    __extends(HeroDetailsPanel, _super);
    function HeroDetailsPanel() {
        var _this = _super.call(this) || this;
        var bj = new engine.Bitmap();
        bj.x = 0;
        bj.y = 0;
        bj.texture = "heroDetails.jpg";
        _this.addChild(bj);
        var myPlayer = new engine.Bitmap();
        myPlayer.texture = "d1.png";
        myPlayer.x = 150;
        myPlayer.y = 200;
        myPlayer.scaleX = 2;
        myPlayer.scaleY = 2;
        _this.addChild(myPlayer);
        _this.hero = User.getInstance().heros;
        _this.equipment = _this.hero[0].equipments;
        _this.desc = new engine.TextField();
        _this.desc.x = 108;
        _this.desc.y = 400;
        _this.addChild(_this.desc);
        _this.fightPower = new engine.TextField();
        _this.fightPower.x = 108;
        _this.fightPower.y = 0;
        _this.addChild(_this.fightPower);
        _this.imgChild = new Array();
        _this.iconInit();
        _this.closeButton = new Button("guan.png");
        _this.closeButton.x = 300;
        _this.closeButton.y = 0;
        if (_this.onClose == null) {
            var x = function () {
                _this.desc.text = "";
                UiManager.getCurrentUiManager().removePanel();
            };
            _this.onClose = x;
        }
        _this.closeButton.addEventListener("onclick", _this.onClose, _this.closeButton, false);
        _this.addChild(_this.closeButton);
        _this.touchEnabled = true;
        return _this;
    }
    HeroDetailsPanel.prototype.iconInit = function () {
        for (var _i = 0, _a = this.imgChild; _i < _a.length; _i++) {
            var k = _a[_i];
            this.removeChild(k);
        }
        for (var i = 0; i < this.equipment.length; i++) {
            var img = this.equipment[i].img;
            img.x = 0;
            img.y = 120 * i;
            this.addChild(img);
            this.imgChild.push(img);
        }
        this.fightPower.text = "FightPower: " + User.getInstance().getFightPower().toString();
    };
    HeroDetailsPanel.prototype.setDesc = function (tf) {
        this.desc.text = tf.text;
    };
    return HeroDetailsPanel;
}(engine.DisplayObjectContainer));
