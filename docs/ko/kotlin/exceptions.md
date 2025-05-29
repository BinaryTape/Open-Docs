[//]: # (title: 예외)

예외는 런타임 오류가 발생하여 프로그램 실행을 방해할 수 있는 경우에도 코드가 더 예측 가능하게 실행되도록 돕습니다.
Kotlin은 기본적으로 모든 예외를 _비검사(unchecked)_ 예외로 처리합니다.
비검사 예외는 예외 처리 과정을 간소화합니다. 예외를 잡을(catch) 수는 있지만, 명시적으로 처리하거나 [선언](java-to-kotlin-interop.md#checked-exceptions)할 필요는 없습니다.

> Kotlin이 Java, Swift, Objective-C와 상호 운용될 때 예외를 처리하는 방법에 대해 더 자세히 알아보려면
> [Java, Swift, Objective-C와의 예외 상호 운용성](#exception-interoperability-with-java-swift-and-objective-c) 섹션을 참조하세요.
>
{style="tip"}

예외 작업은 두 가지 주요 작업으로 구성됩니다.

*   **예외 발생시키기**: 문제가 발생했음을 나타냅니다.
*   **예외 잡기**: 문제를 해결하거나 개발자 또는 애플리케이션 사용자에게 알림으로써 예상치 못한 예외를 수동으로 처리합니다.

예외는 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 클래스의 서브클래스인
[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 클래스의 서브클래스로 표현됩니다.
계층 구조에 대한 자세한 내용은 [예외 계층 구조](#exception-hierarchy) 섹션을 참조하세요. `Exception`은 [`open 
class`](inheritance.md)이므로 애플리케이션의 특정 요구사항에 맞춰 [사용자 정의 예외](#create-custom-exceptions)를 생성할 수 있습니다.

## 예외 발생시키기

`throw` 키워드를 사용하여 수동으로 예외를 발생시킬 수 있습니다.
예외를 발생시키는 것은 코드에서 예상치 못한 런타임 오류가 발생했음을 나타냅니다.
예외는 [객체(objects)](classes.md#creating-instances-of-classes)이며, 예외를 발생시키면 예외 클래스의 인스턴스가 생성됩니다.

매개변수 없이 예외를 발생시킬 수 있습니다.

```kotlin
throw IllegalArgumentException()
```

문제의 원인을 더 잘 이해하기 위해 사용자 정의 메시지 및 원본 원인과 같은 추가 정보를 포함할 수 있습니다.

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// Throws an IllegalArgumentException if userInput is negative 
// Additionally, it shows the original cause, represented by the cause IllegalStateException
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

이 예시에서는 사용자가 음수 값을 입력할 때 `IllegalArgumentException`이 발생합니다.
사용자 정의 오류 메시지를 생성하고 예외의 원본 원인(`cause`)을 유지할 수 있으며,
이것은 [스택 트레이스](#stack-trace)에 포함됩니다.

### 전제 조건 함수로 예외 발생시키기

Kotlin은 전제 조건 함수를 사용하여 예외를 자동으로 발생시키는 추가적인 방법을 제공합니다.
전제 조건 함수에는 다음이 포함됩니다.

| 전제 조건 함수            | 사용 사례                                 | 발생되는 예외                                                                                                 |
|--------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 사용자 입력 유효성 검사               | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 객체 또는 변수 상태 유효성 검사 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 잘못된 상태 또는 조건을 나타냄  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

이러한 함수는 특정 조건이 충족되지 않으면 프로그램 흐름이 계속될 수 없는 상황에 적합합니다.
이를 통해 코드를 간소화하고 이러한 검사를 효율적으로 처리할 수 있습니다.

#### `require()` 함수

함수 작동에 중요한 입력 인수를 검증하고, 이러한 인수가 유효하지 않으면 함수가 진행될 수 없는 경우에
[`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 함수를 사용하세요.

`require()`의 조건이 충족되지 않으면 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)을 발생시킵니다.

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // This fails with an IllegalArgumentException
    println(getIndices(-1))
    
    // Uncomment the line below to see a working example
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()` 함수는 컴파일러가 [스마트 캐스팅(smart casting)](typecasts.md#smart-casts)을 수행할 수 있도록 합니다.
> 검사가 성공적으로 완료되면 변수는 자동으로 null을 허용하지 않는 타입으로 캐스팅됩니다.
> 이 함수는 종종 변수가 null이 아님을 보장하기 위한 nullability 검사에 사용됩니다. 예를 들어:
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Nullability check
>     require(str != null) 
>     // After this successful check, 'str' is guaranteed to be 
>     // non-null and is automatically smart cast to non-nullable String
>     println(str.length)
> }
> ```
>
{style="note"}

#### `check()` 함수

객체 또는 변수의 상태를 검증하는 데 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 함수를 사용하세요.
검사가 실패하면 해결해야 할 논리적 오류를 나타냅니다.

`check()` 함수에 지정된 조건이 `false`이면 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)을 발생시킵니다.

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // If you uncomment the line below then the program fails with IllegalStateException
    // getStateValue()

    someState = ""

    // If you uncomment the line below then the program fails with IllegalStateException
    // getStateValue() 
    someState = "non-empty-state"

    // This prints "non-empty-state"
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()` 함수는 컴파일러가 [스마트 캐스팅(smart casting)](typecasts.md#smart-casts)을 수행할 수 있도록 합니다.
> 검사가 성공적으로 완료되면 변수는 자동으로 null을 허용하지 않는 타입으로 캐스팅됩니다.
> 이 함수는 종종 변수가 null이 아님을 보장하기 위한 nullability 검사에 사용됩니다. 예를 들어:
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Nullability check
>     check(str != null) 
>     // After this successful check, 'str' is guaranteed to be 
>     // non-null and is automatically smart cast to non-nullable String
>     println(str.length)
> }
> ```
>
{style="note"}

#### `error()` 함수

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 함수는 코드에서 논리적으로 발생해서는 안 되는 잘못된 상태 또는 조건을 알리는 데 사용됩니다.
코드가 예상치 못한 상태를 만났을 때와 같이, 코드에서 의도적으로 예외를 발생시키고자 하는 시나리오에 적합합니다.
이 함수는 특히 `when` 표현식에서 유용하며, 논리적으로 발생해서는 안 되는 경우를 처리하는 명확한 방법을 제공합니다.

다음 예시에서는 `error()` 함수를 사용하여 정의되지 않은 사용자 역할을 처리합니다.
역할이 미리 정의된 역할 중 하나가 아니면 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)이 발생합니다.

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" -> println("${user.name} is an admin.")
        "editor" -> println("${user.name} is an editor.")
        "viewer" -> println("${user.name} is a viewer.")
        else -> error("Undefined role: ${user.role}")
    }
}

