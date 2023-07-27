import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { emitter } from '../../../utils/emitter';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalAddNewClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        };
    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = [
            'name',
            'address',
            'descriptionHTML',
            'imageBase64'
        ];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
            isValid = false;
            toast.error('Nhập thiếu trường ' + arrCheck[i]);
            break;
            }
        }
        return isValid;
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
            // let objectUrl = URL.createObjectURL(file);
            this.setState({
                imageBase64: base64,
            });
        }
        };
    
    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        });
        }

    handleSaveClinic = async () => {
        await this.props.fetchCreateNewClinic(this.state)
        let isValid = this.checkValidateInput();
        if(isValid == false) return;
        this.props.toggle()
    }

    render() {
        const { toggle } = this.props;
        return (
          <Modal
            isOpen={this.props.isOpenModal}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
            centered
          >
            <ModalHeader toggle={toggle}>Thêm mới cơ sở y tế</ModalHeader>
            <ModalBody>
              <div className="container">
                <div className='manage-specialty-container'>    
                    <div className='add-new-specialty row'>
                        <div className='col-6 form-group'>
                            <label>Tên cơ sở y tế <span style={{color: 'red'}}>*</span></label>
                            <input className='form-control' type='text'
                                value={this.state.name}
                                onChange={(event)=>this.handleOnChangeInput(event, 'name')}
                            ></input>
                        </div>
                        <div className='col-6 form-group'>
                            <label>Ảnh cơ sở y tế <span style={{color: 'red'}}>*</span></label>
                            <input className='form-control-file' type='file'
                                onChange={(event)=> this.handleOnChangeImage(event)}
                            ></input>
                        </div>
                        <div className='col-6 form-group'>
                            <label>Địa chỉ cơ sở y tế <span style={{color: 'red'}}>*</span></label>
                            <input className='form-control' type='text'
                                value={this.state.address}
                                onChange={(event)=>this.handleOnChangeInput(event, 'address')}
                            ></input>
                        </div>
                        <div className='col-12'>
                        <label>Thông tin cơ sở y tế <span style={{color: 'red'}}>*</span></label>
                            <MdEditor 
                            style={{ height: '400px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange} 
                            value={this.state.descriptionMarkdown}
                            />
                        </div>
                    </div>
                </div>
              </div>
            </ModalBody>
           
            <ModalFooter>
              <Button color="primary" className="px-3" onClick={this.handleSaveClinic}>
                Lưu
              </Button>{' '}
              <Button className="px-3" onClick={toggle}>
                Đóng
              </Button>
            </ModalFooter>
          
          </Modal>
        );
      }
    }

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allClinics: state.admin.allClinics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinicsStart: () => dispatch(actions.fetchAllClinicsStart()),
        fetchCreateNewClinic: (data) => dispatch(actions.fetchCreateNewClinic(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddNewClinic);
