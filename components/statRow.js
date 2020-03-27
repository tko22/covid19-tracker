import { printStatVal } from '../utils'

const StatRow = ({ title, val, diff, good, up }) => (
  <div className='stat-row'>
    {title ? <p className='stat-title'>{title}: </p> : null}

    {diff
      ? <div className='stat-diff'>
        <img className='stat-incr-icon' src={`/chevrons-${up ? "up" : "bad"}-${good ? "good" : "bad"}.svg`} />
        <p className={`stat-incr ${good ? "good" : "bad"}`}>
          {printStatVal(diff)}
        </p>
        </div>
      : null}
    <p className='stat-val'>{printStatVal(val)}</p>
    <style jsx>{`
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
        flex-basis: 40px;
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
    `}
    </style>
  </div>
)

export default StatRow
