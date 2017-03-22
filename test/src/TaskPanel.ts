class TaskPanel extends engine.DisplayObjectContainer implements Observer{
    private textField:engine.TextField;
    private myPanel:engine.Bitmap;
    private closeButton:Button;
    private taskList:Task[];
    constructor(){
        super();
        this.myPanel=new engine.Bitmap();
        this.myPanel.texture="dialog.jpg";
        this.addChild(this.myPanel);

        var taskService:TaskService=TaskService.getInstance();
        taskService.addObserver(this);
        taskService.getTaskByCustomRole((taskList:Task[])=>{
            this.taskList=taskList;
        });

        this.textField=new engine.TextField();
        // this.textField.size=20;
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getStatus()!=Task.UNACCEPTALBE){
                this.textField.text+=this.taskList[i].getID()+"\n"+this.taskList[i].toString()+"\n";
            }
        }
        this.textField.x=0;
        this.textField.y=0;
        this.addChild(this.textField);

        this.closeButton=new Button("guan.png");
        this.closeButton.x=300;
        this.closeButton.y=0;
        this.closeButton.addEventListener("onclick",this.onButtonClick,this.closeButton,false);
        this.addChild(this.closeButton);
        this.touchEnabled=true;

    }
    onChange(task:Task):void{
        this.textField.text="";
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getStatus()!=Task.UNACCEPTALBE){
                this.textField.text+=this.taskList[i].getID()+"\n"+this.taskList[i].toString()+"\n";
            }
        }
    }
    onButtonClick():void{
        UiManager.getCurrentUiManager().removePanel();
    }
}