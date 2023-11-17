export const columns = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Tên thiết bị',
        dataIndex: 'name',
        width: 300
    },
    {
        title: 'Loại thiết bị',
        dataIndex: 'type',
        width: 150
    },
    {
        title: 'ID thiết bị',
        dataIndex: 'entityId',
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
