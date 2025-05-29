[//]: # (title: 문자열)

Kotlin의 문자열은 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 타입으로 표현됩니다.

> JVM에서 UTF-16 인코딩의 `String` 타입 객체는 문자당 약 2바이트를 사용합니다.
>
{style="note"}

일반적으로 문자열 값은 큰따옴표(`"`)로 묶인 일련의 문자입니다:

```kotlin
val str = "abcd 123"
```

문자열의 요소는 인덱싱 연산(`s[i]`)을 통해 접근할 수 있는 문자입니다.
`for` 루프를 사용하여 이 문자들을 반복할 수 있습니다:

```kotlin
fun main() {
    val str = "abcd" 
//sampleStart
    for (c in str) {
        println(c)
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

문자열은 변경 불가능(immutable)합니다. 문자열을 일단 초기화하면 그 값을 변경하거나 새로운 값을 할당할 수 없습니다.
문자열을 변형하는 모든 연산은 새로운 `String` 객체로 결과를 반환하며, 원본 문자열은 변경되지 않습니다:

```kotlin
fun main() {
//sampleStart
    val str = "abcd"
   
    // Creates and prints a new String object
    println(str.uppercase())
    // ABCD
   
    // The original string remains the same
    println(str) 
    // abcd
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

문자열을 연결하려면 `+` 연산자를 사용합니다. 이는 표현식의 첫 번째 요소가 문자열인 한, 다른 타입의 값과 문자열을 연결하는 데에도 작동합니다:

```kotlin
fun main() {
//sampleStart
    val s = "abc" + 1
    println(s + "def")
    // abc1def    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

> 대부분의 경우 [문자열 템플릿](#string-templates) 또는 [여러 줄 문자열](#multiline-strings)을 사용하는 것이 문자열 연결보다 선호됩니다.
>
{style="note"}

## 문자열 리터럴

Kotlin에는 두 가지 타입의 문자열 리터럴이 있습니다:

* [이스케이프 문자열](#escaped-strings)
* [여러 줄 문자열](#multiline-strings)

### 이스케이프 문자열

_이스케이프 문자열_은 이스케이프 문자를 포함할 수 있습니다.
다음은 이스케이프 문자열의 예시입니다:

```kotlin
val s = "Hello, world!
"
```

이스케이프는 백슬래시(`\`)를 사용하여 일반적인 방식으로 수행됩니다.
지원되는 이스케이프 시퀀스 목록은 [문자](characters.md) 페이지를 참조하세요.

### 여러 줄 문자열

_여러 줄 문자열_은 새 줄과 임의의 텍스트를 포함할 수 있습니다. 이는 세 개의 큰따옴표(`"""`)로 구분되며, 이스케이프 처리가 없고 새 줄과 모든 다른 문자를 포함할 수 있습니다:

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

여러 줄 문자열에서 선행 공백을 제거하려면 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 함수를 사용하세요:

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

기본적으로 파이프 기호 `|`가 마진 접두사로 사용되지만, 다른 문자를 선택하여 `trimMargin(">")`와 같이 파라미터로 전달할 수 있습니다.

## 문자열 템플릿

문자열 리터럴은 _템플릿 표현식_을 포함할 수 있습니다 – 평가되어 그 결과가 문자열로 연결되는 코드 조각입니다.
템플릿 표현식이 처리될 때, Kotlin은 표현식의 결과에 대해 자동으로 `.toString()` 함수를 호출하여 문자열로 변환합니다. 템플릿 표현식은 달러 기호(`$`)로 시작하며 다음 중 하나로 구성됩니다: 변수 이름:

```kotlin
fun main() {
//sampleStart
    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

또는 중괄호 안에 있는 표현식:

```kotlin
fun main() {
//sampleStart
    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

템플릿은 여러 줄 문자열과 이스케이프 문자열 모두에서 사용할 수 있습니다. 하지만 여러 줄 문자열은 백슬래시 이스케이프를 지원하지 않습니다.
여러 줄 문자열에 [식별자](https://kotlinlang.org/docs/reference/grammar.html#identifiers) 시작 부분에 허용되는 기호 앞에 달러 기호 `$`를 삽입하려면 다음 구문을 사용하세요:

```kotlin
val price = """
${'$'}9.99
"""
```

> 문자열 내에서 `${'$'}` 시퀀스를 피하려면 실험적인 [멀티 달러 문자열 보간 기능](#multi-dollar-string-interpolation)을 사용할 수 있습니다.
>
{style="note"}

### 멀티 달러 문자열 보간

> 멀티 달러 문자열 보간은 [실험적(Experimental)](components-stability.md#stability-levels-explained) 기능이며 옵트인(opt-in)이 필요합니다 (아래 세부 정보 참조).
>
> 이는 언제든지 변경될 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)에 피드백을 주시면 감사하겠습니다.
>
{style="warning"}

멀티 달러 문자열 보간을 사용하면 보간(interpolation)을 트리거하는 데 필요한 연속적인 달러 기호의 개수를 지정할 수 있습니다.
보간은 변수 또는 표현식을 문자열에 직접 삽입하는 과정입니다.

단일 줄 문자열에 대해 [리터럴을 이스케이프](#escaped-strings)할 수 있지만, Kotlin의 여러 줄 문자열은 백슬래시 이스케이프를 지원하지 않습니다.
달러 기호(`$`)를 리터럴 문자로 포함하려면 문자열 보간을 방지하기 위해 `${'$'}` 구문을 사용해야 합니다.
이 접근 방식은 코드를 읽기 어렵게 만들 수 있습니다. 특히 문자열에 여러 달러 기호가 포함된 경우에 그렇습니다.

멀티 달러 문자열 보간은 단일 줄 및 여러 줄 문자열 모두에서 달러 기호를 리터럴 문자로 처리할 수 있게 하여 이를 간소화합니다.
예를 들어:

```kotlin
val KClass<*>.jsonSchema : String
    get() = $$"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

여기서 `$$` 접두사는 문자열 보간을 트리거하려면 두 개의 연속적인 달러 기호가 필요하다는 것을 지정합니다.
단일 달러 기호는 리터럴 문자로 유지됩니다.

몇 개의 달러 기호가 보간을 트리거할지 조정할 수 있습니다.
예를 들어, 세 개의 연속적인 달러 기호(`$$$`)를 사용하면 `$`와 `$$`가 리터럴로 유지되면서 `$$$!`를 통한 보간이 가능해집니다:

```kotlin
val productName = "carrot"
val requestedData =
    $$"""{
      "currency": "$",
      "enteredAmount": "42.45 $",
      "$serviceField": "none",
      "product": "$$productName"
    }
    """

println(requestedData)
//{
//    "currency": "$",
//    "enteredAmount": "42.45 $",
//    "$serviceField": "none",
//    "product": "carrot"
//}
```

여기서 `$$` 접두사는 이스케이프를 위해 `${'$'}` 구문을 요구하지 않고 문자열에 `$`와 `$$`를 포함하도록 허용합니다.

이 기능을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하세요:

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록을 업데이트하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

이 기능은 단일 달러 문자열 보간을 사용하는 기존 코드에 영향을 주지 않습니다.
이전과 같이 단일 `$`를 계속 사용할 수 있으며 문자열에 리터럴 달러 기호를 처리해야 할 때 멀티 달러 기호를 적용할 수 있습니다.

## 문자열 포매팅

> `String.format()` 함수를 사용한 문자열 포매팅은 Kotlin/JVM에서만 사용할 수 있습니다.
>
{style="note"}

특정 요구 사항에 맞게 문자열을 포매팅하려면 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 함수를 사용하세요.

`String.format()` 함수는 포맷 문자열과 하나 이상의 인수를 받습니다. 포맷 문자열은 주어진 인수에 대한 하나의 플레이스홀더(`%`로 표시)를 포함하며, 그 뒤에 포맷 지정자(format specifiers)가 옵니다.
포맷 지정자는 해당 인수에 대한 포매팅 지시이며, 플래그, 너비, 정밀도, 변환 타입으로 구성됩니다. 총체적으로, 포맷 지정자는 출력의 포매팅을 결정합니다. 일반적인 포맷 지정자에는 정수용 `%d`, 부동 소수점 숫자용 `%f`, 문자열용 `%s`가 있습니다.
또한 `argument_index$` 구문을 사용하여 포맷 문자열 내에서 동일한 인수를 다른 포맷으로 여러 번 참조할 수 있습니다.

> 포맷 지정자에 대한 자세한 이해와 광범위한 목록을 보려면 [Java의 Class Formatter 문서](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)를 참조하세요.
>
{style="note"}

예시를 살펴보겠습니다:

```kotlin
fun main() { 
//sampleStart
    // 정수를 포매팅하여 7자리 길이가 되도록 선행 0을 추가합니다
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 부동 소수점 숫자를 + 기호와 소수점 이하 네 자리로 표시하도록 포매팅합니다
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 두 문자열을 대문자로 포매팅하며, 각각 하나의 플레이스홀더를 차지합니다
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 음수를 괄호로 묶도록 포매팅한 다음, `argument_index$`를 사용하여 동일한 숫자를 다른 포맷(괄호 없이)으로 반복합니다.
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416
//sampleEnd    
}
```
{interpolate-variables="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`String.format()` 함수는 문자열 템플릿과 유사한 기능을 제공합니다. 하지만 `String.format()` 함수는 더 많은 포매팅 옵션을 사용할 수 있기 때문에 더 다용도입니다.

또한, 변수에서 포맷 문자열을 할당할 수 있습니다. 이는 포맷 문자열이 변경될 때 유용할 수 있습니다. 예를 들어, 사용자 로케일에 따라 달라지는 현지화(localization)의 경우에 그렇습니다.

`String.format()` 함수를 사용할 때는 주의해야 합니다. 인수 개수나 위치가 해당 플레이스홀더와 일치하지 않는 실수를 하기 쉽기 때문입니다.