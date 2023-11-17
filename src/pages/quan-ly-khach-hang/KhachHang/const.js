export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'name',
        width: 160
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 210
    },
    {
        title: 'Nhóm khách hàng',
        dataIndex: 'groups',
        width: 195,
        scopedSlots: { customRender: 'group' }
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        width: 110
    },
    {
        title: 'Trạng thái',
        width: 115,
        align: 'center',
        scopedSlots: { customRender: 'status' }
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
        width: 105,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 105,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    },
    {
        title: 'Thao tác',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const columns2 = [
    {
        title: 'STT',
        width: 45,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'name',
        width: 100
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 145
    },
    {
        title: 'Nhóm khách hàng',
        dataIndex: 'groups',
        width: 190,
        scopedSlots: { customRender: 'group' }
    },
    {
        title: 'Số điện thoại',
        dataIndex: 'phoneNumber',
        width: 100
    },
    {
        title: 'Trạng thái',
        width: 125,
        align: 'center',
        scopedSlots: { customRender: 'status' }
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
        width: 65,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 65,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    },
    {
        title: 'Thao tác',
        width: 70,
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

export const changeFormRules = (checkKhacEmail) => {
    return {
        email1: [
            {
                required: true,
                message: 'Vui lòng nhập email 1',
                whitespace: true
            }
        ],
        email2: [
            {
                required: true,
                message: 'Vui lòng nhập email 2',
                whitespace: true
            },
            {
                validator: checkKhacEmail,
                trigger: 'change'
            }
        ]
    };
};

export const changeModalInfo =
    'Toàn bộ dữ liệu của tài khoản chủ nhà với email 1 sẽ được thay thế bằng dữ liệu của tài khoản chủ nhà với email 2 và ngược lại';

export const types = [
    { name: 'General', color: '#1890ff' },
    { name: 'Internal', color: '#28a745' },
    { name: 'External', color: '#fa832d' },
    { name: 'Restricted', color: '#ff4d52' }
];
