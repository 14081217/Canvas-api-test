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
var NPC = (function (_super) {
    __extends(NPC, _super);
    function NPC(id, tex) {
        var _this = _super.call(this) || this;
        _this.myBitmap = new engine.Bitmap();
        _this.myBitmap.texture = tex;
        _this.myBitmap.x = 0;
        _this.myBitmap.y = 0;
        _this.addChild(_this.myBitmap);
        _this.id = id;
        _this.myTask = new Array();
        var taskService = TaskService.getInstance();
        taskService.addObserver(_this);
        var flag = Task.UNACCEPTALBE;
        taskService.getTaskByCustomRole(function (taskList) {
            for (var i = 0; i < taskList.length; i++) {
                if (taskList[i].getToID().match(_this.id) || taskList[i].getFromID().match(_this.id)) {
                    _this.myTask.push(taskList[i]);
                    if (taskList[i].getStatus() == Task.CAN_SUBMIT && taskList[i].getToID().match(_this.id)) {
                        flag = Task.CAN_SUBMIT;
                    }
                    else if (taskList[i].getStatus() == Task.ACCEPTABLE && taskList[i].getFromID().match(_this.id)) {
                        flag = Task.ACCEPTABLE;
                    }
                    else if (taskList[i].getStatus() == Task.DURING) {
                        flag = Task.DURING;
                    }
                    else if (!taskList[i].getToID().match(_this.id) && !taskList[i].getFromID().match(_this.id)) {
                        ;
                    }
                }
            }
        });
        _this.emoji = new engine.Bitmap();
        if (flag == Task.ACCEPTABLE) {
            _this.emoji.texture = "ACCEPTABLE.png";
        }
        else if (flag == Task.CAN_SUBMIT) {
            _this.emoji.texture = "CAN_SUBMIT.png";
        }
        else if (flag == Task.DURING) {
            _this.emoji.texture = "DURING.png";
        }
        else {
            _this.emoji.texture = "";
        }
        _this.emoji.x = 0;
        _this.emoji.y = -50;
        _this.addChild(_this.emoji);
        _this.touchEnabled = true;
        return _this;
    }
    NPC.prototype.onChange = function (task) {
        if (task.getStatus() == Task.ACCEPTABLE && task.getFromID().match(this.id)) {
            this.emoji.texture = "ACCEPTABLE.png";
        }
        else if (task.getStatus() == Task.CAN_SUBMIT && task.getToID().match(this.id)) {
            this.emoji.texture = "CAN_SUBMIT.png";
        }
        else if (task.getStatus() == Task.DURING && task.getToID().match(this.id)) {
            this.emoji.texture = "DURING.png";
        }
        else if (!task.getFromID().match(this.id) && !task.getToID().match(this.id)) {
            //与我无关
            ;
        }
        else {
            this.emoji.texture = "";
        }
    };
    NPC.prototype.getMytask = function () {
        return this.myTask;
    };
    NPC.prototype.getId = function () {
        return this.id;
    };
    return NPC;
}(engine.DisplayObjectContainer));
