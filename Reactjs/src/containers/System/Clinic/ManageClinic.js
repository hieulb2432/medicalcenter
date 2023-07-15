import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import {CommonUtils} from '../../../utils'
import {getAllClinicService, handleDeleteClinic} from '../../../services/userService'
import './ManageClinic.scss';
import ModalAddNewClinic from './ModalAddNewClinic';
import ModalEditClinic from './ModalEditClinic';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenNewClinic: false,
            isOpenEditClinic: false,
            dataClinic: {},
            currentClinic: {}
        }
    }

    async componentDidMount() {
        this.getAllClinic()
    }

    componentDidUpdate(prevProps, prevState, snapshots) {

    }

    // handleSaveClinic = () => {
    //     let isValid = this.checkValidateInput();
    //     if(isValid == false) return;

    //     let action = this.state.action
    //     if (action === CRUD_ACTION.CREATE) {
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

            
    //     }

    //     if (action === CRUD_ACTION.EDIT) {
    //         // fire redux edit user
    //         this.props.editUserRedux({
    //             id: this.state.userEditId,
    //             email: this.state.email,
    //             password: this.state.password,
    //             firstName: this.state.firstName,
    //             lastName: this.state.lastName,
    //             address: this.state.address,
    //             phoneNumber: this.state.phoneNumber,
    //             gender: this.state.gender,
    //             roleId: this.state.role,
    //             positionId: this.state.position,
    //             avatar: this.state.avatar
    //         })
    //     }

    //   }

    handleDeleteUser = async (id) => {
        try {
            let res = await handleDeleteClinic(id)
            if (res && res.errCode === 0) {
                toast.success('Xóa thành công')
                await this.getAllClinicService();
              } else {
                toast.error(res.errMessage);
              }
        } catch (e) {
            console.log(e)
        }
    }

    handleAddNewClinic = () => {
        this.setState({
            isOpenNewClinic: true
        })
      }
      
    toggleClinicModal = () => {
            this.setState({
                isOpenNewClinic: !this.state.isOpenNewClinic,
            })
        }

        
    handleEditClinic = (clinic) => {
        this.setState({
            isOpenEditClinic: true
        })

        this.setState({currentClinic: clinic})
    }
        
    toggleClinicModalEdit = () => {
            this.setState({
                isOpenEditClinic: !this.state.isOpenEditClinic,
            })
        }
         
    getAllClinic = async () => {
        let res = await getAllClinicService()
        if(res && res.errCode === 0){
            this.setState({
                dataClinic: res.data
            })
        }
    }

    render() {
        let {dataClinic} = this.state
        console.log('check', dataClinic)
        return (
            <>
            <div className='title'>
                    Quản lý cơ sở y tế
                </div>
            <div className="col-12 my-3">
                    <button className="btn btn-primary px-3" onClick={()=>this.handleAddNewClinic()}>Thêm mới</button>
            </div>
                {this.state.isOpenNewClinic &&
                <ModalAddNewClinic
                    isOpenModal = {this.state.isOpenNewClinic}
                    toggle = {this.toggleClinicModal}
                    handleSaveUser = {this.handleSaveClinic}
                />
                }

                {this.state.isOpenEditClinic &&
                    <ModalEditClinic 
                    isOpenModalEdit = {this.state.isOpenEditClinic}
                    toggle = {this.toggleClinicModalEdit}
                    clinic = {this.state.currentClinic}
                />
                }

                <div className="col-12 my-3">
                    
                    <table id="TableManageUser">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên cơ sở y tế</th>
                                <th>Địa chỉ cơ sở y tế</th>
                                <th>Thông tin về cơ sở y tế</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataClinic && dataClinic.length > 0 && dataClinic.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
                                        <td>{item.descriptionHTML}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => {
                                                    this.handleEditClinic(item);
                                                }}
                                                >
                                                <i className="fas fa-pencil-alt"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => this.handleDeleteUser(item.id)}
                                                >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
