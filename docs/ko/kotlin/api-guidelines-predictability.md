[//]: # (title: 예측 가능성)

견고하고 사용자 친화적인 Kotlin 라이브러리를 설계하려면 일반적인 사용 사례를 예측하고, 확장성을 허용하며, 올바른 사용법을 강제해야 합니다. 기본 설정, 오류 처리, 상태 관리의 모범 사례를 따르면 사용자는 원활한 경험을 할 수 있으며, 라이브러리의 무결성(integrity)과 품질을 유지할 수 있습니다.

## 기본적으로 올바른 작동을 제공합니다.

라이브러리는 각 사용 사례의 정상 경로(happy path)를 예측하고, 그에 맞는 기본 설정을 제공해야 합니다. 사용자가 라이브러리가 올바르게 작동하기 위해 기본값을 제공할 필요가 없어야 합니다.

예를 들어, [Ktor `HttpClient`](https://ktor.io/docs/client-create-new-application.html)를 사용할 때 가장 일반적인 사용 사례는 서버로 GET 요청을 전송하는 것입니다. 이는 아래 코드를 사용하여 달성할 수 있으며, 필수 정보만 지정하면 됩니다.

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.get("https://ktor.io/")
```

필수 HTTP 헤더나 응답의 가능한 상태 코드에 대한 사용자 지정 이벤트 핸들러 값을 제공할 필요는 없습니다.

사용 사례에 대한 명확한 "정상 경로"가 없거나, 매개변수에 기본값이 있어야 하지만 이견이 없는 옵션이 없다면, 이는 요구 사항 분석에 결함이 있음을 나타낼 가능성이 높습니다.

## 확장 기회를 허용합니다.

올바른 선택을 예측할 수 없을 때는 사용자가 선호하는 접근 방식을 지정할 수 있도록 허용합니다. 라이브러리는 또한 사용자가 자체 접근 방식을 제공하거나 서드파티 확장(third-party extension)을 사용하도록 해야 합니다.

예를 들어, [Ktor `HttpClient`](https://ktor.io/docs/client-serialization.html)의 경우, 클라이언트를 구성할 때 사용자는 콘텐츠 협상(Content Negotiation) 지원을 설치하고 선호하는 직렬화(serialization) 형식을 지정하도록 권장됩니다.

```kotlin
val client = HttpClient(CIO) {
    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }
}
```

사용자는 [클라이언트 플러그인 정의를 위한 별도의 API](https://ktor.io/docs/client-custom-plugins.html)를 사용하여 설치할 플러그인을 선택하거나 자체 플러그인을 만들 수 있습니다.

또한, 사용자는 라이브러리 내 타입에 대한 확장 함수(extension functions) 및 프로퍼티(properties)를 정의할 수 있습니다. 라이브러리 작성자는 [확장을 염두에 두고 설계함으로써](api-guidelines-readability.md#use-extension-functions-and-properties) 이를 더 쉽게 만들 수 있으며, 라이브러리의 타입이 명확한 핵심 개념을 갖도록 보장할 수 있습니다.

## 원치 않거나 유효하지 않은 확장을 방지합니다.

사용자는 라이브러리의 원래 디자인을 위반하거나 문제 도메인의 규칙 내에서 불가능한 방식으로 라이브러리를 확장할 수 없어야 합니다.

예를 들어, 데이터를 JSON으로 또는 JSON에서 마샬링(marshaling)할 때, 출력 형식에서는 `object`, `array`, `number`, `string`, `boolean`, `null`의 여섯 가지 타입만 지원됩니다.

`JsonElement`라는 이름의 `open class` 또는 `interface`를 만들면 사용자는 `JsonDate`와 같이 유효하지 않은 파생 타입(derived types)을 만들 수 있습니다. 대신 `JsonElement` 인터페이스를 봉인(sealed)하고 각 타입에 대한 구현을 제공할 수 있습니다.

```kotlin
sealed interface JsonElement

class JsonNumber(val value: Number) : JsonElement
class JsonObject(val values: Map<String, JsonElement>) : JsonElement
class JsonArray(val values: List<JsonElement>) : JsonElement
class JsonBoolean(val value: Boolean) : JsonElement
class JsonString(val value: String) : JsonElement
object JsonNull : JsonElement
```

봉인된 타입은 또한 컴파일러가 `else` 문을 요구하지 않고 `when` 표현식이 모든 경우를 처리하도록(exhaustive) 보장하여, 가독성(readability)과 일관성(consistency)을 향상시킵니다.

## 가변 상태(Mutable State) 노출을 피하세요.

여러 값을 관리할 때, API는 가능한 한 읽기 전용 컬렉션(read-only collections)을 허용하고/하거나 반환해야 합니다. 가변 컬렉션은 스레드 안전(thread-safe)하지 않으며 라이브러리에 복잡성과 예측 불가능성을 초래합니다.

예를 들어, 사용자가 API 진입점(entry point)에서 반환된 가변 컬렉션을 수정하면, 구현의 구조를 수정하는 것인지 복사본을 수정하는 것인지 불분명합니다. 마찬가지로, 사용자가 컬렉션을 라이브러리에 전달한 후 컬렉션 내의 값을 수정할 수 있다면, 이것이 구현에 영향을 미치는지 불분명합니다.

배열(arrays)은 가변 컬렉션이므로 API에서 사용을 피하세요. 배열을 사용해야 한다면, 사용자에게 데이터를 공유하기 전에 방어적 복사(defensive copies)를 만드세요. 이렇게 하면 데이터 구조가 수정되지 않은 상태로 유지됩니다.

방어적 복사를 만드는 이 정책은 `vararg` 인자(arguments)의 경우 컴파일러에 의해 자동으로 수행됩니다. `vararg` 인자가 예상되는 곳에 스프레드 연산자(spread operator)를 사용하여 기존 배열을 전달하면, 배열의 복사본이 자동으로 생성됩니다.

이 동작은 다음 예제에서 시연됩니다.

```kotlin
fun main() {
    fun demo(vararg input: String): Array<out String> = input

    val originalArray = arrayOf("one", "two", "three", "four")
    val newArray = demo(*originalArray)

    originalArray[1] = "ten"

    //prints "one, ten, three, four"
    println(originalArray.joinToString())

    //prints "one, two, three, four"
    println(newArray.joinToString())
}
```

## 입력과 상태를 검증합니다.

구현이 진행되기 전에 입력과 기존 상태를 검증하여 라이브러리가 올바르게 사용되는지 확인하세요. `require` 함수를 사용하여 입력을 검증하고 `check` 함수를 사용하여 기존 상태를 검증합니다.

`require` 함수는 조건이 `false`이면 `IllegalArgumentException`을 발생시켜 함수가 적절한 오류 메시지와 함께 즉시 실패하도록 합니다.

```kotlin
fun saveUser(username: String, password: String) {
    require(username.isNotBlank()) { "Username should not be blank" }
    require(username.all { it.isLetterOrDigit() }) {
        "Username can only contain letters and digits, was: $username"
    }
    require(password.isNotBlank()) { "Password should not be blank" }
    require(password.length >= 7) {
        "Password must contain at least 7 characters"
    }

    /* Implementation can proceed */
}

```

위에서 유효하지 않은 문자를 포함하는 사용자 이름에 대한 오류 메시지에 잘못된 사용자 이름이 포함된 것처럼, 오류 메시지에는 사용자가 실패의 원인을 파악하는 데 도움이 되는 관련 입력이 포함되어야 합니다. 이 관행의 예외는 오류 메시지에 값을 포함하는 것이 보안 취약점 공격(security exploit)의 일부로 악의적으로 사용될 수 있는 정보를 노출할 수 있는 경우이며, 이 때문에 비밀번호 길이에 대한 오류 메시지에는 비밀번호 입력이 포함되지 않습니다.

마찬가지로, `check` 함수는 조건이 `false`이면 `IllegalStateException`을 발생시킵니다. 아래 예제와 같이 이 함수를 사용하여 인스턴스의 상태를 검증합니다.

```kotlin
class ShoppingCart {
    private val contents = mutableListOf<Item>()

    fun addItem(item: Item) {
       contents.add(item)
    }

    fun purchase(): Amount {
       check(contents.isNotEmpty()) {
           "Cannot purchase an empty cart"
       }
       // Calculate and return amount
    }
}
```

## 다음 단계

가이드의 다음 파트에서는 디버깅 용이성(debuggability)에 대해 배웁니다.

[다음 파트로 진행](api-guidelines-debuggability.md)