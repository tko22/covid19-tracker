
import { prettyDate } from '../utils'
import { ComposedChart, Bar, YAxis, XAxis, Line, Tooltip, CartesianGrid } from 'recharts'

const ConfirmedNewChart = ({ histData }) => {
  const chartData = histData ? histData.map(day => ({ name: prettyDate(day.dateChecked, true), confirmed: day.positive, new: day.positiveIncrease })).reverse() : []
  return (
    <div className='chart-box'>
      <ComposedChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray='3 3' />

        <XAxis dataKey='name' interval={3} />
        <YAxis dataKey='confirmed' />

        <Line dataKey='new' barSize={6} fill='#413ea0' dot={false} />
        <Line type='monotone' dataKey='confirmed' stroke='#8884d8' />
        <Tooltip />

      </ComposedChart>
      <style jsx>{`
        .chart-box {
          font-size: 12px;
        }
      `}
      </style>
    </div>
  )
}

export default ConfirmedNewChart
