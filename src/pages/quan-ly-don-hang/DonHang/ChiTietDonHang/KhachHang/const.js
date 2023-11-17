export const formRules = {
    name: [
        {
            required: true,
            message: 'Vui lòng nhập tên khách hàng',
            whitespace: true
        }
    ],
    address: [
        {
            required: true,
            message: 'Vui lòng nhập địa chỉ khách hàng',
            whitespace: true
        }
    ],
    mobile: [
        {
            required: true,
            message: 'Vui lòng nhập số điện thoại khách hàng khách hàng',
            whitespace: true
        }
    ]
};
