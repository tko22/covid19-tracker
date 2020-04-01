import App, { Container } from 'next/app'
import { DefaultSeo } from 'next-seo'

// import your default seo configuration
import SEO from '../utils/next-seo.config'
import "../static/main.css"

class MyApp extends App {
  render () {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default MyApp
