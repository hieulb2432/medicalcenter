import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalUser extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        const { isOpen, toggle } = this.props;
        return (
          <Modal
            isOpen={isOpen}
            toggle={toggle}
            className="modal-user-container"
            size="lg"
          >
            <ModalHeader toggle={toggle}>Create a new user</ModalHeader>
            <ModalBody>
              <div className="container">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">Email</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">First name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Last name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" className="px-3" onClick={toggle}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
