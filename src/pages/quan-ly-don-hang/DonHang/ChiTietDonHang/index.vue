<template>
    <a-form-model :model="donHang" ref="form" style="margin-top: -4px">
        <div style="margin-bottom: -8px" v-if="width < 1800">
            <div style="margin-bottom: -6px">
                <h2>Trạng thái</h2>
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
            <a-col :span="24">
                <a-row class="mt-1">
                    <a-col :span="12">
                        <div class="ml-2">
                            <h2>Trạng thái</h2>
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
            <SanPham />
        </div>

        <a-row
            :style="width < 768 ? { fontSize: '14px' } : { fontSize: '18px' }"
            :gutter="[12, 4]"
            class="mt-3"
        >
            <a-col :xs="24" :sm="24" :md="12">
                <a-row>
                    <a-col :xs="12" :sm="12" :md="10">
                        <p>Tổng giá thiết bị:</p>
                    </a-col>
                    <a-col :xs="10" :sm="10" :md="8">
                        <span class="text-success float-right mr-2">
                            {{ tongGiaThietBi.toLocaleString() }}
                        </span>
                    </a-col>
                    <a-col :span="2">
                        <span class="text-success"> VND </span>
                    </a-col>
                </a-row>
                <a-row
                    v-if="
                        permission.modifiable ||
                        (!permission.modifiable && donHang.chietKhau.value !== 0)
                    "
                >
                    <a-col :xs="7" :sm="10" :md="10">
                        <p>Chiết khấu:</p>
                    </a-col>
                    <a-col :xs="17" :sm="14" :md="12" v-if="permission.modifiable">
                        <a-space :style="{ marginTop: '-4px' }" class="float-right mr-md-3 mr-n3">
                            <a-input-number
                                class="custom-input-number-right no-handler mr-2"
                                style="width: 95px; font-size: 15px"
                                :min="0"
                                :max="donHang.chietKhau.unit === 'VND' ? tongGiaThietBi : 100"
                                :formatter="
                                    donHang.chietKhau.unit === 'VND'
                                        ? formatNumber
                                        : formatPercentage
                                "
                                :parser="
                                    donHang.chietKhau.unit === 'VND' ? parseNumber : parsePercentage
                                "
                                @blur="checkChietKhauValue(0)"
                                v-model="donHang.chietKhau.value"
                            />
                            <a-radio-group
                                v-model="donHang.chietKhau.unit"
                                @change="checkChietKhauValue(1)"
                                buttonStyle="solid"
                                :size="width < 768 ? 'small' : 'default'"
                            >
                                <a-radio-button value="%"> % </a-radio-button>
                                <a-radio-button value="VND"> VND </a-radio-button>
                            </a-radio-group>
                        </a-space>
                    </a-col>
                    <a-col :xs="15" :sm="12" :md="12" v-if="!permission.modifiable">
                        <span class="float-right mr-2">{{
                            donHang.chietKhau.value.toLocaleString()
                        }}</span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span>{{ donHang.chietKhau.unit }}</span>
                    </a-col>
                </a-row>
                <a-row
                    v-if="
                        permission.modifiable ||
                        (!permission.modifiable &&
                            donHang.chietKhau.value !== 0 &&
                            donHang.phiLapDat.value !== 0)
                    "
                >
                    <a-col :xs="12" :sm="12" :md="10">
                        <p>Tổng sau chiết khấu:</p>
                    </a-col>
                    <a-col :xs="10" :sm="10" :md="8">
                        <span class="text-success float-right mr-2">
                            {{ parseInt(tongSauChietKhau.toFixed()).toLocaleString() }}
                        </span>
                    </a-col>
                    <a-col :span="2">
                        <span class="text-success"> VND </span>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :xs="7" :sm="10" :md="10">
                        <p>Phí lắp đặt:</p>
                    </a-col>
                    <a-col :xs="17" :sm="14" :md="12" v-if="permission.modifiable">
                        <a-space :style="{ marginTop: '-4px' }" class="float-right mr-md-3 mr-n3">
                            <a-input-number
                                class="custom-input-number-right no-handler mr-2"
                                style="width: 95px; font-size: 15px"
                                :min="0"
                                :formatter="
                                    donHang.phiLapDat.unit === 'VND'
                                        ? formatNumber
                                        : formatPercentage
                                "
                                :parser="
                                    donHang.phiLapDat.unit === 'VND' ? parseNumber : parsePercentage
                                "
                                @blur="checkPhiLapDatValue(0)"
                                v-model="donHang.phiLapDat.value"
                            />
                            <a-radio-group
                                v-model="donHang.phiLapDat.unit"
                                @change="checkPhiLapDatValue(1)"
                                buttonStyle="solid"
                                :size="width < 768 ? 'small' : 'default'"
                            >
                                <a-radio-button value="%"> % </a-radio-button>
                                <a-radio-button value="VND"> VND </a-radio-button>
                            </a-radio-group>
                        </a-space>
                    </a-col>
                    <a-col :xs="15" :sm="12" :md="12" v-if="!permission.modifiable">
                        <span class="float-right mr-2">{{
                            donHang.phiLapDat.value.toLocaleString()
                        }}</span>
                    </a-col>
                    <a-col :span="2" v-if="!permission.modifiable">
                        <span>{{ donHang.phiLapDat.unit }}</span>
                    </a-col>
                </a-row>
                <a-row
                    v-if="
                        permission.modifiable ||
                        (!permission.modifiable &&
                            (donHang.chietKhau.value !== 0 || donHang.phiLapDat.value !== 0))
                    "
                >
                    <a-col :xs="12" :sm="12" :md="10">
                        <p>Tổng chi phí:</p>
                    </a-col>
                    <a-col :xs="10" :sm="10" :md="8">
                        <span class="text-success float-right mr-2">
                            {{ parseInt(tongChiPhi.toFixed()).toLocaleString() }}
                        </span>
                    </a-col>
                    <a-col :span="2">
                        <span class="text-success"> VND </span>
                    </a-col>
                </a-row>
            </a-col>
            <a-col :xs="24" :sm="24" :md="12">
                <a-space class="float-right my-2 mr-3" direction="vertical" size="large">
                    <a-button
                        icon="save"
                        type="primary"
                        class="px-2"
                        size="large"
                        :style="{ width: '150px' }"
                        @click="onSave(0)"
                        v-if="permission.modifiable"
                    >
                        Lưu báo giá
                    </a-button>
                    <a-button
                        icon="save"
                        class="px-2"
                        size="large"
                        :style="{ width: '150px' }"
                        @click="onSave(1)"
                        v-if="permission.modifiable"
                    >
                        Lưu và đóng
                    </a-button>
                </a-space>
            </a-col>
        </a-row>
    </a-form-model>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import { statusList1, statusList2, statusList3 } from './const';
