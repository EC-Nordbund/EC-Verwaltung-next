import { createReport } from "docx-templates";
import { expose } from "comlink";

export const api = {
  createReport(options: Parameters<typeof createReport>[0]) {
    // Make it faster! As we create a new worker for each request!
    options.noSandbox = true;

    return createReport(options);
  },
};

expose(api);
