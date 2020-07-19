import Box from 'components/box'
import Button from 'components/button'

export default () => (
  <Box $='header' background='accent' pt={16} p={10} align='center'>
    <Box direction='row' justify='space-between' align='center' maxWidth={900}>
      <div className='brand'>
        <img src='/logo.svg' />
        <h1>Stacc Analytics</h1>
      </div>

      <Box direction='row' staccSpace={16}>
        
      </Box>
    </Box>

    <style jsx>{`
      .brand {
        display: flex;
        flex-direction: row;
        user-select: none;
        align-items: center;
      }

      .brand img {
        height: 32px;
        pointer-events: none;
        margin-right: 12px;
      }

      .brand h1 {
        font-size: 1.6rem;
        font-weight: 400;
        margin: 0;
      }
    `}</style>
  </Box>
)