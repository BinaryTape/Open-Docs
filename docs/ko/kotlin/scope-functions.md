---
title: "Scope 함수"
---
코틀린 표준 라이브러리에는 객체의 컨텍스트 내에서 코드 블록을 실행하는 것을 유일한 목적으로 하는 여러 함수가 포함되어 있습니다. 제공된 [람다 표현식](lambdas)으로 객체에 이러한 함수를 호출하면 임시 스코프가 형성됩니다. 이 스코프에서는 이름을 사용하지 않고 객체에 액세스할 수 있습니다. 이러한 함수를 _스코프 함수_라고 합니다. 이러한 함수에는 [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html), [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html), [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html), [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) 및 [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)의 다섯 가지가 있습니다.

기본적으로 이러한 함수는 모두 동일한 작업을 수행합니다. 즉, 객체에서 코드 블록을 실행합니다. 다른 점은 이 객체가 블록 내부에서 사용 가능하게 되는 방식과 전체 표현식의 결과입니다.

다음은 스코프 함수를 사용하는 일반적인 예입니다.

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    Person("Alice", 20, "Amsterdam").let {
        println(it)
        it.moveTo("London")
        it.incrementAge()
        println(it)
    }

}
```

`let` 없이 동일한 코드를 작성하면 새 변수를 도입하고 사용할 때마다 이름을 반복해야 합니다.

```kotlin
data class Person(var name: String, var age: Int, var city: String) {
    fun moveTo(newCity: String) { city = newCity }
    fun incrementAge() { age++ }
}

fun main() {

    val alice = Person("Alice", 20, "Amsterdam")
    println(alice)
    alice.moveTo("London")
    alice.incrementAge()
    println(alice)

}
```

스코프 함수는 새로운 기술적 기능을 도입하지 않지만 코드를 더 간결하고 읽기 쉽게 만들 수 있습니다.

스코프 함수 간에 유사점이 많기 때문에 사용 사례에 적합한 함수를 선택하기가 까다로울 수 있습니다. 선택은 주로 프로젝트에서 사용하려는 의도와 일관성에 따라 달라집니다. 아래에서는 스코프 함수 간의 차이점과 규칙에 대한 자세한 설명을 제공합니다.

## 함수 선택

목적에 맞는 올바른 스코프 함수를 선택하는 데 도움이 되도록 주요 차이점을 요약한 표를 제공합니다.

| Function |Object reference|Return value|Is extension function|
|---|---|---|---|
| [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html) |`it`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |`this`|Lambda result|Yes|
| [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) |-|Lambda result|No: called without the context object|
| [`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html) |`this`|Lambda result|No: takes the context object as an argument.|
| [`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html) |`this`|Context object|Yes|
| [`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html) |`it`|Context object|Yes|

이러한 함수에 대한 자세한 내용은 아래의 전용 섹션에 제공되어 있습니다.

다음은 의도된 목적에 따라 스코프 함수를 선택하기 위한 간단한 가이드입니다.

* Null이 될 수 없는 객체에서 람다 실행: `let`
* 로컬 스코프에서 표현식을 변수로 도입: `let`
* 객체 구성: `apply`
* 객체 구성 및 결과 계산: `run`
* 표현식이 필요한 문 실행: 비확장 `run`
* 추가 효과: `also`
* 객체에서 함수 호출 그룹화: `with`

서로 다른 스코프 함수의 사용 사례가 겹치므로 프로젝트 또는 팀에서 사용하는 특정 규칙에 따라 사용할 함수를 선택할 수 있습니다.

스코프 함수를 사용하면 코드를 더 간결하게 만들 수 있지만 과도하게 사용하지 마십시오. 코드를 읽기 어렵게 만들고 오류를 유발할 수 있습니다. 또한 스코프 함수를 중첩하지 않고 연결할 때 주의하는 것이 좋습니다. 현재 컨텍스트 객체와 `this` 또는 `it`의 값을 혼동하기 쉽기 때문입니다.

## 차이점

스코프 함수는 본질적으로 유사하기 때문에 함수 간의 차이점을 이해하는 것이 중요합니다.
각 스코프 함수 간에는 두 가지 주요 차이점이 있습니다.
* 컨텍스트 객체를 참조하는 방식
* 반환 값

### 컨텍스트 객체: this 또는 it

