import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import ReactGA from 'react-ga'
import { StateStatCard, HistTable, ConfirmedNewChart, MultiLineChart, MovingAvgChart } from '../components'
import { stateTranslations, population, fetcher, prettyDate, printStatVal, prettyJHUDate, sma } from '../utils'
import { STATES, TRACKER_URL, COVID_URL, SF_HIST, SCC_TESTING, SCC_HOSP } from '../utils/constants'
import { render } from 'react-dom'
import Table from '../components/table'

const NORMALIZATION_FACTOR = 100000
const RANGE = 7
const BayAreaPage = () => {
  const [isCollapse, toggle] = useState(true)
  const [isNormalized, toggleNormalize] = useState(false)

  const handleCollapseClick = () => (
    toggle(!isCollapse)
  )
  const handleNormalizeClick = () => (
    toggleNormalize(!isNormalized)
  )

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      ReactGA.initialize('UA-162426375-1')
      window.GA_INITIALIZED = true
    }
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  })

  const { data: sccHist } = useSWR(SCC_TESTING, fetcher)
  const { data: bayHist } = useSWR(`${COVID_URL}/daily?area=bay-area`, fetcher)
  const { data: sfHist } = useSWR(SF_HIST, fetcher)
  const { data: sccHospHist } = useSWR(SCC_HOSP, fetcher)

  const sccChartDataTemp = sccHist ? sccHist.slice(40).map(day => ({
    date: prettyDate(day.collection_date),
    new: day.post_rslt ? parseInt(day.post_rslt) : 0,
    positivityRate: (day.post_rslt * 100 / day.total).toFixed(2),
    sevenPositivityRate: day.rate_pst_7d ? day.rate_pst_7d : 0
  })) : []
  const sccChartSMA = sccChartDataTemp ? sma(sccChartDataTemp.map(day => day.new), RANGE) : []
  const sccChartData = sccChartDataTemp ? sccChartDataTemp.map((day, index) => { return { ...day, mavg: index > RANGE ? sccChartSMA[index] : 0 } }) : []
  const sccHospChartData = sccHospHist ? sccHospHist.map(day => ({ date: prettyDate(day.collection_date), hospitalized: parseInt(day.covid_total), new: parseInt(day.covid_new) })) : []

  const sccPosRateData = sccHist ? sccHist.slice(40).map(day => ({ date: prettyDate(day.collection_date), new: day.rate_pst_7d * 100 ? day.rate_pst_7d * 100 : 0 })) : []
  const bayChartData = bayHist ? bayHist.slice(60).map(day => ({ date: prettyJHUDate(day.date), confirmed: day.positive !== undefined ? parseInt(day.positive) : 0, new: day.positiveIncrease ? parseInt(day.positiveIncrease) : 0 })) : []

  const sfDataTemp = sfHist ? sfHist.slice(50).map(day => ({
    date: prettyDate(day.specimen_collection_date),
    new: parseFloat(day.pos)
  })) : []
  const sfSMA = sfDataTemp ? sma(sfDataTemp.map(day => day.new), RANGE) : []
  const sfData = sfDataTemp ? sfDataTemp.map((day, index) => { return { ...day, mavg: index > RANGE ? sfSMA[index] : 0 } }) : []

  const sfChartPosSMA = sfHist ? sma(sfHist.slice(40).map(day => day.pct), RANGE) : []
  const sfPosRateData = sfHist ? sfHist.slice(40).map(day => ({
    date: prettyDate(day.specimen_collection_date),
    new: (day.pct * 100).toFixed(2)
  })) : []

  console.log(sfData)

  let sccChartTableData = [...sccChartData]
  sccChartTableData.reverse()

  if (sccChartTableData && isCollapse) {
    sccChartTableData = sccChartTableData.slice(0, 10)
  }

  return (
    <main>
      <link rel='preload' href={`${COVID_URL}/counties?area=bay-area`} as='fetch' crossOrigin='anonymous' />
      <link rel='preload' href={SCC_TESTING} as='fetch' crossOrigin='anonymous' />
      <link rel='preload' href={SF_HIST} as='fetch' crossOrigin='anonymous' />
      <div className='container'>
        <div className='row'>
          <h3>Bay Area</h3>
        </div>
        <div className='row'>
          <Link href='/'><a className='page-link'>Home</a></Link>
        </div>
        <div className='row'>
          <MovingAvgChart data={bayChartData} title='Bay Area Case Growth Moving Average' xAxis='date' />
        </div>
        <div className='row'>
          <MovingAvgChart data={sccChartData} title='Santa Clara Case Growth Moving Average' xAxis='date'>
            <p>{sccChartData.length > 2
              ? <p>7 day SMA {sccChartData[sccChartData.length - 1].date}:
                <b>
                  {printStatVal(sccChartData[sccChartData.length - 1].mavg, population.counties.santa_clara, true, NORMALIZATION_FACTOR)} / 100k
                </b>
              </p>
              : null}
            </p>
          </MovingAvgChart>
          <MovingAvgChart data={sccPosRateData} title='Santa Clara 7 day rolling positivity rate' xAxis='date' noMavg>
            {sccPosRateData.length > 2 ? <p>7 day positivity Rate from {sccPosRateData[sccPosRateData.length - 8].date}: <b>{sccPosRateData[sccPosRateData.length - 8].new}%</b></p> : null}
          </MovingAvgChart>
          <MultiLineChart data={sccHospChartData} title='Santa Clara Hospitalization' xAxis='date' yAxis={["hospitalized", "new"]} />
        </div>
        {/* <div className='table row'>
          <Table
            title='Santa Clara History'
            className='table'
            handleCollapseClick={handleCollapseClick}
            handleNormalizeClick={handleNormalizeClick}
            isCollapse={isCollapse}
            isNormalized={isNormalized}
          >
            <thead>
              <tr>
                <th>Date</th>
                <th>Positive</th>
                <th>Test Pos.</th>
                <th>7 day Test Pos.</th>
              </tr>
            </thead>
            <tbody>
              {
                sccChartTableData
                  ? sccChartTableData.map(day => (
                    <tr key={day.date}>
                      <td>{day.date}</td>
                      <td>{printStatVal(day.new, population.counties.santa_clara, isNormalized, NORMALIZATION_FACTOR)}</td>
                      <td>{day.positivityRate}%</td>
                      <td>{day.sevenPositivityRate}%</td>
                    </tr>
                  ))
                  : null
              }
            </tbody>

          </Table>
        </div> */}
        <div className='row'>
          <MovingAvgChart data={sfData} title='SF Moving Avg by specimen collection date' height={1000} domainTop='300'>
            {sfData.length > 2 ? <p>7 day SMA {sfData[sfData.length - 1].date}: <b>{
              printStatVal(sfData[sfData.length - 1].mavg, population.counties.san_francisco, true, NORMALIZATION_FACTOR)
            } / 100k
                                                                                </b>
            </p> : null}
          </MovingAvgChart>
          <MovingAvgChart data={sfPosRateData} title='SF Test positivity Moving Avg by specimen collection date' xAxis='date'>
            {sfData.length > 2 ? <p>7 day positivity Rate from {sfPosRateData[sfPosRateData.length - 1].date}: <b>{(sfPosRateData[sfPosRateData.length - 1].new)}%</b></p> : null}
          </MovingAvgChart>
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
      
      `}
      </style>
    </main>
  )
}

export default BayAreaPage
