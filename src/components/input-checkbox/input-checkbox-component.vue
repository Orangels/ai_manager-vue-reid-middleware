<style lang="scss" src="./input-checkbox-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "checkall": "全选"
        }
    }
</i18n>

<template>
    <div class="input-checkbox-component">

        <!-- column -->
        <template v-for="(dataColumn, i) in data">
            <el-scrollbar v-if="dataColumn.length" class="input-checkbox-column" :class="{ '@checkall': (checkall && (i === 0)) }">

                <!-- checkall -->
                <div v-if="checkall && (i === 0)" class="input-checkbox-cell @checkall">
                    <el-checkbox v-model="checkAllChecked" :indeterminate="checkAllIndeterminate" @change="handlerCheckAll">
                        {{ $t('checkall') }}
                    </el-checkbox>
                </div>

                <!-- cell -->
                <template v-for="(dataCell, j) in dataColumn">

                    <div v-if="i < data.length - 1" class="input-checkbox-cell @icon-right" :class="{ '@selection': (dataCell.value === selection[i]) }" @click="handlerSelection(dataCell.value, i)">
                        <el-checkbox
                            v-model="map[ dataCell.value ].checked"
                            :indeterminate="map[ dataCell.value ].indeterminate"
                            :disabled="map[ dataCell.value ].disabled"
                            :label="dataCell.value"
                            @change="($event) => { handlerCheckChange($event, dataCell.value, i); $emit('change', dataCell.value, $event); }"
                            @click.native.stop>
                            {{ dataCell.label }}
                        </el-checkbox>
                    </div>

                    <div v-else class="input-checkbox-cell">
                        <el-checkbox
                            v-model="map[ dataCell.value ].checked"
                            :indeterminate="map[ dataCell.value ].indeterminate"
                            :disabled="map[ dataCell.value ].disabled"
                            :label="dataCell.value"
                            @change="($event) => { handlerCheckChange($event, dataCell.value, i); $emit('change', dataCell.value, $event); }">
                            {{ dataCell.label }}
                        </el-checkbox>
                    </div>

                </template>
            </el-scrollbar>
        </template>
    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            map: {
                type: Object
            },

            data: {
                type: Array
            },

            value: {
                type: Array
            },

            checkall: {
                type: Boolean
            }

        },

        watch: {

            data: {

                handler($data) {

                    let leftChanged, a, b, i, j;

                    for (leftChanged = false, i = 0; a = $data[i]; i++) {

                        for (j = 0; b = a[j]; j++) {

                            if (!this.map[ b.value ]) this.handlerChecked(b.value, { checked: (this.value.indexOf(b.value) !== -1), indeterminate: false, disabled: false });

                            if (i > 0) {

                                // 同步为父级的 disabled
                                if (this.map[ this.selection[ i - 1 ] ].disabled) this.handlerChecked(b.value, { disabled: true });

                                // 同步为父级的 checked
                                if (!this.map[ b.value ].disabled && leftChanged) this.handlerChecked(b.value, { checked: this.map[ this.selection[ i - 1 ] ].checked });

                            }

                        }

                        if (this.selection[i] !== undefined && this.map[ this.selection[i] ].changed) leftChanged = true;

                    }

                },

                deep: true

            }

        },

        methods: {

            /**
             * API 方法
             */
            $value() {

                let value, a, i;

                for (value = [], i = 0; (a = this.value[i]) !== undefined; i++) {

                    if (!this.map[a].indeterminate) value.push(a);

                }

                return value;

            },



            handlerSelection($value, $i) {

                if ($value !== this.selection[$i]) {

                    this.selection.splice($i, this.selection.length, $value);

                    this.$emit('selection', this.selection);

                }

            },

            handlerChecked($value, $map) {

                let checked = () => {

                    if ($map.checked !== undefined) {

                        if ($map.checked) {

                            if (this.value.indexOf($value) === -1) this.value.push($value);

                        }

                        else {

                            let i;

                            if ((i = this.value.indexOf($value)) !== -1) this.value.splice(i, 1);

                        }

                    }

                    this.$set(this.map, $value, { ...this.map[ $value ], ...$map });

                };

                let checkAll = () => {

                    let h = () => {

                        let checkedLength, indeterminateLength, a, b, j;

                        for (checkedLength = 0, indeterminateLength = 0, j = 0, a = this.data[0]; b = a[j]; j++) {

                            if (this.map[ b.value ].checked)
                                checkedLength++;

                            if (this.map[ b.value ].indeterminate)
                                indeterminateLength++;

                        }

                        this.checkAllChecked = (checkedLength === a.length);
                        this.checkAllIndeterminate = (checkedLength !== 0 && checkedLength !== a.length || indeterminateLength !== 0);

                    };

                    window.clearTimeout(this.handlerChecked._i), this.handlerChecked._i = window.setTimeout(h, 0);

                };

                checked(), checkAll();

            },

            handlerCheckChange($checked, $value, $i) {

                this.handlerChecked($value, { changed: true, checked: $checked, indeterminate: false });

                // 向右 checked
                if ($value === this.selection[$i]) {

                    let a, b, i, j;

                    for (i = $i + 1; a = this.data[i]; i++) {

                        for (j = 0; b = a[j]; j++) {

                            if (!$checked || !this.map[ b.value ].disabled) this.handlerChecked(b.value, { changed: false, checked: $checked, indeterminate: false });

                        }

                    }

                }

                // 向左 checked、indeterminate
                if (this.data.length - 1 > 0) {

                    let checkedLength, indeterminateLength, a, b, i, j;

                    for (i = ($value === this.selection[$i] ? this.data.length - 1 : $i); i > 0; i--) {

                        for (checkedLength = 0, indeterminateLength = 0, j = 0, a = this.data[i]; b = a[j]; j++) {

                            if (this.map[ b.value ].checked)
                                checkedLength++;

                            if (this.map[ b.value ].indeterminate)
                                indeterminateLength++;

                        }

                        this.handlerChecked(this.selection[ i - 1 ], { changed: (i - 1 === $i), checked: $checked, indeterminate: (checkedLength !== 0 && checkedLength !== a.length || indeterminateLength !== 0) });

                    }

                }

            },

            handlerCheckAll($checked) {

                let a, b, i;

                // 1 清空 value
                for (i in this.value.splice(0), this.map) this.handlerChecked(i, { checked: false, indeterminate: false });

                // 2 执行 checked
                for (i = 0, a = this.data[0]; b = a[i]; i++) this.handlerCheckChange($checked, b.value, 0);

            }

        },

        beforeMount() {

            this._watchers[0].cb.call(this, this.data);

        },

        data() {

            return {
                selection: [],
                checkAllChecked: false,
                checkAllIndeterminate: false
            };

        }

    }

</script>
