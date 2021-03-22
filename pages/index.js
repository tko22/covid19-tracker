import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import ReactGA from 'react-ga'
import rd3 from 'react-d3-library'
import useSWR from 'swr'
import fetch from 'unfetch'
import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'
import { StateStatCard, HistTable, ToggleNormalize, Card, StatCard, ConfirmedNewChart, MultiLineChart, MovingAvgChart } from '../components'
import { STATES, TRACKER_URL, COVID_URL } from '../utils/constants'
import { population, stateTranslations, prettyDate, prettyJHUDate, getHospitalizedIncr, printStatVal } from '../utils'

const fetcher = url => fetch(url).then(r => r.json())

const options = Object.keys(stateTranslations).map(key => ({ value: stateTranslations[key], label: key }))
const SF_POP_OVA_16 = 764514
const SCC_POP_OVA_16 = 1511435

const Home = () => {
  const [val, updateState] = useState("Washington")

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      ReactGA.initialize('UA-162426375-1')
      window.GA_INITIALIZED = true
    }
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  })

  const changeVal = (e) => {
    updateState(e.label)
  }

  const fetchData = state => {
    const { data: hist } = useSWR(`${TRACKER_URL}/states/${state}/daily.json`, fetcher)
    const { data: today } = useSWR(`${TRACKER_URL}/states/${state}/current.json`, fetcher)
    const { data: info } = useSWR(`${TRACKER_URL}/states/${state}/info.json`, fetcher)
    return { today, hist, todayHist: hist ? hist[0] : {}, info }
  }
  const { data: usToday } = useSWR(`${TRACKER_URL}/us/current.json`, fetcher)
  const { data: usHist } = useSWR(`${TRACKER_URL}/us/daily.json`, fetcher)
  const usTodayHist = usHist ? usHist[0] : {}
  const { data: sccToday } = useSWR(`${COVID_URL}/counties?county=santa-clara`, fetcher)
  const { data: sccHist } = useSWR(`https://data.sccgov.org/resource/dvgc-tzgq.json`, fetcher)
  const { data: bayHist } = useSWR(`${COVID_URL}/daily?area=bay-area`, fetcher)
  const { data: champaignHist } = useSWR(`${COVID_URL}/daily?county=champaign`, fetcher)
  const { data: sfHist } = useSWR(`https://data.sfgov.org/resource/nfpa-mg4g.json`, fetcher)

  const { data: sfVaccine } = useSWR(`https://data.sfgov.org/resource/bqge-2y7k.json`, fetcher)
  const { data: sccVaccine } = useSWR(`https://data.sccgov.org/resource/s4w2-n2ht.json`, fetcher)

  const { today: caliToday, hist: caliHist, todayHist: todayCaliHist, info: caliInfo } = fetchData("ca")
  const { today: ilToday, hist: ilHist, todayHist: todayILHist, info: ilInfo } = fetchData("il")
  const { today: nyToday, hist: nyHist, todayHist: todayNYHist, info: nyInfo } = fetchData("ny")

  const hospitalizedData = caliHist ? getHospitalizedIncr(caliHist).map(day => ({ date: prettyDate(day.dateChecked, true), hospitalized: day.hospitalizedCurrently, new: day.hospitalizedIncrease != undefined || day.hospitalizedIncrease != NaN ? parseInt(day.hospitalizedIncrease) : 0 })).reverse().slice(20) : []
  const deathData = caliHist ? caliHist.map(day => ({ date: prettyDate(day.dateChecked, true), deaths: day.death, new: day.deathIncrease })).reverse() : []
  const caliConfirmedData = caliHist ? caliHist.map(day => ({ date: prettyDate(day.dateChecked, true), confirmed: day.positive, new: day.positiveIncrease })).reverse() : []
  const sccChartData = sccHist ? sccHist.slice(40).map(day => ({ date: prettyDate(day.collection_date), new: day.post_rslt ? parseInt(day.post_rslt) : 0 })) : []
  const sccPosRateData = sccHist ? sccHist.slice(40).map(day => ({ date: prettyDate(day.collection_date), new: day.rate_pst_7d ? day.rate_pst_7d : 0 })) : []
  const bayChartData = bayHist ? bayHist.slice(60).map(day => ({ date: prettyJHUDate(day.date), confirmed: day.positive !== undefined ? parseInt(day.positive) : 0, new: day.positiveIncrease ? parseInt(day.positiveIncrease) : 0 })) : []
  const champaignChartData = champaignHist ? champaignHist.slice(35).map(day => ({ date: prettyJHUDate(day.date), confirmed: day.positive !== undefined ? parseInt(day.positive) : 0, new: day.positiveIncrease ? parseInt(day.positiveIncrease) : 0 })) : []
  const testPositivityData = caliHist ? caliHist.map(day => ({
    date: prettyDate(day.dateChecked, true),
    new: day.totalTestResultsIncrease ? (day.positiveIncrease * 100 / (day.totalTestResultsIncrease)).toFixed(2) : NaN
  })).reverse().slice(50) : []
  const sfData = sfHist ? sfHist.slice(35).map(day => ({
    date: prettyDate(day.specimen_collection_date),
    new: day.pos
  })) : []
  const sfPosRateData = sfHist ? sfHist.slice(35).map(day => ({
    date: prettyDate(day.specimen_collection_date),
    new: (day.pct * 100).toFixed(2)
  })) : []

  const latestSfVaccine = sfVaccine && sfVaccine[sfVaccine.length - 1]
  const latestSccVaccine = sccVaccine && sccVaccine[sccVaccine.length - 1]

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
              <link rel='preload' href={`${COVID_URL}/counties?county=santa-clara`} as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href={`${COVID_URL}/daily?area=bay-area`} as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href={`${COVID_URL}/counties?area=bay-area`} as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href='https://data.sfgov.org/resource/nfpa-mg4g.json' as='fetch' crossOrigin='anonymous' />
              <link rel='preload' href='https://data.sccgov.org/resource/dvgc-tzgq.json' as='fetch' crossOrigin='anonymous' />
            </>
          ))
        }
        <script type='text/javascript' src='date.js' />
      </Head>

      <main>
        <h2 className='title'>Covid-19</h2>
        <div className='row'>
          <Link href='/search'><a className='page-link'>Search State</a></Link>
          <Link href='/bayarea'><a className='page-link'>Bay Area</a></Link>
        </div>
        <div className='row'>
          <StatCard title='United States 🇺🇸' data={usToday ? usToday[0] : {}} />
          <Card>
            <h3>Vaccine</h3>
            <div className='stat-row'>
              <p className='stat-title'># SF first dose:</p>
              <div className='stat-diff'>
                <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                <p className='stat-incr good'>
                  {printStatVal(parseInt(latestSfVaccine?.new_1st_doses) + parseInt(latestSfVaccine?.new_single_doses))}
                </p>
              </div>
              <div className='stat-val'>
                {latestSfVaccine && printStatVal(parseInt(latestSfVaccine?.cumulative_1st_doses) + parseInt(latestSfVaccine?.cumulative_single_doses))}
              </div>
            </div>
            <div className='stat-row'>
              <p className='stat-title'>% over 16 first dose:</p>
              <div className='stat-diff'>
                <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                <p className='stat-incr good'>
                  {printStatVal(((parseInt(latestSfVaccine?.new_1st_doses) + parseInt(latestSfVaccine?.new_single_doses)) / SF_POP_OVA_16 * 100).toFixed(2))}%
                </p>
              </div>
              <div className='stat-val'>
                {latestSfVaccine && ((parseInt(latestSfVaccine?.cumulative_1st_doses) + parseInt(latestSfVaccine?.cumulative_single_doses)) / SF_POP_OVA_16 * 100).toFixed(2)}%
              </div>
            </div>
            <div className='stat-row'>
              <p className='stat-title'># SCC first dose:</p>
              <div className='stat-diff'>
                <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                <p className='stat-incr good'>
                  {printStatVal(parseInt(latestSccVaccine?.firstdose))}
                </p>
              </div>
              <div className='stat-val'>
                {latestSccVaccine && printStatVal(parseInt(latestSccVaccine?.cumulative_1stdose))}
              </div>
            </div>
            <div className='stat-row'>
              <p className='stat-title'>% over 16 first dose:</p>
              <div className='stat-diff'>
                <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                <p className='stat-incr good'>
                  {printStatVal((parseInt(latestSccVaccine?.firstdose) / SCC_POP_OVA_16 * 100).toFixed(2))}%
                </p>
              </div>
              <div className='stat-val'>
                {latestSccVaccine && ((parseInt(latestSccVaccine?.cumulative_1stdose)) / SCC_POP_OVA_16 * 100).toFixed(2)}%
              </div>
            </div>

          </Card>
          <Card>
            <h3>Notes</h3>
            <div className='stat-row'>
              <ul className='note-list'>
                <li>Increase in 0 may mean it was not reported.</li>
                <li>Pending Tests means # of tests waiting for results.</li>
                <li>Total Tests means positive + negative tests, not including pending tests.</li>
                <li><Link href='https://www.sccgov.org/sites/phd/DiseaseInformation/novel-coronavirus/Pages/dashboard.aspx'><a>Santa Clara Data</a></Link></li>
                <li><Link href='https://projects.sfchronicle.com/2020/coronavirus-map/'><a>Bay Area Tracking</a></Link></li>
                <li><Link href='http://91-divoc.com/pages/covid-visualization/'><a>Exponential Spread Viz</a></Link></li>
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

            <MovingAvgChart data={caliConfirmedData} title='California Case Growth Moving Average' />
            <MovingAvgChart data={deathData} title='California Deaths Moving Average' xAxis='date' />
            <MultiLineChart data={hospitalizedData} title='California Hospitalizations' xAxis='date' yAxis={['hospitalized', 'new']} />
            <MovingAvgChart data={hospitalizedData} title='Hospitalizations Case Growth Moving Average' />
            <MovingAvgChart data={testPositivityData} title='California Test Positivity Moving Average' />
            <MovingAvgChart data={bayChartData} title='Bay Area Case Growth Moving Average' xAxis='date' />
          </div>
        </div>
      </main>

      <footer>
        <div className='row'><p>Data source from <Link href='https://covidtracking.com'><a>covidtracking.com</a></Link></p></div>
        <div className='row'><p><Link href='https://github.com/tko22/covid19-tracker'><a>Open source on Github</a></Link></p></div>
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
          padding: 0 12px;
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
          display: inline-block;
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
        
        footer a {
          color: #0070f3;
        }

        .stat-val {
          color: #545454;
          margin-left: auto;
          flex-basis: 45px;
          text-align: right;
          font-size: 0.9rem;
        }

        .stat-diff {
          align-self: center;
          flex: 10%;
          padding-right: 7px;
          
          display: flex;
          display:-webkit-flex
          -webkit-box-pack: justify;
          justify-content: flex-end;
        }
  
        .stat-diff p {
          font-size: 9px !important;
          text-align: right;
        }
  
        .stat-incr-icon {
          width: 10px;
          height: 10px;
          margin-left: auto;
        }
  
      `}
      </style>

    </div>
  )
}
export default Home
