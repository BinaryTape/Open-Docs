# A2A 프로토콜

이 페이지에서는 Koog 에이전트 프레임워크에 구현된 A2A (Agent-to-Agent) 프로토콜에 대한 개요를 제공합니다.

## A2A 프로토콜이란 무엇인가요?

A2A (Agent-to-Agent) 프로토콜은 AI 에이전트가 서로 그리고 클라이언트 애플리케이션과 상호 작용할 수 있도록 하는 표준화된 통신 프로토콜입니다.
이는 일관되고 상호 운용 가능한 에이전트 통신을 가능하게 하는 메서드, 메시지 형식 및 동작 집합을 정의합니다.
A2A 프로토콜에 대한 자세한 정보와 상세 사양은 공식 [A2A 프로토콜 웹사이트](https://a2a-protocol.org/latest/)를 참조하세요.

## 시작하기

**중요**: A2A 종속성은 `koog-agents` 메타 종속성에 기본적으로 포함되지 않습니다. 프로젝트에 필요한 A2A 모듈을 명시적으로 추가해야 합니다.

프로젝트에서 A2A를 사용하려면 사용 사례에 따라 종속성을 추가하세요:

- **A2A 클라이언트의 경우**: [A2A 클라이언트 문서](a2a-client.md#dependencies)를 참조하세요
- **A2A 서버의 경우**: [A2A 서버 문서](a2a-server.md#dependencies)를 참조하세요
- **Koog 통합의 경우**: [A2A Koog 통합 문서](a2a-koog-integration.md#dependencies)를 참조하세요

## 주요 A2A 구성 요소

Koog는 클라이언트와 서버 모두를 위한 A2A 프로토콜 v0.3.0의 전체 구현을 제공하며, Koog 에이전트 프레임워크와의 통합도 지원합니다:

- [A2A 서버](a2a-server.md)는 A2A 프로토콜을 구현하는 엔드포인트를 노출하는 에이전트 또는 에이전트 시스템입니다. 클라이언트로부터 요청을 수신하고, 작업을 처리하며, 결과 또는 상태 업데이트를 반환합니다. Koog 에이전트와는 독립적으로 사용될 수도 있습니다.
- [A2A 클라이언트](a2a-client.md)는 A2A 프로토콜을 사용하여 A2A 서버와의 통신을 시작하는 클라이언트 애플리케이션 또는 에이전트입니다. Koog 에이전트와는 독립적으로 사용될 수도 있습니다.
- [A2A Koog 통합](a2a-koog-integration.md)은 Koog 에이전트와의 A2A 통합을 간소화하는 클래스 및 유틸리티 세트입니다. Koog 프레임워크 내에서 원활한 A2A 에이전트 연결 및 통신을 위한 구성 요소(A2A 기능 및 노드)를 포함합니다.

더 많은 예시를 보려면 [예시](https://github.com/JetBrains/koog/tree/develop/examples/simple-examples/src/main/kotlin/ai/koog/agents/example/a2a)를 따르세요.