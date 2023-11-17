<template>
    <a-row>
        <a-col :sm="12">
            <a-space>
                <a-button
                    icon="file-pdf"
                    class="btn-pdf btn-rounded px-2 px-md-3"
                    @click="$emit('exportPdf')"
                >
                    Tải xuống file pdf
                </a-button>
                <a-button
                    icon="file-excel"
                    class="btn-excel btn-rounded px-2 px-md-3"
                    @click="$emit('exportExcel')"
                >
                    Tải xuống file excel
                </a-button>
            </a-space>
        </a-col>
        <a-col>
            <a-space class="float-sm-right mt-1 mt-sm-0">
                <a-button
                    icon="close"
                    class="btn bg-red btn-rounded px-2 px-md-3"
                    type="link"
                    @click="$emit('reject')"
                    v-if="status === undefined"
                >
                    Từ chối
                </a-button>
                <a-button
                    icon="check"
                    class="btn bg-green btn-rounded px-2 px-md-3"
                    type="link"
                    @click="$emit('accept')"
                    v-if="status === undefined"
                >
                    Đồng ý
                </a-button>
                <a-button
                    icon="check"
                    class="status-agree btn-rounded px-2 px-md-3"
                    v-if="status === true"
                >
                    Đã đồng ý
                </a-button>
                <a-button
                    icon="close"
                    class="status-disagree btn-rounded px-2 px-md-3"
                    v-if="status === false"
                >
                    Đã từ chối
                </a-button>
                <a-button
                    icon="clock-circle"
                    class="btn-rounded px-2 px-md-3"
                    v-if="status === null"
                >
                    Đã hết hạn
                </a-button>
            </a-space>
        </a-col>
    </a-row>
</template>

<script>
export default {
    name: 'Buttons',
    props: ['status']
};
</script>

<style lang="less" scoped>
.btn-pdf {
    &:hover {
        color: #ff545f;
        border-color: #ff545f;
    }
    &:focus {
        color: #ff545f;
        border-color: #ff545f;
    }
}
.btn-excel {
    &:hover {
        color: #2ac782;
        border-color: #2ac782;
    }
    &:focus {
        color: #2ac782;
        border-color: #2ac782;
    }
}
.btn-rounded {
    border-radius: 50px;
}
.status-disagree {
    color: #ff545f;
    border-color: #ff545f;
}
.status-agree {
    color: #2ac782;
    border-color: #2ac782;
}
.bg-green {
    background-color: #2ac782 !important;
}
.bg-red {
    background-color: #ff545f !important;
}
</style>
