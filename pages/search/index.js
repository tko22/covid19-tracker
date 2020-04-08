import Link from 'next/link'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import ReactGA from 'react-ga'
import { StateStatCard, HistTable, ConfirmedNewChart, MultiLineChart, MovingAvgChart } from '../../components'
import { stateTranslations, population, fetcher, prettyDate, ema, getHospitalizedIncr } from '../../utils'
import { STATES, TRACKER_URL, TRACKER_URL_V1 } from '../../utils/constants'

const options = Object.keys(stateTranslations).map(key => ({ value: stateTranslations[key], label: key }))

const SearchPage = () => {
  const [val, updateState] = useState("USA")

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
    // if USA
    if (state === "USA") {
      const { data: tempToday } = useSWR(`${TRACKER_URL}/us`, fetcher)
      const today = tempToday ? tempToday[0] : null
      const { data: hist } = useSWR(`${TRACKER_URL}/us/daily`, fetcher)
      const { data } = useSWR(`${TRACKER_URL}/us/daily`, fetcher) // because u need to have the same amount of hooks
      return { today, hist, todayHist: hist ? hist[0] : {}, info: null }
    }

    // if state
    const { data: hist } = useSWR(`${TRACKER_URL}/states/daily?state=${state}`, fetcher)
    const { data: today } = useSWR(`${TRACKER_URL}/states?state=${state}`, fetcher)
    const { data: info } = useSWR(`${TRACKER_URL}/states/info?state=${state}`, fetcher)
    return { today, hist, todayHist: hist ? hist[0] : {}, info }
  }

  const { today, hist, todayHist, info } = val !== "" ? fetchData(stateTranslations[val]) : { today: null, hist: null, todayHist: null, info: null }
  const hospitalizedData = hist ? getHospitalizedIncr(hist).map(day => ({ date: prettyDate(day.dateChecked, true), hospitalized: day.hospitalizedCurrently, new: day.hospitalizedIncrease })).reverse() : []
  const deathData = hist ? hist.map(day => ({ date: prettyDate(day.dateChecked, true), deaths: day.death, new: day.deathIncrease })).reverse() : []
  const chartData = hist ? hist.map(day => ({ date: prettyDate(day.dateChecked, true), confirmed: day.positive, new: day.positiveIncrease })).reverse() : []

  return (
    <main>
      <div className='container'>
        <div className='row'>
          <Link href='/'><a className='page-link'>Home</a></Link>
          <div className='select-state-box'>
            <Select className='select-state' options={options} isSearchable placeholder='Select State' onChange={changeVal} />
          </div>
        </div>
        {today && hist
          ? <>
            <div className='row'>
              <StateStatCard state={val} today={today} hist={todayHist} population={population.states[val.toLowerCase().replace(/ /g, "_")]} stateInfo={info || {}} />
            </div>
            <div className='row'>
              <HistTable state={val} data={hist} population={population.states[val.toLowerCase().replace(/ /g, "_")]} />
            </div>
          </>
          : null}
        <div className='row'>
          {hist &&
            <>
              <ConfirmedNewChart data={chartData} state={val} />
              <MultiLineChart data={hospitalizedData} title={`${val} Hospitalizations`} xAxis='date' yAxis={['hospitalized', 'new']} />
              <MultiLineChart data={deathData} title={`${val} Deaths`} xAxis='date' yAxis={['deaths', 'new']} />
              <MovingAvgChart data={chartData} title={`${val} Case Growth Moving Average`} />
            </>}
        </div>
      </div>
      <style jsx>{`
        .select-state-box { 
          flex: 30%;
          max-width: 250px;
          margin: 1rem;
          min-width: 150px;
        }

        .select-state {
          font-size: 12px;
        }

        .page-link {
          color: #F497B8;
          font-size: 12px;
        }
      `}
      </style>
    </main>

  )
}

export default SearchPage
