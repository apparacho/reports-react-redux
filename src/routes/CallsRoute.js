import React from 'react';
import loadable from "@loadable/component/dist/loadable.cjs";

const CallsPage = loadable(() => import('../components/calls/CallsPage'));

const CallsRoute = (props) => <CallsPage {...props} />;

export default CallsRoute;
