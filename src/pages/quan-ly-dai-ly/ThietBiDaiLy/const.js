export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Địa chỉ MAC',
        dataIndex: 'mac',
        width: 120,
        scopedSlots: { customRender: 'mac' }
    },
    {
        title: 'Model',
        dataIndex: 'platform',
        scopedSlots: { customRender: 'platform' },
        width: 140
    },
    {
        title: 'Nhà',
        width: 110,
        scopedSlots: { customRender: 'home' }
    },
    {
        title: 'Tên khách hàng',
        width: 120,
        scopedSlots: { customRender: 'name' }
    },
    {
        title: 'Email',
        width: 200,
        scopedSlots: { customRender: 'email' }
    },
    {
        title: 'Phiên bản',
        width: 100,
        scopedSlots: { customRender: 'version' }
    },
    {
        title: 'IP nội mạng',
        width: 120,
        scopedSlots: { customRender: 'ip' }
    },
    {
        title: 'Phiên bản tunnel',
        width: 125,
        scopedSlots: { customRender: 'tunnel' }
    },
    {
        title: 'Đại lý',
        width: 120,
        scopedSlots: { customRender: 'agent' }
    },
    {
        title: 'Trạng thái',
        width: 120,
        align: 'center',
        scopedSlots: { customRender: 'status' }
    },
    {
        title: 'Thao tác',
        width: 80,
        align: 'center',
        scopedSlots: { customRender: 'action' }
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
        title: 'Địa chỉ MAC',
        dataIndex: 'mac',
        width: 80,
        scopedSlots: { customRender: 'mac' }
    },
    {
        title: 'Model',
        dataIndex: 'platform',
        scopedSlots: { customRender: 'platform' },
        width: 80
    },
    {
        title: 'Nhà',
        width: 70,
        scopedSlots: { customRender: 'home' }
    },
    {
        title: 'Tên khách hàng',
        width: 75,
        scopedSlots: { customRender: 'name' }
    },
    {
        title: 'Email',
        width: 100,
        scopedSlots: { customRender: 'email' }
    },
    {
        title: 'Phiên bản',
        width: 60,
        scopedSlots: { customRender: 'version' }
    },
    {
        title: 'IP nội mạng',
        width: 70,
        scopedSlots: { customRender: 'ip' }
    },
    {
        title: 'Phiên bản tunnel',
        width: 70,
        scopedSlots: { customRender: 'tunnel' }
    },
    {
        title: 'Đại lý',
        width: 80,
        scopedSlots: { customRender: 'agent' }
    },
    {
        title: 'Trạng thái',
        width: 115,
        align: 'center',
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

export const tunnelFormRules = {
    tunnel_url: [
        {
            required: true,
            message: 'Vui lòng chọn tunnel'
        }
    ]
};

export const tunnels = ['javisco.com', 'javiscloud.com', 'javishome.io'];
