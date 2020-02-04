import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../../components/lib/form/input/FormikAntdInput';
import Button from '../../components/lib/button/button';
import { defaultFilterParams } from '../../ducks/clients'


const yupNumberValidation = Yup.string().matches(/^\d+$/, 'Укажите числовое значение');

const validationSchema = Yup.object().shape({
    app_id: yupNumberValidation.max(9, 'Максимальная длина значения App ID - 9 знаков'),
    search: Yup.string()
});


class FilterPanel extends Component {

    state = {
        appSearchValue: ''
    };

    static propTypes = {
        app_id: PropTypes.string,
        search: PropTypes.string,

        onSubmit: PropTypes.func
    };

    static defaultProps = {
        ...defaultFilterParams
    };

    convertOutputFormValues = ({app_id, search}) => (
        {
            app_id: app_id || defaultFilterParams.app_id,
            search: search || defaultFilterParams.search
        }
    );

    handleSubmit = (values, actions) => {
        this.props.onSubmit && this.props.onSubmit(this.convertOutputFormValues(values), actions);
    };

    render() {
        const { app_id, search } = this.props;

        return (
            <Formik

                initialValues={{ app_id, search }}

                validationSchema={validationSchema}
                validateOnChange={true}

                isInitialValid={true}

                onSubmit={this.handleSubmit}
            >
                {props => (
                    <Form >

                        <Input
                            name="app_id"
                            type="text"
                            placeholder="App ID"
                            allowClear={true}
                            style={{ width: 150 }}
                        />

                        <Input
                            name="search"
                            type="text"
                            placeholder="Customer ID, Имя клиента, Номер, Сайт, Лицевой счет, логин/e-mail"
                            allowClear={true}
                            style={{ width: 520, marginLeft: '20px' }}
                        />

                        <Button
                            htmlType="submit"
                            type="main"
                            style={{ margin: '0 0 0 20px' }}
                            disabled={!props.isValid}
                        >
                            Применить
                        </Button>

                    </Form>
                )}
            </Formik>
        );

    }
}

export default FilterPanel;
