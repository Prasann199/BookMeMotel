import React from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

// Function to convert date string to day name
const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return dayNames[date.getDay()];
};

// Custom triangle bar shape
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

// ✅ Custom XAxis tick with Day + Date
const CustomXAxisTick = (props) => {
  const { x, y, payload } = props;

  const [dayName, dateStr] = payload.value.split('|');

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={0} textAnchor="middle" fill="#333" fontSize={12}>
        {dayName}
      </text>
      <text x={0} y={15} dy={0} textAnchor="middle" fill="#888" fontSize={10}>
        {dateStr}
      </text>
    </g>
  );
};

export default function DailyRevenueChart({ daily }) {
  // Transform data to include dayName|date for tick rendering
  const data = Array.isArray(daily)
    ? daily.map(item => {
        const dayName = getDayName(item.day);
        return {
          ...item,
          dayLabel: `${dayName}|${item.day}`
        };
      })
    : [];

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="dayLabel"
            tick={<CustomXAxisTick />}
            interval={0}
          />
          <YAxis
            tickFormatter={(value) => `₹${(value / 1000).toFixed(1)}k`}
            label={{
              value: 'Revenue (₹)',
              angle: -90,
              position: 'insideLeft',
              dx: -20,
              style: { fontSize: 14, fill: '#444' },
            }}
          />
          <Tooltip
            formatter={(value) => [`₹${value}`, 'Revenue']}
            labelStyle={{ fontWeight: 'bold' }}
            itemStyle={{ color: '#333' }}
          />
          <Bar
            dataKey="totalPrice"
            shape={<TriangleBar />}
            label={{ position: 'top' }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
