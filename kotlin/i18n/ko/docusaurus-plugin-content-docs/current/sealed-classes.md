---
title: "Sealed 클래스 및 인터페이스"
---
_Sealed_ 클래스와 인터페이스는 클래스 계층 구조의 제어된 상속을 제공합니다.
Sealed 클래스의 모든 직접적인 서브클래스는 컴파일 시에 알려집니다. 다른 서브클래스는 sealed 클래스가 정의된 모듈 및
패키지 외부에서 나타날 수 없습니다. 동일한 논리가 sealed 인터페이스와 해당 구현에도 적용됩니다.
sealed 인터페이스가 있는 모듈이 컴파일되면 새로운 구현을 만들 수 없습니다.

:::note
직접적인 서브클래스는 슈퍼클래스에서 즉시 상속받는 클래스입니다.

간접적인 서브클래스는 슈퍼클래스에서 두 단계 이상 아래에서 상속받는 클래스입니다.

:::

Sealed 클래스와 인터페이스를 `when` 표현식과 함께 사용하면 가능한 모든 서브클래스의 동작을 다룰 수 있으며, 코드에 부정적인 영향을 미치는 새로운 서브클래스가 생성되지 않도록 할 수 있습니다.

Sealed 클래스는 다음과 같은 시나리오에서 가장 잘 사용됩니다.

