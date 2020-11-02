<template>
    <div
        class="canvas-panel"
        ref="canvas_panel"
        :style="{'-webkit-transform': transform, '-moz-transform': transform, 
             '-ms-transform': transform, '-o-transform': transform, 'transform': transform, 
             'top': top+'px', 'left': left+'px'}"
    >
        <!-- 'transform-origin': '0 0'  -->
        <slot></slot>
        <canvas class="canvas_rect" id="canvas_rect" ref="canvas_rect"></canvas>
        <canvas id="canvas_subline" ref="canvas_subline"></canvas>
    </div>
</template>
<script>
import { rectAngle } from "./canvas-rect";
export default {
    props: {
        optlayers: {
            type: Array
        },
        optcolor: {
            type: String
        },
        trans: {
            type: Number
        },
        position: {
            type: Object
        }
    },
    data() {
        return {
            layers: [],
            canvasRectObj: new rectAngle(),
            ctx_l: null,
            transform: "scale(1)",
            drawType: "rect",
            top: 0,
            left: 0 
        };
    },
    mounted() {},
    watch: {
        position: {
            handler(newVal, oldVal) {
                this.left = newVal.left;
                this.top  = newVal.top;
            },
            immediate: true
        },
        trans: {
            handler(newVal, oldVal) {
                this.transform = newVal
                    ? "scale(" + newVal / 100 + ")"
                    : "scale(1)";
            },
            immediate: true
        },
        optcolor: {
            handler(newVal, oldVal) {
                this.canvasRectObj.lineColor = newVal;
            },
            immediate: true
        },
        optlayers: {
            handler(newVal, oldVal) {
                this.layers = newVal;
                this.canvasRectObj.layers = JSON.parse(
                    JSON.stringify(this.layers)
                );
            },
            immediate: true
        },
        "canvasRectObj.operate"(newVal, oldVal) {
            //开始辅助线  (没有任何操作时 && 开启了划线)
            if (newVal === 0 && !this.canvasRectObj.dragging) {
                this.handlerDrawSubLine(true);
            } else {
                this.handlerDrawSubLine(false);
            }
        },
        "canvasRectObj.dragging"(newVal, oldVal) {
            this.$emit("changeIsDragging", newVal);
        },
        "canvasRectObj.drawType": {
            handler(newVal, oldVal) {
                if (oldVal) {
                    // console.log('canvasRectObj.drawType', newVal, oldVal)
                    // console.log('canvasRectObj.layers', this.canvasRectObj.layers)
                    this.drawType = newVal;
                    this.canvasMouseEnter();
                }
            },
            immediate: true
        }
        // "canvasRectObj.layers"(newVal, oldVal) {
        //     // console.log(newVal);
        // }
    },
    methods: {
        init() {
            let w = this.$refs.canvas_rect.offsetWidth;
            let h = this.$refs.canvas_rect.offsetHeight;
            this.canvasRectObj.$init("canvas_rect", w, h);
            this.canvasMouseLeave();
            this.canvasMouseEnter();
        },
        canvasMouseLeave() {
            this.canvasRectObj.c.onmouseleave = () => {
                this.canvasRectObj.c.onmousedown = null;
                this.canvasRectObj.c.onmousemove = null;
                this.canvasRectObj.c.onmouseup = null;
                this.canvasRectObj.c.oncontextmenu = null;
            };
        },
        canvasMouseEnter() {
            this.canvasRectObj.c.onmouseenter = () => {
                this.canvasRectObj.c.onmousedown = this.canvasMouseDown;
                this.canvasRectObj.c.onmousemove = this.canvasMouseMove;
                this.canvasRectObj.c.onmouseup = this.canvasMouseUp;
                this.canvasRectObj.c.oncontextmenu = this.canvasContextMenu;
            };
        },
        canvasMouseDown(e) {
            if (this.drawType === "rect") {
                this.canvasRectObj.mousedown(e);
            } else {
                this.canvasRectObj.mousedown_polar(e);
            }
            this.$emit("canvasmousedown", e);
        },
        canvasMouseMove(e) {
            if (this.drawType === "rect") {
                this.canvasRectObj.mousemove(e);
            } else {
                this.canvasRectObj.mousemove_polar(e);
            }
            this.$emit("canvasmousemove", e);
        },
        canvasMouseUp(e) {
            if (this.drawType === "rect") {
                this.canvasRectObj.mouseup(e);
            } else {
                this.canvasRectObj.mouseup_polar(e);
            }
            this.$emit("canvasmouseup", e);

            // 拖拽生成框 完成后 操作
            this.turnToDrag(); //改变为拖拽状态
        },
        canvasContextMenu(e) {
            this.$emit("canvascontextmenu", e);
            e.preventDefault();
        },

        // 点击对应的label 开始划线
        startDrawRect(type) {
            this.startCreate(false); // 允许划线状态
            this.canvasRectObj.drawType = type;
            this.drawType = type;

            if (this.canvasRectObj.layers.length) {
                this.canvasMouseEnter();
            } else {
                this.init();
            }

            // 整个画板 鼠标进出 辅助线
            this.handlerDrawSubLine(true);
        },
        // 判断是否要开启划线 监听mousemove
        handlerDrawSubLine(flag) {
            if (flag) {
                this.$refs.canvas_panel.addEventListener(
                    "mousemove",
                    this.drawSubLine
                );
                this.$refs.canvas_panel.addEventListener(
                    "mouseout",
                    this.clearSubLine
                );
            } else {
                this.$refs.canvas_panel.removeEventListener(
                    "mousemove",
                    this.drawSubLine
                );
                this.$refs.canvas_panel.removeEventListener(
                    "mouseout",
                    this.clearSubLine
                );
                this.clearSubLine();
            }
        },
        // 清除掉辅助线
        clearSubLine() {
            let w = this.$refs.canvas_subline.offsetWidth,
                h = this.$refs.canvas_subline.offsetHeight;
            if (this.ctx_l) this.ctx_l.clearRect(0, 0, w, h);
        },
        // 画辅助线
        drawSubLine(e) {
            let w = this.$refs.canvas_subline.offsetWidth,
                h = this.$refs.canvas_subline.offsetHeight,
                x = e.offsetX,
                y = e.offsetY;

            let c_l = document.getElementById("canvas_subline");
            c_l.width = w;
            c_l.height = h;
            this.ctx_l = c_l.getContext("2d");

            this.ctx_l.clearRect(0, 0, w, h);
            this.ctx_l.beginPath();
            this.ctx_l.lineWidth = 2;
            this.ctx_l.setLineDash([2, 5]);
            this.ctx_l.strokeStyle = "#88FF1A";
            this.ctx_l.moveTo(0, y);
            this.ctx_l.lineTo(w, y);
            this.ctx_l.stroke();
            this.ctx_l.moveTo(x, 0);
            this.ctx_l.lineTo(x, h);
            this.ctx_l.stroke();
            this.ctx_l.closePath();
        },
        // 开始拖拽-- 划线装态
        startCreate(flag) {
            this.canvasRectObj.dragging = flag; // false:划线状态; true:拖拽状态
        },
        // 由 画线状态 变为 拖拽状态
        turnToDrag() {
            if (this.drawType === "rect") {
                this.canvasRectObj.dragging = true;
                this.handlerDrawSubLine(false);
            }
        },
        // 复位---清空当前所有划线
        clearCanvas() {
            this.canvasRectObj.clear();
        },
        reshowCanvas() {
            this.canvasRectObj.layers = JSON.parse(JSON.stringify(this.layers));
            this.canvasRectObj.reshow();
        },
        // 回显数据
        echoRectangle() {
            this.init();
            this.canvasRectObj.clear();
            this.canvasRectObj.layers = JSON.parse(JSON.stringify(this.layers));
            this.canvasRectObj.reshow();
            this.startCreate(true);
        }
    }
};
</script>
<style lang="scss" scoped>
.canvas-panel {
    // position: absolute;
    // height: 100%;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%);
    img {
        // height: 98%;
    }
    canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        &.canvas_rect {
            z-index: 10;
        }
    }
}
</style>