스코프 함수에 전달된 람다 내부에서 컨텍스트 객체는 실제 이름 대신 짧은 참조로 사용할 수 있습니다. 각 스코프 함수는 람다 [수신자](lambdas#function-literals-with-receiver)(`this`) 또는 람다 인수(`it`)로 컨텍스트 객체를 참조하는 두 가지 방법 중 하나를 사용합니다. 둘 다 동일한 기능을 제공하므로 다양한 사용 사례에 대한 장단점을 설명하고 사용 권장 사항을 제공합니다.

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

#### this

`run`, `with` 및 `apply`는 컨텍스트 객체를 키워드 `this`로 람다 [수신자](lambdas#function-literals-with-receiver)로 참조합니다. 따라서 람다에서 객체는 일반적인 클래스 함수에서와 같이 사용할 수 있습니다.

대부분의 경우 수신자 객체의 멤버에 액세스할 때 `this`를 생략하여 코드를 더 짧게 만들 수 있습니다. 반면에 `this`를 생략하면 수신자 멤버와 외부 객체 또는 함수를 구별하기 어려울 수 있습니다. 따라서 컨텍스트 객체를 수신자(`this`)로 사용하는 것은 해당 함수를 호출하거나 속성에 값을 할당하여 객체의 멤버에서 주로 작동하는 람다에 권장됩니다.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply { 
        age = 20                       // same as this.age = 20
        city = "London"
    }
    println(adam)

}
```

#### it

반면에 `let`과 `also`는 컨텍스트 객체를 람다 [인수](lambdas#lambda-expression-syntax)로 참조합니다. 인수 이름을 지정하지 않으면 객체는 암시적 기본 이름 `it`로 액세스됩니다. `it`은 `this`보다 짧고 `it`을 사용하는 표현식은 일반적으로 읽기가 더 쉽습니다.

그러나 객체의 함수 또는 속성을 호출할 때 `this`처럼 암시적으로 사용할 수 있는 객체가 없습니다. 따라서 객체가 함수 호출에서 인수로 주로 사용되는 경우 `it`을 통해 컨텍스트 객체에 액세스하는 것이 좋습니다. 코드 블록에서 여러 변수를 사용하는 경우에도 `it`이 더 좋습니다.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

아래 예제에서는 인수 이름 `value`를 사용하여 람다 인수로 컨텍스트 객체를 참조하는 방법을 보여 줍니다.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also { value `->`
            writeToLog("getRandomInt() generated value $value")
        }
    }
    
    val i = getRandomInt()
    println(i)

}
```

### 반환 값

스코프 함수는 반환하는 결과가 다릅니다.
* `apply`와 `also`는 컨텍스트 객체를 반환합니다.
* `let`, `run` 및 `with`는 람다 결과를 반환합니다.

코드에서 다음에 수행하려는 작업을 기반으로 원하는 반환 값을 신중하게 고려해야 합니다. 이렇게 하면 사용할 최상의 스코프 함수를 선택하는 데 도움이 됩니다.

#### 컨텍스트 객체

`apply`와 `also`의 반환 값은 컨텍스트 객체 자체입니다. 따라서 호출 체인에 _사이드 스텝_으로 포함될 수 있습니다. 동일한 객체에서 함수 호출을 차례로 계속 연결할 수 있습니다.

```kotlin
fun main() {

    val numberList = mutableListOf<Double>()
    numberList.also { println("Populating the list") }
        .apply {
            add(2.71)
            add(3.14)
            add(1.0)
        }
        .also { println("Sorting the list") }
        .sort()

    println(numberList)
}
```

컨텍스트 객체를 반환하는 함수의 반환 문에서 사용할 수도 있습니다.

```kotlin
import kotlin.random.Random

fun writeToLog(message: String) {
    println("INFO: $message")
}

fun main() {

    fun getRandomInt(): Int {
        return Random.nextInt(100).also {
            writeToLog("getRandomInt() generated value $it")
        }
    }
    
    val i = getRandomInt()

}
```

#### 람다 결과

`let`, `run` 및 `with`는 람다 결과를 반환합니다. 따라서 결과를 변수에 할당하거나 결과에 대한 작업을 연결하는 등의 경우에 사용할 수 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val countEndsWithE = numbers.run { 
        add("four")
        add("five")
        count { it.endsWith("e") }
    }
    println("There are $countEndsWithE elements that end with e.")

}
```

또한 반환 값을 무시하고 스코프 함수를 사용하여 로컬 변수에 대한 임시 스코프를 만들 수 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        val firstItem = first()
        val lastItem = last()        
        println("First item: $firstItem, last item: $lastItem")
    }

}
```

## 함수

사용 사례에 맞는 올바른 스코프 함수를 선택하는 데 도움이 되도록 자세히 설명하고 사용 권장 사항을 제공합니다. 기술적으로 스코프 함수는 여러 경우에 상호 교환 가능하므로 예제에서는 해당 함수를 사용하는 규칙을 보여 줍니다.

