[//]: # (title: AI 기반 앱 개발을 위한 Kotlin)

Kotlin은 AI 기반 애플리케이션 구축을 위한 현대적이고 실용적인 기반을 제공합니다.
다양한 플랫폼에서 사용될 수 있으며, 기존 AI 프레임워크와 잘 통합되고, 일반적인 AI 개발 패턴을 지원합니다.

## Koog

[Koog](https://koog.ai)는 간단한 것부터 복잡한 것까지 AI 에이전트를 구축하기 위한 JetBrains의 오픈 소스 프레임워크입니다.
멀티플랫폼 지원, Spring Boot 및 Ktor 통합, 관용적인 DSL, 그리고 즉시 사용 가능한(production‑ready) 기능을 제공합니다.

### 몇 줄의 코드로 간단한 에이전트 생성

```kotlin
fun main() {
    runBlocking {
        val agent = AIAgent(
            // Use Anthropic, Google, OpenRouter, or any other provider
            executor = simpleOpenAIExecutor(System.getenv("OPENAI_API_KEY")),
            systemPrompt = "You are a helpful assistant. Answer user questions concisely.",
            llmModel = OpenAIModels.Chat.GPT4o
        )

        val result = agent.run("Hello! How can you help me?")
        println(result)
    }
}
```

<a href="https://docs.koog.ai/getting-started/"><img src="get-started-with-koog.svg" width="700" alt="Koog 시작하기" style="block"/></a>

### 주요 기능

*   **멀티플랫폼 개발 지원**. 멀티플랫폼 지원을 통해 JVM, JavaScript, WebAssembly, Android 및 iOS용 에이전트 애플리케이션 개발이 가능합니다.
*   **안정성 및 내결함성**. 내장된 재시도 기능을 통해 Koog는 개발자가 시간 초과 또는 도구 오류와 같은 실패를 처리할 수 있도록 합니다. 에이전트 영속성은 단순히 채팅 메시지 대신 전체 에이전트 상태 머신을 복원할 수 있도록 합니다.
*   **긴 컨텍스트를 위한 내장된 기록 압축 기술**. Koog는 추가 설정 없이 장기 대화를 압축하고 관리하는 고급 전략을 제공합니다.
*   **엔터프라이즈 지원 통합**. Koog는 [Spring Boot](https://spring.io/projects/spring-boot) 및 [Ktor](https://ktor.io)와 같은 인기 있는 JVM 프레임워크와 통합됩니다.
*   **OpenTelemetry 익스포터를 통한 관측 가능성**. Koog는 AI 애플리케이션 모니터링 및 디버깅을 위해 W&B Weave 및 Langfuse와 같은 인기 있는 관측 가능성 제공업체와의 즉시 사용 가능한 통합을 제공합니다.
*   **LLM 전환 및 원활한 기록 적응**. Koog는 기존 대화 기록을 잃지 않고 언제든지 새로운 도구 세트로 다른 LLM으로 전환할 수 있도록 합니다. 또한 OpenAI, Anthropic, Google 등을 포함한 여러 LLM 제공업체 간의 재라우팅을 가능하게 합니다. Ollama와의 Koog 통합을 통해 로컬 모델로 에이전트를 로컬에서 실행할 수 있습니다.
*   **JVM 및 Kotlin 애플리케이션 통합**. Koog는 JVM 및 Kotlin 개발자를 위해 특별히 고안된 관용적이고 타입 세이프한 DSL을 제공합니다.
*   **모델 컨텍스트 프로토콜(MCP) 통합**. Koog는 에이전트에서 MCP 도구를 사용할 수 있도록 합니다.
*   **지식 검색 및 메모리**. 임베딩, 순위가 지정된 문서 저장소 및 공유 에이전트 메모리를 통해 Koog 자체는 대화 전반에 걸쳐 지식을 적극적으로 보존합니다.
*   **스트리밍 기능**. Koog는 개발자가 스트리밍 지원 및 병렬 도구 호출을 통해 실시간으로 응답을 처리할 수 있도록 합니다.

### 시작하기

*   [Overview](https://docs.koog.ai/)에서 Koog의 기능을 살펴보세요.
*   [시작 가이드](https://docs.koog.ai/getting-started/)를 통해 첫 Koog 에이전트를 구축해 보세요.
*   [Koog 릴리스 노트](https://github.com/JetBrains/koog/blob/main/CHANGELOG.md)에서 최신 업데이트를 확인하세요.
*   [예제](https://docs.koog.ai/examples/)를 통해 배우세요.

## 모델 컨텍스트 프로토콜(MCP) Kotlin SDK

[MCP Kotlin SDK](https://github.com/modelcontextprotocol/kotlin-sdk)는 모델 컨텍스트 프로토콜의 Kotlin Multiplatform 구현체입니다. 이 SDK를 통해 개발자는 Kotlin으로 AI 기반 애플리케이션을 구축하고 JVM, WebAssembly 및 iOS 전반에 걸쳐 LLM 서피스와 통합할 수 있습니다.

MCP Kotlin SDK를 사용하면 다음을 수행할 수 있습니다.

*   컨텍스트 처리를 LLM 상호 작용과 분리하여 LLM에 구조화되고 표준화된 방식으로 컨텍스트를 제공합니다.
*   기존 서버에서 리소스를 소비하는 MCP 클라이언트를 구축합니다.
*   프롬프트, 도구 및 리소스를 LLM에 노출하는 MCP 서버를 생성합니다.
*   stdio, SSE 및 WebSocket과 같은 표준 통신 전송(transport)을 사용합니다.
*   모든 MCP 프로토콜 메시지 및 라이프사이클 이벤트를 처리합니다.

## 다른 AI 기반 애플리케이션 시나리오 살펴보기

원활한 Java 상호 운용성 및 Kotlin Multiplatform 덕분에 Kotlin을 기존 AI SDK 및 프레임워크와 결합하고, 백엔드 및 데스크톱/모바일 UI를 구축하며, RAG 및 에이전트 기반 워크플로와 같은 패턴을 채택할 수 있습니다.

> [Kotlin-AI-Examples](https://github.com/Kotlin/Kotlin-AI-Examples) 리포지토리에서 예제를 탐색하고 실행할 수 있습니다.
> 각 프로젝트는 독립적입니다. 각 프로젝트를 Kotlin 기반 AI 애플리케이션 구축을 위한 참조 또는 템플릿으로 사용할 수 있습니다.

### 주요 모델 제공업체에 연결

Kotlin을 사용하여 OpenAI, Anthropic, Google 등과 같은 주요 모델 제공업체에 연결하세요:

*   [OpenAI](https://github.com/openai/openai-java) — OpenAI API용 공식 Java SDK입니다. 응답 및 채팅, 이미지, 오디오를 다룹니다.
*   [Anthropic (Claude)](https://github.com/anthropics/anthropic-sdk-java) — Claude Messages API용 공식 Java SDK입니다. Vertex AI 및 Bedrock 통합을 위한 모듈을 포함합니다.
*   [Google AI (Gemini / Vertex AI)](https://github.com/googleapis/java-genai) — Gemini API와 Vertex AI 간을 전환하는 단일 클라이언트를 포함하는 공식 Java SDK입니다.
*   [Azure OpenAI](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai) — Azure OpenAI Service용 공식 Java 클라이언트입니다. 채팅 완료(completions) 및 임베딩을 지원합니다.
*   [AWS Bedrock](https://github.com/aws/aws-sdk-kotlin) — 기반 모델을 호출하기 위한 공식 SDK입니다. Bedrock 및 Bedrock Runtime용 Kotlin SDK 및 Java SDK를 포함합니다.

### RAG 파이프라인 및 에이전트 기반 앱 생성

*   [Spring AI](https://github.com/spring-projects/spring-ai) — 프롬프트, 채팅, 임베딩, 도구 및 함수 호출, 벡터 저장소를 위한 다중 제공업체 추상화입니다.
*   [LangChain4j](https://docs.langchain4j.dev/tutorials/kotlin/) — 프롬프트, 도구, 검색 증강 생성(RAG) 파이프라인 및 에이전트를 위한 Kotlin 확장 기능을 포함하는 JVM 툴킷입니다.

## 다음 단계

*   IntelliJ IDEA에서 Kotlin과 함께 Spring AI를 사용하는 방법에 대해 더 자세히 알아보려면 [Spring AI를 사용하여 질문에 답하는 Kotlin 앱 생성](spring-ai-guide.md) 튜토리얼을 완료하세요.
*   [Kotlin 커뮤니티](https://kotlinlang.org/community/)에 참여하여 Kotlin으로 AI 애플리케이션을 구축하는 다른 개발자들과 연결하세요.