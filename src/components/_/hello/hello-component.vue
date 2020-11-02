<i18n>
    {
        "zh-CN": {
            "hello_title":"你好！"
        }
    }
</i18n>

<template>
    <div class="page-component">
        <!-- 页眉组件 -->
        <header-component>{{$t('hello_title')}}</header-component>

        <!-- 页眉筛选组件、頁眉輸入框 -->
        <header-filter-component>
            <!-- 单选下拉列表 -->
            <header-select-component v-model="inputSelect.value" placeholder="列表" clearable>
                <el-option
                    v-for="(option, i) in inputSelect.option"
                    :key="i"
                    :label="option.label"
                    :value="option.value"
                ></el-option>
            </header-select-component>

            <!-- 多选下拉列表 -->
            <header-select-component
                v-model="inputSelect.multipleValue"
                placeholder="多选列表"
                multiple
                collapse-tags
            >
                <el-option
                    v-for="(option, i) in inputSelect.option"
                    :key="i"
                    :label="option.label"
                    :value="option.value"
                ></el-option>
            </header-select-component>

            <!-- 级联下拉列表 -->
            <header-cascader-component
                v-model="inputCascader.value"
                :data="inputCascader.data"
                placeholder="级联列表"
                label-separator="/"
                label-max-width="50px"
                @selection="handlerInputCascader_Selection"
                @change="handlerInputCascader_Change"
                clearable
            ></header-cascader-component>

            <!-- 日期输入框 -->
            <header-datepicker-component
                type="date"
                v-model="inputDatepicker.value"
                placeholder="日期"
                clearable
            ></header-datepicker-component>

            <!-- 范围日期输入框 -->
            <header-datepicker-component
                type="daterange"
                v-model="inputDatepicker.rangeValue"
                placeholder="范围日期"
                clearable
            ></header-datepicker-component>

            <!-- 时间输入框 -->
            <header-timepicker-component
                type="time"
                v-model="inputTimepicker.value"
                placeholder="时间"
                clearable
            ></header-timepicker-component>

            <!-- 范围时间输入框 -->
            <header-timepicker-component
                type="timerange"
                v-model="inputTimepicker.rangeValue"
                placeholder="范围时间"
                clearable
            ></header-timepicker-component>

            <!-- 右側 -->
            <template slot="right">
                <!-- 搜索框 -->
                <input-search-component v-model="inputSearch.value"></input-search-component>

                <!-- 按钮 -->
                <el-button size="medium" class="@normal" style="margin-left: 16px;">右侧按钮</el-button>
            </template>
        </header-filter-component>

        <!-- 批量操作、对话框、弹出框、文字提示、消息提示 -->
        <div class="wrapper-container">
            <!-- 批量操作、v-loading -->
            <div class="content-container @max">
                <batch-operation-component
                    v-bind="batchOperation"
                    @click-view-selected
                    @click-view-all
                    @click-clear-selected
                    @click-batch-export
                    @click-batch-import
                    @click-batch-edit
                    @click-batch-delete
                ></batch-operation-component>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { batchOperation.hide = false; }"
                    >显示批量操作</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { batchOperation.hide = true; }"
                    >隐藏批量操作</el-button>
                </div>

                <div style="position: relative; z-index: 0; height: 200px;" v-loading="true"></div>
            </div>

            <!-- 路由对话框 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <h5>对话框（路由跳转方式）</h5>
                </div>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerRightDialog(true, { closeOnPressEscape: false, closeOnClickModal: false, width: 'auto' }); }"
                    >右侧对话框</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerPlainDialog(true); }"
                    >普通对话框</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerRightDialog(true, { closeOnPressEscape: false, closeOnClickModal: false, width: 'max' }); }"
                    >宽 max 的右侧对话框</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerRightDialog(true, { closeOnPressEscape: false, closeOnClickModal: false, width: 'large' }); }"
                    >宽 large 的右侧对话框</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerRightDialog(true, { closeOnPressEscape: false, closeOnClickModal: false, width: 'small' }); }"
                    >宽 small 右侧对话框</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerRightDialog(true, { closeOnPressEscape: true, closeOnClickModal: false, width: 'auto' }); }"
                    >点击 [ESC] 可关闭的右侧对话框</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerRightDialog(true, { closeOnPressEscape: false, closeOnClickModal: true, width: 'auto' }); }"
                    >点击 [空白处] 可关闭的右侧对话框</el-button>
                </div>
            </div>

            <!-- 组件对话框 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <h5>对话框（组件引用方式）</h5>
                </div>

                <div style="margin: 16px;">
                    <el-button size="small" class="@light-gray-colour"
                        @click="handlerComponentDialog(true, false, false, 'auto')"
                    >右侧对话框</el-button>
                    <el-button size="small" class="@light-gray-colour"
                        @click="() => { handlerPlainDialog(true); }"
                    >普通对话框</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="small" class="@light-gray-colour" 
                        @click="handlerComponentDialog(true, false, false, 'max')"
                    >宽 max 的右侧对话框</el-button>
                    <el-button size="small" class="@light-gray-colour"
                        @click="handlerComponentDialog(true, false, false, 'large')"
                    >宽 large 的右侧对话框</el-button>
                    <el-button size="small" class="@light-gray-colour"
                        @click="handlerComponentDialog(true, false, false, 'small')"
                    >宽 small 右侧对话框</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="small" class="@light-gray-colour"
                        @click="handlerComponentDialog(true, true, false, 'auto')"
                    >点击 [ESC] 可关闭的右侧对话框</el-button>
                    <el-button size="small" class="@light-gray-colour"
                        @click="handlerComponentDialog(true, false, true, 'auto')"
                    >点击 [空白处] 可关闭的右侧对话框</el-button>
                </div>
            </div>

            <!-- 警告、确定对话框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerAlertDialog(); }"
                    >警告对话框</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerConfirmDialog(); }"
                    >确定对话框</el-button>
                </div>
            </div>

            <!-- 弹出框、文字提示 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-popover placement="top-start">
                        <template slot="reference">
                            <el-button size="small" class="@light-gray-colour">弹出框</el-button>
                        </template>
                        <template>
                            <div style="margin: 16px;">这是一条弹出消息</div>
                        </template>
                    </el-popover>
                </div>

                <div style="margin: 16px;">
                    <el-tooltip placement="top-start" content="这是一条文字提示">
                        <el-button size="small" class="@light-gray-colour">文字提示</el-button>
                    </el-tooltip>
                </div>

                <div style="margin: 16px;">
                    <el-tooltip placement="top-start">
                        <template>
                            <el-button size="small" class="@light-gray-colour">两行的文字提示</el-button>
                        </template>
                        <template slot="content">
                            <div class="el-tooltip__2-lines-content">
                                两行的文字提示
                                <br />两行的文字提示
                            </div>
                        </template>
                    </el-tooltip>
                    <el-tooltip placement="top-start">
                        <template>
                            <el-button size="small" class="@light-gray-colour">有标题的文字提示</el-button>
                        </template>
                        <template slot="content">
                            <div class="el-tooltip__title">标题</div>
                            <div class="el-tooltip__content">
                                有标题的文字提示
                                <br />有标题的文字提示
                            </div>
                        </template>
                    </el-tooltip>
                </div>
            </div>

            <!-- 消息提示 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerMessage('info', '这是一条消息提示'); }"
                    >消息提示</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerMessage(null, '这是一条无 icon 的消息提示'); }"
                    >无 icon 的消息提示</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerMessage('success', '这是一条正常的消息提示'); }"
                    >正常的消息提示</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerMessage('warning', '这是一条警告的消息提示'); }"
                    >警告的消息提示</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { handlerMessage('error', '这是一条错误的消息提示'); }"
                    >错误的消息提示</el-button>
                </div>
            </div>
        </div>

        <!-- 按钮、标签 -->
        <div class="wrapper-container">
            <!-- @normal 的按钮 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button size="large" class="@normal">
                        <i class="vic-icon @base-add"></i> 大号按钮
                    </el-button>
                    <el-button size="large" class="@normal">大号按钮</el-button>
                    <el-button size="large" class="@normal" disabled>大号按钮</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="medium" class="@normal">
                        <i class="vic-icon @base-add"></i> 中号按钮
                    </el-button>
                    <el-button size="medium" class="@normal">中号按钮</el-button>
                    <el-button size="medium" class="@normal" disabled>中号按钮</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="small" class="@normal">
                        <i class="vic-icon @base-add"></i> 小号按钮
                    </el-button>
                    <el-button size="small" class="@normal">小号按钮</el-button>
                    <el-button size="small" class="@normal" disabled>小号按钮</el-button>
                </div>
            </div>

            <!-- @light-colour 的按钮 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button size="large" class="@light-colour">
                        <i class="vic-icon @base-add"></i> 大号按钮
                    </el-button>
                    <el-button size="large" class="@light-colour">大号按钮</el-button>
                    <el-button size="large" class="@light-colour" disabled>大号按钮</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="medium" class="@light-colour">
                        <i class="vic-icon @base-add"></i> 中号按钮
                    </el-button>
                    <el-button size="medium" class="@light-colour">中号按钮</el-button>
                    <el-button size="medium" class="@light-colour" disabled>中号按钮</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="small" class="@light-colour">
                        <i class="vic-icon @base-add"></i> 小号按钮
                    </el-button>
                    <el-button size="small" class="@light-colour">小号按钮</el-button>
                    <el-button size="small" class="@light-colour" disabled>小号按钮</el-button>
                </div>
            </div>

            <!-- @light-gray-colour 的按钮 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button size="large" class="@light-gray-colour">
                        <i class="vic-icon @base-add"></i> 大号按钮
                    </el-button>
                    <el-button size="large" class="@light-gray-colour">大号按钮</el-button>
                    <el-button size="large" class="@light-gray-colour" disabled>大号按钮</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="medium" class="@light-gray-colour">
                        <i class="vic-icon @base-add"></i> 中号按钮
                    </el-button>
                    <el-button size="medium" class="@light-gray-colour">中号按钮</el-button>
                    <el-button size="medium" class="@light-gray-colour" disabled>中号按钮</el-button>
                </div>

                <div style="margin: 16px;">
                    <el-button size="small" class="@light-gray-colour">
                        <i class="vic-icon @base-add"></i> 小号按钮
                    </el-button>
                    <el-button size="small" class="@light-gray-colour">小号按钮</el-button>
                    <el-button size="small" class="@light-gray-colour" disabled>小号按钮</el-button>
                </div>
            </div>

            <!-- 单行的标签 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-tag size="large">大号标签</el-tag>
                    <el-tag size="large" closable>可关闭的大号标签</el-tag>
                </div>

                <div style="margin: 16px;">
                    <el-tag size="medium">中号标签</el-tag>
                    <el-tag size="medium" closable>可关闭的中号标签</el-tag>
                </div>

                <div style="margin: 16px;">
                    <el-tag size="small">小号标签</el-tag>
                    <el-tag size="small" closable>可关闭的小号标签</el-tag>
                </div>
            </div>

            <!-- 多行的标签 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-tag size="medium">
                        <span class="el-tag__content">
                            多行的
                            <br />中号标签
                        </span>
                    </el-tag>
                    <el-tag size="medium" closable>
                        <span class="el-tag__content">
                            可关闭的、多行的
                            <br />中号标签
                        </span>
                    </el-tag>
                </div>
            </div>
        </div>

        <!-- 输入框 -->
        <div class="wrapper-container">
            <!-- 文本输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-input v-model="elInput.value" placeholder="文本输入框"></el-input>
                </div>

                <div style="margin: 16px;">
                    <el-input v-model="elInput.value" placeholder="可清空的文本输入框" clearable></el-input>
                </div>

                <div style="margin: 16px;">
                    <el-input v-model="elInput.value" placeholder="被禁用的文本输入框" disabled></el-input>
                </div>
            </div>

            <!-- 有 icon 的文本输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-input
                        v-model="elIconInput.value"
                        prefix-icon="vic-icon @base-email"
                        placeholder="有 icon 的文本输入框"
                    ></el-input>
                </div>

                <div style="margin: 16px;">
                    <el-input
                        v-model="elIconInput.value"
                        prefix-icon="vic-icon @base-email"
                        placeholder="可清空的、有 icon 的文本输入框"
                        clearable
                    ></el-input>
                </div>

                <div style="margin: 16px;">
                    <el-input
                        v-model="elIconInput.value"
                        prefix-icon="vic-icon @base-email"
                        placeholder="被禁用的、有 icon 的文本输入框"
                        disabled
                    ></el-input>
                </div>
            </div>

            <!-- 有 n/n 的文本输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <input-text-component
                        type="text"
                        v-model="inputText.textValue"
                        :maxlength="50"
                        placeholder="有 n/n 的文本输入框"
                    ></input-text-component>
                </div>

                <div style="margin: 16px;">
                    <input-text-component
                        type="textarea"
                        v-model="inputText.textAreaValue"
                        :maxlength="200"
                        placeholder="有 n/n 的文本输入框"
                    ></input-text-component>
                </div>
            </div>

            <!-- 单选下拉列表 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-select v-model="elSelect.value" placeholder="单选下拉列表">
                        <el-option
                            v-for="(option, i) in elSelect.option"
                            :key="i"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </div>

                <div style="margin: 16px;">
                    <el-select v-model="elSelect.value" placeholder="可清空的单选下拉列表" clearable>
                        <el-option
                            v-for="(option, i) in elSelect.option"
                            :key="i"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </div>

                <div style="margin: 16px;">
                    <el-select v-model="elSelect.value" placeholder="被禁用的单选下拉列表" disabled>
                        <el-option
                            v-for="(option, i) in elSelect.option"
                            :key="i"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>

            <!-- 多选下拉列表 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-select v-model="elMultipleSelect.value" placeholder="多选下拉列表" multiple>
                        <el-option
                            v-for="(option, i) in elMultipleSelect.option"
                            :key="i"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </div>

                <div style="margin: 16px;">
                    <el-select
                        v-model="elMultipleSelect.value"
                        placeholder="有 +n 的多选下拉列表"
                        multiple
                        collapse-tags
                    >
                        <el-option
                            v-for="(option, i) in elMultipleSelect.option"
                            :key="i"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </div>

                <div style="margin: 16px;">
                    <el-select
                        v-model="elMultipleSelect.value"
                        placeholder="被禁用的多选下拉列表"
                        multiple
                        collapse-tags
                        disabled
                    >
                        <el-option
                            v-for="(option, i) in elMultipleSelect.option"
                            :key="i"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>

            <!-- 级联下拉列表 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <input-cascader-component
                        v-model="inputCascader.value"
                        :data="inputCascader.data"
                        placeholder="级联下拉列表"
                        label-separator=" / "
                        @selection="handlerInputCascader_Selection"
                        @change="handlerInputCascader_Change"
                    ></input-cascader-component>
                </div>

                <div style="margin: 16px;">
                    <input-cascader-component
                        v-model="inputCascader.value"
                        :data="inputCascader.data"
                        placeholder="可清空的级联下拉列表"
                        label-separator=" / "
                        @selection="handlerInputCascader_Selection"
                        @change="handlerInputCascader_Change"
                        clearable
                    ></input-cascader-component>
                </div>

                <div style="margin: 16px;">
                    <input-cascader-component
                        v-model="inputCascader.value"
                        :data="inputCascader.data"
                        placeholder="被禁用的级联下拉列表"
                        label-separator=" / "
                        @selection="handlerInputCascader_Selection"
                        @change="handlerInputCascader_Change"
                        disabled
                    ></input-cascader-component>
                </div>
            </div>

            <!-- 日期输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-date-picker
                        type="date"
                        v-model="elDatePicker.value"
                        placeholder="日期输入框"
                        :picker-options="{ firstDayOfWeek: 1 }"
                        :clearable="false"
                    ></el-date-picker>
                </div>

                <div style="margin: 16px;">
                    <el-date-picker
                        type="date"
                        v-model="elDatePicker.value"
                        placeholder="可清空的日期输入框"
                        :picker-options="{ firstDayOfWeek: 1 }"
                    ></el-date-picker>
                </div>

                <div style="margin: 16px;">
                    <el-date-picker
                        type="date"
                        v-model="elDatePicker.value"
                        placeholder="被禁用的日期输入框"
                        :picker-options="{ firstDayOfWeek: 1 }"
                        disabled
                    ></el-date-picker>
                </div>
            </div>

            <!-- 范围日期输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <input-daterange-component v-model="inputDaterange.value"></input-daterange-component>
                </div>

                <div style="margin: 16px;">
                    <input-daterange-component v-model="inputDaterange.value" clearable></input-daterange-component>
                </div>

                <div style="margin: 16px;">
                    <input-daterange-component v-model="inputDaterange.value" disabled></input-daterange-component>
                </div>
            </div>

            <!-- 时间输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-time-picker
                        v-model="elTimePicker.value"
                        format="HH:mm"
                        placeholder="时间输入框"
                        :clearable="false"
                    ></el-time-picker>
                </div>

                <div style="margin: 16px;">
                    <el-time-picker
                        v-model="elTimePicker.value"
                        format="HH:mm"
                        placeholder="可清空的时间输入框"
                    ></el-time-picker>
                </div>

                <div style="margin: 16px;">
                    <el-time-picker
                        v-model="elTimePicker.value"
                        format="HH:mm"
                        placeholder="被禁用的时间输入框"
                        disabled
                    ></el-time-picker>
                </div>
            </div>

            <!-- 范围时间输入框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-time-picker
                        v-model="elTimeRangePicker.value"
                        format="HH:mm"
                        start-placeholder="开始时间"
                        range-separator="至"
                        end-placeholder="结束时间"
                        is-range
                        :clearable="false"
                    ></el-time-picker>
                </div>

                <div style="margin: 16px;">
                    <el-time-picker
                        v-model="elTimeRangePicker.value"
                        format="HH:mm"
                        start-placeholder="开始时间"
                        range-separator="至"
                        end-placeholder="结束时间"
                        is-range
                    ></el-time-picker>
                </div>

                <div style="margin: 16px;">
                    <el-time-picker
                        v-model="elTimeRangePicker.value"
                        format="HH:mm"
                        start-placeholder="开始时间"
                        range-separator="至"
                        end-placeholder="结束时间"
                        is-range
                        disabled
                    ></el-time-picker>
                </div>
            </div>
        </div>

        <!-- 上传、开关、单选框、复选框、级联复选框、穿梭框 -->
        <div class="wrapper-container">
            <!-- 标准上传 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { inputUpload.disabled = false; }"
                    >可用</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { inputUpload.disabled = true; }"
                    >禁用</el-button>
                </div>

                <div style="margin: 16px;">
                    <input-upload-component v-bind="inputUpload" @add-file @delete-file @error></input-upload-component>
                </div>
            </div>

            <!-- 拖拽上传 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { inputDragUpload.disabled = false; }"
                    >可用</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { inputDragUpload.disabled = true; }"
                    >禁用</el-button>
                </div>

                <div style="margin: 16px;">
                    <input-upload-component v-bind="inputDragUpload" @add-file @delete-file @error></input-upload-component>
                </div>
            </div>

            <!-- 开关 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-switch v-model="elSwitch.value" active-text="开" inactive-text="关"></el-switch>
                    <el-switch v-model="elSwitch.value" active-text="开" inactive-text="关" disabled></el-switch>
                </div>

                <div style="margin: 16px;">
                    <el-switch v-model="elSwitch.value"></el-switch>
                    <el-switch v-model="elSwitch.value" disabled></el-switch>
                </div>
            </div>

            <!-- 单选框、复选框 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-radio v-model="elRadio.value" :label="1">单选框</el-radio>
                    <el-radio v-model="elRadio.value" :label="1" disabled>单选框</el-radio>
                </div>

                <div style="margin: 16px;">
                    <el-radio v-model="elRadio.value" :label="2">单选框</el-radio>
                    <el-radio v-model="elRadio.value" :label="2" disabled>单选框</el-radio>
                </div>

                <div style="margin: 16px;">
                    <el-checkbox v-model="elCheckbox.value">复选框</el-checkbox>
                    <el-checkbox v-model="elCheckbox.value" disabled>复选框</el-checkbox>
                </div>

                <div style="margin: 16px;">
                    <el-checkbox v-model="elCheckbox.value" :indeterminate="true">复选框</el-checkbox>
                    <el-checkbox v-model="elCheckbox.value" :indeterminate="true" disabled>复选框</el-checkbox>
                </div>
            </div>

            <!-- 级联复选框 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <input-checkbox-component
                        :map="inputCheckbox.map"
                        :data="inputCheckbox.data"
                        :value="inputCheckbox.value"
                        :checkall="inputCheckbox.checkall"
                        @selection="handlerInputCheckbox_Selection"
                        @change="handlerInputCheckbox_Change"
                    ></input-checkbox-component>
                </div>
            </div>

            <!-- 穿梭框 -->
            <div class="content-container @max">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { inputTransfer.disabled = false; }"
                    >可用</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { inputTransfer.disabled = true; }"
                    >禁用</el-button>
                </div>

                <div style="margin: 16px;">
                    <input-transfer-component
                        v-model="inputTransfer.value"
                        :data="inputTransfer.data"
                        :checked-title="inputTransfer.checkedTitle"
                        :check-all-value="inputTransfer.checkAllValue"
                        :disabled="inputTransfer.disabled"
                    ></input-transfer-component>
                </div>
            </div>
        </div>

        <!-- 表单 -->
        <div class="wrapper-container">
            <div class="content-container @large">
                <el-form :model="elForm.value" :rules="elForm.validator">
                    <div class="el-form-title">表单</div>

                    <el-form-item prop="0" label="字段：" class="@input-line is-required">
                        <input-text-component
                            type="text"
                            v-model="elForm.value['0']"
                            :maxlength="50"
                            placeholder="请输入"
                        ></input-text-component>
                    </el-form-item>

                    <el-form-item prop="1" label="字段：" class="@input-line @half-line">
                        <el-input v-model="elForm.value['1']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="2" label="字段：" class="@input-line @half-line">
                        <el-input v-model="elForm.value['2']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="1" label="字段：" class="@input-line @half-line @space">
                        <el-input v-model="elForm.value['1']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="2" label="字段：" class="@input-line @half-line">
                        <el-input v-model="elForm.value['2']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="3" label="字段：" class="@title-line">
                        <input-text-component
                            type="textarea"
                            v-model="elForm.value['3']"
                            :maxlength="200"
                            placeholder="请输入"
                        ></input-text-component>
                    </el-form-item>
                </el-form>
            </div>

            <div class="content-container @large">
                <el-form :model="elForm.value" :rules="elForm.validator">
                    <div class="el-form-title">表单</div>

                    <el-form-item prop="0" label="字段：" class="is-required">
                        <input-text-component
                            type="text"
                            v-model="elForm.value['0']"
                            :maxlength="50"
                            placeholder="请输入"
                        ></input-text-component>
                    </el-form-item>

                    <el-form-item prop="1" label="字段：" class="@half-line @space">
                        <el-input v-model="elForm.value['1']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="2" label="字段：" class="@half-line">
                        <el-input v-model="elForm.value['2']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="1" label="字段：" class="@half-line @space">
                        <el-input v-model="elForm.value['1']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="2" label="字段：" class="@half-line">
                        <el-input v-model="elForm.value['2']" placeholder="请输入"></el-input>
                    </el-form-item>

                    <el-form-item prop="3" label="字段：" class="@title-line">
                        <input-text-component
                            type="textarea"
                            v-model="elForm.value['3']"
                            :maxlength="200"
                            placeholder="请输入"
                        ></input-text-component>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!-- 选项卡 -->
        <div class="wrapper-container">
            <!-- 鲜明的选项卡 -->
            <div class="content-container @medium">
                <div style="margin: 16px;">
                    <el-tabs class="@distinct">
                        <el-tab-pane label="标签页 1">
                            <div style="height: 200px; padding: 16px;">鲜明的 选项卡的 标签页 1</div>
                        </el-tab-pane>

                        <el-tab-pane label="标签页 2">
                            <div style="height: 200px; padding: 16px;">鲜明的 选项卡的 标签页 2</div>
                        </el-tab-pane>

                        <el-tab-pane label="标签页 3" disabled>
                            <div style="height: 200px; padding: 16px;">鲜明的 选项卡的 标签页 3</div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <!-- 标准的选项卡 -->
            <div class="content-container @medium">
                <div style="margin: 16px;">
                    <el-tabs class="@standard">
                        <el-tab-pane label="标签页 1">
                            <div style="height: 200px; padding: 16px;">标准的 选项卡的 标签页 1</div>
                        </el-tab-pane>

                        <el-tab-pane label="标签页 2">
                            <div style="height: 200px; padding: 16px;">标准的 选项卡的 标签页 2</div>
                        </el-tab-pane>

                        <el-tab-pane label="标签页 3" disabled>
                            <div style="height: 200px; padding: 16px;">标准的 选项卡的 标签页 3</div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>

            <!-- 简明的选项卡 -->
            <div class="content-container @medium">
                <div style="margin: 16px;">
                    <el-tabs class="@standard @succinct">
                        <el-tab-pane label="标签页 1">
                            <div style="height: 200px; padding: 16px;">简明的 选项卡的 标签页 1</div>
                        </el-tab-pane>

                        <el-tab-pane label="标签页 2">
                            <div style="height: 200px; padding: 16px;">简明的 选项卡的 标签页 2</div>
                        </el-tab-pane>

                        <el-tab-pane label="标签页 3" disabled>
                            <div style="height: 200px; padding: 16px;">简明的 选项卡的 标签页 3</div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>

        <!-- 步骤条、iphone -->
        <div class="wrapper-container">
            <!-- 水平步骤条 -->
            <div class="content-container @large">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { if (horizontalStepBar.entry > 1) horizontalStepBar.entry -= 1; }"
                    >上一步</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { if (horizontalStepBar.entry < 5) horizontalStepBar.entry += 1; }"
                    >下一步</el-button>
                </div>

                <div style="margin: 16px;">
                    <step-bar-component
                        v-bind="horizontalStepBar"
                        @step-click="handlerStepBar_StepClick"
                    ></step-bar-component>
                </div>
            </div>

            <!-- 垂直步骤条 -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { if (verticalStepBar.entry > 1) verticalStepBar.entry -= 1; }"
                    >上一步</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { if (verticalStepBar.entry < 6) verticalStepBar.entry += 1; }"
                    >下一步</el-button>
                </div>

                <div style="margin: 16px;">
                    <step-bar-component
                        v-bind="verticalStepBar"
                        @step-click="handlerStepBar_StepClick"
                    ></step-bar-component>
                </div>
            </div>

            <!-- iphone -->
            <div class="content-container @min">
                <div style="margin: 16px;">
                    <iphone-component v-bind="iphone" @sms-sent="handlerIphone_SMSSent"></iphone-component>
                </div>
            </div>
        </div>

        <!-- 照片墙 -->
        <div class="wrapper-container">
            <div class="content-container @max">
                <photo-wall-component v-bind="photoWall"></photo-wall-component>
            </div>
        </div>

        <!-- 值卡片 -->
        <div class="wrapper-container">
            <!-- 标准的值卡片 -->
            <div class="content-container @min" style="height: 180px;">
                <card-value-component v-bind="standardCardValue"></card-value-component>
            </div>

            <!-- 简明的值卡片 -->
            <div class="content-container @min" style="height: 138px;">
                <card-value-component v-bind="succinctCardValue"></card-value-component>
            </div>
        </div>

        <!-- 表格、分页 -->
        <div class="wrapper-container">
            <div class="content-container @max">
                <!-- 表格 -->
                <div style="margin: 16px;">
                    <el-table :data="elTable.data" border stripe>
                        <el-table-column prop="0" label="品牌"></el-table-column>

                        <el-table-column prop="1" label="地区"></el-table-column>

                        <el-table-column prop="2" label="场所"></el-table-column>

                        <el-table-column
                            prop="3"
                            label="进店客流人次"
                            width="200px"
                            class-name="el-table-column__number"
                        ></el-table-column>

                        <el-table-column
                            prop="4"
                            label="周边客流人次"
                            width="200px"
                            class-name="el-table-column__number"
                        ></el-table-column>

                        <el-table-column prop="5" label="进店率" width="100px" fixed="right"></el-table-column>
                    </el-table>
                </div>

                <!-- 分页 -->
                <div style="margin: 16px; text-align: center;">
                    <el-pagination
                        :layout="$v.paging.layout"
                        :page-sizes="$v.paging.pageSizes"
                        :pagerCount="$v.paging.pagerCount"
                        :current-page="elPagination.page"
                        :page-size="elPagination.pageSize"
                        :total="elPagination.total"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <!-- 绘制区域 -->
        <div class="wrapper-container">
            <!-- 普通的区域绘制 -->
            <div class="content-container @large">
                <div
                    v-if="!drawMark.isDraw && !plainDrawZone.isAdd && !plainDrawZone.isEdit"
                    style="margin: 16px;"
                >
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { drawMark.isDraw = true; $refs.drawMark.$draw(); }"
                    >添加标记</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { drawMark.isDraw = true; $refs.drawMark.$draw('master-bedroom'); $refs.plainDrawZone.$zone('master-bedroom'); }"
                    >添加主卧标记</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isAdd = true; $refs.plainDrawZone.$draw(); }"
                    >添加区域</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isEdit = true; $refs.plainDrawZone.$draw('master-bedroom'); }"
                    >编辑主卧区域</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isEdit = true; $refs.plainDrawZone.$draw('restaurant'); }"
                    >编辑餐厅区域</el-button>
                </div>

                <div v-else-if="drawMark.isDraw" style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { drawMark.isDraw = false; $refs.drawMark.$shut(true); $refs.plainDrawZone.$zone(); }"
                    >保存</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { drawMark.isDraw = false; $refs.drawMark.$shut(); $refs.plainDrawZone.$zone(); }"
                    >取消</el-button>
                </div>

                <div v-else-if="plainDrawZone.isAdd" style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isAdd = false; $refs.plainDrawZone.$shut({ name: String(Math.random()), color: '#FF00FF' }); }"
                    >保存</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isAdd = false; $refs.plainDrawZone.$shut(); }"
                    >取消</el-button>
                </div>

                <div v-else-if="plainDrawZone.isEdit" style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isEdit = false; $refs.plainDrawZone.$shut(true); }"
                    >保存</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { plainDrawZone.isEdit = false; $refs.plainDrawZone.$shut(); }"
                    >取消</el-button>
                </div>

                <div style="margin: 16px;">
                    <draw-zone-component
                        ref="plainDrawZone"
                        :size="plainDrawZone.size"
                        :zone="plainDrawZone.zone"
                        @move="handlerDrawZone_Move"
                    >
                        <draw-mark-component
                            ref="drawMark"
                            :size="drawMark.size"
                            :zone="drawMark.zone"
                            :mark="drawMark.mark"
                            @draw-click="handlerDrawMark_DrawClick"
                        >
                            <template slot="tip" slot-scope="{ mark }">{{ mark }}</template>

                            <template>
                                <img
                                    src="./draw-zone-background.jpg"
                                    style="display: block; width: 100%;"
                                    draggable="false"
                                />
                            </template>
                        </draw-mark-component>
                    </draw-zone-component>
                </div>
            </div>

            <!-- 单个矩形的区域绘制 -->
            <div class="content-container @large">
                <div
                    v-if="!singleRectDrawZone.isAdd && !singleRectDrawZone.isEdit"
                    style="margin: 16px;"
                >
                    <el-button
                        v-if="!singleRectDrawZone.zone.length"
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { singleRectDrawZone.isAdd = true; $refs.singleRectDrawZone.$draw(); }"
                    >添加区域</el-button>
                    <el-button
                        v-else
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { singleRectDrawZone.isEdit = true; $refs.singleRectDrawZone.$draw('rect'); }"
                    >编辑区域</el-button>
                </div>

                <div v-else-if="singleRectDrawZone.isAdd" style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { singleRectDrawZone.isAdd = false; $refs.singleRectDrawZone.$shut({ name: 'rect', color: '#FF00FF' }); }"
                    >保存</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { singleRectDrawZone.isAdd = false; $refs.singleRectDrawZone.$shut(); }"
                    >取消</el-button>
                </div>

                <div v-else-if="singleRectDrawZone.isEdit" style="margin: 16px;">
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { singleRectDrawZone.isEdit = false; $refs.singleRectDrawZone.$shut(true); }"
                    >保存</el-button>
                    <el-button
                        size="small"
                        class="@light-gray-colour"
                        @click="() => { singleRectDrawZone.isEdit = false; $refs.singleRectDrawZone.$shut(); }"
                    >取消</el-button>
                </div>

                <div style="margin: 16px;">
                    <draw-zone-component
                        ref="singleRectDrawZone"
                        :size="singleRectDrawZone.size"
                        :zone="singleRectDrawZone.zone"
                        :plug-in="singleRectDrawZone.plugIn"
                        @move="handlerDrawZone_Move"
                    >
                        <img
                            src="./draw-zone-background.jpg"
                            style="display: block; width: 100%;"
                            draggable="false"
                        />
                    </draw-zone-component>
                </div>
            </div>
        </div>

        <!-- echarts 图表 -->
        <div class="wrapper-container">
            <!-- 柱状图 -->
            <div class="content-container @large">
                <echarts-bar-component v-bind="echartsBar">
                    <template slot="filter">过滤插槽</template>
                </echarts-bar-component>
            </div>

            <!-- 漏斗图 -->
            <div class="content-container @large">
                <echarts-funnel-component v-bind="echartsFunnel">
                    <template slot="filter">过滤插槽</template>
                </echarts-funnel-component>
            </div>

            <!-- 笛卡尔热力图 -->
            <div class="content-container @large">
                <echarts-heatmap-component v-bind="echartsHeatmap">
                    <template slot="filter">过滤插槽</template>
                </echarts-heatmap-component>
            </div>

            <!-- 折线图 -->
            <div class="content-container @large">
                <echarts-line-component v-bind="echartsLine">
                    <template slot="filter">过滤插槽</template>
                </echarts-line-component>
            </div>

            <!-- 饼图 -->
            <div class="content-container @large">
                <echarts-pie-component v-bind="echartsPie">
                    <template slot="filter">过滤插槽</template>
                </echarts-pie-component>
            </div>

            <!-- 散点图 -->
            <div class="content-container @large">
                <echarts-scatter-component v-bind="echartsScatter">
                    <template slot="filter">过滤插槽</template>
                </echarts-scatter-component>
            </div>

            <!-- 价值分布地图 -->
            <div class="content-container @max">
                <echarts-valdistmap-component
                    v-bind="echartsValdistmap"
                    @value="handlerEchartsValdistmap_Value"
                >
                    <template slot="filter">过滤插槽</template>
                </echarts-valdistmap-component>
            </div>
        </div>

        <!-- 普通路由对话框 -->
        <plain-dialog-component
            v-bind="plainDialog"
            @ok="handlerPlainDialog(false, $event)"
            @cancel="handlerPlainDialog(false)"
        ></plain-dialog-component>

        <!-- 右侧路由对话框 -->
        <right-dialog-component
            v-bind="rightDialog"
            @ok="handlerRightDialog(false, $event)"
            @cancel="handlerRightDialog(false)"
        ></right-dialog-component>

        <!-- 右侧组件对话框 -->
        <dialog-right
            :options="dialogRight"
            @ok="handlerComponentDialogEvent(false, $event)"
            @cancel="handlerComponentDialogEvent(false)"
        ></dialog-right>
    </div>
