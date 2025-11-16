[//]: # (title: Kotlin 2.2.0의 새로운 기능)

_[출시: 2025년 6월 23일](releases.md#release-details)_

Kotlin 2.2.0이 출시되었습니다! 주요 내용은 다음과 같습니다:

*   **언어**: [컨텍스트 파라미터](#preview-of-context-parameters)를 포함한 새로운 언어 기능 미리보기.
    가드 조건, 비지역(non-local) `break` 및 `continue`, 멀티-달러 인터폴레이션 등 [이전에 실험적이었던 여러 기능이 이제 Stable](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)로 변경되었습니다.
*   **Kotlin 컴파일러**: [컴파일러 경고의 통합 관리](#kotlin-compiler-unified-management-of-compiler-warnings).
*   **Kotlin/JVM**: [인터페이스 함수의 기본 메서드 생성 변경](#changes-to-default-method-generation-for-interface-functions).
*   **Kotlin/Native**: [LLVM 19 및 메모리 소비 추적 및 조정용 새로운 기능](#kotlin-native).
*   **Kotlin/Wasm**: [Wasm 타겟 분리](#build-infrastructure-for-wasm-target-separated-from-javascript-target) 및 [프로젝트별 Binaryen 구성](#per-project-binaryen-configuration) 기능.
*   **Kotlin/JS**: [`@JsPlainObject` 인터페이스에 생성된 `copy()` 메서드 수정](#fix-for-copy-in-jsplainobject-interfaces).
*   **Gradle**: [Kotlin Gradle 플러그인에 바이너리 호환성 검증 포함](#binary-compatibility-validation-included-in-kotlin-gradle-plugin).
*   **표준 라이브러리**: [Stable Base64 및 HexFormat API](#stable-base64-encoding-and-decoding).
*   **문서**: [문서 설문조사가 진행 중](https://surveys.jetbrains.com/s3/Kotlin-Docs-2025)이며, [Kotlin 문서에 상당한 개선 사항이 적용](#documentation-updates)되었습니다.

Kotlin 언어 발전팀이 새로운 기능을 논의하고 질문에 답변하는 다음 비디오를 시청할 수도 있습니다:

<video src="https://www.youtube.com/watch?v=jne3923lWtw" title="What's new in Kotlin 2.2.0"/>

## IDE 지원

2.2.0을 지원하는 Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio의 최신 버전에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 2.2.0으로 [변경](configure-build-for-eap.md#adjust-the-kotlin-version)하기만 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 언어

이번 릴리스에서는 가드 조건,
비지역(non-local) `break` 및 `continue`,
멀티-달러 인터폴레이션이 [Stable](components-stability.md#stability-levels-explained)로 [승격](#stable-features-guard-conditions-non-local-break-and-continue-and-multi-dollar-interpolation)되었습니다.
또한,
[컨텍스트 파라미터](#preview-of-context-parameters) 및 [컨텍스트-인식 확인(context-sensitive resolution)](#preview-of-context-sensitive-resolution)과 같은 여러 기능이 미리보기로 도입되었습니다.

### 컨텍스트 파라미터 미리보기
<primary-label ref="experimental-general"/>

컨텍스트 파라미터를 사용하면 함수와 프로퍼티가 주변 컨텍스트에서 암묵적으로 사용 가능한 의존성을 선언할 수 있습니다.

컨텍스트 파라미터를 사용하면 함수 호출 세트 전반에 걸쳐 공유되고 거의 변경되지 않는 서비스나 의존성 같은 값들을 수동으로 전달할 필요가 없습니다.

컨텍스트 파라미터는 컨텍스트 리시버(context receivers)라는 이전 실험적 기능을 대체합니다. 컨텍스트 리시버에서 컨텍스트 파라미터로 마이그레이션하려면 [블로그 게시물](https://blog.jetbrains.com/kotlin/2025/04/update-on-context-parameters/)에 설명된 대로 IntelliJ IDEA의 지원을 활용할 수 있습니다.

주요 차이점은 컨텍스트 파라미터가 함수 본문에서 리시버로 도입되지 않는다는 것입니다. 따라서 컨텍스트가 암묵적으로 사용 가능했던 컨텍스트 리시버와 달리, 컨텍스트 파라미터의 멤버에 접근하려면 컨텍스트 파라미터의 이름을 사용해야 합니다.

Kotlin의 컨텍스트 파라미터는 간소화된 의존성 주입, 향상된 DSL 설계, 범위 지정된(scoped) 작업을 통해 의존성 관리에 있어 상당한 개선을 나타냅니다. 더 자세한 정보는 해당 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md) 제안을 참조하세요.

#### 컨텍스트 파라미터 선언 방법

프로퍼티와 함수에 `context` 키워드 뒤에 `name: Type` 형식의 파라미터 목록을 사용하여 컨텍스트 파라미터를 선언할 수 있습니다. `UserService` 인터페이스에 대한 의존성을 가진 예시는 다음과 같습니다:

```kotlin
// UserService는 컨텍스트에서 필요한 의존성을 정의합니다.
interface UserService {
    fun log(message: String)
    fun findUserById(id: Int): String
}

// 컨텍스트 파라미터가 있는 함수를 선언합니다.
context(users: UserService)
fun outputMessage(message: String) {
    // 컨텍스트에서 log를 사용합니다.
    users.log("Log: $message")
}

// 컨텍스트 파라미터가 있는 프로퍼티를 선언합니다.
context(users: UserService)
val firstUser: String
    // 컨텍스트에서 findUserById를 사용합니다.
    get() = users.findUserById(1)
```

컨텍스트 파라미터 이름으로 `_`를 사용할 수 있습니다. 이 경우 파라미터 값은 확인(resolution)에 사용할 수 있지만, 블록 내부에서는 이름으로 접근할 수 없습니다:

```kotlin
// "_"를 컨텍스트 파라미터 이름으로 사용합니다.
context(_: UserService)
fun logWelcome() {
    // UserService에서 적절한 log 함수를 찾습니다.
    outputMessage("Welcome!")
}
```

#### 컨텍스트 파라미터 활성화 방법

프로젝트에서 컨텍스트 파라미터를 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

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

#### 피드백 남기기

이 기능은 향후 Kotlin 릴리스에서 안정화되고 개선될 예정입니다.
이슈 트래커 [YouTrack](https://youtrack.jetbrains.com/issue/KT-10468/Context-Parameters-expanding-extension-receivers-to-work-with-scopes)에 피드백을 남겨주시면 감사하겠습니다.

### 컨텍스트-인식 확인 미리보기
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 컨텍스트-인식 확인(context-sensitive resolution) 구현을 미리보기로 도입합니다.

이 기능에 대한 개요는 다음 비디오에서 확인할 수 있습니다:

<video src="https://www.youtube.com/v/aF8RYQrJI8Q" title="Context-sensitive resolution in Kotlin 2.2.0"/>

이전에는 타입이 컨텍스트에서 추론될 수 있는 경우에도 enum 엔트리 또는 봉인된(sealed) 클래스 멤버의 전체 이름을 작성해야 했습니다.
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

이제 컨텍스트-인식 확인을 통해 예상 타입이 알려진 컨텍스트에서는 타입 이름을 생략할 수 있습니다:

```kotlin
enum class Problem {
    CONNECTION, AUTHENTICATION, DATABASE, UNKNOWN
}

// 알려진 문제 타입에 따라 enum 엔트리를 확인합니다.
fun message(problem: Problem): String = when (problem) {
    CONNECTION -> "connection"
    AUTHENTICATION -> "authentication"
    DATABASE -> "database"
    UNKNOWN -> "unknown"
}
```

컴파일러는 이 컨텍스트 타입 정보를 사용하여 올바른 멤버를 확인합니다. 이 정보에는 다음이 포함됩니다:

*   `when` 표현식의 대상
*   명시적 반환 타입
*   선언된 변수 타입
*   타입 검사 (`is`) 및 캐스트 (`as`)
*   봉인된(sealed) 클래스 계층의 알려진 타입
*   선언된 파라미터 타입

> 컨텍스트-인식 확인은 함수, 파라미터가 있는 프로퍼티, 리시버가 있는 확장 프로퍼티에는 적용되지 않습니다.
>
{style="note"}

프로젝트에서 컨텍스트-인식 확인을 시도하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

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

이 기능은 향후 Kotlin 릴리스에서 안정화되고 개선될 예정이며, 이슈 트래커 [YouTrack](https://youtrack.jetbrains.com/issue/KT-16768/Context-sensitive-resolution)에 피드백을 남겨주시면 감사하겠습니다.

### 어노테이션 사용-위치 타겟을 위한 기능 미리보기
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 어노테이션 사용-위치(use-site) 타겟 작업에 더욱 편리함을 제공하는 몇 가지 기능을 도입합니다.

#### 프로퍼티를 위한 `@all` 메타-타겟
<primary-label ref="experimental-general"/>

Kotlin은 [사용-위치 타겟(use-site targets)](annotations.md#annotation-use-site-targets)으로 알려진 선언의 특정 부분에 어노테이션을 첨부할 수 있도록 합니다.
하지만 각 타겟에 개별적으로 어노테이션을 다는 것은 복잡하고 오류가 발생하기 쉬웠습니다:

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

이를 단순화하기 위해 Kotlin은 프로퍼티를 위한 새로운 `@all` 메타-타겟을 도입합니다.
이 기능은 컴파일러에게 어노테이션을 프로퍼티의 모든 관련 부분에 적용하도록 지시합니다. 이를 사용하면 `@all`은 어노테이션을 다음 항목에 적용하려고 시도합니다:

*   **`param`**: 주 생성자에서 선언된 경우 생성자 파라미터.
*   **`property`**: Kotlin 프로퍼티 자체.
*   **`field`**: 백킹 필드(backing field)가 존재하는 경우.
*   **`get`**: 게터 메서드.
*   **`setparam`**: 프로퍼티가 `var`로 정의된 경우 세터 메서드의 파라미터.
*   **`RECORD_COMPONENT`**: 클래스가 `@JvmRecord`인 경우, 어노테이션은 [Java 레코드 컴포넌트](#improved-support-for-annotating-jvm-records)에 적용됩니다. 이 동작은 Java가 레코드 컴포넌트에 어노테이션을 처리하는 방식을 모방합니다.

컴파일러는 주어진 프로퍼티의 타겟에만 어노테이션을 적용합니다.

아래 예시에서 `@Email` 어노테이션은 각 프로퍼티의 모든 관련 타겟에 적용됩니다:

```kotlin
data class User(
    val username: String,

    // @Email을 param, property, field,
    // get, setparam (var인 경우)에 적용합니다.
    @all:Email val email: String,
) {
    // @Email을 property, field, get에 적용합니다.
    // (생성자에 없으므로 param에는 적용되지 않습니다.)
    @all:Email val secondaryEmail: String? = null
}
```

주 생성자 내부 및 외부의 모든 프로퍼티에서 `@all` 메타-타겟을 사용할 수 있습니다. 그러나 [여러 어노테이션](https://kotlinlang.org/spec/syntax-and-grammar.html#grammar-rule-annotation)과 함께 `@all` 메타-타겟을 사용할 수는 없습니다.

이 새로운 기능은 문법을 단순화하고, 일관성을 보장하며, Java 레코드와의 상호 운용성을 개선합니다.

프로젝트에서 `@all` 메타-타겟을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

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

이 기능은 미리보기(preview) 상태입니다. 문제 발생 시 [YouTrack](https://kotl.in/issue) 이슈 트래커에 보고해 주세요. `@all` 메타-타겟에 대한 자세한 정보는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 제안을 참조하세요.

#### 사용-위치 어노테이션 타겟을 위한 새로운 기본 규칙
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 파라미터, 필드, 프로퍼티로 어노테이션을 전파하기 위한 새로운 기본 규칙을 도입합니다.
이전에는 어노테이션이 기본적으로 `param`, `property`, `field` 중 하나에만 적용되었지만, 이제 기본값은 어노테이션에 기대되는 것과 더욱 일치합니다.

적용 가능한 타겟이 여러 개 있는 경우, 다음과 같이 하나 이상이 선택됩니다:

*   생성자 파라미터 타겟 (`param`)이 적용 가능하다면, 이를 사용합니다.
*   프로퍼티 타겟 (`property`)이 적용 가능하다면, 이를 사용합니다.
*   필드 타겟 (`field`)이 적용 가능하지만 `property`는 적용 불가능하다면, `field`를 사용합니다.

타겟이 여러 개 있고 `param`, `property`, `field` 중 어느 것도 적용 가능하지 않다면, 어노테이션은 오류를 발생시킵니다.

이 기능을 활성화하려면 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotation-default-target=param-property")
    }
}
```

또는 컴파일러에 다음 명령줄 인수를 사용하세요:

```Bash
-Xannotation-default-target=param-property
```

이전 동작을 사용하고 싶다면 다음을 수행할 수 있습니다:

*   특정 경우에, 예를 들어 `@Annotation` 대신 `@param:Annotation`을 사용하여 필요한 타겟을 명시적으로 정의할 수 있습니다.
*   전체 프로젝트의 경우 Gradle 빌드 파일에 이 플래그를 사용하세요:

    ```kotlin
    // build.gradle.kts
    kotlin {
        compilerOptions {
            freeCompilerArgs.add("-Xannotation-default-target=first-only")
        }
    }
    ```

이 기능은 미리보기(preview) 상태입니다. 문제 발생 시 [YouTrack](https://kotl.in/issue) 이슈 트래커에 보고해 주세요. 어노테이션 사용-위치 타겟의 새로운 기본 규칙에 대한 자세한 정보는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/annotation-target-in-properties.md) 제안을 참조하세요.

### 중첩된 타입 별칭 지원
<primary-label ref="beta"/>

Kotlin 2.2.0은 다른 선언 내부에 타입 별칭을 정의하는 것을 지원합니다.

이 기능에 대한 개요는 다음 비디오에서 확인할 수 있습니다:

<video src="https://www.youtube.com/v/1W6d45IOwWk" title="Nested type aliases in Kotlin 2.2.0"/>

이전에는 Kotlin 파일의 최상위(top level)에서만 [타입 별칭(type aliases)](type-aliases.md)을 선언할 수 있었습니다. 이는 내부 또는 도메인별 타입 별칭조차도 사용되는 클래스 외부에서 정의되어야 함을 의미했습니다.

2.2.0부터는 타입 별칭이 외부 클래스에서 타입 파라미터를 캡처하지 않는 한, 다른 선언 내부에 타입 별칭을 정의할 수 있습니다:

```kotlin
class Dijkstra {
    typealias VisitedNodes = Set<Node>

    private fun step(visited: VisitedNodes, ...) = ...
}
```

중첩된 타입 별칭에는 타입 파라미터를 언급할 수 없는 것과 같은 몇 가지 추가 제약 조건이 있습니다. 전체 규칙 집합은 [문서](type-aliases.md#nested-type-aliases)를 확인하세요.

중첩된 타입 별칭은 캡슐화 개선, 패키지 수준의 복잡성 감소, 내부 구현 단순화를 통해 더 깔끔하고 유지보수하기 쉬운 코드를 가능하게 합니다.

#### 중첩된 타입 별칭 활성화 방법

프로젝트에서 중첩된 타입 별칭을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

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

#### 피드백 공유

중첩된 타입 별칭은 현재 [베타(Beta)](components-stability.md#stability-levels-explained) 상태입니다. 문제 발생 시 [YouTrack](https://kotl.in/issue) 이슈 트래커에 보고해 주세요. 이 기능에 대한 자세한 정보는 [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/nested-typealias.md) 제안을 참조하세요.

### Stable 기능: 가드 조건, 비지역(non-local) `break` 및 `continue`, 멀티-달러 인터폴레이션

Kotlin 2.1.0에서는 여러 새로운 언어 기능이 미리보기로 도입되었습니다.
이번 릴리스에서는 다음 언어 기능이 [Stable](components-stability.md#stability-levels-explained)로 제공됨을 발표하게 되어 기쁩니다:

*   [대상(subject)이 있는 `when`에서의 가드 조건](control-flow.md#guard-conditions-in-when-expressions)
*   [비지역(non-local) `break` 및 `continue`](inline-functions.md#break-and-continue)
*   [멀티-달러 인터폴레이션: 문자열 리터럴에서의 `$ ` 처리 개선](strings.md#multi-dollar-string-interpolation)

[Kotlin 언어 설계 기능 및 제안의 전체 목록](kotlin-language-features-and-proposals.md)을 참조하세요.

## Kotlin 컴파일러: 컴파일러 경고의 통합 관리
<primary-label ref="experimental-general"/>

Kotlin 2.2.0은 새로운 컴파일러 옵션인 `-Xwarning-level`을 도입합니다. 이 옵션은 Kotlin 프로젝트에서 컴파일러 경고를 통합적으로 관리할 수 있는 방법을 제공하도록 설계되었습니다.

이전에는 `-nowarn`으로 모든 경고를 비활성화하거나, `-Werror`로 모든 경고를 컴파일 오류로 전환하거나, `-Wextra`로 추가 컴파일러 검사를 활성화하는 것과 같은 일반적인 모듈 전체 규칙만 적용할 수 있었습니다. 특정 경고에 대해 조정할 수 있는 유일한 옵션은 `-Xsuppress-warning` 옵션이었습니다.

새로운 솔루션을 사용하면 일반 규칙을 재정의하고 특정 진단 메시지를 일관된 방식으로 제외할 수 있습니다.

### 적용 방법

새로운 컴파일러 옵션은 다음 구문을 가집니다:

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

*   `error`: 지정된 경고를 오류로 격상시킵니다.
*   `warning`: 경고를 발생시키며 기본적으로 활성화됩니다.
*   `disabled`: 지정된 경고를 모듈 전체에서 완전히 억제합니다.

새로운 컴파일러 옵션으로는 _경고_의 심각도 수준만 구성할 수 있다는 점을 명심하세요.

### 사용 사례

새로운 솔루션을 사용하면 일반 규칙과 특정 규칙을 결합하여 프로젝트에서 경고 보고를 더 세밀하게 조정할 수 있습니다.
사용 사례를 선택하세요:

#### 경고 억제

| 명령 | 설명 |
|:----------------------------------------------|:------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn) | 컴파일 중 모든 경고를 억제합니다. |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled` | 지정된 경고만 억제합니다. |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 지정된 경고를 제외한 모든 경고를 억제합니다. |

#### 경고를 오류로 격상

| 명령 | 설명 |
|:----------------------------------------------|:------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror) | 모든 경고를 컴파일 오류로 격상시킵니다. |
| `-Xwarning-level=DIAGNOSTIC_NAME:error` | 지정된 경고만 오류로 격상시킵니다. |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 지정된 경고를 제외한 모든 경고를 오류로 격상시킵니다. |

#### 추가 컴파일러 경고 활성화

| 명령 | 설명 |
|:------------------------------------------------|:---------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra) | true인 경우 경고를 발생하는 모든 추가 선언, 표현식 및 타입 컴파일러 검사를 활성화합니다. |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning` | 지정된 추가 컴파일러 검사만 활성화합니다. |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 지정된 검사를 제외한 모든 추가 검사를 활성화합니다. |

#### 경고 목록

일반 규칙에서 제외하고 싶은 경고가 많다면 [`@argfile`](compiler-reference.md#argfile)을 통해 별도의 파일에 목록을 작성할 수 있습니다.

### 피드백 남기기

새로운 컴파일러 옵션은 아직 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다. [YouTrack](https://kotl.in/issue)의 이슈 트래커에 문제점을 보고해 주세요.

## Kotlin/JVM

Kotlin 2.2.0은 JVM에 많은 업데이트를 제공합니다. 이제 컴파일러는 Java 24 바이트코드를 지원하며, 인터페이스 함수의 기본 메서드 생성에 변경 사항을 도입합니다. 이 릴리스는 또한 Kotlin 메타데이터에서 어노테이션 작업의 복잡성을 줄이고, 인라인 값 클래스와의 Java 상호 운용성을 개선하며, JVM 레코드에 어노테이션을 달기 위한 더 나은 지원을 포함합니다.

### 인터페이스 함수의 기본 메서드 생성 변경

Kotlin 2.2.0부터, 인터페이스에 선언된 함수는 달리 구성되지 않는 한 JVM 기본 메서드로 컴파일됩니다.
이 변경은 구현이 있는 Kotlin 인터페이스 함수가 바이트코드로 컴파일되는 방식에 영향을 미칩니다.

이 동작은 더 이상 사용되지 않는 `-Xjvm-default` 옵션을 대체하는 새로운 Stable 컴파일러 옵션 `-jvm-default`에 의해 제어됩니다.

`-jvm-default` 옵션의 동작은 다음 값을 사용하여 제어할 수 있습니다:

*   `enable` (기본값): 인터페이스에 기본 구현을 생성하고 서브클래스 및 `DefaultImpls` 클래스에 브리지 함수를 포함합니다. 이 모드는 이전 Kotlin 버전과의 바이너리 호환성을 유지하는 데 사용됩니다.
*   `no-compatibility`: 인터페이스에 기본 구현만 생성합니다. 이 모드는 호환성 브리지 및 `DefaultImpls` 클래스를 건너뛰므로 새 코드에 적합합니다.
*   `disable`: 인터페이스의 기본 구현을 비활성화합니다. 브리지 함수 및 `DefaultImpls` 클래스만 생성되며, 이는 Kotlin 2.2.0 이전의 동작과 일치합니다.

`-jvm-default` 컴파일러 옵션을 구성하려면 Gradle Kotlin DSL에서 `jvmDefault` 프로퍼티를 설정하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### Kotlin 메타데이터에서 어노테이션 읽기 및 쓰기 지원
<primary-label ref="experimental-general"/>

이전에는 컴파일된 JVM 클래스 파일에서 리플렉션이나 바이트코드 분석을 사용하여 어노테이션을 읽고 시그니처를 기반으로 메타데이터 엔트리와 수동으로 일치시켜야 했습니다.
이 과정은 특히 오버로드된 함수에 대해 오류가 발생하기 쉬웠습니다.

이제 Kotlin 2.2.0에서는 [](metadata-jvm.md)가 Kotlin 메타데이터에 저장된 어노테이션 읽기 지원을 도입합니다.

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

이 옵션이 활성화되면 Kotlin 컴파일러는 JVM 바이트코드와 함께 어노테이션을 메타데이터에 작성하여 `kotlin-metadata-jvm` 라이브러리에서 접근할 수 있게 합니다.

라이브러리는 어노테이션에 접근하기 위한 다음 API를 제공합니다:

*   `KmClass.annotations`
*   `KmFunction.annotations`
*   `KmProperty.annotations`
*   `KmConstructor.annotations`
*   `KmPropertyAccessorAttributes.annotations`
*   `KmValueParameter.annotations`
*   `KmFunction.extensionReceiverAnnotations`
*   `KmProperty.extensionReceiverAnnotations`
*   `KmProperty.backingFieldAnnotations`
*   `KmProperty.delegateFieldAnnotations`
*   `KmEnumEntry.annotations`

이 API는 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 어노테이션을 사용하세요.

Kotlin 메타데이터에서 어노테이션을 읽는 예시는 다음과 같습니다:

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

> 프로젝트에서 `kotlin-metadata-jvm` 라이브러리를 사용하는 경우, 어노테이션을 지원하도록 코드를 테스트하고 업데이트하는 것을 권장합니다.
> 그렇지 않으면, 향후 Kotlin 버전에서 메타데이터의 어노테이션이 [기본적으로 활성화](https://youtrack.jetbrains.com/issue/KT-75736)되면 프로젝트에서 유효하지 않거나 불완전한 메타데이터가 생성될 수 있습니다.
>
> 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-31857)에 보고해 주세요.
>
{style="warning"}

### 인라인 값 클래스를 사용한 Java 상호 운용성 개선
<primary-label ref="experimental-general"/>

> IntelliJ IDEA에서 이 기능에 대한 코드 분석, 코드 완성 및 하이라이팅 지원은 현재 [2025.3 EAP 빌드](https://www.jetbrains.com/idea/nextversion/)에서만 사용할 수 있습니다.
>
{style = "note"}

Kotlin 2.2.0은 새로운 실험적 어노테이션인 [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/)를 도입합니다. 이 어노테이션은 [인라인 값 클래스](inline-classes.md)를 Java에서 사용하기 쉽게 만듭니다.

이 기능에 대한 개요는 다음 비디오에서 확인할 수 있습니다:

<video src="https://www.youtube.com/v/KSvq7jHr1lo" title="Exposed inline value classes for Java in Kotlin 2.2.0"/>

기본적으로 Kotlin은 인라인 값 클래스를 **언박스된 표현(unboxed representations)**을 사용하도록 컴파일합니다. 이는 성능이 좋지만 Java에서는 사용하기 어렵거나 심지어 불가능한 경우가 많습니다. 예를 들어:

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

이 경우, 클래스가 언박스되어 있기 때문에 Java에서 호출할 수 있는 생성자가 없습니다. 또한 Java가 `init` 블록을 트리거하여 `number`가 양수인지 확인할 방법도 없습니다.

클래스에 `@JvmExposeBoxed` 어노테이션을 달면 Kotlin은 Java에서 직접 호출할 수 있는 public 생성자를 생성하여 `init` 블록도 실행되도록 보장합니다.

`@JvmExposeBoxed` 어노테이션은 클래스, 생성자 또는 함수 레벨에 적용하여 Java에 노출되는 대상을 세밀하게 제어할 수 있습니다.

예를 들어, 다음 코드에서 확장 함수 `.timesTwoBoxed()`는 Java에서 접근할 수 **없습니다**:

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

`MyInt` 클래스의 인스턴스를 생성하고 Java 코드에서 `.timesTwoBoxed()` 함수를 호출할 수 있게 하려면 클래스와 함수 모두에 `@JvmExposeBoxed` 어노테이션을 추가하세요:

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

이러한 어노테이션을 사용하면 Kotlin 컴파일러는 `MyInt` 클래스에 대한 Java-접근 가능한 생성자를 생성합니다. 또한 값 클래스의 박스된 형식을 사용하는 확장 함수에 대한 오버로드도 생성합니다. 결과적으로 다음 Java 코드가 성공적으로 실행됩니다:

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

노출하려는 인라인 값 클래스의 모든 부분에 어노테이션을 달고 싶지 않다면, 모듈 전체에 어노테이션을 효과적으로 적용할 수 있습니다. 모듈에 이 동작을 적용하려면 `-Xjvm-expose-boxed` 옵션으로 컴파일하세요. 이 옵션으로 컴파일하면 모듈의 모든 선언에 `@JvmExposeBoxed` 어노테이션이 있는 것과 동일한 효과를 줍니다.

이 새로운 어노테이션은 Kotlin이 내부적으로 값 클래스를 컴파일하거나 사용하는 방식을 변경하지 않으며, 기존의 모든 컴파일된 코드는 유효합니다. 단순히 Java 상호 운용성을 개선하기 위한 새로운 기능을 추가할 뿐입니다. 값 클래스를 사용하는 Kotlin 코드의 성능에는 영향을 미치지 않습니다.

`@JvmExposeBoxed` 어노테이션은 멤버 함수의 박스된 변형을 노출하고 박스된 반환 타입을 받으려는 라이브러리 작성자에게 유용합니다. 이는 인라인 값 클래스(효율적이지만 Kotlin 전용)와 데이터 클래스(Java 호환되지만 항상 박스됨) 중 하나를 선택해야 하는 필요성을 없애줍니다.

`@JvmExposedBoxed` 어노테이션이 작동하는 방식과 해결하는 문제에 대한 자세한 설명은 이 [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) 제안을 참조하세요.

### JVM 레코드 어노테이션 지원 개선

Kotlin은 Kotlin 1.5.0부터 [JVM 레코드](jvm-records.md)를 지원했습니다. 이제 Kotlin 2.2.0은 레코드 컴포넌트의 어노테이션 처리, 특히 Java의 [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) 타겟과 관련하여 개선되었습니다.

첫째, `RECORD_COMPONENT`를 어노테이션 타겟으로 사용하려면 Kotlin (`@Target`) 및 Java에 대한 어노테이션을 수동으로 추가해야 합니다. 이는 Kotlin의 `@Target` 어노테이션이 `RECORD_COMPONENT`를 지원하지 않기 때문입니다. 예를 들어:

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

두 목록을 수동으로 유지하는 것은 오류가 발생하기 쉬울 수 있으므로, Kotlin 2.2.0은 Kotlin과 Java 타겟이 일치하지 않을 경우 컴파일러 경고를 도입합니다. 예를 들어, Java 타겟 목록에서 `ElementType.CLASS`를 생략하면 컴파일러는 다음과 같이 보고합니다:

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

둘째, 레코드에서 어노테이션을 전파하는 방식에서 Kotlin의 동작은 Java와 다릅니다. Java에서는 레코드 컴포넌트의 어노테이션이 백킹 필드, 게터 및 생성자 파라미터에 자동으로 적용됩니다. Kotlin은 기본적으로 이를 수행하지 않지만, 이제 [`@all:` 사용-위치 타겟](#all-meta-target-for-properties)을 사용하여 이 동작을 재현할 수 있습니다.

예를 들어:

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord`와 `@all:`을 함께 사용하면 Kotlin은 이제 다음을 수행합니다:

*   어노테이션을 프로퍼티, 백킹 필드, 생성자 파라미터 및 게터에 전파합니다.
*   어노테이션이 Java의 `RECORD_COMPONENT`를 지원하는 경우 레코드 컴포넌트에도 어노테이션을 적용합니다.

## Kotlin/Native

2.2.0부터 Kotlin/Native는 LLVM 19를 사용합니다. 이 릴리스는 또한 메모리 소비를 추적하고 조정하도록 설계된 여러 실험 기능을 제공합니다.

### 객체별 메모리 할당
<primary-label ref="experimental-opt-in"/>

Kotlin/Native의 [메모리 할당자](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)는 이제 객체별로 메모리를 예약할 수 있습니다. 경우에 따라 엄격한 메모리 제한을 충족하거나 애플리케이션 시작 시 메모리 소비를 줄이는 데 도움이 될 수 있습니다.

이 새로운 기능은 기본 메모리 할당자 대신 시스템 메모리 할당자를 활성화했던 `-Xallocator=std` 컴파일러 옵션을 대체하도록 설계되었습니다. 이제 메모리 할당자를 전환하지 않고도 버퍼링(할당 페이징)을 비활성화할 수 있습니다.

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.pagedAllocator=false
```

[YouTrack](https://kotl.in/issue)의 이슈 트래커에 문제점을 보고해 주세요.

### 런타임에 Latin-1 인코딩된 문자열 지원
<primary-label ref="experimental-opt-in"/>

Kotlin은 이제 [JVM](https://openjdk.org/jeps/254)과 유사하게 Latin-1 인코딩된 문자열을 지원합니다. 이는 애플리케이션의 바이너리 크기를 줄이고 메모리 소비를 조정하는 데 도움이 될 것입니다.

기본적으로 Kotlin의 문자열은 UTF-16 인코딩을 사용하여 저장되며, 각 문자는 두 바이트로 표현됩니다. 경우에 따라 이는 문자열이 바이너리에서 소스 코드보다 두 배의 공간을 차지하게 만들고, 간단한 ASCII 파일에서 데이터를 읽는 것은 파일을 디스크에 저장하는 것보다 두 배 많은 메모리를 차지할 수 있습니다.

반대로, [Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) 인코딩은 처음 256개의 유니코드 문자를 각각 1바이트로 표현합니다. Latin-1 지원을 활성화하면 모든 문자가 해당 범위 내에 있는 한 문자열은 Latin-1 인코딩으로 저장됩니다. 그렇지 않으면 기본 UTF-16 인코딩이 사용됩니다.

#### Latin-1 지원을 활성화하는 방법

이 기능은 현재 [실험적(Experimental)](components-stability.md#stability-levels-explained)입니다.
활성화하려면 `gradle.properties` 파일에 다음 옵션을 설정하세요:

```none
kotlin.native.binary.latin1Strings=true
```
#### 알려진 문제

이 기능이 실험적인 동안, cinterop 확장 함수 [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html), [`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html), 및 [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)는 효율성이 떨어집니다. 각 호출 시 자동 문자열 변환이 UTF-16으로 트리거될 수 있습니다.

이 기능을 구현해 주신 Google 동료들과 특히 [Sonya Valchuk](https://github.com/pyos)님께 Kotlin 팀은 깊이 감사드립니다.

Kotlin의 메모리 소비에 대한 자세한 내용은 [문서](native-memory-manager.md#memory-consumption)를 참조하세요.

### Apple 플랫폼에서의 메모리 소비 추적 개선

Kotlin 2.2.0부터 Kotlin 코드에 의해 할당된 메모리에 태그가 지정됩니다. 이는 Apple 플랫폼에서 메모리 문제를 디버깅하는 데 도움이 될 수 있습니다.

애플리케이션의 높은 메모리 사용량을 조사할 때, 이제 Kotlin 코드가 예약한 메모리 양을 식별할 수 있습니다. Kotlin의 점유분은 식별자로 태그가 지정되며 Xcode Instruments의 VM Tracker와 같은 도구를 통해 추적할 수 있습니다.

이 기능은 기본적으로 활성화되어 있지만, 다음 모든 조건이 충족될 때 Kotlin/Native 기본 메모리 할당자에서만 사용할 수 있습니다:

*   **태깅 활성화**. 메모리는 유효한 식별자로 태그되어야 합니다. Apple은 240에서 255 사이의 숫자를 권장하며, 기본값은 246입니다.

    `kotlin.native.binary.mmapTag=0` Gradle 프로퍼티를 설정하면 태깅이 비활성화됩니다.

*   **mmap을 사용한 할당**. 할당자는 `mmap` 시스템 호출을 사용하여 파일을 메모리에 매핑해야 합니다.

    `kotlin.native.binary.disableMmap=true` Gradle 프로퍼티를 설정하면 기본 할당자가 `mmap` 대신 `malloc`을 사용합니다.

*   **페이징 활성화**. 할당 페이징(버퍼링)이 활성화되어야 합니다.

    [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle 프로퍼티를 설정하면 메모리가 객체별로 예약됩니다.

Kotlin의 메모리 소비에 대한 자세한 내용은 [문서](native-memory-manager.md#memory-consumption)를 참조하세요.

### LLVM 16에서 19로 업데이트

Kotlin 2.2.0에서 LLVM이 버전 16에서 19로 업데이트되었습니다.
새로운 버전에는 성능 개선, 버그 수정 및 보안 업데이트가 포함되어 있습니다.

이 업데이트는 코드에 영향을 미치지 않아야 하지만, 문제가 발생하면 [이슈 트래커](http://kotl.in/issue)에 보고해 주세요.

### Windows 7 타겟 지원 중단

Kotlin 2.2.0부터 지원되는 최소 Windows 버전이 Windows 7에서 Windows 10으로 상향되었습니다. Microsoft가 2025년 1월에 Windows 7 지원을 종료했으므로, 이 레거시 타겟도 더 이상 사용하지 않기로 결정했습니다.

자세한 내용은 [](native-target-support.md)를 참조하세요.

## Kotlin/Wasm

이번 릴리스에서는 [Wasm 타겟의 빌드 인프라가 JavaScript 타겟과 분리](#build-infrastructure-for-wasm-target-separated-from-javascript-target)되었습니다. 또한 이제 [프로젝트 또는 모듈별로 Binaryen 도구를 구성](#per-project-binaryen-configuration)할 수 있습니다.

### Wasm 타겟의 빌드 인프라가 JavaScript 타겟과 분리됨

이전에는 `wasmJs` 타겟이 `js` 타겟과 동일한 인프라를 공유했습니다. 결과적으로, 두 타겟 모두 동일한 디렉토리(`build/js`)에 호스팅되었고 동일한 NPM 태스크 및 구성을 사용했습니다.

이제 `wasmJs` 타겟은 `js` 타겟과 별개의 자체 인프라를 가집니다. 이를 통해 Wasm 태스크와 타입이 JavaScript 태스크와 분리되어 독립적인 구성이 가능해졌습니다.

또한 Wasm 관련 프로젝트 파일 및 NPM 종속성은 이제 별도의 `build/wasm` 디렉토리에 저장됩니다.

Wasm을 위한 새로운 NPM 관련 태스크가 도입되었으며, 기존 JavaScript 태스크는 이제 JavaScript 전용으로 사용됩니다:

| **Wasm 태스크** | **JavaScript 태스크** |
|:-----------------------|:----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall` |
| `wasmRootPackageJson` | `rootPackageJson` |

마찬가지로, 새로운 Wasm 전용 선언이 추가되었습니다:

| **Wasm 선언** | **JavaScript 선언** |
|:----------------------|:--------------------|
| `WasmNodeJsRootPlugin`| `NodeJsRootPlugin` |
| `WasmNodeJsPlugin` | `NodeJsPlugin` |
| `WasmYarnPlugin` | `YarnPlugin` |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension` |
| `WasmNodeJsEnvSpec` | `NodeJsEnvSpec` |
| `WasmYarnRootEnvSpec` | `YarnRootEnvSpec` |

이제 JavaScript 타겟과 독립적으로 Wasm 타겟으로 작업할 수 있어 구성 프로세스가 단순해집니다.

이 변경은 기본적으로 활성화되어 있으며 추가 설정이 필요하지 않습니다.

### 프로젝트별 Binaryen 구성

Kotlin/Wasm에서 [프로덕션 빌드를 최적화하는 데](whatsnew20.md#optimized-production-builds-by-default-using-binaryen) 사용되는 Binaryen 도구는 이전에는 루트 프로젝트에서 한 번만 구성되었습니다.

이제 프로젝트 또는 모듈별로 Binaryen 도구를 구성할 수 있습니다. 이 변경은 Gradle의 모범 사례와 일치하며 [프로젝트 격리](https://docs.gradle.org/current/userguide/isolated_projects.html)와 같은 기능을 더 잘 지원하여 복잡한 빌드에서 빌드 성능과 안정성을 향상시킵니다.

또한 필요에 따라 다른 모듈에 다른 버전의 Binaryen을 구성할 수 있습니다.

이 기능은 기본적으로 활성화되어 있습니다. 그러나 Binaryen에 대한 사용자 지정 구성이 있는 경우, 이제 루트 프로젝트에서만 적용하는 대신 프로젝트별로 적용해야 합니다.

## Kotlin/JS

이번 릴리스에서는 [`@JsPlainObject` 인터페이스의 `copy()` 함수](#fix-for-copy-in-jsplainobject-interfaces), [`@JsModule` 어노테이션이 있는 파일의 타입 별칭](#support-for-type-aliases-in-files-with-jsmodule-annotation), 및 기타 Kotlin/JS 기능이 개선되었습니다.

### `@JsPlainObject` 인터페이스의 `copy()` 수정

Kotlin/JS에는 `js-plain-objects`라는 실험적 플러그인이 있으며, 이는 `@JsPlainObject` 어노테이션이 달린 인터페이스에 `copy()` 함수를 도입했습니다.
`copy()` 함수를 사용하여 객체를 조작할 수 있습니다.

그러나 `copy()`의 초기 구현은 상속과 호환되지 않았으며, 이는 `@JsPlainObject` 인터페이스가 다른 인터페이스를 확장할 때 문제를 일으켰습니다.

플레인 객체에 대한 제한을 피하기 위해 `copy()` 함수가 객체 자체에서 컴패니언 객체로 이동되었습니다:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // 이 구문은 더 이상 유효하지 않습니다.
    val copy = user.copy(age = 35)      
    // 이것이 올바른 구문입니다.
    val copy = User.copy(user, age = 35)
}
```

이 변경은 상속 계층 구조의 충돌을 해결하고 모호성을 제거합니다.
Kotlin 2.2.0부터 기본적으로 활성화됩니다.

### `@JsModule` 어노테이션이 있는 파일의 타입 별칭 지원

이전에는 JavaScript 모듈에서 선언을 임포트하기 위해 `@JsModule` 어노테이션이 달린 파일은 외부 선언으로만 제한되었습니다. 이는 그러한 파일에서 `typealias`를 선언할 수 없다는 것을 의미했습니다.

Kotlin 2.2.0부터는 `@JsModule`로 표시된 파일 내에 타입 별칭을 선언할 수 있습니다:

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

이 변경은 Kotlin/JS 상호 운용성 제한의 한 측면을 줄여주며, 향후 릴리스에서 더 많은 개선이 계획되어 있습니다.

`@JsModule`이 있는 파일의 타입 별칭 지원은 기본적으로 활성화됩니다.

### 멀티플랫폼 `expect` 선언에서 `@JsExport` 지원

Kotlin 멀티플랫폼 프로젝트에서 [`expect/actual` 메커니즘](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)으로 작업할 때,
공통 코드의 `expect` 선언에 `@JsExport` 어노테이션을 사용할 수 없었습니다.

이번 릴리스부터 `@JsExport`를 `expect` 선언에 직접 적용할 수 있습니다:

```kotlin
// commonMain

// 오류를 발생시켰으나, 이제 올바르게 작동합니다.
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

JavaScript 소스 세트의 해당 `actual` 구현에도 `@JsExport` 어노테이션을 달아야 하며, export 가능한 타입만 사용해야 합니다.

이 수정으로 `commonMain`에 정의된 공유 코드가 JavaScript로 올바르게 export될 수 있습니다. 이제 수동적인 해결 방법 없이도 멀티플랫폼 코드를 JavaScript 사용자에게 노출할 수 있습니다.

이 변경은 기본적으로 활성화됩니다.

### `Promise<Unit>` 타입과 `@JsExport` 사용 가능

이전에는 `@JsExport` 어노테이션을 사용하여 `Promise<Unit>` 타입을 반환하는 함수를 export하려고 하면 Kotlin 컴파일러가 오류를 생성했습니다.

`Promise<Int>`와 같은 반환 타입은 올바르게 작동했지만, `Promise<Unit>`은 TypeScript에서 `Promise<void>`로 올바르게 매핑되었음에도 불구하고 "non-exportable type" 경고를 트리거했습니다.

이러한 제한이 제거되었습니다. 이제 다음 코드는 오류 없이 컴파일됩니다:

```kotlin
// 이전에는 올바르게 작동했습니다.
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 오류를 발생시켰으나, 이제 올바르게 작동합니다.
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

이 변경은 Kotlin/JS 상호 운용 모델의 불필요한 제한을 제거합니다. 이 수정은 기본적으로 활성화됩니다.

## Gradle

Kotlin 2.2.0은 Gradle 7.6.3부터 8.14까지 완벽하게 호환됩니다. 최신 Gradle 릴리스 버전까지도 사용할 수 있습니다. 그러나 그렇게 할 경우 경고가 발생할 수 있으며, 일부 새로운 Gradle 기능이 작동하지 않을 수 있음을 유의하세요.

이번 릴리스에서 Kotlin Gradle 플러그인(KGP)은 진단 기능에 대한 몇 가지 개선 사항을 포함합니다. 또한 라이브러리 작업을 용이하게 하는 [바이너리 호환성 검증](#binary-compatibility-validation-included-in-kotlin-gradle-plugin)의 실험적 통합을 도입합니다.

### Kotlin Gradle 플러그인에 바이너리 호환성 검증 포함
<primary-label ref="experimental-general"/>

라이브러리 버전 간의 바이너리 호환성을 쉽게 확인할 수 있도록, [바이너리 호환성 검증 도구](https://github.com/Kotlin/binary-compatibility-validator)의 기능을 Kotlin Gradle 플러그인(KGP)으로 옮기는 실험을 진행 중입니다. 장난감 프로젝트에서 시도해 볼 수 있지만, 아직 프로덕션 환경에서 사용하는 것을 권장하지 않습니다.

원래의 [바이너리 호환성 검증 도구](https://github.com/Kotlin/binary-compatibility-validator)는 이 실험 단계 동안 계속 유지보수됩니다.

Kotlin 라이브러리는 JVM 클래스 파일 또는 `klib` 두 가지 바이너리 형식 중 하나를 사용할 수 있습니다. 이 형식들은 호환되지 않기 때문에 KGP는 각각 별도로 작업합니다.

바이너리 호환성 검증 기능을 활성화하려면 `build.gradle.kts` 파일의 `kotlin{}` 블록에 다음을 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // set() 함수를 사용하여 이전 Gradle 버전과의 호환성을 보장합니다.
        enabled.set(true)
    }
}
```

바이너리 호환성을 확인하려는 여러 모듈이 프로젝트에 있는 경우, 각 모듈에서 기능을 별도로 구성하세요. 각 모듈은 자체 사용자 지정 구성을 가질 수 있습니다.

활성화되면 `checkLegacyAbi` Gradle 태스크를 실행하여 바이너리 호환성 문제를 확인하세요. IntelliJ IDEA 또는 프로젝트 디렉토리의 명령줄에서 태스크를 실행할 수 있습니다:

```kotlin
./gradlew checkLegacyAbi
```

이 태스크는 현재 코드에서 ABI(Application Binary Interface) 덤프를 UTF-8 텍스트 파일로 생성합니다.
그런 다음 태스크는 새 덤프를 이전 릴리스의 덤프와 비교합니다. 차이점이 발견되면 오류로 보고합니다. 오류를 검토한 후 변경 사항이 허용된다고 결정하면 `updateLegacyAbi` Gradle 태스크를 실행하여 참조 ABI 덤프를 업데이트할 수 있습니다.

#### 클래스 필터링

이 기능은 ABI 덤프에서 클래스를 필터링할 수 있도록 합니다. 이름 또는 부분 이름, 또는 해당 클래스를 표시하는 어노테이션(또는 어노테이션 이름의 일부)으로 클래스를 명시적으로 포함하거나 제외할 수 있습니다.

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

바이너리 호환성 검증 도구 구성에 대한 자세한 내용은 [KGP API 참조](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/)를 참조하세요.

#### 멀티플랫폼 제한 사항

멀티플랫폼 프로젝트에서 호스트가 모든 타겟에 대한 교차 컴파일을 지원하지 않는 경우, KGP는 다른 타겟의 ABI 덤프를 확인하여 지원되지 않는 타겟의 ABI 변경 사항을 추론하려고 시도합니다. 이 접근 방식은 나중에 모든 타겟을 컴파일 **할 수 있는** 호스트로 전환할 때 잘못된 유효성 검사 실패를 방지하는 데 도움이 됩니다.

KGP가 지원되지 않는 타겟에 대한 ABI 변경 사항을 추론하지 않도록 이 기본 동작을 변경하려면 `build.gradle.kts` 파일에 다음을 추가하세요:

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

그러나 프로젝트에 지원되지 않는 타겟이 있는 경우, `checkLegacyAbi` 태스크는 ABI 덤프를 생성할 수 없으므로 실패합니다. 이 동작은 다른 타겟에서 추론된 ABI 변경으로 인해 호환되지 않는 변경을 놓치는 것보다 검사가 실패하는 것이 더 중요한 경우 바람직할 수 있습니다.

### Kotlin Gradle 플러그인 콘솔의 풍부한 출력 지원

Kotlin 2.2.0에서는 Gradle 빌드 프로세스 중 콘솔에서 색상 및 기타 풍부한 출력을 지원하여 보고된 진단 메시지를 더 쉽게 읽고 이해할 수 있도록 합니다.

풍부한 출력은 Linux 및 macOS에서 지원되는 터미널 에뮬레이터에서 사용할 수 있으며, Windows 지원을 추가하는 작업을 진행 중입니다.

![Gradle 콘솔](gradle-console-rich-output.png){width=600}

이 기능은 기본적으로 활성화되어 있지만, 재정의하려면 `gradle.properties` 파일에 다음 Gradle 프로퍼티를 추가하세요:

```
org.gradle.console=plain
```

이 프로퍼티 및 옵션에 대한 자세한 내용은 Gradle 문서의 [로그 형식 사용자 지정](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format)을 참조하세요.

### KGP 진단 기능 내 Problems API 통합

이전에는 Kotlin Gradle Plugin(KGP)이 경고 및 오류와 같은 진단 메시지를 콘솔 또는 로그에 일반 텍스트 출력으로만 보고할 수 있었습니다.

2.2.0부터 KGP는 추가 보고 메커니즘을 도입합니다: 이제 [Gradle의 Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html)를 사용합니다. 이는 빌드 프로세스 중에 풍부하고 구조화된 문제 정보를 보고하는 표준화된 방법입니다.

KGP 진단 메시지는 이제 Gradle CLI 및 IntelliJ IDEA와 같은 다양한 인터페이스에서 더 쉽게 읽고 일관되게 표시됩니다.

이 통합은 Gradle 8.6 이상부터 기본적으로 활성화됩니다.
API는 여전히 발전 중이므로, 최신 개선 사항을 활용하려면 가장 최신 Gradle 버전을 사용하세요.

### `--warning-mode`와의 KGP 호환성

Kotlin Gradle Plugin(KGP) 진단 메시지는 고정된 심각도 수준을 사용하여 문제를 보고했습니다.
즉, Gradle의 [`--warning-mode` 명령줄 옵션](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings)은 KGP가 오류를 표시하는 방식에 영향을 미치지 않았습니다.

이제 KGP 진단 메시지는 `--warning-mode` 옵션과 호환되어 더 많은 유연성을 제공합니다. 예를 들어,
모든 경고를 오류로 변환하거나 경고를 완전히 비활성화할 수 있습니다.

이 변경으로 KGP 진단 메시지는 선택된 경고 모드에 따라 출력을 조정합니다:

*   `--warning-mode=fail`로 설정하면 `Severity.Warning` 진단 메시지가 이제 `Severity.Error`로 격상됩니다.
*   `--warning-mode=none`로 설정하면 `Severity.Warning` 진단 메시지가 로그에 기록되지 않습니다.

이 동작은 2.2.0부터 기본적으로 활성화됩니다.

`--warning-mode` 옵션을 무시하려면 `gradle.properties` 파일에 다음 Gradle 프로퍼티를 설정하세요:

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 새로운 실험적 빌드 도구 API (BTA)
<primary-label ref="experimental-general"/>

Kotlin은 Gradle, Maven, Amper 등 다양한 빌드 시스템과 함께 사용할 수 있습니다. 그러나 Kotlin을 각 시스템에 통합하여 증분 컴파일, Kotlin 컴파일러 플러그인, 데몬, Kotlin 멀티플랫폼과의 호환성 등 모든 기능을 지원하려면 상당한 노력이 필요합니다.

이 프로세스를 단순화하기 위해 Kotlin 2.2.0은 새로운 실험적 빌드 도구 API (BTA)를 도입합니다. BTA는 빌드 시스템과 Kotlin 컴파일러 생태계 사이의 추상화 계층 역할을 하는 범용 API입니다. 이 접근 방식을 통해 각 빌드 시스템은 단일 BTA 진입점만 지원하면 됩니다.

현재 BTA는 Kotlin/JVM만 지원합니다. JetBrains의 Kotlin 팀은 이미 Kotlin Gradle 플러그인(KGP)과 `kotlin-maven-plugin`에서 이를 사용하고 있습니다. 이 플러그인을 통해 BTA를 사용해 볼 수 있지만, API 자체는 아직 자체 빌드 도구 통합에 사용할 준비가 되지 않았습니다. BTA 제안에 대해 궁금하거나 피드백을 공유하고 싶다면, [KEEP](https://github.com/Kotlin/KEEP/issues/421) 제안을 참조하세요.

BTA를 사용해 보려면:

*   KGP의 경우, `gradle.properties` 파일에 다음 프로퍼티를 추가하세요:

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```

*   Maven의 경우, 아무것도 할 필요가 없습니다. 기본적으로 활성화되어 있습니다.

BTA는 현재 Maven 플러그인에 직접적인 이점은 없지만, [Kotlin 데몬 지원](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) 및 [증분 컴파일 안정화](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven)와 같은 새로운 기능을 더 빠르게 제공하기 위한 견고한 기반을 마련합니다.

KGP의 경우 BTA를 사용하면 이미 다음과 같은 이점이 있습니다:

*   [개선된 "in process" 컴파일러 실행 전략](#improved-in-process-compiler-execution-strategy)
*   [Kotlin에서 다른 컴파일러 버전을 구성할 수 있는 유연성](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 개선된 "in process" 컴파일러 실행 전략

KGP는 세 가지 [Kotlin 컴파일러 실행 전략](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy)을 지원합니다.
이전에는 Gradle 데몬 프로세스 내에서 컴파일러를 실행하는 "in process" 전략이 증분 컴파일을 지원하지 않았습니다.

이제 BTA를 사용하면 "in-process" 전략이 증분 컴파일을 **지원**합니다. 이를 사용하려면 `gradle.properties` 파일에 다음 프로퍼티를 추가하세요:

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### Kotlin에서 다른 컴파일러 버전을 구성할 수 있는 유연성

때로는 빌드 스크립트 지원 중단 사항을 계속 처리하면서 새로운 언어 기능을 시도하기 위해, KGP는 이전 버전을 유지한 채 코드에서 더 새로운 Kotlin 컴파일러 버전을 사용하고 싶을 수 있습니다. 또는 KGP 버전을 업데이트하되 이전 Kotlin 컴파일러 버전을 유지하고 싶을 수도 있습니다.

BTA는 이를 가능하게 합니다. `build.gradle.kts` 파일에서 다음과 같이 구성할 수 있습니다:

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

BTA는 KGP와 Kotlin 컴파일러 버전을 이전 세 가지 주요 버전 및 다음 하나의 주요 버전과 함께 구성하는 것을 지원합니다. 따라서 KGP 2.2.0에서는 Kotlin 컴파일러 버전 2.1.x, 2.0.x 및 1.9.25가 지원됩니다. KGP 2.2.0은 또한 향후 Kotlin 컴파일러 버전 2.2.x 및 2.3.x와 호환됩니다.

그러나 다른 컴파일러 버전을 컴파일러 플러그인과 함께 사용하면 Kotlin 컴파일러 예외가 발생할 수 있다는 점을 명심하세요. Kotlin 팀은 향후 릴리스에서 이러한 종류의 문제를 해결할 계획입니다.

이 플러그인으로 BTA를 사용해 보고 [KGP](https://youtrack.jetbrains.com/issue/KT-56574) 및 [Maven 플러그인](https://youtrack.jetbrains.com/issue/KT-73012) 전용 YouTrack 티켓에 피드백을 보내주세요.

## Kotlin 표준 라이브러리

Kotlin 2.2.0에서 [`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/)와 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)는 이제 [Stable](components-stability.md#stability-levels-explained)입니다.

### Stable Base64 인코딩 및 디코딩

Kotlin 1.8.20은 [Base64 인코딩 및 디코딩에 대한 실험적 지원](whatsnew1820.md#support-for-base64-encoding)을 도입했습니다.
Kotlin 2.2.0에서 [Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/)는 이제 [Stable](components-stability.md#stability-levels-explained)이며,
이번 릴리스에 추가된 새로운 `Base64.Pem`을 포함하여 네 가지 인코딩 방식을 제공합니다:

*   [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/)는 표준 [Base64 인코딩 방식](https://www.rfc-editor.org/rfc/rfc4648#section-4)을 사용합니다.

    > `Base64.Default`는 `Base64` 클래스의 컴패니언 객체입니다.
    > 결과적으로 `Base64.Default.encode()` 및 `Base64.Default.decode()` 대신 `Base64.encode()` 및 `Base64.decode()`로 함수를 호출할 수 있습니다.
    >
    {style="tip"}

*   [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html)는 ["URL 및 파일명 안전"](https://www.rfc-editor.org/rfc/rfc4648#section-5) 인코딩 방식을 사용합니다.
*   [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html)은 [MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8)
    인코딩 방식을 사용하며, 인코딩 시 76자마다 줄 구분 기호를 삽입하고 디코딩 시 유효하지 않은 문자를 건너뜱니다.
*   `Base64.Pem`은 `Base64.Mime`처럼 데이터를 인코딩하지만 줄 길이를 64자로 제한합니다.

Base64 API를 사용하여 바이너리 데이터를 Base64 문자열로 인코딩하고 다시 바이트로 디코딩할 수 있습니다.

다음은 예시입니다:

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// Alternatively:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// Alternatively:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

JVM에서는 `.encodingWith()` 및 `.decodingWith()` 확장 함수를 사용하여 입력 및 출력 스트림으로 Base64를 인코딩 및 디코딩할 수 있습니다:

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

### `HexFormat` API를 사용한 Stable 16진수 파싱 및 포매팅

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)에서 도입된 [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/)는 이제 [Stable](components-stability.md#stability-levels-explained)입니다.
이를 사용하여 숫자 값과 16진수 문자열 간을 변환할 수 있습니다.

예시:

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

자세한 내용은 [새 HexFormat 클래스를 이용한 16진수 포매팅 및 파싱](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals)을 참조하세요.

## Compose 컴파일러

이번 릴리스에서 Compose 컴파일러는 컴포저블 함수 참조에 대한 지원을 도입하고 여러 기능 플래그의 기본값을 변경합니다.

### `@Composable` 함수 참조 지원

Compose 컴파일러는 Kotlin 2.2.0 릴리스부터 컴포저블 함수 참조의 선언 및 사용을 지원합니다:

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

컴포저블 함수 참조는 런타임에 컴포저블 람다 객체와 약간 다르게 동작합니다. 특히, 컴포저블 람다는 `ComposableLambda` 클래스를 확장하여 건너뛰기(skipping)에 대한 더 세밀한 제어를 허용합니다. 함수 참조는 `KCallable` 인터페이스를 구현할 것으로 예상되므로 동일한 최적화를 적용할 수 없습니다.

### `PausableComposition` 기능 플래그 기본 활성화

`PausableComposition` 기능 플래그는 Kotlin 2.2.0부터 기본적으로 활성화됩니다. 이 플래그는 다시 시작 가능한 함수에 대한 Compose 컴파일러 출력을 조정하여, 런타임이 건너뛰기 동작을 강제하고 각 함수를 건너뛰어 효과적으로 컴포지션을 일시 중지할 수 있도록 합니다. 이는 무거운 컴포지션을 프레임별로 분할할 수 있도록 허용하며, 향후 릴리스에서 프리페칭(prefetching)에 사용될 예정입니다.

이 기능 플래그를 비활성화하려면 Gradle 구성에 다음을 추가하세요:

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 기능 플래그 기본 활성화

`OptimizeNonSkippingGroups` 기능 플래그는 Kotlin 2.2.0부터 기본적으로 활성화됩니다. 이 최적화는 건너뛰지 않는(non-skipping) 컴포저블 함수에 대해 생성된 그룹 호출을 제거하여 런타임 성능을 향상시킵니다. 런타임에 눈에 띄는 동작 변경은 발생하지 않아야 합니다.

문제가 발생하는 경우, 이 변경이 문제의 원인인지 확인하려면 기능 플래그를 비활성화하여 검증할 수 있습니다. [Jetpack Compose 이슈 트래커](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 문제점을 보고해 주세요.

`OptimizeNonSkippingGroups` 플래그를 비활성화하려면 Gradle 구성에 다음을 추가하세요:

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 더 이상 사용되지 않는 기능 플래그

`StrongSkipping` 및 `IntrinsicRemember` 기능 플래그는 이제 더 이상 사용되지 않으며 향후 릴리스에서 제거될 예정입니다. 이러한 기능 플래그를 비활성화해야 하는 문제가 발생하면 [Jetpack Compose 이슈 트래커](https://issuetracker.google.com/issues/new?component=610764&template=1424126)에 보고해 주세요.

## 호환성이 깨지는 변경 사항 및 지원 중단

이 섹션에서는 주목할 만한 중요한 호환성이 깨지는 변경 사항 및 지원 중단 사항을 강조합니다. 이 릴리스의 모든 호환성이 깨지는 변경 사항 및 지원 중단 사항에 대한 전체 개요는 [호환성 가이드](compatibility-guide-22.md)를 참조하세요.

*   Kotlin 2.2.0부터 컴파일러는 [`-language-version=1.6` 또는 `-language-version=1.7`을 더 이상 지원하지 않습니다](compatibility-guide-22.md#drop-support-in-language-version-for-1-6-and-1-7). 1.8보다 오래된 언어 기능 세트는 지원되지 않지만 언어 자체는 Kotlin 1.0과 완전히 하위 호환됩니다.

*   [](ant.md) 빌드 시스템에 대한 지원이 중단됩니다. Ant에 대한 Kotlin 지원은 오랫동안 활발히 개발되지 않았으며, 상대적으로 작은 사용자 기반으로 인해 더 이상 유지보수할 계획이 없습니다.

    2.3.0에서는 Ant 지원을 제거할 계획입니다. 그러나 Kotlin은 [기여](contribute.md)에 열려 있습니다. Ant의 외부 유지보수자가 되는 데 관심이 있다면, [이 YouTrack 이슈](https://youtrack.jetbrains.com/issue/KT-75875/)에 "jetbrains-team" 가시성 설정을 사용하여 댓글을 남겨주세요.

*   Kotlin 2.2.0은 Gradle의 [`kotlinOptions{}` 블록의 지원 중단 수준을 오류로 상향](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)합니다.
    대신 `compilerOptions{}` 블록을 사용하세요. 빌드 스크립트 업데이트에 대한 지침은 [`kotlinOptions{}`에서 `compilerOptions{}`로 마이그레이션](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions)을 참조하세요.
*   Kotlin 스크립팅은 Kotlin 생태계의 중요한 부분으로 남아 있지만, 더 나은 경험을 제공하기 위해 사용자 지정 스크립팅과 `gradle.kts`, `main.kts` 스크립트와 같은 특정 사용 사례에 중점을 두고 있습니다.
    자세한 내용은 업데이트된 [블로그 게시물](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/)을 참조하세요. 결과적으로 Kotlin 2.2.0은 다음 지원을 중단합니다:

    *   REPL: `kotlinc`를 통해 REPL을 계속 사용하려면 `-Xrepl` 컴파일러 옵션으로 옵트인하세요.
    *   JSR-223: 이 [JSR](https://jcp.org/en/jsr/detail?id=223)은 **철회(Withdrawn)** 상태이므로, JSR-223 구현은 언어 버전 1.9와 계속 작동하지만 향후 K2 컴파일러를 사용하도록 마이그레이션되지 않습니다.
    *   `KotlinScriptMojo` Maven 플러그인: 이 플러그인에 대한 충분한 인기를 확인하지 못했습니다. 계속 사용하면 컴파일러 경고가 표시될 것입니다.
*   Kotlin 2.2.0에서 [`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#)의 [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 함수는 이제 [구성된 소스를 추가하는 대신 교체](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources)합니다.
    기존 소스를 교체하지 않고 추가하려면 [`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 함수를 사용하세요.
*   `BaseKapt`의 [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) 속성 타입이 [`MutableList<Any>`에서 `MutableList<CommandLineArgumentProvider>`로 변경](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)되었습니다. 코드가 현재 목록을 단일 요소로 추가하는 경우, `add()` 함수 대신 `addAll()` 함수를 사용하세요.
*   레거시 Kotlin/JS 백엔드에서 사용되던 dead code elimination (DCE) 도구의 지원 중단에 따라, DCE와 관련된 나머지 DSL은 Kotlin Gradle 플러그인에서 제거되었습니다:
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` 인터페이스
    *   `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 함수
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` 인터페이스
    *   `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` 인터페이스

    현재 [JS IR 컴파일러](js-ir-compiler.md)는 DCE를 기본적으로 지원하며, [`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) 어노테이션을 사용하여 DCE 중 유지할 Kotlin 함수와 클래스를 지정할 수 있습니다.

*   더 이상 사용되지 않는 `kotlin-android-extensions` 플러그인은 [Kotlin 2.2.0에서 제거](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)되었습니다.
    `Parcelable` 구현 생성기에는 `kotlin-parcelize` 플러그인을 사용하고, 합성 뷰(synthetic views)에는 Android Jetpack의 [뷰 바인딩](https://developer.android.com/topic/libraries/view-binding)을 사용하세요.
*   실험적 `kotlinArtifacts` API는 [Kotlin 2.2.0에서 지원 중단](compatibility-guide-22.md#deprecate-kotlinartifacts-api)되었습니다.
    최종 네이티브 바이너리를 [빌드](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)하려면 Kotlin Gradle 플러그인에서 현재 사용 가능한 DSL을 사용하세요. 마이그레이션에 충분하지 않다면, [이 YT 이슈](https://youtrack.jetbrains.com/issue/KT-74953)에 댓글을 남겨주세요.
*   Kotlin 1.9.0에서 지원 중단된 `KotlinCompilation.source`는 이제 [Kotlin Gradle 플러그인에서 제거](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)되었습니다.
*   실험적인 공통화 모드(commonization modes)의 파라미터는 [Kotlin 2.2.0에서 지원 중단](compatibility-guide-22.md#deprecate-commonization-parameters)되었습니다.
    유효하지 않은 컴파일 아티팩트를 삭제하려면 공통화 캐시를 지우세요.
*   지원 중단된 `konanVersion` 프로퍼티는 이제 [`CInteropProcess` 태스크에서 제거](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)되었습니다.
    대신 `CInteropProcess.kotlinNativeVersion`을 사용하세요.
*   지원 중단된 `destinationDir` 프로퍼티 사용은 이제 [오류를 발생](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)시킵니다.
    대신 `CInteropProcess.destinationDirectory.set()`을 사용하세요.

## 문서 업데이트

이번 릴리스에서는 Kotlin Multiplatform 문서가 [KMP 포털](https://kotlinlang.org/docs/multiplatform/get-started.html)로 마이그레이션되는 것을 포함하여 주목할 만한 문서 변경 사항이 있습니다.

또한 문서 설문조사를 시작하고, 새로운 페이지와 튜토리얼을 만들고, 기존 페이지를 개편했습니다.

### 새롭고 개편된 튜토리얼

*   [Kotlin 중급 투어](kotlin-tour-welcome.md) – Kotlin에 대한 이해를 다음 단계로 끌어올리세요. 확장 함수, 인터페이스, 클래스 등을 언제 사용해야 하는지 배우세요.
*   [Spring AI를 사용하는 Kotlin 앱 구축](spring-ai-guide.md) – OpenAI 및 벡터 데이터베이스를 사용하여 질문에 답변하는 Kotlin 앱을 만드는 방법을 배우세요.
*   [](jvm-create-project-with-spring-boot.md) – IntelliJ IDEA의 **새 프로젝트** 마법사를 사용하여 Gradle로 Spring Boot 프로젝트를 만드는 방법을 배우세요.
*   [Kotlin 및 C 매핑 튜토리얼 시리즈](mapping-primitive-data-types-from-c.md) – Kotlin과 C 간에 다른 타입 및 구성 요소가 어떻게 매핑되는지 배우세요.
*   [C interop 및 libcurl을 사용하여 앱 생성](native-app-with-c-and-libcurl.md) – libcurl C 라이브러리를 사용하여 네이티브로 실행할 수 있는 간단한 HTTP 클라이언트를 만드세요.
*   [Kotlin Multiplatform 라이브러리 생성](https://kotlinlang.org/docs/multiplatform/create-kotlin-multiplatform-library.html) – IntelliJ IDEA를 사용하여 멀티플랫폼 라이브러리를 생성하고 게시하는 방법을 배우세요.
*   [Ktor 및 Kotlin Multiplatform로 풀스택 애플리케이션 구축](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – 이 튜토리얼은 이제 Fleet 대신 IntelliJ IDEA를 Material 3 및 최신 버전의 Ktor와 Kotlin과 함께 사용합니다.
*   [Compose Multiplatform 앱에서 로컬 리소스 환경 관리](https://kotlinlang.org/docs/multiplatform/compose-resource-environment.html) – 인앱 테마 및 언어와 같은 애플리케이션의 리소스 환경을 관리하는 방법을 배우세요.

### 새롭고 개편된 페이지

*   [AI용 Kotlin 개요](kotlin-ai-apps-development-overview.md) – AI 기반 애플리케이션 구축을 위한 Kotlin의 기능을 알아보세요.
*   [Dokka 마이그레이션 가이드](https://kotlinlang.org/docs/dokka-migration.html) – Dokka Gradle 플러그인 v2로 마이그레이션하는 방법을 배우세요.
*   [](metadata-jvm.md) – JVM용으로 컴파일된 Kotlin 클래스에 대한 메타데이터를 읽고, 수정하고, 생성하는 지침을 살펴보세요.
*   [CocoaPods 통합](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – 튜토리얼과 샘플 프로젝트를 통해 환경 설정, Pod 종속성 추가 또는 Kotlin 프로젝트를 CocoaPod 종속성으로 사용하는 방법을 배우세요.
*   iOS Stable 릴리스를 지원하기 위한 Compose Multiplatform의 새로운 페이지:
    *   특히 [내비게이션](https://kotlinlang.org/docs/multiplatform/compose-navigation.html) 및 [딥 링크](https://kotlinlang.org/docs/multiplatform/compose-navigation-deep-links.html).
    *   [Compose에서 레이아웃 구현](https://kotlinlang.org/docs/multiplatform/compose-layout.html).
    *   [문자열 현지화](https://kotlinlang.org/docs/multiplatform/compose-localize-strings.html) 및 RTL 언어 지원과 같은 기타 i18n 페이지.
*   [Compose Hot Reload](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html) – 데스크톱 타겟에서 Compose Hot Reload를 사용하는 방법과 기존 프로젝트에 추가하는 방법을 배우세요.
*   [Exposed 마이그레이션](https://www.jetbrains.com/help/exposed/migrations.html) – 데이터베이스 스키마 변경 관리를 위해 Exposed가 제공하는 도구에 대해 배우세요.

## Kotlin 2.2.0으로 업데이트하는 방법

Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio에 번들 플러그인으로 배포됩니다.

새로운 Kotlin 버전으로 업데이트하려면 빌드 스크립트에서 Kotlin 버전을 2.2.0으로 [변경](releases.md#update-to-a-new-kotlin-version)하세요.