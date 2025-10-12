`[//]: # (title: Kotlin %kotlinEapVersion%의 새로운 기능)`

_[릴리스 날짜: %kotlinEapReleaseDate%](eap.md#build-details)_

> 이 문서는 얼리 액세스 프리뷰(EAP) 릴리스의 모든 기능을 다루지는 않지만,
> 몇 가지 주요 개선 사항을 강조합니다.
>
> 전체 변경 사항 목록은 [GitHub 변경 로그](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)를 참조하세요.
>
{style="note"}

Kotlin %kotlinEapVersion% 릴리스가 출시되었습니다! 다음은 이 EAP 릴리스의 세부 정보입니다:

*   [기능 안정화: 중첩 타입 별칭, `when`의 완전성 검사, 새로운 시간 추적 기능](#stable-features)
*   [언어: 사용되지 않는 반환 값을 위한 새로운 검사기 및 컨텍스트에 민감한 해결 변경 사항](#language)
*   [Kotlin/Native: 디버그 모드에서 제네릭 타입 경계에 대한 타입 검사가 기본적으로 활성화됨](#kotlin-native-type-checks-on-generic-type-boundaries-in-debug-mode)

## IDE 지원

Kotlin %kotlinEapVersion%을(를) 지원하는 Kotlin 플러그인은 IntelliJ IDEA 및 Android Studio의 최신 버전에 번들로 제공됩니다.
IDE에서 Kotlin 플러그인을 업데이트할 필요가 없습니다.
빌드 스크립트에서 Kotlin 버전을 %kotlinEapVersion%(으)로 [변경하기만](configure-build-for-eap.md) 하면 됩니다.

자세한 내용은 [새 릴리스로 업데이트](releases.md#update-to-a-new-kotlin-version)를 참조하세요.

## 안정적인 기능

이전 Kotlin 릴리스에서는 몇 가지 새로운 언어 및 표준 라이브러리 기능이 실험적(Experimental) 및 베타(Beta)로 도입되었습니다.
이번 릴리스에서는 다음 기능이 [안정적(Stable)](components-stability.md#stability-levels-explained) 상태가 되었음을 발표하게 되어 기쁩니다:

*   [중첩 타입 별칭 지원](whatsnew22.md#support-for-nested-type-aliases)
*   [`when` 표현식을 위한 데이터 흐름 기반의 완전성 검사](whatsnew2220.md#data-flow-based-exhaustiveness-checks-for-when-expressions)
*   [새로운 시간 추적 기능: `kotlin.time.Clock` 및 `kotlin.time.Instant`](whatsnew2120.md#new-time-tracking-functionality)

[Kotlin 언어 디자인 기능 및 제안의 전체 목록](kotlin-language-features-and-proposals.md)을 참조하세요.

## 언어

Kotlin %kotlinEapVersion%은 사용되지 않는 반환 값을 위한 새로운 검사 메커니즘을 도입하고
컨텍스트에 민감한 해결 개선에 중점을 둡니다.

### 사용되지 않는 반환 값 검사기
<primary-label ref="experimental-general"/>

Kotlin %kotlinEapVersion%은 사용되지 않는 반환 값 검사기라는 새로운 기능을 도입합니다.
이 기능은 표현식이 `Unit` 또는 `Nothing` 이외의 값을 반환하고 해당 값이 함수에 전달되지 않거나,
조건에서 확인되지 않거나, 다른 방식으로 사용되지 않을 때 경고를 표시합니다.

이 기능을 사용하여 함수 호출이 의미 있는 결과를 생성하지만 그 결과가 소리 없이 삭제되어
예상치 못한 동작이나 추적하기 어려운 문제로 이어질 수 있는 버그를 포착하는 데 사용할 수 있습니다.

> 이 검사기는 `++` 및 `--`와 같은 증가 연산에서 반환되는 값을 무시합니다.
>
{style="note"}

다음 예시를 고려해 보세요:

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 검사기는 이 결과가 무시된다는 경고를 보고합니다.
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

이 예시에서는 문자열이 생성되었지만 전혀 사용되지 않으므로, 검사기는 이를 무시된 결과로 보고합니다.

이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다.
옵트인(opt-in)하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```

이 옵션을 사용하면 검사기는 Kotlin 표준 라이브러리의 대부분의 함수처럼 표시된 표현식에서만 무시된 결과를 보고합니다.

함수를 표시하려면 `@MustUseReturnValues` 애노테이션을 사용하여 검사기가 무시된 반환 값을 보고하도록 하려는 범위를 표시하세요.

예를 들어, 전체 파일을 표시할 수 있습니다:

```kotlin
// 이 파일의 모든 함수와 클래스를 표시하여 검사기가 사용되지 않는 반환 값을 보고합니다.
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

또는 특정 클래스를 표시할 수 있습니다:

```kotlin
// 이 클래스의 모든 함수를 표시하여 검사기가 사용되지 않는 반환 값을 보고합니다.
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```
{validate="false"}

`full` 모드를 사용하여 전체 프로젝트를 표시할 수도 있습니다.
이렇게 하려면 `build.gradle.kts` 파일에 다음 컴파일러 옵션을 추가하세요:

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=full")
    }
}
```

이 모드에서 Kotlin은 컴파일된 파일에 `@MustUseReturnValues` 애노테이션이 적용된 것처럼 자동 처리하므로,
검사기는 프로젝트 함수의 모든 반환 값에 적용됩니다.

`@IgnorableReturnValue` 애노테이션으로 특정 함수에 경고를 억제할 수 있습니다.
`MutableList.add`와 같이 결과 무시가 일반적이고 예상되는 함수에 애노테이션을 적용하세요:

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```
함수 자체를 무시할 수 있다고 표시하지 않고도 경고를 억제할 수 있습니다.
이렇게 하려면 밑줄 구문(`_`)을 사용하는 특별한 이름 없는 변수에 결과를 할당하세요:

```kotlin
// 무시할 수 없는 함수
fun computeValue(): Int = 42

fun main() {

    // 경고를 보고합니다: 결과가 무시됩니다.
    computeValue()

    // 특별한 사용되지 않는 변수로 이 호출 위치에서만 경고를 억제합니다.
    val _ = computeValue()
}
```

[YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)에 피드백을 주시면 감사하겠습니다. 자세한 내용은 이 기능의 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)을 참조하세요.

### 컨텍스트에 민감한 해결 변경 사항
<primary-label ref="experimental-general"/>

> 이 기능의 코드 분석, 코드 완성, IntelliJ IDEA에서의 하이라이팅 지원은 현재
> [2025.3 EAP 빌드](https://www.jetbrains.com/idea/nextversion/)에서만 사용 가능합니다.
>
{style = "note"}

컨텍스트에 민감한 해결은 여전히 [실험적](components-stability.md#stability-levels-explained)이지만,
사용자 피드백을 기반으로 기능을 계속 개선하고 있습니다:

*   현재 타입의 sealed 및 둘러싸는 상위 타입이 이제 검색의 컨텍스트 범위의 일부로 간주됩니다.
    다른 상위 타입 범위는 고려되지 않습니다.
*   타입 연산자 및 등가성을 사용하는 경우, 컴파일러는 컨텍스트에 민감한 해결을 사용하면
    해결 모호성이 발생할 때 경고를 보고합니다. 이는 예를 들어, 클래스의 충돌하는 선언이 임포트될 때 발생할 수 있습니다.

자세한 내용은 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0379-context-sensitive-resolution.md)에서 현재 제안의 전체 텍스트를 참조하세요.

## Kotlin/Native: 디버그 모드에서 제네릭 타입 경계에 대한 타입 검사

Kotlin %kotlinEapVersion%부터 디버그 모드에서 제네릭 타입 경계에 대한 타입 검사가 기본적으로 활성화되어,
비검사 캐스트(unchecked casts)와 관련된 오류를 더 일찍 찾을 수 있도록 돕습니다. 이 변경 사항은 안전성을 개선하고 유효하지 않은
제네릭 캐스트 디버깅을 플랫폼 전반에 걸쳐 더 예측 가능하게 만듭니다.

이전에는 힙 오염(heap pollution) 및 메모리 안전성 위반으로 이어지는 비검사 캐스트가 Kotlin/Native에서 인지되지 않을 수 있었습니다.
이제 이러한 경우 Kotlin/JVM 또는 Kotlin/JS와 유사하게 런타임 캐스트 오류로 일관되게 실패합니다. 예를 들어:

```kotlin
fun main() {
    val list = listOf("hello")
    val x = (list as List<Int>)[0]
    println(x) // 이제 ClassCastException 오류를 발생시킵니다.
}
```

이 코드는 이전에는 `6`을 출력했지만, 이제는 예상대로 디버그 모드에서 `ClassCastException` 오류를 발생시킵니다.

자세한 내용은 [타입 검사 및 캐스트](typecasts.md)를 참조하세요.

## Gradle: Kotlin/JVM 컴파일이 기본적으로 Build tools API를 사용합니다
<primary-label ref="experimental-general"/>

Kotlin 2.3.0-Beta1에서 Kotlin Gradle 플러그인의 Kotlin/JVM 컴파일은 기본적으로 [Build tools API](build-tools-api.md)(BTA)를 사용합니다.
이는 내부 컴파일 인프라의 중요한 변경 사항입니다.

이번 릴리스에서 BTA를 기본값으로 설정하여 테스트할 시간을 가질 수 있도록 했습니다. 모든 것이 이전과 같이 계속 작동할 것으로 예상합니다.
문제가 발견되면 [이슈 트래커](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)에 피드백을 공유해 주세요.

Kotlin/JVM 컴파일을 위한 BTA는 2.3.0-Beta2에서 다시 비활성화하고,
Kotlin 2.3.20부터 모든 사용자를 위해 완전히 활성화할 계획입니다.