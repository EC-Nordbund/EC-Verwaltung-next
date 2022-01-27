import { createReport } from "docx-templates";
import { expose } from "comlink";

export const api = {
  createReport,
};

expose(api);
