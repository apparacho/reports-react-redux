import React, { Component } from 'react';
import { Modal } from 'antd';
import AddAgentForm from './AddAgentForm';
import Button from '../../../components/lib/button/button';
import AddAgentInfo from './AddAgentInfo';


class AddAgentModal extends Component {
    static propTypes = {};

    // componentDidMount() {
    //     this.props.appStore.getDirectories(['billing:tp:tariff_plan_agent'])
    // }

    openAddAgentModal = () => {
        console.log('openAddAgentModal');
        // this.props.clientStore.setIsVisibleAddAgentModal(true);
    };

    closeAddAgentModal = () => {
        console.log('closeAddAgentModal');
        // this.props.clientStore.setIsVisibleAddAgentModal(false);
    };

    onSubmitForm = (values, formActions) => {
        console.log('onSubmitForm', values, formActions);
        // this.props.clientStore.createCustomer(values, formActions);
    };

    render() {
        const {t, appStore, isVisibleAddAgentModal } = this.props,
            // dir = appStore.getDirectory('billing:tp:tariff_plan_agent');
            dir = [];
        return (
            <>
                <Button type="main" onClick={this.openAddAgentModal}>
                    {t('addAgentBtnText')}
                </Button>

                <Modal
                    title="Добавление агента"
                    className="settings-modal"
                    width={660}
                    bodyStyle={{height: 280}}
                    footer={null}
                    onCancel={this.closeAddAgentModal}
                    visible={isVisibleAddAgentModal}
                >
                    <div style={{ margin: '20px' }}>
                        <AddAgentForm
                            key={Date.now()}
                            onSubmit={this.onSubmitForm}
                            tariffData={dir}
                        />
                    </div>
                </Modal>

                <AddAgentInfo />
            </>
        );
    }
}

export default AddAgentModal;
