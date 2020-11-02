<style lang="scss" src="./input-upload-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {
            "upload"                : "上传",
            "upload_drag"           : "将文件拖至此处，或",
            "upload_drag_a"         : "点击上传",
            "error_fileAccept"      : "错误文件类型",
            "error_fileSize"        : "错误文件大小",
            "error_fileQuantity"    : "错误文件数量",
            "message_title"         : "提示",
            "message_delete"        : "确定删除 “{name}” 吗？",
            "message_deleteUpload"  : "确定取消 “{name}” 的上传吗？",
            "button_ok"             : "确定",
            "button_cancel"         : "取消"
        }
    }
</i18n>

<template>
    <div class="input-upload-component" :class="{ '@drag': drag, '@disabled': disabled }">

        <!-- 上传 -->
        <el-upload class="input-upload"
            :action="uploadAction"
            :http-request="() => handlerUpload(map[ list[ list.length - 1 ].file.id ])"
            :before-upload="handlerUploadInspect"
            :on-change="handlerUploadMap"
            :show-file-list="false"
            :multiple="false"
            :drag="drag"
            :disabled="disabled">
            <template>

                <!-- 标准上传 -->
                <el-button v-if="!drag" size="small" class="@light-colour" :disabled="disabled">
                    {{ $t('upload') }}
                </el-button>

                <!-- 拖拽上传 -->
                <template v-else>
                    <i class="vic-icon @base-batch-upload_solid"></i>
                    <span>
                        {{ $t('upload_drag') }}
                        <span>
                            {{ $t('upload_drag_a') }}
                        </span>
                    </span>
                </template>
            </template>

            <!-- 提示 -->
            <div v-if="uploadTip" slot="tip" class="el-upload__tip">
                {{ uploadTip }}
            </div>
        </el-upload>

        <!-- 列表 -->
        <transition-group tag="div" class="input-upload-list">
            <div v-for="(item, i) in list" :key="item.file.id" class="input-upload-list_item" :class="{ '@progress': item.progress.visible, '@error': item.error.visible }">

                <!-- 文件 -->
                <div class="input-upload-list_file">
                    <el-tooltip placement="bottom-start" :content="item.file.name" :disabled="listTipDisabled[i]">
                        <a ref="input-upload-list_file-name" class="input-upload-list_file-name" :href="item.file.url" target="_blank">
                            <span>
                                {{ item.file.name }}
                            </span>
                        </a>
                    </el-tooltip>
                    <i class="vic-icon" :class="item.file.icon"></i>
                    <i class="vic-icon @base-success_circle-solid"></i>
                    <i class="vic-icon @base-sigh_circle-solid"></i>
                    <i class="vic-icon @base-fail_circle-solid" @click="handlerDelete(item, i)"></i>
                </div>

                <!-- 进度 -->
                <div class="input-upload-list_progress">
                    <div class="input-upload-list_progress-thumb" :style="{ 'width': (item.progress.value + '%') }"></div>
                    <div class="input-upload-list_progress-text">{{ item.progress.value.toFixed(2) }}%</div>
                </div>

                <!-- 错误 -->
                <div class="input-upload-list_error">
                    {{ item.error.value }}
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            uploadTip: {
                type: String
            },

            uploadAction: {
                type: String
            },

            uploadWithName: {
                type: String
            },

            uploadWithData: {
                type: Object
            },

            uploadNext: {
                type: Function
            },

            fileList: {
                type: Array
            },

            fileAccept: {
                type: Array
            },

            fileSizeLimit: {
                type: Number
            },

            fileQuantityLimit: {
                type: Number
            },

            drag: {
                type: Boolean
            },

            disabled: {
                type: Boolean
            },

            i18n: {
                type: Object
            }

        },

        computed: {

            fileQuantity() {

                let fileQuantity, a, i;

                for (fileQuantity = 0, i = 0; a = this.list[i]; i++) {

                    if (!a.error.visible) fileQuantity++;

                }

                return fileQuantity;

            }

        },

        methods: {

            /**
             * 处理上传
             */
            handlerUpload($map) {

                let uploadNext = ($res, $message) => {

                    switch ($message.type) {

                        case 'success' :
                            $map.listItem.file.url = $res.body.data, this.handlerFileListSync($map.listItem, true); break;

                        case 'error' :
                            this.handlerError($map.listItem, $message.message); break;

                    }

                    $map.listItem.progress.visible = false, delete this.map[ $map.listItem.file.id ];

                };

                let uploadProgress = ($res) => {

                    $map.listItem.progress.value = $res.loaded / $res.total * 100;

                };

                let uploadBefore = ($req) => {

                    $map.listItem.progress.visible = true, $map.request = $req;

                };

                let fd = () => {

                    let fd, i;

                    for (i in fd = new FormData, fd.append(this.uploadWithName, $map.file.raw), this.uploadWithData) {

                        fd.append(i, this.uploadWithData[i]);

                    }

                    return fd;

                };

                $http.post(this.uploadAction, fd(), { before: uploadBefore, progress: uploadProgress }).then(($res) => this.uploadNext($res, uploadNext.bind(this, $res)), ($res) => this.uploadNext($res, uploadNext.bind(this, $res)));

            },

            handlerUploadInspect($file) {

                switch (true) {

                    // 检查文件类型
                    case (this.fileAccept && this.fileAccept.indexOf($file.type) === -1) :
                        this.handlerError(this.map[ $file.uid ].listItem, this.$t('error_fileAccept'));
                        delete this.map[ $file.uid ];
                        return false;

                    // 检查文件大小
                    case (this.fileSizeLimit && this.fileSizeLimit < $file.size) :
                        this.handlerError(this.map[ $file.uid ].listItem, this.$t('error_fileSize'));
                        delete this.map[ $file.uid ];
                        return false;

                    // 检查文件数量
                    case (this.fileQuantityLimit && this.fileQuantityLimit < this.fileQuantity) :
                        this.handlerError(this.map[ $file.uid ].listItem, this.$t('error_fileQuantity'));
                        delete this.map[ $file.uid ];
                        return false;

                }

            },

            handlerUploadMap($file) {

                let map = {

                    // 文件对象
                    file: $file,

                    // 请求对象
                    request: null,

                    // 列表项
                    listItem: this.handlerFileList(
                        {
                            id: $file.uid,
                            name: $file.name
                        }
                    )

                };

                this.map[ $file.uid ] = map, this.list.push(map.listItem), this.$nextTick(() => this.handlerFileTip(this.list.length - 1));

            },

            /**
             * 处理文件
             */
            handlerFileList($item) {

                if ($item !== undefined) {

                    return {
                        file: {
                            id      : $item.id,
                            name    : $item.name,
                            icon    : this.handlerFileIcon($item.name),
                            url     : $item.url
                        },
                        progress: {
                            visible : false,
                            value   : 0
                        },
                        error: {
                            visible : false,
                            value   : ''
                        }
                    };

                }

                else {

                    let a, i;

                    for (i = 0; a = this.fileList[i]; i++) this.list.push(this.handlerFileList({ id: Math.random(), ...a }));

                }

            },

            handlerFileListSync($item, $true) {

                if ($true) {

                    if ($item.file.url) {

                        let a = {
                            name: $item.file.name,
                            url: $item.file.url
                        };

                        this.fileList.push(a), this.$emit('add-file', a, this.fileList.length - 1);

                    }

                }

                else {

                    let a, i;

                    for (i = 0; a = this.fileList[i]; i++) {

                        if (a.url === $item.file.url) {

                            this.fileList.splice(i, 1), this.$emit('delete-file', a, i);

                            break;

                        }

                    }

                }

            },

            handlerFileIcon($name) {

                switch (true) {

                    case (/\.xlsx?$/).test($name) :
                        return '@icon-excel';

                    case (/\.pdf$/).test($name) :
                        return '@icon-pdf';

                    default :
                        return '@icon-file';

                }

            },

            handlerFileTip($i) {

                if (typeof $i === 'number') {

                    let el;

                    this.$set(this.listTipDisabled, $i, ((el = this.$refs['input-upload-list_file-name'][$i]).offsetWidth > el.firstChild.offsetWidth));

                }

                else if (!this.handlerFileTip._h) {

                    let h = () => {

                        for (let i = 0; this.list[i]; i++) this.handlerFileTip(i);

                        delete this.handlerFileTip._h;

                    };

                    this.$nextTick(h), this.handlerFileTip._h = true;

                }

            },

            /**
             * 处理删除
             */
            handlerDelete($item, $i) {

                // 删除正在上传的文件
                if ($item.progress.visible) {

                    let h = () => {

                        this.map[ $item.file.id ].request.abort();

                    };

                    this.$confirm(
                        this.$t('message_deleteUpload', { name: $item.file.name }),
                        this.$t('message_title'),
                        {
                            confirm: h,
                            confirmButtonText: this.$t('button_ok'),
                            cancelButtonText: this.$t('button_cancel')
                        }
                    );

                }

                // 删除文件
                else if (!$item.error.visible) {

                    let h = () => {

                        this.list.splice($i, 1);
                        this.handlerFileListSync($item);

                    };

                    this.$confirm(
                        this.$t('message_delete', { name: $item.file.name }),
                        this.$t('message_title'),
                        {
                            confirm: h,
                            confirmButtonText: this.$t('button_ok'),
                            cancelButtonText: this.$t('button_cancel')
                        }
                    );

                }

                else this.list.splice($i, 1);

            },

            /**
             * 处理错误
             */
            handlerError($item, $error) {

                $item.error.visible = true;
                $item.error.value = $error;

                // 抛出错误
                this.$emit('error', $error);

            }

        },

        mounted() {

            if (this.i18n) Object.assign(this.$i18n._vm.messages[ this.$i18n._vm.locale ], this.i18n[ this.$i18n._vm.locale ]);

            this.handlerFileList();
            this.handlerFileTip();

            window.addEventListener('resize', this.handlerFileTip);

        },

        beforeDestroy() {

            window.removeEventListener('resize', this.handlerFileTip);

        },

        data() {

            return {
                map: {},
                list: [],
                listTipDisabled: []
            };

        }

    }

</script>
