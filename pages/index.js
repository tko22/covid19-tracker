import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import rd3 from 'react-d3-library'
import useSWR from 'swr'
import fetch from 'unfetch'
import { StateStatCard, HistTable, ToggleNormalize, Card, StatCard, ConfirmedNewChart, MultiLineChart } from '../components'
import { population, stateTranslations, prettyDate } from '../utils'
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
    const { data: info } = useSWR(`${TRACKER_URL}/states/info?state=${state}`, fetcher)
    return { today, hist, todayHist: hist ? hist[0] : {}, info }
  }
  const { data: usToday } = useSWR(`https://covidtracking.com/api/us`, fetcher)
  const { data: usHist } = useSWR(`https://covidtracking.com/api/us/daily`, fetcher)
  const usTodayHist = usHist ? usHist[0] : {}

  const { today: caliToday, hist: caliHist, todayHist: todayCaliHist, info: caliInfo } = fetchData("CA")
  const { today: ilToday, hist: ilHist, todayHist: todayILHist, info: ilInfo } = fetchData("IL")
  const { today: nyToday, hist: nyHist, todayHist: todayNYHist, info: nyInfo } = fetchData("NY")

  const hospitalizedData = caliHist ? caliHist.map(day => ({ date: prettyDate(day.dateChecked, true), hospitalized: day.hospitalized, new: day.hospitalizedIncrease })).reverse() : []
  const deathData = caliHist ? caliHist.map(day => ({ date: prettyDate(day.dateChecked, true), deaths: day.death, new: day.deathIncrease })).reverse() : []
  const chartData = caliHist ? caliHist.map(day => ({ date: prettyDate(day.dateChecked, true), confirmed: day.positive, new: day.positiveIncrease })).reverse() : []

  return (
    <div style={{ maxWidth: "100%" }}>
      <Head>
        <title>Covid-19 Testing</title>
        <link rel='icon' href='/favicon.ico' />
        {
          STATES.map(state => (
            <>
              <link rel='preload' href={`${TRACKER_URL}/states/daily?state=${state}`} as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href={`${TRACKER_URL}/states?state=${state}`} as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href={`${TRACKER_URL}/info?state=${state}`} as='fetch' crossOrigin='anonymous' />
            </>
          ))
        }
        <script type='text/javascript' src='date.js' />

      </Head>

      <main>
        <h2 className='title'>Covid-19</h2>
        <div className='row'>
          <Link href='/search'><a className='page-link'>Search State</a></Link>
        </div>
        <div className='row'>
          <StatCard title='United States 🇺🇸' data={usToday ? usToday[0] : {}} />
          <Card>
            <h3>Notes</h3>
            <div className='stat-row'>
              <ul className='note-list'>
                <li>Increase in 0 may mean it was not reported.</li>
                <li><Link href='https://www.sccgov.org/sites/phd/DiseaseInformation/novel-coronavirus/Pages/dashboard.aspx'><a>Santa Clara Data</a></Link></li>
                <li><Link href='https://projects.sfchronicle.com/2020/coronavirus-map/'><a>Bay Area Tracking</a></Link></li>
              </ul>
            </div>
          </Card>
        </div>
        <div className='row'>
          <div className='grid'>
            <StateStatCard state='California' today={caliToday} hist={todayCaliHist} population={population.states.california} stateInfo={caliInfo} />
            <StateStatCard state='Illinois' today={ilToday} hist={todayILHist} population={population.states.illinois} stateInfo={ilInfo} />
            <StateStatCard state='New York' today={nyToday} hist={todayNYHist} population={population.states.new_york} stateInfo={nyInfo} />
            <HistTable state='California' data={caliHist} population={population.states.california} stateInfo={caliInfo} />
          </div>
        </div>
        <hr />
        <div className='row'>
          <Card>
            <div className='stat-row'>
              <ul className='note-list'>
                <li>News coverage usually just highlights total numbers. If social distancing works, the # of new cases should flatten out, new hospitalizations will be next, and then new deaths will flatten out afterwards (lagging)</li>
                <li>Remember: data we have reflects the # of cases and # of tests performed, hence the growth doesn't directly portray the actual growth. A spike in cases may be due to a spike in tests or even a spike in reports of tests.</li>
              </ul>
            </div>
          </Card>
          <div className='grid'>

            <ConfirmedNewChart histData={caliHist} state='California' />
            <MultiLineChart data={hospitalizedData} title='California Hospitalizations' xAxis='date' yAxis={['hospitalized', 'new']} />
            <MultiLineChart data={deathData} title='California Deaths' xAxis='date' yAxis={['deaths', 'new']} />
            {/* <MultiLineChart data={chartData} title='California on log scale' xAxis='confirmed' yAxis={['new']} xScale='log' yScale='log' /> */}
          </div>
        </div>
      </main>

      <footer>
        <p>Data source from <Link href='https://covidtracking.com'><a>covidtracking.com</a></Link></p>
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
        


      `}
      </style>

    </div>
  )
}
export default Home
