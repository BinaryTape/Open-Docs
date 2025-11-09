[//]: # (title: 스코프 함수)

Kotlin 표준 라이브러리에는 객체의 컨텍스트 내에서 코드 블록을 실행하는 것을 유일한 목적으로 하는 몇몇 함수가 포함되어 있습니다. 람다 표현식([lambda expression](lambdas.md))을 제공하여 객체에서 이러한 함수를 호출하면 임시 스코프가 형성됩니다. 이 스코프 내에서 객체 이름을 사용하지 않고도 객체에 접근할 수 있습니다. 이러한 함수를 _스코프 함수_라고 합니다. 다음 다섯 가지가 있습니다: [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html), [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html), [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html), [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html), 그리고 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html).

기본적으로 이 함수들은 모두 객체에 대해 코드 블록을 실행하는 동일한 작업을 수행합니다. 다른 점은 이 객체가 블록 내에서 어떻게 사용 가능해지는지, 그리고 전체 표현식의 결과가 무엇인지입니다.

다음은 스코프 함수를 사용하는 일반적인 예시입니다.

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let` 없이 동일하게 작성하면 새로운 변수를 도입하고 사용할 때마다 해당 이름을 반복해야 합니다.

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {
//sampleStart
    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

스코프 함수는 새로운 기술적 기능을 도입하지 않지만, 코드를 더 간결하고 읽기 쉽게 만들 수 있습니다.

스코프 함수 간의 많은 유사성 때문에 사용 사례에 적합한 함수를 선택하기가 까다로울 수 있습니다. 선택은 주로 의도와 프로젝트 내에서의 사용 일관성에 따라 달라집니다. 아래에서는 스코프 함수 간의 차이점과 그 컨벤션에 대한 자세한 설명을 제공합니다.

## 함수 선택

목적에 맞는 스코프 함수를 선택하는 데 도움이 되도록 주요 차이점을 요약한 표를 제공합니다.

| 함수 |객체 참조|반환 값|확장 함수 여부|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda result|No: 컨텍스트 객체 없이 호출됩니다.|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda result|No: 컨텍스트 객체를 인자로 받습니다.|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|Context object|Yes|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|Context object|Yes|

이 함수들에 대한 자세한 정보는 아래의 전용 섹션에서 제공됩니다.

다음은 의도하는 목적에 따라 스코프 함수를 선택하기 위한 간단한 가이드입니다.

*   널이 아닌 객체에 람다 실행: `let`
*   지역 스코프에 표현식을 변수로 도입: `let`
*   객체 설정: `apply`
*   객체 설정 및 결과 계산: `run`
*   표현식이 필요한 곳에서 문장 실행: 확장 함수가 아닌 `run`
*   추가 효과: `also`
*   객체에 대한 함수 호출 그룹화: `with`

다양한 스코프 함수의 사용 사례는 중첩되므로, 프로젝트나 팀에서 사용되는 특정 컨벤션에 따라 어떤 함수를 사용할지 선택할 수 있습니다.

스코프 함수는 코드를 더 간결하게 만들 수 있지만, 과도하게 사용하면 코드를 읽기 어렵게 만들고 오류를 유발할 수 있으므로 과도한 사용은 피하십시오. 또한 스코프 함수를 중첩하는 것을 피하고, 체이닝할 때 주의할 것을 권장합니다. 현재 컨텍스트 객체와 `this` 또는 `it`의 값에 대해 혼동하기 쉽기 때문입니다.

## 차이점

스코프 함수는 본질적으로 유사하므로, 그 차이점을 이해하는 것이 중요합니다.
각 스코프 함수에는 두 가지 주요 차이점이 있습니다.
*   컨텍스트 객체를 참조하는 방식.
*   반환 값.

### 컨텍스트 객체: this 또는 it

스코프 함수에 전달된 람다 내부에서는 컨텍스트 객체가 실제 이름 대신 짧은 참조로 사용 가능합니다. 각 스코프 함수는 컨텍스트 객체를 참조하는 두 가지 방식 중 하나를 사용합니다: 람다 리시버([receiver](lambdas.md#function-literals-with-receiver))(`this`) 또는 람다 인자(`it`). 둘 다 동일한 기능을 제공하므로, 다양한 사용 사례에 대한 각각의 장단점을 설명하고 사용 권장 사항을 제공합니다.

```kotlin
fun main() {
    val str = "Hello"
    // this
    str.run {
        println("The string's length: $length")
        //println("The string's length: ${this.length}") // does the same
    }

    // it
    str.let {
        println("The string's length is ${it.length}")
    }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### this

`run`, `with`, `apply`는 람다 리시버([receiver](lambdas.md#function-literals-with-receiver))인 `this` 키워드로 컨텍스트 객체를 참조합니다. 따라서 이들 람다에서는 일반적인 클래스 함수에서처럼 객체를 사용할 수 있습니다.

대부분의 경우, 리시버 객체의 멤버에 접근할 때 `this`를 생략할 수 있어 코드를 더 짧게 만들 수 있습니다. 반면에 `this`가 생략되면, 리시버 멤버와 외부 객체 또는 함수를 구별하기 어려울 수 있습니다. 따라서 컨텍스트 객체를 리시버(`this`)로 사용하는 것은 주로 객체의 함수를 호출하거나 속성에 값을 할당하여 객체의 멤버를 조작하는 람다에 권장됩니다.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### it

반대로, `let`과 `also`는 컨텍스트 객체를 람다 인자([argument](lambdas.md#lambda-expression-syntax))로 참조합니다. 인자 이름이 지정되지 않으면 객체는 암묵적인 기본 이름인 `it`으로 접근됩니다. `it`은 `this`보다 짧고, `it`을 사용한 표현식은 일반적으로 읽기 쉽습니다.

하지만 객체의 함수나 속성을 호출할 때, `this`처럼 객체가 암묵적으로 사용 가능하지 않습니다. 따라서 객체가 주로 함수 호출의 인자로 사용될 때는 `it`을 통해 컨텍스트 객체에 접근하는 것이 더 좋습니다. 코드 블록에서 여러 변수를 사용하는 경우에도 `it`이 더 좋습니다.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

아래 예시는 컨텍스트 객체를 인자 이름 `value`를 사용하는 람다 인자로 참조하는 방법을 보여줍니다.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value ->
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 반환 값

스코프 함수는 반환하는 결과에 따라 다릅니다.
*   `apply`와 `also`는 컨텍스트 객체를 반환합니다.
*   `let`, `run`, `with`는 람다 결과를 반환합니다.

코드에서 다음에 수행하려는 작업에 따라 어떤 반환 값을 원하는지 신중하게 고려해야 합니다. 이는 사용할 최적의 스코프 함수를 선택하는 데 도움이 됩니다.

#### 컨텍스트 객체

`apply`와 `also`의 반환 값은 컨텍스트 객체 자체입니다. 따라서 이들은 호출 체인에 _보조 단계(side steps)_로 포함될 수 있습니다: 동일한 객체에 대해 함수 호출을 계속해서 이어서 체이닝할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()
//sampleEnd
    println(numberList)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한 컨텍스트 객체를 반환하는 함수의 `return` 문에서 사용될 수도 있습니다.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {
//sampleStart
    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 람다 결과

`let`, `run`, `with`는 람다 결과를 반환합니다. 따라서 결과를 변수에 할당하거나, 결과에 대한 연산을 체이닝하는 등의 경우에 사용할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

추가적으로, 반환 값을 무시하고 스코프 함수를 사용하여 지역 변수를 위한 임시 스코프를 생성할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 함수

사용 사례에 맞는 적절한 스코프 함수를 선택하는 데 도움이 되도록, 각 함수에 대해 자세히 설명하고 사용 권장 사항을 제공합니다. 기술적으로 스코프 함수는 많은 경우 상호 교환이 가능하므로, 예시들은 사용 컨벤션을 보여줍니다.

### let

*   **컨텍스트 객체**는 인자(`it`)로 사용 가능합니다.
*   **반환 값**은 람다 결과입니다.

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)은 호출 체인의 결과에 대해 하나 이상의 함수를 호출하는 데 사용될 수 있습니다. 예를 들어, 다음 코드는 컬렉션에 대한 두 가지 연산의 결과를 출력합니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`을 사용하면 위 예시를 목록 연산의 결과를 변수에 할당하지 않도록 다시 작성할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`에 전달된 코드 블록에 `it`을 인자로 받는 단일 함수가 포함된 경우, 람다 인자 대신 메서드 참조(`::`)를 사용할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`let`은 널이 아닌 값을 포함하는 코드 블록을 실행하는 데 자주 사용됩니다. 널이 아닌 객체에 대해 작업을 수행하려면, 객체에 [안전 호출 연산자 `?.`](null-safety.md#safe-call-operator)를 사용하고 람다 내의 작업과 함께 `let`을 호출합니다.

```kotlin
fun processNonNullString(str: String) {}

fun main() {
//sampleStart
    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한 `let`을 사용하여 제한된 스코프를 가진 지역 변수를 도입함으로써 코드를 더 읽기 쉽게 만들 수 있습니다. 컨텍스트 객체에 대한 새 변수를 정의하려면, 기본 `it` 대신 사용할 수 있도록 해당 이름을 람다 인자로 제공하십시오.

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem ->
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### with

*   **컨텍스트 객체**는 리시버(`this`)로 사용 가능합니다.
*   **반환 값**은 람다 결과입니다.

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)는 확장 함수가 아니므로: 컨텍스트 객체는 인자로 전달되지만 람다 내부에서는 리시버(`this`)로 사용 가능합니다.

반환된 결과를 사용할 필요가 없을 때 컨텍스트 객체에 대해 함수를 호출하기 위해 `with`를 사용하는 것을 권장합니다. 코드에서 `with`는 "_이 객체를 가지고 다음을 수행하라._"로 읽을 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한 `with`를 사용하여 값 계산에 속성이나 함수가 사용되는 헬퍼 객체를 도입할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### run

*   **컨텍스트 객체**는 리시버(`this`)로 사용 가능합니다.
*   **반환 값**은 람다 결과입니다.

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)은 `with`와 동일한 작업을 수행하지만 확장 함수로 구현됩니다. 따라서 `let`처럼 점 표기법을 사용하여 컨텍스트 객체에서 호출할 수 있습니다.

`run`은 람다가 객체를 초기화하고 반환 값을 계산하는 경우에 유용합니다.

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {
//sampleStart
    val service = MultiportService("https://example.kotlinlang.org", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
    
    // the same code written with let() function:
    val letResult = service.let {
        it.port = 8080
        it.query(it.prepareRequest() + " to port ${it.port}")
    }
//sampleEnd
    println(result)
    println(letResult)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또한 `run`을 확장 함수가 아닌 형태로 호출할 수도 있습니다. `run`의 확장 함수가 아닌 형태는 컨텍스트 객체가 없지만, 여전히 람다 결과를 반환합니다. 확장 함수가 아닌 `run`은 표현식이 필요한 곳에서 여러 문장으로 구성된 블록을 실행할 수 있도록 합니다. 코드에서 확장 함수가 아닌 `run`은 "_코드 블록을 실행하고 결과를 계산하라._"로 읽을 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### apply

*   **컨텍스트 객체**는 리시버(`this`)로 사용 가능합니다.
*   **반환 값**은 객체 자체입니다.

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)는 컨텍스트 객체 자체를 반환하므로, 값을 반환하지 않으면서 주로 리시버 객체의 멤버를 조작하는 코드 블록에 사용하는 것을 권장합니다. `apply`의 가장 일반적인 사용 사례는 객체 설정입니다. 이러한 호출은 "_객체에 다음 할당을 적용하라._"로 읽을 수 있습니다.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {
//sampleStart
    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`apply`의 또 다른 사용 사례는 더 복잡한 처리를 위해 여러 호출 체인에 `apply`를 포함하는 것입니다.

### also

*   **컨텍스트 객체**는 인자(`it`)로 사용 가능합니다.
*   **반환 값**은 객체 자체입니다.

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)는 컨텍스트 객체를 인자로 받는 일부 작업을 수행하는 데 유용합니다. `also`는 객체의 속성과 함수보다는 객체에 대한 참조가 필요한 작업에 사용하거나, 외부 스코프의 `this` 참조를 가리고 싶지 않을 때 사용하십시오.

코드에서 `also`를 보면 "_그리고 이 객체로 다음을 수행하라._"로 읽을 수 있습니다.

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## takeIf와 takeUnless

스코프 함수 외에도 표준 라이브러리에는 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html)와 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html) 함수가 포함되어 있습니다. 이 함수들은 객체 상태 검사를 호출 체인에 삽입할 수 있도록 합니다.

객체와 함께 프레디케이트(predicate)를 사용하여 호출될 때, `takeIf`는 주어진 프레디케이트를 만족하면 이 객체를 반환합니다. 그렇지 않으면 `null`을 반환합니다. 따라서 `takeIf`는 단일 객체를 위한 필터링 함수입니다.

`takeUnless`는 `takeIf`와 반대되는 로직을 가집니다. 객체와 함께 프레디케이트를 사용하여 호출될 때, `takeUnless`는 주어진 프레디케이트를 만족하면 `null`을 반환합니다. 그렇지 않으면 객체를 반환합니다.

`takeIf` 또는 `takeUnless`를 사용할 때, 객체는 람다 인자(`it`)로 사용 가능합니다.

```kotlin
import kotlin.random.*

fun main() {
//sampleStart
    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> `takeIf`와 `takeUnless` 뒤에 다른 함수들을 체이닝할 때, 반환 값이 널러블(nullable)이므로 널 체크를 수행하거나 안전 호출(`?.`)을 사용하는 것을 잊지 마십시오.
>
{style="tip"}

```kotlin
fun main() {
//sampleStart
    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`takeIf`와 `takeUnless`는 스코프 함수와 결합하여 특히 유용합니다. 예를 들어, `takeIf`와 `takeUnless`를 `let`과 체이닝하여 주어진 프레디케이트와 일치하는 객체에 대해 코드 블록을 실행할 수 있습니다. 이를 위해 객체에 `takeIf`를 호출한 다음, 안전 호출(`?`)을 사용하여 `let`을 호출합니다. 프레디케이트와 일치하지 않는 객체의 경우, `takeIf`는 `null`을 반환하고 `let`은 호출되지 않습니다.

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

비교를 위해, 아래는 `takeIf` 또는 스코프 함수를 사용하지 않고 동일한 함수를 작성하는 방법을 보여주는 예시입니다.

```kotlin
fun main() {
//sampleStart
    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}