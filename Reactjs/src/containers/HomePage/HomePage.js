import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Specialty from './Section/Specialty';
import MedicalFacility from './Section/MedicalFacility';
import OutstandingDoctor from './Section/OutstandingDoctor';
import Handbook from './Section/Handbook';
import About from './Section/About';
import HomeFooter from './HomeFooter';

import './HomePage.scss'
import 'slick-carousel/slick/slick.css';

function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="fas fa-arrow-left"></i>
      </button>
    );
  }
  
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button className={className} onClick={onClick}>
        <i className="fas fa-arrow-right"></i>
      </button>
    );
  }


class HomePage extends Component {

    render() {
        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            prevArrow: <SamplePrevArrow />,
            nextArrow: <SampleNextArrow />,
          };
        
        return (
            <>
                <HomeHeader isShowBanner={true}/>
                <Specialty settings={settings} />
                <MedicalFacility settings={settings} />
                <OutstandingDoctor settings={settings} />
                <Handbook settings={settings} />
                <About />
                <HomeFooter />
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
