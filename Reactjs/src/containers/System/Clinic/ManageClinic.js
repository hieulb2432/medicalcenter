import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import {CommonUtils} from '../../../utils'
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
            currentClinic: {},
            startIndex: 0,
            endIndex: 4,
        }
    }

    async componentDidMount() {
        this.props.fetchAllClinicsStart()
    }

    componentDidUpdate(prevProps, prevState, snapshots) {
        if(prevProps.allClinics !== this.props.allClinics){
            this.setState({
                dataClinic: this.props.allClinics,
            });
        }
    }

    handleDeleteUser = async (id) => {
        await this.props.deleteClinic(id)
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
        handleNextPage = () => {
        const { endIndex } = this.state;
        const newEndIndex = Number(Math.min(+endIndex + 5, +this.state.dataClinic.length - 1));
        
        this.setState({
            startIndex: endIndex + 1,
            endIndex: newEndIndex,
        });
        };

        handlePrevPage = () => {
        const { startIndex } = this.state;
        const newStartIndex = Math.max(startIndex - 5, 0);
        const newEndIndex = startIndex - 1;
    
        this.setState({
            startIndex: newStartIndex,
            endIndex: newEndIndex,
        });
        };

    render() {
        let {dataClinic, startIndex, endIndex} = this.state

        return (
            <div>
                <div className="clinic-top mr-3 ml-3" style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className='clinic-title mt-4' style={{color: '#ff5400'}}>
                            Quản lý cơ sở y tế
                        </div>
                    <div className="my-3">
                            <button className="btn btn-primary px-3" onClick={()=>this.handleAddNewClinic()}>Thêm mới</button>
                    </div>
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

                <div className="col-12 mb-3">
                    
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
                            {dataClinic && dataClinic.length > 0 && dataClinic.slice(startIndex, endIndex + 1).map((item, index) => {
                                return(
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.address}</td>
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

                    <div className="pagination mt-3">
                        <button href="#" 
                            className={dataClinic? "previous round mr-3": "previous round mr-3 disable"} 
                            onClick={this.handlePrevPage} 
                            disabled={startIndex === 0}>&#8249;</button>
                        
                        <button href="#" 
                            className={dataClinic? "next round": "next round disable" }
                            onClick={this.handleNextPage} 
                            disabled={dataClinic && endIndex >= dataClinic.length -1}
                            >&#8250;</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        allClinics: state.admin.allClinics
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllClinicsStart: () => dispatch(actions.fetchAllClinicsStart()),
        deleteClinic: (id) => dispatch(actions.deleteClinic(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
