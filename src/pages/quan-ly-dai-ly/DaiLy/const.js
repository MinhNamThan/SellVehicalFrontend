export const columns = [
    {
        title: 'STT',
        width: 30,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Tên đại lý',
        dataIndex: 'name',
        width: 120
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        width: 180
    },
    {
        title: 'Tỉnh/Thành phố',
        dataIndex: 'province',
        width: 80
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'mobile',
        width: 70
    },
    {
        title: 'Trạng thái',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'status' }
    }
];

export const columns_client = [
    {
        title: 'STT',
        width: 50,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 200
    },
    {
        title: 'Họ và tên',
        dataIndex: 'name',
        width: 200
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'mobile',
        width: 200
    },
    {
        title: 'Nhóm người dùng',
        width: 200,
        scopedSlots: { customRender: 'user_group' }
    }
];

export const rules = {
    name: [
        {
            required: true,
            message: 'Vui lòng nhập tên đại lý',
            whitespace: true
        }
    ],
    address: [
        {
            required: true,
            message: 'Vui lòng nhập địa chỉ',
            whitespace: true
        }
    ],
    province: [
        {
            required: true,
            message: 'Vui lòng nhập tỉnh/thành phố',
            whitespace: true
        }
    ],
    mobile: [
        {
            required: true,
            message: 'Vui lòng nhập số điện thoại',
            whitespace: true
        }
    ]
};

export const pagination = {
    pageSize: 50,
    current: 1,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '150']
};

export const pagination_client = {
    pageSize: 50,
    current: 1,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '150']
};
