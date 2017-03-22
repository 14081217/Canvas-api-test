var NPCTalkTaskCondition = (function () {
    function NPCTalkTaskCondition() {
    }
    NPCTalkTaskCondition.prototype.onAccept = function (task) {
        task.onFinish();
    };
    NPCTalkTaskCondition.prototype.onFinish = function (task) {
    };
    return NPCTalkTaskCondition;
}());
var KillMonsterTaskCondition = (function () {
    function KillMonsterTaskCondition() {
        this.onAcceptButton = true;
    }
    KillMonsterTaskCondition.prototype.onAccept = function (task) {
        if (!this.onAcceptButton) {
            task.setCurrent();
        }
        this.onAcceptButton = false;
    };
    KillMonsterTaskCondition.prototype.onFinish = function (task) {
        User.getInstance().heros[0].addEquipment(new Equipment(1000, "w4.jpg"));
        UiManager.getCurrentUiManager().getHeroDetaiksPanel().iconInit();
    };
    return KillMonsterTaskCondition;
}());
