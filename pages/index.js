import Head from 'next/head'
import rd3 from 'react-d3-library'
import useSWR from 'swr'
import fetch from 'unfetch'
import moment from 'moment'

const fetcher = url => fetch(url).then(r => r.json())

const printStatVal = value => (value || "n/a")

const prettyDate = ms => {
  console.log(ms)
  const d = moment(ms)
  return d.format("MMM DD ddd")
}

const Home = () => {
  const { data: caliHist } = useSWR('https://covidtracking.com/api/states/daily?state=CA', fetcher)
  const caliToday = caliHist ? caliHist[0] : null

  return (
    <div className='container'>
      <Head>
        <title>Covid-19 Testing</title>
        <link rel='icon' href='/favicon.ico' />
        <link rel='preload' href='https://covidtracking.com/api/states/daily?state=CA' as='fetch' crossOrigin='anonymous' />
        <link rel='preload' href='https://covidtracking.com/api/states?state=CA' as='fetch' crossOrigin='anonymous' />
        <script type='text/javascript' src='date.js' />

      </Head>

      <main>

        <div className='grid'>
          <div className='card'>
            <h3>California</h3>
            {caliToday
              ? <>
                <p>
                  <span className='stat-title'>Positive: </span>
                  <span className='stat-val'>{caliToday.positive}</span>
                  <span className='stat-increase'>{caliToday.positiveIncrease}</span>
                </p>
                <p>
                  <span className='stat-title'>Negative: </span>
                  <span className='stat-val'>{caliToday.negative}</span>
                </p>
                <p>
                  <span className='stat-title'>Hospitalized: </span>
                  <span className='stat-val'>{printStatVal(caliToday.hospitalized)}</span>
                </p>
                <p>
                  <span className='stat-title'>Deaths: </span>
                  <span className='stat-val'>{caliToday.death}</span>
                </p>
                <p>
                  <span className='stat-title'>Pending Tests: </span>
                  <span className='stat-val'>{caliToday.pending}</span>
                </p>
                <p>
                  <span className='stat-title'>Total Tests: </span>
                  <span className='stat-val'>{caliToday.totalTestResults}</span>
                </p>

                <p className='last-updated-text'>Last Updated: {prettyDate(caliHist.dateModified)}</p>
                </>
              : <p>No data</p>}
          </div>
          {
            caliHist
              ? <table className='state-history-table'>
                <tr>
                  <th>Date</th>
                  <th>Positive</th>
                  <th>Negative</th>
                  <th>Pending</th>
                  <th>Hospitalized</th>
                  <th>Deaths</th>
                  <th>Total Test Results</th>
                </tr>
                {
                  caliHist.map(day => (
                    <tr key={day.date}>
                      <td>{prettyDate(day.dateChecked)}</td>
                      <td>{day.positive}</td>
                      <td>{day.negative}</td>
                      <td>{day.pending}</td>
                      <td>{day.hospitalized}</td>
                      <td>{day.death}</td>
                      <td>{day.totalTestResults}</td>
                    </tr>
                  ))
                }
                </table>
              : "No historical Data"
          }
        </div>

      </main>

      <footer />

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
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

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 1000px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 30%;
          padding: 1.5rem;
          text-align: left;
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
          font-size: 0.8rem;
          line-height: 1.5;
        }
        
        .card p .stat-val {
          color: #545454;
          float: right;
        }

        .card .last-updated-text { 
          font-size: 10px;
          padding-top: 5px;
          color: #858585;
        }

        .state-history-table {
          margin: 1rem;
          padding: 1.5rem;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        
        table {
          font-size: 12px;
        }
        
        .state-history-table th {
          padding: 0.6em;
        }

        .state-history-table td {
          padding: 0.6rem;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}
      </style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}
      </style>
    </div>
  )
}
export default Home
