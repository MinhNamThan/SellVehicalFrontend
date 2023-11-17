<template>
    <span />
</template>

<script>
import ExcelJS from 'exceljs';
import moment from 'moment';
import { columns, headerFill } from './const';

export default {
    name: 'SanPhamSheet',
    props: ['listSanPham'],
    methods: {
        async exportSheet() {
            try {
                let updatedAt = this.listSanPham[0].updatedAt;
                this.listSanPham.forEach((item) => {
                    if (moment(item.updatedAt).isAfter(moment(updatedAt)))
                        updatedAt = item.updatedAt;
                });

                let wb = new ExcelJS.Workbook();
                let workbookName = `Danh sách sản phẩm JAVIS_${moment(updatedAt).format(
                    'DD/MM/YYYY'
                )}.xlsx`;
                let worksheetName = 'Xuất file sản phẩm';
                let ws = wb.addWorksheet(worksheetName);

                ws.columns = columns;
                ws.views = [{ state: 'frozen', xSplit: 1, ySplit: 1 }];
                ws.autoFilter = 'A1:AA1';

                let col = 'A';
                while (col <= 'Z') {
                    ws.getCell(`${col}1`).fill = { ...headerFill };
                    col = String.fromCharCode(col.charCodeAt(0) + 1);
                }
                ws.getCell('AA1').fill = { ...headerFill };

                this.listSanPham.forEach((sanPham) => {
                    ws.addRow({
                        ...sanPham,
                        baoHanh: sanPham.baoHanh === '12 tháng' ? 'Mặc định' : sanPham.baoHanh,
                        apDungThue: sanPham.apDungThue === true ? 'Có' : 'Không',
                        import: 1
                    });
                });

                wb.xlsx.writeBuffer().then(function (buffer) {
                    const fileURL = window.URL.createObjectURL(
                        new Blob([buffer], { type: 'application/octet-stream' })
                    );
                    const fileLink = document.createElement('a');
                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', workbookName);
                    document.body.appendChild(fileLink);
                    fileLink.click();
                    document.body.removeChild(fileLink);
                });
            } catch (error) {
                this.$notification['error']({
                    message: 'Xuất danh sách sản phẩm không thành công'
                });
            }
        }
    }
};
</script>
