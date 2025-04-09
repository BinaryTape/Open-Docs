const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");

// Load configuration from config file
const configPath = path.resolve(__dirname, './translate-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Google LLM API
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Load terminology database
let terminology = {};

try {
    terminology = JSON.parse(fs.readFileSync(config.terminologyPath, 'utf8'));
} catch (error) {
    terminology = { terms: {} };
}

// Extract frontmatter and content
function extractFrontmatterAndContent(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(frontmatterRegex);

    if (match) {
        const frontmatter = match[0];
        const mainContent = content.slice(match[0].length);
        return { frontmatter, mainContent };
    }

    return { frontmatter: '', mainContent: content };
}

// Parse and modify frontmatter
function parseFrontmatter(frontmatter) {
    if (!frontmatter) return { frontmatterObj: {}, rawFrontmatter: '' };

    // Remove frontmatter delimiters
    const contentOnly = frontmatter.replace(/^---\n/, '').replace(/\n---\n$/, '');

    // Parse frontmatter content as object
    const frontmatterObj = {};
    const lines = contentOnly.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();

            // Handle quoted values
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.substring(1, value.length - 1);
            }

            frontmatterObj[key] = value;
        }
    }

    return { frontmatterObj, rawFrontmatter: contentOnly };
}

// Generate frontmatter string
function generateFrontmatter(frontmatterObj) {
    let result = '---\n';

    for (const [key, value] of Object.entries(frontmatterObj)) {
        // Wrap value in quotes if it contains special characters or spaces
        const needsQuotes = /[:"\s]/.test(value);
        result += `${key}: ${needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value}\n`;
  }
  
  result += '---\n';
  return result;
}

// Translate title in frontmatter
async function translateFrontmatter(frontmatter, targetLang, filePath) {
  if (!frontmatter) return '';
  
  const { frontmatterObj, rawFrontmatter } = parseFrontmatter(frontmatter);
  
  // Check if there are fields to translate
  const fieldsToTranslate = ['title', 'description', 'sidebar_label'];
  const hasFieldsToTranslate = fieldsToTranslate.some(field => frontmatterObj[field]);
  
  if (!hasFieldsToTranslate) {
      // Even if there are no fields to translate, still need to generate new frontmatter to include possible added slug
      return generateFrontmatter(frontmatterObj);
  }
  
  // Prepare text to translate
  const textsToTranslate = [];
  for (const field of fieldsToTranslate) {
      if (frontmatterObj[field]) {
          textsToTranslate.push(`${field}: ${frontmatterObj[field]}`);
      }
  }
  
  if (textsToTranslate.length === 0) {
      return generateFrontmatter(frontmatterObj);
  }
  
  // Join fields into text for translation
  const textToTranslate = textsToTranslate.join('\n');
  const translatedText = await translateWithLLM(textToTranslate, targetLang, filePath);
  const cleanedTranslatedText = cleanupTranslation(translatedText);
  
  // Parse translation results back to object
  const translatedLines = cleanedTranslatedText.split('\n');
  for (const line of translatedLines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          // If it's a field we want to translate, update the value
          if (fieldsToTranslate.includes(key) && frontmatterObj[key]) {
              frontmatterObj[key] = value;
          }
      }
  }
  
  // Generate new frontmatter
  return generateFrontmatter(frontmatterObj);
}

// Calculate target file path
function getTargetPath(filePath, targetLang) {
  // For Simplified Chinese, store directly in baseDir/docs
  if (targetLang === 'zh-Hans') {
      const baseDir = process.env.BASE_DIR || '.';
      const relativePath = path.relative(config.sourceDir, filePath);
      return path.join(baseDir, 'docs', relativePath);
  } 
  // Other languages go in i18n/[language]/content-docs/current
  else {
      const baseDir = process.env.BASE_DIR || '.';
      const relativePath = path.relative(config.sourceDir, filePath);
      return path.join(baseDir, 'i18n', targetLang, 'docusaurus-plugin-content-docs', 'current', relativePath);
  }
}

// Load previously translated related files as reference
function loadPreviousTranslations(targetLang, currentFilePath) {
  try {
      // Calculate path for the corresponding translation file
      const targetPath = getTargetPath(currentFilePath, targetLang);
      
      console.log(`Trying to load reference translation: ${targetPath}`);
      
      // Check if corresponding translation file exists
      if (!fs.existsSync(targetPath)) {
          console.log(`Reference translation file does not exist: ${targetPath}`);
          return [];
      }
      
      // Read previous translation content
      const content = fs.readFileSync(targetPath, 'utf8');
      console.log(`Successfully loaded reference translation file: ${targetPath}`);
      
      return [{
          file: targetPath,
          content: content
      }];
      
  } catch (error) {
      console.error("Error loading previous translation:", error);
      return [];
  }
}

