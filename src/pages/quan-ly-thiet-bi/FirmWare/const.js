export const columns = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Mã phần cứng',
        dataIndex: 'hardware',
        width: 240
    },
    {
        title: 'Thử nghiệm',
        width: 240,
        scopedSlots: { customRender: 'firmware_info_test' }
    },
    {
        title: 'Chính thức',
        width: 240,
        scopedSlots: { customRender: 'firmware_info' }
    },
    {
        title: 'Thao tác',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const rules = {
    hardware: [
        {
            required: true,
            message: 'Vui lòng chọn mã phần cứng'
        }
    ],
    version: [
        {
            required: true,
            message: 'Vui lòng nhập phiên bản',
            whitespace: true
        }
    ],
    build: [
        {
            required: true,
            message: 'Vui lòng nhập bản build'
        }
    ],
    file: [
        {
            required: true,
            message: 'Vui lòng chọn phần cứng'
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
