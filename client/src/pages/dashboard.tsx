import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import axios from 'axios';
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const { isConnected } = useAccount();
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    totalSubmissions: 0,
    totalRewards: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await axios.get('/api/taskStats');
        setTaskStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task stats:', error);
        setLoading(false);
      }
    };

    fetchTaskStats();
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Please connect your wallet to view the dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 font-mono">
      <h1 className="text-3xl font-bold text-white mb-4">Indexed Stats</h1>
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">

        {/* Main widget */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold leading-none text-gray-900 sm:text-2xl dark:text-white">
                {taskStats.totalRewards / 1e18} ETH
              </span>
              <h3 className="text-base font-light text-gray-500 dark:text-gray-400">
                Total Rewards Distributed
              </h3>
            </div>
          </div>
        </div>

        {/* Tasks and Submissions widgets */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Total Tasks Created
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {taskStats.totalTasks}
          </p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Total Submissions
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {taskStats.totalSubmissions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
