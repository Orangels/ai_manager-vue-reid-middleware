<style lang="scss" src="./mark-mgt.scss" scoped></style>
<template>
    <div class="page-component" :class="[this.theme == 'default' ? '':'black']">
        <div class="wrapper-container">
            <div class="content-container @max">
                <div class="anno-content">
                    <div class="anno-l">
                        <div class="anno-l-top">
                            <router-link class="logo" to="/task-center"><i class="vic-icon @logo"></i></router-link>
                            <span class="fast" @click="keyboard">快捷键</span>
                        </div>
                        <template v-if="!keyboardShow">
                            <div class="anno-l-content">
                                <div class="title">标注对象</div>
                                <div class="content-per" :class="{'active':item.id==active}"
                                    v-for="(item,index) in labeList" :key="index" @click="drawRectangle(item)"
                                >
                                    <div class="per-left"> 
                                        <i class="vic-icon @rect" :style="'color:'+item.color"></i> 
                                        {{item.name}} 
                                    </div>
                                    <div class="per-right">
                                        <span class="txt">
                                            <i class="vic-icon" :class="[item.type=='bndbox' ? '@rect':'@yuanxing']"></i>
                                            {{item.type == "bndbox" ? "矩形":"极点"}}
                                        </span>
                                    </div>
                                </div>
                                <div class="line2"></div>
                                <template v-if="tagList.length">
                                    <div class="title">图片标签</div>
                                    <div class="tag-per" v-for="(item, index) in tagList" :key="index+'_tag'">
                                        <div class="type">{{item.tag_name}}</div>
                                        <template v-if="item.operation === 'single'">
                                            <el-radio-group v-model="item.tag_selected">
                                                <el-radio class="radio-per" 
                                                    v-for="(opt, i) in item.tag_option" :key="i+'_radio'" :label="opt.key"
                                                >{{opt.name}}</el-radio>
                                            </el-radio-group>
                                        </template>
                                        <template v-else>
                                            <el-checkbox-group v-model="item.tag_selected">
                                                <el-checkbox v-for="(opt, i) in item.tag_option" :key="i+'_radio'" :label="opt.key">{{opt.name}}</el-checkbox>
                                            </el-checkbox-group>
                                        </template>
                                    </div>
                                </template>
                                <div class="line2"></div>
                            </div>
                            <div class="op-btn1">
                                <div class="txt">{{wholeVar.finished + '/' + wholeVar.total}}</div>
                                <el-progress :show-text="false" :stroke-width="14" :percentage="wholeVar.percentage"></el-progress>
                            </div>
                            <div  class="op-btn2">
                                <el-button class="@normal" size="medium" @click="turnOut">退出</el-button>
                                <el-button class="@normal" size="medium" @click="nextPage('save')">下一张</el-button>
                            </div>
                        </template>
                        <template v-else>
                            <div class="anno-l-keyboard">
                                <div class="key-title">标签对象</div>
                                <div class="key-per">
                                    <span class="key-per-l">对象1</span>
                                    <span class="key-per-r">1</span>
                                </div>
                                <div class="key-per">
                                    <span class="key-per-l">对象2</span>
                                    <span class="key-per-r">2</span>
                                </div>
                                <div class="key-per">
                                    <span class="key-per-l">对象3</span>
                                    <span class="key-per-r">3</span>
                                </div>
                                <div class="tip">以此类推(快捷键1-9)</div>
                                <div class="line3"></div>
                                <div class="key-title">通用</div>
                                <div class="key-per">
                                    <span class="key-per-l">提交</span>
                                    <span class="key-per-r">(Ctrl + S)/Enter</span>
                                </div>
                                <!-- <div class="key-per">
                                    <span class="key-per-l">撤销</span>
                                    <span class="key-per-r">Ctrl + Z</span>
                                </div> -->
                                <div class="key-per">
                                    <span class="key-per-l">复位</span>
                                    <span class="key-per-r">Ctrl + F</span>
                                </div>
                                <div class="key-per">
                                    <span class="key-per-l">退出</span>
                                    <span class="key-per-r">ESC</span>
                                </div>
                                <div class="key-per">
                                    <span class="key-per-l">缩放</span>
                                    <span class="key-per-r">Ctrl + (-/+)</span>
                                </div>
                                
                            </div>
                        </template>
                    </div>
                    <div class="anno-r">
                        <div class="anno-r-top">
                            <div class="input-btn">
                                <span class="t-btn" :class="wholeVar.currentIndex <= 1?'disabled':''" @click="prevPage">
                                    <i class="vic-icon @base-arrow-right"></i>
                                </span>
                                <el-input class="t-txt" type="text" readonly :value="currentImgData.props.src"></el-input>
                                <span class="t-btn" :class="this.wholeVar.currentIndex > this.wholeVar.finished ?'disabled':''" @click="nextPage('next')">
                                    <i class="vic-icon @base-arrow-right"></i>
                                </span>
                            </div>
                            <span class="line1"></span>
                            <div class="zoom">
                                <span class="txt">{{ options.transform }}%</span>
                                <span class="iconbtn" :class="options.transform <= 10?'disabled':''" @click="transToSmall">
                                    <i class="vic-icon @base-reduce"></i>
                                </span>
                                <span class="iconbtn" :class="options.transform >= 200?'disabled':''" @click="transToLarge">
                                    <i class="vic-icon @fangda"></i>
                                </span>
                            </div>
                            <span class="line1"></span>
                            <el-button class="btn btn1 @light-colour" size="medium" @click="clearCanvas">
                                <i class="vic-icon @base-reset"></i>复位
                            </el-button>
                            <!-- <el-button class="btn @light-colour" size="medium" @click="onCollection">
                                <i class="vic-icon @left-collect_solid"></i>
                                {{currentImgData.props.isCollection ? '已收藏':'收藏'}}
                            </el-button> -->
                            <!-- <el-button class="btn @light-colour" size="medium" @click="changeTheme">
                                <i class="vic-icon @left-set_solid"></i>换肤
                            </el-button> -->
                            <!-- <span class="line1"></span> -->
                            <el-button class="btn btn1 @light-colour" size="medium" @click='allSelect'>{{checked ? '全选':'取消全选'}}</el-button>
                            <div class="label-opt">
                                <el-select placeholder="创建的图形类别" multiple collapse-tags 
                                    v-model="labelCreated.value" @change="labelChange"
                                >
                                   
                                    <el-option v-for="(option, i) in labelCreated.option" :key="i"
                                        :label="option.label" :value="option.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </div>
                        <div class="anno-r-content">
                            <canvas-rect ref="canvasPanel" v-if="currentImgData.props.src"
                                :optlayers="options.layers" :optcolor="options.color" :trans="options.transform"
                                :position="options.position"
                                @canvasmouseup="$mouseup" @canvasmousedown="$mousedown" 
                                @changeIsDragging="isDraggingChange" @canvascontextmenu="$contextmenu"
                            >
                                <img id="canvas_img_id" :width="currentImgData.props.domWidth" :src="'//'+currentImgData.props.src" />
                            </canvas-rect>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import CanvasRect from "@components/canvas-rect/canvas-rect-component.vue";
