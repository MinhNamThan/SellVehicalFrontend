export const columns1 = [
    {
        title: 'STT',
        width: 60,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Địa chỉ MAC',
        width: 140,
        scopedSlots: { customRender: 'mac' }
    },
    {
        title: 'Model',
        dataIndex: 'platform',
        width: 140,
        scopedSlots: {
            filterDropdown: 'modelFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Nhà',
        dataIndex: 'home',
        width: 125,
        scopedSlots: { customRender: 'home' }
    },
    {
        title: 'Tên khách hàng',
        width: 150,
        scopedSlots: { customRender: 'name' }
    },
    {
        title: 'Email',
        width: 230,
        scopedSlots: { customRender: 'email' }
    },
    {
        title: 'Phiên bản',
        width: 100,
        scopedSlots: { customRender: 'version' }
    },
    {
        title: 'IP nội mạng',
        width: 130,
        scopedSlots: { customRender: 'ip' }
    },
    {
        title: 'Phiên bản tunnel',
        width: 125,
        scopedSlots: {
            customRender: 'tunnel',
            filterDropdown: 'tunnelFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Trạng thái',
        width: 110,
        align: 'center',
        scopedSlots: {
            customRender: 'status',
            filterDropdown: 'statusFilterDropdown',
            filterIcon: 'filterIcon'
        }
    }
];

export const columns2 = [
    {
        title: 'STT',
        width: 30,
        align: 'center',
        scopedSlots: { customRender: 'stt' }
    },
    {
        title: 'Địa chỉ MAC',
        width: 50,
        scopedSlots: { customRender: 'mac' }
    },
    {
        title: 'Model',
        dataIndex: 'platform',
        width: 60,
        scopedSlots: {
            filterDropdown: 'modelFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Nhà',
        dataIndex: 'home',
        width: 60,
        scopedSlots: { customRender: 'home' }
    },
    {
        title: 'Tên khách hàng',
        width: 75,
        scopedSlots: { customRender: 'name' }
    },
    {
        title: 'Email',
        width: 90,
        scopedSlots: { customRender: 'email' }
    },
    {
        title: 'Phiên bản',
        width: 40,
        scopedSlots: { customRender: 'version' }
    },
    {
        title: 'IP nội mạng',
        width: 50,
        scopedSlots: { customRender: 'ip' }
    },
    {
        title: 'Phiên bản tunnel',
        width: 75,
        scopedSlots: {
            customRender: 'tunnel',
            filterDropdown: 'tunnelFilterDropdown',
            filterIcon: 'filterIcon'
        }
    },
    {
        title: 'Trạng thái',
        width: 60,
        align: 'center',
        scopedSlots: {
            customRender: 'status',
            filterDropdown: 'statusFilterDropdown',
            filterIcon: 'filterIcon'
        }
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

export const models = ['Home Assistant', 'Generic Wi-Fi Device', 'Broadlink'];