</template>

<script type="text/jsx">
import BatchOperationComponent from "@components/batch-operation/batch-operation-component";
import CardValueComponent from "@components/card-value/card-value-component";
import DrawMarkComponent from "@components/draw-mark/draw-mark-component";
import DrawZoneComponent from "@components/draw-zone/draw-zone-component";
import IphoneComponent from "@components/mobile-phone/iphone-component";
import PhotoWallComponent from "@components/photo-wall/photo-wall-component";
import StepBarComponent from "@components/step-bar/step-bar-component";
import EchartsBarComponent from "@components/echarts-bar/echarts-bar-component";
import EchartsFunnelComponent from "@components/echarts-funnel/echarts-funnel-component";
import EchartsHeatmapComponent from "@components/echarts-heatmap/echarts-heatmap-component";
import EchartsLineComponent from "@components/echarts-line/echarts-line-component";
import EchartsPieComponent from "@components/echarts-pie/echarts-pie-component";
import EchartsScatterComponent from "@components/echarts-scatter/echarts-scatter-component";
import EchartsValdistmapComponent from "@components/echarts-valdistmap/echarts-valdistmap-component";
import PlainDialogComponent from "./p-dialog/p-dialog-component";
import RightDialogComponent from "./r-dialog/r-dialog-component";
import DialogRight from "./dialog-right/dialog-right-component";

