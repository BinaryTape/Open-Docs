import fs from 'node:fs';
import path from 'node:path';
import { DOCS_TYPES } from "./docs.config";

export default function markdownItWsVars(md) {
  const fileVarRegex = /<var\s+name="(?<name>[^"]+)"\s+value="(?<value>[^"]+)"[^>]*>/gi;

  function substituteGlobalVariables(state) {
    let currentSrc = state.src;

    const variables = Object.create(null);

    let xmlVarsString = '';
    if (state.env && state.env.relativePath) {
      const parts = state.env.relativePath.split('/');
      const docType = parts.find(p => DOCS_TYPES.includes(p));

      let xmlFilePath = '';
      switch (docType) {
        case 'kotlin': xmlFilePath = 'docs/.vitepress/kotlin.v.list'; break;
        case 'ktor':   xmlFilePath = 'docs/.vitepress/ktor.v.list';   break;
        case 'kmp':    xmlFilePath = 'docs/.vitepress/kmp.v.list';    break;
      }

      if (xmlFilePath) {
        try {
          const resolvedPath = path.resolve(xmlFilePath);
          if (fs.existsSync(resolvedPath)) {
            xmlVarsString = fs.readFileSync(resolvedPath, 'utf-8');
          }
        } catch (error) {
          console.error(`Error reading XML variable file:`, error);
        }
      }
    }

    if (xmlVarsString) {
      let m;
      while ((m = fileVarRegex.exec(xmlVarsString)) !== null) {
        variables[m.groups.name] = m.groups.value;
      }
    }

    const tokenRe = /<var\s+name="([^"]+)"\s+value="([^"]+)"[^>]*\/?>|%([a-zA-Z0-9_-]+)%/gi;

    let out = '';
    let last = 0;
    for (let m; (m = tokenRe.exec(currentSrc)) !== null; ) {
      out += currentSrc.slice(last, m.index);
      last = tokenRe.lastIndex;

      if (m[1] != null) {
        variables[m[1]] = m[2];
        continue;
      }

      if (m[3] != null) {
        const name = m[3];
        out += Object.prototype.hasOwnProperty.call(variables, name)
          ? String(variables[name])
          : `%${name}%`;
        continue;
      }
    }
    out += currentSrc.slice(last);

    state.src = out;
  }

  md.core.ruler.before('block', 'global_variable_replacer', substituteGlobalVariables);
}
