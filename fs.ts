import { path } from "./deps.ts";
export class FileInfo {
  name: string;
  path: string;
  isdir: boolean;

  constructor(n: string, p: string, d: boolean) {
    this.name = n;
    this.path = p;
    this.isdir = d;
  }
}

export class Directory {
  name: string;
  path: string;
  files: FileInfo[];

  constructor(n: string, p: string, files: FileInfo[]) {
    this.name = n;
    this.path = p;
    this.files = files;
  }
}

export function info(filePath: string): FileInfo {
  const fi = Deno.statSync(filePath);
  return new FileInfo(path.basename(filePath), filePath, fi.isDirectory);
}

export function dir(dirPath: string): Directory {
  const entries: Deno.DirEntry[] = [];
  for (const dirEntry of Deno.readDirSync(dirPath)) {
    entries.push(dirEntry);
  }
  const infos = [];
  for (const e of entries) {
    infos.push(new FileInfo(e.name, path.join(dirPath, e.name), e.isDirectory));
  }
  return new Directory(path.basename(dirPath), dirPath, infos);
}
