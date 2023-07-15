import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { getAllClinicService } from '../../../services/userService';
import './MedicalFacility.scss';
import {withRouter} from 'react-router';
import { FormattedMessage } from 'react-intl';

class MedicalFacility extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataClinic: []
    }
  }

  async componentDidMount() {
    let res = await getAllClinicService();
    if(res && res.errCode === 0){
      this.setState({
        dataClinic: res.data ? res.data : []
      });
    }
  }

  componentDidUpdate() {

  }

  handleViewDetailClinic = (clinic) => {
    if(this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`)
    }
  }
    
  
  render() {
    let { dataClinic } = this.state
        return (
            <div className="section-share section-medical-facility">
            <div className="section-container container">
              <div className="section-header">
                <h2 className="title-section"><FormattedMessage id="homepage.health-facilities"/></h2>
                {/* <button className="btn-section">Xem thêm</button> */}
              </div>
              <div className="section-content">
                <Slider {...this.props.settings}>
                  {dataClinic && dataClinic.length > 0 &&
                  dataClinic.map((item, index) => {
                    return(
                      <div className="section-item clinic-child" 
                        key={index}
                        onClick={()=> this.handleViewDetailClinic(item)}
                        >
                        <div className="bg-img section-clinic"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <h3 className='clinic-name'>{item.name}</h3>
                      </div>
                      )
                    })
                  }
                </Slider>
              </div>
            </div>
          </div>
        );
    }
    }

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
