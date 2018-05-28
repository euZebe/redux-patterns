import Pin from '../src/components/Pin';

const toggle = value => alert(`pin ${value} toggled`);

export default [
  {
    component: Pin,
    name: 'standing',
    props: {
      value: 4,
      isOff: false,
      toggle,
    }
  },
  {
    component: Pin,
    name: 'lying',
    props: {
      value: 12,
      isOff: true,
      toggle,
    }
  }
]