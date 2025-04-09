---
title: "Kotlin 1.4.20의 새로운 기능"
---
_[출시일: 2020년 11월 23일](releases#release-details)_

Kotlin 1.4.20은 여러 가지 새로운 실험적 기능을 제공하며, 1.4.0에 추가된 기능을 포함하여 기존 기능에 대한 수정 및 개선 사항을 제공합니다.

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/11/kotlin-1-4-20-released/)에서 더 많은 예제와 함께 새로운 기능에 대해 알아볼 수도 있습니다.

## Kotlin/JVM

Kotlin/JVM 개선 사항은 최신 Java 버전의 기능을 따라가는 것을 목표로 합니다.

- [Java 15 대상](#java-15-target)
- [`invokedynamic` 문자열 연결](#invokedynamic-string-concatenation)

### Java 15 대상

이제 Java 15를 Kotlin/JVM 대상으로 사용할 수 있습니다.

### invokedynamic 문자열 연결

:::note
`invokedynamic` 문자열 연결은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다 (자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.4.20은 JVM 9+ 대상에서 문자열 연결을 [dynamic invocations](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)으로 컴파일하여 성능을 향상시킬 수 있습니다.

현재 이 기능은 실험적이며 다음 경우를 포함합니다.
- 연산자(`a + b`), 명시적(`a.plus(b)`), 참조(`(a::plus)(b)`) 형식의 `String.plus`.
- 인라인 및 데이터 클래스에 대한 `toString`.
- 단일 비상수 인수가 있는 문자열 템플릿을 제외한 문자열 템플릿 ([KT-42457](https://youtrack.jetbrains.com/issue/KT-42457) 참조).

`invokedynamic` 문자열 연결을 활성화하려면 다음 값 중 하나와 함께 `-Xstring-concat` 컴파일러 옵션을 추가하십시오.
- [StringConcatFactory.makeConcatWithConstants()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)를 사용하여 문자열에 대해 `invokedynamic` 연결을 수행하려면 `indy-with-constants`.
- [StringConcatFactory.makeConcat()](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcat-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-)를 사용하여 문자열에 대해 `invokedynamic` 연결을 수행하려면 `indy`.
- `StringBuilder.append()`를 통해 클래식 연결로 다시 전환하려면 `inline`.

## Kotlin/JS

Kotlin/JS는 빠르게 진화하고 있으며 1.4.20에서는 여러 가지 실험적 기능과 개선 사항을 찾을 수 있습니다.

- [Gradle DSL 변경 사항](#gradle-dsl-changes)
- [새 Wizard 템플릿](#new-wizard-templates)
- [IR 컴파일러를 사용하여 컴파일 오류 무시](#ignoring-compilation-errors-with-ir-compiler)

### Gradle DSL 변경 사항

Kotlin/JS용 Gradle DSL은 프로젝트 설정 및 사용자 정의를 간소화하는 여러 업데이트를 받습니다. 여기에는 webpack 구성 조정, 자동 생성된 `package.json` 파일 수정, 전이 종속성에 대한 향상된 제어가 포함됩니다.

#### webpack 구성을 위한 단일 지점

브라우저 대상에 사용할 수 있는 새로운 구성 블록 `commonWebpackConfig`가 있습니다. 이 블록 내에서 `webpackTask`, `runTask` 및 `testTask`에 대한 구성을 복제하는 대신 단일 지점에서 공통 설정을 조정할 수 있습니다.

세 가지 작업 모두에 대해 기본적으로 CSS 지원을 활성화하려면 프로젝트의 `build.gradle(.kts)`에 다음 스니펫을 추가하십시오.

```groovy
browser {
    commonWebpackConfig {
        cssSupport.enabled = true
    }
    binaries.executable()
}
```

[webpack 번들링 구성](js-project-setup#webpack-bundling)에 대해 자세히 알아보십시오.

#### Gradle에서 package.json 사용자 정의

Kotlin/JS 패키지 관리 및 배포를 더 잘 제어하기 위해 이제 Gradle DSL을 통해 프로젝트 파일 [`package.json`](https://nodejs.dev/learn/the-package-json-guide)에 속성을 추가할 수 있습니다.

`package.json`에 사용자 정의 필드를 추가하려면 컴파일의 `packageJson` 블록에서 `customField` 함수를 사용하십시오.

```kotlin
kotlin {
    js(BOTH) {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

[`package.json` 사용자 정의](js-project-setup#package-json-customization)에 대해 자세히 알아보십시오.

#### 선택적 yarn 종속성 해결

선택적 yarn 종속성 해결 지원은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin 1.4.20은 Yarn의 [선택적 종속성 해결](https://classic.yarnpkg.com/en/docs/selective-version-resolutions/)을 구성하는 방법을 제공합니다. 이는 사용자가 의존하는 패키지의 종속성을 재정의하는 메커니즘입니다.

Gradle의 `YarnPlugin` 내에서 `YarnRootExtension`을 통해 사용할 수 있습니다. 프로젝트에 대한 패키지의 해결된 버전에 영향을 주려면 패키지 이름 선택기 (Yarn에서 지정한 대로)와 해결해야 할 버전을 전달하는 `resolution` 함수를 사용하십시오.

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().apply {
        resolution("react", "16.0.0")
        resolution("processor/decamelize", "3.0.0")
    }
}
```

여기서 `react`가 필요한 _모든_ npm 종속성은 버전 `16.0.0`을 받고 `processor`는 종속성 `decamelize`를 버전 `3.0.0`으로 받습니다.

#### 세분화된 작업 공간 비활성화

세분화된 작업 공간 비활성화는 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

빌드 시간을 단축하기 위해 Kotlin/JS Gradle 플러그인은 특정 Gradle 작업에 필요한 종속성만 설치합니다. 예를 들어 `webpack-dev-server` 패키지는 `*Run` 작업 중 하나를 실행할 때만 설치되고 어셈블 작업을 실행할 때는 설치되지 않습니다. 이러한 동작은 여러 Gradle 프로세스를 병렬로 실행할 때 잠재적으로 문제를 일으킬 수 있습니다. 종속성 요구 사항이 충돌하면 npm 패키지의 두 설치로 인해 오류가 발생할 수 있습니다.

이 문제를 해결하기 위해 Kotlin 1.4.20에는 이러한 소위 _세분화된 작업 공간_을 비활성화하는 옵션이 포함되어 있습니다. 이 기능은 현재 Gradle의 `YarnPlugin` 내에서 `YarnRootExtension`을 통해 사용할 수 있습니다. 사용하려면 `build.gradle.kts` 파일에 다음 스니펫을 추가하십시오.

```kotlin
rootProject.plugins.withType<YarnPlugin> {
    rootProject.the<YarnRootExtension>().disableGranularWorkspaces()
}
```

### 새 Wizard 템플릿

프로젝트를 만드는 동안 프로젝트를 사용자 정의할 수 있는 더 편리한 방법을 제공하기 위해 Kotlin용 프로젝트 마법사는 Kotlin/JS 애플리케이션을 위한 새로운 템플릿과 함께 제공됩니다.
- **Browser Application** - 브라우저에서 실행되는 최소한의 Kotlin/JS Gradle 프로젝트입니다.
- **React Application** - 적절한 `kotlin-wrappers`를 사용하는 React 앱입니다.
    스타일 시트, 탐색 구성 요소 또는 상태 컨테이너에 대한 통합을 활성화하는 옵션을 제공합니다.
- **Node.js Application** - Node.js 런타임에서 실행하기 위한 최소한의 프로젝트입니다. 실험적인 `kotlinx-nodejs` 패키지를 직접 포함하는 옵션과 함께 제공됩니다.

### IR 컴파일러를 사용하여 컴파일 오류 무시

_컴파일 오류 무시_ 모드는 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다 (자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin/JS용 [IR 컴파일러](js-ir-compiler)에는 새로운 실험적 모드인 _오류가 있는 컴파일_이 제공됩니다. 이 모드에서는 전체 애플리케이션이 아직 준비되지 않은 경우 특정 항목을 시도하려는 경우와 같이 오류가 포함되어 있더라도 코드를 실행할 수 있습니다.

이 모드에는 두 가지 허용 정책이 있습니다.
- `SEMANTIC`: 컴파일러는 구문적으로는 올바르지만 의미상으로는 의미가 없는 코드 (예: `val x: String = 3`)를 허용합니다.

- `SYNTAX`: 컴파일러는 구문 오류가 포함되어 있더라도 모든 코드를 허용합니다.

오류가 있는 컴파일을 허용하려면 위에 나열된 값 중 하나와 함께 `-Xerror-tolerance-policy=` 컴파일러 옵션을 추가하십시오.

[Kotlin/JS IR 컴파일러에 대해 자세히 알아보기](js-ir-compiler).

## Kotlin/Native

Kotlin/Native의 1.4.20에서의 우선 순위는 성능과 기존 기능 개선입니다. 주목할 만한 개선 사항은 다음과 같습니다.
  
- [Escape analysis](#escape-analysis)
- [성능 개선 및 버그 수정](#performance-improvements-and-bug-fixes)
- [Objective-C 예외의 옵트인 래핑](#opt-in-wrapping-of-objective-c-exceptions)
- [CocoaPods 플러그인 개선 사항](#cocoapods-plugin-improvements)
- [Xcode 12 라이브러리 지원](#support-for-xcode-12-libraries)

### Escape analysis

Escape analysis 메커니즘은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin/Native는 새로운 [escape analysis](https://en.wikipedia.org/wiki/Escape_analysis) 메커니즘의 프로토타입을 받습니다. 힙 대신 스택에 특정 객체를 할당하여 런타임 성능을 향상시킵니다. 이 메커니즘은 벤치마크에서 평균 10%의 성능 향상을 보여 주며 프로그램을 더욱 가속화할 수 있도록 계속 개선하고 있습니다.

Escape analysis는 릴리스 빌드 (`-opt` 컴파일러 옵션 포함)에 대한 별도의 컴파일 단계에서 실행됩니다.

Escape analysis 단계를 비활성화하려면 `-Xdisable-phases=EscapeAnalysis` 컴파일러 옵션을 사용하십시오.

### 성능 개선 및 버그 수정

Kotlin/Native는 [코드 공유 메커니즘](multiplatform-share-on-platforms#share-code-on-similar-platforms)과 같이 1.4.0에 추가된 것을 포함하여 다양한 구성 요소에서 성능 개선 및 버그 수정을 받습니다.

### Objective-C 예외의 옵트인 래핑

Objective-C 예외 래핑 메커니즘은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다 (자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

Kotlin/Native는 이제 런타임에 Objective-C 코드에서 throw된 예외를 처리하여 프로그램 충돌을 방지할 수 있습니다.

`NSException`을 `ForeignException` 유형의 Kotlin 예외로 래핑하도록 선택할 수 있습니다. 여기에는 원래 `NSException`에 대한 참조가 있습니다. 이를 통해 근본 원인에 대한 정보를 얻고 적절하게 처리할 수 있습니다.

Objective-C 예외 래핑을 활성화하려면 `cinterop` 호출에서 `-Xforeign-exception-mode objc-wrap` 옵션을 지정하거나 `.def` 파일에 `foreignExceptionMode = objc-wrap` 속성을 추가하십시오. [CocoaPods 통합](native-cocoapods)을 사용하는 경우 다음과 같이 종속성의 `pod {}` 빌드 스크립트 블록에서 옵션을 지정하십시오.

```kotlin
pod("foo") {
    extraOpts = listOf("-Xforeign-exception-mode", "objc-wrap")
}
```

기본 동작은 변경되지 않습니다. Objective-C 코드에서 예외가 throw되면 프로그램이 종료됩니다.

### CocoaPods 플러그인 개선 사항

Kotlin 1.4.20은 CocoaPods 통합의 개선 사항 집합을 계속합니다. 즉, 다음과 같은 새로운 기능을 사용해 볼 수 있습니다.

- [향상된 작업 실행](#improved-task-execution)
- [확장된 DSL](#extended-dsl)
- [Xcode와의 업데이트된 통합](#updated-integration-with-xcode)

#### 향상된 작업 실행

CocoaPods 플러그인은 향상된 작업 실행 흐름을 얻습니다. 예를 들어 새로운 CocoaPods 종속성을 추가하면 기존 종속성은 다시 빌드되지 않습니다. 추가 대상을 추가해도 기존 대상에 대한 종속성을 다시 빌드하는 데 영향을 미치지 않습니다.

#### 확장된 DSL

Kotlin 프로젝트에 [CocoaPods](native-cocoapods) 종속성을 추가하는 DSL은 새로운 기능을 받습니다.

로컬 Pod 및 CocoaPods 저장소의 Pod 외에도 다음 유형의 라이브러리에 대한 종속성을 추가할 수 있습니다.
* 사용자 정의 spec 저장소의 라이브러리.
* Git 저장소의 원격 라이브러리.
* 아카이브의 라이브러리 (임의의 HTTP 주소를 통해서도 사용 가능).
* 정적 라이브러리.
* 사용자 정의 cinterop 옵션이 있는 라이브러리.

Kotlin 프로젝트에서 [CocoaPods 종속성 추가](native-cocoapods-libraries)에 대해 자세히 알아보십시오. [Kotlin with CocoaPods 샘플](https://github.com/Kotlin/kmm-with-cocoapods-sample)에서 예제를 찾으십시오.

#### Xcode와의 업데이트된 통합

Xcode와 올바르게 작동하려면 Kotlin은 몇 가지 Podfile 변경이 필요합니다.

* Kotlin Pod에 Git, HTTP 또는 specRepo Pod 종속성이 있는 경우 Podfile에도 지정해야 합니다.
* 사용자 정의 spec에서 라이브러리를 추가하는 경우 Podfile 시작 부분에 spec의 [위치](https://guides.cocoapods.org/syntax/podfile.html#source)도 지정해야 합니다.

이제 통합 오류에 IDEA에 자세한 설명이 있습니다. 따라서 Podfile에 문제가 있는 경우 즉시 수정 방법을 알 수 있습니다.

[Kotlin pod 만들기](native-cocoapods-xcode)에 대해 자세히 알아보십시오.

### Xcode 12 라이브러리 지원
    
Xcode 12와 함께 제공되는 새로운 라이브러리에 대한 지원이 추가되었습니다. 이제 Kotlin 코드에서 사용할 수 있습니다.

## Kotlin Multiplatform

### 멀티플랫폼 라이브러리 게시의 업데이트된 구조

Kotlin 1.4.20부터는 더 이상 별도의 메타데이터 게시가 없습니다. 메타데이터 아티팩트는 이제 전체 라이브러리를 나타내고 공통 소스 세트에 종속성으로 추가될 때 적절한 플랫폼별 아티팩트로 자동 해결되는 _루트_ 게시물에 포함됩니다.

[멀티플랫폼 라이브러리 게시](multiplatform-publish-lib)에 대해 자세히 알아보십시오.

#### 이전 버전과의 호환성

이 구조 변경은 [계층적 프로젝트 구조](multiplatform-share-on-platforms#share-code-on-similar-platforms)가 있는 프로젝트 간의 호환성을 손상시킵니다. 멀티플랫폼 프로젝트와 종속된 라이브러리가 모두 계층적 프로젝트 구조를 가지고 있는 경우 Kotlin 1.4.20 이상으로 동시에 업데이트해야 합니다. Kotlin 1.4.20으로 게시된 라이브러리는 이전 버전으로 게시된 프로젝트에서 사용할 수 없습니다.

계층적 프로젝트 구조가 없는 프로젝트 및 라이브러리는 호환성을 유지합니다.

## 표준 라이브러리

Kotlin 1.4.20의 표준 라이브러리는 파일 작업에 대한 새로운 확장 기능과 더 나은 성능을 제공합니다.

- [java.nio.file.Path 확장](#extensions-for-java-nio-file-path)
- [향상된 String.replace 함수 성능](#improved-string-replace-function-performance)

### java.nio.file.Path 확장

`java.nio.file.Path`에 대한 확장은 [Experimental](components-stability)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 옵트인이 필요합니다 (자세한 내용은 아래 참조). 평가 목적으로만 사용하십시오. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에서 이에 대한 피드백을 보내주시면 감사하겠습니다.

이제 표준 라이브러리는 `java.nio.file.Path`에 대한 실험적 확장을 제공합니다. 관용적인 Kotlin 방식으로 최신 JVM 파일 API를 사용하는 것은 이제 `kotlin.io` 패키지의 `java.io.File` 확장 기능을 사용하는 것과 유사합니다.

```kotlin
// div (/) 연산자로 경로 구성
val baseDir = Path("/base")
val subDir = baseDir / "subdirectory" 

// 디렉터리의 파일 나열
val kotlinFiles: List<Path> = Path("/home/user").listDirectoryEntries("*.kt")
```

확장은 `kotlin-stdlib-jdk7` 모듈의 `kotlin.io.path` 패키지에서 사용할 수 있습니다. 확장을 사용하려면 실험적 주석 `@ExperimentalPathApi`에 [옵트인](opt-in-requirements)하십시오.

### 향상된 String.replace 함수 성능

`String.replace()`의 새로운 구현은 함수 실행 속도를 높입니다. 대소문자를 구분하는 변형은 `indexOf`를 기반으로 하는 수동 교체 루프를 사용하는 반면 대소문자를 구분하지 않는 변형은 정규식 일치를 사용합니다.

## Kotlin Android Extensions

1.4.20에서 Kotlin Android Extensions 플러그인은 더 이상 사용되지 않으며 `Parcelable` 구현 생성기가 별도의 플러그인으로 이동합니다.

- [합성 뷰의 더 이상 사용되지 않음](#deprecation-of-synthetic-views)
- [Parcelable 구현 생성기를 위한 새 플러그인](#new-plugin-for-parcelable-implementation-generator)

### 합성 뷰의 더 이상 사용되지 않음

_합성 뷰_는 UI 요소와의 상호 작용을 단순화하고 상용구를 줄이기 위해 한동안 Kotlin Android Extensions 플러그인에 제공되었습니다. 이제 Google은 동일한 작업을 수행하는 기본 메커니즘인 Android Jetpack의 [뷰 바인딩](https://developer.android.com/topic/libraries/view-binding)을 제공하며 이를 위해 합성 뷰를 더 이상 사용하지 않습니다.

`kotlin-android-extensions`에서 Parcelable 구현 생성기를 추출하고 나머지 부분 (합성 뷰)에 대한 더 이상 사용되지 않는 주기를 시작합니다. 현재는 더 이상 사용되지 않는 경고와 함께 계속 작동합니다. 앞으로는 프로젝트를 다른 솔루션으로 전환해야 합니다. [지침](https://goo.gle/kotlin-android-extensions-deprecation)은 합성에서 뷰 바인딩으로 Android 프로젝트를 마이그레이션하는 데 도움이 됩니다.

### Parcelable 구현 생성기를 위한 새 플러그인

`Parcelable` 구현 생성기는 이제 새로운 `kotlin-parcelize` 플러그인에서 사용할 수 있습니다. `kotlin-android-extensions` 대신 이 플러그인을 적용하십시오.

`kotlin-parcelize`와 `kotlin-android-extensions`는 하나의 모듈에서 함께 적용할 수 없습니다.

:::

`@Parcelize` 주석은 `kotlinx.parcelize` 패키지로 이동됩니다.

[Android 문서](https://developer.android.com/kotlin/parcelize)에서 `Parcelable` 구현 생성기에 대해 자세히 알아보십시오.