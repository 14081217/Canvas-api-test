
<<<<<<< HEAD


class Task implements TaskConditionContext{
    public static UNACCEPTALBE=0;
    public static ACCEPTABLE=1;
    public static DURING=2;
    public static CAN_SUBMIT=3;
    public static SUBMITTED=4;

    private id:string;
    private name:string;
    private desc:string;
    private status:number;
    private fromNpcId:string;
    private toNpcId:string;
    private current:number;
    private total:number;
    private condition:TaskCondition;
    private targetMonster:string;
    private nextTask:string;

    constructor(id:string,fromID:string,toID:string,status:number,condition:TaskCondition,total:number,targetMonster:string,laterTask:string){
        this.id=id;
        this.fromNpcId=fromID;
        this.toNpcId=toID;
        this.status=status;
        this.current=0;
        this.total=total;
        this.condition=condition;
        this.targetMonster=targetMonster;
        this.nextTask=laterTask;

        //此处更新会出现任务管理系统和场景管理系统中
        TaskService.getInstance().addTask(this);
    }
    public getFromID():string{
        return this.fromNpcId;
    }
    public getToID():string{
        return this.toNpcId;
    }
    public getStatus():number{
        return this.status;
    }
    public setStatus(newStatus:number):void{
        this.status=newStatus;
    }
    public getID():string{
        return this.id;
    }
    public getCondition():TaskCondition{
        return this.condition;
    }
    public getTargetMonster():string{
        return this.targetMonster;
    }
    public getNextTask():string{
        return this.nextTask;
    }
//接受任务
    public onAccept(){
        TaskService.getInstance().accept(this.id);
        this.condition.onAccept(this);
    }
//任务提交
    public onSubmit(){
        TaskService.getInstance().over(this.getID());
        this.condition.onFinish(this);
        //此处应加入onFinish逻辑为玩家增加装备
    }
//任务完成
    public onFinish():void{
        TaskService.getInstance().finish(this.getID());
    }
//杀怪进行中
    public setCurrent():void{
        this.current++;
        if(this.current==this.total){
            this.onFinish();
        }
    }
    
    public toString():string{
        if(this.status==Task.ACCEPTABLE){
            return "ACCEPTABLE";
        }else if(this.status==Task.CAN_SUBMIT){
            return "CAN_SUBMIT"
        }else if(this.status==Task.DURING){
            return "DURING"
        }else if(this.status==Task.SUBMITTED){
            return "SUBMITTED"
        }else if(this.status==Task.UNACCEPTALBE){
            return "UNACCEPTALBE"
        }
    }
}


let taskJason=[
    {id:"task_0",fromID:"npc_0",toID:"npc_1",status:Task.ACCEPTABLE,condition:"NPCTalkTaskCondition",total:1,targetMonster:"null",laterTask:"task_1"},
    {id:"task_1",fromID:"npc_1",toID:"npc_1",status:Task.UNACCEPTALBE,condition:"KillMonsterTaskCondition",total:1,targetMonster:"monster_png",laterTask:"null"}
];

class TaskFactory{
    public static createOneTask(id:string):Task{
        for(var i=0;i<taskJason.length;i++){
            if(taskJason[i].id.match(id)){
                if(taskJason[i].condition.match("NPCTalkTaskCondition")){
                    return new Task(taskJason[i].id, taskJason[i].fromID, taskJason[i].toID,
                        taskJason[i].status, new NPCTalkTaskCondition(), taskJason[i].total,
                        taskJason[i].targetMonster, taskJason[i].laterTask);
                }else if(taskJason[i].condition.match("KillMonsterTaskCondition")){
                    return new Task(taskJason[i].id, taskJason[i].fromID, taskJason[i].toID,
                        taskJason[i].status, new KillMonsterTaskCondition(), taskJason[i].total,
                        taskJason[i].targetMonster, taskJason[i].laterTask);
                }
            }
        }
    }
}
=======
enum TaskStatus {
    UNACCEPTABLE = 0,
    ACCEPTABLE = 1,
    DURING = 2,
    CAN_SUBMIT = 3,
    SUBMITTED = 4
}

interface TaskConditionContext {
    getCurrent();
    setCurrent(n: number);
    canAccept();
    accept();
    submit();
    updateProccess(n : number);

}

class EventEmitter {
    public observerList: Observer[] = [];

    // constructor(){
    //     this.observerList = [];
    // }
    public addObserver(o: Observer) {
        this.observerList.push(o);
    }

