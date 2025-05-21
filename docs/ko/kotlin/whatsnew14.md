---
title: "Kotlin 1.4.0의 새로운 기능"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[릴리스: 2020년 8월 17일](releases#release-details)_

Kotlin 1.4.0에서는 모든 구성 요소에서 여러 가지 개선 사항을 제공하며, [품질 및 성능에 중점을 둡니다](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/).
아래에서 Kotlin 1.4.0의 가장 중요한 변경 사항 목록을 확인할 수 있습니다.

## 언어 기능 및 개선 사항

Kotlin 1.4.0은 다양한 언어 기능 및 개선 사항을 제공합니다. 내용은 다음과 같습니다.

* [Kotlin 인터페이스에 대한 SAM 변환](#sam-conversions-for-kotlin-interfaces)
* [라이브러리 작성자를 위한 명시적 API 모드](#explicit-api-mode-for-library-authors)
* [명명된 인수와 위치 인수의 혼합](#mixing-named-and-positional-arguments)
* [후행 쉼표](#trailing-comma)
* [호출 가능 참조 개선 사항](#callable-reference-improvements)
* [루프에 포함된 when 내에서 break 및 continue 사용](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 인터페이스에 대한 SAM 변환

Kotlin 1.4.0 이전에는 Kotlin에서 Java 메서드 및 Java 인터페이스로 작업할 때만 SAM(Single Abstract Method) 변환을 적용할 수 있었습니다([Java 상호 운용성#sam-conversions](java-interop#sam-conversions)). 이제 Kotlin 인터페이스에도 SAM 변환을 사용할 수 있습니다.
이렇게 하려면 `fun` 수정자를 사용하여 Kotlin 인터페이스를 명시적으로 functional로 표시합니다.

SAM 변환은 추상 메서드가 하나만 있는 인터페이스가 매개변수로 필요한 경우 람다를 인수로 전달하면 적용됩니다. 이 경우 컴파일러는 람다를 추상 멤버 함수를 구현하는 클래스의 인스턴스로 자동 변환합니다.

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```

[Kotlin functional 인터페이스 및 SAM 변환에 대해 자세히 알아보세요](fun-interfaces).

### 라이브러리 작성자를 위한 명시적 API 모드

Kotlin 컴파일러는 라이브러리 작성자를 위한 _명시적 API 모드_를 제공합니다. 이 모드에서 컴파일러는 라이브러리의 API를 더 명확하고 일관성 있게 만드는 데 도움이 되는 추가 검사를 수행합니다. 라이브러리의 공개 API에 노출되는 선언에 대한 다음 요구 사항을 추가합니다.

* 기본 표시 유형이 공개 API에 노출하는 경우 선언에 표시 유형 수정자가 필요합니다.
이렇게 하면 공개 API에 의도치 않게 선언이 노출되지 않도록 할 수 있습니다.
* 공개 API에 노출되는 속성 및 함수에 대한 명시적 유형 지정이 필요합니다.
이렇게 하면 API 사용자가 사용하는 API 멤버의 유형을 알 수 있습니다.

구성 방법에 따라 이러한 명시적 API는 오류(_strict_ 모드) 또는 경고(_warning_ 모드)를 생성할 수 있습니다.
가독성 및 상식적인 이유로 특정 종류의 선언은 이러한 검사에서 제외됩니다.

* 기본 생성자
* 데이터 클래스의 속성
* 속성 getter 및 setter
* `override` 메서드

명시적 API 모드는 모듈의 프로덕션 소스만 분석합니다.

명시적 API 모드에서 모듈을 컴파일하려면 Gradle 빌드 스크립트에 다음 줄을 추가합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {    
    // strict 모드의 경우
    explicitApi() 
    // 또는
    explicitApi = ExplicitApiMode.Strict
    
    // warning 모드의 경우
    explicitApiWarning()
    // 또는
    explicitApi = ExplicitApiMode.Warning
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {    
    // strict 모드의 경우
    explicitApi() 
    // 또는
    explicitApi = 'strict'
    
    // warning 모드의 경우
    explicitApiWarning()
    // 또는
    explicitApi = 'warning'
}
```

</TabItem>
</Tabs>

명령줄 컴파일러를 사용하는 경우 `-Xexplicit-api` 컴파일러 옵션을 사용하여 명시적 API 모드로 전환합니다.
값은 `strict` 또는 `warning`입니다.

```bash
-Xexplicit-api=\{strict|warning\}
```

[KEEP에서 명시적 API 모드에 대한 자세한 내용을 확인하세요](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode).

### 명명된 인수와 위치 인수의 혼합

Kotlin 1.3에서는 [명명된 인수](functions#named-arguments)로 함수를 호출할 때 이름이 없는 모든 인수(위치 인수)를 첫 번째 명명된 인수 앞에 배치해야 했습니다. 예를 들어 `f(1, y = 2)`를 호출할 수 있었지만 `f(x = 1, 2)`는 호출할 수 없었습니다.

모든 인수가 올바른 위치에 있지만 중간에 있는 인수 하나의 이름을 지정하려는 경우 정말 짜증났습니다.
부울 또는 `null` 값이 어떤 속성에 속하는지 명확하게 하는 데 특히 유용했습니다.

Kotlin 1.4에서는 이러한 제한이 없습니다. 이제 위치 인수 집합의 중간에 있는 인수의 이름을 지정할 수 있습니다. 또한 올바른 순서로 유지되는 한 위치 인수와 명명된 인수를 원하는 방식으로 혼합할 수 있습니다.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//중간에 명명된 인수가 있는 함수 호출
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 후행 쉼표

Kotlin 1.4를 사용하면 인수 및 매개변수 목록, `when` 항목 및 구조 분해 선언의 구성 요소와 같은 열거형에 후행 쉼표를 추가할 수 있습니다.
후행 쉼표를 사용하면 쉼표를 추가하거나 제거하지 않고도 새 항목을 추가하고 해당 순서를 변경할 수 있습니다.

이는 매개변수 또는 값에 다중 줄 구문을 사용하는 경우 특히 유용합니다. 후행 쉼표를 추가한 후 매개변수 또는 값이 있는 줄을 쉽게 바꿀 수 있습니다.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //후행 쉼표
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //후행 쉼표
)
```

### 호출 가능 참조 개선 사항

Kotlin 1.4는 호출 가능 참조를 사용하는 더 많은 사례를 지원합니다.

* 기본 인수 값이 있는 함수에 대한 참조
* `Unit`을 반환하는 함수의 함수 참조
* 함수에서 인수 수에 따라 조정되는 참조
* 호출 가능 참조에 대한 일시 중단 변환

#### 기본 인수 값이 있는 함수에 대한 참조

이제 기본 인수 값이 있는 함수에 대한 호출 가능 참조를 사용할 수 있습니다. 함수 `foo`에 대한 호출 가능 참조가 인수를 사용하지 않으면 기본값 `0`이 사용됩니다.

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () `->` String): String = func()

fun main() {
    println(apply(::foo))
}
```

이전에는 기본 인수 값을 사용하려면 함수 `apply`에 대한 추가 오버로드를 작성해야 했습니다.

```kotlin
// 일부 새 오버로드
fun applyInt(func: (Int) `->` String): String = func(0) 
```

#### Unit을 반환하는 함수의 함수 참조

Kotlin 1.4에서는 `Unit`을 반환하는 함수에서 모든 유형을 반환하는 함수에 대한 호출 가능 참조를 사용할 수 있습니다.
Kotlin 1.4 이전에는 이 경우에 람다 인수만 사용할 수 있었습니다. 이제 람다 인수와 호출 가능 참조를 모두 사용할 수 있습니다.

```kotlin
fun foo(f: () `->` Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // 이것이 1.4 이전에는 유일한 방법이었습니다.
    foo(::returnsInt) // 1.4부터는 이것도 작동합니다.
}
```

#### 함수에서 인수 수에 따라 조정되는 참조

이제 가변 개수의 인수(`vararg`)를 전달할 때 함수에 대한 호출 가능 참조를 조정할 수 있습니다.
전달된 인수 목록의 끝에 동일한 유형의 매개변수를 원하는 만큼 전달할 수 있습니다.

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) `->` Unit) {}
fun use1(f: (Int, String) `->` Unit) {}
fun use2(f: (Int, String, String) `->` Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 호출 가능 참조에 대한 일시 중단 변환

람다에 대한 일시 중단 변환 외에도 Kotlin은 버전 1.4.0부터 호출 가능 참조에 대한 일시 중단 변환을 지원합니다.

```kotlin
fun call() {}
fun takeSuspend(f: suspend () `->` Unit) {}

fun test() {
    takeSuspend { call() } // 1.4 이전에는 OK
    takeSuspend(::call) // Kotlin 1.4에서는 이것도 작동합니다.
}
```

### 루프에 포함된 when 식 내에서 break 및 continue 사용

Kotlin 1.3에서는 루프에 포함된 `when` 식 내에서 비정규화된 `break` 및 `continue`를 사용할 수 없었습니다. 그 이유는 이러한 키워드가 `when` 식에서 가능한 [fall-through 동작](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)을 위해 예약되었기 때문입니다.

따라서 루프에서 `when` 식 내에서 `break` 및 `continue`를 사용하려면 [레이블](returns#break-and-continue-labels)을 지정해야 했기 때문에 상당히 번거로웠습니다.

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 `->` continue@LOOP
            17 `->` break@LOOP
            else `->` println(x)
        }
    }
}
```

Kotlin 1.4에서는 루프에 포함된 `when` 식 내에서 레이블 없이 `break` 및 `continue`를 사용할 수 있습니다. 이러한 키워드는 가장 가까운 둘러싸는 루프를 종료하거나 다음 단계로 진행하여 예상대로 작동합니다.

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 `->` continue
            17 `->` break
            else `->` println(x)
        }
    }
}
```

`when` 내부의 fall-through 동작은 추가 설계를 거칩니다.

## IDE의 새로운 도구

Kotlin 1.4에서는 IntelliJ IDEA에서 새로운 도구를 사용하여 Kotlin 개발을 간소화할 수 있습니다.

* [새로운 유연한 프로젝트 마법사](#new-flexible-project-wizard)
* [코루틴 디버거](#coroutine-debugger)

### 새로운 유연한 프로젝트 마법사

유연한 새로운 Kotlin 프로젝트 마법사를 사용하면 UI 없이 구성하기 어려울 수 있는 멀티 플랫폼 프로젝트를 포함하여 다양한 유형의 Kotlin 프로젝트를 쉽게 만들고 구성할 수 있습니다.

<img src="/img/multiplatform-project-1-wn.png" alt="Kotlin 프로젝트 마법사 – 멀티 플랫폼 프로젝트" style={{verticalAlign: 'middle'}}/>

새로운 Kotlin 프로젝트 마법사는 간단하고 유연합니다.

1. 수행하려는 작업에 따라 *프로젝트 템플릿을 선택합니다*. 앞으로 더 많은 템플릿이 추가될 예정입니다.
2. *빌드 시스템*을 선택합니다. Gradle(Kotlin 또는 Groovy DSL), Maven 또는 IntelliJ IDEA입니다.
    Kotlin 프로젝트 마법사는 선택한 프로젝트 템플릿에서 지원되는 빌드 시스템만 표시합니다.
3. 기본 화면에서 *프로젝트 구조를 직접 미리 봅니다*.

그런 다음 프로젝트 생성을 완료하거나 선택적으로 다음 화면에서 *프로젝트를 구성할 수 있습니다*.

4. 이 프로젝트 템플릿에서 지원되는 *모듈 및 대상 추가/제거*.
5. 대상 JVM 버전, 대상 템플릿 및 테스트 프레임워크와 같은 *모듈 및 대상 설정을 구성합니다*.

<img src="/img/multiplatform-project-2-wn.png" alt="Kotlin 프로젝트 마법사 - 대상 구성" style={{verticalAlign: 'middle'}}/>

앞으로 더 많은 구성 옵션과 템플릿을 추가하여 Kotlin 프로젝트 마법사를 더욱 유연하게 만들 것입니다.

다음 튜토리얼을 통해 새로운 Kotlin 프로젝트 마법사를 사용해 볼 수 있습니다.

* [Kotlin/JVM을 기반으로 콘솔 애플리케이션 만들기](jvm-get-started)
* [React용 Kotlin/JS 애플리케이션 만들기](js-react)
* [Kotlin/Native 애플리케이션 만들기](native-get-started)

### 코루틴 디버거

많은 사람들이 이미 비동기 프로그래밍에 [코루틴](coroutines-guide)을 사용하고 있습니다.
그러나 디버깅에 관해서는 Kotlin 1.4 이전의 코루틴 작업은 정말 고통스러울 수 있었습니다. 코루틴이 스레드 간에 점프하기 때문에
특정 코루틴이 무엇을 하고 있는지 이해하고 컨텍스트를 확인하기가 어려웠습니다. 경우에 따라 중단점을 통해 단계를 추적하는 것이 작동하지 않았습니다. 결과적으로 코루틴을 사용하는 코드를 디버깅하려면 로깅 또는 정신적 노력에 의존해야 했습니다.

Kotlin 1.4에서는 Kotlin 플러그인과 함께 제공되는 새로운 기능을 통해 코루틴 디버깅이 훨씬 더 편리해졌습니다.

:::note
디버깅은 `kotlinx-coroutines-core` 버전 1.3.8 이상에서 작동합니다.

:::

**디버그 도구 창**에는 이제 새로운 **코루틴** 탭이 있습니다. 이 탭에서 현재
실행 중인 코루틴과 일시 중단된 코루틴에 대한 정보를 찾을 수 있습니다. 코루틴은 실행 중인 디스패처별로 그룹화됩니다.

<img src="/img/coroutine-debugger-wn.png" alt="코루틴 디버깅" style={{verticalAlign: 'middle'}}/>

이제 다음을 수행할 수 있습니다.
* 각 코루틴의 상태를 쉽게 확인할 수 있습니다.
* 실행 중인 코루틴과 일시 중단된 코루틴 모두에 대해 로컬 및 캡처된 변수의 값을 볼 수 있습니다.
* 전체 코루틴 생성 스택과 코루틴 내부의 호출 스택을 볼 수 있습니다. 스택에는 모든 프레임이 포함되어 있습니다.
표준 디버깅 중에 손실될 수 있는 변수 값입니다.

각 코루틴의 상태와 스택이 포함된 전체 보고서가 필요한 경우 **코루틴** 탭 내부를 마우스 오른쪽 버튼으로 클릭한 다음
**코루틴 덤프 가져오기**를 클릭합니다. 현재 코루틴 덤프는 다소 간단하지만 앞으로 Kotlin 버전에서 더 읽기 쉽고 유용하게 만들 것입니다.

<img src="/img/coroutines-dump-wn.png" alt="코루틴 덤프" style={{verticalAlign: 'middle'}}/>

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/)
및 [IntelliJ IDEA 설명서](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)에서 코루틴 디버깅에 대해 자세히 알아보세요.

## 새로운 컴파일러

새로운 Kotlin 컴파일러는 정말 빠를 것입니다. 지원되는 모든 플랫폼을 통합하고
컴파일러 확장을 위한 API를 제공합니다. 이는 장기적인 프로젝트이며 Kotlin 1.4.0에서 이미 여러 단계를 완료했습니다.

* [새롭고 더 강력한 유형 추론 알고리즘](#new-more-powerful-type-inference-algorithm)은 기본적으로 활성화되어 있습니다.
* [새로운 JVM 및 JS IR 백엔드](#unified-backends-and-extensibility). 안정화되면 기본값이 됩니다.

### 새롭고 더 강력한 유형 추론 알고리즘

Kotlin 1.4는 새롭고 더 강력한 유형 추론 알고리즘을 사용합니다. 이 새로운 알고리즘은 컴파일러 옵션을 지정하여 Kotlin 1.3에서 이미 사용해 볼 수 있었으며 이제 기본적으로 사용됩니다. 새로운 알고리즘에서 수정된 문제의 전체 목록은 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)에서 찾을 수 있습니다. 다음은 가장 눈에 띄는 개선 사항 중 일부입니다.

* [유형이 자동으로 추론되는 더 많은 사례](#more-cases-where-type-is-inferred-automatically)
* [람다의 마지막 식에 대한 스마트 캐스트](#smart-casts-for-a-lambda-s-last-expression)
* [호출 가능 참조에 대한 스마트 캐스트](#smart-casts-for-callable-references)
* [위임된 속성에 대한 더 나은 추론](#better-inference-for-delegated-properties)
* [다른 인수가 있는 Java 인터페이스에 대한 SAM 변환](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin의 Java SAM 인터페이스](#java-sam-interfaces-in-kotlin)

#### 유형이 자동으로 추론되는 더 많은 사례

새로운 추론 알고리즘은 이전 알고리즘에서 명시적으로 지정해야 했던 많은 경우에 유형을 추론합니다.
예를 들어 다음 예제에서 람다 매개변수 `it`의 유형은 `String?`로 올바르게 추론됩니다.

```kotlin

val rulesMap: Map<String, (String?) `->` Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```

Kotlin 1.3에서는 명시적 람다 매개변수를 도입하거나 `to`를 명시적 제네릭 인수가 있는 `Pair` 생성자로 바꿔야 작동했습니다.

#### 람다의 마지막 식에 대한 스마트 캐스트

Kotlin 1.3에서는 예상되는 유형을 지정하지 않는 한 람다 내부의 마지막 식이 스마트 캐스트되지 않았습니다. 따라서 다음 예제에서 Kotlin 1.3은 `String?`를 `result` 변수의 유형으로 추론합니다.

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // Kotlin 컴파일러는 여기서 str이 null이 아님을 압니다.
}
// 'result'의 유형은 Kotlin 1.3에서는 String?이고 Kotlin 1.4에서는 String입니다.
```

Kotlin 1.4에서는 새로운 추론 알고리즘 덕분에 람다 내부의 마지막 식이 스마트 캐스트되고 이 새롭고 더 정확한 유형이 결과 람다 유형을 추론하는 데 사용됩니다. 따라서 `result` 변수의 유형은 `String`이 됩니다.

Kotlin 1.3에서는 이러한 경우를 작동시키기 위해 명시적 캐스트(`!!` 또는 `as String`과 같은 유형 캐스트)를 추가해야 하는 경우가 많았지만 이제 이러한 캐스트가 불필요해졌습니다.

#### 호출 가능 참조에 대한 스마트 캐스트

Kotlin 1.3에서는 스마트 캐스트 유형의 멤버 참조에 액세스할 수 없었습니다. 이제 Kotlin 1.4에서는 액세스할 수 있습니다.

```kotlin
import kotlin.reflect.KFunction

sealed class Animal
class Cat : Animal() {
    fun meow() {
        println("meow")
    }
}

class Dog : Animal() {
    fun woof() {
        println("woof")
    }
}

fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat `->` animal::meow
        is Dog `->` animal::woof
    }
    kFunction.call()
}

fun main() {
    perform(Cat())
}
```

animal 변수가 특정 유형 `Cat` 및 `Dog`으로 스마트 캐스트된 후에는 다른 멤버 참조 `animal::meow` 및 `animal::woof`를 사용할 수 있습니다. 유형 검사 후 하위 유형에 해당하는 멤버 참조에 액세스할 수 있습니다.

#### 위임된 속성에 대한 더 나은 추론

`by` 키워드 다음에 오는 위임 식을 분석하는 동안 위임된 속성의 유형이 고려되지 않았습니다. 예를 들어 다음 코드는 이전에 컴파일되지 않았지만 이제 컴파일러는 `old` 및 `new` 매개변수의 유형을 `String?`로 올바르게 추론합니다.

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new `->`
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```

#### 다른 인수가 있는 Java 인터페이스에 대한 SAM 변환

Kotlin은 처음부터 Java 인터페이스에 대한 SAM 변환을 지원했지만 지원되지 않는 한 가지 경우가 있었습니다.
기존 Java 라이브러리를 사용할 때 때때로 짜증났습니다. 두 개의 SAM 인터페이스를 매개변수로 사용하는 Java 메서드를 호출한 경우 두 인수 모두 람다 또는 일반 개체여야 했습니다. 한 인수를 람다로, 다른 인수를 개체로 전달할 수 없었습니다.

새로운 알고리즘은 이 문제를 해결하고 모든 경우에 SAM 인터페이스 대신 람다를 전달할 수 있습니다.
이는 자연스럽게 작동할 것으로 예상되는 방식입니다.

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Kotlin 1.4에서 작동합니다.
}
```

#### Kotlin의 Java SAM 인터페이스

Kotlin 1.4에서는 Kotlin에서 Java SAM 인터페이스를 사용하고 SAM 변환을 적용할 수 있습니다.

```kotlin
import java.lang.Runnable

fun foo(r: Runnable) {}

fun test() { 
    foo { } // OK
}
```

Kotlin 1.3에서는 SAM 변환을 수행하기 위해 위의 함수 `foo`를 Java 코드에서 선언해야 했습니다.

### 통합 백엔드 및 확장성

Kotlin에는 실행 파일을 생성하는 세 가지 백엔드가 있습니다. Kotlin/JVM, Kotlin/JS 및 Kotlin/Native입니다. Kotlin/JVM과 Kotlin/JS는 서로 독립적으로 개발되었기 때문에 많은 코드를 공유하지 않습니다. Kotlin/Native는 Kotlin 코드에 대한 중간 표현(IR)을 중심으로 구축된 새로운 인프라를 기반으로 합니다.

이제 Kotlin/JVM과 Kotlin/JS를 동일한 IR로 마이그레이션하고 있습니다. 결과적으로 세 백엔드는 모두 많은 논리를 공유하고 통합 파이프라인을 갖습니다. 이를 통해 대부분의 기능, 최적화 및 버그 수정 사항을 모든 플랫폼에 대해 한 번만 구현할 수 있습니다. 두 개의 새로운 IR 기반 백엔드는 [Alpha](components-stability)에 있습니다.

공통 백엔드 인프라는 또한 멀티 플랫폼 컴파일러 확장을 위한 문을 엽니다. 파이프라인에 연결하고 모든 플랫폼에서 자동으로 작동하는 사용자 지정 처리 및 변환을 추가할 수 있습니다.

현재 Alpha에 있는 새로운 [JVM IR](#new-jvm-ir-backend) 및 [JS IR](#new-js-ir-backend) 백엔드를 사용하고
피드백을 공유하는 것이 좋습니다.

## Kotlin/JVM

Kotlin 1.4.0에는 다음과 같은 여러 가지 JVM 관련 개선 사항이 포함되어 있습니다.
 
* [새로운 JVM IR 백엔드](#new-jvm-ir-backend)
* [인터페이스에서 기본 메서드를 생성하기 위한 새로운 모드](#new-modes-for-generating-default-methods)
* [null 검사에 대한 통합 예외 유형](#unified-exception-type-for-null-checks)
* [JVM 바이트코드의 유형 주석](#type-annotations-in-the-jvm-bytecode)

### 새로운 JVM IR 백엔드

Kotlin/JS와 함께 Kotlin/JVM을 [통합 IR 백엔드](#unified-backends-and-extensibility)로 마이그레이션하고 있습니다.
이를 통해 대부분의 기능과 버그 수정 사항을 모든 플랫폼에 대해 한 번만 구현할 수 있습니다. 또한 모든 플랫폼에서 작동하는 멀티 플랫폼 확장을 만들어 이를 활용할 수 있습니다.

Kotlin 1.4.0은 아직 이러한 확장에 대한 공개 API를 제공하지 않지만 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 포함하여 파트너와 긴밀히 협력하고 있으며 이미 새로운 백엔드를 사용하여 컴파일러 플러그인을 구축하고 있습니다.

현재 Alpha에 있는 새로운 Kotlin/JVM 백엔드를 사용해 보고 [문제 추적기](https://youtrack.jetbrains.com/issues/KT)에 문제 및 기능 요청을 제출하는 것이 좋습니다.
이렇게 하면 컴파일러 파이프라인을 통합하고 Jetpack Compose와 같은 컴파일러 확장을 Kotlin 커뮤니티에 더 빠르게 제공할 수 있습니다.

새로운 JVM IR 백엔드를 활성화하려면 Gradle 빌드 스크립트에 추가 컴파일러 옵션을 지정합니다.

```kotlin
kotlinOptions.useIR = true
```

:::note
[Jetpack Compose를 활성화](https://developer.android.com/jetpack/compose/setup?hl=en)하면 `kotlinOptions`에서 컴파일러 옵션을 지정할 필요 없이 새로운 JVM 백엔드에 자동으로 참여하게 됩니다.

:::

명령줄 컴파일러를 사용하는 경우 컴파일러 옵션 `-Xuse-ir`을 추가합니다.

:::note
새로운 JVM IR 백엔드로 컴파일된 코드는 새로운 백엔드를 활성화한 경우에만 사용할 수 있습니다. 그렇지 않으면 오류가 발생합니다.
이 점을 고려할 때 라이브러리 작성자는 프로덕션에서 새로운 백엔드로 전환하지 않는 것이 좋습니다.

:::

### 기본 메서드 생성을 위한 새로운 모드

Kotlin 코드를 대상 JVM 1.8 이상으로 컴파일할 때 Kotlin 인터페이스의 추상 메서드가 아닌 메서드를
Java의 `default` 메서드로 컴파일할 수 있습니다. 이를 위해 이러한 메서드를 표시하기 위한 `@JvmDefault` 주석과 이 주석 처리를 활성화하는 `-Xjvm-default` 컴파일러 옵션이 포함된 메커니즘이 있었습니다.

1.  4.0에서는 기본 메서드를 생성하기 위한 새로운 모드를 추가했습니다. `-Xjvm-default=all`은 Kotlin의 *모든* 추상 메서드가 아닌 메서드를 컴파일합니다.
Java 메서드를 `default`합니다. `default` 없이 컴파일된 인터페이스를 사용하는 코드와의 호환성을 위해
`all-compatibility` 모드도 추가했습니다.

Java 상호 운용성의 기본 메서드에 대한 자세한 내용은 [상호 운용성 설명서](java-to-kotlin-interop#default-methods-in-interfaces) 및
[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하십시오.

### null 검사에 대한 통합 예외 유형

Kotlin 1.4.0부터 모든 런타임 null 검사는 `KotlinNullPointerException`,
`IllegalStateException`, `IllegalArgumentException` 및 `TypeCastException` 대신 `java.lang.NullPointerException`을 발생시킵니다. 이는 `!!` 연산자, 메서드 서문, 플랫폼 유형 식 null 검사 및 null을 허용하지 않는 유형의 `as` 연산자의 매개변수 null 검사에 적용됩니다.
이는 `lateinit` null 검사 및 `checkNotNull` 또는 `requireNotNull`과 같은 명시적 라이브러리 함수 호출에는 적용되지 않습니다.

이 변경 사항은 Kotlin 컴파일러 또는 Android [R8 최적화기](https://developer.android.com/studio/build/shrink-code)와 같은 다양한 종류의 바이트코드 처리 도구에서 수행할 수 있는 가능한 null 검사 최적화 수를 늘립니다.

개발자의 관점에서 볼 때 상황이 크게 바뀌지는 않습니다. Kotlin 코드는 이전과 동일한 오류 메시지로 예외를 발생시킵니다. 예외 유형이 변경되지만 전달되는 정보는 동일하게 유지됩니다.

### JVM 바이트코드의 유형 주석

Kotlin은 이제 JVM 바이트코드(대상 버전 1.8 이상)에서 유형 주석을 생성할 수 있으므로 런타임에 Java 리플렉션에서 사용할 수 있습니다.
바이트코드에서 유형 주석을 내보내려면 다음 단계를 따르십시오.

1. 선언된 주석에 적절한 주석 대상(Java의 `ElementType.TYPE_USE` 또는 Kotlin의
`AnnotationTarget.TYPE`) 및 보존(`AnnotationRetention.RUNTIME`)이 있는지 확인합니다.
2. 주석 클래스 선언을 JVM 바이트코드 대상 버전 1.8 이상으로 컴파일합니다. `-jvm-target=1.8`로 지정할 수 있습니다.
컴파일러 옵션입니다.
3. 주석을 사용하는 코드를 JVM 바이트코드 대상 버전 1.8+(`-jvm-target=1.8`)로 컴파일하고
`-Xemit-jvm-type-annotations` 컴파일러 옵션을 추가합니다.

표준 라이브러리는 대상 버전 1.6으로 컴파일되므로 표준 라이브러리의 유형 주석은 현재 바이트코드에서 내보내지지 않습니다.

지금까지는 기본 사례만 지원됩니다.

- 메서드 매개변수, 메서드 반환 유형 및 속성 유형에 대한 유형 주석
- `Smth<@Ann Foo>`, `Array<@Ann Foo>`와 같은 유형 인수의 불변 프로젝션

다음 예제에서 `String` 유형의 `@Foo` 주석을 바이트코드로 내보낸 다음
라이브러리 코드입니다.

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JS 플랫폼에서 Kotlin 1.4.0은 다음과 같은 개선 사항을 제공합니다.

- [새로운 Gradle DSL](#new-gradle-dsl)
- [새로운 JS IR 백엔드](#new-js-ir-backend)

### 새로운 Gradle DSL

`kotlin.js` Gradle 플러그인에는 조정된 Gradle DSL이 함께 제공됩니다. 이 DSL은 여러 가지 새로운 구성 옵션을 제공하고 `kotlin-multiplatform` 플러그인에서 사용하는 DSL과 더 밀접하게 정렬됩니다. 가장 영향력 있는 변경 사항 중 일부는 다음과 같습니다.

- `binaries.executable()`을 통해 실행 파일 생성에 대한 명시적 토글. [Kotlin/JS 실행 및 해당 환경에 대해 자세히 알아보십시오](js-project-setup#execution-environments).
- `cssSupport`을 통해 Gradle 구성 내에서 webpack의 CSS 및 스타일 로더를 구성합니다. [CSS 및 스타일 로더 사용에 대해 자세히 알아보십시오](js-project-setup#css).
- 필수 버전 번호 또는 [semver](https://docs.npmjs.com/about-semantic-versioning) 버전 범위와 함께 npm 종속성에 대한 개선된 관리, Gradle에서 직접 `devNpm`, `optionalNpm` 및 `peerNpm`을 사용하여 _개발_, _피어_ 및 _선택적_ npm 종속성에 대한 지원. [여기에서 Gradle에서 직접 npm 패키지에 대한 종속성 관리에 대해 자세히 알아보십시오](js-project-setup#npm-dependencies).
- Kotlin 외부 선언의 생성기인 [Dukat](https://github.com/Kotlin/dukat)에 대한 더 강력한 통합. 이제 빌드 시에 외부 선언을 생성하거나 Gradle 작업을 통해 수동으로 생성할 수 있습니다.

### 새로운 JS IR 백엔드

현재 [Alpha](components-stability) 안정성이 있는 [Kotlin/JS용 IR 백엔드](js-ir-compiler)는 데드 코드 제거를 통한 생성된 코드 크기에 중점을 두고 다른 기능 중에서도 JavaScript 및 TypeScript와의 상호 운용성을 개선하는 Kotlin/JS 대상에만 해당하는 몇 가지 새로운 기능을 제공합니다.

Kotlin/JS IR 백엔드를 활성화하려면 `gradle.properties`에서 키 `kotlin.js.compiler=ir`을 설정하거나 Gradle 빌드 스크립트의 `js` 함수에 `IR` 컴파일러 유형을 전달합니다.

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // 또는: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

새로운 백엔드 구성 방법에 대한 자세한 내용은 [Kotlin/JS IR 컴파일러 설명서](js-ir-compiler)를 확인하십시오.

새로운 [@JsExport](js-to-kotlin-interop#jsexport-annotation) 주석과 **[Kotlin 코드에서 TypeScript 정의 생성](js-ir-compiler#preview-generation-of-typescript-declaration-files-d-ts)** 기능으로 Kotlin/JS IR 컴파일러 백엔드는 JavaScript 및 TypeScript 상호 운용성을 개선합니다. 이렇게 하면 Kotlin/JS 코드를 기존 도구와 쉽게 통합하고 **하이브리드 애플리케이션**을 만들고 멀티 플랫폼 프로젝트에서 코드 공유 기능을 활용할 수 있습니다.

[Kotlin/JS IR 컴파일러 백엔드에서 사용 가능한 기능에 대해 자세히 알아보십시오](js-ir-compiler).

## Kotlin/Native

1.  4.0에서 Kotlin/Native는 다음과 같은 많은 새로운 기능과 개선 사항을 얻었습니다.

* [Swift 및 Objective-C에서 Kotlin의 일시 중단 함수에 대한 지원](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [기본적으로 Objective-C 제네릭 지원](#objective-c-generics-support-by-default)
* [Objective-C/Swift 상호 운용성의 예외 처리](#exception-handling-in-objective-c-swift-interop)
* [기본적으로 Apple 대상에서 릴리스 .dSYM 생성](#generate-release-dsyms-on-apple-targets-by-default)
* [성능 개선](#performance-improvements)
* [CocoaPods 종속성 관리 간소화](#simplified-management-of-cocoapods-dependencies)

### Swift 및 Objective-C에서 Kotlin의 일시 중단 함수에 대한 지원

1.  4.0에서는 Swift 및 Objective-C에서 일시 중단 함수에 대한 기본 지원을 추가합니다. 이제 Kotlin 모듈을
Apple 프레임워크로 컴파일하면 일시 중단 함수를 콜백이 있는 함수로 사용할