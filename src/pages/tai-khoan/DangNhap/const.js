export const emailRules = [
    {
        required: true,
        message: 'Vui lòng nhập email',
        whitespace: true
    }
];

export const passwordRules = [
    {
        required: true,
        message: 'Vui lòng nhập mật khẩu'
    },
    {
        min: 8,
        message: 'Mật khẩu phải có ít nhất 8 ký tự'
    }
];

export const codeRules = [
    {
        required: true,
        message: 'Vui lòng nhập mã xác nhận'
    },
    {
        pattern: /^\s*[0-9]{6}\s*$/,
        message: 'Mã xác nhận phải có 6 chữ số'
    }
];
