import React, { Component } from 'react';
import BasePage from '../../components/lib/page/BasePage';
import CallsNew1List from './CallsList';


class CallsNew1Page extends Component {


    render() {
        return (
            <BasePage title="Отчет Звонки New 1" >
                <CallsNew1List {...this.props} />
            </BasePage>
        );
    }
}

export default CallsNew1Page;
