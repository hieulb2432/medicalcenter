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
import {createNewClinic} from '../../../services/userService'

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
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
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

          handleSaveClinic = async () => {
            let res = await createNewClinic(this.state)
            if(res && res.errCode === 0) {
                toast.success('Thêm mới thành công!');
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    descriptionHTML: '',
                    descriptionMarkdown: '',
                })
                this.props.toggle()
            } else {
                toast.error('Thêm mới thất bại');
                console.log(res);
            }
        }
    // handleSaveClinic = () => {
    // let isValid = this.checkValidateInput();
    // if(isValid == false) return;

    // // let action = this.state.action
    // // console.log('check ac tion', action)
    // // if (action === CRUD_ACTION.CREATE) {
    //         // fire redux create user 
    //         this.props.createNewUser({
    //             email: this.state.email,
    //             password: this.state.password,
    //             firstName: this.state.firstName,
    //             lastName: this.state.lastName,
    //             address: this.state.address,
    //             phoneNumber: this.state.phoneNumber,
    //             gender: this.state.gender,
    //             roleId: this.state.role,
    //             positionId: this.state.position,
    //             avatar: this.state.avatar,
    //         })

    //         this.props.toggle()
    //     // }
    // }

    // checkValidateInput = () => {
    // let isValid = true;
    // let arrCheck = [
    //     'email',
    //     'password',
    //     'firstName',
    //     'lastName',
    //     'phoneNumber',
    //     'address',
    // ];
    // for (let i = 0; i < arrCheck.length; i++) {
    //     if (!this.state[arrCheck[i]]) {
    //     isValid = false;
    //     alert('This input is required: ' + arrCheck[i]);
    //     break;
    //     }
    // }
    // return isValid;
    // };
    

    // onChangeInput = (event, id) => {
    //     let copyState = {...this.state}
    //     copyState[id] = event.target.value;
    //     this.setState({
    //         ...copyState,
    //     })
    // }

    render() {
        const { toggle } = this.props;
        return (
          <Modal
            isOpen={this.props.isOpenModal}
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
        genderRedux: state.admin.genders,
        roleRedux: state.admin.roles,
        positionRedux: state.admin.positions,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAddNewClinic);
