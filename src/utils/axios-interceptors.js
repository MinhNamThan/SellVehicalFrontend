import userService from '../services/user';
const resp401 = {
    onFulfilled(response) {
        return response;
    },
    onRejected(error) {
        console.log(error);
        const { response } = error;
        if (response.status === 401) {
            userService.logout();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
};

const resp403 = {
    onFulfilled(response) {
        return response;
    },
    onRejected(error) {
        return Promise.reject(error);
    }
};

const reqCommon = {
    onFulfilled(config) {
        return config;
    },
    onRejected(error, options) {
        const { message } = options;
        message.error(error.message);
        return Promise.reject(error);
    }
};

export default {
    request: [reqCommon],
    response: [resp401, resp403]
};
