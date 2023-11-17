function trimObject(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].trim();
        }
        if (typeof obj[key] === 'object' && obj[key] instanceof Blob === false) {
            obj[key] = trimObject(obj[key]);
        }
    }
    return obj;
}

export { trimObject };
