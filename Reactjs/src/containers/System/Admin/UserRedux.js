import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import TableManageUser from './TableManageUser';
import { emitter } from '../../../utils/emitter';
import ModalAddNewUser from './ModalAddNewUser';
import ModalEditUser from './ModalEditUser';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false, // Xem prview ảnh

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            user: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ''
            })
        }

        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : ''
            })
        }

        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : ''
            })
        }

        if(prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrRoles = this.props.roleRedux;
            let arrPositions = this.props.positionRedux;

            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
                avatar: '',
                previewImgURL: '',
                action: CRUD_ACTION.CREATE,
            })
        }
    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: base64,
          });
        }
      };    

      openPreviewImage = () => {
        if(!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        })
      }

      handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid == false) return;

        let action = this.state.action
        if (action === CRUD_ACTION.CREATE) {
            // fire redux create user 
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar,
            })

            
        }

        if (action === CRUD_ACTION.EDIT) {
            // fire redux edit user
            this.props.editUserRedux({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
                gender: this.state.gender,
                roleId: this.state.role,
                positionId: this.state.position,
                avatar: this.state.avatar
            })
        }

      }

      checkValidateInput = () => {
        let isValid = true;
        let arrCheck = [
          'email',
          'password',
          'firstName',
          'lastName',
          'phoneNumber',
          'address',
        ];
        for (let i = 0; i < arrCheck.length; i++) {
          if (!this.state[arrCheck[i]]) {
            isValid = false;
            alert('This input is required: ' + arrCheck[i]);
            break;
          }
        }
        return isValid;
      };
    

      onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        })
      }

      handleEditUserFromParent = (user) => {
        this.setState({
            isOpenModalEditUser: true
        })
        this.setState({user: user})
        // let imageBase64 = '';
        // if (user.image) {
        // imageBase64 = Buffer.from(user.image, 'base64').toString('binary');
        // }
        // this.setState({
        //     email: user.email,
        //     password: 'HASHCODE',
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     phoneNumber: user.phoneNumber,
        //     address: user.address,
        //     gender: user.gender,
        //     role: user.roleId,
        //     position: user.positionId,
        //     avatar: '',
        //     previewImgURL: imageBase64,
        //     action: CRUD_ACTION.EDIT,
        //     userEditId: user.id
        // })
      }

      handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
      }
      
      toggleUserModal = () => {
            this.setState({
                isOpenModalUser: !this.state.isOpenModalUser,
            })
        }

        toggleEditUserModal = () => {
            this.setState({
                isOpenModalEditUser: !this.state.isOpenModalEditUser,
            })
        }
    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGender = this.props.isLoadingGender;
        let {
            previewImgURL,
            isOpen,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            role,
            position,
            isOpenModalUser
          } = this.state;

        return (
            <div className='user-redux-container' style={{width: '100%'}}>
                <div className="user-top mr-3 ml-3 mt-3" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='user-title' style={{color: '#ff5400'}}>
                        Quản lý người dùng
                    </div>
                    
                    <div className='ml-12'>
                                <button className='btn btn-primary px-3' style={{marginBottom: '10px'}} 
                                        onClick={() => this.handleAddNewUser()}>
                                <i className="fas fa-plus"></i> Thêm mới</button>
                            </div>

                </div>

                <div className="user-redux-body" >
                    <div className=''>
                        <div className='col-12'>
                            {/* <div className='col-12 my-3'>{isGetGender === true ? 'Loading gender' : ''}</div> */}
                            {/* <div className='col-12 my-3'><FormattedMessage id="manage-user.add"/></div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.email"/></label>
                                <input className='form-control' type='email' 
                                    value={email}
                                    onChange={(event)=>{this.onChangeInput(event, 'email')}}
                                    disabled={this.state.action === CRUD_ACTION.EDIT ? true : false}
                                ></input>
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.password"/></label>
                                <input className='form-control' type='password'
                                    value={password}
                                    onChange={(event)=>{this.onChangeInput(event, 'password')}}
                                    disabled={this.state.action === CRUD_ACTION.EDIT ? true : false}
                                ></input>
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.first-name"/></label>
                                <input className='form-control' type='text'
                                    value={firstName}
                                    onChange={(event)=>{this.onChangeInput(event, 'firstName')}}
                                ></input>
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.last-name"/></label>
                                <input className='form-control' type='text'
                                    value={lastName}
                                    onChange={(event)=>{this.onChangeInput(event, 'lastName')}}
                                ></input>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number"/></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber}
                                    onChange={(event)=>{this.onChangeInput(event, 'phoneNumber')}}
                                ></input>
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address"/></label>
                                <input className='form-control' type='text'
                                    value={address}
                                    onChange={(event)=>{this.onChangeInput(event, 'address')}}
                                ></input>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender"/></label>
                                    <select className="form-control"
                                        onChange={(event)=>{this.onChangeInput(event, 'gender')}}
                                        value={gender}
                                    >
                                        {genders && genders.length > 0 && genders.map((item, index) => {
                                            return (
                                                <option key = {index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                            )
                                        })}                                        
                                    </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.role"/></label>
                                    <select className="form-control"
                                        onChange={(event)=>{this.onChangeInput(event, 'role')}}
                                        value={role}
                                    >
                                        {roles && roles.length > 0 && roles.map((item, index) => {
                                            return (
                                                <option key = {index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                            )
                                        })}
                                    </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position"/></label>
                                    <select className="form-control"
                                        onChange={(event)=>{this.onChangeInput(event, 'position')}}
                                        value={position}
                                    >
                                        {positions && positions.length > 0 && positions.map((item, index) => {
                                            return (
                                                <option key = {index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                            )
                                        })}
                                    </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image"/></label>
                                <div className='preview-img-container'>
                                    <input 
                                        id="previewImg"
                                        type="file"
                                        hidden
                                        className="form-control"
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    >
                                    </input>
                                    <label htmlFor='previewImg' className="label-upload">
                                        Tải ảnh
                                        <i className="fas fa-upload"></i>
                                    </label>
                                    <div className='preview-image'
                                        style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                                        onClick={()=> this.openPreviewImage()}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button className={this.state.action === CRUD_ACTION.EDIT ? "btn btn-warning" : 'btn btn-primary'}
                                    onClick={()=> this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTION.EDIT ? 
                                    <FormattedMessage id="manage-user.edit"/>
                                    : 
                                    <FormattedMessage id="manage-user.save"/>}
                                </button>
                            </div> */}
                            {isOpenModalUser &&
                            <ModalAddNewUser
                                isOpenModal = {this.state.isOpenModalUser}
                                toggle = {this.toggleUserModal}
                                handleSaveUser = {this.handleSaveUser}
                                
                            />}

                            {/* <div className='col-12 ml-12' style={{display: 'flex', flexFlow: 'row-reverse'}}>
                                <button className='btn btn-primary px-3' style={{marginBottom: '10px'}} 
                                        onClick={() => this.handleAddNewUser()}>
                                <i className="fas fa-plus"></i> Thêm mới</button>
                            </div> */}

                            <div className='mb-3'>
                                <TableManageUser 
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* {this.state.isOpen === true && (
                <Lightbox
                    mainSrc={this.state.previewImgURL}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />
                )} */}
                {this.state.isOpenModalEditUser && 
                <ModalEditUser
                    isOpenModal = {this.state.isOpenModalEditUser}
                    toggle = {this.toggleEditUserModal}
                    // handleEditUser = {this.handleEditUser}
                    handleEditUserFromParent={this.handleEditUserFromParent}
                    user = {this.state.user}
                />}
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
