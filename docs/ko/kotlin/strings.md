---
title: 문자열
---
Kotlin의 문자열은 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 타입으로 표현됩니다.

:::note
JVM에서 `String` 타입의 객체는 UTF-16 인코딩에서 문자당 약 2바이트를 사용합니다.

:::

일반적으로 문자열 값은 큰따옴표(`"`)로 묶인 문자 시퀀스입니다.

```kotlin
val str = "abcd 123"
```

문자열의 요소는 인덱싱 연산 `s[i]`를 통해 접근할 수 있는 문자입니다.
`for` 루프를 사용하여 이러한 문자를 반복할 수 있습니다.

```kotlin
fun main() {
    val str = "abcd" 

    for (c in str) {
        println(c)
    }

}
```

문자열은 불변(immutable)합니다. 문자열을 초기화한 후에는 해당 값을 변경하거나 새 값을 할당할 수 없습니다.
문자열을 변환하는 모든 연산은 결과를 새 `String` 객체로 반환하며, 원래 문자열은 변경되지 않습니다.

```kotlin
fun main() {

    val str = "abcd"
   
    // 새로운 String 객체를 생성하고 출력합니다.
    println(str.uppercase())
    // ABCD
   
    // 원래 문자열은 그대로 유지됩니다.
    println(str) 
    // abcd

}
```

문자열을 연결하려면 `+` 연산자를 사용하세요. 표현식의 첫 번째 요소가 문자열인 경우 다른 타입의 값과 문자열을 연결하는 데에도 사용할 수 있습니다.

```kotlin
fun main() {

    val s = "abc" + 1
    println(s + "def")
    // abc1def    

}
```

