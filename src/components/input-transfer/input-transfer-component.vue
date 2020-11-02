<style lang="scss" src="./input-transfer-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="input-transfer-component">
        <!-- data -->
        <div class="input-transfer-data">
            <el-tabs v-model="dataIndex" class="@standard">
                <!-- tree -->
                <el-tab-pane
                    v-for="(data, i) in mixData"
                    :key="i"
                    :name="String(i)"
                    :label="data.label"
                >
                    <el-tree
                        ref="dataTree"
                        node-key="id"
                        :data="data.children"
                        :indent="22"
                        :show-checkbox="true"
                        :render-after-expand="false"
                        @check-change="checkChange($data, $checked)"
                    ></el-tree>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- value -->
        <div class="input-transfer-value">
            <div class="input-transfer-value_header">
                <el-checkbox
                    v-if="checkAllValue"
                    v-model="valueCheckedAll"
                    :indeterminate="valueCheckedIndeterminate"
                    @change="($checked) => { $refs.valueTree.setCheckedKeys($checked ? valueUnDisabled : []); }"
                >{{ checkedTitle }}{{ valueChecked }}/{{ value.length }}</el-checkbox>

                <span v-else>{{ checkedTitle }}{{ valueChecked }}/{{ value.length }}</span>
            </div>

            <!-- tree -->
            <div class="input-transfer-value_content">
                <el-tree
                    ref="valueTree"
                    node-key="id"
                    :data="mixValue"
                    :indent="22"
                    :show-checkbox="true"
                    :render-after-expand="false"
                    @check-change="checkChange2($data, $checked)"
                >
                    <!-- node -->
                    <span slot-scope="{ node, data }" class="el-tree-node__label">
                        <template v-if="node.level === 1">
                            {{ data.parent.label }}
                            <i class="vic-icon @base-arrow-right"></i>
                        </template>
                        {{ data.label }}
                    </span>
                </el-tree>
            </div>
        </div>

        <!-- button -->
        <div class="input-transfer-button">
            <!-- add -->
            <el-button
                type="text"
                class="add"
                :disabled="!dataChecked[ dataIndex ]"
                @click="() => { $refs.dataTree[ dataIndex ].setCheckedKeys([]); handlerTransfer(mixData[ dataIndex ].children, mixValue); handlerValue(); dataChecked[ dataIndex ] = 0; }"
            >
                <i class="vic-icon @base-arrow-right"></i>
            </el-button>

            <!-- remove -->
            <el-button
                type="text"
                class="remove"
                :disabled="!valueChecked"
                @click="() => { $refs.valueTree.setCheckedKeys([]); handlerTransfer(mixValue, mixData); handlerValue(); valueChecked = 0; valueCheckedAll = false; valueCheckedIndeterminate = false; }"
            >
                <i class="vic-icon @base-arrow-right"></i>
            </el-button>
        </div>
    </div>
</template>

<script type="text/jsx">
import equals from "equals";

export default {
    props: {
        data: {
            type: Array
        },

        value: {
            type: Array
        },

        checkedTitle: {
            type: String
        },

        checkAllValue: {
            type: Boolean
        },

        disabled: {
            type: Boolean
        }
    },

    watch: {
        value: {
            handler($value) {
                if (
                    $value !== this.valueLastEmit ||
                    !equals($value, this.valueLastEmit)
                ) {
                    this.handlerMixData();
                    this.handlerMixValue();
                }
            },

            deep: true
        },

        disabled() {
            this.handlerMixData();
            this.handlerMixValue();
        }
    },

    methods: {
        handlerTransfer($from, $to) {
            let h = $data => {
                let a, i;

                for (i = 0; (a = $data[i]); i++) {
                    // 递归
                    if (a.children) {
                        if (!h(a.children))
                            if ($data !== this.mixData) $data.splice(i--, 1);
                    }

                    // 执行 transfer
                    else if (a.checked) transfer($data.splice(i--, 1)[0]);
                }

                return $data.length;
            };

            let transfer = $data => {
                let data, children, parent, a, b, i, j;

                // 创建 data
                for (data = [$data], a = $data; (a = a.parent); )
                    data.unshift(a);

                // 转移到 to
                outer: for (
                    children = $to,
                        i =
                            $to === this.mixValue
                                ? ((parent = {
                                      index: data[0].index,
                                      id: data[0].id,
                                      label: data[0].label
                                  }),
                                  1)
                                : 0;
                    (a = data[i]);
                    i++
                ) {
                    for (j = 0; (b = children[j]); j++) {
                        // 如果找到 parent
                        if (a.id === b.id) {
                            children = b.children;
                            parent = b;
                            continue outer;
                        }

                        // 如果已过 index 但未找到 parent
                        else if (a.index < b.index) break;
                    }

                    children.splice(
                        j,
                        0,
                        (parent = {
                            index: a.index,
                            id: a.id,
                            label: a.label,
                            disabled: a.disabled,
                            children: a.children && (children = []),
                            parent: parent
                        })
                    );
                }
            };

            h($from);
        },

        handlerValue($emit) {
            let value = [];

            let h = $data => {
                let a, i;

                for (i = 0; (a = $data[i]); i++) {
                    // 递归
                    if (a.children) h(a.children);
                    // 添加到 value
                    else {
                        if (!a.disabled) this.valueUnDisabled.push(a.id);

                        value.push(a.id);
                    }
                }
            };

            this.valueUnDisabled.splice(0), h(this.mixValue);

            if ($emit !== false)
                this.$emit("input", (this.valueLastEmit = value)),
                    this.$emit("change", value);
        },

        handlerMixData() {
            let index = 0;

            let mix = ($data, $parent) => {
                let data, a, b, i;

                for (data = [], i = 0; (a = $data[i]); i++) {
                    data.push(
                        (b = {
                            index: index++,
                            id: a.id,
                            label: a.label,
                            disabled: a.disabled || this.disabled,
                            parent: $parent
                        })
                    );

                    // 递归
                    if (a.children) b.children = mix(a.children, b);
                }

                return data;
            };

            this.mixData = mix(this.data);
        },

        handlerMixValue() {
            let mix = $data => {
                let a, i;

                for (i = 0; (a = $data[i]); i++) {
                    // 递归
                    if (a.children) mix(a.children);
                    // 选中 checked
                    else if (this.value.indexOf(a.id) !== -1) a.checked = true;
                }
            };

            this.mixValue.splice(0),
                mix(this.mixData),
                this.handlerTransfer(this.mixData, this.mixValue),
                this.handlerValue(false);
        },
        checkChange($data, $checked) {
            if (!$data.children) {
                $data.checked = $checked;
                $set(
                    dataChecked,
                    dataIndex,
                    (dataChecked[dataIndex] || 0) + ($checked ? 1 : -1)
                );
            }
        },
        checkChange2($data, $checked) {
            if (!$data.children) {
                $data.checked = $checked;
                valueChecked += $checked ? 1 : -1;
                valueCheckedAll = valueChecked === value.length;
                valueCheckedIndeterminate =
                    valueChecked !== 0 && valueChecked !== value.length;
            }
        }
    },

    mounted() {
        this.handlerMixData();
        this.handlerMixValue();
    },

    data() {
        return {
            dataIndex: "0",
            dataChecked: [],
            valueLastEmit: [],
            valueUnDisabled: [],
            valueChecked: 0,
            valueCheckedAll: false,
            valueCheckedIndeterminate: false,
            mixData: [],
            mixValue: []
        };
    }
};
</script>
