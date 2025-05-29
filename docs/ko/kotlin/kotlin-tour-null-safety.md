[//]: # (title: 널 안전성)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">기본 타입</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">컬렉션</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">제어 흐름</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">함수</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">클래스</a><br />
        <img src="icon-7.svg" width="20" alt="Final step" /> <strong>널 안전성</strong><br /></p>
</tldr>

Kotlin에서는 `null` 값을 가질 수 있습니다. Kotlin은 무언가가 없거나 아직 설정되지 않았을 때 `null` 값을 사용합니다.
이미 [컬렉션](kotlin-tour-collections.md#kotlin-tour-map-no-key) 챕터에서 맵에 존재하지 않는 키로 키-값 쌍에 접근하려고 했을 때 Kotlin이 `null` 값을 반환하는 예시를 보셨을 겁니다. `null` 값을 이런 식으로 사용하는 것이 유용하긴 하지만, 코드가 `null` 값을 처리하도록 준비되어 있지 않으면 문제가 발생할 수 있습니다.

프로그램에서 `null` 값으로 인한 문제를 방지하기 위해 Kotlin은 널 안전성(null safety) 기능을 제공합니다. 널 안전성은 `null` 값과 관련된 잠재적인 문제를 런타임이 아닌 컴파일 시점에 감지합니다.

널 안전성은 다음을 허용하는 기능들의 조합입니다.

*   프로그램에서 `null` 값을 허용하는 시점을 명시적으로 선언합니다.
*   `null` 값을 확인합니다.
*   `null` 값을 포함할 수 있는 프로퍼티나 함수에 안전 호출을 사용합니다.
*   `null` 값이 감지될 경우 수행할 작업을 선언합니다.

## 널 허용 타입

Kotlin은 선언된 타입이 `null` 값을 가질 수 있는 널 허용 타입(nullable types)을 지원합니다. 기본적으로 타입은 `null` 값을 허용하지 **않습니다**. 널 허용 타입은 타입 선언 뒤에 `?`를 명시적으로 추가하여 선언합니다.

예시:

```kotlin
fun main() {
    // neverNull은 String 타입입니다.
    var neverNull: String = "This can't be null"

    // 컴파일러 오류 발생
    neverNull = null

    // nullable은 널 허용 String 타입입니다.
    var nullable: String? = "You can keep a null here"

    // 이 코드는 괜찮습니다.
    nullable = null

    // 기본적으로 null 값은 허용되지 않습니다.
    var inferredNonNull = "The compiler assumes non-nullable"

    // 컴파일러 오류 발생
    inferredNonNull = null

    // notNull은 null 값을 허용하지 않습니다.
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // 컴파일러 오류 발생
}
```
{kotlin-runnable="true" validate="false" kotlin-min-compiler-version="1.3" id="kotlin-tour-nullable-type"}

> `length`는 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 클래스의 프로퍼티로, 문자열 내의 문자 수를 포함합니다.
>
{style="tip"}

## `null` 값 확인

조건식 내에서 `null` 값의 존재를 확인할 수 있습니다. 다음 예시에서 `describeString()` 함수는 `maybeString`이 `null`이 **아니고** 길이가 0보다 큰지 확인하는 `if` 문을 가지고 있습니다.

```kotlin
fun describeString(maybeString: String?): String {
    if (maybeString != null && maybeString.length > 0) {
        return "String of length ${maybeString.length}"
    } else {
        return "Empty or null string"
    }
}

fun main() {
    val nullString: String? = null
    println(describeString(nullString))
    // Empty or null string
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-check-nulls"}

## 안전 호출 사용

`null` 값을 포함할 수 있는 객체의 프로퍼티에 안전하게 접근하려면 안전 호출 연산자 `?.`를 사용합니다. 안전 호출 연산자는 객체나 접근된 프로퍼티 중 하나라도 `null`이면 `null`을 반환합니다. 이는 코드에서 `null` 값으로 인해 오류가 발생하는 것을 피하고 싶을 때 유용합니다.

다음 예시에서 `lengthString()` 함수는 안전 호출을 사용하여 문자열의 길이 또는 `null`을 반환합니다.

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-property"}

> 안전 호출은 연결될 수 있으므로, 객체의 어떤 프로퍼티라도 `null` 값을 포함하면 오류가 발생하지 않고 `null`이 반환됩니다. 예시:
> 
> ```kotlin
>   person.company?.address?.country
> ```
>
{style="tip"}

안전 호출 연산자는 확장 함수나 멤버 함수를 안전하게 호출하는 데도 사용될 수 있습니다. 이 경우, 함수가 호출되기 전에 `null` 검사가 수행됩니다. 검사에서 `null` 값이 감지되면 호출이 건너뛰어지고 `null`이 반환됩니다.

다음 예시에서 `nullString`은 `null`이므로 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 호출이 건너뛰어지고 `null`이 반환됩니다.

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-safe-call-function"}

## 엘비스 연산자 사용

**엘비스 연산자** `?:`를 사용하여 `null` 값이 감지될 경우 반환할 기본값을 제공할 수 있습니다.

엘비스 연산자의 좌측에는 `null` 값 여부를 확인할 대상을 작성합니다.
엘비스 연산자의 우측에는 `null` 값이 감지될 경우 반환할 값을 작성합니다.

다음 예시에서 `nullString`은 `null`이므로, `length` 프로퍼티에 접근하는 안전 호출은 `null` 값을 반환합니다.
결과적으로 엘비스 연산자는 `0`을 반환합니다.

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-elvis-operator"}

Kotlin의 널 안전성에 대한 더 자세한 정보는 [널 안전성](null-safety.md)을 참조하세요.

## 실습

### 연습 문제 {initial-collapse-state="collapsed" collapsible="true"}

회사의 직원 데이터베이스에 접근할 수 있는 `employeeById` 함수가 있습니다. 아쉽게도 이 함수는 `Employee?` 타입의 값을 반환하므로 결과가 `null`일 수 있습니다. 여러분의 목표는 직원의 `id`가 제공될 때 해당 직원의 급여를 반환하거나, 데이터베이스에 직원이 없는 경우 `0`을 반환하는 함수를 작성하는 것입니다.

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = // Write your code here

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise"}

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 -> Employee("Mary", 20)
    2 -> null
    3 -> Employee("John", 21)
    4 -> Employee("Ann", 23)
    else -> null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id -> salaryById(id) })
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-null-safety-solution"}

## 다음 단계는?

축하합니다! 이제 초급 투어를 마쳤으니, 중급 투어를 통해 Kotlin에 대한 이해를 한 단계 더 높여 보세요.

<a href="kotlin-tour-intermediate-extension-functions.md"><img src="start-intermediate-tour.svg" width="700" alt="Start the intermediate Kotlin tour" style="block"/></a>