class GameScene {
    private player:Player;
    private map:MainMap;
    private npc_0:NPC;
    private npc_1:NPC;
    private monster:Monster;
    private mainContainer:engine.DisplayObjectContainer;

    private commandList:CommandList;
    private taskList:Task[];
    private static scene: GameScene;
    constructor(player:Player,map:MainMap,npc_0:NPC,npc_1:NPC,monster:Monster,main:engine.DisplayObjectContainer){
        this.player=player;
        this.map=map;
        this.npc_0=npc_0;
        this.npc_1=npc_1;
        this.monster=monster;
        this.mainContainer=main;
        TaskService.getInstance().getTaskByCustomRole((taskList:Task[])=>{
            this.taskList=taskList;
        });

        this.initListener();
    }
    public static replaceScene(scene: GameScene) {
        GameScene.scene = scene;
    }

    public static getCurrentScene(): GameScene {
        return GameScene.scene;
    }
    public moveTo(tiles: tile[], callback: Function) {
        console.log("开始移动");
        var moveState:MoveState=new MoveState(this.player,tiles);
        this.player.Macine.ChangeState(moveState);
    }

    public stopMove(callback: Function) {
        console.log("取消移动");
        this.player.Macine.ChangeState(new IdleState(this.player));
        callback();
    }
    public initListener(){
        this.commandList=new CommandList();
        this.map.addEventListener("onclick",(evt:MouseEvent)=>{
            
            let startTile: tile = new tile();
            startTile.x = Math.floor(this.player.x / ONETILESIZE);
            startTile.y = Math.floor(this.player.y / ONETILESIZE);
            let endTile: tile = new tile();
            endTile.x = Math.floor(evt.offsetX / ONETILESIZE);
            endTile.y = Math.floor(evt.offsetY / ONETILESIZE);
            console.log(evt);
            if(this.map.findWay(startTile,endTile)){
                this.commandList.cancel();
                let path:tile[]=this.map.getPath();
                this.commandList.addCommand(new WalkCommand(path));
                this.commandList.addCommand(new IdleCommand(this.player));
            }
            this.commandList.execute();
            
        }, this.map,false);

        this.npc_0.addEventListener("onclick", (evt:MouseEvent) => {

            // var dialogPanel: DialogPanel = DialogPanel.getInstance();
            var dialogPanel: DialogPanel = UiManager.getCurrentUiManager().getDialogPanel();
            dialogPanel.addTask(this.npc_0.getMytask(), this.npc_0.getId());

            let startTile: tile = new tile();
            startTile.x = Math.floor(this.player.x / ONETILESIZE);
            startTile.y = Math.floor(this.player.y / ONETILESIZE);
            let endTile: tile = new tile();
            endTile.x = Math.floor(this.npc_0.x / ONETILESIZE);
            endTile.y = Math.floor(this.npc_0.y / ONETILESIZE);

            if(this.map.findWay(startTile,endTile)){
                this.commandList.cancel();
                let path:tile[]=this.map.getPath();
                this.commandList.addCommand(new WalkCommand(path));
                this.commandList.addCommand(new TalkCommand());
                this.commandList.addCommand(new IdleCommand(this.player));
            }
            this.commandList.execute();
        },this.npc_0,false);

        this.npc_1.addEventListener("onclick",(evt:MouseEvent)=>{

            // var dialogPanel: DialogPanel = DialogPanel.getInstance();
            var dialogPanel: DialogPanel = UiManager.getCurrentUiManager().getDialogPanel();
            dialogPanel.addTask(this.npc_1.getMytask(), this.npc_1.getId());

            let startTile: tile = new tile();
            startTile.x = Math.floor(this.player.x / ONETILESIZE);
            startTile.y = Math.floor(this.player.y / ONETILESIZE);
            let endTile: tile = new tile();
            endTile.x = Math.floor(this.npc_1.x / ONETILESIZE);
            endTile.y = Math.floor(this.npc_1.y / ONETILESIZE);

            if(this.map.findWay(startTile,endTile)){
                this.commandList.cancel();
                let path:tile[]=this.map.getPath();
                this.commandList.addCommand(new WalkCommand(path));
                this.commandList.addCommand(new TalkCommand());
                this.commandList.addCommand(new IdleCommand(this.player));
            }
            this.commandList.execute();
        },this.npc_1,false);

        this.monster.addEventListener("onclick",(evt:MouseEvent)=>{
            let startTile: tile = new tile();
            startTile.x = Math.floor(this.player.x / ONETILESIZE);
            startTile.y = Math.floor(this.player.y / ONETILESIZE);
            let endTile: tile = new tile();
            endTile.x = Math.floor(evt.offsetX / ONETILESIZE);
            endTile.y = Math.floor(evt.offsetY / ONETILESIZE);
            if(this.map.findWay(startTile,endTile)){
                this.commandList.cancel();
                let path:tile[]=this.map.getPath();
                this.commandList.addCommand(new WalkCommand(path));
                this.commandList.addCommand(new FightCommand(this.player,this.monster));
                this.commandList.addCommand(new IdleCommand(this.player));
            }
            this.commandList.execute();
        }, this.monster,false);
        
    }
    public static getMap():MainMap{
        return GameScene.scene.map;
    }
    public getCommandList():CommandList{
        return this.commandList;
    }
    private notify(task:Task):void{
        task.getCondition().onAccept(task);
    }


    public killMonster(x:Monster){
        for(var i=0;i<this.taskList.length;i++){
            if(this.taskList[i].getTargetMonster().match(x.getId()) && 
            this.taskList[i].getStatus()==Task.DURING){
                this.notify(this.taskList[i]);
            }
        }
        this.mainContainer.removeChild(x);
        // setTimeout(()=>{
        //     this.mainContainer.addChild(this.monster);
        //     this.monster.healthChange(5);
        // },this,2000);
    }
}
