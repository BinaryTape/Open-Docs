[//]: # (title: Kotlin 1.4.0의 새로운 기능)

_[릴리스: 2020년 8월 17일](releases.md#release-details)_

Kotlin 1.4.0에서는 모든 구성 요소에서 다양한 개선 사항을 제공하며, [품질 및 성능에 중점](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)을 두었습니다.
아래에서 Kotlin 1.4.0의 가장 중요한 변경 사항 목록을 확인할 수 있습니다.

## 언어 기능 및 개선 사항

Kotlin 1.4.0은 다양한 언어 기능과 개선 사항을 포함합니다. 다음을 포함합니다:

*   [Kotlin 인터페이스용 SAM 변환](#sam-conversions-for-kotlin-interfaces)
*   [라이브러리 작성자를 위한 명시적 API 모드](#explicit-api-mode-for-library-authors)
*   [이름 있는 인자와 위치 인자의 혼합](#mixing-named-and-positional-arguments)
*   [후행 쉼표](#trailing-comma)
*   [호출 가능한 참조 개선](#callable-reference-improvements)
*   [루프에 포함된 when 안에서 break 및 continue 사용](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 인터페이스용 SAM 변환

Kotlin 1.4.0 이전에는 [Kotlin에서 Java 메서드 및 Java 인터페이스를 다룰 때](java-interop.md#sam-conversions)만 SAM(단일 추상 메서드) 변환을 적용할 수 있었습니다. 이제부터는 Kotlin 인터페이스에도 SAM 변환을 사용할 수 있습니다.
이를 위해 `fun` 한정자(modifier)를 사용하여 Kotlin 인터페이스를 기능형으로 명시적으로 표시합니다.

SAM 변환은 하나의 단일 추상 메서드만 있는 인터페이스가 매개변수로 예상될 때 람다를 인자로 전달하는 경우에 적용됩니다. 이 경우 컴파일러는 람다를 추상 멤버 함수를 구현하는 클래스의 인스턴스로 자동 변환합니다.

```kotlin
fun interface IntPredicate {
    fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main() { 
    println("Is 7 even? - ${isEven.accept(7)}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

[Kotlin 기능형 인터페이스 및 SAM 변환에 대해 자세히 알아보기](fun-interfaces.md).

### 라이브러리 작성자를 위한 명시적 API 모드

Kotlin 컴파일러는 라이브러리 작성자를 위한 *명시적 API 모드 (explicit API mode)*를 제공합니다. 이 모드에서 컴파일러는 라이브러리의 API를 더 명확하고 일관성 있게 만드는 데 도움이 되는 추가 검사를 수행합니다. 라이브러리의 공용 API에 노출되는 선언에 대해 다음 요구 사항을 추가합니다.

*   기본 가시성(visibility)이 공용 API에 노출하는 경우 선언에 가시성 한정자(visibility modifier)가 필요합니다.
    이는 의도치 않게 공용 API에 노출되는 선언이 없도록 하는 데 도움이 됩니다.
*   공용 API에 노출되는 프로퍼티 및 함수에는 명시적 타입 지정이 필요합니다.
    이는 API 사용자가 자신이 사용하는 API 멤버의 타입을 알 수 있도록 보장합니다.

구성 설정에 따라 이러한 명시적 API는 오류(*strict* 모드) 또는 경고(*warning* 모드)를 생성할 수 있습니다.
가독성과 상식적인 측면에서 특정 종류의 선언은 이러한 검사에서 제외됩니다.

*   주 생성자(primary constructors)
*   데이터 클래스의 프로퍼티
*   프로퍼티 게터(getter) 및 세터(setter)
*   `override` 메서드

명시적 API 모드는 모듈의 프로덕션 소스만 분석합니다.

명시적 API 모드로 모듈을 컴파일하려면 Gradle 빌드 스크립트에 다음 줄을 추가합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</tab>
</tabs>

명령줄 컴파일러를 사용할 때는 `-Xexplicit-api` 컴파일러 옵션에 `strict` 또는 `warning` 값을 추가하여 명시적 API 모드로 전환합니다.

```bash
-Xexplicit-api={strict|warning}
```

[KEEP에서 명시적 API 모드에 대한 자세한 내용을 확인하세요](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md).

### 이름 있는 인자와 위치 인자의 혼합

Kotlin 1.3에서는 [이름 있는 인자 (named arguments)](functions.md#named-arguments)로 함수를 호출할 때, 이름 없는 모든 인자(위치 인자)를 첫 번째 이름 있는 인자 앞에 배치해야 했습니다. 예를 들어 `f(1, y = 2)`는 호출할 수 있었지만, `f(x = 1, 2)`는 호출할 수 없었습니다.

모든 인자가 올바른 위치에 있지만 중간에 있는 한 인자에 이름을 지정하고 싶을 때 매우 번거로웠습니다.
이는 특히 불리언(boolean) 또는 `null` 값이 어떤 속성에 속하는지 명확하게 할 때 유용했습니다.

Kotlin 1.4에서는 이러한 제한이 없습니다. 이제 위치 인자 세트의 중간에 있는 인자에 이름을 지정할 수 있습니다. 또한, 올바른 순서를 유지하는 한 위치 인자와 이름 있는 인자를 원하는 대로 혼합할 수 있습니다.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Char = ' '
) {
    // ...
}

//Function call with a named argument in the middle
reformat("This is a String!", uppercaseFirstLetter = false , '-')
```

### 후행 쉼표

Kotlin 1.4에서는 이제 인자 및 매개변수 목록, `when` 항목, 구조 분해 선언(destructuring declarations)의 구성 요소와 같은 열거형에 후행 쉼표 (trailing comma)를 추가할 수 있습니다.
후행 쉼표를 사용하면 쉼표를 추가하거나 제거할 필요 없이 새 항목을 추가하고 순서를 변경할 수 있습니다.

이는 특히 매개변수나 값에 여러 줄 구문을 사용하는 경우에 유용합니다. 후행 쉼표를 추가한 후에는 매개변수나 값으로 줄을 쉽게 바꿀 수 있습니다.

```kotlin
fun reformat(
    str: String,
    uppercaseFirstLetter: Boolean = true,
    wordSeparator: Character = ' ', //trailing comma
) {
    // ...
}
```

```kotlin
val colors = listOf(
    "red",
    "green",
    "blue", //trailing comma
)
```

### 호출 가능한 참조 개선

Kotlin 1.4는 호출 가능한 참조 (callable reference) 사용에 대해 더 많은 경우를 지원합니다.

*   기본값을 가진 매개변수를 포함하는 함수에 대한 참조
*   `Unit` 반환 함수에서의 함수 참조
*   함수 인자 수에 따라 조정되는 참조
*   호출 가능한 참조에 대한 suspend 변환

#### 기본값을 가진 매개변수를 포함하는 함수에 대한 참조

이제 기본값을 가진 매개변수를 포함하는 함수에 호출 가능한 참조를 사용할 수 있습니다. 함수 `foo`에 대한 호출 가능한 참조가 인자를 받지 않으면 기본값 `0`이 사용됩니다.

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

이전에는 `apply` 또는 `foo` 함수에 대해 추가 오버로드(overload)를 작성해야 했습니다.

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### Unit 반환 함수에서의 함수 참조

Kotlin 1.4에서는 `Unit` 반환 함수에서 모든 타입을 반환하는 함수에 호출 가능한 참조를 사용할 수 있습니다.
Kotlin 1.4 이전에는 이 경우 람다 인자만 사용할 수 있었습니다. 이제는 람다 인자와 호출 가능한 참조를 모두 사용할 수 있습니다.

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 함수 인자 수에 따라 조정되는 참조

이제 가변 인자(`vararg`)를 전달할 때 함수에 대한 호출 가능한 참조를 조정할 수 있습니다.
전달된 인자 목록의 끝에 같은 타입의 매개변수를 원하는 만큼 전달할 수 있습니다.

```kotlin
fun foo(x: Int, vararg y: String) {}

fun use0(f: (Int) -> Unit) {}
fun use1(f: (Int, String) -> Unit) {}
fun use2(f: (Int, String, String) -> Unit) {}

fun test() {
    use0(::foo) 
    use1(::foo) 
    use2(::foo) 
}
```

#### 호출 가능한 참조에 대한 suspend 변환

람다에 대한 suspend 변환 외에도, Kotlin은 이제 버전 1.4.0부터 호출 가능한 참조에 대한 suspend 변환을 지원합니다.

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 루프에 포함된 when 안에서 break 및 continue 사용

Kotlin 1.3에서는 루프에 포함된 `when` 표현식 내에서 한정자 없는(unqualified) `break` 및 `continue`를 사용할 수 없었습니다. 그 이유는 이러한 키워드가 `when` 표현식에서 가능한 [폴스루(fall-through) 동작](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)을 위해 예약되어 있었기 때문입니다.

그렇기 때문에 루프 내의 `when` 표현식 안에서 `break` 및 `continue`를 사용하려면 [레이블 (label)](returns.md#break-and-continue-labels)을 지정해야 했으며, 이는 다소 번거로웠습니다.

```kotlin
fun test(xs: List<Int>) {
    LOOP@for (x in xs) {
        when (x) {
            2 -> continue@LOOP
            17 -> break@LOOP
            else -> println(x)
        }
    }
}
```

Kotlin 1.4에서는 루프에 포함된 `when` 표현식 내에서 레이블 없이 `break` 및 `continue`를 사용할 수 있습니다. 이들은 가장 가까운 바깥쪽 루프를 종료하거나 다음 단계로 진행하는 예상대로 동작합니다.

```kotlin
fun test(xs: List<Int>) {
    for (x in xs) {
        when (x) {
            2 -> continue
            17 -> break
            else -> println(x)
        }
    }
}
```

`when` 내부의 폴스루 동작은 추가 설계 대상입니다.

## IDE의 새로운 도구

Kotlin 1.4를 사용하면 IntelliJ IDEA의 새로운 도구를 사용하여 Kotlin 개발을 간소화할 수 있습니다.

*   [새로운 유연한 프로젝트 위자드](#new-flexible-project-wizard)
*   [코루틴 디버거](#coroutine-debugger)

### 새로운 유연한 프로젝트 위자드

유연한 새 Kotlin 프로젝트 위자드를 사용하면 멀티플랫폼 프로젝트를 포함하여 다양한 유형의 Kotlin 프로젝트를 쉽게 생성하고 구성할 수 있습니다. UI 없이는 구성하기 어려울 수 있는 프로젝트도 마찬가지입니다.

![Kotlin Project Wizard – Multiplatform project](multiplatform-project-1-wn.png)

새 Kotlin 프로젝트 위자드는 간단하면서도 유연합니다.

1.  수행하려는 작업에 따라 *프로젝트 템플릿을 선택합니다*. 앞으로 더 많은 템플릿이 추가될 예정입니다.
2.  *빌드 시스템을 선택합니다* – Gradle (Kotlin 또는 Groovy DSL), Maven 또는 IntelliJ IDEA.
    Kotlin 프로젝트 위자드는 선택한 프로젝트 템플릿에서 지원되는 빌드 시스템만 표시합니다.
3.  메인 화면에서 직접 *프로젝트 구조를 미리 봅니다*.

그런 다음 프로젝트 생성을 완료하거나, 선택적으로 다음 화면에서 *프로젝트를 구성할 수 있습니다*.

4.  이 프로젝트 템플릿에 대해 지원되는 *모듈 및 타겟을 추가/제거합니다*.
5.  *모듈 및 타겟 설정을 구성합니다*. 예를 들어, 타겟 JVM 버전, 타겟 템플릿, 테스트 프레임워크 등을 설정할 수 있습니다.

![Kotlin Project Wizard - Configure targets](multiplatform-project-2-wn.png)

앞으로 Kotlin 프로젝트 위자드에 더 많은 구성 옵션과 템플릿을 추가하여 더욱 유연하게 만들 예정입니다.

다음 튜토리얼을 통해 새로운 Kotlin 프로젝트 위자드를 사용해 볼 수 있습니다.

*   [Kotlin/JVM 기반 콘솔 애플리케이션 생성](jvm-get-started.md)
*   [React용 Kotlin/JS 애플리케이션 생성](js-react.md)
*   [Kotlin/Native 애플리케이션 생성](native-get-started.md)

### 코루틴 디버거

많은 사람이 이미 비동기 프로그래밍에 [코루틴 (coroutines)](coroutines-guide.md)을 사용하고 있습니다.
그러나 디버깅에 있어서 Kotlin 1.4 이전에는 코루틴 작업을 하는 것이 정말 어려웠습니다. 코루틴이 스레드 간에 이동했기 때문에 특정 코루틴이 무엇을 하고 있는지 이해하고 컨텍스트를 확인하기가 어려웠습니다. 어떤 경우에는 중단점(breakpoint)을 통한 단계 추적이 작동하지 않았습니다. 결과적으로 코루틴을 사용하는 코드를 디버깅하려면 로깅이나 정신적 노력에 의존해야 했습니다.

Kotlin 1.4에서는 Kotlin 플러그인과 함께 제공되는 새로운 기능 덕분에 코루틴 디버깅이 훨씬 편리해졌습니다.

> 디버깅은 `kotlinx-coroutines-core` 버전 1.3.8 이상에서 작동합니다.
>
{style="note"}

**디버그 도구 창 (Debug Tool Window)**에 이제 새로운 **코루틴 (Coroutines)** 탭이 포함되어 있습니다. 이 탭에서는 현재 실행 중인 코루틴과 중단된(suspended) 코루틴에 대한 정보를 찾을 수 있습니다. 코루틴은 실행 중인 디스패처별로 그룹화됩니다.

![Debugging coroutines](coroutine-debugger-wn.png)

이제 다음을 수행할 수 있습니다.
*   각 코루틴의 상태를 쉽게 확인합니다.
*   실행 중인 코루틴과 중단된 코루틴 모두의 로컬 변수 및 캡처된 변수 값을 확인합니다.
*   전체 코루틴 생성 스택과 코루틴 내부의 호출 스택을 확인합니다. 스택에는 변수 값을 포함한 모든 프레임이 포함되며, 표준 디버깅 중에는 손실될 수 있는 프레임도 포함됩니다.

각 코루틴의 상태와 스택을 포함하는 전체 보고서가 필요하면 **코루틴 (Coroutines)** 탭 안에서 마우스 오른쪽 버튼을 클릭한 다음 **코루틴 덤프 가져오기 (Get Coroutines Dump)**를 클릭합니다. 현재 코루틴 덤프는 다소 간단하지만, Kotlin의 향후 버전에서는 더 읽기 쉽고 유용하게 만들 예정입니다.

![Coroutines Dump](coroutines-dump-wn.png)

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) 및 [IntelliJ IDEA 문서](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)에서 코루틴 디버깅에 대해 자세히 알아보세요.

## 새로운 컴파일러

새로운 Kotlin 컴파일러는 정말 빠를 것입니다. 지원되는 모든 플랫폼을 통합하고 컴파일러 확장 기능을 위한 API를 제공할 것입니다. 이것은 장기 프로젝트이며, Kotlin 1.4.0에서는 이미 여러 단계를 완료했습니다.

*   [새로운, 더 강력한 타입 추론 알고리즘](#new-more-powerful-type-inference-algorithm)이 기본적으로 활성화되어 있습니다.
*   [새로운 JVM 및 JS IR 백엔드](#unified-backends-and-extensibility). 안정화되면 기본값이 될 것입니다.

### 새로운 더 강력한 타입 추론 알고리즘

Kotlin 1.4는 새로운, 더 강력한 타입 추론 알고리즘을 사용합니다. 이 새로운 알고리즘은 Kotlin 1.3에서 컴파일러 옵션을 지정하여 이미 사용해 볼 수 있었으며, 이제는 기본적으로 사용됩니다. 새로운 알고리즘에서 수정된 문제의 전체 목록은 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)에서 찾을 수 있습니다. 여기에서 가장 눈에 띄는 몇 가지 개선 사항을 확인할 수 있습니다.

*   [타입이 자동으로 추론되는 더 많은 경우](#more-cases-where-type-is-inferred-automatically)
*   [람다의 마지막 표현식에 대한 스마트 캐스트](#smart-casts-for-a-lambda-s-last-expression)
*   [호출 가능한 참조에 대한 스마트 캐스트](#smart-casts-for-callable-references)
*   [위임된 프로퍼티에 대한 더 나은 추론](#better-inference-for-delegated-properties)
*   [다른 인자를 가진 Java 인터페이스에 대한 SAM 변환](#sam-conversion-for-java-interfaces-with-different-arguments)
*   [Kotlin의 Java SAM 인터페이스](#java-sam-interfaces-in-kotlin)

#### 타입이 자동으로 추론되는 더 많은 경우

새로운 추론 알고리즘은 이전 알고리즘에서 명시적으로 지정해야 했던 많은 경우에 대해 타입을 추론합니다. 예를 들어, 다음 예시에서는 람다 매개변수 `it`의 타입이 `String?`로 올바르게 추론됩니다.

```kotlin
//sampleStart
val rulesMap: Map<String, (String?) -> Boolean> = mapOf(
    "weak" to { it != null },
    "medium" to { !it.isNullOrBlank() },
    "strong" to { it != null && "^[a-zA-Z0-9]+$".toRegex().matches(it) }
)
//sampleEnd

fun main() {
    println(rulesMap.getValue("weak")("abc!"))
    println(rulesMap.getValue("strong")("abc"))
    println(rulesMap.getValue("strong")("abc!"))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

Kotlin 1.3에서는 명시적인 람다 매개변수를 도입하거나 `to`를 명시적인 제네릭 인자를 가진 `Pair` 생성자로 대체해야만 작동했습니다.

#### 람다의 마지막 표현식에 대한 스마트 캐스트

Kotlin 1.3에서는 람다 내의 마지막 표현식은 예상 타입을 지정하지 않으면 스마트 캐스트되지 않았습니다. 따라서 다음 예시에서 Kotlin 1.3은 `String?`를 `result` 변수의 타입으로 추론했습니다.

```kotlin
val result = run {
    var str = currentValue()
    if (str == null) {
        str = "test"
    }
    str // the Kotlin compiler knows that str is not null here
}
// The type of 'result' is String? in Kotlin 1.3 and String in Kotlin 1.4
```

Kotlin 1.4에서는 새로운 추론 알고리즘 덕분에 람다 내의 마지막 표현식이 스마트 캐스트되고, 이 새롭고 더 정확한 타입이 결과 람다 타입을 추론하는 데 사용됩니다. 따라서 `result` 변수의 타입은 `String`이 됩니다.

Kotlin 1.3에서는 종종 이러한 경우를 작동시키기 위해 명시적 캐스트(`!!` 또는 `as String`과 같은 타입 캐스트)를 추가해야 했지만, 이제는 이러한 캐스트가 불필요해졌습니다.

#### 호출 가능한 참조에 대한 스마트 캐스트

Kotlin 1.3에서는 스마트 캐스트된 타입의 멤버 참조에 접근할 수 없었습니다. 이제 Kotlin 1.4에서는 가능합니다.

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

//sampleStart
fun perform(animal: Animal) {
    val kFunction: KFunction<*> = when (animal) {
        is Cat -> animal::meow
        is Dog -> animal::woof
    }
    kFunction.call()
}
//sampleEnd

fun main() {
    perform(Cat())
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

`animal` 변수가 특정 타입인 `Cat` 및 `Dog`로 스마트 캐스트된 후에 다른 멤버 참조 `animal::meow` 및 `animal::woof`를 사용할 수 있습니다. 타입 검사 후에 서브타입에 해당하는 멤버 참조에 접근할 수 있습니다.

#### 위임된 프로퍼티에 대한 더 나은 추론

위임된 프로퍼티의 타입은 `by` 키워드 뒤에 오는 위임 표현식을 분석하는 동안 고려되지 않았습니다. 예를 들어, 다음 코드는 이전에는 컴파일되지 않았지만, 이제 컴파일러는 `old` 및 `new` 매개변수의 타입을 `String?`으로 올바르게 추론합니다.

```kotlin
import kotlin.properties.Delegates

fun main() {
    var prop: String? by Delegates.observable(null) { p, old, new ->
        println("$old → $new")
    }
    prop = "abc"
    prop = "xyz"
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### 다른 인자를 가진 Java 인터페이스에 대한 SAM 변환

Kotlin은 처음부터 Java 인터페이스에 대한 SAM 변환을 지원했지만, 지원되지 않는 한 가지 경우가 있었는데, 기존 Java 라이브러리와 작업할 때 때때로 불편했습니다. 두 SAM 인터페이스를 매개변수로 받는 Java 메서드를 호출할 때 두 인자가 모두 람다 또는 일반 객체여야 했습니다. 한 인자를 람다로 전달하고 다른 인자를 객체로 전달할 수 없었습니다.

새로운 알고리즘은 이 문제를 해결하여, 어떤 경우에도 SAM 인터페이스 대신 람다를 전달할 수 있도록 합니다. 이는 자연스럽게 작동할 것으로 예상되는 방식입니다.

```java
// FILE: A.java
public class A {
    public static void foo(Runnable r1, Runnable r2) {}
}
```

```kotlin
// FILE: test.kt
fun test(r1: Runnable) {
    A.foo(r1) {}  // Works in Kotlin 1.4
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

Kotlin 1.3에서는 SAM 변환을 수행하기 위해 위의 `foo` 함수를 Java 코드에서 선언해야 했습니다.

### 통합 백엔드 및 확장성

Kotlin에는 실행 파일을 생성하는 세 가지 백엔드가 있습니다. Kotlin/JVM, Kotlin/JS 및 Kotlin/Native. Kotlin/JVM과 Kotlin/JS는 독립적으로 개발되었기 때문에 많은 코드를 공유하지 않습니다. Kotlin/Native는 Kotlin 코드에 대한 중간 표현(IR)을 중심으로 구축된 새로운 인프라를 기반으로 합니다.

이제 Kotlin/JVM과 Kotlin/JS를 동일한 IR로 마이그레이션하고 있습니다. 결과적으로 세 가지 백엔드 모두 많은 로직을 공유하고 통합된 파이프라인을 가집니다. 이를 통해 대부분의 기능, 최적화 및 버그 수정을 모든 플랫폼에 대해 한 번만 구현할 수 있습니다. 새로운 IR 기반 백엔드는 모두 [알파 (Alpha)](components-stability.md) 상태입니다.

공통 백엔드 인프라는 또한 멀티플랫폼 컴파일러 확장의 문을 엽니다. 파이프라인에 연결하여 모든 플랫폼에서 자동으로 작동하는 사용자 정의 처리 및 변환을 추가할 수 있습니다.

현재 알파 상태인 새로운 [JVM IR](#new-jvm-ir-backend) 및 [JS IR](#new-js-ir-backend) 백엔드를 사용해 보고 피드백을 공유해 주시길 권장합니다.

## Kotlin/JVM

Kotlin 1.4.0에는 다음과 같은 JVM 특정 개선 사항이 포함되어 있습니다.

*   [새로운 JVM IR 백엔드](#new-jvm-ir-backend)
*   [인터페이스에서 기본 메서드를 생성하기 위한 새로운 모드](#new-modes-for-generating-default-methods)
*   [null 검사를 위한 통합 예외 타입](#unified-exception-type-for-null-checks)
*   [JVM 바이트코드의 타입 어노테이션](#type-annotations-in-the-jvm-bytecode)

### 새로운 JVM IR 백엔드

Kotlin/JS와 함께 Kotlin/JVM도 [통합 IR 백엔드](#unified-backends-and-extensibility)로 마이그레이션 중입니다. 이를 통해 대부분의 기능과 버그 수정을 모든 플랫폼에 대해 한 번만 구현할 수 있습니다. 또한, 멀티플랫폼 확장을 생성하여 모든 플랫폼에서 작동하도록 함으로써 이점을 얻을 수 있습니다.

Kotlin 1.4.0은 아직 이러한 확장을 위한 공개 API를 제공하지 않지만, 우리는 이미 새로운 백엔드를 사용하여 컴파일러 플러그인을 구축하고 있는 [Jetpack Compose](https://developer.android.com/jetpack/compose)를 포함한 파트너와 긴밀히 협력하고 있습니다.

현재 알파 상태인 새로운 Kotlin/JVM 백엔드를 사용해 보시고 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)에 문제 및 기능 요청을 제출해 주시길 권장합니다.
이는 컴파일러 파이프라인을 통합하고 Jetpack Compose와 같은 컴파일러 확장을 Kotlin 커뮤니티에 더 빨리 제공하는 데 도움이 될 것입니다.

새로운 JVM IR 백엔드를 활성화하려면 Gradle 빌드 스크립트에 추가 컴파일러 옵션을 지정합니다.

```kotlin
kotlinOptions.useIR = true
```

> [Jetpack Compose를 활성화](https://developer.android.com/jetpack/compose/setup?hl=en)하면 `kotlinOptions`에 컴파일러 옵션을 지정할 필요 없이 자동으로 새 JVM 백엔드가 선택됩니다.
>
{style="note"}

명령줄 컴파일러를 사용할 때는 `-Xuse-ir` 컴파일러 옵션을 추가합니다.

> 새 JVM IR 백엔드로 컴파일된 코드는 새 백엔드를 활성화한 경우에만 사용할 수 있습니다. 그렇지 않으면 오류가 발생합니다.
> 이 점을 고려하여 라이브러리 작성자가 프로덕션에서 새 백엔드로 전환하는 것을 권장하지 않습니다.
>
{style="note"}

### 기본 메서드 생성을 위한 새로운 모드

Kotlin 코드를 JVM 1.8 이상 타겟으로 컴파일할 때, Kotlin 인터페이스의 비추상 메서드를 Java의 `default` 메서드로 컴파일할 수 있었습니다. 이를 위해 `@JvmDefault` 어노테이션을 사용하여 이러한 메서드를 표시하고 이 어노테이션의 처리를 활성화하는 `-Xjvm-default` 컴파일러 옵션이 있었습니다.

1.4.0에서는 기본 메서드 생성을 위한 새로운 모드인 `-Xjvm-default=all`을 추가했습니다. 이 모드는 Kotlin 인터페이스의 *모든* 비추상 메서드를 `default` Java 메서드로 컴파일합니다. `default` 없이 컴파일된 인터페이스를 사용하는 코드와의 호환성을 위해 `all-compatibility` 모드도 추가했습니다.

Java 상호 운용성에서 기본 메서드에 대한 자세한 내용은 [상호 운용성 문서](java-to-kotlin-interop.md#default-methods-in-interfaces) 및 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하세요.

### null 검사를 위한 통합 예외 타입

Kotlin 1.4.0부터 모든 런타임 null 검사는 `KotlinNullPointerException`, `IllegalStateException`, `IllegalArgumentException`, `TypeCastException` 대신 `java.lang.NullPointerException`을 던집니다. 이는 `!!` 연산자, 메서드 프리앰블(preamble)의 매개변수 null 검사, 플랫폼 타입 표현식 null 검사, null 불가능 타입이 있는 `as` 연산자에 적용됩니다.
이는 `lateinit` null 검사 및 `checkNotNull` 또는 `requireNotNull`과 같은 명시적 라이브러리 함수 호출에는 적용되지 않습니다.

이 변경 사항은 Kotlin 컴파일러 또는 Android [R8 옵티마이저](https://developer.android.com/studio/build/shrink-code)와 같은 다양한 바이트코드 처리 도구에 의해 수행될 수 있는 null 검사 최적화 수를 증가시킵니다.

개발자 관점에서는 큰 변화가 없을 것입니다. Kotlin 코드는 이전과 동일한 오류 메시지와 함께 예외를 던질 것입니다. 예외 타입은 변경되지만 전달되는 정보는 동일하게 유지됩니다.

### JVM 바이트코드의 타입 어노테이션

Kotlin은 이제 JVM 바이트코드(대상 버전 1.8 이상)에 타입 어노테이션을 생성할 수 있으므로 런타임에 Java 리플렉션에서 사용할 수 있습니다.
바이트코드에 타입 어노테이션을 내보내려면 다음 단계를 따릅니다.

1.  선언된 어노테이션이 적절한 어노테이션 타겟(Java의 `ElementType.TYPE_USE` 또는 Kotlin의 `AnnotationTarget.TYPE`)과 유지 기간(`AnnotationRetention.RUNTIME`)을 가지고 있는지 확인합니다.
2.  어노테이션 클래스 선언을 JVM 바이트코드 타겟 버전 1.8 이상으로 컴파일합니다. `-jvm-target=1.8` 컴파일러 옵션으로 지정할 수 있습니다.
3.  어노테이션을 사용하는 코드를 JVM 바이트코드 타겟 버전 1.8 이상(`-jvm-target=1.8`)으로 컴파일하고 `-Xemit-jvm-type-annotations` 컴파일러 옵션을 추가합니다.

현재 표준 라이브러리의 타입 어노테이션은 바이트코드에 내보내지지 않습니다. 표준 라이브러리가 타겟 버전 1.6으로 컴파일되기 때문입니다.

현재까지는 기본적인 경우만 지원됩니다.

-   메서드 매개변수, 메서드 반환 타입 및 프로퍼티 타입에 대한 타입 어노테이션;
-   타입 인자의 불변 프로젝션 (invariant projection), 예를 들어 `Smth<@Ann Foo>`, `Array<@Ann Foo>`.

다음 예시에서 `String` 타입에 대한 `@Foo` 어노테이션은 바이트코드로 내보내진 다음 라이브러리 코드에서 사용될 수 있습니다.

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JS 플랫폼에서 Kotlin 1.4.0은 다음과 같은 개선 사항을 제공합니다.

-   [새로운 Gradle DSL](#new-gradle-dsl)
-   [새로운 JS IR 백엔드](#new-js-ir-backend)

### 새로운 Gradle DSL

`kotlin.js` Gradle 플러그인에는 조정된 Gradle DSL이 함께 제공되며, 이는 여러 새로운 구성 옵션을 제공하고 `kotlin-multiplatform` 플러그인에서 사용되는 DSL과 더 밀접하게 정렬됩니다. 가장 영향력 있는 변경 사항 중 일부는 다음과 같습니다.

-   `binaries.executable()`을 통한 실행 파일 생성에 대한 명시적 토글. [여기에서 Kotlin/JS 및 해당 환경 실행에 대해 자세히 알아보세요](js-project-setup.md#execution-environments).
-   `cssSupport`를 통해 Gradle 구성 내에서 webpack의 CSS 및 스타일 로더 구성. [여기에서 CSS 및 스타일 로더 사용에 대해 자세히 알아보세요](js-project-setup.md#css).
-   필수 버전 번호 또는 [semver](https://docs.npmjs.com/about-semantic-versioning) 버전 범위를 통한 npm 의존성 관리 개선, `devNpm`, `optionalNpm`, `peerNpm`을 사용한 *개발*, *피어*, *선택적* npm 의존성 지원. [여기에서 Gradle에서 직접 npm 패키지 의존성 관리에 대해 자세히 알아보세요](js-project-setup.md#npm-dependencies).
-   Kotlin 외부 선언을 위한 생성기인 [Dukat](https://github.com/Kotlin/dukat)에 대한 강력한 통합. 이제 외부 선언은 빌드 시간에 생성되거나 Gradle 작업을 통해 수동으로 생성될 수 있습니다.

### 새로운 JS IR 백엔드

현재 [알파 (Alpha)](components-stability.md) 안정성을 가진 [Kotlin/JS용 IR 백엔드](js-ir-compiler.md)는 생성된 코드 크기(데드 코드 제거를 통해) 및 JavaScript 및 TypeScript와의 상호 운용성 개선 등을 중심으로 Kotlin/JS 타겟에 특정한 새로운 기능을 제공합니다.

Kotlin/JS IR 백엔드를 활성화하려면 `gradle.properties` 파일에서 `kotlin.js.compiler=ir` 키를 설정하거나 Gradle 빌드 스크립트의 `js` 함수에 `IR` 컴파일러 타입을 전달합니다.

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

새 백엔드를 구성하는 방법에 대한 자세한 정보는 [Kotlin/JS IR 컴파일러 문서](js-ir-compiler.md)를 참조하세요.

새로운 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 어노테이션과 **[Kotlin 코드에서 TypeScript 정의(.d.ts)를 생성하는 기능](js-project-setup.md#generation-of-typescript-declaration-files-d-ts)**을 통해 Kotlin/JS IR 컴파일러 백엔드는 JavaScript & TypeScript 상호 운용성을 개선합니다. 또한 기존 도구와 Kotlin/JS 코드를 더 쉽게 통합하고 **하이브리드 애플리케이션**을 만들고 멀티플랫폼 프로젝트에서 코드 공유 기능을 활용할 수 있도록 합니다.

[Kotlin/JS IR 컴파일러 백엔드에서 사용할 수 있는 기능에 대해 자세히 알아보세요](js-ir-compiler.md).

## Kotlin/Native

1.4.0에서 Kotlin/Native는 다음과 같은 많은 새로운 기능과 개선 사항을 얻었습니다.

*   [Swift 및 Objective-C에서 Kotlin의 suspend 함수 지원](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
*   [기본적으로 Objective-C 제네릭 지원](#objective-c-generics-support-by-default)
*   [Objective-C/Swift 상호 운용성에서 예외 처리](#exception-handling-in-objective-c-swift-interop)
*   [Apple 타겟에서 기본적으로 릴리스 .dSYM 생성](#generate-release-dsyms-on-apple-targets-by-default)
*   [성능 개선](#performance-improvements)
*   [CocoaPods 의존성 관리 간소화](#simplified-management-of-cocoapods-dependencies)

### Swift 및 Objective-C에서 Kotlin의 suspend 함수 지원

1.4.0에서는 Swift 및 Objective-C에서 suspend 함수에 대한 기본 지원을 추가합니다. 이제 Kotlin 모듈을 Apple 프레임워크로 컴파일할 때 suspend 함수는 콜백이 있는 함수(Swift/Objective-C 용어로 `completionHandler`)로 사용할 수 있습니다. 생성된 프레임워크 헤더에 이러한 함수가 있으면 Swift 또는 Objective-C 코드에서 호출할 수 있으며 심지어 오버라이드할 수도 있습니다.

예를 들어, 다음 Kotlin 함수를 작성하는 경우:

```kotlin
suspend fun queryData(id: Int): String = ...
```

...Swift에서는 다음과 같이 호출할 수 있습니다.

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[Swift 및 Objective-C에서 suspend 함수 사용에 대해 자세히 알아보세요](native-objc-interop.md).

### 기본적으로 Objective-C 제네릭 지원

이전 버전의 Kotlin은 Objective-C 상호 운용성에서 제네릭에 대한 실험적 지원을 제공했습니다. 1.4.0부터 Kotlin/Native는 기본적으로 Kotlin 코드에서 제네릭이 포함된 Apple 프레임워크를 생성합니다. 경우에 따라 이는 Kotlin 프레임워크를 호출하는 기존 Objective-C 또는 Swift 코드를 손상시킬 수 있습니다. 제네릭 없이 프레임워크 헤더를 작성하려면 `-Xno-objc-generics` 컴파일러 옵션을 추가합니다.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

[Objective-C와의 상호 운용성에 대한 문서](native-objc-interop.md#generics)에 나열된 모든 세부 사항과 제한 사항은 여전히 유효합니다.

### Objective-C/Swift 상호 운용성에서 예외 처리

1.4.0에서는 예외가 번역되는 방식과 관련하여 Kotlin에서 생성된 Swift API를 약간 변경합니다. Kotlin과 Swift 사이에는 오류 처리 방식에 근본적인 차이가 있습니다. 모든 Kotlin 예외는 unchecked 예외인 반면, Swift에는 checked 오류만 있습니다. 따라서 Swift 코드가 예상되는 예외를 인식하도록 하려면 Kotlin 함수에 잠재적인 예외 클래스 목록을 지정하는 `@Throws` 어노테이션을 표시해야 합니다.

Swift 또는 Objective-C 프레임워크로 컴파일할 때 `@Throws` 어노테이션을 가지거나 상속하는 함수는 Objective-C에서는 `NSError*`-생성 메서드로, Swift에서는 `throws` 메서드로 표현됩니다.

이전에는 `RuntimeException` 및 `Error`를 제외한 모든 예외가 `NSError`로 전파되었습니다. 이제 이 동작이 변경됩니다. 이제 `NSError`는 `@Throws` 어노테이션의 매개변수로 지정된 클래스(또는 그 서브클래스)의 인스턴스인 예외에 대해서만 던져집니다. Swift/Objective-C에 도달하는 다른 Kotlin 예외는 처리되지 않은 것으로 간주되어 프로그램 종료를 유발합니다.

### Apple 타겟에서 기본적으로 릴리스 .dSYM 생성

1.4.0부터 Kotlin/Native 컴파일러는 기본적으로 Darwin 플랫폼의 릴리스 바이너리에 대해 [디버그 심볼 파일](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)(.dSYM)을 생성합니다. 이는 `-Xadd-light-debug=disable` 컴파일러 옵션으로 비활성화할 수 있습니다. 다른 플랫폼에서는 이 옵션이 기본적으로 비활성화되어 있습니다. Gradle에서 이 옵션을 토글하려면 다음을 사용합니다.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[크래시 보고서 심볼화에 대해 자세히 알아보세요](native-debugging.md#debug-ios-applications).

### 성능 개선

Kotlin/Native는 개발 프로세스와 실행 속도를 모두 향상시키는 많은 성능 개선을 받았습니다.
몇 가지 예시는 다음과 같습니다.

-   객체 할당 속도 향상을 위해 시스템 할당자 대신 [mimalloc](https://github.com/microsoft/mimalloc) 메모리 할당자를 대체 옵션으로 제공합니다. mimalloc은 일부 벤치마크에서 최대 두 배 빠르게 작동합니다.
    현재 Kotlin/Native에서 mimalloc 사용은 실험적입니다. `-Xallocator=mimalloc` 컴파일러 옵션을 사용하여 mimalloc으로 전환할 수 있습니다.

-   C 상호 운용 라이브러리 빌드 방식을 재작업했습니다. 새로운 도구를 통해 Kotlin/Native는 이전보다 최대 4배 빠르게 상호 운용 라이브러리를 생성하며, 아티팩트 크기는 이전의 25%에서 30% 수준입니다.

-   GC 최적화로 인해 전반적인 런타임 성능이 향상되었습니다. 이 개선 사항은 많은 수의 장기 생존 객체가 있는 프로젝트에서 특히 두드러질 것입니다. `HashMap` 및 `HashSet` 컬렉션은 불필요한 boxing을 회피하여 이제 더 빠르게 작동합니다.

-   1.3.70에서는 Kotlin/Native 컴파일 성능을 향상시키기 위한 두 가지 새로운 기능을 도입했습니다.
    [프로젝트 의존성 캐싱 및 Gradle 데몬에서 컴파일러 실행](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native).
    그 이후로 우리는 수많은 문제를 해결하고 이러한 기능의 전반적인 안정성을 개선했습니다.

### CocoaPods 의존성 관리 간소화

이전에는 프로젝트를 의존성 관리자 CocoaPods와 통합하면 iOS, macOS, watchOS, tvOS 프로젝트의 일부만 Xcode에서 빌드할 수 있었고, 멀티플랫폼 프로젝트의 다른 부분과는 별개였습니다. 이 다른 부분은 IntelliJ IDEA에서 빌드할 수 있었습니다.

또한, CocoaPods에 저장된 Objective-C 라이브러리(Pod 라이브러리)에 의존성을 추가할 때마다 IntelliJ IDEA에서 Xcode로 전환하여 `pod install`을 호출하고 Xcode 빌드를 실행해야 했습니다.

이제 IntelliJ IDEA에서 Pod 의존성을 직접 관리할 수 있으며, 코드 하이라이팅 및 자동 완성 등 코드 작업에 이점을 누릴 수 있습니다. 또한 Xcode로 전환할 필요 없이 Gradle로 전체 Kotlin 프로젝트를 빌드할 수 있습니다. 이는 Swift/Objective-C 코드를 작성하거나 시뮬레이터 또는 장치에서 애플리케이션을 실행해야 할 때만 Xcode로 이동하면 된다는 의미입니다.

이제 로컬에 저장된 Pod 라이브러리와도 작업할 수 있습니다.

필요에 따라 다음과 같이 의존성을 추가할 수 있습니다.
*   Kotlin 프로젝트와 CocoaPods 저장소에 원격으로 저장되거나 로컬 머신에 저장된 Pod 라이브러리 간의 의존성.
*   Kotlin Pod(CocoaPods 의존성으로 사용되는 Kotlin 프로젝트)과 하나 이상의 타겟을 가진 Xcode 프로젝트 간의 의존성.

초기 구성을 완료하고 `cocoapods`에 새 의존성을 추가할 때 IntelliJ IDEA에서 프로젝트를 다시 임포트하기만 하면 됩니다. 새 의존성은 자동으로 추가됩니다. 추가 단계는 필요하지 않습니다.

[의존성 추가 방법에 대해 자세히 알아보세요](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html).

## Kotlin 멀티플랫폼

> 멀티플랫폼 프로젝트 지원은 [알파 (Alpha)](components-stability.md) 단계입니다. 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다.
> 이에 대한 피드백을 [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 보내주시면 감사하겠습니다.
>
{style="warning"}

[Kotlin 멀티플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)은 [다양한 플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)에 대해 동일한 코드를 작성하고 유지 관리하는 시간을 줄이면서 네이티브 프로그래밍의 유연성과 이점을 유지합니다. 우리는 멀티플랫폼 기능 및 개선 사항에 계속 투자하고 있습니다.

*   [계층적 프로젝트 구조를 사용하여 여러 타겟에서 코드 공유](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
*   [계층적 구조에서 네이티브 라이브러리 활용](#leveraging-native-libs-in-the-hierarchical-structure)
*   [kotlinx 의존성 한 번만 지정](#specifying-dependencies-only-once)

> 멀티플랫폼 프로젝트는 Gradle 6.0 이상을 필요로 합니다.
>
{style="note"}

### 계층적 프로젝트 구조를 사용하여 여러 타겟에서 코드 공유

새로운 계층적 프로젝트 구조 지원을 통해 [멀티플랫폼 프로젝트](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)에서 [여러 플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets) 간에 코드를 공유할 수 있습니다.

이전에는 멀티플랫폼 프로젝트에 추가된 모든 코드가 플랫폼별 소스 세트(단일 타겟으로 제한되며 다른 플랫폼에서 재사용할 수 없음) 또는 `commonMain` 또는 `commonTest`와 같이 프로젝트의 모든 플랫폼에서 공유되는 공통 소스 세트에 배치될 수 있었습니다. 공통 소스 세트에서는 [플랫폼별 `actual` 구현이 필요한 `expect` 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)을 사용하여 플랫폼별 API를 직접 호출할 수 있었습니다.

이것은 [모든 플랫폼에서 코드를 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)하는 것을 쉽게 만들었지만, [일부 타겟 간에만 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)하는 것은 쉽지 않았습니다. 특히 공통 로직과 타사 API를 많이 재사용할 수 있는 유사한 타겟의 경우 더욱 그러했습니다.

예를 들어, iOS를 타겟으로 하는 일반적인 멀티플랫폼 프로젝트에는 두 가지 iOS 관련 타겟이 있습니다. 하나는 iOS ARM64 장치용이고 다른 하나는 x64 시뮬레이터용입니다. 이들은 별도의 플랫폼별 소스 세트를 가지고 있지만, 실제로는 장치와 시뮬레이터에 다른 코드가 필요한 경우는 거의 없으며, 의존성은 매우 유사합니다. 따라서 iOS 관련 코드를 그들 사이에서 공유할 수 있었습니다.

분명히 이 설정에서는 두 iOS 타겟에 대한 *공유 소스 세트*를 갖는 것이 바람직할 것이며, Kotlin/Native 코드는 iOS 장치와 시뮬레이터 모두에 공통적인 API를 직접 호출할 수 있습니다.

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

이제 [계층적 프로젝트 구조 지원](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)을 통해 이를 수행할 수 있습니다. 이는 각 소스 세트에서 사용 가능한 API 및 언어 기능을 사용하는 타겟에 따라 추론하고 조정합니다.

일반적인 타겟 조합의 경우 타겟 단축키를 사용하여 계층 구조를 생성할 수 있습니다.
예를 들어, `ios()` 단축키를 사용하여 위에 표시된 두 iOS 타겟과 공유 소스 세트를 생성합니다.

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

다른 타겟 조합의 경우 `dependsOn` 관계를 사용하여 [계층 구조를 수동으로 생성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)합니다.

![Hierarchical structure](manual-hierarchical-structure.svg)

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin{
    sourceSets {
        val desktopMain by creating {
            dependsOn(commonMain)
        }
        val linuxX64Main by getting {
            dependsOn(desktopMain)
        }
        val mingwX64Main by getting {
            dependsOn(desktopMain)
        }
        val macosX64Main by getting {
            dependsOn(desktopMain)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        desktopMain {
            dependsOn(commonMain)
        }
        linuxX64Main {
            dependsOn(desktopMain)
        }
        mingwX64Main {
            dependsOn(desktopMain)
        }
        macosX64Main {
            dependsOn(desktopMain)
        }
    }
}

```

</tab>
</tabs>

계층적 프로젝트 구조 덕분에 라이브러리도 타겟의 하위 집합에 대한 공통 API를 제공할 수 있습니다. [라이브러리에서 코드 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)에 대해 자세히 알아보세요.

### 계층적 구조에서 네이티브 라이브러리 활용

Foundation, UIKit, POSIX와 같은 플랫폼 종속 라이브러리를 여러 네이티브 타겟 간에 공유되는 소스 세트에서 사용할 수 있습니다. 이는 플랫폼별 의존성에 제한받지 않고 더 많은 네이티브 코드를 공유하는 데 도움이 될 수 있습니다.

추가 단계는 필요 없습니다. 모든 것이 자동으로 처리됩니다. IntelliJ IDEA는 공유 코드에서 사용할 수 있는 공통 선언을 감지하는 데 도움이 됩니다.

[플랫폼 종속 라이브러리 사용에 대해 자세히 알아보세요](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries).

### 의존성 한 번만 지정

이제부터는 사용되는 공유 및 플랫폼별 소스 세트에서 동일한 라이브러리의 다른 변형에 대한 의존성을 지정하는 대신, 공유 소스 세트에서 한 번만 의존성을 지정해야 합니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</tab>
</tabs>

`-common`, `-native` 등 플랫폼을 지정하는 접미사가 있는 kotlinx 라이브러리 아티팩트 이름은 더 이상 지원되지 않으므로 사용하지 마십시오. 대신 위의 예시에서 `kotlinx-coroutines-core`와 같은 라이브러리 기본 아티팩트 이름을 사용하십시오.

그러나 현재 변경 사항은 다음에는 영향을 미치지 않습니다.
*   `stdlib` 라이브러리 – Kotlin 1.4.0부터 [stdlib 의존성이 자동으로 추가됩니다](#dependency-on-the-standard-library-added-by-default).
*   `kotlin.test` 라이브러리 – 여전히 `test-common` 및 `test-annotations-common`을 사용해야 합니다. 이러한 의존성은 나중에 처리될 것입니다.

특정 플랫폼에만 의존성이 필요한 경우, `-jvm` 또는 `-js`와 같은 접미사가 있는 표준 및 kotlinx 라이브러리의 플랫폼별 변형(예: `kotlinx-coroutines-core-jvm`)을 계속 사용할 수 있습니다.

[의존성 구성 방법에 대해 자세히 알아보세요](gradle-configure-project.md#configure-dependencies).

## Gradle 프로젝트 개선 사항

[Kotlin 멀티플랫폼](#kotlin-multiplatform), [Kotlin/JVM](#kotlin-jvm), [Kotlin/Native](#kotlin-native), [Kotlin/JS](#kotlin-js)에 특정한 Gradle 프로젝트 기능 및 개선 사항 외에도 모든 Kotlin Gradle 프로젝트에 적용되는 몇 가지 변경 사항이 있습니다.

*   [표준 라이브러리에 대한 의존성이 이제 기본적으로 추가됩니다](#dependency-on-the-standard-library-added-by-default)
*   [Kotlin 프로젝트는 최신 버전의 Gradle을 필요로 합니다](#minimum-gradle-version-for-kotlin-projects)
*   [IDE에서 Kotlin Gradle DSL 지원 개선](#improved-gradle-kts-support-in-the-ide)

### 표준 라이브러리에 대한 의존성이 이제 기본적으로 추가됩니다

멀티플랫폼 프로젝트를 포함한 모든 Kotlin Gradle 프로젝트에서 더 이상 `stdlib` 라이브러리에 대한 의존성을 선언할 필요가 없습니다. 의존성은 기본적으로 추가됩니다.

자동으로 추가되는 표준 라이브러리는 Kotlin Gradle 플러그인과 동일한 버전 관리 체계를 따르므로 동일한 버전이 될 것입니다.

플랫폼별 소스 세트의 경우 해당 플랫폼별 라이브러리 변형이 사용되며, 나머지에는 공통 표준 라이브러리가 추가됩니다. Kotlin Gradle 플러그인은 Gradle 빌드 스크립트의 `kotlinOptions.jvmTarget` [컴파일러 옵션](gradle-compiler-options.md)에 따라 적절한 JVM 표준 라이브러리를 선택합니다.

[기본 동작을 변경하는 방법에 대해 알아보세요](gradle-configure-project.md#dependency-on-the-standard-library).

### Kotlin 프로젝트의 최소 Gradle 버전

Kotlin 프로젝트에서 새로운 기능을 사용하려면 Gradle을 [최신 버전](https://gradle.org/releases/)으로 업데이트하세요. 멀티플랫폼 프로젝트는 Gradle 6.0 이상을 필요로 하며, 다른 Kotlin 프로젝트는 Gradle 5.4 이상에서 작동합니다.

### IDE에서 *.gradle.kts 지원 개선

1.4.0에서는 Gradle Kotlin DSL 스크립트(`*.gradle.kts` 파일)에 대한 IDE 지원을 계속 개선했습니다. 새로운 버전의 변경 사항은 다음과 같습니다.

-   더 나은 성능을 위해 *스크립트 구성의 명시적 로딩*. 이전에는 빌드 스크립트에 대한 변경 사항이 백그라운드에서 자동으로 로드되었습니다. 성능 향상을 위해 1.4.0에서는 빌드 스크립트 구성의 자동 로딩을 비활성화했습니다. 이제 IDE는 명시적으로 변경 사항을 적용할 때만 변경 사항을 로드합니다.

    Gradle 6.0 이전 버전에서는 편집기에서 **Load Configuration**을 클릭하여 스크립트 구성을 수동으로 로드해야 합니다.

    ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

    Gradle 6.0 이상에서는 **Load Gradle Changes**를 클릭하거나 Gradle 프로젝트를 다시 임포트하여 변경 사항을 명시적으로 적용할 수 있습니다.

    IntelliJ IDEA 2020.1 및 Gradle 6.0 이상에서는 **Load Script Configurations**라는 추가 작업을 추가했습니다. 이 작업은 전체 프로젝트를 업데이트하지 않고 스크립트 구성에 대한 변경 사항을 로드합니다. 이는 전체 프로젝트를 다시 임포트하는 것보다 훨씬 적은 시간이 소요됩니다.

    ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

    새로 생성된 스크립트나 새 Kotlin 플러그인으로 프로젝트를 처음 열 때도 **Load Script Configurations**를 수행해야 합니다.

    Gradle 6.0 이상에서는 이제 모든 스크립트를 한 번에 로드할 수 있습니다. 이전 구현에서는 개별적으로 로드되었습니다. 각 요청에는 Gradle 구성 단계가 실행되어야 하므로 대규모 Gradle 프로젝트의 경우 리소스 집약적일 수 있습니다.

    현재 이러한 로딩은 `build.gradle.kts` 및 `settings.gradle.kts` 파일로 제한됩니다(관련 [이슈](https://github.com/gradle/gradle/issues/12640)에 투표해 주십시오).
    `init.gradle.kts` 또는 적용된 [스크립트 플러그인](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)에 대한 하이라이팅을 활성화하려면 이전 메커니즘을 사용하십시오. 즉, 독립 실행형 스크립트에 추가하십시오. 해당 스크립트에 대한 구성은 필요할 때 별도로 로드됩니다.
    또한 이러한 스크립트에 대해 자동 재로딩을 활성화할 수도 있습니다.

    ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)

-   *더 나은 오류 보고*. 이전에는 Gradle Daemon의 오류를 별도의 로그 파일에서만 볼 수 있었습니다. 이제 Gradle Daemon은 오류에 대한 모든 정보를 직접 반환하고 빌드 도구 창에 표시합니다. 이는 시간과 노력을 모두 절약해 줍니다.

## 표준 라이브러리

다음은 1.4.0의 Kotlin 표준 라이브러리에 대한 가장 중요한 변경 사항 목록입니다.

-   [공통 예외 처리 API](#common-exception-processing-api)
-   [배열 및 컬렉션을 위한 새로운 함수](#new-functions-for-arrays-and-collections)
-   [문자열 조작을 위한 함수](#functions-for-string-manipulations)
-   [비트 연산](#bit-operations)
-   [위임된 프로퍼티 개선](#delegated-properties-improvements)
-   [KType에서 Java Type으로 변환](#converting-from-ktype-to-java-type)
-   [Kotlin 리플렉션을 위한 Proguard 구성](#proguard-configurations-for-kotlin-reflection)
-   [기존 API 개선](#improving-the-existing-api)
-   [stdlib 아티팩트를 위한 module-info 디스크립터](#module-info-descriptors-for-stdlib-artifacts)
-   [사용 중단](#deprecations)
-   [사용 중단된 실험적 코루틴 제외](#exclusion-of-the-deprecated-experimental-coroutines)

### 공통 예외 처리 API

다음 API 요소가 공통 라이브러리로 이동했습니다.

*   `Throwable.stackTraceToString()` 확장 함수는 스택 트레이스와 함께 이 throwable의 상세 설명을 반환하고, `Throwable.printStackTrace()`는 이 설명을 표준 오류 출력에 인쇄합니다.
*   `Throwable.addSuppressed()` 함수는 예외를 전달하기 위해 억제된 예외를 지정할 수 있게 하며, `Throwable.suppressedExceptions` 프로퍼티는 억제된 모든 예외 목록을 반환합니다.
*   `@Throws` 어노테이션은 함수가 플랫폼 메서드로 컴파일될 때(JVM 또는 네이티브 플랫폼에서) 검사될 예외 타입을 나열합니다.

### 배열 및 컬렉션을 위한 새로운 함수

#### 컬렉션

1.4.0에서는 표준 라이브러리에 **컬렉션** 작업을 위한 여러 유용한 함수가 포함되어 있습니다.

*   `setOfNotNull()`은 제공된 인자 중에서 null이 아닌 모든 항목으로 구성된 세트를 만듭니다.

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   시퀀스용 `shuffled()`.

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = (0 until 50).asSequence()
        val result = numbers.map { it * 2 }.shuffled().take(5)
        println(result.toList()) //five random even numbers below 100
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `onEach()` 및 `flatMap()`에 대한 `*Indexed()` 대응 함수.
    이들이 컬렉션 요소에 적용하는 작업은 요소 인덱스를 매개변수로 가집니다.

    ```kotlin
    fun main() {
    //sampleStart
        listOf("a", "b", "c", "d").onEachIndexed {
            index, item -> println(index.toString() + ":" + item)
        }
    
       val list = listOf("hello", "kot", "lin", "world")
              val kotlin = list.flatMapIndexed { index, item ->
                  if (index in 1..2) item.toList() else emptyList() 
              }
    //sampleEnd
              println(kotlin)
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `randomOrNull()`, `reduceOrNull()`, `reduceIndexedOrNull()`의 `*OrNull()` 대응 함수.
    이들은 빈 컬렉션에 대해 `null`을 반환합니다.

    ```kotlin
    fun main() {
    //sampleStart
         val empty = emptyList<Int>()
         empty.reduceOrNull { a, b -> a + b }
         //empty.reduce { a, b -> a + b } // Exception: Empty collection can't be reduced.
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `runningFold()`, 그 동의어 `scan()`, 그리고 `runningReduce()`는 `fold()` 및 `reduce()`와 유사하게 컬렉션 요소에 주어진 연산을 순차적으로 적용합니다. 차이점은 이 새로운 함수들이 모든 중간 결과의 시퀀스를 반환한다는 것입니다.

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = mutableListOf(0, 1, 2, 3, 4, 5)
        val runningReduceSum = numbers.runningReduce { sum, item -> sum + item }
        val runningFoldSum = numbers.runningFold(10) { sum, item -> sum + item }
    //sampleEnd
        println(runningReduceSum.toString())
        println(runningFoldSum.toString())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `sumOf()`는 셀렉터 함수를 받아 컬렉션의 모든 요소에 대한 해당 값의 합계를 반환합니다.
    `sumOf()`는 `Int`, `Long`, `Double`, `UInt`, `ULong` 타입의 합계를 생성할 수 있습니다. JVM에서는 `BigInteger` 및 `BigDecimal`도 사용할 수 있습니다.

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
    
        val total = order.sumOf { it.price * it.count } // Double
        val count = order.sumOf { it.count } // Int
    //sampleEnd
        println("You've ordered $count items that cost $total in total")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `min()` 및 `max()` 함수는 Kotlin 컬렉션 API 전반에 걸쳐 사용되는 명명 규칙을 준수하기 위해 `minOrNull()` 및 `maxOrNull()`로 이름이 변경되었습니다. 함수 이름의 `*OrNull` 접미사는 수신자 컬렉션이 비어 있으면 `null`을 반환한다는 의미입니다. `minBy()`, `maxBy()`, `minWith()`, `maxWith()`도 마찬가지입니다. 1.4에서는 이들의 `*OrNull()` 동의어가 추가되었습니다.
*   새로운 `minOf()` 및 `maxOf()` 확장 함수는 컬렉션 항목에 대한 주어진 셀렉터 함수의 최소 및 최대 값을 반환합니다.

    ```kotlin
    data class OrderItem(val name: String, val price: Double, val count: Int)
    
    fun main() {
    //sampleStart
        val order = listOf<OrderItem>(
            OrderItem("Cake", price = 10.0, count = 1),
            OrderItem("Coffee", price = 2.5, count = 3),
            OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    `Comparator`를 인자로 받는 `minOfWith()` 및 `maxOfWith()`도 있으며, 빈 컬렉션에 대해 `null`을 반환하는 네 가지 함수의 `*OrNull()` 버전도 있습니다.

*   `flatMap` 및 `flatMapTo`의 새로운 오버로드(overload)는 반환 타입이 수신자 타입과 일치하지 않는 변환을 사용할 수 있도록 합니다. 즉, 다음과 같습니다.
    *   `Iterable`, `Array`, `Map`에서 `Sequence`로의 변환
    *   `Sequence`에서 `Iterable`로의 변환

    ```kotlin
    fun main() {
    //sampleStart
        val list = listOf("kot", "lin")
        val lettersList = list.flatMap { it.asSequence() }
        val lettersSeq = list.asSequence().flatMap { it.toList() }    
    //sampleEnd
        println(lettersList)
        println(lettersSeq.toList())
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   가변 목록에서 요소를 제거하기 위한 `removeFirst()` 및 `removeLast()` 단축키, 그리고 이 함수들의 `*orNull()` 대응 함수.

#### 배열

다양한 컨테이너 타입 작업 시 일관된 경험을 제공하기 위해 **배열**을 위한 새로운 함수도 추가했습니다.

*   `shuffle()`는 배열 요소를 무작위 순서로 배치합니다.
*   `onEach()`는 각 배열 요소에 지정된 작업을 수행하고 배열 자체를 반환합니다.
*   `associateWith()` 및 `associateWithTo()`는 배열 요소를 키로 사용하여 맵을 생성합니다.
*   `reverse()`는 배열 서브레인지(subrange)에 대해 서브레인지의 요소 순서를 뒤집습니다.
*   `sortDescending()`는 배열 서브레인지에 대해 서브레인지의 요소를 내림차순으로 정렬합니다.
*   `sort()` 및 `sortWith()`는 배열 서브레인지에 대해 이제 공통 라이브러리에서 사용할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    var language = ""
    val letters = arrayOf("k", "o", "t", "l", "i", "n")
    val fileExt = letters.onEach { language += it }
       .filterNot { it in "aeuio" }.take(2)
       .joinToString(prefix = ".", separator = "")
    println(language) // "kotlin"
    println(fileExt) // ".kt"

    letters.shuffle()
    letters.reverse(0, 3)
    letters.sortDescending(2, 5)
    println(letters.contentToString()) // [k, o, t, l, i, n]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

또한, `CharArray`/`ByteArray`와 `String` 간의 변환을 위한 새로운 함수가 있습니다.
*   `ByteArray.decodeToString()` 및 `String.encodeToByteArray()`
*   `CharArray.concatToString()` 및 `String.toCharArray()`

```kotlin
fun main() {
//sampleStart
	val str = "kotlin"
    val array = str.toCharArray()
    println(array.concatToString())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

#### ArrayDeque

또한 `ArrayDeque` 클래스를 추가했습니다. 이는 양방향 큐의 구현입니다.
양방향 큐를 사용하면 큐의 시작 또는 끝에서 요소를 상각된 상수 시간에 추가하거나 제거할 수 있습니다. 코드에서 큐 또는 스택이 필요할 때 기본적으로 양방향 큐를 사용할 수 있습니다.

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

`ArrayDeque` 구현은 내부적으로 크기 조절 가능한 배열을 사용합니다. 내용을 순환 버퍼인 `Array`에 저장하고, 가득 찼을 때만 이 `Array`의 크기를 조절합니다.

### 문자열 조작을 위한 함수

1.4.0의 표준 라이브러리에는 문자열 조작을 위한 API에 여러 개선 사항이 포함되어 있습니다.

*   `StringBuilder`에는 `set()`, `setRange()`, `deleteAt()`, `deleteRange()`, `appendRange()` 등 유용한 새로운 확장 함수가 추가되었습니다.

    ```kotlin
        fun main() {
        //sampleStart
            val sb = StringBuilder("Bye Kotlin 1.3.72")
            sb.deleteRange(0, 3)
            sb.insertRange(0, "Hello", 0 ,5)
            sb.set(15, '4')
            sb.setRange(17, 19, "0")
            print(sb.toString())
        //sampleEnd
        }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

*   `StringBuilder`의 일부 기존 함수는 공통 라이브러리에서 사용할 수 있습니다. 여기에는 `append()`, `insert()`, `substring()`, `setLength()` 등이 포함됩니다.
*   공통 라이브러리에 새로운 함수 `Appendable.appendLine()` 및 `StringBuilder.appendLine()`이 추가되었습니다. 이들은 이 클래스들의 JVM 전용 `appendln()` 함수를 대체합니다.

    ```kotlin
    fun main() {
    //sampleStart
        println(buildString {
            appendLine("Hello,")
            appendLine("world")
        })
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 비트 연산

비트 조작을 위한 새로운 함수:
*   `countOneBits()`
*   `countLeadingZeroBits()`
*   `countTrailingZeroBits()`
*   `takeHighestOneBit()`
*   `takeLowestOneBit()`
*   `rotateLeft()` 및 `rotateRight()` (실험적)

```kotlin
fun main() {
//sampleStart
    val number = "1010000".toInt(radix = 2)
    println(number.countOneBits())
    println(number.countTrailingZeroBits())
    println(number.takeHighestOneBit().toString(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### 위임된 프로퍼티 개선

1.4.0에서는 Kotlin에서 위임된 프로퍼티를 사용하는 경험을 향상시키기 위해 새로운 기능을 추가했습니다.
- 이제 프로퍼티를 다른 프로퍼티에 위임할 수 있습니다.
- 새로운 인터페이스 `PropertyDelegateProvider`는 단일 선언으로 위임 제공자를 생성하는 데 도움이 됩니다.
- `ReadWriteProperty`는 이제 `ReadOnlyProperty`를 상속하므로 읽기 전용 프로퍼티에 둘 다 사용할 수 있습니다.

새로운 API 외에도 결과 바이트코드 크기를 줄이는 일부 최적화를 수행했습니다. 이러한 최적화는 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)에 설명되어 있습니다.

[위임된 프로퍼티에 대해 자세히 알아보세요](delegated-properties.md).

### KType에서 Java Type으로 변환

stdlib의 새로운 확장 프로퍼티 `KType.javaType` (현재 실험적)는 전체 `kotlin-reflect` 의존성 없이 Kotlin 타입에서 `java.lang.reflect.Type`을 얻는 데 도움이 됩니다.

```kotlin
import kotlin.reflect.javaType
import kotlin.reflect.typeOf

@OptIn(ExperimentalStdlibApi::class)
inline fun <reified T> accessReifiedTypeArg() {
   val kType = typeOf<T>()
   println("Kotlin type: $kType")
   println("Java type: ${kType.javaType}")
}

@OptIn(ExperimentalStdlibApi::class)
fun main() {
   accessReifiedTypeArg<String>()
   // Kotlin type: kotlin.String
   // Java type: class java.lang.String
  
   accessReifiedTypeArg<List<String>>()
   // Kotlin type: kotlin.collections.List<kotlin.String>
   // Java type: java.util.List<java.lang.String>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

### Kotlin 리플렉션을 위한 Proguard 구성

1.4.0부터 `kotlin-reflect.jar`에 Kotlin 리플렉션용 Proguard/R8 구성이 내장되었습니다. 이를 통해 R8 또는 Proguard를 사용하는 대부분의 Android 프로젝트는 추가 구성 없이 kotlin-reflect와 함께 작동해야 합니다.
더 이상 kotlin-reflect 내부를 위한 Proguard 규칙을 복사하여 붙여넣을 필요가 없습니다. 하지만 리플렉션하려는 모든 API는 명시적으로 나열해야 합니다.

### 기존 API 개선

*   이제 일부 함수는 null 수신자에서도 작동합니다. 예를 들면 다음과 같습니다.
    *   문자열의 `toBoolean()`
    *   배열의 `contentEquals()`, `contentHashcode()`, `contentToString()`

*   `Double` 및 `Float`의 `NaN`, `NEGATIVE_INFINITY`, `POSITIVE_INFINITY`는 이제 `const`로 정의되어 어노테이션 인자로 사용할 수 있습니다.

*   `Double` 및 `Float`의 새로운 상수 `SIZE_BITS` 및 `SIZE_BYTES`는 이진 형식으로 타입 인스턴스를 표현하는 데 사용되는 비트 및 바이트 수를 포함합니다.

*   `maxOf()` 및 `minOf()` 최상위 함수는 가변 인자(`vararg`)를 받을 수 있습니다.

### stdlib 아티팩트를 위한 module-info 디스크립터

Kotlin 1.4.0은 기본 표준 라이브러리 아티팩트에 `module-info.java` 모듈 정보를 추가합니다. 이를 통해 애플리케이션에 필요한 플랫폼 모듈만 포함하는 사용자 정의 Java 런타임 이미지를 생성하는 [jlink 도구](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)와 함께 사용할 수 있습니다.
이전에는 Kotlin 표준 라이브러리 아티팩트와 jlink를 함께 사용할 수 있었지만, 별도의 아티팩트(`modular` 분류자가 있는 아티팩트)를 사용해야 했으며 전체 설정이 복잡했습니다.
Android에서는 module-info가 포함된 jar 파일을 올바르게 처리할 수 있는 Android Gradle 플러그인 버전 3.2 이상을 사용하고 있는지 확인하세요.

### 사용 중단

#### Double 및 Float의 toShort() 및 toByte()

`Double` 및 `Float`의 `toShort()` 및 `toByte()` 함수는 좁은 값 범위와 작은 변수 크기 때문에 예상치 못한 결과를 초래할 수 있으므로 사용 중단되었습니다.

부동 소수점 숫자를 `Byte` 또는 `Short`로 변환하려면 두 단계 변환을 사용하세요. 먼저 `Int`로 변환한 다음, 대상 타입으로 다시 변환합니다.

#### 부동 소수점 배열의 contains(), indexOf(), lastIndexOf()

`FloatArray` 및 `DoubleArray`의 `contains()`, `indexOf()`, `lastIndexOf()` 확장 함수는 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 표준 동등성을 사용하기 때문에 사용 중단되었습니다. 이는 일부 모서리(corner) 케이스에서 전체 순서 동등성과 모순됩니다. 자세한 내용은 [이 이슈](https://youtrack.jetbrains.com/issue/KT-28753)를 참조하세요.

#### min() 및 max() 컬렉션 함수

`min()` 및 `max()` 컬렉션 함수는 빈 컬렉션에 대해 `null`을 반환하는 동작을 더 적절하게 반영하는 `minOrNull()` 및 `maxOrNull()`로 대체되어 사용 중단되었습니다.
자세한 내용은 [이 이슈](https://youtrack.jetbrains.com/issue/KT-38854)를 참조하세요.

### 사용 중단된 실험적 코루틴 제외

`kotlin.coroutines.experimental` API는 1.3.0에서 `kotlin.coroutines`를 선호하여 사용 중단되었습니다. 1.4.0에서는 표준 라이브러리에서 `kotlin.coroutines.experimental`을 제거하여 사용 중단 주기를 완료합니다. JVM에서 여전히 이를 사용하는 사용자를 위해, 모든 실험적 코루틴 API가 포함된 호환성 아티팩트 `kotlin-coroutines-experimental-compat.jar`를 제공했습니다. 이를 Maven에 게시했으며, 표준 라이브러리와 함께 Kotlin 배포판에 포함합니다.

## 안정적인 JSON 직렬화

Kotlin 1.4.0과 함께 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)의 첫 번째 안정 버전인 1.0.0-RC를 출시합니다. 이제 `kotlinx-serialization-core`(이전에는 `kotlinx-serialization-runtime`으로 알려짐)의 JSON 직렬화 API가 안정적임을 선언하게 되어 기쁩니다. 다른 직렬화 형식에 대한 라이브러리는 코어 라이브러리의 일부 고급 부분과 함께 여전히 실험적입니다.

JSON 직렬화 API를 더 일관되고 사용하기 쉽게 만들기 위해 상당한 재작업을 수행했습니다. 이제부터 JSON 직렬화 API를 이전 버전과 호환되는 방식으로 계속 개발할 것입니다.
그러나 이전 버전을 사용한 경우 1.0.0-RC로 마이그레이션할 때 일부 코드를 다시 작성해야 할 수도 있습니다. 이를 돕기 위해 **[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)**도 제공합니다. 이는 `kotlinx.serialization`에 대한 완전한 문서 세트입니다. 가장 중요한 기능을 사용하는 과정을 안내하고 직면할 수 있는 모든 문제를 해결하는 데 도움이 될 수 있습니다.

>**참고**: `kotlinx-serialization` 1.0.0-RC는 Kotlin 컴파일러 1.4에서만 작동합니다. 이전 컴파일러 버전은 호환되지 않습니다.
>
{style="note"}

## 스크립팅 및 REPL

1.4.0에서는 Kotlin의 스크립팅이 기능 및 성능 개선과 기타 업데이트를 통해 이점을 얻습니다.
다음은 몇 가지 주요 변경 사항입니다.

-   [새로운 의존성 해결 API](#new-dependencies-resolution-api)
-   [새로운 REPL API](#new-repl-api)
-   [컴파일된 스크립트 캐시](#compiled-scripts-cache)
-   [아티팩트 이름 변경](#artifacts-renaming)

Kotlin에서 스크립팅에 더 익숙해지도록 돕기 위해 [예시 프로젝트](https://github.com/Kotlin/kotlin-script-examples)를 준비했습니다.
여기에는 표준 스크립트(`*.main.kts`) 예시와 Kotlin Scripting API 및 사용자 정의 스크립트 정의 사용 예시가 포함되어 있습니다. 사용해 보시고 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)를 통해 피드백을 공유해 주십시오.

### 새로운 의존성 해결 API

1.4.0에서는 외부 의존성(예: Maven 아티팩트)을 해결하기 위한 새로운 API를 구현과 함께 도입했습니다. 이 API는 새로운 아티팩트 `kotlin-scripting-dependencies` 및 `kotlin-scripting-dependencies-maven`에 게시됩니다.
`kotlin-script-util` 라이브러리의 이전 의존성 해결 기능은 이제 사용 중단되었습니다.

### 새로운 REPL API

새로운 실험적 REPL API는 이제 Kotlin Scripting API의 일부입니다. 게시된 아티팩트에도 여러 구현이 있으며, 일부는 코드 완성(code completion)과 같은 고급 기능을 가지고 있습니다. 우리는 이 API를 [Kotlin Jupyter 커널](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)에서 사용하며, 이제 자신의 사용자 정의 셸과 REPL에서 이를 사용해 볼 수 있습니다.

### 컴파일된 스크립트 캐시

Kotlin Scripting API는 이제 컴파일된 스크립트 캐시를 구현하는 기능을 제공하여 변경되지 않은 스크립트의 후속 실행 속도를 크게 향상시킵니다. 기본 고급 스크립트 구현인 `kotlin-main-kts`는 이미 자체 캐시를 가지고 있습니다.

### 아티팩트 이름 변경

아티팩트 이름에 대한 혼동을 피하기 위해 `kotlin-scripting-jsr223-embeddable` 및 `kotlin-scripting-jvm-host-embeddable`의 이름을 각각 `kotlin-scripting-jsr223` 및 `kotlin-scripting-jvm-host`로 변경했습니다. 이 아티팩트들은 번들된 타사 라이브러리의 충돌을 피하기 위해 쉐이딩(shade)하는 `kotlin-compiler-embeddable` 아티팩트에 의존합니다. 이번 이름 변경을 통해 스크립팅 아티팩트의 기본 사용을 `kotlin-compiler-embeddable`(일반적으로 더 안전함)로 만들고 있습니다.
어떤 이유로든 쉐이딩되지 않은 `kotlin-compiler`에 의존하는 아티팩트가 필요한 경우, `-unshaded` 접미사가 있는 아티팩트 버전(예: `kotlin-scripting-jsr223-unshaded`)을 사용하십시오. 이 이름 변경은 직접 사용하도록 되어 있는 스크립팅 아티팩트에만 영향을 미치며, 다른 아티팩트의 이름은 변경되지 않습니다.

## Kotlin 1.4.0으로 마이그레이션

Kotlin 플러그인의 마이그레이션 도구는 이전 버전의 Kotlin에서 1.4.0으로 프로젝트를 마이그레이션하는 데 도움이 됩니다.

Kotlin 버전을 `1.4.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하기만 하면 됩니다. 그러면 IDE가 마이그레이션에 대해 묻습니다.

동의하면 마이그레이션 코드 검사를 실행하여 코드를 확인하고 작동하지 않거나 1.4.0에서 권장되지 않는 모든 사항에 대한 수정 사항을 제안합니다.

![Run migration](run-migration-wn.png){width=300}

코드 검사는 [심각도 수준](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)이 달라 어떤 제안을 수락하고 어떤 제안을 무시할지 결정하는 데 도움이 됩니다.

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0은 [기능 릴리스 (feature release)](kotlin-evolution-principles.md#language-and-tooling-releases)이므로 언어에 호환되지 않는 변경 사항을 가져올 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은 **[Kotlin 1.4 호환성 가이드 (Compatibility Guide for Kotlin 1.4)](compatibility-guide-14.md)**에서 찾을 수 있습니다.