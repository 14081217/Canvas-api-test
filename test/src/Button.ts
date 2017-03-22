class Button extends engine.DisplayObjectContainer{
    private id:string;
    private myButton:engine.Bitmap;
    constructor(id:string){
        super();
        this.myButton=new engine.Bitmap();
        this.myButton.texture=id;
        this.addChild(this.myButton);
        this.touchEnabled=true;
        this.touchEnabled=true;

        this.id=id;
    }
    public getId():string{
        return this.id;
    }
}

