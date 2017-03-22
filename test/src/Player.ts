let VELOCITY:number=2;//x，y方向的帧速率都是2px/s
let PICTURECHANGERATE=15;//1/4S改变一次图片和位置
let oneFaceNumber=4;
let faceNumber=4;
let RIGHT=0;
let DOWN=1;
let LEFT=2;
let UP=3;
let offSetOfPlayer=100;//人物相对一个格子的位移偏移量


interface State{
    OnEnter():void;
    OnExit():void;
    isSequenceOver():boolean;
    sequenceOver:boolean;
}

class MoveState implements State{
    private movePicture:string[][];
    private currentFace:number;
    private player:Player;
    private currentPicture:number;
    private targetTile:number;//路径数组下标
    private count:number;//帧计时器
    private targetX:number;
    private targetY:number;
    private targetFace:number;
    private path:tile[];
    private enter:()=>void;
    public sequenceOver:boolean;
    constructor(player: Player, path: tile[]) {
        this.targetTile=0;
        this.player = player;
        this.currentPicture = 0;
        this.count = 0;
        this.sequenceOver=false;

        this.path = path;
        this.targetX = path[path.length - 1].x;
        this.targetY = path[path.length - 1].y;
        let temp = ["r1.png", "r2.png", "r3.png", "r4.png", "d1.png", "d2.png", "d3.png", "d4.png", "l1.png", "l2.png", "l3.png", "l4.png", "u1.png", "u2.png", "u3.png", "u4.png"];
        this.movePicture = new Array();
        for (let i = 0; i < faceNumber; i++) {
            this.movePicture[i] = new Array();
        }
        for (let i = 0, count = 0; i < faceNumber; i++) {
            for (let j = 0; j < oneFaceNumber; j++) {
                this.movePicture[i][j] = temp[count];
                count++;
            }
        }
        this.currentFace = DOWN;
    }
    OnEnter():void{
        let dx=this.targetX-this.player.x;
        let dy=this.targetY-this.player.y;
        this.chooseFace(dx,dy);
        this.currentFace=this.targetFace;
        if(this.enter==null){
            let enter = () => {
                this.count++;
                if (this.count % PICTURECHANGERATE == 0) {

                    this.currentPicture %= this.movePicture.length;
                    this.player.MyPlayer.texture = this.movePicture[this.targetFace][this.currentPicture];
                    this.currentPicture++;
                    this.count = 0;
                }

                if (this.player.x < this.path[this.targetTile].x) {
                    this.player.x += VELOCITY;
                } else if (this.player.x > this.path[this.targetTile].x) {
                    this.player.x -= VELOCITY;
                }
                if (this.player.y < this.path[this.targetTile].y) {
                    this.player.y += VELOCITY;
                } else if (this.player.y > this.path[this.targetTile].y) {
                    this.player.y -= VELOCITY;
                }
                if (this.player.x == this.path[this.targetTile].x && this.player.y == this.path[this.targetTile].y) {
                    if (this.targetTile == this.path.length - 1) {
                        GameScene.getCurrentScene().getCommandList().pass();
                    } else {
                        this.targetTile++;
                        let dx = this.path[this.targetTile].x - this.player.x;
                        let dy = this.path[this.targetTile].y - this.player.y;
                        this.chooseFace(dx, dy);
                        this.currentFace = this.targetFace;
                    }
                }
            }
            this.enter=enter;
        }
        engine.Ticker.getInstance().register(this.enter);
    }
    OnExit():void{
        engine.Ticker.getInstance().unregister(this.enter);
        this.count=0;
    }
    private chooseFace(dx: number, dy: number) {
        if (dy >= 0) {
            if (Math.abs(dy) >= Math.abs(dx)) {
                this.targetFace = 1;
            } else if (dx > 0) {
                this.targetFace = 0;
            } else {
                this.targetFace = 2;
            }
        } else {
            if (Math.abs(dy) >= Math.abs(dx)) {
                this.targetFace = 3;
            } else if (dx >= 0) {
                this.targetFace = 0;
            } if (dx < 0) {
                this.targetFace = 2;
            }
        }
    }
    public isSequenceOver():boolean{
        return this.sequenceOver;
    }
}



