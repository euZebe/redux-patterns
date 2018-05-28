import PreparedPins from '../src/components/PreparedPins';

const toggle = value => alert(`pin ${value} toggled`);

export default [
  {
    component: PreparedPins,
    name: 'standing',
    props: {
      pins: [
        { value: 1, isOff: true },
        { value: 2, isOff: true },
        { value: 3, isOff: false },
        { value: 4, isOff: true },
      ],
      toggle
    }
  }
]