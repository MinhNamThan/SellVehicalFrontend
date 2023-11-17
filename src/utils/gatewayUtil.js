const HASH_SIZE_BITS = 32;
const MASK_1 = 0x7fffffff;

const hash_data = [
    0x4d2104e3, 0xecba4cf8, 0x5ab0cb58, 0x97cd4fa9, 0xd0886864, 0x73ceb8a0, 0x22917e47, 0xb017abf6,
    0xc146ee47, 0xe4d93735, 0x82e18e2b, 0xa25abe0e, 0x1c6de286, 0x617b50e6, 0xba9a48d5, 0x067357d4
];

function formatInput(address) {
    return address
        .trim()
        .toUpperCase()
        .split('')
        .filter((e) => e != ' ' && e != '-' && e != ':');
}

function checkInput(address) {
    address = formatInput(address.trim());

    if (address.length != 12) return false;

    let result = address.filter((e) => {
        return !(e.toString().match(/[A-F]/g) || e.toString().match(/[0-9]/g));
    });
    if (!result.length) {
        return true;
    } else {
        return false;
    }
}

function createMacAddress(address) {
    let addressArray = [];
    let result = formatInput(address);
    for (let i = 0; i < result.length; i++) {
        addressArray[i] = `${result[i]}` + `${result[i + 1]}`;
        i++;
    }
    result = addressArray.filter((e) => e != null);
    result = result.join(':');
    return result;
}

function createRemoteURL(macAddress) {
    let address = parseInt(formatInput(macAddress).join(''), 16);
    return 'https://' + address + '.javiscloud.com';
}

function createPassword(macAddress) {
    const hashNum = 2;
    let result = formatInput(macAddress);
    let endOfPass = [];
    for (let i = 0; i < hashNum; i++) {
        if (
            // kiểm tra chữ hay số
            result[result.length - hashNum + i] ===
            result[result.length - hashNum + i].toLowerCase()
        ) {
            endOfPass[i] = result[result.length - hashNum + i];
        } else endOfPass[i] = 8;
    }
    return 'js' + result[0] + result[result.length - 1] + endOfPass.join('');
}

function createSSHPassword(macAddress) {
    const hashNum = 4;
    let result = formatInput(macAddress);
    let endOfPass = [];
    for (let i = 0; i < hashNum; i++) {
        if (
            // kiểm tra chữ hay số
            result[result.length - hashNum + i] ===
            result[result.length - hashNum + i].toLowerCase()
        )
            endOfPass[i] = result[result.length - hashNum + i];
        else endOfPass[i] = 9;
    }
    return 'javis' + result[0] + result[result.length - 1] + endOfPass.join('');
}

function getMacFormRules() {
    return [
        {
            required: true,
            message: 'Vui lòng nhập địa chỉ MAC',
            whitespace: true
        },
        {
            validator: (rule, value) => {
                if (formatInput(value).length != 0) return !(formatInput(value).length != 12);
                else return true;
            },
            message: 'Địa chỉ MAC có 12 kí tự'
        },
        {
            validator: (rule, value) => {
                if (formatInput(value).length === 12) {
                    return checkInput(value);
                } else return true;
            },
            message: 'Địa chỉ MAC không đúng'
        }
    ];
}

function getDeviceDetail(address) {
    return {
        macAddress: createMacAddress(address),
        userName: 'admin',
        password: createPassword(address),
        remoteURL: createRemoteURL(address),
        sshURL: 'ssh -p 6000 root@127.0.0.1',
        sshPassword: createSSHPassword(address),
        sshURL2:
            'ssh root@sshtunnel.javisco.com -p ' +
            calc_port(BigInt(parseInt(formatInput(address).join(''), 16)))
    };
}

function getMacAddress(deviceId) {
    if (!deviceId) return '';
    if (deviceId.length !== 12) deviceId = parseInt(deviceId).toString(16);
    return deviceId.match(/.{2}/g).join(':');
}

function getDeviceId(mac) {
    return mac.trim().split(':').join('');
}

function shift_left_1(x) {
    return ((x & MASK_1) << 1) | (x >>> (HASH_SIZE_BITS - 1));
}

function hash(data) {
    let k;
    let value = 0;
    let item;
    for (k = 0; k < data.length; k++) {
        item = data[k];
        value = shift_left_1(value);
        value ^= hash_data[item & 0x0f];
        value = shift_left_1(value);
        value ^= hash_data[item >>> 4];
    }
    return value >>> 0;
}

function id_to_bytes(id) {
    let ar = [];
    for (let i = 0; i < 8; i++) {
        let item = id & BigInt(0xff);
        id = id >> BigInt(8);
        item = Number(item) >>> 0;
        ar.push(item);
    }
    return ar;
}

function calc_port(id) {
    const NUM_PORT = 50000;
    const MIN_PORT = 10000;
    let ar = id_to_bytes(id);
    let hc = hash(ar);
    let port = (hc % NUM_PORT) + MIN_PORT;
    return port;
}

export { createRemoteURL, getMacFormRules, getDeviceDetail, getMacAddress, getDeviceId };
