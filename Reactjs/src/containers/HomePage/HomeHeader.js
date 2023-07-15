import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
// import logo from '../../assets/images/logo.svg';
import logo from '../../assets/images/logo-new-ver.png';
import { FormattedMessage } from 'react-intl';
import {LANGUAGES} from '../../utils'
import {withRouter} from 'react-router';
import {changeLanguageApp} from '../../store/actions'

class HomeHeader extends Component {

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language)
  }

  returnToHome = () => {
    if(this.props.history) {
      this.props.history.push(`/home`)
    }
  }
  
    render() {
        let language = this.props.language;
        return (
            <React.Fragment>
            <div className="home-header-container container">
              <div className="home-header-content">
              <div className="left-content">
                {/* <i className="fas fa-bars"></i> */}
                <div className="header-logo">
                  <img src={logo} onClick={()=>this.returnToHome()} />
                </div>
              </div>
              <div className="center-content">
                <div className="child-content">
                  <div>
                    <b>
                        <FormattedMessage id="home-header.specialty" />
                    </b>
                </div>
                <div className="subs-title">
                    <FormattedMessage id="home-header.search-doctor" />
                  </div>
                </div>
                
                <div className="child-content">
                  <div>
                  <b>
                  <FormattedMessage id="home-header.health-facility" />
                </b>
              </div>
              <div className="subs-title">
                <FormattedMessage id="home-header.select-room" />
                  </div>
                  
                </div>
                
                <div className="child-content">
                  <div>
                  <b>
                  <FormattedMessage id="home-header.doctor" />
                </b>
              </div>
              <div className="subs-title">
                <FormattedMessage id="home-header.select-doctor" />
                  </div>
                </div>
              </div>
              <div className="right-content">
                <div className="support">
                  <i className="fas fa-question-circle"></i>
                  <FormattedMessage id="home-header.support" />
                </div>
                <div className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"}>
                  <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                </div>
                <div className={language === LANGUAGES.EN ? "language-en active" : "language-en"}>
                  <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                </div>
              </div>
              </div>
            </div>
            
            {this.props.isShowBanner === true &&
              <div className='home-header-banner'>
              </div>
            }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
      changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
