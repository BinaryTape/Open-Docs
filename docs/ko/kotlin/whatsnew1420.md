[//]: # (title: Kotlin 1.4.20의 새로운 기능)

_[릴리스: 2020년 11월 23일](releases.md#release-details)_

Kotlin 1.4.20은 여러 가지 새로운 실험적인 기능을 제공하며, 1.4.0에 추가된 기능을 포함한 기존 기능에 대한 수정 및 개선 사항을 제공합니다.

자세한 예시가 포함된 새로운 기능은 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)에서도 확인할 수 있습니다.

## Kotlin/JVM

Kotlin/JVM의 개선 사항은 최신 Java 버전의 기능에 발맞추기 위함입니다:

- [Java 15 대상](#java-15-target)
- [invokedynamic 문자열 연결](#invokedynamic-string-concatenation)

### Java 15 대상

이제 Java 15를 Kotlin/JVM 대상으로 사용할 수 있습니다.

### invokedynamic 문자열 연결

> `invokedynamic` 문자열 연결은 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(Opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.4.20은 JVM 9 이상을 대상으로 문자열 연결을 [동적 호출](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)로 컴파일하여 성능을 향상시킬 수 있습니다.

현재 이 기능은 실험적이며 다음 경우를 포함합니다:
- 연산자 (`a + b`), 명시적 (`a.plus(b)`), 그리고 참조 (`(a::plus)(b)`) 형태의 `String.plus`.
- 인라인 및 데이터 클래스의 `toString`.
- 단일 비상수(non-constant) 인수를 가진 경우를 제외한 문자열 템플릿(참조: [KT-42457](https://youtrack.jetbrains.com/issue/KT-42457)).

`invokedynamic` 문자열 연결을 활성화하려면 다음 값 중 하나와 함께 `-Xstring-concat` 컴파일러 옵션을 추가하십시오:
- `indy-with-constants`를 사용하여 [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)를 통해 문자열에 `invokedynamic` 연결을 수행합니다.
- `indy`를 사용하여 [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-)를 통해 문자열에 `invokedynamic` 연결을 수행합니다.
- `inline`을 사용하여 `StringBuilder.append()`를 통한 기존 연결 방식으로 되돌아갑니다.

## Kotlin/JS

Kotlin/JS는 빠르게 발전하고 있으며, 1.4.20에서는 여러 실험적인 기능과 개선 사항을 찾아볼 수 있습니다:

- [Gradle DSL 변경 사항](#gradle-dsl-changes)
- [새 위자드 템플릿](#new-wizard-templates)
- [IR 컴파일러를 사용한 컴파일 오류 무시](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 변경 사항

Kotlin/JS용 Gradle DSL은 프로젝트 설정 및 사용자 정의를 단순화하는 여러 업데이트를 받았습니다. 여기에는 webpack 구성 조정, 자동 생성된 `package.json` 파일 수정, 그리고 전이적 종속성에 대한 향상된 제어가 포함됩니다.

#### webpack 구성의 단일 지점

브라우저 대상에 새로운 구성 블록인 `commonWebpackConfig`를 사용할 수 있습니다. 이 블록 내에서 `webpackTask`, `runTask`, `testTask`에 대한 구성을 중복할 필요 없이 단일 지점에서 공통 설정을 조정할 수 있습니다.

세 가지 작업 모두에 CSS 지원을 기본적으로 활성화하려면 프로젝트의 `build.gradle(.kts)`에 다음 스니펫을 추가하십시오:

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

[webpack 번들링 구성](js-project-setup.md#webpack-bundling)에 대해 자세히 알아보십시오.

#### package.json 사용자 정의

Kotlin/JS 패키지 관리 및 배포에 대한 더 많은 제어를 위해 이제 Gradle DSL을 통해 프로젝트 파일 [`package.json`](https://nodejs.dev/learn/the-package-json-guide)에 속성을 추가할 수 있습니다.

`package.json`에 사용자 정의 필드를 추가하려면 컴파일의 `packageJson` 블록에서 `customField` 함수를 사용하십시오:

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

[`package.json` 사용자 정의](js-project-setup.md#package-json-customization)에 대해 자세히 알아보십시오.

#### 선택적 yarn 종속성 해결

> 선택적 yarn 종속성 해결 지원은 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin 1.4.20은 Yarn의 [선택적 종속성 해결](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)을 구성하는 방법을 제공합니다. 이는 여러분이 의존하는 패키지의 종속성을 재정의하는 메커니즘입니다.

Gradle의 `YarnPlugin` 내 `YarnRootExtension`을 통해 이를 사용할 수 있습니다. 프로젝트의 패키지 해결 버전에 영향을 미치려면, 패키지 이름 선택자(Yarn이 지정한 대로)와 해결될 버전을 전달하는 `resolution` 함수를 사용하십시오.

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

여기서 `react`를 필요로 하는 _모든_ npm 종속성은 버전 `16.0.0`을 받게 되며, `processor`는 종속성 `decamelize`를 버전 `3.0.0`으로 받게 됩니다.

#### 세분화된 워크스페이스 비활성화

> 세분화된 워크스페이스 비활성화는 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

빌드 시간을 단축하기 위해 Kotlin/JS Gradle 플러그인은 특정 Gradle 작업에 필요한 종속성만 설치합니다. 예를 들어, `webpack-dev-server` 패키지는 `*Run` 작업 중 하나를 실행할 때만 설치되며, assemble 작업을 실행할 때는 설치되지 않습니다. 이러한 동작은 여러 Gradle 프로세스를 병렬로 실행할 때 잠재적으로 문제를 일으킬 수 있습니다. 종속성 요구 사항이 충돌하면 npm 패키지의 두 가지 설치로 인해 오류가 발생할 수 있습니다.

이 문제를 해결하기 위해 Kotlin 1.4.20에는 이러한 소위 _세분화된 워크스페이스_를 비활성화하는 옵션이 포함되어 있습니다. 이 기능은 현재 Gradle의 `YarnPlugin` 내 `YarnRootExtension`을 통해 사용할 수 있습니다. 이를 사용하려면 `build.gradle.kts` 파일에 다음 스니펫을 추가하십시오:

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 새 위자드 템플릿

프로젝트 생성 중 프로젝트를 사용자 정의할 수 있는 더 편리한 방법을 제공하기 위해 Kotlin용 프로젝트 위자드에는 Kotlin/JS 애플리케이션을 위한 새로운 템플릿이 포함되어 있습니다:
- **브라우저 애플리케이션 (Browser Application)** - 브라우저에서 실행되는 최소한의 Kotlin/JS Gradle 프로젝트입니다.
- **React 애플리케이션 (React Application)** - 적절한 `kotlin-wrappers`를 사용하는 React 앱입니다. 스타일 시트, 탐색 구성 요소 또는 상태 컨테이너에 대한 통합을 활성화하는 옵션을 제공합니다.
- **Node.js 애플리케이션 (Node.js Application)** - Node.js 런타임에서 실행하기 위한 최소한의 프로젝트입니다. 실험적인 `kotlinx-nodejs` 패키지를 직접 포함할 수 있는 옵션이 함께 제공됩니다.

### IR 컴파일러를 사용한 컴파일 오류 무시

> _컴파일 오류 무시_ 모드는 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(Opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin/JS용 [IR 컴파일러](js-ir-compiler.md)는 새로운 실험적 모드인 _오류를 포함한 컴파일_을 제공합니다. 이 모드에서는 전체 애플리케이션이 아직 준비되지 않은 상태에서 특정 기능을 시도하려는 경우처럼 오류가 포함된 코드도 실행할 수 있습니다.

이 모드에는 두 가지 허용 정책이 있습니다:
- `SEMANTIC`: 컴파일러는 `val x: String = 3`과 같이 구문적으로는 올바르지만 의미상으로는 맞지 않는 코드를 허용합니다.

- `SYNTAX`: 컴파일러는 구문 오류가 포함된 코드라도 모두 허용합니다.

오류를 포함한 컴파일을 허용하려면 위에 나열된 값 중 하나와 함께 `-Xerror-tolerance-policy=` 컴파일러 옵션을 추가하십시오.

[Kotlin/JS IR 컴파일러에 대해 자세히 알아보십시오](js-ir-compiler.md).

## Kotlin/Native

Kotlin/Native의 1.4.20에서의 우선순위는 성능과 기존 기능 개선입니다. 주요 개선 사항은 다음과 같습니다:
- [이스케이프 분석](#escape-analysis)
- [성능 개선 및 버그 수정](#performance-improvements-and-bug-fixes)
- [Objective-C 예외 옵트인 래핑](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 플러그인 개선](#cocoapods-plugin-improvements)
- [Xcode 12 라이브러리 지원](#support-for-xcode-12-libraries)

### 이스케이프 분석

> 이스케이프 분석 메커니즘은 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin/Native는 새로운 [이스케이프 분석](https://en.wikipedia.org/wiki/Escape_analysis) 메커니즘의 프로토타입을 제공합니다. 이는 특정 객체를 힙 대신 스택에 할당하여 런타임 성능을 향상시킵니다. 이 메커니즘은 벤치마크에서 평균 10%의 성능 향상을 보이며, 프로그램을 더욱 빠르게 만들기 위해 계속해서 개선하고 있습니다.

이스케이프 분석은 릴리스 빌드(`-opt` 컴파일러 옵션 사용)의 별도 컴파일 단계에서 실행됩니다.

이스케이프 분석 단계를 비활성화하려면 `-Xdisable-phases=EscapeAnalysis` 컴파일러 옵션을 사용하십시오.

### 성능 개선 및 버그 수정

Kotlin/Native는 1.4.0에 추가된 [코드 공유 메커니즘](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)을 포함하여 다양한 구성 요소에서 성능 개선 및 버그 수정을 제공합니다.

### Objective-C 예외 옵트인 래핑

> Objective-C 예외 래핑 메커니즘은 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(Opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

Kotlin/Native는 이제 프로그램 충돌을 피하기 위해 런타임에 Objective-C 코드에서 발생한 예외를 처리할 수 있습니다.

`NSException`을 `ForeignException` 타입의 Kotlin 예외로 래핑하도록 옵트인할 수 있습니다. 이 예외들은 원본 `NSException`에 대한 참조를 유지합니다. 이를 통해 근본 원인에 대한 정보를 얻고 적절하게 처리할 수 있습니다.

Objective-C 예외 래핑을 활성화하려면 `cinterop` 호출에서 `-Xforeign-exception-mode objc-wrap` 옵션을 지정하거나 `.def` 파일에 `foreignExceptionMode = objc-wrap` 속성을 추가하십시오. [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html)을 사용하는 경우, 종속성의 `pod {}` 빌드 스크립트 블록에 다음과 같이 옵션을 지정하십시오:

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

기본 동작은 변경되지 않습니다. Objective-C 코드에서 예외가 발생하면 프로그램이 종료됩니다.

### CocoaPods 플러그인 개선

Kotlin 1.4.20은 CocoaPods 통합의 개선 사항을 계속합니다. 즉, 다음 새로운 기능을 시도해 볼 수 있습니다:

- [향상된 태스크 실행](#improved-task-execution)
- [확장된 DSL](#extended-dsl)
- [Xcode와의 통합 업데이트](#updated-integration-with-xcode)

#### 향상된 태스크 실행

CocoaPods 플러그인은 향상된 태스크 실행 흐름을 제공합니다. 예를 들어, 새로운 CocoaPods 종속성을 추가해도 기존 종속성이 다시 빌드되지 않습니다. 추가 대상을 추가하는 것도 기존 종속성에 대한 다시 빌드에 영향을 미치지 않습니다.

#### 확장된 DSL

Kotlin 프로젝트에 [CocoaPods](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) 종속성을 추가하는 DSL은 새로운 기능을 받습니다.

로컬 Pods 및 CocoaPods 저장소의 Pods 외에도 다음과 같은 유형의 라이브러리에 대한 종속성을 추가할 수 있습니다:
* 사용자 정의 Spec 저장소의 라이브러리.
* Git 저장소의 원격 라이브러리.
* 아카이브의 라이브러리(임의의 HTTP 주소로도 사용 가능).
* 정적 라이브러리.
* 사용자 정의 cinterop 옵션이 있는 라이브러리.

Kotlin 프로젝트에서 [CocoaPods 종속성 추가](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-libraries.html)에 대해 자세히 알아보십시오. [Kotlin with CocoaPods 샘플](https://github.com/Kotlin/kmm-with-cocoapods-sample)에서 예시를 찾아볼 수 있습니다.

#### Xcode와의 통합 업데이트

Xcode와 올바르게 작동하려면 Kotlin은 Podfile에 일부 변경 사항이 필요합니다:

* Kotlin Pod에 Git, HTTP 또는 specRepo Pod 종속성이 있는 경우, Podfile에도 이를 지정해야 합니다.
* 사용자 정의 Spec에서 라이브러리를 추가할 때, Podfile 시작 부분에 Spec의 [위치](https://guides.cocoapods.org/syntax/podfile.html#source)도 지정해야 합니다.

이제 IDEA에서 통합 오류에 대한 상세 설명이 제공됩니다. 따라서 Podfile에 문제가 발생하면 즉시 해결 방법을 알 수 있습니다.

[Kotlin Pods 생성](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-xcode.html)에 대해 자세히 알아보십시오.

### Xcode 12 라이브러리 지원

Xcode 12와 함께 제공되는 새로운 라이브러리에 대한 지원을 추가했습니다. 이제 Kotlin 코드에서 이 라이브러리들을 사용할 수 있습니다.

## Kotlin Multiplatform

### 멀티플랫폼 라이브러리 게시 구조 업데이트

Kotlin 1.4.20부터는 더 이상 별도의 메타데이터 게시가 없습니다. 메타데이터 아티팩트는 이제 전체 라이브러리를 나타내는 _루트_ 게시물에 포함되며, 공통 소스 세트에 종속성으로 추가될 때 적절한 플랫폼별 아티팩트로 자동 해결됩니다.

[멀티플랫폼 라이브러리 게시](https://kotlinlang.org/docs/multiplatform/multiplatform-publish-lib-setup.html)에 대해 자세히 알아보십시오.

#### 이전 버전과의 호환성

이 구조 변경은 [계층적 프로젝트 구조](https://kotlinlang.org/docs/multiplatform/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)를 가진 프로젝트 간의 호환성을 손상시킵니다. 멀티플랫폼 프로젝트와 해당 프로젝트가 의존하는 라이브러리가 모두 계층적 프로젝트 구조를 가지고 있다면, 동시에 Kotlin 1.4.20 이상으로 업데이트해야 합니다. Kotlin 1.4.20으로 게시된 라이브러리는 이전 버전으로 게시된 프로젝트에서 사용할 수 없습니다.

계층적 프로젝트 구조가 없는 프로젝트와 라이브러리는 호환됩니다.

## 표준 라이브러리

Kotlin 1.4.20의 표준 라이브러리는 파일 작업용 새로운 확장 기능과 향상된 성능을 제공합니다.

- [`java.nio.file.Path`용 확장 기능](#extensions-for-java-nio-file-path)
- [`String.replace` 함수 성능 개선](#improved-string-replace-function-performance)

### `java.nio.file.Path`용 확장 기능

> `java.nio.file.Path`용 확장 기능은 [실험적](components-stability.md) 기능입니다. 이 기능은 언제든지 제거되거나 변경될 수 있습니다. 옵트인(Opt-in)이 필요합니다(자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 여러분의 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

이제 표준 라이브러리는 `java.nio.file.Path`용 실험적 확장 기능을 제공합니다. 현대적인 JVM 파일 API를 Kotlin스러운 방식으로 사용하는 것은 `kotlin.io` 패키지의 `java.io.File` 확장 기능과 유사합니다.

```kotlin
// div (/) 연산자로 경로 생성
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// 디렉터리의 파일 목록 표시
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

이 확장 기능은 `kotlin-stdlib-jdk7` 모듈의 `kotlin.io.path` 패키지에 있습니다. 확장 기능을 사용하려면 실험적 어노테이션 `@ExperimentalPathApi`에 [옵트인](opt-in-requirements.md)해야 합니다.

### `String.replace` 함수 성능 개선

`String.replace()`의 새로운 구현은 함수 실행 속도를 높입니다. 대소문자를 구분하는 변형은 `indexOf`를 기반으로 하는 수동 교체 루프를 사용하며, 대소문자를 구분하지 않는 변형은 정규 표현식 매칭을 사용합니다.

## Kotlin Android Extensions

1.4.20에서는 Kotlin Android Extensions 플러그인이 더 이상 사용되지 않으며(`deprecated`), `Parcelable` 구현 생성기는 별도의 플러그인으로 이동합니다.

- [합성 뷰 사용 중단](#deprecation-of-synthetic-views)
- [`Parcelable` 구현 생성기를 위한 새로운 플러그인](#new-plugin-for-parcelable-implementation-generator)

### 합성 뷰 사용 중단

_합성 뷰_는 UI 요소와의 상호 작용을 단순화하고 상용구(boilerplate)를 줄이기 위해 얼마 전 Kotlin Android Extensions 플러그인에 도입되었습니다. 이제 Google은 동일한 기능을 하는 네이티브 메커니즘인 Android Jetpack의 [뷰 바인딩](https://developer.android.com/topic/libraries/view-binding)을 제공하며, 저희는 뷰 바인딩을 위해 합성 뷰를 더 이상 사용하지 않도록(`deprecating`) 합니다.

저희는 `kotlin-android-extensions`에서 `Parcelable` 구현 생성기를 추출하고, 나머지 기능인 합성 뷰에 대한 사용 중단(deprecation) 주기를 시작합니다. 현재로서는 사용 중단 경고와 함께 계속 작동할 것입니다. 미래에는 프로젝트를 다른 솔루션으로 전환해야 합니다. 다음은 Android 프로젝트를 합성 뷰에서 뷰 바인딩으로 마이그레이션하는 데 도움이 될 [가이드라인](https://goo.gle/kotlin-android-extensions-deprecation)입니다.

### `Parcelable` 구현 생성기를 위한 새로운 플러그인

`Parcelable` 구현 생성기는 이제 새로운 `kotlin-parcelize` 플러그인에서 사용할 수 있습니다. `kotlin-android-extensions` 대신 이 플러그인을 적용하십시오.

>`kotlin-parcelize`와 `kotlin-android-extensions`는 한 모듈에 함께 적용할 수 없습니다.
>
{style="note"}

`@Parcelize` 어노테이션은 `kotlinx.parcelize` 패키지로 이동되었습니다.

[Android 문서](https://developer.android.com/kotlin/parcelize)에서 `Parcelable` 구현 생성기에 대해 자세히 알아보십시오.