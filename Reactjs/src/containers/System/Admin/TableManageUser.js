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
            startIndex: 0,
            endIndex: 12,
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
        handleNextPage = () => {
            const { endIndex } = this.state;
            let arrUsers = this.state.usersRedux
            console.log('handle', arrUsers)
            const newEndIndex = Number(Math.min(+endIndex + 13, +arrUsers.length - 1));
            
            this.setState({
              startIndex: endIndex + 1,
              endIndex: newEndIndex,
            });
          };
    
          handlePrevPage = () => {
            const { startIndex } = this.state;
            const newStartIndex = Math.max(startIndex - 13, 0);
            const newEndIndex = startIndex - 1;
        
            this.setState({
              startIndex: newStartIndex,
              endIndex: newEndIndex,
            });
          };

    render() {
        let arrUsers = this.state.usersRedux
        let {startIndex, endIndex} = this.state
        return (
            <React.Fragment>
               
                    <table id="TableManageUser">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.length > 0 && arrUsers.slice(startIndex, endIndex + 1).map((user, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
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
                    <div className="pagination mt-3">
                        <button href="#" 
                        className={arrUsers? "previous round mr-3": "previous round mr-3 disable"} 
                        onClick={this.handlePrevPage} disabled={startIndex === 0}>&#8249;</button>
                        
                        <button href="#" className={arrUsers? "next round": "next round disable" }
                            onClick={this.handleNextPage} 
                            disabled={arrUsers && endIndex >= arrUsers.length -1}
                            >&#8250;</button>
                    </div>
                    
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
