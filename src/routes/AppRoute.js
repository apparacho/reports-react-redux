import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ClientsRoute from './ClientsRoute';
import CallsRoute from './CallsRoute';
import AppLayout from "../components/Layout";

class AppRoute extends Component {

    render() {
        console.log('AppRoute', this.props);
        return (
            <AppLayout>
                <Switch>
                    <Route path="/clients" component={ClientsRoute} />
                    <Route path="/calls" component={CallsRoute} />
                    <Redirect to="/clients" />
                </Switch>
            </AppLayout>
        )
    }
}

export default AppRoute
