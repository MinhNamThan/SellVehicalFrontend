export const columns = [
    {
        title: 'STT',
        width: 50,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Tên nhóm',
        dataIndex: 'name',
        width: 250
    },
    {
        title: 'Loại nhóm',
        dataIndex: 'type',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'type' }
    },
    {
        title: 'Mô tả',
        dataIndex: 'desc',
        width: 400
    }
];

export const pagination = {
    pageSize: 50,
    current: 1,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '50', '100', '150']
};

export const formRules = {
    name: [
        {
            required: true,
            message: 'Vui lòng nhập tên nhóm',
            whitespace: true
        }
    ],
    type: [
        {
            required: true,
            message: 'Vui lòng chọn loại nhóm'
        }
    ]
};

export const types = [
    { name: 'General', color: '#1890ff' },
    { name: 'Internal', color: '#28a745' },
    { name: 'External', color: '#fa832d' },
    { name: 'Restricted', color: '#ff4d52' }
];
