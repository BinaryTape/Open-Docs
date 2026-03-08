# 개요

에이전트 기능(Agent features)은 AI 에이전트의 기능을 확장하고 강화하는 방법을 제공합니다. 에이전트 기능은 다음과 같은 역할을 수행할 수 있습니다:

- 에이전트에 새로운 기능 추가
- 에이전트 동작 가로채기 및 수정
- 에이전트 실행 로깅 및 모니터링
- 단일 기능 내에서 동일한 이벤트 유형에 대해 여러 핸들러 등록

Koog 프레임워크는 기본적으로 제공되는 기능들과 사용자가 직접 커스텀 기능을 구현할 수 있는 환경을 모두 제공합니다. 즉시 사용 가능한 기능은 다음과 같습니다:

- [이벤트 핸들러](agent-event-handlers.md)
- [트레이싱](tracing.md)
- [채팅 메모리](chat-memory.md)
- [에이전트 메모리](agent-memory.md)
- [OpenTelemetry](opentelemetry-support.md)
- [에이전트 영속성 (스냅샷)](agent-persistence.md)
- 디버거
- 토크나이저
- SQL 영속성 프로바이더 (SQL Persistence Providers)

커스텀 기능을 구현하는 방법에 대해 알아보려면 [커스텀 기능](custom-features.md)을 참고하세요.