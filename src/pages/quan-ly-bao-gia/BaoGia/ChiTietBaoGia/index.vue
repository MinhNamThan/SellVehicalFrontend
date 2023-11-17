<template>
    <a-form-model :model="baoGia" ref="form" style="margin-top: -4px">
        <vue-html2pdf
            ref="html2Pdf"
            :paginate-elements-by-height="10000"
            :html-to-pdf-options="htmlToPdfOptions"
            pdf-content-width="100%"
        >
            <Content :exported="true" :baoGia="savedBaoGia" v-if="baoGia.id" slot="pdf-content" />
        </vue-html2pdf>
        <BaoGiaSheet ref="baoGiaSheet" :baoGia="savedBaoGia" v-if="baoGia.id" />
        <div style="margin-bottom: -8px" v-if="width < 1800">
            <a-button
                icon="copy"
                type="primary"
                class="mb-2"
                style="font-size: 18px"
                :size="width < 768 ? 'default' : 'large'"
                v-if="baoGia.id"
                @click.stop="copyBaoGia"
                >Sao chép báo giá</a-button
            >
            <div style="margin-bottom: -6px">
                <h3>Trạng thái</h3>
                <a-form-model-item class="mb-4">
                    <a-steps
                        progress-dot
                        size="small"
                        :current="getCurrent()"
                        class="custom-ant-steps mt-2"
                        style="width: 735px"
                        :direction="width < 768 ? 'vertical' : 'horizontal'"
                    >
                        <a-step
                            v-for="(status, index) in statusList"
                            :key="index"
                            :title="status.name"
                        />
                    </a-steps>
                </a-form-model-item>
                <a-row>
                    <a-col :xs="24" :sm="24" :md="15">
                        <h3>Tên báo giá</h3>
                        <a-form-model-item prop="name">
                            <a-input v-model="baoGia.name" v-if="permission.modifiable" />
                            <p style="margin-bottom: -4px" v-else>{{ baoGia.name }}</p>
                        </a-form-model-item>
                    </a-col>
                </a-row>
            </div>
            <a-row>
                <a-col :xs="24" :sm="24" :md="15">
                    <KhachHang :responsive="true" />
                </a-col>
                <a-col :xs="24" :sm="24" :md="9">
                    <div class="ml-md-4">
                        <ThongTinBoSung />
                    </div>
                </a-col>
            </a-row>
        </div>

        <a-row v-else>
            <a-button
                icon="copy"
                type="primary"
                class="mb-2"
                style="font-size: 18px"
                size="large"
                v-if="baoGia.id"
                @click.stop="copyBaoGia"
                >Sao chép báo giá</a-button
            >
            <a-col :span="24">
                <a-row class="mt-1">
                    <a-col :span="12">
                        <h3>Tên báo giá</h3>
                        <a-form-model-item prop="name">
                            <a-input
                                :style="{ width: '694px' }"
                                v-model="baoGia.name"
                                v-if="permission.modifiable"
                            />
                            <p class="mb-0" v-else>{{ baoGia.name }}</p>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <div class="float-right">
                            <h3>Trạng thái</h3>
                            <a-form-model-item>
                                <a-steps
                                    progress-dot
                                    :current="getCurrent()"
                                    size="small"
                                    class="custom-ant-steps mt-2"
                                    style="width: 735px"
                                >
                                    <a-step
                                        v-for="(status, index) in statusList"
                                        :key="index"
                                        :title="status.name"
                                    />
                                </a-steps>
                            </a-form-model-item>
                        </div>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :span="24">
                <a-row>
                    <a-col :span="12">
                        <KhachHang />
                    </a-col>
                    <a-col :span="12">
                        <div class="float-right" style="width: 694px">
                            <ThongTinBoSung />
                        </div>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>

        <div class="mt-4 mb-3">
            <h2 :style="{ fontSize: '18px' }">Thông tin sản phẩm</h2>
            <SanPhamTabs v-slot="slotProps">
                <SanPham :phongId="slotProps.phongId" />
            </SanPhamTabs>
        </div>

        <a-row
            :gutter="[12, 4]"
            class="float-md-right mt-4"
            :style="
                width < 768
                    ? { width: '100%', fontSize: '15px' }
                    : { width: '400px', fontSize: '15px' }
            "
        >
            <a-col>
                <a-row>
                    <a-col :span="11">
                        <p>Tổng giá thiết bị:</p>
                    </a-col>
                    <a-col :span="permission.modifiable ? 13 : 11">
                        <span class="text-success float-right" style="margin-right: 6px">
                            {{ tongGiaThietBi.toLocaleString() }}
                        </span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span class="text-success"> VND </span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col
                v-if="
                    permission.modifiable ||
                    (!permission.modifiable && baoGia.chietKhau.value !== 0)
                "
            >
                <a-row>
                    <a-col :xs="8" :sm="9" :md="11">
                        <p>Chiết khấu:</p>
                    </a-col>
                    <a-col :xs="16" :sm="15" :md="13" v-if="permission.modifiable">
                        <a-space :style="{ marginTop: '-4px' }">
                            <a-radio-group
                                v-model="baoGia.chietKhau.unit"
                                @change="checkChietKhauValue(1)"
                                buttonStyle="solid"
                                :size="width < 768 ? 'small' : 'default'"
                            >
                                <a-radio-button value="%"> % </a-radio-button>
                                <a-radio-button value="VND"> VND </a-radio-button>
                            </a-radio-group>
                            <a-input-number
                                class="custom-input-number-right no-handler"
                                style="width: 95px; font-size: 15px"
                                :min="0"
                                :max="baoGia.chietKhau.unit === 'VND' ? tongGiaThietBi : 100"
                                :formatter="
                                    baoGia.chietKhau.unit === 'VND'
                                        ? formatNumber
                                        : formatPercentage
                                "
                                :parser="
                                    baoGia.chietKhau.unit === 'VND' ? parseNumber : parsePercentage
                                "
                                @blur="checkChietKhauValue(0)"
                                v-model="baoGia.chietKhau.value"
                            />
                        </a-space>
                    </a-col>
                    <a-col :xs="7" :sm="7" :md="9" v-if="!permission.modifiable">
                        <span class="float-right" style="margin-right: 6px">{{
                            baoGia.chietKhau.value.toLocaleString()
                        }}</span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span>{{ baoGia.chietKhau.unit }}</span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col
                v-if="
                    permission.modifiable ||
                    (!permission.modifiable &&
                        baoGia.chietKhau.value !== 0 &&
                        baoGia.phiLapDat.value !== 0)
                "
            >
                <a-row>
                    <a-col :xs="14" :sm="14" :md="14">
                        <p>Tổng sau chiết khấu:</p>
                    </a-col>
                    <a-col :span="permission.modifiable ? 10 : 10">
                        <span class="text-success float-right" style="margin-right: 6px">
                            {{ parseInt(tongSauChietKhau.toFixed()).toLocaleString() }}
                        </span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span class="text-success"> VND </span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col
                v-if="
                    permission.modifiable ||
                    (!permission.modifiable && baoGia.phiLapDat.value !== 0)
                "
            >
                <a-row>
                    <a-col :xs="8" :sm="9" :md="11">
                        <p>Phí lắp đặt:</p>
                    </a-col>
                    <a-col :xs="16" :sm="15" :md="13" v-if="permission.modifiable">
                        <a-space :style="{ marginTop: '-4px' }">
                            <a-radio-group
                                v-model="baoGia.phiLapDat.unit"
                                @change="checkPhiLapDatValue(1)"
                                buttonStyle="solid"
                                :size="width < 768 ? 'small' : 'default'"
                            >
                                <a-radio-button value="%"> % </a-radio-button>
                                <a-radio-button value="VND"> VND </a-radio-button>
                            </a-radio-group>
                            <a-input-number
                                class="custom-input-number-right no-handler"
                                style="width: 95px; font-size: 15px"
                                :min="0"
                                :formatter="
                                    baoGia.phiLapDat.unit === 'VND'
                                        ? formatNumber
                                        : formatPercentage
                                "
                                :parser="
                                    baoGia.phiLapDat.unit === 'VND' ? parseNumber : parsePercentage
                                "
                                @blur="checkPhiLapDatValue(0)"
                                v-model="baoGia.phiLapDat.value"
                            />
                        </a-space>
                    </a-col>
                    <a-col :span="11" v-if="!permission.modifiable">
                        <span class="float-right" style="margin-right: 6px">{{
                            baoGia.phiLapDat.value.toLocaleString()
                        }}</span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span>{{ baoGia.phiLapDat.unit }}</span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col
                v-if="
                    permission.modifiable ||
                    (!permission.modifiable &&
                        (baoGia.chietKhau.value !== 0 || baoGia.phiLapDat.value !== 0))
                "
            >
                <a-row>
                    <a-col :span="11">
                        <p>Tổng chi phí:</p>
                    </a-col>
                    <a-col :span="permission.modifiable ? 13 : 11">
                        <span class="text-success float-right" style="margin-right: 6px">
                            {{ parseInt(tongChiPhi.toFixed()).toLocaleString() }}
                        </span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span class="text-success"> VND </span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col>
                <a-space
                    class="float-right my-2"
                    :direction="width < 768 ? 'vertical' : 'horizontal'"
                    align="end"
                >
                    <a-button
                        icon="safety-certificate"
                        type="link"
                        class="btn bg-goldenrod px-2"
                        @click="NoteModalVisible = true"
                        v-if="permission.modifiable"
                    >
                        Chỉnh sửa lưu ý báo giá
                    </a-button>
                    <a-button
                        icon="link"
                        type="link"
                        class="btn bg-purple px-2"
                        @click="openLink()"
                        v-if="permission.modifiable && baoGia.id"
                    >
                        {{ `${baoGia.publicId ? 'Chỉnh sửa' : 'Tạo'} link public` }}
                    </a-button>
                    <a-button
                        icon="link"
                        type="link"
                        class="btn bg-purple px-2"
                        @click="linkModalVisible = true"
                        v-if="!permission.modifiable && baoGia.publicId"
                    >
                        Link public báo giá
                    </a-button>
                    <a-button
                        icon="file-pdf"
                        class="btn bg-red px-2"
                        type="link"
                        @click="$refs.html2Pdf.generatePdf()"
                        v-if="savedBaoGia.id"
                    >
                        Export file pdf
                    </a-button>
                    <a-button
                        icon="file-excel"
                        class="btn bg-green px-2"
                        type="link"
                        @click="$refs.baoGiaSheet.exportSheet()"
                        v-if="savedBaoGia.id"
                    >
                        Export file excel
                    </a-button>
                    <a-button
                        icon="save"
                        type="primary"
                        class="px-2"
                        :style="{ width: '120px' }"
                        @click="onSave(0)"
                        v-if="permission.modifiable"
                    >
                        Lưu báo giá
                    </a-button>
                    <a-button
                        icon="save"
                        class="px-2"
                        :style="{ width: '120px' }"
                        @click="onSave(1)"
                        v-if="permission.modifiable"
                    >
                        Lưu và đóng
                    </a-button>
                </a-space>
            </a-col>
        </a-row>

        <a-modal v-model="linkModalVisible" destroyOnClose :width="625">
            <template slot="title">
                <h1 class="title m-0">Link public báo giá</h1>
            </template>

            <a-form-model-item>
                <a-input
                    ref="input"
                    @click="$event.target.select()"
                    @change="$event.target.value = link"
                    :value="link"
                >
                    <a-tooltip slot="addonAfter" title="Copy">
                        <a-icon type="copy" :style="{ color: '#aaa' }" @click="copyLink" />
                    </a-tooltip>
                </a-input>
            </a-form-model-item>

            <a-form-model-item label="Ngày hết hạn">
                <a-date-picker
                    v-model="baoGia.expiredTime"
                    :disabledDate="disabledDate"
                    showTime
                    :showToday="false"
                    :allowClear="false"
                    format="DD/MM/YYYY HH:mm:ss"
                    :style="{ width: '100%' }"
                    @ok="editLink"
                    @openChange="openChange"
                    v-if="permission.modifiable"
                />
                <span v-else>{{ moment(baoGia.expiredTime).format('DD/MM/YYYY HH:mm:ss') }}</span>
            </a-form-model-item>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <div class="float-left" v-if="permission.modifiable">
                        <a-popconfirm
                            title="Bạn có chắc chắn muốn xóa link public này không?"
                            @confirm="deleteLink"
                        >
                            <a-button icon="delete" type="danger" class="px-2"
                                >Xóa link public</a-button
                            >
                        </a-popconfirm>
                    </div>
                    <a-button @click="linkModalVisible = false">Đóng</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="NoteModalVisible" destroyOnClose :width="825">
            <template slot="title">
                <h1 class="title m-0">Lưu ý</h1>
            </template>
            <quill-editor
                v-model="baoGia.privacy"
                :options="editorOption"
                class="pb-5 mx-2"
                style="height: 500px; min-width: 200px; margin-top: 1px"
            />
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button
                        class="bg bg-blue btnPrivacy"
                        @click="showTemplate"
                        v-if="!baoGia.privacy"
                        >Bản mẫu</a-button
                    >
                    <a-button class="bg bg-green btnPrivacy" @click="baoGia.privacy = ''"
                        >Clear</a-button
                    >
                    <a-button class="bg bg-red btnPrivacy" @click="NoteModalVisible = false"
                        >Lưu</a-button
                    >
                </div>
            </template>
        </a-modal>
    </a-form-model>
