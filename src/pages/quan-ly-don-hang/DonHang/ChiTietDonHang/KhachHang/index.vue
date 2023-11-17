<template>
    <div class="mt-4" :style="responsive ? {} : { width: '694px' }">
        <h2 class="mb-3" :style="{ fontSize: '18px' }">Thông tin khách hàng</h2>
        <a-dropdown
            :trigger="['click']"
            :visible="dropdownVisible"
            @visibleChange="handleDropdownVisibleChange"
            v-if="permission.modifiable && !khachHangMuaHang.name"
        >
            <div @mouseover="mouseOntoSearchInput = true" @mouseout="mouseOntoSearchInput = false">
                <a-input-search
                    ref="searchInput"
                    placeholder="Nhập tên khách hàng hoặc SĐT..."
                    class="input-search"
                    :style="responsive ? {} : { width: '694px' }"
                    @change="searchKhachHang"
                    allowClear
                />
            </div>
            <template slot="overlay">
                <a-menu
                    class="dropdown-menu"
                    :style="responsive ? {} : { width: '694px' }"
                    @click="addKhachHang"
                >
                    <a-menu-item class="p-0">
                        <div @click.stop="showAddModal" :style="{ padding: '5px 12px' }">
                            <a-button size="large" type="link">
                                <a-space :size="36">
                                    <a-icon
                                        style="margin-top: 6px"
                                        class="mr-n4 mr-sm-0"
                                        type="plus"
                                    />
                                    <span style="font-size: 14px; font-weight: 500"
                                        >Thêm mới khách hàng</span
                                    >
                                </a-space>
                            </a-button>
                        </div>
                    </a-menu-item>
                    <a-menu-item v-for="(item, index) in listKhachMuaHang" :key="index">
                        <a-row type="flex" align="middle" :gutter="24">
                            <a-col :span="3" class="ml-md-2">
                                <a-avatar icon="user" />
                            </a-col>
                            <a-col :span="18" class="ml-1">
                                <h4 class="mb-0">{{ item.name }}</h4>
                                <p class="mb-0">{{ item.mobile }}</p>
                            </a-col>
                            <a-col :span="2">
                                <div class="float-right">
                                    <a-tooltip title="Chỉnh sửa thông tin">
                                        <a-button
                                            size="small"
                                            shape="circle"
                                            icon="form"
                                            class="bg bg-green mr-2"
                                            type="link"
                                            @click.stop="showUpdateModal(item)"
                                        />
                                    </a-tooltip>
                                    <a-popconfirm
                                        title="Bạn có chắc chắn muốn xoá khách hàng này không?"
                                        @confirm="onDelete(item.id)"
                                    >
                                        <a-tooltip title="Xoá khách hàng">
                                            <a-button
                                                size="small"
                                                shape="circle"
                                                icon="delete"
                                                type="danger"
                                                @click.stop
                                            />
                                        </a-tooltip>
                                    </a-popconfirm>
                                </div>
                            </a-col>
                        </a-row>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <div class="card my-3" v-if="khachHangMuaHang.name">
            <a-row :gutter="16">
                <a-col :xs="8" :sm="8" :md="6">
                    <h4>Tên khách hàng</h4>
                </a-col>
                <a-col :xs="11" :sm="12" :md="15">
                    <p>{{ khachHangMuaHang.name }}</p>
                </a-col>
                <a-col :xs="5" :sm="4" :ms="3">
                    <div
                        class="float-right"
                        :style="{ marginTop: '-3px', marginRight: '-5px' }"
                        v-if="permission.modifiable"
                    >
                        <a-tooltip title="Chỉnh sửa thông tin">
                            <a-button
                                size="small"
                                shape="circle"
                                icon="form"
                                class="bg bg-green mr-md-1"
                                type="link"
                                @click="showUpdateModal(khachHangMuaHang)"
                            />
                        </a-tooltip>
                        <a-tooltip title="Xoá khách hàng">
                            <a-button
                                size="small"
                                shape="circle"
                                icon="close"
                                type="danger"
                                @click="deleteKhachHang"
                            />
                        </a-tooltip>
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="8" :sm="8" :md="6">
                    <h4>Số điện thoại</h4>
                </a-col>
                <a-col :xs="16" :sm="16" :md="18">
                    <p>
                        {{
                            khachHangMuaHang.mobile ? khachHangMuaHang.mobile : 'Chưa có thông tin'
                        }}
                    </p>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="8" :sm="8" :md="6">
                    <h4>Facebook</h4>
                </a-col>
                <a-col :xs="16" :sm="16" :md="18">
                    <p>
                        <a
                            :href="khachHangMuaHang.facebook"
                            target="_blank"
                            class="link"
                            v-if="khachHangMuaHang.facebook"
                        >
                            {{ baoGia.khachHang.facebook }}
                        </a>
                        <span v-else>Chưa có thông tin</span>
                    </p>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="8" :sm="8" :md="6">
                    <h4>Địa chỉ</h4>
                </a-col>
                <a-col :xs="16" :sm="16" :md="18">
                    <p>
                        {{
                            khachHangMuaHang.address
                                ? khachHangMuaHang.address
                                : 'Chưa có thông tin'
                        }}
                    </p>
                </a-col>
            </a-row>
            <a-row :gutter="16">
                <a-col :xs="8" :sm="8" :md="6">
                    <h4>Ghi chú</h4>
                </a-col>
                <a-col :xs="16" :sm="16" :md="18">
                    <p class="mb-0">
                        {{ khachHangMuaHang.note ? khachHangMuaHang.note : 'Chưa có ghi chú' }}
                    </p>
                </a-col>
            </a-row>
        </div>
        <div v-if="!khachHangMuaHang.name" class="card my-3">
            <a-empty :image="simpleImage" description="Trống" style="margin: 25px" />
        </div>
        <a-modal v-model="modalVisible" destroyOnClose :width="500">
            <template slot="title">
                <h1 class="title m-0">
                    {{ form.id ? 'Chỉnh sửa thông tin khách hàng' : 'Thêm mới khách hàng' }}
                </h1>
            </template>
            <a-form-model
                :style="{ marginTop: '-12px' }"
                :model="form"
                :rules="formRules"
                ref="form"
            >
                <a-form-model-item label="Tên khách hàng" prop="name">
                    <a-input v-model="form.name" />
                </a-form-model-item>
                <a-form-model-item label="Địa chỉ" prop="address">
                    <a-input v-model="form.address" />
                </a-form-model-item>
                <a-form-model-item label="Số điện thoại" prop="mobile">
                    <a-input v-model="form.mobile" />
                </a-form-model-item>
                <a-form-model-item label="Facebook" prop="facebook">
                    <a-input v-model="form.facebook" />
                </a-form-model-item>
                <a-form-model-item label="Ghi chú" prop="note">
                    <a-textarea v-model="form.note" />
                </a-form-model-item>
            </a-form-model>
            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button @click="hideModal">Huỷ</a-button>
                    <a-button type="primary" @click="onSave">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { Empty } from 'ant-design-vue';
