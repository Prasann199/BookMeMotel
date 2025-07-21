import React, { PureComponent } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { year: '2020', revenue: 120000 },
  { year: '2021', revenue: 150000 },
  { year: '2022', revenue: 175000 }
];

export default class YearlyRevenueChart extends PureComponent {
  render() {
    const{ yearly}=this.props;
    const data = Array.isArray(yearly) ? yearly : [];
    return (
      <div style={{ width: '100%' }}>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6347" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#FF6347" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={(value) => `₹${(value / 1000)}k`}
              label={{
                value: 'Revenue (₹)',
                angle: -90,
                position: 'insideLeft',
                dx: -25,
                style: { fontSize: 14, fill: '#8B0000' }
              }}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ fontWeight: 'bold' }}
              itemStyle={{ color: '#8B0000' }}
            />
            <Area
              type="monotone"
              dataKey="toalPrice"
              stroke="#8B0000"
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
