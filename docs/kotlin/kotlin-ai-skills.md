[//]: # (title: Kotlin AI 技能)
[//]: # (description: 了解什么是 Kotlin AI 技能，它们如何帮助 AI 代理，以及在哪里可以找到可用的技能。)

Kotlin AI 技能是可重用的指令，可帮助 AI 代理更可靠地执行特定于 Kotlin 的任务。

技能为 AI 代理在开始执行任务之前提供所需的上下文。例如，一项技能可以指向相关的 API、定义先决条件或提供分步工作流指南。

Kotlin AI 技能可帮助代理产出更准确的结果，并减少您亲自解释任务所花费的时间。对于团队而言，技能还为常见任务提供了共享框架，从而让每个人都能获得一致的结果。

<a href="https://github.com/Kotlin/kotlin-agent-skills"><img src="kotlin-ai-skills.svg" alt="Explore Kotlin AI skills" type="block"/></a>

Kotlin AI 技能遵循 [Agent Skills 标准](https://agentskills.io/home)，因此您可以将它们用于兼容的 AI 代理，例如 [Junie](https://www.jetbrains.com/junie/)、Claude Code、OpenAI Codex、Google Gemini 和 GitHub Copilot。

## 支持的工作流

您可以将 Kotlin AI 技能用于不同的 Kotlin 特定场景。以下示例展示了 AI 技能可以帮助您完成的一些任务。

### 将 Java 源文件转换为 Kotlin

当您希望将 Java 源文件转换为地道的 Kotlin，同时保留行为并应用 Kotlin 特有的约定建议时，请使用 [kotlin-tooling-java-to-kotlin](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin) 技能。

在 [](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin) 中了解有关此场景的更多信息。

### 将包含 Android 应用的多平台项目迁移到 AGP 9

当您的 Kotlin Multiplatform 项目需要迁移到 AGP 9，并且您希望 AI 代理应用所需的项目和 Gradle 配置更改时，请使用 [kotlin-tooling-agp9-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) 技能。

在 [将包含 Android 应用的多平台项目更新为使用 AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html) 中了解有关此场景的更多信息。

### 将多平台项目从 CocoaPods 迁移到 SwiftPM 依赖项

当您的 Kotlin Multiplatform 项目使用 CocoaPods 进行 iOS 集成，并且您希望 AI 代理将设置迁移到 SwiftPM 时，请使用 [kotlin-tooling-cocoapods-spm-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration)。

在 [将多平台项目从 CocoaPods 迁移到 SwiftPM 依赖项](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html) 中了解有关此场景的更多信息。

## 获取支持

如果您有任何疑问或遇到问题，请在 ![Slack](slack.svg){width=25}{type="joined"} Slack 中寻求帮助：[获取邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并在 `#ai` 频道分享您的经验。