fun main() {
    // This works as expected
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // This throws an IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## `try-catch` 블록을 사용하여 예외 처리하기

예외가 발생하면 프로그램의 정상적인 실행이 중단됩니다.
`try` 및 `catch` 키워드를 사용하여 예외를 우아하게 처리하고 프로그램을 안정적으로 유지할 수 있습니다.
`try` 블록은 예외를 발생시킬 수 있는 코드를 포함하고, `catch` 블록은 예외가 발생하면 이를 잡아서 처리합니다.
예외는 특정 타입 또는 예외의 [상위 클래스(superclass)](inheritance.md)와 일치하는 첫 번째 `catch` 블록에 의해 잡힙니다.

`try`와 `catch` 키워드를 함께 사용하는 방법은 다음과 같습니다.

```kotlin
try {
    // Code that may throw an exception
} catch (e: SomeException) {
    // Code for handling the exception
}
```

`try-catch`를 표현식으로 사용하여 `try` 블록 또는 `catch` 블록에서 값을 반환하도록 하는 것은 일반적인 접근 방식입니다.

```kotlin
fun main() {
    val num: Int = try {

        // If count() completes successfully, its return value is assigned to num
        count()
        
    } catch (e: ArithmeticException) {
        
        // If count() throws an exception, the catch block returns -1, 
        // which is assigned to num
        -1
    }
    println("Result: $num")
}

// Simulates a function that might throw ArithmeticException
fun count(): Int {
    
    // Change this value to return a different value to num
    val a = 0
    
    return 10 / a
}
```
{kotlin-runnable="true"}

동일한 `try` 블록에 대해 여러 `catch` 핸들러를 사용할 수 있습니다.
다양한 예외를 개별적으로 처리하는 데 필요한 만큼 `catch` 블록을 추가할 수 있습니다.
여러 `catch` 블록이 있는 경우, 코드에서 위에서 아래로의 순서에 따라 가장 구체적인 예외부터 가장 덜 구체적인 예외 순으로 정렬하는 것이 중요합니다.
이러한 순서는 프로그램의 실행 흐름과 일치합니다.

[사용자 정의 예외](#create-custom-exceptions)를 사용한 다음 예시를 고려해보세요.

```kotlin
open class WithdrawalException(message: String) : Exception(message)
class InsufficientFundsException(message: String) : WithdrawalException(message)

fun processWithdrawal(amount: Double, availableFunds: Double) {
    if (amount > availableFunds) {
        throw InsufficientFundsException("Insufficient funds for the withdrawal.")
    }
    if (amount < 1 || amount % 1 != 0.0) {
        throw WithdrawalException("Invalid withdrawal amount.")
    }
    println("Withdrawal processed")
}

fun main() {
    val availableFunds = 500.0

    // Change this value to test different scenarios
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // The order of catch blocks is important!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

`WithdrawalException`을 처리하는 일반적인 `catch` 블록은 `InsufficientFundsException`과 같은 특정 예외를 포함하여 해당 타입의 모든 예외를 잡습니다.
단, 더 구체적인 `catch` 블록에 의해 먼저 잡히지 않는 한 말이죠.

### `finally` 블록

`finally` 블록은 `try` 블록이 성공적으로 완료되든 예외를 발생시키든 상관없이 항상 실행되는 코드를 포함합니다.
`finally` 블록을 사용하면 `try` 및 `catch` 블록 실행 후 코드를 정리할 수 있습니다.
이는 파일이나 네트워크 연결과 같은 리소스를 다룰 때 특히 중요하며, `finally`는 이들이 올바르게 닫히거나 해제되도록 보장합니다.

`try-catch-finally` 블록을 함께 사용하는 일반적인 방법은 다음과 같습니다.

```kotlin
try {
    // Code that may throw an exception
}
catch (e: YourException) {
    // Exception handler
}
finally {
    // Code that is always executed
}
```

`try` 표현식의 반환 값은 `try` 또는 `catch` 블록에서 마지막으로 실행된 표현식에 의해 결정됩니다.
예외가 발생하지 않으면 결과는 `try` 블록에서 오고, 예외가 처리되면 `catch` 블록에서 옵니다.
`finally` 블록은 항상 실행되지만, `try-catch` 블록의 결과에는 영향을 주지 않습니다.

다음 예시를 통해 살펴보겠습니다.

```kotlin
fun divideOrNull(a: Int): Int {
    
    // The try block is always executed
    // An exception here (division by zero) causes an immediate jump to the catch block
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // The catch block is executed due to the ArithmeticException (division by zero if a ==0)
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // Change this value to get a different result. An ArithmeticException will return: -1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> Kotlin에서는 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 인터페이스를 구현하는 `FileInputStream` 또는 `FileOutputStream`과 같은 파일 스트림 리소스를 관리하는 관용적인 방법은
> [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 함수를 사용하는 것입니다.
> 이 함수는 코드 블록이 완료될 때 예외 발생 여부와 관계없이 리소스를 자동으로 닫아주므로,
> `finally` 블록이 필요 없습니다.
> 따라서 Kotlin은 리소스 관리를 위해 [Java의 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)와 같은 특별한 구문이 필요하지 않습니다.
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // After this block, the .use function automatically calls writer.close(), similar to a finally block
> }
> ```
>
{style="note"}

코드가 예외를 처리하지 않고 리소스 정리가 필요한 경우, `catch` 블록 없이 `try`와 `finally` 블록을 함께 사용할 수도 있습니다.

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // Simulate a resource being used 
        // This throws an ArithmeticException if division by zero occurs
        val result = 100 / 0
        
        // This line is not executed if an exception is thrown
        println("Result: $result") 
    }
    
    fun close() { 
        println("Resource closed") 
    }
}

fun main() { 
    val resource = MockResource()
//sampleStart 
    try {
        
        // Attempts to use the resource 
        resource.use()
        
    } finally {
        
        // Ensures that the resource is always closed, even if an exception occurs 
        resource.close()
    }

    // This line is not printed if an exception is thrown
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

보시다시피, `finally` 블록은 예외 발생 여부와 관계없이 리소스가 닫히도록 보장합니다.

Kotlin에서는 특정 필요에 따라 `catch` 블록만, `finally` 블록만, 또는 둘 다 유연하게 사용할 수 있지만,
`try` 블록은 항상 하나 이상의 `catch` 블록 또는 `finally` 블록이 동반되어야 합니다.

## 사용자 정의 예외 생성하기

Kotlin에서는 내장 `Exception` 클래스를 확장하는 클래스를 생성하여 사용자 정의 예외를 정의할 수 있습니다.
이를 통해 애플리케이션의 요구사항에 맞춰 더 구체적인 오류 타입을 생성할 수 있습니다.

사용자 정의 예외를 생성하려면 `Exception`을 확장하는 클래스를 정의하면 됩니다.

```kotlin
class MyException: Exception("My message")
```

이 예시에는 기본 오류 메시지인 "My message"가 있지만, 원한다면 비워둘 수도 있습니다.

> Kotlin의 예외는 [스택 트레이스](#stack-trace)라고 하는 생성 컨텍스트에 특정한 정보를 담고 있는 상태 저장 객체(stateful objects)입니다.
> [객체 선언(object declarations)](object-declarations.md#object-declarations-overview)을 사용하여 예외를 생성하는 것을 피하세요.
> 대신, 예외가 필요할 때마다 예외의 새 인스턴스를 생성해야 합니다.
> 이렇게 하면 예외의 상태가 특정 컨텍스트를 정확하게 반영하도록 할 수 있습니다.
>
{style="tip"}

사용자 정의 예외는 `ArithmeticException` 서브클래스와 같이 기존 예외 서브클래스의 서브클래스일 수도 있습니다.

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 사용자 정의 예외의 서브클래스를 생성하려면 부모 클래스를 `open`으로 선언해야 합니다.
> 왜냐하면 [클래스는 기본적으로 `final`](inheritance.md)이며, 그렇지 않으면 서브클래스화될 수 없기 때문입니다.
>
> 예를 들어:
>
> ```kotlin
> // Declares a custom exception as an open class, making it subclassable
> open class MyCustomException(message: String): Exception(message)
>
> // Creates a subclass of the custom exception
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{style="note"}

사용자 정의 예외는 내장 예외와 동일하게 작동합니다. `throw` 키워드를 사용하여 발생시킬 수 있고,
`try-catch-finally` 블록으로 처리할 수 있습니다. 다음 예시를 통해 살펴보겠습니다.

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // Change the value in this function to a get a different exception
    myFunction(1)
}
```
{kotlin-runnable="true"}

다양한 오류 시나리오를 가진 애플리케이션에서는
예외 계층 구조를 생성하면 코드를 더 명확하고 구체적으로 만드는 데 도움이 될 수 있습니다.
[추상 클래스(abstract class)](classes.md#abstract-classes) 또는
[봉인된 클래스(sealed class)](sealed-classes.md#constructors)를 공통 예외 기능을 위한 기반으로 사용하고
상세한 예외 타입을 위한 특정 서브클래스를 생성하여 이를 달성할 수 있습니다.
또한, 선택적 매개변수를 가진 사용자 정의 예외는 유연성을 제공하여 다양한 메시지로 초기화할 수 있게 하여
더 세분화된 오류 처리가 가능합니다.

봉인된 클래스 `AccountException`을 예외 계층 구조의 기반으로 사용하고,
선택적 매개변수 사용을 통해 예외 세부 정보를 개선한 서브클래스 `APIKeyExpiredException`을 보여주는 예시를 살펴보겠습니다.

```kotlin
//sampleStart
// Creates a sealed class as the base for an exception hierarchy for account-related errors
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// Creates a subclass of AccountException
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// Creates a subclass of AccountException, which allows the addition of custom messages and causes
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// Change values of placeholder functions to get different results
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// Validates account credentials and API key
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // Example of throwing APIKeyExpiredException with a specific cause
        val cause = RuntimeException("API key validation failed due to network error")
        throw APIKeyExpiredException(cause = cause)
    }
}

