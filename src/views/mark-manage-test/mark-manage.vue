<style lang="scss" src="./mark-manage.scss" scoped></style>
<template>
    <div class="page-component">
        <div class="wrapper-container">
            <div class="content-container @max">
                <div class="anno-content">
                    <div class="anno-l">
                        <div class="anno-l-top">
                            <span style="padding-left:12px;">返回</span>
                            <span style="float:right;padding-right:12px;">快捷键</span>
                        </div>
                        <div class="anno-l-content">
                            <div class="content-per" :class="{'active':item.id==active}"
                                @click="drawRectangle(item)" v-for="(item,index) in labeList" :key="index"
                            >
                                <span class="per-left">{{item.label}}</span>
                                <span class="per-right">{{item.type}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="anno-r">
                        <div class="anno-r-top">
                            <div class="input-btn">
                                <span class="t-btn">
                                    <i class="vic-icon @base-arrow-right"></i>
                                </span>
                                <span class="t-txt">www.wiwide.com/jpg/face004.jpg</span>
                                <span class="t-btn">
                                    <i class="vic-icon @base-arrow-right"></i>
                                </span>
                            </div>
                            <el-button class="btn @light-colour" size="medium" @click="clearCanvas">
                                <i class="vic-icon @base-reset"></i>复位
                            </el-button>
                            <el-button class="btn @light-colour" size="medium" @click="clearCanvas">
                                <i class="vic-icon @left-collect_solid"></i>收藏
                            </el-button>
                            <el-button class="btn @light-colour" size="medium" @click="clearCanvas">
                                <i class="vic-icon @left-set_solid"></i>设置
                            </el-button>
                            <div class="label-opt">
                                <el-select placeholder="创建的图形类别" multiple collapse-tags 
                                    v-model="labelCreated.value" @change="labelChange"
                                >
                                    <el-option v-for="(option, i) in labelCreated.option"
                                        :key="i" :label="option.label" :value="option.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="anno-r-content">
                            <div class="canvas-panel" ref="canvas_panel">
                                <img src="./draw-zone-background.jpg" />
                                <canvas class="canvas_rect" id="canvas_rect" ref="canvas_rect"></canvas>
                                <canvas id="canvas_subline" ref="canvas_subline"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { rectAngle } from "./canvas";
export default {
    components: {
        // canvasRect
    },
    data() {
        return {
            canvasRectObj: new rectAngle(),
            ctx_l: null,
            layers: [],
            // 数据
            active: "",
            labeList: [
                {
                    id: "001",
                    label: "人脸",
                    type: "矩形"
                },
                {
                    id: "002",
                    label: "喵喵",
                    type: "矩形"
                }
            ],
            isDragging: false, // true: 拖拽状态--调整框线位置状态; false: 画框线
            labelCreated: {
                value: [],
                option: [
                    // {
                    //     label: "",
                    //     value: 122
                    // }
                ]
            },
            num: 1
        };
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                this.echoRectangle();
            }, 500);
            
        });
    },
    watch: {
        "canvasRectObj.operate"(newVal, oldVal) {
            //开始辅助线  (没有任何操作时 && 开启了划线)
            if (newVal === 0 && !this.canvasRectObj.dragging) {
                this.handlerDrawSubLine(true);
            } else {
                this.handlerDrawSubLine(false);
            }
        },
        "canvasRectObj.dragging"(newVal, oldVal) {
            this.isDragging = newVal;
        },
        "canvasRectObj.layers"(newVal, oldVal) {
            console.log(newVal);
        }
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
            this.canvasRectObj.mousedown(e);
        },
        canvasMouseMove(e) {
            this.canvasRectObj.mousemove(e);
        },
        canvasMouseUp(e) {
            this.canvasRectObj.mouseup(e);

            // 如果是划线状态，才添加新的图层对象
            if(!this.isDragging)this.addLabelCreated();

            // 拖拽生成框 完成后 操作
            this.turnToDrag(); //改变为拖拽状态
           
            // 清空label的选择状态
            setTimeout(() => {
                this.active = "";
            }, 0);
        },
        canvasContextMenu(e) {
            // this.canvasRectObj.oncontextmenu(e);
            if (this.canvasRectObj.layers.length >= 1) {
                let layers = JSON.parse(
                    JSON.stringify(this.canvasRectObj.layers)
                );
                if (layers.length >= 1) {
                    layers.length = layers.length - 1; //2:屏蔽点击的时候创建的默认框
                } else {
                    layers.length = 0;
                }

                this.canvasRectObj.clear();
                this.canvasRectObj.layers = layers;
                this.canvasRectObj.reshow();
            }
            e.preventDefault();
        },

        // 回显数据
        echoRectangle(){
            this.init();
            let layers = [
                {"x1":134,"y1":90,"x2":557,"y2":414,"strokeStyle":"#0000ff","labelOpt":{"id": "001", "name": "人脸"}},
                {"x1":444,"y1":192,"x2":833,"y2":537,"strokeStyle":"#0000ff","labelOpt":{"id": "001", "name": "喵喵"}},
                {"x1":54,"y1":37,"x2":914,"y2":657,"strokeStyle":"#0000ff","labelOpt":{"id": "001", "name": "人脸"}}
            ];
            layers.map((item)=>{
                item.width = Math.abs(item.x2-item.x1);
                item.height = Math.abs(item.y2-item.y1);
                item.labelOpt = {
                    id: item.labelOpt.id, name: item.labelOpt.name,
                    value: item.labelOpt.id + Math.ceil(Math.random() * 10e10),
                    label: item.labelOpt.name + "_" + this.num,
                    selected: true
                };
                this.num += 1;
                return item;
            })
            this.layers = layers;
            this.canvasRectObj.clear();
            this.canvasRectObj.layers = JSON.parse(JSON.stringify(layers));
            this.updateLabelOpts();// 更新下拉
            this.canvasRectObj.reshow();
            this.startCreate(true);
        },
        // 点击对应的label 开始划线
        drawRectangle(item) {
            this.active = item.id;
            this.startCreate(false); // 允许划线状态

            if (!this.canvasRectObj.layers.length) this.init();

            // 整个画板 鼠标进出
            this.$refs.canvas_panel.addEventListener(
                "mousemove",
                this.drawSubLine
            );
            this.$refs.canvas_panel.addEventListener(
                "mouseout",
                this.clearSubLine
            );
        },
        // 判断是否要开启划线 监听mousemove
        handlerDrawSubLine(flag) {
            if (flag) {
                this.$refs.canvas_panel.addEventListener(
                    "mousemove",
                    this.drawSubLine
                );
            } else {
                this.$refs.canvas_panel.removeEventListener(
                    "mousemove",
                    this.drawSubLine
                );
                this.clearSubLine();
            }
        },
        // 清除掉辅助线
        clearSubLine() {
            let w = this.$refs.canvas_subline.offsetWidth,
                h = this.$refs.canvas_subline.offsetHeight;
            if(this.ctx_l)this.ctx_l.clearRect(0, 0, w, h);
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
            this.ctx_l.strokeStyle = "#000";
            this.ctx_l.moveTo(0, y);
            this.ctx_l.lineTo(w, y);
            this.ctx_l.stroke();
            this.ctx_l.moveTo(x, 0);
            this.ctx_l.lineTo(x, h);
            this.ctx_l.stroke();
            this.ctx_l.closePath();
        },
        // // 开始拖拽-- 划线装态
        startCreate(flag) {
            this.canvasRectObj.dragging = flag; // false:划线状态; true:拖拽状态
        },
        // 由 画线状态 变为 拖拽状态
        turnToDrag() {
            this.canvasRectObj.dragging = true;
            this.handlerDrawSubLine(false);
            this.clearSubLine();
        },
        // 复位---清空当前所有划线
        clearCanvas() {
            this.canvasRectObj.clear();
        },
        // 新创建一个图形，添加图层对应的对象 // 添加layers
        addLabelCreated() {
            let newVal = this.canvasRectObj.layers;
            if (newVal.length) {
                this.labeList.forEach((item, index) => {
                    if (this.active == item.id) {
                        let la = newVal[newVal.length - 1];
                        la.labelOpt = {
                            id: item.id,
                            name: item.name,
                            value: item.id + "_" + Math.ceil(Math.random() * 10e10),
                            label: item.label + "_" + this.num,
                            selected: true
                        };
                        this.layers.push(la);
                        this.num += 1;
                    }
                });
            }
            this.updateLabelOpts();
        },
        // 更新 labelCreated
        updateLabelOpts() {
            let labelOPT = [],
                labelSelected = [];
            this.layers.forEach((item, index) => {
                labelOPT.push({
                    label: item.labelOpt.label,
                    value: item.labelOpt.value
                });
                if (item.labelOpt.selected)
                    labelSelected.push(item.labelOpt.value);
            });
            this.labelCreated.option = labelOPT;
            this.labelCreated.value = labelSelected;
        },
        // 下拉labelOption change
        labelChange(e) {
            let layers = [];
            for (let i = 0; i < this.layers.length; i++) {
                if (e.indexOf(this.layers[i].labelOpt.value) >= 0) {
                    layers.push(this.layers[i]);
                }
            }
            this.canvasRectObj.clear();
            this.canvasRectObj.layers = layers;
            this.canvasRectObj.reshow();
        }
    }
};
</script>