[//]: # (title: 중급: 프로퍼티)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">리시버를 가진 람다 표현식</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스와 인터페이스</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">열린(Open) 클래스 및 특수 클래스</a><br />
        <img src="icon-7.svg" width="20" alt="Seventh step" /> <strong>프로퍼티</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안정성</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

초급 투어에서 프로퍼티가 클래스 인스턴스의 특성을 선언하고 접근하는 데 어떻게 사용되는지 배웠습니다. 이 장에서는 Kotlin에서 프로퍼티가 작동하는 방식에 대해 더 깊이 파고들고, 코드에서 프로퍼티를 사용하는 다른 방법을 탐구합니다.

## 백킹 필드

Kotlin에서 프로퍼티는 기본 `get()` 및 `set()` 함수를 가지며, 이는 프로퍼티 접근자로 알려져 있고 값 검색 및 수정을 처리합니다. 이 기본 함수는 코드에서 명시적으로 보이지 않지만, 컴파일러는 프로퍼티 접근을 내부적으로 관리하기 위해 자동으로 이 함수들을 생성합니다. 이 접근자들은 실제 프로퍼티 값을 저장하기 위해 **백킹 필드**를 사용합니다.

백킹 필드는 다음 중 하나라도 참일 경우 존재합니다.

*   프로퍼티에 기본 `get()` 또는 `set()` 함수를 사용합니다.
*   `field` 키워드를 사용하여 코드에서 프로퍼티 값에 접근하려고 합니다.

> `get()` 및 `set()` 함수는 게터(getter)와 세터(setter)라고도 불립니다.
>
{style="tip"}

예를 들어, 이 코드는 사용자 지정 `get()` 또는 `set()` 함수가 없어 기본 구현을 사용하는 `category` 프로퍼티를 가집니다.

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

내부적으로 이것은 다음 의사 코드와 동일합니다.

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

이 예시에서:

*   `get()` 함수는 필드에서 프로퍼티 값(`""`)을 가져옵니다.
*   `set()` 함수는 `value`를 매개변수로 받아 필드에 할당하며, 여기서 `value`는 `""`입니다.

백킹 필드에 접근하는 것은 무한 루프를 발생시키지 않고 `get()` 또는 `set()` 함수에 추가 로직을 추가하려는 경우 유용합니다. 예를 들어, `name` 프로퍼티를 가진 `Person` 클래스가 있습니다.

```kotlin
class Person {
    var name: String = ""
}
```

`name` 프로퍼티의 첫 글자를 대문자로 만들고 싶어서, [`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 및 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) 확장 함수를 사용하는 사용자 지정 `set()` 함수를 생성합니다. 하지만 `set()` 함수에서 프로퍼티를 직접 참조하면 무한 루프가 발생하여 런타임에 `StackOverflowError`가 발생합니다.

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // This causes a runtime error
            name = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Exception in thread "main" java.lang.StackOverflowError
}
```
{validate ="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

이를 해결하려면 `field` 키워드로 백킹 필드를 참조하여 `set()` 함수에서 백킹 필드를 사용할 수 있습니다.

```kotlin
class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Kodee
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-backingfield"}

백킹 필드는 로깅을 추가하거나, 프로퍼티 값이 변경될 때 알림을 보내거나, 이전 및 새 프로퍼티 값을 비교하는 추가 로직을 사용할 때도 유용합니다.

더 자세한 내용은 [백킹 필드](properties.md#backing-fields)를 참조하세요.

## 확장 프로퍼티

확장 함수와 마찬가지로 확장 프로퍼티도 있습니다. 확장 프로퍼티를 사용하면 기존 클래스의 소스 코드를 수정하지 않고 새 프로퍼티를 추가할 수 있습니다. 그러나 Kotlin의 확장 프로퍼티에는 백킹 필드가 **없습니다**. 이는 `get()` 및 `set()` 함수를 직접 작성해야 함을 의미합니다. 또한 백킹 필드가 없으면 어떤 상태도 가질 수 없습니다.

확장 프로퍼티를 선언하려면 확장하려는 클래스 이름 뒤에 `.`과 프로퍼티 이름을 작성합니다. 일반 클래스 프로퍼티와 마찬가지로 프로퍼티에 대한 리시버(receiver) 타입을 선언해야 합니다. 예를 들면 다음과 같습니다.

```kotlin
val String.lastChar: Char
```
{validate="false"}

확장 프로퍼티는 상속을 사용하지 않고 계산된 값을 포함하는 프로퍼티를 원할 때 가장 유용합니다. 확장 프로퍼티는 매개변수가 하나뿐인 함수처럼 작동한다고 생각할 수 있습니다. 즉, 리시버(receiver) 객체입니다.

예를 들어, `firstName`과 `lastName` 두 개의 프로퍼티를 가진 `Person`이라는 데이터 클래스가 있다고 가정해 봅시다.

```kotlin
data class Person(val firstName: String, val lastName: String)
```

`Person` 데이터 클래스를 수정하거나 상속받지 않고 사람의 전체 이름에 접근할 수 있기를 원합니다. 사용자 지정 `get()` 함수를 사용하여 확장 프로퍼티를 생성함으로써 이를 수행할 수 있습니다.

```kotlin
data class Person(val firstName: String, val lastName: String)

// Extension property to get the full name
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // Use the extension property
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 확장 프로퍼티는 클래스의 기존 프로퍼티를 재정의할 수 없습니다.
>
{style="note"}

확장 함수와 마찬가지로 Kotlin 표준 라이브러리는 확장 프로퍼티를 광범위하게 사용합니다. 예를 들어, `CharSequence`의 [`lastIndex` 프로퍼티](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)를 참조하세요.

## 위임된 프로퍼티

[클래스와 인터페이스](kotlin-tour-intermediate-classes-interfaces.md#delegation) 장에서 위임에 대해 이미 배웠습니다. 프로퍼티에도 위임을 사용하여 다른 객체에 프로퍼티 접근자를 위임할 수 있습니다. 이는 간단한 백킹 필드가 처리할 수 없는, 예를 들어 데이터베이스 테이블, 브라우저 세션 또는 맵에 값을 저장하는 것과 같은 더 복잡한 프로퍼티 저장 요구 사항이 있을 때 유용합니다. 위임된 프로퍼티를 사용하면 프로퍼티를 가져오고 설정하는 로직이 위임하는 객체에만 포함되므로 상용구 코드를 줄일 수 있습니다.

구문은 클래스와 위임을 사용하는 것과 유사하지만 다른 수준에서 작동합니다. 프로퍼티를 선언한 다음 `by` 키워드와 위임하려는 객체를 선언합니다. 예를 들면 다음과 같습니다.

```kotlin
val displayName: String by Delegate
```

여기서 위임된 프로퍼티 `displayName`은 프로퍼티 접근자를 위해 `Delegate` 객체를 참조합니다.

위임하는 모든 객체는 Kotlin이 위임된 프로퍼티의 값을 가져오는 데 사용하는 `getValue()` 연산자 함수를 **반드시** 가져야 합니다. 프로퍼티가 가변(mutable)인 경우, Kotlin이 값을 설정할 수 있도록 `setValue()` 연산자 함수도 가져야 합니다.

기본적으로 `getValue()` 및 `setValue()` 함수는 다음 구성을 가집니다.

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

이 함수에서:

*   `operator` 키워드는 이 함수들을 연산자 함수로 표시하여 `get()` 및 `set()` 함수를 오버로드할 수 있도록 합니다.
*   `thisRef` 매개변수는 위임된 프로퍼티를 **포함하는** 객체를 참조합니다. 기본적으로 타입은 `Any?`로 설정되지만, 더 구체적인 타입을 선언해야 할 수도 있습니다.
*   `property` 매개변수는 값이 접근되거나 변경되는 프로퍼티를 참조합니다. 이 매개변수를 사용하여 프로퍼티의 이름이나 타입과 같은 정보에 접근할 수 있습니다. 기본적으로 타입은 `Any?`로 설정됩니다. 코드에서 이를 변경하는 것에 대해 걱정할 필요는 없습니다.

`getValue()` 함수는 기본적으로 `String` 타입의 반환 타입을 가지지만, 원하는 경우 이를 조정할 수 있습니다.

`setValue()` 함수는 `value`라는 추가 매개변수를 가지며, 이는 프로퍼티에 할당되는 새 값을 보유하는 데 사용됩니다.

그렇다면 실제로는 어떻게 보일까요? 사용자 지정된 프로퍼티인 사용자 표시 이름과 같이 연산 비용이 많이 들고 애플리케이션이 성능에 민감하기 때문에 한 번만 계산되는 프로퍼티를 원한다고 가정해 봅시다. 위임된 프로퍼티를 사용하여 표시 이름을 캐시하면 한 번만 계산되지만 성능 영향 없이 언제든지 접근할 수 있습니다.

먼저 위임할 객체를 생성해야 합니다. 이 경우 객체는 `CachedStringDelegate` 클래스의 인스턴스가 됩니다.

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue` 프로퍼티는 캐시된 값을 포함합니다. `CachedStringDelegate` 클래스 내에서 위임된 프로퍼티의 `get()` 함수에서 원하는 동작을 `getValue()` 연산자 함수 본문에 추가합니다.

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: Any?, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "Default Value"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}
```

`getValue()` 함수는 `cachedValue` 프로퍼티가 `null`인지 확인합니다. `null`이면 함수는 `"Default value"`를 할당하고 로깅 목적으로 문자열을 출력합니다. `cachedValue` 프로퍼티가 이미 계산되었다면 `null`이 아닙니다. 이 경우 로깅 목적으로 다른 문자열이 출력됩니다. 마지막으로 함수는 엘비스 연산자를 사용하여 캐시된 값을 반환하거나, 값이 `null`이면 `"Unknown"`을 반환합니다.

이제 캐시하려는 프로퍼티(`val displayName`)를 `CachedStringDelegate` 클래스의 인스턴스에 위임할 수 있습니다.

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: User, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "${thisRef.firstName} ${thisRef.lastName}"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}

class User(val firstName: String, val lastName: String) {
    val displayName: String by CachedStringDelegate()
}

fun main() {
    val user = User("John", "Doe")

    // First access computes and caches the value
    println(user.displayName)
    // Computed and cached: John Doe
    // John Doe

    // Subsequent accesses retrieve the value from cache
    println(user.displayName)
    // Accessed from cache: John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

이 예시에서:

*   헤더에 `firstName`과 `lastName` 두 개의 프로퍼티를, 클래스 본문에 `displayName` 프로퍼티를 가진 `User` 클래스를 생성합니다.
*   `displayName` 프로퍼티를 `CachedStringDelegate` 클래스의 인스턴스에 위임합니다.
*   `user`라는 `User` 클래스의 인스턴스를 생성합니다.
*   `user` 인스턴스에서 `displayName` 프로퍼티에 접근한 결과를 출력합니다.

`getValue()` 함수에서 `thisRef` 매개변수의 타입이 `Any?` 타입에서 객체 타입인 `User`로 좁혀졌다는 점에 유의하세요. 이는 컴파일러가 `User` 클래스의 `firstName` 및 `lastName` 프로퍼티에 접근할 수 있도록 하기 위함입니다.

### 표준 위임

Kotlin 표준 라이브러리는 처음부터 직접 만들 필요 없이 유용한 위임 기능을 제공합니다. 이 위임 기능 중 하나를 사용하면 표준 라이브러리가 자동으로 `getValue()` 및 `setValue()` 함수를 제공하므로 직접 정의할 필요가 없습니다.

#### 지연(Lazy) 프로퍼티

프로퍼티를 처음 접근할 때만 초기화하려면 지연 프로퍼티를 사용합니다. 표준 라이브러리는 위임을 위한 `Lazy` 인터페이스를 제공합니다.

`Lazy` 인터페이스의 인스턴스를 생성하려면 `lazy()` 함수를 사용하여 `get()` 함수가 처음 호출될 때 실행할 람다 표현식을 제공합니다. `get()` 함수에 대한 추가 호출은 첫 번째 호출에서 제공된 것과 동일한 결과를 반환합니다. 지연 프로퍼티는 람다 표현식을 전달하기 위해 [후행 람다](kotlin-tour-functions.md#trailing-lambdas) 구문을 사용합니다.

예를 들면 다음과 같습니다.

```kotlin
class Database {
    fun connect() {
        println("Connecting to the database...")
    }

    fun query(sql: String): List<String> {
        return listOf("Data1", "Data2", "Data3")
    }
}

val databaseConnection: Database by lazy {
    val db = Database()
    db.connect()
    db
}

fun fetchData() {
    val data = databaseConnection.query("SELECT * FROM data")
    println("Data: $data")
}

fun main() {
    // First time accessing databaseConnection
    fetchData()
    // Connecting to the database...
    // Data: [Data1, Data2, Data3]

    // Subsequent access uses the existing connection
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

이 예시에서:

*   `connect()` 및 `query()` 멤버 함수를 가진 `Database` 클래스가 있습니다.
*   `connect()` 함수는 문자열을 콘솔에 출력하고, `query()` 함수는 SQL 쿼리를 받아 리스트를 반환합니다.
*   지연 프로퍼티인 `databaseConnection` 프로퍼티가 있습니다.
*   `lazy()` 함수에 제공된 람다 표현식은 다음과 같습니다.
    *   `Database` 클래스의 인스턴스를 생성합니다.
    *   이 인스턴스(`db`)에서 `connect()` 멤버 함수를 호출합니다.
    *   인스턴스를 반환합니다.
*   `fetchData()` 함수는 다음을 수행합니다.
    *   `databaseConnection` 프로퍼티에서 `query()` 함수를 호출하여 SQL 쿼리를 생성합니다.
    *   SQL 쿼리를 `data` 변수에 할당합니다.
    *   `data` 변수를 콘솔에 출력합니다.
*   `main()` 함수는 `fetchData()` 함수를 호출합니다. 처음 호출될 때 지연 프로퍼티가 초기화됩니다. 두 번째 호출에서는 첫 번째 호출과 동일한 결과가 반환됩니다.

지연 프로퍼티는 초기화에 리소스가 많이 소모될 때뿐만 아니라 프로퍼티가 코드에서 사용되지 않을 수도 있을 때도 유용합니다. 또한 지연 프로퍼티는 기본적으로 스레드에 안전하며, 이는 동시 환경에서 작업할 때 특히 유용합니다.

더 자세한 내용은 [지연(Lazy) 프로퍼티](delegated-properties.md#lazy-properties)를 참조하세요.

#### 관찰 가능(Observable) 프로퍼티

프로퍼티 값의 변경 여부를 모니터링하려면 관찰 가능 프로퍼티를 사용합니다. 관찰 가능 프로퍼티는 프로퍼티 값의 변경을 감지하고 이 정보를 사용하여 반응을 트리거하려는 경우에 유용합니다. 표준 라이브러리는 위임을 위한 `Delegates` 객체를 제공합니다.

관찰 가능 프로퍼티를 생성하려면 먼저 `kotlin.properties.Delegates.observable`을 임포트해야 합니다. 그런 다음 `observable()` 함수를 사용하고 프로퍼티가 변경될 때마다 실행할 람다 표현식을 제공합니다. 지연 프로퍼티와 마찬가지로 관찰 가능 프로퍼티는 람다 표현식을 전달하기 위해 [후행 람다](kotlin-tour-functions.md#trailing-lambdas) 구문을 사용합니다.

예를 들면 다음과 같습니다.

```kotlin
import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        if (new > 25) {
            println("Warning: Temperature is too high! ($old°C -> $new°C)")
        } else {
            println("Temperature updated: $old°C -> $new°C")
        }
    }
}

fun main() {
    val thermostat = Thermostat()
    thermostat.temperature = 22.5
    // Temperature updated: 20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // Warning: Temperature is too high! (22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

이 예시에서:

*   관찰 가능 프로퍼티인 `temperature`를 포함하는 `Thermostat` 클래스가 있습니다.
*   `observable()` 함수는 `20.0`을 매개변수로 받아 프로퍼티를 초기화하는 데 사용합니다.
*   `observable()` 함수에 제공된 람다 표현식은 다음과 같습니다.
    *   세 가지 매개변수를 가집니다.
        *   `_`: 프로퍼티 자체를 참조합니다.
        *   `old`: 프로퍼티의 이전 값입니다.
        *   `new`: 프로퍼티의 새 값입니다.
    *   `new` 매개변수가 `25`보다 큰지 확인하고, 결과에 따라 문자열을 콘솔에 출력합니다.
*   `main()` 함수는 다음을 수행합니다.
    *   `thermostat`라는 `Thermostat` 클래스의 인스턴스를 생성합니다.
    *   인스턴스의 `temperature` 프로퍼티 값을 `22.5`로 업데이트하여 온도 업데이트를 포함한 출력문을 트리거합니다.
    *   인스턴스의 `temperature` 프로퍼티 값을 `27.0`으로 업데이트하여 경고를 포함한 출력문을 트리거합니다.

관찰 가능 프로퍼티는 로깅 및 디버깅 목적뿐만 아니라 UI 업데이트 또는 데이터 유효성 검증과 같은 추가 검사를 수행하는 사용 사례에도 유용합니다.

더 자세한 내용은 [관찰 가능(Observable) 프로퍼티](delegated-properties.md#observable-properties)를 참조하세요.

## 실습

### Exercise 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

당신은 서점의 재고 시스템을 관리합니다. 재고는 각 항목이 특정 책의 수량을 나타내는 목록에 저장됩니다. 예를 들어, `listOf(3, 0, 7, 12)`는 서점에 첫 번째 책 3권, 두 번째 책 0권, 세 번째 책 7권, 네 번째 책 12권이 있다는 것을 의미합니다.

재고가 없는 모든 책의 인덱스 목록을 반환하는 `findOutOfStockBooks()` 함수를 작성하세요.

<deflist collapsible="true">
    <def title="힌트 1">
        표준 라이브러리의 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> 확장 프로퍼티를 사용하세요.
    </def>
</deflist>

<deflist collapsible="true">
    <def title="힌트 2">
        수동으로 가변(mutable) 리스트를 생성하고 반환하는 대신, <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> 함수를 사용하여 리스트를 생성하고 관리할 수 있습니다. <code>buildList()</code> 함수는 이전 장에서 배운 리시버를 가진 람다(lambda with a receiver)를 사용합니다.
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // Write your code here
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    val outOfStockIndices = mutableListOf<Int>()
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            outOfStockIndices.add(index)
        }
    }
    return outOfStockIndices
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 1" id="kotlin-tour-properties-solution-1-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> = buildList {
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            add(index)
        }
    }
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 2" id="kotlin-tour-properties-solution-1-2"}

### Exercise 2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

킬로미터와 마일 두 가지 단위로 거리를 표시해야 하는 여행 앱이 있습니다. 킬로미터 거리를 마일로 변환하는 `Double` 타입에 대한 `asMiles`라는 확장 프로퍼티를 만드세요.

> 킬로미터를 마일로 변환하는 공식은 `miles = kilometers * 0.621371`입니다.
>
{style="note"}

<deflist collapsible="true">
    <def title="힌트">
        확장 프로퍼티는 사용자 지정 <code>get()</code> 함수가 필요하다는 점을 기억하세요.
    </def>
</deflist>

|---|---|

```kotlin
val // Write your code here

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-2"}

|---|---|
```kotlin
val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-properties-solution-2"}

### Exercise 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

클라우드 시스템의 상태를 확인할 수 있는 시스템 상태 검사기가 있습니다. 하지만 상태 검사를 수행하는 두 가지 함수는 성능 집약적입니다. 지연 프로퍼티를 사용하여 필요한 경우에만 비용이 많이 드는 함수가 실행되도록 검사를 초기화하세요.

|---|---|

```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // Write your code here

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
    // Performing application server health check...
    // Application server is online and healthy
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-3"}

|---|---|
```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
   // Performing application server health check...
   // Application server is online and healthy
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-properties-solution-3"}

### Exercise 4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

간단한 예산 추적 앱을 개발 중입니다. 이 앱은 사용자 잔여 예산의 변경 사항을 관찰하고 특정 임계값 미만으로 떨어질 때마다 사용자에게 알림을 보내야 합니다. 초기 예산 금액을 포함하는 `totalBudget` 프로퍼티로 초기화되는 `Budget` 클래스가 있습니다. 클래스 내에서 `remainingBudget`이라는 관찰 가능(observable) 프로퍼티를 만들고 다음을 출력하도록 하세요.

*   초기 예산의 20% 미만으로 값이 떨어질 때 경고 메시지.
*   예산이 이전 값보다 증가할 때 격려 메시지.

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // Write your code here
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // Good news: Your remaining budget increased to 300.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-4"}

|---|---|
```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
  var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
    if (newValue < totalBudget * 0.2) {
      println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
    } else if (newValue > oldValue) {
      println("Good news: Your remaining budget increased to $newValue.")
    }
  }
}

fun main() {
  val myBudget = Budget(totalBudget = 1000)
  myBudget.remainingBudget = 800
  myBudget.remainingBudget = 150
  // Warning: Your remaining budget (150) is below 20% of your total budget.
  myBudget.remainingBudget = 50
  // Warning: Your remaining budget (50) is below 20% of your total budget.
  myBudget.remainingBudget = 300
  // Good news: Your remaining budget increased to 300.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-properties-solution-4"}

## 다음 단계

[중급: 널 안정성](kotlin-tour-intermediate-null-safety.md)