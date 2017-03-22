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
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(id) {
        var _this = _super.call(this) || this;
        _this.myButton = new engine.Bitmap();
        _this.myButton.texture = id;
        _this.addChild(_this.myButton);
        _this.touchEnabled = true;
        _this.touchEnabled = true;
        _this.id = id;
        return _this;
    }
    Button.prototype.getId = function () {
        return this.id;
    };
    return Button;
}(engine.DisplayObjectContainer));
