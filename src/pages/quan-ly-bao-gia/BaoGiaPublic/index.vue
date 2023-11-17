<template>
    <div v-if="baoGia.id">
        <vue-html2pdf
            ref="html2Pdf"
            :paginate-elements-by-height="10000"
            :html-to-pdf-options="htmlToPdfOptions"
            pdf-content-width="100%"
        >
            <Content
                :exported="true"
                :baoGia="baoGiaPublic"
                :lspct="listSanPhamChiTiet"
                :lsp="listSanPham"
                :lspth="listSanPhamTongHop"
                :lqt="listQuaTang"
                :tgtb="tongGiaThietBi"
                :tgkm="tongGiaKhuyenMai"
                :tsck="tongSauChietKhau"
                :tcp="tongChiPhi"
                :tsh="totalSumHeight"
                slot="pdf-content"
            />
        </vue-html2pdf>
        <BaoGiaSheet
            ref="baoGiaSheet"
            :baoGia="baoGiaPublic"
            :khbg="khachHangBaoGia"
            :lp="listPhong"
            :lsp="listSanPham"
            :lspth="listSanPhamTongHop"
            :lqt="listQuaTang"
        />
        <a-card
            class="shadow"
            :style="{
                position: 'fixed',
                zIndex: position > 300 ? 2 : -1,
                width: '100%',
                height: position > 300 ? '110px' : '0'
            }"
        />
        <div class="card-cover-button">
            <Transition>
                <div :style="{ width: '83%', margin: 'auto' }" v-show="position > 300">
                    <a-row>
                        <a-col>
                            <h1 class="title mb-md-2 mb-0" :style="{ marginTop: '-8px' }">
                                {{ `Bảng dự toán chi phí` }}
                            </h1>
                        </a-col>
                    </a-row>
                    <Buttons
                        @exportPdf="exportPdf"
                        @exportExcel="exportExcel"
                        @accept="modalVisible = 1"
                        @reject="modalVisible = 2"
                        :status="status"
                    />
                </div>
            </Transition>
        </div>
        <Content
            :baoGia="baoGiaPublic"
            :lspct="listSanPhamChiTiet"
            :lsp="listSanPham"
            :lspth="listSanPhamTongHop"
            :lqt="listQuaTang"
            :tgtb="tongGiaThietBi"
            :tgkm="tongGiaKhuyenMai"
            :tsck="tongSauChietKhau"
            :tcp="tongChiPhi"
            :tsh="totalSumHeight"
        >
            <Buttons
                @exportPdf="exportPdf"
                @exportExcel="exportExcel"
                @accept="modalVisible = 1"
                @reject="modalVisible = 2"
                :status="status"
            />
        </Content>
        <a-modal
            :visible="modalVisible === 1"
            title=""
            :closable="false"
            :footer="null"
            :width="310"
            wrapClassName="custom-modal"
        >
            <a-space direction="vertical" align="center" size="middle" style="width: 100%">
                <a-space>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="24px"
                        height="24px"
                        style="margin-top: -2px"
                    >
                        <linearGradient
                            id="HoiJCu43QtshzIrYCxOfCa"
                            x1="21.241"
                            x2="3.541"
                            y1="39.241"
                            y2="21.541"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset=".108" stop-color="#0d7044" />
                            <stop offset=".433" stop-color="#11945a" />
                        </linearGradient>
                        <path
                            fill="url(#HoiJCu43QtshzIrYCxOfCa)"
                            d="M16.599,41.42L1.58,26.401c-0.774-0.774-0.774-2.028,0-2.802l4.019-4.019	c0.774-0.774,2.028-0.774,2.802,0L23.42,34.599c0.774,0.774,0.774,2.028,0,2.802l-4.019,4.019	C18.627,42.193,17.373,42.193,16.599,41.42z"
                        />
                        <linearGradient
                            id="HoiJCu43QtshzIrYCxOfCb"
                            x1="-15.77"
                            x2="26.403"
                            y1="43.228"
                            y2="43.228"
                            gradientTransform="rotate(134.999 21.287 38.873)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#2ac782" />
                            <stop offset="1" stop-color="#21b876" />
                        </linearGradient>
                        <path
                            fill="url(#HoiJCu43QtshzIrYCxOfCb)"
                            d="M12.58,34.599L39.599,7.58c0.774-0.774,2.028-0.774,2.802,0l4.019,4.019	c0.774,0.774,0.774,2.028,0,2.802L19.401,41.42c-0.774,0.774-2.028,0.774-2.802,0l-4.019-4.019	C11.807,36.627,11.807,35.373,12.58,34.599z"
                        />
                    </svg>
                    <h3>Xác nhận đồng ý với báo giá?</h3>
                </a-space>
                <a-space style="margin-top: -6px">
                    <a-button class="btn-cancel btn-rounded px-3" @click="modalVisible = null">
                        Hủy
                    </a-button>
                    <a-button class="btn bg-green btn-rounded px-3" type="link" @click="onAccept">
                        Đồng ý
                    </a-button>
                </a-space>
            </a-space>
        </a-modal>
        <a-modal
            :visible="modalVisible === 2"
            title=""
            :closable="false"
            :footer="null"
            :width="290"
            wrapClassName="custom-modal"
        >
            <a-space direction="vertical" align="center" size="middle" style="width: 100%">
                <a-space>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="24px"
                        height="24px"
                        style="margin-top: -2px"
                    >
                        <linearGradient
                            id="hbE9Evnj3wAjjA2RX0We2a"
                            x1="7.534"
                            x2="27.557"
                            y1="7.534"
                            y2="27.557"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#f44f5a" />
                            <stop offset=".443" stop-color="#ee3d4a" />
                            <stop offset="1" stop-color="#e52030" />
                        </linearGradient>
                        <path
                            fill="url(#hbE9Evnj3wAjjA2RX0We2a)"
                            d="M42.42,12.401c0.774-0.774,0.774-2.028,0-2.802L38.401,5.58c-0.774-0.774-2.028-0.774-2.802,0	L24,17.179L12.401,5.58c-0.774-0.774-2.028-0.774-2.802,0L5.58,9.599c-0.774,0.774-0.774,2.028,0,2.802L17.179,24L5.58,35.599	c-0.774,0.774-0.774,2.028,0,2.802l4.019,4.019c0.774,0.774,2.028,0.774,2.802,0L42.42,12.401z"
                        />
                        <linearGradient
                            id="hbE9Evnj3wAjjA2RX0We2b"
                            x1="27.373"
                            x2="40.507"
                            y1="27.373"
                            y2="40.507"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#a8142e" />
                            <stop offset=".179" stop-color="#ba1632" />
                            <stop offset=".243" stop-color="#c21734" />
                        </linearGradient>
                        <path
                            fill="url(#hbE9Evnj3wAjjA2RX0We2b)"
                            d="M24,30.821L35.599,42.42c0.774,0.774,2.028,0.774,2.802,0l4.019-4.019	c0.774-0.774,0.774-2.028,0-2.802L30.821,24L24,30.821z"
                        />
                    </svg>
                    <h3>Xác nhận từ chối báo giá?</h3>
                </a-space>
                <a-space style="margin-top: -6px">
                    <a-button class="btn-cancel btn-rounded px-3" @click="modalVisible = null">
                        Hủy
                    </a-button>
                    <a-button class="btn bg-red btn-rounded px-3" type="link" @click="onReject">
                        Từ chối
                    </a-button>
                </a-space>
            </a-space>
        </a-modal>
    </div>
