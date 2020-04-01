
const StatCard = ({ title, data, positive, death }) => (
  <div className='card'>
    <h3>{title}</h3>
    <div className='stat-row'>
      <p className='stat-title'>Positive: </p>
      <p className='stat-val'>{positive || data.positive}</p>
    </div>
    <div className='stat-row'>
      <p className='stat-title'>Deaths: </p>
      <p className='stat-val'>{death || data.death}</p>
    </div>
    {data.totalTestResults
      ? <div className='stat-row'>
        <p className='stat-title'>Total Tests: </p>
        <p className='stat-val'>{data.totalTestResults}</p>
      </div>
      : null}
    <style jsx>{`
      .card {
        margin: 1rem;
        flex-basis: 30%;
        
        padding: 1rem;
        color: inherit;
        min-width: 300px;
        max-width: 350px;
        text-decoration: none;
        border: 1px solid #eaeaea;
        border-radius: 10px;
        transition: color 0.15s ease, border-color 0.15s ease;

        flex: 1;
      }

      .card:hover,
      .card:focus,
      .card:active {
        box-shadow: rgba(0, 0, 0, 0.12) 2px 2px 8px;
        transition: border 0.2s, background 0.2s, color 0.2s ease-out;
      }

      .card h3 {
        margin: 0 0 7px 0;
      }

      .card p {
        margin: 0;
        font-size: 0.9rem;
        vertical-align: bottom;
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
        flex-basis: 40px;
        text-align: right;
      }
    `}
    </style>
  </div>
)

export default StatCard
