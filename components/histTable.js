import { prettyDate, printStatVal } from '../utils'
import { StatRow } from '../components'
import { useState } from 'react'
const NORMALIZATION_FACTOR = 1000

const HistTable = ({ state, data, population }) => {
  const [isCollapse, toggle] = useState(true)
  const [isNormalized, toggleNormalize] = useState(false)

  const handleCollapseClick = () => (
    toggle(!isCollapse)
  )
  const handleNormalizeClick = () => (
    toggleNormalize(!isNormalized)
  )

  if (data && isCollapse) {
    data = data.slice(0, 5)
  }
  console.log(population)
  return (
    <div className='table-wrapper'>
      <div className='title-box'>
        <h3>{state} history</h3>
        <div className='toggle-box'>
          {
            isNormalized
              ? <>
                <p>per thousand</p>
                <img className='toggle-icon' src='/toggle-right.svg' onClick={handleNormalizeClick} />
              </>
              : <>
                <p>cases</p>
                <img className='toggle-icon' src='/toggle-left.svg' onClick={handleNormalizeClick} />
                </>
          }

        </div>
      </div>
      {
        data
          ? <>
            <table className='state-history-table'>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Positive</th>
                  <th>Negative</th>
                  <th>Pending</th>
                  <th>Hospitalized</th>
                  <th>Deaths</th>
                  <th>Total Test Results</th>
                </tr>
              </thead>
              <tbody>
                {
                  data.map(day => (
                    <tr key={day.date}>
                      <td>{prettyDate(day.dateChecked)}</td>
                      <td>
                        <div className='stat-row'>
                          <p className='stat-val'>{printStatVal(day.positive, population, isNormalized, NORMALIZATION_FACTOR)}</p>
                          <div className='stat-diff'>
                            <img className='stat-incr-icon' src='/chevrons-up-bad.svg' />
                            <p className='stat-incr bad'>
                              {day.positiveIncrease}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='stat-row'>
                          <p className='stat-val'>{printStatVal(day.negative, population, isNormalized, NORMALIZATION_FACTOR)}</p>
                          <div className='stat-diff'>
                            <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                            <p className='stat-incr good'>
                              {day.negativeIncrease}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{printStatVal(day.pending, population, isNormalized, NORMALIZATION_FACTOR)}</td>
                      <td>
                        <div className='stat-row'>
                          <p className='stat-val'>{printStatVal(day.hospitalized)}</p>
                          <div className='stat-diff'>
                            <img className='stat-incr-icon' src='/chevrons-up-bad.svg' />
                            <p className='stat-incr bad'>
                              {day.hospitalizedIncrease}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='stat-row'>
                          <p className='stat-val'>{printStatVal(day.death, population, isNormalized, NORMALIZATION_FACTOR)}</p>
                          <div className='stat-diff'>
                            <img className='stat-incr-icon' src='/chevrons-up-bad.svg' />
                            <p className='stat-incr bad'>
                              {day.deathIncrease}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className='stat-row'>
                          <p className='stat-val'>{printStatVal(day.totalTestResults, population, isNormalized, NORMALIZATION_FACTOR)}</p>
                          <div className='stat-diff'>
                            <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
                            <p className='stat-incr good'>
                              {day.totalTestResults}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <div className='expand-box' onClick={handleCollapseClick}>
              <a>
                {isCollapse ? <img className='expand-icon' src='/collapse-down.svg' /> : <img className='expand-icon' src='/collapse-up.svg' />}
              </a>
            </div>
            </>
          : "No historical Data"
      }
      <style jsx>{`
      .title-box {
        display: flex;
        align-items: center;
      }

      .title-box h3 {
        flex: 2;
      }

      .toggle-box {
        display: flex;
      }

      .toggle-box p {
        font-size: 12px;
        color: #ababab;
        padding-right: 5px;
      }

      .toggle-icon {
        cursor: pointer;
      }
      
      .table-wrapper {
        margin: 1rem;
        padding: 1.5rem;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
        text-align: left;
        font-color: #545454;
      }

      h3 {
        margin: 5px;
      }
    
      .state-history-table {
        font-size: 13px;
        border-color: grey;
      }
      
      .state-history-table thead {
        text-transform: uppercase;
        border: 1px solid #eaeaea;
      }
      
      .state-history-table th {
        padding: 0.6em;
        font-weight: 500;
        font-size: 12px;
        color: #878787;
      }

      .state-history-table td {
        padding: 0.6rem;
      }

      .expand-box {
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        justify-content: center;
        cursor: pointer;
        width: 100%;
      }

      .expand-icon {
        align-self: center;
        width: 18px;
        height: 18px;
      }

      .stat-row {
        display: flex;
        justify-content: left;
      }
      
      .stat-val {
        margin: 0;
        margin-right: auto;
        text-align: left;
        align-self: center;
        flex-basis: 40px;
        min-width: 40px;
      }

      .stat-diff {
        align-self: center;
        text-align: left;
        flex: 10%;
        padding-right: 7px;
        
        display: flex;
        display:-webkit-flex
        -webkit-box-pack: justify;
        align-items: left;
      }

      .stat-diff p {
        font-size: 9px !important;
        margin: 0;
        flex: 1;
        text-align: left;
      }

      .stat-incr-icon {
        width: 10px;
        height: 10px;
        align-self: flex-start;
        margin-right: auto;
      }

    `}
      </style>

    </div>)
}

export default HistTable