:::note
대부분의 경우 문자열 연결보다는 [문자열 템플릿](#string-templates) 또는 [멀티라인 문자열](#multiline-strings)을 사용하는 것이 좋습니다.

:::

## 문자열 리터럴

Kotlin에는 두 가지 유형의 문자열 리터럴이 있습니다.

* [이스케이프 문자열](#escaped-strings)
* [멀티라인 문자열](#multiline-strings)

### 이스케이프 문자열

_이스케이프 문자열_은 이스케이프 문자를 포함할 수 있습니다.
이스케이프 문자열의 예는 다음과 같습니다.

```kotlin
val s = "Hello, world!
"
```

이스케이핑은 백슬래시(`\`)를 사용하여 일반적인 방식으로 수행됩니다.
지원되는 이스케이프 시퀀스 목록은 [Characters](characters) 페이지를 참조하세요.

### 멀티라인 문자열

_멀티라인 문자열_은 줄 바꿈과 임의의 텍스트를 포함할 수 있습니다. 삼중 따옴표(`"""`)로 구분되며,
이스케이핑이 없고 줄 바꿈 및 기타 문자를 포함할 수 있습니다.

```kotlin
val text = """
    for (c in "foo")
        print(c)
    """
```

멀티라인 문자열에서 선행 공백을 제거하려면 [`trimMargin()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 함수를 사용하세요.

```kotlin
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()
```

기본적으로 파이프 기호 `|`가 마진 접두사로 사용되지만, `trimMargin(">")`처럼 다른 문자를 선택하여 매개변수로 전달할 수도 있습니다.

## 문자열 템플릿

문자열 리터럴은 _템플릿 표현식_을 포함할 수 있습니다. 템플릿 표현식은 평가되는 코드 조각이며, 그 결과가 문자열로 연결됩니다.
템플릿 표현식이 처리될 때 Kotlin은 자동으로 표현식의 결과에 대해 `.toString()` 함수를 호출하여
문자열로 변환합니다. 템플릿 표현식은 달러 기호(`$`)로 시작하고 변수 이름이거나,

```kotlin
fun main() {

    val i = 10
    println("i = $i") 
    // i = 10
    
    val letters = listOf("a","b","c","d","e")
    println("Letters: $letters") 
    // Letters: [a, b, c, d, e]

}
```

중괄호 안의 표현식입니다.

```kotlin
fun main() {

    val s = "abc"
    println("$s.length is ${s.length}") 
    // abc.length is 3

}
```

멀티라인 문자열과 이스케이프 문자열 모두에서 템플릿을 사용할 수 있습니다. 그러나 멀티라인 문자열은 백슬래시 이스케이핑을 지원하지 않습니다.
달러 기호(`$`)를 멀티라인 문자열에 삽입하려면
[식별자](https://kotlinlang.org/docs/reference/grammar.html#identifiers)의 시작 부분에서 허용되는 기호 앞에 다음 구문을 사용하십시오.

```kotlin
val price = """
${'$'}9.99
"""
```

:::note
문자열에서 `${'$'}` 시퀀스를 피하려면 실험적인 [다중 달러 문자열 보간 기능](#multi-dollar-string-interpolation)을 사용할 수 있습니다.

:::

### 다중 달러 문자열 보간

:::note
다중 달러 문자열 보간은 [실험적](https://kotlinlang.org/docs/components-stability.html#stability-levels-explained)이며
옵트인이 필요합니다(자세한 내용은 아래 참조).

언제든지 변경될 수 있습니다. [YouTrack](https://youtrack.jetbrains.com/issue/KT-2425)에서 여러분의 피드백을 기다립니다.

다중 달러 문자열 보간을 사용하면 보간을 트리거하는 데 필요한 연속된 달러 기호의 수를 지정할 수 있습니다.
보간은 변수 또는 표현식을 문자열에 직접 포함시키는 프로세스입니다.

단일 라인 문자열에 대해서는 [리터럴을 이스케이프](#escaped-strings)할 수 있지만,
Kotlin의 멀티라인 문자열은 백슬래시 이스케이핑을 지원하지 않습니다.
달러 기호(`$`)를 리터럴 문자로 포함하려면 문자열 보간을 방지하기 위해 `${'$'}` 구문을 사용해야 합니다.
특히 문자열에 여러 개의 달러 기호가 포함된 경우 이 방법은 코드를 읽기 어렵게 만들 수 있습니다.

다중 달러 문자열 보간은 달러 기호를 단일 라인 및 멀티라인 문자열 모두에서 리터럴 문자로 취급할 수 있도록 하여 이를 단순화합니다.
예를 들어 다음과 같습니다.

```kotlin
val KClass<*>.jsonSchema : String
    get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta"
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

여기서 `$` 접두사는 문자열 보간을 트리거하는 데 두 개의 연속된 달러 기호가 필요함을 지정합니다.
단일 달러 기호는 리터럴 문자로 유지됩니다.

얼마나 많은 달러 기호가 보간을 트리거하는지 조정할 수 있습니다.
예를 들어 세 개의 연속된 달러 기호(`$$$`)를 사용하면 `$`와 `$`가 리터럴로 유지되는 반면, `$$$productName`을 사용하여 보간을 활성화할 수 있습니다.

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

여기서 `$$$` 접두사를 사용하면 문자열에 `$`와 `$`를 포함할 수 있으며 이스케이핑을 위한 `${'$'}` 구문이 필요하지 않습니다.

이 기능을 활성화하려면 명령줄에서 다음 컴파일러 옵션을 사용하십시오.

```bash
kotlinc -Xmulti-dollar-interpolation main.kt
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록을 업데이트하십시오.

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xmulti-dollar-interpolation")
    }
}
```

이 기능은 단일 달러 문자열 보간을 사용하는 기존 코드에 영향을 미치지 않습니다.
이전처럼 단일 `$`를 계속 사용하고 문자열에서 리터럴 달러 기호를 처리해야 할 때 다중 달러 기호를 적용할 수 있습니다.

## 문자열 포맷

`String.format()` 함수를 사용한 문자열 포맷은 Kotlin/JVM에서만 사용할 수 있습니다.

:::

특정 요구 사항에 맞게 문자열을 포맷하려면 [`String.format()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/format.html) 함수를 사용하세요.

`String.format()` 함수는 포맷 문자열과 하나 이상의 인수를 받습니다. 포맷 문자열은 주어진 인수에 대한 하나의 자리 표시자( `%`로 표시)와 포맷 지정자를 포함합니다.
포맷 지정자는 플래그, 너비, 정밀도 및 변환 유형으로 구성된 해당 인수에 대한 포맷 지침입니다.
전체적으로 포맷 지정자는 출력의 포맷을 형성합니다. 일반적인 포맷 지정자에는 정수의 경우 `%d`, 부동 소수점 숫자의 경우 `%f`, 문자열의 경우 `%s`가 있습니다. `argument_index$` 구문을 사용하여 포맷 문자열 내에서 서로 다른 포맷으로 동일한 인수를 여러 번 참조할 수도 있습니다.

:::note
포맷 지정자에 대한 자세한 이해와 광범위한 목록은 [Java의 Class Formatter 문서](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html#summary)를 참조하세요.

:::

예제를 살펴 보겠습니다.

```kotlin
fun main() { 

    // 정수를 포맷하고, 길이가 7자가 되도록 앞에 0을 추가합니다.
    val integerNumber = String.format("%07d", 31416)
    println(integerNumber)
    // 0031416

    // 부동 소수점 숫자를 + 부호와 소수점 이하 4자리로 표시하도록 포맷합니다.
    val floatNumber = String.format("%+.4f", 3.141592)
    println(floatNumber)
    // +3.1416

    // 두 문자열을 대문자로 포맷하고, 각각 하나의 자리 표시자를 사용합니다.
    val helloString = String.format("%S %S", "hello", "world")
    println(helloString)
    // HELLO WORLD
    
    // 음수를 괄호 안에 묶도록 포맷한 다음, `argument_index$`를 사용하여 다른 포맷(괄호 없음)으로 동일한 숫자를 반복합니다.
    val negativeNumberInParentheses = String.format("%(d means %1\$d", -31416)
    println(negativeNumberInParentheses)
    //(31416) means -31416

}
```

`String.format()` 함수는 문자열 템플릿과 유사한 기능을 제공합니다. 그러나 더 많은 포맷 옵션을 사용할 수 있기 때문에 `String.format()` 함수가 더 다재다능합니다.

또한 변수에서 포맷 문자열을 할당할 수 있습니다. 예를 들어 사용자 로케일에 따라 포맷 문자열이 변경되는 현지화 사례에서 유용할 수 있습니다.

`String.format()` 함수를 사용할 때 인수 수 또는 위치를 해당 자리 표시자와 일치시키지 못하는 실수를 하기 쉬우므로 주의하십시오.