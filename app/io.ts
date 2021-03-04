import * as fs from "tauri/api/fs";
import * as dialog from "tauri/api/dialog";
// import * as process from "tauri/api/process";

interface Config {
  appVersion: string;
  lastDirectory: string | null;
}

interface ConfigUpdate {
  appVersion?: string;
  lastDirectory?: string | null;
}

const configDefaults: Config = {
  appVersion: "1",
  lastDirectory: null,
};
export const loadConfig = async (): Promise<Config> => {
  const content = localStorage.getItem("config");
  const data = JSON.parse(content || "{}");
  return { ...configDefaults, ...data };
};

export const saveConfig = async (config: ConfigUpdate) => {
  localStorage.setItem(
    "config",
    JSON.stringify({ ...configDefaults, ...config })
  );
  return Promise.resolve();
};

export const pickFolder = async (): Promise<string> => {
  const selection = await dialog.open({ directory: true, multiple: false });
  return Array.isArray(selection) ? selection[0] : selection;
};

export const loadFolder = async (path: string) => {
  return fs.readDir(path);
};

export const loadFile = async (path: string) => {
  console.log({ path });
  const contents = await fs.readTextFile(path);
  console.log({ contents });
  return contents;
};
