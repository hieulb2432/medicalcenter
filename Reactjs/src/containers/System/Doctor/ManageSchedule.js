import React, { Component } from 'react';
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
import {saveBulkSchecduleDoctorService} from '../../../services/userService'

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: [],
            inDay: true
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
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
        if(prevProps.allDoctors !== this.props.allDoctors){
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect,
            });
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
                        isSelected: false
                    }))
                }
                this.setState({
                    rangeTime: this.checkTime(data)
                })
            } else {
                let data = this.props.allScheduleTime;
                this.setState({
                    rangeTime: data
                })
            }
        }

    }

    buildDataInputSelect = (inputData) => {
        let result = []
        let {language} = this.props;
        if(inputData && inputData.length > 0){
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                object.label = language === LANGUAGES.VI ? labelVi : labelEn 
                object.value = item.id;
                result.push(object);        
            });
        }
        return result
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor })
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({ 
            currentDate: date[0]
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
        let result = [];
        if(!currentDate) {
            toast.error('Invalid date!');
            return;
        }
        
        if(selectedDoctor && _.isEmpty(selectedDoctor)){
            toast.error('Invalid selected doctor!');
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        // let formatedDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER)
        if(rangeTime && rangeTime.length > 0) {
            // let currentTime = new Date()
            // let hours = currentTime.getHours()
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let object = {}
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                })
            } else {
                toast.error('Invalid selected time!');
                return;
            }
            console.log('check range time', rangeTime);
        }


        let res = await saveBulkSchecduleDoctorService({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formatedDate
        })

        if(res && res.errCode === 0) {
            toast.success('Save info successfully');
        } else {
            toast.error('Error saving');
            console.log('Error res',res)
        }

    }
    
    render() {
        const { listDoctors, selectedDoctor, currentDate, rangeTime } = this.state;
        const { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id="manage-schedule.title"/>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id="manage-schedule.choose-doctor"/></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
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
                            {rangeTime && rangeTime.length > 0 &&
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
                            }
                        </div>

                        <div className='col-12'>
                            <button 
                                className='btn btn-primary btn-save-schedule'
                                onClick={()=>this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
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
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
