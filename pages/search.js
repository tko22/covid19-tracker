import { useState } from 'react'
import Link from 'next/link'
import Select from 'react-select'
import useSWR from 'swr'
import { stateTranslations, population, fetcher } from '../utils'
import { Card, HistTable } from '../components'
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

  return (
    <main>
      <div className='container'>
        <div className='row'>
          <Link href='/'><a className='page-link'>Home</a></Link>
        </div>
        <div className='select-state-box'>
          <Select className='select-state' options={options} isSearchable placeholder='Select State' onChange={changeVal} />
        </div>
        {today && hist &&
          <>
            <Card state={val} today={today} hist={todayHist} population={population.states[val.toLowerCase().replace(/ /g, "_")]} />

          </>}
        {today && hist && <HistTable state={val} data={hist} population={population.states[val.toLowerCase().replace(/ /g, "_")]} />}
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
