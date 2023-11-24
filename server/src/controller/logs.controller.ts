import { Request, Response } from "express";
import elasticClientInstance from "../elastic-client";
import { Client } from "@elastic/elasticsearch";
import { Log } from "../types/log";

const saveLogs = async (req: Request, res: Response) => {
  try {
    const log: Log = req.body;
    if (!log) {
      res.status(400).send({ message: "Invalid log" });
      return;
    }
    const result = await (elasticClientInstance as Client).index({
      index: "logs",
      document: log,
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


const getLogs = async (req: Request, res: Response) => {
  try {
    const result = await (elasticClientInstance as Client).search({
      index: "logs",
    });
    res.json(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    console.error("Error fetching logs:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getfullSearch = async (req: Request, res: Response) => {
  try {
    const { query } = req.params;

    const result = await (elasticClientInstance as Client).search({
      index: "logs",
      q: query,
    });
    res.send(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    res.status(500).json({ error: "Failed to get full search" });
  }
};


const querySearch = async (req: Request, res: Response) => {
  const data = req.query;

  const result = await(elasticClientInstance as Client).search({
    index: "logs",
    query: {
      match: {
        level: "error",
      },
    },
  });
  console.log(result + "Ssss");
  res.send(result);
};

const getLevelSearch = async (req: Request, res: Response) => {
  try {
    const { levelid, size } = req.params;
    if (!levelid) {
      res.status(400).send({ message: "Invalid levelid or size" });
      return;
    }

    const sizeInt = parseInt(size) || 10;
    const result = await (elasticClientInstance as Client).search({
      index: "logs",
      body: {
        query: {
          bool: {
            filter: {
              term: {
                level: levelid,
              },
            },
          },
        },
      },
      size: sizeInt,
    });
    res.send(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    res.status(500).json({ error: "Failed to get level search" });
  }
};

const getMessageSearch = async (req: Request, res: Response) => {
  try {
    const { messageinfo } = req.params;
    if (!messageinfo) {
      res.status(400).send({ message: "Invalid messageinfo" });
      return;
    }
    const result = await (elasticClientInstance as Client).search({
      index: "logs",
      query: {
        match: {
          message: messageinfo,
        },
      },
    });
    console.log(result);
    res.send(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    res.status(500).json({ error: "Failed to get message search" });
  }
};

const unifiedSearch = async (req: Request, res: Response) => {
  try {
    const { resourceId, traceId, timestamp, commit, spanId } = req.query;

    if (!resourceId && !traceId && !commit && !spanId && !timestamp) {
      res.status(400).send({ message: "Invalid parameters" });
      return;
    }

    let termQuery;

    switch (true) {
      case !!resourceId:
        termQuery = { resourceId };
        break;
      case !!traceId:
        termQuery = { traceId };
        break;
      case !!commit:
        termQuery = { commit };
        break;
      case !!spanId:
        termQuery = { spanId };
        break;
      case !!timestamp:
        termQuery = { timestamp };
        break;
      default:
        res.status(400).send({ message: "Invalid parameters" });
        return;
    }

    const query = {
      index: "logs",
      body: {
        query: {
          term: termQuery,
        },
      },
    };

    const result = await (elasticClientInstance as Client).search(query);

    res.send(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    res.status(500).json({ error: "Failed to get message search" });
  }
};

const getParentResourceId = async (req: Request, res: Response) => {
  try {
    const { resourceId } = req.params;

    if (!resourceId) {
      res.status(400).send({ message: "Invalid parameters" });
      return;
    }
    const result = await (elasticClientInstance as Client).search({
      index: "logs",
      body: {
        query: {
          term: {
            "metadata.parentResourceId": resourceId,
          },
        },
      },
    });

    res.send(result.hits.hits.map((hit) => hit._source));
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve parentResourceId" });
  }
};

export {
  getLevelSearch,
  getLogs,
  getParentResourceId,
  getMessageSearch,
  getfullSearch,
  querySearch,
  saveLogs,
  unifiedSearch,
};
