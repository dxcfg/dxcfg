import { basename } from "./deps.ts";
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

export function info(path: string): FileInfo {
  const fi = Deno.statSync(path);
  return new FileInfo(basename(path), path, fi.isDirectory);
}

export function dir(path: string): Directory {
  const entries: Deno.DirEntry[] = [];
  for (const dirEntry of Deno.readDirSync(path)) {
    entries.push(dirEntry);
  }
  const infos = [];
  for (const e of entries) {
    infos.push(new FileInfo(e.name, e.name, e.isDirectory));
  }
  return new Directory(basename(path), path, infos);
}
