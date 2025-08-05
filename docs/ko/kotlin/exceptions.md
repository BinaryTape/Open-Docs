[//]: # (title: 예외)

런타임 오류가 발생하여 프로그램 실행을 방해할 수 있는 경우에도 예외는 코드가 더 예측 가능하게 실행되도록 돕습니다.
코틀린은 기본적으로 모든 예외를 _비검사 예외_로 처리합니다.
비검사 예외는 예외 처리 과정을 단순화합니다. 예외를 잡을 수는 있지만, 명시적으로 처리하거나 [선언할](java-to-kotlin-interop.md#checked-exceptions) 필요는 없습니다.

> 자바, Swift, Objective-C와 상호 운용할 때 코틀린이 예외를 처리하는 방법에 대해 [자바, Swift, Objective-C와의 예외 상호 운용](#exception-interoperability-with-java-swift-and-objective-c) 섹션에서 자세히 알아보세요.
>
{style="tip"}

예외를 다루는 것은 크게 두 가지 주요 작업으로 구성됩니다.

*   **예외 발생시키기:** 문제가 발생했음을 나타냅니다.
*   **예외 잡기:** 문제를 해결하거나 개발자 또는 애플리케이션 사용자에게 알림으로써 예상치 못한 예외를 수동으로 처리합니다.

예외는 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 클래스의 서브클래스로 표현되며, [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 클래스는 다시 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 클래스의 서브클래스입니다. 계층 구조에 대한 자세한 내용은 [예외 계층](#exception-hierarchy) 섹션을 참조하세요. `Exception`은 [`오픈 클래스`](inheritance.md)이므로, 애플리케이션의 특정 요구 사항에 맞춰 [사용자 정의 예외](#create-custom-exceptions)를 생성할 수 있습니다.

## 예외 발생시키기

`throw` 키워드를 사용하여 수동으로 예외를 발생시킬 수 있습니다.
예외를 발생시키는 것은 코드에서 예상치 못한 런타임 오류가 발생했음을 나타냅니다.
예외는 [객체](classes.md#creating-instances-of-classes)이며, 예외를 발생시키면 예외 클래스의 인스턴스가 생성됩니다.

매개변수 없이 예외를 발생시킬 수 있습니다.

```kotlin
throw IllegalArgumentException()
```

문제의 원인을 더 잘 이해하기 위해 사용자 정의 메시지와 원래 원인과 같은 추가 정보를 포함할 수 있습니다.

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// Throws an IllegalArgumentException if userInput is negative 
// Additionally, it shows the original cause, represented by the cause IllegalStateException
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

이 예제에서 사용자가 음수 값을 입력하면 `IllegalArgumentException`이 발생합니다.
사용자 정의 오류 메시지를 생성하고 예외의 원래 원인(`cause`)을 유지할 수 있으며, 이는 [스택 트레이스](#stack-trace)에 포함됩니다.

### 사전 조건 함수를 사용하여 예외 발생시키기

코틀린은 사전 조건 함수를 사용하여 예외를 자동으로 발생시키는 추가적인 방법을 제공합니다.
사전 조건 함수는 다음과 같습니다.

| 사전 조건 함수           | 사용 사례                  | 발생하는 예외                                                                                                 |
|--------------------------|--------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 사용자 입력 유효성 검사      | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 객체 또는 변수 상태 유효성 검사 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 잘못된 상태 또는 조건 표시  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

이 함수들은 특정 조건이 충족되지 않으면 프로그램의 흐름이 계속될 수 없는 상황에 적합합니다.
이는 코드를 간소화하고 이러한 검사 처리를 효율적으로 만듭니다.

#### require() 함수

[`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 함수는 함수의 동작에 필수적인 입력 인자를 검증할 때 사용하며, 해당 인자가 유효하지 않으면 함수가 진행될 수 없습니다.

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

> `require()` 함수는 컴파일러가 [스마트 캐스팅](typecasts.md#smart-casts)을 수행하도록 합니다.
> 성공적인 검사 후 변수는 자동으로 널 불가능(non-nullable) 타입으로 캐스팅됩니다.
> 이 함수들은 변수가 계속 진행하기 전에 null이 아닌지 확인하기 위한 널 가능성(nullability) 검사에 자주 사용됩니다. 예를 들어:
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

#### check() 함수

[`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 함수는 객체 또는 변수의 상태를 검증하는 데 사용됩니다.
검사가 실패하면 해결해야 할 논리 오류를 나타냅니다.

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

> `check()` 함수는 컴파일러가 [스마트 캐스팅](typecasts.md#smart-casts)을 수행하도록 합니다.
> 성공적인 검사 후 변수는 자동으로 널 불가능(non-nullable) 타입으로 캐스팅됩니다.
> 이 함수들은 변수가 계속 진행하기 전에 null이 아닌지 확인하기 위한 널 가능성(nullability) 검사에 자주 사용됩니다. 예를 들어:
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

#### error() 함수

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 함수는 논리적으로 발생해서는 안 되는 코드의 잘못된 상태 또는 조건을 알리는 데 사용됩니다.
이 함수는 코드가 예상치 못한 상태를 만나는 경우와 같이 코드에서 의도적으로 예외를 발생시키고자 할 때 적합합니다.
이 함수는 `when` 표현식에서 특히 유용하며, 논리적으로 발생해서는 안 되는 경우를 명확하게 처리하는 방법을 제공합니다.

다음 예제에서는 `error()` 함수가 정의되지 않은 사용자 역할을 처리하는 데 사용됩니다.
역할이 미리 정의된 역할 중 하나가 아닌 경우, [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)이 발생합니다.

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

## try-catch 블록을 사용하여 예외 처리하기

예외가 발생하면 프로그램의 정상적인 실행이 중단됩니다.
`try` 및 `catch` 키워드를 사용하여 예외를 우아하게 처리하여 프로그램을 안정적으로 유지할 수 있습니다.
`try` 블록은 예외를 발생시킬 수 있는 코드를 포함하며, `catch` 블록은 예외가 발생하면 이를 잡고 처리합니다.
예외는 특정 타입 또는 예외의 [상위 클래스](inheritance.md)와 일치하는 첫 번째 `catch` 블록에 의해 잡힙니다.

`try` 및 `catch` 키워드를 함께 사용하는 방법은 다음과 같습니다.

```kotlin
try {
    // Code that may throw an exception
} catch (e: SomeException) {
    // Code for handling the exception
}
```

`try-catch`를 표현식으로 사용하는 것이 일반적인 접근 방식이며, 이를 통해 `try` 블록 또는 `catch` 블록에서 값을 반환할 수 있습니다.

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
다양한 예외를 구별하여 처리하기 위해 필요한 만큼 `catch` 블록을 추가할 수 있습니다.
여러 `catch` 블록이 있을 때는 코드에서 위에서 아래로 특정 예외부터 덜 특정적인 예외 순으로 정렬하는 것이 중요합니다.
이 순서는 프로그램의 실행 흐름과 일치합니다.

[사용자 정의 예외](#create-custom-exceptions)를 사용한 다음 예제를 고려해보세요.

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

`WithdrawalException`을 처리하는 일반 `catch` 블록은 `InsufficientFundsException`과 같은 특정 예외를 포함하여 해당 타입의 모든 예외를 잡지만, 더 특정적인 `catch` 블록에 의해 먼저 잡히지 않는 한 그렇습니다.

### finally 블록

`finally` 블록에는 `try` 블록이 성공적으로 완료되든 예외를 발생시키든 상관없이 항상 실행되는 코드가 포함됩니다.
`finally` 블록을 사용하면 `try` 및 `catch` 블록 실행 후 코드를 정리할 수 있습니다.
이는 `finally`가 파일 또는 네트워크 연결과 같은 리소스가 올바르게 닫히거나 해제되도록 보장하기 때문에 특히 중요합니다.

일반적으로 `try-catch-finally` 블록을 함께 사용하는 방법은 다음과 같습니다.

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
`finally` 블록은 항상 실행되지만, `try-catch` 블록의 결과는 변경하지 않습니다.

예를 들어 설명해 보겠습니다.

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

> 코틀린에서 `FileInputStream` 또는 `FileOutputStream`과 같은 파일 스트림과 같이 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 인터페이스를 구현하는 리소스를 관리하는 관용적인 방법은 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 함수를 사용하는 것입니다.
> 이 함수는 예외 발생 여부와 관계없이 코드 블록이 완료되면 리소스를 자동으로 닫아 `finally` 블록의 필요성을 없앱니다.
> 결과적으로 코틀린은 리소스 관리를 위해 [자바의 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)와 같은 특별한 문법을 요구하지 않습니다.
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // After this block, the .use function automatically calls writer.close(), similar to a finally block
> }
> ```
>
{style="note"}

코드가 예외를 처리하지 않고 리소스 정리가 필요한 경우, `catch` 블록 없이 `finally` 블록과 함께 `try`를 사용할 수도 있습니다.

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

코틀린에서는 특정 요구 사항에 따라 `catch` 블록만, `finally` 블록만, 또는 둘 다 사용할 수 있는 유연성이 있지만, `try` 블록은 항상 적어도 하나의 `catch` 블록 또는 `finally` 블록과 함께 사용되어야 합니다.

## 사용자 정의 예외 생성

코틀린에서는 내장 `Exception` 클래스를 확장하는 클래스를 생성하여 사용자 정의 예외를 정의할 수 있습니다.
이를 통해 애플리케이션의 요구 사항에 맞춰 더 구체적인 오류 타입을 생성할 수 있습니다.

사용자 정의 예외를 생성하려면 `Exception`을 확장하는 클래스를 정의할 수 있습니다.

```kotlin
class MyException: Exception("My message")
```

이 예제에는 기본 오류 메시지 "My message"가 있지만, 원한다면 비워둘 수도 있습니다.

> 코틀린의 예외는 생성 컨텍스트에 특정한 정보를 담고 있는 상태 저장(stateful) 객체이며, 이를 [스택 트레이스](#stack-trace)라고 합니다.
> [객체 선언](object-declarations.md#object-declarations-overview)을 사용하여 예외를 생성하는 것을 피하세요.
> 대신, 예외가 필요할 때마다 새로운 인스턴스를 생성하세요.
> 이렇게 하면 예외의 상태가 특정 컨텍스트를 정확하게 반영하도록 보장할 수 있습니다.
>
{style="tip"}

사용자 정의 예외는 `ArithmeticException` 서브클래스와 같이 기존 예외 서브클래스의 서브클래스일 수도 있습니다.

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 사용자 정의 예외의 서브클래스를 생성하려면 부모 클래스를 `open`으로 선언해야 합니다. 왜냐하면 [클래스는 기본적으로 final](inheritance.md)이며, 그렇지 않으면 서브클래스화할 수 없기 때문입니다.
>
> 예시:
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

사용자 정의 예외는 내장 예외와 동일하게 작동합니다. `throw` 키워드를 사용하여 발생시키고 `try-catch-finally` 블록으로 처리할 수 있습니다. 예를 들어 설명해 보겠습니다.

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

다양한 오류 시나리오를 가진 애플리케이션에서 예외 계층 구조를 생성하면 코드를 더 명확하고 구체적으로 만드는 데 도움이 될 수 있습니다.
이를 위해 [추상 클래스](classes.md#abstract-classes) 또는 [봉인 클래스](sealed-classes.md#constructors)를 공통 예외 기능의 기반으로 사용하고, 세부적인 예외 타입을 위한 특정 서브클래스를 생성할 수 있습니다.
또한, 기본값을 가진 매개변수를 포함하는 사용자 정의 예외는 유연성을 제공하여 다양한 메시지로 초기화할 수 있게 하고, 이는 더 세분화된 오류 처리를 가능하게 합니다.

예외 계층 구조의 기반으로 봉인 클래스 `AccountException`을 사용하고, 더 나은 예외 세부 정보를 위해 기본값을 가진 매개변수 사용을 보여주는 서브클래스 `APIKeyExpiredException`을 사용한 예시를 살펴보겠습니다.

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

## Nothing 타입

코틀린에서 모든 표현식은 타입을 가집니다.
`throw IllegalArgumentException()` 표현식의 타입은 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)입니다. 이 타입은 모든 다른 타입의 서브타입인 내장 타입으로, [바텀 타입](https://en.wikipedia.org/wiki/Bottom_type)이라고도 알려져 있습니다.
이는 `Nothing`이 다른 어떤 타입이 예상되는 곳에서도 반환 타입 또는 제네릭 타입으로 사용될 수 있으며, 타입 오류를 일으키지 않는다는 것을 의미합니다.

`Nothing`은 항상 예외를 발생시키거나 무한 루프와 같은 끝없는 실행 경로로 진입하여 성공적으로 완료되지 않는 함수 또는 표현식을 나타내는 데 사용되는 코틀린의 특별한 타입입니다.
`Nothing`을 사용하여 아직 구현되지 않았거나 항상 예외를 발생시키도록 설계된 함수를 표시할 수 있으며, 이는 컴파일러와 코드 독자 모두에게 의도를 명확히 전달합니다.
컴파일러가 함수 시그니처에서 `Nothing` 타입을 추론하면 경고를 보냅니다.
`Nothing`을 반환 타입으로 명시적으로 정의하면 이 경고를 없앨 수 있습니다.

이 코틀린 코드는 `Nothing` 타입의 사용을 보여주며, 컴파일러는 함수 호출 다음의 코드를 도달 불가능한 것으로 표시합니다.

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

`Nothing` 타입을 사용하는 코틀린의 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 함수는 향후 구현이 필요한 코드 영역을 강조하기 위한 플레이스홀더 역할을 합니다.

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

코틀린에서 발견되는 몇 가지 일반적인 예외 타입에 대해 살펴보겠습니다. 이들은 모두 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 클래스의 서브클래스입니다.

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/): 이 예외는 0으로 나누는 것과 같이 산술 연산을 수행할 수 없을 때 발생합니다.

    ```kotlin
    val example = 2 / 0 // throws ArithmeticException
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/): 이 예외는 배열이나 문자열과 같은 특정 인덱스가 범위를 벗어났음을 나타내기 위해 발생합니다.

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

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/): 이 예외는 특정 컬렉션에 존재하지 않는 요소에 접근할 때 발생합니다. [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 또는 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)와 같이 특정 요소를 기대하는 메서드를 사용할 때 발생합니다.

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

*   [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/): 이 예외는 문자열을 숫자 타입으로 변환하려고 시도했지만 문자열이 적절한 형식을 갖추지 못했을 때 발생합니다.

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
    코틀린의 널 안정성 기능이 `NullPointerException`의 위험을 크게 줄여주지만, `!!` 연산자를 의도적으로 사용하거나 코틀린의 널 안정성이 없는 자바와 상호 운용할 때 여전히 발생할 수 있습니다.

    ```kotlin
    val text: String? = null
    println(text!!.length)  // throws a NullPointerException
    ```

코틀린의 모든 예외는 비검사 예외이며 명시적으로 잡을 필요는 없지만, 원한다면 여전히 유연하게 잡을 수 있습니다.

### 예외 계층

코틀린 예외 계층의 최상위는 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 클래스입니다.
이 클래스는 두 개의 직접적인 서브클래스인 [`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/)와 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)을 가집니다.

*   `Error` 서브클래스는 애플리케이션이 자체적으로 복구하기 어려울 수 있는 심각한 근본적인 문제를 나타냅니다. 이들은 일반적으로 처리하려고 시도하지 않는 문제로, [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 또는 `StackOverflowError`와 같습니다.

*   `Exception` 서브클래스는 처리하고자 할 수 있는 조건을 위해 사용됩니다. [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 및 `IOException`(입출력 예외)과 같은 `Exception` 타입의 서브타입은 애플리케이션의 예외적인 이벤트를 다룹니다.

![Exception hierarchy - the Throwable class](throwable.svg){width=700}

`RuntimeException`은 일반적으로 프로그램 코드의 불충분한 검사로 인해 발생하며 프로그래밍적으로 방지할 수 있습니다.
코틀린은 `NullPointerException`과 같은 일반적인 `RuntimeException`을 방지하는 데 도움을 주며, 0으로 나누기와 같은 잠재적인 런타임 오류에 대해 컴파일 시간 경고를 제공합니다.
다음 그림은 `RuntimeException`에서 파생된 서브타입의 계층 구조를 보여줍니다.

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## 스택 트레이스

_스택 트레이스_는 런타임 환경에서 생성되는 보고서로, 디버깅에 사용됩니다.
이는 프로그램에서 특정 지점, 특히 오류 또는 예외가 발생한 지점까지 이어지는 함수 호출 시퀀스를 보여줍니다.

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

예외 설명 뒤에 `at`으로 시작하는 각 줄은 스택 트레이스입니다. 한 줄을 _스택 트레이스 요소_ 또는 _스택 프레임_이라고 합니다.

*   `at MainKt.main (Main.kt:3)`: 이는 메서드 이름(`MainKt.main`)과 메서드가 호출된 소스 파일 및 줄 번호(`Main.kt:3`)를 보여줍니다.
*   `at MainKt.main (Main.kt)`: 이는 `Main.kt` 파일의 `main()` 함수에서 예외가 발생함을 보여줍니다.

## 자바, Swift, Objective-C와의 예외 상호 운용

코틀린은 모든 예외를 비검사 예외로 처리하므로, 검사 예외와 비검사 예외를 구분하는 언어에서 이러한 예외가 호출될 때 복잡성을 초래할 수 있습니다.
코틀린과 자바, Swift, Objective-C와 같은 언어 간의 예외 처리 불일치를 해결하기 위해 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 어노테이션을 사용할 수 있습니다.
이 어노테이션은 호출자에게 가능한 예외에 대해 알려줍니다.
자세한 내용은 [자바에서 코틀린 호출하기](java-to-kotlin-interop.md#checked-exceptions) 및 [Swift/Objective-C와의 상호 운용성](native-objc-interop.md#errors-and-exceptions)을 참조하세요.