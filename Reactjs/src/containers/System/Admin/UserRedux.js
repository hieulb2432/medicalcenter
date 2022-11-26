import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import {LANGUAGES} from '../../../utils'
import * as actions from '../../../store/actions'
import './UserRedux.scss'

class UserRedux extends Component {

    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

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
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            })
        }

        if(prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].key : ''
            })
        }

        if(prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: arrPositions,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].key : ''
            })
        }
    }

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
          let objectUrl = URL.createObjectURL(file);
          this.setState({
            previewImgURL: objectUrl,
            avatar: file,
          });
        }
      };    

      openPreviewImage = () => {
        if(!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        })
      }

      handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid == false) return;

        // fire redux action
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
    

      onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        }, () => {
            console.log('check input on change', this.state)
        })
      }

    render() {
        let genders = this.state.genderArr;
        let roles = this.state.roleArr;
        let positions = this.state.positionArr;
        let language = this.props.language;
        let isGetGender = this.props.isLoadingGender;

        let {
            previewImgURL,
            isOpen,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
          } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title'>
                    User Redux Eddie
                </div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'>{isGetGender === true ? 'Loading gender' : ''}</div>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add"/></div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.email"/></label>
                                <input className='form-control' type='email' 
                                    value={email}
                                    onChange={(event)=>{this.onChangeInput(event, 'email')}}
                                ></input>
                            </div>

                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.password"/></label>
                                <input className='form-control' type='password'
                                    value={password}
                                    onChange={(event)=>{this.onChangeInput(event, 'password')}}
                                ></input>
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.first-name"/></label>
                                <input className='form-control' type='text'
                                    value={firstName}
                                    onChange={(event)=>{this.onChangeInput(event, 'firstName')}}
                                ></input>
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.last-name"/></label>
                                <input className='form-control' type='text'
                                    value={lastName}
                                    onChange={(event)=>{this.onChangeInput(event, 'lastName')}}
                                ></input>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number"/></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber}
                                    onChange={(event)=>{this.onChangeInput(event, 'phoneNumber')}}
                                ></input>
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address"/></label>
                                <input className='form-control' type='text'
                                    value={address}
                                    onChange={(event)=>{this.onChangeInput(event, 'address')}}
                                ></input>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender"/></label>
                                    <select className="form-control"
                                        onChange={(event)=>{this.onChangeInput(event, 'gender')}}
                                    >
                                        {genders && genders.length > 0 && genders.map((item, index) => {
                                            return (
                                                <option key = {index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                            )
                                        })}                                        
                                    </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.role"/></label>
                                    <select className="form-control"
                                        onChange={(event)=>{this.onChangeInput(event, 'role')}}
                                    >
                                        {roles && roles.length > 0 && roles.map((item, index) => {
                                            return (
                                                <option key = {index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                            )
                                        })}
                                    </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position"/></label>
                                    <select className="form-control"
                                        onChange={(event)=>{this.onChangeInput(event, 'position')}}
                                    >
                                        {positions && positions.length > 0 && positions.map((item, index) => {
                                            return (
                                                <option key = {index} value={item.key}>
                                                    {language === LANGUAGES.VI ? item.valueVi: item.valueEn}
                                                </option>
                                            )
                                        })}
                                    </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image"/></label>
                                <div className='preview-img-container'>
                                    <input 
                                        id="previewImg"
                                        type="file"
                                        hidden
                                        className="form-control"
                                        onChange={(event) => this.handleOnChangeImage(event)}
                                    >
                                    </input>
                                    <label htmlFor='previewImg' className="label-upload">
                                        Tải ảnh
                                        <i className="fas fa-upload"></i>
                                    </label>
                                    <div className='preview-image'
                                        style={{backgroundImage: `url(${this.state.previewImgURL})`}}
                                        onClick={()=> this.openPreviewImage()}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 mt-3'>
                                <button className='btn btn-primary'
                                    onClick={()=> this.handleSaveUser()}
                                ><FormattedMessage id="manage-user.save"/></button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isOpen === true && (
                <Lightbox
                    mainSrc={this.state.previewImgURL}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />
                )}

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
        isLoadingGender: state.admin.isLoadingGender,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);