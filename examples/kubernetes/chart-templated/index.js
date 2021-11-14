import { param, write, parse, Format, dir } from '../../deps.ts';
import { HandlebarsJS } from "../../deps.ts";
const compile = (HandlebarsJS).compile;

const resources = (values) => {
    return dir("./templates").files.map(f => {
        const template = compile(Deno.readTextFileSync(f.path))
        return parse(template({ values }), { format: Format.YAML })
    })
}

const values = await param.all();
await write(resources(values), 'chart.yaml', { format: Format.MULTI_YAML })