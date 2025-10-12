[//]: # (title: Kotlin/JavaScript)

Kotlin/JavaScript (Kotlin/JS)를 사용하면 Kotlin 코드, Kotlin 표준 라이브러리 및 모든 호환되는 종속성을 JavaScript로 트랜스파일할 수 있습니다. 이를 통해 Kotlin 애플리케이션은 JavaScript를 지원하는 모든 환경에서 실행될 수 있습니다.

[Kotlin Multiplatform Gradle 플러그인](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)(`kotlin.multiplatform`)을 통해 Kotlin/JS를 사용하면 JavaScript를 대상으로 하는 Kotlin 프로젝트를 한곳에서 설정하고 관리할 수 있습니다.

Kotlin Multiplatform Gradle 플러그인은 애플리케이션 번들링 제어 및 npm에서 JavaScript 종속성을 직접 추가하는 것과 같은 기능에 대한 접근을 제공합니다. 사용 가능한 구성 옵션에 대한 개요는 [Kotlin/JS 프로젝트 설정](js-project-setup.md)을 참조하세요.

> Kotlin/JS의 현재 구현은 [ES5](https://www.ecma-international.org/ecma-262/5.1/) 및 [ES2015](https://262.ecma-international.org/6.0/) 표준을 대상으로 합니다.
>
{style="tip"}

## Kotlin/JS 사용 사례

다음은 Kotlin/JS를 사용하는 몇 가지 일반적인 방법입니다.

*   **프런트엔드와 JVM 백엔드 간에 공통 로직 공유**

    백엔드가 Kotlin 또는 다른 JVM 호환 언어로 작성된 경우, 웹 애플리케이션과 백엔드 간에 공통 코드를 공유할 수 있습니다. 여기에는 데이터 전송 객체(DTO), 유효성 검사 및 인증 규칙, REST API 엔드포인트 추상화 등이 포함됩니다.

*   **Android, iOS 및 웹 클라이언트 간에 공통 로직 공유**

    웹 인터페이스와 Android 및 iOS용 모바일 애플리케이션 간에 비즈니스 로직을 공유하면서 네이티브 사용자 인터페이스를 유지할 수 있습니다. 이는 REST API 추상화, 사용자 인증, 폼 유효성 검사 및 도메인 모델과 같은 공통 기능의 중복을 방지합니다.

*   **Kotlin/JS를 사용하여 프런트엔드 웹 애플리케이션 구축**

    기존 도구 및 라이브러리와 통합하면서 Kotlin을 사용하여 전통적인 웹 프런트엔드를 개발하세요.

    *   Android 개발에 익숙하다면, [Kobweb](https://kobweb.varabyte.com/) 또는 [Kilua](https://kilua.dev/)와 같은 Compose 기반 프레임워크를 사용하여 웹 애플리케이션을 구축할 수 있습니다.
    *   JetBrains에서 제공하는 [일반 JavaScript 라이브러리를 위한 Kotlin 래퍼](https://github.com/JetBrains/kotlin-wrappers)를 사용하여 Kotlin/JS로 완전히 타입 안전한 React 애플리케이션을 구축하세요. Kotlin 래퍼(`kotlin-wrappers`)는 React 및 기타 JavaScript 프레임워크를 위한 추상화 및 통합을 제공합니다.

        이러한 래퍼는 [React Redux](https://react-redux.js.org/), [React Router](https://reactrouter.com/), [styled-components](https://styled-components.com/)와 같은 보완 라이브러리도 지원합니다. 또한 JavaScript 생태계와의 상호 운용성을 통해 서드파티 React 컴포넌트 및 컴포넌트 라이브러리를 사용할 수도 있습니다.

    *   Kotlin 생태계와 통합되어 간결하고 표현력이 풍부한 코드를 지원하는 [Kotlin/JS 프레임워크](js-frameworks.md)를 사용하세요.

*   **이전 브라우저를 지원하는 멀티플랫폼 애플리케이션 구축**

    Compose Multiplatform을 사용하면 Kotlin으로 애플리케이션을 구축하고 웹 프로젝트에서 모바일 및 데스크톱 사용자 인터페이스를 재사용할 수 있습니다. [Kotlin/Wasm](wasm-overview.md)이 이 목적의 주요 대상이지만, Kotlin/JS도 대상으로 하여 이전 브라우저로 지원을 확장할 수 있습니다.

*   **Kotlin/JS를 사용하여 서버 측 및 서버리스 애플리케이션 구축**

    Kotlin/JS의 Node.js 대상은 JavaScript 런타임에서 서버 측 또는 서버리스 환경용 애플리케이션을 생성할 수 있도록 합니다. 이는 빠른 시작과 낮은 메모리 사용량을 제공합니다. [`kotlinx-nodejs`](https://github.com/Kotlin/kotlinx-nodejs) 라이브러리는 Kotlin에서 [Node.js API](https://nodejs.org/docs/latest/api/)에 대한 타입 안전 접근을 제공합니다.

사용 사례에 따라 Kotlin/JS 프로젝트는 Kotlin 생태계의 호환 라이브러리 및 JavaScript와 TypeScript 생태계의 서드파티 라이브러리를 사용할 수 있습니다.

Kotlin 코드에서 서드파티 라이브러리를 사용하려면, 직접 타입 안전 래퍼를 생성하거나 커뮤니티에서 유지보수하는 래퍼를 사용할 수 있습니다. 또한 Kotlin/JS [동적 타입](dynamic-type.md)을 사용할 수 있습니다. 이는 타입 안전성을 저하시키는 대신 엄격한 타입 지정 및 라이브러리 래퍼를 생략할 수 있도록 합니다.

Kotlin/JS는 가장 일반적인 모듈 시스템인 [ESM](https://tc39.es/ecma262/#sec-modules), [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules), [UMD](https://github.com/umdjs/umd) 및 [AMD](https://github.com/amdjs/amdjs-api)와도 호환됩니다. 이를 통해 [모듈을 생성 및 소비](js-modules.md)하고 구조화된 방식으로 JavaScript 생태계와 통합할 수 있습니다.

### 사용 사례 공유

[Kotlin/JS 사용 사례](#use-cases-for-kotlin-js)의 목록은 총망라하는 것은 아닙니다. 다양한 접근 방식을 자유롭게 실험하고 프로젝트에 가장 적합한 방법을 찾아보세요.

공식 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에서 Kotlin/JS 커뮤니티와 사용 사례, 경험 및 질문을 공유하세요.

## Kotlin/JS 시작하기

Kotlin/JS 작업을 시작하기 위한 기본 사항 및 초기 단계를 살펴보세요.

*   Kotlin이 처음이라면, [기본 문법](basic-syntax.md)을 검토하고 [Kotlin 둘러보기](kotlin-tour-welcome.md)를 탐색하는 것부터 시작하세요.
*   영감을 얻기 위해 [Kotlin/JS 샘플 프로젝트](#sample-projects-for-kotlin-js) 목록을 확인하세요. 이 샘플들은 프로젝트를 시작하는 데 도움이 될 수 있는 유용한 코드 스니펫과 패턴을 포함하고 있습니다.
*   Kotlin/JS가 처음이라면, 고급 주제를 탐색하기 전에 [설정 가이드](js-project-setup.md)부터 시작하세요.

Kotlin/JS를 직접 사용해 보시겠습니까?

<a href="js-get-started.md"><img src="js-get-started-button.svg" width="500" alt="Kotlin/JS 시작하기" style="block"/></a>

## Kotlin/JS 샘플 프로젝트

다음 표는 다양한 Kotlin/JS 사용 사례, 아키텍처 및 코드 공유 전략을 보여주는 샘플 프로젝트 목록입니다.

| 프로젝트                                                                                                                           | 설명                                                                                                                                                                                                                                                                                                                      |
|-----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Spring과 Angular 간의 공통 코드를 가진 Petclinic](https://github.com/Kotlin/kmp-spring-petclinic/#readme)                   | 엔터프라이즈 애플리케이션에서 데이터 전송 객체, 유효성 검사 및 인증 규칙, REST API 엔드포인트 추상화를 공유하여 코드 중복을 방지하는 방법을 보여줍니다. 코드는 [Spring Boot](https://spring.io/projects/spring-boot) 백엔드와 [Angular](https://angular.dev/) 프런트엔드 간에 공유됩니다. |
| [풀스택 컨퍼런스 CMS](https://github.com/Kotlin/kmp-fullstack-conference-cms/#readme)                                        | [Ktor](https://ktor.io/), [Jetpack Compose](https://developer.android.com/compose) 및 [Vue.js](https://vuejs.org/) 애플리케이션 간의 가장 간단한 방식부터 올인 코드 공유 방식에 이르는 다양한 코드 공유 접근 방식을 보여줍니다. |
| [Compose-HTML 기반 Kobweb 프레임워크의 Todo 앱](https://github.com/varabyte/kobweb-templates/tree/main/examples/todo/#readme) | Android 개발자에게 익숙한 접근 방식을 재사용하여 할 일 목록 애플리케이션을 생성하는 방법을 보여줍니다. 이는 [Kobweb 프레임워크](https://kobweb.varabyte.com/)를 기반으로 하는 클라이언트 UI 애플리케이션을 구축합니다. |
| [Android, iOS 및 웹 간의 간단한 로직 공유](https://github.com/Kotlin/kmp-logic-sharing-simple-example/#readme)          | Android([Jetpack Compose](https://developer.android.com/compose)), iOS([SwiftUI](https://developer.apple.com/tutorials/swiftui/)) 및 웹([React](https://react.dev/))의 플랫폼 네이티브 UI 애플리케이션에서 사용되는 Kotlin으로 공통 로직을 가진 프로젝트를 구축하기 위한 템플릿을 포함합니다. |
| [풀스택 공동 작업 할 일 목록](https://github.com/kotlin-hands-on/jvm-js-fullstack/#readme)                                | JS 및 JVM 대상을 사용하는 Kotlin Multiplatform으로 공동 작업을 위한 할 일 목록 애플리케이션을 생성하는 방법을 보여줍니다. 백엔드에는 [Ktor](https://ktor.io/)를 사용하고, 프런트엔드에는 React와 함께 Kotlin/JS를 사용합니다. |

## Kotlin/JS 프레임워크

Kotlin/JS 프레임워크는 바로 사용할 수 있는 컴포넌트, 라우팅, 상태 관리 및 최신 웹 애플리케이션 구축을 위한 기타 도구를 제공하여 웹 개발을 간소화합니다.

[다양한 저자가 작성한 Kotlin/JS용 사용 가능한 프레임워크를 확인하세요](js-frameworks.md).

## Kotlin/JS 커뮤니티에 참여하세요

공식 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)의 [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) 채널에 참여하여 커뮤니티 및 Kotlin/JS 팀과 채팅할 수 있습니다.

## 다음 단계

*   [Kotlin/JS 프로젝트 설정](js-project-setup.md)
*   [Kotlin/JS 프로젝트 실행](running-kotlin-js.md)
*   [Kotlin/JS 코드 디버깅](js-debugging.md)
*   [Kotlin/JS에서 테스트 실행](js-running-tests.md)