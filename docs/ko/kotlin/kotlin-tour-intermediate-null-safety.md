[//]: # (title: 중급: Null 안전성)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">수신 객체 지정 람다 (Lambda expressions with receiver)</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스 및 인터페이스</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">open 및 특별한 클래스</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8.svg" width="20" alt="Eighth step" /> <strong>Null 안전성</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">라이브러리 및 API</a></p>
</tldr>

초급 투어에서는 코드에서 `null` 값을 처리하는 방법을 배웠습니다. 이 장에서는 null 안전성 기능의 일반적인 사용 사례와 이를 최대한 활용하는 방법을 다룹니다.

## 스마트 캐스트 및 안전한 캐스트

코틀린은 때때로 명시적 선언 없이도 타입을 추론할 수 있습니다. 코틀린에게 변수나 객체를 특정 타입에 속하는 것처럼 다루도록 지시하는 과정을 **캐스팅(casting)**이라고 합니다. 타입이 자동으로 캐스팅될 때, 예를 들어 추론될 때, 이를 **스마트 캐스팅(smart casting)**이라고 합니다.

### `is` 및 `!is` 연산자

캐스팅이 어떻게 작동하는지 알아보기 전에, 객체가 특정 타입을 가지고 있는지 확인하는 방법을 살펴보겠습니다. 이를 위해 `when` 또는 `if` 조건식과 함께 `is` 및 `!is` 연산자를 사용할 수 있습니다:

* `is`는 객체가 해당 타입을 가지고 있는지 확인하고 불리언 값을 반환합니다.
* `!is`는 객체가 해당 타입을 **가지고 있지 않은지** 확인하고 불리언 값을 반환합니다.

예를 들어:

```kotlin
fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("It's an Integer with value $obj")
        !is Double -> println("It's NOT a Double")
        else -> println("Unknown type")
    }
}

fun main() {
    val myInt = 42
    val myDouble = 3.14
    val myList = listOf(1, 2, 3)
  
    // 타입은 Int입니다.
    printObjectType(myInt)
    // 값 42를 가진 Integer입니다.

    // 타입은 List이므로 Double이 아닙니다.
    printObjectType(myList)
    // Double이 아닙니다.

    // 타입은 Double이므로 else 브랜치가 트리거됩니다.
    printObjectType(myDouble)
    // 알 수 없는 타입입니다.
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> [open 및 특별한 클래스](kotlin-tour-intermediate-open-special-classes.md#sealed-classes) 장에서 `is` 및 `!is` 연산자와 함께 `when` 조건식을 사용하는 예시를 이미 살펴보았습니다.
> 
{style="tip"}

### `as` 및 `as?` 연산자

객체를 다른 타입으로 명시적으로 _캐스트_하려면 `as` 연산자를 사용하세요. 여기에는 nullable 타입에서 non-nullable 타입으로 캐스팅하는 것도 포함됩니다. 캐스팅이 불가능할 경우, 프로그램은 **런타임에** 충돌합니다. 이것이 바로 이를 **안전하지 않은(unsafe)** 캐스트 연산자라고 부르는 이유입니다.

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // 런타임에 오류를 발생시킵니다.
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

객체를 non-nullable 타입으로 명시적으로 캐스팅하되, 실패 시 오류를 발생시키는 대신 `null`을 반환하려면 `as?` 연산자를 사용하세요. `as?` 연산자는 실패 시 오류를 발생시키지 않으므로 **안전한(safe)** 연산자라고 불립니다.

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // null 값을 반환합니다.
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

`as?` 연산자를 엘비스 연산자 `?:`와 결합하여 여러 줄의 코드를 한 줄로 줄일 수 있습니다. 예를 들어, 다음 `calculateTotalStringLength()` 함수는 혼합된 리스트에 제공된 모든 문자열의 총 길이를 계산합니다.

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // String이 아닌 항목의 경우 0을 더합니다.
        }
    }

    return totalLength
}
```

이 예시는:

* `totalLength` 변수를 카운터로 사용합니다.
* `for` 루프를 사용하여 리스트의 모든 항목을 반복합니다.
* `if`와 `is` 연산자를 사용하여 현재 항목이 문자열인지 확인합니다.
  * 문자열인 경우, 해당 문자열의 길이가 카운터에 추가됩니다.
  * 문자열이 아닌 경우, 카운터는 증가하지 않습니다.
* `totalLength` 변수의 최종 값을 반환합니다.

이 코드는 다음과 같이 줄일 수 있습니다.

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

이 예시는 [`.sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) 확장 함수를 사용하며 다음과 같은 람다 표현식을 제공합니다.

* 리스트의 각 항목에 대해 `as?`를 사용하여 `String`으로 안전한 캐스트를 수행합니다.
* 안전한 호출 `?.`을 사용하여 호출이 `null` 값을 반환하지 않는 경우 `length` 프로퍼티에 접근합니다.
* 엘비스 연산자 `?:`를 사용하여 안전한 호출이 `null` 값을 반환하는 경우 `0`을 반환합니다.

## Null 값과 컬렉션

코틀린에서 컬렉션을 다룰 때 `null` 값을 처리하고 불필요한 요소를 필터링하는 경우가 많습니다. 코틀린은 리스트, 세트, 맵 및 기타 유형의 컬렉션을 다룰 때 깔끔하고 효율적이며 null 안전한 코드를 작성하는 데 사용할 수 있는 유용한 함수를 제공합니다.

리스트에서 `null` 값을 필터링하려면 [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) 함수를 사용하세요.

```kotlin
fun main() {
//sampleStart
    val emails: List<String?> = listOf("alice@example.com", null, "bob@example.com", null, "carol@example.com")

    val validEmails = emails.filterNotNull()

    println(validEmails)
    // [alice@example.com, bob@example.com, carol@example.com]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-filternotnull"}

리스트를 생성할 때 `null` 값을 직접 필터링하려면 [`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) 함수를 사용하세요.

```kotlin
fun main() {
//sampleStart
    val serverConfig = mapOf(
        "appConfig.json" to "App Configuration",
        "dbConfig.json" to "Database Configuration"
    )

    val requestedFile = "appConfig.json"
    val configFiles = listOfNotNull(serverConfig[requestedFile])

    println(configFiles)
    // [App Configuration]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-listofnotnull"}

이 두 예시 모두에서 모든 항목이 `null` 값인 경우 빈 리스트가 반환됩니다.

코틀린은 또한 컬렉션에서 값을 찾는 데 사용할 수 있는 함수를 제공합니다. 값을 찾지 못하면 오류를 발생시키는 대신 `null` 값을 반환합니다.

* [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html)은 가장 높은 값을 찾습니다. 값이 존재하지 않으면 `null` 값을 반환합니다.
* [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html)은 가장 낮은 값을 찾습니다. 값이 존재하지 않으면 `null` 값을 반환합니다.

예를 들어:

```kotlin
fun main() {
//sampleStart
    // 일주일간 기록된 온도
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)
  
    // 주간 최고 온도 찾기
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // 기록된 최고 온도: 21

    // 주간 최저 온도 찾기
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // 기록된 최저 온도: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

이 예시는 함수가 `null` 값을 반환할 경우 출력될 문장을 반환하기 위해 엘비스 연산자 `?:`를 사용합니다.

> `maxOrNull()` 및 `minOrNull()` 함수는 `null` 값을 포함하지 **않는** 컬렉션과 함께 사용하도록 설계되었습니다. 그렇지 않으면 함수가 원하는 값을 찾지 못한 것인지 아니면 `null` 값을 찾은 것인지 알 수 없습니다.
>
{style="note"}

[`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) 함수를 람다 표현식과 함께 사용하여 조건과 일치하는 단일 항목을 찾을 수 있습니다. 일치하는 항목이 없거나 여러 개 있는 경우 함수는 `null` 값을 반환합니다.

```kotlin
fun main() {
//sampleStart
    // 일주일간 기록된 온도
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // 정확히 하루만 30도였는지 확인
    val singleHotDay = temperatures.singleOrNull{ it == 30 }
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // 30도였던 유일한 더운 날: 없음
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-singleornull"}

> `singleOrNull()` 함수는 `null` 값을 포함하지 **않는** 컬렉션과 함께 사용하도록 설계되었습니다.
>
{style="note"}

일부 함수는 람다 표현식을 사용하여 컬렉션을 변환하며, 목적을 달성할 수 없는 경우 `null` 값을 반환합니다.

람다 표현식으로 컬렉션을 변환하고 `null`이 아닌 첫 번째 값을 반환하려면 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) 함수를 사용하세요. 그러한 값이 없으면 함수는 `null` 값을 반환합니다.

```kotlin
fun main() {
//sampleStart
    data class User(val name: String?, val age: Int?)

    val users = listOf(
        User(null, 25),
        User("Alice", null),
        User("Bob", 30)
    )

    val firstNonNullName = users.firstNotNullOfOrNull { it.name }
    println(firstNonNullName)
    // Alice
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-firstnotnullofornull"}

람다 표현식을 사용하여 각 컬렉션 항목을 순차적으로 처리하고 누적 값을 생성하려면 (또는 컬렉션이 비어 있으면 `null` 값을 반환하려면) [`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) 함수를 사용하세요.

```kotlin
fun main() {
//sampleStart
    // 장바구니 품목 가격
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // reduceOrNull() 함수를 사용하여 총 가격 계산
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the cart: ${totalPrice ?: "No items"}")
    // 장바구니 품목 총 가격: 120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the empty cart: ${emptyTotalPrice ?: "No items"}")
    // 빈 장바구니 품목 총 가격: 품목 없음
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

이 예시는 함수가 `null` 값을 반환할 경우 출력될 문장을 반환하기 위해 엘비스 연산자 `?:`도 사용합니다.

> `reduceOrNull()` 함수는 `null` 값을 포함하지 **않는** 컬렉션과 함께 사용하도록 설계되었습니다.
>
{style="note"}

코드를 더 안전하게 만들 수 있는 더 많은 함수를 찾으려면 코틀린의 [표준 라이브러리](https://kotlinlang.org/api/core/kotlin-stdlib/)를 살펴보세요.

## 조기 반환 및 엘비스 연산자

초급 투어에서는 함수가 특정 지점 이상으로 처리되는 것을 막기 위해 [조기 반환(early returns)](kotlin-tour-functions.md#early-returns-in-functions)을 사용하는 방법을 배웠습니다. 함수에서 사전 조건을 확인하기 위해 엘비스 연산자 `?:`를 조기 반환과 함께 사용할 수 있습니다. 이 접근 방식은 중첩된 검사를 사용할 필요가 없기 때문에 코드를 간결하게 유지하는 좋은 방법입니다. 코드의 복잡성이 줄어들면 유지 관리도 더 쉬워집니다. 예를 들어:

```kotlin
data class User(
    val id: Int,
    val name: String,
    // 친구 사용자 ID 목록
    val friends: List<Int>
)

// 사용자의 친구 수를 가져오는 함수
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // 사용자를 검색하거나 찾을 수 없는 경우 -1을 반환합니다.
    val user = users[userId] ?: return -1
    // 친구 수를 반환합니다.
    return user.friends.size
}

fun main() {
    // 몇 가지 샘플 사용자 생성
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // 사용자 맵 생성
    val users = mapOf(1 to user1, 2 to user2, 3 to user3)

    println(getNumberOfFriends(users, 1))
    // 2
    println(getNumberOfFriends(users, 2))
    // 1
    println(getNumberOfFriends(users, 4))
    // -1
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-early-return"}

이 예시에서는:

* 사용자 `id`, `name` 및 친구 목록 속성을 가진 `User` 데이터 클래스가 있습니다.
* `getNumberOfFriends()` 함수:
  * `User` 인스턴스 맵과 정수형 사용자 ID를 받습니다.
  * 제공된 사용자 ID로 `User` 인스턴스 맵의 값에 접근합니다.
  * 맵 값이 `null`인 경우 엘비스 연산자를 사용하여 함수를 `-1` 값으로 조기 반환합니다.
  * 맵에서 찾은 값을 `user` 변수에 할당합니다.
  * 사용자의 친구 목록에 있는 친구 수를 `size` 프로퍼티를 사용하여 반환합니다.
* `main()` 함수:
  * 세 개의 `User` 인스턴스를 생성합니다.
  * 이 `User` 인스턴스들로 맵을 생성하고 `users` 변수에 할당합니다.
  * `users` 변수에 `1`과 `2` 값을 사용하여 `getNumberOfFriends()` 함수를 호출하고, 그 결과 "Alice"의 친구 2명과 "Bob"의 친구 1명을 반환합니다.
  * `users` 변수에 `4` 값을 사용하여 `getNumberOfFriends()` 함수를 호출하고, 그 결과 `-1` 값으로 조기 반환이 트리거됩니다.

조기 반환 없이 코드를 더 간결하게 만들 수 있다는 점을 알아차릴 수 있습니다. 하지만 이 접근 방식은 `users[userId]`가 `null` 값을 반환할 수 있기 때문에 여러 안전한 호출이 필요하여 코드를 약간 더 읽기 어렵게 만듭니다.

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // 사용자를 검색하거나 찾을 수 없는 경우 -1을 반환합니다.
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

이 예시는 엘비스 연산자로 하나의 조건만 확인하지만, 중요한 오류 경로를 처리하기 위해 여러 검사를 추가할 수 있습니다. 엘비스 연산자를 사용한 조기 반환은 프로그램이 불필요한 작업을 수행하는 것을 방지하고, `null` 값 또는 유효하지 않은 사례가 감지되는 즉시 중단하여 코드를 더 안전하게 만듭니다.

코드에서 `return`을 사용하는 방법에 대한 자세한 내용은 [반환 및 점프](returns.md)를 참조하세요.

## 연습 문제

### 연습 문제 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

사용자가 다양한 유형의 알림을 활성화하거나 비활성화할 수 있는 앱의 알림 시스템을 개발 중입니다. `getNotificationPreferences()` 함수를 다음 조건을 만족하도록 완성하세요.

1. `validUser` 변수는 `as?` 연산자를 사용하여 `user`가 `User` 클래스의 인스턴스인지 확인합니다. 인스턴스가 아닌 경우 빈 리스트를 반환합니다.
2. `userName` 변수는 엘비스 `?:` 연산자를 사용하여 사용자 이름이 `null`인 경우 기본값으로 `"Guest"`가 되도록 합니다.
3. 최종 return 문은 `.takeIf()` 함수를 사용하여 이메일 및 SMS 알림 설정이 활성화된 경우에만 포함합니다.
4. `main()` 함수가 성공적으로 실행되고 예상 출력을 인쇄합니다.

> [`takeIf()` 함수](scope-functions.md#takeif-and-takeunless)는 주어진 조건이 참이면 원래 값을 반환하고, 그렇지 않으면 `null`을 반환합니다. 예를 들어:
>
> ```kotlin
> fun main() {
>     // 사용자가 로그인됨
>     val userIsLoggedIn = true
>     // 사용자가 활성 세션을 가짐
>     val hasSession = true
> 
>     // 사용자가 로그인되어 있고
>     // 활성 세션이 있는 경우 대시보드에 접근 권한 부여
>     val canAccessDashboard = userIsLoggedIn.takeIf { hasSession }
> 
>     println(canAccessDashboard ?: "Access denied")
>     // true
> }
> ```
>
{style="tip"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // Write your code here
    val userName = // Write your code here

    return listOfNotNull( /* Write your code here */)
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Alice에 대해 이메일 알림 활성화됨]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [Guest에 대해 SMS 알림 활성화됨]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-1"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = user as? User ?: return emptyList()
    val userName = validUser.name ?: "Guest"

    return listOfNotNull(
        "Email Notifications enabled for $userName".takeIf { emailEnabled },
        "SMS Notifications enabled for $userName".takeIf { smsEnabled }
    )
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-null-safety-solution-1"}

### 연습 문제 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

사용자가 여러 구독을 가질 수 있지만 **한 번에 하나만 활성화될 수 있는** 구독 기반 스트리밍 서비스를 개발 중입니다. 활성 구독이 두 개 이상인 경우 `null` 값을 반환하도록 `singleOrNull()` 함수와 프레디케이트를 사용하도록 `getActiveSubscription()` 함수를 완성하세요.

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // 여기에 코드를 작성하세요

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-2"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? {
    return subscriptions.singleOrNull { subscription -> subscription.isActive }
}

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 1" id="kotlin-tour-null-safety-solution-2-1"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? =
    subscriptions.singleOrNull { it.isActive }

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 2" id="kotlin-tour-null-safety-solution-2-2"}

### 연습 문제 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

사용자가 사용자 이름과 계정 상태를 가지는 소셜 미디어 플랫폼에서 작업하고 있습니다. 현재 활성 상태인 사용자 이름 목록을 보려고 합니다. [`mapNotNull()` 함수](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html)가 사용자 이름이 활성 상태인 경우 사용자 이름을 반환하고, 그렇지 않은 경우 `null` 값을 반환하는 프레디케이트를 갖도록 `getActiveUsernames()` 함수를 완성하세요.

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* Write your code here */ }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-3"}

|--|--|

> 연습 문제 1에서와 마찬가지로, 사용자가 활성 상태인지 확인할 때 [`takeIf()` 함수](scope-functions.md#takeif-and-takeunless)를 사용할 수 있습니다.
>
{ style = "tip" }

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { user ->
        if (user.isActive) user.username else null
    }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 1" id="kotlin-tour-null-safety-solution-3-1"}

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> = users.mapNotNull { user -> user.username.takeIf { user.isActive } }

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션 2" id="kotlin-tour-null-safety-solution-3-2"}

### 연습 문제 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

전자상거래 플랫폼의 재고 관리 시스템에서 작업하고 있습니다. 판매를 처리하기 전에 요청된 제품 수량이 사용 가능한 재고를 기준으로 유효한지 확인해야 합니다.

`validateStock()` 함수를 완성하여 조기 반환과 엘비스 연산자(해당하는 경우)를 사용하여 다음을 확인하도록 하세요.

* `requested` 변수가 `null`인지.
* `available` 변수가 `null`인지.
* `requested` 변수가 음수 값인지.
* `requested` 변수의 수량이 `available` 변수의 수량보다 많은지.

위의 모든 경우에 함수는 `-1` 값을 반환하며 조기 종료되어야 합니다.

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // 여기에 코드를 작성하세요
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-4"}

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    val validRequested = requested ?: return -1
    val validAvailable = available ?: return -1

    if (validRequested < 0) return -1
    if (validRequested > validAvailable) return -1

    return validRequested
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-null-safety-solution-4"}

## 다음 단계

[중급: 라이브러리 및 API](kotlin-tour-intermediate-libraries-and-apis.md)