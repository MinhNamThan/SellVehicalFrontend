export const columns1 = [
    {
        slots: { title: 'STT' },
        width: 45,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        slots: { title: 'Ảnh' },
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'anh' }
    },
    {
        slots: { title: 'Tên sản phẩm' },
        width: 500,
        scopedSlots: { customRender: 'sanPham' }
    },
    {
        slots: { title: 'Số lượng' },
        dataIndex: 'soLuong',
        width: 100,
        align: 'center',
        scopedSlots: { customRender: 'soLuong' }
    },
    {
        slots: { title: 'Đơn giá' },
        dataIndex: 'giaBanLe',
        width: 140,
        scopedSlots: { customRender: 'donGia' }
    },
    {
        slots: { title: 'Chiết khấu' },
        width: 120,
        scopedSlots: { customRender: 'chietKhau' }
    },
    {
        slots: { title: 'Thành tiền' },
        width: 120,
        scopedSlots: { customRender: 'tong' }
    },
    {
        slots: { title: 'Bảo hành' },
        dataIndex: 'baoHanh',
        width: 120,
        scopedSlots: { customRender: 'baoHanh' }
    },
    {
        slots: { title: '' },
        width: 40,
        align: 'center',
        scopedSlots: { customRender: 'action' }
    }
];

export const columns2 = [
    {
        slots: { title: 'STT' },
        width: 45,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        slots: { title: 'Ảnh' },
        width: 70,
        align: 'center',
        scopedSlots: { customRender: 'anh' }
    },
    {
        slots: { title: 'Tên sản phẩm' },
        width: 220,
        scopedSlots: { customRender: 'sanPham' }
    },
    {
        slots: { title: 'Số lượng' },
        dataIndex: 'soLuong',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'soLuong' }
    },
    {
        slots: { title: 'Đơn giá' },
        dataIndex: 'giaBanLe',
        width: 100,
        scopedSlots: { customRender: 'donGia' }
    },
    {
        slots: { title: 'Chiết khấu' },
        width: 70,
        scopedSlots: { customRender: 'chietKhau' }
    },
    {
        slots: { title: 'Thành tiền' },
        width: 100,
        scopedSlots: { customRender: 'tong' }
    },
    {
        slots: { title: 'Bảo hành' },
        dataIndex: 'baoHanh',
        width: 100,
        scopedSlots: { customRender: 'baoHanh' }
    },
    {
        slots: { title: '' },
        width: 40,
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

export const editorOption = {
    modules: {
        toolbar: [
            {
                color: [false, '#ff0000', '#fa832d', '#28a745', '#1890ff', '#8957e5', '#ff007f']
            },
            'bold',
            'italic',
            'underline'
        ]
    },
    placeholder: '',
    theme: 'snow'
};
