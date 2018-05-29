import { connect } from 'react-redux';
import Molkky from './Molkky';
import { initGame, throwPin, getFallenPins, getPlayers, getPlayerState } from '../store/molkky-duck';

const mapStateToProps = (state => {
    const playersScores = getPlayers(state).map(player => getPlayerState(state, player));
    return {
      previousFallenPins: getFallenPins(state),
      playersScores
    };
  }
);

const mapDispatchToProps = {
  initGame,
  throwPin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Molkky);
