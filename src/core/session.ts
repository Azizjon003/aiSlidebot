import configs from "../utils/config";

const RedisSession = require("telegraf-session-redis");
// const sessionStorage = ;
const { session: memorySession } = require("telegraf");
const session = memorySession();

// const session = new RedisSession({
//   store: {
//     host: "127.0.0.1",

//     port: 6379,
//   },
// });
export default session;
