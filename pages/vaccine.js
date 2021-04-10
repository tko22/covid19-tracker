import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import ReactGA from 'react-ga'
import { StateStatCard, HistTable, ConfirmedNewChart, Card, MultiLineChart, MovingAvgChart } from '../components'
import { stateTranslations, population, fetcher, prettyDate, printStatVal, prettyJHUDate, sma } from '../utils'
import { STATES, TRACKER_URL, COVID_URL, SF_HIST, SCC_TESTING, SCC_HOSP } from '../utils/constants'
import { render } from 'react-dom'
import Table from '../components/table'

const NORMALIZATION_FACTOR = 100000
const RANGE = 7

const SF_POP_OVA_16 = 764514
const SCC_POP_OVA_16 = 1511435

const VaccinePage = () => {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      ReactGA.initialize('UA-162426375-1')
      window.GA_INITIALIZED = true
    }
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  })

  const { data: sfVaccine } = useSWR(`https://data.sfgov.org/resource/bqge-2y7k.json`, fetcher)
  const { data: sccVaccine } = useSWR(`https://data.sccgov.org/resource/s4w2-n2ht.json`, fetcher)

  const sfVaccineChart = sfVaccine ? sfVaccine.map(day => ({ date: prettyDate(day.date_administered), confirmed: day.cumulative_series_completed ? parseInt(day.cumulative_series_completed) : 0, new: day.new_series_completed ? parseInt(day.new_series_completed) : 0 })) : []
  const sccVaccineChart = sccVaccine ? sccVaccine.map(day => ({ date: prettyDate(day.vaccine_dt_rc), confirmed: day.cumulative_doses ? parseInt(day.cumulative_doses) : 0, new: day.total_doses ? parseInt(day.total_doses) : 0 })) : []

  const latestSfVaccine = sfVaccine && sfVaccine[sfVaccine.length - 1]
  const latestSccVaccine = sccVaccine && sccVaccine[sccVaccine.length - 1]

  return (
    <main>
      <link rel='preload' href='https://data.sfgov.org/resource/bqge-2y7k.json' as='fetch' crossOrigin='anonymous' />
      <link rel='preload' href='https://data.sccgov.org/resource/s4w2-n2ht.json' as='fetch' crossOrigin='anonymous' />
      <div className='container'>
        <div className='row'>
          <h3>Vaccine</h3>
        </div>
        <div className='row'>
          <Link href='/'><a className='page-link'>Home</a></Link>
        </div>
        <div className='row'>
          <Card>
            <h3>San Francisco</h3>
            <div className='stat-row'>
              <p className='stat-title'>first dose:</p>
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
              <p className='stat-title'>full vac:</p>
              <div className='stat-diff'>
                <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                <p className='stat-incr good'>
                  {latestSfVaccine && printStatVal(parseInt(latestSfVaccine?.new_series_completed))}
                </p>
              </div>
              <div className='stat-val'>
                {latestSfVaccine && printStatVal(parseInt(latestSfVaccine?.cumulative_series_completed))}
              </div>
            </div>
            <div className='stat-row'>
              <p className='stat-title'>% full vac:</p>
              <div className='stat-diff'>
                <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                <p className='stat-incr good'>
                  {latestSfVaccine && printStatVal((parseInt(latestSfVaccine?.new_series_completed) / SF_POP_OVA_16 * 100).toFixed(2))}
                </p>
              </div>
              <div className='stat-val'>
                {latestSfVaccine && printStatVal((parseInt(latestSfVaccine?.cumulative_series_completed) / SF_POP_OVA_16 * 100).toFixed(2))}
              </div>
            </div>
          </Card>
          <Card>
            <h3>Santa Clara</h3>
            <div className='stat-row'>
              <p className='stat-title'>first dose:</p>
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
        </div>
        <div className='row'>
          <MovingAvgChart data={sfVaccineChart} title='SF Vaccine' xAxis='date' />
          <MovingAvgChart data={sccVaccineChart} title='SCC Vaccine' xAxis='date' />
        </div>
      </div>
      <style jsx>{`
        .page-link {
          color: #F497B8;
          font-size: 12px;
          padding: 0 12px;
        }

        .table {
          font-size: 13px;
          border-color: grey;
          
          table-layout:fixed;
          overflow-x:auto !important;
        }
        
        .table thead {
            text-transform: uppercase;
            border: 1px solid #eaeaea;
        }
        
        .table th {
            padding: 0.6em;
            font-weight: 500;
            font-size: 12px;
            color: #878787;
        }
        
        .table td {
            padding: 0.6rem;
            max-width:100%;
            white-space:nowrap;
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
    </main>
  )
}

export default VaccinePage
