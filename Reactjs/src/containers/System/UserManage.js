import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import {getAllUsers, createNewUserService, deleteUserService, editUserService} from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { get } from 'lodash';
import { emitter } from '../../utils/emitter';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false, 
            userEdit: {},
        }
    }

    async componentDidMount() {
       await this.getAllUsersFromReact();
    }
    
    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode ===0) {
            this.setState({
                arrUsers: response.users
            })
        }
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

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if(response && response.errCode !==0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                })

                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            
            }
            
        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (id) => {
        try {
            let res = await deleteUserService(id)
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
              } else {
                alert(res.errMessage);
              }
        } catch (e) {
            console.log(e)
        }
    }

    handleEditUser = async (user) => {
            this.setState({
                isOpenModalEditUser: true,
                userEdit: user,
            })
    }

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                })
                await this.getAllUsersFromReact();
            } else {
                alert(res.errCode)
            }
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        const { arrUsers, isOpenModalUser } = this.state;
        // let arrUsers = this.state.arrUsers;
        return (
            <div className="user-container">
                <ModalUser
                    isOpen = {this.state.isOpenModalUser}
                    toggle = {this.toggleUserModal}
                    createNewUser = {this.createNewUser}
                    
                />
                { 
                    this.state.isOpenModalEditUser &&
                        <ModalEditUser
                            isOpen = {this.state.isOpenModalEditUser}
                            toggle = {this.toggleUserEditModal}
                            currentUser = {this.state.userEdit}
                            editUser = {this.doEditUser}
                        />
                }
                <div className="title text-center">Manage users</div>
                <div className='mx-1'>
                    <button 
                    className='btn btn-primary px-3'
                    onClick={() => this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus"></i> Add new user</button>
                </div>
                <div className="users-table mt-3 mx-1">
                    <table id="customers">
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers?.map((user, index) => (
                                <tr key={index}>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.address}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => this.handleEditUser(user)}>
                                    <i className="fas fa-pencil-alt"></i>
                                    </button>
                                    <button className="btn-delete" onClick={() => this.handleDeleteUser(user.id)}>
                                    <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
