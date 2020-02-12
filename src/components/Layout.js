import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
    Layout, Menu, Icon
} from 'antd';


const {
    Header, Content, Sider,
} = Layout;
// const SubMenu = Menu.SubMenu;

const menuItems = [
    { key: 'clients', icon: 'team', label: 'Клиенты' },
    { key: 'calls', icon: 'phone', label: 'Звонки' },
    { key: 'calls-new-1', icon: 'phone', label: 'Звонки New 1' },
];

const WestMenu = ({appStore, selectedKeys}) => {
    return appStore.isReady ? <Menu theme="dark" selectedKeys={selectedKeys} defaultOpenKeys={['route']} mode="inline" >
        {
            menuItems.map(({key, icon, label}) => (
                <Menu.Item key={key}>
                    <Link tag="span" to={`/${key}`}>
                        <Icon type={icon || 'no-icon'}/>
                        <span>{label}</span>
                    </Link>
                </Menu.Item>
            ))
        }
    </Menu> : null;
};


class AppLayout extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };

    render() {

        const { location, children, match} = this.props;
        const getActiveMenuKey = (path) => {
            const section = path.match(/[\w\-_]+/);
            if (!section) return [];
            return [section[0]];
        };

        console.log(match, location, this.props);

        const selectedKeys = getActiveMenuKey(location.pathname);

        return (
            <Layout>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                    width={265}
                >
                    <div className="logo">
                        Reports
                        <div className="logo-subtitle">react+redux</div>
                    </div>

                    <WestMenu
                        {...{appStore: {isReady: true}, selectedKeys}}
                    />

                </Sider>
                <Layout>
                    <Header>
                        <div className="topmenu">

                        </div>
                    </Header>
                    <Content>
                        {children}
                    </Content>

                </Layout>
            </Layout>
        );
    }
}

export default withRouter(AppLayout);