export default {
    components: {
        BatchOperationComponent,
        CardValueComponent,
        DrawMarkComponent,
        DrawZoneComponent,
        IphoneComponent,
        PhotoWallComponent,
        StepBarComponent,
        EchartsBarComponent,
        EchartsFunnelComponent,
        EchartsHeatmapComponent,
        EchartsLineComponent,
        EchartsPieComponent,
        EchartsScatterComponent,
        EchartsValdistmapComponent,
        PlainDialogComponent,
        RightDialogComponent,
        DialogRight
    },

    methods: {
        handlerPlainDialog($visible, $value) {
            if ($visible) {
                // 非 required 属性
                // 默认值 false
                this.plainDialog.closeOnPressEscape = false;

                // 非 required 属性
                // 默认值 false
                this.plainDialog.closeOnClickModal = false;

                // 非 required 属性
                // 默认值 auto
                this.plainDialog.width = "400px";
            }

            this.plainDialog.visible = $visible;
        },

        handlerRightDialog($visible, $value) {
            if ($visible) {
                // 非 required 属性
                // 默认值 false
                this.rightDialog.closeOnPressEscape = $value.closeOnPressEscape;

                // 非 required 属性
                // 默认值 false
                this.rightDialog.closeOnClickModal = $value.closeOnClickModal;

                // 非 required 属性
                // 默认值 auto
                // 可用值
                //     max
                //     large
                //     small
                //     full-max
                //     full-large
                //     full-small
                //
                this.rightDialog.width = $value.width;
            }

            this.rightDialog.visible = $visible;
        },

        handlerAlertDialog() {
            this.$alert(
                '这是一条警告消息<span class="el-message-box__tips">这是一条警告消息的高亮文本</span>',
                "警告对话框",
                {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: "确定"
                }
            );
        },

        handlerConfirmDialog() {
            let confirm = () => {
                console.log("确定");
            };

            this.$confirm(
                '这是一条确定消息<span class="el-message-box__tips">这是一条确定消息的高亮文本</span>',
                "确定对话框",
                {
                    dangerouslyUseHTMLString: true,
                    confirm: confirm,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                }
            );
        },

        handlerMessage($type, $message) {
            this.$message({
                type: $type,
                message: $message
            });
        },

        handlerInputCascader_Selection($selection) {
            switch (true) {
                case $selection[0] === 1 && $selection[1] === 11:
                    this.$set(
                        this.inputCascader.data,
                        1,
                        this.inputCascader.data_level2_bj
                    );
                    this.$set(
                        this.inputCascader.data,
                        2,
                        this.inputCascader.data_level3_bj
                    );
                    break;

                case $selection[0] === 1:
                    this.$set(
                        this.inputCascader.data,
                        1,
                        this.inputCascader.data_level2_bj
                    );
                    this.$set(
                        this.inputCascader.data,
                        2,
                        this.inputCascader.data_level3_all
                    );
                    break;

                default:
                    this.$set(
                        this.inputCascader.data,
                        1,
                        this.inputCascader.data_level2_all
                    );
                    this.$set(
                        this.inputCascader.data,
                        2,
                        this.inputCascader.data_level2_all
                    );
            }
        },

        handlerInputCascader_Change($value) {
            console.log($value);
        },

        handlerInputCheckbox_Selection($selection) {
            switch (true) {
                case $selection[0] === 1 && $selection[1] === 11:
                    this.$set(
                        this.inputCheckbox.data,
                        1,
                        this.inputCheckbox.data_level2_bj
                    );
                    this.$set(
                        this.inputCheckbox.data,
                        2,
                        this.inputCheckbox.data_level3_bj
                    );
                    break;

                case $selection[0] === 1:
                    this.$set(
                        this.inputCheckbox.data,
                        1,
                        this.inputCheckbox.data_level2_bj
                    );
                    this.$set(this.inputCheckbox.data, 2, []);
                    break;

                case $selection[0] === 2 && $selection[1] === 21:
                    this.$set(
                        this.inputCheckbox.data,
                        1,
                        this.inputCheckbox.data_level2_sh
                    );
                    this.$set(
                        this.inputCheckbox.data,
                        2,
                        this.inputCheckbox.data_level3_sh
                    );
                    break;

                case $selection[0] === 2:
                    this.$set(
                        this.inputCheckbox.data,
                        1,
                        this.inputCheckbox.data_level2_sh
                    );
                    this.$set(this.inputCheckbox.data, 2, []);
                    break;

                default:
                    this.$set(this.inputCheckbox.data, 2, []);
                    this.$set(this.inputCheckbox.data, 2, []);
            }
        },

        handlerInputCheckbox_Change($value, $checked) {
            console.log($value, $checked);
        },

        handlerInputUploadNext($res, $next) {
            switch (true) {
                case $res.ok === false:
                    $next({ type: "error", message: "上传被取消" });
                    break;

                default:
                    $next({ type: "success" });
            }
        },

        handlerElFormValidator($r, $v, $callback) {
            switch (true) {
                case Boolean(!$v.trim()):
                    $callback(new Error("请输入"));
                    break;

                default:
                    $callback();
            }
        },

        handlerIphone_SMSSent($content) {
            if (($content = $content.trim())) {
                this.iphone.data.sms.push({
                    type: "send",
                    time: new Date().toFormatString("hh:mm"),
                    content: $content
                });
            }
        },

        handlerStepBar_StepClick($key, $name) {
            console.log($key, $name);
        },

        handlerDrawMark_DrawClick($draw) {
            this.$refs.drawMark.$mark({
                name: $draw._$_zone_$_ ? $draw._$_zone_$_ + "_1" : "2",
                icon: {
                    name: "vic-icon @base64_no-device_solid",
                    color: "#FF0000"
                }
            });
        },

        handlerDrawZone_Move() {
            console.log("!! move");
        },

        handlerEchartsValdistmap_Value($key) {
            console.log($key);
        },

        handlerComponentDialog(visible, closeOnPressEscape, closeOnClickModal, width){
            this.dialogRight.visible = visible;
            this.dialogRight.closeOnPressEscape = closeOnPressEscape;// 默认false
            this.dialogRight.closeOnClickModal = closeOnClickModal;// 默认false
            this.dialogRight.width = width;
        },
        handlerComponentDialogEvent(visible, $event){
            this.dialogRight.visible = visible;
        }
    },

    data() {
        return {
            elCheckbox: {
                value: true
            },
            elDatePicker: {
                value: ""
            },
            elForm: {
                value: {
                    "0": "",
                    "1": "",
                    "2": "",
                    "3": ""
                },
                validator: {
                    "0": {
                        validator: this.handlerElFormValidator,
                        trigger: "blur"
                    },
                    "1": {
                        validator: this.handlerElFormValidator,
                        trigger: "blur"
                    },
                    "2": {
                        validator: this.handlerElFormValidator,
                        trigger: "blur"
                    },
                    "3": {
                        validator: this.handlerElFormValidator,
                        trigger: "blur"
                    }
                }
            },
            elIconInput: {
                value: ""
            },
            elInput: {
                value: ""
            },
            elMultipleSelect: {
                value: [],
                option: [
                    {
                        label: "北京市",
                        value: 1
                    },
                    {
                        label: "上海市",
                        value: 2
                    },
                    {
                        label: "天津市",
                        value: 3
                    },
                    {
                        label: "重庆市",
                        value: 4
                    },
                    {
                        label: "宁夏回族自治区",
                        value: 5
                    },
                    {
                        label: "新疆维吾尔族自治区",
                        value: 6
                    }
                ]
            },
            elPagination: {
                page: 1,
                pageSize: 10,
                total: 100
            },
            elRadio: {
                value: 1
            },
            elSelect: {
                value: "",
                option: [
                    {
                        label: "北京市",
                        value: 1
                    },
                    {
                        label: "上海市",
                        value: 2
                    },
                    {
                        label: "天津市",
                        value: 3
                    },
                    {
                        label: "重庆市",
                        value: 4
                    },
                    {
                        label: "宁夏回族自治区",
                        value: 5
                    },
                    {
                        label: "新疆维吾尔族自治区",
                        value: 6
                    }
                ]
            },
            elSwitch: {
                value: true
            },
            elTable: {
                data: [
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    },
                    {
                        "0": "雅诗兰黛",
                        "1": "北京市 / 朝阳区",
                        "2": "万达广场",
                        "3": "900",
                        "4": "100",
                        "5": "20%"
                    }
                ]
            },
            elTimePicker: {
                value: ""
            },
            elTimeRangePicker: {
                value: ""
            },
            inputCascader: {
                value: [],
                data: [
                    [
                        {
                            label: "全部省",
                            value: 0
                        },
                        {
                            label: "北京市",
                            value: 1
                        },
                        {
                            label: "上海市",
                            value: 2
                        },
                        {
                            label: "天津市",
                            value: 3
                        },
                        {
                            label: "重庆市",
                            value: 4
                        },
                        {
                            label: "河北省",
                            value: 5
                        },
                        {
                            label: "河南省",
                            value: 6
                        },
                        {
                            label: "湖北省",
                            value: 7
                        },
                        {
                            label: "湖南省",
                            value: 8
                        }
                    ],
                    [],
                    []
                ],
                data_level2_all: [
                    {
                        label: "全部市",
                        value: 0
                    }
                ],
                data_level2_bj: [
                    {
                        label: "全部市",
                        value: 10
                    },
                    {
                        label: "北京市",
                        value: 11
                    }
                ],
                data_level3_all: [
                    {
                        label: "全部区",
                        value: 0
                    }
                ],
                data_level3_bj: [
                    {
                        label: "全部区",
                        value: 100
                    },
                    {
                        label: "东城区",
                        value: 111
                    },
                    {
                        label: "西城区",
                        value: 112
                    },
                    {
                        label: "海淀区",
                        value: 113
                    },
                    {
                        label: "朝阳区",
                        value: 114
                    },
                    {
                        label: "丰台区",
                        value: 115
                    },
                    {
                        label: "石景山区",
                        value: 116
                    }
                ]
            },
            inputCheckbox: {
                value: [],
                data: [
                    [
                        {
                            label: "北京市",
                            value: 1
                        },
                        {
                            label: "上海市",
                            value: 2
                        },
                        {
                            label: "天津市",
                            value: 3
                        },
                        {
                            label: "重庆市",
                            value: 4
                        },
                        {
                            label: "河北省",
                            value: 5
                        },
                        {
                            label: "河南省",
                            value: 6
                        },
                        {
                            label: "湖北省",
                            value: 7
                        },
                        {
                            label: "湖南省",
                            value: 8
                        }
                    ],
                    [],
                    []
                ],
                data_level2_bj: [
                    {
                        label: "北京市",
                        value: 11
                    }
                ],
                data_level2_sh: [
                    {
                        label: "上海市",
                        value: 21
                    }
                ],
                data_level3_bj: [
                    {
                        label: "东城区",
                        value: 111
                    },
                    {
                        label: "西城区",
                        value: 112
                    },
                    {
                        label: "海淀区",
                        value: 113
                    },
                    {
                        label: "朝阳区",
                        value: 114
                    },
                    {
                        label: "丰台区",
                        value: 115
                    },
                    {
                        label: "石景山区",
                        value: 116
                    }
                ],
                data_level3_sh: [
                    {
                        label: "黄浦区",
                        value: 211
                    },
                    {
                        label: "徐汇区",
                        value: 212
                    },
                    {
                        label: "长宁区",
                        value: 213
                    },
                    {
                        label: "静安区",
                        value: 214
                    },
                    {
                        label: "普陀区",
                        value: 215
                    },
                    {
                        label: "虹口区",
                        value: 216
                    }
                ],
                map: {
                    111: {
                        disabled: true
                    }
                },
                checkall: true
            },
            inputDatepicker: {
                value: "",
                rangeValue: []
            },
            inputDaterange: {
                value: []
            },
            inputSearch: {
                value: ""
            },
            inputSelect: {
                value: "",
                multipleValue: [],
                option: [
                    {
                        label: "北京市",
                        value: 1
                    },
                    {
                        label: "上海市",
                        value: 2
                    },
                    {
                        label: "天津市",
                        value: 3
                    },
                    {
                        label: "重庆市",
                        value: 4
                    },
                    {
                        label: "宁夏回族自治区",
                        value: 5
                    },
                    {
                        label: "新疆维吾尔族自治区",
                        value: 6
                    }
                ]
            },
            inputText: {
                textValue: "",
                textAreaValue: ""
            },
            inputTimepicker: {
                value: "",
                rangeValue: ""
            },
            inputTransfer: {
                value: [112],
                data: [
                    {
                        id: 1,
                        label: "设备",
                        children: [
                            {
                                id: 1,
                                label: "供应商",
                                children: [
                                    {
                                        id: 11,
                                        label: "供应商",
                                        children: [
                                            {
                                                id: 111,
                                                label: "诺基亚 5G",
                                                disabled: true
                                            },
                                            {
                                                id: 112,
                                                label: "华为 5G",
                                                disabled: true
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: 2,
                                label: "设备",
                                children: [
                                    {
                                        id: 21,
                                        label: "固定电话"
                                    },
                                    {
                                        id: 22,
                                        label: "移动电话"
                                    }
                                ]
                            },
                            {
                                id: 3,
                                label: "基站",
                                children: [
                                    {
                                        id: 31,
                                        label: "地面基站"
                                    },
                                    {
                                        id: 32,
                                        label: "卫星"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 2,
                        label: "系统",
                        children: [
                            {
                                id: 4,
                                label: "Microsoft",
                                children: [
                                    {
                                        id: 41,
                                        label: "Windows XP"
                                    },
                                    {
                                        id: 42,
                                        label: "Windows 7"
                                    },
                                    {
                                        id: 43,
                                        label: "Windows 8"
                                    },
                                    {
                                        id: 44,
                                        label: "Windows 10"
                                    }
                                ]
                            },
                            {
                                id: 5,
                                label: "Apple",
                                children: [
                                    {
                                        id: 51,
                                        label: "OS"
                                    },
                                    {
                                        id: 52,
                                        label: "iOS"
                                    }
                                ]
                            },
                            {
                                id: 6,
                                label: "Google",
                                children: [
                                    {
                                        id: 61,
                                        label: "Android"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 3,
                        label: "应用",
                        children: [
                            {
                                id: 7,
                                label: "游戏",
                                children: [
                                    {
                                        id: 71,
                                        label: "植物大战僵尸"
                                    },
                                    {
                                        id: 72,
                                        label: "部落冲突"
                                    },
                                    {
                                        id: 73,
                                        label: "王者荣耀"
                                    }
                                ]
                            },
                            {
                                id: 8,
                                label: "社交",
                                children: [
                                    {
                                        id: 81,
                                        label: "微博"
                                    },
                                    {
                                        id: 82,
                                        label: "微信"
                                    }
                                ]
                            },
                            {
                                id: 9,
                                label: "Office"
                            }
                        ]
                    }
                ],
                checkedTitle: "已选：",
                checkAllValue: true,
                disabled: false
            },
            inputUpload: {
                uploadTip: "支持 jpg/png 格式、3MB 大小以内的文件",
                uploadAction: "/api/user/importuser", // https://jsonplaceholder.typicode.com/posts/
                uploadWithName: "file",
                uploadWithData: {},
                uploadNext: this.handlerInputUploadNext,
                fileList: [
                    {
                        name:
                            "微信图片_20190725172504_20190725172504_20190725172504_20190725172504_20190725172504.jpg",
                        url:
                            "http://image.widash.wiwide.com/images/微信图片_20190725172504.jpg"
                    },
                    {
                        name: "微信图片_20190725172504.jpg",
                        url:
                            "http://image.widash.wiwide.com/images/微信图片_20190725172504.jpg"
                    }
                ],
                fileAccept: ["image/jpeg", "image/png"],
                fileSizeLimit: 3145728, // 1024 * 1024 * 3
                fileQuantityLimit: 5,
                disabled: false
            },
            inputDragUpload: {
                uploadTip: "支持 jpg/png 格式、3MB 大小以内的文件",
                uploadAction: "/api/user/importuser",
                uploadWithName: "file",
                uploadWithData: {},
                uploadNext: this.handlerInputUploadNext,
                fileList: [
                    {
                        name: "微信图片_20190725172504.jpg",
                        url:
                            "http://image.widash.wiwide.com/images/微信图片_20190725172504.jpg"
                    },
                    {
                        name: "微信图片_20190725172504.jpg",
                        url:
                            "http://image.widash.wiwide.com/images/微信图片_20190725172504.jpg"
                    }
                ],
                fileAccept: ["image/jpeg", "image/png"],
                fileSizeLimit: 3145728, // 1024 * 1024 * 3
                fileQuantityLimit: 5,
                drag: true,
                disabled: false
            },
            batchOperation: {
                // mode 属性是语法糖
                // mode: '1' 等同于
                //
                //     operation: {
                //         viewSelected    : null,
                //         viewAll         : null,
                //         clearSelected   : null,
                //         batchExport     : null,
                //         batchImport     : null,
                //         batchEdit       : null,
                //         batchDelete     : null
                //     }
                //
                //     @click-view-selected="() => { batchOperation.operation.viewSelected = false; batchOperation.operation.viewAll = true; }"
                //     @click-view-all="() => { batchOperation.operation.viewSelected = true; batchOperation.operation.viewAll = false; }"
                //
                mode: "1",
                selected: 1,
                total: 1289,
                hide: true
            },
            standardCardValue: {
                title: "值卡片",
                value: 1000000,
                sub: {
                    title: "环比",
                    value: [["20%", "up"], ["20%", "down"], [1000000]]
                }
            },
            succinctCardValue: {
                title: "值卡片",
                value: 1000000
            },
            drawMark: {
                size: {
                    width: 1200,
                    height: 966
                },
                zone: [
                    {
                        name: "master-bedroom",
                        color: "#FF7F00",
                        vertex: [
                            { x: 203, y: 434 },
                            { x: 415, y: 434 },
                            { x: 410, y: 481 },
                            { x: 386, y: 481 },
                            { x: 351, y: 780 },
                            { x: 128, y: 780 }
                        ]
                    },
                    {
                        name: "restaurant",
                        color: "#7FFF00",
                        vertex: [
                            { x: 597, y: 312 },
                            { x: 775, y: 312 },
                            { x: 791, y: 495 },
                            { x: 593, y: 495 }
                        ]
                    }
                ],
                mark: [
                    {
                        name: "1",
                        icon: {
                            name: "vic-icon @base64_no-device_solid",
                            color: "#FF0000"
                        },
                        x: 200,
                        y: 200,
                        zone: ""
                    }
                ],
                isDraw: false
            },
            plainDrawZone: {
                size: {
                    width: 1200,
                    height: 966
                },
                zone: [
                    {
                        name: "master-bedroom",
                        color: "#FF7F00",
                        vertex: [
                            { x: 203, y: 434 },
                            { x: 415, y: 434 },
                            { x: 410, y: 481 },
                            { x: 386, y: 481 },
                            { x: 351, y: 780 },
                            { x: 128, y: 780 }
                        ]
                    },
                    {
                        name: "restaurant",
                        color: "#7FFF00",
                        vertex: [
                            { x: 597, y: 312 },
                            { x: 775, y: 312 },
                            { x: 791, y: 495 },
                            { x: 593, y: 495 }
                        ]
                    }
                ],
                isAdd: false,
                isEdit: false
            },
            singleRectDrawZone: {
                size: {
                    width: 1200,
                    height: 966
                },
                zone: [],
                plugIn: "$single-rect",
                isAdd: false,
                isEdit: false
            },
            iphone: {
                mode: "sms",
                data: {
                    sender: "10086",
                    sms: [
                        {
                            type: "received",
                            time: "10:00",
                            content: "您好！很高兴为您服务，有什么可以效劳的？"
                        },
                        {
                            type: "send",
                            time: "10:01",
                            content: "积分查询"
                        },
                        {
                            type: "received",
                            time: "10:02",
                            content: "您有积分 0"
                        },
                        {
                            type: "received",
                            time: "10:02",
                            content: "您好！很高兴为您服务，有什么可以效劳的？"
                        }
                    ]
                }
            },
            photoWall: {
                title: "照片墙",
                data: [
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "male",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    },
                    {
                        name: "people",
                        sex: "female",
                        photo:
                            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552637858330&di=7a72f1bb5e700844b6f9cb61a29ab7da&imgtype=0&src=http%3A%2F%2Ftx.haiqq.com%2Fuploads%2Fallimg%2F150319%2F1614053917-13.jpg"
                    }
                ]
            },
            horizontalStepBar: {
                mode: "horizontal",
                data: [
                    {
                        key: 1,
                        name: "基本信息"
                    },
                    {
                        key: 2,
                        name: "设备信息"
                    },
                    {
                        key: 3,
                        name: "项目合同"
                    },
                    {
                        key: 4,
                        name: "完成"
                    }
                ],
                entry: 2
            },
            verticalStepBar: {
                mode: "vertical",
                data: [
                    {
                        name: "基本信息",
                        children: [
                            {
                                key: 1,
                                name: "基本资料"
                            },
                            {
                                key: 2,
                                name: "补充资料"
                            }
                        ]
                    },
                    {
                        name: "设备信息",
                        children: [
                            {
                                key: 3,
                                name: "设备信息"
                            }
                        ]
                    },
                    {
                        name: "项目合同",
                        children: [
                            {
                                key: 4,
                                name: "条款信息"
                            }
                        ]
                    },
                    {
                        key: 5,
                        name: "完成"
                    }
                ],
                entry: 3
            },
            echartsBar: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "柱状图"
                    },
                    legend: {
                        data: ["店内客流人次", "周边客流人次"]
                    },
                    xAxis: {
                        data: ["21-30 岁", "31-40 岁", "41-50 岁", "51-99 岁"]
                    },
                    series: [
                        {
                            name: "店内客流人次",
                            data: [2000, 3000, 3000, 199]
                        },
                        {
                            name: "周边客流人次",
                            data: [4000, 6000, 8000, 299]
                        }
                    ]
                }
            },
            echartsFunnel: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "漏斗图"
                    },
                    legend: {
                        data: ["21-30 岁", "31-40 岁", "41-50 岁", "51-99 岁"]
                    },
                    series: [
                        {
                            data: [
                                {
                                    name: "21-30 岁",
                                    value: 2000
                                },
                                {
                                    name: "31-40 岁",
                                    value: 3000
                                },
                                {
                                    name: "41-50 岁",
                                    value: 4000
                                },
                                {
                                    name: "51-99 岁",
                                    value: 199
                                }
                            ]
                        }
                    ]
                }
            },
            echartsHeatmap: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "笛卡尔热力图"
                    },
                    xAxis: {
                        data: [
                            "0",
                            "1",
                            "2",
                            "3",
                            "4",
                            "5",
                            "6",
                            "7",
                            "8",
                            "9",
                            "10",
                            "11",
                            "12",
                            "13",
                            "14",
                            "15",
                            "16",
                            "17",
                            "18",
                            "19",
                            "20",
                            "21",
                            "22",
                            "23"
                        ]
                    },
                    yAxis: {
                        data: [
                            "2019/1/1",
                            "2019/1/2",
                            "2019/1/3",
                            "2019/1/4",
                            "2019/1/5",
                            "2019/1/6",
                            "2019/1/7"
                        ]
                    },
                    series: [
                        {
                            data: [
                                5,
                                1,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                2,
                                4,
                                1,
                                1,
                                3,
                                4,
                                6,
                                4,
                                4,
                                3,
                                3,
                                2,
                                5,
                                7,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                5,
                                2,
                                2,
                                6,
                                9,
                                11,
                                6,
                                7,
                                8,
                                12,
                                5,
                                5,
                                7,
                                2,
                                NaN,
                                1,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                3,
                                2,
                                1,
                                9,
                                8,
                                10,
                                6,
                                5,
                                5,
                                5,
                                7,
                                4,
                                2,
                                4,
                                7,
                                3,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                1,
                                NaN,
                                5,
                                4,
                                7,
                                14,
                                13,
                                12,
                                9,
                                5,
                                5,
                                10,
                                6,
                                4,
                                4,
                                1,
                                1,
                                3,
                                NaN,
                                NaN,
                                NaN,
                                1,
                                NaN,
                                NaN,
                                NaN,
                                2,
                                4,
                                4,
                                2,
                                4,
                                4,
                                14,
                                12,
                                1,
                                8,
                                5,
                                3,
                                7,
                                3,
                                NaN,
                                2,
                                1,
                                NaN,
                                3,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                2,
                                NaN,
                                4,
                                1,
                                5,
                                10,
                                5,
                                7,
                                11,
                                6,
                                NaN,
                                5,
                                3,
                                3,
                                2,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                1,
                                NaN,
                                2,
                                1,
                                3,
                                4,
                                NaN,
                                NaN,
                                NaN,
                                NaN,
                                1,
                                2,
                                2,
                                6
                            ]
                        }
                    ]
                }
            },
            echartsLine: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "折线图"
                    },
                    legend: {
                        data: ["店内客流人次", "周边客流人次"]
                    },
                    xAxis: {
                        data: ["21-30 岁", "31-40 岁", "41-50 岁", "51-99 岁"]
                    },
                    series: [
                        {
                            name: "店内客流人次",
                            data: [2000, 3000, 4000, 199]
                        },
                        {
                            name: "周边客流人次",
                            data: [4000, 6000, 8000, 299]
                        }
                    ]
                }
            },
            echartsPie: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "饼图"
                    },
                    legend: {
                        data: ["21-30 岁", "31-40 岁", "41-50 岁", "51-99 岁"]
                    },
                    series: [
                        {
                            data: [
                                {
                                    name: "21-30 岁",
                                    value: 2000
                                },
                                {
                                    name: "31-40 岁",
                                    value: 3000
                                },
                                {
                                    name: "41-50 岁",
                                    value: 4000
                                },
                                {
                                    name: "51-99 岁",
                                    value: 199
                                }
                            ]
                        }
                    ]
                }
            },
            echartsScatter: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "散点图"
                    },
                    legend: {
                        data: ["教育", "娱乐", "旅游", "交通", "理财"]
                    },
                    series: [
                        { data: [20, 39, 52, 75, 90] },
                        { data: [27, 39, 54, 69, 82] },
                        { data: [29, 42, 59, 67, 83] },
                        { data: [22, 37, 53, 66, 97] },
                        { data: [24, 33, 48, 62, 75] }
                    ]
                }
            },
            echartsValdistmap: {
                width: "100%",
                height: "400px",
                option: {
                    title: {
                        text: "价值分布地图"
                    },
                    geo: {
                        map: "国"
                    },
                    series: [
                        {
                            data: [
                                { name: "辽", value: 1 },
                                { name: "吉", value: 2 },
                                { name: "黑", value: 3 },
                                { name: "浙", value: 4 },
                                { name: "粤", value: 5 },
                                { name: "渝", value: 6 },
                                { name: "津", value: 8 },
                                { name: "沪", value: 11 },
                                { name: "京", value: 16 }
                            ]
                        }
                    ]
                }
            },
            plainDialog: {
                visible: false,
                closeOnPressEscape: null,
                closeOnClickModal: null,
                width: null,
                value: {}
            },
            rightDialog: {
                visible: false,
                closeOnPressEscape: null,
                closeOnClickModal: null,
                width: null,
                value: {}
            },
            dialogRight: {
                visible: false,
                value: {},
                // closeOnPressEscape: false,// 默认false
                // closeOnClickModal: false,// 默认false
                // width: 'large',// 默认'large',: 'max'、'large'、'small'、'full-'
            }
        };
    }
};
</script>
