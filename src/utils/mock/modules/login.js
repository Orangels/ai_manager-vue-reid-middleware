/**
 * Created by gjm on 19/10/17.
 */

const index = {
    data: {
        id: 1,
        token: "eyJpZHNzIjoiJDJ5JDEwJGNmMVpVb3BxM2lEUUk0bllVZXkxenUzajM0QVJlYmEuS3B4aDZ1MkNkY1J4clF6SE10MTRLIn0=_2018-04-27"
    }
};

const userInfo = {
    data: {
        status: "1",
        id: 1,
        username: "admin",
        authRules: ["mark-mgt", "task-center", "task-mgt", "task-process", "task-template"],
        token: "eyJpZHNzIjoiJDJ5JDEwJGNmMVpVb3BxM2lEUUk0bllVZXkxenUzajM0QVJlYmEuS3B4aDZ1MkNkY1J4clF6SE10MTRLIn0=_2018-04-27"
    }
};

const out = { code: 0, message: "success" };

const password = { code: 0, message: "success" };

export default {
    index,
    userInfo,
    out,
    password
};
