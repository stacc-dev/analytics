import { ChangeEvent } from 'react'

type Props = {
  options: string[],
  values?: string[],
  selected: string,
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

export default ({ options, selected, values = [],onChange }: Props) => (
  <select value={selected} onChange={onChange}>
    {options.map((option, index) => <option key={values[index] || option} value={values[index] || option}>{option}</option>)}

    <style jsx>{`
      select {
        display: inline-block;
        background: var(--bg-secondary);
        font-family: inherit;
        font-size: 0.88rem;
        color: var(--fg-normal);
        border: 1px solid #404040;
        padding: 4px;
        box-size: border-box;
        cursor: pointer;
      }
    `}</style>
  </select>
)