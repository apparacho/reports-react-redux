import React, { Component } from 'react';
import ClientsList from './ClientsList';
import Page from '../../components/lib/page/BasePage';
import './ClientsPage.less';

class ClientsPage extends Component {

    render() {

        return (
            <Page title="Страница Клиенты" >
                <ClientsList user={{user_role: 'developer'}} {...this.props} />
            </Page>
        );
    }
}

export default ClientsPage;
