import { isValidValue, getNextValue, valueToPosition, createRef } from './utils'
import {} from './store'
import {
  createSetRect as createSetRectAction,
  createSetValue as createSetValueAction,
} from './actions'
import {
  createOnClick,
  createOnMouseDown,
  createOnMouseUp,
  createOnMouseMove,
  createOnTouchMove,
  createOnInputChange,
  createOnResize,
} from './handlers'
import { RangeOptions, Store, State, SetFn, Elements } from './types'

const createSetValue = (store: Store, options: RangeOptions) => (
  nextValue: number
) => {
  const { name } = options
  const currentValue = store.getState().value[name]
  if (isValidValue(nextValue, currentValue, options)) {
    store.dispatch(createSetValueAction(nextValue, name))
  }
}

const createSetPosition = (
  store: Store,
  options: RangeOptions,
  setValue: SetFn
) => (nextPosition: number) => {
  const { value, rect } = store.getState()
  const { name } = options
  const nextValue = getNextValue(nextPosition, rect, options)
  if (isValidValue(nextValue, value[name], options)) {
    setValue(nextValue)
  }
}

const createSetRect = (store: Store, elements: Elements) => () =>
  store.dispatch(createSetRectAction(elements.root.getBoundingClientRect()))

export const createRange = (
  elements: Elements,
  options: RangeOptions,
  store: Store
) => {
  const { thumb, root, input } = elements
  const mouseDownRef = createRef(false)
  const timeoutRef = createRef(0)
  const setValue = createSetValue(store, options)
  const setPosition = createSetPosition(store, options, setValue)
  const setRect = createSetRect(store, elements)

  /* create event handlers */
  const onClick = createOnClick(setPosition)
  const onMouseDown = createOnMouseDown(mouseDownRef)
  const onMouseUp = createOnMouseUp(mouseDownRef)
  const onMouseMove = createOnMouseMove(mouseDownRef, setPosition)
  const onTouchMove = createOnTouchMove(mouseDownRef, setPosition)
  const onInputChange = createOnInputChange(setValue)
  const onResize = createOnResize(timeoutRef, setRect)

  /* add event handlers */
  root.addEventListener('click', onClick)
  input.addEventListener('change', onInputChange)
  thumb.addEventListener('mousedown', onMouseDown)
  thumb.addEventListener('touchstart', onMouseDown)
  thumb.addEventListener('touchend', onMouseUp)
  thumb.addEventListener('touchmove', onTouchMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)

  const destroy = () => {
    root.removeEventListener('click', onClick)
    input.removeEventListener('change', onInputChange)
    thumb.removeEventListener('mousedown', onMouseDown)
    thumb.removeEventListener('touchstart', onMouseDown)
    thumb.removeEventListener('touchend', onMouseUp)
    thumb.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
  }

  const update = ({ value }: State, previousState: State) => {
    const { name } = options
    if (value[name] === previousState.value[name]) {
      return
    }
    const position = valueToPosition(value[name], options)
    input.value = value[name].toString()
    thumb.setAttribute('style', `--range-thumb-left:${position}%;`)
  }

  setRect()

  return {
    setValue,
    destroy,
    update,
  }
}
