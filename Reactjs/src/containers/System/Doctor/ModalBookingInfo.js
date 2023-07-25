import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {getInforUserBooking} from '../../../services/userService'
import {getScheduleCancelService} from '../../../services/userService'
import _ from 'lodash';
import { toast } from 'react-toastify';

class ModalBookingInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
            isUpdate: false
        };
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
      if(prevProps.bookingData!== this.props.bookingData){
        let item = this.props.bookingData
        const data = await getInforUserBooking(item.doctorId, item.date, item.timeType)
        this.setState({
            patientInfor: data
          })
      }
      if(prevState.isUpdate !== this.state.isUpdate){
        let item = this.props.bookingData
        const data = await getInforUserBooking(item.doctorId, item.date, item.timeType)
        this.setState({
            patientInfor: data
          })
      }
    }
    
    cancelBooking = async () => {
      let res = await getScheduleCancelService({
        doctorId:  this.props.bookingData.doctorId,
        date:  this.props.bookingData.date,
        timeType:  this.props.bookingData.timeType
      })

      if(res && res.errCode === 0) {
        this.setState({
          isUpdate: true
        })
        toast.success('Cancel booking succeed!');
        // this.props.closeBookingModal();
      } else {
          toast.error('Cancel booking error!');
      }
    }

    render() {
        const { isOpen, toggle, bookingData, doctorId, date, timeType} = this.props;
        const {patientInfor} = this.state;
        return (
          <Modal
            isOpen={this.props.isOpen}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
          >
            <ModalHeader toggle={toggle}>Chi tiết lịch</ModalHeader>
            <ModalBody>
              <div className='col-12 table-manage-patient'>
                        <table style={{width:'100%'}}>
                            <tbody>
                                <tr>
                                    <th>STT</th>
                                    <th>ID Bệnh nhân</th>
                                    <th>Ten</th>
                                    <th>Email</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                </tr>
                                {patientInfor && patientInfor.data.length > 0 ? 
                                    patientInfor?.data.map((item, index) => {
                                        return(
                                        <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.patientId}</td>
                                        <td>{item['patientData.firstName']}</td>
                                        <td>{item['patientData.email']}</td>
                                        <td>{item['timeTypeDataPatient.valueVi']}</td>
                                        <td>{item['statusIdData.valueVi']}</td>
                                    </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan='6' style={{textAlign: "center"}}>
                                        Lịch chưa được đặt
                                    </td>
                                </tr>
                            }
                                
                            </tbody>
                        </table>
                        </div>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" className="px-3" 
              onClick={this.cancelBooking}
              >
                Hủy lịch
              </Button>{' '}
              <Button className="px-3" onClick={toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBookingInfo);
