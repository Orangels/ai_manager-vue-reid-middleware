
    export default {
        namespaced: true,

        state: {
            value: null
        },

        mutations: {

            write($state, $value) {

                $state.value = $value;

            }

        }

    }
