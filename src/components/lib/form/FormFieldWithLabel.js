import React from 'react';

const FormFieldWithLabel = ({label, children}) => (
    <div style={{ margin: '15px 0' }}>
        <label style={{ width: '300px', display: 'inline-block' }}>{label}</label>
        {children}
    </div>
);

export default FormFieldWithLabel;