    public notify(task: Task) {
        for (var observer of this.observerList) {
            observer.onChange(task);
        }
    }
}

class Task extends EventEmitter implements TaskConditionContext,Observer {

    public id: string;
    public name: string;
    public desc: string;
    public status: TaskStatus;
    public fromNpcId: string;
    public toNpcId: string;
    public current = 0;
    public total = 100;
    public conditionType : string;
    public preTaskListId : string[] = [];
    private taskCondition: TaskCondition;
    private rewardEquipmentId : string;
    private _tmain : Main;

    public setMain(main : Main){
        this._tmain = main;
    }

    public getCurrent() {
        return this.current;
    }
    public setCurrent(n: number) {
        this.current += n;
        this.checkStatus();
    }
    private checkStatus() {
        if (this.current >= this.total) {
            TaskService.getInstance().canFinish(this.id);
            this.notify(this);
        }
    }

    public onChange(task : Task){
        if(this.id == task.id){
            this.updateProccess(1);
        }
    }
    // public getCondition(){
    //     return this.taskCondition;
    // }
    public canAccept(){
        if(this.status == TaskStatus.UNACCEPTABLE){
            this.status = TaskStatus.ACCEPTABLE;
            this.notify(this);
        }
    };
    public accept(){
        if(this.status == TaskStatus.ACCEPTABLE){
            this.status = TaskStatus.DURING;
            this.notify(this);
        }
    };
    public submit(){
        if(this.status == TaskStatus.CAN_SUBMIT){
            this.status = TaskStatus.SUBMITTED;
            this._tmain.HeroEquipWeapon(this.rewardEquipmentId);
            this.notify(this);
        }
    };


    public updateProccess(n : number){
        if(this.status == TaskStatus.DURING){
        this.taskCondition.updateProccess(this,n);
        }
    }

    constructor(id: string, name: string, desc: string,
     total: number, status: TaskStatus, taskcondition: TaskCondition,conditiontype,
      fromNpcId: string, toNpcId: string,preTaskListId : string[],rewardEquipmentId : string) {
        super();
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.status = status;
        this.total = total;
        this.taskCondition = taskcondition;
        this.fromNpcId = fromNpcId;
        this.toNpcId = toNpcId;
        this.conditionType = conditiontype;
        this.preTaskListId = preTaskListId;
        this.addObserver(TaskService.getInstance());
        this.rewardEquipmentId = rewardEquipmentId;
        

    }

    // public getId(){
    //     return this.id;
    // }

    // public getName(){
    //     return this.name;
    // }

    // public changeStatus( status : TaskStatus){
    //    this.status = status;
    // }

    // public showStatus(){
    //     return this.status;
    // }

    // public getFromNpcId(){
    //     return this.fromNpcId;
    // }

    // public getToNpcId(){
    //     return this.toNpcId;
    // }

}


interface TaskCondition {
    // canAccept(task);
    // accept(task);
    // submit(task);
    // getCondition();
    updateProccess(task, num);
}

class NPCTalkTaskCondition implements TaskCondition {
    canAccept(task : TaskCondition){}
    onSubmit(task){}
    getCondition(){
        return this;
    }
    public updateProccess(task: TaskConditionContext, num: number) {
        task.setCurrent(num);
    }
}

class KillMonsterTaskCondition implements TaskCondition {
    
    public MonsterList:{
      [Index : string] : number
    } = {}

    onAccept(task) { }
    onSubmit(task) { }
    getCondition(){
        return this;
    }
    public updateProccess(task: TaskConditionContext, num: number) {
        task.setCurrent(num);
    }
}




interface Observer {
    onChange(task: Task);
}


class TaskService extends EventEmitter implements Observer {

    private static instance;
    private taskList: {
        [index: string]: Task
    } = {};
    static getInstance(): TaskService {
        if (TaskService.instance == null) {
            TaskService.instance = new TaskService();
        }

        return TaskService.instance;
    }

    //private observerList : Observer[] = [];


    public addTask(task: Task) {
        this.taskList[task.id] = task;
    }

    // public addObserver(o : Observer){
    //     this.observerList.push(o);
    // }

    public getTaskByCustomRule(rule: Function): Task {
        return rule(this.taskList);
    }

    public finish(id: string) {
        if (this.taskList[id].status == TaskStatus.CAN_SUBMIT) {
            this.taskList[id].status = TaskStatus.SUBMITTED;
        }
       this.notify(this.taskList[id]);
    }

