<style lang="scss" src="./draw-mark-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="draw-mark-component" :class="[ (draw ? '@draw' : ''), cursor ]" @dragover.prevent>

        <!-- 画布 -->
        <div class="draw-mark_canvas" @mouseover="() => { if (draw) draw._$_mark_$_ = null; }" @contextmenu.prevent>

            <!-- 查看时渲染 -->
            <template v-if="!draw">
                <el-tooltip v-for="(mark, i) in mark" :key="i" placement="right-start" :disabled="!$scopedSlots.tip">

                    <template slot="content">
                        <slot name="tip" :mark="mark"></slot>
                    </template>

                    <template>
                        <i class="draw-mark_mark" :class="mark.icon.name" :style="{ 'left': ((mark.x * zoom) + 'px'), 'top': ((mark.y * zoom) + 'px'), 'color': mark.icon.color }"></i>
                    </template>
                </el-tooltip>
            </template>

            <!-- 绘制时渲染 -->
            <template v-else>
                <i v-for="(mark, i) in draw.mark" :key="i" class="draw-mark_mark" :class="mark.icon.name" :style="{ 'left': ((mark.x * zoom) + 'px'), 'top': ((mark.y * zoom) + 'px') }" @mouseover.stop="() => { draw._$_mark_$_ = mark; draw._$_markI_$_ = i; }" draggable></i>
            </template>
        </div>

        <!-- 插槽 -->
        <slot></slot>
    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            size: {
                // {
                //     width: Number,
                //     height: Number
                // }
                //
                type: Object
            },

            zone: {
                // [
                //     {
                //         name: String,
                //         vertex: [
                //             {
                //                 x: Number,
                //                 y: Number
                //             },
                //             ...
                //         ]
                //     },
                //     ...
                // ]
                //
                type: Array
            },

            mark: {
                // [
                //     {
                //         name: String,
                //         icon: {
                //             name: String,
                //             color: String
                //         },
                //         x: Number,
                //         y: Number,
                //         zone: String
                //     },
                //     ...
                // ]
                //
                type: Array
            }

        },

        methods: {

            /**
             * API 方法
             */
            $draw($zone) {

                let mark, a, i;

                for (mark = this.handlerDraw_clear({ _$_zone_$_: $zone }).mark, i = 0; a = this.mark[i]; i++) {

                    if (!$zone || a.zone === $zone) mark.push({ ...a });

                }

                this.handlerDraw(true);

            },

            $shut($save) {

                if ($save) {

                    let markLength, a, b, i, j;

                    outer: for (markLength = this.mark.length, i = 0; a = this.draw.mark[i]; i++) {

                        for (j = 0; b = this.mark[j], j < markLength; j++) {

                            if (b.name === a.name) {

                                b.x = a.x;
                                b.y = a.y;

                                continue outer;

                            }

                        }

                        this.mark.push(a);

                    }

                }

                this.handlerDraw();
                this.handlerDraw_clear();

            },

            $mark($mark) {

                if (this.draw) {

                    let a, i;

                    for (i = 0; a = this.draw.mark[i]; i++) {

                        if (a.name === $mark.name) break;

                    }

                    this.draw.mark.splice(i, 1,
                        {
                            ...this.draw.mark[i],
                            ...{
                                name    : $mark.name,
                                icon    : $mark.icon,
                                x       : this.draw._$_x_$_,
                                y       : this.draw._$_y_$_,
                                zone    : this.draw._$_zone_$_
                            }
                        }
                    );

                }

                else /* !! 不处理 */;

            },



            /**
             * [工具方法] 处理 resize、检查环绕
             */
            handlerResize() {

                this.zoom = this.$el.offsetWidth / this.size.width;

            },

            handlerCheckSurround($x, $y, $zone) {

                let check = ($x, $y, $vertex) => { // https://blog.csdn.net/u283056051/article/details/53981027

                    let sum, p1, p2, a, i, j;

                    for (sum = 0, i = 0, j = $vertex.length - 1; p2 = $vertex[j], p1 = $vertex[i]; j = i++) {

                        sum += (a = Math.atan2((p1.y - $y), (p1.x - $x)) - Math.atan2((p2.y - $y), (p2.x - $x)));
                        sum += ((a >= Math.PI) ? (-Math.PI * 2) : (a <= -Math.PI) ? (Math.PI * 2) : 0);

                    }

                    return Math.round(sum / Math.PI) !== 0;

                };

                let zoneVertex = () => {

                    let a, i;

                    for (i = 0; a = this.zone[i]; i++) {

                        if (a.name === $zone) return a.vertex;

                    }

                };

                return check($x, $y, zoneVertex());

            },

            /**
             * [工具方法] 处理绘制
             */
            handlerDraw($draw) {

                if ($draw) {

                    this.$el.addEventListener('click', this.handlerEvent_leftClick);
                    this.$el.addEventListener('contextmenu', this.handlerEvent_rightClick);
                    this.$el.addEventListener('dragstart', this.handlerEvent_moveStart);
                    this.$el.addEventListener('dragend', this.handlerEvent_moveEnd);
                    this.$el.addEventListener('mousemove', this.handlerEvent_cursor);

                }

                else {

                    this.$el.removeEventListener('click', this.handlerEvent_leftClick);
                    this.$el.removeEventListener('contextmenu', this.handlerEvent_rightClick);
                    this.$el.removeEventListener('dragstart', this.handlerEvent_moveStart);
                    this.$el.removeEventListener('dragend', this.handlerEvent_moveEnd);
                    this.$el.removeEventListener('mousemove', this.handlerEvent_cursor);

                }

            },

            handlerDraw_clear($clear) {

                if ($clear) {

                    return this.draw = {
                        mark        : [],
                        _$_mark_$_  : null,
                        _$_markI_$_ : null,
                        _$_x_$_     : null,
                        _$_y_$_     : null,
                        _$_zone_$_  : null,
                        ...$clear
                    };

                }

                else {

                    this.cursor = '@cursor-default';
                    this.draw = false;

                }

            },

            /**
             * 处理事件
             */
            handlerEvent_leftClick($event) {

                if (!this.draw._$_mark_$_) {

                    let x = this.draw._$_x_$_ = $event.offsetX / this.zoom,
                        y = this.draw._$_y_$_ = $event.offsetY / this.zoom;

                    if (!this.draw._$_zone_$_ || this.handlerCheckSurround(x, y, this.draw._$_zone_$_)) this.$emit('draw-click', this.draw);

                }

            },

            handlerEvent_rightClick($event) {

                if (this.draw._$_mark_$_) this.draw.mark.splice(this.draw._$_markI_$_, 1);

            },

            handlerEvent_moveStart($event) {

                if (!this.draw._$_mark_$_) $event.preventDefault();

            },

            handlerEvent_moveEnd($event) {

                let x = this.draw._$_mark_$_.x + ($event.offsetX - $event.target.offsetWidth / 2) / this.zoom,
                    y = this.draw._$_mark_$_.y + ($event.offsetY - $event.target.offsetHeight / 2) / this.zoom;

                if (x >= 0 && x <= this.size.width && y >= 0 && y <= this.size.height) {

                    if (!this.draw._$_mark_$_.zone || this.handlerCheckSurround(x, y, this.draw._$_mark_$_.zone)) {

                        this.draw._$_mark_$_.x = x;
                        this.draw._$_mark_$_.y = y;

                    }

                }

            },

            handlerEvent_cursor($event) {

                let h = () => {

                    if (this.draw._$_mark_$_)
                        this.cursor = '@cursor-move';

                    else if (!this.draw._$_zone_$_ || this.handlerCheckSurround(($event.offsetX / this.zoom), ($event.offsetY / this.zoom), this.draw._$_zone_$_))
                        this.cursor = '@cursor-add';

                    else
                        this.cursor = '@cursor-default';

                };

                if (!this.handlerEvent_cursor._h) {

                    this.handlerEvent_cursor._h = true, h();
                    this.handlerEvent_cursor._h = false;

                }

            }

        },

        mounted() {

            window.addEventListener('resize', this.handlerResize);
            window.dispatchEvent(
                new Event('resize',
                    {
                        bubbles: true,
                        cancelable: true
                    }
                )
            );

        },

        beforeDestroy() {

            window.removeEventListener('resize', this.handlerResize);

        },

        data() {

            return {
                cursor: '@cursor-default',
                zoom: 1,
                draw: false
            };

        }

    }

</script>
