
    export default {

        _httpCache: {},

        /**
         * 处理返回值
         */
        handlerResponse($res, $inspect, $success, $error) {

            let a;

            switch (true) {

                case Boolean($inspect && (a = $inspect($res))) :
                    $error(a); break;

                default :
                    $success($res);

            }

        }

    }