</template>

<script>
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import VueHtml2pdf from 'vue-html2pdf';
import { mapActions, mapState } from 'vuex';
import { trimObject } from '../../../../utils/formUtil';
import Content from '../../BaoGiaPublic/Content';
import BaoGiaSheet from './BaoGiaSheet';
import KhachHang from './KhachHang';
import SanPham from './SanPham';
import SanPhamTabs from './SanPhamTabs';
import ThongTinBoSung from './ThongTinBoSung';
import { statusList1, statusList2, editorOption, samplePrivacy } from './const';
import _ from 'lodash';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { quillEditor } from 'vue-quill-editor';

export default {
    name: 'BaoGia',
    components: {
        KhachHang,
        ThongTinBoSung,
        SanPhamTabs,
        SanPham,
        Content,
        VueHtml2pdf,
        BaoGiaSheet,
        quillEditor
    },
    inject: ['permission'],
    data() {
        return {
            statusList: [],
            savedBaoGia: {},
            linkModalVisible: false,
            link: null,
            currentExpiredTime: null,
            editConfirmed: false,
            NoteModalVisible: false,
            editorOption,
            samplePrivacy,
            htmlToPdfOptions: {
                filename: 'Bảng dự toán JAVIS_khách hàng',
                paginateElementsByHeight: true,
                image: {
                    type: 'jpeg',
                    quality: 1
                },
                html2canvas: {
                    dpi: 192,
                    scale: 2,
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
        ...mapState('baoGia', ['baoGia', 'baoGiaSaved']),
        tongGiaThietBi() {
            let tongGiaThietBi = 0;
            this.baoGia.items.forEach((i) => {
                i.listSanPham.forEach((item) => {
                    tongGiaThietBi +=
                        item.giaBanLe * item.soLuong -
                        (item.chietKhau.unit === 'VND'
                            ? item.chietKhau.value
                            : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
                });
            });
            return tongGiaThietBi;
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
        }
    },
    methods: {
        moment,
        ...mapActions('sanPham', ['getListSanPham']),
        ...mapActions('baoGia', [
            'saveBaoGia',
            'updateBaoGia',
            'resetBaoGia',
            'setChietKhauValue',
            'setPhiLapDatValue',
            'resetBaoGiaSaved',
            'selectBaoGiaSaved'
        ]),
        getCurrent() {
            return this.statusList.findIndex((item) => item.value === this.baoGia.status);
        },
        formatNumber(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        parseNumber(str) {
            const number = parseInt(str.replace(/(,*)/g, ''));
            return isNaN(number) ? '' : number;
        },
        formatPercentage(value) {
            return value.indexOf('.') !== -1 && value[value.length - 1] !== '.'
                ? parseFloat(value).toFixed(1)
                : value;
        },
        parsePercentage(str) {
            return str[str.length - 1] === '.'
                ? str.indexOf('.') !== str.length - 1
                    ? str.slice(0, -1)
                    : str
                : isNaN(parseInt(str[str.length - 1]))
                ? str.slice(0, -1)
                : str;
        },
        async onSave(close) {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                if (!this.baoGia.name || !this.baoGia.name.trim()) {
                    this.$notification['warning']({
                        message: 'Vui lòng nhập tên báo giá'
                    });
                    return;
                }
                if (!this.baoGia.khachHangId) {
                    this.$notification['warning']({
                        message: 'Vui lòng chọn khách hàng'
                    });
                    return;
                }

                const id = this.baoGia.id;
                try {
                    trimObject(this.baoGia);
                    if (id) {
                        await this.updateBaoGia(this.baoGia);
                        this.baoGia.updatedAt = moment();
                    } else await this.saveBaoGia(this.baoGia);
                    if (close) {
                        this.resetBaoGia();
                        this.resetBaoGiaSaved();
                    } else {
                        this.savedBaoGia = JSON.parse(JSON.stringify(this.baoGia));
                    }
                    if (id)
                        this.$notification['success']({
                            message: 'Cập nhật báo giá thành công'
                        });
                    else
                        this.$notification['success']({
                            message: 'Thêm báo giá thành công'
                        });
                } catch (error) {
                    if (id)
                        this.$notification['error']({
                            message: 'Cập nhật báo giá không thành công'
                        });
                    else
                        this.$notification['success']({
                            message: 'Thêm báo giá không thành công'
                        });
                }
            });
        },
        checkChietKhauValue(reset) {
            if (reset || this.baoGia.chietKhau.value === null) this.baoGia.chietKhau.value = 0;
        },
        checkPhiLapDatValue(reset) {
            if (reset || this.baoGia.phiLapDat.value === null) this.baoGia.phiLapDat.value = 0;
        },
        disabledDate(value) {
            return value.valueOf() < moment().startOf('days');
        },
        openChange(status) {
            if (!status)
                if (this.editConfirmed) this.editConfirmed = false;
                else this.baoGia.expiredTime = this.currentExpiredTime;
        },
        async openLink() {
            if (!this.baoGia.publicId) {
                this.baoGia.publicId = uuidv4().replaceAll('-', '');
                this.baoGia.expiredTime = moment().add(2, 'weeks').endOf('day');
                await this.updateBaoGia(this.baoGia);
                this.link = `${process.env.VUE_APP_PUBLIC_PRICE_QUOTE_URL}/bao-gia/${this.baoGia.publicId}`;
                this.currentExpiredTime = moment(this.baoGia.expiredTime);
                this.linkModalVisible = true;
                this.$notification['success']({
                    message: 'Tạo link public báo giá thành công'
                });
            } else {
                this.linkModalVisible = true;
            }
        },
        copyLink() {
            navigator.clipboard.writeText(this.link);
            this.$notification['success']({
                message: 'Đã copy link public báo giá'
            });
        },
        async editLink() {
            this.editConfirmed = true;

            if (moment(this.baoGia.expiredTime).valueOf() < moment().valueOf()) {
                this.$notification['warning']({
                    message: 'Vui lòng chọn thời điểm sau thời điểm hiện tại'
                });
                this.baoGia.expiredTime = this.currentExpiredTime;
                return;
            }

            await this.updateBaoGia(this.baoGia);
            this.currentExpiredTime = this.baoGia.expiredTime;
            this.$notification['success']({
                message: 'Cập nhật ngày hết hạn thành công'
            });
        },
        async deleteLink() {
            this.baoGia.publicId = null;
            this.baoGia.expiredTime = null;
            await this.updateBaoGia(this.baoGia);
            this.linkModalVisible = false;
            this.link = null;
            this.currentExpiredTime = null;
            this.$notification['success']({
                message: 'Xóa link public báo giá thành công'
            });
        },
        copyBaoGia() {
            this.baoGia.id = null;
            this.baoGia.name = 'Bản sao của ' + this.baoGia.name;
            this.statusList = statusList1;
            this.savedBaoGia = {};
            this.linkModalVisible = false;
            this.link = null;
            this.currentExpiredTime = null;
            this.editConfirmed = false;
            this.baoGia.status = 'DRAFT';
            this.baoGia.publicId = null;
            this.baoGia.createdAt = null;
            this.baoGia.updatedAt = null;
            this.$notification['success']({
                message: 'Sao chép báo giá thành công'
            });
        },
        showTemplate() {
            if (!this.baoGia.privacy) {
                this.baoGia.privacy = samplePrivacy;
                this.baoGia.privacy +=
                    `<h3><strong>Liên hệ : ` +
                    this.baoGia.user.agent.name +
                    `</strong></h3><p>1. Hotline: ` +
                    this.baoGia.user.mobile +
                    ` </p>`;
            }
        }
    },
    async mounted() {
        await this.getListSanPham();
        this.statusList = this.baoGia.status !== 'CUSTOMER_REJECTED' ? statusList1 : statusList2;
        if (this.baoGia.id) {
            this.savedBaoGia = JSON.parse(JSON.stringify(this.baoGia));
            this.htmlToPdfOptions.filename =
                'Bảng dự toán JAVIS_khách hàng ' +
                (this.savedBaoGia.khachHangId ? this.savedBaoGia.khachHang.name : '') +
                '_' +
                moment(this.savedBaoGia.updatedAt).format('DD/MM/YYYY');
        } else {
            this.baoGia.privacy = samplePrivacy;
            this.baoGia.privacy +=
                `<h3><strong>Liên hệ : ` +
                this.baoGia.user.agent.name +
                `</strong></h3><p>1. Hotline: ` +
                this.baoGia.user.mobile +
                ` </p>`;
        }
        if (this.baoGia.publicId) {
            this.link = `${process.env.VUE_APP_PUBLIC_PRICE_QUOTE_URL}/bao-gia/${this.baoGia.publicId}`;
            this.baoGia.expiredTime = moment(this.baoGia.expiredTime);
            this.currentExpiredTime = moment(this.baoGia.expiredTime);
        }
    },
    beforeMount() {
        window.addEventListener('beforeunload', (e) => {
            let baoGia = this.baoGia;
            let baoGiaSaved = this.baoGiaSaved;
            delete baoGia.createdAt;
            delete baoGia.updatedAt;
            delete baoGia.expiredTime;
            delete baoGiaSaved.createdAt;
            delete baoGiaSaved.updatedAt;
            delete baoGiaSaved.expiredTime;
            if (baoGiaSaved.id && _.isEqual(baoGia, baoGiaSaved)) return;
            e.preventDefault();
            // Chrome requires returnValue to be set.
            e.returnValue = '';
        });
    }
};
</script>

<style scoped>
.btnPrivacy {
    font-size: 16px;
}
</style>
