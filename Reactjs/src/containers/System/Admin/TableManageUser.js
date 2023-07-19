import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import './TableManageUser.scss';
import {LANGUAGES, CRUD_ACTION, CommonUtils} from '../../../utils';
import ModalEditUser from './ModalEditUser';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}


class TableManageUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usersRedux: [],
            action: '',
            isOpenModalUser: false,
            previewImgURL: '',
            isOpen: false, // Xem prview ảnh
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

    // handleEditUser = (user) => {
    //     this.props.handleEditUserFromParent(user)
    // }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid == false) return;
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

    
      handleEditUser = (user) => {
        // this.setState({
        //     isOpenModalUser: true
        // })
        this.props.handleEditUserFromParent(user)
      }
      
      toggleUserModal = () => {
            this.setState({
                isOpenModalUser: !this.state.isOpenModalUser,
            })
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

        // handleEditUserFromParent = (user) => {
        //     let imageBase64 = '';
        //     if (user.image) {
        //     imageBase64 = Buffer.from(user.image, 'base64').toString('binary');
        //     }
        //     this.setState({
        //         email: user.email,
        //         password: 'HASHCODE',
        //         firstName: user.firstName,
        //         lastName: user.lastName,
        //         phoneNumber: user.phoneNumber,
        //         address: user.address,
        //         gender: user.gender,
        //         role: user.roleId,
        //         position: user.positionId,
        //         avatar: '',
        //         previewImgURL: imageBase64,
        //         action: CRUD_ACTION.EDIT,
        //         userEditId: user.id
        //     })
        //   }


    render() {
        let arrUsers = this.state.usersRedux
        let {isOpenModalUser} = this.state
        return (
            <React.Fragment>
               
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
                                        {/* {isOpenModalUser &&
                                            <ModalEditUser
                                                isOpenModal = {this.state.isOpenModalUser}
                                                toggle = {this.toggleUserModal}
                                                handleEditUser = {this.handleEditUser}
                                                handleEditUserFromParent={this.handleEditUserFromParent}
                                            />
                                        } */}
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
               
                    
                    {/* <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} /> */}
            </React.Fragment>
                
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
