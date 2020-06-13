import Link from 'next/link'
import { useState, useEffect } from 'react'
import Collapse from './collapse'
import ToggleNormalize from './toggleNormalize'
import { prettyDate, printStatVal, formatNum } from '../utils'

const NORMALIZATION_FACTOR = 100000

const StateStatCard = ({ state, today, hist, population, stateInfo = {} }) => {
  const [isCollapse, toggle] = useState(true)

  const handleCollapseClick = () => (
    toggle(!isCollapse)
  )

  const [isNormalized, toggleNormalize] = useState(false)
  const handleNormalizeClick = () => (
    toggleNormalize(!isNormalized)
  )

  return (<div className='card'>
    <div className='title-box'>
      <h3><Link href={stateInfo.covid19Site || stateInfo.covid19SiteSecondary || ""}>{state}</Link></h3>
      <ToggleNormalize isNormalized={isNormalized} toggle={handleNormalizeClick} />
    </div>
    {today
      ? <div className='stat-box'>
        <div className='stat-row'>
          <p className='stat-title'>Positive: </p>
          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up-bad.svg' />
            <p className='stat-incr bad'>
              {hist.positiveIncrease}
            </p>
          </div>
          <p className='stat-val'>{printStatVal(today.positive, population, isNormalized, NORMALIZATION_FACTOR)}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Negative: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
            <p className='stat-incr good'>
              {hist.negativeIncrease}
            </p>
          </div>
          <p className='stat-val'>{printStatVal(today.negative, population, isNormalized, NORMALIZATION_FACTOR)}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Hospitalized: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up-bad.svg' />
            <p className='stat-incr bad'>
              {hist.hospitalizedIncrease}
            </p>
          </div>
          <p className='stat-val'>{printStatVal(printStatVal(today.hospitalizedCurrently, population, isNormalized, NORMALIZATION_FACTOR))}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>In ICU: </p>
          <p className='stat-val'>{printStatVal(printStatVal(today.inIcuCurrently, population, isNormalized, NORMALIZATION_FACTOR))}</p>
        </div>

        <div className='stat-row'>
          <p className='stat-title'>Deaths: </p>
          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up-bad.svg' />
            <p className='stat-incr bad'>
              {hist.deathIncrease}
            </p>
          </div>
          <p className='stat-val'>{printStatVal(today.death, population, isNormalized, NORMALIZATION_FACTOR)}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Pending Tests: </p>
          <p className='stat-val'>{printStatVal(today.pending, population, isNormalized, NORMALIZATION_FACTOR)}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Total Tests: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
            <p className='stat-incr good'>
              {hist.totalTestResultsIncrease}
            </p>
          </div>
          <p className='stat-val'>{printStatVal(today.totalTestResults, population, isNormalized, NORMALIZATION_FACTOR)}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Test Pos. %</p>

          <p className='stat-val'>{printStatVal(((today.positiveIncrease) * 100 / (hist.totalTestResultsIncrease)).toFixed(2))}%</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Total Test Positivity: </p>

          <p className='stat-val'>{printStatVal(((today.positive) * 100 / (today.totalTestResults)).toFixed(2))}%</p>
        </div>

        <p className='last-updated-text'>Pop. {formatNum(population)}</p>
        <p className='last-updated-text'>Last Updated: {prettyDate(today.dateModified)}</p>
      </div>
      : <p>No data</p>}
    {
      !isCollapse
        ? <p>{stateInfo.notes}</p> : null
    }
    <Collapse isCollapse={isCollapse} handleCollapseClick={handleCollapseClick} />
    <style jsx>{`
    
      .card {
        margin: 1rem;
        flex-basis: 30%;
        
        padding: 1.5rem;
        color: inherit;
        min-width: 300px;
        max-width: 350px;
        
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
        flex: 1;
        padding-bottom: 0.3rem;
        overflow-x:auto !important;
      }

      .card:hover,
      .card:focus,
      .card:active {
        box-shadow: rgba(0, 0, 0, 0.12) 2px 2px 8px;
        transition: border 0.2s, background 0.2s, color 0.2s ease-out;
      }

      .card p {
        margin: 0;
        font-size: 0.9rem;
        vertical-align: bottom;
      }
      
      .card .last-updated-text { 
        font-size: 10px;
        padding-top: 5px;
        color: #858585;
      }

      .stat-row {
        display: flex;
        display:-webkit-flex
        -webkit-box-pack: justify;
        justify-content: left;
        margin: 3px 0;
      }
      
      .stat-title {
        flex: 70%;
        flex-grow: 2;
      }
      
      .stat-val {
        color: #545454;
        margin-left: auto;
        flex-basis: 45px;
        text-align: right;
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
      .title-box {
        display: flex;
        align-items: center;
      }

      .title-box h3 {
        flex: 2;
        font-size: 1.3rem;
        margin: 0.5rem 0.1rem;
      }

      .stat-box {
        padding-bottom: 0.4rem;
      }

    `}
    </style>
  </div>
  )
}

export default StateStatCard
