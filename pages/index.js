import Head from 'next/head'
import rd3 from 'react-d3-library'
import useSWR from 'swr'
import fetch from 'unfetch'
import moment from 'moment'
import { Card, HistTable } from '../components'
import { prettyDate } from '../utils'

const fetcher = url => fetch(url).then(r => r.json())

const Home = () => {
  const { data: caliHist } = useSWR('https://covidtracking.com/api/states/daily?state=CA', fetcher)
  const { data: caliToday } = useSWR('https://covidtracking.com/api/states?state=CA', fetcher)
  const { data: ilToday } = useSWR('https://covidtracking.com/api/states?state=IL', fetcher)
  const { data: ilHist } = useSWR('https://covidtracking.com/api/states/daily?state=IL', fetcher)
  const todayHist = caliHist ? caliHist[0] : null
  const todayILHist = ilHist ? ilHist[0] : null

  return (
    <div className='container'>
      <Head>
        <title>Covid-19 Testing</title>
        <link rel='icon' href='/favicon.ico' />
        <link rel='preload' href='https://covidtracking.com/api/states/daily?state=CA' as='fetch' crossOrigin='anonymous' />
        <link rel='preload' href='https://covidtracking.com/api/states?state=CA' as='fetch' crossOrigin='anonymous' />
        <script type='text/javascript' src='date.js' />

      </Head>

      <main>

        <div className='grid'>
          <Card state='California' today={caliToday} hist={todayHist} />
          <Card state='Illinois' today={ilToday} hist={todayILHist} />
          <HistTable state='California' data={caliHist} />
        </div>

      </main>

      <footer />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 1000px;
          margin-top: 3rem;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }

      `}
      </style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        .bad {
          color: #e75353;
        }
        
        .good {
          color: #5084e3;
        }
      `}
      </style>
    </div>
  )
}
export default Home