### let

- **컨텍스트 객체**는 인수(`it`)로 사용할 수 있습니다.
- **반환 값**은 람다 결과입니다.

[`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html)은 호출 체인의 결과에 대해 하나 이상의 함수를 호출하는 데 사용할 수 있습니다. 예를 들어 다음 코드는 컬렉션에서 두 작업의 결과를 인쇄합니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    val resultList = numbers.map { it.length }.filter { it > 3 }
    println(resultList)    

}
```

`let`을 사용하면 목록 작업의 결과를 변수에 할당하지 않도록 위의 예제를 다시 작성할 수 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let { 
        println(it)
        // and more function calls if needed
    } 

}
```

`let`에 전달된 코드 블록에 `it`을 인수로 사용하는 단일 함수가 포함된 경우 람다 인수 대신 메서드 참조(`::`)를 사용할 수 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four", "five")
    numbers.map { it.length }.filter { it > 3 }.let(::println)

}
```

`let`은 일반적으로 null이 아닌 값을 포함하는 코드 블록을 실행하는 데 사용됩니다. null이 아닌 객체에 대해 작업을 수행하려면 [안전 호출 연산자 `?.`](null-safety#safe-call-operator)를 사용하여 `let`을 해당 람다의 작업과 함께 호출합니다.

```kotlin
fun processNonNullString(str: String) {}

fun main() {

    val str: String? = "Hello"   
    //processNonNullString(str)       // compilation error: str can be null
    val length = str?.let { 
        println("let() called on $it")        
        processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
        it.length
    }

}
```

`let`을 사용하여 코드를 더 읽기 쉽게 만들 수 있는 제한된 범위의 로컬 변수를 도입할 수도 있습니다.
컨텍스트 객체에 대한 새 변수를 정의하려면 해당 이름을 람다 인수로 제공하여 기본 `it` 대신 사용할 수 있도록 합니다.

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val modifiedFirstItem = numbers.first().let { firstItem `->`
        println("The first item of the list is '$firstItem'")
        if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
    }.uppercase()
    println("First item after modifications: '$modifiedFirstItem'")

}
```

### with

- **컨텍스트 객체**는 수신자(`this`)로 사용할 수 있습니다.
- **반환 값**은 람다 결과입니다.

[`with`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/with.html)는 확장 함수가 아니므로 컨텍스트 객체는 인수로 전달되지만 람다 내부에서는 수신자(`this`)로 사용할 수 있습니다.

반환된 결과를 사용할 필요가 없는 경우 컨텍스트 객체에서 함수를 호출하는 데 `with`를 사용하는 것이 좋습니다.
코드에서 `with`는 "_이 객체를 사용하여 다음을 수행합니다._"로 읽을 수 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    with(numbers) {
        println("'with' is called with argument $this")
        println("It contains $size elements")
    }

}
```

`with`를 사용하여 값을 계산하는 데 사용되는 속성 또는 함수가 있는 도우미 객체를 도입할 수도 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    val firstAndLast = with(numbers) {
        "The first element is ${first()}," +
        " the last element is ${last()}"
    }
    println(firstAndLast)

}
```

### run

- **컨텍스트 객체**는 수신자(`this`)로 사용할 수 있습니다.
- **반환 값**은 람다 결과입니다.

[`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html)은 `with`와 동일한 작업을 수행하지만 확장 함수로 구현됩니다. 따라서 `let`과 마찬가지로 점 표기법을 사용하여 컨텍스트 객체에서 호출할 수 있습니다.

`run`은 람다가 객체를 초기화하고 반환 값을 계산하는 경우에 유용합니다.

```kotlin
class MultiportService(var url: String, var port: Int) {
    fun prepareRequest(): String = "Default request"
    fun query(request: String): String = "Result for query '$request'"
}

fun main() {

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

    println(result)
    println(letResult)
}
```

`run`을 비확장 함수로 호출할 수도 있습니다. 비확장 `run` 변형에는 컨텍스트 객체가 없지만 여전히 람다 결과를 반환합니다. 비확장 `run`을 사용하면 표현식이 필요한 위치에서 여러 문의 블록을 실행할 수 있습니다. 코드에서 비확장 `run`은 "_코드 블록을 실행하고 결과를 계산합니다._"로 읽을 수 있습니다.

```kotlin
fun main() {

    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"
        
        Regex("[$sign]?[$digits$hexDigits]+")
    }
    
    for (match in hexNumberRegex.findAll("+123 -FFFF !%*& 88 XYZ")) {
        println(match.value)
    }

}
```

### apply

