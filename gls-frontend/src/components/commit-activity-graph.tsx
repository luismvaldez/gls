import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type CommitActivity = {
  week: string;
  total: number;
  days: number[];
};

type CommitActivityGraphProps = {
  commitActivity: CommitActivity[];
};

const CommitActivityGraph: React.FC<CommitActivityGraphProps> = ({ commitActivity }) => {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Weekly Commit Activity</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={commitActivity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CommitActivityGraph;