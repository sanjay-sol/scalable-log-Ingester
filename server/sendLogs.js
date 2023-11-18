
import axios from 'axios';
// axios.defaults.maxSockets = Infinity;

const logEntry = {
  "level": "error",
  "message": "Failed to connect to DB",
  "resourceId": "server-1234",
  "timestamp": "2023-09-15T08:00:00Z",
  "traceId": "abc-xyz-123",
  "spanId": "span-456",
  "commit": "5e5342f",
  "metadata": {
    "parentResourceId": "server-0987"
  }
};

const sendLogs = async () => {
  const noOfreq = 10000;
  const endpoint = 'http://localhost:3000/logs';

  try {
    for (let i = 0; i < noOfreq; i++) {
      await axios.post(endpoint, logEntry);
      console.log(`Request ${i + 1} sent`);
    }
  } catch (error) {
    console.error('Error ', error.message);
  }
};

sendLogs();

