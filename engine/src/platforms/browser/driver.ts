namespace engine {
    export let run = (canvas: HTMLCanvasElement) => {

<<<<<<< HEAD
        var stage = new DisplayObjectContainer();
        let context2D = canvas.getContext("2d");
        let render=new CanvasRenderer(stage,context2D);
=======
        var stage = engine.Stage.getInstance();
        stage.setWidth(canvas.width);
        stage.setHeight(canvas.height);
        let context2D = canvas.getContext("2d");
        var currentTarget;                      //鼠标点击时当前的对象
        var startTarget;                        //mouseDown时的对象
        var isMouseDown = false;
        var startPoint = new Point(-1,-1);
        var movingPoint = new Point(0,0);
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
        let lastNow = Date.now();
        let frameHandler = () => {
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
<<<<<<< HEAD
            stage.update();
            render.render();
=======
            stage.draw(context2D);
>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }

        window.requestAnimationFrame(frameHandler);

<<<<<<< HEAD
        let hitResult: DisplayObject;
        let currentX: number;
        let currentY: number;
        let lastX: number;
        let lastY: number;
        let isMouseDown = false;

        window.onmousedown = (e) => {
            isMouseDown = true;
            let targetArray = EventManager.getInstance().targetArray;
            targetArray.splice(0, targetArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
        }

        window.onmousemove = (e) => {
            let targetArray = EventManager.getInstance().targetArray;
            lastX = currentX;
            lastY = currentY;
            currentX = e.offsetX;
            currentY = e.offsetY;
            if (isMouseDown) {
                for (let i = 0; i < targetArray.length; i++) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.eventType.match("onmousemove") &&
                            x.ifCapture == true) {
                            x.func(e);
                        }
                    }
                }
                for (let i = targetArray.length - 1; i >= 0; i--) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.eventType.match("onmousemove") &&
                            x.ifCapture == false) {
                            x.func(e);
                        }
                    }
                }
            }
        }
        window.onmouseup = (e) => {
            isMouseDown = false;
            let targetArray = EventManager.getInstance().targetArray;
            targetArray.splice(0, targetArray.length);
            let newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (let i = 0; i < targetArray.length; i++) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.eventType.match("onclick") &&
                            newHitRusult == hitResult &&
                            x.ifCapture == true) {
                            x.func(e);
                        }
                    }
            }
            for (let i = targetArray.length - 1; i >= 0; i--) {
                    for (let x of targetArray[i].eventArray) {
                        if (x.eventType.match("onclick") &&
                            newHitRusult == hitResult &&
                            x.ifCapture == false) {
                            x.func(e,);
                        }
                    }
            }
        }
        return stage;
    }

    class CanvasRenderer {

        constructor(private stage: DisplayObjectContainer, private context2D: CanvasRenderingContext2D) {

        }

        render() {
            let stage = this.stage;
            let context2D = this.context2D;
            this.renderContainer(stage);
        }

        renderContainer(container: DisplayObjectContainer) {
            for (let child of container.children) {
                let context2D = this.context2D;
                context2D.globalAlpha = child.globalAlpha;
                let m = child.globalMatrix;
                context2D.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);

                if (child.type == "Bitmap") {
                    this.renderBitmap(child as Bitmap);
                }
                else if (child.type == "TextField") {
                    this.renderTextField(child as TextField);
                }
                else if (child.type == "DisplayObjectContainer") {
                    this.renderContainer(child as DisplayObjectContainer);
                }
            }
        }

        renderBitmap(bitmap: Bitmap) {
             if (bitmap.imageCache == null) {
                let img = new Image();
                img.src = bitmap.texture;
                img.onload = () => {
                    this.context2D.drawImage(img, 0, 0);
                    bitmap.imageCache = img;
                }
            } else {
                bitmap.imageCache.src=bitmap.texture;
                this.context2D.drawImage(bitmap.imageCache, 0, 0);
            }
        }

        renderTextField(textField: TextField) {
            this.context2D.fillText(textField.text, 0, 10);
            textField._measureTextWidth = this.context2D.measureText(textField.text).width;
        }
    }
=======
        window.onmousedown = (e) =>{
        let x = e.offsetX - 3;
        let y = e.offsetY - 3;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        Stage.stageX = TouchEventService.stageX;
        Stage.stageY = TouchEventService.stageY;
        startPoint.x = x;
        startPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        currentTarget = stage.hitTest(x,y);
        startTarget = currentTarget;
        TouchEventService.getInstance().toDo();
        isMouseDown = true;
    }

    window.onmouseup = (e) =>{
        let x = e.offsetX - 3;
        let y = e.offsetY - 3;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        Stage.stageX = TouchEventService.stageX;
        Stage.stageY = TouchEventService.stageY;
        var target = stage.hitTest(x,y);
        if(target == currentTarget){
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else{
            TouchEventService.currentType = TouchEventsType.MOUSEUP
        }
        TouchEventService.getInstance().toDo();
        currentTarget = null;
        isMouseDown = false;
    }

    window.onmousemove = (e) =>{
        if(isMouseDown){
            let x = e.offsetX - 3;
            let y = e.offsetY - 3;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            Stage.stageX = TouchEventService.stageX;
            Stage.stageY = TouchEventService.stageY;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            currentTarget = stage.hitTest(x,y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;

        }
    }

        return stage;

    }


>>>>>>> 9659d5682ee0d4ddc1f634f835f90b588f2b496d

}
