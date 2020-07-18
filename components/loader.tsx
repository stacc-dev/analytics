import { useState } from 'react'
import Box from 'components/box'

type Props = {
  text?: string
}

const Loader = ({ text = 'Loading...' }: Props) => (
  <Box direction='row' align='center'>
    <div className='spinner' />
    <div className='loader'>{text}</div>

    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loader {
        user-select: none;
        pointer-events: none;
      }

      .spinner {
        box-sizing: border-box;
        border: 2px solid transparent;
        border-top: 2px solid white;
        border-radius: 50%;
        width: 1.5em;
        height: 1.5em;
        animation: spin 3s linear infinite;
        margin-right: 8px;
        animation: spin 1000ms linear infinite;
      }
    `}</style>
  </Box>
)

export default Loader

export const FullscreenLoader = (props: Props) => (
  <div>
    <Loader {...props} />

    <style jsx>{`
      div {
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>
)