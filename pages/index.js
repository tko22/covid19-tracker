import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import rd3 from 'react-d3-library'
import useSWR from 'swr'
import fetch from 'unfetch'
import { Card, HistTable, ToggleNormalize, StatCard } from '../components'
import { population, stateTranslations } from '../utils'
import Select from 'react-select'
import { STATES, TRACKER_URL } from '../utils/constants'

const fetcher = url => fetch(url).then(r => r.json())

const options = Object.keys(stateTranslations).map(key => ({ value: stateTranslations[key], label: key }))

const Home = () => {
  const [val, updateState] = useState("Washington")

  const changeVal = (e) => {
    updateState(e.label)
  }

  const fetchData = state => {
    const { data: hist } = useSWR(`${TRACKER_URL}/states/daily?state=${state}`, fetcher)
    const { data: today } = useSWR(`${TRACKER_URL}/states?state=${state}`, fetcher)
    return { today, hist, todayHist: hist ? hist[0] : {} }
  }
  const { data: usToday } = useSWR(`https://covidtracking.com/api/us`, fetcher)
  const { data: usHist } = useSWR(`https://covidtracking.com/api/us/daily`, fetcher)
  const usTodayHist = usHist ? usHist[0] : {}

  const { today: caliToday, hist: caliHist, todayHist: todayCaliHist } = fetchData("CA")
  const { today: ilToday, hist: ilHist, todayHist: todayILHist } = fetchData("IL")
  const { today: nyToday, hist: nyHist, todayHist: todayNYHist } = fetchData("NY")

  return (
    <div>
      <Head>
        <title>Covid-19 Testing</title>
        <link rel='icon' href='/favicon.ico' />
        {
          STATES.map(state => (
            <>
              <link rel='preload' href={`${TRACKER_URL}/states/daily?state=${state}`} as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href={`${TRACKER_URL}/states?state=${state}`} as='fetch' crossOrigin='anonymous' />
            </>
          ))
        }
        <script type='text/javascript' src='date.js' />

      </Head>

      <main>
        <h2 className='title'>Covid-19</h2>
        <div className='row'>
          <Link href='/search'><a className='page-link'>Search</a></Link>
        </div>
        <div className='row'>
          <StatCard title='United States 🇺🇸' data={usToday ? usToday[0] : {}} />
        </div>
        <div className='container'>
          <div className='grid'>
            <Card state='California' today={caliToday} hist={todayCaliHist} population={population.states.california} />
            <Card state='Illinois' today={ilToday} hist={todayILHist} population={population.states.illinois} />
            <Card state='New York' today={nyToday} hist={todayNYHist} population={population.states.new_york} />
            <HistTable state='California' data={caliHist} population={population.states.california} />
          </div>
        </div>
        <hr />
      </main>

      <footer>
        <p>Data source from covidtracking.com</p>
      </footer>

      <style jsx>{`

        .title {
          text-align: center;
          font-size: 30px;
          font-weight: 500;
        }
        .page-link {
          color: #F497B8;
          font-size: 12px;
        }
        .sidebar {
          flex-basis: 1;
          padding: 0 0.5rem;
          margin-top: 1rem;
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

        footer p {
          font-size: 12px;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
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

        .container {
          padding: 0 0.5rem;
          justify-content: center;
          align-items: center;
          flex-basis: 2;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 1000px;
          margin-top: 1rem;
        }
      `}
      </style>
    </div>
  )
}
export default Home
