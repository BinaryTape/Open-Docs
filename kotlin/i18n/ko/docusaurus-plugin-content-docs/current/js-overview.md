---
title: "JavaScript용 Kotlin"
---
Kotlin/JS는 Kotlin 코드, Kotlin 표준 라이브러리 및 호환 가능한 종속성을 JavaScript로 트랜스파일할 수 있는 기능을 제공합니다. 현재 Kotlin/JS 구현은 [ES5](https://www.ecma-international.org/ecma-262/5.1/)를 대상으로 합니다.

Kotlin/JS를 사용하는 가장 권장되는 방법은 `kotlin.multiplatform` Gradle 플러그인을 사용하는 것입니다. 이를 통해 JavaScript를 대상으로 하는 Kotlin 프로젝트를 한 곳에서 쉽게 설정하고 제어할 수 있습니다. 여기에는 애플리케이션 번들링 제어, npm에서 직접 JavaScript 종속성 추가 등과 같은 필수 기능이 포함됩니다. 사용 가능한 옵션에 대한 개요를 보려면 [Kotlin/JS 프로젝트 설정](js-project-setup)을 확인하세요.

## Kotlin/JS IR 컴파일러

[Kotlin/JS IR compiler](js-ir-compiler)는 기존 기본 컴파일러보다 여러 가지 개선 사항이 있습니다. 예를 들어, 데드 코드 제거를 통해 생성된 실행 파일의 크기를 줄이고 JavaScript 생태계 및 해당 도구와의 상호 운용성을 더욱 원활하게 제공합니다.

:::note
기존 컴파일러는 Kotlin 1.8.0 릴리스 이후로 더 이상 사용되지 않습니다.

:::

Kotlin 코드에서 TypeScript 선언 파일(`d.ts`)을 생성함으로써 IR 컴파일러는 TypeScript 및 Kotlin 코드를 혼합한 "하이브리드" 애플리케이션을 더 쉽게 만들고 Kotlin Multiplatform을 사용하여 코드 공유 기능을 활용할 수 있도록 합니다.

Kotlin/JS IR 컴파일러에서 사용 가능한 기능과 프로젝트에서 사용해 보는 방법에 대한 자세한 내용은 [Kotlin/JS IR compiler documentation page](js-ir-compiler) 및 [migration guide](js-ir-migration)를 방문하세요.

## Kotlin/JS 프레임워크

최신 웹 개발은 웹 애플리케이션 구축을 간소화하는 프레임워크로부터 큰 이점을 얻습니다. 다음은 여러 작성자가 작성한 Kotlin/JS용으로 널리 사용되는 웹 프레임워크의 몇 가지 예입니다.

### Kobweb

_Kobweb_은 웹사이트 및 웹 앱 제작을 위한 의견이 반영된 Kotlin 프레임워크입니다. [Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)과 빠른 개발을 위한 라이브 다시 로드를 활용합니다. [Next.js](https://nextjs.org/)에서 영감을 받은 Kobweb은 위젯, 레이아웃 및 페이지 추가를 위한 표준 구조를 촉진합니다.

Kobweb은 페이지 라우팅, 라이트/다크 모드, CSS 스타일링, Markdown 지원, 백엔드 API 등 다양한 기능을 기본적으로 제공합니다. 또한 현대적인 UI를 위한 다양한 위젯 세트인 Silk라는 UI 라이브러리도 포함되어 있습니다.

Kobweb은 사이트 내보내기를 지원하여 SEO 및 자동 검색 인덱싱을 위한 페이지 스냅샷을 생성합니다. 또한 Kobweb을 사용하면 상태 변경에 따라 효율적으로 업데이트되는 DOM 기반 UI를 쉽게 만들 수 있습니다.

문서 및 예제는 [Kobweb](https://kobweb.varabyte.com/) 사이트를 방문하세요.

프레임워크에 대한 업데이트 및 토론에 참여하려면 Kotlin Slack의 [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) 및 [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) 채널에 참여하세요.

### KVision

_KVision_은 Kotlin/JS에서 애플리케이션을 작성할 수 있도록 하는 객체 지향 웹 프레임워크로, 애플리케이션 사용자 인터페이스의 빌딩 블록으로 사용할 수 있는 즉시 사용 가능한 구성 요소가 있습니다. 반응형 및 명령형 프로그래밍 모델을 모두 사용하여 프런트엔드를 구축하고, Ktor, Spring Boot 및 기타 프레임워크용 커넥터를 사용하여 서버측 애플리케이션과 통합하고, [Kotlin Multiplatform](multiplatform-intro)을 사용하여 코드를 공유할 수 있습니다.

문서, 튜토리얼 및 예제는 [Visit KVision site](https://kvision.io)를 방문하세요.

프레임워크에 대한 업데이트 및 토론에 참여하려면 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#kvision](https://kotlinlang.slack.com/messages/kvision) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

### fritz2

_fritz2_는 반응형 웹 사용자 인터페이스 구축을 위한 독립 실행형 프레임워크입니다. HTML 요소 구축 및 렌더링을 위한 자체 유형 안전 DSL을 제공하며 Kotlin의 코루틴 및 플로우를 사용하여 구성 요소와 해당 데이터 바인딩을 표현합니다. 상태 관리, 유효성 검사, 라우팅 등을 기본적으로 제공하며 Kotlin Multiplatform 프로젝트와 통합됩니다.

문서, 튜토리얼 및 예제는 [Visit fritz2 site](https://www.fritz2.dev)를 방문하세요.

프레임워크에 대한 업데이트 및 토론에 참여하려면 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#fritz2](https://kotlinlang.slack.com/messages/fritz2) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

### Doodle

_Doodle_은 Kotlin/JS용 벡터 기반 UI 프레임워크입니다. Doodle 애플리케이션은 브라우저의 그래픽 기능을 사용하여 DOM, CSS 또는 Javascript에 의존하는 대신 사용자 인터페이스를 그립니다. 이 접근 방식을 사용하면 Doodle은 임의의 UI 요소, 벡터 모양, 그라데이션 및 사용자 정의 시각화 렌더링을 정밀하게 제어할 수 있습니다.

문서, 튜토리얼 및 예제는 [Visit Doodle site](https://nacular.github.io/doodle/)를 방문하세요.

프레임워크에 대한 업데이트 및 토론에 참여하려면 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#doodle](https://kotlinlang.slack.com/messages/doodle) 및 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하세요.

## Kotlin/JS 커뮤니티에 참여하세요

공식 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하여 커뮤니티 및 팀과 채팅할 수 있습니다.