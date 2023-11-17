export const columns = [
    {
        title: 'STT',
        width: 40,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Mã phần cứng',
        dataIndex: 'name',
        width: 180
    },
    {
        title: 'Mô tả',
        dataIndex: 'type',
        width: 180
    },
    {
        title: 'Thời gian bảo hành (tháng)',
        dataIndex: 'guarantee',
        width: 100,
        scopedSlots: { customRender: 'guarantee' }
    },
    {
        title: 'Thao tác',
        width: 50,
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

export const rules = {
    name: [{ required: true, message: 'Vui lòng nhập mã phần cứng', whitespace: true }],
    type: [{ required: true, message: 'Vui lòng nhập mô tả', whitespace: true }],
    guarantee: [{ required: true, message: 'Vui lòng nhập thời gian bảo hành' }]
};