- **컨텍스트 객체**는 수신자(`this`)로 사용할 수 있습니다.
- **반환 값**은 객체 자체입니다.

[`apply`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/apply.html)는 컨텍스트 객체 자체를 반환하므로 값을 반환하지 않고 주로 수신자 객체의 멤버에서 작동하는 코드 블록에 사용하는 것이 좋습니다. `apply`의 가장 일반적인 사용 사례는 객체 구성입니다. 이러한 호출은 "_객체에 다음 할당을 적용합니다._"로 읽을 수 있습니다.

```kotlin
data class Person(var name: String, var age: Int = 0, var city: String = "")

fun main() {

    val adam = Person("Adam").apply {
        age = 32
        city = "London"        
    }
    println(adam)

}
```

`apply`의 또 다른 사용 사례는 더 복잡한 처리를 위해 여러 호출 체인에 `apply`를 포함하는 것입니다.

### also

- **컨텍스트 객체**는 인수(`it`)로 사용할 수 있습니다.
- **반환 값**은 객체 자체입니다.

[`also`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/also.html)는 컨텍스트 객체를 인수로 사용하는 일부 작업을 수행하는 데 유용합니다. 속성 및 함수가 아닌 객체에 대한 참조가 필요하거나 외부 스코프에서 `this` 참조를 섀도 처리하지 않으려는 경우 `also`를 사용합니다.

코드에서 `also`가 표시되면 "_객체를 사용하여 다음도 수행합니다._"로 읽을 수 있습니다.

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three")
    numbers
        .also { println("The list elements before adding new one: $it") }
        .add("four")

}
```

## takeIf 및 takeUnless

스코프 함수 외에도 표준 라이브러리에는 함수 [`takeIf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-if.html) 및 [`takeUnless`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/take-unless.html)가 포함되어 있습니다. 이러한 함수를 사용하면 호출 체인에 객체 상태 검사를 포함할 수 있습니다.

객체에서 조건자와 함께 호출되면 `takeIf`는 지정된 조건자를 충족하는 경우 이 객체를 반환합니다.
그렇지 않으면 `null`을 반환합니다. 따라서 `takeIf`는 단일 객체에 대한 필터링 함수입니다.

`takeUnless`는 `takeIf`와 반대되는 논리를 가지고 있습니다. 객체에서 조건자와 함께 호출되면 `takeUnless`는 지정된 조건자를 충족하는 경우 `null`을 반환합니다. 그렇지 않으면 객체를 반환합니다.

`takeIf` 또는 `takeUnless`를 사용하는 경우 객체는 람다 인수(`it`)로 사용할 수 있습니다.

```kotlin
import kotlin.random.*

fun main() {

    val number = Random.nextInt(100)

    val evenOrNull = number.takeIf { it % 2 == 0 }
    val oddOrNull = number.takeUnless { it % 2 == 0 }
    println("even: $evenOrNull, odd: $oddOrNull")

}
```

:::tip
`takeIf` 및 `takeUnless` 뒤에 다른 함수를 연결할 때 반환 값은 null이 될 수 있으므로 null 검사를 수행하거나 안전 호출(`?.`)을 사용하는 것을 잊지 마십시오.

:::

```kotlin
fun main() {

    val str = "Hello"
    val caps = str.takeIf { it.isNotEmpty() }?.uppercase()
   //val caps = str.takeIf { it.isNotEmpty() }.uppercase() //compilation error
    println(caps)

}
```

`takeIf`와 `takeUnless`는 특히 스코프 함수와 함께 사용하면 유용합니다. 예를 들어 `takeIf` 및 `takeUnless`를 `let`과 연결하여 지정된 조건자와 일치하는 객체에서 코드 블록을 실행할 수 있습니다. 이렇게 하려면 객체에서 `takeIf`를 호출한 다음 안전 호출(`?`)로 `let`을 호출합니다. 조건자와 일치하지 않는 객체의 경우 `takeIf`는 `null`을 반환하고 `let`은 호출되지 않습니다.

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        input.indexOf(sub).takeIf { it >= 0 }?.let {
            println("The substring $sub is found in $input.")
            println("Its start position is $it.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```

비교를 위해 아래는 `takeIf` 또는 스코프 함수를 사용하지 않고 동일한 함수를 작성할 수 있는 방법에 대한 예입니다.

```kotlin
fun main() {

    fun displaySubstringPosition(input: String, sub: String) {
        val index = input.indexOf(sub)
        if (index >= 0) {
            println("The substring $sub is found in $input.")
            println("Its start position is $index.")
        }
    }

    displaySubstringPosition("010000011", "11")
    displaySubstringPosition("010000011", "12")

}
```