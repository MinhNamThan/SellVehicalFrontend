<template>
    <div>
        <h3>Danh sách sản phẩm</h3>
        <a-row v-if="permission.modifiable">
            <a-col :span="16">
                <a-dropdown
                    :trigger="['click']"
                    :visible="dropdownVisible"
                    @visibleChange="handleDropdownVisibleChange"
                >
                    <div
                        @mouseover="mouseOntoSearchInput = true"
                        @mouseout="mouseOntoSearchInput = false"
                        :style="width < 768 ? { width: '100%' } : { width: '750px' }"
                    >
                        <a-input-search
                            ref="searchInput"
                            placeholder="Nhập tên sản phẩm, nhãn hiệu, tên phiên bản hoặc mã SKU..."
                            class="input-search"
                            @change="searchItem"
                            @search="searchItem"
                            allowClear
                        />
                    </div>
                    <a-menu slot="overlay">
                        <DynamicScroller
                            :items="searchResults"
                            :min-item-size="120"
                            class="dropdown-menu ant-dropdown-menu ant-dropdown-menu-vertical ant-dropdown-menu-root ant-dropdown-menu-light ant-dropdown-content"
                        >
                            <template v-slot="{ item, index, active }">
                                <DynamicScrollerItem
                                    :item="item"
                                    :active="active"
                                    :data-index="index"
                                >
                                    <div class="ant-dropdown-menu-item" @click="addItem(item)">
                                        <a-row type="flex" align="middle" :gutter="20">
                                            <a-col :span="4">
                                                <img
                                                    :src="item.anhDaiDien"
                                                    class="img-center"
                                                    v-if="item.anhDaiDien"
                                                />
                                                <a-empty
                                                    class="my-1"
                                                    :image="simpleImage"
                                                    description="Không có ảnh"
                                                    v-else
                                                />
                                            </a-col>
                                            <a-col :span="20" :style="{ marginTop: '8px' }">
                                                <div :style="{ marginBottom: '-7px' }">
                                                    <h4>{{ item.ten }}</h4>
                                                    <p>{{ item.sku }}</p>
                                                </div>
                                                <p class="text-success">
                                                    {{ item.giaBanLe.toLocaleString() }}
                                                </p>
                                            </a-col>
                                        </a-row>
                                    </div>
                                </DynamicScrollerItem>
                            </template>
                        </DynamicScroller>
                    </a-menu>
                </a-dropdown>
            </a-col>
            <a-col :span="8">
                <a-popconfirm
                    title="Bạn có chắc chắn muốn làm mới danh sách không?"
                    @confirm="resetList"
                >
                    <a-button icon="undo" class="px-2 float-right" type="danger">
                        Làm mới
                    </a-button>
                </a-popconfirm>
            </a-col>
        </a-row>
        <p class="mt-3">{{ getStatistics() }}</p>
        <a-table
            :rowKey="(r, i) => i"
            :rowClassName="rowClassName"
            :columns="columns"
            :dataSource="listSanPhamDonHang"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.8 } : { y: height * 0.8 }"
        >
            <div v-for="(column, index) in columns" :key="index" :slot="column.slots.title">
                <span :class="column.align">{{ column.slots.title }}</span>
            </div>

            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="anh" slot-scope="text, record">
                <div class="img-center">
                    <img
                        :src="record.anhDaiDien"
                        :width="width < 1639 ? 50 : 64"
                        v-if="record.anhDaiDien"
                    />
                    <a-empty
                        description=""
                        :image-style="{ width: '60px' }"
                        :image="simpleImage"
                        v-else
                    />
                </div>
            </template>
            <template slot="sanPham" slot-scope="text, record">
                <a-space align="baseline">
                    <h4 class="m-0">{{ record.ten }}</h4>
                    <a-popover>
                        <template slot="content">
                            <div style="max-width: 300px">
                                <div v-html="record.moTa" v-if="record.moTa"></div>
                                <div v-else>Không có mô tả</div>
                            </div>
                        </template>
                        <a-icon
                            type="info-circle"
                            :style="{ color: record.moTa ? '#1890ff' : '#a0a0a0' }"
                        />
                    </a-popover>
                </a-space>
                <p class="m-0">{{ record.sku }}</p>
            </template>
            <template slot="soLuong" slot-scope="text, record">
                <a-input-number
                    :min="1"
                    :formatter="formatNumber"
                    :parser="parseNumber"
                    v-model="record.soLuong"
                    @blur="checkSoLuong(record)"
                    :style="{ width: '55px' }"
                    v-if="permission.modifiable"
                />
                <span v-else>{{ record.soLuong }}</span>
            </template>
            <template slot="donGia" slot-scope="text, record">
                <a-input-number
                    class="custom-input-number-center no-handler"
                    :min="0"
                    :formatter="formatNumber"
                    :parser="parseNumber"
                    v-model="record.giaBanLe"
                    @blur="checkDonGia(record)"
                    :style="{ width: '80px' }"
                    v-if="permission.modifiable"
                />
                <span v-else>{{ record.giaBanLe.toLocaleString() }}</span>
            </template>
            <template slot="chietKhau" slot-scope="text, record">
                <a-popover trigger="click" v-if="permission.modifiable">
                    <template slot="content">
                        <a-space>
                            <a-radio-group
                                v-model="record.chietKhau.unit"
                                @change="checkChietKhau(record, 1)"
                                buttonStyle="solid"
                            >
                                <a-radio-button value="%"> % </a-radio-button>
                                <a-radio-button value="VND"> VND </a-radio-button>
                            </a-radio-group>
                            <a-input-number
                                class="custom-input-number-center no-handler"
                                :min="0"
                                :max="
                                    record.chietKhau.unit === 'VND'
                                        ? record.giaBanLe * record.soLuong
                                        : 100
                                "
                                :formatter="
                                    record.chietKhau.unit === 'VND'
                                        ? formatNumber
                                        : formatPercentage
                                "
                                :parser="
                                    record.chietKhau.unit === 'VND' ? parseNumber : parsePercentage
                                "
                                v-model="record.chietKhau.value"
                                @blur="checkChietKhau(record, 0)"
                                :style="{ width: '80px' }"
                            />
                        </a-space>
                    </template>
                    <a-input-number
                        class="custom-input-number-center no-handler"
                        :min="0"
                        :max="
                            record.chietKhau.unit === 'VND' ? record.giaBanLe * record.soLuong : 100
                        "
                        :formatter="(value) => formatChietKhau(value, record.chietKhau.unit)"
                        :parser="(value) => parseChietKhau(value, record.chietKhau.unit)"
                        v-model="record.chietKhau.value"
                        @blur="checkChietKhau(record, 0)"
                        :style="{ width: '80px' }"
                    />
                </a-popover>
                <span v-else>{{
                    record.chietKhau.unit === 'VND'
                        ? record.chietKhau.value.toLocaleString()
                        : `${record.chietKhau.value} %`
                }}</span>
            </template>
            <template slot="tong" slot-scope="text, record">
                <div class="text-success d-flex justify-content-center">
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
            <template slot="baoHanh" slot-scope="text">
                <div class="d-flex justify-content-center">{{ text }}</div>
            </template>
            <template slot="action" slot-scope="text, record">
                <a-popconfirm
                    title="Bạn có chắc chắn muốn xoá sản phẩm này không?"
                    @confirm="deleteItem(record)"
                >
                    <a-tooltip title="Xoá sản phẩm">
                        <a-button shape="circle" size="small" class="link">
                            <a-icon type="close" :style="{ fontSize: '12px' }" />
                        </a-button>
                    </a-tooltip>
                </a-popconfirm>
            </template>
        </a-table>
    </div>
