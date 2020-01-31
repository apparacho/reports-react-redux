import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ClientsRoute from './ClientsRoute';
import CallsRoute from './CallsRoute';

class AppRoute extends Component {

    render() {
        return (
            <Switch>
                <Route path="/clients" component={ClientsRoute} />
                <Route path="/calls" component={CallsRoute} />
                <Redirect to="/clients" />
            </Switch>
        )
    }
}

export default AppRoute
