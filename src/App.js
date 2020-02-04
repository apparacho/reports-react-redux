import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppRoute from './routes/AppRoute';

import './App.less';

function App() {
    return (
        <div className="App">
            <Switch>
                <Route path="/" component={AppRoute} />
            </Switch>
        </div>
    );
}

export default App;