</template>

<script>
import moment from 'moment';
import VueHtml2pdf from 'vue-html2pdf';
import { mapActions, mapState } from 'vuex';
import BaoGiaSheet from '../BaoGia/ChiTietBaoGia/BaoGiaSheet';
import Buttons from './Buttons';
import Content from './Content';

export default {
    name: 'BaoGiaPublic',
    components: { Buttons, Content, VueHtml2pdf, BaoGiaSheet },
    data() {
        return {
            modalVisible: null,
            position: 0,
            baoGiaPublic: {},
            khachHangBaoGia: {},
            listPhong: [],
            listSanPhamChiTiet: [],
            listSanPham: [],
            listSanPhamTongHop: [],
            listQuaTang: [],
            htmlToPdfOptions: {
                filename: 'Bảng dự toán JAVIS_khách hàng',
                paginateElementsByHeight: true,
                image: {
                    type: 'jpeg',
                    quality: 1
                },
                html2canvas: {
                    dpi: 192,
                    scale: 4,
                    letterRendering: true,
                    useCORS: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a2',
                    orientation: 'portrait',
                    width: '100%',
                    quality: 2
                }
            }
        };
    },
    computed: {
        ...mapState('window', ['width']),
        ...mapState('baoGia', ['baoGia']),
        status() {
            if (
                moment().isSameOrBefore(moment(this.baoGia.expiredTime)) ||
                (this.baoGia.status !== 'DRAFT' && this.baoGia.status !== 'SENT_CUSTOMER')
            ) {
                switch (this.baoGia.status) {
                    case 'DRAFT':
                    case 'SENT_CUSTOMER':
                        return undefined;
                    case 'CUSTOMER_ACCEPTED':
                    case 'ORDERED':
                    case 'COMPLETED':
                        return true;
                    case 'CUSTOMER_REJECTED':
                        return false;
                }
            }
            return null;
        },
        tongGiaThietBi() {
            return this.listSanPham.reduce(
                (prev, cur) =>
                    prev +
                    cur.giaBanLe * cur.soLuong -
                    (cur.chietKhau.unit === 'VND'
                        ? cur.chietKhau.value
                        : cur.giaBanLe * cur.soLuong * (cur.chietKhau.value / 100)),
                0
            );
        },
        tongGiaKhuyenMai() {
            return this.listQuaTang.reduce((prev, cur) => prev + cur.giaBanLe * cur.soLuong, 0);
        },
        tongSauChietKhau() {
            const tongGiaThietBi = this.tongGiaThietBi;
            const chietKhau = this.baoGia.chietKhau;
            return (
                tongGiaThietBi -
                (chietKhau.unit === 'VND'
                    ? chietKhau.value
                        ? chietKhau.value
                        : 0
                    : tongGiaThietBi * (chietKhau.value / 100))
            );
        },
        tongChiPhi() {
            const tongGiaThietBi = this.tongGiaThietBi;
            const tongSauChietKhau = this.tongSauChietKhau;
            const phiLapDat = this.baoGia.phiLapDat;
            return (
                tongSauChietKhau +
                (phiLapDat.unit === 'VND'
                    ? phiLapDat.value
                        ? phiLapDat.value
                        : 0
                    : tongGiaThietBi * (phiLapDat.value / 100))
            );
        },
        totalSumHeight() {
            if (this.baoGia.chietKhau.value !== 0 && this.baoGia.phiLapDat.value !== 0)
                return '220px';
            else if (this.baoGia.chietKhau.value === 0 && this.baoGia.phiLapDat.value === 0)
                return '80px';
            else return '150px';
        }
    },
    methods: {
        moment,
        ...mapActions('baoGia', ['getBaoGiaPublic', 'updateTrangThaiBaoGia']),
        getData(baoGia) {
            this.baoGiaPublic = baoGia;
            this.khachHangBaoGia = baoGia.khachHang;
            this.listPhong = baoGia.items.map((phong) => {
                return {
                    ...phong,
                    listSanPham: phong.listSanPham
                        .slice()
                        .reverse()
                        .filter(
                            (item) =>
                                !(
                                    (item.chietKhau.unit === '%' && item.chietKhau.value === 100) ||
                                    (item.chietKhau.unit === 'VND' &&
                                        item.chietKhau.value === item.giaBanLe * item.soLuong) ||
                                    item.giaBanLe === 0
                                )
                        )
                };
            });
            let listSanPhamChiTiet = [];
            let listSanPham = [];
            let listSanPhamTongHop = [];
            let listQuaTang = [];
            baoGia.items.forEach((phong) => {
                phong.listSanPham
                    .slice()
                    .reverse()
                    .forEach((item) => {
                        if (
                            (item.chietKhau.unit === '%' && item.chietKhau.value === 100) ||
                            (item.chietKhau.unit === 'VND' &&
                                item.chietKhau.value === item.giaBanLe * item.soLuong) ||
                            item.giaBanLe === 0
                        ) {
                            if (
                                listQuaTang.find(
                                    (itm) =>
                                        itm.sanPhamId === item.sanPhamId &&
                                        itm.createdAt === item.createdAt &&
                                        itm.updatedAt === item.updatedAt &&
                                        itm.giaBanLe === item.giaBanLe &&
                                        itm.chietKhau.unit === item.chietKhau.unit
                                )
                            )
                                listQuaTang = listQuaTang.map((itm) =>
                                    itm.sanPhamId === item.sanPhamId &&
                                    itm.createdAt === item.createdAt &&
                                    itm.updatedAt === item.updatedAt &&
                                    itm.giaBanLe === item.giaBanLe &&
                                    itm.chietKhau.unit === item.chietKhau.unit
                                        ? {
                                              ...itm,
                                              soLuong: itm.soLuong + item.soLuong,
                                              chietKhau: {
                                                  ...itm.chietKhau,
                                                  value:
                                                      itm.chietKhau.unit === 'VND'
                                                          ? itm.chietKhau.value +
                                                            item.chietKhau.value
                                                          : 100
                                              }
                                          }
                                        : itm
                                );
                            else listQuaTang.push(item);
                        } else {
                            if (
                                listSanPham.find(
                                    (itm) =>
                                        itm.sku === item.sku &&
                                        itm.giaBanLe === item.giaBanLe &&
                                        itm.baoHanh === item.baoHanh &&
                                        itm.chietKhau.unit === item.chietKhau.unit &&
                                        (itm.chietKhau.unit === 'VND' ||
                                            (itm.chietKhau.unit === '%' &&
                                                itm.chietKhau.value === item.chietKhau.value))
                                )
                            )
                                listSanPham = listSanPham.map((itm) =>
                                    itm.sku === item.sku &&
                                    itm.giaBanLe === item.giaBanLe &&
                                    itm.baoHanh === item.baoHanh &&
                                    itm.chietKhau.unit === item.chietKhau.unit &&
                                    (itm.chietKhau.unit === 'VND' ||
                                        (itm.chietKhau.unit === '%' &&
                                            itm.chietKhau.value === item.chietKhau.value))
                                        ? {
                                              ...itm,
                                              soLuong: itm.soLuong + item.soLuong,
                                              chietKhau: {
                                                  ...itm.chietKhau,
                                                  value:
                                                      itm.chietKhau.unit === 'VND'
                                                          ? itm.chietKhau.value +
                                                            item.chietKhau.value
                                                          : itm.chietKhau.value
                                              }
                                          }
                                        : itm
                                );
                            else listSanPham.push(item);

                            if (
                                listSanPhamTongHop.find(
                                    (itm) =>
                                        itm.sku === item.sku &&
                                        itm.giaBanLe === item.giaBanLe &&
                                        itm.chietKhau.unit === item.chietKhau.unit &&
                                        (itm.chietKhau.unit === 'VND' ||
                                            (itm.chietKhau.unit === '%' &&
                                                itm.chietKhau.value === item.chietKhau.value))
                                )
                            )
                                listSanPhamTongHop = listSanPhamTongHop.map((itm) =>
                                    itm.sku === item.sku &&
                                    itm.giaBanLe === item.giaBanLe &&
                                    itm.chietKhau.unit === item.chietKhau.unit &&
                                    (itm.chietKhau.unit === 'VND' ||
                                        (itm.chietKhau.unit === '%' &&
                                            itm.chietKhau.value === item.chietKhau.value))
                                        ? {
                                              ...itm,
                                              soLuong: itm.soLuong + item.soLuong
                                          }
                                        : itm
                                );
                            else listSanPhamTongHop.push(item);
                        }
                    });
            });
            this.listPhong.forEach((phong) => {
                if (phong.listSanPham.length > 0)
                    listSanPhamChiTiet.push({ sku: phong.name }, ...phong.listSanPham);
            });
            this.listQuaTang = listQuaTang;
            this.listSanPhamChiTiet = listSanPhamChiTiet;
            this.listSanPham = listSanPham;
            this.listSanPhamTongHop = listSanPhamTongHop;
        },
        async onAccept() {
            await this.updateTrangThaiBaoGia({
                publicId: this.$route.params.id,
                status: 'CUSTOMER_ACCEPTED'
            });
            await this.getBaoGiaPublic(this.$route.params.id);
            this.modalVisible = null;
            this.$notification.open({
                message: function (h) {
                    return h('div', [
                        h('img', {
                            attrs: {
                                src: 'done.png',
                                class: 'custom-notification-accept-icon'
                            }
                        }),
                        h(
                            'span',
                            {
                                attrs: {
                                    class: 'custom-notification-message'
                                }
                            },
                            'Đã xác nhận đồng ý với báo giá'
                        )
                    ]);
                },
                duration: 2,
                top: '26px',
                btn: function (h) {
                    return h('span', ' ');
                },
                closeIcon: function (h) {
                    return h('span', ' ');
                },
                class: 'custom-notification-accept-modal'
            });
        },
        async onReject() {
            await this.updateTrangThaiBaoGia({
                publicId: this.$route.params.id,
                status: 'CUSTOMER_REJECTED'
            });
            await this.getBaoGiaPublic(this.$route.params.id);
            this.modalVisible = null;
            this.$notification.open({
                message: function (h) {
                    return h('div', [
                        h('img', {
                            attrs: {
                                src: 'close.png',
                                class: 'custom-notification-reject-icon'
                            }
                        }),
                        h(
                            'span',
                            {
                                attrs: {
                                    class: 'custom-notification-message'
                                }
                            },
                            'Đã xác nhận từ chối báo giá'
                        )
                    ]);
                },
                duration: 2,
                top: '26px',
                btn: function (h) {
                    return h('span', ' ');
                },
                closeIcon: function (h) {
                    return h('span', ' ');
                },
                class: 'custom-notification-reject-modal'
            });
        },
        exportPdf() {
            this.setScaleCanvas();
            this.$refs.html2Pdf.generatePdf();
        },
        exportExcel() {
            this.$refs.baoGiaSheet.exportSheet();
        },
        handleScroll() {
            this.position = document.getElementById('popContainer').scrollTop;
        },
        setScaleCanvas() {
            let height = this.$el.clientHeight;
            if (height > 8200 && height < 14000) {
                this.htmlToPdfOptions.html2canvas.scale = 3;
            } else if (height > 14000) {
                this.htmlToPdfOptions.html2canvas.scale = 2;
            }
        }
    },
    async mounted() {
        document.getElementById('popContainer').classList = ['beauty-scroll-public'];

        await this.getBaoGiaPublic(this.$route.params.id);
        if (!this.baoGia.id) return this.$router.push('/404');

        this.getData(this.baoGia);
        document.getElementById('popContainer').addEventListener('scroll', this.handleScroll);

        this.htmlToPdfOptions.filename =
            'Bảng dự toán JAVIS_khách hàng ' +
            (await this.khachHangBaoGia.name) +
            '_' +
            moment(await this.baoGia.updatedAt).format('DD/MM/YYYY');
    },
    beforeDestroy() {
        document.getElementById('popContainer').removeEventListener('scroll', this.handleScroll);
    }
};
</script>

<style lang="less" scoped>
.v-enter-active {
    transition: opacity 0.7s ease;
}
.v-enter,
.v-leave-to {
    opacity: 0;
}
.btn-cancel {
    &:hover {
        color: #ff545f;
        border-color: #ff545f;
    }
    &:focus {
        color: #ff545f;
        border-color: #ff545f;
    }
}
.btn-rounded {
    border-radius: 50px;
}
.shadow {
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
}
.bg-green {
    background-color: #2ac782 !important;
}
.bg-red {
    background-color: #ff545f !important;
}
.card-cover-button {
    position: fixed;
    z-index: 2;
    width: 100%;
    top: 24px;
}
@media screen and (max-width: 768px) {
    .card-cover-button {
        top: 10px;
    }
}
</style>
