import PageView from '@/layouts/PageView';
import TabsView from '@/layouts/tabs/TabsView';

const options = {
    routes: [
        {
            path: '/dang-nhap',
            name: 'Đăng nhập',
            component: () => import('@/pages/tai-khoan/DangNhap')
        },
        {
            path: '/bao-gia/:id',
            name: 'Báo giá public',
            component: () => import('@/pages/quan-ly-bao-gia/BaoGiaPublic')
        },
        {
            path: '*',
            name: '404',
            component: () => import('@/pages/exception/404')
        },
        {
            path: '/403',
            name: '403',
            component: () => import('@/pages/exception/403')
        },
        {
            path: '/',
            name: 'Front page',
            component: TabsView,
            children: [
                {
                    path: 'quan-ly-san-pham',
                    name: 'Quản lý sản phẩm',
                    meta: {
                        icon: 'appstore',
                        authority: {
                            permission: 'san-pham'
                        }
                    },
                    component: () => import('@/pages/quan-ly-san-pham/SanPham')
                },
                {
                    path: 'quan-ly-bao-gia',
                    name: 'Quản lý báo giá',
                    meta: {
                        icon: 'pay-circle',
                        authority: {
                            permission: 'bao-gia'
                        }
                    },
                    component: () => import('@/pages/quan-ly-bao-gia/BaoGia')
                },
                {
                    path: 'quan-ly-don-hang',
                    name: 'Quản lý đơn hàng',
                    meta: {
                        icon: 'shopping-cart',
                        authority: {
                            permission: 'bao-gia'
                        }
                    },
                    component: () => import('@/pages/quan-ly-don-hang/DonHang')
                },
                {
                    path: 'quan-ly-thiet-bi',
                    name: 'Quản lý thiết bị',
                    component: PageView,
                    meta: { icon: 'bulb' },
                    children: [
                        {
                            path: 'danh-sach-phan-cung',
                            name: 'Danh sách phần cứng',
                            meta: {
                                icon: 'appstore',
                                authority: {
                                    permission: 'phan-cung'
                                }
                            },
                            component: () => import('@/pages/quan-ly-thiet-bi/PhanCung')
                        },
                        {
                            path: 'danh-sach-firmware',
                            name: 'Danh sách firmware',
                            meta: {
                                icon: 'file-zip',
                                authority: {
                                    permission: 'firmware'
                                }
                            },
                            component: () => import('@/pages/quan-ly-thiet-bi/FirmWare')
                        },
                        {
                            path: 'danh-sach-ung-dung',
                            name: 'Danh sách ứng dụng',
                            meta: {
                                icon: 'android',
                                authority: {
                                    permission: 'ung-dung'
                                }
                            },
                            component: () => import('@/pages/quan-ly-thiet-bi/UngDung')
                        },
                        {
                            path: 'danh-sach-thiet-bi',
                            name: 'Danh sách thiết bị',
                            meta: {
                                icon: 'database',
                                authority: {
                                    permission: 'thiet-bi'
                                }
                            },
                            component: () => import('@/pages/quan-ly-thiet-bi/ThietBi')
                        }
                    ]
                },
                {
                    path: 'quan-ly-he-thong',
                    name: 'Quản lý hệ thống',
                    component: PageView,
                    meta: { icon: 'solution' },
                    children: [
                        {
                            path: 'nhom-nguoi-dung',
                            name: 'Nhóm người dùng',
                            meta: {
                                icon: 'team',
                                authority: {
                                    permission: 'nhom-nguoi-dung'
                                }
                            },
                            component: () => import('@/pages/quan-ly-nguoi-dung/NhomNguoiDung')
                        },
                        {
                            path: 'danh-sach-nguoi-dung',
                            name: 'Danh sách người dùng',
                            meta: {
                                icon: 'user',
                                authority: {
                                    permission: 'nguoi-dung'
                                }
                            },
                            component: () => import('@/pages/quan-ly-nguoi-dung/NguoiDung')
                        }
                    ]
                },
                {
                    path: 'quan-ly-dai-ly',
                    name: 'Quản lý đại lý',
                    component: PageView,
                    meta: {
                        icon: 'fork'
                    },
                    children: [
                        {
                            path: 'danh-sach-dai-ly',
                            name: 'Danh sách đại lý',
                            meta: {
                                icon: 'profile',
                                authority: {
                                    permission: 'dai-ly'
                                }
                            },
                            component: () => import('@/pages/quan-ly-dai-ly/DaiLy')
                        },
                        {
                            path: 'thiet-bi-dai-ly',
                            name: 'Thiết bị đại lý',
                            meta: {
                                icon: 'database',
                                authority: {
                                    permission: 'thiet-bi-dai-ly'
                                }
                            },
                            component: () => import('@/pages/quan-ly-dai-ly/ThietBiDaiLy')
                        }
                    ]
                },
                {
                    path: 'quan-ly-khach-hang',
                    name: 'Quản lý khách hàng',
                    component: PageView,
                    meta: { icon: 'global' },
                    children: [
                        {
                            path: 'nhom-khach-hang',
                            name: 'Nhóm khách hàng',
                            meta: {
                                icon: 'team',
                                authority: {
                                    permission: 'nhom-khach-hang'
                                }
                            },
                            component: () => import('@/pages/quan-ly-khach-hang/NhomKhachHang')
                        },
                        {
                            path: 'danh-sach-khach-hang',
                            name: 'Danh sách khách hàng',
                            meta: {
                                icon: 'user',
                                authority: {
                                    permission: 'khach-hang'
                                }
                            },
                            component: () => import('@/pages/quan-ly-khach-hang/KhachHang')
                        }
                    ]
                },
                {
                    path: 'quan-ly-thong-bao',
                    name: 'Quản lý thông báo',
                    meta: {
                        icon: 'bell',
                        authority: {
                            permission: 'thong-bao'
                        }
                    },
                    component: () => import('@/pages/quan-ly-thong-bao/ThongBao')
                },
                {
                    path: 'ho-tro-ky-thuat',
                    name: 'Hỗ trợ kỹ thuật',
                    meta: {
                        icon: 'bug',
                        authority: {
                            permission: 'ho-tro'
                        }
                    },
                    component: () => import('@/pages/ho-tro-ky-thuat/HoTroKyThuat')
                },
                {
                    path: 'bao-cao-thong-ke',
                    name: 'Báo cáo thống kê',
                    meta: {
                        icon: 'line-chart',
                        authority: {
                            permission: 'thong-ke'
                        }
                    },
                    component: () => import('@/pages/bao-cao-thong-ke/ThongKe')
                }
            ]
        }
    ],
    mode: 'history'
};

export default options;
