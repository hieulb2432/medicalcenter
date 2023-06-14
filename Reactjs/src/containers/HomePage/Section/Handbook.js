// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import Slider from 'react-slick';
// import { FormattedMessage } from 'react-intl';


// class Handbook extends Component {

//     render() {
//         return (
//             <div className="section-share section-handbook">
//             <div className="section-container container">
//               <div className="section-header">
//                 <h2 className="title-section">Cẩm nang</h2>
//                 <button className="btn-section">Xem thêm</button>
//               </div>
//               <div className="section-content">
//                 <Slider {...this.props.settings}>
//                   <div className="section-item">
//                     <div className="bg-img section-handbook" />
//                     <h3>Cẩm nang 1</h3>
//                   </div>
//                   <div className="section-item">
//                     <div className="bg-img section-handbook" />
//                     <h3>Cẩm nang 2</h3>
//                   </div>
//                   <div className="section-item">
//                     <div className="bg-img section-handbook" />
//                     <h3>Cẩm nang 3</h3>
//                   </div>
//                   <div className="section-item">
//                     <div className="bg-img section-handbook" />
//                     <h3>Cẩm nang 4</h3>
//                   </div>
//                   <div className="section-item">
//                     <div className="bg-img section-handbook" />
//                     <h3>Cẩm nang 5</h3>
//                   </div>
//                   <div className="section-item">
//                     <div className="bg-img section-handbook" />
//                     <h3>Cẩm nang 6</h3>
//                   </div>
//                 </Slider>
//               </div>
//             </div>
//           </div>
//         );
//     }

// }

// const mapStateToProps = state => {
//     return {
//         isLoggedIn: state.user.isLoggedIn,
//         language: state.app.language,
//     };
// };

// const mapDispatchToProps = dispatch => {
//     return {
//         };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Handbook);
