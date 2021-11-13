import { param, paramSync } from "./param.ts";
import { write } from "./write.ts";
import { assertEquals } from "./deps.ts";

Deno.test("param.all with only defaults", async () => {
  const args: string[] = [];
  assertEquals(await param.all({ x: "y" }, args), { x: "y" });
});

Deno.test("param.all with only cli args", async () => {
  const args: string[] = ["-p", "x=z", "-p", "t=v"];
  assertEquals(await param.all(undefined, args), { x: "z", t: "v" });
});

Deno.test("param.all with defaults and cli args", async () => {
  const args: string[] = ["-p", "x=z", "-p", "t=v"];
  assertEquals(await param.all({ x: "y" }, args), { x: "z", t: "v" });
});

Deno.test("param.all with defaults, cli args and file parameters", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(await param.all({ x: "y" }, args), {
    x: "z",
    t: "v",
    a: "b",
    c: {
      d: "e",
    },
  });
});

Deno.test("param.all with defaults, cli args and file parameters: ensure right to left merge override", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = [
    "-p",
    "x=z",
    "-f",
    filePath,
    "-p",
    "t=v",
    "-p",
    "a=k",
  ];
  assertEquals(await param.all({ x: "y" }, args), {
    x: "z",
    t: "v",
    a: "k",
    c: {
      d: "e",
    },
  });
});

Deno.test("param.string with only defaults", async () => {
  const args: string[] = [];
  assertEquals(await param.string("x", "y", args), "y");
});

Deno.test("param.string with only cli args", async () => {
  const args: string[] = ["-p", "x=y"];
  assertEquals(await param.string("x", undefined, args), "y");
});

Deno.test("param.string with defaults and cli args", async () => {
  const args: string[] = ["-p", "x=v"];
  assertEquals(await param.string("x", "y", args), "v");
});

Deno.test("param.string with defaults, cli args and file parameters", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(await param.string("a", "x", args), "b");
});

Deno.test("param.string with defaults, cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(await param.string("c.d", "x", args), "e");
});

Deno.test("param.string with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(await param.string("c.d", undefined, args), "e");
});

Deno.test("param.number with only defaults", async () => {
  const args: string[] = [];
  assertEquals(await param.number("x", 1, args), 1);
});

Deno.test("param.number with only cli args", async () => {
  const args: string[] = ["-p", "x=1"];
  assertEquals(await param.number("x", undefined, args), 1);
});

Deno.test("param.number with defaults and cli args", async () => {
  const args: string[] = ["-p", "x=1"];
  assertEquals(await param.number("x", 2, args), 1);
});

Deno.test("param.number with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: 10,
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(await param.number("c.d", undefined, args), 10);
});

Deno.test("param.boolean with only defaults", async () => {
  const args: string[] = [];
  assertEquals(await param.boolean("x", true, args), true);
});

Deno.test("param.boolean with only cli args", async () => {
  const args: string[] = ["-p", "x=true"];
  assertEquals(await param.boolean("x", undefined, args), true);
});

Deno.test("param.boolean with defaults and cli args", async () => {
  const args: string[] = ["-p", "x=true"];
  assertEquals(await param.boolean("x", false, args), true);
});

Deno.test("param.boolean with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: true,
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(await param.boolean("c.d", undefined, args), true);
});

Deno.test("param.object with only defaults", async () => {
  const args: string[] = [];
  assertEquals(await param.object("x", { a: "b" }, args), { a: "b" });
});

Deno.test("param.object with only cli args", async () => {
  const args: string[] = ["-p", "x.a=b"];
  assertEquals(await param.object("x", undefined, args), { a: "b" });
});

Deno.test("param.object with defaults and cli args", async () => {
  const args: string[] = ["-p", "x.a=b"];
  assertEquals(await param.object("x", { a: "c" }, args), { a: "b" });
});

Deno.test("param.object with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "c.f=g", "-f", filePath];
  assertEquals(await param.object("c", undefined, args), { d: "e", f: "g" });
});

Deno.test("param.object with defaults, cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "c.f=g", "-f", filePath];
  assertEquals(await param.object("c", { k: "l" }, args), {
    d: "e",
    f: "g",
    k: "l",
  });
});

// sync

Deno.test("paramSync.all with only defaults", () => {
  const args: string[] = [];
  assertEquals(paramSync.all({ x: "y" }, args), { x: "y" });
});

