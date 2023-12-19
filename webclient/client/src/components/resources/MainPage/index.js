import { Grid, Column, Tile } from '@carbon/react'
import { Typography, useMediaQuery } from '@mui/material'
import { DocumentConversion } from '@carbon/pictograms-react'
import { useTranslate } from 'react-admin'
import { CodeSnippet } from '@carbon/react'

const MainPage = () => {
  const isXs = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const translate = useTranslate()
  return (
    <Grid>
      <Column lg={16}>
        <Tile>
          <Grid>
            <Column lg={4}>
              <DocumentConversion style={{ width: 128, height: 128 }} />
            </Column>
            <Column lg={12}>
              <Typography variant="h1">{translate('menu.header')}</Typography>
            </Column>
          </Grid>
        </Tile>
      </Column>
      <Column lg={16}>
        <Tile>
          <CodeSnippet type="multi" feedback="Copied to clipboard" wrapText={true} maxCollapsedNumberOfRows={20}>
            {`Extract information from PDF documents using watsonx`}
          </CodeSnippet>
        </Tile>
      </Column>
      <Column lg={16}>
        <Tile>
          <CodeSnippet type="multi" feedback="Copied to clipboard" wrapText={true} maxCollapsedNumberOfRows={20}>
            {`Disclaimer: The extracted insights are generated using artificial intelligence (AI) for each document. Please be aware that there might be instances of repetition within the text. The content produced by AI is not influenced by personal opinions, emotions, or intentions. Reader discretion is advised.`}
          </CodeSnippet>
        </Tile>
      </Column>
      <Column lg={16}>
        <Tile>{translate('copyright')}</Tile>
      </Column>
    </Grid>
  )
}

export default MainPage