fun main() {
    try {
        validateAccount()
        println("Operation successful: Account credentials and API key are valid.")
    } catch (e: AccountException) {
        println("Error: ${e.message}")
        e.cause?.let { println("Caused by: ${it.message}") }
    }
}
```
{kotlin-runnable="true"}

## `Nothing` 타입

Kotlin에서는 모든 표현식에 타입이 있습니다.
`throw IllegalArgumentException()` 표현식의 타입은 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)이며,
이는 다른 모든 타입의 서브타입인 내장 타입으로, [최하위 타입(the bottom type)](https://en.wikipedia.org/wiki/Bottom_type)이라고도 알려져 있습니다.
이는 `Nothing`이 타입 오류를 발생시키지 않고 다른 어떤 타입이 예상되는 곳이든 반환 타입 또는 제네릭 타입으로 사용될 수 있음을 의미합니다.

`Nothing`은 Kotlin의 특별한 타입으로, 항상 예외를 발생시키거나 무한 루프와 같은 끝없는 실행 경로로 진입하여 성공적으로 완료되지 않는 함수 또는 표현식을 나타내는 데 사용됩니다.
`Nothing`을 사용하여 아직 구현되지 않았거나 항상 예외를 발생시키도록 설계된 함수를 표시할 수 있으며,
이는 컴파일러와 코드 독자 모두에게 의도를 명확하게 전달합니다.
컴파일러가 함수 시그니처에서 `Nothing` 타입을 추론하면 경고를 표시합니다.
`Nothing`을 반환 타입으로 명시적으로 정의하면 이 경고를 없앨 수 있습니다.

다음 Kotlin 코드는 `Nothing` 타입의 사용을 보여주며, 컴파일러는 함수 호출 이후의 코드를 도달할 수 없는 것으로 표시합니다.

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // This function will never return successfully.
    // It will always throw an exception.
}

fun main() {
    // Creates an instance of Person with 'name' as null
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 's' is guaranteed to be initialized at this point
    println(s)
}
```
{kotlin-runnable="true"}

