# 기능 (Features)

에이전트 기능은 AI 에이전트의 기능을 확장하고 향상시키는 방법을 제공합니다.
기능을 통해 다음을 수행할 수 있습니다:

- 에이전트에 새로운 역량 추가
- 에이전트 동작 가로채기 및 수정
- 에이전트 실행 기록 및 모니터링
- 단일 기능 내에서 동일한 이벤트 유형에 대해 여러 핸들러 등록

Koog 프레임워크는 다음과 같은 기능을 기본적으로(Out of the box) 제공합니다:

<div class="grid cards" markdown>

-   :material-flash:{ .lg .middle } [이벤트 핸들링 (Event handling)](agent-event-handlers.md)

    ---

    에이전트 실행 중 특정 이벤트를 모니터링하고 응답합니다.

-   :material-routes:{ .lg .middle } [트레이싱 (Tracing)](tracing.md)

    ---

    에이전트 실행에 대한 상세 정보를 캡처합니다.

-   :material-message-text-clock:{ .lg .middle } [채팅 메모리 (Chat memory)](chat-memory/index.md)

    ---

    에이전트 실행 간의 채팅 메시지 기록을 저장하고 조회합니다.

-   :material-chip:{ .lg .middle } [에이전트 메모리 (Agent memory)](agent-memory.md)

    ---

    에이전트 실행 도중 및 실행 간에 임의의 데이터를 저장, 조회 및 사용합니다.

-   :material-database-clock:{ .lg .middle } [장기 메모리 (Long-term memory)](long-term-memory.md)

    ---

    AI 에이전트에 지속성 메모리를 추가합니다.

-   :material-content-save-cog:{ .lg .middle } [에이전트 지속성 (Agent persistence)](agent-persistence.md)

    ---

    실행 중 특정 시점에 에이전트의 상태를 저장하고 복원합니다.

-   :simple-opentelemetry:{ .lg .middle } [OpenTelemetry](open-telemetry/index.md)

    ---

    에이전트에서 텔레메트리 데이터(트레이스)를 생성, 수집 및 내보냅니다.

</div>

사용자 정의 기능을 구현하는 방법을 알아보려면 [사용자 정의 기능 (Custom features)](custom-features.md)을 참조하세요.