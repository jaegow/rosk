---
id: dx/copy/keys
kind: rule
status: settled
---
# Keys

- A key is one flat string, segments `[domain].[feature].[element].[variant?]`, lowerCamelCase each.
- Reserve `common.*` for strings reused across domains.
- Add the key to the translation file and read it through `useCopy`; never the i18next instance.
- Write the key literally at the point of use: never in a variable, never built from parts. Either widens it to `string`, so a typo or a stale key stops failing typecheck. Branch with one literal call per case.
