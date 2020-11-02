
    /**
     * [工具函数] $single-rect
     */
    function $singleRect_addVertex($event) {

        switch (this.draw.vertex.length) {

            case 2 :
                window.setTimeout(() => { this.$el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true })) }, 0);
                break;

            case 3 :
                window.setTimeout(() => { this.$el.dispatchEvent(new Event('click', { bubbles: true, cancelable: true })) }, 0);
                break;

            case 4 :
                this.handlerDraw_moveVertex(this.draw.vertex[0], true);
                this.handlerDraw('create', false);
                this.handlerDraw('move', true);
                break;

        }

    }

    function $singleRect_addVertex_offsetXY($event) {

        switch (this.draw.vertex.length) {

            case 1 :
                $event._$_offsetX_$_ = (Math.abs($event.offsetX - this.draw.vertex[0].x * this.brush.zoom) < Math.abs($event.offsetY - this.draw.vertex[0].y * this.brush.zoom)) ? (this.draw.vertex[0].x * this.brush.zoom) : $event.offsetX;
                $event._$_offsetY_$_ = (Math.abs($event.offsetY - this.draw.vertex[0].y * this.brush.zoom) < Math.abs($event.offsetX - this.draw.vertex[0].x * this.brush.zoom)) ? (this.draw.vertex[0].y * this.brush.zoom) : $event.offsetY;
                break;

            case 2 :
                $event._$_offsetX_$_ = (this.draw.vertex[0].x !== this.draw.vertex[1].x) ? (this.draw.vertex[1].x * this.brush.zoom) : $event.offsetX;
                $event._$_offsetY_$_ = (this.draw.vertex[0].y !== this.draw.vertex[1].y) ? (this.draw.vertex[1].y * this.brush.zoom) : $event.offsetY;
                break;

            case 3 :
                $event._$_offsetX_$_ = (this.draw.vertex[0].x !== this.draw.vertex[1].x) ? (this.draw.vertex[0].x * this.brush.zoom) : (this.draw.vertex[2].x * this.brush.zoom);
                $event._$_offsetY_$_ = (this.draw.vertex[0].y !== this.draw.vertex[1].y) ? (this.draw.vertex[0].y * this.brush.zoom) : (this.draw.vertex[2].y * this.brush.zoom);
                break;

            case 4 :
                $event._$_offsetX_$_ = (this.draw.vertex[0].x * this.brush.zoom);
                $event._$_offsetY_$_ = (this.draw.vertex[0].y * this.brush.zoom);
                break;

        }

    }

    function $singleRect_moveVertexStart($event) {

        let isHorizontalWithPrev = () => {

            let i = (this.draw._$_hoverVertex_$_.i),
                j = (this.draw._$_hoverVertex_$_.i - 1 < 0) ? (this.draw.vertex.length - 1) : (this.draw._$_hoverVertex_$_.i - 1);

            return this.draw.vertex[i].x === this.draw.vertex[j].x;

        };

        let prevIndex = () => {

            let i = (this.draw._$_hoverVertex_$_.i - 1 < 0) ? (this.draw.vertex.length - 1) : (this.draw._$_hoverVertex_$_.i - 1),
                j = (i - 1 < 0) ? (this.draw.vertex.length - 1) : (i - 1),
                k = (i + 1 > this.draw.vertex.length - 1) ? 0 : (i + 1);

            return [ i, j, k ];

        };

        let nextIndex = () => {

            let i = (this.draw._$_hoverVertex_$_.i + 1 > this.draw.vertex.length - 1) ? 0 : (this.draw._$_hoverVertex_$_.i + 1),
                j = (i - 1 < 0) ? (this.draw.vertex.length - 1) : (i - 1),
                k = (i + 1 > this.draw.vertex.length - 1) ? 0 : (i + 1);

            return [ i, j, k ];

        };

        let diagonalIndex = () => {

            let i = (this.draw._$_hoverVertex_$_.i === 2) ? 0 : (this.draw._$_hoverVertex_$_.i === 3) ? 1 : (this.draw._$_hoverVertex_$_.i + 2),
                j = (i - 1 < 0) ? (this.draw.vertex.length - 1) : (i - 1),
                k = (i + 1 > this.draw.vertex.length - 1) ? 0 : (i + 1);

            return [ i, j, k ];

        };

        $event.dataTransfer._isHorizontalWithPrev = isHorizontalWithPrev();
        $event.dataTransfer._prevIndex = prevIndex();
        $event.dataTransfer._nextIndex = nextIndex();
        $event.dataTransfer._diagonalIndex = diagonalIndex();

    }

    function $singleRect_moveVertex($event) {

        let h = () => {

            let p1 = {
                    x: ($event.dataTransfer._isHorizontalWithPrev ? this.draw.vertex[ $event.dataTransfer._prevIndex[2] ].x : this.draw.vertex[ $event.dataTransfer._prevIndex[0] ].x),
                    y: ($event.dataTransfer._isHorizontalWithPrev ? this.draw.vertex[ $event.dataTransfer._prevIndex[0] ].y : this.draw.vertex[ $event.dataTransfer._prevIndex[2] ].y)
                },
                p2 = {
                    x: ($event.dataTransfer._isHorizontalWithPrev ? this.draw.vertex[ $event.dataTransfer._nextIndex[0] ].x : this.draw.vertex[ $event.dataTransfer._nextIndex[1] ].x),
                    y: ($event.dataTransfer._isHorizontalWithPrev ? this.draw.vertex[ $event.dataTransfer._nextIndex[1] ].y : this.draw.vertex[ $event.dataTransfer._nextIndex[0] ].y)
                };

            this.handlerDraw_moveVertex(p1, ...$event.dataTransfer._prevIndex);
            this.handlerDraw_moveVertex(p2, ...$event.dataTransfer._nextIndex);

        };

        // 函数节流
        if (!this._$_drawZonePlugin_$_.drag._h) {

            this._$_drawZonePlugin_$_.drag._h = true, h();
            this._$_drawZonePlugin_$_.drag._h = false;

        }

    }

    function $singleRect_moveVertexEnd($event) {

        let p1 = {
                x: this.draw.vertex[ this.draw._$_moveVertex_$_.i ].x,
                y: this.draw.vertex[ $event.dataTransfer._diagonalIndex[0] ].y
            },
            p2 = {
                x: this.draw.vertex[ $event.dataTransfer._diagonalIndex[0] ].x,
                y: this.draw.vertex[ this.draw._$_moveVertex_$_.i ].y
            };

        this.handlerDraw_moveVertex(p1, ...$event.dataTransfer._prevIndex);
        this.handlerDraw_moveVertex(p2, ...$event.dataTransfer._nextIndex);

    }



    export default {

        '$single-rect': {

            'create': {

                'click' ($event) {

                    $singleRect_addVertex_offsetXY.call(this, $event), $singleRect_addVertex.call(this, $event);

                },

                'mousemove' ($event) {

                    $singleRect_addVertex_offsetXY.call(this, $event);

                }

            },

            'move': {

                'click' ($event) {

                    this.$el.removeEventListener('click', this.handlerMoveEvent_leftClick);
                    this.$el.removeEventListener('click', this._$_drawZonePlugin_$_.click);

                },

                'contextmenu' ($event) {

                    this.$el.removeEventListener('contextmenu', this.handlerMoveEvent_rightClick);
                    this.$el.removeEventListener('contextmenu', this._$_drawZonePlugin_$_.contextmenu);

                },

                'dragstart' ($event) {

                    if (this.draw._$_hoverVertex_$_) $singleRect_moveVertexStart.call(this, $event);

                },

                'drag' ($event) {

                    $singleRect_moveVertex.call(this, $event);

                },

                'dragend' ($event) {

                    $singleRect_moveVertexEnd.call(this, $event);

                }

            }

        },



        /**
         * 添加、移除事件监听
         */
        addEventListener($this, ...$i) {

            if ($i[0]) {

                let _$_drawZonePlugin_$_, a, i;

                for (i in _$_drawZonePlugin_$_ = $this._$_drawZonePlugin_$_ = {}, a = this[ $i[0] ][ $i[1] ]) $this.$el.addEventListener(i, (_$_drawZonePlugin_$_[i] = a[i].bind($this)));

            }

        },

        removeEventListener($this) {

            if ($this._$_drawZonePlugin_$_) {

                for (let i in $this._$_drawZonePlugin_$_) $this.$el.removeEventListener(i, $this._$_drawZonePlugin_$_[i]);

            }

        }

    }
