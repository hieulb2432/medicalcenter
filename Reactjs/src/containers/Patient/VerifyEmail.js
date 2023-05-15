import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import {postVerifyBookingService} from '../../services/userService'
import './VerifyEmail.scss'
import HomeHeader from '../HomePage/HomeHeader';

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateVerify: false,
            errCode: 0,
            message: ''
        }
    }

    async componentDidMount() {
        if(this.props.location && this.props.location.search){
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token')
            let doctorId = urlParams.get('doctorId')
            let res = await postVerifyBookingService({
                token: token,
                doctorId: doctorId
            })

            if (res && res.errCode === 0){
                this.setState({
                    stateVerify: true,
                    errCode: res.errCode,
                    message: "Xác nhận lịch hẹn thành công"
                })
            } else if (res && res.errCode === 4){
                this.setState({
                    stateVerify: true,
                    errCode: res.errCode,
                    message: "Quá thời gian xác nhận lịch hẹn"
                })
            } else{
                this.setState({
                    stateVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1,
                    message: "Lịch hẹn không tồn tại hoặc đã được xác nhận"
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        
    }

    render() {
        let {statusVerify, errCode} = this.state;
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {statusVerify === false ?
                        <div>
                            Loading data...
                        </div>
                        :
                        <div>
                            <div className='infor-booking'>{this.state.message}</div>
                        </div>
                    }
                </div>
                
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
