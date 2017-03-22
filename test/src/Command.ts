<<<<<<< HEAD
interface Command {

    execute(callback: Function): void;

    cancel(callback: Function): void;

}

class WalkCommand implements Command {
    private tiles: tile[];
    private _hasBeenCancelled;
    constructor(tiles: tile[]) {
        this.tiles = tiles;
        this._hasBeenCancelled = false;
    }

    execute(callback: Function): void {
        GameScene.getCurrentScene().moveTo(this.tiles, () => {
            if (!this._hasBeenCancelled) {
                callback();
            }
        })
    }

    cancel(callback: Function) {
        GameScene.getCurrentScene().stopMove(() => {
            this._hasBeenCancelled = true;
            callback();
        })
    }
}

class FightCommand implements Command {
    /**
     * 所有的 Command 都需要有这个标记，应该如何封装处理这个问题呢？
     */
    private _hasBeenCancelled = false;
    private player:Player;
    private monster:Monster;
    constructor(player:Player,monster:Monster){
        this.player=player;
        this.monster=monster;
    }

    execute(callback: Function): void {
        console.log("开始战斗");
        if(!this._hasBeenCancelled){
            this.player.Macine.ChangeState(new FightState(this.player,this.monster));
        }
    }

    cancel(callback: Function) {
        this._hasBeenCancelled = true;
        //每更换一次序列帧图片的时间是0.25s，因此此处每0.2s检查一次
        // if(!this.player.Macine.getCurrentState().isSequenceOver()){
        //     egret.setTimeout(()=>{
        //         this.cancel(callback);
        //     },this,200);
        // }else{
        //     console.log("脱离战斗");
        //     callback();
        // }
        console.log("脱离战斗");
        callback();
    }
}

class TalkCommand implements Command {
    execute(callback: Function): void {
        console.log("打开对话框");
        UiManager.getCurrentUiManager().addPanel(UiManager.DIALOGPANEL,true);
    }

    cancel(callback: Function) {
        console.log("关闭对话框");
        UiManager.getCurrentUiManager().removePanel();
        callback();
    }
}
class IdleCommand implements Command{
    private player:Player;
    constructor(player:Player){
        this.player=player;
    }
    execute(callback: Function): void {
        console.log("开始停留");
        this.player.Macine.ChangeState(new IdleState(this.player));
        callback();
    }

    cancel(callback: Function) {
        console.log("结束停留");
        callback();
    }
}

class CommandList {

    private _list: Command[] = [];
=======
interface Command{
    execute(callback: Function): void;

    cancel(callback: Function): void;
}

class WalkCommand implements Command{

    private _tmain : Main;
    public static canFinish = false;

    constructor(_tmain : Main){
        this._tmain = _tmain;
        WalkCommand.canFinish = false;
    }

    execute(callback: Function){
        if(this._tmain.ifFindAWay){
            this._tmain.Player.SetState(new WalkingState(),this._tmain);
            this._tmain.ifStartMove = true;

            engine.Ticker.getInstance().register(()=>{
                if(this._tmain.ifStartMove == false && WalkCommand.canFinish){
                    callback();
                    WalkCommand.canFinish = false;
                }
                //console.log("233");
            })
        }
    }

    cancel(callback: Function){
        callback();
    }

}

class FightCommand implements Command{

    private _hasBeenCancelled = false;
    private player : Person;
    private _tmain : Main;
    private target : Monster;
    private damage;

    constructor(player : Person,main : Main,monster : Monster,damage : number){
        this.player = player;
        this._tmain = main;
        this.target = monster;
        this.damage = damage;
    }

    execute(callback: Function){
        console.log("开始战斗")
        this.player.SetState(new FightState(),this._tmain);
        engine.setTimeout(() => {
            if (!this._hasBeenCancelled) {
                console.log("结束战斗")
                this.target.BeenAttacked(this.damage);
                this.player.SetState(new IdleState(),this._tmain);
                if(this._tmain.monsterAttacking.getMonsterState() == MonsterState.DEAD){
                    this._tmain.screenService.monsterBeenKilled("task_01");
                    this._tmain.removeChild(this._tmain.stage.monsterAttacking);
                }
                callback();
            }
        }, 500)
    }

    cancel(callback: Function){
        console.log("脱离战斗")
        this._hasBeenCancelled = true;
        engine.setTimeout(function () {
            this.player.SetState(new IdleState(),this._tmain);
            callback();
        }, 100)

    }

}

class TalkCommand implements Command{

    private _tmain : Main;
    private NPCToTalk : NPC;
    public static canFinish = false;

    constructor(_tmain : Main,npc){
        this._tmain = _tmain;
        TalkCommand.canFinish = false;
        this.NPCToTalk = npc;
    }
    
    execute(callback: Function){
        TalkCommand.canFinish = false;
        this.NPCToTalk.onNPCClick();
        this._tmain.canMove = false;

        engine.Ticker.getInstance().register(()=>{
                if(TalkCommand.canFinish){
                    TalkCommand.canFinish = false;
                    NPC.npcIsChoose = null;
                    this._tmain.canMove = true;
                    //console.log("dui hua wan cheng");
                    callback();
                }
                //console.log("233");
            })
    }

    cancel(callback: Function){
        this._tmain.canMove = true;
        callback();
    }

}


class CommandList {



    public _list: Command[] = [];
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
    private currentCommand: Command;
    private _frozen = false;

    addCommand(command: Command) {
        this._list.push(command);
    }

    cancel() {
        this._frozen = true;
        var command = this.currentCommand;
<<<<<<< HEAD
        //2s后无论是否取消完毕都解冻
        setTimeout(() => {
            if (this._frozen) {
                this._frozen = false;
            }
        }, this, 2000);
=======
        // egret.setTimeout(() => {
        //     if (this._frozen) {
        //         this._frozen = false;
        //     }

        // }, this, 100);
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
        if (command) {
            command.cancel(() => {
                this._frozen = false;
            });
            this._list = [];
<<<<<<< HEAD
        } else {
            this._frozen = false;
            this._list = [];
=======
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
        }

    }

    execute() {
        if (this._frozen) {
<<<<<<< HEAD
            setTimeout(this.execute, this, 100);
=======
            engine.setTimeout(this.execute, 100);
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
            return;
        }

        var command = this._list.shift();
        this.currentCommand = command;
        if (command) {
<<<<<<< HEAD
            console.log("执行下一命令", command)
            command.execute(() => {
                this.execute()
            })
        }
        else {
            console.log("全部命令执行完毕")
        }
    }
    pass(){
        if(this.currentCommand){
            this.currentCommand.cancel(()=>{
                this._frozen=false;
                this.execute();
            });
        }
    }
=======
            console.log("执行下一命令", command);
            command.execute(() => {
                this.execute();
            })

        }
        else {
            console.log("全部命令执行完毕");
        }
    }

>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
}