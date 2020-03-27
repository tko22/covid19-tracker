import { prettyDate, printStatVal } from '../utils'

const Card = ({ state, today, hist }) => (
  <div className='card'>
    <h3>{state}</h3>
    {today && hist
      ? <>
        <div className='stat-row'>
          <p className='stat-title'>Positive: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up.svg' />
            <p className='stat-incr bad'>
              {hist.positiveIncrease}
            </p>
          </div>
          <p className='stat-val'>{today.positive}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Negative: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up.svg' />
            <p className='stat-incr bad'>
              {hist.negativeIncrease}
            </p>
          </div>
          <p className='stat-val'>{today.negative}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Hospitalized: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up.svg' />
            <p className='stat-incr bad'>
              {hist.hospitalizedIncrease}
            </p>
          </div>
          <p className='stat-val'>{printStatVal(today.hospitalized)}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Deaths: </p>
          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up.svg' />
            <p className='stat-incr bad'>
              {hist.deathIncrease}
            </p>
          </div>
          <p className='stat-val'>{today.death}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Pending Tests: </p>
          <p className='stat-val'>{today.pending}</p>
        </div>
        <div className='stat-row'>
          <p className='stat-title'>Total Tests: </p>

          <div className='stat-diff'>
            <img className='stat-incr-icon' src='/chevrons-up-good.svg' />
            <p className='stat-incr good'>
              {hist.totalTestResultsIncrease}
            </p>
          </div>
          <p className='stat-val'>{today.totalTestResults}</p>
        </div>

        <p className='last-updated-text'>Last Updated: {prettyDate(today.dateModified)}</p>
        </>
      : <p>No data</p>}
    <style jsx>{`
      .card {
        margin: 1rem;
        flex-basis: 30%;

        padding: 1.5rem;
        color: inherit;
        min-width: 300px;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;
      }

      .card:hover,
      .card:focus,
      .card:active {
        
      }

      .card h3 {
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
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

      .card .last-updated-text { 
        font-size: 10px;
        padding-top: 5px;
        color: #858585;
      }
      
      .stat-row {
        display: flex;
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
        flex-basis: 40px;
        text-align: right;
      }

      .stat-diff {
        align-self: center;
        flex: 10%;
        padding-right: 7px;
        
        display: flex;
        justify-content: flex-end;
      }

      .stat-diff p {
        font-size: 9px !important;
        text-align: right;
      }

      .stat-incr-icon {
        width: 10px;
        margin-left: auto;
      }
      
      .stat-incr {
      }

      .stat-decr {
      }
    `}
    </style>
  </div>
)

export default Card
