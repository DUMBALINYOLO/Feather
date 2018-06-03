import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { appTransitions } from './transitions';
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';
import MainMenu from '../components/menus/main/MainMenu';
import AppBar from '../components/topbar/AppBar';
import { DEFAULT_LANG } from '../config/constants';
import PrivateRoutes from '../routes/PrivateRoutes';
import PublicRoutes from '../routes/PublicRoutes';
import SimpleNotification from '../components/common/misc/SimpleNotification';

const styles = appTransitions;

class Main extends Component {

    static defaultProps = {
		language: DEFAULT_LANG,
		access_token: null
	}

	constructor(props) {
        super(props);
        this.state = { openedMenu: true, appWidth: 0, currentLang: DEFAULT_LANG };

        this._delayedResize = _.debounce((w, h) => {   
            this.setState({ openedMenu: _.isNumber(w) && w < 767 ? false: true, appWidth: w });
        }, 100);		
	}

	componentDidUpdate() {
		if (this.props.language !== this.state.currentLang) {
			this.setState({ currentLang: this.props.language });
		}
	}

    _toggleMenu() {
        this.setState(prevState => {
            return {
                openedMenu: !prevState.openedMenu
            }
        })
    }
    _closeMenuRequest() {
        this.setState(prevState => { return {openedMenu: false} })
    }
    
    _onResize(w, h) {
        this._delayedResize(w, h);
	}

	render() {
		// public routes
		if (_.isNil(this.props.access_token)) {
			return <PublicRoutes />;
		}
		// private routes
		const { classes } = this.props;
		const { openedMenu, appWidth } = this.state;
		return(
			<Fragment>

                <MainMenu openedMenu={ openedMenu } appWidth={ appWidth } closeMenuRequest={ this._closeMenuRequest.bind(this) } />
                <AppBar openedMenu={ openedMenu } toggleMenu={ this._toggleMenu.bind(this) } />
				
				<main className={ classNames('app-page', classes.content, classes['content-left'], {
						[classes.contentShift]: openedMenu,
						[classes[`contentShift-left`]]: openedMenu
					}) }>
					<PrivateRoutes />
				</main>

                <ReactResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)} />
				<SimpleNotification />
			</Fragment>
		)
	}
}

Main.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
	language: PropTypes.string,
	access_token: PropTypes.string
};

const mapStateToProps = ({ language, access_token }) => {
    return {
        language, access_token
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(Main)));