import { formRules } from './const';
import { trimObject } from '../../../../../utils/formUtil';
export default {
    props: ['responsive'],
    inject: ['permission'],
    data() {
        return {
            form: {},
            formRules,
            modalVisible: false,
            dropdownVisible: false,
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
        };
    },
    computed: {
        ...mapState('khachMuaHang', ['listKhachMuaHang']),
        ...mapState('donHang', ['donHang']),
        khachHangMuaHang() {
            return this.donHang.khachHang;
        }
    },
    methods: {
        ...mapActions('khachMuaHang', [
            'saveKhachMuaHang',
            'updateKhachMuaHang',
            'getListKhachMuaHang',
            'deleteKhachMuaHang'
        ]),
        ...mapActions('donHang', ['addKhachHangMuaHang', 'deleteKhachHangMuaHang']),
        searchKhachHang() {
            setTimeout(async () => {
                this.search = this.$refs.searchInput.$refs.input.$data.stateValue;
                await this.getListKhachMuaHang(this.search);
            }, 300);
        },
        handleDropdownVisibleChange(visible) {
            if (!visible && this.mouseOntoSearchInput) this.dropdownVisible = true;
            else this.dropdownVisible = visible;
        },
        showAddModal() {
            this.dropdownVisible = false;
            this.form = {};
            this.modalVisible = true;
        },
        showUpdateModal(item) {
            this.dropdownVisible = false;
            this.form = JSON.parse(JSON.stringify(item));
            this.modalVisible = true;
        },
        hideModal() {
            this.modalVisible = false;
        },
        addKhachHang({ item }) {
            const khachHang = this.listKhachMuaHang[item.index - 1];
            this.addKhachHangMuaHang(khachHang);
            this.$notification['success']({
                message: 'Thêm khách hàng thành công'
            });
            this.dropdownVisible = false;
        },
        onSave() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                try {
                    trimObject(this.form);
                    if (this.form.id) await this.updateKhachMuaHang(this.form);
                    else await this.saveKhachMuaHang(this.form);
                    await this.getListKhachMuaHang(this.search);
                    this.modalVisible = false;
                    this.$notification['success']({
                        message: this.form.id
                            ? 'Cập nhật khách hàng thành công'
                            : 'Thêm mới khách hàng thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: this.form.id
                            ? 'Cập nhật khách hàng không thành công'
                            : 'Thêm mới khách hàng không thành công'
                    });
                }
            });
        },
        async onDelete(id) {
            try {
                await this.deleteKhachMuaHang(id);
                await this.getListKhachMuaHang(this.search);
                this.$notification['success']({
                    message: 'Xoá khách hàng thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá khách hàng không thành công do khách hàng có báo giá'
                });
            }
        },
        deleteKhachHang() {
            this.deleteKhachHangMuaHang();
            this.$notification['success']({
                message: 'Xóa khách hàng thành công'
            });
        }
    },
    async mounted() {
        await this.getListKhachMuaHang(this.search);
    }
};
</script>

<style lang="less" scoped>
.input-search {
    z-index: 1;
}
.dropdown-menu {
    padding: 0;
    max-height: 320px;
    overflow: auto;
}
.card {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    &:hover {
        border: 1px solid #7cc0ff;
    }
    padding: 12px;
}
.link {
    word-break: break-word;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    &:hover {
        color: #1890ff;
    }
}
</style>
