
/**
 * layers: [{
        width: 630,
        height: 475,
        labelOpt: {value: "001_5075903786", label: "人脸_0", selected: true},//非必须
        strokeStyle: "#0000ff",
        x1: 205,
        x2: 835,
        y1: 66,
        y2: 541
 * }]
 */
class rectAngle {
    constructor() {
        this.c = null;
        this.ctx = null;
        this.startx = 0;//起始x坐标
        this.starty = 0;//起始y坐标
        this.endX;
        this.endY;
        this.eleWidth;
        this.eleHeight;
        this.leftDistance;
        this.topDistance;
        this.flag = 0; //是否点击鼠标的标志 0: 没有点击  1：点击鼠标
        this.operate = 0;//operate操作类型 0 无操作 1 画矩形框 2 拖动矩形框
        this.layers = [];//图层对象组
        this.currentR;//当前点击的矩形框
        this.dragging = false; // 是否是拖拽状态，true可拖拽状态；false划线状态不能拖动
    }
    $init(id, eleWidth, eleHeight) {
        this.eleWidth = eleWidth;
        this.eleHeight = eleHeight;
        this.c = document.getElementById(id);
        this.ctx = this.c.getContext("2d");
        this.c.width = eleWidth;
        this.c.height = eleHeight;
        this.clear();
    }
    mousedown = (e) => {
        this.startx = e.offsetX;
        this.starty = e.offsetY;

        this.currentR = this.isPointInRetc(this.startx, this.starty);
        if (this.currentR) {
            this.leftDistance = this.startx - this.currentR.x1;
            this.topDistance = this.starty - this.currentR.y1;
        }
        this.ctx.strokeRect(this.endX, this.endY, 0, 0);
        this.ctx.strokeStyle = "#0000ff";
        this.ctx.lineWidth = 2;
        this.flag = 1;
    }
    mousemove = (e) => {
        this.endX = e.offsetX;
        this.endY = e.offsetY;
        this.ctx.save();
        this.ctx.setLineDash([5])
        this.c.style.cursor = "default";
        this.ctx.lineWidth = 2;
        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight)
        // 鼠标点击 && 画线操作 && 划线状态
        if (this.flag && this.operate == 1 && !this.dragging) {
            // console.log('按下划线：', this.startx, this.starty, this.endX, this.endY, e)
            this.ctx.strokeRect(this.startx, this.starty, this.endX - this.startx, this.endY - this.starty);
        }
        this.ctx.restore();
        this.reshow(this.endX, this.endY);
    }
    mouseup = (e) => {
        if (this.operate == 1 && !this.dragging) {
            this.layers.push(this.fixPosition({
                x1: this.startx,
                y1: this.starty,
                x2: this.endX,
                y2: this.endY,
                strokeStyle: '#0000ff'
            }))
        } else if (this.operate >= 3) {
            this.fixPosition(this.currentR)
        }

        this.currentR = null;
        this.flag = 0;
        this.reshow(this.endX, this.endY);
        this.operate = 0;
    }
    oncontextmenu = (e) => {
        // this.operate = 0;
        // this.clear();
        // return false;
    }
    echoDraw(x1, y1, x2, y2, w, h, id) {
        this.eleWidth = w;
        this.eleHeight = h;
        this.c = document.getElementById(id);
        this.ctx = this.c.getContext("2d");
        this.c.width = w;
        this.c.height = h;
        this.clear();

        this.startx = x1; this.starty = y1; this.endX = x2; this.endY = y2;
        this.layers.push(this.fixPosition({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            strokeStyle: '#0000ff',
        }))

        this.ctx.restore();
        this.reshow(this.endX, this.endY);
    }
    reshow(x, y) {
        let allNotIn = 1;
        // let layers_reverse = [...this.layers].reverse();
        // layers_reverse.forEach(item => {
        this.layers.forEach(item => {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.rect(item.x1, item.y1, item.width, item.height);
            this.ctx.strokeStyle = item.strokeStyle
            if (x >= (item.x1 - 25) && x <= (item.x1 + 25) && y <= (item.y2 - 25) && y >= (item.y1 + 25)) {
                // this.resizeLeft(item);
            } else if (x >= (item.x2 - 25) && x <= (item.x2 + 25) && y <= (item.y2 - 25) && y >= (item.y1 + 25)) {
                // this.resizeWidth(item);
            } else if (y >= (item.y1 - 25) && y <= (item.y1 + 25) && x <= (item.x2 - 25) && x >= (item.x1 + 25)) {
                // this.resizeTop(item);
            } else if (y >= (item.y2 - 25) && y <= (item.y2 + 25) && x <= (item.x2 - 25) && x >= (item.x1 + 25)) {
                // this.resizeHeight(item);
            } else if (x >= (item.x1 - 25) && x <= (item.x1 + 25) && y <= (item.y1 + 25) && y >= (item.y1 - 25)) {
                if (this.dragging) this.resizeLT(item);
            } else if (x >= (item.x2 - 25) && x <= (item.x2 + 25) && y <= (item.y2 + 25) && y >= (item.y2 - 25)) {
                if (this.dragging) this.resizeWH(item);
            } else if (x >= (item.x1 - 25) && x <= (item.x1 + 25) && y <= (item.y2 + 25) && y >= (item.y2 - 25)) {
                if (this.dragging) this.resizeLH(item);
            } else if (x >= (item.x2 - 25) && x <= (item.x2 + 25) && y <= (item.y1 + 25) && y >= (item.y1 - 25)) {
                if (this.dragging) this.resizeWT(item);
            }
            // 如果（鼠标当前坐标在当前矩形框内 && 是调整状态） 变成拖动
            if (this.ctx.isPointInPath(x, y) && this.dragging) {
                this.render(item);
                allNotIn = 0;
                this.ctx.fillStyle = "rgba(84,153,224,0.7)";
                this.ctx.fill();
            }
            this.ctx.stroke();
        })
        // （按下了鼠标 && 可操作状态 && 变成拖动）
        if (this.flag && this.operate < 3 && allNotIn) {
            this.operate = 1
        }
    }
    render(rect) {
        this.c.style.cursor = "move";
        if (this.flag && this.operate == 0) { this.operate = 2; }
        if (this.flag && this.operate == 2) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 += this.endX - this.leftDistance - this.currentR.x1
            this.currentR.x1 += this.endX - this.leftDistance - this.currentR.x1
            this.currentR.y2 += this.endY - this.topDistance - this.currentR.y1
            this.currentR.y1 += this.endY - this.topDistance - this.currentR.y1
        }
    }
    /** 判断当前点是否在 当前所有图形内 返回当前图形对象*/
    isPointInRetc(x, y) {
        let len = this.layers.length;
        for (let i = 0; i < len; i++) {
            if (this.layers[i].x1 < x && x < this.layers[i].x2 && this.layers[i].y1 < y && y < this.layers[i].y2) {
                return this.layers[i];
            }
        }
    }
    fixPosition(position) {
        if (position.x1 > position.x2) {
            let x = position.x1;
            position.x1 = position.x2;
            position.x2 = x;
        }
        if (position.y1 > position.y2) {
            let y = position.y1;
            position.y1 = position.y2;
            position.y2 = y;
        }
        position.width = position.x2 - position.x1
        position.height = position.y2 - position.y1
        if (position.width < 50 || position.height < 50) {
            position.width = 60;
            position.height = 60;
            position.x2 += position.x1 + 60;
            position.y2 += position.y1 + 60;
        }
        return position
    }
    getCoord() {
        let res = null;
        if (this.layers.length) {
            res = this.layers;
        }
        return res;
    }
    clear() {
        this.layers = [];
        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight);
        this.reshow();
    }
    // 计算鼠标位置，根据位置来拉框调整框线位置 start
    resizeLeft(rect) {
        this.c.style.cursor = "w-resize";
        if (this.flag && this.operate == 0) { this.operate = 3; }
        if (this.flag && this.operate == 3) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x1 = this.endX
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeTop(rect) {
        this.c.style.cursor = "s-resize";
        if (this.flag && this.operate == 0) { this.operate = 4; }
        if (this.flag && this.operate == 4) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.y1 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
        }
    }
    resizeWidth(rect) {
        this.c.style.cursor = "w-resize";
        if (this.flag && this.operate == 0) { this.operate = 5; }
        if (this.flag && this.operate == 5) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 = this.endX
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeHeight(rect) {
        this.c.style.cursor = "s-resize";
        if (this.flag && this.operate == 0) { this.operate = 6; }
        if (this.flag && this.operate == 6) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.y2 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
        }
    }
    resizeLT(rect) {
        this.c.style.cursor = "se-resize";
        if (this.flag && this.operate == 0) { this.operate = 7; }
        if (this.flag && this.operate == 7) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x1 = this.endX
            this.currentR.y1 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeWH(rect) {
        this.c.style.cursor = "se-resize";
        if (this.flag && this.operate == 0) { this.operate = 8; }
        if (this.flag && this.operate == 8) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 = this.endX
            this.currentR.y2 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeLH(rect) {
        this.c.style.cursor = "ne-resize";
        if (this.flag && this.operate == 0) { this.operate = 9; }
        if (this.flag && this.operate == 9) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x1 = this.endX
            this.currentR.y2 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeWT(rect) {
        this.c.style.cursor = "ne-resize";
        if (this.flag && this.operate == 0) { this.operate = 10; }
        if (this.flag && this.operate == 10) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 = this.endX
            this.currentR.y1 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    // 计算鼠标位置，根据位置来拉框调整框线位置 end

}

export { rectAngle }