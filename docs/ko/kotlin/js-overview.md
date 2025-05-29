[//]: # (title: JavaScript용 Kotlin)

Kotlin/JS는 Kotlin 코드, Kotlin 표준 라이브러리 및 모든 호환되는 의존성(dependencies)을 JavaScript로 트랜스파일(transpile)하는 기능을 제공합니다. 현재 Kotlin/JS 구현은 [ES5](https://www.ecma-international.org/ecma-262/5.1/)를 대상으로 합니다.

Kotlin/JS를 사용하는 권장 방식은 `kotlin.multiplatform` Gradle 플러그인을 이용하는 것입니다. 이 플러그인을 사용하면 JavaScript를 대상으로 하는 Kotlin 프로젝트를 한곳에서 쉽게 설정하고 제어할 수 있습니다. 여기에는 애플리케이션 번들링 제어, npm에서 직접 JavaScript 의존성 추가 등 필수 기능이 포함됩니다. 사용 가능한 옵션에 대한 개요를 보려면 [Kotlin/JS 프로젝트 설정](js-project-setup.md)을 확인하세요.

## Kotlin/JS IR 컴파일러

[Kotlin/JS IR 컴파일러](js-ir-compiler.md)는 기존 기본 컴파일러에 비해 여러 가지 개선 사항을 제공합니다. 예를 들어, 데드 코드 제거(dead code elimination)를 통해 생성된 실행 파일의 크기를 줄이고 JavaScript 생태계 및 관련 도구(tooling)와의 상호 운용성을 더욱 원활하게 제공합니다.

> 기존 컴파일러는 Kotlin 1.8.0 릴리스부터 사용 중단되었습니다.
> 
{style="note"}

Kotlin 코드에서 TypeScript 선언 파일(`d.ts`)을 생성함으로써 IR 컴파일러는 TypeScript와 Kotlin 코드를 혼합하는 "하이브리드" 애플리케이션을 쉽게 만들고, Kotlin Multiplatform을 사용하여 코드 공유 기능을 활용할 수 있도록 합니다.

Kotlin/JS IR 컴파일러의 사용 가능한 기능과 프로젝트에 적용하는 방법에 대해 자세히 알아보려면 [Kotlin/JS IR 컴파일러 문서 페이지](js-ir-compiler.md) 및 [마이그레이션 가이드](js-ir-migration.md)를 방문하세요.

## Kotlin/JS 프레임워크

최신 웹 개발은 웹 애플리케이션 구축을 간소화하는 프레임워크의 이점을 크게 얻습니다. 다음은 여러 개발자가 작성한 Kotlin/JS용 인기 웹 프레임워크의 몇 가지 예시입니다.

### Kobweb

_Kobweb_은 웹사이트 및 웹 앱 생성을 위한 자체적인 견해를 가진 Kotlin 프레임워크입니다. 이는 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)과 라이브 리로딩(live-reloading)을 활용하여 빠른 개발을 가능하게 합니다. [Next.js](https://nextjs.org/)에서 영감을 받은 Kobweb은 위젯, 레이아웃 및 페이지를 추가하는 표준 구조를 권장합니다.

Kobweb은 기본적으로 페이지 라우팅, 라이트/다크 모드, CSS 스타일링, 마크다운 지원, 백엔드 API 및 더 많은 기능을 제공합니다. 또한 최신 UI를 위한 다재다능한 위젯 세트인 Silk이라는 UI 라이브러리도 포함합니다.

Kobweb은 또한 사이트 내보내기를 지원하여 SEO 및 자동 검색 색인을 위한 페이지 스냅샷을 생성합니다. 또한 Kobweb을 사용하면 상태 변경에 효율적으로 업데이트되는 DOM 기반 UI를 쉽게 만들 수 있습니다.

문서와 예제를 보려면 [Kobweb](https://kobweb.varabyte.com/) 사이트를 방문하세요.

프레임워크에 대한 업데이트 및 토론은 Kotlin Slack의 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 및 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 채널에 참여하세요.

### KVision

_KVision_은 객체 지향 웹 프레임워크로, Kotlin/JS로 애플리케이션을 작성할 수 있도록 합니다. 이 프레임워크는 애플리케이션의 사용자 인터페이스를 위한 빌딩 블록으로 사용할 수 있는 바로 사용할 수 있는 컴포넌트들을 제공합니다. 반응형 및 명령형 프로그래밍 모델을 모두 사용하여 프론트엔드를 구축하고, Ktor, Spring Boot 및 기타 프레임워크용 커넥터를 사용하여 서버 측 애플리케이션과 통합하며, [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)을 사용하여 코드를 공유할 수 있습니다.

문서, 튜토리얼 및 예제를 보려면 [KVision 사이트](https://kvision.io)를 방문하세요.

프레임워크에 대한 업데이트 및 토론은 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#kvision](https://kotlinlang.slack.com/messages/kvision) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

### fritz2

_fritz2_는 반응형 웹 사용자 인터페이스 구축을 위한 독립형 프레임워크입니다. HTML 요소를 구축하고 렌더링하기 위한 자체 타입 안정성 DSL을 제공하며, Kotlin의 코루틴과 플로우를 활용하여 컴포넌트와 해당 데이터 바인딩을 표현합니다. 상태 관리, 유효성 검사, 라우팅 등을 기본적으로 제공하며, Kotlin Multiplatform 프로젝트와 통합됩니다.

문서, 튜토리얼 및 예제를 보려면 [fritz2 사이트](https://www.fritz2.dev)를 방문하세요.

프레임워크에 대한 업데이트 및 토론은 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

### Doodle

_Doodle_은 Kotlin/JS용 벡터 기반 UI 프레임워크입니다. Doodle 애플리케이션은 DOM, CSS 또는 Javascript에 의존하는 대신 브라우저의 그래픽 기능을 사용하여 사용자 인터페이스를 그립니다. 이 접근 방식을 사용함으로써 Doodle은 임의의 UI 요소, 벡터 도형, 그라데이션 및 사용자 지정 시각화의 렌더링에 대한 정밀한 제어를 제공합니다.

문서, 튜토리얼 및 예제를 보려면 [Doodle 사이트](https://nacular.github.io/doodle/)를 방문하세요.

프레임워크에 대한 업데이트 및 토론은 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#doodle](https://kotlinlang.slack.com/messages/doodle) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

## Kotlin/JS 커뮤니티 참여

공식 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하여 커뮤니티 및 팀과 대화할 수 있습니다.