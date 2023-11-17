export const columns = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Tên khách hàng',
        dataIndex: 'name',
        width: 200
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: 250
    },
    {
        title: 'Ngày đăng ký',
        dataIndex: 'createdAt',
        width: 150,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    },
    {
        title: ' Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 150,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    },
    {
        title: 'Thao tác',
        width: 90,
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
