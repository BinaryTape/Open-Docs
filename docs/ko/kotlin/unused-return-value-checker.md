[//]: # (title: 사용되지 않는 반환 값 검사기)

<primary-label ref="experimental-general"/>

> 이 기능은 향후 Kotlin 릴리스에서 안정화되고 개선될 예정입니다.
> 저희 이슈 트래커 [YouTrack](https://youtrack.jetbrains.com/issue/KT-12719)에 피드백을 주시면 감사하겠습니다.
>
> 자세한 내용은 관련 [KEEP 제안](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0412-unused-return-value-checker.md)을 참조하세요.
>
{style="note"}

사용되지 않는 반환 값 검사기는 _무시된 결과_를 감지할 수 있도록 합니다.
이는 `Unit`, `Nothing` 또는 `Nothing?` 이외의 것을 생성하는 표현식에서 반환된 값이며 다음 중 하나에 해당하지 않는 경우입니다.

*   변수나 프로퍼티에 저장된 경우.
*   반환되거나 예외로 던져진 경우.
*   다른 함수에 인수로 전달된 경우.
*   호출 또는 안전 호출에서 리시버로 사용된 경우.
*   `if`, `when`, `while`과 같은 조건에서 확인된 경우.
*   람다의 마지막 문으로 사용된 경우.

검사기는 `++` 및 `--`와 같은 증감 연산이나, 오른쪽 부분이 현재 함수를 종료하는 부울 단축 평가(`condition || return`과 같은)에 대해서는 무시된 결과를 보고하지 않습니다.

사용되지 않는 반환 값 검사기를 사용하여 함수 호출이 의미 있는 결과를 생성하지만 해당 결과가 묵묵히 버려지는 버그를 잡아낼 수 있습니다.
이는 예기치 않은 동작을 방지하고 이러한 문제를 더 쉽게 추적하는 데 도움이 됩니다.

다음은 문자열이 생성되었지만 전혀 사용되지 않아 검사기가 이를 무시된 결과로 보고하는 예시입니다.

```kotlin
fun formatGreeting(name: String): String {
    if (name.isBlank()) return "Hello, anonymous user!"
    if (!name.contains(' ')) {
        // 검사기는 이 결과가 무시됨을 경고합니다:
        // "'plus'의 사용되지 않는 반환 값"
        "Hello, " + name.replaceFirstChar(Char::titlecase) + "!"
    }
    val (first, last) = name.split(' ')
    return "Hello, $first! Or should I call you Dr. $last?"
}
```

## 사용되지 않는 반환 값 검사기 구성

`-Xreturn-value-checker` 컴파일러 옵션을 사용하여 컴파일러가 무시된 결과를 보고하는 방식을 제어할 수 있습니다.

다음 모드를 지원합니다.

*   `disable`은 사용되지 않는 반환 값 검사기를 비활성화합니다(기본값).
*   `check`는 검사기를 활성화하고, [표시된 함수](#mark-functions-to-check-ignored-results)에서 무시된 결과에 대해 경고를 보고합니다.
*   `full`은 검사기를 활성화하고, 프로젝트의 모든 함수를 [표시된](#mark-functions-to-check-ignored-results) 것으로 처리하며, 무시된 결과에 대해 경고를 보고합니다.

> 모든 표시된 함수는 그대로 전파되며, 귀하의 코드를 의존성으로 사용하는 프로젝트에서 검사기가 활성화된 경우 무시된 결과가 보고됩니다.
>
{style="note"}

프로젝트에서 사용되지 않는 반환 값 검사기를 사용하려면 빌드 구성 파일에 컴파일러 옵션을 추가하세요.

<tabs>
<tab id="kotlin" title="Gradle">

```kotlin
// build.gradle(.kts)
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xreturn-value-checker=check")
    }
}
```
</tab>

<tab id="maven" title="Maven">

```xml
<!-- pom.xml -->
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    ..
    <configuration>
        <args>
            <arg>-Xreturn-value-checker=check</arg>
        </args>
    </configuration>
</plugin>
```

</tab>
</tabs>

## 무시된 결과를 확인할 함수 표시

[`-Xreturn-value-checker` 컴파일러 옵션](#configure-the-unused-return-value-checker)을 `check`로 설정하면, 검사기는 Kotlin 표준 라이브러리의 대부분의 함수와 마찬가지로 표시된 표현식에서만 무시된 결과를 보고합니다.

자체 코드를 표시하려면 [`@MustUseReturnValues`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-must-use-return-value/) 어노테이션을 사용하세요.
검사기가 다루기를 원하는 범위에 따라 파일, 클래스 또는 함수에 적용할 수 있습니다.

예를 들어, 전체 파일을 표시할 수 있습니다.

```kotlin
// 이 파일의 모든 함수와 클래스를 표시하여 검사기가 사용되지 않는 반환 값을 보고하도록 합니다.
@file:MustUseReturnValues

package my.project

fun someFunction(): String
```

또는 특정 클래스를 표시할 수 있습니다.

```kotlin
// 이 클래스의 모든 함수를 표시하여 검사기가 사용되지 않는 반환 값을 보고하도록 합니다.
@MustUseReturnValues
class Greeter {
    fun greet(name: String): String = "Hello, $name"
}

fun someFunction(): Int = ...
```

> `-Xreturn-value-checker` 컴파일러 옵션을 `full`로 설정하여 검사기를 전체 프로젝트에 적용할 수 있습니다.
> 이 옵션을 사용하면 코드에 `@MustUseReturnValues` 어노테이션을 달 필요가 없습니다.
>
{style="note"}

## 무시된 결과 보고서 억제

특정 함수를 [`@IgnorableReturnValue`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-ignorable-return-value/) 어노테이션으로 표시하여 해당 함수에 대한 보고서를 억제할 수 있습니다.
`MutableList.add`와 같이 결과 무시가 일반적이고 예상되는 함수에 어노테이션을 적용하세요.

```kotlin
@IgnorableReturnValue
fun <T> MutableList<T>.addAndIgnoreResult(element: T): Boolean {
    return add(element)
}
```

함수 자체에 어노테이션을 적용하지 않고도 경고를 억제할 수 있습니다.
이를 위해 결과를 밑줄 구문(`_`)을 사용하여 특수 익명 변수에 할당합니다.

```kotlin
// 무시할 수 없는 함수
fun computeValue(): Int = 42

fun main() {

    // 경고 보고: 결과가 무시됨
    computeValue()

    // 이 호출 지점에서만 특수 미사용 변수로 경고 억제
    val _ = computeValue()
}
```

### 함수 오버라이드에서의 무시된 결과

함수를 오버라이드할 때, 오버라이드된 함수는 기본 선언의 어노테이션에 의해 정의된 보고 규칙을 상속합니다.
이는 기본 선언이 Kotlin 표준 라이브러리 또는 다른 라이브러리 의존성의 일부인 경우에도 적용되므로, 검사기는 `Any.hashCode()`와 같은 함수의 오버라이드에 대해서도 무시된 결과를 보고합니다.

또한, `@IgnorableReturnValue`로 표시된 함수를 [반환 값 사용이 필요한](#mark-functions-to-check-ignored-results) 다른 함수로 오버라이드할 수 없습니다.
하지만 결과가 안전하게 무시될 수 있는 경우, `@MustUseReturnValues` 어노테이션이 지정된 클래스나 인터페이스 내에서 `@IgnorableReturnValue`로 오버라이드된 함수를 표시할 수 있습니다.

```kotlin
@MustUseReturnValues
interface Greeter {
    fun greet(name: String): String
}

object SilentGreeter : Greeter {
    @IgnorableReturnValue
    override fun greet(name: String): String = ""
}

fun check(g: Greeter) {
    // 경고 보고: 사용되지 않는 반환 값
    g.greet("John")

    // 경고 없음
    SilentGreeter.greet("John")
}
```

## Java 어노테이션과의 상호 운용성

일부 Java 라이브러리는 다른 어노테이션으로 유사한 메커니즘을 사용합니다.
사용되지 않는 반환 값 검사기는 다음 어노테이션들을 `@MustUseReturnValues`를 사용하는 것과 동등하게 처리합니다.

*   [`com.google.errorprone.annotations.CheckReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CheckReturnValue.html)
*   [`edu.umd.cs.findbugs.annotations.CheckReturnValue`](https://findbugs.sourceforge.net/api/edu/umd/cs/findbugs/annotations/CheckReturnValue.html)
*   [`org.jetbrains.annotations.CheckReturnValue`](https://javadoc.io/doc/org.jetbrains/annotations/latest/org/jetbrains/annotations/CheckReturnValue.html)
*   [`org.springframework.lang.CheckReturnValue`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/lang/CheckReturnValue.html)
*   [`org.jooq.CheckReturnValue`](https://www.jooq.org/javadoc/latest/org.jooq/org/jooq/CheckReturnValue.html)

또한 [`com.google.errorprone.annotations.CanIgnoreReturnValue`](https://errorprone.info/api/latest/com/google/errorprone/annotations/CanIgnoreReturnValue.html)를 `@IgnorableReturnValue`를 사용하는 것과 동등하게 처리합니다.