// Prepare translation prompt
function prepareTranslationPrompt(sourceText, targetLang, currentFilePath) {
  // Get relevant terminology
  const relevantTerms = Object.entries(terminology.terms)
      .filter(([term]) => sourceText.includes(term))
      .map(([term, translations]) => `"${term}" → "${translations[targetLang]}"`)
      .join('\n');
  
  // Get previously translated file with the same name as reference
  const previousTranslations = loadPreviousTranslations(targetLang, currentFilePath);
  
  // Build reference translation section
  let translationReferences = '';
  if (previousTranslations.length > 0) {
      // Choose English or Chinese based on target language
      if (targetLang === 'ja' || targetLang === 'ko') {
          translationReferences = '\n## Reference Translations (Reference previously translated documents to maintain consistent style and terminology)\n';
          translationReferences += `### Previous Translation Version\n\`\`\`\n${previousTranslations[0].content}\n\`\`\`\n\n`;
      } else {
          translationReferences = '\n## 参考翻译（参考以下之前翻译过的文档，保持风格和术语一致性）\n';
          translationReferences += `### 之前的翻译版本\n\`\`\`\n${previousTranslations[0].content}\n\`\`\`\n\n`;
      }
  }

  // Choose appropriate prompt template based on target language
  const promptTemplate = getPromptTemplate(targetLang, getLangDisplayName(targetLang));

  // Insert variables into template
  return promptTemplate
    .replace('{RELEVANT_TERMS}', relevantTerms || (targetLang === 'ja' || targetLang === 'ko' ? 'No relevant terms' : '无相关术语'))
    .replace('{TRANSLATION_REFERENCES}', translationReferences || (targetLang === 'ja' || targetLang === 'ko' ? 'No reference translations' : '无参考翻译'))
    .replace('{SOURCE_TEXT}', sourceText);
}

// Get appropriate prompt template based on target language
function getPromptTemplate(targetLang, langDisplayName) {
  // Japanese and Korean use English prompts
  if (targetLang === 'ja' || targetLang === 'ko') {
    return `You are a professional translator specializing in technical documentation translation from English to ${langDisplayName}. Please follow these requirements strictly:
  
  ## Translation Style and Quality Requirements
  1. Ensure the translation fits the internet usage context of ${langDisplayName}, correctly handle inversions and different language word orders, and properly retain brackets and English notes for professional terms
  2. Use terminology consistently and accurately, naturally integrating them into sentences based on context

  ## Technical Requirements
  1. Maintain all Markdown formatting, code blocks, and links unchanged
  2. DO NOT translate the code inside code examples
  3. Terms in the terminology list must be translated as specified
  4. For proprietary nouns that cannot be determined, keep the original English
  5. Reference previously translated documents provided to maintain consistency in translation style and terminology usage

  ## Output Requirements
  - Output only the translation result, without adding explanations or comments
  - Maintain all original Markdown syntax and formatting
  - Keep all code blocks, variable names, and function names unchanged
  - Ensure all links and references remain unchanged
  
  ## Terminology List
  {RELEVANT_TERMS}

  ## Reference Translations
  {TRANSLATION_REFERENCES}

  ## Content to Translate
  \`\`\`markdown
  {SOURCE_TEXT}
  \`\`\`
  `;
  }
  
  // Other languages use Chinese prompts
  return `你是一位精通技术文档翻译的专业翻译人员，负责将英文技术文档准确翻译为${langDisplayName}。请严格遵循以下要求：
  
  ## 翻译风格和质量要求
  1. 尽量符合${langDisplayName}互联网的使用语境，并正确处理倒装和不同语言的语序，给专业的名词适当保留括号以及英文注释
  2. 术语使用统一、准确，并根据上下文自然融入语句

  ## 技术要求

  1. 保持所有 Markdown 格式、代码块和链接不变  
  2. 代码示例内的代码**不要翻译**
  3. 术语表中的术语必须使用指定翻译
  4. 对于无法确定的专有名词，保留英文原文
  5. 参考提供的之前翻译过的文档，保持翻译风格和术语使用的一致性

  ## 输出要求

  - 仅输出翻译结果，不要添加解释或注释
  - 保持所有原始的 Markdown 语法和格式
  - 保留原文中的所有代码块、变量名和函数名不变
  - 确保所有链接和引用保持不变
  
  ## 术语表
  {RELEVANT_TERMS}

  ## 参考翻译
  {TRANSLATION_REFERENCES}

  ## 待翻译内容
  \`\`\`markdown
  {SOURCE_TEXT}
  \`\`\`
  `;
}

// Call LLM API for translation
async function translateWithLLM(text, targetLang, filePath) {
  const modelConfig = config.modelConfigs[targetLang];
  const prompt = prepareTranslationPrompt(text, targetLang, filePath);

  console.log(`Translating to ${targetLang} using ${modelConfig.provider}:${modelConfig.model}`);

  if (modelConfig.provider === 'google') {
      return await callGemini(prompt, modelConfig.model);
  }

  throw new Error(`Unsupported provider: ${modelConfig.provider}`);
}

