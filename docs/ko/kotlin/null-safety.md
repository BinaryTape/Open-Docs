---
title: "Null safety"
---
Null Safety는 [The Billion-Dollar Mistake](https://en.wikipedia.org/wiki/Null_pointer#History)라고도 알려진 널 참조의 위험을 크게 줄이도록 설계된 Kotlin 기능입니다.

Java를 포함한 많은 프로그래밍 언어에서 가장 흔한 문제 중 하나는 널 참조의 멤버에 액세스하면 널 참조 예외가 발생한다는 것입니다. Java에서 이는 `NullPointerException` 또는 줄여서 _NPE_와 같습니다.

Kotlin은 널 가능성을 타입 시스템의 일부로 명시적으로 지원합니다. 즉, 어떤 변수 또는 속성이 `null`을 허용하는지 명시적으로 선언할 수 있습니다. 또한 널이 아닌 변수를 선언하면 컴파일러는 이러한 변수가 `null` 값을 가질 수 없도록 하여 NPE를 방지합니다.

Kotlin의 Null Safety는 런타임이 아닌 컴파일 타임에 잠재적인 널 관련 문제를 잡아내어 더 안전한 코드를 보장합니다. 이 기능은 `null` 값을 명시적으로 표현하여 코드의 견고성, 가독성 및 유지 관리성을 향상시켜 코드를 더 쉽게 이해하고 관리할 수 있도록 합니다.

Kotlin에서 NPE가 발생할 수 있는 유일한 원인은 다음과 같습니다.

* [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)에 대한 명시적 호출
* [not-null assertion operator `!!`](#not-null-assertion-operator)의 사용
* 다음과 같은 초기화 중 데이터 불일치:
  * 생성자에서 사용할 수 있는 초기화되지 않은 `this`가 다른 곳에서 사용되는 경우([a "leaking `this`"](https://youtrack.jetbrains.com/issue/KTIJ-9751)).
  * 파생 클래스의 구현이 초기화되지 않은 상태를 사용하는 [슈퍼클래스 생성자가 open 멤버를 호출](inheritance#derived-class-initialization-order)하는 경우.
* Java 상호 운용:
  * [플랫폼 타입](java-interop#null-safety-and-platform-types)의 `null` 참조의 멤버에 액세스하려고 시도하는 경우.
  * 제네릭 타입의 널 가능성 문제. 예를 들어, Java 코드 조각이
    `null`을 Kotlin `MutableList<String>`에 추가하는 경우, 이를 적절하게 처리하려면 `MutableList<String?>`가 필요합니다.
  * 외부 Java 코드로 인해 발생하는 기타 문제.

:::tip
NPE 외에도 Null Safety와 관련된 또 다른 예외는 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)입니다. Kotlin은 초기화되지 않은 속성에 액세스하려고 할 때 이 예외를 발생시켜 널이 아닌 속성이 준비될 때까지 사용되지 않도록 합니다.
이것은 일반적으로 [`lateinit` 속성](properties#late-initialized-properties-and-variables)에서 발생합니다.

:::

## 널 가능 타입과 널 불가능 타입

Kotlin에서 타입 시스템은 `null`을 가질 수 있는 타입(널 가능 타입)과 가질 수 없는 타입(널 불가능 타입)을 구별합니다. 예를 들어, `String` 타입의 일반 변수는 `null`을 가질 수 없습니다.

```kotlin
fun main() {

    // 널이 아닌 문자열을 변수에 할당합니다.
    var a: String = "abc"
    // 널이 아닌 변수에 null을 다시 할당하려고 시도합니다.
    a = null
    print(a)
    // Null은 널이 아닌 String 타입의 값이 될 수 없습니다.

}
```

`a`에서 메서드를 안전하게 호출하거나 속성에 액세스할 수 있습니다. `a`는 널 불가능 변수이므로 NPE를 일으키지 않는 것이 보장됩니다.
컴파일러는 `a`가 항상 유효한 `String` 값을 갖도록 보장하므로 `null`일 때 해당 속성이나 메서드에 액세스할 위험이 없습니다.

```kotlin
fun main() {

    // 널이 아닌 문자열을 변수에 할당합니다.
    val a: String = "abc"
    // 널이 아닌 변수의 길이를 반환합니다.
    val l = a.length
    print(l)
    // 3

}
```

`null` 값을 허용하려면 변수 타입 바로 뒤에 `?` 기호를 사용하여 변수를 선언합니다. 예를 들어, `String?`을 작성하여 널 가능 문자열을 선언할 수 있습니다. 이 표현식은 `String`을 `null`을 수락할 수 있는 타입으로 만듭니다.

```kotlin
fun main() {

    // 널 가능 문자열을 변수에 할당합니다.
    var b: String? = "abc"
    // 널 가능 변수에 null을 성공적으로 다시 할당합니다.
    b = null
    print(b)
    // null

}
```

`b`에서 `length`에 직접 액세스하려고 하면 컴파일러에서 오류를 보고합니다. 이는 `b`가 널 가능 변수로 선언되어 `null` 값을 가질 수 있기 때문입니다. 널 가능 변수에서 속성에 직접 액세스하려고 하면 NPE가 발생합니다.

```kotlin
fun main() {

    // 널 가능 문자열을 변수에 할당합니다.
    var b: String? = "abc"
    // 널 가능 변수에 null을 다시 할당합니다.
    b = null
    // 널 가능 변수의 길이를 직접 반환하려고 시도합니다.
    val l = b.length
    print(l)
    // String? 타입의 널 가능 수신자에게는 안전한 (?.) 또는 널이 아님을 단언하는 (!!.) 호출만 허용됩니다.

}
```

위의 예에서 컴파일러는 속성에 액세스하거나 작업을 수행하기 전에 안전한 호출을 사용하여 널 가능성을 확인하도록 요구합니다. 널 가능 변수를 처리하는 방법에는 여러 가지가 있습니다.

* [`if` 조건문으로 `null` 확인](#check-for-null-with-the-if-conditional)
* [안전 호출 연산자 `?.`](#safe-call-operator)
* [Elvis 연산자 `?:`](#elvis-operator)
* [널 아님 단언 연산자 `!!`](#not-null-assertion-operator)
* [널 가능 수신자](#nullable-receiver)
* [`let` 함수](#let-function)
* [안전 캐스트 `as?`](#safe-casts)
* [널 가능 타입의 컬렉션](#collections-of-a-nullable-type)

`null` 처리 도구 및 기술에 대한 자세한 내용과 예제는 다음 섹션을 참조하십시오.

## if 조건문으로 null 확인

널 가능 타입을 사용할 때 NPE를 피하기 위해 널 가능성을 안전하게 처리해야 합니다. 이를 처리하는 한 가지 방법은 `if` 조건식을 사용하여 널 가능성을 명시적으로 확인하는 것입니다.

예를 들어, `b`가 `null`인지 확인한 다음 `b.length`에 액세스합니다.

```kotlin
fun main() {

    // 널 가능 변수에 null을 할당합니다.
    val b: String? = null
    // 먼저 널 가능성을 확인한 다음 길이에 액세스합니다.
    val l = if (b != null) b.length else -1
    print(l)
    // -1

}
```

위의 예에서 컴파일러는 [스마트 캐스트](typecasts#smart-casts)를 수행하여 타입을 널 가능 `String?`에서 널 불가능 `String`으로 변경합니다. 또한 수행한 검사에 대한 정보를 추적하고 `if` 조건문 내에서 `length`를 호출할 수 있도록 합니다.

더 복잡한 조건도 지원됩니다.

```kotlin
fun main() {

    // 널 가능 문자열을 변수에 할당합니다.
    val b: String? = "Kotlin"

    // 먼저 널 가능성을 확인한 다음 길이에 액세스합니다.
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
    // 조건이 충족되지 않으면 대안을 제공합니다.
    } else {
        print("Empty string")
        // String of length 6
    }

}
```

위의 예는 컴파일러가 검사와 사용 사이에 `b`가 변경되지 않는다는 것을 보장할 수 있는 경우에만 작동합니다.
[스마트 캐스트 필수 조건](typecasts#smart-cast-prerequisites)과 동일합니다.

## 안전 호출 연산자

안전 호출 연산자 `?.`를 사용하면 더 짧은 형식으로 널 가능성을 안전하게 처리할 수 있습니다. 객체가 `null`이면 NPE를 발생시키는 대신 `?.` 연산자는 단순히 `null`을 반환합니다.

```kotlin
fun main() {

    // 널 가능 문자열을 변수에 할당합니다.
    val a: String? = "Kotlin"
    // 널 가능 변수에 null을 할당합니다.
    val b: String? = null
    
    // 널 가능성을 확인하고 길이 또는 null을 반환합니다.
    println(a?.length)
    // 6
    println(b?.length)
    // null

}
```

`b?.length` 표현식은 널 가능성을 확인하고 `b`가 널이 아니면 `b.length`를 반환하고 그렇지 않으면 `null`을 반환합니다. 이 표현식의 타입은 `Int?`입니다.

Kotlin에서 [`var` 및 `val` 변수](basic-syntax#variables) 모두와 함께 `?.` 연산자를 사용할 수 있습니다.

* 널 가능 `var`는 `null`(예: `var nullableValue: String? = null`) 또는 널이 아닌 값(예: `var nullableValue: String? = "Kotlin"`)을 가질 수 있습니다. 널이 아닌 값이면 언제든지 `null`로 변경할 수 있습니다.
* 널 가능 `val`은 `null`(예: `val nullableValue: String? = null`) 또는 널이 아닌 값(예: `val nullableValue: String? = "Kotlin"`)을 가질 수 있습니다. 널이 아닌 값이면 이후에 `null`로 변경할 수 없습니다.

안전 호출은 체인에서 유용합니다. 예를 들어, Bob은 부서에 할당될 수도 있고 그렇지 않을 수도 있는 직원입니다. 해당 부서는 차례로 다른 직원을 부서장으로 둘 수 있습니다. Bob의 부서장의 이름(있는 경우)을 얻으려면 다음을 작성합니다.

```kotlin
bob?.department?.head?.name
```

이 체인은 해당 속성 중 하나가 `null`이면 `null`을 반환합니다. 다음은 동일한 안전 호출과 동일하지만 `if` 조건문을 사용한 것입니다.

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

할당의 왼쪽에 안전 호출을 배치할 수도 있습니다.

```kotlin
person?.department?.head = managersPool.getManager()
```

위의 예에서 안전 호출 체인의 수신자 중 하나가 `null`이면 할당이 건너뛰고 오른쪽의 표현식은 전혀 평가되지 않습니다. 예를 들어, `person` 또는 `person.department`가 `null`이면 함수가 호출되지 않습니다.

## Elvis 연산자

널 가능 타입을 사용할 때 `null`을 확인하고 대체 값을 제공할 수 있습니다. 예를 들어, `b`가 `null`이 아니면 `b.length`에 액세스합니다. 그렇지 않으면 대체 값을 반환합니다.

```kotlin
fun main() {

    // 널 가능 변수에 null을 할당합니다.
    val b: String? = null
    // 널 가능성을 확인합니다. null이 아니면 길이를 반환합니다. null이면 0을 반환합니다.
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0

}
```

전체 `if` 표현식을 작성하는 대신 Elvis 연산자 `?:`를 사용하여 더 간결하게 처리할 수 있습니다.

```kotlin
fun main() {

    // 널 가능 변수에 null을 할당합니다.
    val b: String? = null
    // 널 가능성을 확인합니다. null이 아니면 길이를 반환합니다. null이면 널이 아닌 값을 반환합니다.
    val l = b?.length ?: 0
    println(l)
    // 0

}
```

`?:`의 왼쪽 표현식이 `null`이 아니면 Elvis 연산자는 해당 표현식을 반환합니다. 그렇지 않으면 Elvis 연산자는 오른쪽 표현식을 반환합니다. 오른쪽 표현식은 왼쪽 표현식이 `null`인 경우에만 평가됩니다.

`throw` 및 `return`은 Kotlin의 표현식이므로 Elvis 연산자의 오른쪽에서도 사용할 수 있습니다. 이는 예를 들어 함수 인수를 확인할 때 편리할 수 있습니다.

```kotlin
fun foo(node: Node): String? {
    // getParent()를 확인합니다. null이 아니면 parent에 할당됩니다. null이면 null을 반환합니다.
    val parent = node.getParent() ?: return null
    // getName()을 확인합니다. null이 아니면 name에 할당됩니다. null이면 예외를 발생시킵니다.
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 널 아님 단언 연산자

널 아님 단언 연산자 `!!`는 모든 값을 널 불가능 타입으로 변환합니다.

값이 `null`이 아닌 변수에 `!!` 연산자를 적용하면 널 불가능 타입으로 안전하게 처리되고 코드가 정상적으로 실행됩니다. 그러나 값이 `null`이면 `!!` 연산자는 널 불가능으로 처리되도록 강제하여 NPE가 발생합니다.

`b`가 `null`이 아니고 `!!` 연산자가 널이 아닌 값(이 예에서는 `String`)을 반환하도록 하면 `length`에 올바르게 액세스합니다.

```kotlin
fun main() {

    // 널 가능 문자열을 변수에 할당합니다.
    val b: String? = "Kotlin"
    // b를 널이 아닌 것으로 처리하고 길이에 액세스합니다.
    val l = b!!.length
    println(l)
    // 6

}
```

`b`가 `null`이고 `!!` 연산자가 널이 아닌 값을 반환하도록 하면 NPE가 발생합니다.

```kotlin
fun main() {

    // 널 가능 변수에 null을 할당합니다.
    val b: String? = null
    // b를 널이 아닌 것으로 처리하고 길이에 액세스하려고 시도합니다.
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException

}
```

`!!` 연산자는 특히 값이 `null`이 아니고 NPE가 발생할 가능성이 없다고 확신하지만 특정 규칙 때문에 컴파일러가 이를 보장할 수 없는 경우에 유용합니다.
이러한 경우 `!!` 연산자를 사용하여 값이 `null`이 아니라고 컴파일러에 명시적으로 알릴 수 있습니다.

## 널 가능 수신자

[널 가능 수신자 타입](extensions#nullable-receiver)으로 확장 함수를 사용할 수 있으므로 이러한 함수를 `null`일 수 있는 변수에서 호출할 수 있습니다.

널 가능 수신자 타입에 확장 함수를 정의하면 함수를 호출하는 모든 위치에서 `null`을 확인하는 대신 함수 자체 내에서 `null` 값을 처리할 수 있습니다.

예를 들어, [`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 확장 함수는 널 가능 수신자에서 호출할 수 있습니다. `null` 값으로 호출하면 예외를 발생시키지 않고 문자열 `"null"`을 안전하게 반환합니다.

```kotlin

fun main() {
    // person 변수에 저장된 널 가능 Person 객체에 null을 할당합니다.
    val person: Person? = null

    // 널 가능 person 변수에 .toString을 적용하고 문자열을 출력합니다.
    println(person.toString())
    // null
}

// 간단한 Person 클래스를 정의합니다.
data class Person(val name: String)

```

위의 예에서 `person`이 `null`이더라도 `.toString()` 함수는 문자열 `"null"`을 안전하게 반환합니다. 이는 디버깅 및 로깅에 유용할 수 있습니다.

`.toString()` 함수가 널 가능 문자열(문자열 표현 또는 `null`)을 반환할 것으로 예상되는 경우 [안전 호출 연산자 `?.`](#safe-call-operator)를 사용합니다.
`?.` 연산자는 객체가 `null`이 아닌 경우에만 `.toString()`을 호출하고 그렇지 않으면 `null`을 반환합니다.

```kotlin

fun main() {
    // 널 가능 Person 객체를 변수에 할당합니다.
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // person이 null이면 "null"을 출력합니다. 그렇지 않으면 person.toString()의 결과를 출력합니다.
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Person 클래스를 정의합니다.
data class Person(val name: String)

```

`?.` 연산자를 사용하면 `null`일 수 있는 객체의 속성 또는 함수에 계속 액세스하면서 잠재적인 `null` 값을 안전하게 처리할 수 있습니다.

## Let 함수

`null` 값을 처리하고 널이 아닌 타입에서만 작업을 수행하려면 안전 호출 연산자 `?.`를 다음 함수와 함께 사용할 수 있습니다.
[`let` 함수](scope-functions#let).

이 조합은 표현식을 평가하고, 결과에서 `null`을 확인하고, `null`이 아닌 경우에만 코드를 실행하는 데 유용하며 수동 널 검사를 피할 수 있습니다.

```kotlin
fun main() {

    // 널 가능 문자열 목록을 선언합니다.
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // 목록의 각 항목을 반복합니다.
    for (item in listWithNulls) {
        // 항목이 null인지 확인하고 널이 아닌 값만 출력합니다.
        item?.let { println(it) }
        //Kotlin 
    }

}
```

## 안전 캐스트

[타입 캐스트](typecasts#unsafe-cast-operator)에 대한 일반적인 Kotlin 연산자는 `as` 연산자입니다. 그러나 객체가 대상 타입이 아니면 일반 캐스트로 인해 예외가 발생할 수 있습니다.

안전 캐스트에는 `as?` 연산자를 사용할 수 있습니다. 이 연산자는 값을 지정된 타입으로 캐스트하려고 시도하고 값이 해당 타입이 아니면 `null`을 반환합니다.

```kotlin
fun main() {

    // 모든 타입의 값을 가질 수 있는 Any 타입의 변수를 선언합니다.
    val a: Any = "Hello, Kotlin!"

    // 'as?' 연산자를 사용하여 Int로 안전하게 캐스트합니다.
    val aInt: Int? = a as? Int
    // 'as?' 연산자를 사용하여 String으로 안전하게 캐스트합니다.
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"

}
```

`a`가 `Int`가 아니므로 캐스트가 안전하게 실패하므로 위의 코드는 `null`을 출력합니다. 또한
`String?` 타입과 일치하므로 안전 캐스트가 성공하므로 `"Hello, Kotlin!"`을 출력합니다.

## 널 가능 타입의 컬렉션

널 가능 요소의 컬렉션이 있고 널이 아닌 요소만 유지하려는 경우
`filterNotNull()` 함수를 사용합니다.

```kotlin
fun main() {

    // 일부 null 및 널이 아닌 정수 값을 포함하는 목록을 선언합니다.
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // null 값을 필터링하여 널이 아닌 정수 목록을 생성합니다.
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]

}
```

## 다음 단계

* [Java 및 Kotlin에서 널 가능성을 처리](java-to-kotlin-nullability-guide)하는 방법을 알아봅니다.
* [확실히 널이 아닌](generics#definitely-non-nullable-types) 제네릭 타입에 대해 알아봅니다.