import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import {getAllUsers} from '../../services/userService';
import ModalUser from './ModalUser';


class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
        }
    }

    async componentDidMount() {
        let response = await getAllUsers('ALL');
        if (response && response.errCode ===0) {
            this.setState({
                arrUsers: response.users
            })
        }
        console.log('get user', response);
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

    render() {
        const { arrUsers, isOpenModalUser } = this.state;
        // let arrUsers = this.state.arrUsers;
        return (
            <div className="user-container">
                <ModalUser
                    isOpen = {this.state.isOpenModalUser}
                    toggle = {this.toggleUserModal}
                />
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
                                    <button className="btn-edit">
                                    <i className="fas fa-pencil-alt"></i>
                                    </button>
                                    <button className="btn-delete">
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
