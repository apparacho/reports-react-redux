import React from 'react';
import loadable from "@loadable/component/dist/loadable.cjs";

const CallsNew1Page = loadable(() => import('../components/calls-new-1/CallsPage'));

const CallsNew1Route = (props) => <CallsNew1Page {...props} />;

export default CallsNew1Route;
