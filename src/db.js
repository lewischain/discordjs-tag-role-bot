// @ts-check
import { Database } from "kafka.db";
const db = new Database({
  pathName: "database/database.json"
});

export default db;