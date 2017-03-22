class HeroDetailsPanel extends engine.DisplayObjectContainer{
    private hero:Hero[];
    private equipment:Equipment[];
    private jewll:Jewll[];
    private desc:engine.TextField;
    private fightPower:engine.TextField;
    private imgChild:engine.Bitmap[];
    private closeButton:Button;
    private onClose:()=>void;
    constructor(){
        super();
        var bj=new engine.Bitmap();
        bj.x=0;
        bj.y=0;
        bj.texture="heroDetails.jpg";
        this.addChild(bj);

        var myPlayer:engine.Bitmap=new engine.Bitmap();
        myPlayer.texture="d1.png";
        myPlayer.x=150;
        myPlayer.y=200;
        myPlayer.scaleX=2;
        myPlayer.scaleY=2;
        this.addChild(myPlayer);

        this.hero=User.getInstance().heros;
        this.equipment=this.hero[0].equipments;

        this.desc=new engine.TextField();
        this.desc.x=108;
        this.desc.y=400;
        this.addChild(this.desc);
        

        this.fightPower=new engine.TextField();
        this.fightPower.x=108;
        this.fightPower.y=0;
        this.addChild(this.fightPower);

        this.imgChild=new Array();
        this.iconInit();

        this.closeButton=new Button("guan.png");
        this.closeButton.x=300;
        this.closeButton.y=0;
        if(this.onClose==null){
            let x=()=>{
                this.desc.text = "";
                UiManager.getCurrentUiManager().removePanel();
            }
            this.onClose=x;
        }
        this.closeButton.addEventListener("onclick",this.onClose,this.closeButton,false);
        this.addChild(this.closeButton);

        this.touchEnabled=true;
    }
    public iconInit(){
        for(var k of this.imgChild){
            this.removeChild(k);
        }
        for (var i = 0; i < this.equipment.length; i++) {
            var img: engine.Bitmap = this.equipment[i].img;
            img.x = 0;
            img.y = 120 * i;
            this.addChild(img);
            this.imgChild.push(img);
        }
        this.fightPower.text="FightPower: "+User.getInstance().getFightPower().toString();
    }
    public setDesc(tf:engine.TextField){
        this.desc.text=tf.text;
    }
}
