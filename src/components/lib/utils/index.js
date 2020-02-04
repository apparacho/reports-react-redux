import { Modal } from 'antd';
import moment from 'moment';

export const dateFormat = 'YYYY-MM-DD';
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

// export const yesterday = moment(new Date((+Date.now() - 24*3600*1000))).format(dateFormat);
// export const today = moment().format(dateFormat);

export const yesterdayYmd = moment().day(0).format(dateFormat);
export const todayYmd = moment().format(dateFormat);

export function makeNestedRoute(match, ...nested) {
    if (!match) {
        throw new Error('match obj is required');
    }
    let path = match.path;
    if (path[path.length - 1] === '/') {
        path = path.slice(0, -1);
    }
    return path + '/' + nested.join('/');
}


export function showConfirm(title, onOk) {
    Modal.confirm({
        title,
        onOk,
        onCancel() { },
    });
}

export function sliceArr(arr) {
    return arr ? arr.slice() : [];
}