    public accept(id: string) {
        if (this.taskList[id].status == TaskStatus.ACCEPTABLE) {
            this.taskList[id].status = TaskStatus.DURING;
        }
        this.notify(this.taskList[id]);
    }

    public canAccept(id: string) {
        if (this.taskList[id].status == TaskStatus.UNACCEPTABLE) {
            this.taskList[id].status = TaskStatus.ACCEPTABLE;
        }
        this.notify(this.taskList[id]);
    }

    public canFinish(id: string) {
        if (this.taskList[id].status == TaskStatus.DURING) {
            this.taskList[id].status = TaskStatus.CAN_SUBMIT;
        }
        this.notify(this.taskList[id]);
    }

    // public notify(task : Task){
    //     for(var observer of this.observerList){
    //         observer.onChange(task);
    //     }
    // }

    public onChange(task: Task) {
        this.taskList[task.id] = task;
        this.notify(this.taskList[task.id]);
        for(var taskId in this.taskList){
            
            if(this.taskList[taskId].status == TaskStatus.UNACCEPTABLE){
               var canAccept = true;
               for(var preId of this.taskList[taskId].preTaskListId){
                if(preId != "null"){
                   if(this.taskList[preId].status != TaskStatus.SUBMITTED ){
                       canAccept = false;
                      break;
                      }
                   }
                   }
                   if(canAccept){
                    this.canAccept(taskId);
                   }
            }
            
        }
    }

    // public init(){
    //     var config : Task[] = [
    //         {id : "task_00",name:"任务01",desc: "点击NPC_1,在NPC_2交任务" ,status :　TaskStatus.UNACCEPTABLE,fromNpcId : "npc_0", toNpcId: "npc_1"},
    //         //{id : "task_01",name:"任务02",desc: "点击NPC_2,在NPC_1交任务",status :　TaskStatus.UNACCEPTABLE,fromNpcId : "npc_1", toNpcId: "npc_0"}
    //     ]

    //     for( var i = 0 ; i <　config.length ; i++){
    //         this.addTask(config[i]);
    //     }
    // }


    
}

function creatTaskCondition(id: string) {
        var data = {
            "npctalk" : {condition : new NPCTalkTaskCondition()},
            "killmonster":{condition : new KillMonsterTaskCondition()} 
        }
        // if (id == "npctalk") {
        //     var n = new NPCTalkTaskCondition();
        //     return n;
        // }
        // else if (id == "killmonster") {
        //     var k = new KillMonsterTaskCondition();
        //     return k;
        // }
        // else
        var info = data[id];
        if (!info) {
            console.error('missing task')
        }
            return info.condition;
    }

    function creatTask(id: string) {
        var data = {
            "task_00": { name: "任务01", desc: "点击NPC_1,在NPC_2交任务", total: 1, status: TaskStatus.ACCEPTABLE, condition: "npctalk", fromNpcId: "npc_0", toNpcId: "npc_1" ,preTaskListId : ["null"],rewardEquipmentId:"W001"},
            "task_01": { name: "任务02", desc: "点击NPC_2,杀死一只史莱姆后点NPC_2交任务", total: 1, status: TaskStatus.UNACCEPTABLE, condition: "killmonster", fromNpcId: "npc_1", toNpcId: "npc_1" ,preTaskListId : ["task_00"],rewardEquipmentId:"W002"},

        }
        var info = data[id];
        if (!info) {
            console.error('missing task')
        }
        var condition = this.creatTaskCondition(info.condition);
        return new Task(id, info.name, info.desc, info.total, info.status, condition, info.condition,info.fromNpcId, info.toNpcId,info.preTaskListId,info.rewardEquipmentId);
    }

class TaskPanel extends engine.DisplayObjectContainer implements Observer {

    textField: engine.TextField;
    //button : egret.Bitmap;
    background: engine.Bitmap;
    show: string[] = [];
    private taskList: Task[] = [];
    private ifAccept: boolean;
    private duringTaskId: string;

