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
var DialogPanel = (function (_super) {
    __extends(DialogPanel, _super);
    function DialogPanel() {
        var _this = _super.call(this) || this;
        var bj = new engine.Bitmap();
        bj.texture = "dialog.jpg";
        bj.x = 0;
        bj.y = 0;
        _this.addChild(bj);
        _this.dialog = new engine.TextField();
        // this.dialog.size=20;
        _this.dialog.x = 0;
        _this.dialog.y = 0;
        _this.addChild(_this.dialog);
        _this.finishButton = new Button("buttonFinish.png");
        _this.finishButton.x = 0;
        _this.finishButton.y = 200;
        if (_this.onButtonClick == null) {
            var x = function () {
                //此处有几个任务完成，接受就需要点击几次按钮，如需优化，请为每一个任务添加一个按钮，同时删去break
                for (var i = 0; i < _this.taskList.length; i++) {
                    if (_this.taskList[i].getStatus() == Task.CAN_SUBMIT && _this.taskList[i].getToID().match(_this.currentNPCID)) {
                        _this.taskList[i].onSubmit();
                        break;
                    }
                    else if (_this.taskList[i].getStatus() == Task.ACCEPTABLE && _this.taskList[i].getFromID().match(_this.currentNPCID)) {
                        _this.taskList[i].onAccept();
                        break;
                    }
                }
                GameScene.getCurrentScene().getCommandList().pass();
            };
            _this.onButtonClick = x;
        }
        if (_this.onClose == null) {
            var x = function () {
                GameScene.getCurrentScene().getCommandList().pass();
            };
            _this.onClose = x;
        }
        _this.finishButton.addEventListener("onclick", _this.onButtonClick, _this.finishButton, false);
        _this.addChild(_this.finishButton);
        _this.touchEnabled = true;
        _this.closeButton = new Button("guan.png");
        _this.closeButton.x = 300;
        _this.closeButton.y = 0;
        _this.closeButton.addEventListener("onclick", _this.onClose, _this.closeButton, false);
        _this.addChild(_this.closeButton);
        return _this;
    }
    DialogPanel.prototype.addTask = function (taskList, id) {
        this.taskList = taskList;
        this.refreash(id);
    };
    DialogPanel.prototype.refreash = function (id) {
        this.dialog.text = "";
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getStatus() != Task.UNACCEPTALBE) {
                this.dialog.text += this.taskList[i].getID() + "\n" + this.taskList[i].toString() + "\n";
            }
        }
        this.currentNPCID = id;
    };
    return DialogPanel;
}(engine.DisplayObjectContainer));
