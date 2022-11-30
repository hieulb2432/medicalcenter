import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import './OutstandingDoctor.scss';
import * as actions from '../../../store/actions'
import {LANGUAGES} from '../../../utils'
import { FormattedMessage } from 'react-intl';

class OutstandingDoctor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
      this.setState({
        arrDoctors: this.props.topDoctorsRedux
      })
    }
  }

  componentDidMount() {
    this.props.loadTopDoctors();
  }

    render() {
      let arrDoctors = this.state.arrDoctors
      let language = this.props.language;
      // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors);
      console.log('check arrDoctors', arrDoctors)
        return (
            <div className="section-share section-outstanding-doctor">
            <div className="section-container container">
              <div className="section-header">
                <h2 className="title-section"><FormattedMessage id="homepage.outstanding-doctor"/></h2>
                <button className="btn-section"><FormattedMessage id="homepage.more-info"/></button>
              </div>
              <div className="section-content">
                <Slider {...this.props.settings}>
                  
                  {arrDoctors && arrDoctors.length > 0 &&
                  arrDoctors.map((item, index) => {
                    let imageBase64 = '';
                    if (item.image) {
                      imageBase64 = new Buffer(item.image, 'base64').toString('binary');}

                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                    return (
                      <div className="section-item" key={index}>
                        <div className="outer-bg">
                            <div className="bg-img section-outstanding-doctor" 
                              style={{backgroundImage: `url(${imageBase64})`}}
                            />
                        </div>
                        <div className="position text-center">
                            <div>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                            <p>Cơ xương khớp</p>
                        </div>
                      </div>
                    )
                  })}
                </Slider>
              </div>
            </div>
          </div>
        );
    }
    }

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
      loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor);
