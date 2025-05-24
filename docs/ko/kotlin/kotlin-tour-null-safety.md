---
title: "Null safety"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions</a><br />
        <img src="/img/icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes</a><br />
        <img src="/img/icon-7.svg" width="20" alt="Final step" /> <strong>Null safety</strong><br />
</p>

:::

Kotlin에서는 `null` 값을 가질 수 있습니다. Kotlin은 무언가가 없거나 아직 설정되지 않았을 때 `null` 값을 사용합니다.
[Collections](kotlin-tour-collections#kotlin-tour-map-no-key) 챕터에서 맵에 존재하지 않는 키로 키-값 쌍에 접근하려고 했을 때 Kotlin이 `null` 값을 반환하는 예제를 이미 보셨을 것입니다. 이와 같은 방식으로 `null` 값을 사용하는 것이 유용하지만, 코드가 이를 처리할 준비가 되어 있지 않으면 문제가 발생할 수 있습니다.

프로그램에서 `null` 값으로 인해 발생하는 문제를 방지하기 위해 Kotlin에는 null safety가 있습니다. Null safety는 런타임이 아닌 컴파일 타임에 `null` 값과 관련된 잠재적 문제를 감지합니다.

Null safety는 다음과 같은 기능을 결합한 것입니다.

* 프로그램에서 `null` 값을 허용하는 경우 명시적으로 선언합니다.
* `null` 값을 확인합니다.
* `null` 값을 포함할 수 있는 속성 또는 함수에 대한 안전한 호출을 사용합니다.
* `null` 값이 감지되면 수행할 작업을 선언합니다.

## Nullable 타입

Kotlin은 선언된 타입이 `null` 값을 가질 수 있도록 하는 nullable 타입을 지원합니다. 기본적으로 타입은 `null` 값을 허용하지 **않습니다**. Nullable 타입은 타입 선언 뒤에 `?`를 명시적으로 추가하여 선언됩니다.

예를 들어:

```kotlin
fun main() {
    // neverNull은 String 타입입니다.
    var neverNull: String = "This can't be null"

    // 컴파일러 오류를 발생시킵니다.
    neverNull = null

    // nullable은 nullable String 타입입니다.
    var nullable: String? = "You can keep a null here"

    // 이건 괜찮습니다.
    nullable = null

    // 기본적으로 null 값은 허용되지 않습니다.
    var inferredNonNull = "The compiler assumes non-nullable"

    // 컴파일러 오류를 발생시킵니다.
    inferredNonNull = null

    // notNull은 null 값을 허용하지 않습니다.
    fun strLength(notNull: String): Int {                 
        return notNull.length
    }

    println(strLength(neverNull)) // 18
    println(strLength(nullable))  // 컴파일러 오류를 발생시킵니다.
}
```

:::tip
`length`는 문자열 내의 문자 수를 포함하는 [String](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/) 클래스의 속성입니다.

:::

## Null 값 확인

조건식 내에서 `null` 값의 존재 여부를 확인할 수 있습니다. 다음 예제에서 `describeString()` 함수는 `maybeString`이 `null`이 **아니고** `length`가 0보다 큰지 확인하는 `if` 문을 가지고 있습니다.

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

## 안전 호출 사용

`null` 값을 포함할 수 있는 객체의 속성에 안전하게 접근하려면 안전 호출 연산자 `?.`를 사용하십시오. 안전 호출
연산자는 객체 또는 접근한 속성 중 하나가 `null`이면 `null`을 반환합니다. 이는 코드에서 `null` 값의 존재로 인해 오류가 발생하는 것을 방지하려는 경우에 유용합니다.

다음 예제에서 `lengthString()` 함수는 안전 호출을 사용하여 문자열의 길이 또는 `null`을 반환합니다.

```kotlin
fun lengthString(maybeString: String?): Int? = maybeString?.length

fun main() { 
    val nullString: String? = null
    println(lengthString(nullString))
    // null
}
```

:::tip
안전 호출은 연결될 수 있으므로 객체의 속성에 `null` 값이 포함되어 있으면 오류가 발생하지 않고 `null`이 반환됩니다. 예를 들어:

```kotlin
  person.company?.address?.country
```

:::

안전 호출 연산자는 확장 함수 또는 멤버 함수를 안전하게 호출하는 데에도 사용할 수 있습니다. 이 경우 함수를 호출하기 전에 null 검사가 수행됩니다. 검사에서 `null` 값을 감지하면 호출이 건너뛰고 `null`이 반환됩니다.

다음 예제에서 `nullString`은 `null`이므로 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 호출이
건너뛰고 `null`이 반환됩니다.

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.uppercase())
    // null
}
```

## Elvis 연산자 사용

**Elvis 연산자** `?:`를 사용하여 `null` 값이 감지되면 반환할 기본값을 제공할 수 있습니다.

Elvis 연산자의 왼쪽에 `null` 값에 대해 검사해야 하는 내용을 작성합니다.
Elvis 연산자의 오른쪽에 `null` 값이 감지되면 반환해야 하는 내용을 작성합니다.

다음 예제에서 `nullString`은 `null`이므로 `length` 속성에 접근하기 위한 안전 호출은 `null` 값을 반환합니다.
결과적으로 Elvis 연산자는 `0`을 반환합니다.

```kotlin
fun main() {
    val nullString: String? = null
    println(nullString?.length ?: 0)
    // 0
}
```

Kotlin의 null safety에 대한 자세한 내용은 [Null safety](null-safety)를 참조하십시오.

## 연습

### 연습 문제

회사 직원 데이터베이스에 접근할 수 있는 `employeeById` 함수가 있습니다. 안타깝게도 이
함수는 `Employee?` 타입의 값을 반환하므로 결과는 `null`이 될 수 있습니다. 여러분의 목표는 `id`가 제공되었을 때 직원의 급여를 반환하거나, 직원이 데이터베이스에 없는 경우 `0`을 반환하는 함수를 작성하는 것입니다.

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = // 여기에 코드를 작성하세요.

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

|---|---|
```kotlin
data class Employee (val name: String, var salary: Int)

fun employeeById(id: Int) = when(id) {
    1 `->` Employee("Mary", 20)
    2 `->` null
    3 `->` Employee("John", 21)
    4 `->` Employee("Ann", 23)
    else `->` null
}

fun salaryById(id: Int) = employeeById(id)?.salary ?: 0

fun main() {
    println((1..5).sumOf { id `->` salaryById(id) })
}
```

## 다음은 무엇일까요?

축하합니다! Kotlin 투어를 완료했으므로 인기 있는 Kotlin 애플리케이션에 대한 자습서를 확인하십시오.

* [백엔드 애플리케이션 만들기](jvm-create-project-with-spring-boot)
* [Android 및 iOS용 크로스 플랫폼 애플리케이션 만들기](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)