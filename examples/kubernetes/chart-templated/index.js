import { param, read, write, Format, dir } from '../../deps.ts';
import { HandlebarsJS } from "../../deps.ts";
const compile = (HandlebarsJS).compile;

const resources = (values) => {
    return dir("./templates").files.map(f => {
        const template = compile(Deno.readTextFileSync(f.path))
        return template({ values })
    })
}

const values = await param.all();
const res = resources(values)
await write(resources(values), 'chart.yaml', { format: Format.MULTI_YAML })
console.log(await read('chart.yaml'))