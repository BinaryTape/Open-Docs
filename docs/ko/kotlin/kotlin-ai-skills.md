[//]: # (title: Kotlin AI 스킬)
[//]: # (description: Kotlin AI 스킬이 무엇인지, AI 에이전트에 어떤 도움이 되는지, 사용 가능한 스킬을 어디서 찾을 수 있는지 알아보세요.)

Kotlin AI 스킬은 AI 에이전트가 Kotlin 관련 작업을 더 안정적으로 수행할 수 있도록 돕는 재사용 가능한 지침입니다.

스킬은 AI 에이전트가 작업을 실행하기 전에 필요한 컨텍스트를 제공합니다. 
예를 들어, 스킬은 관련 API를 가리키거나, 사전 요구 사항을 정의하거나, 단계별 워크플로 가이드를 제공할 수 있습니다.

Kotlin AI 스킬은 에이전트가 더 정확한 결과를 생성하도록 돕고, 사용자가 직접 작업을 설명하는 데 드는 시간을 줄여줍니다. 
팀의 경우, 스킬은 공통 작업에 대한 공유 프레임워크를 제공하여 모든 구성원이 일관된 결과를 얻을 수 있게 합니다.

<a href="https://github.com/Kotlin/kotlin-agent-skills"><img src="kotlin-ai-skills.svg" alt="Explore Kotlin AI skills" type="block"/></a>

Kotlin AI 스킬은 [Agent Skills 표준](https://agentskills.io/home)을 따르므로, [Junie](https://www.jetbrains.com/junie/), Claude Code, OpenAI Codex, Google Gemini, GitHub Copilot 등 호환되는 AI 에이전트와 함께 사용할 수 있습니다.

## 지원되는 워크플로

다양한 Kotlin 관련 시나리오에 Kotlin AI 스킬을 사용할 수 있습니다. 
다음 예시는 AI 스킬이 도움을 줄 수 있는 몇 가지 작업을 보여줍니다.

### Java 소스 파일을 Kotlin으로 변환

Java 소스 파일을 동작을 유지하고 Kotlin 특유의 컨벤션을 적용하면서 관용적인(idiomatic) Kotlin으로 변환하려면 [kotlin-tooling-java-to-kotlin](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin) 스킬을 사용하세요. 

이 시나리오에 대한 자세한 내용은 [](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin)에서 확인할 수 있습니다.

### Android 앱이 포함된 멀티플랫폼 프로젝트를 AGP 9으로 마이그레이션

Kotlin 멀티플랫폼 프로젝트를 AGP 9으로 마이그레이션해야 하고, AI 에이전트가 필요한 프로젝트 및 Gradle 구성 변경 사항을 적용하도록 하려면 [kotlin-tooling-agp9-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) 스킬을 사용하세요.

이 시나리오에 대한 자세한 내용은 [Update multiplatform projects with Android apps to use AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html)에서 확인할 수 있습니다.

### 멀티플랫폼 프로젝트를 CocoaPods에서 SwiftPM 종속성으로 마이그레이션

Kotlin 멀티플랫폼 프로젝트에서 iOS 통합을 위해 CocoaPods를 사용 중이며, AI 에이전트가 이 설정을 SwiftPM으로 옮기도록 하려면 [kotlin-tooling-cocoapods-spm-migration](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration) 스킬을 사용하세요.

이 시나리오에 대한 자세한 내용은 [Migrate multiplatform projects from CocoaPods to SwiftPM dependencies](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html)에서 확인할 수 있습니다.

## 지원 받기

궁금한 점이 있거나 문제가 발생하면 ![Slack](slack.svg){width=25}{type="joined"} Slack에서 도움을 요청하세요. [초대 받기](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)를 통해 가입한 후 `#ai` 채널에서 경험을 공유해 주세요.