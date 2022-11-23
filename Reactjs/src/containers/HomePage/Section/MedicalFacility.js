import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import './MedicalFacility.scss';

class MedicalFacility extends Component {

    render() {
        return (
            <div className="section-share section-medical-facility">
            <div className="section-container container">
              <div className="section-header">
                <h2 className="title-section">Cơ sở y tế nổi bật</h2>
                <button className="btn-section">Xem thêm</button>
              </div>
              <div className="section-content">
                <Slider {...this.props.settings}>
                  <div className="section-item">
                    <div className="bg-img section-medical-facility" />
                    <h3>Benh vien Bach Mai 1</h3>
                  </div>
                  <div className="section-item">
                    <div className="bg-img section-medical-facility" />
                    <h3>Benh vien Bach Mai 2</h3>
                  </div>
                  <div className="section-item">
                    <div className="bg-img section-medical-facility" />
                    <h3>Benh vien Bach Mai 3</h3>
                  </div>
                  <div className="section-item">
                    <div className="bg-img section-medical-facility" />
                    <h3>Benh vien Bach Mai 4</h3>
                  </div>
                  <div className="section-item">
                    <div className="bg-img section-medical-facility" />
                    <h3>Benh vien Bach Mai 5</h3>
                  </div>
                  <div className="section-item">
                    <div className="bg-img section-medical-facility" />
                    <h3>Benh vien Bach Mai 6</h3>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        );
    }
    }

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MedicalFacility);
