import { ChangeEvent } from 'react'
import Box from 'components/box'

type Props = {
  id: string,
  value: string,
  onChange: (event: ChangeEvent<HTMLInputElement>) => void, 
  label: string,
  placeholder?: string,
  type?: 'text' | 'password'
}

export default ({ type = 'text', id, value, onChange, label, placeholder }: Props) => (
  <Box staccSpace={4}>
    <label htmlFor={id}>{label}</label>
    <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} />

    <style jsx>{`
      label {
        user-select: none;
        display: block;
        font-size: 1rem;
        font-weight: 600;
      }

      input {
        background: var(--bg-secondary);
        color: var(--fg-primary);
        display: block;
        border: none;
        font-family: inherit;
        font-size: 1rem;
        font-weight: 400;
        padding: 16px 20px;
        border-radius: 8px;
      }

      ::placeholder {
        user-select: none;
        color: var(--fg-silent);
      }
    `}</style>
  </Box>
)