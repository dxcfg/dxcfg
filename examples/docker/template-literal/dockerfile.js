import { write } from "../../deps.ts";
import { Dockerfile } from "./docker.js";

const myService = {
  name: "my-service",
  port: 80,
};

await write(Dockerfile(myService), "Dockerfile");
