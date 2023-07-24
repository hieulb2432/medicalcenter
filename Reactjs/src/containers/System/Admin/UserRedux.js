import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils'
import * as actions from '../../../store/actions'
import TableManageUser from './TableManageUser';
import ModalAddNewUser from './ModalAddNewUser';
import ModalEditUser from './ModalEditUser';
import '../../System/UserManage.scss';

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
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
            image: '',

            action: '',
            userEditId: '',
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            currentUser: {},
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

        // if(prevProps.listUsers !== this.props.listUsers) {
        //     let arrGenders = this.props.genderRedux;
        //     let arrRoles = this.props.roleRedux;
        //     let arrPositions = this.props.positionRedux;

        //     this.setState({
        //         email: '',
        //         password: '',
        //         firstName: '',
        //         lastName: '',
        //         phoneNumber: '',
        //         address: '',
        //         gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
        //         role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
        //         position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
        //         // avatar: '',
        //         image: '',
        //         previewImgURL: '',
        //         action: CRUD_ACTION.CREATE,
        //     })
        // }
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
            image: this.state.image
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
    

      handleEditUserFromParent = (user) => {
        this.setState({
            isOpenModalEditUser: true
        })
        this.setState({currentUser: user})
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
        let {isOpenModalUser} = this.state;
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
                            {isOpenModalUser &&
                            <ModalAddNewUser
                                isOpenModal = {this.state.isOpenModalUser}
                                toggle = {this.toggleUserModal}
                                handleSaveUser = {this.handleSaveUser}
                                
                            />}

                            <div className='mb-3'>
                                <TableManageUser 
                                    handleEditUserFromParent={this.handleEditUserFromParent}
                                    action={this.state.action}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isOpenModalEditUser && 
                <ModalEditUser
                    isOpenModal = {this.state.isOpenModalEditUser}
                    toggle = {this.toggleEditUserModal}
                    user = {this.state.currentUser}
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
