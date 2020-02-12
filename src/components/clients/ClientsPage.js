import React, { Component } from 'react';
import ClientsList from './ClientsList';
import BasePage from '../../components/lib/page/BasePage';
import './ClientsPage.less';

class ClientsPage extends Component {

    render() {

        return (
            <BasePage title="Страница Клиенты" >
                <ClientsList user={{user_role: 'developer'}} {...this.props} />
            </BasePage>
        );
    }
}

export default ClientsPage;
