
// create redis connection using ioredis 
// ioredis is a promise based redis client for node.js and typescript 
// ioredis client is used to connect to the redis server 
// ioredis client is used to perform operations on the redis server 
// redis server is a in-memory data structure store 
// redis server is used to store data   in-memory 
// redis server is used to perform operations on the in-memory data structure store 
// how to connect redis client to the redis server 
// redis server is running on port 6379 
// redis server is running on host localhost 
// redis server is running on user default 
// redis server is running on password default 
// redis server is running on database default 
// redis server is running on timeout default 
// redis server is running on maxRetriesPerRequest default 
// redis server is running on maxRetriesPerRequest default 
// redis server run on local machine using docker container 

// all Redis connections use the same configuration -

import "./env.js";

const redisConfig = {
  host: process.env.REDIS_HOST!,
  port: Number(process.env.REDIS_PORT!),


  // password: process.env.REDIS_PASSWORD === 'default' ? undefined : process.env.REDIS_PASSWORD,
  // db: Number(process.env.REDIS_DB) || 0,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

console.log("host", redisConfig.host)
console.log("port", redisConfig.port)

export default redisConfig;  