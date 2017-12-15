
export class Utils {

    public static getRandomColor(): string {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    public static getPhone() {
        return parseInt('139' +  (Math.floor(Math.random() * 89999999) + 10000000));
    }
    public static getState(limit) {
        return Math.ceil(Math.random() * limit);
    }

    public static cloneModel(model): any {
        let _clone = {};
        for (let key in model) {
            if (key) {
                _clone[key] = model[key];
            }
        }
        return _clone;
    }

    /**
     * 获取uuid
     * @returns {string}
     */
    public static getUUID() {
        let uuid = [];
        let str = '0123456789abcdef';
        for (let i = 0; i < 36; i ++) {
            uuid[i] = str.substr(Math.floor(Math.random() * 0x10), 1);
        }
        uuid[14] = '4';
        uuid[19] = str.substr((uuid[19] & 0x3 | 0x8), 1)
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        return uuid.join("").replace('-', '');
    }

    /**
     * 判断用户是否登录
     * @returns {any}
     */
    public static isUserLogin() {
        let _user = sessionStorage.getItem('__currentUser');
        return _user ? JSON.parse(_user) : null;
    }

    /**
     * 注销登录
     */
    public static loginOut() {
        sessionStorage.removeItem('__currentUser');
    }

    /**
     * 获取中英文实际长度
     * @param {string} str
     * @returns {number}
     */
    public static getRealLength(str: string): number {
        let realLength = 0;
        for (let i = 0; i < str.length; i++) {
            let c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                realLength ++;
            } else {
                realLength += 2;
            }
        }
        return realLength;
    }
}
