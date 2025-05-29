[//]: # (title: 중급: 확장 함수)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>확장 함수</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">리시버를 사용하는 람다 표현식</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스 및 인터페이스</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">open 클래스 및 특수 클래스</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안정성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

이 챕터에서는 코드를 더욱 간결하고 읽기 쉽게 만들어주는 Kotlin의 특별한 함수들을 살펴봅니다. 이 함수들이 효율적인 디자인 패턴을 사용하여 프로젝트를 다음 단계로 끌어올리는 데 어떻게 도움이 되는지 알아보세요.

## 확장 함수

소프트웨어 개발에서는 원본 소스 코드를 변경하지 않고 프로그램의 동작을 수정해야 하는 경우가 많습니다. 예를 들어, 프로젝트에서 서드파티 라이브러리의 클래스에 추가 기능을 더하고 싶을 수 있습니다.

확장 함수는 클래스에 추가 기능을 부여하여 확장할 수 있도록 해줍니다. 확장 함수는 클래스의 멤버 함수를 호출하는 것과 동일한 방식으로 호출합니다.

확장 함수의 문법을 소개하기 전에 **리시버 타입(receiver type)**과 **리시버 객체(receiver object)**라는 용어를 이해해야 합니다.

리시버 객체는 함수가 호출되는 대상입니다. 다시 말해, 리시버는 정보가 공유되는 위치 또는 대상입니다.

![An example of sender and receiver](receiver-highlight.png){width="500"}

이 예시에서 `main()` 함수는 [`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) 함수를 호출합니다. `.first()` 함수는 `readOnlyShapes` 변수에 대해 호출되므로, `readOnlyShapes` 변수가 리시버입니다.

리시버 객체는 컴파일러가 언제 함수를 사용할 수 있는지 이해하도록 **타입**을 가집니다.

이 예시는 표준 라이브러리의 `.first()` 함수를 사용하여 목록의 첫 번째 요소를 반환합니다. 자신만의 확장 함수를 생성하려면, 확장하려는 클래스 이름 뒤에 `.`과 함수 이름을 작성하세요. 이어서 인자와 반환 타입을 포함한 나머지 함수 선언을 작성하면 됩니다.

예시:

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello"는 리시버 객체입니다.
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

이 예시에서:

* `String`은 확장된 클래스이며, 리시버 타입으로도 알려져 있습니다.
* `bold`는 확장 함수의 이름입니다.
* `.bold()` 확장 함수의 반환 타입은 `String`입니다.
* `String`의 인스턴스인 `"hello"`는 리시버 객체입니다.
* 리시버 객체는 본문 내에서 [키워드](keyword-reference.md): `this`를 통해 접근할 수 있습니다.
* 문자열 템플릿($ 구문)은 `this`의 값에 접근하는 데 사용됩니다.
* `.bold()` 확장 함수는 문자열을 받아 텍스트를 굵게 표시하는 `<b>` HTML 요소로 감싸서 반환합니다.

## 확장 지향 설계

확장 함수는 어디에서나 정의할 수 있으며, 이를 통해 확장 지향 설계를 만들 수 있습니다. 이러한 설계는 핵심 기능을 유용하지만 필수적이지 않은 기능과 분리하여 코드를 더 쉽게 읽고 유지보수할 수 있게 합니다.

좋은 예시로는 Ktor 라이브러리의 [`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 클래스가 있습니다. 이 클래스는 네트워크 요청을 수행하는 데 도움을 줍니다. 핵심 기능은 HTTP 요청에 필요한 모든 정보를 받는 단일 함수 `request()`입니다.

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // Network code
    }
}
```
{validate="false"}

실제로 가장 많이 사용되는 HTTP 요청은 GET 또는 POST 요청입니다. 이러한 일반적인 사용 사례에 대해 라이브러리에서 더 짧은 이름을 제공하는 것이 합리적입니다. 하지만 이러한 요청은 새로운 네트워크 코드를 작성할 필요 없이, 특정 요청 호출만으로 충분합니다. 즉, 이들은 별도의 `.get()` 및 `.post()` 확장 함수로 정의하기에 완벽한 후보입니다.

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

이 `.get()` 및 `.post()` 함수는 올바른 HTTP 메서드를 사용하여 `request()` 함수를 호출하므로 직접 호출할 필요가 없습니다. 이 함수들은 코드를 간소화하고 이해하기 쉽게 만듭니다.

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        println("Requesting $method to $url with headers: $headers")
        return HttpResponse("Response from $url")
    }
}

fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    val client = HttpClient()

    // request()를 직접 사용하여 GET 요청 수행
    val getResponseWithMember = client.request("GET", "https://example.com", emptyMap())

    // get() 확장 함수를 사용하여 GET 요청 수행
    val getResponseWithExtension = client.get("https://example.com")
}
```
{validate="false"}

이러한 확장 지향적 접근 방식은 Kotlin의 [표준 라이브러리](https://kotlinlang.org/api/latest/jvm/stdlib/)와 다른 라이브러리에서 널리 사용됩니다. 예를 들어, `String` 클래스에는 문자열 작업을 돕기 위한 많은 [확장 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions)가 있습니다.

확장 함수에 대한 자세한 내용은 [확장(Extensions)](extensions.md)을 참조하세요.

## 연습

### 연습 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

정수를 받아 양수인지 확인하는 `isPositive`라는 확장 함수를 작성하세요.

|---|---|
```kotlin
fun Int.// 여기에 코드를 작성하세요.

fun main() {
    println(1.isPositive())
    // true
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-1"}

|---|---|
```kotlin
fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // true
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-extension-functions-solution-1"}

### 연습 2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

문자열을 받아 소문자 버전으로 반환하는 `toLowercaseString`이라는 확장 함수를 작성하세요.

<deflist collapsible="true">
    <def title="힌트">
        `String` 타입의 [` .lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 함수를 사용하세요.
    </def>
</deflist>

|---|---|
```kotlin
fun // 여기에 코드를 작성하세요.

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-2"}

|---|---|
```kotlin
fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 해답" id="kotlin-tour-extension-functions-solution-2"}

## 다음 단계

[중급: 스코프 함수](kotlin-tour-intermediate-scope-functions.md)