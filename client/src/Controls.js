import React, { Component } from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";
import classNames from 'classnames';

import playing from "./img/playing.gif";
import iconStop from "./img/stop_1279170.svg";
import iconFlag from "./img/flag2.svg";

class Controls extends Component {
	constructor(props) {
		super(props);
		this.state = {
			flagAllowed: true,
		}
		this.flag = this.flag.bind(this);
	}

	flag() {
		if (!this.state.flagAllowed) return;
		this.props.flag();
		const self = this;
		self.setState({ flagAllowed: false });
		setTimeout(function() {
			self.setState({ flagAllowed: true });
		}, 5000);
	}

	render() {

		const lang = this.props.locale;

		var statusText;
		if (this.props.playingRadio) {
			var delayText = { en: "Live", fr: "En direct" }[lang];
			if (this.props.playingDelay > 0) {
				var delaySeconds = Math.round(this.props.playingDelay / 1000);
				var delayMinutes = Math.floor(delaySeconds / 60);
				delaySeconds = delaySeconds % 60;
				var textDelay = (delayMinutes ? delayMinutes + " min" : "");
				textDelay += (delaySeconds ? ((delaySeconds < 10 && delayMinutes ? " 0" : " ") + delaySeconds + "s") : "");
				delayText = { en: textDelay + " ago", fr: "Différé de " + textDelay }[lang];
			}
			statusText = (
				<span>
					{this.props.playingRadio.split("_")[1]}<br />
					<DelayText>{delayText}</DelayText>
				</span>
			)
		} else if (this.props.canStart) {
			statusText = (
				<span>
					{{ en: "Start a radio", fr: "Lancez une radio" }[lang]}
				</span>
			)
		} else {
			statusText = (
				<span>
					{{ en: "Player is ready", fr: "Le lecteur est prêt" }[lang]}
				</span>
			)
		}

		var status = (
			<StatusTextContainer
				className={classNames({ active: this.props.clickableMeta })}
				onClick={() => this.props.clickableMeta && this.props.clickMeta()}>
				{/*<StatusClock>{moment(self.state.date).format("HH:mm")}</StatusClock>&nbsp;–&nbsp;*/}
				{statusText}
			</StatusTextContainer>
		);

		var buttons = (
			<StatusButtonsContainer>
				{this.props.playingRadio &&
					<PlaybackButton className={classNames({ inactive: !this.state.flagAllowed })}
						src={iconFlag}
						alt={{en: "Report a misprediction", fr: "Signaler une erreur de filtre"}[lang]}
						onClick={() => this.flag()} />
				}
				{this.props.playingRadio &&
					<PlaybackButton className={classNames({ inactive: !this.props.playingRadio })}
						src={iconStop}
						alt={{en: "Stop the player", fr: "Arrêter la lecture"}[lang]}
						onClick={() => this.props.play(null, null, null)} />
				}
			</StatusButtonsContainer>
		);

		return (
			<Container>
				<MaxWidthContainer>
					{this.props.playingRadio &&
						<PlayingGif className={classNames({ active: this.props.clickableMeta })} src={playing}
							onClick={() => this.props.clickableMeta && this.props.clickMeta()} />
					}
					{status}
					{buttons}
					{/*metaList={this.state[this.state.playingRadio + "|metadata"]}*/}

					{/*<PlayerStatus settings={this.props.settings} bsw={this.props.bsw} condensed={this.props.condensed} playbackAction={this.togglePlayer} />*/}
				</MaxWidthContainer>
			</Container>

		)
	}
}

Controls.propTypes = {
	locale: PropTypes.string.isRequired,
	playingRadio: PropTypes.string,
	playingDelay: PropTypes.number,
	play: PropTypes.func.isRequired,
	flag: PropTypes.func.isRequired,
	clickableMeta: PropTypes.bool.isRequired,
	clickMeta: PropTypes.func.isRequired,
}

const PlayingGif = styled.img`
	align-self: center;
	height: 40px;
	width: 40px;
	margin: 0 -10px 0 10px;

	&.active {
		cursor: pointer;
	}
`;

const Container = styled.div`
	z-index: 1000;
	background: #f8f8f8;
	height: 60px;
	border-top: 2px solid #888;
	bottom: 0;
	position: fixed;
	width: 100%;
`;

const MaxWidthContainer = styled.div`
	max-width: 600px;
	margin: auto;
	align-items: center;
	display: flex;
	justify-content: space-between;
	height: 100%;
`;

const PlaybackButton = styled.img`
	height: 35px;
	margin-left: 7px;
	cursor: pointer;
	margin-top: 0px;

	&.flip {
		transform: rotate(180deg);
	}
	&.inactive {
		filter: opacity(0.25);
		cursor: unset;
	}
`;

const StatusTextContainer = styled.span`
	padding: 0px 10px 0 20px;
	flex-shrink: 1;
	flex-grow: 1;

	&.active {
		cursor: pointer;
	}
`;

const DelayText = styled.span`
	font-size: 12px;
`;

const StatusButtonsContainer = styled.span`
	padding: 5px 0 0 0;
	flex-shrink: 0;
	margin-right: 20px;
`;

export default Controls;