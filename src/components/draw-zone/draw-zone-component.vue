<style lang="scss" src="./draw-zone-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="draw-zone-component" :class="[ (draw ? '@draw' : ''), cursor ]" @dragover.prevent>
        <slot></slot>
    </div>
</template>

<script type="text/jsx">
import Raphael from "raphael";
import PlugIn from "./draw-zone-plugin";

// 定义皮肤
// 只会执行一次
let Theme = require("./theme.default.json");
// let Theme = require("./theme." + $v.theme + ".json");

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
            //         color: String,
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

        plugIn: {
            type: String
        }
    },

    watch: {
        "zone.length"($i, $j) {
            if ($i < $j) {
                while (this.brush.zone[0]) {
                    this.brush.zone[0].remove();
                    this.brush.zone.splice(0, 1);
                }
            }

            this.handlerDrawZone();
        }
    },

    methods: {
        /**
         * API 方法
         */
        $draw($name) {
            this.handlerDraw_clear(true);

            // 移动
            if ($name !== undefined) {
                let zone, p, i, j;

                for (i = 0; (zone = this.zone[i]); i++) {
                    if (zone.name === $name) {
                        // 1
                        for (j = 0; (p = zone.vertex[j]); j++)
                            this.handlerDraw_addVertex(p, j);
                        this.handlerDraw_moveVertex(zone.vertex[0], true);

                        // 2
                        this.brush.zone[i].hide(),
                            (this.draw._$_zone_$_ = { i });

                        // 3
                        break;
                    }
                }

                this.handlerDraw("move", true);
            }

            // 创建
            else this.handlerDraw("create", true);
        },

        $shut($save) {
            // 保存移动
            if (this.draw._$_zone_$_) {
                if ($save) {
                    this.zone[this.draw._$_zone_$_.i].vertex = [
                        ...this.draw.vertex
                    ];

                    this.handlerDrawZone(this.draw._$_zone_$_.i);
                }

                this.brush.zone[this.draw._$_zone_$_.i].show();
            }

            // 保存创建
            else if (this.draw._$_move_$_) {
                if ($save) {
                    this.zone.push({
                        name: $save.name,
                        color: $save.color,
                        vertex: [...this.draw.vertex]
                    });

                    // 在 watch 中执行
                    // this.handlerDrawZone();
                }
            }

            this.handlerDraw("shut");
            this.handlerDraw_clear();
        },

        $zone($name) {
            let zoneBrush, a, i;

            for (zoneBrush = this.brush.zone, i = 0; (a = this.zone[i]); i++) {
                // 显示
                if (!$name || a.name === $name) zoneBrush[i].show();
                // 隐藏
                else zoneBrush[i].hide();
            }
        },

        /**
         * [工具方法] 处理绘制区域、检查碰撞、检查环绕
         */
        handlerResize() {
            let zoom = (this.brush.zoom =
                this.$el.offsetWidth / this.size.width);

            let h = () => {
                if (this.brush.zone.length) {
                    for (let i = 0; this.brush.zone[i]; i++)
                        this.handlerDrawZone(i);
                }

                if (this.draw && this.draw.vertexBrush.length) {
                    for (let i = 0; this.draw.vertexBrush[i]; i++)
                        this.handlerDraw_moveVertex(
                            this.draw.vertex[i],
                            i,
                            i - 1
                        );

                    // 移动末端
                    if (!this.draw._$_move_$_) {
                        let p;

                        this.handlerDraw_moveVertex(
                            {
                                x: (p = this.draw.borderBrush[
                                    this.draw.vertex.length - 1
                                ].attrs.path[1])[1],
                                y: p[2]
                            },
                            true
                        );
                    } else
                        this.handlerDraw_moveVertex(this.draw.vertex[0], true);
                }
            };

            // 函数节流
            if (!this.handlerResize._h) {
                (this.handlerResize._h = true), h();
                this.handlerResize._h = false;
            }
        },

        handlerDrawZone($i) {
            // 更新
            if ($i !== undefined) {
                let zone, zoneBrush, zonePath, p, j, l;

                for (
                    zone = this.zone[$i],
                        zoneBrush = this.brush.zone[$i],
                        zonePath = "",
                        j = 0,
                        l = zone.vertex.length - 1;
                    (p = zone.vertex[j]);
                    j++
                ) {
                    zonePath += (j !== 0 && " L") || "M";
                    zonePath +=
                        p.x * this.brush.zoom + "," + p.y * this.brush.zoom;
                    zonePath += (j === l && " Z") || "";
                }

                zoneBrush.attr("path", zonePath);
            }

            // 添加
            else if (this.brush.zone.length !== this.zone.length) {
                let zone, zoneBrush, zonePath, p, i, j, l;

                for (i = this.brush.zone.length; (zone = this.zone[i]); i++) {
                    for (
                        zoneBrush = this.canvas.path(),
                            zonePath = "",
                            j = 0,
                            l = zone.vertex.length - 1;
                        (p = zone.vertex[j]);
                        j++
                    ) {
                        zonePath += (j !== 0 && " L") || "M";
                        zonePath +=
                            p.x * this.brush.zoom + "," + p.y * this.brush.zoom;
                        zonePath += (j === l && " Z") || "";
                    }

                    zoneBrush.attr("path", zonePath);
                    zoneBrush.attr("stroke", zone.color);
                    zoneBrush.attr("stroke-width", "4px");
                    this.brush.zone.push(zoneBrush);
                }
            }
        },

        handlerCheckCollision(...$p) {
            let check = ($l1p1, $l1p2, $l2p1, $l2p2) => {
                // https://www.cnblogs.com/flash3d/archive/2012/01/30/2332022.html

                let a =
                        ($l1p2.x - $l1p1.x) * ($l2p1.y - $l1p1.y) -
                        ($l2p1.x - $l1p1.x) * ($l1p2.y - $l1p1.y),
                    b =
                        ($l1p2.x - $l1p1.x) * ($l2p2.y - $l1p1.y) -
                        ($l2p2.x - $l1p1.x) * ($l1p2.y - $l1p1.y),
                    c =
                        ($l2p2.x - $l2p1.x) * ($l1p1.y - $l2p1.y) -
                        ($l1p1.x - $l2p1.x) * ($l2p2.y - $l2p1.y),
                    d =
                        ($l2p2.x - $l2p1.x) * ($l1p2.y - $l2p1.y) -
                        ($l1p2.x - $l2p1.x) * ($l2p2.y - $l2p1.y);

                return a * b < 0 && c * d < 0;
            };

            let checkDrawVertex = () => {
                let vertex, p1, p2, i, j;

                for (
                    vertex = this.draw.vertex, i = 0, j = 1;
                    (p1 = vertex[i]), (p2 = vertex[j]);
                    i++, j++
                ) {
                    if (check($p[0], $p[1], p1, p2)) return true;
                }

                // 如果已完成绘制区域
                // 那么检查 length - 1 ~ 0 的边
                if (this.draw._$_move_$_)
                    if (check($p[0], $p[1], vertex[i], vertex[0])) return true;
            };

            let checkZoneVertex = () => {
                let zone, p1, p2, i, j;

                for (i = 0; (zone = this.zone[i]); i++) {
                    if (!this.draw._$_zone_$_ || this.draw._$_zone_$_.i !== i)
                        for (
                            j = 0;
                            (p2 = zone.vertex[j + 1] || zone.vertex[0]),
                                (p1 = zone.vertex[j]);
                            j++
                        ) {
                            if (check($p[0], $p[1], p1, p2)) return true;
                        }
                }
            };

            return checkDrawVertex() || checkZoneVertex() || false;
        },

        handlerCheckSurround(...$p) {
            let check = ($p, $vertex) => {
                // https://blog.csdn.net/u283056051/article/details/53981027

                let sum, p1, p2, a, i, j;

                for (
                    sum = 0, i = 0, j = $vertex.length - 1;
                    (p2 = $vertex[j]), (p1 = $vertex[i]);
                    j = i++
                ) {
                    sum += a =
                        Math.atan2(p1.y - $p.y, p1.x - $p.x) -
                        Math.atan2(p2.y - $p.y, p2.x - $p.x);
                    sum +=
                        a >= Math.PI
                            ? -Math.PI * 2
                            : a <= -Math.PI
                            ? Math.PI * 2
                            : 0;
                }

                return Math.round(sum / Math.PI) !== 0;
            };

            let checkSurround = () => {
                let zone, i;

                for (i = 0; (zone = this.zone[i]); i++) {
                    if (!this.draw._$_zone_$_ || this.draw._$_zone_$_.i !== i)
                        if (check(zone.vertex[0], $p)) return true;
                }
            };

            let checkSurrounded = () => {
                let zone, i;

                for (i = 0; (zone = this.zone[i]); i++) {
                    if (!this.draw._$_zone_$_ || this.draw._$_zone_$_.i !== i)
                        if (check($p[0], zone.vertex)) return true;
                }
            };

            return $p.length > 1
                ? checkSurround() || false
                : checkSurrounded() || false;
        },

        /**
         * [工具方法] 处理绘制
         */
        handlerDraw($draw, $true) {
            if ($draw === "create") {
                if ($true) {
                    PlugIn.addEventListener(this, this.plugIn, "create");
                    this.$el.addEventListener(
                        "click",
                        this.handlerCreateEvent_leftClick
                    );
                    this.$el.addEventListener(
                        "mousemove",
                        this.handlerCreateEvent_moveVertex
                    );
                    this.$el.addEventListener(
                        "mousemove",
                        this.handlerCreateEvent_cursor
                    );
                } else {
                    PlugIn.removeEventListener(this);
                    this.$el.removeEventListener(
                        "click",
                        this.handlerCreateEvent_leftClick
                    );
                    this.$el.removeEventListener(
                        "mousemove",
                        this.handlerCreateEvent_moveVertex
                    );
                    this.$el.removeEventListener(
                        "mousemove",
                        this.handlerCreateEvent_cursor
                    );
                }
            } else if ($draw === "move") {
                if ($true) {
                    PlugIn.addEventListener(this, this.plugIn, "move");
                    this.$el.addEventListener(
                        "click",
                        this.handlerMoveEvent_leftClick
                    );
                    this.$el.addEventListener(
                        "contextmenu",
                        this.handlerMoveEvent_rightClick
                    );
                    this.$el.addEventListener(
                        "dragstart",
                        this.handlerMoveEvent_moveVertexStart
                    );
                    this.$el.addEventListener(
                        "drag",
                        this.handlerMoveEvent_moveVertex
                    );
                    this.$el.addEventListener(
                        "dragend",
                        this.handlerMoveEvent_moveVertexEnd
                    );
                    this.$el.addEventListener(
                        "mousemove",
                        this.handlerMoveEvent_cursor
                    );
                    this.$el.addEventListener(
                        "mouseover",
                        this.handlerMoveEvent_hover
                    );
                    this.$el.addEventListener(
                        "mouseout",
                        this.handlerMoveEvent_hover
                    );

                    if (!this.draw._$_zone_$_)
                        this.$nextTick(() => this.$emit("move"));
                } else {
                    PlugIn.removeEventListener(this);
                    this.$el.removeEventListener(
                        "click",
                        this.handlerMoveEvent_leftClick
                    );
                    this.$el.removeEventListener(
                        "contextmenu",
                        this.handlerMoveEvent_rightClick
                    );
                    this.$el.removeEventListener(
                        "dragstart",
                        this.handlerMoveEvent_moveVertexStart
                    );
                    this.$el.removeEventListener(
                        "drag",
                        this.handlerMoveEvent_moveVertex
                    );
                    this.$el.removeEventListener(
                        "dragend",
                        this.handlerMoveEvent_moveVertexEnd
                    );
                    this.$el.removeEventListener(
                        "mousemove",
                        this.handlerMoveEvent_cursor
                    );
                    this.$el.removeEventListener(
                        "mouseover",
                        this.handlerMoveEvent_hover
                    );
                    this.$el.removeEventListener(
                        "mouseout",
                        this.handlerMoveEvent_hover
                    );
                }

                this.$el.setAttribute("draggable", $true),
                    (this.draw._$_move_$_ = $true);
            } else if ($draw === "shut") {
                this.handlerDraw("create", false);
                this.handlerDraw("move", false);
            }
        },

        handlerDraw_addVertex($p, $i) {
            let vertex = $p => {
                let vertex = this.canvas.circle(
                    $p.x * this.brush.zoom,
                    $p.y * this.brush.zoom,
                    8
                );

                vertex.attr({
                    fill: "#FFFFFF",
                    stroke: Theme.draw.vertexBrush.rightStroke,
                    "stroke-width": "4px"
                });

                return vertex;
            };

            let border = ($p1, $p2) => {
                let border = this.canvas.path();

                border.insertBefore(this.draw.vertexBrush[0]).attr({
                    path:
                        "M" +
                        $p1.x * this.brush.zoom +
                        "," +
                        $p1.y * this.brush.zoom +
                        " L" +
                        $p2.x * this.brush.zoom +
                        "," +
                        $p2.y * this.brush.zoom,
                    stroke: Theme.draw.borderBrush.rightStroke,
                    "stroke-width": "4px"
                });

                return border;
            };

            this.draw.vertex.splice($i, 0, $p);
            this.draw.vertexBrush.splice($i, 0, vertex($p));
            this.draw.borderBrush.splice(
                $i,
                0,
                border(
                    $p,
                    (!this.draw._$_move_$_ && $p) ||
                        this.draw.vertex[$i + 1] ||
                        this.draw.vertex[0]
                )
            );
            this.handlerDraw_index($i, $i - 1, $i);
        },

        handlerDraw_moveVertex($p, $i, $j, $k) {
            if (
                $p.x >= 0 &&
                $p.y >= 0 &&
                $p.x <= this.size.width &&
                $p.y <= this.size.height
            ) {
                // 移动末端
                if ($i === true) {
                    let p, i;

                    this.draw.borderBrush[
                        (i = this.draw.vertex.length - 1)
                    ].attr(
                        "path",
                        "M" +
                            (p = this.draw.vertex[i]).x * this.brush.zoom +
                            "," +
                            p.y * this.brush.zoom +
                            " L" +
                            $p.x * this.brush.zoom +
                            "," +
                            $p.y * this.brush.zoom
                    );
                } else {
                    let p1 = (this.draw.vertex[$i] = $p),
                        p2 = this.draw.vertex[$j],
                        p3 = this.draw.vertex[$k];

                    // 移动 vertex 时，被执行
                    if (p3)
                        this.draw.borderBrush[$i].attr(
                            "path",
                            "M" +
                                p1.x * this.brush.zoom +
                                "," +
                                p1.y * this.brush.zoom +
                                " L" +
                                p3.x * this.brush.zoom +
                                "," +
                                p3.y * this.brush.zoom
                        );
                    if (p2)
                        this.draw.borderBrush[$j].attr(
                            "path",
                            "M" +
                                p2.x * this.brush.zoom +
                                "," +
                                p2.y * this.brush.zoom +
                                " L" +
                                p1.x * this.brush.zoom +
                                "," +
                                p1.y * this.brush.zoom
                        );

                    this.draw.vertexBrush[$i].attr({
                        cx: p1.x * this.brush.zoom,
                        cy: p1.y * this.brush.zoom
                    });
                }
            }
        },

        handlerDraw_deleteVertex($i, $j, $k) {
            this.draw.vertex.splice($i, 1);
            this.draw.vertexBrush[$i].remove(),
                this.draw.vertexBrush.splice($i, 1);
            this.draw.borderBrush[$i].remove(),
                this.draw.borderBrush.splice($i, 1);

            if ($k > 0) {
                if ($j > $k) $j -= 1;

                $k -= 1;
            }

            this.handlerDraw_index($i, $j, $k);
        },

        handlerDraw_index($i, $j, $k) {
            let vertexBrush, borderBrush, i;

            for (
                i = $i;
                (vertexBrush = this.draw.vertexBrush[i]),
                    (borderBrush = this.draw.borderBrush[i]);
                i++
            ) {
                vertexBrush
                    .unclick()
                    .click(
                        (($vertexBrush, $i, $event) => {
                            $event._$_vertex_$_ = Object.assign($vertexBrush, {
                                i: $i
                            });
                        }).bind(null, vertexBrush, i)
                    )
                    .unmousemove()
                    .mousemove(
                        (($vertexBrush, $i, $event) => {
                            $event._$_vertex_$_ = Object.assign($vertexBrush, {
                                i: $i
                            });
                        }).bind(null, vertexBrush, i)
                    )
                    .unmouseover()
                    .mouseover(
                        (($vertexBrush, $i, $event) => {
                            $event._$_vertex_$_ = Object.assign($vertexBrush, {
                                i: $i
                            });
                            this.draw._$_hoverVertex_$_ = $vertexBrush;
                        }).bind(null, vertexBrush, i)
                    )
                    .unmouseout()
                    .mouseout(
                        (($vertexBrush, $i, $event) => {
                            $event._$_vertex_$_ = Object.assign($vertexBrush, {
                                i: $i
                            });
                            this.draw._$_hoverVertex_$_ = null;
                        }).bind(null, vertexBrush, i)
                    );

                borderBrush
                    .unclick()
                    .click(
                        (($borderBrush, $i, $event) => {
                            $event._$_border_$_ = Object.assign($borderBrush, {
                                i: $i
                            });
                        }).bind(null, borderBrush, i)
                    )
                    .unmousemove()
                    .mousemove(
                        (($borderBrush, $i, $event) => {
                            $event._$_border_$_ = Object.assign($borderBrush, {
                                i: $i
                            });
                        }).bind(null, borderBrush, i)
                    )
                    .unmouseover()
                    .mouseover(
                        (($borderBrush, $i, $event) => {
                            $event._$_border_$_ = Object.assign($borderBrush, {
                                i: $i
                            });
                            this.draw._$_hoverBorder_$_ = $borderBrush;
                        }).bind(null, borderBrush, i)
                    )
                    .unmouseout()
                    .mouseout(
                        (($borderBrush, $i, $event) => {
                            $event._$_border_$_ = Object.assign($borderBrush, {
                                i: $i
                            });
                            this.draw._$_hoverBorder_$_ = null;
                        }).bind(null, borderBrush, i)
                    );
            }

            // 更新前一条边
            if (this.draw._$_move_$_ || $i > 0) {
                let p1 = this.draw.vertex[$j],
                    p2 = this.draw.vertex[$k];

                this.draw.borderBrush[$j].attr(
                    "path",
                    "M" +
                        p1.x * this.brush.zoom +
                        "," +
                        p1.y * this.brush.zoom +
                        " L" +
                        p2.x * this.brush.zoom +
                        "," +
                        p2.y * this.brush.zoom
                );
            }
        },

        handlerDraw_color($color, ...$el) {
            if (typeof $color === "string") {
                if ($el.length === 1) {
                    switch (true) {
                        case $el[0].type === "circle" && $color === "right":
                            $el[0].attr(
                                "stroke",
                                Theme.draw.vertexBrush.rightStroke
                            );
                            break;

                        case $el[0].type === "circle" && $color === "error":
                            $el[0].attr(
                                "stroke",
                                Theme.draw.vertexBrush.errorStroke
                            );
                            break;

                        case $el[0].type === "circle" && $color === "hover":
                            $el[0].attr(
                                "stroke",
                                Theme.draw.vertexBrush.hoverStroke
                            );
                            break;

                        case $el[0].type === "path" && $color === "right":
                            $el[0].attr(
                                "stroke",
                                Theme.draw.borderBrush.rightStroke
                            );
                            break;

                        case $el[0].type === "path" && $color === "error":
                            $el[0].attr(
                                "stroke",
                                Theme.draw.borderBrush.errorStroke
                            );
                            break;

                        case $el[0].type === "path" && $color === "hover":
                            $el[0].attr(
                                "stroke",
                                Theme.draw.borderBrush.hoverStroke
                            );
                            break;
                    }
                } else if ($el.length === 0) {
                    let vertexBrush, borderBrush, i;

                    for (
                        i = 0;
                        (vertexBrush = this.draw.vertexBrush[i]),
                            (borderBrush = this.draw.borderBrush[i]);
                        i++
                    )
                        this.handlerDraw_color($color, vertexBrush),
                            this.handlerDraw_color($color, borderBrush);
                } else {
                    let el, i;

                    for (i = 0; (el = $el[i]); i++)
                        this.handlerDraw_color($color, el);
                }
            }

            // [ $color, $color, ... ]
            else if ($color.length) {
                this.handlerDraw_color($color.shift(), ...$el);

                window.setTimeout(
                    () => this.handlerDraw_color($color, ...$el),
                    200
                );
            }
        },

        handlerDraw_clear($clear) {
            if ($clear) {
                this.draw = {
                    vertex: [],
                    vertexBrush: [],
                    borderBrush: [],
                    _$_zone_$_: false,
                    _$_move_$_: false,
                    _$_moveVertex_$_: null,
                    _$_moveVertexOrigin_$_: null,
                    _$_hoverVertex_$_: null,
                    _$_hoverBorder_$_: null
                };
            } else {
                let vertexBrush, borderBrush, i;

                for (
                    i = 0;
                    (vertexBrush = this.draw.vertexBrush[i]),
                        (borderBrush = this.draw.borderBrush[i]);
                    i++
                ) {
                    vertexBrush.remove();
                    borderBrush.remove();
                }

                this.cursor = "@cursor-default";
                this.draw = false;
            }
        },

        /**
         * 处理 [未完成绘制区域] 的事件
         */
        handlerCreateEvent_leftClick($event) {
            // 闭合 vertex
            if (
                $event._$_vertex_$_ &&
                $event._$_vertex_$_.i === 0 &&
                this.draw.vertex.length >= 3
            ) {
                if (
                    !this.handlerCheckCollision(
                        this.draw.vertex[this.draw.vertex.length - 1],
                        this.draw.vertex[0]
                    ) &&
                    !this.handlerCheckSurround(...this.draw.vertex)
                ) {
                    this.handlerDraw_moveVertex(this.draw.vertex[0], true);
                    this.handlerDraw("create", false);
                    this.handlerDraw("move", true);
                }
            }

            // 添加 vertex
            else {
                let p = {
                    x:
                        ($event._$_offsetX_$_ || $event.offsetX) /
                        this.brush.zoom,
                    y:
                        ($event._$_offsetY_$_ || $event.offsetY) /
                        this.brush.zoom
                };

                if (
                    (this.draw.vertex.length !== 0 &&
                        !this.handlerCheckCollision(
                            this.draw.vertex[this.draw.vertex.length - 1],
                            p
                        )) ||
                    (this.draw.vertex.length === 0 &&
                        !this.handlerCheckSurround(p))
                )
                    this.handlerDraw_addVertex(p, this.draw.vertex.length);
            }
        },

        handlerCreateEvent_moveVertex($event) {
            let h = () => {
                if (this.draw.vertex.length) {
                    if (
                        $event._$_vertex_$_ &&
                        $event._$_vertex_$_.i === 0 &&
                        this.draw.vertex.length >= 3
                    ) {
                        this.handlerDraw_moveVertex(this.draw.vertex[0], true);
                        this.handlerDraw_color(
                            (!this.handlerCheckCollision(
                                this.draw.vertex[this.draw.vertex.length - 1],
                                this.draw.vertex[0]
                            ) &&
                                !this.handlerCheckSurround(
                                    ...this.draw.vertex
                                ) &&
                                "right") ||
                                "error"
                        );
                    } else {
                        let p = {
                            x:
                                ($event._$_offsetX_$_ || $event.offsetX) /
                                this.brush.zoom,
                            y:
                                ($event._$_offsetY_$_ || $event.offsetY) /
                                this.brush.zoom
                        };

                        this.handlerDraw_moveVertex(p, true);
                        this.handlerDraw_color(
                            (!this.handlerCheckCollision(
                                this.draw.vertex[this.draw.vertex.length - 1],
                                p
                            ) &&
                                "right") ||
                                "error"
                        );
                    }
                }
            };

            // 函数节流
            if (!this.handlerCreateEvent_moveVertex._h) {
                (this.handlerCreateEvent_moveVertex._h = true), h();
                this.handlerCreateEvent_moveVertex._h = false;
            }
        },

        handlerCreateEvent_cursor($event) {
            let h = () => {
                if (
                    $event._$_vertex_$_ &&
                    $event._$_vertex_$_.i === 0 &&
                    this.draw.vertex.length >= 3
                ) {
                    if (
                        !this.handlerCheckCollision(
                            this.draw.vertex[this.draw.vertex.length - 1],
                            this.draw.vertex[0]
                        ) &&
                        !this.handlerCheckSurround(...this.draw.vertex)
                    )
                        this.cursor = "@cursor-add";
                    else this.cursor = "@cursor-default";
                } else {
                    let p = {
                        x:
                            ($event._$_offsetX_$_ || $event.offsetX) /
                            this.brush.zoom,
                        y:
                            ($event._$_offsetY_$_ || $event.offsetY) /
                            this.brush.zoom
                    };

                    if (
                        (this.draw.vertex.length !== 0 &&
                            !this.handlerCheckCollision(
                                this.draw.vertex[this.draw.vertex.length - 1],
                                p
                            )) ||
                        (this.draw.vertex.length === 0 &&
                            !this.handlerCheckSurround(p))
                    )
                        this.cursor = "@cursor-add";
                    else this.cursor = "@cursor-default";
                }
            };

            // 函数节流
            if (!this.handlerCreateEvent_cursor._h) {
                (this.handlerCreateEvent_cursor._h = true), h();
                this.handlerCreateEvent_cursor._h = false;
            }
        },

        /**
         * 处理 [已完成绘制区域] 的事件
         */
        handlerMoveEvent_leftClick($event) {
            if (this.draw._$_hoverBorder_$_) {
                let p = {
                    x: $event.offsetX / this.brush.zoom,
                    y: $event.offsetY / this.brush.zoom
                };

                this.handlerDraw_addVertex(
                    p,
                    this.draw._$_hoverBorder_$_.i + 1
                );
            }
        },

        handlerMoveEvent_rightClick($event) {
            if (this.draw._$_hoverVertex_$_ && this.draw.vertex.length > 3) {
                let i = this.draw._$_hoverVertex_$_.i,
                    j =
                        this.draw._$_hoverVertex_$_.i - 1 < 0
                            ? this.draw.vertex.length - 1
                            : this.draw._$_hoverVertex_$_.i - 1,
                    k =
                        this.draw._$_hoverVertex_$_.i + 1 >
                        this.draw.vertex.length - 1
                            ? 0
                            : this.draw._$_hoverVertex_$_.i + 1;

                // 检查碰撞
                if (
                    this.handlerCheckCollision(
                        this.draw.vertex[j],
                        this.draw.vertex[k]
                    )
                ) {
                    this.handlerDraw_color(
                        ["error", "right"],
                        this.draw.vertexBrush[i],
                        this.draw.vertexBrush[j],
                        this.draw.vertexBrush[k],
                        this.draw.borderBrush[i],
                        this.draw.borderBrush[j]
                    );
                } else this.handlerDraw_deleteVertex(i, j, k);
            }
        },

        handlerMoveEvent_moveVertexStart($event) {
            if (this.draw._$_hoverVertex_$_) {
                $event.dataTransfer.setDragImage(new Image(), 0, 0);

                this.draw._$_moveVertex_$_ = this.draw._$_hoverVertex_$_;
                this.draw._$_moveVertexOrigin_$_ = {
                    ...this.draw.vertex[this.draw._$_hoverVertex_$_.i]
                };
            } else $event.preventDefault();
        },

        handlerMoveEvent_moveVertex($event) {
            let h = () => {
                let p = {
                        x: $event.offsetX / this.brush.zoom,
                        y: $event.offsetY / this.brush.zoom
                    },
                    i = this.draw._$_moveVertex_$_.i,
                    j =
                        this.draw._$_moveVertex_$_.i - 1 < 0
                            ? this.draw.vertex.length - 1
                            : this.draw._$_moveVertex_$_.i - 1,
                    k =
                        this.draw._$_moveVertex_$_.i + 1 >
                        this.draw.vertex.length - 1
                            ? 0
                            : this.draw._$_moveVertex_$_.i + 1;

                this.handlerDraw_moveVertex(p, i, j, k);
                this.handlerDraw_color(
                    (!this.handlerCheckCollision(
                        this.draw.vertex[i],
                        this.draw.vertex[j]
                    ) &&
                        !this.handlerCheckCollision(
                            this.draw.vertex[i],
                            this.draw.vertex[k]
                        ) &&
                        !this.handlerCheckSurround(...this.draw.vertex) &&
                        "right") ||
                        "error"
                );
            };

            // 解决首次的 offset 坐标不正确
            if ($event.dataTransfer._movable) {
                // 函数节流
                if (!this.handlerMoveEvent_moveVertex._h) {
                    (this.handlerMoveEvent_moveVertex._h = true), h();
                    this.handlerMoveEvent_moveVertex._h = false;
                }
            } else $event.dataTransfer._movable = true;
        },

        handlerMoveEvent_moveVertexEnd($event) {
            let i = this.draw._$_moveVertex_$_.i,
                j =
                    this.draw._$_moveVertex_$_.i - 1 < 0
                        ? this.draw.vertex.length - 1
                        : this.draw._$_moveVertex_$_.i - 1,
                k =
                    this.draw._$_moveVertex_$_.i + 1 >
                    this.draw.vertex.length - 1
                        ? 0
                        : this.draw._$_moveVertex_$_.i + 1;

            if (
                this.handlerCheckCollision(
                    this.draw.vertex[i],
                    this.draw.vertex[j]
                ) ||
                this.handlerCheckCollision(
                    this.draw.vertex[i],
                    this.draw.vertex[k]
                ) ||
                this.handlerCheckSurround(...this.draw.vertex)
            ) {
                this.handlerDraw_moveVertex(
                    this.draw._$_moveVertexOrigin_$_,
                    i,
                    j,
                    k
                );
                this.handlerDraw_color("right");
            }
        },

        handlerMoveEvent_cursor($event) {
            let h = () => {
                if ($event._$_vertex_$_) this.cursor = "@cursor-move";
                else if ($event._$_border_$_) this.cursor = "@cursor-add";
                else this.cursor = "@cursor-default";
            };

            // 函数节流
            if (!this.handlerMoveEvent_cursor._h) {
                (this.handlerMoveEvent_cursor._h = true), h();
                this.handlerMoveEvent_cursor._h = false;
            }
        },

        handlerMoveEvent_hover($event) {
            switch (true) {
                case Boolean(
                    $event.type === "mouseover" && $event._$_vertex_$_
                ):
                    this.handlerDraw_color("hover", $event._$_vertex_$_);
                    break;

                case Boolean(
                    $event.type === "mouseover" && $event._$_border_$_
                ):
                    this.handlerDraw_color("hover", $event._$_border_$_);
                    break;

                case Boolean($event.type === "mouseout" && $event._$_vertex_$_):
                    this.handlerDraw_color("right", $event._$_vertex_$_);
                    break;

                case Boolean($event.type === "mouseout" && $event._$_border_$_):
                    this.handlerDraw_color("right", $event._$_border_$_);
                    break;
            }
        }
    },

    mounted() {
        window.addEventListener("resize", this.handlerResize);
        window.dispatchEvent(
            new Event("resize", {
                bubbles: true,
                cancelable: true
            })
        );

        this.canvas = Raphael(this.$el, "100%", "100%");
        this.canvas.canvas.addEventListener("contextmenu", $event =>
            $event.preventDefault()
        );
        this.handlerDrawZone();
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.handlerResize);
    },

    data() {
        return {
            cursor: "@cursor-default",
            canvas: null,
            brush: {
                zone: [],
                zoom: 1
            },
            draw: false
        };
    }
};
</script>
