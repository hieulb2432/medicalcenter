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
import {getFilterUser, getAllCodeService} from '../../../services/userService'
import _ from 'lodash';
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);



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
            listRole: []
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux()
        
        let res = await getFilterUser({
            role: 'ALL'
        })

        let resRole = await getAllCodeService('ROLE')
        if(res && res.errCode === 0 && resRole && resRole.errCode === 0) {
            let arr = res.roleUser
            let arrUserId = arr
            // if(arr && !_.isEmpty(res.roleUser)){
            //     if(arr && arr.length>0){
            //         arr.map(item => {
            //             arrUserId.push(item.id)
            //         })
            //     }
            // }

            let dataRole = resRole.data
            if(dataRole && dataRole.length>0){
                dataRole.unshift({
                    createdAt: null,
                    keyMap: 'ALL',
                    type: 'ROLE',
                    valueVi: 'Tất cả',
                    valueEn: 'ALL',
                    });
            }
            this.setState({
                usersRedux: arrUserId,
                listRole: dataRole ? dataRole : []
            })
        }
        
    }

    handleOnChangeSelect = async (e) => {
            let role = e.target.value
            let res = await getFilterUser({
                role: role
            })
            
            if(res && res.errCode === 0) {
                this.setState({
                    usersRedux: res.roleUser,
                })
            }
        
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
        let {language} = this.props
        let {startIndex, endIndex, arrUser, listRole} = this.state
        console.log('check', arrUsers)
        return (
            <React.Fragment>
               {/* <div className='search-sp-user'>
                        <select onChange={(e)=> this.handleOnChangeSelect(e)}>
                            {listRole && listRole.length > 0 &&
                            listRole.map((item, index) =>{
                                return (
                                <option key={index} value={item.keyMap}>
                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                </option>
                                )
                            })
                            }
                        </select>
                </div> */}

                    <table id="TableManageUser">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Email</th>
                                <th>Họ và tên</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Vai trò
                                    <div className='search-sp-user'>
                                            <select onChange={(e)=> this.handleOnChangeSelect(e)}>
                                                {listRole && listRole.length > 0 &&
                                                listRole.map((item, index) =>{
                                                    return (
                                                    <option key={index} value={item.keyMap}>
                                                        {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                    </option>
                                                    )
                                                })
                                                }
                                            </select>
                                    </div>
                                </th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrUsers && arrUsers.length > 0 && arrUsers.slice(startIndex, endIndex + 1).map((user, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{user.email}</td>
                                        <td>{user.lastName} {user.firstName}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>{user.address}</td>
                                        <td>{user['roleData.valueVi']}</td>
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
                                </React.Fragment>
                
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
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
