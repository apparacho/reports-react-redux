import React, { Component } from 'react'
import Button from '../button/button';
import PropTypes from 'prop-types';

class FormControlPanel extends Component {

    static propTypes = {
        isSubmitBtnActive: PropTypes.bool,
        onAbortClick: PropTypes.func,
        saveBtnText: PropTypes.string
    };

    static defaultProps = {
        isSubmitBtnActive: false,
        saveBtnText: 'Сохранить'
    };

    render() {
        const { isSubmitBtnActive, onAbortClick, saveBtnText } = this.props;
        return (
            <div style={{
                    marginTop: '40px',
                    padding: '10px 0',
                    borderTop: '1px solid #dcdcdc',
                    width: this.props.width || '600px',
                    textAlign: 'right'
            }}>
                {
                    onAbortClick ? <Button
                        type="usual"
                        style={{ marginRight: '20px' }}
                        onClick={onAbortClick}
                    >
                        Отмена
                    </Button> : null
                }

                <Button
                    type="main"
                    htmlType="submit"
                    disabled={!isSubmitBtnActive}
                >
                    {saveBtnText}
                </Button>
            </div>
        )
    }
}

export default FormControlPanel
