# 개요

Koog는 특히 JVM 및 Kotlin 개발자를 위해 설계된, 관용적이고 타입 세이프한 Kotlin DSL을 사용하여 AI 에이전트를 빌드하기 위한 오픈 소스 JetBrains 프레임워크입니다.
이 프레임워크를 통해 도구와 상호작용하고, 복잡한 워크플로를 처리하며, 사용자와 소통할 수 있는 에이전트를 생성할 수 있습니다.

모듈형 기능 시스템을 통해 에이전트 기능을 사용자 지정하고, Kotlin Multiplatform을 사용하여 JVM, JS, WasmJS, Android 및 iOS 타겟 전반에 걸쳐 에이전트를 배포할 수 있습니다.

<div class="grid cards" markdown>

-   :material-rocket-launch:{ .lg .middle } [**시작하기**](getting-started.md)

    ---

    첫 AI 에이전트 빌드 및 실행

-   :material-book-open-variant:{ .lg .middle } [**용어집**](glossary.md)

    ---

    필수 용어 학습

</div>

## 에이전트 유형

<div class="grid cards" markdown>

-   :material-robot-outline:{ .lg .middle } [**기본 에이전트**](basic-agents.md)

    ---

    단일 입력을 처리하고 응답을 제공하는 에이전트 생성 및 실행

-   :material-script-text-outline:{ .lg .middle } [**함수형 에이전트**](functional-agents.md)

    ---

    일반 Kotlin으로 사용자 지정 로직을 갖춘 경량 에이전트 생성 및 실행

-   :material-graph-outline:{ .lg .middle } [**복잡한 워크플로 에이전트**](complex-workflow-agents.md)

    ---

    사용자 지정 전략으로 복잡한 워크플로를 처리하는 에이전트 생성 및 실행

-   :material-state-machine:{ .lg .middle } [**플래너 에이전트**](planner-agents.md)

    ---

    계획을 반복적으로 빌드하고 실행하는 에이전트 생성 및 실행

</div>

## 핵심 기능

<div class="grid cards" markdown>

-   :material-chat-processing-outline:{ .lg .middle } [**프롬프트**](prompts/index.md)

    ---

    프롬프트 생성, LLM 클라이언트 또는 프롬프트 실행기를 사용하여 실행,
    LLM 및 제공업체 간 전환, 내장된 재시도 기능으로 실패 처리

-   :material-wrench:{ .lg .middle } [**도구**](tools-overview.md)

    ---

    외부 시스템 및 API에 접근할 수 있는 내장, 어노테이션 기반 또는 클래스 기반 도구로 에이전트 강화

-   :material-share-variant-outline:{ .lg .middle } [**전략**](predefined-agent-strategies.md)

    ---

    직관적인 그래프 기반 워크플로를 사용하여 복잡한 에이전트 동작 설계

-   :material-bell-outline:{ .lg .middle } [**이벤트**](agent-events.md)

    ---

    미리 정의된 핸들러로 에이전트 라이프사이클, 전략, 노드, LLM 호출 및 도구 호출 이벤트 모니터링 및 처리

</div>

## 고급 사용법

<div class="grid cards" markdown>

-   :material-history:{ .lg .middle } [**히스토리 압축**](history-compression.md)

    ---

    고급 기술을 사용하여 장기 실행 대화에서 컨텍스트를 유지하면서 토큰 사용 최적화

-   :material-state-machine:{ .lg .middle } [**에이전트 지속성**](agent-persistence.md)

    ---

    실행 중 특정 시점에서 에이전트 상태 복원
        

-   :material-code-braces:{ .lg .middle } [**구조화된 출력**](structured-output.md)

    ---

    구조화된 형식으로 응답 생성

-   :material-waves:{ .lg .middle } [**스트리밍 API**](streaming-api.md)

    ---

    스트리밍 지원 및 병렬 도구 호출로 응답 실시간 처리

-   :material-database-search:{ .lg .middle } [**지식 검색**](embeddings.md)

    ---

    [벡터 임베딩](embeddings.md), [순위가 매겨진 문서 저장소](ranked-document-storage.md) 및 [공유 에이전트 메모리](agent-memory.md)를 사용하여 대화 전반에 걸쳐 지식 유지 및 검색

-   :material-timeline-text:{ .lg .middle } [**트레이싱**](tracing.md)

    ---

    상세하고 구성 가능한 트레이싱으로 에이전트 실행 디버그 및 모니터링

</div>

## 통합 기능

<div class="grid cards" markdown>

-   :material-puzzle:{ .lg .middle } [**Model Context Protocol (MCP)**](model-context-protocol.md)

    ---

    AI 에이전트에서 MCP 도구 직접 사용

-   :material-leaf:{ .lg .middle } [**Spring Boot**](spring-boot.md)

    ---

    Spring 애플리케이션에 Koog 추가

-   :material-cloud-outline:{ .lg .middle } [**Ktor**](ktor-plugin.md)

    ---

    Koog를 Ktor 서버와 통합

-   :material-chart-timeline-variant:{ .lg .middle } [**OpenTelemetry**](opentelemetry-support.md)

    ---

    인기 있는 관측 가능성 도구를 사용하여 에이전트 트레이스, 로그 및 측정

-   :material-lan:{ .lg .middle } [**A2A 프로토콜**](a2a-protocol-overview.md)

    ---

    공유 프로토콜을 통해 에이전트 및 서비스 연결

</div>