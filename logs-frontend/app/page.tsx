"use client";
import { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import './Home.css';
import Button from '../components/button';
interface LogMetadata {
  parentResourceId: string;
}
interface Log {
  level: string;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  }
  
}
interface ApiResponse {
  message: string;
  result?: Log[];
}

export default function Home() {
  const [responseMessage, setResponseMessage] = useState<string>('no response yet');
  const [searchResults, setSearchResults] = useState<Log[] | undefined>();
  const [searchResultsdata, setSearchResultsdata] = useState<Log[] | undefined>();
  const [searchFullText, setSearchFullText] = useState<string>('');
  const [searchField, setSearchField] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [size, setSize] = useState<string>('10');

  const handleFullSearch = async () => {
    try {
      const startTime = Date.now();

      const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(`http://localhost:3000/searchtext/${searchFullText}/${size}`);

      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      setResponseTime(timeTaken);

      setSearchResults(response?.data?.result);
      setSearchResultsdata(response?.data?.result?.hits?.hits);
      setResponseMessage(response?.data?.message);
    } catch (error) {
      console.error('Error searching logs:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const startTime = Date.now();

      const response = await axios.post(`http://localhost:3000/searchfields/${searchField}/${searchValue}/${size}`);

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
        <span className='text-red-600 text-sm font-extrabold'>for both searches</span>
      <input
          type="number"
          className="text-black m-10 p-3 rounded-md "
          placeholder="Enter the size of the result"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />

        <br />
        <input
          type="text"
          className="text-black m-10 p-3 rounded-md "
          placeholder="Enter full text search"
          value={searchFullText}
          onChange={(e) => setSearchFullText(e.target.value)}
        />
        <Button onClick={handleFullSearch}>Search</Button>
        <br/>
        <input
          type="text"
          className="text-black m-10 p-3 rounded-md "
          placeholder="Enter feild name"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        />
        <input
          type="text"
          className="text-black m-10 p-3 rounded-md "
          placeholder="Enter  value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
         <Button onClick={handleSearch}>Field Search</Button>
       
        
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