import KhachHang from './KhachHang';
import ThongTinBoSung from './ThongTinBoSung';
import { trimObject } from '../../../../utils/formUtil';
import SanPham from './SanPham';
export default {
    components: {
        KhachHang,
        ThongTinBoSung,
        SanPham
    },
    inject: ['permission'],
    data() {
        return {
            statusList: []
        };
    },
    computed: {
        ...mapState('window', ['width']),
        ...mapState('donHang', ['donHang']),
        tongGiaThietBi() {
            let tongGiaThietBi = 0;
            this.donHang.items.forEach((item) => {
                tongGiaThietBi +=
                    item.giaBanLe * item.soLuong -
                    (item.chietKhau.unit === 'VND'
                        ? item.chietKhau.value
                        : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
            });
            return tongGiaThietBi;
        },
        tongSauChietKhau() {
            const tongGiaThietBi = this.tongGiaThietBi;
            const chietKhau = this.donHang.chietKhau;
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
            const phiLapDat = this.donHang.phiLapDat;
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
        ...mapActions('donHang', ['saveDonHang', 'updateDonHang', 'resetDonHang']),
        getCurrent() {
            return this.statusList.findIndex((item) => item.value === this.donHang.status);
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
        checkChietKhauValue(reset) {
            if (reset || this.donHang.chietKhau.value === null) this.donHang.chietKhau.value = 0;
        },
        checkPhiLapDatValue(reset) {
            if (reset || this.donHang.phiLapDat.value === null) this.donHang.phiLapDat.value = 0;
        },
        disabledDate(value) {
            return value.valueOf() < moment().startOf('days');
        },
        async onSave(close) {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                if (!this.donHang.khachHangId) {
                    this.$notification['warning']({
                        message: 'Vui lòng chọn khách hàng'
                    });
                    return;
                }
                if (this.tongGiaThietBi === 0) {
                    this.$notification['warning']({
                        message: 'Đơn hàng chưa có giá trị'
                    });
                    return;
                }

                const id = this.donHang.id;
                try {
                    trimObject(this.donHang);
                    if (id) {
                        await this.updateDonHang(this.donHang);
                        this.donHang.updatedAt = moment();
                    } else await this.saveDonHang(this.donHang);
                    if (close) {
                        this.resetDonHang();
                    }
                    if (id)
                        this.$notification['success']({
                            message: 'Cập nhật đơn hàng thành công'
                        });
                    else
                        this.$notification['success']({
                            message: 'Thêm đơn hàng thành công'
                        });
                } catch (error) {
                    if (id)
                        this.$notification['error']({
                            message: 'Cập nhật đơn hàng không thành công'
                        });
                    else
                        this.$notification['success']({
                            message: 'Thêm đơn hàng không thành công'
                        });
                }
            });
        }
    },
    async mounted() {
        await this.getListSanPham();
        this.statusList =
            this.donHang.status !== 'CANCEL'
                ? this.donHang.status !== 'NEED_CONFIRM'
                    ? statusList1
                    : statusList2
                : statusList3;
    }
};
</script>
