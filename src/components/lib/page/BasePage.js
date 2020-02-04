import React, { Component } from 'react';
import './BasePage.less';

class BasePage extends Component {

    render() {
        const { title, children, renderTitle } = this.props;

        return (
            <div className="page">
                {renderTitle ? renderTitle() : <h2 className="pagetitle">{title}</h2>}
                {children}
            </div>
        );
    }
}

export default BasePage;
