import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRequireNoUser } from 'lib/client/hooks'
import Clock from '@crypticat/ionicons/lib/time-outline'

import Title from 'components/title'
import Subtitle from 'components/subtitle'
import Text from 'components/text'
import Button from 'components/button'
import Box from 'components/box'
import Navbar from 'components/navbar'

export default () => {
  const [user, loading] = useAuthState(firebase.auth())
  useRequireNoUser(user, loading, '/websites')

  return (
    <>
      <Navbar />

      <Box background='accent' py={100} px={10} align='center'>
        <Box
          staccSpace={20}
          direction='row'
          maxWidth={900}
          justify='space-between'
          align='center'
        >
          <Box staccSpace={26} maxWidth={480}>
            <Title>Privacy-first analytics your users will love</Title>
            <Text color='fg-normal'>
              Not to name any names, but modern analytics platforms are mostly
              designed by mega corporations who are selling your data to the
              highest bidder. This isn't okay.
            </Text>
            <Box
              direction='row'
              staccSpace={16}
              mobileProps={{ direction: 'column', align: 'flex-start' }}
            >
              <Button
                variant='callout'
                color='alternate'
                onClick={loginWith(authProviders.github)}
              >
                Get started
              </Button>

              <Button
                variant='peripheral'
                color='secondary'
                onClick={loginWith(authProviders.github)}
              >
                Take a look around
              </Button>
            </Box>
          </Box>
          <Box>
            <img className='charts' src='/charts.svg' />
          </Box>
        </Box>
      </Box>

      <Box py={100} px={10} align='center'>
        <Box
          staccSpace={20}
          direction='row'
          maxWidth={900}
          justify='space-between'
          align='center'
        >
          <Box staccSpace={26} maxWidth={480}>
            <Subtitle>We flipped the script</Subtitle>
            <Text color='fg-muted'>
              Rather than going in with the intention of making a profit, we
              wanted to give our users the best experience possible. From our
              open-source mindset to our focus on privacy, we made a product
              that will help you make great websites.
            </Text>
          </Box>
        </Box>
      </Box>

      <Box background='bg-secondary' py={100} px={10} align='center'>
        <Box
          staccSpace={32}
          direction='row'
          maxWidth={900}
          justify='space-between'
          align='center'
          mobileProps={{ direction: 'column', justify: 'flex-start', align: 'flex-start' }}
        >
          <Box staccSpace={26} maxWidth={480}>
            <Subtitle>Designed for humans</Subtitle>
            <Text color='fg-muted'>
              We've worked hard to create a system that gives you as a site
              owner the flexibility and data you need to make an amazing site,
              without comprimising your end user's privacy.
            </Text>
          </Box>

          <Box staccSpace={26} maxWidth={480}>
            <Subtitle>Open source</Subtitle>
            <Text color='fg-muted'>
              Our code is open source. You can run any of our code on your
              own servers, free of charge. Feel free to fork it as well.
              We believe it's a lot easier to gain trust when you have nothing to hide.
            </Text>
          </Box>
        </Box>
      </Box>

      <Box background='fg-normal' py={100} px={10} align='center'>
        <Box
          staccSpace={20}
          direction='row'
          maxWidth={900}
          justify='space-between'
          align='center'
        >
          <Box staccSpace={26} maxWidth={480}>
            <Subtitle color='bg-primary'>Realtime data</Subtitle>
            <Text color='bg-primary'>
              From the start, we put a large focus on realtime data. Being able
              to see how your site is doing this minute, not a day later, is a
              priority for us. We've built this whole platform with accurate and
              instantly-updating realtime statistics in mind.
            </Text>
          </Box>

          <Clock color='var(--bg-secondary)' className='icon' height={160} width={160} />
        </Box>
      </Box>

      <Box background='accent' py={100} px={10} align='center'>
        <Box
          staccSpace={18}
          maxWidth={480}
          justify='space-between'
          align='center'
          textAlign='center'
        >
          <Subtitle color='fg-normal'>What's not to love?</Subtitle>
          <Text color='fg-normal'>
            Free, open-source, realtime analytics that load quickly and respect
            your users' privacy. And it's as easy as one click to get started.
          </Text>
          <Button
            variant='callout'
            color='alternate'
            onClick={loginWith(authProviders.github)}
          >
            Login with GitHub
          </Button>
        </Box>
      </Box>

      <style jsx>{`
        .charts {
          width: 100%;
          min-width: 360px;
          user-select: none;
          pointer-events: none;
        }

        :global(.icon *) {
          stroke-width: 24px !important;
        }

        @media only screen and (max-width: 800px) {
          .charts {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
