import React, { Component } from 'react';
// import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import _ from 'lodash';
import moment from 'moment';
import {getAllCodeService} from '../../../services/userService';
import {CommonUtils, LANGUAGES} from '../../../utils'
import './Prescription.scss';


class PrescriptionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: '',
            patientName: '',
            patientAddress: '',
            diagnostic: '',
            doctorAdvice: '',
            data: [
                { stt: 1, drugId: '', drugName: '', quantity: '', note: '', actions: null },
                { stt: 2, drugId: '', drugName: '', quantity: '', note: '', actions: null },
                { stt: 3, drugId: '', drugName: '', quantity: '', note: '', actions: null },
              ],
            selectedDrugInfo: {},
        }
    }

    async componentDidMount() {
        if(this.props.dataPrescriptionModal){
            this.setState({
                email: this.props.dataPrescriptionModal.email,
                patientName: this.props.dataPrescriptionModal.patientName,
                patientAddress: this.props.dataPrescriptionModal.patientAddress,
            })
        }

        let resDrug = await getAllCodeService('DRUG')
        if(resDrug && resDrug.errCode === 0) {
            let dataDrug = resDrug.data
            this.setState({
                listDrug: dataDrug ? dataDrug : []
            })}
    }


    componentDidUpdate(prevProps, prevState, snapshots) {
        if(this.props.dataPrescriptionModal !== prevProps.dataPrescriptionModal){
            this.setState({
                email: this.props.dataPrescriptionModal.email,
                patientName: this.props.dataPrescriptionModal.patientName,
                patientAddress: this.props.dataPrescriptionModal.patientAddress,
            })
        }

    }

    handleAddRow = () => {
        this.setState(prevState => ({
          data: [
            ...prevState.data,
            { stt: prevState.data.length + 1, drugId: '', drugName: '', quantity: '', note: '', actions: ''  },
          ],
        }));
      };

    handleRemoveRow = (index) => {
        this.setState(prevState => {
            const newData = [...prevState.data];
            newData.splice(index, 1);
            return { data: newData };
        });
    };

    handleInputChange = (index, field, value) => {
        this.setState(prevState => {
            const newData = [...prevState.data];
            newData[index][field] = value;
            return { data: newData };
        });
    };

    handleOnChangeInput = (event, id) => {
        let stateCopy = {...this.state}
        stateCopy[id]= event.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64,
          });
        }
    };    

    createNewPrescription = () => {
        this.props.createPrescription(this.state)
    }

    handleDrugCodeChange = (index, value) => {
        let { language } = this.props;
        let { listDrug } = this.state;
        // Tìm thông tin thuốc tương ứng với mã thuốc đã chọn
        const selectedDrug = listDrug.find(drug => drug.keyMap === value);
        if (selectedDrug) {
            // Nếu tìm thấy, cập nhật state selectedDrugInfo với thông tin tương ứng
            this.setState(prevState => {
                const newData = [...prevState.data];
                newData[index].drugId = value;
                newData[index].drugName = language === LANGUAGES.VI ? selectedDrug.valueVi: selectedDrug.valueEn
                return { 
                    data: newData,
                    selectedDrugInfo: { ...prevState.selectedDrugInfo, [value]: newData[index].drugName }, // Lưu thông tin vào selectedDrugInfo
                };
            });
        }
    };

    render() {
        let {isOpenModal, closePrescriptionModal, dataPrescriptionModal, language} = this.props;
        let { data, listDrug, selectedDrug, selectedDrugInfo } = this.state;
        console.log(selectedDrugInfo);
        return (
            <Modal 
                isOpen={isOpenModal} 
                className={'booking-modal-container'}
                size='lg'
                centered
            >
                <div className='modal-header'>
                    <h5 className="modal-title">Tạo phiếu khám bệnh và cấp thuốc</h5>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true" onClick={closePrescriptionModal}>×</span>
                    </button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-12 content-up'>
                            <div style={{fontSize: '15px', fontWeight: 'bold'}}>Thông tin bệnh nhân</div>
                            <div className='patient-name' style={{display: 'flex'}}>
                                <div className='col-3'>Họ tên bệnh nhân</div>
                                <div className='col-9'>{this.state.patientName}</div>
                            </div>
                            <div className='patient-email' style={{display: 'flex'}}>
                                <div className='col-3'>Địa chỉ email</div>
                                <div className='col-9'>{this.state.email}</div>
                            </div>
                            <div className='patient-address' style={{display: 'flex'}}>
                                <div className='col-3'>Địa chỉ cụ thể</div>
                                <div className='col-9'>{this.state.patientAddress}</div>
                            </div>
                        </div>
                        <div className='col-12 content-midle mt-3'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Chẩn đoán và kê đơn</div>
                            <div className='col-12 form-group'>
                                <label>Chẩn đoán <span style={{color: 'red'}}>*</span></label>
                                <input className='form-control' type='text'
                                    value={this.state.diagnostic}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'diagnostic')}
                                ></input>
                            </div>
                            <div className='col-12'>Kê đơn thuốc</div>
                                <div className='col-12'>
                                <table className="prescription-table">
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã thuốc</th>
                                        <th>Tên thuốc</th>
                                        <th>Số lượng</th>
                                        <th>Chú thích</th>
                                        <th>Thao tác</th>
                                    </tr>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                        <td>{item.stt}</td>
                                        <td>
                                            <select
                                                value={item.drugId}
                                                onChange={(e) => this.handleDrugCodeChange(index, e.target.value)}
                                            >
                                                <option value="">Chọn mã thuốc</option>
                                                {listDrug && listDrug.length> 0 && listDrug.map((item, index) => (
                                                    <option key={index} value={item.keyMap}>
                                                        {item.keyMap}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            {/* Hiển thị tên thuốc tương ứng từ state */}
                                            {this.state.selectedDrugInfo[item.drugId] || ''}
                                        </td>
                                        <td>
                                            <input value={item.quantity} onChange={(e) => this.handleInputChange(index, 'quantity', e.target.value)} />
                                        </td>
                                        <td>
                                            <input value={item.note} onChange={(e) => this.handleInputChange(index, 'note', e.target.value)} />
                                        </td>
                                        <td>
                                            <div style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => this.handleRemoveRow(index)}><i class="fas fa-trash-alt"></i></div>
                                        </td>
                                        </tr>
                                    ))}
                                </table>
                                <Button className='mt-3' color="primary" variant="contained" onClick={this.handleAddRow}>+ Thêm hàng</Button>
                                </div>
                        </div>
                        <div className='col-12 content-down mt-3'>
                        <div style={{fontSize: '15px', fontWeight: 'bold'}}>Lời dặn bác sĩ</div>
                            <div className='col-12 form-group'>
                                <label>Lời dặn</label>
                                <input className='form-control' type='text'
                                    value={this.state.doctorAdvice}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'doctorAdvice')}
                                ></input>
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>this.createNewPrescription()}><label style={{marginBottom: '0'}}>Lưu</label></Button>{' '}
                    <Button color="primary" onClick={()=>this.handleSendRemedy()}><label style={{marginBottom: '0'}}>In phiếu</label></Button>{' '}
                    <Button color="secondary" onClick={closePrescriptionModal}><label style={{marginBottom: '0'}}>Hủy</label></Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrescriptionModal);