* **제한된 클래스 상속이 필요한 경우:** 클래스를 확장하는 미리 정의된 유한한 서브클래스 집합이 있으며, 이들 모두 컴파일 시에 알려져 있습니다.
* **Type-safe 디자인이 필요한 경우:** 안전성과 패턴 매칭이 프로젝트에서 중요한 경우. 특히 상태 관리 또는 복잡한 조건부 로직 처리에 유용합니다. 예를 들어 [when 표현식과 함께 sealed 클래스 사용](#use-sealed-classes-with-when-expression)을 확인하세요.
* **닫힌 API 작업:** 타사 클라이언트가 API를 의도한 대로 사용하도록 보장하는 라이브러리에 대한 강력하고 유지 관리 가능한 공개 API를 원하는 경우.

더 자세한 실제 적용 사례는 [사용 사례 시나리오](#use-case-scenarios)를 참조하세요.

:::note
Java 15에서는 [유사한 개념](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)을 도입했습니다.
여기서 sealed 클래스는 `sealed` 키워드와 `permits` 절을 사용하여 제한된 계층 구조를 정의합니다.

## Sealed 클래스 또는 인터페이스 선언

Sealed 클래스 또는 인터페이스를 선언하려면 `sealed` modifier를 사용하세요:

```kotlin
// Create a sealed interface
sealed interface Error

// Create a sealed class that implements sealed interface Error
sealed class IOError(): Error

// Define subclasses that extend sealed class 'IOError'
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// Create a singleton object implementing the 'Error' sealed interface 
object RuntimeError : Error
```

이 예제는 라이브러리 사용자가 발생할 수 있는 오류를 처리할 수 있도록 오류 클래스를 포함하는 라이브러리의 API를 나타낼 수 있습니다.
이러한 오류 클래스의 계층 구조에 공개 API에서 볼 수 있는 인터페이스 또는 추상 클래스가 포함되어 있는 경우 다른 개발자가 클라이언트 코드에서 이를 구현하거나 확장하는 것을 막을 수 없습니다.
라이브러리는 자체 외부에서 선언된 오류에 대해 알지 못하므로 자체 클래스와 일관되게 처리할 수 없습니다.
그러나 오류 클래스의 **sealed** 계층 구조를 사용하면 라이브러리 작성자는 가능한 모든 오류 유형을 알고 있으며 다른 오류 유형이 나중에 나타날 수 없음을 확신할 수 있습니다.

예제의 계층 구조는 다음과 같습니다.

<img src="/img/sealed-classes-interfaces.svg" alt="Sealed 클래스 및 인터페이스의 계층 구조 그림" width="700" style={{verticalAlign: 'middle'}}/>

### 생성자

Sealed 클래스 자체는 항상 [추상 클래스](classes#abstract-classes)이므로 직접 인스턴스화할 수 없습니다.
그러나 생성자를 포함하거나 상속할 수 있습니다. 이러한 생성자는 sealed 클래스 자체의 인스턴스를 만들기 위한 것이 아니라
서브클래스를 위한 것입니다. `Error`라는 sealed 클래스와 여러 서브클래스를 사용하는 다음 예제를 고려해 보겠습니다.
이 서브클래스를 인스턴스화합니다.

```kotlin
sealed class Error(val message: String) {
    class NetworkError : Error("Network failure")
    class DatabaseError : Error("Database cannot be reached")
    class UnknownError : Error("An unknown error has occurred")
}

fun main() {
    val errors = listOf(Error.NetworkError(), Error.DatabaseError(), Error.UnknownError())
    errors.forEach { println(it.message) }
}
// Network failure 
// Database cannot be reached 
// An unknown error has occurred
```

`enum` 클래스를 sealed 클래스 내에서 사용하여 enum 상수를 나타내고 추가 정보를 제공할 수 있습니다.
각 enum 상수는 **단일** 인스턴스로만 존재하지만 sealed 클래스의 서브클래스는 **여러** 인스턴스를 가질 수 있습니다.
예제에서 여러 서브클래스와 함께 `sealed class Error`는 `enum`을 사용하여 오류 심각도를 나타냅니다.
각 서브클래스 생성자는 `severity`를 초기화하고 해당 상태를 변경할 수 있습니다.

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

Sealed 클래스의 생성자는 두 가지 [visibility](visibility-modifiers) 중 하나를 가질 수 있습니다. `protected` (기본값) 또는
`private`:

```kotlin
sealed class IOError {
    // A sealed class constructor has protected visibility by default. It's visible inside this class and its subclasses 
    constructor() { /*...*/ }

    // Private constructor, visible inside this class only. 
    // Using a private constructor in a sealed class allows for even stricter control over instantiation, enabling specific initialization procedures within the class.
    private constructor(description: String): this() { /*...*/ }

    // This will raise an error because public and internal constructors are not allowed in sealed classes
    // public constructor(code: Int): this() {} 
}
```

## 상속

Sealed 클래스 및 인터페이스의 직접 서브클래스는 동일한 패키지에서 선언되어야 합니다. 최상위 레벨이거나
다른 명명된 클래스, 명명된 인터페이스 또는 명명된 객체 내부에 중첩될 수 있습니다. 서브클래스는 Kotlin의 일반적인 상속 규칙과 호환되는 한 모든 [visibility](visibility-modifiers)를 가질 수 있습니다.

Sealed 클래스의 서브클래스는 올바르게 규정된 이름을 가져야 합니다. 로컬 또는 익명 객체가 될 수 없습니다.

`enum` 클래스는 sealed 클래스 또는 다른 클래스를 확장할 수 없습니다. 그러나 sealed 인터페이스를 구현할 수 있습니다.

```kotlin
sealed interface Error

// enum class extending the sealed interface Error
enum class ErrorType : Error {
    FILE_ERROR, DATABASE_ERROR
}

```

:::

이러한 제한 사항은 간접 서브클래스에는 적용되지 않습니다. Sealed 클래스의 직접 서브클래스가 sealed로 표시되지 않은 경우
modifier가 허용하는 모든 방식으로 확장할 수 있습니다.

```kotlin
// Sealed interface 'Error' has implementations only in the same package and module
sealed interface Error

// Sealed class 'IOError' extends 'Error' and is extendable only within the same package
sealed class IOError(): Error

// Open class 'CustomError' extends 'Error' and can be extended anywhere it's visible
open class CustomError(): Error
```

### 멀티 플랫폼 프로젝트의 상속

[멀티 플랫폼 프로젝트](multiplatform-intro)에는 상속 제한 사항이 하나 더 있습니다. sealed 클래스의 직접 서브클래스는 동일한 [source set](multiplatform-discover-project#source-sets)에 있어야 합니다.
이는 [expected 및 actual modifier](multiplatform-expect-actual)가 없는 sealed 클래스에 적용됩니다.

Sealed 클래스가 공통 소스 세트에서 `expect`로 선언되고 플랫폼 소스 세트에 `actual` 구현이 있는 경우
`expect` 및 `actual` 버전 모두 소스 세트에 서브클래스를 가질 수 있습니다. 또한 계층 구조를 사용하는 경우
`expect` 및 `actual` 선언 사이의 모든 소스 세트에서 서브클래스를 만들 수 있습니다.

[멀티 플랫폼 프로젝트의 계층 구조에 대해 자세히 알아보세요](multiplatform-hierarchy).

## when 표현식과 함께 sealed 클래스 사용

Sealed 클래스 사용의 핵심 이점은 [`when`](control-flow#when-expressions-and-statements)에서 사용할 때 나타납니다.
표현식.
Sealed 클래스와 함께 사용되는 `when` 표현식을 사용하면 Kotlin 컴파일러가 가능한 모든 경우가 포함되었는지 철저하게 확인할 수 있습니다.
이러한 경우 `else` 절을 추가할 필요가 없습니다.

```kotlin
// Sealed class and its subclasses
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

// Function to log errors
fun log(e: Error) = when(e) {
    is Error.FileReadError `->` println("Error while reading file ${e.file}")
    is Error.DatabaseError `->` println("Error while reading from database ${e.source}")
    Error.RuntimeError `->` println("Runtime error")
    // No `else` clause is required because all the cases are covered
}

// List all errors
fun main() {
    val errors = listOf(
        Error.FileReadError("example.txt"),
        Error.DatabaseError("usersDatabase"),
        Error.RuntimeError
    )

    errors.forEach { log(it) }
}
```

`when` 표현식과 함께 sealed 클래스를 사용할 때 가드 조건을 추가하여 단일 분기에 추가 검사를 포함할 수도 있습니다.
자세한 내용은 [when 표현식의 가드 조건](control-flow#guard-conditions-in-when-expressions)을 참조하세요.

:::note
멀티 플랫폼 프로젝트에서 공통 코드에 [expected declaration](multiplatform-expect-actual)으로 `when` 표현식이 있는 sealed 클래스가 있는 경우에도 `else` 분기가 필요합니다.
이는 `actual` 플랫폼 구현의 서브클래스가 공통 코드에서 알 수 없는 sealed 클래스를 확장할 수 있기 때문입니다.

:::

## 사용 사례 시나리오

Sealed 클래스와 인터페이스가 특히 유용할 수 있는 몇 가지 실제 시나리오를 살펴보겠습니다.

### UI 애플리케이션의 상태 관리

Sealed 클래스를 사용하여 애플리케이션에서 다양한 UI 상태를 나타낼 수 있습니다.
이 접근 방식을 사용하면 UI 변경 사항을 구조화되고 안전하게 처리할 수 있습니다.
이 예제에서는 다양한 UI 상태를 관리하는 방법을 보여줍니다.

```kotlin
sealed class UIState { 
    data object Loading : UIState()
    data class Success(val data: String) : UIState()
    data class Error(val exception: Exception) : UIState()
}

fun updateUI(state: UIState) { 
    when (state) {
        is UIState.Loading `->` showLoadingIndicator()
        is UIState.Success `->` showData(state.data)
        is UIState.Error `->` showError(state.exception) 
    }
}
```

### 결제 방법 처리

실제 비즈니스 애플리케이션에서 다양한 결제 방법을 효율적으로 처리하는 것은 일반적인 요구 사항입니다.
`when` 표현식과 함께 sealed 클래스를 사용하여 이러한 비즈니스 로직을 구현할 수 있습니다.
다양한 결제 방법을 sealed 클래스의 서브클래스로 나타내면 트랜잭션 처리를 위한 명확하고 관리하기 쉬운
구조가 설정됩니다.

```kotlin
sealed class Payment {
    data class CreditCard(val number: String, val expiryDate: String) : Payment()
    data class PayPal(val email: String) : Payment()
    data object Cash : Payment()
}

fun processPayment(payment: Payment) { 
    when (payment) {
        is Payment.CreditCard `->` processCreditCardPayment(payment.number, payment.expiryDate)
        is Payment.PayPal `->` processPayPalPayment(payment.email)
        is Payment.Cash `->` processCashPayment() 
    }
}
```

`Payment`는 전자 상거래 시스템에서 다양한 결제 방법을 나타내는 sealed 클래스입니다.
`CreditCard`, `PayPal` 및 `Cash`. 각 서브클래스는 `CreditCard`의 `number` 및 `expiryDate`,
`PayPal`의 `email`과 같은 특정 속성을 가질 수 있습니다.

`processPayment()` 함수는 다양한 결제 방법을 처리하는 방법을 보여줍니다.
이 접근 방식을 사용하면 가능한 모든 결제 유형이 고려되고 시스템이 유연하게 유지되어 새로운 결제
방법을 향후 추가할 수 있습니다.

### API 요청-응답 처리

Sealed 클래스와 sealed 인터페이스를 사용하여 API 요청 및 응답을 처리하는 사용자 인증 시스템을 구현할 수 있습니다.
사용자 인증 시스템에는 로그인 및 로그아웃 기능이 있습니다.
`ApiRequest` sealed 인터페이스는 특정 요청 유형을 정의합니다. 로그인용 `LoginRequest` 및 로그아웃 작업을 위한 `LogoutRequest`.
sealed 클래스 `ApiResponse`는 다양한 응답 시나리오를 캡슐화합니다. 사용자 데이터가 있는 `UserSuccess`, 부재하는 사용자를 위한 `UserNotFound`
및 모든 실패에 대한 `Error`. `handleRequest` 함수는 `when` 표현식을 사용하여 이러한 요청을 유형 안전 방식으로 처리하는 반면, `getUserById`는 사용자 검색을 시뮬레이션합니다.

```kotlin
// Import necessary modules
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// Define the sealed interface for API requests using Ktor resources
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// Define the ApiResponse sealed class with detailed response types
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// User data class to be used in the success response
data class UserData(val userId: String, val name: String, val email: String)

// Function to validate user credentials (for demonstration purposes)
fun isValidUser(username: String, password: String): Boolean {
    // Some validation logic (this is just a placeholder)
    return username == "validUser" && password == "validPass"
}

// Function to handle API requests with detailed responses
fun handleRequest(request: ApiRequest): ApiResponse {
    return when (request) {
        is LoginRequest `->` {
            if (isValidUser(request.username, request.password)) {
                ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail"))
            } else {
                ApiResponse.Error("Invalid username or password")
            }
        }
        is LogoutRequest `->` {
            // Assuming logout operation always succeeds for this example
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // For demonstration
        }
    }
}

// Function to simulate a getUserById call
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // Error handling would also result in an Error response.
}

// Main function to demonstrate the usage
fun main() {
    val loginResponse = handleRequest(LoginRequest("user", "pass"))
    println(loginResponse)

    val logoutResponse = handleRequest(LogoutRequest)
    println(logoutResponse)

    val userResponse = getUserById("validUserId")
    println(userResponse)

    val userNotFoundResponse = getUserById("invalidId")
    println(userNotFoundResponse)
}
```