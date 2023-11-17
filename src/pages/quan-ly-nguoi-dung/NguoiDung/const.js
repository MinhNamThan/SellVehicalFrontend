export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
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
        width: 175
    },
    {
        title: 'Đại lý',
        width: 200,
        scopedSlots: { customRender: 'agent' }
    },
    {
        title: 'Nhóm người dùng',
        width: 200,
        scopedSlots: { customRender: 'group' }
    },
    {
        title: 'Loại tài khoản',
        dataIndex: 'type',
        width: 200,
        scopedSlots: { customRender: 'type' }
    },
    {
        title: 'Thao tác',
        width: 150,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const columns2 = [
    {
        title: 'STT',
        width: 50,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 180
    },
    {
        title: 'Họ và tên',
        dataIndex: 'name',
        width: 150
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'mobile',
        width: 120
    },
    {
        title: 'Đại lý',
        width: 125,
        scopedSlots: { customRender: 'agent' }
    },
    {
        title: 'Nhóm người dùng',
        width: 100,
        scopedSlots: { customRender: 'group' }
    },
    {
        title: 'Loại tài khoản',
        dataIndex: 'type',
        width: 100,
        scopedSlots: { customRender: 'type' }
    },
    {
        title: 'Thao tác',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const pagination = {
    pageSize: 50,
    current: 1,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '150']
};

export const addFormRules = {
    email: [
        {
            required: true,
            message: 'Vui lòng nhập email',
            whitespace: true
        }
    ],
    name: [
        {
            required: true,
            message: 'Vui lòng nhập họ và tên',
            whitespace: true
        }
    ],
    mobile: [
        {
            required: true,
            message: 'Vui lòng nhập số điện thoại',
            whitespace: true
        }
    ],
    password: [
        {
            required: true,
            message: 'Vui lòng nhập mật khẩu'
        },
        {
            min: 8,
            message: 'Mật khẩu phải có ít nhất 8 ký tự'
        }
    ],
    agentId: [
        {
            required: true,
            message: 'Vui lòng chọn đại lý'
        }
    ],
    group_id: [
        {
            required: true,
            message: 'Vui lòng chọn nhóm người dùng'
        }
    ]
};

export const changeFormRules = (checkTrungPassword) => {
    return {
        password: [
            {
                required: true,
                message: 'Vui lòng nhập mật khẩu'
            },
            {
                min: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự'
            }
        ],
        rePassword: [
            {
                required: true,
                message: 'Vui lòng nhập lại mật khẩu'
            },
            {
                min: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự'
            },
            {
                validator: checkTrungPassword,
                trigger: 'change'
            }
        ]
    };
};
