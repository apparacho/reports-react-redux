import React, { } from 'react';
import moment from 'moment';
import { dateFormat, dateTimeFormat } from '../utils';
import { Tooltip } from 'antd';

export const baseRenderer = (value) => <div className="cell-value cell-text-value">{value}</div>;

export const textRenderer = (text) => {
    return text == null ? '' : <div className="cell-value cell-text-value">
        <Tooltip trigger="click" placement="leftTop" mouseEnterDelay={0} overlayClassName="tooltip-container" title={text} >
            {text}</Tooltip>
    </div>;
};

export const numberRenderer = (num) => <div className="cell-value cell-number-value">{num ? num.toLocaleString() : num}</div>;
const dateFormatted = (format = dateTimeFormat) => (dateStr) => <div className="cell-value  cell-date-value">{dateStr ? moment(dateStr).format(format) : ''}</div>;
const infinityDatetimeValue = moment('9999-12-31 23:59:59.999').valueOf();
export const dateRenderer = dateFormatted(dateFormat);
export const dateTimeRenderer = dateFormatted(dateTimeFormat);
export const datetimeExcludingInfinityRenderer = (dateStr) => moment(dateStr).valueOf() === infinityDatetimeValue ? '' : dateTimeRenderer(dateStr);


export default {
    base: baseRenderer,
    text: textRenderer,
    date: dateRenderer,
    datetime: dateTimeRenderer,
    number: numberRenderer
};


//
