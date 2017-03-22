class DialogPanel extends engine.DisplayObjectContainer {
    private dialog: engine.TextField;
    private currentNPCID: string;
    private taskList: Task[];
    private finishButton: Button;
    private closeButton: Button;
    private onButtonClick: () => void;
    private onClose:()=>void;
    constructor() {
        super();
        var bj: engine.Bitmap = new engine.Bitmap();
        bj.texture = "dialog.jpg";
        bj.x = 0;
        bj.y = 0;
        this.addChild(bj);

        this.dialog = new engine.TextField();
        // this.dialog.size=20;
        this.dialog.x = 0;
        this.dialog.y = 0;
        this.addChild(this.dialog);

        this.finishButton = new Button("buttonFinish.png");
        this.finishButton.x = 0;
        this.finishButton.y = 200;
        if (this.onButtonClick == null) {
            let x = () => {
                //此处有几个任务完成，接受就需要点击几次按钮，如需优化，请为每一个任务添加一个按钮，同时删去break
                for (var i = 0; i < this.taskList.length; i++) {
                    if (this.taskList[i].getStatus() == Task.CAN_SUBMIT && this.taskList[i].getToID().match(this.currentNPCID)) {
                        this.taskList[i].onSubmit();
                        break;
                    } else if (this.taskList[i].getStatus() == Task.ACCEPTABLE && this.taskList[i].getFromID().match(this.currentNPCID)) {
                        this.taskList[i].onAccept();
                        break;
                    }
                }
                GameScene.getCurrentScene().getCommandList().pass();
            }
            this.onButtonClick = x;
        }
        if(this.onClose==null){
            let x=()=>{
                GameScene.getCurrentScene().getCommandList().pass();
            }
            this.onClose=x;
        }
        this.finishButton.addEventListener("onclick", this.onButtonClick, this.finishButton, false);
        this.addChild(this.finishButton);
        this.touchEnabled = true;

        this.closeButton = new Button("guan.png");
        this.closeButton.x = 300;
        this.closeButton.y = 0;
        this.closeButton.addEventListener("onclick", this.onClose, this.closeButton, false);
        this.addChild(this.closeButton);
    }
    public addTask(taskList: Task[], id: string): void {
        this.taskList = taskList;
        this.refreash(id);
    }
    private refreash(id: string): void {
        this.dialog.text = "";
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getStatus() != Task.UNACCEPTALBE) {
                this.dialog.text += this.taskList[i].getID() + "\n" + this.taskList[i].toString() + "\n";
            }
        }
        this.currentNPCID = id;
    }

}