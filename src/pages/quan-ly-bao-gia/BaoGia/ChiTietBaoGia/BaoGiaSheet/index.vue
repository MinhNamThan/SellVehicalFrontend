<template>
    <div>
        <div v-for="(sanPham, index) in listQuaTang" :key="`qt_${index}`">
            <div
                :ref="`ten_qt_${index}`"
                class="content-reference"
                style="width: 280px; line-height: 14px"
            >
                {{ sanPham.ten }}
            </div>
            <div
                v-html="sanPham.moTa"
                :ref="`moTa_qt_${index}`"
                class="content-reference"
                style="width: 360px; line-height: 14px"
            ></div>
        </div>
        <div v-for="(sanPham, index) in listSanPham" :key="`sp_${index}`">
            <div
                :ref="`ten_${index}`"
                class="content-reference"
                style="width: 280px; line-height: 14px"
            >
                {{ sanPham.ten }}
            </div>
            <div
                v-html="sanPham.moTa"
                :ref="`moTa_${index}`"
                class="content-reference"
                style="width: 360px; line-height: 14px"
            ></div>
        </div>
        <div v-for="(phong, index) in listPhong" :key="`p_${index}`">
            <div v-for="(sanPham, idx) in phong.listSanPham" :key="idx">
                <div
                    :ref="`ten_${index}_${idx}`"
                    class="content-reference"
                    style="width: 280px; line-height: 14px"
                >
                    {{ sanPham.ten }}
                </div>
                <div
                    v-html="sanPham.moTa"
                    :ref="`moTa_${index}_${idx}`"
                    class="content-reference"
                    style="width: 360px; line-height: 14px"
                ></div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import ExcelJS from 'exceljs';
import moment from 'moment';

