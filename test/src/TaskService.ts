class TaskService{
    private observerList:Observer[];
    private taskList:Task[];
    private static taskService:TaskService;
    constructor(){
        ;
    }
    public static getInstance(){
        if(TaskService.taskService!=null){
            return TaskService.taskService;
        }else{
            TaskService.taskService=new TaskService();
            TaskService.taskService.observerList=new Array();
            TaskService.taskService.taskList=new Array();
            return TaskService.taskService;
        };
    }
    public finish(id:string):void{
        console.log("finish"+id)
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getID().match(id)){
                this.taskList[i].setStatus(Task.CAN_SUBMIT);
                this.notify(this.taskList[i]);
                break;
            }
        }
    }
    public over(id:string):void{
        var next:string="null";
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getID().match(id)){
                this.taskList[i].setStatus(Task.SUBMITTED);
                next=this.taskList[i].getNextTask();
                this.notify(this.taskList[i]);
                break;
            }
        }
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getID().match(next) && this.taskList[i].getStatus()==Task.UNACCEPTALBE){
                this.taskList[i].setStatus(Task.ACCEPTABLE);
                this.notify(this.taskList[i]);
            }
        }
    }
    public accept(id:string):void{
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getID().match(id)){
                this.taskList[i].setStatus(Task.DURING);
                this.notify(this.taskList[i]);
                break;
            }
        }
    }
    public getTaskByCustomRole(rule:Function):Task[]{
        return rule(this.taskList);
    }
    private notify(task:Task):void{
        for(var i=0;i<this.observerList.length;i++){
            this.observerList[i].onChange(task);
        }
    }
    public addObserver(x:Observer){
        this.observerList.push(x);
    }
    public addTask(x:Task){
        this.taskList.push(x);
        this.notify(x);
    }
}