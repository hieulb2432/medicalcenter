import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash';

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        };
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: 'hashPassword',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
    }

    handleOnChangeInput = (event, id) => {
      let copyState = {...this.state}
      copyState[id] = event.target.value;

      this.setState({
        ...copyState,
      })
    }

    checkValidateInput = () => {
      let isValid = true;
      let arrInput = ['email', 'password', 'firstName', 'lastName', 'address']
      for (let i = 0; i < arrInput.length; i++) {
        console.log(arrInput[i], this.state[arrInput[i]])
        if(!this.state[arrInput[i]]){
          isValid = false;
          alert('Missing required parameter ' + arrInput[i]);
          break;
        }        
      }
      return isValid
    }

    handleSaveUser = () => {
      let isValid = this.checkValidateInput();
      if(isValid === true){
        // Call API edit modal
        this.props.editUser(this.state);
      }
    }

    render() {
        const { isOpen, toggle } = this.props;
        return (
          <Modal
            isOpen={this.props.isOpen}
            toggle={()=>{toggle()}}
            className="modal-user-container"
            size="lg"
          >
            <ModalHeader toggle={toggle}>Edit a user</ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Email</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={this.state.email}
                      disabled
                      onChange={(event)=>{this.handleOnChangeInput(event, "email")}}
                      />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={this.state.password}
                      disabled
                      onChange={(event)=>{this.handleOnChangeInput(event, "password")}}
                      />
                  </div>
                  <div className="col-6">
                    <label className="form-label">First name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={this.state.firstName}
                      onChange={(event)=>{this.handleOnChangeInput(event, "firstName")}}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Last name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.lastName}
                      onChange={(event)=>{this.handleOnChangeInput(event, "lastName")}}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input
                      type="text" 
                      className="form-control"
                      value={this.state.address}
                      onChange={(event)=>{this.handleOnChangeInput(event, "address")}}
                    />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="px-3" onClick={this.handleSaveUser}>
                Save changes
              </Button>{' '}
              <Button className="px-3" onClick={toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
