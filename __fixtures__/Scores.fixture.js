import ScoreContainer from '../src/components/ScoreContainer';

export default [
  {
    component: ScoreContainer,
    name: 'in game',
    props: {
      name: 'Niobé',
      score: 45,
      consecutiveFailures: 2
    }
  },
  {
    component: ScoreContainer,
    name: 'discarded',
    props: {
      name: 'Niobé',
      score: 45,
      consecutiveFailures: 3
    }
  },
  {
    component: ScoreContainer,
    name: 'Victory !',
    props: {
      name: 'Niobé',
      score: 50,
      consecutiveFailures: 0
    }
  },
]