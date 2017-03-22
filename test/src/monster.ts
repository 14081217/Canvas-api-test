let monsterJason=[
    {id:"monster.png",health:5}
];

class Monster extends engine.DisplayObjectContainer{
    private id:string;
    private health:number;
    private healthMax:number;
    private bitmap:engine.Bitmap;
    constructor(id:string,health:number){
        super();
        this.id=id;
        this.health=health;
        this.healthMax=health;

        this.bitmap=new engine.Bitmap();
        this.bitmap.texture=id;
        this.addChild(this.bitmap);

        this.touchEnabled=true;
    }
    public healthChange(change:number){
        this.health+=change;
        if(this.health==0){
            GameScene.getCurrentScene().killMonster(this);
            GameScene.getCurrentScene().getCommandList().pass();
        }
    }
    public getId():string{
        return this.id;
    }
    public getHealth():number{
        return this.health;
    }
}
class MonsterFactory{
    public static createOneMonster(id:string):Monster{
        for(var i=0;i<monsterJason.length;i++){
            if(monsterJason[i].id.match(id)){
                return new Monster(monsterJason[i].id,monsterJason[i].health);
            }
        }
    }
}