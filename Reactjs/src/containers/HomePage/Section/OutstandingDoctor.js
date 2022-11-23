import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import './OutstandingDoctor.scss';

class OutstandingDoctor extends Component {

    render() {
        return (
            <div className="section-share section-outstanding-doctor">
            <div className="section-container container">
              <div className="section-header">
                <h2 className="title-section">Bác sĩ nổi bật tuần qua</h2>
                <button className="btn-section">Xem thêm</button>
              </div>
              <div className="section-content">
                <Slider {...this.props.settings}>
                  <div className="section-item">
                    <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" />
                    </div>
                    <div className="position text-center">
                        <h3>Giáo sư, Tiến sĩ Taylor Switf</h3>
                        <p>Cơ xương khớp</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" />
                    </div>
                    <div className="position text-center">
                        <h3>Bác sĩ Ariana Grande</h3>
                        <p>Cơ xương khớp</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" />
                    </div>
                    <div className="position text-center">
                        <h3>Giáo sư Lady Gaga</h3>
                        <p>Thần kinh</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" />
                    </div>
                    <div className="position text-center">
                        <h3>Tiến sĩ Rihanna</h3>
                        <p>Cơ xương khớp</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" />
                    </div>
                    <div className="position text-center">
                        <h3>Giáo sư, Tiến sĩ Adele</h3>
                        <p>Thần kinh</p>
                    </div>
                  </div>
                  <div className="section-item">
                    <div className="outer-bg">
                        <div className="bg-img section-outstanding-doctor" />
                    </div>
                    <div className="position text-center">
                        <h3>Giáo sư, Tiến sĩ Katy</h3>
                        <p>Da liễu</p>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor);
