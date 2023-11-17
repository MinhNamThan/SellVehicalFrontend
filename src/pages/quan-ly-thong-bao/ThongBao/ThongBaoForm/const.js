export const rules = {
    sendAll: [
        {
            required: true,
            message: 'Vui lòng chọn phương thức gửi'
        }
    ],
    customerGroups: [
        {
            required: true,
            message: 'Vui lòng chọn nhóm khách hàng'
        }
    ],
    type: [
        {
            required: true,
            message: 'Vui lòng chọn loại thông báo'
        }
    ],
    title: [
        {
            required: true,
            message: 'Vui lòng nhập tiêu đề',
            whitespace: true
        }
    ],
    content: [
        {
            required: true,
            message: 'Vui lòng nhập nội dung',
            whitespace: true
        }
    ],
    status: [
        {
            required: true,
            message: 'Vui lòng chọn thời gian gửi'
        }
    ],
    schedule: [
        {
            required: true,
            message: 'Vui lòng chọn thời điểm'
        }
    ]
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
    { value: 'SENT', name: 'Bây giờ' },
    { value: 'SCHEDULED', name: 'Theo thời gian lên lịch' }
];
