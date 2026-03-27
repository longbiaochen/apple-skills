import { runDoctor } from "../src/lib/doctor.mjs";

const result = await runDoctor();
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
