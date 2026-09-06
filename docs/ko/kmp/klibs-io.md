[//]: # (title: klibs.io, Kotlin 멀티플랫폼 라이브러리 카탈로그)

[klibs.io](https://klibs.io)는 GitHub와 Maven Central에 게시된 Kotlin Multiplatform 라이브러리를 찾는 문제를 해결합니다.
라이브러리는 인덱싱되고 태그가 지정되며 지원되는 플랫폼별로 분류되어 있어,
검색 결과를 빠르게 필터링하고 사용 사례에 맞는 적절한 라이브러리를 선택할 수 있습니다.

각 라이브러리 페이지는 프로젝트의 README를 렌더링하고, 종속 항목(dependents) 수, 프로젝트 활성도 및 라이선스와 같은 추가 정보를 제공합니다.

<a as="button" href="https://klibs.io" mode="classic" icon="arrow-right" icon-position="right">멀티플랫폼 라이브러리 찾아보기</a>

## AI 워크플로에서의 klibs.io

제공된 MCP(Model Context Protocol) 인터페이스와 바로 사용 가능한 에이전트 지침을 사용하여 klibs.io를 AI 워크플로에 통합하세요.

* 서비스 팀은 에이전트가 적절한 라이브러리를 찾는 데 집중할 수 있도록 돕는 에이전틱 스킬(agentic skill)인 [kmp-libraries-expert](https://github.com/JetBrains/klibs-io/blob/master/skills/README.md)를 게시합니다.
* 전용 [klibs.io MCP 서버](https://github.com/JetBrains/klibs-io/tree/master/integrations/mcp)를 통해 에이전트가 라이브러리 인덱스에 직접 액세스하고 세분화된 도구를 사용하여 검색 결과를 필터링할 수 있습니다.
* 에이전트에 대한 일반 가이드를 설정하려면 [AGENTS.md](https://agents.md/) 파일에 다음 섹션을 추가할 수 있습니다.

    ```markdown
    ## Kotlin Multiplatform library selection
    
    When choosing or recommending Kotlin Multiplatform dependencies,
    use the klibs.io MCP server (https://api.klibs.io/mcp)
    to access and filter a catalog of multiplatform libraries.
    
    The agent can use the server to verify dependency metadata and gauge suitability:
    
    * supported targets,
    * Maven coordinates,
    * latest versions or latest stable versions,
    * license,
    * maintenance and activity signals,
    * comparable alternatives.
    ```
  
## 참고 항목

자세한 내용은 [klibs.io FAQ](https://klibs.io/faq)를 참조하세요.
* 라이브러리가 인덱싱 및 순위 지정되는 방식
* 자신의 프로젝트가 목록에 포함되도록 하는 방법
* 향후 계획

문제를 보고하거나 개선 사항을 제안하려면 [klibs.io GitHub 저장소](https://github.com/JetBrains/klibs-io/issues)의 이슈(issues)를 사용하세요.

토론 및 지원을 원하시면 Kotlin 공개 Slack에 참여하세요.
[초대 요청](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)을 보낸 후
[#klibs-io 채널](https://kotlinlang.slack.com/archives/C081AF4JK70)에 입장해 주세요.