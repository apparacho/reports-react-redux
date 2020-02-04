import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../../../components/lib/form/input/FormikAntdInput';
import Select from '../../../components/lib/form/select/FormikAntdSelect';
import FormFieldWithLabel from '../../../components/lib/form/FormFieldWithLabel';
import FormControlPanel from '../../../components/lib/form/FormControlPanel';

const fieldRequiredMessage = 'это поле обязательно для заполнения';

const addTemplateValidationSchema = Yup.object().shape({
    name: Yup.string()
        .matches(/^[a-zA-Zа-яА-Я0-9\s]+$/, 'Невалидное значение поля')
        .trim()
        .max(100, 'Максимальная длина значения 100 символов')
        .required(fieldRequiredMessage),
    phone: Yup.string()
        .matches(/^\+?[0-9]+$/, 'Укажите корректный номер телефона')
        .max(15, 'Максимальная длина значения 15 символов')
        .required(fieldRequiredMessage),
    email: Yup.string()
        .email('Укажите корректный email')
        .required(fieldRequiredMessage),
    tariff: Yup.string().required(fieldRequiredMessage)
});

class AddAgentForm extends PureComponent {

    static propTypes = {
        name: PropTypes.string,
        phone: PropTypes.string,
        email: PropTypes.string,
        tariff: PropTypes.string,

        tariffData: PropTypes.array
    };

    static defaultProps = {
        name: '',
        phone: '',
        email: '',
        tariff: '',

        tariffData: []
    };

    handleSubmit = (values, actions) => {
        this.props.onSubmit && this.props.onSubmit(values, actions);
    };

    onFormStateChange = (formState) => {
        this.props.onFormStateChange && this.props.onFormStateChange(this.form.getFormikComputedProps(), formState);
    };

    render() {

        return (
            <Formik
                key={Date.now()}
                initialValues={{
                    name: this.props.name,
                    phone: this.props.phone,
                    email: this.props.email,
                    tariff: this.props.tariff
                }}

                validationSchema={addTemplateValidationSchema}
                validateOnChange={true}
                validate={(formState) => setTimeout(() => this.onFormStateChange(formState), 0)}

                onSubmit={this.handleSubmit}
            >
                {props => (
                    <Form >
                        <FormFieldWithLabel label='Название клиента'>
                            <Input
                                name="name"
                                type="text"
                                placeholder=""
                                style={{ width: 300 }}
                            />
                        </FormFieldWithLabel>
                        <FormFieldWithLabel label='Номер телефона клиента'>
                            <Input
                                name="phone"
                                type="text"
                                placeholder=""
                                style={{ width: 300 }}
                            />
                        </FormFieldWithLabel>
                        <FormFieldWithLabel label='E-mail клиента'>
                            <Input
                                name="email"
                                type="text"
                                placeholder=""
                                style={{ width: 300 }}
                            />
                        </FormFieldWithLabel>
                        <FormFieldWithLabel label='Тарифный план' >
                            <Select
                                formikProps={props}
                                selectionData={this.props.tariffData}
                                name="tariff"
                                nameField="name"
                                valueField="id"
                                style={{ width: 200 }}
                            />
                        </FormFieldWithLabel>
                        <FormControlPanel
                            isSubmitBtnActive={props.dirty && props.isValid && !props.isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        );

    }
}

export default AddAgentForm;
