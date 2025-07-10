import fs from "fs";
import path from "path";
import {GoogleGenAI} from "@google/genai";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration from config file
const configPath = path.resolve(__dirname, "./translate-config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

// Google LLM API
const genAI = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

// Load terminology database
let terminology = {};

try {
    terminology = JSON.parse(fs.readFileSync(config.terminologyPath, "utf8"));
} catch (error) {
    terminology = {terms: {}};
}

// Calculate target file path
function getTargetPath(filePath, targetLang) {
    // baseDir/[language]/koin/relativePath
    const baseDir = "./docs";
    const docType = process.env.DOC_TYPE;
    const relativePath = path.relative(config.sourceDir, filePath);

    if (targetLang === "zh-Hans") {
        return path.join(baseDir, docType, relativePath);
    } else {
        return path.join(baseDir, targetLang, docType, relativePath);
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
        const content = fs.readFileSync(targetPath, "utf8");
        console.log(`Successfully loaded reference translation file: ${targetPath}`);

        return [{
            file: targetPath, content: content,
        },];
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
        .join("\n");

    // Get previously translated file with the same name as reference
    const previousTranslations = loadPreviousTranslations(targetLang, currentFilePath);

    // Build reference translation section
    let translationReferences = "";
    if (previousTranslations.length > 0) {
        // Choose English or Chinese based on target language
        if (targetLang === "ja" || targetLang === "ko") {
            translationReferences = "\n## Reference Translations (Reference previously translated documents to maintain consistent style and terminology)\n";
            translationReferences += `### Previous Translation Version\n\`\`\`\n${previousTranslations[0].content}\n\`\`\`\n\n`;
        } else {
            translationReferences = `\n\`\`\`\n${previousTranslations[0].content}\n\`\`\`\n\n`;
        }
    }

    // Choose appropriate prompt template based on target language
    const promptTemplate = getPromptTemplate(targetLang, getLangDisplayName(targetLang));

    // Insert variables into template
    return promptTemplate
        .replace("{RELEVANT_TERMS}", relevantTerms || (targetLang === "ja" || targetLang === "ko" ? "No relevant terms" : "无相关术语"))
        .replace("{TRANSLATION_REFERENCES}", translationReferences || (targetLang === "ja" || targetLang === "ko" ? "No reference translations" : "无参考翻译"))
        .replace("{SOURCE_TEXT}", sourceText);
}

// Get appropriate prompt template based on target language
function getPromptTemplate(targetLang, langDisplayName) {
    // Japanese and Korean use English prompts
    if (targetLang === "ja" || targetLang === "ko") {
        return `# Role and Task
  
    You are a professional AI translation assistant specializing in translating **Kotlin-related** English technical documentation into ${langDisplayName} with precision. Your goal is to produce high-quality, technically accurate translations that conform to the reading habits of the target language, primarily for a **developer audience**. Please strictly follow these guidelines and requirements:
    
    ## I. Translation Style and Quality Requirements
    
    1.  **Faithful to the Original and Fluent Expression:**
        * Translations should be natural and fluent while ensuring technical accuracy, conforming to the language habits of ${langDisplayName} and the expression style of the internet technology community.
        * Properly handle the original sentence structure and word order, avoiding literal translations that may create reading obstacles.
        * Maintain the tone of the original text (e.g., formal, informal, educational).
    
    2.  **Terminology Handling:**
        * **Prioritize the Terminology List:** Strictly translate according to the terminology list provided below. The terminology list has the highest priority.
        * **Reference Translation Consistency:** For terms not included in the terminology list, please refer to the reference translations to maintain consistency in style and existing terminology usage.
        * **New/Ambiguous Terminology Handling:**
            * For proper nouns or technical terms not included in the terminology list and without precedent in reference translations, if you choose to translate them, it is recommended to include the original English in parentheses after the translation at first occurrence, e.g., "Translation (English Term)".
            * If you are uncertain about a term's translation, or believe keeping the English is clearer, please **keep the original English text**.
        * **Placeholders/Variable Names:** Placeholders (such as \`YOUR_API_KEY\`) or special variable names in the document that are not in code blocks should usually be kept in English, or translated with comments based on context.
    
    ## II. Technical Format Requirements
    
    1.  **Markdown Format:**
        * Completely preserve all Markdown syntax and formatting in the original text, including but not limited to: headers, lists, bold, italics, strikethrough, blockquotes, horizontal rules, admonitions (:::), etc.
    
    2.  **Code Handling:**
        * Content in code blocks (wrapped in \` \`\`\` \`) and inline code (wrapped in \` \` \`) (including the code itself, variable names, function names, class names, parameter names, etc.) **must not be translated**, must be kept in the original English, determine whether to translate comments based on context.
    
    3.  **Links and Images:**
        * All links (URLs) and image reference paths in the original text must remain unchanged.
    
    4.  **HTML Tags:**
        * If HTML tags are embedded in the original Markdown, these tags and their attributes should also remain unchanged.
        
    ## III. YAML Frontmatter and Special Comments Handling Requirements
    
    1.  **Format Preservation:**
        * The format of the YAML Frontmatter section at the beginning of the document, surrounded by two '---', must be strictly preserved.
        * Keep all field names, colons, quotes, and other format symbols unchanged.
        
    2.  **Field Translation:**
        * Only translate the content values of fields like 'title', 'description', etc.
        * If field values contain quotes, ensure that the quote format is correctly preserved after translation.
        * Do not translate field names, configuration parameter names, or special identifiers.
        
    3.  **Special Comments Handling:**
        * Translate the title content in special comments like \`[//]: # (title: Content to translate)\`.
        * Keep the comment format unchanged, only translate the actual content after the colon.
        * Example: \`[//]: # (title: Kotlin/Native as an Apple framework – tutorial)\` should be translated to appropriate target language while maintaining the format.
    
    ## IV. Output Requirements
    
    1.  **Clean Output:** Output only the translated Markdown content. Do not include any additional explanations, statements, apologies, or self-comments (e.g., "This is a good translation..." or "Please note...").
    2.  **Consistent Structure:** Maintain the same document structure and paragraphing as the original text.
    
    ---
    
    ## V. Resources
    
    ### 1. Terminology List (Glossary)
    * The following terms must use the specified translations:
    {RELEVANT_TERMS}
    
    ### 2. Reference Translations
    * Please refer to the following previously translated document fragments to maintain consistency in style and terminology:
    {TRANSLATION_REFERENCES}
    
    ---
    
    ## VI. Content to Translate
    * Please translate the following Markdown content from English to ${langDisplayName}:
    
    \`\`\`markdown
    {SOURCE_TEXT}
    \`\`\``;
    }

    // Other languages use Chinese prompts
    return `# 角色与任务

    你是一位专业的 AI 翻译助手，专门负责将 **Github中Kotlin相关的** 英文技术文档精准翻译为 ${langDisplayName}。你的目标是产出高质量、技术准确、且符合目标语言阅读习惯的译文，主要面向**开发者受众**。请严格遵循以下指导原则和要求：
    
    ## 一、翻译风格与质量要求
    
    1.  **忠实原文与流畅表达:**
        * 在确保技术准确性的前提下，译文应自然流畅，符合 ${langDisplayName} 的语言习惯和互联网技术社群的表达方式。
        * 妥善处理原文的语序和句子结构，避免生硬直译或产生阅读障碍。
        * 保持原文的语气（例如：正式、非正式、教学性）。
    
    2.  **术语处理:**
        * **优先使用术语表:** 严格按照下方提供的(术语表)进行翻译。术语表具有最高优先级。
        * **参考翻译一致性:** 对于术语表中未包含的术语，请参考(参考翻译)以保持风格和已有术语使用的一致性。
        * **新/模糊术语处理:**
            * 对于术语表中未包含、参考翻译中亦无先例的专有名词或技术术语，若你选择翻译，建议在首次出现时，在译文后用括号附注英文原文，例如：“译文 (English Term)”。
            * 若对某个术语的翻译没有把握，或者认为保留英文更清晰，请**直接保留英文原文**。
        * **占位符/变量名:** 文档中非代码块内的占位符（如 \`YOUR_API_KEY\`）或特殊变量名，通常保留英文，或根据上下文判断是否需要翻译并加注释。
    
    ## 二、技术格式要求
    
    1.  **Markdown 格式:**
        * 完整保留原文中的所有 Markdown 语法和格式，包括但不限于：标题 (headers)、列表 (lists)、粗体 (bold)、斜体 (italics)、删除线 (strikethrough)、引用块 (blockquotes)、分隔线 (horizontal rules)、Admonition (:::) 等。
    
    2.  **代码处理:**
        * 代码块 (以 \` \`\`\` \` 包裹) 和内联代码 (以 \` \`\` \` 包裹) 中的内容（包括代码本身、变量名、函数名、类名、参数名等）**均不得翻译**，必须保持英文原文，根据上下文判断是否需要翻译注释。
    
    3.  **链接与图片:**
        * 原文中的所有链接 (URLs) 和图片引用路径 (image paths) 必须保持不变。
    
    4.  **HTML 标签:**
        * 如果原文 Markdown 中内嵌了 HTML 标签，这些标签及其属性也应保持不变。
        
    ## 三、YAML Frontmatter 及特殊注释处理要求
    
    1.  **格式保持:**
        * 文档开头由两个 '---' 包围的 YAML Frontmatter 部分的格式必须严格保持不变。
        * 保持所有字段名称、冒号、引号等格式符号不变。
        
    2.  **字段翻译:**
        * 仅翻译 'title'、'description' 等字段的内容值。
        * 如字段值包含引号，请确保在翻译后正确保留引号格式。
        * 不要翻译字段名、配置参数名或特殊标识符。
        
    3.  **特殊注释处理:**
        * 翻译形如 \`[//]: # (title: 标题内容)\` 的特殊注释中的标题内容。
        * 保持注释格式不变，只翻译冒号后的实际内容。
        * 例如: \`[//]: # (title: Kotlin/Native as an Apple framework – tutorial)\` 应翻译为 \`[//]: # (title: Kotlin/Native 作为 Apple 框架 – 教程)\`。

    ## 四、输出要求
    
    1.  **纯净输出:** 仅输出翻译后的 Markdown 内容。不要包含任何额外的解释、说明、道歉、或自我评论（例如，"这是一个不错的翻译…" 或 "请注意…"）。
    2.  **结构一致:** 保持与原文相同的文档结构和分段。
    
    ---
    
    ## 五、资源
    
    ### 1. 术语表 (Glossary)
    * 以下术语必须使用指定翻译：
    {RELEVANT_TERMS}
    
    ### 2. 参考翻译 (Translation References)
    * 请参考以下已翻译的文档片段，以保持风格和术语的一致性：
    {TRANSLATION_REFERENCES}
    
    ---
    
    ## 六、待翻译内容
    * 请将以下 Markdown 内容从英文翻译为 ${langDisplayName}:
    
    \`\`\`markdown
    {SOURCE_TEXT}
    \`\`\``;
}

// Call LLM API for translation
async function translateWithLLM(text, targetLang, filePath) {
    const modelConfig = config.modelConfigs[targetLang];
    const prompt = prepareTranslationPrompt(text, targetLang, filePath);

    console.log(`Translating to ${targetLang} using ${modelConfig.provider}:${modelConfig.model}`);

    if (modelConfig.provider === "google") {
        return await callGemini(prompt, modelConfig.model);
    }

    throw new Error(`Unsupported provider: ${modelConfig.provider}`);
}

// Call Gemini API
async function callGemini(prompt, model) {
    try {
        const response = await genAI.models.generateContent({
            model: model, contents: prompt, config: {
                temperature: 1,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Gemini API error:", error);
        throw error;
    }
}

// Translate file
async function translateFile(filePath) {
    console.log(`Translating file: ${filePath}`);

    if (!filePath) {
        console.error("Invalid file path");
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
        let content = fs.readFileSync(absoluteFilePath, "utf8");

        for (const targetLang of config.targetLanguages) {
            try {
                // Use new path calculation function
                const targetPath = getTargetPath(filePath, targetLang);

                if (!targetPath) {
                    console.error(`Unable to get target path: ${filePath} -> ${targetLang}`);
                    continue;
                }

                // Create target directory
                fs.mkdirSync(path.dirname(targetPath), {recursive: true});

                // Translate content
                let translatedContent;
                if (content && content.trim()) {
                    translatedContent = await translateWithLLM(content, targetLang, filePath);

                    // Check translation result
                    if (!translatedContent) {
                        console.error(`Translation result is empty: ${filePath} -> ${targetLang}`);
                        continue;
                    }

                    // Clean up extra content in translation result
                    translatedContent = cleanupTranslation(translatedContent);
                } else {
                    console.error(`File content is empty: ${filePath}`);
                    continue;
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
    formatForVitePress(text)
    // Remove markdown code block markers at beginning
    if (text.startsWith("```markdown")) {
        text = text.replace(/^```markdown\n/, "");
    } else if (text.startsWith("```md")) {
        text = text.replace(/^```md\n/, "");
    } else if (text.startsWith("```")) {
        text = text.replace(/^```\n/, "");
    }

    // Remove markdown code block markers at end
    if (text.endsWith("```")) {
        text = text.replace(/```$/, "");
    }

    // Remove extra 'n' characters (usually found in translation API error outputs)
    text = text.replace(/([^\\])\\n/g, "$1\n"); // Replace non-escaped \n with actual newline
    text = text.replace(/^\\n/g, "\n"); // Handle leading \n

    // Remove extra blank lines
    text = text.replace(/\n{3,}/g, "\n\n");

    // Remove possible extra spaces
    text = text.trim();

    return text;
}

/**
 * 将特定的 Markdown 折叠语法转换为 VitePress 的 details 容器格式。
 * Converts specific Markdown collapsible syntax to the VitePress details container format.
 * @param {string} text - 待处理的原始 Markdown 文本。The raw Markdown text to be processed.
 * @returns {string} - 处理后的、适用于 VitePress 的 Markdown 文本。The processed Markdown text compatible with VitePress.
 */
function formatForVitePress(text) {
    const collapsibleBlockRegex = /(###\s+(.+?)\s*\{[^{}]*\}\s*((?:(?!### |\|---\|---)[\s\S])*?)?\|---\|---\|\s*\n(```[\s\S]+?```)\s*(?:\s*\{[^{}]*\})?)|(\|---\|---\|\s*\n(```[\s\S]+?```)\s*\{[^{}]*?collapsed-title="([^"]+)"[^{}]*\})/g;
    const processedText = text.replace(collapsibleBlockRegex, (match, // Captures for the first pattern (starts with ###)
                                                               type1Match,      // The entire matched string for pattern 1
                                                               type1Title,      // The title from the '###' heading
                                                               type1Description,// The description content
                                                               type1CodeBlock,  // The code block for pattern 1
                                                               // Captures for the second pattern (starts with |---|---)
                                                               type2Match,      // The entire matched string for pattern 2
                                                               type2CodeBlock,  // The code block for pattern 2
                                                               type2Title       // The title from the 'collapsed-title' attribute
    ) => {
        // Case 1: A block that started with a '###' heading was matched.
        if (type1Match) {
            const cleanDescription = type1Description ? type1Description.trim() : '';
            // Assemble the VitePress container with a title, optional description, and code block.
            return `::: details ${type1Title.trim()}\n${cleanDescription ? cleanDescription + '\n\n' : ''}${type1CodeBlock}\n`;
        }
        // Case 2: A "solution" block that started with '|---|---' was matched.
        else if (type2Match) {
            // Assemble the VitePress container with the title from the attribute and the code block.
            return `::: details ${type2Title.trim()}\n${type2CodeBlock}\n:::`;
        }

        // Fallback, should not be reached with the current regex.
        return match;
    });

    // Clean up any remaining blank lines for a tidy output.
    return processedText.replace(/\n{3,}/g, '\n\n').trim();
}


// Get language display name
function getLangDisplayName(langCode) {
    return config.languageNames[langCode] || langCode;
}

// Main function
async function main() {
    const changedFilesInput = process.env.CHANGED_FILES || "";
    console.log(`Environment variable CHANGED_FILES: ${changedFilesInput}`);

    const changedFiles = changedFilesInput
        .split(/[\s,]+/)
        .filter((file) => file.trim());
    console.log(`Found ${changedFiles.length} changed files`);

    if (changedFiles.length === 0) {
        console.log("No files found to translate, if you need to specify files, please set CHANGED_FILES environment variable");
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

    console.log("Translation completed");
}

export async function translateFiles(docType, repoPath, files) {
    console.log(`Translating ${files.length} files for ${docType}...`);

    // Set environment variables
    process.env.REPO_PATH = repoPath;
    process.env.DOC_TYPE = docType;
    for (const file of files) {
        try {
            await translateFile(file);
        } catch (error) {
            console.error(`Error translating ${file}:`, error);
            // Continue processing next file
        }
    }
}

main().catch(console.error);
