import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const colors = ['#4A90E2', '#50E3C2', '#B66DFF'];

const monthNames = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default class MyBarChart extends PureComponent {
  render() {
    const { monthly } = this.props;
    const data = Array.isArray(monthly) ? monthly.map(item => {
      const [year, month] = item.month.split('-');
      return {
        ...item,
        monthLabel: monthNames[parseInt(month, 10)]
      };
    }) : [];

    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="monthLabel"
              tick={{ fontSize: 13 }}
            />
            <YAxis
              tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
              label={{
                value: 'Revenue (in ₹)',
                angle: -90,
                position: 'insideLeft',
                dx: -20,
                style: { fontSize: 14, fill: '#444' }
              }}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ fontWeight: 'bold' }}
              itemStyle={{ color: '#333' }}
            />
            <Bar dataKey="totalPrice" activeBar={<Rectangle fill="pink" stroke="blue" />}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