export default {
    name: 'BaoGiaSheet',
    props: ['baoGia', 'khbg', 'lp', 'lsp', 'lspth', 'lqt'],
    data() {
        return {
            khachHangBaoGia: {},
            listPhong: [],
            listSanPham: [],
            listSanPhamTongHop: [],
            listQuaTang: [],
            showChietKhau: false
        };
    },
    watch: {
        baoGia(newVal) {
            if (!this.khbg) this.getData(newVal);
            else {
                this.khachHangBaoGia = this.khbg;
                this.listPhong = this.lp;
                this.listSanPham = this.lsp;
                this.listSanPhamTongHop = this.lspth;
                this.listQuaTang = this.lqt;
            }
            this.showChietKhau = this.listSanPham.some((sp) => sp.chietKhau.value > 0);
        }
    },
    methods: {
        moment,
        getData(baoGia) {
            this.khachHangBaoGia = baoGia.khachHang;
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
            let listSanPham = [];
            let listSanPhamTongHop = [];
            let listQuaTang = [];
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
                    });
            });
            this.listSanPham = listSanPham;
            this.listSanPhamTongHop = listSanPhamTongHop;
            this.listQuaTang = listQuaTang;
        },
        setTableHeaderStyle(worksheet, row) {
            worksheet.getRow(row).height = 16;
            let col = 'A';
            let endCol = 'J';
            if (this.showChietKhau) endCol = 'L';
            while (col < endCol) {
                worksheet.getCell(`${col}${row}`).style = {
                    font: {
                        name: 'Arial',
                        size: 11,
                        bold: true
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFF00' }
                    },
                    border: {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    },
                    alignment: {
                        horizontal: 'center',
                        vertical: 'middle'
                    }
                };
                col = String.fromCharCode(col.charCodeAt(0) + 1);
            }
        },
        setTableBodyStyle(worksheet, row) {
            let col = 'A';
            let endCol = 'J';
            if (this.showChietKhau) endCol = 'L';
            while (col < endCol) {
                worksheet.getCell(`${col}${row}`).style = {
                    font: {
                        name: 'Arial',
                        size: 10
                    },
                    border: {
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    },
                    alignment: {
                        vertical: 'top'
                    }
                };
                col = String.fromCharCode(col.charCodeAt(0) + 1);
            }
            worksheet.getCell(`A${row}`).alignment = {
                horizontal: 'center',
                vertical: 'top'
            };
            worksheet.getCell(`B${row}`).alignment = {
                vertical: 'top',
                wrapText: true
            };
            worksheet.getCell(`C${row}`).alignment = {
                vertical: 'top',
                wrapText: true
            };
            worksheet.getCell(`D${row}`).font = {
                name: 'Arial',
                size: 10,
                color: { argb: 'FFFF0000' },
                bold: true
            };
            worksheet.getCell(`D${row}`).alignment = {
                horizontal: 'center',
                vertical: 'top'
            };
            worksheet.getCell(`E${row}`).alignment = {
                horizontal: 'right',
                vertical: 'top'
            };
            worksheet.getCell(`F${row}`).alignment = {
                horizontal: 'right',
                vertical: 'top'
            };
            worksheet.getCell(`G${row}`).alignment = {
                horizontal: 'right',
                vertical: 'top'
            };
            worksheet.getCell(`H${row}`).alignment = {
                horizontal: 'right',
                vertical: 'top'
            };
            worksheet.getCell(`I${row}`).alignment = {
                horizontal: 'right',
                vertical: 'top'
            };
            worksheet.getCell(`J${row}`).alignment = {
                horizontal: 'right',
                vertical: 'top'
            };
        },
        setRichText(worksheet, cell, content) {
            const rgbToHex = (rgb) => {
                let hex = Number(rgb).toString(16);
                if (hex.length < 2) {
                    hex = '0' + hex;
                }
                return hex;
            };
            const fullColorHex = (r, g, b) => {
                let red = rgbToHex(r);
                let green = rgbToHex(g);
                let blue = rgbToHex(b);
                return red + green + blue;
            };
            let temporalDivElement = document.createElement('div');
            temporalDivElement.innerHTML = content;
            if (!temporalDivElement.firstElementChild.nodeName) return;
            let nameOfNode = temporalDivElement.firstElementChild.nodeName || '';

            let parentNode = temporalDivElement;
            let richTextArray = [];
            const styleByNodeName = {
                STRONG: 'bold',
                B: 'bold',
                EM: 'italic',
                I: 'italic',
                U: 'underline'
            };
            const getStylesByAncestorNodes = (node) => {
                let font = { name: 'Arial', size: 10 };
                if (nameOfNode == 'H1') {
                    font.size = 16;
                    worksheet.getRow(cell.substring(1, cell.length)).height = 22;
                } else if (nameOfNode == 'H2') {
                    font.size = 15;
                    worksheet.getRow(cell.substring(1, cell.length)).height = 21;
                } else if (nameOfNode == 'H3') {
                    font.size = 14;
                    worksheet.getRow(cell.substring(1, cell.length)).height = 20;
                } else if (nameOfNode == 'H4') {
                    font.size = 13;
                    worksheet.getRow(cell.substring(1, cell.length)).height = 19;
                } else if (nameOfNode == 'H5') {
                    font.size = 12;
                    worksheet.getRow(cell.substring(1, cell.length)).height = 18;
                } else if (nameOfNode == 'H6') {
                    font.size = 11;
                    worksheet.getRow(cell.substring(1, cell.length)).height = 17;
                }
                let ancestorNodes = [];
                const getAncestorNodes = (node) => {
                    if (node !== null) {
                        ancestorNodes.push(node);
                        getAncestorNodes(node.parentNode);
                    }
                };
                getAncestorNodes(node.parentNode);

                ancestorNodes.forEach((node) => {
                    const nodeName = node.nodeName;
                    if (
                        nodeName === 'STRONG' ||
                        nodeName === 'B' ||
                        nodeName === 'EM' ||
                        nodeName === 'I' ||
                        nodeName === 'U'
                    )
                        font[styleByNodeName[nodeName]] = true;
                });

                const styledAncestorNode = ancestorNodes.find(
                    (node) => node.attributes && node.attributes.style
                );

                if (styledAncestorNode) {
                    const colorAttr = styledAncestorNode.attributes.style.value;
                    if (colorAttr.includes('#')) {
                        const index = colorAttr.indexOf('#');
                        font['color'] = {
                            argb: colorAttr.substring(index + 1, index + 7)
                        };
                    } else if (colorAttr.includes('rgb')) {
                        let matchColors = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/;
                        let match = matchColors.exec(colorAttr);
                        font['color'] = {
                            argb: fullColorHex(match[1], match[2], match[3])
                        };
                    } else if (colorAttr.includes('red'))
                        font['color'] = {
                            argb: 'FF0000'
                        };
                }
                return font;
            };
            let inOrder = (nodes) => {
                nodes.forEach((node) => {
                    if (node.previousSibling) {
                        if (
                            node.previousSibling.nodeName === 'P' ||
                            node.previousSibling.nodeName === 'DIV'
                        )
                            richTextArray.push({ text: '\n\n' });
                        else if (
                            (node.nodeName === 'P' || node.nodeName === 'DIV') &&
                            richTextArray[richTextArray.length - 1].text !== '\n\n'
                        )
                            richTextArray.push({ text: '\n' });

                        if (
                            node.nodeName !== 'P' &&
                            node.nodeName !== 'DIV' &&
                            node.previousSibling.nodeName !== 'P' &&
                            node.previousSibling.nodeName !== 'DIV' &&
                            (node.nodeName !== '#text' ||
                                (node.nodeName === '#text' && node.nodeValue.trim()))
                        )
                            richTextArray.push({ text: ' ' });
                    }

                    if (node.nodeName === '#text' && node.nodeValue.trim()) {
                        let config = {
                            text: node.nodeValue.trim().replace(/  +/g, ' ')
                        };
                        let fontStyles = getStylesByAncestorNodes(node);
                        config.font = fontStyles;
                        richTextArray.push(config);
                    } else {
                        inOrder(node.childNodes);
                    }
                });
            };
            if (parentNode) {
                inOrder(parentNode.childNodes);
                worksheet.getCell(cell).value = {
                    richText: richTextArray
                };
            }
        },
        async setImage(workbook, worksheet, source, row) {
            const getMeta = (url) =>
                new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = (err) => reject(err);
                    img.src = url;
                });

            const img = await getMeta(source);
            const height = (125 / img.naturalWidth) * img.naturalHeight;

            if (worksheet.getRow(row).height < height) worksheet.getRow(row).height = height;
            const res = await axios.get(source, {
                responseType: 'arraybuffer'
            });
            const buff = Buffer.from(res.data, 'utf-8');
            const image = workbook.addImage({
                buffer: buff,
                extension: 'png'
            });
            if (this.showChietKhau) {
                worksheet.addImage(image, {
                    tl: { col: 10.65, row: row - 0.3 },
                    ext: { width: 125, height }
                });
            } else {
                worksheet.addImage(image, {
                    tl: { col: 8.92, row: row - 0.3 },
                    ext: { width: 125, height }
                });
            }
        },
        setSum(worksheet, row) {
            worksheet.getCell(`G${row}`).font = { name: 'Arial', size: 10, bold: true };
            worksheet.getCell(`G${row}`).alignment = {
                horizontal: 'right'
            };
            worksheet.getCell(`G${row}`).value = 'Tổng giá thiết bị';
            worksheet.getCell(`H${row}`).font = { name: 'Arial', size: 10, bold: true };
            worksheet.getCell(`H${row}`).alignment = {
                horizontal: 'right'
            };
            worksheet.getCell(`H${row}`).numFmt = '#,##0';
            worksheet.getCell(`H${row}`).value = this.listSanPham.reduce(
                (prev, cur) =>
                    prev +
                    cur.giaBanLe * cur.soLuong -
                    (cur.chietKhau.unit === 'VND'
                        ? cur.chietKhau.value
                        : cur.giaBanLe * cur.soLuong * (cur.chietKhau.value / 100)),
                0
            );
            worksheet.getCell(`I${row}`).font = { name: 'Arial', size: 10, bold: true };
            worksheet.getCell(`I${row}`).alignment = {
                horizontal: 'right'
            };
            worksheet.getCell(`I${row}`).value = 'VND';
        },
        setTotalSum(worksheet, row) {
            const tongGiaThietBi = this.listSanPham.reduce(
                (prev, cur) =>
                    prev +
                    cur.giaBanLe * cur.soLuong -
                    (cur.chietKhau.unit === 'VND'
                        ? cur.chietKhau.value
                        : cur.giaBanLe * cur.soLuong * (cur.chietKhau.value / 100)),
                0
            );
            const chietKhau = this.baoGia.chietKhau;
            const tongSauChietKhau =
                tongGiaThietBi -
                (chietKhau.unit === 'VND'
                    ? chietKhau.value
                    : tongGiaThietBi * (chietKhau.value / 100));
            const phiLapDat = this.baoGia.phiLapDat;
            const tongThanhToan =
                tongSauChietKhau +
                (phiLapDat.unit === 'VND'
                    ? phiLapDat.value
                    : tongGiaThietBi * (phiLapDat.value / 100));

            this.setSum(worksheet, row);

            if (chietKhau.value !== 0) {
                ++row;
                worksheet.getCell(`G${row}`).alignment = {
                    horizontal: 'right'
                };
                worksheet.getCell(`G${row}`).value = 'Chiết khấu';
                if (chietKhau.unit === 'VND') {
                    worksheet.getCell(`H${row}`).numFmt = '#,##0';
                    worksheet.getCell(`H${row}`).value = chietKhau.value;
                    worksheet.getCell(`I${row}`).value = 'VND';
                } else {
                    worksheet.getCell(`H${row}`).value =
                        chietKhau.value.toString().indexOf('.') === -1
                            ? chietKhau.value
                            : parseFloat(chietKhau.value.toFixed(1));
                    worksheet.getCell(`I${row}`).value = '%';
                }
                worksheet.getCell(`I${row}`).alignment = {
                    horizontal: 'right'
                };

                if (phiLapDat.value !== 0) {
                    ++row;
                    worksheet.getCell(`G${row}`).font = { name: 'Arial', size: 10, bold: true };
                    worksheet.getCell(`G${row}`).alignment = {
                        horizontal: 'right'
                    };
                    worksheet.getCell(`G${row}`).value = 'Tổng sau chiết khấu';
                    worksheet.getCell(`H${row}`).font = { name: 'Arial', size: 10, bold: true };
                    worksheet.getCell(`H${row}`).alignment = {
                        horizontal: 'right'
                    };
                    worksheet.getCell(`H${row}`).numFmt = '#,##0';
                    worksheet.getCell(`H${row}`).value = tongSauChietKhau;
                    worksheet.getCell(`I${row}`).font = { name: 'Arial', size: 10, bold: true };
                    worksheet.getCell(`I${row}`).alignment = {
                        horizontal: 'right'
                    };
                    worksheet.getCell(`I${row}`).value = 'VND';
                }
            }

            if (phiLapDat.value !== 0) {
                ++row;
                worksheet.getCell(`G${row}`).alignment = {
                    horizontal: 'right'
                };
                worksheet.getCell(`G${row}`).value = 'Phí lắp đặt';
                if (phiLapDat.unit === 'VND') {
                    worksheet.getCell(`H${row}`).numFmt = '#,##0';
                    worksheet.getCell(`H${row}`).value = phiLapDat.value;
                    worksheet.getCell(`I${row}`).value = 'VND';
                } else {
                    worksheet.mergeCells(`H${row}:I${row}`);
                    worksheet.getCell(`H${row}`).value =
                        (phiLapDat.value.toString().indexOf('.') === -1
                            ? phiLapDat.value
                            : parseFloat(phiLapDat.value.toFixed(1))) +
                        '% (' +
                        (tongGiaThietBi * (phiLapDat.value / 100)).toLocaleString() +
                        ' VND)';
                }
                worksheet.getCell(`I${row}`).alignment = {
                    horizontal: 'right'
                };

                if (chietKhau.value !== 0)
                    worksheet.getCell(`J${row}`).value = '(tính theo giá trị chưa chiết khấu)';
            }

            if (chietKhau.value !== 0 || phiLapDat.value !== 0) {
                ++row;
                worksheet.getCell(`G${row}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD9D9D9' }
                };
                worksheet.getCell(`H${row}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD9D9D9' }
                };
                worksheet.getCell(`I${row}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD9D9D9' }
                };
                worksheet.getCell(`G${row}`).font = { name: 'Arial', size: 10, bold: true };
                worksheet.getCell(`G${row}`).alignment = {
                    horizontal: 'right'
                };
                worksheet.getCell(`G${row}`).value = 'Tổng thanh toán';
                worksheet.getCell(`H${row}`).font = { name: 'Arial', size: 10, bold: true };
                worksheet.getCell(`H${row}`).alignment = {
                    horizontal: 'right'
                };
                worksheet.getCell(`H${row}`).numFmt = '#,##0';
                worksheet.getCell(`H${row}`).value = tongThanhToan;
                worksheet.getCell(`I${row}`).font = { name: 'Arial', size: 10, bold: true };
                worksheet.getCell(`I${row}`).alignment = {
                    horizontal: 'right'
                };
                worksheet.getCell(`I${row}`).value = 'VND';
                if (phiLapDat.value !== 0)
                    worksheet.getCell(`J${row}`).value = '(đã bao gồm công lắp đặt, cấu hình)';
            }
            return row + 2;
        },
        setTotalDiscount(worksheet, row) {
            const tongGiaKhuyenMai = this.listQuaTang.reduce(
                (prev, cur) => prev + cur.giaBanLe * cur.soLuong,
                0
            );

            worksheet.getCell(`G${row}`).font = { name: 'Arial', size: 10, bold: true };
            worksheet.getCell(`G${row}`).alignment = {
                horizontal: 'right'
            };
            worksheet.getCell(`G${row}`).value = 'Tổng giá trị quà tặng';
            worksheet.getCell(`H${row}`).font = { name: 'Arial', size: 10, bold: true };
            worksheet.getCell(`H${row}`).alignment = {
                horizontal: 'right'
            };
            worksheet.getCell(`H${row}`).numFmt = '#,##0';
            worksheet.getCell(`H${row}`).value = tongGiaKhuyenMai;
            worksheet.getCell(`I${row}`).font = { name: 'Arial', size: 10, bold: true };
            worksheet.getCell(`I${row}`).alignment = {
                horizontal: 'right'
            };
            worksheet.getCell(`I${row}`).value = 'VND';

            return row + 2;
        },
        setNoteHeaderStyle(worksheet, row) {
            worksheet.getRow(row).height = 16;
            let col = 'A';
            let endCol = 'J';
            if (this.showChietKhau) endCol = 'L';
            while (col < endCol) {
                worksheet.getCell(`${col}${row}`).style = {
                    font: {
                        name: 'Arial',
                        size: 11,
                        bold: true
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFEFEFEF' }
                    },
                    alignment: {
                        vertical: 'middle'
                    }
                };
                col = String.fromCharCode(col.charCodeAt(0) + 1);
            }
        },
        setPrivacyString(worksheet, row, xmlString) {
            if (xmlString == '') return;
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = xmlString;
            var eachLine = tempDiv.childNodes;
            for (var i = 0, l = eachLine.length; i < l; i++) {
                if (eachLine[i].nodeName.includes('H')) {
                    this.setNoteHeaderStyle(worksheet, row + i + 1);
                    row = row + 1;
                }
                this.setRichText(worksheet, `A${row + i}`, eachLine[i].outerHTML);
            }
        },
        async exportSheet() {
            try {
                let wb = new ExcelJS.Workbook();
                let workbookName = `Bảng dự toán JAVIS_khách hàng ${
                    this.khachHangBaoGia.name
                }_${moment(this.baoGia.updatedAt).format('DD/MM/YYYY')}.xlsx`;
                let worksheetName = `Khách hàng ${this.khachHangBaoGia.name}`;
                let ws = wb.addWorksheet(worksheetName);

                let row, col, tmp;

                row = 1;
                while (row < 1001) {
                    col = 'A';
                    while (col < 'L') {
                        ws.getCell(`${col}${row}`).style = {
                            font: {
                                name: 'Arial',
                                size: 10
                            },
                            alignment: {
                                vertical: 'middle'
                            }
                        };
                        col = String.fromCharCode(col.charCodeAt(0) + 1);
                    }
                    ws.getRow(row).height = 14;
                    ++row;
                }
                ws.columns = this.showChietKhau
                    ? [
                          {
                              width: 7
                          },
                          {
                              width: 30
                          },
                          {
                              width: 35
                          },
                          {
                              width: 17
                          },
                          {
                              width: 17
                          },
                          {
                              width: 17
                          },
                          {
                              width: 19.5
                          },
                          {
                              width: 19.5
                          },
                          {
                              width: 15.4
                          },
                          {
                              width: 45
                          },
                          {
                              width: 30
                          }
                      ]
                    : [
                          {
                              width: 7
                          },
                          {
                              width: 30
                          },
                          {
                              width: 35
                          },
                          {
                              width: 17
                          },
                          {
                              width: 17
                          },
                          {
                              width: 17
                          },
                          {
                              width: 15.4
                          },
                          {
                              width: 45
                          },
                          {
                              width: 30
                          }
                      ];

                ws.getRow(1).height = 20;
                ws.getCell('C1').font = {
                    name: 'Arial',
                    size: 15,
                    color: { argb: 'FFFF0000' }
                };
                ws.getCell('C1').alignment = {
                    vertical: 'middle'
                };
                ws.getCell('C1').value = 'GIẢI PHÁP NHÀ THÔNG MINH JAVIS';

                if (this.showChietKhau) {
                    ws.getCell('K1').alignment = {
                        horizontal: 'right',
                        vertical: 'top'
                    };
                    ws.getCell('K1').value = `Cập nhật: ${moment(this.baoGia.updatedAt).format(
                        'DD/MM/YYYY HH:mm:ss'
                    )}`;
                } else {
                    ws.getCell('I1').alignment = {
                        horizontal: 'right',
                        vertical: 'top'
                    };
                    ws.getCell('I1').value = `Cập nhật: ${moment(this.baoGia.updatedAt).format(
                        'DD/MM/YYYY HH:mm:ss'
                    )}`;
                }

                ws.mergeCells('B2:B6');
                const response = await fetch('javis.png');
                const buffer = response.arrayBuffer();
                const imageId = wb.addImage({
                    buffer: buffer,
                    extension: 'png'
                });
                ws.addImage(imageId, {
                    tl: { col: 1.63, row: 1.4 },
                    ext: { width: 125, height: 70 }
                });

                col = 'C';
                while (col < 'E') {
                    row = 2;
                    while (row < 7) {
                        ws.getCell(`${col}${row}`).font =
                            col === 'C'
                                ? {
                                      name: 'Arial',
                                      size: 11,
                                      bold: true
                                  }
                                : {
                                      name: 'Arial',
                                      size: 11
                                  };
                        ws.getCell(`${col}${row}`).alignment = {
                            vertical: 'middle'
                        };
                        ++row;
                    }
                    col = String.fromCharCode(col.charCodeAt(0) + 1);
                }
                ws.getCell('D4').font = {
                    name: 'Arial',
                    size: 11,
                    bold: true
                };
                ws.getCell('C2').value = 'Chủ đầu tư';
                ws.getCell('D2').value = this.khachHangBaoGia.name;
                ws.getCell('C3').value = 'Địa chỉ';
                ws.getCell('D3').value = this.khachHangBaoGia.address;
                ws.getCell('C4').value = 'Mobile';
                ws.getCell('D4').value = this.khachHangBaoGia.mobile;
                ws.getCell('C5').value = 'Facebook';
                ws.getCell('D5').value = this.khachHangBaoGia.facebook
                    ? {
                          text: this.khachHangBaoGia.facebook,
                          hyperlink: this.khachHangBaoGia.facebook
                      }
                    : null;
                ws.getCell('C6').value = 'Ghi chú';
                ws.getCell('D6').value = this.khachHangBaoGia.note;

                if (this.listQuaTang.length > 0) {
                    ws.getRow(8).height = 18;
                    ws.getCell('A8').style = {
                        font: {
                            name: 'Arial',
                            size: 11,
                            color: { argb: 'FFFF0000' },
                            bold: true
                        },
                        alignment: {
                            vertical: 'middle'
                        }
                    };

                    ws.getCell('A8').value = 'QUÀ TẶNG KHÁCH HÀNG';

                    this.setTableHeaderStyle(ws, 9);

                    ws.getCell('A9').value = 'STT';
                    ws.getCell('B9').value = 'Mã sản phẩm';
                    ws.getCell('C9').value = 'Tên sản phẩm';
                    ws.getCell('D9').value = 'Tổng số lượng';
                    ws.getCell('E9').value = 'Đơn giá';
                    ws.getCell('F9').value = 'Thành tiền';
                    if (this.showChietKhau) {
                        ws.getCell('G9').value = 'Chiết khấu';
                        ws.getCell('H9').value = 'Sau chiết khấu';
                        ws.getCell('I9').value = 'Bảo hành';
                        ws.getCell('J9').value = 'Ghi chú';
                        ws.getCell('K9').value = 'Hình ảnh sản phẩm';
                    } else {
                        ws.getCell('G9').value = 'Bảo hành';
                        ws.getCell('H9').value = 'Ghi chú';
                        ws.getCell('I9').value = 'Hình ảnh sản phẩm';
                    }

                    row = 10;
                    this.listQuaTang.forEach((item, index) => {
                        this.setTableBodyStyle(ws, row + index);

                        ws.getCell(`A${row + index}`).value = index + 1;
                        ws.getCell(`B${row + index}`).value = item.sku;
                        ws.getCell(`C${row + index}`).value = item.ten;
                        ws.getCell(`D${row + index}`).value = item.soLuong;
                        ws.getCell(`E${row + index}`).numFmt = '#,##0';
                        ws.getCell(`E${row + index}`).value = item.giaBanLe;
                        ws.getCell(`F${row + index}`).numFmt = '#,##0';
                        ws.getCell(`F${row + index}`).value = item.giaBanLe * item.soLuong;
                        if (this.showChietKhau) {
                            if (item.chietKhau.unit === 'VND') {
                                ws.getCell(`G${row + index}`).numFmt = '#,##0';
                                ws.getCell(`G${row + index}`).value = item.chietKhau.value;
                            } else {
                                ws.getCell(`G${row + index}`).numFmt =
                                    item.chietKhau.value.toString().indexOf('.') === -1
                                        ? '0%'
                                        : '0.0%';
                                ws.getCell(`G${row + index}`).value = item.chietKhau.value / 100;
                            }
                            ws.getCell(`H${row + index}`).value = 0;
                            ws.getCell(`I${row + index}`).value = item.baoHanh;

                            if (item.moTa) this.setRichText(ws, `J${row + index}`, item.moTa);
                            ws.getCell(`J${row + index}`).alignment = {
                                horizontal: 'left',
                                vertical: 'top',
                                wrapText: true
                            };

                            const tenRow = Math.ceil(
                                this.$refs[`ten_qt_${index}`][0].clientHeight / 14
                            );
                            const moTaRow = Math.ceil(
                                this.$refs[`moTa_qt_${index}`][0].clientHeight / 14
                            );
                            if (tenRow > 1 || moTaRow > 1)
                                ws.getRow(row + index).height =
                                    14 * (tenRow > moTaRow ? tenRow : moTaRow);
                        } else {
                            ws.getCell(`G${row + index}`).value = item.baoHanh;

                            if (item.moTa) this.setRichText(ws, `H${row + index}`, item.moTa);
                            ws.getCell(`H${row + index}`).alignment = {
                                horizontal: 'left',
                                vertical: 'top',
                                wrapText: true
                            };

                            const tenRow = Math.ceil(
                                this.$refs[`ten_qt_${index}`][0].clientHeight / 14
                            );
                            const moTaRow = Math.ceil(
                                this.$refs[`moTa_qt_${index}`][0].clientHeight / 14
                            );
                            if (tenRow > 1 || moTaRow > 1)
                                ws.getRow(row + index).height =
                                    14 * (tenRow > moTaRow ? tenRow : moTaRow);
                        }
                    });

                    row = 10;
                    for (let index = 0; index < this.listQuaTang.length; index++) {
                        if (this.listQuaTang[index].anhDaiDien)
                            await this.setImage(
                                wb,
                                ws,
                                this.listQuaTang[index].anhDaiDien,
                                row + index
                            );
                    }
                    row += this.listQuaTang.length;
                    if (this.listQuaTang.length > 0) {
                        row = this.setTotalDiscount(ws, row);
                    }
                    row += 1;
                } else row = 8;

                ws.getRow(row).height = 18;
                ws.getCell(`A${row}`).style = {
                    font: {
                        name: 'Arial',
                        size: 11,
                        bold: true
                    },
                    alignment: {
                        vertical: 'middle'
                    }
                };

                ws.getCell(`A${row}`).value = 'A. BẢNG TỔNG HỢP KHỐI LƯỢNG';

                ++row;
                this.setTableHeaderStyle(ws, row);

                ws.getCell(`A${row}`).value = 'STT';
                ws.getCell(`B${row}`).value = 'Mã sản phẩm';
                ws.getCell(`C${row}`).value = 'Tên sản phẩm';
                ws.getCell(`D${row}`).value = 'Tổng số lượng';
                ws.getCell(`E${row}`).value = 'Đơn giá';
                ws.getCell(`F${row}`).value = 'Thành tiền';
                if (this.showChietKhau) {
                    ws.getCell(`G${row}`).value = 'Chiết khấu';
                    ws.getCell(`H${row}`).value = 'Sau chiết khấu';
                    ws.getCell(`I${row}`).value = 'Bảo hành';
                    ws.getCell(`J${row}`).value = 'Ghi chú';
                    ws.getCell(`K${row}`).value = 'Hình ảnh sản phẩm';
                } else {
                    ws.getCell(`G${row}`).value = 'Bảo hành';
                    ws.getCell(`H${row}`).value = 'Ghi chú';
                    ws.getCell(`I${row}`).value = 'Hình ảnh sản phẩm';
                }

                ++row;
                tmp = row;
                this.listSanPhamTongHop.forEach((item, index) => {
                    this.setTableBodyStyle(ws, row + index);

                    ws.getCell(`A${row + index}`).value = index + 1;
                    ws.getCell(`B${row + index}`).value = item.sku;
                    ws.getCell(`C${row + index}`).value = item.ten;
                    ws.getCell(`D${row + index}`).value = item.soLuong;
                    ws.getCell(`E${row + index}`).numFmt = '#,##0';
                    ws.getCell(`E${row + index}`).value = item.giaBanLe;
                    ws.getCell(`F${row + index}`).numFmt = '#,##0';
                    ws.getCell(`F${row + index}`).value = item.giaBanLe * item.soLuong;
                    if (this.showChietKhau) {
                        if (item.chietKhau.unit === 'VND') {
                            ws.getCell(`G${row + index}`).numFmt = '#,##0';
                            ws.getCell(`G${row + index}`).value = item.chietKhau.value;
                        } else {
                            ws.getCell(`G${row + index}`).numFmt =
                                item.chietKhau.value.toString().indexOf('.') === -1 ? '0%' : '0.0%';
                            ws.getCell(`G${row + index}`).value = item.chietKhau.value / 100;
                        }
                        ws.getCell(`H${row + index}`).numFmt = '#,##0';
                        ws.getCell(`H${row + index}`).value =
                            item.giaBanLe * item.soLuong -
                            (item.chietKhau.unit === 'VND'
                                ? item.chietKhau.value
                                : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
                        ws.getCell(`I${row + index}`).value = item.baoHanh;

                        if (item.moTaGoc) this.setRichText(ws, `J${row + index}`, item.moTaGoc);
                        ws.getCell(`J${row + index}`).alignment = {
                            horizontal: 'left',
                            vertical: 'top',
                            wrapText: true
                        };

                        const tenRow = Math.ceil(this.$refs[`ten_${index}`][0].clientHeight / 14);
                        const moTaRow = Math.ceil(this.$refs[`moTa_${index}`][0].clientHeight / 14);
                        if (tenRow > 1 || moTaRow > 1)
                            ws.getRow(row + index).height =
                                14 * (tenRow > moTaRow ? tenRow : moTaRow);
                    } else {
                        ws.getCell(`G${row + index}`).value = item.baoHanh;

                        if (item.moTaGoc) this.setRichText(ws, `H${row + index}`, item.moTaGoc);

                        ws.getCell(`H${row + index}`).alignment = {
                            horizontal: 'left',
                            vertical: 'top',
                            wrapText: true
                        };

                        const tenRow = Math.ceil(this.$refs[`ten_${index}`][0].clientHeight / 14);
                        const moTaRow = Math.ceil(this.$refs[`moTa_${index}`][0].clientHeight / 14);
                        if (tenRow > 1 || moTaRow > 1)
                            ws.getRow(row + index).height =
                                14 * (tenRow > moTaRow ? tenRow : moTaRow);
                    }
                });

                row = tmp;
                for (let index = 0; index < this.listSanPhamTongHop.length; index++) {
                    if (this.listSanPhamTongHop[index].anhDaiDien)
                        await this.setImage(
                            wb,
                            ws,
                            this.listSanPhamTongHop[index].anhDaiDien,
                            row + index
                        );
                }

                row += this.listSanPhamTongHop.length;
                row = this.setTotalSum(ws, row);

                ws.getRow(row).height = 18;
                ws.getCell(`A${row}`).style = {
                    font: {
                        name: 'Arial',
                        size: 11,
                        bold: true
                    },
                    alignment: {
                        vertical: 'middle'
                    }
                };
                ws.getCell(`A${row}`).value = 'B. BÁO GIÁ CHI TIẾT THEO TỪNG HẠNG MỤC';

                ++row;
                this.setTableHeaderStyle(ws, row);

                ws.getCell(`A${row}`).value = 'STT';
                ws.getCell(`B${row}`).value = 'Mã sản phẩm';
                ws.getCell(`C${row}`).value = 'Tên sản phẩm';
                ws.getCell(`D${row}`).value = 'Số lượng';
                ws.getCell(`E${row}`).value = 'Đơn giá';
                ws.getCell(`F${row}`).value = 'Thành tiền';
                if (this.showChietKhau) {
                    ws.getCell(`G${row}`).value = 'Chiết khấu';
                    ws.getCell(`H${row}`).value = 'Sau chiết khấu';
                    ws.getCell(`I${row}`).value = 'Bảo hành';
                    ws.getCell(`J${row}`).value = 'Ghi chú';
                    ws.getCell(`K${row}`).value = 'Hình ảnh sản phẩm';
                } else {
                    ws.getCell(`G${row}`).value = 'Bảo hành';
                    ws.getCell(`H${row}`).value = 'Ghi chú';
                    ws.getCell(`I${row}`).value = 'Hình ảnh sản phẩm';
                }

                ++row;
                tmp = row;
                let stt = 1;
                this.listPhong.forEach((phong, idx) => {
                    phong.listSanPham.forEach((item, index) => {
                        this.setTableBodyStyle(ws, row + index);

                        if (index === 0) {
                            ws.getCell(`B${row}`).font = {
                                name: 'Arial',
                                size: 10,
                                bold: true
                            };
                            ws.getCell(`A${row}`).value = stt;
                            ws.getCell(`B${row}`).value = phong.name;
                            ++stt;
                            ++row;
                            this.setTableBodyStyle(ws, row + index);
                        }

                        ws.getCell(`A${row + index}`).value = stt;
                        ws.getCell(`B${row + index}`).value = item.sku;
                        ws.getCell(`C${row + index}`).value = item.ten;
                        ws.getCell(`D${row + index}`).value = item.soLuong;
                        ws.getCell(`E${row + index}`).numFmt = '#,##0';
                        ws.getCell(`E${row + index}`).value = item.giaBanLe;
                        ws.getCell(`F${row + index}`).numFmt = '#,##0';
                        ws.getCell(`F${row + index}`).value = item.giaBanLe * item.soLuong;
                        if (this.showChietKhau) {
                            if (item.chietKhau.unit === 'VND') {
                                ws.getCell(`G${row + index}`).numFmt = '#,##0';
                                ws.getCell(`G${row + index}`).value = item.chietKhau.value;
                            } else {
                                ws.getCell(`G${row + index}`).numFmt =
                                    item.chietKhau.value.toString().indexOf('.') === -1
                                        ? '0%'
                                        : '0.0%';
                                ws.getCell(`G${row + index}`).value = item.chietKhau.value / 100;
                            }
                            ws.getCell(`H${row + index}`).numFmt = '#,##0';
                            ws.getCell(`H${row + index}`).value =
                                item.giaBanLe * item.soLuong -
                                (item.chietKhau.unit === 'VND'
                                    ? item.chietKhau.value
                                    : item.giaBanLe * item.soLuong * (item.chietKhau.value / 100));
                            ws.getCell(`I${row + index}`).value = item.baoHanh;

                            if (item.moTa) this.setRichText(ws, `J${row + index}`, item.moTa);
                            ws.getCell(`J${row + index}`).alignment = {
                                horizontal: 'left',
                                vertical: 'top',
                                wrapText: true
                            };

                            const tenRow = Math.ceil(
                                this.$refs[`ten_${idx}_${index}`][0].clientHeight / 14
                            );
                            const moTaRow = Math.ceil(
                                this.$refs[`moTa_${idx}_${index}`][0].clientHeight / 14
                            );
                            if (tenRow > 1 || moTaRow > 1)
                                ws.getRow(row + index).height =
                                    14 * (tenRow > moTaRow ? tenRow : moTaRow);
                            ++stt;
                        } else {
                            ws.getCell(`G${row + index}`).value = item.baoHanh;

                            if (item.moTa) this.setRichText(ws, `H${row + index}`, item.moTa);
                            ws.getCell(`H${row + index}`).alignment = {
                                horizontal: 'left',
                                vertical: 'top',
                                wrapText: true
                            };

                            const tenRow = Math.ceil(
                                this.$refs[`ten_${idx}_${index}`][0].clientHeight / 14
                            );
                            const moTaRow = Math.ceil(
                                this.$refs[`moTa_${idx}_${index}`][0].clientHeight / 14
                            );
                            if (tenRow > 1 || moTaRow > 1)
                                ws.getRow(row + index).height =
                                    14 * (tenRow > moTaRow ? tenRow : moTaRow);
                            ++stt;
                        }
                    });
                    row += phong.listSanPham.length;
                });

                row = tmp;
                for (let idx = 0; idx < this.listPhong.length; idx++) {
                    const listSanPham = this.listPhong[idx].listSanPham;
                    for (let index = 0; index < listSanPham.length; index++) {
                        if (index === 0) ++row;
                        if (listSanPham[index].anhDaiDien)
                            await this.setImage(wb, ws, listSanPham[index].anhDaiDien, row + index);
                    }
                    row += listSanPham.length;
                }

                this.setSum(ws, row);

                row += 2;

                this.setPrivacyString(ws, row, await this.baoGia.privacy);
                ws.getCell(`H${row}`).alignment = {
                    horizontal: 'left',
                    vertical: 'top',
                    wrapText: true
                };

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
                console.log(error);
                this.$notification['error']({
                    message: 'Xuất báo giá không thành công'
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.content-reference {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
</style>