// Call Gemini API
async function callGemini(prompt, model, retryCount = 0, maxRetries = 3, initialDelay = 2000) {
  try {
      const response = await genAI.models.generateContent({
          model: model,
          contents: prompt,
          config: {
              temperature: 1
          }
      });

      return response.text;
  } catch (error) {
      console.error(`Gemini API error (attempt ${retryCount + 1}/${maxRetries + 1}):`, error);
      
      // Check if it's a retryable error (503 Service Unavailable or other temporary errors)
      const isRetryableError = 
          error.message.includes('503') || 
          error.message.includes('overloaded') || 
          error.message.includes('unavailable') ||
          error.message.includes('timeout') ||
          error.message.includes('rate limit');
      
      // If it's a retryable error and we have retry attempts left
      if (isRetryableError && retryCount < maxRetries) {
          // Calculate exponential backoff time, doubling wait time with each retry
          const delay = initialDelay * Math.pow(2, retryCount);
          console.log(`Retrying in ${delay / 1000} seconds...`);
          
          // Wait for a period before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Recursively call itself to retry, increasing retry count
          return callGemini(prompt, model, retryCount + 1, maxRetries, initialDelay);
      }
      
      // If it's not a retryable error or max retries reached, throw the error
      throw error;
  }
}

// Translate file
async function translateFile(filePath) {
  console.log(`Translating file: ${filePath}`);
  
  if (!filePath) {
      console.error('Invalid file path');
      return;
  }
  
  // Fix file path, need to read source file from REPO_PATH
  const absoluteFilePath = path.resolve(process.env.REPO_PATH, filePath);
  
  // Check if file exists
  if (!fs.existsSync(absoluteFilePath)) {
      console.error(`File not found: ${absoluteFilePath}`);
      return;
  }
  
  try {
      let content = fs.readFileSync(absoluteFilePath, 'utf8');

      const { frontmatter, mainContent } = extractFrontmatterAndContent(content);

      for (const targetLang of config.targetLanguages) {
          try {
              // Use new path calculation function
              const targetPath = getTargetPath(filePath, targetLang);
              
              if (!targetPath) {
                  console.error(`Unable to get target path: ${filePath} -> ${targetLang}`);
                  continue;
              }

              // Create target directory
              fs.mkdirSync(path.dirname(targetPath), { recursive: true });

              // Translate frontmatter
              const translatedFrontmatter = await translateFrontmatter(frontmatter, targetLang, filePath);

              // Translate content
              let translatedContent;
              if (mainContent && mainContent.trim()) {
                  translatedContent = await translateWithLLM(mainContent, targetLang, filePath);

                  // Check translation result
                  if (!translatedContent) {
                      console.error(`Translation result is empty: ${filePath} -> ${targetLang}`);
                      continue;
                  }

                  // Clean up extra content in translation result
                  translatedContent = cleanupTranslation(translatedContent);

                  // Complete document = translated frontmatter + translated content
                  translatedContent = translatedFrontmatter + translatedContent;
              } else {
                  // In case of only frontmatter, use translated frontmatter
                  translatedContent = translatedFrontmatter;
              }

              // Write translated file
              fs.writeFileSync(targetPath, translatedContent);
              console.log(`Translated to ${targetLang}: ${targetPath}`);
          } catch (langError) {
              console.error(`Error translating to ${targetLang}: ${langError.message}`);
          }
      }
  } catch (fileError) {
      console.error(`Error processing file ${filePath}: ${fileError.message}`);
  }
}

// Clean up extra content in translation results
function cleanupTranslation(text) {
  // Remove markdown code block markers at beginning
  if (text.startsWith('```markdown')) {
      text = text.replace(/^```markdown\n/, '');
  } else if (text.startsWith('```md')) {
      text = text.replace(/^```md\n/, '');
  } else if (text.startsWith('```')) {
      text = text.replace(/^```\n/, '');
  }
  
  // Remove markdown code block markers at end
  if (text.endsWith('```')) {
      text = text.replace(/```$/, '');
  }
  
  // Remove extra 'n' characters (commonly appear in translation API error outputs)
  text = text.replace(/([^\\])\\n/g, '$1\n'); // Replace \n that isn't escaped with actual newline
  text = text.replace(/^\\n/g, '\n'); // Handle \n at beginning of line
  
  // Remove extra empty lines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Remove possible extra spaces
  text = text.trim();
  
  return text;
}

// Get language display name
function getLangDisplayName(langCode) {
  return config.languageNames[langCode] || langCode;
}

// Main function
async function main() {
  const changedFilesInput = process.env.CHANGED_FILES || '';
  console.log(`Environment variable CHANGED_FILES: ${changedFilesInput}`);
  
  const changedFiles = changedFilesInput.split(/[\s,]+/).filter(file => file.trim());
  console.log(`Found ${changedFiles.length} changed files`);

  if (changedFiles.length === 0) {
      console.log('No files found for translation. If you need to specify files, set the CHANGED_FILES environment variable');
      return;
  }

  for (const file of changedFiles) {
      try {
          await translateFile(file);
      } catch (error) {
          console.error(`Error translating ${file}:`, error);
          // Continue processing next file
      }
  }

  console.log('Translation completed');
}

main().catch(console.error);