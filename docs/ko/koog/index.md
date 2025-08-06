# 개요

Koog는 **Kotlin**을 사용하여 AI 에이전트를 빌드하고 실행하도록 설계된 Kotlin 기반 프레임워크입니다. 이 프레임워크를 통해 도구와 상호작용하고, 복잡한 워크플로를 처리하며, 사용자와 소통할 수 있는 에이전트를 생성할 수 있습니다.

Koog 프레임워크는 다음 유형의 에이전트를 지원합니다.

*   최소한의 구성으로 단일 입력을 처리하고 응답을 제공하는 단일 실행 에이전트입니다. 이 유형의 에이전트는 작업을 완료하고 응답을 제공하기 위해 단일 도구 호출 주기 내에서 작동합니다.
*   사용자 지정 전략 및 구성을 지원하는 고급 기능을 갖춘 복잡한 워크플로 에이전트입니다.

## 주요 기능

Koog의 주요 기능은 다음과 같습니다.

-   **순수 Kotlin 구현**: 자연스럽고 관용적인 Kotlin으로 AI 에이전트를 전적으로 빌드합니다.
-   **MCP 통합**: 향상된 모델 관리를 위해 Model Control Protocol에 연결합니다.
-   **임베딩 기능**: 시맨틱 검색 및 지식 검색을 위해 벡터 임베딩을 사용합니다.
-   **사용자 지정 도구 생성**: 외부 시스템 및 API에 접근하는 도구로 에이전트를 확장합니다.
-   **기성 구성 요소**: 일반적인 AI 엔지니어링 문제에 대한 사전 구축된 솔루션으로 개발 속도를 높입니다.
-   **지능형 히스토리 압축**: 다양한 사전 구축된 전략을 사용하여 대화 컨텍스트를 유지하면서 토큰 사용을 최적화합니다.
-   **강력한 스트리밍 API**: 스트리밍 지원 및 병렬 도구 호출을 통해 응답을 실시간으로 처리합니다.
-   **영구 에이전트 메모리**: 세션 및 다른 에이전트 간에 지식 유지를 가능하게 합니다.
-   **포괄적인 트레이싱**: 상세하고 구성 가능한 트레이싱을 통해 에이전트 실행을 디버그하고 모니터링합니다.
-   **유연한 그래프 워크플로**: 직관적인 그래프 기반 워크플로를 사용하여 복잡한 에이전트 동작을 설계합니다.
-   **모듈형 기능 시스템**: 구성 가능한 아키텍처를 통해 에이전트 기능을 사용자 지정합니다.
-   **확장 가능한 아키텍처**: 간단한 챗봇부터 엔터프라이즈 애플리케이션까지 워크로드를 처리합니다.
-   **멀티플랫폼**: Kotlin Multiplatform을 사용하여 JVM 및 JS 타겟 모두에서 에이전트를 실행합니다.

# 사용 가능한 LLM 제공업체 및 플랫폼

에이전트 기능에 사용할 수 있는 LLM 제공업체 및 플랫폼은 다음과 같습니다.

-   Google
-   OpenAI
-   Anthropic
-   OpenRouter
-   Ollama

# 설치

Koog 프레임워크를 사용하려면 빌드 구성에 필요한 모든 종속성을 포함해야 합니다. 필수 패키지는 다음 Maven 저장소에 호스팅됩니다.

```
https://packages.jetbrains.team/maven/p/grazi/grazie-platform-public
```

## Gradle

### Gradle (Kotlin DSL)

1.  `build.gradle.kts` 파일에 종속성을 추가합니다.

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
    }
    ```

2.  저장소 목록에 `mavenCentral()`이 있는지 확인하세요.

### Gradle (Groovy)

1.  `build.gradle` 파일에 종속성을 추가합니다.

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
    }
    ```

2.  저장소 목록에 `mavenCentral()`이 있는지 확인하세요.

## Maven

1.  `pom.xml` 파일에 종속성을 추가합니다.

    ```
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2.  저장소 목록에 `mavenCentral`이 있는지 확인하세요.

# 빠른 시작 예시

AI 에이전트를 시작하는 데 도움이 되도록 단일 실행 에이전트의 간단한 예시가 있습니다.

!!! note
    예시를 실행하기 전에 해당 API 키를 환경 변수로 할당하세요. 자세한 내용은 [시작하기](single-run-agents.md)를 참조하세요.

```kotlin
fun main() = runBlocking {
    val apiKey = System.getenv("OPENAI_API_KEY") // or Anthropic, Google, OpenRouter, etc.

    val agent = AIAgent(
        executor = simpleOpenAIExecutor(apiKey), // or Anthropic, Google, OpenRouter, etc.
        systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
        llmModel = OpenAIModels.Chat.GPT4o
    )
    
    val result = agent.runAndGetResult("Hello! How can you help me?")
    println(result)
}
```
자세한 내용은 [시작하기](single-run-agents.md)를 참조하세요.