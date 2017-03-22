var Task = (function () {
    function Task(id, fromID, toID, status, condition, total, targetMonster, laterTask) {
        this.id = id;
        this.fromNpcId = fromID;
        this.toNpcId = toID;
        this.status = status;
        this.current = 0;
        this.total = total;
        this.condition = condition;
        this.targetMonster = targetMonster;
        this.nextTask = laterTask;
        //此处更新会出现任务管理系统和场景管理系统中
        TaskService.getInstance().addTask(this);
    }
    Task.prototype.getFromID = function () {
        return this.fromNpcId;
    };
    Task.prototype.getToID = function () {
        return this.toNpcId;
    };
    Task.prototype.getStatus = function () {
        return this.status;
    };
    Task.prototype.setStatus = function (newStatus) {
        this.status = newStatus;
    };
    Task.prototype.getID = function () {
        return this.id;
    };
    Task.prototype.getCondition = function () {
        return this.condition;
    };
    Task.prototype.getTargetMonster = function () {
        return this.targetMonster;
    };
    Task.prototype.getNextTask = function () {
        return this.nextTask;
    };
    //接受任务
    Task.prototype.onAccept = function () {
        TaskService.getInstance().accept(this.id);
        this.condition.onAccept(this);
    };
    //任务提交
    Task.prototype.onSubmit = function () {
        TaskService.getInstance().over(this.getID());
        this.condition.onFinish(this);
        //此处应加入onFinish逻辑为玩家增加装备
    };
    //任务完成
    Task.prototype.onFinish = function () {
        TaskService.getInstance().finish(this.getID());
    };
    //杀怪进行中
    Task.prototype.setCurrent = function () {
        this.current++;
        if (this.current == this.total) {
            this.onFinish();
        }
    };
    Task.prototype.toString = function () {
        if (this.status == Task.ACCEPTABLE) {
            return "ACCEPTABLE";
        }
        else if (this.status == Task.CAN_SUBMIT) {
            return "CAN_SUBMIT";
        }
        else if (this.status == Task.DURING) {
            return "DURING";
        }
        else if (this.status == Task.SUBMITTED) {
            return "SUBMITTED";
        }
        else if (this.status == Task.UNACCEPTALBE) {
            return "UNACCEPTALBE";
        }
    };
    return Task;
}());
Task.UNACCEPTALBE = 0;
Task.ACCEPTABLE = 1;
Task.DURING = 2;
Task.CAN_SUBMIT = 3;
Task.SUBMITTED = 4;
var taskJason = [
    { id: "task_0", fromID: "npc_0", toID: "npc_1", status: Task.ACCEPTABLE, condition: "NPCTalkTaskCondition", total: 1, targetMonster: "null", laterTask: "task_1" },
    { id: "task_1", fromID: "npc_1", toID: "npc_1", status: Task.UNACCEPTALBE, condition: "KillMonsterTaskCondition", total: 1, targetMonster: "monster_png", laterTask: "null" }
];
var TaskFactory = (function () {
    function TaskFactory() {
    }
    TaskFactory.createOneTask = function (id) {
        for (var i = 0; i < taskJason.length; i++) {
            if (taskJason[i].id.match(id)) {
                if (taskJason[i].condition.match("NPCTalkTaskCondition")) {
                    return new Task(taskJason[i].id, taskJason[i].fromID, taskJason[i].toID, taskJason[i].status, new NPCTalkTaskCondition(), taskJason[i].total, taskJason[i].targetMonster, taskJason[i].laterTask);
                }
                else if (taskJason[i].condition.match("KillMonsterTaskCondition")) {
                    return new Task(taskJason[i].id, taskJason[i].fromID, taskJason[i].toID, taskJason[i].status, new KillMonsterTaskCondition(), taskJason[i].total, taskJason[i].targetMonster, taskJason[i].laterTask);
                }
            }
        }
    };
    return TaskFactory;
}());
