import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select';
import {CRUD_ACTION, LANGUAGES, dateFormat} from '../../../utils'
import * as actions from '../../../store/actions';
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';
import { toast } from 'react-toastify';
import _, { range, result } from 'lodash';
import {saveBulkSchecduleDoctorService, getListPatientForOneDoctorService, getDetailInforDoctorService, getInforUserBooking} from '../../../services/userService'
import ModalBookingInfo from './ModalBookingInfo';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDateConvert: moment(new Date()).startOf('day').valueOf(),
            listDoctors: [],
            currentDate: '',
            rangeTime: [],
            inDay: true,
            bookingData: {},
            isOpenModal: false, 
            checkToday: false,
        }
    }

    async componentDidMount() {
        this.props.fetchAllScheduleTime();
        this.setState({
            checkToday: true,
        })
    }

    checkTime = (data) => {
        let currentTime = new Date()
        let hours = currentTime.getHours()
        if(hours < 9 ) {
            return data?.slice(1,data.length)
        } else if(hours < 10) {
            return data?.slice(2,data.length)
        } else if(hours < 11) {
            return data?.slice(3,data.length)
        } else if (hours < 12) {
            return data?.slice(4,data.length)
        } else if (hours < 14) {
            return data?.slice(5,data.length)
        } else if (hours < 15) {
            return data?.slice(6,data.length)
        } else if (hours < 16) {
            return data?.slice(7,data.length)
        } else if (hours < 17) {
            return []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.currentDate !== this.state.currentDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giá trị giờ, phút, giây và mili giây về 0
            const todayTimestamp = today.getTime();

            // Kiểm tra xem timestamp có phải là ngày hôm nay hay không
            const timestamp = new Date(this.state.currentDate).getTime() // 2022-05-07
            if (timestamp >= todayTimestamp) {
                this.setState({
                    checkToday: true
                })
            } else {
                this.setState({
                    checkToday: false
                })
            }
        }

        if(prevProps.allScheduleTime!== this.props.allScheduleTime){
            let data = this.props.allScheduleTime;
            if(data && data.length > 0) {
                data = data.map(item => ({
                    ...item,
                    isSelected: false
                }))
            }
            this.setState({
                rangeTime: data
            })
        }

        if(prevState.currentDate !== this.state.currentDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giá trị giờ, phút, giây và mili giây về 0
            const todayTimestamp = today.getTime();

            // Kiểm tra xem timestamp có phải là ngày hôm nay hay không
            const timestamp = new Date(this.state.currentDate).getTime() // 2022-05-07
            if (timestamp >= todayTimestamp && timestamp < todayTimestamp + 86400000) {
                let data = this.props.allScheduleTime;
                if(data && data.length > 0) {
                    data = data.map(item => ({
                        ...item,
                        isSelected: false,
                    }))
                }
                this.setState({
                    rangeTime: this.checkTime(data),
                })
            } else {
                let data = this.props.allScheduleTime;
                this.setState({
                    rangeTime: data,
                })
            }
        }

    }

    
    toggleUserModal = () => {
        this.setState({
            isOpenModal: !this.state.isOpenModal,
        })
    }
    getDataPatient = async () => {
        let {user} = this.props
        let {currentDate} = this.state
        let formatedDate = new Date(currentDate).getTime()

        let res = await getListPatientForOneDoctorService({
            doctorId: user.id,
            date: formatedDate
        })
        if(res && res.errCode === 0){
            this.setState({
                dataPatient: res.data
            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currentDate: date[0]
        }
        , async () => {
            await this.getDataPatient()
        })

    }

    handleClickBtnTime = (time) => {
        let {rangeTime} = this.state;

        if(rangeTime && rangeTime.length > 0) {
            let data = rangeTime.map(item => {
                if(item.id === time.id) {
                    item.isSelected = !item.isSelected;
                }
                return item;
            })
            this.setState({
                rangeTime: data,
              });
        }
    }

    handleSaveSchedule = async () => {
        let {rangeTime, currentDate, selectedDoctor} = this.state;
        let { user } = this.props;
        let result = [];
        if(!currentDate) {
            toast.error('Invalid date!');
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {}
                    object.doctorId = user.id;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })
            } else {
                toast.error('Invalid selected time!');
                return;
            }
        }

        let res = await saveBulkSchecduleDoctorService({
            arrSchedule: result,
            doctorId: user.id,
            date: formatedDate
        })

        if(res && res.errCode === 0) {
            toast.success('Save info successfully');
        } else {
            toast.error('Error saving');
        }

    }
    
    handleOpenModal = async (item) => {
        this.setState({
            isOpenModal: true,
            bookingData: item
        })
    }

    render() {
        const { listDoctors, selectedDoctor, currentDate, rangeTime, dataPatient, patientInfor, checkToday} = this.state;
        const { language, user} = this.props;
        let nameVi, nameEn
        if(user) {
            nameVi = `${user.lastName} ${user.firstName}`;
            nameEn = `${user.firstName} ${user.lastName}`;
        }
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title"/>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6'>
                            <div><FormattedMessage id="manage-schedule.choose-doctor"/></div>
                            <div className='doctor-infor'>
                                {language=== LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            
                            {/* <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            /> */}
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-date"/></label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                // value = {this.state.currentDate}
                                value={currentDate}
                                minDate={yesterday}

                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                        <div className='col-12' style={{marginLeft: '-15px'}}><FormattedMessage id="manage-schedule.choose-schedule"/></div>
                        
                            {rangeTime && rangeTime.length > 0 ?
                                rangeTime.map((item, index)=>{
                                    return(
                                        <button 
                                            className={item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'}
                                            key={index}
                                            onClick={()=>this.handleClickBtnTime(item)}
                                            >
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                                :
                                <div className='pick-hour-container-no-schedule'>Đã quá giờ để chọn lịch cho ngày hôm nay</div>
                            }
                            
                        </div>

                        <div className='col-12'>
                            <button 
                                className={checkToday === true ? 'btn btn-primary btn-save-schedule' : 'btn btn-primary btn-save-disable'}
                                onClick={()=>this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='manage-patient-container'>
                    
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 m-p-title' style={{margin: '10px 0 10px 0'}}>
                                Quản lý lịch khám bệnh nhân
                            </div>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày</label>
                                <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={currentDate}

                                    />
                            </div>
                            <div className='col-12 table-manage-patient'>
                            <table style={{width:'100%', borderCollapse: 'collapse'}}>
                                <tbody>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Thao tác</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ? 
                                        dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI ? 
                                            item['timeTypeData.valueVi'] : item['timeTypeData.valueEn']
                                            return(
                                            <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>{time}</td>
                                            <td><button className='btn btn-primary'
                                                    onClick={() => this.handleOpenModal(item)}
                                                >Xem chi tiet
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
                            <ModalBookingInfo
                                isOpen = {this.state.isOpenModal}
                                toggle = {this.toggleUserModal}
                                bookingData = {this.state.bookingData}
                            />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
