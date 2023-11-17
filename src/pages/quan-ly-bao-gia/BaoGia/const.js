export const columns1 = [
    {
        title: 'STT',
        width: 45,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Đại lý',
        width: 160,
        scopedSlots: {
            customRender: 'agent',
            filterDropdown: 'agentFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Người tạo',
        width: 140,
        scopedSlots: { customRender: 'owner' }
    },
    {
        title: 'Tên báo giá',
        dataIndex: 'name',
        width: 160
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 150,
        scopedSlots: {
            customRender: 'status',
            filterDropdown: 'statusFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Tên khách hàng',
        width: 185,
        scopedSlots: { customRender: 'customer' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 130,
        align: 'right',
        scopedSlots: {
            customRender: 'date',
            filterDropdown: 'dateFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Tổng chi phí',
        width: 145,
        align: 'right',
        scopedSlots: { customRender: 'sum' }
    },
    {
        title: 'Thao tác',
        width: 110,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const columns2 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Đại lý',
        width: 105,
        scopedSlots: {
            customRender: 'agent',
            filterDropdown: 'agentFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Người tạo',
        width: 125,
        scopedSlots: { customRender: 'owner' }
    },
    {
        title: 'Tên báo giá',
        dataIndex: 'name',
        width: 115
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 140,
        scopedSlots: {
            customRender: 'status',
            filterDropdown: 'statusFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Tên khách hàng',
        width: 105,
        scopedSlots: { customRender: 'customer' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 105,
        align: 'right',
        scopedSlots: {
            customRender: 'date',
            filterDropdown: 'dateFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Tổng chi phí',
        width: 110,
        align: 'right',
        scopedSlots: { customRender: 'sum' }
    },
    {
        title: 'Thao tác',
        width: 110,
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

export const formRules = {
    status: [
        {
            required: true,
            message: 'Vui lòng chọn trạng thái'
        }
    ]
};

export const statuses = [
    { value: 'DRAFT', name: 'Bản nháp', color: '#aaaaaa' },
    { value: 'SENT_CUSTOMER', name: 'Đã gửi khách hàng', color: '#fa832d' },
    { value: 'CUSTOMER_ACCEPTED', name: 'Khách đồng ý', color: '#28a745' },
    { value: 'ORDERED', name: 'Đã đặt hàng', color: '#1890ff' },
    { value: 'COMPLETED', name: 'Hoàn thành triển khai', color: '#8957e5' },
    { value: 'CUSTOMER_REJECTED', name: 'Khách từ chối', color: '#ff4d52' }
];
