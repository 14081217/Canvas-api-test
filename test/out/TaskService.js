var TaskService = (function () {
    function TaskService() {
        ;
    }
    TaskService.getInstance = function () {
        if (TaskService.taskService != null) {
            return TaskService.taskService;
        }
        else {
            TaskService.taskService = new TaskService();
            TaskService.taskService.observerList = new Array();
            TaskService.taskService.taskList = new Array();
            return TaskService.taskService;
        }
        ;
    };
    TaskService.prototype.finish = function (id) {
        console.log("finish" + id);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getID().match(id)) {
                this.taskList[i].setStatus(Task.CAN_SUBMIT);
                this.notify(this.taskList[i]);
                break;
            }
        }
    };
    TaskService.prototype.over = function (id) {
        var next = "null";
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getID().match(id)) {
                this.taskList[i].setStatus(Task.SUBMITTED);
                next = this.taskList[i].getNextTask();
                this.notify(this.taskList[i]);
                break;
            }
        }
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getID().match(next) && this.taskList[i].getStatus() == Task.UNACCEPTALBE) {
                this.taskList[i].setStatus(Task.ACCEPTABLE);
                this.notify(this.taskList[i]);
            }
        }
    };
    TaskService.prototype.accept = function (id) {
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getID().match(id)) {
                this.taskList[i].setStatus(Task.DURING);
                this.notify(this.taskList[i]);
                break;
            }
        }
    };
    TaskService.prototype.getTaskByCustomRole = function (rule) {
        return rule(this.taskList);
    };
    TaskService.prototype.notify = function (task) {
        for (var i = 0; i < this.observerList.length; i++) {
            this.observerList[i].onChange(task);
        }
    };
    TaskService.prototype.addObserver = function (x) {
        this.observerList.push(x);
    };
    TaskService.prototype.addTask = function (x) {
        this.taskList.push(x);
        this.notify(x);
    };
    return TaskService;
}());
