<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@userfrosting/merge-package-dependencies](./merge-package-dependencies.md) &gt; [npm](./merge-package-dependencies.npm.md)

## npm() function

Merge specified npm packages together.

**Signature:**

```typescript
export declare function npm<TTemplate extends INodeTemplate>(template: TTemplate, paths: string[], saveTo?: string | null, log?: LogOption): TTemplate;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

template


</td><td>

TTemplate


</td><td>

Template that packages will be merged into. Is validated with \[package-json-validator\](https://www.npmjs.com/package/package-json-validator) with template.private == true overriding this.


</td></tr>
<tr><td>

paths


</td><td>

string\[\]


</td><td>

Paths to package.json files. EG: "path/to/" (package.json is prepended) or "path/to/package.json" or "path/to/different.json".


</td></tr>
<tr><td>

saveTo


</td><td>

string \| null


</td><td>

_(Optional)_ If string, saves the generated package.json to the specified path. Like 'paths', has 'package.json' prepended if required.


</td></tr>
<tr><td>

log


</td><td>

[LogOption](./merge-package-dependencies.logoption.md)


</td><td>

_(Optional)_ If true, progress and errors will be logged. Has no affect on exceptions thrown.


</td></tr>
</tbody></table>
**Returns:**

TTemplate

