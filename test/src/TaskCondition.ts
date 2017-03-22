
interface TaskConditionContext{
    setCurrent():void;
    onFinish():void;
    onSubmit():void;
}

interface TaskCondition{
    onAccept(task: TaskConditionContext);
    onFinish(task: TaskConditionContext);
}

class NPCTalkTaskCondition implements TaskCondition{
    onAccept(task:TaskConditionContext){
        task.onFinish();
    }
    onFinish(task: TaskConditionContext){

    }
}
class KillMonsterTaskCondition implements TaskCondition{
    private onAcceptButton:boolean=true;
    onAccept(task:TaskConditionContext){
        if(!this.onAcceptButton){
            task.setCurrent();
        }
        this.onAcceptButton=false;
    }
    onFinish(task: TaskConditionContext){
        User.getInstance().heros[0].addEquipment(new Equipment(1000,"w4.jpg"));
        UiManager.getCurrentUiManager().getHeroDetaiksPanel().iconInit();
    }
}