class UiManager{
    private mask:engine.Bitmap;
    private dialogPanel:DialogPanel;
    private taskPanel:TaskPanel;
    private heroDetailsPanel:HeroDetailsPanel;
    private panelStack:engine.DisplayObjectContainer[];
    private taskButton:Button;
    private heroButton:Button;
    private hasMask:boolean;
    private onTaskButtonClick:()=>void;
    private onHeroButtonClick:()=>void;
    
    private canvas:engine.DisplayObjectContainer;
    private static uiManager:UiManager;
    public static TASKPANEL=0;
    public static DIALOGPANEL=1;
    public static HERODETAILSPANEL=2;
    constructor(canvas:engine.DisplayObjectContainer){
        this.dialogPanel=new DialogPanel();
        this.taskPanel=new TaskPanel();
        this.heroDetailsPanel=new HeroDetailsPanel();
        this.canvas=canvas;
        this.panelStack=new Array();
        this.hasMask=false;

        this.mask=new engine.Bitmap();
        this.mask.texture="mask.png"; 
        this.mask.x=0;
        this.mask.y=0;

        this.mask.touchEnabled=true;

        this.taskButton=new Button("taskButton.png");
        this.taskButton.x=640;
        this.taskButton.y=0;
        if(this.onTaskButtonClick==null){
            let x=()=>{
                this.addPanel(UiManager.TASKPANEL,true);
            }
            this.onTaskButtonClick=x;
        }
        this.taskButton.addEventListener("onclick",this.onTaskButtonClick,this.taskButton,false);
        this.canvas.addChild(this.taskButton);

        this.heroButton=new Button("heroButton.png");
        this.heroButton.x=640;
        this.heroButton.y=100;
        if(this.onHeroButtonClick==null){
            let x=()=>{
                this.addPanel(UiManager.HERODETAILSPANEL,true);
            }
            this.onHeroButtonClick=x;
        }
        this.heroButton.addEventListener("onclick",this.onHeroButtonClick,this.heroButton,false);
        this.canvas.addChild(this.heroButton);
    }
    public static replaceCurrentUiManager(x:UiManager){
        UiManager.uiManager=x;
    }
    public static getCurrentUiManager():UiManager{
       return  UiManager.uiManager;
    }
    public addPanel(panelType:number,hasMask:boolean){
        //如需只添加一层面板，则判断是否有遮罩即可
        if (hasMask) {
            this.canvas.addChild(this.mask);
            this.hasMask = true;
        }
        switch(panelType){
            case UiManager.TASKPANEL:
            this.taskPanel.x=0;
            this.taskPanel.y=200;
            this.canvas.addChild(this.taskPanel);
            this.panelStack.push(this.taskPanel);
            break;

            case UiManager.DIALOGPANEL:
            this.dialogPanel.x=200;
            this.dialogPanel.y=200;
            this.canvas.addChild(this.dialogPanel);
            this.panelStack.push(this.dialogPanel);
            break;

            case UiManager.HERODETAILSPANEL:
            this.heroDetailsPanel.x=100;
            this.heroDetailsPanel.y=100;
            this.canvas.addChild(this.heroDetailsPanel);
            this.panelStack.push(this.heroDetailsPanel);
            break;
        }
    }
    public removePanel(){
        if(this.panelStack.length>=1){
            //如需移除制定面板，则传入面板事例，直接移除相应面板即可
            this.canvas.removeChild(this.panelStack.pop());
            if(this.panelStack.length!=0){
                //将下层面板至于遮罩层之上
                this.canvas.addChild(this.panelStack[this.panelStack.length-1]);
            }else if(this.hasMask){
                this.canvas.removeChild(this.mask);
                this.hasMask=false;
            }
        }
    }
    public getTaskPanel():TaskPanel{
        return this.taskPanel;
    }
    public getHeroDetaiksPanel():HeroDetailsPanel{
        return this.heroDetailsPanel;
    }
    public getDialogPanel():DialogPanel{
        return this.dialogPanel;
    }
}