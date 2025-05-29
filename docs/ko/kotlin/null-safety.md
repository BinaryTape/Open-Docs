[//]: # (title: Null 안전성)

널 안전성(Null safety)은 널 참조(null references)의 위험을 크게 줄이기 위해 설계된 코틀린 기능입니다. 이는 흔히 [10억 달러짜리 실수(The Billion-Dollar Mistake)](https://en.wikipedia.org/wiki/Null_pointer#History)라고도 불립니다.

자바를 포함한 많은 프로그래밍 언어에서 가장 흔한 함정 중 하나는 널 참조의 멤버에 접근할 때 널 참조 예외가 발생하는 것입니다. 자바에서는 `NullPointerException` 또는 줄여서 _NPE_ 에 해당합니다.

코틀린은 타입 시스템의 일부로 널 허용성(nullability)을 명시적으로 지원합니다. 즉, 어떤 변수나 프로퍼티가 `null`을 허용하는지 명시적으로 선언할 수 있습니다. 또한, 널 불허(non-null) 변수를 선언하면 컴파일러가 이 변수들이 `null` 값을 가질 수 없도록 강제하여 NPE를 방지합니다.

코틀린의 널 안전성은 런타임이 아닌 컴파일 타임에 잠재적인 널 관련 문제를 감지하여 더 안전한 코드를 보장합니다. 이 기능은 `null` 값을 명시적으로 표현하여 코드의 견고성(robustness), 가독성(readability), 유지보수성(maintainability)을 향상시키고 코드를 이해하고 관리하기 쉽게 만듭니다.

코틀린에서 NPE가 발생할 수 있는 유일한 원인은 다음과 같습니다.

*   [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)에 대한 명시적 호출.
*   [널 아님 단언 연산자 `!!`](#not-null-assertion-operator)의 사용.
*   초기화 중 데이터 불일치, 예를 들어 다음과 같은 경우:
    *   생성자에서 사용할 수 있는 초기화되지 않은 `this`가 다른 곳에서 사용되는 경우(["`this` 누수(leaking `this`)"](https://youtrack.jetbrains.com/issue/KTIJ-9751)).
    *   파생 클래스 구현에서 초기화되지 않은 상태를 사용하는 [슈퍼클래스 생성자가 열린 멤버(open member)를 호출](inheritance.md#derived-class-initialization-order)하는 경우.
*   자바 상호 운용성(Java interoperation):
    *   [플랫폼 타입(platform type)](java-interop.md#null-safety-and-platform-types)의 `null` 참조 멤버에 접근하려는 시도.
    *   제네릭 타입(generic types)과 관련된 널 허용성 문제. 예를 들어, 자바 코드가 코틀린의 `MutableList<String>`에 `null`을 추가하는 경우, 이를 제대로 처리하려면 `MutableList<String?>`이 필요합니다.
    *   외부 자바 코드에 의해 발생하는 기타 문제.

> NPE 외에 널 안전성과 관련된 또 다른 예외는 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)입니다. 코틀린은 초기화되지 않은 프로퍼티에 접근하려고 할 때 이 예외를 발생시켜, 널 불허 프로퍼티가 준비되기 전에는 사용되지 않도록 합니다. 이는 일반적으로 [`lateinit` 프로퍼티](properties.md#late-initialized-properties-and-variables)에서 발생합니다.
>
{style="tip"}

## 널 허용 타입과 널 불허 타입

코틀린에서 타입 시스템은 `null`을 가질 수 있는 타입(널 허용 타입)과 가질 수 없는 타입(널 불허 타입)을 구별합니다. 예를 들어, `String` 타입의 일반 변수는 `null`을 가질 수 없습니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    var a: String = "abc"
    // Attempts to re-assign null to the non-nullable variable
    a = null
    print(a)
    // Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

`a`는 널 불허 변수이므로 NPE를 유발하지 않는다는 것이 보장되어 `a`의 메서드를 안전하게 호출하거나 프로퍼티에 접근할 수 있습니다. 컴파일러는 `a`가 항상 유효한 `String` 값을 가지도록 보장하므로 `null`일 때 프로퍼티나 메서드에 접근할 위험이 없습니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a non-null string to a variable
    val a: String = "abc"
    // Returns the length of a non-nullable variable
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

`null` 값을 허용하려면 변수 타입 바로 뒤에 `?` 기호를 붙여 변수를 선언합니다. 예를 들어, `String?`라고 작성하여 널 허용 문자열을 선언할 수 있습니다. 이 표현식은 `String`을 `null`을 허용하는 타입으로 만듭니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Successfully re-assigns null to the nullable variable
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b`에 `length`를 직접 접근하려고 하면 컴파일러가 오류를 보고합니다. 이는 `b`가 널 허용 변수로 선언되어 `null` 값을 가질 수 있기 때문입니다. 널 허용 타입에서 직접 프로퍼티에 접근하려고 하면 NPE가 발생합니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    var b: String? = "abc"
    // Re-assigns null to the nullable variable
    b = null
    // Tries to directly return the length of a nullable variable
    val l = b.length
    print(l)
    // Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String? 
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

위 예시에서 컴파일러는 프로퍼티에 접근하거나 연산을 수행하기 전에 널 허용성을 확인하기 위해 안전 호출(safe calls)을 사용하도록 요구합니다. 널 허용 타입을 다루는 몇 가지 방법이 있습니다.

*   [`if` 조건문으로 null 확인](#check-for-null-with-the-if-conditional)
*   [안전 호출 연산자 `?.`](#safe-call-operator)
*   [엘비스 연산자 `?:`](#elvis-operator)
*   [널 아님 단언 연산자 `!!`](#not-null-assertion-operator)
*   [널 허용 리시버](#nullable-receiver)
*   [`let` 함수](#let-function)
*   [안전한 캐스트 `as?`](#safe-casts)
*   [널 허용 타입의 컬렉션](#collections-of-a-nullable-type)

널 처리 도구 및 기술에 대한 자세한 내용과 예시는 다음 섹션을 참조하세요.

## `if` 조건문으로 null 확인

널 허용 타입으로 작업할 때 NPE를 피하려면 널 허용성을 안전하게 처리해야 합니다. 이를 처리하는 한 가지 방법은 `if` 조건문으로 널 허용성을 명시적으로 확인하는 것입니다.

예를 들어, `b`가 `null`인지 확인한 다음 `b.length`에 접근합니다.

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable
    val b: String? = null
    // Checks for nullability first and then accesses length
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

위 예시에서 컴파일러는 널 허용 `String?` 타입을 널 불허 `String` 타입으로 변경하기 위해 [스마트 캐스트(smart cast)](typecasts.md#smart-casts)를 수행합니다. 또한 수행한 확인 정보도 추적하여 `if` 조건문 내에서 `length` 호출을 허용합니다.

더 복잡한 조건도 지원됩니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"

    // Checks for nullability first and then accesses length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // String of length 6
    } else {
        // Provides alternative if the condition is not met
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

위 예시는 [스마트 캐스트 전제 조건(smart cast prerequisites)](typecasts.md#smart-cast-prerequisites)과 마찬가지로 컴파일러가 `b`가 확인과 사용 사이에 변경되지 않는다는 것을 보장할 수 있을 때만 작동합니다.

## 안전 호출 연산자

안전 호출 연산자 `?.`를 사용하면 널 허용성을 더 짧은 형태로 안전하게 처리할 수 있습니다. 객체가 `null`인 경우 NPE를 던지는 대신 `?.` 연산자는 단순히 `null`을 반환합니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val a: String? = "Kotlin"
    // Assigns null to a nullable variable
    val b: String? = null
    
    // Checks for nullability and returns length or null
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b?.length` 표현식은 널 허용성을 확인하고, `b`가 널 불허이면 `b.length`를 반환하고, 그렇지 않으면 `null`을 반환합니다. 이 표현식의 타입은 `Int?`입니다.

코틀린에서는 `?.` 연산자를 [`var` 변수와 `val` 변수](basic-syntax.md#variables) 모두에 사용할 수 있습니다.

*   널 허용 `var`는 `null` (예: `var nullableValue: String? = null`) 또는 널 불허 값 (예: `var nullableValue: String? = "Kotlin"`)을 가질 수 있습니다. 널 불허 값인 경우 언제든지 `null`로 변경할 수 있습니다.
*   널 허용 `val`은 `null` (예: `val nullableValue: String? = null`) 또는 널 불허 값 (예: `val nullableValue: String? = "Kotlin"`)을 가질 수 있습니다. 널 불허 값인 경우 이후에 `null`로 변경할 수 없습니다.

안전 호출은 체인에서 유용합니다. 예를 들어, 밥은 부서에 배정될 수도 있고 그렇지 않을 수도 있는 직원입니다. 해당 부서는 다시 다른 직원을 부서장으로 둘 수 있습니다. 밥의 부서장 이름을 얻으려면(있다면) 다음과 같이 작성합니다.

```kotlin
bob?.department?.head?.name
```

이 체인은 어떤 프로퍼티라도 `null`이면 `null`을 반환합니다.

할당의 왼쪽에도 안전 호출을 배치할 수 있습니다.

```kotlin
person?.department?.head = managersPool.getManager()
```

위 예시에서 안전 호출 체인 내의 리시버 중 하나가 `null`이면 할당이 건너뛰어지고 오른쪽 표현식은 전혀 평가되지 않습니다. 예를 들어, `person` 또는 `person.department` 중 하나가 `null`이면 함수는 호출되지 않습니다. 동일한 안전 호출을 `if` 조건문으로 표현한 것은 다음과 같습니다.

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## 엘비스 연산자

널 허용 타입으로 작업할 때 `null`을 확인하고 대체 값을 제공할 수 있습니다. 예를 들어, `b`가 `null`이 아니면 `b.length`에 접근합니다. 그렇지 않으면 대체 값을 반환합니다.

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

완전한 `if` 표현식을 작성하는 대신 엘비스 연산자 `?:`를 사용하여 더 간결하게 처리할 수 있습니다.

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Checks for nullability. If not null, returns length. If null, returns a non-null value
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

`?:`의 왼쪽에 있는 표현식이 `null`이 아니면 엘비스 연산자는 그 값을 반환합니다. 그렇지 않으면 엘비스 연산자는 오른쪽에 있는 표현식을 반환합니다. 오른쪽의 표현식은 왼쪽이 `null`인 경우에만 평가됩니다.

코틀린에서 `throw`와 `return`은 표현식이므로 엘비스 연산자의 오른쪽에 사용할 수도 있습니다. 이는 예를 들어 함수 인수를 확인할 때 유용할 수 있습니다.

```kotlin
fun foo(node: Node): String? {
    // Checks for getParent(). If not null, it's assigned to parent. If null, returns null
    val parent = node.getParent() ?: return null
    // Checks for getName(). If not null, it's assigned to name. If null, throws exception
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 널 아님 단언 연산자

널 아님 단언 연산자 `!!`는 어떤 값이든 널 불허 타입으로 변환합니다.

`!!` 연산자를 값이 `null`이 아닌 변수에 적용하면 널 불허 타입으로 안전하게 처리되며 코드가 정상적으로 실행됩니다. 그러나 값이 `null`인 경우 `!!` 연산자는 이를 강제로 널 불허로 취급하게 하여 NPE를 발생시킵니다.

`b`가 `null`이 아니고 `!!` 연산자가 널 불허 값을 반환하도록 만들면(이 예시에서는 `String`), `length`에 올바르게 접근합니다.

```kotlin
fun main() {
//sampleStart
    // Assigns a nullable string to a variable
    val b: String? = "Kotlin"
    // Treats b as non-null and accesses its length
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

`b`가 `null`이고 `!!` 연산자가 널 불허 값을 반환하도록 만들면 NPE가 발생합니다.

```kotlin
fun main() {
//sampleStart
    // Assigns null to a nullable variable  
    val b: String? = null
    // Treats b as non-null and tries to access its length
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

`!!` 연산자는 값이 `null`이 아니고 NPE가 발생할 가능성이 없다고 확신하지만, 특정 규칙으로 인해 컴파일러가 이를 보장할 수 없을 때 특히 유용합니다. 이러한 경우 `!!` 연산자를 사용하여 값은 `null`이 아니라고 컴파일러에게 명시적으로 알릴 수 있습니다.

## 널 허용 리시버

[널 허용 리시버 타입(nullable receiver type)](extensions.md#nullable-receiver)과 함께 확장 함수를 사용하여, `null`일 수 있는 변수에서도 이러한 함수를 호출할 수 있습니다.

널 허용 리시버 타입에 확장 함수를 정의하면 함수를 호출하는 모든 곳에서 `null`을 확인하는 대신, 함수 자체 내에서 `null` 값을 처리할 수 있습니다.

예를 들어, `.toString()` 확장 함수는 널 허용 리시버에서 호출할 수 있습니다. `null` 값에서 호출되면 예외를 던지지 않고 안전하게 문자열 `"null"`을 반환합니다.

```kotlin
//sampleStart
fun main() {
    // Assigns null to a nullable Person object stored in the person variable
    val person: Person? = null

    // Applies .toString to the nullable person variable and prints a string
    println(person.toString())
    // null
}

// Defines a simple Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

위 예시에서 `person`이 `null`임에도 불구하고 `.toString()` 함수는 안전하게 문자열 `"null"`을 반환합니다. 이는 디버깅 및 로깅에 유용할 수 있습니다.

`.toString()` 함수가 널 허용 문자열(문자열 표현 또는 `null` 둘 중 하나)을 반환할 것으로 예상하는 경우 [안전 호출 연산자 `?.`](#safe-call-operator)를 사용하세요. `?.` 연산자는 객체가 `null`이 아닌 경우에만 `.toString()`을 호출하고, 그렇지 않으면 `null`을 반환합니다.

```kotlin
//sampleStart
fun main() {
    // Assigns a nullable Person object to a variable
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // Prints "null" if person is null; otherwise prints the result of person.toString()
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Defines a Person class
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

`?.` 연산자를 사용하면 잠재적인 `null` 값을 안전하게 처리하면서 `null`일 수 있는 객체의 프로퍼티나 함수에 계속 접근할 수 있습니다.

## `let` 함수

`null` 값을 처리하고 널 불허 타입에서만 연산을 수행하려면 안전 호출 연산자 `?.`와 함께 [`let` 함수](scope-functions.md#let)를 사용할 수 있습니다.

이 조합은 표현식을 평가하고, 결과가 `null`인지 확인한 다음, `null`이 아닌 경우에만 코드를 실행하여 수동으로 `null` 확인을 피하는 데 유용합니다.

```kotlin
fun main() {
//sampleStart
    // Declares a list of nullable strings
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // Iterates over each item in the list
    for (item in listWithNulls) {
        // Checks if the item is null and only prints non-null values
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 안전한 캐스트

[타입 캐스트(type casts)](typecasts.md#unsafe-cast-operator)를 위한 일반적인 코틀린 연산자는 `as` 연산자입니다. 그러나 일반 캐스트는 객체가 대상 타입이 아닌 경우 예외를 발생시킬 수 있습니다.

안전한 캐스트를 위해서는 `as?` 연산자를 사용할 수 있습니다. 이 연산자는 값을 지정된 타입으로 캐스트하려고 시도하며, 값이 해당 타입이 아닌 경우 `null`을 반환합니다.

```kotlin
fun main() {
//sampleStart
    // Declares a variable of type Any, which can hold any type of value
    val a: Any = "Hello, Kotlin!"

    // Safe casts to Int using the 'as?' operator
    val aInt: Int? = a as? Int
    // Safe casts to String using the 'as?' operator
    val aString: String? = a as? String

    println(aInt)
    // null
    println(aString)
    // "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

위 코드는 `a`가 `Int`가 아니므로 캐스트가 안전하게 실패하여 `null`을 출력합니다. 또한 `String?` 타입과 일치하므로 안전한 캐스트가 성공하여 `"Hello, Kotlin!"`을 출력합니다.

## 널 허용 타입의 컬렉션

널 허용 요소의 컬렉션이 있고 널이 아닌 요소만 유지하려면 `filterNotNull()` 함수를 사용하세요.

```kotlin
fun main() {
//sampleStart
    // Declares a list containing some null and non-null integer values
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // Filters out null values, resulting in a list of non-null integers
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 다음 단계는?

*   [자바와 코틀린에서 널 허용성을 처리하는 방법](java-to-kotlin-nullability-guide.md)을 알아보세요.
*   [확실히 널 불허 타입(definitely non-nullable types)](generics.md#definitely-non-nullable-types)인 제네릭 타입에 대해 알아보세요.