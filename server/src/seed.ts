import { seeder } from "./seeder";

seeder().finally(() => {
    process.exit();
});
