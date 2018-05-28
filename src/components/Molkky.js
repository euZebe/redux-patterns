import React, { PureComponent } from 'react';
import Pin from './Pin';


const initialState = [...Array(12)].reduce((agg, e, i) => {
  agg[i + 1] = { value: i + 1, isDown: false };
  return agg;
}, {});

export default class Molkky extends PureComponent {

  static propTypes = {};

  static defaultProps = {};

  state = initialState;

  toggle = value => () => {
    const toggledStatePin = { value, isDown: !this.state[value].isDown };
    this.setState({ [value]: toggledStatePin })
  };

  initGame = () => {
    this.props.initGame(['Alice', 'Bob']);
    this.setState(initialState);
  };

  render() {
    const fallenPins = Object.values(this.state).filter(p => p.isDown).map(p => p.value);
    const { throwPin, previousFallenPins, playersScores } = this.props;
    return (
      <div>
        <div>
          {Object.values(this.state).map(p =>
            <Pin key={p.value} value={p.value} isDown={p.isDown} toggle={this.toggle(p.value)} />
          )}
        </div>
        <button onClick={this.initGame}>init game</button>
        <button onClick={() => throwPin(fallenPins, 'Alice')}>Alice plays</button>
        <button onClick={() => throwPin(fallenPins, 'Bob')}>Bob plays</button>
        <p>{parseInt(previousFallenPins, 10) >= 0 ? `Last throw: ${previousFallenPins} pin(s) fell.` : '_'}</p>

        {playersScores.map(p => (
          <span>
            <h3>{p.name}</h3>
            <p>Score: {p.score}, ratés consécutifs: {p.consecutiveFailures}</p>
          </span>
        ))}
      </div>
    );
  }
}