class IdleState implements State{
    private player:Player;
    private IdlePicture:string[];
    private CurrentPicture:number;
    private count:number;
    private enter:()=>void;
    public sequenceOver:boolean;
    constructor(player:Player){
        this.player=player;
        this.CurrentPicture=0;
        this.count=0;
        this.sequenceOver=false;
        let temp=["i1.png","i2.png","i3.png","i4.png","i5.png"];
        this.IdlePicture=new Array();
        for(let i=0;i<temp.length;i++){
            this.IdlePicture.push(temp[i]);
        }
    }
    OnEnter():void{
        if (this.enter == null) {
            let enter = () => {
                this.count++;
                if (this.count % PICTURECHANGERATE == 0) {
                    this.CurrentPicture %= this.IdlePicture.length;
                    this.player.MyPlayer.texture = this.IdlePicture[this.CurrentPicture];
                    this.CurrentPicture++;
                    this.count = 0;
                }
            }
            this.enter = enter;
        }
        engine.Ticker.getInstance().register(this.enter);
    }
    OnExit():void{
        engine.Ticker.getInstance().unregister(this.enter);
        this.count=0;
    }
    public isSequenceOver():boolean{
        return this.sequenceOver;
    }
}

//只有在战斗状态才使用了sequenceOver变量，用于判断该次攻击是否结束，其他状态默认为false
class FightState implements State{
    private player:Player;
    private FightPicture:string[];
    private CurrentPicture:number;
    private count:number;
    private monster:Monster;
    private enter:()=>void;
    public sequenceOver:boolean;
    constructor(player:Player,monster:Monster){
        this.player=player;
        this.monster=monster;
        this.CurrentPicture=0;
        this.count=0;
        this.sequenceOver=false;
        let temp=["f1.png","f2.png","f3.png","f4.png"];
        this.FightPicture=new Array();
        for(let i=0;i<temp.length;i++){
            this.FightPicture.push(temp[i]);
        }
    }
    OnEnter(): void {
        if (this.enter == null) {
            let enter = () => {
                this.count++;
                if (this.count % PICTURECHANGERATE == 0) {
                    this.sequenceOver = false;
                    this.CurrentPicture %= this.FightPicture.length;
                    // console.log(this.CurrentPicture);
                    this.player.MyPlayer.texture = this.FightPicture[this.CurrentPicture];
                    if (this.CurrentPicture == this.FightPicture.length - 1) {
                        this.sequenceOver = true;
                        console.log("hit!!!");
                        this.monster.healthChange(-1);
                    }
                    this.CurrentPicture++;
                    this.count = 0;
                }
            }
            this.enter=enter;
        }
        engine.Ticker.getInstance().register(this.enter);
        
    }
    OnExit():void{
        engine.Ticker.getInstance().unregister(this.enter);
        this.count=0;
    }
    public isSequenceOver():boolean{
        return this.sequenceOver;
    }
}


class StateMacine{
    private CurrentState:State;
    private Myplayer:Player;
    public constructor(x:Player){
        this.Myplayer=x;
        this.CurrentState=new IdleState(x);
        this.CurrentState.OnEnter();
    }
    public ChangeState(e:State):void{
        this.CurrentState.OnExit();
        e.OnEnter();
        this.CurrentState = e;
    }
    public getCurrentState():State{
        return this.CurrentState;
    }

}



class Player extends engine.DisplayObjectContainer{
    constructor(){
        super();
        this.volocity=VELOCITY;
        this.MyPlayer=this.createBitmapByName("");
        this.Macine=new StateMacine(this);
        this.addChild(this.MyPlayer);
        // this.width=this.MyPlayer.width;
        // this.height=this.MyPlayer.height;
        this.MyPlayer.x=0;
        this.MyPlayer.y=-40;
    }
    public Macine:StateMacine;
    public MyPlayer:engine.Bitmap;
    public volocity:number;
    private createBitmapByName(name: string): engine.Bitmap {
        var result = new engine.Bitmap();
        result.texture = name;
        return result;
    }
}