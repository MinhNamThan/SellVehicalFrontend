<template>
    <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
        <h1 class="title">Báo cáo thống kê</h1>
        <h2 class="mb-3" :style="{ fontSize: '18px' }">Báo cáo thiết bị đang kết nối</h2>
        <a-row>
            <a-col :span="width < 1280 ? 24 : 4">
                <a-form-model :class="width < 1280 ? '' : 'mt-2'">
                    <a-form-model-item label="Lựa chọn nhanh">
                        <a-select
                            allow-clear
                            v-model="range"
                            @change="setRange"
                            :style="{ width: '195px' }"
                        >
                            <a-select-option
                                v-for="(range, index) in ranges"
                                :key="index"
                                :value="index"
                            >
                                {{ range.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="Từ">
                        <a-date-picker
                            v-model="from"
                            :disabled-date="disabledStartDate"
                            show-time
                            format="DD/MM/YYYY HH:mm:ss"
                            @change="range = null"
                        />
                    </a-form-model-item>
                    <a-form-model-item label="Đến">
                        <a-date-picker
                            v-model="to"
                            :disabled-date="disabledEndDate"
                            show-time
                            format="DD/MM/YYYY HH:mm:ss"
                            @change="range = null"
                        />
                    </a-form-model-item>
                    <a-button
                        icon="line-chart"
                        class="mt-4 px-2"
                        :style="{ width: '195px' }"
                        type="primary"
                        @click="showStatistics"
                    >
                        Hiển thị thống kê
                    </a-button>
                </a-form-model>
            </a-col>
            <a-col
                :span="width < 1336 ? (width < 1280 ? 24 : 18) : 19"
                :offset="width < 1336 ? (width < 1280 ? 0 : 2) : 1"
                :class="width < 1280 ? 'mt-4' : ''"
            >
                <div id="chart" v-show="series.length !== 0">
                    <apexchart
                        type="line"
                        height="350"
                        ref="chart"
                        :options="chartOptions"
                        :series="series"
                    ></apexchart>
                </div>
                <div
                    class="card mt-3"
                    :style="{
                        width: '91%',
                        height: '318px',
                        marginLeft: '52px',
                        marginBottom: '30px'
                    }"
                    v-show="series.length === 0"
                >
                    <a-empty
                        :image="simpleImage"
                        description="Không có dữ liệu"
                        :style="{ marginTop: '120px' }"
                    />
                </div>
            </a-col>
        </a-row>
    </a-card>
</template>

<script>
import { Empty } from 'ant-design-vue';
import moment from 'moment';
import VueApexCharts from 'vue-apexcharts';
import { mapActions, mapState } from 'vuex';
import { chartOptions, ranges } from './const';

export default {
    name: 'ThongKe',
    components: { apexchart: VueApexCharts },
    data() {
        return {
            ranges,
            range: null,
            from: null,
            to: null,
            chartOptions,
            series: [],
            simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
        };
    },
    computed: {
        ...mapState('window', ['width']),
        ...mapState('thongKe', ['listThongKe'])
    },
    methods: {
        ...mapActions('thongKe', ['getListThongKe']),
        setRange(range) {
            if (range === undefined) {
                this.from = this.to = null;
                return;
            }

            this.to = moment();
            this.from = moment().subtract(ranges[range].value, ranges[range].unit);
        },
        disabledStartDate(startValue) {
            const endValue = this.to;
            if (!startValue || !endValue) {
                return false;
            }
            return startValue.valueOf() > endValue.valueOf();
        },
        disabledEndDate(endValue) {
            const startValue = this.from;
            if (!endValue || !startValue) {
                return false;
            }
            return startValue.valueOf() >= endValue.valueOf();
        },
        async showStatistics() {
            if (!this.from) {
                this.$notification['warning']({
                    message: 'Vui lòng chọn thời điểm đầu'
                });
                return;
            } else if (!this.to) {
                this.$notification['warning']({
                    message: 'Vui lòng chọn thời điểm cuối'
                });
                return;
            }

            await this.getListThongKe({
                from: this.from.toISOString(),
                to: this.to.toISOString()
            });
            if (this.listThongKe.length !== 0) {
                const gatewayList = [];
                const userList = [];
                let minGateway = this.listThongKe[0].gateway;
                let minUser = this.listThongKe[0].user;

                this.listThongKe.forEach((item) => {
                    gatewayList.push([item.time, item.gateway]);
                    userList.push([item.time, item.user]);
                    if (item.gateway < minGateway) minGateway = item.gateway;
                    if (item.user < minUser) minUser = item.user;
                });

                this.series = [
                    { name: 'JAVIS HC', data: gatewayList },
                    { name: 'Người dùng', data: userList }
                ];
                this.$refs.chart.updateOptions({
                    yaxis: [
                        {
                            ...this.chartOptions.yaxis[0],
                            min: minGateway
                        },
                        {
                            ...this.chartOptions.yaxis[1],
                            min: minUser
                        }
                    ]
                });
            } else {
                this.series = [];
            }
        }
    },
    async mounted() {
        this.range = 3;
        this.setRange(3);
        await this.showStatistics();
    }
};
</script>

<style lang="less" scoped>
.card {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    &:hover {
        border: 1px solid #7cc0ff;
    }
}
</style>
