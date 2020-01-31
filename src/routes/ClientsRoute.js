import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route } from 'react-router-dom';

const ClientsPage = loadable(() => import('../components/clients/ClientsPage'));
const ClientEditPage = loadable(() => import('../components/clients/ClientEditPage'));

function ClientsRoute(props) {
    console.log(props);
    return (
        <Switch>
            <Route path={`${props.match.path}`} exact component={ClientsPage} />
            <Route path={`${props.match.path}/:id`} exact component={ClientEditPage} />
        </Switch>
    );
}

export default ClientsRoute;
