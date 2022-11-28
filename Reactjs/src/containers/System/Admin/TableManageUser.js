import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './TableManageUser.scss';


class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState(
                {usersRedux: this.props.listUsers
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }


    render() {
        console.log('check list users',this.state.listUsers)
        console.log('check list state',this.state.usersRedux)
        let arrUsers = this.state.usersRedux
        return (
                    <table id="TableManageUser">
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
                            {arrUsers && arrUsers.length > 0 && arrUsers.map((user, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => {
                                                    this.handleEditUser(user);
                                                }}
                                                >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteUser(user)}
                                                >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                
        );
    }

}

const mapStateToProps = state => {
    return {
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
