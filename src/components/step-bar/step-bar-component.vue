<style lang="scss" src="./step-bar-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="step-bar-component" :class="{ '@horizontal': (mode === 'horizontal'), '@vertical': (mode === 'vertical') }">

        <!-- horizontal -->
        <template v-if="mode === 'horizontal'">
            <div v-for="(data, i) in mixData" :key="i" class="step-bar-step" :class="{ '@entry': data.entry, '@finished': data.finished, '@pointer': (data.key === pointer) }">
                <i class="step-bar-step_circle"></i>
                <i class="step-bar-step_line"></i>
                <a class="step-bar-step_link" @click="handlerStepClick(data)">{{ data.name }}</a>
            </div>
        </template>

        <!-- vertical -->
        <template v-else-if="mode === 'vertical'">
            <div v-for="(data, i) in mixData" :key="i" class="step-bar-step" :class="{ '@entry': data.entry, '@finished': data.finished, '@pointer': (data.key === pointer) }">
                <div class="step-bar-step">
                    <i class="step-bar-step_circle"></i>
                    <i class="step-bar-step_line"></i>
                    <a class="step-bar-step_link" @click="handlerStepClick(data)">{{ data.name }}</a>
                </div>
                <div v-if="data.children" class="step-bar-step_children">
                    <a v-for="(data, i) in data.children" :key="i" class="step-bar-step_link" :class="{ '@entry': data.entry, '@finished': data.finished, '@pointer': (data.key === pointer) }" @click="handlerStepClick(data)">{{ data.name }}</a>
                </div>
            </div>
        </template>

    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            mode: {
                type: String
            },

            data: {
                // horizontal
                // [
                //     {
                //         key: Number,
                //         name: String
                //     },
                //     ...
                // ]
                //
                // vertical
                // [
                //     {
                //         name: String,
                //         children: [
                //             {
                //                 key: Number,
                //                 name: String
                //             },
                //             ...
                //         ]
                //     },
                //     ...
                // ]
                //
                type: Array
            },

            entry: {
                type: Number
            }

        },

        computed: {

            mixData() {

                let finished = true;

                let h = ($data) => {

                    let data, children, entry, a, i;

                    for (data = [], i = 0; a = $data[i]; i++) {

                        // children
                        if (a.children) children = h(a.children); else children = null;

                        // entry, finished, pointer
                        if (a.key === this.entry) entry = data.entry = true, finished = false, this.pointer = a.key; else entry = false;

                        data.push(
                            {
                                key         : a.key,
                                name        : a.name,
                                children    : children,
                                entry       : children ? children.entry : entry,
                                finished    : finished
                            }
                        );

                    }

                    return data;

                };

                return h(this.data);

            }

        },

        methods: {

            handlerStepClick($step) {

                if ($step.key !== undefined) {

                    if ($step.key !== this.pointer && ($step.key === this.entry || $step.finished)) {

                        // 1
                        this.pointer = $step.key;

                        // 2
                        this.$emit('step-click', $step.key, $step.name);

                    }

                }

                else if ($step.children) this.handlerStepClick($step.children[0]);

            }

        },

        data() {

            return { pointer: null };

        }

    }

</script>