[`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 함수는 `Nothing` 타입을 사용하며,
향후 구현이 필요한 코드 영역을 강조하기 위한 플레이스홀더 역할을 합니다.

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // This throws a NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

보시다시피, `TODO()` 함수는 항상 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 예외를 발생시킵니다.

## 예외 클래스

`RuntimeException` 클래스의 모든 서브클래스인 Kotlin의 몇 가지 일반적인 예외 타입을 살펴보겠습니다.

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/): 이 예외는 0으로 나누는 것과 같이 산술 연산을 수행할 수 없을 때 발생합니다.

    ```kotlin
    val example = 2 / 0 // throws ArithmeticException
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/): 이 예외는 배열이나 문자열과 같은 특정 종류의 인덱스가 범위를 벗어났음을 나타내기 위해 발생합니다.

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // throws IndexOutOfBoundsException
    ```

    > 이 예외를 피하려면 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 함수와 같은 더 안전한 대안을 사용하세요.
    >
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // Returns null, instead of IndexOutOfBoundsException
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    >
{style="note"}

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/): 이 예외는 특정 컬렉션에 존재하지 않는 요소에 접근할 때 발생합니다.
    [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 또는 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)와 같이 특정 요소를 예상하는 메서드를 사용할 때 발생합니다.

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // throws NoSuchElementException
    ```

    > 이 예외를 피하려면 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 함수와 같은 더 안전한 대안을 사용하세요.
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // Returns null, instead of NoSuchElementException
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
{style="note"}

