import React, { useEffect, useState } from "react";
import axios from "axios";
import { format, subDays } from "date-fns";

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("http://127.0.0.1:5000/attendance");
        const processedRecords = processAttendanceData(res.data.attendance || []);
        setRecords(processedRecords);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance data");
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

 
  const processAttendanceData = (rawData) => {
    const groupedData = {};
    
    rawData.forEach(record => {
      const key = `${record.Name}_${record.Date}`;
      if (!groupedData[key]) {
        groupedData[key] = {
          Name: record.Name,
          Date: record.Date,
          Time: [],
          Status: record.Status,
          Count: 0
        };
      }
      groupedData[key].Time.push(record.Time);
      groupedData[key].Count += 1;
    });
    
    return Object.values(groupedData).map(item => ({
      Name: item.Name,
      Date: item.Date,
      'First Entry': item.Time[0],
      'Last Entry': item.Time[item.Time.length - 1],
      'Total Entries': item.Count,
      Status: item.Status
    }));
  };

  useEffect(() => {
    if (records.length > 0) {
      const filtered = records.filter(record => {
        return record.Date === selectedDate;
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords([]);
    }
  }, [selectedDate, records]);

  const dateOptions = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    dateOptions.push({
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'MMM dd, yyyy')
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sm:mx-16 mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Records</h2>
        
        <div className="flex items-center gap-3">
          <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <select
            id="date-select"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="block w-full sm:w-48 rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">No attendance records found for {format(new Date(selectedDate), 'MMMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(filteredRecords[0]).map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((rec, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(rec).map((val, i) => (
                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Showing records for {format(new Date(selectedDate), 'MMMM d, yyyy')}
      </div>
    </div>
  );
};

export default Attendance;