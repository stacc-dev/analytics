import { ReactNode } from 'react'

type Props = {
  children: ReactNode,
  visible: boolean,
  setVisible?: (visible: boolean) => void
}

export default ({ children, visible, setVisible }: Props) => (
  <div className='container'>
    <div className='overlay' onClick={() => setVisible && setVisible(false)} />

    <div className='modal'>
      {children}
    </div>

    <style jsx>{`
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
        background: #00000088;
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
        box-sizing: border-box;
        padding: 24px;
        background: #202B38;
        border-radius: 8px;
      }
    `}</style>
  </div>
)