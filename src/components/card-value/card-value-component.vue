<style lang="scss" src="./card-value-component.scss" scoped></style>

<i18n>
    {
        "zh-CN": {

        }
    }
</i18n>

<template>
    <div class="card-value-component" :class="{ '@short': !sub }">

        <!-- title -->
        <div class="card-value-title">
            {{ title }}
        </div>

        <!-- value -->
        <div class="card-value-value">

            <span class="card-value-before">
                <slot name="value-before"></slot>
            </span>

            <span class="card-value-value">
                {{ value | toSeparateString }}
            </span>

            <span class="card-value-after">
                <slot name="value-after"></slot>
            </span>

        </div>

        <!-- sub -->
        <div v-if="sub" class="card-value-sub">

            <div class="card-value-title">
                {{ sub.title }}
            </div>

            <div v-for="(value, i) in sub.value" :key="i" class="card-value-value">
                <i v-if="value[1]" class="vic-icon" :class="{ '@base-trend_solid': (value[1] === 'up'), '@base-decline_solid': (value[1] === 'down') }"></i> {{ value[0] | toSeparateString }}
            </div>

        </div>
    </div>
</template>

<script type="text/jsx">

    export default {

        props: {

            title: {
                type: String
            },

            value: {
                type: Number | String
            },

            sub: {
                // {
                //     title: '值',
                //     value: [
                //         ['20%', 'up'],
                //         ['20%', 'down'],
                //         [100000]
                //     ]
                // }
                //
                type: Object
            }

        },

        filters: {

            toSeparateString($value) {

                if (typeof $value === 'number') $value = $value.toSeparateString();

                return $value;

            }

        },

        data() {

            return {};

        }

    }

</script>
