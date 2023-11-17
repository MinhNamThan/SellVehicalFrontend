export const columns = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Mã ứng dụng',
        dataIndex: 'package',
        width: 140
    },
    {
        title: 'Tên ứng dụng',
        dataIndex: 'name',
        width: 140
    },
    {
        title: 'Thử nghiệm',
        width: 240,
        scopedSlots: { customRender: 'application_info_test' }
    },
    {
        title: 'Chính thức',
        width: 240,
        scopedSlots: { customRender: 'application_info' }
    },
    {
        title: 'Thao tác',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const rules = {
    package: [
        {
            required: true,
            message: 'Vui lòng nhập mã ứng dụng',
            whitespace: true
        }
    ],
    name: [
        {
            required: true,
            message: 'Vui lòng nhập tên ứng dụng',
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
