import configs from "../utils/config";

const { session: memorySession } = require("telegraf");
const session = memorySession();

export default session;