    constructor() {
        super();

        this.width = 256;
        this.height = 317;

        this.background = this.createBitmapByName("renwumianbanbeijing.png");
        this.addChild(this.background);
        this.background.setWidth(256);
        this.background.setHeight(317);
        this.background.x = 0;
        this.background.y = 0;

        this.textField = new engine.TextField();
        this.addChild(this.textField);
        this.textField.x = this.width / 2 - 100;
        this.textField.y = this.height / 2;


        this.textField.size = 15;
        this.textField.textColor = "0x000000";
        this.addChild(this.textField);
        this.textField.setWidth(200);
        this.textField.x = 30;
        this.textField.y = 80;

        // this.button = this.createBitmapByName("jieshou_gray.png");
        // this.ifAccept = true;
        // this.addChild(this.button);
        // this.button.x = 80;
        // this.button.y = 230;
        // this.button.touchEnabled = false;
        // this.button.alpha = 1;

        //this.onButtonClick();

        this.alpha = 0;

        let rule = (taskList) => {
            for (var taskId in taskList) {
                //console.log(taskId);
                this.taskList.push(taskList[taskId]);
            }
        }
        TaskService.getInstance().getTaskByCustomRule(rule);
        //this.taskList = rule;
        // for(var i = 0; i < this.taskList.length; i++){
        //     this.show[i] ="任务名 ：" + this.taskList[i].name + ":\n" +"任务内容："+ this.taskList[i].desc +" :\n" +" 任务状态 ：" + this.taskList[i].status;
        // }
        // for(var i = 0; i < this.show.length; i++){
        //     if(this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.SUBMITTED || this.taskList[i].status == TaskStatus.ACCEPTABLE)
        //     this.textField.text += this.show[i] + "\n";
        // }
    }


    private createBitmapByName(name: string): engine.Bitmap {
        var result = new engine.Bitmap();
        engine.RES.getRes(name).then((value) => {
                    result.texture = value;
                    result.setWidth(result.texture.width);
                    result.setHeight(result.texture.height);
                    });
        return result;
    }

    onChange(task: Task) {
        var i = 0;
        let rule = (taskList) => {
            for (var taskId in taskList) {
                this.taskList[i] = taskList[taskId];
                i++;
            }
        }
        TaskService.getInstance().getTaskByCustomRule(rule);
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].id == task.id) {
                this.alpha = 1;
                //egret.Tween.get(this).to({ alpha: 1 }, 500);
                //this.button.touchEnabled = true;
                // if (this.taskList[i].status == TaskStatus.ACCEPTABLE) {
                //     this.ifAccept = true;
                //     var texture: egret.Texture = RES.getRes("jieshou.png");
                //     //this.button.texture = texture;
                // }
                // if (this.taskList[i].status == TaskStatus.CAN_SUBMIT) {
                //     this.ifAccept = false;
                //     var texture: egret.Texture = RES.getRes("wancheng.png");
                //     //this.button.texture = texture;
                // }
                var statusText : string = "";
                switch(this.taskList[i].status){
                    case TaskStatus.UNACCEPTABLE:
                    statusText = "不可接";
                    break;
                    case TaskStatus.ACCEPTABLE:
                    statusText = "可接";
                    break;
                    case TaskStatus.DURING:
                    statusText = "进行中";
                    break;
                    case TaskStatus.CAN_SUBMIT:
                    statusText = "可交付";
                    break;
                    case TaskStatus.SUBMITTED:
                    statusText = "已完成";
                    break;
                    //console.log(this.taskList[i].status);
                }

                this.show[i] = "任务名 ：" + this.taskList[i].name + " :\n " + "任务内容：" + this.taskList[i].desc + " :\n " + " 任务状态 ： " + statusText;
                this.duringTaskId = this.taskList[i].id;
                this.textField.text = "";
                for (var i = 0; i < this.show.length; i++) {
                    if (this.taskList[i].status == TaskStatus.DURING || this.taskList[i].status == TaskStatus.CAN_SUBMIT || this.taskList[i].status == TaskStatus.ACCEPTABLE)
                        this.textField.text += this.show[i] + "\n";
                }
                this.alpha = 1;
                //this.button.touchEnabled = true;
                break;
            }
        }


        // this.textField.text = "";
        // for(var i = 0; i < this.show.length - 1; i++){
        //     this.textField.text += this.show[i] + "\n";
        // }

    }

    // private onButtonClick(){
    //     this.button.addEventListener(egret.TouchEvent.TOUCH_TAP,()=>{
    //         if(this.ifAccept){
    //             TaskService.getInstance().accept(this.duringTaskId);
    //             var texture : egret.Texture = RES.getRes("wancheng_gray.png");
    //             this.button.texture = texture;
    //             //egret.Tween.get(this).to({alpha : 0},500);
    //         }
    //         if(!this.ifAccept){
    //             TaskService.getInstance().finish(this.duringTaskId);
    //             var texture : egret.Texture = RES.getRes("jieshou_gray.png");
    //             this.button.texture = texture;
    //             //egret.Tween.get(this).to({alpha : 0},500);
    //         }

    //     },this)
    // }


}
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
