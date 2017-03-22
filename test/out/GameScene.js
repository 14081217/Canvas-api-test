var GameScene = (function () {
    function GameScene(player, map, npc_0, npc_1, monster, main) {
        var _this = this;
        this.player = player;
        this.map = map;
        this.npc_0 = npc_0;
        this.npc_1 = npc_1;
        this.monster = monster;
        this.mainContainer = main;
        TaskService.getInstance().getTaskByCustomRole(function (taskList) {
            _this.taskList = taskList;
        });
        this.initListener();
    }
    GameScene.replaceScene = function (scene) {
        GameScene.scene = scene;
    };
    GameScene.getCurrentScene = function () {
        return GameScene.scene;
    };
    GameScene.prototype.moveTo = function (tiles, callback) {
        console.log("开始移动");
        var moveState = new MoveState(this.player, tiles);
        this.player.Macine.ChangeState(moveState);
    };
    GameScene.prototype.stopMove = function (callback) {
        console.log("取消移动");
        this.player.Macine.ChangeState(new IdleState(this.player));
        callback();
    };
    GameScene.prototype.initListener = function () {
        var _this = this;
        this.commandList = new CommandList();
        this.map.addEventListener("onclick", function (evt) {
            var startTile = new tile();
            startTile.x = Math.floor(_this.player.x / ONETILESIZE);
            startTile.y = Math.floor(_this.player.y / ONETILESIZE);
            var endTile = new tile();
            endTile.x = Math.floor(evt.offsetX / ONETILESIZE);
            endTile.y = Math.floor(evt.offsetY / ONETILESIZE);
            console.log(evt);
            if (_this.map.findWay(startTile, endTile)) {
                _this.commandList.cancel();
                var path = _this.map.getPath();
                _this.commandList.addCommand(new WalkCommand(path));
                _this.commandList.addCommand(new IdleCommand(_this.player));
            }
            _this.commandList.execute();
        }, this.map, false);
        this.npc_0.addEventListener("onclick", function (evt) {
            // var dialogPanel: DialogPanel = DialogPanel.getInstance();
            var dialogPanel = UiManager.getCurrentUiManager().getDialogPanel();
            dialogPanel.addTask(_this.npc_0.getMytask(), _this.npc_0.getId());
            var startTile = new tile();
            startTile.x = Math.floor(_this.player.x / ONETILESIZE);
            startTile.y = Math.floor(_this.player.y / ONETILESIZE);
            var endTile = new tile();
            endTile.x = Math.floor(_this.npc_0.x / ONETILESIZE);
            endTile.y = Math.floor(_this.npc_0.y / ONETILESIZE);
            if (_this.map.findWay(startTile, endTile)) {
                _this.commandList.cancel();
                var path = _this.map.getPath();
                _this.commandList.addCommand(new WalkCommand(path));
                _this.commandList.addCommand(new TalkCommand());
                _this.commandList.addCommand(new IdleCommand(_this.player));
            }
            _this.commandList.execute();
        }, this.npc_0, false);
        this.npc_1.addEventListener("onclick", function (evt) {
            // var dialogPanel: DialogPanel = DialogPanel.getInstance();
            var dialogPanel = UiManager.getCurrentUiManager().getDialogPanel();
            dialogPanel.addTask(_this.npc_1.getMytask(), _this.npc_1.getId());
            var startTile = new tile();
            startTile.x = Math.floor(_this.player.x / ONETILESIZE);
            startTile.y = Math.floor(_this.player.y / ONETILESIZE);
            var endTile = new tile();
            endTile.x = Math.floor(_this.npc_1.x / ONETILESIZE);
            endTile.y = Math.floor(_this.npc_1.y / ONETILESIZE);
            if (_this.map.findWay(startTile, endTile)) {
                _this.commandList.cancel();
                var path = _this.map.getPath();
                _this.commandList.addCommand(new WalkCommand(path));
                _this.commandList.addCommand(new TalkCommand());
                _this.commandList.addCommand(new IdleCommand(_this.player));
            }
            _this.commandList.execute();
        }, this.npc_1, false);
        this.monster.addEventListener("onclick", function (evt) {
            var startTile = new tile();
            startTile.x = Math.floor(_this.player.x / ONETILESIZE);
            startTile.y = Math.floor(_this.player.y / ONETILESIZE);
            var endTile = new tile();
            endTile.x = Math.floor(evt.offsetX / ONETILESIZE);
            endTile.y = Math.floor(evt.offsetY / ONETILESIZE);
            if (_this.map.findWay(startTile, endTile)) {
                _this.commandList.cancel();
                var path = _this.map.getPath();
                _this.commandList.addCommand(new WalkCommand(path));
                _this.commandList.addCommand(new FightCommand(_this.player, _this.monster));
                _this.commandList.addCommand(new IdleCommand(_this.player));
            }
            _this.commandList.execute();
        }, this.monster, false);
    };
    GameScene.getMap = function () {
        return GameScene.scene.map;
    };
    GameScene.prototype.getCommandList = function () {
        return this.commandList;
    };
    GameScene.prototype.notify = function (task) {
        task.getCondition().onAccept(task);
    };
    GameScene.prototype.killMonster = function (x) {
        for (var i = 0; i < this.taskList.length; i++) {
            if (this.taskList[i].getTargetMonster().match(x.getId()) &&
                this.taskList[i].getStatus() == Task.DURING) {
                this.notify(this.taskList[i]);
            }
        }
        this.mainContainer.removeChild(x);
        // setTimeout(()=>{
        //     this.mainContainer.addChild(this.monster);
        //     this.monster.healthChange(5);
        // },this,2000);
    };
    return GameScene;
}());
