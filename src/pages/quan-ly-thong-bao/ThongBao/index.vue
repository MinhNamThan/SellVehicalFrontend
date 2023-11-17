<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <a-row :class="modifiable ? 'mb-2' : null">
            <a-col :xs="24" :sm="24" :md="8">
                <h1 class="title">Danh sách thông báo</h1>
            </a-col>
            <a-col v-if="modifiable">
                <a-button
                    icon="plus"
                    :style="{
                        marginTop: '-2px'
                    }"
                    class="float-md-right"
                    type="primary"
                    @click="showAddModal"
                >
                    Tạo thông báo
                </a-button>
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
                        v-model="search"
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
            :columns="columns"
            :rowKey="(r, i) => i"
            :rowClassName="rowClassName"
            :customRow="customRow"
            :dataSource="listThongBao"
            :pagination="pagination"
            @change="handleTableChange"
            :scroll="width < 1280 ? { x: 1000, y: height * 0.636 } : { y: height * 0.636 }"
        >
            <template slot="no" slot-scope="text, record, index">
                {{ getIndex(index) }}
            </template>
            <template slot="content" slot-scope="text">
                <div class="content-wrap">{{ text }}</div>
            </template>
            <template slot="type" slot-scope="text">
                <span>{{ mapTypeNoti(text) }}</span>
            </template>
            <template slot="send_to" slot-scope="text, record">
                <span v-if="!record.sendAll">
                    <span v-for="(group, index) in text" :key="index">
                        <a-tag class="mb-2" :color="mapToTypeColor(group)">{{
                            mapCustomerGroup(group)
                        }}</a-tag>
                    </span>
                </span>
                <span v-else><a-tag color="#8957e5">Tất cả</a-tag></span>
            </template>
            <template slot="send_time" slot-scope="text, record">
                {{
                    moment(record.status === 'SENT' ? record.updatedAt : record.schedule).format(
                        'DD/MM/YYYY HH:mm:ss'
                    )
                }}
            </template>
            <template slot="status" slot-scope="text">
                {{ mapStatusNoti(text) }}
            </template>
            <template slot="action" slot-scope="text, record">
                <a-popconfirm
                    title="Bạn có chắc chắn muốn xoá thông báo này không?"
                    @confirm="onDelete(record)"
                >
                    <a-tooltip title="Xoá thông báo">
                        <a-button shape="circle" icon="delete" type="danger" @click.stop />
                    </a-tooltip>
                </a-popconfirm>
            </template>
        </a-table>

        <a-modal
            v-model="infoModalVisible"
            destroyOnClose
            :width="width < 1200 ? null : 1200"
            v-if="formDetail.id"
        >
            <template slot="title">
                <h1 class="title m-0">Chi tiết thông báo</h1>
            </template>

            <a-row type="flex" align="middle">
                <a-col :span="width < 1200 ? 24 : 6" :class="width < 1200 ? 'mb-4' : null">
                    <img v-if="formDetail.image" :src="formDetail.image" :width="240" />
                    <a-empty :image="simpleImage" description="Không có ảnh" v-else />
                </a-col>
                <a-col :span="width < 1200 ? 24 : 18">
                    <a-descriptions :column="1" bordered>
                        <a-descriptions-item label="Gửi đến">
                            <span v-if="!formDetail.sendAll">
                                <a-tag
                                    v-for="(group, index) in formDetail.customerGroups"
                                    :key="index"
                                    class="m-1"
                                    :color="mapToTypeColor(group)"
                                >
                                    {{ mapCustomerGroup(group) }}
                                </a-tag>
                            </span>
                            <span v-else><a-tag color="#8957e5">Tất cả</a-tag></span>
                        </a-descriptions-item>
                        <a-descriptions-item label="Loại thông báo">
                            {{ mapTypeNoti(formDetail.type) }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Tiêu đề">
                            {{ formDetail.title }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Nội dung">
                            <div style="white-space: pre-wrap">{{ formDetail.content }}</div>
                        </a-descriptions-item>
                        <a-descriptions-item label="Thời gian gửi">
                            {{
                                moment(
                                    formDetail.status === 'SENT'
                                        ? formDetail.updatedAt
                                        : formDetail.schedule
                                ).format('DD/MM/YYYY HH:mm:ss')
                            }}
                        </a-descriptions-item>
                        <a-descriptions-item label="Trạng thái" v-if="!modifiable">
                            {{ mapStatusNoti(formDetail.status) }}
                        </a-descriptions-item>
                    </a-descriptions>
                </a-col>
            </a-row>

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button key="back" @click="infoModalVisible = false">Đóng</a-button>
                </div>
            </template>
        </a-modal>

        <a-modal v-model="addModalVisible" destroyOnClose :width="650">
            <template slot="title">
                <h1 class="title m-0">
                    {{ formDetail.id ? 'Chỉnh sửa thông báo' : 'Tạo thông báo' }}
                </h1>
            </template>

            <ThongBaoForm
                :formDetail="formDetail"
                @reset-search="search = ''"
                @after-save="afterSave"
                ref="ThongBaoForm"
            />

            <template slot="footer">
                <div class="mx-2 my-1">
                    <a-button key="back" @click="hideAddModal">Hủy</a-button>
                    <a-button type="primary" key="submit" @click="onCreate">Lưu</a-button>
                </div>
            </template>
        </a-modal>
    </a-card>
</template>

<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import { mapActions, mapGetters, mapState } from 'vuex';
import ThongBaoForm from './ThongBaoForm';
import {
    columns1,
    columns2,
    listStatusNoti,
    listTypeNoti,
    mapColorTagType,
    pagination
} from './const';

export default {
    name: 'ThongBao',
    components: { ThongBaoForm },
    data() {
        return {
            columns: null,
            pagination,
            search: '',
            infoModalVisible: false,
            addModalVisible: false,
            formDetail: {},
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
            modifiable: false
        };
    },
    computed: {
        ...mapState('window', ['width', 'height']),
        ...mapState('thongBao', ['listThongBao', 'metaData']),
        ...mapState('nhomKhachHang', ['listNhomKhachHang']),
        ...mapGetters('account', ['permissions'])
    },
    watch: {
        width(newVal) {
            this.columns = this.modifiable
                ? newVal < 1672
                    ? columns2
                    : columns1
                : newVal < 1672
                ? columns2.slice(0, -1)
                : columns1.slice(0, -1);
        }
    },
    methods: {
        moment,
        ...mapActions('thongBao', ['getListThongBao', 'deleteThongBao']),
        ...mapActions('nhomKhachHang', ['getListNhomKhachHang']),
        async getData() {
            await this.getListThongBao({
                per: this.pagination.pageSize,
                page: this.pagination.current,
                search: this.search
            });
            this.pagination.total = this.metaData.total;
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
        rowClassName: () => 'clickable-row',
        customRow(record) {
            return {
                on: {
                    click: () => {
                        this.formDetail = JSON.parse(JSON.stringify(record));
                        this.formDetail.schedule = moment(this.formDetail.schedule);
                        if (!this.modifiable || record.status === 'SENT')
                            this.infoModalVisible = true;
                        else this.addModalVisible = true;
                    }
                }
            };
        },
        async handleTableChange(pagination) {
            this.pagination.current = pagination.current;
            this.pagination.pageSize = pagination.pageSize;
            await this.getData();
        },
        showAddModal() {
            this.formDetail = { sendAll: true, image: null };
            this.addModalVisible = true;
        },
        hideAddModal() {
            this.addModalVisible = false;
        },
        mapTypeNoti(key) {
            return listTypeNoti.find((item) => item.value === key).name;
        },
        mapCustomerGroup(group) {
            if (group) {
                return this.listNhomKhachHang.filter((e) => e.id === group)[0].name;
            } else return 'Tất cả';
        },
        mapToTypeColor(group) {
            let type = this.listNhomKhachHang.filter((e) => e.id === group)[0].type;
            return mapColorTagType.find((item) => item.name === type).color;
        },
        mapStatusNoti(key) {
            return listStatusNoti.find((item) => item.value === key).name;
        },
        async onSearch() {
            this.pagination.current = 1;
            await this.getData();
        },
        onCreate() {
            this.$refs.ThongBaoForm.onCreate();
        },
        async onDelete(item) {
            try {
                await this.deleteThongBao(item.id);
                await this.getData();
                this.$notification['success']({
                    message: 'Xoá thông báo thành công'
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xoá thông báo không thành công'
                });
            }
        },
        async afterSave() {
            await this.getData();
            this.addModalVisible = false;
        }
    },
    async mounted() {
        await this.getListNhomKhachHang();
        await this.getData();
        this.modifiable = this.permissions[this.$route.meta.authority.permission].modify;
        this.columns = this.modifiable
            ? this.width < 1672
                ? columns2
                : columns1
            : this.width < 1672
            ? columns2.slice(0, -1)
            : columns1.slice(0, -1);
    }
};
</script>

<style scoped>
.input-search {
    width: 300px;
}
@media screen and (max-width: 768px) {
    .input-search {
        width: 100%;
        z-index: 1;
    }
}
.content-wrap {
    white-space: pre-wrap;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
