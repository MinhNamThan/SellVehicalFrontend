const style = {
    alignment: {
        wrapText: true,
        vertical: 'top'
    },
    border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
    }
};

export const columns = [
    { header: 'Tên sản phẩm*', key: 'ten', width: 65, style },
    { header: 'Hình thức quản lý sản phẩm', width: 29, style },
    { header: 'Loại sản phẩm', width: 17, style },
    { header: 'Mô tả sản phẩm', key: 'moTa', width: 60, style },
    { header: 'Nhãn hiệu', key: 'nhanHieu', width: 14, style },
    { header: 'Tags', width: 8, style },
    { header: 'Thuộc tính 1', width: 15, style },
    { header: 'Giá trị thuộc tính 1', key: 'baoHanh', width: 20, style },
    { header: 'Thuộc tính 2', width: 15, style },
    { header: 'Giá trị thuộc tính 2', width: 20, style },
    { header: 'Thuộc tính 3', width: 15, style },
    { header: 'Giá trị thuộc tính 3', width: 20, style },
    { header: 'Tên phiên bản sản phẩm', key: 'tenPhienBan', width: 60, style },
    { header: 'Mã SKU*', key: 'sku', width: 28, style },
    { header: 'Barcode', width: 12, style },
    { header: 'Khối lượng', key: 'khoiLuong', width: 14, style },
    { header: 'Đơn vị khối lượng', key: 'donViKhoiLuong', width: 20, style },
    { header: 'Ảnh đại diện', key: 'anhDaiDien', width: 60, style },
    { header: 'Đơn vị', key: 'donVi', width: 10, style },
    { header: 'Áp dụng thuế', key: 'apDungThue', width: 16, style },
    {
        header: 'LC_CN1_Tồn kho ban đầu*',
        key: 'tonKho',
        width: 27,
        style
    },
    { header: 'LC_CN1_Giá vốn khởi tạo*', width: 27, style },
    { header: 'LC_CN1_Tồn tối thiểu', width: 23, style },
    { header: 'LC_CN1_Tồn tối đa', width: 20, style },
    { header: 'LC_CN1_Điểm lưu kho', width: 23, style },
    { header: 'PL_Giá bán lẻ', key: 'giaBanLe', width: 16, style: { ...style, numFmt: '#,##0' } },
    { header: 'Import', key: 'import', width: 11, style }
];

export const headerFill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' }
};
