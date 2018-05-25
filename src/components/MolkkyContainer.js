import { connect } from 'react-redux';
import Molkky from './Molkky';
import { initGame, throwPin, getFallenPins, getPlayers, getPlayerState } from '../store/molkky';

const mapStateToProps = (state => {
    const playersScores = getPlayers(state).map(player => getPlayerState(state, player));
    return {
      fallenPins: getFallenPins(state),
      playersScores
    };
  }
);

const mapDispatchToProps = {
  initGame,
  throwPin,
};

export default connect(mapStateToProps, mapDispatchToProps)(Molkky);
