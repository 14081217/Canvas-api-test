
var Catche: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const method = desc.value;
    desc.value = function () {
        if (this["fightPowerCache"] != null && this["isDirty"]==false) {
            return target["fightPowerCache"];
        } else {
            this["isDirty"]=true;
            this["fightPowerCache"]= method.apply(this);
            return this["fightPowerCache"];
        }
    }
    
}


class User{
    gold=0;
    diomond=0;
    fightPowerCache:number;
    isDirty:boolean;
    private static user:User;
    heros:Hero[];
    constructor(){
        ;
    }
    public static getInstance():User{
        if(User.user!=null){
            return User.user;
        }else{
            User.user=new User();
            User.user.heros=new Array();
            User.user.fightPowerCache=null;
            User.user.isDirty=true;
            return User.user;
        }
    }
    @Catche
    public getFightPower():number{
        var result=0;
        this.heros.forEach((hero)=>{
            result+=hero.getFightPower();
        })
        this.fightPowerCache=result;
        return result;
    }
    public addHero(hero:Hero){
        this.heros.push(hero);
        this.isDirty=true;
        hero.user=this;
    }
}
class Hero{
    properties:Properties;
    level=1;
    currentEXP=0;
    totalEXP=100;
    like=false;
    fightPowerCache:number;
    isDirty:boolean;
    user:User;
    equipments:Equipment[];
    constructor(attack:number,defence:number){
        this.equipments=new Array();
        this.isDirty=true;
        this.properties=new Properties();
        this.properties.all.push(new Property("attack",attack));
        this.properties.all.push(new Property("defence",defence));
    }
    @Catche
    public getFightPower():number{
        var result=0;
        this.equipments.forEach((equipment)=>{
            result+=equipment.getFightPower();
        })
        result+=this.properties.getProperty(heroProperty.attack).value*2+this.properties.getProperty(heroProperty.denfence).value*1+this.level*3;
        this.fightPowerCache=result;
        return result;
    }
    public addEquipment(e:Equipment){
        this.equipments.push(e);
        this.isDirty=true;
        e.hero=this;
        this.user.isDirty=true;
    }
}
class Equipment {
    properties:Properties;
    fightPowerCache:number;
    isDirty:boolean;
    desc:engine.TextField;
    img:engine.Bitmap;
    jewlls:Jewll[];
    hero:Hero;
    constructor(attack:number,bitmap:string){
        this.jewlls=new Array();
        this.isDirty=true;
        this.properties=new Properties();
        this.properties.all.push(new Property("attack",attack));
        this.initDesc();

        this.img=new engine.Bitmap();
        this.img.texture=bitmap;
        this.img.touchEnabled = true;
        this.img.addEventListener("onclick", (e) => {
            UiManager.getCurrentUiManager().getHeroDetaiksPanel().setDesc(this.desc);
        }, this.img,false);
    }
    @Catche
    public getFightPower():number{
        var result=0;
        this.jewlls.forEach((jewll)=>{
            result+=jewll.getFightPower();
        })
        result+=this.properties.getProperty(equipmentProperty.attack).value*2;
        this.fightPowerCache=result;
        return result;
    }
    public addJewll(j:Jewll){
        this.jewlls.push(j);
        this.isDirty=true;
        j.equip=this;
        this.hero.isDirty=true;
        this.initDesc();
    }
    initDesc(){
            this.desc = PropertiesDisplayUtils.getAllProperties(this.properties);
            //console.log("before"+" "+this.desc.text);
            for(var j of this.jewlls){
                //this.desc.appendText(PropertiesDisplayUtils.getAllProperties(j.properties).text);
                this.desc.text+=PropertiesDisplayUtils.getAllProperties(j.properties).text;
            }
            //console.log("after"+" "+this.desc.text);
    }
}
class Jewll{
    properties:Properties;
    fightPowerCache:number;
    isDirty:boolean;
    equip:Equipment;
    constructor(defence:number){
        this.fightPowerCache=null;
        this.isDirty=true;
        this.properties=new Properties();
        this.properties.all.push(new Property("defence",defence));
    }
    @Catche
    public getFightPower():number{
        var result=this.properties.getProperty(jewllProperty.denfence).value;
        this.fightPowerCache=result;
        return result;
    }
}
class Properties{
    all:Property[];
    constructor(){
        this.all=new Array();
    }
    getProperty(propertyName:number){
        return this.all[propertyName];
    }
}
class Property{
    name:string;
    value:number;
    constructor(name:string,value:number){
        this.name=name;
        this.value=value;
    }

}
enum heroProperty{
    attack=0,
    denfence=1
}
enum equipmentProperty{
    attack=0
}
enum jewllProperty{
    denfence=0
}
class PropertiesDisplayUtils{
    static getDescription(property:Property):string{
        return property.name+":"+property.value;
    }
    static getAllProperties(properties:Properties):engine.TextField{
        var tf:engine.TextField=new engine.TextField();
        for(var p of properties.all){
            //tf.appendText(PropertiesDisplayUtils.getDescription(p)+ " ");
            tf.text+=PropertiesDisplayUtils.getDescription(p)+ " ";
        }
        return tf;
    }
}
