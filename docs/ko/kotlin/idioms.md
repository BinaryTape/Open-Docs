[//]: # (title: 관용구)

Kotlin에서 자주 사용되는 다양한 관용구(Idioms) 모음입니다. 선호하는 관용구가 있다면 풀 리퀘스트(pull request)를 보내 기여해 주세요.

## DTO(POJO/POCO) 생성하기

```kotlin
data class Customer(val name: String, val email: String)
```

위의 코드는 다음과 같은 기능을 제공하는 `Customer` 클래스를 생성합니다:

* 모든 속성(property)에 대한 게터(getters), `var`인 경우 세터(setters) 포함
* `equals()`
* `hashCode()`
* `toString()`
* `copy()`
* 모든 속성에 대한 `component1()`, `component2()`, ... (참조: [데이터 클래스(Data classes)](data-classes.md))

## 함수 파라미터 기본값

```kotlin
fun foo(a: Int = 0, b: String = "") { ... }
```

## 리스트 필터링

```kotlin
val positives = list.filter { x -> x > 0 }
```

또는 다음과 같이 더 짧게 쓸 수 있습니다:

```kotlin
val positives = list.filter { it > 0 }
```

[Java와 Kotlin의 필터링 차이점](java-to-kotlin-collections-guide.md#filter-elements)을 알아보세요.

## 컬렉션 내 요소 존재 여부 확인

```kotlin
if ("john@example.com" in emailsList) { ... }

if ("jane@example.com" !in emailsList) { ... }
```

## 문자열 보간(String interpolation)

```kotlin
println("Name $name")
```

[Java와 Kotlin의 문자열 연결(concatenation) 차이점](java-to-kotlin-idioms-strings.md#concatenate-strings)을 알아보세요.

## 표준 입력 안전하게 읽기

```kotlin
// 문자열을 읽고, 입력값이 정수로 변환될 수 없는 경우 null을 반환합니다. 예: Hi there!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// null

// 정수로 변환 가능한 문자열을 읽고 정수를 반환합니다. 예: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 13
```

더 자세한 정보는 [표준 입력 읽기](read-standard-input.md)를 참조하세요.

## 인스턴스 확인

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

## 맵 항목 접근

```kotlin
println(map["key"])
map["key"] = value
```

## 맵 또는 페어(pair) 리스트 순회

```kotlin
for ((k, v) in map) {
    println("$k -> $v")
}
```

`k`와 `v`는 `name`, `age`와 같이 편리한 이름을 사용할 수 있습니다.

## 범위(range) 반복

```kotlin
for (i in 1..100) { ... }  // 닫힌 범위(closed-ended range): 100을 포함
for (i in 1..<100) { ... } // 열린 범위(open-ended range): 100을 포함하지 않음
for (x in 2..10 step 2) { ... }
for (x in 10 downTo 1) { ... }
(1..10).forEach { ... }
```

## 지연 속성(Lazy property)

```kotlin
val p: String by lazy { // 값은 처음 액세스할 때만 계산됩니다.
    // 문자열 계산
}
```

## 확장 함수(Extension functions)

```kotlin
fun String.spaceToCamelCase() { ... }

"Convert this to camelcase".spaceToCamelCase()
```

## 싱글톤(Singleton) 생성

```kotlin
object Resource {
    val name = "Name"
}
```

## 타입 안전한 값을 위해 인라인 값 클래스(inline value classes) 사용

```kotlin
@JvmInline
value class EmployeeId(private val id: String)

@JvmInline
value class CustomerId(private val id: String)
```

실수로 `EmployeeId`와 `CustomerId`를 섞어서 사용하면 컴파일 오류가 발생합니다.

> `@JvmInline` 어노테이션은 JVM 백엔드에만 필요합니다.
>
{style="note"}

## 추상 클래스 인스턴스화

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

## If-not-null 축약형

```kotlin
val files = File("Test").listFiles()

println(files?.size) // files가 null이 아니면 size가 출력됨
```

## If-not-null-else 축약형

```kotlin
val files = File("Test").listFiles()

// 간단한 대체 값의 경우:
println(files?.size ?: "empty") // files가 null이면 "empty"를 출력

// 코드 블록에서 더 복잡한 대체 값을 계산하려면 `run`을 사용하세요.
val filesSize = files?.size ?: run { 
    val someSize = getSomeSize()
    someSize * 2
}
println(filesSize)
```

## null인 경우 표현식 실행

```kotlin
val values = ...
val email = values["email"] ?: throw IllegalStateException("Email is missing!")
```

## 비어있을 수 있는 컬렉션의 첫 번째 항목 가져오기

```kotlin
val emails = ... // 비어있을 수 있음
val mainEmail = emails.firstOrNull() ?: ""
```

[Java와 Kotlin의 첫 번째 항목 가져오기 차이점](java-to-kotlin-collections-guide.md#get-the-first-and-the-last-items-of-a-possibly-empty-collection)을 알아보세요.

## null이 아닌 경우 실행

```kotlin
val value = ...

value?.let {
    ... // null이 아닌 경우 이 블록을 실행
}
```

## null이 아닌 경우 null 허용 값 매핑

```kotlin
val value = ...

val mapped = value?.let { transformValue(it) } ?: defaultValue 
// value 또는 변환 결과가 null인 경우 defaultValue가 반환됩니다.
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

    // result를 사용하여 작업
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

## Unit을 반환하는 메서드의 빌더 스타일 사용

```kotlin
fun arrayOfMinusOnes(size: Int): IntArray {
    return IntArray(size).apply { fill(-1) }
}
```

## 단일 표현식 함수(Single-expression functions)

```kotlin
fun theAnswer() = 42
```

이것은 아래 코드와 동일합니다.

```kotlin
fun theAnswer(): Int {
    return 42
}
```

이 방식은 다른 관용구와 효과적으로 결합되어 코드를 더 짧게 만들 수 있습니다. 예를 들어, `when` 표현식과 함께 사용하면 다음과 같습니다:

```kotlin
fun transform(color: String): Int = when (color) {
    "Red" -> 0
    "Green" -> 1
    "Blue" -> 2
    else -> throw IllegalArgumentException("Invalid color param value")
}
```

## 객체 인스턴스의 여러 메서드 호출(with)

```kotlin
class Turtle {
    fun penDown()
    fun penUp()
    fun turn(degrees: Double)
    fun forward(pixels: Double)
}

val myTurtle = Turtle()
with(myTurtle) { // 100 픽셀의 사각형 그리기
    penDown()
    for (i in 1..4) {
        forward(100.0)
        turn(90.0)
    }
    penUp()
}
```

## 객체의 속성 설정(apply)

```kotlin
val myRectangle = Rectangle().apply {
    length = 4
    breadth = 5
    color = 0xFAFAFA
}
```

이 방법은 객체 생성자에 없는 속성들을 설정할 때 유용합니다.

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

## 두 변수 바꾸기

```kotlin
var a = 1
var b = 2
a = b.also { b = a }
```

## 미완성 코드 표시(TODO)
 
Kotlin 표준 라이브러리에는 항상 `NotImplementedError`를 던지는 `TODO()` 함수가 있습니다.
이 함수의 반환 타입은 `Nothing`이므로 기대되는 타입에 관계없이 사용할 수 있습니다.
이유를 파라미터로 받는 오버로드된 함수도 있습니다:

```kotlin
fun calcTaxes(): BigDecimal = TODO("Waiting for feedback from accounting")
```

IntelliJ IDEA의 Kotlin 플러그인은 `TODO()`의 의미를 이해하고 TODO 도구 창에 코드 포인터를 자동으로 추가합니다.

## 다음 단계

* 관용적인 Kotlin 스타일을 사용하여 [Advent of Code 퍼즐](advent-of-code.md)을 풀어보세요.
* [Java와 Kotlin에서 문자열로 수행하는 일반적인 작업](java-to-kotlin-idioms-strings.md)을 알아보세요.
* [Java와 Kotlin에서 컬렉션으로 수행하는 일반적인 작업](java-to-kotlin-collections-guide.md)을 알아보세요.
* [Java와 Kotlin에서 null 허용 여부(nullability)를 처리하는 방법](java-to-kotlin-nullability-guide.md)을 알아보세요.