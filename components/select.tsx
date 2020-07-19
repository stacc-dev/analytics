import { ChangeEvent } from 'react'
import Caret from '@crypticat/ionicons/lib/caret-down'

type Props = {
  options: string[],
  values?: string[],
  selected: string,
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

export default ({ options, selected, values = [],onChange }: Props) => (
  <div className='container'>
    <select value={selected} onChange={onChange}>
      {options.map((option, index) => <option key={values[index] || option} value={values[index] || option}>{option}</option>)}
    </select>

    <div className='icon' aria-hidden>
      <Caret fill='currentColor' />
    </div>

    <style jsx>{`
      select {
        display: block;
        background: var(--bg-secondary);
        font-family: inherit;
        font-size: 0.88rem;
        color: var(--fg-normal);
        border: none;
        padding: 16px;
        box-size: border-box;
        cursor: pointer;
        user-select: none;
        border-radius: 8px;
        appearance: none;
        width: 100%;
      }

      .container {
        display: flex;
        align-items: center;
        position: relative;
        min-width: 200px;
      }

      .icon {
        position: absolute;
        right: 16px;
      }
    `}</style>
  </div>
)