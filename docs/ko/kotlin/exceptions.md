---
title: 예외
---
예외는 런타임 오류가 발생하여 프로그램 실행을 중단할 수 있는 경우에도 코드가 더 예측 가능하게 실행되도록 도와줍니다.
Kotlin은 기본적으로 모든 예외를 _unchecked_로 처리합니다.
Unchecked 예외는 예외 처리 프로세스를 간소화합니다. 예외를 catch할 수 있지만 명시적으로 처리하거나 [선언](java-to-kotlin-interop#checked-exceptions)할 필요는 없습니다.

:::note
Java, Swift 및 Objective-C와 상호 작용할 때 Kotlin이 예외를 처리하는 방법에 대한 자세한 내용은
[Java, Swift 및 Objective-C와의 예외 상호 운용성](#exception-interoperability-with-java-swift-and-objective-c) 섹션을 참조하십시오.

예외 작업은 주로 다음 두 가지 작업으로 구성됩니다.

* **예외 발생:** 문제가 발생한 시점을 나타냅니다.
* **예외 catch:** 문제를 해결하거나 개발자 또는 애플리케이션 사용자에게 알림으로써 예기치 않은 예외를 수동으로 처리합니다.

예외는 
[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 클래스의 하위 클래스로 표시되며, 이 클래스는 
[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 클래스의 하위 클래스입니다. 
계층 구조에 대한 자세한 내용은 [예외 계층 구조](#exception-hierarchy) 섹션을 참조하십시오. `Exception`은 [`open 
class`](inheritance)이므로 애플리케이션의 특정 요구 사항에 맞게 [사용자 지정 예외](#create-custom-exceptions)를 만들 수 있습니다.

## 예외 발생

`throw` 키워드를 사용하여 수동으로 예외를 발생시킬 수 있습니다.
예외를 발생시키는 것은 코드에서 예기치 않은 런타임 오류가 발생했음을 나타냅니다.
예외는 [객체](classes#creating-instances-of-classes)이며, 예외를 발생시키는 것은 예외 클래스의 인스턴스를 만드는 것입니다.

매개변수 없이 예외를 발생시킬 수 있습니다.

```kotlin
throw IllegalArgumentException()
```

문제의 원인을 더 잘 이해하려면 사용자 지정 메시지 및 원래 원인과 같은 추가 정보를 포함하십시오.

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// userInput이 음수이면 IllegalArgumentException을 발생시킵니다.
// 또한 원인인 IllegalStateException으로 표시되는 원래 원인을 보여줍니다.
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

이 예제에서는 사용자가 음수 값을 입력하면 `IllegalArgumentException`이 발생합니다.
사용자 지정 오류 메시지를 만들고 예외의 원래 원인(`cause`)을 유지할 수 있습니다.
이 원인은 [스택 추적](#stack-trace)에 포함됩니다.

### 전제 조건 함수로 예외 발생

Kotlin은 전제 조건 함수를 사용하여 자동으로 예외를 발생시키는 추가적인 방법을 제공합니다.
전제 조건 함수에는 다음이 포함됩니다.

| 전제 조건 함수            | 사용 사례                                 | 발생되는 예외                                                                                                 |
|----------------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 사용자 입력 유효성 검사               | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 객체 또는 변수 상태 유효성 검사 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 잘못된 상태 또는 조건을 나타냅니다.  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

이러한 함수는 특정 조건이 충족되지 않으면 프로그램의 흐름이 계속될 수 없는 상황에 적합합니다.
이를 통해 코드를 간소화하고 이러한 검사를 효율적으로 처리할 수 있습니다.

#### require() 함수

함수 작동에 중요한 입력 인수를 검증하는 데 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 함수를 사용합니다.
이러한 인수가 유효하지 않으면 함수가 진행될 수 없습니다.

`require()`의 조건이 충족되지 않으면 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)이 발생합니다.

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // IllegalArgumentException으로 실패합니다.
    println(getIndices(-1))
    
    // 작동하는 예제를 보려면 아래 줄의 주석 처리를 제거하십시오.
    // println(getIndices(3))
    // [1, 2, 3]
}
```

`require()` 함수를 사용하면 컴파일러가 [스마트 캐스팅](typecasts#smart-casts)을 수행할 수 있습니다.
성공적인 검사 후에는 변수가 자동으로 non-nullable 유형으로 캐스팅됩니다.
이러한 함수는 변수가 진행하기 전에 null이 아닌지 확인하기 위해 null 허용 여부 검사에 자주 사용됩니다. 예를 들면 다음과 같습니다.

```kotlin
fun printNonNullString(str: String?) {
    // Null 허용 여부 검사
    require(str != null) 
    // 이 성공적인 검사 후에는 'str'이 non-null임이 보장되고 
    // 자동으로 non-nullable String으로 스마트 캐스팅됩니다.
    println(str.length)
}
```

:::

#### check() 함수

객체 또는 변수의 상태를 검증하려면 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 함수를 사용합니다.
검사가 실패하면 해결해야 할 논리적 오류를 나타냅니다.

`check()` 함수에 지정된 조건이 `false`이면 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)이 발생합니다.

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 아래 줄의 주석 처리를 제거하면 프로그램이 IllegalStateException으로 실패합니다.
    // getStateValue()

    someState = ""

    // 아래 줄의 주석 처리를 제거하면 프로그램이 IllegalStateException으로 실패합니다.
    // getStateValue() 
    someState = "non-empty-state"

    // "non-empty-state"를 출력합니다.
    println(getStateValue())
}
```

:::note
`check()` 함수를 사용하면 컴파일러가 [스마트 캐스팅](typecasts#smart-casts)을 수행할 수 있습니다.
성공적인 검사 후에는 변수가 자동으로 non-nullable 유형으로 캐스팅됩니다.
이러한 함수는 변수가 진행하기 전에 null이 아닌지 확인하기 위해 null 허용 여부 검사에 자주 사용됩니다. 예를 들면 다음과 같습니다.

```kotlin
fun printNonNullString(str: String?) {
    // Null 허용 여부 검사
    check(str != null) 
    // 이 성공적인 검사 후에는 'str'이 non-null임이 보장되고 
    // 자동으로 non-nullable String으로 스마트 캐스팅됩니다.
    println(str.length)
}
```

:::

#### error() 함수

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 함수는 코드에서 발생해서는 안 되는 잘못된 상태 또는 조건을 알리는 데 사용됩니다.
코드가 예상치 못한 상태를 만날 때와 같이 코드에서 의도적으로 예외를 발생시키려는 시나리오에 적합합니다.
이 함수는 특히 `when` 식에서 논리적으로 발생해서는 안 되는 경우를 처리하는 명확한 방법을 제공하여 유용합니다.

다음 예제에서 `error()` 함수는 정의되지 않은 사용자 역할을 처리하는 데 사용됩니다.
역할이 미리 정의된 역할 중 하나가 아니면 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)이 발생합니다.

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" `->` println("${user.name} is an admin.")
        "editor" `->` println("${user.name} is an editor.")
        "viewer" `->` println("${user.name} is a viewer.")
        else `->` error("Undefined role: ${user.role}")
    }
}

fun main() {
    // 예상대로 작동합니다.
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // IllegalStateException을 발생시킵니다.
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```

## try-catch 블록을 사용하여 예외 처리

예외가 발생하면 프로그램의 정상적인 실행이 중단됩니다.
`try` 및 `catch` 키워드를 사용하여 예외를 정상적으로 처리하여 프로그램을 안정적으로 유지할 수 있습니다.
`try` 블록에는 예외를 발생시킬 수 있는 코드가 포함되어 있고, `catch` 블록은 예외가 발생하면 예외를 catch하고 처리합니다.
예외는 특정 유형 또는 예외의 [상위 클래스](inheritance)와 일치하는 첫 번째 `catch` 블록에 의해 catch됩니다.

다음은 `try` 및 `catch` 키워드를 함께 사용하는 방법입니다.

```kotlin
try {
    // 예외를 발생시킬 수 있는 코드
} catch (e: SomeException) {
    // 예외를 처리하는 코드
}
```

`try-catch`를 표현식으로 사용하는 것이 일반적인 접근 방식이므로 `try` 블록 또는 `catch` 블록에서 값을 반환할 수 있습니다.

```kotlin
fun main() {
    val num: Int = try {

        // count()가 성공적으로 완료되면 해당 반환 값이 num에 할당됩니다.
        count()
        
    } catch (e: ArithmeticException) {
        
        // count()가 예외를 발생시키면 catch 블록은 -1을 반환하고 
        // 이는 num에 할당됩니다.
        -1
    }
    println("Result: $num")
}

// ArithmeticException을 발생시킬 수 있는 함수를 시뮬레이션합니다.
fun count(): Int {
    
    // 다른 값을 num에 반환하려면 이 값을 변경하십시오.
    val a = 0
    
    return 10 / a
}
```

동일한 `try` 블록에 대해 여러 개의 `catch` 처리기를 사용할 수 있습니다.
서로 다른 예외를 뚜렷하게 처리하는 데 필요한 만큼 `catch` 블록을 추가할 수 있습니다.
여러 개의 `catch` 블록이 있는 경우 코드에서 위에서 아래로 순서를 따라 가장
구체적인 예외부터 가장 구체적이지 않은 예외 순으로 정렬하는 것이 중요합니다.
이 순서는 프로그램의 실행 흐름과 일치합니다.

[사용자 지정 예외](#create-custom-exceptions)가 있는 이 예제를 살펴보십시오.

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

    // 다른 시나리오를 테스트하려면 이 값을 변경하십시오.
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // catch 블록의 순서가 중요합니다!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```

일반적인 catch 블록인 `WithdrawalException` 처리는 `InsufficientFundsException`과 같은 특정 예외를 포함하여 해당 유형의 모든 예외를 catch합니다.
단, 더 구체적인 catch 블록에서 먼저 catch하는 경우는 예외입니다.

### finally 블록

`finally` 블록에는 `try` 블록이 성공적으로 완료되었는지 여부와 관계없이 항상 실행되는 코드가 포함되어 있습니다.
`finally` 블록을 사용하면 `try` 및 `catch` 블록 실행 후 코드를 정리할 수 있습니다.
특히 파일 또는 네트워크 연결과 같은 리소스로 작업할 때 `finally`는 리소스가 적절하게 닫히거나 해제되도록 보장하므로 중요합니다.

다음은 일반적으로 `try-catch-finally` 블록을 함께 사용하는 방법입니다.

```kotlin
try {
    // 예외를 발생시킬 수 있는 코드
}
catch (e: YourException) {
    // 예외 처리기
}
finally {
    // 항상 실행되는 코드
}
```

`try` 표현식의 반환된 값은 `try` 또는 `catch` 블록에서 마지막으로 실행된 표현식에 따라 결정됩니다.
예외가 발생하지 않으면 결과는 `try` 블록에서 가져오고, 예외가 처리되면 `catch` 블록에서 가져옵니다.
`finally` 블록은 항상 실행되지만 `try-catch` 블록의 결과를 변경하지는 않습니다.

다음을 보여주는 예제를 살펴보겠습니다.

```kotlin
fun divideOrNull(a: Int): Int {
    
    // try 블록은 항상 실행됩니다.
    // 여기서 예외(0으로 나누기)가 발생하면 catch 블록으로 즉시 이동합니다.
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // ArithmeticException(a ==0인 경우 0으로 나누기) 때문에 catch 블록이 실행됩니다.
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // 다른 결과를 얻으려면 이 값을 변경하십시오. ArithmeticException은 -1을 반환합니다.
    divideOrNull(0)
}
```

:::note
Kotlin에서 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 인터페이스를 구현하는 리소스(예: `FileInputStream` 또는 `FileOutputStream`과 같은 파일 스트림)를 관리하는 관용적인 방법은 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 함수를 사용하는 것입니다.
이 함수는 코드 블록이 완료되면 예외가 발생했는지 여부에 관계없이 리소스를 자동으로 닫으므로 `finally` 블록이 필요하지 않습니다.
결과적으로 Kotlin은 리소스 관리를 위해 [Java의 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)와 같은 특수한 구문이 필요하지 않습니다.

```kotlin
FileWriter("test.txt").use { writer `->`
writer.write("some text") 
// 이 블록 후에는 .use 함수가 finally 블록과 유사하게 자동으로 writer.close()를 호출합니다.
}
```

:::

예외를 처리하지 않고 리소스 정리만 필요한 경우 `catch` 블록 없이 `finally` 블록과 함께 `try`를 사용할 수도 있습니다.

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // 리소스 사용을 시뮬레이션합니다.
        // 이는 0으로 나누기가 발생하면 ArithmeticException을 발생시킵니다.
        val result = 100 / 0
        
        // 예외가 발생하면 이 줄이 실행되지 않습니다.
        println("Result: $result") 
    }
    
    fun close() { 
        println("Resource closed") 
    }
}

fun main() { 
    val resource = MockResource()

    try {
        
        // 리소스 사용을 시도합니다.
        resource.use()
        
    } finally {
        
        // 예외가 발생하더라도 리소스가 항상 닫히도록 보장합니다.
        resource.close()
    }

    // 예외가 발생하면 이 줄이 출력되지 않습니다.
    println("End of the program")

}
```

보시다시피 `finally` 블록은 예외 발생 여부에 관계없이 리소스가 닫히도록 보장합니다.

Kotlin에서는 특정 요구 사항에 따라 `catch` 블록만, `finally` 블록만 또는 둘 다 사용하는 유연성을 제공하지만 `try` 블록에는 항상 하나 이상의 `catch` 블록 또는 `finally` 블록이 수반되어야 합니다.

## 사용자 지정 예외 생성

Kotlin에서는 기본 제공 `Exception` 클래스를 확장하는 클래스를 만들어 사용자 지정 예외를 정의할 수 있습니다.
이를 통해 애플리케이션의 요구 사항에 맞는 보다 구체적인 오류 유형을 만들 수 있습니다.

사용자 지정 예외를 만들려면 `Exception`을 확장하는 클래스를 정의하면 됩니다.

```kotlin
class MyException: Exception("My message")
```

이 예제에는 기본 오류 메시지인 "My message"가 있지만 원하는 경우 비워 둘 수 있습니다.

:::note
Kotlin의 예외는 [스택 추적](#stack-trace)이라고 하는 생성 컨텍스트에 특정한 정보를 전달하는 상태 저장 객체입니다.
[객체 선언](object-declarations#object-declarations-overview)을 사용하여 예외를 생성하지 마십시오.
대신, 예외가 필요할 때마다 예외의 새 인스턴스를 생성하십시오.
이렇게 하면 예외의 상태가 특정 컨텍스트를 정확하게 반영할 수 있습니다.

사용자 지정 예외는 `ArithmeticException` 하위 클래스와 같은 미리 존재하는 예외 하위 클래스의 하위 클래스일 수도 있습니다.

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

사용자 지정 예외의 하위 클래스를 만들려면 상위 클래스를 `open`으로 선언해야 합니다.
그렇지 않으면 [클래스가 기본적으로 final이기 때문에](inheritance) 하위 클래스로 만들 수 없습니다.

예를 들면 다음과 같습니다.

```kotlin
// 사용자 지정 예외를 하위 클래스로 만들 수 있도록 open 클래스로 선언합니다.
open class MyCustomException(message: String): Exception(message)

// 사용자 지정 예외의 하위 클래스를 만듭니다.
class SpecificCustomException: MyCustomException("Specific error message")
```

:::

사용자 지정 예외는 기본 제공 예외와 똑같이 동작합니다. `throw` 키워드를 사용하여 발생시키고 `try-catch-finally` 블록을 사용하여 처리할 수 있습니다. 다음을 보여주는 예제를 살펴보겠습니다.

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // 다른 예외를 가져오려면 이 함수의 값을 변경하십시오.
    myFunction(1)
}
```

다양한 오류 시나리오가 있는 애플리케이션에서
예외 계층 구조를 만들면 코드를 더 명확하고 구체적으로 만들 수 있습니다.
[추상 클래스](classes#abstract-classes) 또는
[봉인된 클래스](sealed-classes#constructors)를 공통 예외 기능의 기본으로 사용하고 자세한
예외 유형에 대한 특정 하위 클래스를 만듭니다.
또한 선택적 매개변수가 있는 사용자 지정 예외는 유연성을 제공하여 다양한 메시지로 초기화할 수 있으며,
이를 통해 보다 세분화된 오류 처리가 가능합니다.

봉인된 클래스 `AccountException`을 예외 계층 구조의 기반으로 사용하는 예제와 하위 클래스인 `APIKeyExpiredException`을 살펴보겠습니다.
이 클래스는 개선된 예외 세부 정보를 위해 선택적 매개변수를 사용하는 방법을 보여줍니다.

```kotlin

// 계정 관련 오류에 대한 예외 계층 구조의 기반으로 추상 클래스를 만듭니다.
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// AccountException의 하위 클래스를 만듭니다.
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// 사용자 지정 메시지 및 원인을 추가할 수 있는 AccountException의 하위 클래스를 만듭니다.
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// 다른 결과를 얻으려면 자리 표시자 함수의 값을 변경하십시오.
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true

// 계정 자격 증명 및 API 키를 검증합니다.
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 특정 원인으로 APIKeyExpiredException을 발생하는 예
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

## Nothing 유형

Kotlin에서는 모든 표현식에 유형이 있습니다.
`throw IllegalArgumentException()` 표현식의 유형은 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)입니다. 이 유형은 모든 다른 유형의 하위 유형인 기본 제공 유형으로, [하위 유형](https://en.wikipedia.org/wiki/Bottom_type)이라고도 합니다.
즉, `Nothing`은 유형 오류를 일으키지 않고 다른 유형이 예상되는 반환 유형 또는 제네릭 유형으로 사용할 수 있습니다.

`Nothing`은 예외를 항상 발생시키거나 무한 루프와 같은 끝없는 실행 경로로 들어가기 때문에 성공적으로 완료되지 않는 함수 또는 표현식을 나타내는 데 사용되는 Kotlin의 특수한 유형입니다.
`Nothing`을 사용하여 아직 구현되지 않았거나 항상 예외를 발생시키도록 설계된 함수를 표시하여 컴파일러와 코드 읽기 도구 모두에게 의도를 명확하게 알릴 수 있습니다.
컴파일러가 함수 서명에서 `Nothing` 유형을 추론하면 경고합니다.
`Nothing`을 반환 유형으로 명시적으로 정의하면 이 경고를 제거할 수 있습니다.

이 Kotlin 코드는 `Nothing` 유형의 사용을 보여주며, 여기서 컴파일러는 함수 호출 다음의 코드를 도달할 수 없는 것으로 표시합니다.

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // 이 함수는 성공적으로 반환되지 않습니다.
    // 항상 예외를 발생시킵니다.
}

fun main() {
    // 'name'이 null인 Person의 인스턴스를 만듭니다.
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 이 시점에서 's'는 초기화된 것이 보장됩니다.
    println(s)
}
```

`Nothing` 유형을 사용하는 Kotlin의 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 함수는 코드의 영역을 강조 표시하는 자리 표시자 역할을 합니다.
향후 구현이 필요합니다.

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // NotImplementedError를 발생시킵니다.
    println(result)
}
```

보시다시피 `TODO()` 함수는 항상 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 예외를 발생시킵니다.

## 예외 클래스

Kotlin에서 찾을 수 있는 몇 가지 일반적인 예외 유형을 살펴보겠습니다. 이러한 예외는 모두 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 클래스의 하위 클래스입니다.

* [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/): 이 예외는 0으로 나누기와 같이 산술 연산을 수행할 수 없는 경우에 발생합니다.

    ```kotlin
    val example = 2 / 0 // ArithmeticException을 발생시킵니다.
    ```

* [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/): 이 예외는 배열 또는 문자열과 같은 일부 인덱스가 범위를 벗어났음을 나타내기 위해 발생합니다.

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // IndexOutOfBoundsException을 발생시킵니다.
    ```

    > 이 예외를 방지하려면 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 함수와 같은 더 안전한 대안을 사용하십시오.
    >
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // IndexOutOfBoundsException 대신 null을 반환합니다.
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    >

* [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/): 이 예외는 특정 컬렉션에 존재하지 않는 요소에 액세스할 때 발생합니다.
이 예외는 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 또는 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)와 같이 특정 요소를 예상하는 메서드를 사용할 때 발생합니다.

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // NoSuchElementException을 발생시킵니다.
    ```

    > 이 예외를 방지하려면 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 함수와 같은 더 안전한 대안을 사용하십시오.
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // NoSuchElementException 대신 null을 반환합니다.
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >

* [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/): 이 예외는 문자열을 숫자 유형으로 변환하려고 시도하지만 문자열에 적절한 형식이 없는 경우에 발생합니다.

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // NumberFormatException을 발생시킵니다.
    ```

    > 이 예외를 방지하려면 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 함수와 같은 더 안전한 대안을 사용하십시오.
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // NumberFormatException 대신 null을 반환합니다.
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >

* [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/): 이 예외는 애플리케이션이 `null` 값을 가진 객체 참조를 사용하려고 할 때 발생합니다.
Kotlin의 null 안전 기능은 NullPointerException의 위험을 크게 줄이지만,
`!!` 연산자를 의도적으로 사용하거나 Kotlin의 null 안전 기능이 없는 Java와 상호 작용할 때 여전히 발생할 수 있습니다.

    ```kotlin
    val text: String? = null
    println(text!!.length)  // NullPointerException을 발생시킵니다.
    ```

Kotlin에서는 모든 예외가 unchecked이므로 명시적으로 catch할 필요는 없지만 원하는 경우 catch할 수 있는 유연성이 여전히 있습니다.

### 예외 계층 구조

Kotlin 예외 계층 구조의 루트는 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 클래스입니다.
여기에는 두 개의 직접 하위 클래스인 [`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/)와 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)이 있습니다.

* `Error` 하위 클래스는 애플리케이션이 스스로 복구할 수 없는 심각한 근본적인 문제를 나타냅니다.
이러한 문제는 일반적으로 처리하려고 시도하지 않는 문제로, [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 또는 `StackOverflowError`와 같습니다.

* `Exception` 하위 클래스는 처리하려는 조건에 사용됩니다.
`Exception` 유형의 하위 유형(예: [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 및 `IOException`(입력/출력 예외))은
애플리케이션의 예외적인 이벤트를 처리합니다.

<img src="/img/throwable.svg" alt="예외 계층 구조 - Throwable 클래스" width="700" style={{verticalAlign: 'middle'}}/>

`RuntimeException`은 일반적으로 프로그램 코드의 불충분한 검사로 인해 발생하며 프로그래밍 방식으로 방지할 수 있습니다.
Kotlin은 `NullPointerException`과 같은 일반적인 `RuntimeExceptions`을 방지하고 0으로 나누기와 같은 잠재적인 런타임 오류에 대한 컴파일 시간 경고를 제공합니다. 다음 그림은 `RuntimeException`에서 파생된 하위 유형의 계층 구조를 보여줍니다.

<img src="/img/runtime-exception.svg" alt="RuntimeException 계층 구조" width="700" style={{verticalAlign: 'middle'}}/>

## 스택 추적

_스택 추적_은 런타임 환경에서 생성된 보고서로, 디버깅에 사용됩니다.
특히 오류 또는 예외가 발생한 프로그램에서 특정 지점으로 이어지는 함수 호출 시퀀스를 보여줍니다.

JVM 환경에서 예외로 인해 스택 추적이 자동으로 인쇄되는 예제를 살펴보겠습니다.

```kotlin
fun main() {

    throw ArithmeticException("This is an arithmetic exception!")

}
```

JVM 환경에서 이 코드를 실행하면 다음 출력이 생성됩니다.

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

첫 번째 줄은 예외 설명으로 다음을 포함합니다.

* 예외 유형: `java.lang.ArithmeticException`
* 스레드: `main`
* 예외 메시지: `"This is an arithmetic exception!"`

예외 설명 뒤에 `at`로 시작하는 다른 각 줄은 스택 추적입니다. 단일 줄을 _스택 추적 요소_ 또는 _스택 프레임_이라고 합니다.

* `at MainKt.main (Main.kt:3)`: 이는 메서드 이름(`MainKt.main`)과 메서드가 호출된 소스 파일 및 줄 번호(`Main.kt:3`)를 보여줍니다.
* `at MainKt.main (Main.kt)`: 이는 예외가 `Main.kt` 파일의 `main()` 함수에서 발생했음을 보여줍니다.

## Java, Swift 및 Objective-C와의 예외 상호 운용성

Kotlin은 모든 예외를 unchecked로 처리하기 때문에 checked 및 unchecked 예외를 구별하는
언어에서 이러한 예외를 호출할 때 복잡해질 수 있습니다.
Kotlin과 Java, Swift 및 Objective-C와 같은 언어 간의 예외 처리 불균형을 해결하기 위해
[`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 주석을 사용할 수 있습니다.
이 주석은 호출자에게 발생 가능한 예외를 알립니다.
자세한 내용은 [Java에서 Kotlin 호출](java-to-kotlin-interop#checked-exceptions) 및
[Swift/Objective-C와의 상호 운용성](native-objc-interop#errors-and-exceptions)을 참조하십시오.