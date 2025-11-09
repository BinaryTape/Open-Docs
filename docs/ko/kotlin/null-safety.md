[//]: # (title: 널 안정성)

널 안정성(Null safety)은 [백만 달러짜리 실수(The Billion-Dollar Mistake)](https://en.wikipedia.org/wiki/Null_pointer#History)라고도 알려진 널 참조(null reference)의 위험을 크게 줄이도록 설계된 Kotlin 기능입니다.

Java를 포함한 많은 프로그래밍 언어에서 가장 흔한 문제점 중 하나는 널 참조의 멤버에 접근할 때 널 참조 예외가 발생한다는 것입니다. Java에서는 이것이 `NullPointerException`(줄여서 _NPE_)과 동일합니다.

Kotlin은 타입 시스템의 일부로 널 허용성(nullability)을 명시적으로 지원합니다. 이는 어떤 변수나 프로퍼티가 `null`을 허용할 수 있는지 명시적으로 선언할 수 있다는 의미입니다. 또한, 널이 아닌(non-null) 변수를 선언하면 컴파일러가 이러한 변수가 `null` 값을 가질 수 없도록 강제하여 NPE를 방지합니다.

Kotlin의 널 안정성은 런타임이 아닌 컴파일 타임에 잠재적인 널 관련 문제를 포착하여 더 안전한 코드를 보장합니다. 이 기능은 `null` 값을 명시적으로 표현하여 코드의 견고성, 가독성, 유지보수성을 향상시키고, 코드를 이해하고 관리하기 쉽게 만듭니다.

Kotlin에서 NPE가 발생할 수 있는 유일한 원인은 다음과 같습니다:

*   [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)에 대한 명시적 호출.
*   [널 아님 단언 연산자 `!!`](#not-null-assertion-operator)의 사용.
*   초기화 중 데이터 불일치. 예를 들어, 다음과 같은 경우:
    *   생성자에서 사용 가능한 초기화되지 않은 `this`가 다른 곳에서 사용될 때 ([`this` 누출(leaking `this`)](https://youtrack.jetbrains.com/issue/KTIJ-9751)).
    *   [상위 클래스 생성자가 open 멤버를 호출](inheritance.md#derived-class-initialization-order)하며, 파생 클래스에서의 해당 구현이 초기화되지 않은 상태를 사용하는 경우.
*   Java 상호 운용성(interoperation):
    *   [플랫폼 타입(platform type)](java-interop.md#null-safety-and-platform-types)의 `null` 참조 멤버에 접근하려는 시도.
    *   제네릭 타입(generic types)과 관련된 널 허용성 문제. 예를 들어, Kotlin `MutableList<String>`에 `null`을 추가하는 Java 코드 조각이 있는 경우, 이를 올바르게 처리하려면 `MutableList<String?>`가 필요합니다.
    *   외부 Java 코드에 의해 발생하는 기타 문제.

> NPE 외에도 널 안정성과 관련된 또 다른 예외는 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/)입니다. Kotlin은 초기화되지 않은 프로퍼티에 접근하려고 할 때 이 예외를 발생시키며, 널이 아닌 프로퍼티가 준비되기 전에는 사용되지 않도록 보장합니다. 이는 일반적으로 [`lateinit` 프로퍼티](properties.md#late-initialized-properties-and-variables)에서 발생합니다.
>
{style="tip"}

## 널 허용 타입과 널이 아닌 타입

Kotlin에서 타입 시스템은 `null`을 가질 수 있는 타입(널 허용 타입)과 가질 수 없는 타입(널이 아닌 타입)을 구분합니다. 예를 들어, 일반 `String` 타입 변수는 `null`을 가질 수 없습니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널이 아닌 문자열 할당
    var a: String = "abc"
    // 널이 아닌 변수에 null을 다시 할당 시도
    a = null
    print(a)
    // 널은 널이 아닌 String 타입의 값이 될 수 없습니다.
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

`a`는 널이 아닌 변수이므로 NPE를 일으키지 않을 것이 보장됩니다. 따라서 `a`에 대해 메서드를 안전하게 호출하거나 프로퍼티에 접근할 수 있습니다. 컴파일러는 `a`가 항상 유효한 `String` 값을 가지도록 보장하므로, `null`일 때 해당 프로퍼티나 메서드에 접근할 위험이 없습니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널이 아닌 문자열 할당
    val a: String = "abc"
    // 널이 아닌 변수의 길이 반환
    val l = a.length
    print(l)
    // 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

`null` 값을 허용하려면 변수 타입 바로 뒤에 `?` 기호를 붙여 변수를 선언합니다. 예를 들어, `String?`라고 작성하여 널 허용 문자열을 선언할 수 있습니다. 이 표현식은 `String`을 `null`을 허용하는 타입으로 만듭니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널 허용 문자열 할당
    var b: String? = "abc"
    // 널 허용 변수에 null을 성공적으로 다시 할당
    b = null
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b`에 대해 `length`에 직접 접근하려고 하면 컴파일러가 오류를 보고합니다. 이는 `b`가 널 허용 변수로 선언되었고 `null` 값을 가질 수 있기 때문입니다. 널 허용 타입에 대해 직접 프로퍼티에 접근하려고 시도하면 NPE로 이어집니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널 허용 문자열 할당
    var b: String? = "abc"
    // 널 허용 변수에 null 다시 할당
    b = null
    // 널 허용 변수의 길이를 직접 반환 시도
    val l = b.length
    print(l)
    // String? 타입의 널 허용 리시버에서는 안전 호출 (?.) 또는 널 아님 단언 (!!.)만 허용됩니다.
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

위 예제에서 컴파일러는 프로퍼티에 접근하거나 연산을 수행하기 전에 널 허용성을 확인하기 위해 안전 호출을 사용하도록 요구합니다. 널 허용 타입을 처리하는 여러 방법은 다음과 같습니다:

*   [`if` 조건문을 사용하여 `null` 확인](#check-for-null-with-the-if-conditional)
*   [안전 호출 연산자 `?.`](#safe-call-operator)
*   [엘비스 연산자 `?:`](#elvis-operator)
*   [널 아님 단언 연산자 `!!`](#not-null-assertion-operator)
*   [널 허용 리시버](#nullable-receiver)
*   [`let` 함수](#let-function)
*   [안전한 캐스트 `as?`](#safe-casts)
*   [널 허용 타입 컬렉션](#collections-of-a-nullable-type)

`null` 처리 도구 및 기법에 대한 자세한 내용과 예시는 다음 섹션을 참조하세요.

## `if` 조건문을 사용하여 `null` 확인

널 허용 타입으로 작업할 때 NPE를 피하려면 널 허용성을 안전하게 처리해야 합니다. 이를 처리하는 한 가지 방법은 `if` 조건식을 사용하여 널 허용성을 명시적으로 확인하는 것입니다.

예를 들어, `b`가 `null`인지 확인한 다음 `b.length`에 접근합니다:

```kotlin
fun main() {
//sampleStart
    // 널 허용 변수에 null 할당
    val b: String? = null
    // 먼저 널 허용성 확인 후 길이 접근
    val l = if (b != null) b.length else -1
    print(l)
    // -1
//sampleEnd
}
```
{kotlin-runnable="true"}

위 예제에서 컴파일러는 널 허용 `String?` 타입에서 널이 아닌 `String` 타입으로 변경하기 위해 [스마트 캐스트(smart cast)](typecasts.md#smart-casts)를 수행합니다. 또한 컴파일러는 수행한 확인에 대한 정보를 추적하고 `if` 조건문 내부에서 `length` 호출을 허용합니다.

더 복잡한 조건도 지원됩니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널 허용 문자열 할당
    val b: String? = "Kotlin"

    // 먼저 널 허용성 확인 후 길이 접근
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // String of length 6
    } else {
        // 조건이 충족되지 않으면 대안 제공
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

위 예제는 [스마트 캐스트 전제 조건](typecasts.md#smart-cast-prerequisites)과 동일하게 컴파일러가 확인과 사용 사이에 `b`가 변경되지 않음을 보장할 수 있을 때만 작동합니다.

## 안전 호출 연산자

안전 호출 연산자 `?.`를 사용하면 널 허용성을 더 짧은 형태로 안전하게 처리할 수 있습니다. NPE를 던지는 대신, 객체가 `null`이면 `?.` 연산자는 단순히 `null`을 반환합니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널 허용 문자열 할당
    val a: String? = "Kotlin"
    // 널 허용 변수에 null 할당
    val b: String? = null
    
    // 널 허용성을 확인하고 길이 또는 null을 반환
    println(a?.length)
    // 6
    println(b?.length)
    // null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b?.length` 표현식은 널 허용성을 확인하고 `b`가 널이 아니면 `b.length`를 반환하고, 그렇지 않으면 `null`을 반환합니다. 이 표현식의 타입은 `Int?`입니다.

Kotlin에서 [`var` 및 `val` 변수](basic-syntax.md#variables) 모두에 `?.` 연산자를 사용할 수 있습니다:

*   널 허용 `var`는 `null`(예: `var nullableValue: String? = null`) 또는 널이 아닌 값(예: `var nullableValue: String? = "Kotlin"`)을 가질 수 있습니다. 널이 아닌 값이라면 언제든지 `null`로 변경할 수 있습니다.
*   널 허용 `val`은 `null`(예: `val nullableValue: String? = null`) 또는 널이 아닌 값(예: `val nullableValue: String? = "Kotlin"`)을 가질 수 있습니다. 널이 아닌 값이라면 나중에 `null`로 변경할 수 없습니다.

안전 호출은 체인에서 유용합니다. 예를 들어, Bob은 부서에 할당될 수도 있고 안 될 수도 있는 직원입니다. 해당 부서는 차례로 다른 직원을 부서장으로 둘 수 있습니다. Bob의 부서장 이름을 얻으려면 (있다면) 다음과 같이 작성합니다:

```kotlin
bob?.department?.head?.name
```

이 체인은 프로퍼티 중 하나라도 `null`이면 `null`을 반환합니다.

할당의 왼쪽에 안전 호출을 배치할 수도 있습니다:

```kotlin
person?.department?.head = managersPool.getManager()
```

위 예제에서 안전 호출 체인의 리시버 중 하나가 `null`이면 할당은 건너뛰어지고 오른쪽의 표현식은 전혀 평가되지 않습니다. 예를 들어, `person` 또는 `person.department` 중 하나가 `null`이면 함수가 호출되지 않습니다. 다음은 동일한 안전 호출의 `if` 조건문 버전입니다:

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## 엘비스 연산자 `?:`

널 허용 타입으로 작업할 때 `null`을 확인하고 대안 값을 제공할 수 있습니다. 예를 들어, `b`가 `null`이 아니면 `b.length`에 접근합니다. 그렇지 않으면 대안 값을 반환합니다:

```kotlin
fun main() {
//sampleStart
    // 널 허용 변수에 null 할당  
    val b: String? = null
    // 널 허용성 확인. null이 아니면 길이 반환. null이면 0 반환
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

완전한 `if` 표현식을 작성하는 대신, 엘비스 연산자 `?:`를 사용하여 더 간결한 방식으로 처리할 수 있습니다:

```kotlin
fun main() {
//sampleStart
    // 널 허용 변수에 null 할당  
    val b: String? = null
    // 널 허용성 확인. null이 아니면 길이 반환. null이면 널이 아닌 값 반환
    val l = b?.length ?: 0
    println(l)
    // 0
//sampleEnd
}
```
{kotlin-runnable="true"}

`?:` 왼쪽에 있는 표현식이 `null`이 아니면 엘비스 연산자는 그 표현식을 반환합니다. 그렇지 않으면 엘비스 연산자는 오른쪽에 있는 표현식을 반환합니다. 오른쪽 표현식은 왼쪽이 `null`인 경우에만 평가됩니다.

Kotlin에서 `throw`와 `return`은 표현식이기 때문에 엘비스 연산자의 오른쪽에 사용할 수도 있습니다. 이는 예를 들어, 함수 인수를 확인할 때 유용할 수 있습니다:

```kotlin
fun foo(node: Node): String? {
    // getParent() 확인. null이 아니면 parent에 할당. null이면 null 반환
    val parent = node.getParent() ?: return null
    // getName() 확인. null이 아니면 name에 할당. null이면 예외 발생
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 널 아님 단언 연산자 `!!`

널 아님 단언 연산자 `!!`는 모든 값을 널이 아닌 타입으로 변환합니다.

값이 `null`이 아닌 변수에 `!!` 연산자를 적용하면, 그 값은 널이 아닌 타입으로 안전하게 처리되며 코드가 정상적으로 실행됩니다. 하지만 값이 `null`인 경우, `!!` 연산자는 그 값을 널이 아닌 것으로 강제 처리하여 NPE를 발생시킵니다.

`b`가 `null`이 아니고 `!!` 연산자가 그 널이 아닌 값(이 예제에서는 `String`)을 반환하도록 만들면, `length`에 올바르게 접근합니다:

```kotlin
fun main() {
//sampleStart
    // 변수에 널 허용 문자열 할당
    val b: String? = "Kotlin"
    // b를 널이 아닌 것으로 처리하고 길이에 접근
    val l = b!!.length
    println(l)
    // 6
//sampleEnd
}
```
{kotlin-runnable="true"}

`b`가 `null`이고 `!!` 연산자가 그 널이 아닌 값을 반환하도록 만들면, NPE가 발생합니다:

```kotlin
fun main() {
//sampleStart
    // 널 허용 변수에 null 할당  
    val b: String? = null
    // b를 널이 아닌 것으로 처리하고 길이에 접근 시도
    val l = b!!.length
    println(l) 
    // Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

`!!` 연산자는 값이 `null`이 아니고 NPE가 발생할 가능성이 없다고 확신하지만, 컴파일러가 특정 규칙으로 인해 이를 보장할 수 없을 때 특히 유용합니다. 그러한 경우, `!!` 연산자를 사용하여 컴파일러에게 값이 `null`이 아니라고 명시적으로 알려줄 수 있습니다.

## 널 허용 리시버

널 허용 [리시버 타입](extensions.md#nullable-receivers)이 있는 확장 함수를 사용할 수 있으며, 이를 통해 `null`일 수 있는 변수에서 이러한 함수를 호출할 수 있습니다.

널 허용 리시버 타입에 확장 함수를 정의함으로써, 함수를 호출하는 모든 곳에서 `null`을 확인하는 대신 함수 내에서 `null` 값을 처리할 수 있습니다.

예를 들어, [`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 확장 함수는 널 허용 리시버에서 호출될 수 있습니다. `null` 값에서 호출될 때, 예외를 던지지 않고 안전하게 문자열 `"null"`을 반환합니다:

```kotlin
//sampleStart
fun main() {
    // person 변수에 저장된 널 허용 Person 객체에 null 할당
    val person: Person? = null

    // 널 허용 person 변수에 .toString을 적용하고 문자열 출력
    println(person.toString())
    // null
}

// 간단한 Person 클래스 정의
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

위 예제에서 `person`이 `null`임에도 불구하고 `.toString()` 함수는 안전하게 문자열 `"null"`을 반환합니다. 이는 디버깅 및 로깅에 유용할 수 있습니다.

`.toString()` 함수가 널 허용 문자열(문자열 표현 또는 `null` 중 하나)을 반환할 것으로 예상한다면, [안전 호출 연산자 `?.`](#safe-call-operator)를 사용하세요. `?.` 연산자는 객체가 `null`이 아닌 경우에만 `.toString()`을 호출하고, 그렇지 않으면 `null`을 반환합니다:

```kotlin
//sampleStart
fun main() {
    // 널 허용 Person 객체를 변수에 할당
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // person이 null이면 "null"을 출력; 그렇지 않으면 person.toString() 결과 출력
    println(person1?.toString())
    // null
    println(person2?.toString())
    // Person(name=Alice)
}

// Person 클래스 정의
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

`?.` 연산자를 사용하면 `null`일 수 있는 객체의 프로퍼티나 함수에 여전히 접근하면서 잠재적인 `null` 값을 안전하게 처리할 수 있습니다.

## `let` 함수

`null` 값을 처리하고 널이 아닌 타입에 대해서만 연산을 수행하려면 안전 호출 연산자 `?.`를 [`let` 함수](scope-functions.md#let)와 함께 사용할 수 있습니다.

이 조합은 표현식을 평가하고, 결과를 `null`에 대해 확인하고, `null`이 아닌 경우에만 코드를 실행하며, 수동 널 검사를 피할 수 있어 유용합니다:

```kotlin
fun main() {
//sampleStart
    // 널 허용 문자열 리스트 선언
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // 리스트의 각 항목 순회
    for (item in listWithNulls) {
        // 항목이 null인지 확인하고 널이 아닌 값만 출력
        item?.let { println(it) }
        //Kotlin 
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 안전한 캐스트

Kotlin의 [타입 캐스트](typecasts.md#unsafe-cast-operator)를 위한 일반 연산자는 `as` 연산자입니다. 그러나 일반 캐스트는 객체가 대상 타입이 아닌 경우 예외를 발생시킬 수 있습니다.

안전한 캐스트를 위해 `as?` 연산자를 사용할 수 있습니다. 이는 값을 지정된 타입으로 캐스트하려고 시도하며, 값이 해당 타입이 아니면 `null`을 반환합니다:

```kotlin
fun main() {
//sampleStart
    // 모든 타입의 값을 담을 수 있는 Any 타입의 변수 선언
    val a: Any = "Hello, Kotlin!"

    // 'as?' 연산자를 사용하여 Int로 안전하게 캐스트
    val aInt: Int? = a as? Int
    // 'as?' 연산자를 사용하여 String으로 안전하게 캐스트
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

## 널 허용 타입 컬렉션

널 허용 요소의 컬렉션이 있고 널이 아닌 요소만 유지하고 싶다면 `filterNotNull()` 함수를 사용하세요:

```kotlin
fun main() {
//sampleStart
    // null 및 널이 아닌 정수 값을 포함하는 리스트 선언
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // null 값을 필터링하여 널이 아닌 정수 리스트 생성
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 다음 단계는 무엇인가요?

*   [Java 및 Kotlin에서 널 허용성을 처리하는 방법](java-to-kotlin-nullability-guide.md)을 배우세요.
*   [확실히 널이 아닌 제네릭 타입](generics.md#definitely-non-nullable-types)에 대해 배우세요.