import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import {CommonUtils} from '../../../utils'
import {createNewSpecialty} from '../../../services/userService'
import * as actions from '../../../store/actions';
import './ManageSpecialty.scss';
import ModalAddNewSpecialty from './ModalAddNewSpecialty';
import ModalEditSpecialty from './ModalEditSpecialty';


const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenNewSpecialty: false,
            isOpenEditSpecialty: false,
            dataSpecialty: {},
            currentSpecialty: {},
        }
    }

    async componentDidMount() {
        this.props.fetchAllSpecialtyStart();
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        if(prevProps.allSpecialty !== this.props.allSpecialty){
            this.setState({
                dataSpecialty: this.props.allSpecialty,
            });
        }
    }

    handleDeleteUser = async (id) => {
        await this.props.deleteSpecialty(id)
    }

    handleAddNewSpecialty = () => {
        this.setState({
            isOpenNewSpecialty: true
        })
      }
      
    toggleSpecialtyModal = () => {
            this.setState({
                isOpenNewSpecialty: !this.state.isOpenNewSpecialty,
            })
        }

        
    handleEditSpecialty = (specialty) => {
        this.setState({
            isOpenEditSpecialty: true
        })

        this.setState({currentSpecialty: specialty})
    }
        
    toggleSpecialtyModalEdit = () => {
            this.setState({
                isOpenEditSpecialty: !this.state.isOpenEditSpecialty,
            })
        }

    render() {
        let {dataSpecialty} = this.state
        return (
            <>
                <div className='title'>
                    Quản lý chuyên khoa
                </div>
            <div className="col-12 my-3">
                    <button className="btn btn-primary px-3" onClick={()=>this.handleAddNewSpecialty()}>Thêm mới</button>
            </div>
                {this.state.isOpenNewSpecialty &&
                <ModalAddNewSpecialty
                    isOpenModal = {this.state.isOpenNewSpecialty}
                    toggle = {this.toggleSpecialtyModal}
                    handleSaveUser = {this.handleSaveSpecialty}
                />
                }

                {this.state.isOpenEditSpecialty &&
                    <ModalEditSpecialty 
                    isOpenModalEdit = {this.state.isOpenEditSpecialty}
                    toggle = {this.toggleSpecialtyModalEdit}
                    specialty = {this.state.currentSpecialty}
                />
                }

                <div className="col-12 my-3">
                    
                    <table id="TableManageUser">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Tên Chuyên khoa</th>
                                <th>Thông tin về Chuyên khoa</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataSpecialty && dataSpecialty.length > 0 && dataSpecialty.map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: item.descriptionHTML,
                                            }}
                                            >
                                        </div>
                                        </td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => {
                                                    this.handleEditSpecialty(item);
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
        allSpecialty: state.admin.allSpecialty
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialtyStart: () => dispatch(actions.fetchAllSpecialtyStart()),
        deleteSpecialty: (id) => dispatch(actions.deleteSpecialty(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
