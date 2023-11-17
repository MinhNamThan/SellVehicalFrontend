<template>
    <a-card
        :body-style="{ padding: '0' }"
        class="card-cover"
        :bordered="false"
        :style="{ backgroundColor: '#fafafa', minHeight: '100vh' }"
        v-if="baoGia.id"
    >
        <div class="title">
            <a-row class="pb-md-2 pb-xl-3 pb-1">
                <a-col :span="12">
                    <img src="@/assets/img/javis.png" class="img-title py-4 pb-md-4 pb-xs-2" />
                </a-col>
                <a-col :span="12">
                    <div class="float-right">
                        <h2 class="text-title">GIẢI PHÁP NHÀ THÔNG MINH JAVIS</h2>
                        <h3 class="text-mobie float-right mt-n2">
                            {{ `Hotline: ${baoGia.user.mobile}` }}
                        </h3>
                    </div>
                </a-col>
            </a-row>

            <slot />

            <a-card
                :body-style="{ padding: '24px 32px' }"
                bordered
                class="card-rounded shadow mb-4 mt-4"
            >
                <h1 class="title">
                    {{ `Bảng dự toán chi phí` }}
                </h1>
                <a-descriptions
                    :column="12"
                    :colon="false"
                    layout="vertical"
                    class="custom-descriptions-public pt-2 pb-3"
                >
                    <a-descriptions-item label="Chủ đầu tư :" :span="5">
                        {{ baoGia.khachHang.name ? baoGia.khachHang.name : 'Chưa có thông tin' }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Mobile :" :span="4">
                        {{
                            baoGia.khachHang.mobile ? baoGia.khachHang.mobile : 'Chưa có thông tin'
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Ngày cập nhật :" :span="3">
                        {{ moment(baoGia.updatedAt).format('DD/MM/YYYY HH:mm:ss') }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Địa chỉ :" :span="5">
                        {{
                            baoGia.khachHang.address
                                ? baoGia.khachHang.address
                                : 'Chưa có thông tin'
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Facebook :" :span="4">
                        <a
                            :href="baoGia.khachHang.facebook"
                            target="_blank"
                            class="link"
                            v-if="baoGia.khachHang.facebook"
                        >
                            {{ baoGia.khachHang.facebook }}
                        </a>
                        <span v-else>Chưa có thông tin</span>
                    </a-descriptions-item>
                    <a-descriptions-item :label="exported ? '' : 'Ngày hết hạn :'" :span="3">
                        {{
                            exported ? '' : moment(baoGia.expiredTime).format('DD/MM/YYYY HH:mm:ss')
                        }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Ghi chú :">
                        {{ baoGia.khachHang.note ? baoGia.khachHang.note : 'Chưa có ghi chú' }}
                    </a-descriptions-item>
                </a-descriptions>

                <h2 class="mt-3" style="font-size: 16px; color: red" v-if="listQuaTang.length > 0">
                    QUÀ TẶNG KHÁCH HÀNG
                </h2>

                <a-table
                    bordered
                    :rowKey="(r, i) => i"
                    :columns="columns"
                    :dataSource="listQuaTang"
                    :pagination="false"
                    :scroll="width < 1280 && !exported ? { x: 1000, y: height * 0.6 } : {}"
                    :class="`${
                        width < 1500 || exported ? 'custom-table-small ' : ''
                    }custom-table-public pt-2 pb-4 custom-table-content`"
                    v-if="listQuaTang.length > 0"
                >
                    <div v-for="(column, index) in columns" :key="index" :slot="column.slots.title">
                        <span>{{ column.slots.title }}</span>
                    </div>
                    <template slot="stt" slot-scope="text, record, index">
                        {{ index + 1 }}
                    </template>
                    <template slot="donGia" slot-scope="text, record">
                        <span>{{ record.giaBanLe.toLocaleString() }}</span>
                    </template>
                    <template slot="soLuong" slot-scope="text">
                        <span class="text-danger">{{ text }}</span>
                    </template>
                    <template slot="thanhTien" slot-scope="text, record">
                        <span v-if="record.id">{{
                            (record.giaBanLe * record.soLuong).toLocaleString()
                        }}</span>
                    </template>
                    <template slot="chietKhau" slot-scope="text, record">
                        <span>{{
                            record.chietKhau.unit === 'VND'
                                ? record.chietKhau.value.toLocaleString()
                                : `${record.chietKhau.value} %`
                        }}</span>
                    </template>
                    <template slot="tong" slot-scope="text, record">
                        <div class="text-success">
                            {{
                                parseInt(
                                    (
                                        record.giaBanLe * record.soLuong -
                                        (record.chietKhau.unit === 'VND'
                                            ? record.chietKhau.value
                                            : record.giaBanLe *
                                              record.soLuong *
                                              (record.chietKhau.value / 100))
                                    ).toFixed()
                                ).toLocaleString()
                            }}
                        </div>
                    </template>
                    <template slot="moTa" slot-scope="text, record">
                        <div v-html="record.moTa" v-if="record.moTa"></div>
                    </template>
                    <template slot="anh" slot-scope="text, record">
                        <img :src="record.anhDaiDien" :width="width < 1500 || exported ? 70 : 80" />
                    </template>
                </a-table>

                <div style="height: 60px" v-if="listQuaTang.length > 0">
                    <a-row
                        :gutter="[12, 0]"
                        class="float-right"
                        style="width: 350px; font-size: 15px"
                    >
                        <a-col :span="24">
                            <a-row>
                                <a-col :span="11">
                                    <h4 class="m-0 float-right float-sm-none">
                                        Tổng giá trị quà tặng :
                                    </h4>
                                </a-col>
                                <a-col :span="10">
                                    <h4 class="text-success float-right m-0">
                                        {{ tongGiaKhuyenMai.toLocaleString() }}
                                    </h4>
                                </a-col>
                                <a-col :span="3">
                                    <h4 class="text-success m-0" style="padding-left: 9px">VND</h4>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </div>
                <h2 class="mt-3" style="font-size: 16px">A. BẢNG TỔNG HỢP KHỐI LƯỢNG</h2>

                <a-table
                    bordered
                    :rowKey="(r, i) => i"
                    :columns="columns"
                    :dataSource="listSanPhamTongHop"
                    :pagination="false"
                    :scroll="width < 1280 && !exported ? { x: 1000, y: height * 0.6 } : {}"
                    :class="`${
                        width < 1500 || exported ? 'custom-table-small ' : ''
                    }custom-table-public pt-2 pb-4 custom-table-content`"
                >
                    <div v-for="(column, index) in columns" :key="index" :slot="column.slots.title">
                        <span>{{ column.slots.title }}</span>
                    </div>
                    <template slot="stt" slot-scope="text, record, index">
                        {{ index + 1 }}
                    </template>
                    <template slot="soLuong" slot-scope="text">
                        <span class="text-danger">{{ text }}</span>
                    </template>
                    <template slot="donGia" slot-scope="text, record">
                        <span>{{ record.giaBanLe.toLocaleString() }}</span>
                    </template>
                    <template slot="thanhTien" slot-scope="text, record">
                        <span v-if="record.id">{{
                            (record.giaBanLe * record.soLuong).toLocaleString()
                        }}</span>
                    </template>
                    <template slot="chietKhau" slot-scope="text, record" v-if="showChietKhau">
                        <span>{{
                            record.chietKhau.unit === 'VND'
                                ? record.chietKhau.value.toLocaleString()
                                : `${record.chietKhau.value} %`
                        }}</span>
                    </template>
                    <template slot="tong" slot-scope="text, record">
                        <div class="text-success">
                            {{
                                parseInt(
                                    (
                                        record.giaBanLe * record.soLuong -
                                        (record.chietKhau.unit === 'VND'
                                            ? record.chietKhau.value
                                            : record.giaBanLe *
                                              record.soLuong *
                                              (record.chietKhau.value / 100))
                                    ).toFixed()
                                ).toLocaleString()
                            }}
                        </div>
                    </template>
                    <template slot="moTa" slot-scope="text, record">
                        <div v-html="record.moTaGoc || ''" v-if="record.moTa"></div>
                    </template>
                    <template slot="anh" slot-scope="text, record">
                        <img :src="record.anhDaiDien" :width="width < 1500 || exported ? 70 : 80" />
                    </template>
                </a-table>

                <div :style="{ height: totalSumHeight }">
                    <a-row
                        :gutter="[12, 12]"
                        class="float-right my-2"
                        :style="{ width: '350px', fontSize: '15px' }"
                    >
                        <a-col>
                            <a-row>
                                <a-col :span="11">
                                    <h4 class="m-0 float-right float-sm-none">
                                        Tổng giá thiết bị :
                                    </h4>
                                </a-col>
                                <a-col :span="10">
                                    <h4 class="text-success float-right m-0">
                                        {{ tongGiaThietBi.toLocaleString() }}
                                    </h4>
                                </a-col>
                                <a-col :span="3">
                                    <h4 class="text-success m-0" style="padding-left: 9px">VND</h4>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col v-if="baoGia.chietKhau.value !== 0">
                            <a-row>
                                <a-col :span="11">
                                    <p class="m-0 float-right float-sm-none">Chiết khấu :</p>
                                </a-col>
                                <a-col :span="10">
                                    <span
                                        class="float-right"
                                        :style="exported ? { paddingRight: '5px' } : {}"
                                        >{{ baoGia.chietKhau.value.toLocaleString() }}</span
                                    >
                                </a-col>
                                <a-col :span="3">
                                    <span style="padding-left: 9px">
                                        {{ baoGia.chietKhau.unit }}
                                    </span>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col v-if="baoGia.chietKhau.value !== 0 && baoGia.phiLapDat.value !== 0">
                            <a-row>
                                <a-col :span="11">
                                    <h4 class="m-0 float-right float-sm-none">
                                        Tổng sau chiết khấu :
                                    </h4>
                                </a-col>
                                <a-col :span="10">
                                    <h4 class="text-success float-right m-0">
                                        {{ parseInt(tongSauChietKhau.toFixed()).toLocaleString() }}
                                    </h4>
                                </a-col>
                                <a-col :span="3">
                                    <h4 class="text-success m-0" style="padding-left: 9px">VND</h4>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col v-if="baoGia.phiLapDat.value !== 0">
                            <a-row>
                                <a-col :span="11">
                                    <p class="m-0 float-right float-sm-none">Phí lắp đặt :</p>
                                </a-col>
                                <a-col :span="baoGia.phiLapDat.unit == '%' ? 2 : 10">
                                    <span
                                        class="float-right"
                                        :style="exported ? { paddingRight: '5px' } : {}"
                                        >{{ baoGia.phiLapDat.value.toLocaleString() }}</span
                                    >
                                </a-col>
                                <a-col :span="1">
                                    <span style="padding-left: 4px">
                                        {{ baoGia.phiLapDat.unit }}
                                    </span>
                                </a-col>
                                <a-col :span="10">
                                    <span class="float-right" v-if="baoGia.phiLapDat.unit == '%'">
                                        {{
                                            '(' +
                                            parseInt(
                                                (
                                                    (tongSauChietKhau * baoGia.phiLapDat.value) /
                                                    100
                                                ).toFixed()
                                            ).toLocaleString() +
                                            ' VND)'
                                        }}
                                    </span>
                                </a-col>
                            </a-row>
                        </a-col>
                        <a-col v-if="baoGia.chietKhau.value !== 0 || baoGia.phiLapDat.value !== 0">
                            <a-row>
                                <a-col :span="11">
                                    <h4 class="m-0 float-right float-sm-none">Tổng chi phí :</h4>
                                </a-col>
                                <a-col :span="10">
                                    <h4 class="text-success float-right m-0">
                                        {{ parseInt(tongChiPhi.toFixed()).toLocaleString() }}
                                    </h4>
                                </a-col>
                                <a-col :span="3">
                                    <h4 class="text-success m-0" style="padding-left: 9px">VND</h4>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </div>

                <h2 :style="{ fontSize: '16px' }">B. BÁO GIÁ CHI TIẾT THEO TỪNG HẠNG MỤC</h2>

                <a-table
                    bordered
                    :rowKey="(r, i) => i"
                    :columns="columns"
                    :dataSource="listSanPhamChiTiet"
                    :pagination="false"
                    :scroll="width < 1280 && !exported ? { x: 1000, y: height * 0.6 } : {}"
                    :class="`${
                        width < 1500 || exported ? 'custom-table-small ' : ''
                    }custom-table-public pt-2 pb-4 custom-table-content`"
                >
                    <div v-for="(column, index) in columns" :key="index" :slot="column.slots.title">
                        <span>{{ column.slots.title }}</span>
                    </div>
                    <template slot="stt" slot-scope="text, record, index">
                        {{ index + 1 }}
                    </template>
                    <template slot="sku" slot-scope="text, record">
                        <span :class="record.id ? '' : 'text-bold'">{{ text }}</span>
                    </template>
                    <template slot="donGia" slot-scope="text, record">
                        <span v-if="record.id">{{ record.giaBanLe.toLocaleString() }}</span>
                    </template>
                    <template slot="soLuong" slot-scope="text">
                        <span class="text-danger">{{ text }}</span>
                    </template>
                    <template slot="thanhTien" slot-scope="text, record">
                        <span v-if="record.id">{{
                            (record.giaBanLe * record.soLuong).toLocaleString()
                        }}</span>
                    </template>
                    <template slot="chietKhau" slot-scope="text, record" v-if="showChietKhau">
                        <span v-if="record.id">{{
                            record.chietKhau.unit === 'VND'
                                ? record.chietKhau.value.toLocaleString()
                                : `${record.chietKhau.value} %`
                        }}</span>
                    </template>
                    <template slot="tong" slot-scope="text, record">
                        <div class="text-success" v-if="record.id">
                            {{
                                parseInt(
                                    (
                                        record.giaBanLe * record.soLuong -
                                        (record.chietKhau.unit === 'VND'
                                            ? record.chietKhau.value
                                            : record.giaBanLe *
                                              record.soLuong *
                                              (record.chietKhau.value / 100))
                                    ).toFixed()
                                ).toLocaleString()
                            }}
                        </div>
                    </template>
                    <template slot="moTa" slot-scope="text, record">
                        <div v-html="record.moTa" v-if="record.moTa"></div>
                    </template>
                    <template slot="anh" slot-scope="text, record">
                        <img
                            v-if="record.anhDaiDien"
                            :src="record.anhDaiDien"
                            :width="width < 1500 || exported ? 70 : 80"
                        />
                    </template>
                </a-table>

                <div style="height: 60px">
                    <a-row
                        :gutter="[12, 0]"
                        class="float-right"
                        style="width: 350px; font-size: 15px"
                    >
                        <a-col :span="24">
                            <a-row>
                                <a-col :span="11">
                                    <h4 class="m-0 float-right float-sm-none">
                                        Tổng giá thiết bị :
                                    </h4>
                                </a-col>
                                <a-col :span="10">
                                    <h4 class="text-success float-right m-0">
                                        {{ tongGiaThietBi.toLocaleString() }}
                                    </h4>
                                </a-col>
                                <a-col :span="3">
                                    <h4 class="text-success m-0" style="padding-left: 9px">VND</h4>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </div>

                <div>
                    <div v-html="baoGia.privacy" id="privacy"></div>
                </div>
            </a-card>
        </div>
    </a-card>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import { columns1, columns2, columns3, columns4, luuY, thamKhao, tongHop } from './const';

export default {
    name: 'Content',
    props: [
        'exported',
        'baoGia',
        'lspct',
        'lsp',
        'lspth',
        'lqt',
        'tgtb',
        'tgkm',
        'tsck',
        'tcp',
        'tsh'
    ],
    data() {
        return {
            columns: null,
            listPhong: [],
            listSanPhamChiTiet: [],
            listSanPham: [],
            listSanPhamTongHop: [],
            listQuaTang: [],
            tongGiaThietBi: 0,
            tongGiaKhuyenMai: 0,
            tongSauChietKhau: 0,
            tongChiPhi: 0,
            totalSumHeight: null,
            luuY,
            tongHop,
            thamKhao,
            showChietKhau: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height'])
    },
    watch: {
        width(newVal) {
            if (this.showChietKhau) {
                if (newVal < 1500 || this.exported) {
                    this.columns = columns2;
                    if (this.exported) {
                        this.columns[3].width = 65;
                        this.columns[4].width =
                            this.columns[5].width =
                            this.columns[6].width =
                            this.columns[7].width =
                                80;
                        this.columns[9].width = 225;
                        this.columns[10].width = 100;
                    }
                } else {
                    this.columns = columns1;
                }
            } else {
                if (newVal < 1500 || this.exported) {
                    this.columns = columns4;
                    if (this.exported) {
                        this.columns[3].width = 65;
                        this.columns[4].width = this.columns[5].width = 80;
                        this.columns[7].width = 225;
                        this.columns[8].width = 100;
                    }
                } else {
                    this.columns = columns3;
                }
            }
        },
        baoGia(newVal) {
            if (!this.lspct) this.getData(newVal);
            else {
                this.listSanPhamChiTiet = this.lspct;
                this.listSanPham = this.lsp;
                this.listSanPhamTongHop = this.lspth;
                this.listQuaTang = this.lqt;
                this.tongGiaThietBi = this.tgtb;
                this.tongGiaKhuyenMai = this.tgkm;
                this.tongSauChietKhau = this.tsck;
                this.tongChiPhi = this.tcp;
                this.totalSumHeight = this.tsh;
            }
            this.showChietKhau = this.listSanPham.some((sp) => sp.chietKhau.value > 0);

            if (this.showChietKhau) {
                this.columns = this.width < 1500 ? columns2 : columns1;
            } else {
                this.columns = this.width < 1500 ? columns4 : columns3;
            }
        }
    },
    methods: {
        moment,
        getData(baoGia) {
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
            let tongGiaThietBi = 0;
            let tongGiaKhuyenMai = 0;
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
                            tongGiaKhuyenMai += item.giaBanLe * item.soLuong;
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
                        tongGiaThietBi +=
                            item.giaBanLe * item.soLuong -
                            (item.chietKhau.unit === 'VND'
                                ? item.chietKhau.value
                                : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
                    });
            });
            this.listPhong.forEach((phong) => {
                if (phong.listSanPham.length > 0)
                    listSanPhamChiTiet.push({ sku: phong.name }, ...phong.listSanPham);
            });
            this.listSanPhamChiTiet = listSanPhamChiTiet;
            this.listSanPham = listSanPham;
            this.listSanPhamTongHop = listSanPhamTongHop;
            this.listQuaTang = listQuaTang;
            this.tongGiaThietBi = tongGiaThietBi;
            this.tongGiaKhuyenMai = tongGiaKhuyenMai;

            const chietKhau = baoGia.chietKhau;
            this.tongSauChietKhau =
                tongGiaThietBi -
                (chietKhau.unit === 'VND'
                    ? chietKhau.value
                        ? chietKhau.value
                        : 0
                    : tongGiaThietBi * (chietKhau.value / 100));

            const phiLapDat = baoGia.phiLapDat;
            this.tongChiPhi =
                this.tongSauChietKhau +
                (phiLapDat.unit === 'VND'
                    ? phiLapDat.value
                        ? phiLapDat.value
                        : 0
                    : tongGiaThietBi * (phiLapDat.value / 100));

            if (baoGia.chietKhau.value !== 0 && baoGia.phiLapDat.value !== 0)
                this.totalSumHeight = '220px';
            else if (baoGia.chietKhau.value === 0 && baoGia.phiLapDat.value === 0)
                this.totalSumHeight = '80px';
            else this.totalSumHeight = '150px';
        }
    },
    mounted() {
        if (this.width < 1500 || this.exported) {
            this.columns = columns4;
            if (this.exported) {
                this.columns[3].width = 65;
                this.columns[4].width = this.columns[5].width = 80;
                this.columns[7].width = 225;
                this.columns[8].width = 100;
            }
        } else {
            this.columns = columns3;
        }
    }
};
</script>

<style lang="less" scoped>
.card-rounded {
    border-radius: 16px;
    color: black;
}
.shadow {
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
}
.text-success {
    color: #21b876 !important;
}
.link {
    word-break: break-word;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    &:hover {
        color: #fa832d;
    }
}
.card-cover {
    padding: 24px 32px;
}
.title {
    width: 89%;
    margin: auto;
}
.img-title {
    width: 168px;
    color: black;
}

#privacy {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    color: black;
}
::v-deep #privacy > h1 {
    font-size: 28px;
    page-break-inside: avoid;
}
::v-deep #privacy > h2 {
    font-size: 24px;
    page-break-inside: avoid;
}
::v-deep #privacy > h3 {
    font-size: 20px;
    page-break-inside: avoid;
}
::v-deep #privacy > h4 {
    font-size: 18px;
    page-break-inside: avoid;
}
::v-deep #privacy > h5 {
    font-size: 16px;
    page-break-inside: avoid;
}
::v-deep #privacy > h6 {
    font-size: 14px;
    page-break-inside: avoid;
}
::v-deep #privacy > p {
    page-break-inside: avoid;
}
::v-deep #privacy > tr {
    page-break-inside: avoid;
}
@media screen and (max-width: 768px) {
    .card-cover {
        padding: 0px;
    }
    .title {
        width: 95%;
        margin: auto;
    }
    .img-title {
        width: 150px;
    }
    .text-title {
        font-size: 25px;
    }
    .text-mobie {
        font-size: 18px !important;
        float: none !important;
    }
}
</style>
