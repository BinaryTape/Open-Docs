[//]: # (title: Kotlin 1.4.0의 새로운 기능)

_[릴리스: 2020년 8월 17일](releases.md#release-details)_

Kotlin 1.4.0에서는 모든 구성 요소에서 여러 개선 사항을 제공하며, [품질 및 성능에 중점](https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/)을 두었습니다.
다음은 Kotlin 1.4.0에서 가장 중요한 변경 사항 목록입니다.

## 언어 기능 및 개선 사항

Kotlin 1.4.0은 다양한 언어 기능과 개선 사항을 포함합니다. 내용은 다음과 같습니다.

* [Kotlin 인터페이스를 위한 SAM 변환](#sam-conversions-for-kotlin-interfaces)
* [라이브러리 작성자를 위한 명시적 API 모드](#explicit-api-mode-for-library-authors)
* [이름 있는 인수와 위치 인수의 혼합 사용](#mixing-named-and-positional-arguments)
* [후행 쉼표](#trailing-comma)
* [호출 가능 참조 개선](#callable-reference-improvements)
* [루프 내 `when` 표현식에서 `break` 및 `continue` 사용](#using-break-and-continue-inside-when-expressions-included-in-loops)

### Kotlin 인터페이스를 위한 SAM 변환

Kotlin 1.4.0 이전에는 Kotlin에서 Java 메서드 및 Java 인터페이스를 작업할 때만 SAM(단일 추상 메서드) 변환을 적용할 수 있었습니다. 이제부터는 Kotlin 인터페이스에도 SAM 변환을 사용할 수 있습니다. 이를 위해 Kotlin 인터페이스를 `fun` 한정자로 명시적으로 함수형으로 표시해야 합니다.

SAM 변환은 단일 추상 메서드만 있는 인터페이스가 매개변수로 예상될 때 람다를 인수로 전달하는 경우에 적용됩니다. 이 경우 컴파일러는 람다를 추상 멤버 함수를 구현하는 클래스의 인스턴스로 자동 변환합니다.

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

[Kotlin 함수형 인터페이스 및 SAM 변환에 대해 자세히 알아보세요](fun-interfaces.md).

### 라이브러리 작성자를 위한 명시적 API 모드

Kotlin 컴파일러는 라이브러리 작성자를 위한 _명시적 API 모드_를 제공합니다. 이 모드에서 컴파일러는 라이브러리 API를 더 명확하고 일관성 있게 만드는 데 도움이 되는 추가 검사를 수행합니다. 라이브러리의 공개 API에 노출되는 선언에 대해 다음 요구 사항을 추가합니다.

* 기본 가시성(visibility)이 공개 API에 노출하는 선언에는 가시성 한정자(visibility modifiers)가 필요합니다. 이는 의도치 않게 공개 API에 노출되는 선언이 없도록 하는 데 도움이 됩니다.
* 공개 API에 노출되는 프로퍼티 및 함수에는 명시적 타입 명세(type specifications)가 필요합니다. 이는 API 사용자가 사용하는 API 멤버의 타입을 인지하도록 보장합니다.

구성(configuration)에 따라 이러한 명시적 API는 오류(_strict_ 모드) 또는 경고(_warning_ 모드)를 발생시킬 수 있습니다. 가독성과 상식적인 이유로 특정 종류의 선언은 이러한 검사에서 제외됩니다.

* 주 생성자
* 데이터 클래스의 프로퍼티
* 프로퍼티 getter 및 setter
* `override` 메서드

명시적 API 모드는 모듈의 프로덕션 소스만 분석합니다.

명시적 API 모드에서 모듈을 컴파일하려면 Gradle 빌드 스크립트에 다음 줄을 추가하세요.

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

명령줄 컴파일러를 사용할 때는 `-Xexplicit-api` 컴파일러 옵션에 `strict` 또는 `warning` 값을 추가하여 명시적 API 모드로 전환할 수 있습니다.

```bash
-Xexplicit-api={strict|warning}
```

[KEEP에서 명시적 API 모드에 대한 자세한 내용을 확인하세요](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md).

### 이름 있는 인수와 위치 인수의 혼합 사용

Kotlin 1.3에서 [이름 있는 인수](functions.md#named-arguments)를 사용하여 함수를 호출할 때, 이름 없는 인수(위치 인수)를 첫 번째 이름 있는 인수 앞에 배치해야 했습니다. 예를 들어, `f(1, y = 2)`는 호출할 수 있었지만, `f(x = 1, 2)`는 호출할 수 없었습니다.

모든 인수가 올바른 위치에 있지만 중간에 있는 한 인수에 이름을 지정하고 싶을 때 정말 불편했습니다. 이는 `boolean` 또는 `null` 값이 어떤 속성에 속하는지 명확하게 하는 데 특히 유용했습니다.

Kotlin 1.4에서는 이러한 제한이 없습니다. 이제 위치 인수의 중간에 있는 인수에 이름을 지정할 수 있습니다. 또한, 올바른 순서를 유지하는 한 위치 인수와 이름 있는 인수를 원하는 방식으로 혼합하여 사용할 수 있습니다.

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

Kotlin 1.4에서는 인수 및 매개변수 목록, `when` 항목, 구조 분해 선언 구성 요소와 같은 열거형에 후행 쉼표를 추가할 수 있습니다. 후행 쉼표를 사용하면 쉼표를 추가하거나 제거하지 않고도 새 항목을 추가하고 순서를 변경할 수 있습니다.

이는 매개변수나 값에 여러 줄 구문을 사용하는 경우 특히 유용합니다. 후행 쉼표를 추가한 후에는 매개변수나 값이 있는 줄을 쉽게 바꿀 수 있습니다.

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

### 호출 가능 참조 개선

Kotlin 1.4는 호출 가능 참조를 사용하는 더 많은 경우를 지원합니다.

* 기본 인수 값을 가진 함수에 대한 참조
* `Unit`을 반환하는 함수에서 함수 참조
* 함수 인수의 수에 따라 적응하는 참조
* 호출 가능 참조에서 `suspend` 변환

#### 기본 인수 값을 가진 함수에 대한 참조

이제 기본 인수 값을 가진 함수에 호출 가능 참조를 사용할 수 있습니다. 함수 `foo`에 대한 호출 가능 참조가 인수를 받지 않으면 기본값 `0`이 사용됩니다.

```kotlin
fun foo(i: Int = 0): String = "$i!"

fun apply(func: () -> String): String = func()

fun main() {
    println(apply(::foo))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

이전에는 기본 인수 값을 사용하기 위해 함수 `apply`에 대한 추가 오버로드를 작성해야 했습니다.

```kotlin
// some new overload
fun applyInt(func: (Int) -> String): String = func(0) 
```

#### `Unit`을 반환하는 함수에서 함수 참조

Kotlin 1.4에서는 `Unit`을 반환하는 함수에서 어떤 타입이든 반환하는 함수에 호출 가능 참조를 사용할 수 있습니다. Kotlin 1.4 이전에는 이 경우에 람다 인수만 사용할 수 있었습니다. 이제 람다 인수와 호출 가능 참조를 모두 사용할 수 있습니다.

```kotlin
fun foo(f: () -> Unit) { }
fun returnsInt(): Int = 42

fun main() {
    foo { returnsInt() } // this was the only way to do it  before 1.4
    foo(::returnsInt) // starting from 1.4, this also works
}
```

#### 함수 인수의 수에 따라 적응하는 참조

이제 가변 개수의 인수(`vararg`)를 전달할 때 함수에 대한 호출 가능 참조를 적용할 수 있습니다. 전달된 인수 목록의 끝에 동일한 타입의 매개변수를 원하는 만큼 전달할 수 있습니다.

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

#### 호출 가능 참조에서 `suspend` 변환

람다에 대한 `suspend` 변환 외에도, Kotlin은 1.4.0 버전부터 호출 가능 참조에 대한 `suspend` 변환을 지원합니다.

```kotlin
fun call() {}
fun takeSuspend(f: suspend () -> Unit) {}

fun test() {
    takeSuspend { call() } // OK before 1.4
    takeSuspend(::call) // In Kotlin 1.4, it also works
}
```

### 루프 내 `when` 표현식에서 `break` 및 `continue` 사용

Kotlin 1.3에서는 루프에 포함된 `when` 표현식 내에서 한정되지 않은 `break` 및 `continue`를 사용할 수 없었습니다. 그 이유는 이 키워드들이 `when` 표현식에서 가능한 [폴스루 동작](https://en.wikipedia.org/wiki/Switch_statement#Fallthrough)을 위해 예약되어 있었기 때문입니다.

그래서 루프 내 `when` 표현식에서 `break`와 `continue`를 사용하려면 [레이블](returns.md#break-and-continue-labels)을 지정해야 했고, 이는 다소 번거로웠습니다.

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

Kotlin 1.4에서는 루프에 포함된 `when` 표현식 내에서 레이블 없이 `break`와 `continue`를 사용할 수 있습니다. 이는 가장 가까운 바깥쪽 루프를 종료하거나 다음 단계로 진행하는 예상대로 동작합니다.

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

`when` 내부의 폴스루(fall-through) 동작은 추가적인 설계가 필요합니다.

## IDE의 새로운 도구

Kotlin 1.4에서는 IntelliJ IDEA의 새로운 도구를 사용하여 Kotlin 개발을 단순화할 수 있습니다.

* [새로운 유연한 프로젝트 위자드](#new-flexible-project-wizard)
* [코루틴 디버거](#coroutine-debugger)

### 새로운 유연한 프로젝트 위자드

유연하고 새로운 Kotlin 프로젝트 위자드를 사용하면 UI 없이 구성하기 어려울 수 있는 멀티플랫폼 프로젝트를 포함하여 다양한 유형의 Kotlin 프로젝트를 쉽게 생성하고 구성할 수 있습니다.

![Kotlin Project Wizard – Multiplatform project](multiplatform-project-1-wn.png)

새로운 Kotlin 프로젝트 위자드는 간단하면서도 유연합니다.

1. 수행하려는 작업에 따라 *프로젝트 템플릿을 선택*하세요. 향후 더 많은 템플릿이 추가될 예정입니다.
2. *빌드 시스템*을 선택하세요 – Gradle (Kotlin 또는 Groovy DSL), Maven, 또는 IntelliJ IDEA. Kotlin 프로젝트 위자드는 선택한 프로젝트 템플릿에서 지원되는 빌드 시스템만 표시합니다.
3. 메인 화면에서 직접 *프로젝트 구조를 미리보기*할 수 있습니다.

그런 다음 프로젝트 생성을 완료하거나, 선택적으로 다음 화면에서 *프로젝트를 구성*할 수 있습니다.

4. 이 프로젝트 템플릿에서 지원되는 *모듈 및 타겟을 추가/제거*할 수 있습니다.
5. *모듈 및 타겟 설정*을 구성할 수 있습니다. 예를 들어, 타겟 JVM 버전, 타겟 템플릿 및 테스트 프레임워크 등이 있습니다.

![Kotlin Project Wizard - Configure targets](multiplatform-project-2-wn.png)

앞으로 Kotlin 프로젝트 위자드를 더 많은 구성 옵션과 템플릿을 추가하여 더욱 유연하게 만들 예정입니다.

다음 튜토리얼을 통해 새로운 Kotlin 프로젝트 위자드를 사용해 볼 수 있습니다.

* [Kotlin/JVM 기반 콘솔 애플리케이션 생성](jvm-get-started.md)
* [React를 위한 Kotlin/JS 애플리케이션 생성](js-react.md)
* [Kotlin/Native 애플리케이션 생성](native-get-started.md)

### 코루틴 디버거

많은 사람들이 이미 비동기 프로그래밍을 위해 [코루틴](coroutines-guide.md)을 사용하고 있습니다. 그러나 디버깅에 관해서는 Kotlin 1.4 이전에는 코루틴 작업을 하는 것이 매우 어려웠습니다. 코루틴이 스레드 간에 이동했기 때문에 특정 코루틴이 무엇을 하는지 이해하고 그 컨텍스트를 확인하는 것이 어려웠습니다. 어떤 경우에는 중단점(breakpoint)을 통한 단계 추적이 작동하지 않았습니다. 결과적으로 코루틴을 사용하는 코드를 디버깅하기 위해 로깅이나 정신적인 노력에 의존해야 했습니다.

Kotlin 1.4에서는 Kotlin 플러그인에 포함된 새로운 기능을 통해 코루틴 디버깅이 훨씬 더 편리해졌습니다.

> 디버깅은 `kotlinx-coroutines-core` 버전 1.3.8 이상에서 작동합니다.
>
{style="note"}

이제 **디버그 도구 창**에 새로운 **코루틴** 탭이 포함되어 있습니다. 이 탭에서는 현재 실행 중인 코루틴과 일시 중단된 코루틴에 대한 정보를 찾을 수 있습니다. 코루틴은 실행 중인 디스패처별로 그룹화됩니다.

![Debugging coroutines](coroutine-debugger-wn.png)

이제 다음을 수행할 수 있습니다.
* 각 코루틴의 상태를 쉽게 확인할 수 있습니다.
* 실행 중인 코루틴과 일시 중단된 코루틴 모두에 대해 로컬 및 캡처된 변수의 값을 확인할 수 있습니다.
* 전체 코루틴 생성 스택과 코루틴 내부의 호출 스택을 확인할 수 있습니다. 이 스택에는 표준 디버깅 중에 손실될 수 있는 변수 값이 있는 모든 프레임이 포함됩니다.

각 코루틴의 상태와 스택을 포함하는 전체 보고서가 필요하면 **코루틴** 탭 내부에서 마우스 오른쪽 버튼을 클릭한 다음 **Get Coroutines Dump**를 클릭하세요. 현재 코루틴 덤프는 다소 단순하지만, Kotlin의 향후 버전에서는 더 읽기 쉽고 유용하게 만들 예정입니다.

![Coroutines Dump](coroutines-dump-wn.png)

[이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-rc-debugging-coroutines/) 및 [IntelliJ IDEA 문서](https://www.jetbrains.com/help/idea/debug-kotlin-coroutines.html)에서 코루틴 디버깅에 대해 자세히 알아보세요.

## 새로운 컴파일러

새로운 Kotlin 컴파일러는 매우 빠를 것이며, 지원되는 모든 플랫폼을 통합하고 컴파일러 확장을 위한 API를 제공할 것입니다. 이는 장기 프로젝트이며, Kotlin 1.4.0에서 이미 여러 단계를 완료했습니다.

* [새로운, 더 강력한 타입 추론 알고리즘](#new-more-powerful-type-inference-algorithm)이 기본적으로 활성화됩니다.
* [새로운 JVM 및 JS IR 백엔드](#unified-backends-and-extensibility). 안정화되면 기본값으로 설정됩니다.

### 새로운, 더 강력한 타입 추론 알고리즘

Kotlin 1.4는 새로운, 더 강력한 타입 추론 알고리즘을 사용합니다. 이 새로운 알고리즘은 Kotlin 1.3에서 컴파일러 옵션을 지정하여 이미 사용해 볼 수 있었으며, 이제는 기본적으로 사용됩니다. 새 알고리즘에서 수정된 문제의 전체 목록은 [YouTrack](https://youtrack.jetbrains.com/issues/KT?q=Tag:%20fixed-in-new-inference%20)에서 찾을 수 있습니다. 여기에서 가장 눈에 띄는 개선 사항 중 일부를 찾을 수 있습니다.

* [타입이 자동으로 추론되는 더 많은 경우](#more-cases-where-type-is-inferred-automatically)
* [람다의 마지막 표현식에 대한 스마트 캐스트](#smart-casts-for-a-lambda-s-last-expression)
* [호출 가능 참조에 대한 스마트 캐스트](#smart-casts-for-callable-references)
* [위임된 프로퍼티에 대한 더 나은 추론](#better-inference-for-delegated-properties)
* [다른 인수를 가진 Java 인터페이스에 대한 SAM 변환](#sam-conversion-for-java-interfaces-with-different-arguments)
* [Kotlin의 Java SAM 인터페이스](#java-sam-interfaces-in-kotlin)

#### 타입이 자동으로 추론되는 더 많은 경우

새 추론 알고리즘은 이전 알고리즘이 명시적으로 지정해야 했던 많은 경우에 타입을 추론합니다. 예를 들어, 다음 예제에서 람다 매개변수 `it`의 타입은 `String?`으로 올바르게 추론됩니다.

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

Kotlin 1.3에서는 이를 작동시키기 위해 명시적인 람다 매개변수를 도입하거나 `to`를 명시적인 제네릭 인수를 가진 `Pair` 생성자로 대체해야 했습니다.

#### 람다의 마지막 표현식에 대한 스마트 캐스트

Kotlin 1.3에서는 람다 내부의 마지막 표현식은 예상 타입을 지정하지 않으면 스마트 캐스트되지 않았습니다. 따라서 다음 예제에서 Kotlin 1.3은 `String?`을 `result` 변수의 타입으로 추론했습니다.

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

Kotlin 1.4에서는 새로운 추론 알고리즘 덕분에 람다 내부의 마지막 표현식이 스마트 캐스트되고, 이 새로운, 더 정확한 타입이 결과 람다 타입을 추론하는 데 사용됩니다. 따라서 `result` 변수의 타입은 `String`이 됩니다.

Kotlin 1.3에서는 이러한 경우를 작동시키기 위해 명시적 캐스트(`!!` 또는 `as String`과 같은 타입 캐스트)를 추가해야 하는 경우가 많았지만, 이제 이러한 캐스트는 불필요해졌습니다.

#### 호출 가능 참조에 대한 스마트 캐스트

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

`animal` 변수가 특정 타입인 `Cat`과 `Dog`로 스마트 캐스트된 후에 다른 멤버 참조인 `animal::meow`와 `animal::woof`를 사용할 수 있습니다. 타입 검사 후, 서브타입에 해당하는 멤버 참조에 접근할 수 있습니다.

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

#### 다른 인수를 가진 Java 인터페이스에 대한 SAM 변환

Kotlin은 처음부터 Java 인터페이스에 대한 SAM 변환을 지원했지만, 기존 Java 라이브러리와 작업할 때 때때로 불편함을 유발하는 지원되지 않는 한 가지 경우가 있었습니다. 두 개의 SAM 인터페이스를 매개변수로 받는 Java 메서드를 호출할 때, 두 인수 모두 람다 또는 일반 객체여야 했습니다. 하나의 인수를 람다로 전달하고 다른 하나를 객체로 전달할 수는 없었습니다.

새로운 알고리즘은 이 문제를 해결하여, 어떤 경우에도 SAM 인터페이스 대신 람다를 전달할 수 있습니다. 이는 자연스럽게 작동하리라 예상하는 방식입니다.

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

Kotlin 1.3에서는 SAM 변환을 수행하기 위해 위에 있는 함수 `foo`를 Java 코드에서 선언해야 했습니다.

### 통합 백엔드 및 확장성

Kotlin에는 실행 파일을 생성하는 세 가지 백엔드(Kotlin/JVM, Kotlin/JS, Kotlin/Native)가 있습니다. Kotlin/JVM과 Kotlin/JS는 서로 독립적으로 개발되었기 때문에 많은 코드를 공유하지 않습니다. Kotlin/Native는 Kotlin 코드용 중간 표현(IR)을 중심으로 구축된 새로운 인프라를 기반으로 합니다.

이제 Kotlin/JVM과 Kotlin/JS를 동일한 IR로 마이그레이션하고 있습니다. 결과적으로 세 가지 백엔드 모두 많은 로직을 공유하고 통합된 파이프라인을 가집니다. 이를 통해 대부분의 기능, 최적화 및 버그 수정을 모든 플랫폼에 대해 한 번만 구현할 수 있습니다. 두 가지 새로운 IR 기반 백엔드는 [알파](components-stability.md) 단계에 있습니다.

공통 백엔드 인프라는 멀티플랫폼 컴파일러 확장 가능성도 열어줍니다. 파이프라인에 플러그인하여 모든 플랫폼에서 자동으로 작동하는 사용자 지정 처리 및 변환을 추가할 수 있습니다.

현재 알파 단계에 있는 새로운 [JVM IR](#new-jvm-ir-backend) 및 [JS IR](#new-js-ir-backend) 백엔드를 사용해 보고 피드백을 공유해 주시기를 권장합니다.

## Kotlin/JVM

Kotlin 1.4.0에는 다음과 같은 여러 JVM 관련 개선 사항이 포함되어 있습니다.

* [새로운 JVM IR 백엔드](#new-jvm-ir-backend)
* [인터페이스에서 기본 메서드를 생성하기 위한 새로운 모드](#new-modes-for-generating-default-methods)
* [null 검사를 위한 통합 예외 타입](#unified-exception-type-for-null-checks)
* [JVM 바이트코드의 타입 어노테이션](#type-annotations-in-the-jvm-bytecode)

### 새로운 JVM IR 백엔드

Kotlin/JS와 함께, Kotlin/JVM을 [통합 IR 백엔드](#unified-backends-and-extensibility)로 마이그레이션하고 있습니다. 이는 대부분의 기능과 버그 수정을 모든 플랫폼에 대해 한 번만 구현할 수 있게 해줍니다. 또한 모든 플랫폼에서 작동하는 멀티플랫폼 확장을 생성하여 이점을 얻을 수 있습니다.

Kotlin 1.4.0은 아직 이러한 확장을 위한 공개 API를 제공하지 않지만, [Jetpack Compose](https://developer.android.com/jetpack/compose)를 포함한 파트너와 긴밀히 협력하여 새로운 백엔드를 사용하여 이미 컴파일러 플러그인을 구축하고 있습니다.

현재 알파 단계에 있는 새로운 Kotlin/JVM 백엔드를 사용해 보고 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)에 문제점과 기능 요청을 제출해 주시기를 권장합니다. 이는 컴파일러 파이프라인을 통합하고 Jetpack Compose와 같은 컴파일러 확장을 Kotlin 커뮤니티에 더 빠르게 제공하는 데 도움이 될 것입니다.

새로운 JVM IR 백엔드를 활성화하려면 Gradle 빌드 스크립트에 추가 컴파일러 옵션을 지정하세요.

```kotlin
kotlinOptions.useIR = true
```

> [Jetpack Compose](https://developer.android.com/jetpack/compose/setup?hl=en)를 활성화하면 `kotlinOptions`에 컴파일러 옵션을 지정할 필요 없이 자동으로 새로운 JVM 백엔드가 적용됩니다.
>
{style="note"}

명령줄 컴파일러를 사용할 때는 `-Xuse-ir` 컴파일러 옵션을 추가하세요.

> 새로운 JVM IR 백엔드로 컴파일된 코드는 새로운 백엔드를 활성화한 경우에만 사용할 수 있습니다. 그렇지 않으면 오류가 발생합니다. 이 점을 고려하여 라이브러리 작성자가 프로덕션 환경에서 새로운 백엔드로 전환하는 것을 권장하지 않습니다.
>
{style="note"}

### 기본 메서드 생성을 위한 새로운 모드

Kotlin 코드를 JVM 1.8 이상 타겟으로 컴파일할 때, Kotlin 인터페이스의 비추상 메서드를 Java의 `default` 메서드로 컴파일할 수 있었습니다. 이를 위해 해당 메서드를 표시하는 `@JvmDefault` 어노테이션과 이 어노테이션의 처리를 활성화하는 `-Xjvm-default` 컴파일러 옵션을 포함하는 메커니즘이 있었습니다.

1.4.0에서는 기본 메서드 생성을 위한 새로운 모드를 추가했습니다. `-Xjvm-default=all`은 Kotlin 인터페이스의 *모든* 비추상 메서드를 `default` Java 메서드로 컴파일합니다. `default` 없이 컴파일된 인터페이스를 사용하는 코드와의 호환성을 위해 `all-compatibility` 모드도 추가했습니다.

Java 상호 운용성에서 기본 메서드에 대한 자세한 내용은 [상호 운용성 문서](java-to-kotlin-interop.md#default-methods-in-interfaces) 및 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-generating-default-methods-in-interfaces/)을 참조하세요.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

### null 검사를 위한 통합 예외 타입

Kotlin 1.4.0부터 모든 런타임 null 검사는 `KotlinNullPointerException`, `IllegalStateException`, `IllegalArgumentException`, `TypeCastException` 대신 `java.lang.NullPointerException`을 발생시킵니다. 이는 `!!` 연산자, 메서드 서문(preamble)의 매개변수 null 검사, 플랫폼 타입 표현식 null 검사, 그리고 null을 허용하지 않는 타입의 `as` 연산자에 적용됩니다. `lateinit` null 검사 및 `checkNotNull` 또는 `requireNotNull`과 같은 명시적인 라이브러리 함수 호출에는 적용되지 않습니다.

이 변경은 Kotlin 컴파일러 또는 Android [R8 옵티마이저](https://developer.android.com/studio/build/shrink-code)와 같은 다양한 바이트코드 처리 도구에 의해 수행될 수 있는 null 검사 최적화의 수를 증가시킵니다.

개발자 관점에서는 크게 달라지지 않습니다. Kotlin 코드는 이전과 동일한 오류 메시지와 함께 예외를 발생시킵니다. 예외의 타입은 변경되지만, 전달되는 정보는 동일하게 유지됩니다.

### JVM 바이트코드의 타입 어노테이션

Kotlin은 이제 JVM 바이트코드(타겟 버전 1.8 이상)에 타입 어노테이션을 생성하여 런타임에 Java 리플렉션에서 사용할 수 있도록 합니다. 바이트코드에 타입 어노테이션을 생성하려면 다음 단계를 따르세요.

1. 선언된 어노테이션이 적절한 어노테이션 타겟(Java의 `ElementType.TYPE_USE` 또는 Kotlin의 `AnnotationTarget.TYPE`)과 유지(retention, `AnnotationRetention.RUNTIME`)를 가지고 있는지 확인하세요.
2. 어노테이션 클래스 선언을 JVM 바이트코드 타겟 버전 1.8 이상으로 컴파일하세요. `-jvm-target=1.8` 컴파일러 옵션으로 이를 지정할 수 있습니다.
3. 어노테이션을 사용하는 코드를 JVM 바이트코드 타겟 버전 1.8 이상(`-jvm-target=1.8`)으로 컴파일하고 `-Xemit-jvm-type-annotations` 컴파일러 옵션을 추가하세요.

표준 라이브러리의 타입 어노테이션은 현재 바이트코드에 생성되지 않습니다. 표준 라이브러리가 타겟 버전 1.6으로 컴파일되기 때문입니다.

지금까지는 기본 케이스만 지원됩니다.

- 메서드 매개변수, 메서드 반환 타입 및 프로퍼티 타입에 대한 타입 어노테이션
- `Smth<@Ann Foo>`, `Array<@Ann Foo>`와 같은 타입 인수의 불변 프로젝션.

다음 예제에서 `String` 타입의 `@Foo` 어노테이션은 바이트코드로 생성되어 라이브러리 코드에서 사용될 수 있습니다.

```kotlin
@Target(AnnotationTarget.TYPE)
annotation class Foo

class A {
    fun foo(): @Foo String = "OK"
}
```

## Kotlin/JS

JS 플랫폼에서 Kotlin 1.4.0은 다음 개선 사항을 제공합니다.

- [새로운 Gradle DSL](#new-gradle-dsl)
- [새로운 JS IR 백엔드](#new-js-ir-backend)

### 새로운 Gradle DSL

`kotlin.js` Gradle 플러그인은 조정된 Gradle DSL과 함께 제공되며, 이는 여러 새로운 구성 옵션을 제공하고 `kotlin-multiplatform` 플러그인에서 사용되는 DSL과 더 밀접하게 일치합니다. 가장 영향력 있는 변경 사항 중 일부는 다음과 같습니다.

- `binaries.executable()`을 통한 실행 파일 생성을 위한 명시적 토글. [여기에서 Kotlin/JS 실행 및 환경에 대해 자세히 알아보세요](js-project-setup.md#execution-environments).
- `cssSupport`를 통해 Gradle 구성 내에서 webpack의 CSS 및 스타일 로더 구성. [여기에서 CSS 및 스타일 로더 사용에 대해 자세히 알아보세요](js-project-setup.md#css).
- 필수 버전 번호 또는 [semver](https://docs.npmjs.com/about-semantic-versioning) 버전 범위를 통한 `npm` 의존성 관리 개선, 그리고 `devNpm`, `optionalNpm`, `peerNpm`을 사용한 _개발_, _피어_, _선택적_ `npm` 의존성 지원. [여기에서 Gradle에서 직접 npm 패키지에 대한 의존성 관리에 대해 자세히 알아보세요](js-project-setup.md#npm-dependencies).
- Kotlin 외부 선언을 위한 제너레이터인 [Dukat](https://github.com/Kotlin/dukat)와의 더 강력한 통합. 이제 외부 선언은 빌드 시 생성되거나 Gradle 작업을 통해 수동으로 생성될 수 있습니다.

### 새로운 JS IR 백엔드

현재 [알파](components-stability.md) 안정성을 가진 [Kotlin/JS용 IR 백엔드](js-ir-compiler.md)는 불필요한 코드 제거를 통한 생성된 코드 크기 최적화, JavaScript 및 TypeScript와의 향상된 상호 운용성 등 Kotlin/JS 타겟에 특화된 몇 가지 새로운 기능을 제공합니다.

Kotlin/JS IR 백엔드를 활성화하려면 `gradle.properties` 파일에 `kotlin.js.compiler=ir` 키를 설정하거나, Gradle 빌드 스크립트의 `js` 함수에 `IR` 컴파일러 타입을 전달하세요.

<!--suppress ALL -->

```groovy
kotlin {
    js(IR) { // or: LEGACY, BOTH
        // ...
    }
    binaries.executable()
}
```

새로운 백엔드 구성 방법에 대한 자세한 내용은 [Kotlin/JS IR 컴파일러 문서](js-ir-compiler.md)를 참조하세요.

새로운 [@JsExport](js-to-kotlin-interop.md#jsexport-annotation) 어노테이션과 **[Kotlin 코드에서 TypeScript 정의를 생성하는](js-ir-compiler.md#preview-generation-of-typescript-declaration-files-d-ts)** 기능을 통해 Kotlin/JS IR 컴파일러 백엔드는 JavaScript 및 TypeScript 상호 운용성을 향상시킵니다. 이는 또한 Kotlin/JS 코드를 기존 툴링과 통합하여 **하이브리드 애플리케이션**을 생성하고 멀티플랫폼 프로젝트에서 코드 공유 기능을 활용하는 것을 더 쉽게 만듭니다.

[Kotlin/JS IR 컴파일러 백엔드에서 사용 가능한 기능에 대해 자세히 알아보세요](js-ir-compiler.md).

## Kotlin/Native

1.4.0에서는 Kotlin/Native에 다음과 같은 상당한 수의 새로운 기능과 개선 사항이 추가되었습니다.

* [Swift 및 Objective-C에서 `suspend` 함수 지원](#support-for-kotlin-s-suspending-functions-in-swift-and-objective-c)
* [기본적으로 Objective-C 제네릭 지원](#objective-c-generics-support-by-default)
* [Objective-C/Swift 상호 운용성에서 예외 처리](#exception-handling-in-objective-c-swift-interop)
* [기본적으로 Apple 타겟에서 릴리스 `.dSYM` 생성](#generate-release-dsyms-on-apple-targets-by-default)
* [성능 개선](#performance-improvements)
* [CocoaPods 의존성 관리 단순화](#simplified-management-of-cocoapods-dependencies)

### Swift 및 Objective-C에서 Kotlin의 `suspend` 함수 지원

1.4.0에서는 Swift 및 Objective-C에서 `suspend` 함수에 대한 기본 지원을 추가합니다. 이제 Kotlin 모듈을 Apple 프레임워크로 컴파일하면, `suspend` 함수가 콜백(`completionHandler` (Swift/Objective-C 용어))을 가진 함수로 사용 가능합니다. 생성된 프레임워크 헤더에 이러한 함수가 있으면 Swift 또는 Objective-C 코드에서 호출하고 심지어 오버라이드할 수도 있습니다.

예를 들어, 다음 Kotlin 함수를 작성하면:

```kotlin
suspend fun queryData(id: Int): String = ...
```

...다음과 같이 Swift에서 호출할 수 있습니다.

```swift
queryData(id: 17) { result, error in
   if let e = error {
       print("ERROR: \(e)")
   } else {
       print(result!)
   }
}
```

[Swift 및 Objective-C에서 `suspend` 함수 사용에 대해 자세히 알아보세요](native-objc-interop.md).

### 기본적으로 Objective-C 제네릭 지원

Kotlin의 이전 버전은 Objective-C 상호 운용성에서 제네릭에 대한 실험적 지원을 제공했습니다. 1.4.0부터 Kotlin/Native는 기본적으로 Kotlin 코드에서 제네릭을 포함한 Apple 프레임워크를 생성합니다. 어떤 경우에는 이로 인해 Kotlin 프레임워크를 호출하는 기존 Objective-C 또는 Swift 코드가 중단될 수 있습니다. 제네릭 없이 프레임워크 헤더를 작성하려면 `-Xno-objc-generics` 컴파일러 옵션을 추가하세요.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xno-objc-generics"
        }
    }
}
```

[Objective-C 상호 운용성 문서](native-objc-interop.md#generics)에 나열된 모든 세부 사항과 제한 사항은 여전히 유효합니다.

### Objective-C/Swift 상호 운용성에서 예외 처리

1.4.0에서는 Kotlin에서 생성된 Swift API에서 예외가 번역되는 방식에 약간의 변경 사항을 적용합니다. Kotlin과 Swift 간에는 오류 처리 방식에 근본적인 차이가 있습니다. 모든 Kotlin 예외는 비검사(unchecked) 예외인 반면, Swift는 검사(checked) 오류만 있습니다. 따라서 Swift 코드가 예상되는 예외를 인식하도록 하려면 Kotlin 함수에 잠재적인 예외 클래스 목록을 지정하는 `@Throws` 어노테이션을 표시해야 합니다.

Swift 또는 Objective-C 프레임워크로 컴파일할 때, `@Throws` 어노테이션을 가지고 있거나 상속하는 함수는 Objective-C에서는 `NSError*`를 생성하는 메서드로, Swift에서는 `throws` 메서드로 표현됩니다.

이전에는 `RuntimeException` 및 `Error`를 제외한 모든 예외가 `NSError`로 전파되었습니다. 이제 이 동작이 변경됩니다. 이제 `NSError`는 `@Throws` 어노테이션의 매개변수로 지정된 클래스(또는 해당 서브클래스)의 인스턴스인 예외에 대해서만 발생합니다. Swift/Objective-C에 도달하는 다른 Kotlin 예외는 처리되지 않은 것으로 간주되어 프로그램 종료를 유발합니다.

### 기본적으로 Apple 타겟에서 릴리스 `.dSYM` 생성

1.4.0부터 Kotlin/Native 컴파일러는 기본적으로 Darwin 플랫폼의 릴리스 바이너리에 대해 [디버그 심볼 파일](https://developer.apple.com/documentation/xcode/building_your_app_to_include_debugging_information)(`.dSYM`)을 생성합니다. 이 기능은 `-Xadd-light-debug=disable` 컴파일러 옵션으로 비활성화할 수 있습니다. 다른 플랫폼에서는 이 옵션이 기본적으로 비활성화됩니다. Gradle에서 이 옵션을 토글하려면 다음을 사용하세요.

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug={enable|disable}"
        }
    }
}
```

[크래시 리포트 심볼화에 대해 자세히 알아보세요](native-ios-symbolication.md).

### 성능 개선

Kotlin/Native는 개발 프로세스와 실행 속도를 모두 높이는 여러 가지 성능 개선 사항을 적용했습니다. 몇 가지 예시는 다음과 같습니다.

- 객체 할당 속도를 개선하기 위해 시스템 할당자(allocator)의 대안으로 [mimalloc](https://github.com/microsoft/mimalloc) 메모리 할당자를 제공합니다. `mimalloc`은 일부 벤치마크에서 최대 두 배 더 빠르게 작동합니다. 현재 Kotlin/Native에서 `mimalloc` 사용은 실험적입니다. `-Xallocator=mimalloc` 컴파일러 옵션을 사용하여 `mimalloc`으로 전환할 수 있습니다.

- C 상호 운용 라이브러리가 빌드되는 방식을 재작업했습니다. 새로운 툴링을 통해 Kotlin/Native는 이전보다 최대 4배 빠르게 상호 운용 라이브러리를 생성하며, 아티팩트 크기는 이전의 25%~30% 수준으로 줄어듭니다.

- GC(Garbage Collection) 최적화로 인해 전반적인 런타임 성능이 향상되었습니다. 이 개선 사항은 장기 실행 객체가 많은 프로젝트에서 특히 두드러질 것입니다. `HashMap` 및 `HashSet` 컬렉션은 이제 불필요한 boxing을 피함으로써 더 빠르게 작동합니다.

- 1.3.70에서는 Kotlin/Native 컴파일 성능을 개선하기 위한 두 가지 새로운 기능인 [프로젝트 의존성 캐싱 및 Gradle 데몬에서 컴파일러 실행](https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/#kotlin-native)을 도입했습니다. 그 이후로 우리는 수많은 문제를 수정하고 이 기능들의 전반적인 안정성을 향상시켰습니다.

### CocoaPods 의존성 관리 단순화

이전에는 CocoaPods 의존성 관리자와 프로젝트를 통합하면 프로젝트의 iOS, macOS, watchOS 또는 tvOS 부분을 Xcode에서만 빌드할 수 있었고, 이는 멀티플랫폼 프로젝트의 다른 부분과는 분리되어 있었습니다. 다른 부분은 IntelliJ IDEA에서 빌드할 수 있었습니다.

또한, CocoaPods(Pod 라이브러리)에 저장된 Objective-C 라이브러리에 의존성을 추가할 때마다 IntelliJ IDEA에서 Xcode로 전환하여 `pod install`을 호출하고 거기서 Xcode 빌드를 실행해야 했습니다.

이제 IntelliJ IDEA에서 직접 Pod 의존성을 관리하면서 코드 하이라이팅 및 자동 완성 등 코드 작업에 제공되는 이점을 누릴 수 있습니다. 또한 Xcode로 전환할 필요 없이 Gradle로 전체 Kotlin 프로젝트를 빌드할 수 있습니다. 이는 Swift/Objective-C 코드를 작성하거나 시뮬레이터 또는 기기에서 애플리케이션을 실행해야 할 때만 Xcode로 이동하면 된다는 의미입니다.

이제 로컬에 저장된 Pod 라이브러리와도 작업할 수 있습니다.

필요에 따라 다음 간에 의존성을 추가할 수 있습니다.
* Kotlin 프로젝트와 CocoaPods 저장소에 원격으로 저장되거나 로컬 머신에 저장된 Pod 라이브러리.
* Kotlin Pod(CocoaPods 의존성으로 사용되는 Kotlin 프로젝트)과 하나 이상의 타겟이 있는 Xcode 프로젝트.

초기 구성을 완료하고 `cocoapods`에 새로운 의존성을 추가할 때, IntelliJ IDEA에서 프로젝트를 다시 임포트하기만 하면 됩니다. 새로운 의존성은 자동으로 추가됩니다. 추가 단계는 필요하지 않습니다.

[의존성을 추가하는 방법을 알아보세요](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-libraries.html).

## Kotlin 멀티플랫폼

> 멀티플랫폼 프로젝트 지원은 [알파](components-stability.md) 단계에 있습니다. 향후 호환되지 않게 변경될 수 있으며 수동 마이그레이션이 필요할 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issues/KT)에 대한 여러분의 피드백에 감사드립니다.
>
{style="warning"}

[Kotlin 멀티플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)은 [다양한 플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets)에서 동일한 코드를 작성하고 유지 관리하는 데 소요되는 시간을 줄이면서 네이티브 프로그래밍의 유연성과 이점을 유지합니다. 우리는 멀티플랫폼 기능 및 개선 사항에 계속 투자하고 있습니다.

* [계층적 프로젝트 구조를 사용하여 여러 타겟에서 코드 공유](#sharing-code-in-several-targets-with-the-hierarchical-project-structure)
* [계층적 구조에서 네이티브 라이브러리 활용](#leveraging-native-libs-in-the-hierarchical-structure)
* [`kotlinx` 의존성을 한 번만 지정](#specifying-dependencies-only-once)

> 멀티플랫폼 프로젝트는 Gradle 6.0 이상을 필요로 합니다.
>
{style="note"}

### 계층적 프로젝트 구조를 사용하여 여러 타겟에서 코드 공유

새로운 계층적 프로젝트 구조 지원을 통해 [멀티플랫폼 프로젝트](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html)에서 [여러 플랫폼](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html#targets) 간에 코드를 공유할 수 있습니다.

이전에는 멀티플랫폼 프로젝트에 추가된 모든 코드는 단일 타겟에만 제한되어 다른 플랫폼에서 재사용할 수 없는 플랫폼별 소스 세트에 배치되거나, 프로젝트의 모든 플랫폼에서 공유되는 `commonMain` 또는 `commonTest`와 같은 공통 소스 세트에 배치될 수 있었습니다. 공통 소스 세트에서는 플랫폼별 `actual` 구현이 필요한 [`expect` 선언](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)을 사용하여 플랫폼별 API를 호출할 수 있었습니다.

이는 [모든 플랫폼에서 코드를 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-all-platforms)하는 것을 쉽게 만들었지만, [일부 타겟 간에만 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)하는 것은 쉽지 않았습니다. 특히 공통 로직과 서드파티 API를 많이 재사용할 수 있는 유사한 타겟의 경우 더욱 그러했습니다.

예를 들어, 일반적인 iOS 타겟 멀티플랫폼 프로젝트에는 iOS ARM64 기기용과 x64 시뮬레이터용 두 가지 iOS 관련 타겟이 있습니다. 이들은 별도의 플랫폼별 소스 세트를 가지고 있지만, 실제로는 기기와 시뮬레이터에 다른 코드가 필요한 경우는 거의 없으며 의존성도 매우 유사합니다. 따라서 iOS 관련 코드를 이들 간에 공유할 수 있습니다.

분명히 이 설정에서는 두 iOS 타겟을 위한 *공유 소스 세트*를 갖는 것이 바람직하며, iOS 기기와 시뮬레이터 모두에 공통적인 API를 Kotlin/Native 코드가 여전히 직접 호출할 수 있도록 하는 것이 좋습니다.

![Code shared for iOS targets](iosmain-hierarchy.png){width=300}

이제 [계층적 프로젝트 구조 지원](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-on-similar-platforms)을 통해 이 작업을 수행할 수 있습니다. 이 지원은 각 소스 세트에서 사용 가능한 API 및 언어 기능을 어떤 타겟이 사용하는지에 따라 추론하고 조정합니다.

타겟의 일반적인 조합의 경우 타겟 단축키를 사용하여 계층 구조를 생성할 수 있습니다. 예를 들어, `ios()` 단축키를 사용하여 위에서 보여준 공유 소스 세트와 두 개의 iOS 타겟을 생성하세요.

```kotlin
kotlin {
    ios() // iOS device and simulator targets; iosMain and iosTest source sets
}
```

다른 타겟 조합의 경우, `dependsOn` 관계를 사용하여 소스 세트를 연결하여 [수동으로 계층 구조를 생성](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html#manual-configuration)할 수 있습니다.

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

계층적 프로젝트 구조 덕분에 라이브러리도 타겟의 하위 집합에 대해 공통 API를 제공할 수 있습니다. [라이브러리에서 코드 공유](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#share-code-in-libraries)에 대해 자세히 알아보세요.

### 계층적 구조에서 네이티브 라이브러리 활용

Foundation, UIKit, POSIX와 같은 플랫폼 종속 라이브러리를 여러 네이티브 타겟 간에 공유되는 소스 세트에서 사용할 수 있습니다. 이를 통해 플랫폼별 의존성에 제한받지 않고 더 많은 네이티브 코드를 공유할 수 있습니다.

추가적인 단계는 필요 없습니다. 모든 것이 자동으로 처리됩니다. IntelliJ IDEA는 공유 코드에서 사용할 수 있는 공통 선언을 감지하는 데 도움이 될 것입니다.

[플랫폼 종속 라이브러리 사용에 대해 자세히 알아보세요](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-share-on-platforms.html#connect-platform-specific-libraries).

### `kotlinx` 의존성을 한 번만 지정

이제부터는 동일한 라이브러리의 다른 변형에 대한 의존성을 사용되는 공유 및 플랫폼별 소스 세트에 각각 지정하는 대신, 공유 소스 세트에 한 번만 의존성을 지정해야 합니다.

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

더 이상 지원되지 않으므로 플랫폼을 지정하는 접미사가 붙은 `kotlinx` 라이브러리 아티팩트 이름(예: `-common`, `-native` 등)을 사용하지 마세요. 대신, 위 예제에서 `kotlinx-coroutines-core`와 같은 라이브러리 기본 아티팩트 이름을 사용하세요.

그러나 이 변경 사항은 현재 다음에는 영향을 미치지 않습니다.
* `stdlib` 라이브러리 – Kotlin 1.4.0부터 [표준 라이브러리 의존성이 자동으로 추가됩니다](#dependency-on-the-standard-library-added-by-default).
* `kotlin.test` 라이브러리 – 여전히 `test-common` 및 `test-annotations-common`을 사용해야 합니다. 이 의존성들은 나중에 처리될 예정입니다.

특정 플랫폼에만 의존성이 필요한 경우, `-jvm` 또는 `-js`와 같은 접미사가 붙은 표준 및 `kotlinx` 라이브러리의 플랫폼별 변형(예: `kotlinx-coroutines-core-jvm`)을 여전히 사용할 수 있습니다.

[의존성 구성에 대해 자세히 알아보세요](gradle-configure-project.md#configure-dependencies).

## Gradle 프로젝트 개선

[Kotlin 멀티플랫폼](#kotlin-multiplatform), [Kotlin/JVM](#kotlin-jvm), [Kotlin/Native](#kotlin-native), [Kotlin/JS](#kotlin-js)에 특화된 Gradle 프로젝트 기능 및 개선 사항 외에도, 모든 Kotlin Gradle 프로젝트에 적용되는 몇 가지 변경 사항이 있습니다.

* [표준 라이브러리 의존성이 이제 기본적으로 추가됩니다](#dependency-on-the-standard-library-added-by-default)
* [Kotlin 프로젝트에는 최신 버전의 Gradle이 필요합니다](#minimum-gradle-version-for-kotlin-projects)
* [IDE에서 Kotlin Gradle DSL 지원 개선](#improved-gradle-kts-support-in-the-ide)

### 표준 라이브러리 의존성이 이제 기본적으로 추가됩니다

멀티플랫폼 프로젝트를 포함하여 어떤 Kotlin Gradle 프로젝트에서도 `stdlib` 라이브러리에 대한 의존성을 선언할 필요가 없습니다. 의존성이 기본적으로 추가됩니다.

자동으로 추가되는 표준 라이브러리는 Kotlin Gradle 플러그인과 동일한 버전이 될 것입니다.

플랫폼별 소스 세트의 경우 해당 플랫폼별 라이브러리 변형이 사용되며, 나머지에는 공통 표준 라이브러리가 추가됩니다. Kotlin Gradle 플러그인은 Gradle 빌드 스크립트의 `kotlinOptions.jvmTarget` [컴파일러 옵션](gradle-compiler-options.md)에 따라 적절한 JVM 표준 라이브러리를 선택합니다.

[기본 동작을 변경하는 방법을 알아보세요](gradle-configure-project.md#dependency-on-the-standard-library).

### Kotlin 프로젝트를 위한 최소 Gradle 버전

Kotlin 프로젝트의 새로운 기능을 사용하려면 Gradle을 [최신 버전](https://gradle.org/releases/)으로 업데이트하세요. 멀티플랫폼 프로젝트는 Gradle 6.0 이상을 필요로 하며, 다른 Kotlin 프로젝트는 Gradle 5.4 이상에서 작동합니다.

### IDE에서 `*.gradle.kts` 지원 개선

1.4.0에서는 Gradle Kotlin DSL 스크립트(`*.gradle.kts` 파일)에 대한 IDE 지원을 계속 개선했습니다. 새로운 버전이 제공하는 내용은 다음과 같습니다.

- 성능 향상을 위한 _스크립트 구성 명시적 로딩_. 이전에는 빌드 스크립트에 대한 변경 사항이 백그라운드에서 자동으로 로드되었습니다. 성능 향상을 위해 1.4.0에서는 빌드 스크립트 구성의 자동 로딩을 비활성화했습니다. 이제 IDE는 변경 사항을 명시적으로 적용할 때만 로드합니다.

  Gradle 6.0 이전 버전에서는 편집기에서 **Load Configuration**을 클릭하여 스크립트 구성을 수동으로 로드해야 합니다.

  ![*.gradle.kts – Load Configuration](gradle-kts-load-config.png)

  Gradle 6.0 이상에서는 **Load Gradle Changes**를 클릭하거나 Gradle 프로젝트를 다시 임포트하여 변경 사항을 명시적으로 적용할 수 있습니다.
 
  IntelliJ IDEA 2020.1 및 Gradle 6.0 이상에서 **Load Script Configurations**라는 한 가지 작업을 더 추가했습니다. 이 기능은 전체 프로젝트를 업데이트하지 않고 스크립트 구성에 대한 변경 사항을 로드합니다. 이는 전체 프로젝트를 다시 임포트하는 것보다 훨씬 적은 시간이 소요됩니다.

  ![*.gradle.kts – Load Script Changes and Load Gradle Changes](gradle-kts.png)

  새로 생성된 스크립트 또는 새 Kotlin 플러그인이 포함된 프로젝트를 처음 열 때도 **Load Script Configurations**를 수행해야 합니다.
  
  Gradle 6.0 이상에서는 이전 구현처럼 개별적으로 스크립트를 로드하는 대신 모든 스크립트를 한 번에 로드할 수 있습니다. 각 요청은 Gradle 구성 단계를 실행해야 하므로 대규모 Gradle 프로젝트에서는 리소스 집약적일 수 있습니다.
  
  현재 이러한 로딩은 `build.gradle.kts` 및 `settings.gradle.kts` 파일로 제한됩니다 (관련 [이슈](https://github.com/gradle/gradle/issues/12640)에 투표해 주세요). `init.gradle.kts` 또는 적용된 [스크립트 플러그인](https://docs.gradle.org/current/userguide/plugins.html#sec:script_plugins)에 대한 하이라이팅을 활성화하려면 이전 메커니즘인 독립 실행형 스크립트에 추가하는 방법을 사용하세요. 해당 스크립트의 구성은 필요할 때 별도로 로드됩니다. 이러한 스크립트에 대해 자동 재로드도 활성화할 수 있습니다.
    
  ![*.gradle.kts – Add to standalone scripts](gradle-kts-standalone.png)
  
- _더 나은 오류 보고_. 이전에는 Gradle Daemon의 오류를 별도의 로그 파일에서만 확인할 수 있었습니다. 이제 Gradle Daemon은 오류에 대한 모든 정보를 직접 반환하고 빌드 도구 창에 표시합니다. 이는 시간과 노력을 모두 절약해 줍니다.

## 표준 라이브러리

다음은 1.4.0에서 Kotlin 표준 라이브러리의 가장 중요한 변경 사항 목록입니다.

- [공통 예외 처리 API](#common-exception-processing-api)
- [배열 및 컬렉션을 위한 새로운 함수](#new-functions-for-arrays-and-collections)
- [문자열 조작을 위한 함수](#functions-for-string-manipulations)
- [비트 연산](#bit-operations)
- [위임된 프로퍼티 개선](#delegated-properties-improvements)
- [`KType`에서 `Java Type`으로 변환](#converting-from-ktype-to-java-type)
- [Kotlin 리플렉션을 위한 Proguard 구성](#proguard-configurations-for-kotlin-reflection)
- [기존 API 개선](#improving-the-existing-api)
- [`stdlib` 아티팩트를 위한 `module-info` 디스크립터](#module-info-descriptors-for-stdlib-artifacts)
- [사용 중단 (Deprecations)](#deprecations)
- [사용 중단된 실험적 코루틴 제외](#exclusion-of-the-deprecated-experimental-coroutines)

### 공통 예외 처리 API

다음 API 요소들이 공통 라이브러리로 이동했습니다.

* `Throwable.stackTraceToString()` 확장 함수는 이 `Throwable`의 스택 트레이스와 함께 상세한 설명을 반환하고, `Throwable.printStackTrace()`는 이 설명을 표준 오류 출력으로 인쇄합니다.
* `Throwable.addSuppressed()` 함수는 예외를 전달하기 위해 억제된 예외를 지정할 수 있도록 하며, `Throwable.suppressedExceptions` 프로퍼티는 억제된 모든 예외 목록을 반환합니다.
* `@Throws` 어노테이션은 함수가 플랫폼 메서드(JVM 또는 네이티브 플랫폼)로 컴파일될 때 검사될 예외 타입을 나열합니다.

### 배열 및 컬렉션을 위한 새로운 함수

#### 컬렉션

1.4.0에서 표준 라이브러리에는 **컬렉션** 작업을 위한 여러 유용한 함수가 포함되어 있습니다.

* `setOfNotNull()`은 제공된 인수 중에서 null이 아닌 모든 항목으로 구성된 집합을 만듭니다.

    ```kotlin
    fun main() {
    //sampleStart
        val set = setOfNotNull(null, 1, 2, 0, null)
        println(set)
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

* 시퀀스를 위한 `shuffled()`.

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

* `onEach()` 및 `flatMap()`의 `*Indexed()` 대응 함수.
이 함수들이 컬렉션 요소에 적용하는 연산은 요소 인덱스를 매개변수로 가집니다.

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

* `randomOrNull()`, `reduceOrNull()`, `reduceIndexedOrNull()`의 `*OrNull()` 대응 함수.
이 함수들은 빈 컬렉션에 대해 `null`을 반환합니다.

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

* `runningFold()`, 동의어인 `scan()`, 그리고 `runningReduce()`는 `fold()` 및 `reduce()`와 유사하게 주어진 연산을 컬렉션 요소에 순차적으로 적용합니다. 차이점은 이러한 새로운 함수들이 중간 결과의 전체 시퀀스를 반환한다는 것입니다.

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

* `sumOf()`는 선택자 함수를 받아 컬렉션의 모든 요소에 대한 값의 합계를 반환합니다.
`sumOf()`는 `Int`, `Long`, `Double`, `UInt`, `ULong` 타입의 합계를 생성할 수 있습니다. JVM에서는 `BigInteger`와 `BigDecimal`도 사용할 수 있습니다.

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

* `min()` 및 `max()` 함수는 Kotlin 컬렉션 API 전반에 사용되는 명명 규칙을 준수하기 위해 `minOrNull()` 및 `maxOrNull()`로 이름이 변경되었습니다. 함수 이름에 `*OrNull` 접미사가 붙으면 수신 컬렉션이 비어 있을 경우 `null`을 반환한다는 의미입니다. `minBy()`, `maxBy()`, `minWith()`, `maxWith()`에도 동일하게 적용되며, 1.4에서는 `*OrNull()` 동의어를 가집니다.
* 새로운 `minOf()` 및 `maxOf()` 확장 함수는 컬렉션 항목에 대해 주어진 선택자 함수의 최소 및 최대 값을 반환합니다.

    ```kotlin
    data class OrderItem(val name: String, val price = 10.0, count = 1),
    OrderItem("Coffee", price = 2.5, count = 3),
    OrderItem("Tea", price = 1.5, count = 2))
        val highestPrice = order.maxOf { it.price }
    //sampleEnd
        println("The most expensive item in the order costs $highestPrice")
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.4"}

    또한 `Comparator`를 인수로 받는 `minOfWith()` 및 `maxOfWith()`와 빈 컬렉션에 대해 `null`을 반환하는 네 가지 함수 모두의 `*OrNull()` 버전도 있습니다.

* `flatMap` 및 `flatMapTo`에 대한 새로운 오버로드를 통해 수신 타입과 일치하지 않는 반환 타입을 가진 변환을 사용할 수 있습니다. 즉:
    * `Iterable`, `Array`, and `Map`에서 `Sequence`로의 변환
    * `Sequence`에서 `Iterable`로의 변환

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

* 변경 가능한 목록에서 요소를 제거하는 `removeFirst()` 및 `removeLast()` 단축키와 이 함수들의 `*orNull()` 대응 함수.

#### 배열

다양한 컨테이너 타입으로 작업할 때 일관된 경험을 제공하기 위해 **배열**을 위한 새로운 함수도 추가했습니다.

* `shuffle()`는 배열 요소를 무작위 순서로 배치합니다.
* `onEach()`는 각 배열 요소에 주어진 작업을 수행하고 배열 자체를 반환합니다.
* `associateWith()` 및 `associateWithTo()`는 배열 요소를 키로 사용하여 맵을 구축합니다.
* 배열 서브레인지를 위한 `reverse()`는 서브레인지 내 요소의 순서를 뒤집습니다.
* 배열 서브레인지를 위한 `sortDescending()`는 서브레인지 내 요소를 내림차순으로 정렬합니다.
* 배열 서브레인지를 위한 `sort()` 및 `sortWith()`는 이제 공통 라이브러리에서 사용할 수 있습니다.

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

또한 `CharArray`/`ByteArray`와 `String` 간의 변환을 위한 새로운 함수가 있습니다.
* `ByteArray.decodeToString()` 및 `String.encodeToByteArray()`
* `CharArray.concatToString()` 및 `String.toCharArray()`

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

#### `ArrayDeque`

또한 `ArrayDeque` 클래스, 즉 양방향 큐(double-ended queue)의 구현을 추가했습니다.
양방향 큐를 사용하면 상각된(amortized) 상수 시간 내에 큐의 시작 또는 끝에서 요소를 추가하거나 제거할 수 있습니다. 코드에서 큐나 스택이 필요할 때 기본적으로 양방향 큐를 사용할 수 있습니다.

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

`ArrayDeque` 구현은 내부적으로 크기 조정이 가능한 배열을 사용합니다. 내용을 원형 버퍼인 `Array`에 저장하고, `Array`가 가득 찰 때만 크기를 조정합니다.

### 문자열 조작을 위한 함수

1.4.0의 표준 라이브러리에는 문자열 조작 API에 대한 여러 개선 사항이 포함되어 있습니다.

* `StringBuilder`에는 `set()`, `setRange()`, `deleteAt()`, `deleteRange()`, `appendRange()` 등 유용한 새로운 확장 함수가 있습니다.

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

* `StringBuilder`의 일부 기존 함수는 공통 라이브러리에서 사용할 수 있습니다. 이들 중에는 `append()`, `insert()`, `substring()`, `setLength()` 등이 있습니다.
* 새로운 함수 `Appendable.appendLine()` 및 `StringBuilder.appendLine()`이 공통 라이브러리에 추가되었습니다. 이 함수들은 이들 클래스의 JVM 전용 `appendln()` 함수를 대체합니다.

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
* `countOneBits()`
* `countLeadingZeroBits()`
* `countTrailingZeroBits()`
* `takeHighestOneBit()`
* `takeLowestOneBit()`
* `rotateLeft()` 및 `rotateRight()` (실험적)

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

1.4.0에서는 Kotlin에서 위임된 프로퍼티 사용 경험을 개선하기 위한 새로운 기능을 추가했습니다.
- 이제 프로퍼티를 다른 프로퍼티에 위임할 수 있습니다.
- 새로운 인터페이스 `PropertyDelegateProvider`는 단일 선언으로 위임 프로바이더를 생성하는 데 도움이 됩니다.
- `ReadWriteProperty`는 이제 `ReadOnlyProperty`를 확장하므로, 읽기 전용 프로퍼티에 둘 다 사용할 수 있습니다.

새로운 API 외에도 결과 바이트코드 크기를 줄이는 일부 최적화를 수행했습니다. 이러한 최적화는 [이 블로그 게시물](https://blog.jetbrains.com/kotlin/2019/12/what-to-expect-in-kotlin-1-4-and-beyond/#delegated-properties)에 설명되어 있습니다.

[위임된 프로퍼티에 대해 자세히 알아보세요](delegated-properties.md).

### `KType`에서 `Java Type`으로 변환

`stdlib`의 새로운 확장 프로퍼티 `KType.javaType`(현재 실험적)는 전체 `kotlin-reflect` 의존성을 사용하지 않고도 Kotlin 타입에서 `java.lang.reflect.Type`을 얻는 데 도움이 됩니다.

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

1.4.0부터 `kotlin-reflect.jar`에 Kotlin Reflection을 위한 Proguard/R8 구성을 내장했습니다. 이를 통해 R8 또는 Proguard를 사용하는 대부분의 Android 프로젝트는 추가 구성 없이 `kotlin-reflect`와 함께 작동해야 합니다. `kotlin-reflect` 내부를 위한 Proguard 규칙을 더 이상 복사-붙여넣기할 필요가 없습니다. 하지만 리플렉션할 모든 API를 여전히 명시적으로 나열해야 한다는 점에 유의하세요.

### 기존 API 개선

* 이제 여러 함수가 null 수신자에서도 작동합니다. 예를 들어:
    * 문자열의 `toBoolean()`
    * 배열의 `contentEquals()`, `contentHashcode()`, `contentToString()`

* `Double` 및 `Float`의 `NaN`, `NEGATIVE_INFINITY`, `POSITIVE_INFINITY`는 이제 `const`로 정의되어 어노테이션 인수로 사용할 수 있습니다.

* `Double` 및 `Float`의 새로운 상수 `SIZE_BITS` 및 `SIZE_BYTES`는 이진 형식으로 타입의 인스턴스를 나타내는 데 사용되는 비트 및 바이트 수를 포함합니다.

* `maxOf()` 및 `minOf()` 최상위 함수는 가변 개수의 인수(`vararg`)를 허용할 수 있습니다.

### `stdlib` 아티팩트를 위한 `module-info` 디스크립터

Kotlin 1.4.0은 기본 표준 라이브러리 아티팩트에 `module-info.java` 모듈 정보를 추가합니다. 이를 통해 [jlink 도구](https://docs.oracle.com/en/java/javase/11/tools/jlink.html)와 함께 사용할 수 있습니다. `jlink`는 앱에 필요한 플랫폼 모듈만 포함하는 사용자 지정 Java 런타임 이미지를 생성합니다. 이미 Kotlin 표준 라이브러리 아티팩트와 함께 `jlink`를 사용할 수 있었지만, 그렇게 하려면 "modular" 분류자가 붙은 별도의 아티팩트를 사용해야 했으며 전체 설정이 간단하지 않았습니다.
Android에서는 `module-info`가 있는 jar 파일을 올바르게 처리할 수 있는 Android Gradle 플러그인 버전 3.2 이상을 사용하는지 확인하세요.

### 사용 중단 (Deprecations)

#### `Double` 및 `Float`의 `toShort()` 및 `toByte()`

`Double` 및 `Float`의 `toShort()` 및 `toByte()` 함수는 좁은 값 범위와 작은 변수 크기로 인해 예기치 않은 결과를 초래할 수 있으므로 사용 중단되었습니다.

부동 소수점 숫자를 `Byte` 또는 `Short`로 변환하려면 두 단계 변환을 사용하세요. 먼저 `Int`로 변환한 다음 대상 타입으로 다시 변환합니다.

#### 부동 소수점 배열의 `contains()`, `indexOf()`, `lastIndexOf()`

`FloatArray` 및 `DoubleArray`의 `contains()`, `indexOf()`, `lastIndexOf()` 확장 함수는 [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) 표준 동등성을 사용하는데, 이는 일부 코너 케이스에서 전체 순서 동등성과 모순되므로 사용 중단되었습니다. 자세한 내용은 [이 이슈](https://youtrack.jetbrains.com/issue/KT-28753)를 참조하세요.

#### `min()` 및 `max()` 컬렉션 함수

`min()` 및 `max()` 컬렉션 함수는 빈 컬렉션에 대해 `null`을 반환하는 동작을 더 적절하게 반영하는 `minOrNull()` 및 `maxOrNull()` 함수를 선호하여 사용 중단되었습니다.
자세한 내용은 [이 이슈](https://youtrack.jetbrains.com/issue/KT-38854)를 참조하세요.

### 사용 중단된 실험적 코루틴 제외

`kotlin.coroutines.experimental` API는 1.3.0에서 `kotlin.coroutines`를 선호하여 사용 중단되었습니다. 1.4.0에서는 `kotlin.coroutines.experimental`의 사용 중단 주기를 표준 라이브러리에서 제거함으로써 완료하고 있습니다. JVM에서 여전히 이를 사용하는 사용자를 위해, 모든 실험적 코루틴 API를 포함하는 호환성 아티팩트 `kotlin-coroutines-experimental-compat.jar`를 제공했습니다. 이를 Maven에 게시했으며, 표준 라이브러리와 함께 Kotlin 배포판에 포함합니다.

## 안정적인 JSON 직렬화

Kotlin 1.4.0과 함께 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)의 첫 번째 안정 버전인 1.0.0-RC를 출시합니다. 이제 `kotlinx-serialization-core`(이전에는 `kotlinx-serialization-runtime`으로 알려짐)의 JSON 직렬화 API가 안정적이라고 선언하게 되어 기쁩니다. 다른 직렬화 형식용 라이브러리는 코어 라이브러리의 일부 고급 부분과 함께 실험적인 상태로 유지됩니다.

JSON 직렬화 API를 상당히 재작업하여 더 일관되고 사용하기 쉽게 만들었습니다. 이제부터 JSON 직렬화 API를 하위 호환 방식으로 계속 개발할 것입니다. 그러나 이전 버전을 사용했다면 1.0.0-RC로 마이그레이션할 때 코드를 일부 다시 작성해야 할 것입니다. 이를 돕기 위해 `kotlinx.serialization`에 대한 완전한 문서 세트인 **[Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)**도 제공합니다. 이 가이드는 가장 중요한 기능을 사용하는 과정을 안내하고 발생할 수 있는 모든 문제를 해결하는 데 도움이 될 수 있습니다.

> 참고: `kotlinx-serialization` 1.0.0-RC는 Kotlin 컴파일러 1.4에서만 작동합니다. 이전 컴파일러 버전은 호환되지 않습니다.
>
{style="note"}

## 스크립팅 및 REPL

1.4.0에서 Kotlin의 스크립팅은 다른 업데이트와 함께 여러 기능 및 성능 개선의 이점을 얻습니다. 주요 변경 사항은 다음과 같습니다.

- [새로운 의존성 해결 API](#new-dependencies-resolution-api)
- [새로운 REPL API](#new-repl-api)
- [컴파일된 스크립트 캐시](#compiled-scripts-cache)
- [아티팩트 이름 변경](#artifacts-renaming)

Kotlin에서 스크립팅에 더 익숙해질 수 있도록 [예제 프로젝트](https://github.com/Kotlin/kotlin-script-examples)를 준비했습니다. 여기에는 표준 스크립트(`*.main.kts`) 예제와 Kotlin 스크립팅 API 및 사용자 지정 스크립트 정의 사용 예제가 포함되어 있습니다. 사용해 보시고 [이슈 트래커](https://youtrack.jetbrains.com/issues/KT)를 통해 피드백을 공유해 주세요.

### 새로운 의존성 해결 API

1.4.0에서는 외부 의존성(예: Maven 아티팩트)을 해결하기 위한 새로운 API와 그 구현체를 도입했습니다. 이 API는 새로운 아티팩트 `kotlin-scripting-dependencies` 및 `kotlin-scripting-dependencies-maven`에 게시됩니다. `kotlin-script-util` 라이브러리의 이전 의존성 해결 기능은 이제 사용 중단되었습니다.

### 새로운 REPL API

새로운 실험적 REPL API는 이제 Kotlin 스크립팅 API의 일부입니다. 게시된 아티팩트에는 여러 구현체가 있으며, 일부는 코드 완성(code completion)과 같은 고급 기능을 제공합니다. 우리는 [Kotlin Jupyter 커널](https://blog.jetbrains.com/kotlin/2020/05/kotlin-kernel-for-jupyter-notebook-v0-8/)에서 이 API를 사용하며, 이제 여러분의 사용자 지정 쉘과 REPL에서 이를 사용해 볼 수 있습니다.

### 컴파일된 스크립트 캐시

Kotlin 스크립팅 API는 이제 컴파일된 스크립트 캐시를 구현하는 기능을 제공하여 변경되지 않은 스크립트의 후속 실행 속도를 크게 향상시킵니다. 우리의 기본 고급 스크립트 구현인 `kotlin-main-kts`는 이미 자체 캐시를 가지고 있습니다.

### 아티팩트 이름 변경

아티팩트 이름에 대한 혼동을 피하기 위해 `kotlin-scripting-jsr223-embeddable` 및 `kotlin-scripting-jvm-host-embeddable`을 단순히 `kotlin-scripting-jsr223` 및 `kotlin-scripting-jvm-host`로 이름을 변경했습니다. 이러한 아티팩트는 `kotlin-compiler-embeddable` 아티팩트에 의존하며, 이는 사용 충돌을 피하기 위해 번들된 서드파티 라이브러리를 쉐이딩합니다. 이 이름 변경을 통해 `kotlin-compiler-embeddable`(일반적으로 더 안전함) 사용을 스크립팅 아티팩트의 기본값으로 설정하고 있습니다.
어떤 이유로든 쉐이딩되지 않은 `kotlin-compiler`에 의존하는 아티팩트가 필요한 경우, `-unshaded` 접미사가 붙은 아티팩트 버전(예: `kotlin-scripting-jsr223-unshaded`)을 사용하세요. 이 이름 변경은 직접 사용될 스크립팅 아티팩트에만 영향을 미치며, 다른 아티팩트의 이름은 변경되지 않습니다.

## Kotlin 1.4.0으로 마이그레이션

Kotlin 플러그인의 마이그레이션 도구는 이전 버전의 Kotlin 프로젝트를 1.4.0으로 마이그레이션하는 데 도움을 줍니다.

Kotlin 버전을 `1.4.0`으로 변경하고 Gradle 또는 Maven 프로젝트를 다시 임포트하세요. 그러면 IDE가 마이그레이션에 대해 질문할 것입니다.
 
동의하면 마이그레이션 코드 검사(inspection)를 실행하여 코드를 확인하고 1.4.0에서 작동하지 않거나 권장되지 않는 모든 사항에 대한 수정 사항을 제안합니다.

![Run migration](run-migration-wn.png){width=300}

코드 검사(inspection)에는 다양한 [심각도 수준](https://www.jetbrains.com/help/idea/configuring-inspection-severities.html)이 있어 어떤 제안을 수락하고 어떤 제안을 무시할지 결정하는 데 도움이 됩니다.

![Migration inspections](migration-inspection-wn.png)

Kotlin 1.4.0은 [기능 릴리스](kotlin-evolution-principles.md#language-and-tooling-releases)이므로 언어에 호환되지 않는 변경 사항을 가져올 수 있습니다. 이러한 변경 사항에 대한 자세한 목록은 **[Kotlin 1.4 호환성 가이드](compatibility-guide-14.md)**에서 찾을 수 있습니다.