*   [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/): 이 예외는 문자열을 숫자 타입으로 변환하려고 시도했지만 문자열의 형식이 적절하지 않을 때 발생합니다.

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // throws NumberFormatException
    ```

    > 이 예외를 피하려면 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 함수와 같은 더 안전한 대안을 사용하세요.
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // Returns null, instead of NumberFormatException
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
{style="note"}

*   [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/): 이 예외는 애플리케이션이 `null` 값을 가진 객체 참조를 사용하려고 시도할 때 발생합니다.
    Kotlin의 null 안전 기능은 `NullPointerException`의 위험을 크게 줄여주지만,
    `!!` 연산자의 의도적인 사용을 통해서나 Kotlin의 null 안전 기능이 없는 Java와 상호 작용할 때 여전히 발생할 수 있습니다.

    ```kotlin
    val text: String? = null
    println(text!!.length)  // throws a NullPointerException
    ```

Kotlin의 모든 예외는 비검사(unchecked)이므로 명시적으로 잡을 필요는 없지만, 원한다면 잡을 수 있는 유연성이 있습니다.

### 예외 계층 구조

Kotlin 예외 계층 구조의 최상위는 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 클래스입니다.
이 클래스에는 [`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/)와 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)이라는 두 개의 직접적인 서브클래스가 있습니다.

