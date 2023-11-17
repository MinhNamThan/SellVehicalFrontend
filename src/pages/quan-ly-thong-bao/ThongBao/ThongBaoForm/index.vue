<template>
    <a-form-model
        :model="form"
        :rules="rules"
        ref="form"
        :style="{ marginTop: '-12px', marginBottom: '-20px' }"
    >
        <a-row>
            <a-col :span="12">
                <a-form-model-item label="Phương thức gửi" prop="sendAll">
                    <a-radio-group v-model="form.sendAll">
                        <a-radio class="radio" :value="true">Tất cả</a-radio>
                        <a-radio class="radio" :value="false">Nhóm</a-radio>
                    </a-radio-group>
                </a-form-model-item>
            </a-col>
            <a-col :span="12">
                <a-form-model-item label="Loại thông báo" prop="type">
                    <a-select v-model="form.type">
                        <a-select-option
                            v-for="(type, index) in listTypeNoti"
                            :key="index"
                            :value="type.value"
                        >
                            {{ type.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
            </a-col>
        </a-row>
        <a-form-model-item label="Gửi đến" prop="customerGroups" v-if="!sendAll">
            <a-select
                allow-clear
                showSearch
                :filterOption="filterOption"
                mode="multiple"
                v-model="form.customerGroups"
                option-label-prop="label"
            >
                <a-select-option
                    v-for="(group, index) in listNhomKhachHang"
                    :key="index"
                    :value="group.id"
                    :label="group.name"
                >
                    <a-tag :color="mapTagColor(group.type)" class="m-0">
                        {{ group.name }}
                    </a-tag>
                </a-select-option>
            </a-select>
        </a-form-model-item>
        <a-form-model-item label="Tiêu đề" prop="title">
            <a-input v-model="form.title" />
        </a-form-model-item>
        <a-form-model-item label="Nội dung" prop="content">
            <a-textarea v-model="form.content" autoSize />
        </a-form-model-item>
        <a-row class="mt-1">
            <a-col :span="12">
                <a-form-model-item label="Hình ảnh" prop="image">
                    <a-upload
                        :customRequest="handleUpload"
                        :before-upload="beforeUpload"
                        list-type="picture-card"
                        :show-upload-list="false"
                        accept="image/*"
                        class="mt-2"
                    >
                        <div v-if="form.image" :style="{ position: 'relative' }">
                            <div class="float-right">
                                <a-button
                                    size="small"
                                    shape="circle"
                                    icon="close"
                                    type="danger"
                                    :style="{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0
                                    }"
                                    @click.stop="form.image = null"
                                >
                                </a-button>
                            </div>
                            <img :src="form.image" width="150px" class="p-2" />
                        </div>
                        <div v-else class="ant-upload-text">Upload</div>
                    </a-upload>
                </a-form-model-item>
            </a-col>
            <a-col :span="12">
                <a-form-model-item label="Thời gian gửi" prop="status">
                    <a-select v-model="form.status" class="mt-2">
                        <a-select-option
                            v-for="(status, index) in listStatusNoti"
                            :key="index"
                            :value="status.value"
                        >
                            {{ status.name }}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item prop="schedule" v-if="formDetail.status === 'SCHEDULED'">
                    <a-date-picker
                        v-model="form.schedule"
                        :disabled-date="disabledDate"
                        show-time
                        format="DD/MM/YYYY HH:mm:ss"
                        class="mt-3"
                        :style="{ width: '100%' }"
                    />
                </a-form-model-item>
            </a-col>
        </a-row>
    </a-form-model>
</template>

<script>
import { rules, mapColorTagType, listTypeNoti, listStatusNoti } from './const';
import { mapActions, mapState } from 'vuex';
import moment from 'moment';
import { trimObject } from '../../../../utils/formUtil';
import { isSubstring } from '../../../../utils/stringUtil';

const BASE_URL = process.env.VUE_APP_API_BASE_URL;

export default {
    name: 'ChiTietThongBao',
    props: ['formDetail'],
    data() {
        return {
            form: this.formDetail,
            rules,
            listTypeNoti,
            listStatusNoti
        };
    },
    computed: {
        ...mapState('nhomKhachHang', ['listNhomKhachHang']),
        sendAll() {
            return this.form.sendAll;
        },
        customerGroups() {
            return this.form.customerGroups;
        }
    },
    watch: {
        async sendAll(newVal) {
            if (newVal === false) {
                await this.fillTagColor();
            }
        },
        async customerGroups(newVal, oldVal) {
            if (!oldVal || newVal.length > oldVal.length) {
                await this.fillTagColor(newVal.length - 1);
            }
        }
    },
    methods: {
        moment,
        ...mapActions('thongBao', ['saveThongBao', 'updateThongBao', 'uploadHinhAnh']),
        mapTagColor(type) {
            return mapColorTagType.find((item) => item.name === type).color;
        },
        async fillTagColor(lastIndex) {
            await this.$nextTick();
            const tagList = this.$el.querySelectorAll('.ant-select-selection__choice.zoom-enter');
            if (lastIndex) {
                const lastTag = tagList[0];
                const lastTagType = this.listNhomKhachHang
                    .find((item) => item.id === this.customerGroups[lastIndex])
                    .type.toLowerCase();
                lastTag.className =
                    lastTag.className + ` ant-tag ant-tag-has-color tag-${lastTagType}`;
            } else {
                tagList.forEach((item, index) => {
                    const tagType = this.listNhomKhachHang
                        .find((i) => i.id === this.customerGroups[index])
                        .type.toLowerCase();
                    item.className = item.className + ` ant-tag ant-tag-has-color tag-${tagType}`;
                });
            }
        },
        filterOption(inputValue, option) {
            return isSubstring(
                inputValue,
                option.componentOptions.children[0].componentOptions.children[0].text
            );
        },
        disabledDate(value) {
            return value.valueOf() < moment().startOf('days');
        },
        beforeUpload(file) {
            const isSmall800KB = file.size / 1024 < 800;
            if (!isSmall800KB) {
                this.$notification['error']({
                    message: 'Tệp ảnh phải nhỏ hơn 800KB'
                });
            }
            return isSmall800KB;
        },
        async handleUpload(request) {
            let fd = new FormData();
            fd.append('file', request.file);
            const data = await this.uploadHinhAnh(fd);
            this.form.image = `${
                BASE_URL.includes('http') ? '' : window.location.origin
            }${BASE_URL}/images/${data.uid}`;
        },
        onCreate() {
            this.$refs.form.validate(async (valid) => {
                if (!valid) return;
                if (
                    this.form.status === 'SCHEDULED' &&
                    moment(this.form.schedule).valueOf() < moment().valueOf()
                ) {
                    this.$notification['warning']({
                        message: 'Vui lòng chọn thời điểm sau thời điểm hiện tại'
                    });
                    return;
                }

                try {
                    if (this.form.sendAll) this.form.customerGroups = [];
                    if (this.form.status === 'SENT') this.form.schedule = null;
                    trimObject(this.form);
                    if (this.form.id) await this.updateThongBao(this.form);
                    else {
                        await this.saveThongBao(this.form);
                        this.$emit('reset-search');
                    }
                    this.$emit('after-save');
                    this.$notification['success']({
                        message: this.form.id
                            ? 'Cập nhật thông báo thành công'
                            : 'Tạo thông báo thành công'
                    });
                } catch (error) {
                    this.$notification['error']({
                        message: this.form.id
                            ? 'Cập nhật thông báo không thành công'
                            : 'Tạo thông báo không thành công'
                    });
                }
            });
        }
    },
    async mounted() {
        if (!this.sendAll) {
            await this.fillTagColor();
        }
    }
};
</script>

<style scoped>
.radio {
    display: block;
    height: 25px;
    line-height: 25px;
}
</style>
