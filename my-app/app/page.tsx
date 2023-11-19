"use client";
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';

interface Log {
  level: string;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  parentResourceId: string;
}

interface ApiResponse {
  message: string;
  result?: Log[];
}

export default function Home() {
  const [responseMessage, setResponseMessage] = useState<string>('no response yet');
  const [searchResults, setSearchResults] = useState<Log[] | undefined>();
  const [searchResultsdata, setSearchResultsdata] = useState<Log[] | undefined>();
  const [searchText, setSearchText] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      // Record start time
      const startTime = Date.now();

      const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(`http://localhost:3000/search/${searchText}`);

      // Calculate response time
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setResponseTime(timeTaken);

      setSearchResults(response?.data?.result);
      setSearchResultsdata(response?.data?.result?.hits?.hits);
      setResponseMessage(response?.data?.message);
      console.log('search response ******', response);
      console.log('search result ############', response?.data?.result?.hits?.hits);
    } catch (error) {
      console.error('Error searching logs:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        className='text-black'
        placeholder="Enter search text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <p>{responseMessage}</p>
      {responseTime !== null && <p>Response Time: {responseTime} milliseconds</p>}
      {searchResults && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            { searchResultsdata && searchResultsdata.map((log, index) => (
              <li key={index}>
                <pre>{JSON.stringify(log, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
