import React, { Component } from 'react';
import { Modal } from 'antd';


class AddAgentInfo extends Component {

    onAnyBtnAlertClick = () => {
        console.log('onAnyBtnAlertClick ');
        // this.props.clientStore.operationStatus['create.app'].status === 'success' && this.props.clientsStore.load();
        // this.props.clientStore.setOperationStatus('create.app', '');
    };

    render() {
        const {createAgentOperation} = this.props,
            getAlertData = (title = '', content = '') => {
                if (createAgentOperation.status === 'success') {
                    title = 'Агент успешно добавлен';
                } else if (createAgentOperation.status === 'error'){
                    title = 'Ошибка добавления агента';
                    content = createAgentOperation.info;
                }
                return {
                    title,
                    content
                };
            },
            alertData = getAlertData();

        return (
            <Modal
                title={alertData.title}
                className="settings-modal"
                width={400}
                bodyStyle={{height: '200px'}}
                onOk={this.onAnyBtnAlertClick}
                onCancel={this.onAnyBtnAlertClick}
                visible={createAgentOperation.status === 'success' || createAgentOperation.status === 'error' }
            >
                <div style={{ margin: '20px' }}>
                    {alertData.content}
                </div>
            </Modal>
        )
    }
}

export default AddAgentInfo;
