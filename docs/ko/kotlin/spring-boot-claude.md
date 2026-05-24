[//]: # (title: Spring Boot 및 Claude를 사용하여 할 일 관리 앱 만들기)

<web-summary>Claude와 Spring Boot를 사용하여 Kotlin 앱을 만드는 방법을 알아봅니다.</web-summary>

이 튜토리얼에서는 [Claude](https://claude.com/product/overview)를 사용하여 할 일을 관리하는 Kotlin 앱을 만드는 방법을 알아봅니다. 이 튜토리얼에서는 Spring Boot를 사용하여 백엔드 인프라를 관리하고, Claude는 애플리케이션을 기획하고 개발하는 데 사용합니다.

AI의 도움 없이 직접 앱을 만들고 싶다면, [Kotlin과 Spring Boot로 웹 앱 만들기](jvm-get-started-spring-boot.md) 튜토리얼을 따를 수 있습니다.

> 다른 AI 기반 도구와 마찬가지로 Claude도 실수를 할 수 있습니다. Claude의 변경 사항을 주의 깊게 검토하고, 신뢰할 수 있는 코드에만 사용하세요.
> Claude의 보안 정책에 대한 자세한 내용은 [Claude Code 문서](https://code.claude.com/docs/en/security)를 참조하세요.
> 
{style="note"}

## 환경 설정

> 이 튜토리얼은 JetBrains AI Assistant를 통해 Claude를 사용하지만, 터미널에서 Claude Code를 사용하여 튜토리얼 단계를 진행할 수도 있습니다.
>
{style="tip"}

1. 최신 버전의 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)를 다운로드하고 설치합니다.
2. [JetBrains AI Assistant](https://plugins.jetbrains.com/plugin/22282-jetbrains-ai-assistant)를 설치합니다.
3. 다음 방법 중 하나로 Claude Agent를 활성화합니다.
   * [JetBrains AI 구독 사용](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-jbai-subscription)
   * [API 키 사용](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-claude-agent-with-api-key)
   * [Anthropic Console 사용](https://www.jetbrains.com/help/ai-assistant/activate-agents.html#activate-agent-with-provider-specific-method)

## 프로젝트 생성

> [Spring의 웹 기반 프로젝트 생성기](https://start.spring.io/#!language=kotlin&type=gradle-project-kotlin)를 사용하여 Spring Boot 프로젝트를 생성할 수도 있습니다.
>
{style="tip"}

IntelliJ IDEA에서 새 Spring Boot 프로젝트를 생성합니다.

1. IntelliJ IDEA에서 **File** | **New** | **Project**를 선택합니다.
2. 왼쪽 패널에서 **New Project** | **Spring Boot**를 선택합니다.
3. **New Project** 창에서 다음 필드와 옵션을 지정합니다.

   * **Name**: task-manager-demo
   * **Language**: Kotlin
   * **Type**: Gradle - Kotlin

     > 이 옵션은 빌드 시스템과 DSL을 지정합니다.
     >
     {style="tip"}

   * **Package name**: org.jetbrains.kotlin.taskmanagerdemo
   * **JDK**: jbr-21
   * **Java**: 17

     > 해당 Java 및 JDK 버전이 설치되어 있지 않은 경우, 드롭다운 목록에서 다운로드할 수 있습니다.
     >
     {style="tip"}

   ![Spring Boot 프로젝트 생성](create-spring-claude-project.png){width=800}

4. 모든 필드를 지정했는지 확인한 후 **Next**를 클릭합니다.
5. **Spring Boot** 필드에서 최신 안정화 버전의 Spring Boot를 선택합니다.
6. **Web | Spring Web** 종속성(dependency)을 선택합니다.

   ![Spring Boot 프로젝트 설정](spring-claude-dependency.png){width=800}

7. **Create**를 클릭하여 프로젝트를 생성하고 설정합니다.

   IDE가 새 프로젝트를 생성하고 엽니다. 프로젝트 종속성을 다운로드하고 임포트하는 데 시간이 다소 걸릴 수 있습니다.

## 개발 계획 수립

프로젝트에서 다음을 수행합니다.

1. ![AI Chat](toolWindowChat@20x20.svg){width=20} **AI Chat** 도구 창을 엽니다. 기본적으로 **Chat** 모드가 선택되어 있습니다. 여기서 **Claude Agent**를 선택합니다.

   ![Claude Agent 선택](select-claude-agent.png){width=300}

2. **Mode: Default** ![작동 모드](app-client.expui.general.chevronDownLarge.svg){width=20}{type="joined"}를 클릭하고 **Mode: Plan Mode**를 선택합니다.
   이제 Claude Agent가 작업을 직접 실행하지 않고 계획을 세울 준비가 되었습니다.

   ![기획 모드 선택](claude-plan-mode.png){width=400}

   > 다양한 작동 모드에 대한 자세한 내용은 [작동 모드 선택](https://www.jetbrains.com/help/ai-assistant/claude-agent.html#select-operation-mode)을 참조하세요.
   >
   {style="tip"}

3. Claude에게 할 일 관리 앱을 만들어 달라는 프롬프트를 작성합니다. 포함되어야 한다고 생각하는 기능에 대한 세부 정보를 공유하세요. 예를 들어 다음과 같습니다.

   ```text
   장보기 목록과 같은 할 일을 관리하기 위한 할 일 관리 애플리케이션을 만들고 싶어.
   기본적인 UI가 있어야 하고 카테고리, 마감일, 우선순위, 상태 추적 기능이 포함되어야 해.

   작업하는 동안 VCS를 사용해줘. 단계별로 작업하고 각 단계에서 커밋을 생성해서 나중에 변경 사항을 검토할 수 있게 해줘.
   ```

   > 프롬프트 설계 방법에 대한 지침은 [Claude Code 모범 사례](https://code.claude.com/docs/en/best-practices)를 참조하세요.
   >
   {style="tip"}

   Claude가 기존 프로젝트 구조를 탐색하고 계획을 제안합니다.

4. 계속 진행하기 전에 계획을 주의 깊게 검토하세요. 수정을 원하는 경우 **No, keep planning**을 선택하고 추가 의견을 공유하세요.
5. 진행할 준비가 되면, Claude의 변경 사항에 대해 원하는 제어 수준에 맞는 **Yes ...** 옵션을 선택합니다.

   ![코드 작성 준비 완료](ready-to-code.png){width=600}

   > 다양한 옵션에 대한 자세한 내용은 [Claude Code 권한 모드](https://code.claude.com/docs/en/best-practices)를 참조하세요.
   >
   {style="tip"}

6. Claude가 **기획 모드(Plan Mode)**를 종료하고 작업을 시작합니다. 작업이 완료될 때까지 기다리세요.

## 커밋 검토

앱을 실행하기 전에 생성된 변경 사항을 주의 깊게 검토하세요.

1. **Git** 도구 창을 열어 커밋 목록을 확인합니다.
2. 커밋을 선택하고 수정된 각 파일을 더블 클릭하여 IntelliJ IDEA의 사이드 바이 사이드(side-by-side) 뷰어에서 차이점(diff)을 검토합니다.

![사이드 바이 사이드 뷰어](side-by-side-viewer.png){width=800}

## 앱 실행

변경 사항이 만족스러우면 앱을 실행합니다.

1. `bootRun` Gradle 태스크를 실행하거나 터미널에 다음 명령을 입력합니다.

   ```bash
   ./gradlew bootRun
   ```

2. 브라우저에서 localhost URL을 엽니다. 기본값은 보통 다음과 같습니다.

   ```text
   http://localhost:8080
   ```

   이제 Claude가 만든 기본적인 UI를 볼 수 있습니다.

   ![앱 실행](run-spring-claude-app.png){width=800}

   > Claude가 UI를 직접 디자인하므로, 사용자의 UI는 이 튜토리얼의 버전과 다르게 보일 수 있습니다.
   >
   {style="tip"}

## 앱 테스트

이제 앱을 테스트할 차례입니다.

### UI 수동 테스트

UI 기능 테스트부터 시작해 보세요. 몇 가지 간단한 동작을 시도해 봅니다.

1. 할 일을 생성하고 폼 필드를 테스트합니다.
2. 할 일을 수정하여 변경 사항이 유지되는지 확인합니다.
3. 할 일의 상태를 변경합니다.
4. 할 일을 삭제합니다.
5. 할 일의 카테고리를 변경합니다.

이러한 동작 중 작동하지 않는 것이 있으면 Claude에게 문제를 조사하고 해결해 달라는 새 프롬프트를 보냅니다.

### 유닛 테스트 실행

Claude는 일부 테스트도 자동으로 생성합니다. 다음 명령을 실행하여 모든 테스트가 통과하는지 확인합니다.

   ```bash
   ./gradlew test
   ```

또는 `src/test` 디렉토리에서 테스트를 열고 거터(gutter)에 있는 실행 아이콘 ![실행 아이콘](app-client.expui.run.run.svg){width=20}을 클릭합니다. 테스트에 성공하면 ![실행 성공 아이콘](app-client.expui.gutter.runSuccess.svg){width=20}이 표시됩니다.

테스트가 작동하지 않으면 Claude에게 문제를 조사하고 해결해 달라는 새 프롬프트를 보냅니다.

## 기능 개선

초기 작업이 완료되었으므로 이제 기능을 개선할 수 있습니다. 예를 들어, 사용자가 목록에서 직접 할 일을 수정할 수 있도록 UI를 개선해 보겠습니다.

다음과 같은 프롬프트를 보낼 수 있습니다.

```text
다음 단계로, 사용자가 인라인으로 할 일을 수정할 수 있게 해줘. 예를 들어, 사용자가 할 일 제목을 클릭하여 목록에서 직접 수정할 수 있게 하고, 현재 뷰를 벗어나지 않고도 우선순위, 마감일 또는 상태와 같은 필드를 업데이트할 수 있게 해줘.
이 변경을 통해 앱이 더 빠르고 직관적으로 느껴지도록 만들어줘.
```

이전과 마찬가지로 Claude가 기존 프로젝트 구조를 탐색하고 계획을 제안합니다.
계획을 수락한 후 Claude가 작업을 마칠 때까지 기다렸다가 변경 사항을 검토한 후 앱을 다시 실행하세요.

<img src="make-refinements-claude.gif" alt="Claude로 Spring Boot 앱 개선하기" width="600"/>

축하합니다! IntelliJ IDEA에서 직접 Claude를 사용하여 Kotlin Spring Boot 애플리케이션을 기획, 구축, 테스트 및 개선했습니다.

## 다음 단계

* [](kotlin-ai-skills.md)에 대해 알아보기
* [Junie와 Kotlin AI 기술](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html) 사용에 관한 튜토리얼 확인하기