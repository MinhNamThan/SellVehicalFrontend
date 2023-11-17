export const columns = [
    {
        title: 'STT',
        width: 40,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Tên nhóm',
        dataIndex: 'name',
        width: 200
    },
    {
        title: 'Mô tả',
        dataIndex: 'desc',
        width: 300
    },
    {
        title: 'Phân quyền',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'permission' }
    },
    {
        title: 'Thao tác',
        width: 100,
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

export const addFormRules = {
    name: [
        {
            required: true,
            message: 'Vui lòng nhập tên',
            whitespace: true
        }
    ]
};

export const defaultPermissionList = {
    'san-pham': {
        name: 'Quản lý sản phẩm',
        category: 'Quản lý sản phẩm',
        access: false,
        modify: false
    },
    'bao-gia': {
        name: 'Quản lý báo giá',
        category: 'Quản lý báo giá',
        access: false,
        modify: false
    },
    'don-hang': {
        name: 'Quản lý đơn hàng',
        category: 'Quản lý đơn hàng',
        access: false,
        modify: false
    },
    'phan-cung': {
        name: 'Quản lý thiết bị',
        category: 'Danh sách phần cứng',
        access: false,
        modify: false
    },
    firmware: {
        name: 'Quản lý thiết bị',
        category: 'Danh sách firmware',
        access: false,
        modify: false
    },
    'ung-dung': {
        name: 'Quản lý thiết bị',
        category: 'Danh sách ứng dụng',
        access: false,
        modify: false
    },
    'thiet-bi': {
        name: 'Quản lý thiết bị',
        category: 'Danh sách thiết bị',
        access: false,
        modify: false
    },
    'nhom-nguoi-dung': {
        name: 'Quản lý hệ thống',
        category: 'Nhóm người dùng',
        access: false,
        modify: false
    },
    'nguoi-dung': {
        name: 'Quản lý hệ thống',
        category: 'Danh sách người dùng',
        access: false,
        modify: false
    },
    'dai-ly': {
        name: 'Quản lý đại lý',
        category: 'Danh sách đại lý',
        access: false,
        modify: false
    },
    'thiet-bi-dai-ly': {
        name: 'Quản lý đại lý',
        category: 'Thiết bị đại lý',
        access: false,
        modify: false
    },
    'nhom-khach-hang': {
        name: 'Quản lý khách hàng',
        category: 'Nhóm khách hàng',
        access: false,
        modify: false
    },
    'khach-hang': {
        name: 'Quản lý khách hàng',
        category: 'Danh sách khách hàng',
        access: false,
        modify: false
    },
    'thong-bao': {
        name: 'Quản lý thông báo',
        category: 'Quản lý thông báo',
        access: false,
        modify: false
    },
    'ho-tro': {
        name: 'Hỗ trợ kỹ thuật',
        category: 'Hỗ trợ kỹ thuật',
        access: false,
        modify: false
    },
    'thong-ke': {
        name: 'Báo cáo thống kê',
        category: 'Báo cáo thống kê',
        access: false,
        modify: false
    }
};

export const permissionColumns = [
    {
        title: 'STT',
        width: '10%',
        scopedSlots: { customRender: 'stt' },
        align: 'center'
    },
    {
        title: 'Nhóm chức năng',
        dataIndex: 'name'
    },
    {
        title: 'Danh mục quản lý',
        dataIndex: 'category'
    },
    {
        dataIndex: 'access',
        width: '10%',
        slots: { title: 'Truy cập' },
        scopedSlots: { customRender: 'access' },
        align: 'center'
    },
    {
        dataIndex: 'modify',
        width: '10%',
        slots: { title: 'Thay đổi' },
        scopedSlots: { customRender: 'modify' },
        align: 'center'
    }
];
