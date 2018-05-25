import React, { PureComponent } from 'react';
import Pin from './Pin';


const initialState = [...Array(12)].reduce((agg, e, i) => {
  agg[i + 1] = { value: i + 1, isOn: false };
  return agg;
}, {});

export default class Molkky extends PureComponent {

  static propTypes = {};

  static defaultProps = {};

  state = initialState;

  toggle = value => () => {
    const toggledStatePin = { value, isOn: !this.state.isOn };
    this.setState({ [value]: toggledStatePin })
  };

  initGame = () => {
    this.props.initGame(['Alice', 'Bob']);
    this.setState({ initialState });
  };

  render() {
    console.log(JSON.stringify(this.state, null, '  '));
    const { initGame, throwPin, fallenPins, playersScores } = this.props;
    return (
      <div>
        <div>
          {Object.values(this.state).map(p =>
            <Pin key={p.value} value={p.value} isOn={p.isOn} toggle={this.toggle(p.value)} />
          )}
        </div>
        <button onClick={initGame}>init game</button>
        <button onClick={() => throwPin([1, 4, 5, 9], 'Alice')}>Alice plays</button>
        <button onClick={() => throwPin([], 'Bob')}>Bob plays</button>
        <p>{parseInt(fallenPins, 10) >= 0 ? `Last throw: ${fallenPins} pin(s) fell.` : '_'}</p>

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
