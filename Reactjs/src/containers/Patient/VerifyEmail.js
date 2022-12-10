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
            errCode: 0
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
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    stateVerify: true,
                    errCode: res && res.errCode ? res.errCode : -1
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
                            {+errCode == 0 ? 
                                <div className='infor-booking'>Xac nhan lich hen thanh cong</div>
                                :
                                <div className='infor-booking'>Lich hen khong ton tai hoac da duoc xac nhan</div>
                            }
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
