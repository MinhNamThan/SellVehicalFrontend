export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Ảnh',
        dataIndex: 'anhDaiDien',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'img' }
    },
    {
        title: 'Tên sản phẩm',
        width: 205,
        scopedSlots: { customRender: 'ten' }
    },
    {
        title: 'Nhãn hiệu',
        dataIndex: 'nhanHieu',
        width: 100
    },
    {
        title: 'Tên phiên bản',
        dataIndex: 'tenPhienBan',
        width: 205
    },
    {
        title: 'Mã SKU',
        dataIndex: 'sku',
        width: 120
    },
    {
        title: 'Khối lượng',
        width: 80,
        scopedSlots: { customRender: 'khoiLuong' }
    },
    {
        title: 'Tồn kho',
        dataIndex: 'tonKho',
        width: 65,
        align: 'right'
    },
    {
        title: 'Đơn vị',
        dataIndex: 'donVi',
        width: 60,
        scopedSlots: { customRender: 'donVi' }
    },
    {
        title: 'Áp dụng thuế',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'thue' }
    },
    {
        title: 'Giá bán lẻ',
        dataIndex: 'giaBanLe',
        width: 100,
        scopedSlots: { customRender: 'gia' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 110,
        align: 'right',
        scopedSlots: { customRender: 'date' }
    }
];

export const columns2 = [
    {
        title: 'STT',
        width: 45,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Ảnh',
        dataIndex: 'anhDaiDien',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'img' }
    },
    {
        title: 'Tên sản phẩm',
        width: 135,
        scopedSlots: { customRender: 'ten' }
    },
    {
        title: 'Nhãn hiệu',
        dataIndex: 'nhanHieu',
        width: 60
    },
    {
        title: 'Tên phiên bản',
        dataIndex: 'tenPhienBan',
        width: 135
    },
    {
        title: 'Mã SKU',
        dataIndex: 'sku',
        width: 75
    },
    {
        title: 'Khối lượng',
        width: 60,
        scopedSlots: { customRender: 'khoiLuong' }
    },
    {
        title: 'Tồn kho',
        dataIndex: 'tonKho',
        width: 50,
        align: 'right'
    },
    {
        title: 'Đơn vị',
        dataIndex: 'donVi',
        width: 50,
        scopedSlots: { customRender: 'donVi' }
    },
    {
        title: 'Áp dụng thuế',
        width: 55,
        align: 'center',
        scopedSlots: { customRender: 'thue' }
    },
    {
        title: 'Giá bán lẻ',
        dataIndex: 'giaBanLe',
        width: 85,
        scopedSlots: { customRender: 'gia' }
    },
    {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        width: 60,
        align: 'right',
        scopedSlots: { customRender: 'date' }
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

export const ruleFormSanPham = {
    ten: [
        {
            required: true,
            message: 'Vui lòng nhập tên sản phẩm',
            whitespace: true
        }
    ],
    tenPhienBan: [
        {
            required: true,
            message: 'Vui lòng nhập tên phiên bản',
            whitespace: true
        }
    ],
    sku: [
        {
            required: true,
            message: 'Vui lòng nhập mã sku',
            whitespace: true
        }
    ],
    donVi: [
        {
            required: true,
            message: 'Vui lòng nhập đơn vị',
            whitespace: true
        }
    ]
};
