import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import PreparedPins from './PreparedPins';
import ScoreContainer from './ScoreContainer';

const Container = styled.div`
  display: inline-block;
  margin: 1em;
`;


const initialPinsState = [...Array(12)].reduce((agg, e, i) => {
  agg[i + 1] = { value: i + 1, isDown: false };
  return agg;
}, {});

export default class Molkky extends PureComponent {

  static propTypes = {};

  static defaultProps = {};

  state = initialPinsState;

  toggle = (value) => {
    const toggledStatePin = { value, isDown: !this.state[value].isDown };
    this.setState({ [value]: toggledStatePin })
  };

  initGame = () => {
    this.props.initGame(['Alice', 'Bob']);
    this.setState(initialPinsState);
  };

  throwPin = (player) => {
    const { throwPin } = this.props;
    const fallenPins = Object.values(this.state).filter(p => p.isDown).map(p => p.value);
    throwPin(fallenPins, player);
    this.setState(initialPinsState);
  }

  render() {
    const { playersScores } = this.props;
    return (
      <Container>
        <Button size="small" variant="raised" onClick={this.initGame}>init game</Button>

        <PreparedPins pins={Object.values(this.state)} toggle={this.toggle}/>

        {playersScores.map(({ name }) =>
          <Button
            key={name}
            size="small"
            variant="raised"
            onClick={() => this.throwPin(name)}
          >
            {name} plays</Button>
        )}

        <p>_</p>

        {playersScores.map(p => (
          <ScoreContainer key={p.name} {...p} />
        ))}
      </Container>
    );
  }
}
