export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Đại lý',
        width: 190,
        scopedSlots: { customRender: 'agent' }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 165,
        scopedSlots: {
            customRender: 'status',
            filterDropdown: 'statusFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Tên khách hàng',
        width: 200,
        scopedSlots: { customRender: 'customer' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 145,
        align: 'right',
        scopedSlots: {
            customRender: 'date',
            filterDropdown: 'dateFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Tổng chi phí',
        width: 160,
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
        scopedSlots: { customRender: 'agent' }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        width: 160,
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

export const statuses = [
    { value: 'ORDERED', name: 'Đã đặt hàng', color: '#00b2bf' },
    { value: 'PAID', name: 'Đã thanh toán', color: '#fa832d' },
    { value: 'PREPAIRING', name: 'Đang chuẩn bị hàng', color: '#f9f400' },
    { value: 'SENT', name: 'Đã gửi hàng', color: '#1890ff' },
    { value: 'NEED_CONFIRM', name: 'Cần xác nhận lại', color: '#d0770b' },
    { value: 'COMPLETE', name: 'Hoàn thành', color: '#8957e5' },
    { value: 'CANCEL', name: 'Hủy', color: '#ff4d52' }
];

export const formRules = {
    status: [
        {
            required: true,
            message: 'Vui lòng chọn trạng thái'
        }
    ]
};