*   `Error` 서브클래스는 애플리케이션이 스스로 복구할 수 없는 심각한 근본적인 문제를 나타냅니다.
    이러한 문제들은 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 또는 `StackOverflowError`와 같이 일반적으로 처리하려고 시도하지 않을 것입니다.

*   `Exception` 서브클래스는 처리하고자 할 수 있는 조건에 사용됩니다. `Exception` 타입의 서브타입인
    [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 및 `IOException` (입력/출력 예외)과 같은 것들은
    애플리케이션의 예외적인 이벤트를 처리합니다.

![Exception hierarchy - the Throwable class](throwable.svg){width=700}

`RuntimeException`은 주로 프로그램 코드의 불충분한 검사로 인해 발생하며 프로그래밍 방식으로 예방할 수 있습니다.
Kotlin은 `NullPointerException`과 같은 일반적인 `RuntimeException`을 방지하는 데 도움을 주며,
0으로 나누는 것과 같은 잠재적인 런타임 오류에 대해 컴파일 시간 경고를 제공합니다. 다음 그림은 `RuntimeException`에서 파생된 서브타입의 계층 구조를 보여줍니다.

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## 스택 트레이스

_스택 트레이스(stack trace)_는 런타임 환경에서 생성되는 보고서로, 디버깅에 사용됩니다.
이는 프로그램의 특정 지점, 특히 오류나 예외가 발생한 지점까지 이어지는 함수 호출 순서를 보여줍니다.

JVM 환경에서 예외로 인해 스택 트레이스가 자동으로 출력되는 예시를 살펴보겠습니다.

```kotlin
fun main() {
//sampleStart    
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

이 코드를 JVM 환경에서 실행하면 다음과 같은 출력이 생성됩니다.

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

첫 번째 줄은 예외 설명이며, 다음을 포함합니다.

*   예외 타입: `java.lang.ArithmeticException`
*   스레드: `main`
*   예외 메시지: `"This is an arithmetic exception!"`

예외 설명 뒤에 `at`으로 시작하는 각 줄은 스택 트레이스입니다. 한 줄을 _스택 트레이스 요소_ 또는 _스택 프레임(stack frame)_이라고 합니다.

*   `at MainKt.main (Main.kt:3)`: 이는 메서드 이름(`MainKt.main`)과 메서드가 호출된 소스 파일 및 줄 번호(`Main.kt:3`)를 보여줍니다.
*   `at MainKt.main (Main.kt)`: 이는 `Main.kt` 파일의 `main()` 함수에서 예외가 발생함을 보여줍니다.

## Java, Swift, Objective-C와의 예외 상호 운용성

Kotlin은 모든 예외를 비검사(unchecked)로 처리하므로, 검사(checked) 예외와 비검사(unchecked) 예외를 구별하는 언어에서 이러한 예외가 호출될 때 복잡성을 초래할 수 있습니다.
Kotlin과 Java, Swift, Objective-C와 같은 언어 간의 이러한 예외 처리 불일치를 해결하기 위해
[`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 어노테이션을 사용할 수 있습니다.
이 어노테이션은 호출자에게 가능한 예외에 대해 알립니다.
자세한 내용은 [Java에서 Kotlin 호출하기](java-to-kotlin-interop.md#checked-exceptions) 및
[Swift/Objective-C와의 상호 운용성](native-objc-interop.md#errors-and-exceptions)을 참조하세요.