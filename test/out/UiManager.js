var UiManager = (function () {
    function UiManager(canvas) {
        var _this = this;
        this.dialogPanel = new DialogPanel();
        this.taskPanel = new TaskPanel();
        this.heroDetailsPanel = new HeroDetailsPanel();
        this.canvas = canvas;
        this.panelStack = new Array();
        this.hasMask = false;
        this.mask = new engine.Bitmap();
        this.mask.texture = "mask.png";
        this.mask.x = 0;
        this.mask.y = 0;
        this.mask.touchEnabled = true;
        this.taskButton = new Button("taskButton.png");
        this.taskButton.x = 640;
        this.taskButton.y = 0;
        if (this.onTaskButtonClick == null) {
            var x = function () {
                _this.addPanel(UiManager.TASKPANEL, true);
            };
            this.onTaskButtonClick = x;
        }
        this.taskButton.addEventListener("onclick", this.onTaskButtonClick, this.taskButton, false);
        this.canvas.addChild(this.taskButton);
        this.heroButton = new Button("heroButton.png");
        this.heroButton.x = 640;
        this.heroButton.y = 100;
        if (this.onHeroButtonClick == null) {
            var x = function () {
                _this.addPanel(UiManager.HERODETAILSPANEL, true);
            };
            this.onHeroButtonClick = x;
        }
        this.heroButton.addEventListener("onclick", this.onHeroButtonClick, this.heroButton, false);
        this.canvas.addChild(this.heroButton);
    }
    UiManager.replaceCurrentUiManager = function (x) {
        UiManager.uiManager = x;
    };
    UiManager.getCurrentUiManager = function () {
        return UiManager.uiManager;
    };
    UiManager.prototype.addPanel = function (panelType, hasMask) {
        //如需只添加一层面板，则判断是否有遮罩即可
        if (hasMask) {
            this.canvas.addChild(this.mask);
            this.hasMask = true;
        }
        switch (panelType) {
            case UiManager.TASKPANEL:
                this.taskPanel.x = 0;
                this.taskPanel.y = 200;
                this.canvas.addChild(this.taskPanel);
                this.panelStack.push(this.taskPanel);
                break;
            case UiManager.DIALOGPANEL:
                this.dialogPanel.x = 200;
                this.dialogPanel.y = 200;
                this.canvas.addChild(this.dialogPanel);
                this.panelStack.push(this.dialogPanel);
                break;
            case UiManager.HERODETAILSPANEL:
                this.heroDetailsPanel.x = 100;
                this.heroDetailsPanel.y = 100;
                this.canvas.addChild(this.heroDetailsPanel);
                this.panelStack.push(this.heroDetailsPanel);
                break;
        }
    };
    UiManager.prototype.removePanel = function () {
        if (this.panelStack.length >= 1) {
            //如需移除制定面板，则传入面板事例，直接移除相应面板即可
            this.canvas.removeChild(this.panelStack.pop());
            if (this.panelStack.length != 0) {
                //将下层面板至于遮罩层之上
                this.canvas.addChild(this.panelStack[this.panelStack.length - 1]);
            }
            else if (this.hasMask) {
                this.canvas.removeChild(this.mask);
                this.hasMask = false;
            }
        }
    };
    UiManager.prototype.getTaskPanel = function () {
        return this.taskPanel;
    };
    UiManager.prototype.getHeroDetaiksPanel = function () {
        return this.heroDetailsPanel;
    };
    UiManager.prototype.getDialogPanel = function () {
        return this.dialogPanel;
    };
    return UiManager;
}());
UiManager.TASKPANEL = 0;
UiManager.DIALOGPANEL = 1;
UiManager.HERODETAILSPANEL = 2;
