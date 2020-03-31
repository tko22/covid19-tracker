
import { prettyDate } from '../utils'
import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const ConfirmedNewChart = ({ histData, state }) => {
  const chartData = histData ? histData.map(day => ({ name: prettyDate(day.dateChecked, true), confirmed: day.positive, new: day.positiveIncrease })).reverse() : []
  return (
    <div className='chart-box'>
      <h3 className='chart-title'>{state} Confirmed and New Cases</h3>
      <ComposedChart width={600} height={300} data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey='name' />
        <YAxis dataKey='confirmed' />

        <Line dataKey='new' fill='#413ea0' dot={false} />
        <Line type='monotone' dataKey='confirmed' stroke='#8884d8' />
        <Tooltip />

      </ComposedChart>
      <style jsx>{`
        .chart-box {
          font-size: 12px;
        }
        .chart-title {
          padding-left: 10px;
        }
      `}
      </style>
    </div>
  )
}

export default ConfirmedNewChart