export default {
    components: {
        CanvasRect
    },
    data() {
        return {
            checked:true,
            options: {
                layers: [],
                color: "#0000ff",
                transform: 100, // 缩放 0.1 、0.2 、0.3.... 1.0 、1.1  ... 2.0 ;步长0.1 范围 [0.1, 2.0]
                position: {
                    top: 0,
                    left: 0
                }
            },
            isDragging: false, // true: 拖拽状态; false: 画框线
            layersTemp: [],

            keyboardShow: false, //false : 快捷键展示面板
            active: "",
            labeList: [],// 标注对象
            tagList: [], // 标签列表
            labelCreated: {
                value: [],
                option: [
                    // { label: "", value: 122 }
                ]
            },
            num: 1,
            theme: 'black',
            task_id: '', // 个人任务id
            data_id: '', // 数据集id
            mession_id: '', // 任务id
            is_collection: false, // 是否是收藏跳转过来的
            wholeVar: {
                total: 0,
                finished: 0,
                percentage: 0,
                currentIndex: 0,
                isCollection: false
            },
            currentImgData: {
                id: '',
                props: {
                    src: '',
                    name: '',
                    width: '',
                    height: '',
                    depth: '',
                    isCollection: false,
                    domWidth: 0,
                    domHeight: 0
                },
                labelChecked: [],
                tagChecked: []
            },
            temp_pic_info: [],//获取照片数据时候，后台标签信息暂存，保存时候再回传。后台逻辑是覆盖非update，所以
            whellTime: null
        };
    },
    mounted() {
        this.$nextTick(() => {
            let _this = this;
            this.task_id       = this.$route.query.id || "";
            this.data_id       = this.$route.query.data_id || "";
            this.mession_id    = this.$route.query.mession_id || "";
            this.is_collection = this.$route.query.is_collection === "false" ? false : true;
            async function fn() {
                await _this.getTemplate();;
                await _this.getImgList();
            }
            fn();
            // 
            // window.addEventListener('resize', this.initCanvasDom);
            window.addEventListener('keydown', this.keydownEvent);
            
            document.addEventListener('DOMMouseScroll', this.handlerMouseWhell, false);
            window.onmousewheel = document.onmousewheel = this.handlerMouseWhell
        });
    },
    beforeDestroy() {
        // window.removeEventListener('resize', this.initCanvasDom)
        window.removeEventListener('keydown', this.keydownEvent)
    },
    watch:{
        'labelCreated.value': {
            handler(newVal, oldVal) {
                if(this.labelCreated.option.length>0 && this.labelCreated.option.length == newVal.length){
                    this.checked = false
                }else{
                    this.checked = true;
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        allSelect(){
            let layers = [];
            if(this.checked){
                this.labelCreated.value=[];
                for (let i = 0; i < this.layersTemp.length; i++) {
                       this.labelCreated.value.push(this.layersTemp[i].labelOpt.idx)
                        layers.push(this.layersTemp[i]);
                }
                this.checked = false;
            }else{
                this.labelCreated.value=[];
                this.checked = true;
            }
             let _this = this;
            async function fn() {
                await _this.$refs.canvasPanel.clearCanvas();
                await _this.$set(_this.options, "layers", JSON.parse(JSON.stringify(layers)));
                await _this.$refs.canvasPanel.reshowCanvas();
            }
            fn();
        },
        handlerMouseWhell(event) {
            var delta = 0;
            event = event || window.event;
            if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                delta = event.wheelDelta/120; 
                if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
            } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                delta = -event.detail/3;
            }
            clearTimeout(this.whellTime);
            this.whellTime = setTimeout(() => {
                // if (event.altKey) 
                this.handle(delta, event); 
            }, 100);
        },
        handle(delta, event) {
            if(event.pageX > 280 && event.pageY > 90){
                if(delta > 0){
                    this.transToLarge();
                }else{
                    this.transToSmall();
                }
            }
        },
        // 换肤
        changeTheme() {
            this.theme === 'default' ? (this.theme = 'black') : (this.theme = 'default');
        },
        // 初始化图标宽高
        initCanvasDom(flag) {
            let app = document.getElementById('app').clientHeight;
            document.getElementsByClassName('anno-content')[0].style.height = app + 'px';//初始化高度

            if(!this.currentImgData.props.src) return;

            let ww = document.getElementsByClassName('anno-r-content')[0].clientWidth;
            let hh = document.getElementsByClassName('anno-r-content')[0].clientHeight;
            // 以高为准，计算宽度是否超出当前屏幕
            let _ww = ((hh-40) * this.currentImgData.props.width)/this.currentImgData.props.height;
            let _hh = hh-40;
            if (_ww > (ww-40)) { //超出，则以宽度为准计算当前图片大小
                _ww = (ww-40);
                _hh = ((ww-40) * this.currentImgData.props.height)/this.currentImgData.props.width;
            }
            // let _ww = (hh * this.currentImgData.props.width)/this.currentImgData.props.height;
            // let _hh = hh;
            // if (_ww > ww) { //超出，则以宽度为准计算当前图片大小
            //     _ww = ww;
            //     _hh = (ww * this.currentImgData.props.height)/this.currentImgData.props.width;
            // }
            // let _ww = ((hh-44) * this.currentImgData.props.width)/this.currentImgData.props.height;
            // let _hh = hh;
            // if (_ww > ww) { //超出，则以宽度为准计算当前图片大小
            //     _ww = ww;
            //     _hh = ((ww-44) * this.currentImgData.props.height)/this.currentImgData.props.width;
            // }
            // 
            this.currentImgData.props.domWidth  = _ww;
            this.currentImgData.props.domHeight = _hh;
            // 还有更新已经回显的 框线以及点坐标
            if(flag !== 'init') this.reUpdateLayers();

            this.$set(this.options, 'position', {top: 0, left: 0})
        },
        // DOM 缩放，更新画布内绘图的坐标；即：更新layers
        reUpdateLayers() {
            let layers = [];
            let domWidth   = this.currentImgData.props.domWidth;
            let domHeight  = this.currentImgData.props.domHeight;
            let imgWidth   = this.currentImgData.props.width;
            let imgHeight  = this.currentImgData.props.height;
            for (let i = 0; i < this.layersTemp.length; i++) {
                this.layersTemp[i].x1 = (this.layersTemp[i].x1 * domWidth)/imgWidth;
                this.layersTemp[i].x2 = (this.layersTemp[i].x2 * domWidth)/imgWidth;
                this.layersTemp[i].y1 = (this.layersTemp[i].y1 * domHeight)/imgHeight;
                this.layersTemp[i].y2 = (this.layersTemp[i].y2 * domHeight)/imgHeight;
                this.layersTemp[i].width  = Math.abs(this.layersTemp[i].x1 - this.layersTemp[i].x2);
                this.layersTemp[i].height = Math.abs(this.layersTemp[i].y1 - this.layersTemp[i].y2);

                layers.push(this.layersTemp[i]);
            }
            let _this = this;
            async function fn() {
                await _this.$refs.canvasPanel.clearCanvas();
                await _this.$set(_this.options, "layers", JSON.parse(JSON.stringify(layers)));
                await _this.$refs.canvasPanel.reshowCanvas();
            }
            fn();
        },
        // 缩小
        transToSmall() {
            if(this.options.transform <= 100) return;
            this.$set(this.options, "transform", this.options.transform - 10);
            this.canvasPosition();
        },
        // 放大
        transToLarge() {
            if(this.options.transform >= 200) return;
            this.$set(this.options, "transform", this.options.transform + 10);
            this.canvasPosition();
        },
        canvasPosition() {
            // 可视区域的宽高
            let ww = document.getElementsByClassName('anno-r-content')[0].clientWidth - 40;
            let hh = document.getElementsByClassName('anno-r-content')[0].clientHeight - 40;
            // 初始缩放后的图片大小
            let _ww = this.currentImgData.props.domWidth;
            let _hh = this.currentImgData.props.domHeight;

            // console.log(ww, hh, _ww, _hh, this.options.transform)
            let top = 0, left = 0;
            let trans_ww = _ww * (this.options.transform - 100)/100; // 放大的宽度
            let trans_hh = _hh * (this.options.transform - 100)/100; // 放大的高度
            // 初始宽度有剩余
            if (hh <= _hh) {
                top = trans_hh/2; // 图片缩放比例的一半就是要top的值
                if ((trans_ww+_ww) > ww) {
                    left = trans_ww/2 - (ww - _ww)/2; // 减去图片在可视区域的空白区域; 
                } else {
                    left = 0;
                }
            } else {
                left = trans_ww/2;
                if ((trans_hh+_hh) > hh) {
                    top = trans_hh/2 - (hh - _hh)/2;
                } else {
                    top = 0;
                }
            }
            this.$set(this.options, 'position', {top: top, left: left})
        },
        // 开始画
        drawRectangle(item) {
            this.active = item.id;
            this.$set(this.options, "color", item.color);
            let type = item.type === "bndbox" ? "rect" : "polar";
            this.$refs.canvasPanel.startDrawRect(type);
        },
        // 快捷键 选择 标签对象画图
        keyboardDrawRectangle(index) {
            index = parseInt(index);
            if(index >= 1 && index <= 9){
                let item = this.labeList[index-1];
                if(!item || JSON.stringify(item) == '{}') return;
                this.drawRectangle(item);
            }
        },
        clearCanvas() {
            // 清空canvas划线
            this.$refs.canvasPanel.clearCanvas();
            // 清空临时存储layers
            this.layersTemp = [];
            // 清空下拉选择内容
            this.labelCreated.value  = [];
            this.labelCreated.option = [];
            // 
            this.$set(this.options, "transform", 100);
        },
        $mousedown(e) {
            // console.log(e)
        },
        $mouseup(e) {
            let drawType = this.$refs.canvasPanel.canvasRectObj.drawType;
            if(drawType === "polar") return; // 如果当前是 极点模式那么禁止直行其他操作，等待矩形绘制完成

            if (this.isDragging) {
                // 如果是拖拽，那么更新临时layers；
                // 对比 当前显示的框 中 数据发生改变的 框id；替换相应的框位置数据
                this.updateTempLayers();
            } else {
                //判断是否是画框
                let newVal = this.$refs.canvasPanel.canvasRectObj.layers;
                let optLayers = this.options.layers;
                if(newVal.length !== optLayers.length) {
                    // 如果新建，那么添加新的layer
                    this.addLabelCreated();
                }
            }
            // 清空label的选择状态
            setTimeout(() => { this.active = ""; }, 0);
        },
        $contextmenu(e) {
            let newVal = this.$refs.canvasPanel.canvasRectObj.layers;
            if(!newVal.length) return;
            let rectInLayer = [];
            newVal.forEach((item, index)=>{
                let x_in = e.offsetX >= item.x1 && e.offsetX <= item.x2;
                let y_in = e.offsetY >= item.y1 && e.offsetY <= item.y2;
                if(x_in && y_in){
                    rectInLayer.push(item);
                }
            })
            if(rectInLayer.length == 1){
                let confirm = () => {
                    this.deleLayer(rectInLayer[0]);
                };
                this.$confirm(
                    '<span class="el-message-box__tips">是否要删除当前鼠标所在位置的 '+rectInLayer[0].labelOpt.name+'框</span>',
                    "删除",
                    {
                        dangerouslyUseHTMLString: true,
                        confirm: confirm,
                        confirmButtonText: "确定",
                        cancelButtonText: "取消"
                    }
                );
            }else{
                return;
            }
        },
        // 删除指定其中某一个框；layers中删除其中一个；
        deleLayer(e) {
            this.layersTemp = this.layersTemp.filter((item, index)=>{
                if(item.labelOpt.idx !== e.labelOpt.idx){
                    return item;
                }
            })
            this.labelCreated.value = this.labelCreated.value.filter((item, index)=>{
                if(item !== e.labelOpt.idx){
                    return item;
                }
            })
            this.labelCreated.option = this.labelCreated.option.filter((item, index)=>{
                if(item.value !== e.labelOpt.idx){
                    return item;
                }
            })

            let newlayers = this.options.layers.filter((item, index)=>{
                if(item.labelOpt.idx !== e.labelOpt.idx){
                    return item;
                }
            })
            let _this = this;
            async function fn() {
                await _this.$refs.canvasPanel.clearCanvas();
                await _this.$set(_this.options, "layers", JSON.parse(JSON.stringify(newlayers)));
                await _this.$refs.canvasPanel.reshowCanvas();
            }
            fn();
            
        },
        isDraggingChange(e) {
            this.isDragging = e;
        },
        // 如果是拖拽，那么更新临时layers
        updateTempLayers() {
            // 当前显示的框对象
            let isShowingLayers = [];
            for (let i = 0; i < this.layersTemp.length; i++) {
                if(this.labelCreated.value.indexOf(this.layersTemp[i].labelOpt.idx) >= 0){
                    isShowingLayers.push(this.layersTemp[i]);
                }
            }
            // 框移动后的新对象集
            let newVal = this.$refs.canvasPanel.canvasRectObj.layers;
            // 循环对比，如果有变更那么替换数据
            for (let i = 0; i < newVal.length; i++) {
                for (let j = 0; j < this.layersTemp.length; j++) {
                    let item1 = newVal[i], item2 = this.layersTemp[j];
                    
                    if (item1.labelOpt.idx === item2.labelOpt.idx) {
                        let x1_dif = item1.x1 === item2.x1;
                        let x2_dif = item1.x2 === item2.x2;
                        let y1_dif = item1.y1 === item2.y1;
                        let y2_dif = item1.y2 === item2.y2;
                        if(!(x1_dif && x2_dif && y1_dif && y2_dif)){
                            this.layersTemp[j] = newVal[i];
                        }
                    }
                }
            }
            // 更新当前显示的框对象 this.options.layers
            this.options.layers = newVal;
        },
        // 新创建一个图形，添加图层对应的对象 // 添加layers
        addLabelCreated() {
            let newVal = this.$refs.canvasPanel.canvasRectObj.layers;
            newVal = JSON.parse(JSON.stringify(newVal));
            if (newVal.length) {
                this.labeList.forEach((item, index) => {
                    if (this.active == item.id) {
                        let la = newVal[newVal.length - 1];
                        let idx = item.id + "_" + Math.ceil(Math.random() * 10e10);
                        la.labelOpt = {
                            id:   item.id,
                            name: item.name,
                            type: item.type,
                            idx:  idx
                        };
                        this.options.layers.push(la);
                        this.layersTemp.push(la);
                        this.labelCreated.value.push(idx);
                        this.num += 1;
                    }
                });
            }
            this.updateLabelOpts();
        },
        // 更新 labelCreated
        updateLabelOpts() {
            let opt = [], layers = [], num = 0;
            this.layersTemp.forEach((item, index) => {
                num += 1; this.num = num;
                if(this.labelCreated.value.indexOf(item.labelOpt.idx) >= 0){
                    opt.push({
                        label: item.labelOpt.name + "_" + num,
                        value: item.labelOpt.idx
                    })
                    layers.push(item);
                }else{
                    opt.push({
                        label: item.labelOpt.name + "_" + num,
                        value: item.labelOpt.idx
                    })
                }
            });
            this.$set(this.labelCreated, "option", JSON.parse(JSON.stringify(opt)));
            this.$set(this.options, "layers", JSON.parse(JSON.stringify(layers)));
        },
        // 下拉labelOption change
        labelChange(e) {
            let layers = [];
            for (let i = 0; i < this.layersTemp.length; i++) {
                if (e.indexOf(this.layersTemp[i].labelOpt.idx) >= 0) {
                    layers.push(this.layersTemp[i]);
                }
            }
            let _this = this;
            async function fn() {
                await _this.$refs.canvasPanel.clearCanvas();
                await _this.$set(_this.options, "layers", JSON.parse(JSON.stringify(layers)));
                await _this.$refs.canvasPanel.reshowCanvas();
            }
            fn();
        },
        // 
        // 数据请求
        // 
        // 获取模板数据
        getTemplate() {
            let param = {
                personal_mession_id: this.task_id,
            };
            this.$http.get(this.$api.markMgtTemp, param, true).then($res => {
                let res = $res.data;
                // console.log("模板：", res)
                if (res.code == 0) {
                    // 1
                    let element_tag_list = res.data.element_tag_list; // 标注对象
                    let labeList = [];
                    for(let i=0; i<element_tag_list.length; i++){
                        labeList.push({
                            id:     element_tag_list[i].key,
                            name:   element_tag_list[i].name,
                            type:   element_tag_list[i].tool,
                            color:  element_tag_list[i].color
                        })
                    }
                    this.labeList = labeList;
                    // 1
                    // 2
                    let pic_tag_list = res.data.pic_tag_list; // 标签
                    let tagList = [];
                    for(let i=0; i<pic_tag_list.length; i++){
                        tagList.push({
                            tag_id:       pic_tag_list[i].key,
                            tag_name:     pic_tag_list[i].name,
                            operation:    pic_tag_list[i].operation,
                            tag_option:   pic_tag_list[i].option_list,
                            tag_selected: [],
                        })
                    }
                    this.tagList = tagList;
                    // 2
                    // this.$message({ type: "success", message: "模板查询成功!" });
                } else {
                    this.$message({ type: "warning", message: "模板查询失败!" });
                }
            }).catch($res => {
                this.$message({ type: "warning", message: "模板查询失败!" });
            });
        },
        // 获取照片数据
        getImgList() {
            let param = {
                personal_mession_id: this.task_id, // 个人任务id
                is_collection: this.is_collection, // 是否是收藏跳转过来的
                pic_num: this.wholeVar.currentIndex, // 获取第几张图片 0: 首次进来，取未标注的第一条
                cache_num: 0, // 要缓存数量 0 ：一张   1：三条 
            };
            this.$http.get(this.$api.markMgtData, param, true).then($res => {
                if($res.data.code == 0){
                    let res = $res.data.data;
                    // console.log("数据：", res)
                    if(!res.is_collection && (res.count === res.complete_num)) {
                        this.$router.push({ path: "/task-center"});
                        return;
                    }
                    // 
                    this.wholeVar = {
                        total: res.count,
                        finished: res.complete_num,
                        percentage: Math.round(res.complete_num*100/res.count),
                        currentIndex: res.page_num,
                        isCollection: res.is_collection
                    }
                    // 
                    let picList = res.pic_list[0];
                    this.currentImgData = {
                        id: picList.id,
                        props: {
                            src:    picList.path,
                            name:   picList.name,
                            width:  picList.whd.width,
                            height: picList.whd.height,
                            depth:  picList.whd.depth,
                            isCollection: picList.is_collection,
                            domWidth: 0,
                            domHeight: 0
                        },
                        labelChecked: picList.mark,
                        tagChecked: picList.pic_info
                    }
                    // 
                    this.initCanvasDom('init');
                    setTimeout(() => { this.echoDraw() }, 500);
                }else{
                    this.$message({ type: "warning", message: "照片数据查询失败!" });
                }
            }).catch($res => {
                this.$message({ type: "warning", message: "照片数据查询失败!" });
            });
        },
        // 回显
        echoDraw() {
            this.echoTag();
            this.echoMark();
        },
        // 标注框回显
        echoMark() {
            let opts = this.currentImgData.labelChecked;
            let layers = [];
            let domWidth   = this.currentImgData.props.domWidth;
            let domHeight  = this.currentImgData.props.domHeight;
            let imgWidth   = this.currentImgData.props.width;
            let imgHeight  = this.currentImgData.props.height;
            for (let i = 0; i < opts.length; i++) {
                let idx =  opts[i].key + "_" + Math.ceil(Math.random() * 10e10);
                if(opts[i].tag_tool === "bndbox"){
                    let x1 = (opts[i].coordinate[0].x * domWidth)/imgWidth;
                    let x2 = (opts[i].coordinate[1].x * domWidth)/imgWidth;
                    let y1 = (opts[i].coordinate[0].y * domHeight)/imgHeight;
                    let y2 = (opts[i].coordinate[1].y * domHeight)/imgHeight;
                    layers.push({
                        x1:     x1, y1:     y1,
                        x2:     x2, y2:     y2,
                        width:  Math.abs(x1 - x2),
                        height: Math.abs(y1 - y2),
                        strokeStyle: opts[i].color,
                        drawType: "rect",
                        labelOpt: {
                            id:   opts[i].key,
                            name: opts[i].tag_name,
                            type: opts[i].tag_tool,
                            idx:  idx
                        }
                    })
                }else{
                    let coords = opts[i].coordinate;
                    let Xs = [], Ys = [];
                    for (let i = 0; i < coords.length; i++) {
                        coords[i].x = (coords[i].x * domWidth)/imgWidth;
                        coords[i].y = (coords[i].y * domHeight)/imgHeight;
                        Xs.push(coords[i].x);
                        Ys.push(coords[i].y);
                    }
                    let x1 = Math.min.apply(null, Xs);
                    let x2 = Math.max.apply(null, Xs);
                    let y1 = Math.min.apply(null, Ys);
                    let y2 = Math.max.apply(null, Ys);
                    layers.push({
                        x1:     x1, y1:     y1,
                        x2:     x2, y2:     y2,
                        width:  Math.abs(x1 - x2),
                        height: Math.abs(y1 - y2),
                        strokeStyle: opts[i].color,
                        drawType: "polar",
                        polarData: coords,
                        labelOpt: {
                            id:   opts[i].key,
                            name: opts[i].tag_name,
                            type: opts[i].tag_tool,
                            idx:  idx
                        }
                    })
                }
                
                this.labelCreated.value.push(idx); // 添加下拉选项
                this.num += 1;
            }
            this.layersTemp = JSON.parse(JSON.stringify(layers));

            this.$set(this.options, "layers", JSON.parse(JSON.stringify(layers)));
            setTimeout(() => {
                this.$refs.canvasPanel.echoRectangle();
                this.updateLabelOpts();
            }, 0);
        },
        // 标注标签回显
        echoTag() {
            let nowHasTagArray = [];
            let tagcheck = this.currentImgData.tagChecked;
            for(let i=0; i<this.tagList.length; i++){
                for (let j = 0; j < tagcheck.length; j++) {
                    if(this.tagList[i].tag_id === tagcheck[j].key){
                        if(this.tagList[i].operation === 'single'){
                            this.tagList[i].tag_selected = tagcheck[j].value[0];
                        }else{
                            this.tagList[i].tag_selected = tagcheck[j].value;
                        }
                        nowHasTagArray.push(tagcheck[j].key);
                    }
                }
            }
            // 找出当前模板标签 没有的标签数据，暂存起来，保存回传给后台
            this.temp_pic_info = [];
            for(let i=0; i<tagcheck.length; i++){
                if(nowHasTagArray.indexOf(tagcheck[i].key) == -1){
                    this.temp_pic_info.push(tagcheck[i]);
                }
            }
        },
        // 获取标注对象的属性
        getProps(opt, val, key, res) {
            for (let i = 0; i < opt.length; i++) {
                if(opt[i][key] == val){
                    return opt[i][res];
                }
            }
        },
        // 退出
        turnOut() {
            this.saveInfo();
            this.$router.push({ path: "/task-center"});
        },
        prevPage() {
            if(this.wholeVar.currentIndex <= 1) return;
            this.wholeVar.currentIndex -= 1; // 请求下一页
            this.clearCanvas();
            this.getImgList();
        },
        // 下一页
        nextPage(flag) {
            // 如果是当前表主页面：
            // 是从收藏按钮跳转进来的（this.is_collection == true): 如果当前是取消收藏状态，那么下一次请求数据仍然请求当前页码；
            // 如果是非收藏按钮跳转进来的 ： 那么请求下一次数据页码加一
            if (flag === 'save') {
                this.saveInfo((res)=> {
                    // console.log(this.wholeVar)
                    if(this.wholeVar.currentIndex > (this.wholeVar.finished + 1)) return;
                    if(!(this.is_collection && !this.currentImgData.props.isCollection)){
                        this.wholeVar.currentIndex += 1; // 请求下一页
                        if(this.wholeVar.currentIndex > this.wholeVar.total){
                            this.$router.push({ path: "/task-center"});
                            return;
                        }
                    }
                    this.clearCanvas();
                    this.getImgList();
                });
            } else {
                if(this.wholeVar.currentIndex > this.wholeVar.finished) return;
                if(!(this.is_collection && !this.currentImgData.props.isCollection)){
                    this.wholeVar.currentIndex += 1; // 请求下一页
                    if(this.wholeVar.currentIndex > this.wholeVar.total){
                        // this.$router.push({ path: "/task-center"});
                        this.$message({ type: "warning", message: "已经是最后一张了!" });
                        return;
                    }
                }
                this.clearCanvas();
                this.getImgList();
            }
            
        },
        // 保存
        saveInfo(callback) {
            let tempLayers  = JSON.parse(JSON.stringify(this.layersTemp));
            let tempTagList = JSON.parse(JSON.stringify(this.tagList));
            // 标注信息
            let mark_info   = [];
            let domWidth    = this.currentImgData.props.domWidth;
            let domHeight   = this.currentImgData.props.domHeight;
            let imgWidth    = this.currentImgData.props.width;
            let imgHeight   = this.currentImgData.props.height;

            for (let i = 0; i < tempLayers.length; i++) {
                if(tempLayers[i].drawType === "rect"){
                    mark_info.push({
                        key:  tempLayers[i].labelOpt.id,
                        name: tempLayers[i].labelOpt.name,
                        tool: tempLayers[i].labelOpt.type,
                        color: tempLayers[i].strokeStyle,
                        coordinate: [
                            { 
                                x: Math.floor((tempLayers[i].x1 * imgWidth)/domWidth), 
                                y: Math.floor((tempLayers[i].y1 * imgHeight)/domHeight)
                            }, { 
                                x: Math.floor((tempLayers[i].x2 * imgWidth)/domWidth), 
                                y: Math.floor((tempLayers[i].y2 * imgHeight)/domHeight)
                            }
                        ]
                    });
                }else{
                    mark_info.push({
                        key:  tempLayers[i].labelOpt.id,
                        name: tempLayers[i].labelOpt.name,
                        tool: tempLayers[i].labelOpt.type,
                        color: tempLayers[i].strokeStyle,
                        coordinate: [
                            { 
                                x: Math.floor((tempLayers[i].polarData[0].x * imgWidth)/domWidth), 
                                y: Math.floor((tempLayers[i].polarData[0].y * imgHeight)/domHeight)
                            }, { 
                                x: Math.floor((tempLayers[i].polarData[1].x * imgWidth)/domWidth), 
                                y: Math.floor((tempLayers[i].polarData[1].y * imgHeight)/domHeight)
                            }, { 
                                x: Math.floor((tempLayers[i].polarData[2].x * imgWidth)/domWidth), 
                                y: Math.floor((tempLayers[i].polarData[2].y * imgHeight)/domHeight)
                            }, { 
                                x: Math.floor((tempLayers[i].polarData[3].x * imgWidth)/domWidth), 
                                y: Math.floor((tempLayers[i].polarData[3].y * imgHeight)/domHeight)
                            }
                        ]
                    });
                }
            }
            // 标签信息
            let pic_info = []; let tag_id_arr = [];
            for (let i = 0; i < tempTagList.length; i++) {
                if(tempTagList[i].tag_selected && tempTagList[i].tag_selected.length){
                    pic_info.push({
                        key:  tempTagList[i].tag_id,
                        value: (tempTagList[i].operation === "single") ? [tempTagList[i].tag_selected] :tempTagList[i].tag_selected
                    })                
                }else{
                    // temp_pic_info : 
                    pic_info.push({
                        key: tempTagList[i].tag_id,
                        value: []
                    })
                }
                tag_id_arr.push(tempTagList[i].tag_id)
            }
            // this.temp_pic_info 回传
            for (let i = 0; i < this.temp_pic_info.length; i++) {
                if(tag_id_arr.indexOf(this.temp_pic_info[i].key) == -1){
                    pic_info.push({
                        key:   this.temp_pic_info[i].key,
                        value: this.temp_pic_info[i].value
                    })
                }
            }

            let param = {
                pic_id:     this.currentImgData.id,
				data_id:    this.data_id,
				mession_id: this.mession_id,
				mark_info:  mark_info,
				pic_info:   pic_info
            };
            this.$http.post(this.$api.markMgtData, param, true).then($res => {
                let res = $res.data;
                if (res.code == 0) {
                    if(callback) callback();
                    // this.$message({ type: "success", message: "数据保存成功!" });
                } else {
                    this.$message({ type: "warning", message: "数据保存失败!" });
                }
            });
        },
        // 收藏
        onCollection() {
            let param = {
                collection: !this.currentImgData.props.isCollection,
                pic_id:     this.currentImgData.id,
                data_id:    this.data_id,
                personal_mession_id: this.task_id
            }
            this.$http.get(this.$api.markCollection, param, true).then($res => {
                let res = $res.data;
                if (res.code == 0) {
                    if(this.currentImgData.props.isCollection){
                        this.currentImgData.props.isCollection = false;
                        this.$message({ type: "success", message: "已成功取消收藏!" });
                    }else{
                        this.currentImgData.props.isCollection = true;
                        this.$message({ type: "success", message: "已成功收藏!" });
                    }
                    
                } else {
                    this.$message({ type: "warning", message: "收藏失败!" });
                }
            });
        },
        keyboard() {
            this.keyboardShow = !this.keyboardShow;
        },
        // 快捷键 // 快捷键
        keydownEvent(e) {
            if(this.keyboardShow) return; // 展示面板的时候不能用快捷键
            e=e||window.event;
            e.preventDefault(); //阻止默认行为,会有兼容问题
            switch (true) {
                case (e.code === 'KeyS' && e.ctrlKey):
                    this.nextPage('save');// 保存并下一页  ---  ‘Ctrl’ + ‘s’
                    break;
                case ((e.code === 'Minus' || e.code === '-') && e.ctrlKey):
                    this.transToSmall();// 缩小   ---  ‘Ctrl’ + ‘-’
                    break;
                case ((e.code === 'Equal' || e.code === '+') && e.ctrlKey):
                    this.transToLarge();// 放大   ---  ‘Ctrl’ + ‘+’
                    break;
                case (e.code === 'KeyF' && e.ctrlKey):
                    this.clearCanvas();// 复位   ---  ‘Ctrl’ + ‘f’
                    break;
                case (e.code === 'Escape'):
                    this.turnOut();// 保存退出   ---  ‘esc’
                    break;
                case (e.code === 'ArrowLeft'):
                    this.prevPage();// 上一页   ---  左箭头 ‘’
                    break;
                case (e.code === 'ArrowRight'):
                    this.nextPage();// 下一页   ---  右箭头 ‘’
                    break;
                case (e.code === 'F5'):
                    location.reload();// 页面刷新   ---  ‘F5’
                    break;
                case (e.code.indexOf('Digit') != -1):
                    this.keyboardDrawRectangle(e.key);// 数字快捷键，快速选择标签对象：1-9   ---  ‘1\2\3\4\5\6\7\8\9’
                    break;
                case (e.code === 'KeyZ' && e.ctrlKey):
                    // this.nextPage('save');// 撤销，删除最近一次画框  ---  ‘Ctrl’ + ‘z’
                    break;
                case (e.code === 'KeyC' && e.ctrlKey):
                    // this.nextPage('save');// 复制  ---  ‘Ctrl’ + ‘c’
                    break;
                case (e.code === 'KeyV' && e.ctrlKey):
                    // this.nextPage('save');// 粘贴  ---  ‘Ctrl’ + ‘v’
                    break;
                case (e.code === 'Delete' || e.code === 'Backspace'):
                    // this.nextPage('save');// 删除  ---  Delete 或 Backspace
                    break;
                default:
                    break;
            }
        }
    }
};
</script>