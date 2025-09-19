[//]: # (title: 관용 표현)

Kotlin에서 자주 사용되는 다양하고 자주 사용되는 관용 표현 모음입니다. 좋아하는 관용 표현이 있다면 풀 리퀘스트를 보내 기여해주세요.

## DTO (POJO/POCO) 생성하기

```kotlin
data class Customer(val name: String, val email: String)
```

다음 기능을 갖춘 `Customer` 클래스를 제공합니다:

*   모든 프로퍼티에 대한 getter (및 `var`의 경우 setter)
*   `equals()`
*   `hashCode()`
*   `toString()`
*   `copy()`
*   `component1()`, `component2()`, ..., 모든 프로퍼티에 대한 (참고: [데이터 클래스](data-classes.md))

## 함수 파라미터의 기본값

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 리스트 필터링하기

```kotlin
val positives = list.filter { x -> x > 0 }
```

또는 더 짧게:

```kotlin
val positives = list.filter { it > 0 }
```

[Java와 Kotlin의 필터링](java-to-kotlin-collections-guide.md#filter-elements) 차이점을 알아보세요.

## 컬렉션에 요소 존재 여부 확인하기

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 문자열 보간

```kotlin
println("Name $name")
```

[Java와 Kotlin의 문자열 연결](java-to-kotlin-idioms-strings.md#concatenate-strings) 차이점을 알아보세요.

## 표준 입력 안전하게 읽기

```kotlin
// 문자열을 읽고, 입력이 정수로 변환될 수 없으면 null을 반환합니다. 예시: Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 정수로 변환될 수 있는 문자열을 읽고 정수를 반환합니다. 예시: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

더 자세한 내용은 [표준 입력 읽기](read-standard-input.md)를 참조하세요.

## 인스턴스 검사

```kotlin
when (x) {
    is Foo -> ...
    is Bar -> ...
    else   -> ...
}
```

## 읽기 전용 리스트

```kotlin
val list = listOf("a", "b", "c")
```
## 읽기 전용 맵

```kotlin
val map = mapOf("a" to 1, "b" to 2, "c" to 3)
```

## 맵 항목 접근하기

```kotlin
println(map["key"])
map["key"] = value
```

## 맵 또는 쌍 리스트 순회하기

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k`와 `v`는 `name`과 `age`처럼 원하는 어떤 이름이든 될 수 있습니다.

## 범위 순회하기

```kotlin
for (i in 1..100) { ... }  // 닫힌 범위: 100 포함
for (i in 1..<100) { ... } // 열린 범위: 100 미포함
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 지연 프로퍼티

```kotlin
val p: String by lazy { // 값은 첫 접근 시에만 계산됩니다.
    // 문자열 계산
}
```

## 확장 함수

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 싱글턴 생성하기

```kotlin
object Resource {
    val name = "Name"
}
```

## 타입 안전한 값에 인라인 값 클래스 사용하기

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

`EmployeeId`와 `CustomerId`를 실수로 혼용하면 컴파일 오류가 발생합니다.

> `@JvmInline` 어노테이션은 JVM 백엔드에서만 필요합니다.
>
{style="note"}

## 추상 클래스 인스턴스화하기

```kotlin
abstract class MyAbstractClass {
    abstract fun doSomething()
    abstract fun sleep()
}

fun main() {
    val myObject = object : MyAbstractClass() {
        override fun doSomething() {
            // ...
        }

        override fun sleep() { // ...
        }
    }
    myObject.doSomething()
}
```

## 널이 아닐 경우 단축 표현

```kotlin
val files = File("Test").listFiles()

println(files?.size) // 파일이 널이 아니면 size가 출력됩니다.
```

## 널이 아닐 경우-그 외 단축 표현

```kotlin
val files = File("Test").listFiles()

// 간단한 폴백 값의 경우:
println(files?.size ?: "empty") // 파일이 널이면, "empty"가 출력됩니다.

// 코드 블록에서 더 복잡한 폴백 값을 계산하려면 `run`을 사용하세요.
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## 널일 경우 표현식 실행

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 비어있을 수 있는 컬렉션의 첫 번째 항목 가져오기

```kotlin
val emails = ... // 비어있을 수 있음
val mainEmail = emails.firstOrNull() ?: ""
```

[Java와 Kotlin의 첫 번째 항목 가져오기](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection) 차이점을 알아보세요.

## 널이 아닐 경우 실행

```kotlin
val value = ...

value?.let {
    ... // 널이 아니면 이 블록을 실행합니다.
}
```

## 널이 아닐 경우 널러블 값 매핑

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// 값 또는 변환 결과가 널이면 defaultValue가 반환됩니다.
```

## when 문에서 반환

```kotlin
fun transform(color: String): Int {
    return when (color) {
        "Red" -> 0
        "Green" -> 1
        "Blue" -> 2
        else -> throw IllegalArgumentException("Invalid color param value")
    }
}
```

## try-catch 표현식

```kotlin
fun test() {
    val result = try {
        count()
    } catch (e: ArithmeticException) {
        throw IllegalStateException(e)
    }

    // 결과 사용
}
```

## if 표현식

```kotlin
val y = if (x == 1) {
    "one"
} else if (x == 2) {
    "two"
} else {
    "other"
}
```

## Unit을 반환하는 메서드의 빌더 스타일 사용법

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 단일 표현식 함수

```kotlin
fun theAnswer() = 42
```

다음과 같습니다:

```kotlin
fun theAnswer(): Int {
    return 42
}
```

이는 다른 관용 표현과 효과적으로 결합하여 더 짧은 코드를 만들 수 있습니다. 예를 들어, `when` 표현식과 함께 사용하면 다음과 같습니다:

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 객체 인스턴스에서 여러 메서드 호출하기 (with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100픽셀 정사각형 그리기
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 객체 프로퍼티 구성하기 (apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

이것은 객체 생성자에 없는 프로퍼티를 구성할 때 유용합니다.

## Java 7의 try-with-resources

```kotlin
val stream = Files.newInputStream(Paths.get("/some/file.txt"))
stream.buffered().reader().use { reader ->
    println(reader.readText())
}
```

## 제네릭 타입 정보가 필요한 제네릭 함수

```kotlin
//  public final class Gson {
//     ...
//     public <T> T fromJson(JsonElement json, Class<T> classOfT) throws JsonSyntaxException {
//     ...

inline fun <reified T: Any> Gson.fromJson(json: JsonElement): T = this.fromJson(json, T::class.java)
```

## 두 변수 교환하기

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 코드를 미완성으로 표시하기 (TODO)
 
Kotlin의 표준 라이브러리에는 항상 `NotImplementedError`를 던지는 `TODO()` 함수가 있습니다. 이 함수의 반환 타입은 `Nothing`이므로 예상되는 타입과 관계없이 사용될 수 있습니다. 이유 파라미터를 받는 오버로드도 있습니다:

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA의 Kotlin 플러그인은 `TODO()`의 의미를 이해하고 TODO 도구 창에 자동으로 코드 포인터를 추가합니다. 

## 다음 단계는?

*   관용적인 Kotlin 스타일을 사용하여 [Advent of Code 퍼즐](advent-of-code.md) 풀기.
*   [Java와 Kotlin에서 문자열로 일반적인 작업 수행 방법](java-to-kotlin-idioms-strings.md) 배우기.
*   [Java와 Kotlin에서 컬렉션으로 일반적인 작업 수행 방법](java-to-kotlin-collections-guide.md) 배우기.
*   [Java와 Kotlin에서 널러빌리티 처리 방법](java-to-kotlin-nullability-guide.md) 배우기.