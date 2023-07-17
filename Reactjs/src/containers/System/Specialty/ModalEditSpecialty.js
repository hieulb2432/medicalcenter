import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../../utils/emitter';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalEditSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.specialty.id,
            name: this.props.specialty.name,
            imageBase64: this.props.specialty.image,
            descriptionHTML: this.props.specialty.descriptionHTML,
            descriptionMarkdown: this.props.specialty.descriptionMarkdown,
            // previewImgURL: Buffer.from(this.props.specialty.image, 'base64').toString('binary')
        };
    }


    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        
    }

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

    handleSaveSpecialty = async () => {
        await this.props.editSpecialty(this.state)
        let isValid = this.checkValidateInput();
        if(isValid == false) return;
        this.props.toggle()
    }

    checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
        'name',
        'descriptionHTML',
        'imageBase64'
    ];
    for (let i = 0; i < arrCheck.length; i++) {
        if (!this.state[arrCheck[i]]) {
        isValid = false;
        toast.error('Nhập thiếu trường: ' + arrCheck[i]);
        break;
        }
    }
        return isValid;
    };

    render() {
        const { toggle } = this.props;
        // console.log(this.state.imageBase64, this.state.previewImgURL)
        return (
          <Modal
            isOpen={this.props.isOpenModalEdit}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
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
                            <input 
                                id="previewImg"
                                type="file"
                                // hidden
                                className="form-control"
                                onChange={(event) => this.handleOnChangeImage(event)}
                                // value={this.state.previewImgURL}
                            >
                            </input>
                            {/* <label htmlFor='previewImg' className="label-upload">
                                Tải ảnh
                                <i className="fas fa-upload"></i>
                            </label> */}
                            {/* <div className='preview-image'
                                style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                            > abcbcbcc</div> */}
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
              <Button color="primary" className="px-3" onClick={this.handleSaveSpecialty}>
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
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialtyStart: () => dispatch(actions.fetchAllSpecialtyStart()),
        editSpecialty: (data) => dispatch(actions.editSpecialty(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditSpecialty);
