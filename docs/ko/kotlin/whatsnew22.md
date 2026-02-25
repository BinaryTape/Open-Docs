[//]: # (title: Kotlin 2.2.0의 새로운 기능)

<web-summary>새로운 언어 기능, Kotlin Multiplatform, JVM, Native, JS, Wasm 관련 업데이트, 그리고 Gradle 및 Maven 빌드 도구 지원을 포함한 Kotlin 2.2.0 릴리스 노트를 읽어보세요.</web-summary>

_[출시일: 2025년 6월 23일](releases.md#release-history)_

Kotlin 2.2.0이 출시되었습니다! 주요 하이라이트는 다음과 같습니다:

* **언어**: [컨텍스트 파라미터(context parameters)](#preview-of-context-parameters) 프리뷰를 포함한 새로운 언어 기능들이 추가되었습니다. 
  가드 조건(guard conditions), 비로컬(non-local) break 및 continue, 멀티 달러 보간법(multi-dollar interpolation) 등 [이전에 실험적이었던 여러 기능이 이제 안정화(Stable)되었습니다](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation).
* **Kotlin 컴파일러**: [컴파일러 경고의 통합 관리](#kotlin-compiler-unified-management-of-compiler-warnings).
* **Kotlin/JVM**: [인터페이스 함수의 기본 메서드(default method) 생성 방식 변경](#changes-to-default-method-generation-for-interface-functions).
* **Kotlin/Native**: [LLVM 19 적용 및 메모리 소비 추적 및 조정을 위한 새로운 기능](#kotlin-native).
* **Kotlin/Wasm**: [Wasm 타겟 분리](#build-infrastructure-for-wasm-target-separated-from-javascript-target) 및 [프로젝트별 Binaryen 구성](#per-project-binaryen-configuration) 기능.
* **Kotlin/JS**: [`@JsPlainObject` 인터페이스에 대해 생성된 `copy()` 메서드 수정](#fix-for-copy-in-jsplainobject-interfaces).
* **Gradle**: [Kotlin Gradle 플러그인에 바이너리 호환성 검증 포함](#binary-compatibility-validation-included-in-kotlin-gradle-plugin).
* **표준 라이브러리**: [Base64 및 HexFormat API 안정화](#stable-base64-encoding-and-decoding).
* **문서**: [문서 설문조사](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)가 진행 중이며, [Kotlin 문서에 주목할 만한 개선 사항](#documentation-updates)이 반영되었습니다.

Kotlin 언어 진화(Language Evolution) 팀이 새로운 기능에 대해 토론하고 질문에 답변하는 아래 영상을 시청하실 수 있습니다:

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="What's new in Kotlin 2.2.0"/>

> Kotlin 출시 주기에 대한 정보는 [Kotlin 출시 프로세스](releases.md)를 참조하세요.
>
{style="tip"}

## IDE 지원

Kotlin 2.2.0을 지원하는 Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio 최신 버전에 포함되어 있습니다.
IDE에서 Kotlin 플러그인을 별도로 업데이트할 필요는 없습니다.
빌드 스크립트에서 [Kotlin 버전만 2.2.0으로 변경](configure-build-for-eap.md#adjust-the-kotlin-version)하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

이번 릴리스에서는 가드 조건(guard conditions), 비로컬 `break` 및 `continue`, 멀티 달러 보간법이 [안정화(Stable)](components-stability.md#stability-levels-explained) 단계로 [격상](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)되었습니다.
또한, [컨텍스트 파라미터](#preview-of-context-parameters) 및 [컨텍스트 민감형 해석(context-sensitive resolution)](#preview-of-context-sensitive-resolution)과 같은 몇 가지 기능이 프리뷰로 도입되었습니다.

### 컨텍스트 파라미터 프리뷰
<primary-label ref="experimental-general"/> 

컨텍스트 파라미터(context parameters)를 사용하면 함수와 프로퍼티가 주변 컨텍스트에서 암시적으로 사용 가능한 의존성을 선언할 수 있습니다.

컨텍스트 파라미터를 사용하면 여러 함수 호출에 걸쳐 공유되고 거의 변경되지 않는 서비스나 의존성 같은 값들을 수동으로 전달할 필요가 없습니다.

컨텍스트 파라미터는 이전의 실험적 기능인 컨텍스트 리시버(context receivers)를 대체합니다. 컨텍스트 리시버에서 컨텍스트 파라미터로 마이그레이션하려면 [블로그 포스트](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)에 설명된 대로 IntelliJ IDEA의 지원 기능을 사용할 수 있습니다.

가장 큰 차이점은 컨텍스트 파라미터가 함수의 본문에서 리시버(receiver)로 도입되지 않는다는 것입니다. 따라서 컨텍스트가 암시적으로 사용 가능했던 컨텍스트 리시버와 달리, 컨텍스트 파라미터의 멤버에 액세스하려면 해당 파라미터의 이름을 사용해야 합니다.

Kotlin의 컨텍스트 파라미터는 단순화된 의존성 주입(DI), 개선된 DSL 설계, 스코프 기반 연산을 통해 의존성 관리를 크게 개선합니다. 자세한 내용은 해당 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)을 참조하세요.

#### 컨텍스트 파라미터 선언 방법

프로퍼티와 함수에 대한 컨텍스트 파라미터는 `context` 키워드 뒤에 `name: Type` 형식의 파라미터 목록을 사용하여 선언할 수 있습니다. 다음은 `UserService` 인터페이스에 대한 의존성을 사용하는 예시입니다:

```kotlin
// UserService는 컨텍스트에 필요한 의존성을 정의합니다
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 컨텍스트 파라미터가 있는 함수를 선언합니다
context(users: UserService)
fun outputMessage(message: String) {
    // 컨텍스트의 users를 사용하여 로그를 남깁니다
    users.log("Log: $message")
}

// 컨텍스트 파라미터가 있는 프로퍼티를 선언합니다
context(users: UserService)
val firstUser: String
    // 컨텍스트의 users를 사용하여 findUserById를 호출합니다    
    get() = users.findUserById(1)
```

컨텍스트 파라미터 이름으로 `_`를 사용할 수 있습니다. 이 경우 파라미터의 값은 해석(resolution)에는 사용될 수 있지만, 블록 내부에서 이름으로 액세스할 수는 없습니다:

```kotlin
// 컨텍스트 파라미터 이름으로 "_" 사용
context(_: UserService)
fun logWelcome() {
    // UserService에서 적절한 log 함수를 찾습니다
    outputMessage("Welcome!")
}
```

#### 컨텍스트 파라미터 활성화 방법

프로젝트에서 컨텍스트 파라미터를 활성화하려면 커맨드 라인에서 다음 컴파일러 옵션을 사용하세요:

```Bash
-Xcontext-parameters
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-parameters")
    }
}
```

> `-Xcontext-receivers`와 `-Xcontext-parameters` 컴파일러 옵션을 동시에 지정하면 오류가 발생합니다.
>
{style="warning"}

#### 의견 공유

이 기능은 향후 Kotlin 릴리스에서 안정화되고 개선될 예정입니다. 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes)을 통해 의견을 보내주시면 감사하겠습니다.

### 컨텍스트 민감형 해석 프리뷰
<primary-label ref="experimental-general"/> 

Kotlin 2.2.0은 컨텍스트 민감형 해석(context-sensitive resolution)의 구현체를 프리뷰로 도입했습니다.

이 기능에 대한 개요는 아래 영상에서 확인하실 수 있습니다:

<video src="https://www.youtube.com/v/aF8RYQrJI8Q" title="Context-sensitive resolution in Kotlin 2.2.0"/>

이전에는 컨텍스트에서 타입을 유추할 수 있는 경우에도 열거형(enum) 항목이나 봉인된 클래스(sealed class) 멤버의 전체 이름을 작성해야 했습니다.
예를 들어:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

fun message(problem: Problem): String = when (problem) {
    Problem.CONNECTION -> "connection"
    Problem.AUTHENTICATION -> "authentication"
    Problem.DATABASE -> "database"
    Problem.UNKNOWN -> "unknown"
}
```

이제 컨텍스트 민감형 해석을 사용하면 예상되는 타입을 알 수 있는 컨텍스트에서 타입 이름을 생략할 수 있습니다:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 알려진 problem 타입에 따라 열거형 항목을 해석합니다
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

컴파일러는 이러한 문맥상의 타입 정보를 사용하여 올바른 멤버를 해석합니다. 이 정보에는 다음이 포함됩니다:

* `when` 표현식의 대상(subject)
* 명시적 반환 타입
* 선언된 변수 타입
* 타입 검사(`is`) 및 캐스트(`as`)
* 알려진 봉인된 클래스 계층 구조
* 선언된 파라미터 타입

> 컨텍스트 민감형 해석은 함수, 파라미터가 있는 프로퍼티 또는 리시버가 있는 확장 프로퍼티에는 적용되지 않습니다.
>
{style="note"}

프로젝트에서 컨텍스트 민감형 해석을 사용해 보려면 커맨드 라인에서 다음 컴파일러 옵션을 사용하세요:

```bash
-Xcontext-sensitive-resolution
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xcontext-sensitive-resolution")
    }
}
```

이 기능은 향후 Kotlin 릴리스에서 안정화되고 개선될 예정이며, 이슈 트래커인 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution)을 통해 피드백을 기다리고 있습니다.

### 어노테이션 사용 지점 대상을 위한 기능 프리뷰
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 어노테이션 사용 지점 대상(annotation use-site targets) 작업을 더욱 편리하게 만드는 몇 가지 기능을 도입했습니다.

#### 프로퍼티를 위한 `@all` 메타 타겟
<primary-label ref="experimental-general"/>

Kotlin에서는 선언의 특정 부분에 어노테이션을 붙일 수 있으며, 이를 [사용 지점 대상(use-site targets)](annotations.md#annotation-use-site-targets)이라고 합니다.
그러나 각 대상을 개별적으로 어노테이션하는 것은 복잡하고 실수하기 쉬웠습니다:

```kotlin
data class User(
    val username: String,

    @param:Email      // 생성자 파라미터
    @field:Email      // 백킹 필드
    @get:Email        // 게터 메서드
    @property:Email   // Kotlin 프로퍼티 참조
    val email: String,
) {
    @field:Email
    @get:Email
    @property:Email
    val secondaryEmail: String? = null
}
```

이를 단순화하기 위해 Kotlin은 프로퍼티를 위한 새로운 `@all` 메타 타겟을 도입했습니다.
이 기능은 컴파일러가 프로퍼티의 모든 관련 부분에 어노테이션을 적용하도록 지시합니다. `@all`을 사용하면 다음 대상에 어노테이션 적용을 시도합니다:

* **`param`**: 주 생성자에 선언된 경우의 생성자 파라미터.

* **`property`**: Kotlin 프로퍼티 자체.

* **`field`**: 백킹 필드(존재하는 경우).

* **`get`**: 게터 메서드.

* **`setparam`**: 프로퍼티가 `var`로 정의된 경우 세터 메서드의 파라미터.

* **`RECORD_COMPONENT`**: 클래스가 `@JvmRecord`인 경우, 어노테이션은 [Java 레코드 컴포넌트](#improved-support-for-annotating-jvm-records)에 적용됩니다. 이 동작은 Java가 레코드 컴포넌트의 어노테이션을 처리하는 방식을 모방합니다.

컴파일러는 주어진 프로퍼티에 대해 유효한 대상에만 어노테이션을 적용합니다.

아래 예시에서 `@Email` 어노테이션은 각 프로퍼티의 모든 관련 대상에 적용됩니다:

```kotlin
data class User(
    val username: String,

    // param, property, field, get, 
    // 그리고 setparam(var인 경우)에 @Email 적용
    @all:Email val email: String,
) {
    // property, field, get에 @Email 적용
    // (생성자에 없으므로 param은 제외)
    @all:Email val secondaryEmail: String? = null
}
```

주 생성자 내부와 외부의 모든 프로퍼티에 `@all` 메타 타겟을 사용할 수 있습니다. 그러나 [여러 어노테이션](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation)과 함께 `@all` 메타 타겟을 사용할 수는 없습니다.

이 새로운 기능은 구문을 단순화하고 일관성을 보장하며 Java 레코드와의 상호 운용성을 개선합니다.

프로젝트에서 `@all` 메타 타겟을 활성화하려면 커맨드 라인에서 다음 컴파일러 옵션을 사용하세요:

```Bash
-Xannotation-target-all
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-target-all")
    }
}
```

이 기능은 프리뷰 단계입니다. 발생하는 문제는 이슈 트래커인 [YouTrack](https://kotl.in/issue)에 보고해 주세요.
`@all` 메타 타겟에 대한 자세한 정보는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 제안서를 읽어보세요.

#### 사용 지점 어노테이션 대상을 위한 새로운 기본값 규칙
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 파라미터, 필드 및 프로퍼티로 어노테이션을 전파하기 위한 새로운 기본값 규칙을 도입했습니다. 
이전에는 어노테이션이 기본적으로 `param`, `property`, `field` 중 하나에만 적용되었으나, 이제는 어노테이션에서 기대되는 방식에 더 가깝게 기본값이 설정됩니다.

적용 가능한 대상이 여러 개인 경우 다음과 같이 하나 이상의 대상이 선택됩니다:

* 생성자 파라미터 대상(`param`)이 적용 가능하면 사용됩니다.
* 프로퍼티 대상(`property`)이 적용 가능하면 사용됩니다.
* 필드 대상(`field`)은 적용 가능하고 `property`가 적용 가능하지 않을 때 사용됩니다.

대상이 여러 개인데 `param`, `property`, `field` 중 어느 것도 적용 가능하지 않으면 어노테이션은 오류를 발생시킵니다.

이 기능을 활성화하려면 Gradle 빌드 파일의 `compilerOptions {}` 블록에 다음을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

또는 컴파일러의 커맨드 라인 인수를 사용하세요:

```Bash
-Xannotation-default-target=param-property
```

이전 동작을 사용하고 싶을 때는 언제든지 다음과 같이 할 수 있습니다:

* 특정 사례의 경우, `@Annotation` 대신 `@param:Annotation`과 같이 필요한 대상을 명시적으로 정의합니다.
* 프로젝트 전체의 경우, Gradle 빌드 파일에서 이 플래그를 사용합니다:

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

이 기능은 프리뷰 단계입니다. 발생하는 문제는 이슈 트래커인 [YouTrack](https://kotl.in/issue)에 보고해 주세요.
어노테이션 사용 지점 대상을 위한 새로운 기본값 규칙에 대한 자세한 정보는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 제안서를 읽어보세요.

### 중첩된 타입 별칭 지원
<primary-label ref="beta"/>

Kotlin 2.2.0은 다른 선언 내부에 타입 별칭(type alias)을 정의하는 기능에 대한 지원을 추가했습니다.

이 기능에 대한 개요는 아래 영상에서 확인하실 수 있습니다:

<video src="https://www.youtube.com/v/1W6d45IOwWk" title="Nested type aliases in Kotlin 2.2.0"/>

이전에는 [타입 별칭](type-aliases.md)을 Kotlin 파일의 최상위 레벨에서만 선언할 수 있었습니다. 즉, 내부적으로만 사용되거나 도메인 특화된 타입 별칭일지라도 해당 타입 별칭이 사용되는 클래스 외부로 나가야 했습니다.

2.2.0부터는 외부 클래스의 타입 파라미터를 캡처하지 않는 한 다른 선언 내부에 타입 별칭을 정의할 수 있습니다:

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

중첩된 타입 별칭에는 타입 파라미터를 언급할 수 없는 등 몇 가지 추가적인 제약 사항이 있습니다. 전체 규칙 목록은 [문서](type-aliases.md#nested-type-aliases)를 확인하세요.

중첩된 타입 별칭은 캡슐화를 개선하고 패키지 수준의 복잡함을 줄이며 내부 구현을 단순화하여 더 깨끗하고 유지 관리하기 쉬운 코드를 작성할 수 있게 해줍니다.

#### 중첩된 타입 별칭 활성화 방법

프로젝트에서 중첩된 타입 별칭을 활성화하려면 커맨드 라인에서 다음 컴파일러 옵션을 사용하세요:

```bash
-Xnested-type-aliases
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xnested-type-aliases")
    }
}
```

#### 의견 공유

중첩된 타입 별칭은 현재 [Beta](components-stability.md#stability-levels-explained) 단계입니다. 발생하는 문제는 이슈 트래커인 [YouTrack](https://kotl.in/issue)에 보고해 주세요. 이 기능에 대한 자세한 정보는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 제안서를 읽어보세요.

### 안정화된 기능: 가드 조건, 비로컬 `break` 및 `continue`, 멀티 달러 보간법

Kotlin 2.1.0에서는 몇 가지 새로운 언어 기능이 프리뷰로 도입되었습니다.
이번 릴리스에서 다음 언어 기능이 [안정화(Stable)](components-stability.md#stability-levels-explained)되었음을 알려드립니다:

* [대상이 있는 `when`에서의 가드 조건(Guard conditions)](control-flow.md#guard-conditions-in-when-expressions)
* [비로컬(Non-local) `break` 및 `continue`](inline-functions.md#break-and-continue)
* [멀티 달러($) 보간법: 문자열 리터럴에서의 개선된 처리](strings.md#multi-dollar-string-interpolation)

[전체 Kotlin 언어 설계 기능 및 제안 목록 보기](kotlin-language-features-and-proposals.md).

## Kotlin 컴파일러: 컴파일러 경고의 통합 관리
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 새로운 컴파일러 옵션인 `-Xwarning-level`을 도입했습니다. 이는 Kotlin 프로젝트에서 컴파일러 경고를 관리하는 통합된 방식을 제공하기 위해 설계되었습니다.

이전에는 `-nowarn`으로 모든 경고를 비활성화하거나, `-Werror`로 모든 경고를 컴파일 오류로 전환하거나, `-Wextra`로 추가 컴파일러 검사를 활성화하는 등 모듈 전체에 적용되는 일반적인 규칙만 적용할 수 있었습니다. 특정 경고에 대해 이를 조정하는 유일한 옵션은 `-Xsuppress-warning` 옵션이었습니다.

새로운 솔루션을 사용하면 일반적인 규칙을 재정의하고 일관된 방식으로 특정 진단을 제외할 수 있습니다.

### 적용 방법

새로운 컴파일러 옵션의 구문은 다음과 같습니다:

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 지정된 경고를 오류로 격상시킵니다.
* `warning`: 경고를 표시하며 기본적으로 활성화되어 있습니다.
* `disabled`: 지정된 경고를 모듈 전체에서 완전히 억제합니다.

새로운 컴파일러 옵션으로는 오직 _경고(warnings)_의 심각도 수준만 구성할 수 있다는 점에 유의하세요.

### 사용 사례

새로운 솔루션을 사용하면 일반 규칙과 특정 규칙을 결합하여 프로젝트의 경고 보고를 더 세밀하게 조정할 수 있습니다. 사용 사례를 선택하세요:

#### 경고 억제

| 명령어                                             | 설명                                                   |
|---------------------------------------------------|--------------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | 컴파일 중 모든 경고를 억제합니다.                          |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 지정된 경고만 억제합니다.                                 |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 지정된 경고를 제외한 모든 경고를 억제합니다.                  |

#### 경고를 오류로 격상

| 명령어                                             | 설명                                                         |
|---------------------------------------------------|--------------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | 모든 경고를 컴파일 오류로 격상시킵니다.                         |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 지정된 경고만 오류로 격상시킵니다.                             |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 지정된 경고를 제외한 모든 경고를 오류로 격상시킵니다.           |

#### 추가 컴파일러 경고 활성화

| 명령어                                             | 설명                                                                                                 |
|----------------------------------------------------|------------------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | 참일 경우 경고를 발생시키는 모든 추가 선언, 표현식 및 타입 컴파일러 검사를 활성화합니다. |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | 지정된 추가 컴파일러 검사만 활성화합니다.                                                   |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 지정된 검사를 제외한 모든 추가 검사를 활성화합니다.                                         |

#### 경고 목록

일반 규칙에서 제외하고 싶은 경고가 많다면, [`@argfile`](compiler-reference.md#argfile)을 통해 별도의 파일에 나열할 수 있습니다.

### 의견 공유

이 새로운 컴파일러 옵션은 아직 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 발생하는 문제는 이슈 트래커인 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

## Kotlin/JVM

Kotlin 2.2.0은 JVM에 많은 업데이트를 가져왔습니다. 컴파일러는 이제 Java 24 바이트코드를 지원하며 인터페이스 함수의 기본 메서드 생성 방식에 변경 사항을 도입했습니다. 또한 이번 릴리스는 Kotlin 메타데이터의 어노테이션 작업을 단순화하고, 인라인 값 클래스를 사용한 Java 상호 운용성을 개선하며, JVM 레코드 어노테이션에 대한 더 나은 지원을 포함합니다.

### 인터페이스 함수의 기본 메서드 생성 방식 변경

Kotlin 2.2.0부터 별도로 구성하지 않는 한 인터페이스에 선언된 함수는 JVM 기본 메서드(default methods)로 컴파일됩니다. 이 변경 사항은 구현이 있는 Kotlin 인터페이스 함수가 바이트코드로 컴파일되는 방식에 영향을 미칩니다.

이 동작은 기존의 `-Xjvm-default` 옵션을 대체하는 새로운 안정적인 컴파일러 옵션인 `-jvm-default`에 의해 제어됩니다.

`-jvm-default` 옵션의 동작은 다음 값들을 사용하여 제어할 수 있습니다:

* `enable` (기본값): 인터페이스에 기본 구현을 생성하고 서브클래스 및 `DefaultImpls` 클래스에 브리지 함수를 포함합니다. 이전 Kotlin 버전과의 바이너리 호환성을 유지하려면 이 모드를 사용하세요.
* `no-compatibility`: 인터페이스에 기본 구현만 생성합니다. 이 모드는 호환성 브리지와 `DefaultImpls` 클래스를 건너뛰므로 새로운 코드에 적합합니다.
* `disable`: 인터페이스의 기본 구현을 비활성화합니다. 브리지 함수와 `DefaultImpls` 클래스만 생성되며, 이는 Kotlin 2.2.0 이전의 동작과 일치합니다.

`-jvm-default` 컴파일러 옵션을 구성하려면 Gradle Kotlin DSL에서 `jvmDefault` 프로퍼티를 설정하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### Kotlin 메타데이터의 어노테이션 읽기 및 쓰기 지원
<primary-label ref="experimental-general"/>

이전에는 리플렉션이나 바이트코드 분석을 사용하여 컴파일된 JVM 클래스 파일에서 어노테이션을 읽고, 시그니처를 기반으로 메타데이터 항목과 수동으로 일치시켜야 했습니다. 이 프로세스는 특히 오버로드된 함수의 경우 오류가 발생하기 쉬웠습니다.

이제 Kotlin 2.2.0에서는 [](metadata-jvm.md) 라이브러리가 Kotlin 메타데이터에 저장된 어노테이션 읽기 지원을 도입합니다.

컴파일된 파일의 메타데이터에서 어노테이션을 사용할 수 있게 하려면 다음 컴파일러 옵션을 추가하세요:

```kotlin
-Xannotations-in-metadata
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

이 옵션을 활성화하면 Kotlin 컴파일러가 JVM 바이트코드와 함께 어노테이션을 메타데이터에 기록하여 `kotlin-metadata-jvm` 라이브러리에서 접근할 수 있게 합니다.

라이브러리는 어노테이션 접근을 위해 다음과 같은 API를 제공합니다:

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

이러한 API는 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 사용하려면 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 어노테이션을 사용하세요.

다음은 Kotlin 메타데이터에서 어노테이션을 읽는 예시입니다:

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> 프로젝트에서 `kotlin-metadata-jvm` 라이브러리를 사용한다면, 어노테이션을 지원하도록 코드를 테스트하고 업데이트하는 것이 좋습니다. 그렇지 않으면 향후 Kotlin 버전에서 메타데이터의 어노테이션이 [기본적으로 활성화](https://youtrack.jetbrains.com/issue/KT-75736)될 때, 프로젝트에서 유효하지 않거나 불완전한 메타데이터가 생성될 수 있습니다.
>
> 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-31857)에 보고해 주세요.
>
{style="warning"}

### 인라인 값 클래스를 사용한 Java 상호 운용성 개선
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 새로운 실험적 어노테이션인 [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)를 도입했습니다. 이 어노테이션은 Java에서 [인라인 값 클래스(inline value classes)](inline-classes.md)를 더 쉽게 사용할 수 있게 해줍니다.

이 기능에 대한 개요는 아래 영상에서 확인하실 수 있습니다:

<video src="https://www.youtube.com/v/KSvq7jHr1lo" title="Exposed inline value classes for Java in Kotlin 2.2.0"/>

기본적으로 Kotlin은 인라인 값 클래스를 성능은 더 좋지만 Java에서 사용하기 어렵거나 불가능한 **언박싱된 표현(unboxed representations)**을 사용하도록 컴파일합니다. 예를 들어:

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

이 경우 클래스가 언박싱되어 있으므로 Java에서 호출할 수 있는 생성자가 없습니다. 또한 Java가 `number`가 양수인지 확인하기 위해 `init` 블록을 트리거할 방법도 없습니다.

클래스에 `@JvmExposeBoxed`를 어노테이션하면, Kotlin은 Java에서 직접 호출할 수 있는 퍼블릭 생성자를 생성하여 `init` 블록이 실행되도록 보장합니다.

`@JvmExposeBoxed` 어노테이션을 클래스, 생성자 또는 함수 레벨에 적용하여 Java에 노출되는 대상을 세밀하게 제어할 수 있습니다.

예를 들어, 다음 코드에서 확장 함수 `.timesTwoBoxed()`는 Java에서 접근할 수 **없습니다**:

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

Java 코드에서 `MyInt` 클래스의 인스턴스를 생성하고 `.timesTwoBoxed()` 함수를 호출할 수 있게 하려면, 클래스와 함수 모두에 `@JvmExposeBoxed` 어노테이션을 추가하세요:

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

이러한 어노테이션을 통해 Kotlin 컴파일러는 `MyInt` 클래스에 대해 Java에서 접근 가능한 생성자를 생성합니다. 또한 값 클래스의 박싱된 형태를 사용하는 확장 함수에 대한 오버로드도 생성합니다. 결과적으로 다음과 같은 Java 코드가 성공적으로 실행됩니다:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

노출하려는 인라인 값 클래스의 모든 부분에 어노테이션을 붙이고 싶지 않다면, 모듈 전체에 어노테이션을 효과적으로 적용할 수 있습니다. 모듈에 이 동작을 적용하려면 `-Xjvm-expose-boxed` 옵션으로 컴파일하세요. 이 옵션으로 컴파일하는 것은 모듈의 모든 선언에 `@JvmExposeBoxed` 어노테이션이 있는 것과 동일한 효과를 냅니다.

이 새로운 어노테이션은 Kotlin이 내부적으로 값 클래스를 컴파일하거나 사용하는 방식을 변경하지 않으며, 기존의 모든 컴파일된 코드는 유효하게 유지됩니다. 단순히 Java 상호 운용성을 개선하기 위한 새로운 기능을 추가하는 것뿐입니다. 값 클래스를 사용하는 Kotlin 코드의 성능에는 영향을 미치지 않습니다.

`@JvmExposeBoxed` 어노테이션은 멤버 함수의 박싱된 변형을 노출하고 박싱된 반환 타입을 받으려는 라이브러리 제작자에게 유용합니다. 인라인 값 클래스(효율적이지만 Kotlin 전용)와 데이터 클래스(Java와 호환되지만 항상 박싱됨) 사이에서 고민할 필요가 없게 해줍니다.

`@JvmExposedBoxed` 어노테이션의 작동 방식과 해결하는 문제에 대한 자세한 설명은 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 제안서를 참조하세요.

### JVM 레코드 어노테이션 지원 개선

Kotlin은 Kotlin 1.5.0부터 [JVM 레코드(JVM records)](jvm-records.md)를 지원해 왔습니다. 이제 Kotlin 2.2.0은 특히 Java의 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 타겟과 관련하여 레코드 컴포넌트의 어노테이션 처리 방식을 개선했습니다.

첫째, `RECORD_COMPONENT`를 어노테이션 타겟으로 사용하려면 Kotlin(`@Target`)과 Java에 대한 어노테이션을 수동으로 추가해야 합니다. 이는 Kotlin의 `@Target` 어노테이션이 `RECORD_COMPONENT`를 지원하지 않기 때문입니다. 예를 들어:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

두 목록을 수동으로 유지하는 것은 실수하기 쉬우므로, Kotlin 2.2.0은 Kotlin과 Java 타겟이 일치하지 않을 경우 컴파일러 경고를 도입합니다. 예를 들어, Java 타겟 목록에서 `ElementType.CLASS`를 생략하면 컴파일러는 다음과 같이 보고합니다:

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

둘째, 레코드에서 어노테이션을 전파할 때 Kotlin의 동작은 Java와 다릅니다. Java에서는 레코드 컴포넌트의 어노테이션이 백킹 필드, 게터 및 생성자 파라미터에 자동으로 적용됩니다. Kotlin은 기본적으로 이를 수행하지 않지만, 이제 [`@all:` 사용 지점 대상](#all-meta-target-for-properties)을 사용하여 이 동작을 복제할 수 있습니다.

예를 들어:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord`를 `@all:`과 함께 사용하면 이제 Kotlin은:

* 어노테이션을 프로퍼티, 백킹 필, 생성자 파라미터 및 게터로 전파합니다.
* 어노테이션이 Java의 `RECORD_COMPONENT`를 지원하는 경우, 어노테이션을 레코드 컴포넌트에도 적용합니다.

## Kotlin/Native

2.2.0부터 Kotlin/Native는 LLVM 19를 사용합니다. 이번 릴리스에서는 메모리 소비를 추적하고 조정하도록 설계된 몇 가지 실험적 기능도 제공됩니다.

### 객체별 메모리 할당
<primary-label ref="experimental-opt-in"/>

Kotlin/Native의 [메모리 할당자(memory allocator)](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)는 이제 객체별로 메모리를 예약할 수 있습니다. 어떤 경우에는 이것이 엄격한 메모리 제한을 충족하거나 애플리케이션 시작 시 메모리 소비를 줄이는 데 도움이 될 수 있습니다.

이 새로운 기능은 기본 할당자 대신 시스템 메모리 할당자를 활성화했던 `-Xallocator=std` 컴파일러 옵션을 대체하도록 설계되었습니다. 이제 메모리 할당자를 바꾸지 않고도 버퍼링(할당 페이징)을 비활성화할 수 있습니다.

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.pagedAllocator=false
```

문제가 발생하면 이슈 트래커인 [YouTrack](https://kotl.in/issue)에 보고해 주세요.

### 런타임 시 Latin-1 인코딩 문자열 지원
<primary-label ref="experimental-opt-in"/>

Kotlin은 이제 [JVM](https://openjdk.org/jeps/254)과 유사하게 Latin-1 인코딩 문자열을 지원합니다. 이는 애플리케이션의 바이너리 크기를 줄이고 메모리 소비를 조정하는 데 도움이 될 것입니다.

기본적으로 Kotlin의 문자열은 UTF-16 인코딩을 사용하여 저장되며, 각 문자는 2바이트로 표현됩니다. 어떤 경우에는 이것이 소스 코드에 비해 바이너리에서 문자열이 두 배의 공간을 차지하게 만들고, 단순한 ASCII 파일을 읽을 때 디스크에 저장된 것보다 두 배 더 많은 메모리를 차지하게 합니다.

반면, [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 인코딩은 처음 256개의 유니코드 문자를 각각 1바이트로 표현합니다. Latin-1 지원이 활성화되면 모든 문자가 해당 범위 내에 있는 한 문자열은 Latin-1 인코딩으로 저장됩니다. 그렇지 않으면 기본 UTF-16 인코딩이 사용됩니다.

#### Latin-1 지원 활성화 방법

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained) 단계입니다. 이를 활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.latin1Strings=true
```
#### 알려진 문제

이 기능이 실험적 단계인 동안에는 cinterop 확장 함수인 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html), [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html), 및 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)의 효율성이 떨어집니다. 각 호출 시 UTF-16으로 자동 문자열 변환이 트리거될 수 있습니다.

Kotlin 팀은 이 기능을 구현해 주신 Google의 동료분들과 특히 [Sonya Valchuk](https://github.com/pyos) 님께 매우 감사드립니다.

Kotlin의 메모리 소비에 대한 자세한 정보는 [문서](native-memory-manager.md#memory-consumption)를 참조하세요.

### Apple 플랫폼에서의 메모리 소비 추적 개선

Kotlin 2.2.0부터 Kotlin 코드에 의해 할당된 메모리에 이제 태그가 지정됩니다. 이는 Apple 플랫폼에서 메모리 문제를 디버깅하는 데 도움이 될 수 있습니다.

애플리케이션의 높은 메모리 사용량을 조사할 때, 이제 Kotlin 코드에 의해 예약된 메모리가 얼마나 되는지 식별할 수 있습니다. Kotlin의 지분은 식별자로 태그가 지정되며 Xcode Instruments의 VM Tracker와 같은 도구를 통해 추적할 수 있습니다.

이 기능은 기본적으로 활성화되어 있지만, 다음의 _모든_ 조건이 충족될 때 Kotlin/Native 기본 메모리 할당자에서만 사용할 수 있습니다:

* **태그 지정 활성화**. 메모리에 유효한 식별자로 태그를 지정해야 합니다. Apple은 240에서 255 사이의 숫자를 권장하며, 기본값은 246입니다.

  `kotlin.native.binary.mmapTag=0` Gradle 프로퍼티를 설정하면 태그 지정이 비활성화됩니다.

* **mmap을 통한 할당**. 할당자가 파일을 메모리에 매핑하기 위해 `mmap` 시스템 호출을 사용해야 합니다.

  `kotlin.native.binary.disableMmap=true` Gradle 프로퍼티를 설정하면 기본 할당자가 `mmap` 대신 `malloc`을 사용합니다.

* **페이징 활성화**. 할당 페이징(버퍼링)이 활성화되어 있어야 합니다.

  [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 프로퍼티를 설정하면 메모리가 객체별로 예약됩니다.

Kotlin의 메모리 소비에 대한 자세한 정보는 [문서](native-memory-manager.md#memory-consumption)를 참조하세요.

### LLVM 업데이트 (16에서 19로)

Kotlin 2.2.0에서는 LLVM 버전을 16에서 19로 업데이트했습니다.
새 버전에는 성능 향상, 버그 수정 및 보안 업데이트가 포함되어 있습니다.

이 업데이트가 코드에 영향을 미치지는 않겠지만, 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### Windows 7 타겟 지원 중단

Kotlin 2.2.0부터 최소 지원 Windows 버전이 Windows 7에서 Windows 10으로 상향되었습니다. Microsoft가 2025년 1월에 Windows 7에 대한 지원을 종료했기 때문에, 저희도 이 구식 타겟을 지원 중단(deprecate)하기로 결정했습니다.

자세한 내용은 [](native-target-support.md)를 참조하세요.

## Kotlin/Wasm

이번 릴리스에서는 [Wasm 타겟의 빌드 인프라가 JavaScript 타겟에서 분리되었습니다](#build-infrastructure-for-wasm-target-separated-from-javascript-target). 또한 이제 [Binaryen 도구를 프로젝트 또는 모듈별로 구성](#per-project-binaryen-configuration)할 수 있습니다.

### Wasm 타겟의 빌드 인프라를 JavaScript 타겟에서 분리

이전에는 `wasmJs` 타겟이 `js` 타겟과 동일한 인프라를 공유했습니다. 결과적으로 두 타겟 모두 동일한 디렉토리(`build/js`)에 위치했으며 동일한 NPM 태스크 및 구성을 사용했습니다.

이제 `wasmJs` 타겟은 `js` 타겟과 분리된 자체 인프라를 가집니다. 이를 통해 Wasm 태스크 및 타입이 JavaScript와 구분되어 독립적인 구성이 가능해졌습니다.

또한, Wasm 관련 프로젝트 파일 및 NPM 의존성은 이제 별도의 `build/wasm` 디렉토리에 저장됩니다.

Wasm을 위한 새로운 NPM 관련 태스크가 도입되었으며, 기존 JavaScript 태스크는 이제 JavaScript 전용으로 사용됩니다:

| **Wasm 태스크**        | **JavaScript 태스크** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

마찬가지로, 새로운 Wasm 전용 선언들이 추가되었습니다:

| **Wasm 선언**             | **JavaScript 선언**       |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

이제 구성 프로세스를 단순화하는 JavaScript 타겟과 독립적으로 Wasm 타겟 작업을 할 수 있습니다.

이 변경 사항은 기본적으로 활성화되어 있으며 추가 설정이 필요하지 않습니다.

### 프로젝트별 Binaryen 구성

Kotlin/Wasm에서 [프로덕션 빌드를 최적화](whatsnew20.md#optimized-production-builds-by-default-using-binaryen)하기 위해 사용되는 Binaryen 도구는 이전에는 루트 프로젝트에서 한 번만 구성되었습니다.

이제 Binaryen 도구를 프로젝트 또는 모듈별로 구성할 수 있습니다. 이 변경 사항은 Gradle의 권장 사례와 일치하며, [프로젝트 격리(project isolation)](https://docs.gradle.org/current/userguide/isolated_projects.html)와 같은 기능을 더 잘 지원하여 복잡한 빌드에서 빌드 성능과 안정성을 향상시킵니다.

또한 필요한 경우 이제 서로 다른 모듈에 대해 서로 다른 버전의 Binaryen을 구성할 수 있습니다.

이 기능은 기본적으로 활성화되어 있습니다. 그러나 Binaryen에 대한 커스텀 구성이 있는 경우, 이제 루트 프로젝트뿐만 아니라 각 프로젝트별로 적용해야 합니다.

## Kotlin/JS

이번 릴리스는 [`@JsPlainObject` 인터페이스의 `copy()` 함수](#fix-for-copy-in-jsplainobject-interfaces), [`@JsModule` 어노테이션이 있는 파일의 타입 별칭](#support-for-type-aliases-in-files-with-jsmodule-annotation) 및 기타 Kotlin/JS 기능을 개선합니다.

### `@JsPlainObject` 인터페이스의 `copy()` 수정

Kotlin/JS에는 `@JsPlainObject` 어노테이션이 붙은 인터페이스를 위한 `copy()` 함수를 도입한 `js-plain-objects`라는 실험적 플러그인이 있습니다. 객체를 조작하기 위해 `copy()` 함수를 사용할 수 있습니다.

그러나 `copy()`의 초기 구현은 상속과 호환되지 않았으며, 이로 인해 `@JsPlainObject` 인터페이스가 다른 인터페이스를 확장할 때 문제가 발생했습니다.

일반 객체(plain objects)에 대한 제한을 피하기 위해 `copy()` 함수가 객체 자체에서 해당 컴패니언 객체(companion object)로 이동되었습니다:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 이 구문은 더 이상 유효하지 않습니다
    val copy = user.copy(age = 35)      
    // 이것이 올바른 구문입니다
    val copy = User.copy(user, age = 35)
}
```

이 변경으로 상속 계층 구조의 충돌이 해결되고 모호함이 제거되었습니다.
Kotlin 2.2.0부터 기본적으로 활성화됩니다.

### `@JsModule` 어노테이션이 있는 파일에서 타입 별칭 지원

이전에는 JavaScript 모듈에서 선언을 가져오기 위해 `@JsModule` 어노테이션이 붙은 파일은 외부(external) 선언으로만 제한되었습니다. 즉, 이러한 파일에서는 `typealias`를 선언할 수 없었습니다.

Kotlin 2.2.0부터는 `@JsModule`로 표시된 파일 내부에서 타입 별칭을 선언할 수 있습니다:

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

이 변경으로 Kotlin/JS 상호 운용성 제한의 한 측면이 완화되었으며, 향후 릴리스에서 더 많은 개선 사항이 계획되어 있습니다.

`@JsModule`이 있는 파일에서의 타입 별칭 지원은 기본적으로 활성화됩니다.

### 멀티플랫폼 `expect` 선언에서 `@JsExport` 지원

Kotlin Multiplatform 프로젝트에서 [`expect/actual` 메커니즘](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)을 사용할 때, 공통(common) 코드의 `expect` 선언에 `@JsExport` 어노테이션을 사용할 수 없었습니다.

이번 릴리스부터 `expect` 선언에 `@JsExport`를 직접 적용할 수 있습니다:

```kotlin
// commonMain

// 이전에는 오류가 발생했지만, 이제 올바르게 작동합니다 
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

JavaScript 소스 세트의 대응하는 `actual` 구현에도 `@JsExport`를 어노테이션해야 하며, 내보낼 수 있는 타입만 사용해야 합니다.

이 수정을 통해 `commonMain`에 정의된 공유 코드를 JavaScript로 올바르게 내보낼 수 있습니다. 이제 수동 우회 방법을 사용하지 않고도 멀티플랫폼 코드를 JavaScript 사용자에게 노출할 수 있습니다.

이 변경 사항은 기본적으로 활성화되어 있습니다.

### `Promise<Unit>` 타입에 `@JsExport` 사용 가능

이전에는 `@JsExport` 어노테이션과 함께 `Promise<Unit>` 타입을 반환하는 함수를 내보내려고 하면 Kotlin 컴파일러에서 오류가 발생했습니다.

`Promise<Int>`와 같은 반환 타입은 올바르게 작동했지만, `Promise<Unit>`은 TypeScript의 `Promise<void>`로 올바르게 매핑됨에도 불구하고 "내보낼 수 없는 타입(non-exportable type)" 경고를 발생시켰습니다.

이 제한이 제거되었습니다. 이제 다음 코드는 오류 없이 컴파일됩니다:

```kotlin
// 이전에도 올바르게 작동함
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 이전에는 오류가 발생했지만, 이제 올바르게 작동함
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

이 변경 사항은 Kotlin/JS 상호 운용 모델에서 불필요한 제한을 제거합니다. 이 수정 사항은 기본적으로 활성화되어 있습니다.

## Gradle

Kotlin 2.2.0은 Gradle 7.6.3부터 8.14까지 완벽하게 호환됩니다. 최신 Gradle 릴리스 버전까지도 사용할 수 있습니다. 그러나 이 경우 지원 중단(deprecation) 경고가 발생할 수 있으며 일부 새로운 Gradle 기능이 작동하지 않을 수 있습니다.

이번 릴리스에서 Kotlin Gradle 플러그인은 진단 기능이 몇 가지 개선되었습니다. 또한 [바이너리 호환성 검증](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)의 실험적 통합을 도입하여 라이브러리 작업을 더 쉽게 만들어 줍니다.

### Kotlin Gradle 플러그인에 바이너리 호환성 검증 포함
<primary-label ref="experimental-general"/>

라이브러리 버전 간의 바이너리 호환성을 더 쉽게 확인할 수 있도록, [바이너리 호환성 검증 도구(binary compatibility validator)](https://github.com/Kotlin/binary-compatibility-validator)의 기능을 Kotlin Gradle 플러그인(KGP)으로 옮기는 실험을 진행 중입니다. 토이 프로젝트에서 사용해 볼 수 있지만, 아직 프로덕션 환경에서 사용하는 것은 권장하지 않습니다.

원래의 [바이너리 호환성 검증 도구](https://github.com/Kotlin/binary-compatibility-validator)는 이 실험 단계 동안에도 계속 유지 관리됩니다.

Kotlin 라이브러리는 JVM 클래스 파일 또는 `klib`의 두 가지 바이너리 형식 중 하나를 사용할 수 있습니다. 이 형식들은 호환되지 않으므로 KGP는 각각을 별도로 처리합니다.

바이너리 호환성 검증 기능 세트를 활성화하려면 `build.gradle.kts` 파일의 `kotlin{}` 블록에 다음을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 이전 Gradle 버전과의 호환성을 위해 set() 함수를 사용합니다
        enabled.set(true)
    }
}
```

바이너리 호환성을 확인하려는 모듈이 여러 개인 경우 각 모듈에서 개별적으로 기능을 구성하세요. 각 모듈은 자체 커스텀 구성을 가질 수 있습니다.

활성화되면 `checkLegacyAbi` Gradle 태스크를 실행하여 바이너리 호환성 문제를 확인합니다. IntelliJ IDEA에서 또는 프로젝트 디렉토리의 커맨드 라인에서 태스크를 실행할 수 있습니다:

```kotlin
./gradlew checkLegacyAbi
```

이 태스크는 현재 코드에서 애플리케이션 바이너리 인터페이스(ABI) 덤프를 UTF-8 텍스트 파일로 생성합니다. 그런 다음 태스크는 새 덤프를 이전 릴리스의 덤프와 비교합니다. 차이점이 발견되면 오류로 보고합니다. 오류를 검토한 후 변경 사항을 수용하기로 결정했다면, `updateLegacyAbi` Gradle 태스크를 실행하여 기준 ABI 덤프를 업데이트할 수 있습니다.

#### 클래스 필터링

이 기능을 사용하면 ABI 덤프에서 클래스를 필터링할 수 있습니다. 이름이나 이름의 일부, 또는 해당 클래스를 표시하는 어노테이션(또는 어노테이션 이름의 일부)으로 클래스를 명시적으로 포함하거나 제외할 수 있습니다.

예를 들어, 이 샘플은 `com.company` 패키지의 모든 클래스를 제외합니다:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

[KGP API 레퍼런스](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/)를 탐색하여 바이너리 호환성 검증 도구 구성에 대해 자세히 알아보세요.

#### 멀티플랫폼 제한 사항

멀티플랫폼 프로젝트에서 호스트가 모든 타겟에 대한 교차 컴파일(cross-compilation)을 지원하지 않는 경우, KGP는 다른 타겟의 ABI 덤프를 확인하여 지원되지 않는 타겟의 ABI 변경 사항을 유추하려고 시도합니다. 이 접근 방식은 나중에 모든 타겟을 컴파일할 수 있는 호스트로 전환할 때 잘못된 검증 실패를 방지하는 데 도움이 됩니다.

KGP가 지원되지 않는 타겟에 대해 ABI 변경 사항을 유추하지 않도록 이 기본 동작을 변경하려면 `build.gradle.kts` 파일에 다음을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

하지만 프로젝트에 지원되지 않는 타겟이 있는 경우, `checkLegacyAbi` 태스크가 ABI 덤프를 생성할 수 없어 실패하게 됩니다. 다른 타겟에서 유추된 ABI 변경으로 인해 호환되지 않는 변경 사항을 놓치는 것보다 검사가 실패하는 것이 더 중요한 경우 이러한 동작이 바람직할 수 있습니다.

### Kotlin Gradle 플러그인을 위한 콘솔 리치 출력 지원

Kotlin 2.2.0에서는 Gradle 빌드 프로세스 중에 콘솔에서 색상 및 기타 리치 출력(rich output)을 지원하여 보고된 진단 내용을 더 쉽게 읽고 이해할 수 있게 되었습니다.

리치 출력은 Linux 및 macOS의 지원되는 터미널 에뮬레이터에서 사용할 수 있으며, Windows에 대한 지원도 추가 작업 중입니다.

![Gradle 콘솔](gradle-console-rich-output.png){width=600}

이 기능은 기본적으로 활성화되어 있지만, 재정의하려면 `gradle.properties` 파일에 다음 Gradle 프로퍼티를 추가하세요:

```
org.gradle.console=plain
```

이 프로퍼티와 옵션에 대한 자세한 정보는 [로그 형식 맞춤 설정](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)에 대한 Gradle 문서를 참조하세요.

### KGP 진단 내 Problems API 통합

이전에는 Kotlin Gradle 플러그인(KGP)이 경고 및 오류와 같은 진단 내용을 콘솔이나 로그에 일반 텍스트 출력으로만 보고할 수 있었습니다.

2.2.0부터 KGP는 추가적인 보고 메커니즘을 도입합니다. 이제 빌드 프로세스 중에 리치하고 구조화된 문제 정보를 보고하는 표준화된 방식인 [Gradle의 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)를 사용합니다.

이제 KGP 진단 내용을 더 읽기 쉬워졌으며 Gradle CLI 및 IntelliJ IDEA와 같은 다양한 인터페이스에서 더 일관되게 표시됩니다.

이 통합은 Gradle 8.6 이상에서 기본적으로 활성화됩니다.
API가 계속 발전하고 있으므로 최신 개선 사항을 활용하려면 최신 Gradle 버전을 사용하세요.

### `--warning-mode`와 KGP 호환성

Kotlin Gradle 플러그인(KGP) 진단은 고정된 심각도 수준을 사용하여 문제를 보고했으므로, Gradle의 [`--warning-mode` 커맨드 라인 옵션](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings)이 KGP의 오류 표시 방식에 영향을 미치지 않았습니다.

이제 KGP 진단이 `--warning-mode` 옵션과 호환되어 더 많은 유연성을 제공합니다. 예를 들어, 모든 경고를 오류로 변환하거나 경고를 완전히 비활성화할 수 있습니다.

이 변경으로 KGP 진단은 선택된 경고 모드에 따라 출력을 조정합니다:

* `--warning-mode=fail`로 설정하면 `Severity.Warning`인 진단이 이제 `Severity.Error`로 격상됩니다.
* `--warning-mode=none`으로 설정하면 `Severity.Warning`인 진단이 기록되지 않습니다.

이 동작은 2.2.0부터 기본적으로 활성화됩니다.

`--warning-mode` 옵션을 무시하려면 `gradle.properties` 파일에 다음 Gradle 프로퍼티를 설정하세요:

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 새로운 실험적 빌드 도구 API
<primary-label ref="experimental-general"/>

Kotlin은 Gradle, Maven, Amper 등 다양한 빌드 시스템과 함께 사용할 수 있습니다. 그러나 증분 컴파일, Kotlin 컴파일러 플러그인과의 호환성, 데몬, Kotlin Multiplatform과 같은 전체 기능 세트를 지원하도록 각 시스템에 Kotlin을 통합하려면 상당한 노력이 필요합니다.

이 프로세스를 단순화하기 위해 Kotlin 2.2.0은 새로운 실험적 빌드 도구 API(BTA)를 도입했습니다. BTA는 빌드 시스템과 Kotlin 컴파일러 생태계 사이에서 추상화 계층 역할을 하는 유니버설 API입니다. 이 접근 방식을 사용하면 각 빌드 시스템은 단일 BTA 진입점만 지원하면 됩니다.

현재 BTA는 Kotlin/JVM만 지원합니다. JetBrains의 Kotlin 팀은 이미 Kotlin Gradle 플러그인(KGP)과 `kotlin-maven-plugin`에서 이를 사용하고 있습니다. 이러한 플러그인을 통해 BTA를 시도해 볼 수 있지만, API 자체는 아직 고유한 빌드 도구 통합에 일반적으로 사용할 준비가 되지 않았습니다. BTA 제안에 대해 궁금하거나 의견을 공유하고 싶다면 [KEEP](https://github.com/Kotlin/KEEP/issues/421) 제안을 확인하세요.

다음을 통해 BTA를 사용해 보려면:

* KGP의 경우, `gradle.properties` 파일에 다음 프로퍼티를 추가하세요:

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

* Maven의 경우, 아무것도 할 필요가 없습니다. 기본적으로 활성화되어 있습니다.

BTA는 현재 Maven 플러그인에 직접적인 이점은 없지만, [Kotlin 데몬 지원](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) 및 [증분 컴파일 안정화](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)와 같은 새로운 기능의 더 빠른 제공을 위한 견고한 토대를 마련합니다.

KGP의 경우, BTA를 사용하면 이미 다음과 같은 이점이 있습니다:

* [개선된 "인 프로세스(in process)" 컴파일러 실행 전략](#improved-in-process-compiler-execution-strategy)
* [Kotlin에서 서로 다른 컴파일러 버전을 구성할 수 있는 더 큰 유연성](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 개선된 "인 프로세스(in process)" 컴파일러 실행 전략

KGP는 세 가지 [Kotlin 컴파일러 실행 전략](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)을 지원합니다. Gradle 데몬 프로세스 내부에서 컴파일러를 실행하는 "인 프로세스(in process)" 전략은 이전에는 증분 컴파일을 지원하지 않았습니다.

이제 BTA를 사용하여 "인 프로세스" 전략이 증분 컴파일을 **지원합니다**. 이를 사용하려면 `gradle.properties` 파일에 다음 프로퍼티를 추가하세요:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### Kotlin에서 서로 다른 컴파일러 버전을 구성할 수 있는 유연성

빌드 스크립트의 지원 중단 사항을 처리하면서도 새로운 언어 기능을 시도해 보기 위해 KGP는 이전 버전으로 유지하면서 코드에서는 최신 Kotlin 컴파일러 버전을 사용하고 싶을 때가 있습니다. 또는 KGP 버전은 업데이트하고 싶지만 이전 Kotlin 컴파일러 버전은 유지하고 싶을 수도 있습니다.

BTA를 통해 이것이 가능해졌습니다. `build.gradle.kts` 파일에서 다음과 같이 구성할 수 있습니다:

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 2.2.0과 다른 버전
}

```

BTA는 KGP 및 Kotlin 컴파일러 버전을 이전 3개의 메이저 버전과 이후 1개의 메이저 버전까지 구성하는 것을 지원합니다. 따라서 KGP 2.2.0에서는 Kotlin 컴파일러 버전 2.1.x, 2.0.x 및 1.9.25가 지원됩니다. KGP 2.2.0은 향후 Kotlin 컴파일러 버전 2.2.x 및 2.3.x와도 호환됩니다.

그러나 서로 다른 컴파일러 버전을 컴파일러 플러그인과 함께 사용하면 Kotlin 컴파일러 예외가 발생할 수 있다는 점에 유의하세요. Kotlin 팀은 향후 릴리스에서 이러한 종류의 문제를 해결할 계획입니다.

이러한 플러그인으로 BTA를 시도해 보고 전용 YouTrack 티켓([KGP](https://youtrack.jetbrains.com/issue/KT-56574) 및 [Maven 플러그인](https://youtrack.jetbrains.com/issue/KT-73012))을 통해 의견을 보내주세요.

## 표준 라이브러리

Kotlin 2.2.0에서 [`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) 및 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)가 이제 [안정화(Stable)](components-stability.md#stability-levels-explained)되었습니다.

### 안정화된 Base64 인코딩 및 디코딩

Kotlin 1.8.20에서 [Base64 인코딩 및 디코딩에 대한 실험적 지원](whatsnew1820.md#support-for-base64-encoding)이 도입되었습니다.
Kotlin 2.2.0에서 [Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/)는 이제 [안정화(Stable)](components-stability.md#stability-levels-explained)되었으며, 이번 릴리스에 추가된 새로운 `Base64.Pem`을 포함하여 4가지 인코딩 스키마를 포함합니다:

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/)는 표준 [Base64 인코딩 스키마](https://www.rfc-editor.org/rfc/rfc4648#section-4)를 사용합니다.

  > `Base64.Default`는 `Base64` 클래스의 컴패니언 객체입니다.
  > 결과적으로 `Base64.Default.encode()` 및 `Base64.Default.decode()` 대신 `Base64.encode()` 및 `Base64.decode()`로 해당 함수를 호출할 수 있습니다.
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html)는 ["URL 및 Filename safe"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 인코딩 스키마를 사용합니다.
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html)은 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) 
  인코딩 스키마를 사용하며, 인코딩 중 76자마다 라인 구분자를 삽입하고 디코딩 중에는 유효하지 않은 문자를 건너뜁니다.
* `Base64.Pem`은 `Base64.Mime`처럼 데이터를 인코딩하지만 라인 길이를 64자로 제한합니다.

Base64 API를 사용하여 바이너리 데이터를 Base64 문자열로 인코딩하고 다시 바이트로 디코딩할 수 있습니다.

예시는 다음과 같습니다:

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// 또는 다음과 같이 가능:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// 또는 다음과 같이 가능:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

JVM에서는 `.encodingWith()` 및 `.decodingWith()` 확장 함수를 사용하여 입출력 스트림으로 Base64를 인코딩 및 디코딩할 수 있습니다:

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray()) 
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### `HexFormat` API를 사용한 안정화된 16진수 파싱 및 포맷팅

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)에서 도입된 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)가 이제 [안정화(Stable)](components-stability.md#stability-levels-explained)되었습니다.
숫자 값과 16진수 문자열 간의 변환에 사용할 수 있습니다.

예를 들어:

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

자세한 내용은 [16진수 포맷팅 및 파싱을 위한 새로운 HexFormat 클래스](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)를 참조하세요.

## Compose 컴파일러

이번 릴리스에서 Compose 컴파일러는 컴포저블 함수 참조(composable function references) 지원을 도입하고 여러 기능 플래그에 대한 기본값을 변경합니다.

### `@Composable` 함수 참조 지원

Compose 컴파일러는 Kotlin 2.2.0 릴리스부터 컴포저블 함수 참조의 선언 및 사용을 지원합니다:

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

컴포저블 함수 참조는 런타임 시 컴포저블 람다 객체와 약간 다르게 동작합니다. 특히, 컴포저블 람다는 `ComposableLambda` 클래스를 확장하여 스키핑(skipping)에 대한 더 세밀한 제어를 가능하게 합니다. 함수 참조는 `KCallable` 인터페이스를 구현해야 하므로 동일한 최적화를 적용할 수 없습니다.

### `PausableComposition` 기능 플래그 기본 활성화

`PausableComposition` 기능 플래그가 Kotlin 2.2.0부터 기본적으로 활성화됩니다. 이 플래그는 재시작 가능한(restartable) 함수에 대한 Compose 컴파일러 출력을 조정하여 런타임이 스키핑 동작을 강제할 수 있도록 함으로써, 각 함수를 건너뛰어 효과적으로 컴퍼지션을 일시 중지할 수 있게 합니다. 이를 통해 무거운 컴퍼지션을 프레임 사이에 나눌 수 있으며, 이는 향후 릴리스의 프리페칭(prefetching)에 사용될 예정입니다.

이 기능 플래그를 비활성화하려면 Gradle 구성에 다음을 추가하세요:

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 기능 플래그 기본 활성화

`OptimizeNonSkippingGroups` 기능 플래그가 Kotlin 2.2.0부터 기본적으로 활성화됩니다. 이 최적화는 스키핑하지 않는 컴포저블 함수에 대해 생성된 그룹 호출을 제거하여 런타임 성능을 향상시킵니다. 
런타임 시 눈에 띄는 동작 변경은 없을 것입니다.

문제가 발생할 경우, 해당 기능 플래그를 비활성화하여 이 변경 사항이 문제의 원인인지 확인할 수 있습니다. 이슈가 있다면 [Jetpack Compose 이슈 트래커](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 보고해 주세요.

`OptimizeNonSkippingGroups` 플래그를 비활성화하려면 Gradle 구성에 다음을 추가하세요:

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 지원 중단된 기능 플래그

`StrongSkipping` 및 `IntrinsicRemember` 기능 플래그는 이제 지원 중단(deprecated)되었으며 향후 릴리스에서 제거될 예정입니다. 
이러한 기능 플래그를 비활성화해야 하는 문제가 발생하면 [Jetpack Compose 이슈 트래커](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 보고해 주세요.

## 주요 변경 사항 및 지원 중단

이 섹션에서는 주목할 만한 주요 변경 사항 및 지원 중단 사항을 강조합니다. 이번 릴리스의 모든 주요 변경 사항 및 지원 중단 사항에 대한 전체 개요는 [호환성 가이드](compatibility-guide-22.md)를 참조하세요.

* Kotlin 2.2.0부터 컴파일러는 [더 이상 `-language-version=1.6` 또는 `-language-version=1.7`을 지원하지 않습니다](compatibility-guide-22.md#drop-support-in-language-version-for-1-6-and-1-7).
  1.8보다 오래된 언어 기능 세트는 지원되지 않지만 언어 자체는 Kotlin 1.0과 완벽하게 하위 호환됩니다.
* Ant 빌드 시스템 지원이 중단됩니다. Ant용 Kotlin 지원은 오랫동안 활발히 개발되지 않았으며, 비교적 적은 사용자 수로 인해 더 이상 유지 관리할 계획이 없습니다. 
  Ant 지원은 2.3.0에서 제거할 계획입니다.
* Kotlin 2.2.0은 Gradle의 [`kotlinOptions{}` 블록 지원 중단 수준을 오류로 상향](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)합니다. 
  대신 `compilerOptions{}` 블록을 사용하세요. 빌드 스크립트 업데이트에 대한 안내는 [`kotlinOptions{}`에서 `compilerOptions{}`로 마이그레이션](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)을 참조하세요.
* Kotlin 스크립팅은 Kotlin 생태계의 중요한 부분이지만, 더 나은 경험을 제공하기 위해 커스텀 스크립팅, `gradle.kts` 및 `main.kts` 스크립트와 같은 특정 사용 사례에 집중하고 있습니다. 
  자세한 내용은 업데이트된 [블로그 포스트](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)를 참조하세요. 그 결과 Kotlin 2.2.0은 다음에 대한 지원을 중단합니다:
  
  * REPL: `kotlinc`를 통해 REPL을 계속 사용하려면 `-Xrepl` 컴파일러 옵션으로 옵트인하세요.
  * JSR-223: 이 [JSR](https://jcp.org/en/jsr/detail?id=223)은 **철회(Withdrawn)** 상태이므로, JSR-223 구현은 언어 버전 1.9에서 계속 작동하지만 향후 K2 컴파일러를 사용하도록 마이그레이션되지는 않습니다.
  * `KotlinScriptMojo` Maven 플러그인: 이 플러그인에서 충분한 추진력을 보지 못했습니다. 계속 사용하면 컴파일러 경고가 표시됩니다.
* 
* Kotlin 2.2.0에서 [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#)의 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 함수는 이제 [구성된 소스에 추가하는 대신 대체합니다](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources).
  기존 소스를 대체하지 않고 소스를 추가하려면 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 함수를 사용하세요.
* `BaseKapt`의 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 타입이 [`MutableList<Any>`에서 `MutableList<CommandLineArgumentProvider>`로 변경되었습니다](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property). 현재 코드에서 리스트를 단일 요소로 추가하고 있다면 `add()` 함수 대신 `addAll()` 함수를 사용하세요.
* 레거시 Kotlin/JS 백엔드에서 사용되던 데드 코드 제거(DCE) 도구의 지원 중단에 따라, DCE와 관련된 나머지 DSL이 Kotlin Gradle 플러그인에서 제거되었습니다:
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 인터페이스
  * `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 함수
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 인터페이스
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 인터페이스

  현재의 [JS IR 컴파일러](js-ir-compiler.md)는 기본적으로 DCE를 지원하며, [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 어노테이션을 통해 DCE 중에 유지할 Kotlin 함수와 클래스를 지정할 수 있습니다.

* 지원 중단된 `kotlin-android-extensions` 플러그인이 [Kotlin 2.2.0에서 제거되었습니다](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin). 
  `Parcelable` 구현 생성기에는 `kotlin-parcelize` 플러그인을, 합성 뷰(synthetic views)에는 Android Jetpack의 [뷰 바인딩(view binding)](https://developer.android.com/topic/libraries/view-binding)을 대신 사용하세요.
* 실험적인 `kotlinArtifacts` API가 [Kotlin 2.2.0에서 지원 중단되었습니다](compatibility-guide-22.md#deprecate-kotlinartifacts-api). 
  Kotlin Gradle 플러그인에서 현재 사용 가능한 DSL을 사용하여 [최종 네이티브 바이너리를 빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)하세요. 마이그레이션에 충분하지 않다면 [해당 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-74953)에 의견을 남겨주세요.
* Kotlin 1.9.0에서 지원 중단된 `KotlinCompilation.source`가 이제 [Kotlin Gradle 플러그인에서 제거되었습니다](compatibility-guide-22.md#deprecate-kotlincompilation-source-api).
* 실험적인 공통화(commonization) 모드에 대한 파라미터들이 [Kotlin 2.2.0에서 지원 중단되었습니다](compatibility-guide-22.md#deprecate-commonization-parameters). 
  잘못된 컴파일 아티팩트를 삭제하려면 공통화 캐시를 지우세요.
* 지원 중단된 `konanVersion` 프로퍼티가 이제 [`CInteropProcess` 태스크에서 제거되었습니다](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess). 
  대신 `CInteropProcess.kotlinNativeVersion`을 사용하세요.
* 지원 중단된 `destinationDir` 프로퍼티를 사용하면 이제 [오류가 발생합니다](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess). 
  대신 `CInteropProcess.destinationDirectory.set()`을 사용하세요.

## 문서 업데이트

이번 릴리스에서는 Kotlin Multiplatform 문서를 [KMP 포털](https://kotlinlang.org/docs/multiplatform/get-started.html)로 마이그레이션하는 등 주목할 만한 문서 변경 사항이 있습니다. 

또한 새로운 페이지와 튜토리얼을 제작하고 기존 문서를 개편했습니다. 

### 신규 및 개편된 튜토리얼

* [Kotlin 중급 투어](kotlin-tour-welcome.md) – Kotlin에 대한 이해를 한 단계 더 높여보세요. 확장 함수, 인터페이스, 클래스 등을 언제 사용해야 하는지 배워봅니다.
* [Spring AI를 사용하는 Kotlin 앱 빌드](spring-ai-guide.md) – OpenAI와 벡터 데이터베이스를 사용하여 질문에 답하는 Kotlin 앱을 만드는 방법을 배워보세요.
* [](jvm-create-project-with-spring-boot.md) – IntelliJ IDEA의 **New Project** 마법사를 사용하여 Gradle로 Spring Boot 프로젝트를 만드는 방법을 배워보세요.
* [Kotlin과 C 매핑 튜토리얼 시리즈](mapping-primitive-data-types-from-c.md) – Kotlin과 C 간에 서로 다른 타입과 구문들이 어떻게 매핑되는지 배워보세요.
* [C 상호 운용성 및 libcurl을 사용하여 앱 만들기](native-app-with-c-and-libcurl.md) – libcurl C 라이브러리를 사용하여 기본적으로 실행할 수 있는 간단한 HTTP 클라이언트를 만들어보세요.
* [Kotlin Multiplatform 라이브러리 만들기](https://kotlinlang.org/docs/multiplatform/create-kotlin-multiplatform-library.html) – IntelliJ IDEA를 사용하여 멀티플랫폼 라이브러리를 만들고 게시하는 방법을 배워보세요.
* [Ktor 및 Kotlin Multiplatform으로 풀스택 애플리케이션 빌드](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 이 튜토리얼은 이제 Fleet 대신 IntelliJ IDEA를 사용하며, Material 3와 최신 버전의 Ktor 및 Kotlin을 사용합니다.
* [Compose Multiplatform 앱에서 로컬 리소스 환경 관리](https://kotlinlang.org/docs/multiplatform/compose-resource-environment.html) – 앱 내 테마 및 언어와 같은 애플리케이션의 리소스 환경을 관리하는 방법을 배워보세요.

### 신규 및 개편된 페이지

* [AI를 위한 Kotlin 개요](kotlin-ai-apps-development-overview.md) – AI 기반 애플리케이션 구축을 위한 Kotlin의 역량을 확인해 보세요.
* [Dokka 마이그레이션 가이드](https://kotlinlang.org/docs/dokka-migration.html) – Dokka Gradle 플러그인 v2로 마이그레이션하는 방법을 배워보세요.
* [](metadata-jvm.md) – JVM용으로 컴파일된 Kotlin 클래스의 메타데이터를 읽고, 수정하고, 생성하는 방법에 대한 가이드를 살펴보세요.
* [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 튜토리얼과 샘플 프로젝트를 통해 환경을 설정하고, Pod 의존성을 추가하거나 Kotlin 프로젝트를 CocoaPod 의존성으로 사용하는 방법을 배워보세요.
* iOS 안정화 버전 출시를 지원하기 위한 Compose Multiplatform의 새로운 페이지들:
    * 특히 [내비게이션(Navigation)](https://kotlinlang.org/docs/multiplatform/compose-navigation.html) 및 [딥 링크(Deep linking)](https://kotlinlang.org/docs/multiplatform/compose-navigation-deep-links.html).
    * [Compose에서 레이아웃 구현](https://kotlinlang.org/docs/multiplatform/compose-layout.html).
    * [문자열 로컬라이징(Localizing strings)](https://kotlinlang.org/docs/multiplatform/compose-localize-strings.html) 및 RTL 언어 지원과 같은 기타 i18n 페이지.
* [Compose Hot Reload](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html) – 데스크톱 타겟에서 Compose Hot Reload를 사용하는 방법과 기존 프로젝트에 추가하는 방법을 배워보세요.
* [Exposed 마이그레이션](https://www.jetbrains.com/help/exposed/migrations.html) – 데이터베이스 스키마 변경 관리를 위해 Exposed가 제공하는 도구에 대해 알아보세요.

## Kotlin 2.2.0으로 업데이트하는 방법

Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio에 번들 플러그인으로 제공됩니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 [Kotlin 버전을 2.2.0으로 변경](releases.md#update-to-a-new-kotlin-version)하세요.