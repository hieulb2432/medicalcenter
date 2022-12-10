import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './DoctorExtraInfor.scss';
import { LANGUAGES } from '../../../utils';
import { getExtraInforDoctorsService } from '../../../services/userService'
import NumberFormat from 'react-number-format';


class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailIndor: false,
            extraInfor: {},
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshots) {
        if (this.props.language !== prevProps.language) {
        }

        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let res = await getExtraInforDoctorsService(this.props.doctorIdFromParent);
            if(res && res.errCode === 0){
                this.setState({
                    extraInfor: res.data
                })
            }
        }
       
    }

    showHideDetailIndor = (status) => {
        this.setState({ 
            isShowDetailIndor: status 
        });
    }

    render() {
        let { isShowDetailIndor, extraInfor } = this.state
        const { language } = this.props;
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id="patient.extra-infor-doctor.text-address" />
                    </div>
                    <div className='name-clinic'>
                        {extraInfor && extraInfor.nameClinic ? extraInfor.nameClinic : ''}
                    </div>
                    <div className='detail-address'>
                        {extraInfor && extraInfor.addressClinic ? extraInfor.addressClinic : ''}
                    </div>
                </div>

                <div className='content-down'>
                    {isShowDetailIndor === false && 
                        <div className='short-infor'>
                            <FormattedMessage id="patient.extra-infor-doctor.price" />
                            {language === LANGUAGES.VI ? (
                            <NumberFormat
                                className="currency"
                                value={extraInfor?.priceTypeData?.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={'VND'}
                                />
                            ) : (
                            <NumberFormat
                                className="currency"
                                value={extraInfor?.priceTypeData?.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                                />
                            )}

                            <span
                                onClick={() => this.showHideDetailIndor(true)}
                            >
                                <FormattedMessage id="patient.extra-infor-doctor.detail" />
                            </span>
                        </div>
                    }

                    {isShowDetailIndor === true && 
                        <>
                            <div className='title-price'>
                                <FormattedMessage id="patient.extra-infor-doctor.price" />
                            </div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'>
                                        <FormattedMessage id="patient.extra-infor-doctor.price" />
                                    </span>
                                    <span className='right'>
                                    {language === LANGUAGES.VI ? (
                                        <NumberFormat
                                            className="currency"
                                            value={extraInfor?.priceTypeData?.valueVi}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'VND'}
                                            />
                                        ) : (
                                        <NumberFormat
                                            className="currency"
                                            value={extraInfor?.priceTypeData?.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'$'}
                                            />
                                        )}
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfor && extraInfor.note ? extraInfor.note : ''}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id="patient.extra-infor-doctor.payment" />
                                {language === LANGUAGES.VI && extraInfor && extraInfor.paymentTypeData ? 
                                    extraInfor.paymentTypeData.valueVi 
                                    :
                                    extraInfor.paymentTypeData.valueEn }
                            </div>
                            <div className='hide-price'>
                                <span
                                    onClick={() => this.showHideDetailIndor(false)}
                                >
                                    <FormattedMessage id="patient.extra-infor-doctor.hide-price" />
                                </span>
                            </div>
                        </>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
