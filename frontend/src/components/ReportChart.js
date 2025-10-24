import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportChart = ({ summary }) => {
  const secured = summary.securedAccountsAmount || 0;
  const unsecured = summary.unsecuredAccountsAmount || 0;
  
  // Only render chart if there is data
  if (secured === 0 && unsecured === 0) {
    return <p>No secured or unsecured balance data to display.</p>;
  }

  const data = [
    { name: 'Secured Balance', value: secured },
    { name: 'Unsecured Balance', value: unsecured },
  ];

  const COLORS = ['#0088FE', '#00C49F']; // Blue, Green

  const formatCurrency = (value) => `₹${new Intl.NumberFormat('en-IN').format(value)}`;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatCurrency} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
