import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!req.body || !Array.isArray(req.body)) {
            return res.status(400).json({ error: 'Data should be in JSON format.' });
        }

        const result = await postLogsToExpress(req.body as Log[]);
        res.status(200).json({ message: 'Logs ingested successfullyy.', result });
    } catch (err) {
        console.error('Error while ingesting:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function postLogsToExpress(logData: Log[]): Promise<AxiosResponse> {
    const expressServerUrl = 'http://localhost:3001/logs';

    return axios.post(expressServerUrl, logData);
}
