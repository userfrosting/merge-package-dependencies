<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@userfrosting/merge-package-dependencies](./merge-package-dependencies.md) &gt; [yarnIsFlat](./merge-package-dependencies.yarnisflat.md)

## yarnIsFlat() function

Uses `yarn.lock` to detect if multiple versions of a dependency have been installed.

<b>Signature:</b>

```typescript
export declare function yarnIsFlat(p?: string, log?: LogOption): boolean;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  p | <code>string</code> | Directory of <code>yarn.lock</code>. |
|  log | <code>LogOption</code> | If true, progress and errors will be logged. Has no affect on exceptions thrown. |

<b>Returns:</b>

`boolean`
