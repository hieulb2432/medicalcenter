import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker'
import {getAllPatientForDoctorService, postSendRemedyService} from '../../../services/userService'
import './ManagePatient.scss'
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay'

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
        }
    }

    async componentDidMount() {
        this.getDataPatient()
    }

    getDataPatient = async () => {
        let {user} = this.props
        let {currentDate} = this.state
        let formatedDate = new Date(currentDate).getTime()

        let res = await getAllPatientForDoctorService({
            doctorId: user.id,
            date: formatedDate
        })
        if(res && res.errCode === 0){
            this.setState({
                dataPatient: res.data
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshots) {

    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let {dataModal} = this.state
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedyService({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName,
        })
        if(res && res.errCode === 0){
            this.setState({
                isShowLoading: false
            })
            toast.success('Send Remedy Successfully')
            this.closeRemedyModal()
            await this.getDataPatient()
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Something went wrong')
            console.log('check err',res)
        }
    }

    render() {
        let {dataPatient, isOpenRemedyModal, dataModal} = this.state
        let {currentDate} = this.state
        let {language} = this.props
        return (
            <div className='col-10'>
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
                >
                <div className='manage-patient-container'>
                    <div className='patient-title mt-4' style={{color: '#ff5400'}}>
                        Quan ly benh nhan da dat lịch kham
                    </div>
                    <div className='schedule-container mt-3'>
                        <div className='row'>
                        <div className='col-4 form-group'>
                            <label>Chon ngay kham</label>
                            <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={currentDate}

                                />
                        </div>
                        <div className='col-12 table-manage-patient'>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>Thoi gian</th>
                                    <th>Tên</th>
                                    <th>Giới tính</th>
                                    <th>Địa chỉ</th>
                                    <th>Thao tác</th>
                                </tr>
                                {dataPatient && dataPatient.length > 0 ? 
                                    dataPatient.map((item, index) => {
                                        let time = language === LANGUAGES.VI ? 
                                        item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn
                                        let gender = language === LANGUAGES.VI ? 
                                        item.patientData.genderData.valueVi : item.patientData.genderData.valueEn
                                        return(
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{time}</td>
                                        <td>{item.patientData.firstName}</td>
                                        <td>{gender}</td>
                                        <td>{item.patientData.address}</td>
                                        <td>
                                            <button className='btn btn-primary'
                                                onClick={() => this.handleBtnConfirm(item)}
                                            >Gửi hóa đơn
                                            </button>
                                        </td>
                                    </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan='6' style={{textAlign: "center"}}>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            }
                                
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
                <RemedyModal 
                    isOpenModal= {isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
                
            </LoadingOverlay>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
