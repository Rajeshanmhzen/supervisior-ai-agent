import { config } from "dotenv";
import app from "./src/app";
  
config();

const PORT = Number(process.env.PORT) || 3000;
app.listen({ port: PORT }, (err: Error | null, address: string) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is running on port http://localhost:${address.split(':').pop()}`);
});
