# 개요

Koog는 JVM 에코시스템을 위해 특별히 설계된 AI 에이전트 구축용 오픈 소스 JetBrains 프레임워크입니다.
관용적이고 타입 안전한(type-safe) Kotlin DSL과 유연한(fluent) 빌더 스타일의 Java API를 제공하여, Kotlin과 Java 개발자 모두에게 최상의 개발 경험을 선사합니다.

Java 개발자는 관용적인 API를 사용하여 JVM에서 Koog의 모든 기능을 활용할 수 있으며, Kotlin 개발자는 Kotlin Multiplatform을 사용하여 JS, WasmJS, Android 및 iOS 타겟에 에이전트를 배포할 수 있습니다.

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**시작하기**](quickstart.md)

    ---

    첫 번째 AI 에이전트 구축 및 실행

-   :material-book-open-variant:{ .lg .middle } [**용어집**](glossary.md)

    ---

    필수 용어 학습

</div>

## 에이전트

[에이전트 일반](agents/index.md)에 대해 알아보고 Koog를 사용하여 다양한 유형의 에이전트를 생성하는 방법을 살펴보세요:

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**기본 에이전트**](agents/basic-agents.md)

    ---

    대부분의 일반적인 사용 사례에 적합한 사전 정의된 전략 사용

-   :material-function:{ .lg .middle } [**함수형 에이전트**](agents/functional-agents.md)

    ---

    순수 Kotlin 또는 Java의 람다 함수로 커스텀 로직 정의

-   :material-state-machine:{ .lg .middle } [**그래프 기반 에이전트**](agents/graph-based-agents.md)

    ---

    전략 그래프로 커스텀 워크플로 구현

-   :material-list-status:{ .lg .middle } [**플래너 에이전트**](agents/planner-agents/index.md)

    ---

    상태가 원하는 조건과 일치할 때까지 반복적으로 계획을 수립하고 실행

</div>

## 핵심 구성 요소

Koog 에이전트의 핵심 구성 요소에 대해 자세히 알아보세요:

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**프롬프트**](prompts/index.md)

    ---

    에이전트와 LLM 간의 상호작용을 주도하는 프롬프트 생성, 관리 및 실행

-   :material-strategy:{ .lg .middle } [**전략**](predefined-agent-strategies.md)

    ---

    에이전트의 의도된 워크플로를 방향성 그래프(directed graph)로 설계

-   :material-tools:{ .lg .middle } [**도구**](tools-overview.md)

    ---

    에이전트가 외부 데이터 소스 및 서비스와 상호작용할 수 있도록 지원

-   :material-toy-brick-outline:{ .lg .middle } [**기능**](features/index.md)

    ---

    AI 에이전트의 기능을 확장하고 강화

</div>

## 고급 사용법

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**기록 압축**](history-compression.md)

    ---

    고급 기술을 사용하여 장시간 대화에서 컨텍스트를 유지하면서 토큰 사용량 최적화

-   :material-floppy:{ .lg .middle } [**에이전트 영속성**](features/agent-persistence.md)

    ---

    실행 중 특정 시점에서 에이전트 상태 복구
        

-   :material-code-braces:{ .lg .middle } [**구조화된 출력**](structured-output.md)

    ---

    구조화된 형식으로 응답 생성

-   :material-waves:{ .lg .middle } [**스트리밍 API**](streaming-api.md)

    ---

    스트리밍 지원 및 병렬 도구 호출을 통해 실시간으로 응답 처리

-   :material-database-search:{ .lg .middle } [**지식 검색**](embeddings.md)

    ---

    [벡터 임베딩](embeddings.md), [RAG](retrieval-augmented-generation.md) 및 [공유 에이전트 메모리](features/agent-memory.md)를 사용하여 여러 대화에 걸쳐 지식을 유지하고 검색

-   :material-timeline-text:{ .lg .middle } [**트레이싱**](features/tracing.md)

    ---

    상세하고 구성 가능한 트레이싱을 통해 에이전트 실행 디버깅 및 모니터링

-   :material-timeline-text:{ .lg .middle } [**장기 메모리**](features/long-term-memory.md)

    ---

    RAG 및 영구 메모리를 위한 벡터 데이터베이스 및 메모리 제공자 통합

</div>

## 연동

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md)

    ---

    AI 에이전트에서 직접 MCP 도구 사용

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    Spring 애플리케이션에 Koog 추가

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    Koog를 Ktor 서버와 통합

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](features/open-telemetry/index.md)

    ---

    인기 있는 관측 가능성(observability) 도구를 사용하여 에이전트 추적, 로그 기록 및 측정

-   :material-lan:{ .lg .middle } [**A2A Protocol**](a2a-protocol-overview.md)

    ---

    공유 프로토콜을 통해 에이전트와 서비스 연결

</div>