import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

const app = createApp();

connectDatabase()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Ronica API listening on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API", error);
    process.exit(1);
  });
