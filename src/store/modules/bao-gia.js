import apiService from '@/services/bao-gia';

export default {
    namespaced: true,
    state: {
        listBaoGia: [],
        baoGia: {},
        metadata: {},
        baoGiaSaved: {}
    },
    getters: {},
    actions: {
        async saveBaoGia(context, body) {
            const { data } = await apiService.saveBaoGia(body);
            context.commit('setBaoGia', { ...context.state.baoGia, ...data });
            context.commit('setBaoGiaSaved', { ...context.state.baoGia, ...data });
        },
        async updateBaoGia(context, body) {
            await apiService.updateBaoGia(body);
            context.commit('setBaoGiaSaved', { ...context.state.baoGia, ...body });
        },
        async getListBaoGia(context, params) {
            const { data } = await apiService.getListBaoGia(params);
            let listBaoGia = data.items.map((baoGia) => {
                let listPhong = baoGia.items.map((phong) => {
                    let listSanPham = phong.listSanPham.map((item) =>
                        item.chietKhau ? item : { ...item, chietKhau: { unit: '%', value: 0 } }
                    );
                    return { ...phong, listSanPham };
                });
                return { ...baoGia, items: listPhong };
            });
            listBaoGia.sort((a, b) => {
                let da = new Date(a.updatedAt),
                    db = new Date(b.updatedAt);
                return db - da;
            });
            context.commit('setBaoGiaList', listBaoGia);
            context.commit('setMetadata', data.metadata);
        },
        async deleteBaoGia(context, id) {
            await apiService.deleteBaoGia(id);
        },
        async getBaoGiaPublic(context, publicId) {
            const { data } = await apiService.getBaoGiaPublic(publicId);
            context.commit('setBaoGia', data);
            context.commit('setBaoGiaSaved', data);
        },
        async updateTrangThaiBaoGia(context, params) {
            await apiService.updateTrangThaiBaoGia(params);
        },
        selectBaoGia(context, baoGia) {
            context.commit('setBaoGia', { ...baoGia, activeKey: null });
        },
        selectBaoGiaSaved(context, baoGia) {
            context.commit('setBaoGiaSaved', { ...baoGia, activeKey: null });
        },
        resetBaoGia(context) {
            context.commit('setBaoGia', {});
        },
        resetBaoGiaSaved(context) {
            context.commit('setBaoGiaSaved', {});
        },
        addKhachHangBaoGia(context, khachHang) {
            const baoGia = { ...context.state.baoGia, khachHangId: khachHang.id, khachHang };
            context.commit('setBaoGia', baoGia);
        },
        deleteKhachHangBaoGia(context) {
            const baoGia = { ...context.state.baoGia, khachHangId: null, khachHang: {} };
            context.commit('setBaoGia', baoGia);
        },
        addPhong(context) {
            const oldListPhong = context.state.baoGia.items;
            let id = -1;
            oldListPhong.forEach((item) => {
                if (item.id > id) id = item.id;
            });
            const newListPhong = [
                ...oldListPhong,
                {
                    id: id + 1,
                    name: `Phòng ${oldListPhong.length + 1}`,
                    listSanPham: []
                }
            ];
            const baoGia = { ...context.state.baoGia, items: newListPhong };
            context.commit('setBaoGia', baoGia);
        },
        editPhong(context, { id, name }) {
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === id ? { ...item, name } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        sortPhong(context, { newId, oldId }) {
            const listPhong = context.state.baoGia.items;
            const phong = listPhong[oldId];
            if (newId > oldId) {
                listPhong.forEach((item, index) => {
                    if (index > oldId && index <= newId) listPhong[index - 1] = listPhong[index];
                });
            } else if (newId < oldId) {
                for (let index = listPhong.length - 1; index >= 0; --index) {
                    if (index >= newId && index < oldId) listPhong[index + 1] = listPhong[index];
                }
            }
            listPhong[newId] = phong;
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        deletePhong(context, id) {
            const listPhong = context.state.baoGia.items.filter((item) => item.id !== id);
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        duplicatePhong(context, id) {
            const listPhong = context.state.baoGia.items;
            const index = listPhong.findIndex((phong) => phong.id === id);

            let greatestId = -1;
            let orderNum = 0;
            listPhong.forEach((item) => {
                if (item.id > greatestId) greatestId = item.id;
                if (item.name.includes(`${listPhong[index].name} Copy`)) ++orderNum;
            });

            listPhong.splice(
                index + 1,
                0,
                JSON.parse(
                    JSON.stringify({
                        ...listPhong[index],
                        id: greatestId + 1,
                        name: `${listPhong[index].name} Copy${orderNum > 0 ? orderNum + 1 : ''}`
                    })
                )
            );
            const baoGia = {
                ...context.state.baoGia,
                items: listPhong
            };
            context.commit('setBaoGia', baoGia);
        },
        setListSanPhamBaoGia(context, { phongId, listSanPham }) {
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        addSanPhamBaoGia(context, { phongId, sanPham }) {
            const list = context.state.baoGia.items.find((item) => item.id === phongId).listSanPham;
            let listSanPham = [];
            list.forEach((sp) => {
                listSanPham.push(sp);
            });
            let id = 0;
            if (listSanPham.length > 0)
                listSanPham.forEach((item) => {
                    if (item.id > id) id = item.id;
                });
            sanPham.moTaGoc = sanPham.moTa;
            listSanPham.unshift({ ...sanPham, sanPhamId: sanPham.id, id: id + 1 });
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        updateSoLuongSanPham(context, { phongId, id, soLuong }) {
            const oldListSanPham = context.state.baoGia.items.find(
                (item) => item.id === phongId
            ).listSanPham;
            const newListSanPham = oldListSanPham.map((item) =>
                item.id === id ? { ...item, soLuong } : item
            );
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham: newListSanPham } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        updateDonGiaSanPham(context, { phongId, id, giaBanLe }) {
            const oldListSanPham = context.state.baoGia.items.find(
                (item) => item.id === phongId
            ).listSanPham;
            const newListSanPham = oldListSanPham.map((item) =>
                item.id === id ? { ...item, giaBanLe } : item
            );
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham: newListSanPham } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        updateChietKhauSanPham(context, { phongId, id, chietKhau }) {
            const oldListSanPham = context.state.baoGia.items.find(
                (item) => item.id === phongId
            ).listSanPham;
            const newListSanPham = oldListSanPham.map((item) =>
                item.id === id ? { ...item, chietKhau } : item
            );
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham: newListSanPham } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        deleteSanPhamBaoGia(context, { phongId, id }) {
            const oldListSanPham = context.state.baoGia.items.find(
                (item) => item.id === phongId
            ).listSanPham;
            const newListSanPham = oldListSanPham.filter((item) => item.id !== id);
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham: newListSanPham } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        resetListSanPhamBaoGia(context, phongId) {
            const listPhong = context.state.baoGia.items.map((item) =>
                item.id === phongId ? { ...item, listSanPham: [] } : item
            );
            const baoGia = { ...context.state.baoGia, items: listPhong };
            context.commit('setBaoGia', baoGia);
        },
        setChietKhauValue(context, value) {
            const oldBaoGia = context.state.baoGia;
            const newBaoGia = {
                ...oldBaoGia,
                chietKhau: { value, unit: oldBaoGia.chietKhau.unit }
            };
            context.commit('setBaoGia', newBaoGia);
        },
        setPhiLapDatValue(context, value) {
            const oldBaoGia = context.state.baoGia;
            const newBaoGia = {
                ...oldBaoGia,
                phiLapDat: { value, unit: oldBaoGia.phiLapDat.unit }
            };
            context.commit('setBaoGia', newBaoGia);
        }
    },
    mutations: {
        setBaoGiaList(state, list) {
            state.listBaoGia = list;
        },
        setBaoGia(state, baoGia) {
            state.baoGia = baoGia;
        },
        setMetadata(state, metadata) {
            state.metadata = metadata;
        },
        setBaoGiaSaved(state, baoGiaSaved) {
            state.baoGiaSaved = baoGiaSaved;
        }
    }
};
