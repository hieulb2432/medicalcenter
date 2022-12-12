import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'react-slick';
import { FormattedMessage } from 'react-intl';
import {getAllSpecialtyService} from '../../../services/userService'
import './Specialty.scss'

class Specialty extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataSpecialty: []
    }
  }

  async componentDidMount() {
    let res = await getAllSpecialtyService();
    if(res && res.errCode === 0) {
      this.setState({
        dataSpecialty: res.data ? res.data : []
      })
    }
  }

    render() {
      let {dataSpecialty} = this.state;
        return (
            <div className="section-share section-specialty">
            <div className="section-container container">
              <div className="section-header">
                <h2 className="title-section">
                  <FormattedMessage id="homepage.popular-specialty" />
                </h2>
                <button className="btn-section">
                  <FormattedMessage id="homepage.more-info" />
                </button>
              </div>
              <div className="section-content">
                <Slider {...this.props.settings}>
                  {dataSpecialty && dataSpecialty.length > 0 && 
                  dataSpecialty.map((item, index) => {
                    return(
                      <div className="section-item specialty-child" key={index}>
                        <div className="bg-img section-specialty"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                        <h3 className='specialty-name'>{item.name}</h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(Specialty);
