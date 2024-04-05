import configs from "../utils/config";
import { Redis } from "@telegraf/session/redis";

const store = Redis({
  url: "redis://127.0.0.1:6379",
});
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