Deno.test("paramSync.all with only cli args", () => {
  const args: string[] = ["-p", "x=z", "-p", "t=v"];
  assertEquals(paramSync.all(undefined, args), { x: "z", t: "v" });
});

Deno.test("paramSync.all with defaults and cli args", () => {
  const args: string[] = ["-p", "x=z", "-p", "t=v"];
  assertEquals(paramSync.all({ x: "y" }, args), { x: "z", t: "v" });
});

Deno.test("paramSync.all with defaults, cli args and file parameters", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(paramSync.all({ x: "y" }, args), {
    x: "z",
    t: "v",
    a: "b",
    c: {
      d: "e",
    },
  });
});

Deno.test("paramSync.all with defaults, cli args and file parameters: ensure right to left merge override", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = [
    "-p",
    "x=z",
    "-f",
    filePath,
    "-p",
    "t=v",
    "-p",
    "a=k",
  ];
  assertEquals(paramSync.all({ x: "y" }, args), {
    x: "z",
    t: "v",
    a: "k",
    c: {
      d: "e",
    },
  });
});

Deno.test("paramSync.string with only defaults", () => {
  const args: string[] = [];
  assertEquals(paramSync.string("x", "y", args), "y");
});

Deno.test("paramSync.string with only cli args", () => {
  const args: string[] = ["-p", "x=y"];
  assertEquals(paramSync.string("x", undefined, args), "y");
});

Deno.test("paramSync.string with defaults and cli args", () => {
  const args: string[] = ["-p", "x=v"];
  assertEquals(paramSync.string("x", "y", args), "v");
});

Deno.test("paramSync.string with defaults, cli args and file parameters", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(paramSync.string("a", "x", args), "b");
});

Deno.test("paramSync.string with defaults, cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(paramSync.string("c.d", "x", args), "e");
});

Deno.test("paramSync.string with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(paramSync.string("c.d", undefined, args), "e");
});

Deno.test("paramSync.number with only defaults", () => {
  const args: string[] = [];
  assertEquals(paramSync.number("x", 1, args), 1);
});

Deno.test("paramSync.number with only cli args", () => {
  const args: string[] = ["-p", "x=1"];
  assertEquals(paramSync.number("x", undefined, args), 1);
});

Deno.test("paramSync.number with defaults and cli args", () => {
  const args: string[] = ["-p", "x=1"];
  assertEquals(paramSync.number("x", 2, args), 1);
});

Deno.test("paramSync.number with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: 10,
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(paramSync.number("c.d", undefined, args), 10);
});

Deno.test("paramSync.boolean with only defaults", () => {
  const args: string[] = [];
  assertEquals(paramSync.boolean("x", true, args), true);
});

Deno.test("paramSync.boolean with only cli args", () => {
  const args: string[] = ["-p", "x=true"];
  assertEquals(paramSync.boolean("x", undefined, args), true);
});

Deno.test("paramSync.boolean with defaults and cli args", () => {
  const args: string[] = ["-p", "x=true"];
  assertEquals(paramSync.boolean("x", false, args), true);
});

Deno.test("paramSync.boolean with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: true,
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "x=z", "-p", "t=v", "-f", filePath];
  assertEquals(paramSync.boolean("c.d", undefined, args), true);
});

Deno.test("paramSync.object with only defaults", () => {
  const args: string[] = [];
  assertEquals(paramSync.object("x", { a: "b" }, args), { a: "b" });
});

Deno.test("paramSync.object with only cli args", () => {
  const args: string[] = ["-p", "x.a=b"];
  assertEquals(paramSync.object("x", undefined, args), { a: "b" });
});

Deno.test("paramSync.object with defaults and cli args", () => {
  const args: string[] = ["-p", "x.a=b"];
  assertEquals(paramSync.object("x", { a: "c" }, args), { a: "b" });
});

Deno.test("paramSync.object with cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "c.f=g", "-f", filePath];
  assertEquals(paramSync.object("c", undefined, args), { d: "e", f: "g" });
});

Deno.test("paramSync.object with defaults, cli args and file parameters: value by path", async () => {
  const fileData = {
    a: "b",
    c: {
      d: "e",
    },
  };
  const filePath = Deno.makeTempFileSync({ suffix: ".json" });
  await write(fileData, filePath);
  const args: string[] = ["-p", "c.f=g", "-f", filePath];
  assertEquals(paramSync.object("c", { k: "l" }, args), {
    d: "e",
    f: "g",
    k: "l",
  });
});