</template>

<script>
import { isSubstring } from '@/utils/stringUtil';
import { Empty } from 'ant-design-vue';
import { mapState, mapActions } from 'vuex';
import debounce from 'lodash.debounce';
import { columns1, columns2, pagination } from './const';
export default {
    inject: ['permission'],
    data() {
        return {
            columns: null,
            pagination,
            search: '',
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
            dropdownVisible: false,
            mouseOntoSearchInput: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('sanPham', ['listSanPham']),
        ...mapState('donHang', ['donHang']),
        listSanPhamDonHang() {
            return this.donHang.items;
        },
        searchResults() {
            return this.listSanPham.filter((item) =>
                [item.ten, item.nhanHieu, item.tenPhienBan, item.sku].find((i) =>
                    typeof i === 'string' ? isSubstring(this.search, i) : false
                )
            );
        }
    },
    watch: {
        width(newVal) {
            this.columns = this.permission.modifiable
                ? newVal < 1639
                    ? columns2
                    : columns1
                : newVal < 1639
                ? columns2.slice(0, -1)
                : columns1.slice(0, -1);
        },
        listSanPhamDonHang(newVal) {
            this.pagination.total = newVal.length;
        }
    },
    methods: {
        ...mapActions('donHang', [
            'addSanPhamDonHang',
            'deleteSanPhamDonHang',
            'resetListSanPhamDonHang'
        ]),
        getIndex(index) {
            return (this.pagination.current - 1) * this.pagination.pageSize + index + 1;
        },
        getStatistics() {
            return `${this.pagination.total === 0 ? 0 : this.getIndex(0)}-${
                this.pagination.current * this.pagination.pageSize > this.pagination.total
                    ? this.pagination.total
                    : this.getIndex(this.pagination.pageSize - 1)
            } trong tổng số  ${this.pagination.total}`;
        },
        handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
        },
        handleDropdownVisibleChange(visible) {
            if (!visible && this.mouseOntoSearchInput) this.dropdownVisible = true;
            else this.dropdownVisible = visible;
        },
        rowClassName() {
            return this.permission.modifiable ? 'draggable-row' : null;
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
        formatChietKhau(value, unit) {
            return unit === 'VND' ? this.formatNumber(value) : `${this.formatPercentage(value)} %`;
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
        parseChietKhau(str, unit) {
            return unit === 'VND' ? this.parseNumber(str) : this.parsePercentage(str.slice(0, -2));
        },
        checkSoLuong(record) {
            if (record.soLuong === null) record.soLuong = 1;
        },
        checkDonGia(record) {
            if (record.giaBanLe === null) record.giaBanLe = 0;
        },
        checkChietKhau(record, reset) {
            if (reset || record.chietKhau.value === null) record.chietKhau.value = 0;
        },
        searchItem: debounce(function () {
            this.search = this.$refs.searchInput.$refs.input.$data.stateValue;
        }, 300),
        addItem(item) {
            this.addSanPhamDonHang({
                sanPham: { ...item, soLuong: 1, chietKhau: { unit: '%', value: 0 } }
            });
            this.$notification['success']({
                message: 'Thêm sản phẩm thành công'
            });
            this.dropdownVisible = false;
        },
        deleteItem(record) {
            this.deleteSanPhamDonHang({ id: record.id });
            this.$notification['success']({
                message: 'Xóa sản phẩm thành công'
            });
        },
        resetList() {
            this.resetListSanPhamDonHang();
            this.$notification['success']({
                message: 'Làm mới danh sách thành công'
            });
        }
    },
    mounted() {
        this.columns = this.permission.modifiable
            ? this.width < 1639
                ? columns2
                : columns1
            : this.width < 1639
            ? columns2.slice(0, -1)
            : columns1.slice(0, -1);
        this.pagination.total = this.listSanPhamDonHang.length;
    }
};
</script>

<style scoped>
.input-search {
    width: 750px;
    z-index: 1;
}
.dropdown-menu {
    padding: 0;
    min-width: 400px;
    max-height: 340px;
    overflow: auto;
}
.img-center {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 75%;
}
@media screen and (max-width: 768px) {
    .input-search {
        width: 100%;
        z-index: 1;
    }
}
</style>
