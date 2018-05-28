import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const isGameOver = ({ score, consecutiveFailures }) => (
  score === 50 ? '#81C784' : consecutiveFailures >= 3 ? '#EF9A9A' : 'inherit'
);

const StyledScoreContainer = styled(Paper)`
  background-color: ${isGameOver} !important;
  margin-top: 0.8em;
  padding: 0.5em;
  text-align: left;
`;


const ScoreContainer = ({ name, score, consecutiveFailures }) => (
    <StyledScoreContainer score={score} consecutiveFailures={consecutiveFailures} elevation={4}>
      <Typography variant="headline" component="h3">{name}</Typography>
      <Typography component="p">{score} / {consecutiveFailures} raté(s)</Typography>
    </StyledScoreContainer>
  )
;

ScoreContainer.propTypes = {};

ScoreContainer.defaultProps = {};


export default ScoreContainer;