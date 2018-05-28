import Pin from '../src/components/Pin';

export default [
  {
    component: Pin,
    name: 'standing',
    props: {
      value: 4,
      isOff: false,
      toggle: () => alert('pin toggled')
    }
  },
  {
    component: Pin,
    name: 'lying',
    props: {
      value: 12,
      isOff: true,
      toggle: () => alert('pin toggled')
    }
  }
]