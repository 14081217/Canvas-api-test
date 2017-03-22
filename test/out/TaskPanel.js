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
var TaskPanel = (function (_super) {
    __extends(TaskPanel, _super);
    function TaskPanel() {
        var _this = _super.call(this) || this;
        _this.myPanel = new engine.Bitmap();
        _this.myPanel.texture = "dialog.jpg";
        _this.addChild(_this.myPanel);
        var taskService = TaskService.getInstance();
        taskService.addObserver(_this);
        taskService.getTaskByCustomRole(function (taskList) {
            _this.taskList = taskList;
        });
        _this.textField = new engine.TextField();
        // this.textField.size=20;
        for (var i = 0; i < _this.taskList.length; i++) {
            if (_this.taskList[i].getStatus() != Task.UNACCEPTALBE) {
                _this.textField.text += _this.taskList[i].getID() + "\n" + _this.taskList[i].toString() + "\n";
            }
        }
        _this.textField.x = 0;
        _this.textField.y = 0;
        _this.addChild(_this.textField);
        _this.closeButton = new Button("guan.png");
        _this.closeButton.x = 300;
        _this.closeButton.y = 0;
        _this.closeButton.addEventListener("onclick", _this.onButtonClick, _this.closeButton, false);
        _this.addChild(_this.closeButton);
        _this.touchEnabled = true;
        return _this;
    }
    TaskPanel.prototype.onChange = function (task) {
        this.textField.text = "";
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getStatus() != Task.UNACCEPTALBE) {
                this.textField.text += this.taskList[i].getID() + "\n" + this.taskList[i].toString() + "\n";
            }
        }
    };
    TaskPanel.prototype.onButtonClick = function () {
        UiManager.getCurrentUiManager().removePanel();
    };
    return TaskPanel;
}(engine.DisplayObjectContainer));
