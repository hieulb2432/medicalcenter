import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import './HomeFooter.scss';

class HomeFooter extends Component {

    render() {
        return (
            <div className="home-footer">
                <p>
                    &copy; 2021 BenhvienABC
                        <a
                            target="_blank"
                            href="https://www.facebook.com/hieulb2432/"
                            rel="noreferrer"
                        >
                            {' '}
                            More information
                        </a>
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
