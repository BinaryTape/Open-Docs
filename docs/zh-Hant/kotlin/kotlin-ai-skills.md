[//]: # (title: Kotlin AI 技能)
[//]: # (description: 了解什麼是 Kotlin AI 技能、它們如何協助 AI 代理程式，以及在哪裡可以找到可用的技能。)

Kotlin AI 技能是可重複使用的指令，旨在協助 AI 代理程式更可靠地執行 Kotlin 特定的任務。

技能在 AI 代理程式開始執行任務之前，為其提供所需的上下文。例如，一個技能可以指向相關的 API、定義前置條件，或提供逐步的工作流引導。

Kotlin AI 技能有助於代理程式產生更準確的結果，並減少您親自解釋任務所花費的時間。對於團隊而言，技能還為常見任務提供了一個共享架構，使每個人都能獲得一致的結果。

<a href="https://github.com/Kotlin/kotlin-agent-skills"><img src="kotlin-ai-skills.svg" alt="Explore Kotlin AI skills" type="block"/></a>

Kotlin AI 技能遵循 [Agent Skills 標準](https://agentskills.io/home)，因此您可以將它們與相容的 AI 代理程式配合使用，例如 [Junie](https://www.jetbrains.com/junie/)、Claude Code、OpenAI Codex、Google Gemini 和 GitHub Copilot。

## 支援的工作流

您可以將 Kotlin AI 技能用於不同的 Kotlin 特定場景。以下範例展示了 AI 技能可以協助您完成的一些任務。

### 將 Java 原始程式檔轉換為 Kotlin

當您想將 Java 原始程式檔轉換為道地的 Kotlin，同時保留行為並套用 Kotlin 特定的慣例時，請使用 [kotlin-tooling-java-to-kotlin](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin) 技能。

在 [](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin) 中進一步了解此場景。

### 遷移包含 Android 應用程式的多平台專案以使用 AGP 9

當您的 Kotlin Multiplatform 專案需要遷移到 AGP 9，且您希望 AI 代理程式套用必要的專案和 Gradle 配置變更時，請使用 [kotlin-tooling-agp9-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) 技能。

在 [更新包含 Android 應用程式的多平台專案以使用 AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html) 中進一步了解此場景。

### 將多平台專案從 CocoaPods 遷移至 SwiftPM 相依性

當您的 Kotlin Multiplatform 專案使用 CocoaPods 進行 iOS 整合，且您希望 AI 代理程式將設定移動到 SwiftPM 時，請使用 [kotlin-tooling-cocoapods-spm-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration)。

在 [將多平台專案從 CocoaPods 遷移至 SwiftPM 相依性](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html) 中進一步了解此場景。

## 獲取支援

如果您有疑問或遇到問題，請在 ![Slack](slack.svg){width=25}{type="joined"} Slack 中尋求協助：[獲取邀請](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 並在 `#ai` 頻道分享您的經驗。