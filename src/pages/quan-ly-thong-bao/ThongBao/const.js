export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Tiêu đề',
        dataIndex: 'title',
        width: 200
    },
    {
        title: 'Nội dung',
        dataIndex: 'content',
        width: 250,
        scopedSlots: { customRender: 'content' }
    },
    {
        title: 'Loại thông báo',
        dataIndex: 'type',
        width: 145,
        scopedSlots: { customRender: 'type' }
    },
    {
        title: 'Gửi tới',
        dataIndex: 'customerGroups',
        width: 250,
        scopedSlots: { customRender: 'send_to' }
    },
    {
        title: 'Thời gian gửi',
        width: 180,
        scopedSlots: { customRender: 'send_time' }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 125,
        scopedSlots: { customRender: 'status' }
    },
    {
        title: 'Thao tác',
        width: 90,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const columns2 = [
    {
        title: 'STT',
        width: 50,
        align: 'center',
        scopedSlots: { customRender: 'no' }
    },
    {
        title: 'Tiêu đề',
        dataIndex: 'title',
        width: 140
    },
    {
        title: 'Nội dung',
        dataIndex: 'content',
        width: 180,
        scopedSlots: { customRender: 'content' }
    },
    {
        title: 'Loại thông báo',
        dataIndex: 'type',
        width: 90,
        scopedSlots: { customRender: 'type' }
    },
    {
        title: 'Gửi tới',
        dataIndex: 'customerGroups',
        width: 200,
        scopedSlots: { customRender: 'send_to' }
    },
    {
        title: 'Thời gian gửi',
        width: 95,
        scopedSlots: { customRender: 'send_time' }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 75,
        scopedSlots: { customRender: 'status' }
    },
    {
        title: 'Thao tác',
        width: 60,
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

export const mapColorTagType = [
    { name: 'General', color: '#1890ff' },
    { name: 'Internal', color: '#28a745' },
    { name: 'External', color: '#fa832d' },
    { name: 'Restricted', color: '#ff4d52' }
];

export const listTypeNoti = [
    { value: 'CAP_NHAT', name: 'Cập nhật' },
    { value: 'KHUYEN_MAI', name: 'Khuyến mãi' },
    { value: 'HE_THONG', name: 'Hệ thống' },
    { value: 'KHAC', name: 'Khác' }
];

export const listStatusNoti = [
    { value: 'SENT', name: 'Đã gửi' },
    { value: 'SCHEDULED', name: 'Đang lên lịch' }
];
