# 개요

Koog는 완전히 관용적인 Kotlin으로 AI 에이전트를 빌드하고 실행하도록 설계된 오픈 소스 JetBrains 프레임워크입니다.
이 프레임워크를 통해 도구와 상호작용하고, 복잡한 워크플로를 처리하며, 사용자와 소통할 수 있는 에이전트를 생성할 수 있습니다.

이 프레임워크는 다음 유형의 에이전트를 지원합니다.

*   최소한의 구성으로 단일 입력을 처리하고 응답을 제공하는 단일 실행 에이전트입니다.
    이 유형의 에이전트는 작업을 완료하고 응답을 제공하기 위해 단일 도구 호출 주기 내에서 작동합니다.
*   람다 함수로 정의된 경량의 사용자 지정 가능한 로직을 갖춘 함수형 에이전트로, 사용자 입력을 처리하고, LLM과 상호작용하며, 도구를 호출하고, 최종 출력을 생성합니다.
*   사용자 지정 전략 및 구성을 지원하는 고급 기능을 갖춘 복잡한 워크플로 에이전트입니다.

## 주요 기능

Koog의 주요 기능은 다음과 같습니다.

-   **멀티플랫폼 개발**: Kotlin Multiplatform을 사용하여 JVM, JS, WasmJS, Android 및 iOS 타겟 모두에 에이전트를 배포합니다.
-   **안정성과 내결함성**: 내장된 재시도 기능으로 실패를 처리하고 에이전트 지속성 기능을 사용하여 실행 중 특정 시점에서 에이전트 상태를 복원합니다.
-   **지능형 히스토리 압축**: 고급 내장 히스토리 압축 기술을 사용하여 장기 실행 대화에서 컨텍스트를 유지하면서 토큰 사용을 최적화합니다.
-   **엔터프라이즈 통합 기능**: Spring Boot 및 Ktor와 같은 인기 있는 JVM 프레임워크와의 통합을 활용하여 Koog를 애플리케이션에 임베드합니다.
-   **OpenTelemetry 익스포터를 통한 관측 가능성**: 인기 있는 관측 가능성 제공업체(W&B Weave, Langfuse)에 대한 내장 지원을 통해 애플리케이션을 모니터링하고 디버그합니다.
-   **LLM 전환 및 원활한 히스토리 적응**: 기존 대화 기록을 잃지 않고 언제든지 다른 LLM으로 전환하거나 여러 LLM 제공업체 간에 경로를 재지정합니다.
-   **JVM 및 Kotlin 애플리케이션 통합**: JVM 및 Kotlin 개발자를 위해 특별히 설계된 관용적이고 타입 세이프한 Kotlin DSL로 AI 에이전트를 빌드합니다.
-   **Model Context Protocol 통합**: AI 에이전트에서 Model Context Protocol (MCP) 도구를 사용합니다.
-   **지식 검색 및 메모리**: 벡터 임베딩, 순위가 매겨진 문서 저장소 및 공유 에이전트 메모리를 사용하여 대화 전반에 걸쳐 지식을 유지하고 검색합니다.
-   **강력한 스트리밍 API**: 스트리밍 지원 및 병렬 도구 호출을 통해 응답을 실시간으로 처리합니다.
-   **모듈형 기능 시스템**: 구성 가능한 아키텍처를 통해 에이전트 기능을 사용자 지정합니다.
-   **유연한 그래프 워크플로**: 직관적인 그래프 기반 워크플로를 사용하여 복잡한 에이전트 동작을 설계합니다.
-   **사용자 지정 도구 생성**: 외부 시스템 및 API에 접근하는 도구로 에이전트를 확장합니다.
-   **포괄적인 트레이싱**: 상세하고 구성 가능한 트레이싱을 통해 에이전트 실행을 디버그하고 모니터링합니다.

## 사용 가능한 LLM 제공업체 및 플랫폼

에이전트 기능을 구현하는 데 사용할 수 있는 LLM 제공업체 및 플랫폼은 다음과 같습니다.

- Google
- OpenAI
- Anthropic
- DeepSeek
- OpenRouter
- Ollama
- Bedrock

전용 LLM 클라이언트와 함께 이러한 제공업체를 사용하는 방법에 대한 자세한 지침은 [Runnning prompts with LLM clients](prompt-api.md#running-prompts-with-llm-clients)를 참조하세요.

## 설치

Koog를 사용하려면 빌드 구성에 필요한 모든 종속성을 포함해야 합니다.

**참고!** Ktor [클라이언트](https://ktor.io/docs/client-engines.html) 및 [서버](https://ktor.io/docs/server-engines.html) 엔진 종속성은 기본적으로 라이브러리에 포함되어 있지 않으므로, 원하는 엔진을 직접 추가해야 합니다.

### Gradle

#### Gradle (Kotlin DSL)

1.  `build.gradle.kts` 파일에 종속성을 추가합니다.

    ```
    dependencies {
        implementation("ai.koog:koog-agents:LATEST_VERSION")
       // include Ktor client dependency explicitly
        implementation("io.ktor:ktor-client-cio:$ktor_version")
    }
    ```
    Ktor [클라이언트](https://ktor.io/docs/client-engines.html) 및 [서버](https://ktor.io/docs/server-engines.html) 엔진 종속성은 기본적으로 라이브러리에 포함되어 있지 않으므로, 원하는 엔진을 직접 추가해야 합니다.

2.  저장소 목록에 `mavenCentral()`이 있는지 확인하세요.

#### Gradle (Groovy)

1.  `build.gradle` 파일에 종속성을 추가합니다.

    ```
    dependencies {
        implementation 'ai.koog:koog-agents:LATEST_VERSION'
        implementation 'io.ktor:ktor-client-cio:KTOR_VERSION'
    }
    ```

2.  저장소 목록에 `mavenCentral()`이 있는지 확인하세요.

### Maven

1.  `pom.xml` 파일에 종속성을 추가합니다.

    ```xml
    <dependency>
        <groupId>ai.koog</groupId>
        <artifactId>koog-agents-jvm</artifactId>
        <version>LATEST_VERSION</version>
    </dependency>
    ```

2.  Ktor 종속성을 추가합니다. Ktor 버전은 [여기](https://mvnrepository.com/artifact/io.ktor/ktor-bom)에서 확인하세요.
    ```xml
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.ktor</groupId>
                <artifactId>ktor-bom</artifactId>
                <version>KTOR_VERSION</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
   
    <dependencies>
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-client-cio-jvm</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- Add a Ktor server dependency if you are using features like MCP -->
        <dependency>
            <groupId>io.ktor</groupId>
            <artifactId>ktor-server-netty-jvm</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

    ```

2.  저장소 목록에 `mavenCentral`이 있는지 확인하세요.

## 빠른 시작 예시

AI 에이전트를 시작하는 데 도움이 되도록 단일 실행 에이전트의 간단한 예시가 있습니다.

!!! note
    예시를 실행하기 전에 해당 API 키를 환경 변수로 할당하세요. 자세한 내용은 [시작하기](single-run-agents.md)를 참조하세요.

<!--- INCLUDE
import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor
import kotlinx.coroutines.runBlocking
-->
```kotlin
fun main() {
    runBlocking {
        val apiKey = System.getenv("OPENAI_API_KEY") // or Anthropic, Google, OpenRouter, etc.

        val agent = AIAgent(
            promptExecutor = simpleOpenAIExecutor(apiKey), // or Anthropic, Google, OpenRouter, etc.
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```
<!--- KNIT example-index-01.kt -->
자세한 내용은 [시작하기](single-run-agents.md)를 참조하세요.