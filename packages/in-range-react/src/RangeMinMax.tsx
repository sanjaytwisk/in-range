import React from 'react'
import { RangeValue } from './RangeValue'
import { RangeFill } from './RangeFill'
import { valueToPosition, MockEvent } from '@twisk/in-range'

import { RangeTrack } from './RangeTrack'

export interface RangeMinMaxProps {
  name: string
  min: number
  max: number
  step: number
  value: { [key: string]: number }
  onChange?: (evt: MockEvent<number>) => void
}

export const RangeMinMax: React.FunctionComponent<RangeMinMaxProps> = ({
  name,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const nameMin = `${name}[min]`
  const nameMax = `${name}[max]`
  const minValue = value[nameMin] || min
  const maxValue = value[nameMax] || max

  const validateMin = (nextValue: number) => nextValue < maxValue
  const validateMax = (nextValue: number) => nextValue > minValue

  const fillStart = valueToPosition(minValue, { min, max, step })
  const fillEnd = valueToPosition(maxValue, { min, max, step })

  return (
    <fieldset className="in-range-minmax">
      <RangeTrack />
      <RangeFill start={fillStart} end={fillEnd} />
      <RangeValue
        value={minValue}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onValidate={validateMin}
        name={nameMin}
        withTrack={false}
        withFill={false}
      >
        Maximum value
      </RangeValue>
      <RangeValue
        value={maxValue}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onValidate={validateMax}
        name={nameMax}
        withTrack={false}
        withFill={false}
      >
        Maximum value
      </RangeValue>
    </fieldset>
  )
}
