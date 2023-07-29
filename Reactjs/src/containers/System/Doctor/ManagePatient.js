import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import DatePicker from '../../../components/Input/DatePicker'
import {getAllPatientForDoctorService, postSendRemedyService, createNewPrescription, getMedicalRecord} from '../../../services/userService'
import './ManagePatient.scss'
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import PrescriptionModal from './PrescriptionModal';
import MedicalRecordModal from './MedicalRecordModal';
import { toast } from 'react-toastify';
import LoadingOverlay from 'react-loading-overlay'

class ManagePatient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            dataModal: {},
            isShowLoading: false,
            isOpenPrescriptionModal: false,
            isOpenMedicalRecord: false,
            dataPrescriptionModal: {},
            dataMedicalRecord: {}
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
            date: item.date,
            patientName: item.patientData.firstName,
            patientAddress: item.patientData.address,
            doctorFirstName: item.doctorDataUser.firstName,
            doctorLastName: item.doctorDataUser.lastName,
            timeTypeVi: item.timeTypeDataPatient.valueVi,
            timeTypeEn: item.timeTypeDataPatient.valueEn
        }
        this.setState({
            isOpenPrescriptionModal: true,
            dataPrescriptionModal: data
        })
    }

    handelBtnMedical = async (item) => {
        let dataMedicalRecord = await getMedicalRecord(item.patientId)
        this.setState({
            isOpenMedicalRecord: true,
            dataMedicalRecord: dataMedicalRecord
        })
    }

    closePrescriptionModal = () => {
        this.setState({
            isOpenPrescriptionModal: false,
            dataPrescriptionModal: {}
        })
    }

    createPrescription = async (data) => {
        let {dataPrescriptionModal} = this.state
        this.setState({
            isShowLoading: true
        })
        let res = await createNewPrescription({
            diagnostic: data.diagnostic,
            doctorAdvice: data.doctorAdvice,
            doctorId: dataPrescriptionModal.doctorId,
            patientId: dataPrescriptionModal.patientId,
            timeType: dataPrescriptionModal.timeType,
            date: dataPrescriptionModal.date,
            patientName: dataPrescriptionModal.patientName,
            language: this.props.language,
            dataDrug: data.data
        })
        if(res && res.errCode === 0){
            this.setState({
                isShowLoading: false
            })
            toast.success('Gửi hóa đơn thành công')
            this.closePrescriptionModal()
            await this.getDataPatient()
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Gặp lỗi. Bạn vui lòng kiểm tra lại.')
        }
       
    }

    closeMedicalRecord = () => {
        this.setState({
            isOpenMedicalRecord: false,
        })
    }

    render() {
        let {dataPatient, isOpenPrescriptionModal, 
            dataPrescriptionModal, isOpenMedicalRecord, dataMedicalRecord} = this.state
        let {currentDate} = this.state
        let {language} = this.props
        console.log('cehdjh',dataPatient)
        return (
            <div className='col-10'>
            <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
                >
                <div className='manage-patient-container'>
                    <div className='patient-title mt-4' style={{color: '#ff5400'}}>
                    <FormattedMessage id="manage-schedule.manage-patient"/>
                    </div>
                    <div className='schedule-container mt-3'>
                        <div className='row'>
                        <div className='col-3 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-date"/></label>
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
                                    <th><FormattedMessage id="manage-schedule.stt"/></th>
                                    <th><FormattedMessage id="manage-schedule.time"/></th>
                                    <th><FormattedMessage id="manage-schedule.name"/></th>
                                    <th><FormattedMessage id="manage-schedule.gender"/></th>
                                    <th><FormattedMessage id="manage-schedule.address"/></th>
                                    <th><FormattedMessage id="manage-schedule.action"/></th>
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
                                            <button className='btn btn-primary mr-3'
                                                onClick={() => this.handleBtnConfirm(item)}
                                            >Tạo phiếu khám bệnh
                                            </button>
                                            <button className='btn btn-primary mr-3'
                                                onClick={() => this.handelBtnMedical(item)}
                                            >Xem hồ sơ bệnh án
                                            </button>
                                            <button className='btn btn-primary'
                                                // onClick={() => this.handleBtnConfirm(item)}
                                            >Lấy xét nghiệm
                                            </button>
                                        </td>
                                    </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan='6' style={{textAlign: "center"}}>
                                    <FormattedMessage id="manage-schedule.no-data"/>
                                    </td>
                                </tr>
                            }
                                
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>

                <PrescriptionModal 
                    isOpenModal= {isOpenPrescriptionModal}
                    dataPrescriptionModal={dataPrescriptionModal}
                    closePrescriptionModal={this.closePrescriptionModal}
                    createPrescription={this.createPrescription}
                />
                
                <MedicalRecordModal
                    isOpenModal= {isOpenMedicalRecord}
                    dataMedicalRecord={dataMedicalRecord}
                    closeMedicalRecord={this.closeMedicalRecord}
                    // createPrescription={this.createPrescription}
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
