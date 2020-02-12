import React, { Component } from 'react';
import BasePage from '../../components/lib/page/BasePage';
import CallsList from './CallsList';


class CallsPage extends Component {


    render() {
        return (
            <BasePage title="Отчет Звонки" >
                <CallsList {...this.props} />
            </BasePage>
        );
    }
}

export default CallsPage;
