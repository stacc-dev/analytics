import { ReactNode } from 'react'
import Box from 'components/box'
import Subtitle from 'components/subtitle'

type Props = {
  title: string,
  children: ReactNode,
  visible: boolean,
  controls: ReactNode,
  setVisible?: (visible: boolean) => void
}

export default ({ title, children, controls, visible, setVisible }: Props) => (
  <div className='container'>
    <div className='overlay' onClick={() => setVisible && setVisible(false)} />

    <Box background='bg-primary' staccSpace={26} p={20} maxWidth={600} radius={12}>
      <Subtitle>{title}</Subtitle>

      <Box staccSpace={16}>{children}</Box>

      <Box direction='row' justify='flex-end'>
        {controls}
      </Box>
    </Box>

    <style jsx>{`
      @keyframes fade {
        0% {
          display: none;
          opacity: 0;
        }

        100% {
          display: flex;
          opacity: 1;
        }
      }

      .container {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        display: ${visible ? 'flex' : 'none'};
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 0;
      }

      .overlay {
        background: #000000EE;
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: -1;
      }

      .modal {
        width: 100%;
        max-width: 600px;
        border-radius: 12px;
      }
    `}</style>
  </div>
)