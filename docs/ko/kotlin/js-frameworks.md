[//]: # (title: Kotlin/JS 프레임워크)

웹 개발을 간소화하는 Kotlin/JavaScript 프레임워크를 활용해 보세요. 이 프레임워크는 현대적인 웹 애플리케이션을 구축하기 위한 즉시 사용 가능한 컴포넌트, 라우팅, 상태 관리 및 기타 도구를 제공합니다.

다음은 커뮤니티에서 제공하는 몇 가지 Kotlin/JS 웹 프레임워크입니다:

## Kobweb

[Kobweb](https://kobweb.varabyte.com/)은 [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)을 사용하여 웹사이트 및 웹 애플리케이션을 생성하는 Kotlin 프레임워크입니다. 빠른 개발을 위해 라이브 리로딩(live-reloading)을 지원합니다. [Next.js](https://nextjs.org/)에서 영감을 받은 Kobweb은 위젯, 레이아웃 및 페이지를 추가하기 위한 표준 구조를 권장합니다.

별도 설정 없이도(Out of the box), Kobweb은 페이지 라우팅, 라이트/다크 모드, CSS 스타일링, Markdown 지원, 백엔드 API 등을 제공합니다. 또한 현대적인 UI를 위한 다양한 용도의 위젯 세트를 포함하는 UI 라이브러리인 [Silk](https://silk-ui.netlify.app/)도 포함되어 있습니다.

Kobweb은 SEO 및 자동 검색 색인(search indexing)을 위한 페이지 스냅샷(page snapshots)을 생성하여 사이트 내보내기(site export)도 지원합니다. 또한 상태 변경에 효율적으로 응답하여 업데이트되는 DOM 기반 UI를 생성할 수 있습니다.

문서 및 예제는 [Kobweb docs](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb) 사이트를 참조하세요.

프레임워크에 대한 업데이트 및 토론을 위해 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 및 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 채널에 참여하세요.

## Kilua

[Kilua](https://kilua.dev/)는 [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)을 기반으로 구축된 컴포저블(composable) 웹 프레임워크이며, [compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html) 라이브러리와 유사합니다. compose-html과 달리 Kilua는 Kotlin/Wasm 및 Kotlin/JS 타겟(target)을 모두 지원합니다.

Kilua는 선언형 UI 컴포넌트를 생성하고 상태를 관리하기 위한 모듈형 API를 제공합니다. 또한 일반적인 웹 애플리케이션 사용 사례를 위한 즉시 사용 가능한 컴포넌트 세트를 포함합니다.

Kilua는 [KVision](https://kvision.io) 프레임워크의 후속작(successor)입니다. Kilua는 Compose 사용자(`@Composable` 함수, 상태 관리, 코루틴/플로우 통합)와 KVision 사용자(UI 컴포넌트와의 일부 명령형(imperative) 상호 작용을 허용하는 컴포넌트 기반 API) 모두에게 익숙하도록 설계되었습니다.

문서 및 예제는 GitHub의 [Kilua repository](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)를 참조하세요.

프레임워크에 대한 업데이트 및 토론을 위해 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) 채널에 참여하세요.

## Kotlin React

[React](https://react.dev/)는 웹 및 네이티브 사용자 인터페이스에 널리 사용되는 컴포넌트 기반 라이브러리입니다. 이 라이브러리는 방대한 컴포넌트 생태계, 학습 자료 및 활발한 커뮤니티를 제공합니다.

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md)는 React의 생태계와 Kotlin의 타입 안전성(type-safety) 및 표현력(expressiveness)을 결합한 React용 Kotlin 래퍼(wrapper)입니다.

라이브러리에 대한 업데이트 및 토론을 위해 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#react](https://kotlinlang.slack.com/messages/react) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

## KVision

[KVision](https://kvision.io)은 즉시 사용 가능한 UI 컴포넌트로 Kotlin/JS 애플리케이션을 구축하기 위한 객체 지향 웹 프레임워크입니다. 이 컴포넌트는 애플리케이션 사용자 인터페이스의 구성 요소(building blocks)가 될 수 있습니다.

이 프레임워크를 사용하면 반응형(reactive) 및 명령형(imperative) 프로그래밍 모델을 모두 사용하여 프런트엔드(frontend)를 구축할 수 있습니다. Ktor, Spring Boot 및 기타 프레임워크용 커넥터(connector)를 사용하여 서버 측 애플리케이션과 통합할 수도 있습니다. 또한 [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)을 사용하여 코드를 공유할 수 있습니다.

문서, 튜토리얼 및 예제는 [KVision docs](https://kvision.io/#docs) 사이트를 참조하세요.

프레임워크에 대한 업데이트 및 토론을 위해 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#kvision](https://kotlinlang.slack.com/messages/kvision) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

## fritz2

[fritz2](https://www.fritz2.dev)는 반응형 웹 사용자 인터페이스를 구축하기 위한 독립형(standalone) 프레임워크입니다. 이 프레임워크는 HTML 요소를 구축하고 렌더링하기 위한 자체 타입 안전(type-safe) DSL을 제공하며, Kotlin의 코루틴(coroutines)과 플로우(flows)를 사용하여 컴포넌트와 해당 데이터 바인딩(data bindings)을 정의합니다.

별도 설정 없이도(Out of the box), fritz2는 상태 관리, 유효성 검사(validation), 라우팅 등을 제공합니다. 또한 Kotlin Multiplatform 프로젝트와 통합됩니다.

문서, 튜토리얼 및 예제는 [fritz2 docs](https://www.fritz2.dev/docs/) 사이트를 참조하세요.

프레임워크에 대한 업데이트 및 토론을 위해 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

## Doodle

[Doodle](https://nacular.github.io/doodle/)은 Kotlin/JS용 벡터 기반 UI 프레임워크입니다. Doodle 애플리케이션은 DOM, CSS 또는 JavaScript에 의존하는 대신 브라우저의 그래픽 기능을 사용하여 사용자 인터페이스를 그립니다. 이 접근 방식은 임의의 UI 요소, 벡터 도형, 그라디언트 및 사용자 지정 시각화(custom visualizations) 렌더링에 대한 제어 권한을 제공합니다.

문서, 튜토리얼 및 예제는 [Doodle docs](https://nacular.github.io/doodle/docs/introduction/) 사이트를 참조하세요.

프레임워크에 대한 업데이트 및 토론을 위해 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#doodle](https://kotlinlang.slack.com/messages/doodle) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.