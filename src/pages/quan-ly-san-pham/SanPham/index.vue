<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <SanPhamSheet ref="sanPhamSheet" :listSanPham="listSanPham" />
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách sản phẩm</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button
                    icon="file-excel"
                    class="btn bg-green px-2 float-md-right"
                    :style="{
                        marginTop: '-2px'
                    }"
                    type="link"
                    @click="showUploadModal"
                >
                    Import sản phẩm
                </a-button>
                <a-button
                    icon="plus"
                    class="btn bg-blue px-2 mx-2 float-md-right"
                    :style="{
                        marginTop: '-2px'
                    }"
                    type="link"
                    @click="showAddModal"
                    >Thêm thủ công</a-button
                >
            </a-col>
        </a-row>

        <a-row>
            <a-col :xs="24" :sm="24" :md="8">
                <p>{{ getStatistics() }}</p>
            </a-col>
            <a-col :xs="24" :sm="24" :md="16">
                <div
                    class="float-md-right mb-2"
                    :style="{
                        marginTop: '-8px'
                    }"
                >
                    <a-input-search
                        ref="searchInput"
                        placeholder="Tìm kiếm..."
                        class="input-search"
                        @search="onSearch"
                        allowClear
                    />
                </div>
            </a-col>
        </a-row>

        <a-table
            bordered
            :rowKey="(r, i) => i"
            :rowClassName="rowClassName"
            :customRow="customRow"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.612 } : { y: height * 0.612 }"
        >
            <template slot="stt" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="img" slot-scope="text">
                <img :src="text" :width="60" />
            </template>
            <template slot="ten" slot-scope="text, record">
                <a-space align="baseline">
                    <span>{{ record.ten }}</span>
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
            </template>
            <template slot="khoiLuong" slot-scope="text, record">
                {{ `${record.khoiLuong}${record.donViKhoiLuong}` }}
            </template>
            <template slot="donVi" slot-scope="text">
                <div :style="{ textTransform: 'capitalize' }">
                    {{ text }}
                </div>
            </template>
            <template slot="thue" slot-scope="text, record">
                <a-checkbox :checked="record.apDungThue" />
            </template>
            <template slot="gia" slot-scope="text">
                {{ text.toLocaleString() }}
            </template>
            <template slot="date" slot-scope="text">
                {{ moment(text).format('DD/MM/YYYY') }}
            </template>
        </a-table>

        <a-button
            icon="file-excel"
            class="float-right mt-3 px-2"
            type="primary"
            @click="$refs.sanPhamSheet.exportSheet()"
        >
            Export sản phẩm
        </a-button>

        <a-modal
            v-model="uploadModalVisible"
            @ok="createUploadRequest"
            @cancel="cancelUploadRequest"
            :okText="confirmLoading ? 'Đang lưu' : 'Lưu'"
            :cancelText="'Huỷ'"
            :cancelButtonProps="confirmLoading ? { style: { display: 'none' } } : {}"
            destroyOnClose
            :confirmLoading="confirmLoading"
            :afterClose="
                () => {
                    confirmLoading = false;
                }
            "
        >
            <template slot="title">
                <h1 class="title m-0">Tải lên danh sách sản phẩm</h1>
            </template>
            <div class="upload-area">
                <svg viewBox="0 0 64 64" width="64" height="64">
                    <path
                        d="M 48,0 V 16 H 64 Z M 44,16 V 0 H 22 c -3.3125,0 -6,2.68625 -6,6 v 30 h 21.7625 l -4.87875,-4.87875 c -1.171875,-1.171875 -1.171875,-3.07 0,-4.2425 1.171875,-1.1725 3.07,-1.171875 4.2425,0 l 10,10 c 1.171875,1.171875 1.171875,3.07 0,4.2425 l -10,10 c -1.171875,1.171875 -3.07,1.171875 -4.2425,0 C 32.2875,50.5375 32,49.775 32,49 c 0,-0.775 0.293,-1.535 0.878875,-2.12125 L 37.7625,42 H 16 v 16 c 0,3.3125 2.6875,6 6,6 h 36 c 3.31375,0 6,-2.68625 6,-6 V 20 H 48.1125 C 45.7875,20 44,18.2125 44,16 Z M 3,36 c -1.65625,0 -3,1.3375 -3,3 0,1.65625 1.34375,3 3,3 h 13 v -6 z"
                        style="fill: #28a745; fill-opacity: 1; stroke-width: 0.125"
                    />
                </svg>
                Chọn file
                <a-upload
                    accept=".xls,.xlsx,.xlsm,.slm"
                    :customRequest="customRequest"
                    :showUploadList="false"
                    :disabled="confirmLoading"
                    ><a :disabled="confirmLoading">từ máy tính</a>
                </a-upload>
                của bạn
            </div>
            <div class="upload-list">
                <div v-if="uploadFile">
                    <a-row type="flex" align="middle">
                        <a-col :span="3">
                            <svg viewBox="0 0 27 36" width="27" height="36">
                                <path
                                    d="M 15.75,9 V 0 H 3.375 C 1.5110156,0 0,1.5110156 0,3.375 v 29.25 C 0,34.488281 1.5110156,36 3.375,36 h 20.25 C 25.488984,36 27,34.488984 27,32.625 V 11.25 H 18.063281 C 16.755469,11.25 15.75,10.244531 15.75,9 Z M 19.132031,18.590625 15.75,24.1875 19.194609,29.785078 C 19.659375,30.536719 19.117969,31.5 18.239062,31.5 h -1.858359 c -0.390726,0 -0.753047,-0.202711 -0.958359,-0.53557 L 13.5,27.84375 11.579766,30.964219 C 11.376563,31.296094 11.010937,31.5 10.624219,31.5 H 8.7609375 C 7.880625,31.5 7.3413281,30.534609 7.8025781,29.785078 L 11.25,24.1875 7.8046875,18.590625 C 7.340625,17.838281 7.8820312,16.875 8.7609375,16.875 h 1.8583595 c 0.390726,0 0.753047,0.202711 0.958359,0.535289 L 13.5,20.53125 15.420234,17.410078 C 15.623438,17.078906 15.989063,16.875 16.375781,16.875 h 1.85836 c 0.883828,0 1.425234,0.963281 0.89789,1.715625 z M 18,0 v 9 h 9 z"
                                    style="fill: #28a745; fill-opacity: 1; stroke-width: 0.0703125"
                                />
                            </svg>
                        </a-col>
                        <a-col :span="21">
                            <div>
                                <span v-if="uploadFile.name.length > 36">
                                    <a-tooltip :title="uploadFile.name">
                                        {{ wrapContent(uploadFile.name) }}
                                    </a-tooltip>
                                </span>
                                <span v-else>
                                    {{ uploadFile.name }}
                                </span>
                                <a-button
                                    class="btn-delete"
                                    size="small"
                                    shape="circle"
                                    icon="delete"
                                    type="dashed"
                                    @click="cancelUploadRequest"
                                    v-show="!confirmLoading"
                                />
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </a-modal>
        <a-modal v-model="detailsModalVisible" destroyOnClose :width="width < 1200 ? null : 1200">
            <template slot="title">
                <h1 class="title m-0">Thông tin sản phẩm</h1>
            </template>

            <a-row type="flex" align="middle">
                <a-col :span="width < 1200 ? 24 : 6" :class="width < 1200 ? 'mb-4' : null">
                    <img :src="sanPham.anhDaiDien" :width="240" v-if="sanPham.anhDaiDien" />
                    <a-empty :image="simpleImage" description="Không có ảnh" v-else />
                </a-col>
                <a-col :span="width < 1200 ? 24 : 18">
                    <a-descriptions :column="width < 450 ? 1 : 2" bordered>
                        <a-descriptions-item label="Tên sản phẩm" :span="2">
                            {{ sanPham.ten }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Tên phiên bản" :span="2">
                            {{ sanPham.tenPhienBan }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Mã SKU">
                            {{ sanPham.sku }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Nhãn hiệu">
                            {{ sanPham.nhanHieu ? sanPham.nhanHieu : null }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Đơn vị">
                            <div :style="{ textTransform: 'capitalize' }" v-if="sanPham.donVi">
                                {{ sanPham.donVi }}
                            </div>
                        </a-descriptions-item>
                        <a-descriptions-item label="Bảo hành">
                            {{ sanPham.baoHanh }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Áp dụng thuế">
                            <a-checkbox :checked="sanPham.apDungThue" />
                        </a-descriptions-item>
                        <a-descriptions-item label="Tồn kho">
                            {{ sanPham.tonKho }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Khối lượng">
                            {{ `${sanPham.khoiLuong}${sanPham.donViKhoiLuong}` }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Giá bán lẻ">
                            {{ sanPham.giaBanLe ? sanPham.giaBanLe.toLocaleString() : 0 }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Ngày khởi tạo">
                            {{ moment(sanPham.createdAt).format('DD/MM/YYYY') }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Ngày cập nhật">
                            {{ moment(sanPham.updatedAt).format('DD/MM/YYYY') }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Mô tả" :span="2">
                            <div v-html="sanPham.moTa" v-if="sanPham.moTa"></div>
                        </a-descriptions-item>
                    </a-descriptions>
                </a-col>
            </a-row>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <div class="float-left">
                        <a-button
                            icon="form"
                            class="px-2"
                            type="primary"
                            @click="
                                updateForm = { ...sanPham };
                                updateModalVisible = true;
                            "
                        >
                            Chỉnh sửa thông tin
                        </a-button>
                    </div>
                    <a-popconfirm
                        title="Bạn có chắc chắn muốn xoá sản phẩm này không?"
                        @confirm="onDelete(sanPham.id)"
                    >
                        <a-button type="danger" @click.stop>Xóa</a-button>
                    </a-popconfirm>
                    <a-button @click="hideDetailsModal">Đóng</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="updateModalVisible" destroyOnClose :width="width < 1200 ? null : 1200">
            <template slot="title">
                <h1 class="title m-0">Chỉnh sửa thông tin sản phẩm</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :rules="ruleFormSanPham"
                :model="updateForm"
                ref="updateForm"
            >
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Tên sản phẩm" prop="ten">
                            <a-input v-model="updateForm.ten" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Tên phiên bản" prop="tenPhienBan">
                            <a-input v-model="updateForm.tenPhienBan" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Mã SKU" prop="sku">
                            <a-input v-model="updateForm.sku" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Nhãn hiệu" prop="nhanHieu">
                            <a-input v-model="updateForm.nhanHieu" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Đơn vị" prop="donVi">
                            <a-input v-model="updateForm.donVi" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Bảo hành" prop="baoHang">
                            <a-input v-model="updateForm.baoHanh" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="6">
                        <a-form-model-item label="Áp dụng thuế" prop="thue">
                            <a-checkbox v-model="updateForm.apDungThue" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="Khối lượng" prop="khoiLuong">
                            <a-space :size="10">
                                <a-radio-group
                                    v-model="updateForm.donViKhoiLuong"
                                    @change="checkKhoiLuong(1)"
                                    buttonStyle="solid"
                                >
                                    <a-radio-button value="g"> g </a-radio-button>
                                    <a-radio-button value="kg"> kg </a-radio-button>
                                </a-radio-group>
                                <a-input-number
                                    class="custom-input-number-form no-handler"
                                    :min="0"
                                    :formatter="
                                        updateForm.donViKhoiLuong === 'g' ? formatNumber : undefined
                                    "
                                    :parser="
                                        updateForm.donViKhoiLuong === 'g' ? parseNumber : undefined
                                    "
                                    v-model="updateForm.khoiLuong"
                                    @blur="checkKhoiLuong(0)"
                                    style="width: 100px"
                                />
                            </a-space>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="Tồn kho" prop="tonKho">
                            <a-input-number
                                class="custom-input-number-form"
                                :min="0"
                                :formatter="formatNumber"
                                :parser="parseNumber"
                                v-model="updateForm.tonKho"
                                @blur="checkTonKho()"
                                style="width: 120px"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="Giá bán lẻ" prop="giaBanLe">
                            <a-input-number
                                class="custom-input-number-form no-handler"
                                :min="0"
                                :formatter="formatNumber"
                                :parser="parseNumber"
                                v-model="updateForm.giaBanLe"
                                @blur="checkGiaBanLe()"
                                style="width: 120px"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Ảnh">
                            <a-input
                                v-model="updateForm.anhDaiDien"
                                @click="$event.target.select()"
                            />
                        </a-form-model-item>
                        <div class="text-center mt-3">
                            <img
                                v-if="updateForm.anhDaiDien"
                                :src="updateForm.anhDaiDien"
                                :height="177"
                            />
                            <a-empty
                                :image="simpleImage"
                                description="Không có ảnh"
                                style="padding-top: 32px"
                                v-else
                            />
                        </div>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Mô tả" />
                        <quill-editor
                            v-model="updateForm.moTa"
                            :options="editorOption"
                            class="mb-5"
                            style="height: 200px; margin-top: 1px"
                        />
                    </a-col>
                </a-row>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="updateModalVisible = false">Huỷ</a-button>
                    <a-button type="primary" @click="onUpdate">Lưu</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="addModalVisible" destroyOnClose :width="width < 1200 ? null : 1200">
            <template slot="title">
                <h1 class="title m-0">Thêm mới sản phẩm</h1>
            </template>

            <a-form-model
                :style="{ marginTop: '-12px' }"
                :rules="ruleFormSanPham"
                :model="addForm"
                ref="addForm"
            >
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Tên sản phẩm" prop="ten">
                            <a-input v-model="addForm.ten" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Tên phiên bản" prop="tenPhienBan">
                            <a-input v-model="addForm.tenPhienBan" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Mã SKU" prop="sku">
                            <a-input v-model="addForm.sku" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Nhãn hiệu" prop="nhanHieu">
                            <a-input v-model="addForm.nhanHieu" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Đơn vị" prop="donVi">
                            <a-input v-model="addForm.donVi" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Bảo hành" prop="baoHanh">
                            <a-input v-model="addForm.baoHanh" />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="6">
                        <a-form-model-item label="Áp dụng thuế" prop="name">
                            <a-checkbox v-model="addForm.apDungThue" />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="Khối lượng" prop="thue">
                            <a-space :size="10">
                                <a-radio-group
                                    v-model="addForm.donViKhoiLuong"
                                    @change="checkKhoiLuong(1)"
                                    buttonStyle="solid"
                                >
                                    <a-radio-button value="g"> g </a-radio-button>
                                    <a-radio-button value="kg"> kg </a-radio-button>
                                </a-radio-group>
                                <a-input-number
                                    class="custom-input-number-form no-handler"
                                    :min="0"
                                    :formatter="
                                        addForm.donViKhoiLuong === 'g' ? formatNumber : undefined
                                    "
                                    :parser="
                                        addForm.donViKhoiLuong === 'g' ? parseNumber : undefined
                                    "
                                    v-model="addForm.khoiLuong"
                                    @blur="checkKhoiLuong(0)"
                                    style="width: 100px"
                                />
                            </a-space>
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="Tồn kho" prop="tonKho">
                            <a-input-number
                                class="custom-input-number-form"
                                :min="0"
                                :formatter="formatNumber"
                                :parser="parseNumber"
                                v-model="addForm.tonKho"
                                @blur="checkTonKho()"
                                style="width: 120px"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-model-item label="Giá bán lẻ" prop="giaBanLe">
                            <a-input-number
                                class="custom-input-number-form no-handler"
                                :min="0"
                                :formatter="formatNumber"
                                :parser="parseNumber"
                                v-model="addForm.giaBanLe"
                                @blur="checkGiaBanLe()"
                                style="width: 120px"
                            />
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[30, 6]">
                    <a-col :span="12">
                        <a-form-model-item label="Ảnh" class="d-flex">
                            <a-upload
                                :customRequest="handleUpload"
                                :show-upload-list="false"
                                accept="image/*"
                                class="ml-5"
                                v-model="addForm.anhDaiDien"
                            >
                                <a-button> <a-icon type="upload" /> Thêm ảnh </a-button>
                            </a-upload>
                        </a-form-model-item>
                        <div class="text-center mt-3">
                            <img
                                v-if="addForm.anhDaiDien"
                                :src="addForm.anhDaiDien"
                                :height="177"
                            />
                            <a-empty
                                :image="simpleImage"
                                description="Không có ảnh"
                                style="padding-top: 32px"
                                v-else
                            />
                        </div>
                    </a-col>
                    <a-col :span="12">
                        <a-form-model-item label="Mô tả" />
                        <quill-editor
                            v-model="addForm.moTa"
                            :options="editorOption"
                            class="mb-5"
                            style="height: 200px; margin-top: 1px"
                        />
                    </a-col>
                </a-row>
            </a-form-model>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="addModalVisible = false">Huỷ</a-button>
                    <a-button type="primary" @click="onAdd">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import { quillEditor } from 'vue-quill-editor';
import { mapActions, mapGetters, mapState } from 'vuex';
import { trimObject } from '../../../utils/formUtil';
import { isSubstring } from '../../../utils/stringUtil';
import SanPhamSheet from './SanPhamSheet';
import { columns1, columns2, editorOption, pagination, ruleFormSanPham } from './const';

const BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
    name: 'SanPham',
    components: { SanPhamSheet, quillEditor },
    data() {
        return {
            columns: null,
            pagination,
            search: '',
            uploadModalVisible: false,
            detailsModalVisible: false,
            updateModalVisible: false,
            addModalVisible: false,
            sanPham: {},
            updateForm: {},
            addForm: {},
            editorOption,
            uploadFile: null,
            confirmLoading: false,
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
            modifiable: false,
            ruleFormSanPham
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('sanPham', ['listSanPham']),
        ...mapGetters('account', ['permissions']),
        dataSource() {
            return this.listSanPham.filter((item) =>
                [item.ten, item.nhanHieu, item.tenPhienBan, item.sku].find((i) =>
                    typeof i === 'string' ? isSubstring(this.search, i) : false
                )
            );
        }
    },
    watch: {
        width(newVal) {
            this.columns = newVal < 1637 ? columns2 : columns1;
        },
        dataSource(value) {
            this.pagination.total = value.length;
        }
    },
    methods: {
        moment,
        ...mapActions('sanPham', [
            'importSanPham',
            'updateSanPham',
            'getListSanPham',
            'saveSanPham',
            'deleteSanPham',
            'uploadHinhAnh'
        ]),
        async getData() {
            await this.getListSanPham();
        },
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
        rowClassName: () => 'clickable-row',
        customRow(record) {
            return {
                on: {
                    click: () => {
                        this.showDetailsModal(record);
                    }
                }
            };
        },
        showUploadModal() {
            this.uploadModalVisible = true;
        },
        showDetailsModal(record) {
            this.sanPham = record;
            this.detailsModalVisible = true;
        },
        hideDetailsModal() {
            this.detailsModalVisible = false;
        },
        customRequest(request) {
            this.uploadFile = request.file;
        },
        async createUploadRequest() {
            if (this.uploadFile) {
                this.confirmLoading = true;
                try {
                    const formData = new FormData();
                    formData.append('file', this.uploadFile);
                    await this.importSanPham(formData);
                    this.$refs.searchInput.$refs.input.$data.stateValue = '';
                    this.pagination.pageSize = 50;
                    this.pagination.current = 1;
                    this.search = '';
                    this.getData();
                    this.uploadModalVisible = false;
                    this.$notification['success']({
                        message: 'Tải file lên thành công'
                    });
                    this.uploadFile = null;
                } catch (error) {
                    this.confirmLoading = false;
                    this.$notification['error']({
                        message: 'Tải file lên không thành công'
                    });
                }
            } else {
                this.$notification['error']({
                    message: 'Chưa có file nào được chọn'
                });
            }
        },
        cancelUploadRequest() {
            this.uploadFile = null;
        },
        wrapContent(str) {
            return str.slice(0, 33) + '...';
        },
        onSearch(value) {
            this.search = value;
            this.pagination.current = 1;
        },
        formatNumber(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        parseNumber(str) {
            const number = parseInt(str.replace(/(,*)/g, ''));
            return isNaN(number) ? '' : number;
        },
        checkKhoiLuong(reset) {
            if (reset || this.updateForm.khoiLuong === null) this.updateForm.khoiLuong = 0;
        },
        checkTonKho() {
            if (this.updateForm.tonKho === null) this.updateForm.tonKho = 0;
        },
        checkGiaBanLe() {
            if (this.updateForm.giaBanLe === null) this.updateForm.giaBanLe = 0;
        },
        async onUpdate() {
            try {
                trimObject(this.updateForm);
                await this.updateSanPham(this.updateForm);
                await this.getListSanPham();
                this.sanPham = this.listSanPham.find((item) => item.id === this.sanPham.id);
                this.updateModalVisible = false;
                this.$notification['success']({
                    message: 'Cập nhật sản phẩm thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Cập nhật sản phẩm không thành công'
                });
            }
        },
        showAddModal() {
            this.addForm = {
                ten: '',
                moTa: '',
                nhanHieu: '',
                baoHanh: '',
                tenPhienBan: '',
                sku: '',
                khoiLuong: '',
                donViKhoiLuong: '',
                anhDaiDien: '',
                donVi: '',
                apDungThue: false,
                tonKho: '',
                giaBanLe: ''
            };
            this.addModalVisible = true;
        },
        async onAdd() {
            try {
                trimObject(this.addForm);
                await this.saveSanPham(this.addForm);
                await this.getListSanPham();
                this.addModalVisible = false;
                this.$notification['success']({
                    message: 'Thêm sản phẩm thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Thêm sản phẩm không thành công'
                });
            }
        },
        async onDelete(id) {
            try {
                await this.deleteSanPham(id);
                await this.getListSanPham();
                this.detailsModalVisible = false;
                this.$notification['success']({
                    message: 'Xoá sản phẩm thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá sản phẩm không thành công'
                });
            }
        },
        async handleUpload(request) {
            let fd = new FormData();
            fd.append('file', request.file);
            const data = await this.uploadHinhAnh(fd);
            this.addForm.anhDaiDien = `${
                BASE_URL.includes('http') ? '' : window.location.origin
            }${BASE_URL}/images/${await data.uid}`;
        }
    },
    async mounted() {
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.width < 1637 ? columns2 : columns1;
    }
};
</script>

<style lang="less" scoped>
.upload-area {
    width: 80%;
    margin: auto;
    padding: 15px 50px;
    margin-bottom: 50px;
    border: 1px dashed #b9b9b9;
    border-radius: 12px;
    text-align: center;
    background-color: #f2f2f2fb;
    svg {
        display: block;
        margin: auto;
        margin-bottom: 8px;
    }
    a {
        text-decoration: underline;
        color: #188038;
    }
}
.upload-list {
    position: absolute;
    bottom: 68px;
    left: 103px;
    width: 320px;
    svg {
        margin-top: 5px;
    }
}
.btn-delete {
    margin-left: 10px;
    &:hover {
        color: red;
        border-color: red;
    }
}
.input-search {
    width: 300px;
    z-index: 1;
}
@media screen and (max-width: 768px) {
    .input-search {
        width: 100%;
        z-index: 1;
    }
}
</style>
