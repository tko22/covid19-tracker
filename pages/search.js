import { useState } from 'react'
import Link from 'next/link'
import Select from 'react-select'
import useSWR from 'swr'
import { stateTranslations, population, fetcher, prettyDate } from '../utils'
import { StateStatCard, HistTable, ConfirmedNewChart, MultiLineChart } from '../components'
import { STATES, TRACKER_URL } from '../utils/constants'

const options = Object.keys(stateTranslations).map(key => ({ value: stateTranslations[key], label: key }))

const SearchPage = () => {
  const [val, updateState] = useState("Washington")

  const changeVal = (e) => {
    updateState(e.label)
  }

  const fetchData = state => {
    const { data: hist } = useSWR(`${TRACKER_URL}/states/daily?state=${state}`, fetcher)
    const { data: today } = useSWR(`${TRACKER_URL}/states?state=${state}`, fetcher)
    return { today, hist, todayHist: hist ? hist[0] : {} }
  }

  const { today, hist, todayHist } = val !== "" ? fetchData(stateTranslations[val]) : { today: null, hist: null, todayHist: null }
  const hospitalizedData = hist ? hist.map(day => ({ date: prettyDate(day.dateChecked, true), hospitalized: day.hospitalized, new: day.hospitalizedIncrease })).reverse() : []
  const deathData = hist ? hist.map(day => ({ date: prettyDate(day.dateChecked, true), deaths: day.death, new: day.deathIncrease })).reverse() : []

  return (
    <main>
      <div className='container'>
        <div className='row'>
          <Link href='/'><a className='page-link'>Home</a></Link>
          <div className='select-state-box'>
            <Select className='select-state' options={options} isSearchable placeholder='Select State' onChange={changeVal} />
          </div>
        </div>
        <div className='row'>
          {today && hist &&
            <StateStatCard state={val} today={today} hist={todayHist} population={population.states[val.toLowerCase().replace(/ /g, "_")]} />}
        </div>
        <div className='row'>
          {today && hist && <HistTable state={val} data={hist} population={population.states[val.toLowerCase().replace(/ /g, "_")]} />}
        </div>
        <div className='row'>
          {hist &&
            <>
              <ConfirmedNewChart histData={hist} state={val} />
              <MultiLineChart data={hospitalizedData} title={`${val} Hospitalizations`} xAxis='date' yAxis={['hospitalized', 'new']} />
              <MultiLineChart data={deathData} title={`${val} Deaths`} xAxis='date' yAxis={['deaths', 'new']} />
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
