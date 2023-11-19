"use client";
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import './Home.css';
import Button from '../components/button';
interface LogMetadata {
  parentResourceId: string;
}

// Define the main log type
interface Log {
  level: string;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata?: LogMetadata; // Optional metadata field
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
      const startTime = Date.now();

      const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(`http://localhost:3000/search/${searchText}`);

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
    <div className="search-container">
      <div className="">
        <input
          type="text"
          className="text-black m-10 p-3 rounded-md "
          placeholder="Enter search text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
       
        
      </div>
      {searchResults && (
      <div className="search-results-container">
      <p>{responseMessage}</p>
      {responseTime !== null && <p className='text-base font-extrabold' >Response Time: {responseTime} ms</p>}
        
          <div>
            <h2>Search Results:</h2>
            <ul>
              {searchResultsdata && searchResultsdata.map((log, index) => (
                <li key={index}>
                  <pre>{JSON.stringify(log, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </div>
      </div>
      )}
    </div>
  );
}