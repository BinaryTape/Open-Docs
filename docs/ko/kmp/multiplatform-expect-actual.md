[//]: # (title: 예상 및 실제 선언)

예상(Expected) 및 실제(actual) 선언을 사용하면 Kotlin 멀티플랫폼 모듈에서 플랫폼별 API에 접근할 수 있습니다.
공통 코드에서 플랫폼 독립적인 API를 제공할 수 있습니다.

> 이 문서에서는 예상 및 실제 선언의 언어 메커니즘을 설명합니다.
> 플랫폼별 API를 사용하는 다양한 방법에 대한 일반적인 권장 사항은 [플랫폼별 API 사용](multiplatform-connect-to-apis.md)을 참조하세요.
>
{style="tip"}

## 예상 및 실제 선언 규칙

예상 및 실제 선언을 정의하려면 다음 규칙을 따르세요.

1.  공통 소스 세트에서 표준 Kotlin 구성 요소를 선언합니다. 이는 함수, 프로퍼티, 클래스, 인터페이스, 열거형 또는 어노테이션이 될 수 있습니다.
2.  이 구성 요소를 `expect` 키워드로 표시합니다. 이것이 바로 _예상 선언_입니다. 이러한 선언은 공통 코드에서 사용될 수 있지만, 어떠한 구현도 포함해서는 안 됩니다. 대신 플랫폼별 코드가 이 구현을 제공합니다.
3.  각 플랫폼별 소스 세트에서 동일한 패키지에 동일한 구성 요소를 선언하고 `actual` 키워드로 표시합니다. 이것이 바로 _실제 선언_이며, 일반적으로 플랫폼별 라이브러리를 사용하여 구현을 포함합니다.

특정 타겟을 위한 컴파일 중에, 컴파일러는 찾은 각 _실제_ 선언을 공통 코드의 해당 _예상_ 선언과 매칭시키려고 시도합니다. 컴파일러는 다음을 보장합니다.

*   공통 소스 세트의 모든 예상 선언은 모든 플랫폼별 소스 세트에 일치하는 실제 선언을 가집니다.
*   예상 선언은 어떠한 구현도 포함하지 않습니다.
*   모든 실제 선언은 `org.mygroup.myapp.MyType`과 같이 해당 예상 선언과 동일한 패키지를 공유합니다.

서로 다른 플랫폼을 위한 결과 코드를 생성하는 동안, Kotlin 컴파일러는 서로 일치하는 예상 및 실제 선언을 병합합니다. 각 플랫폼에 대해 실제 구현을 가진 하나의 선언을 생성합니다.
공통 코드에서 예상 선언을 사용하는 모든 곳은 결과 플랫폼 코드에서 올바른 실제 선언을 호출합니다.

서로 다른 타겟 플랫폼 간에 공유되는 중간 소스 세트를 사용할 때 실제 선언을 선언할 수 있습니다. 예를 들어, `iosX64Main`, `iosArm64Main`, `iosSimulatorArm64Main` 플랫폼 소스 세트 간에 공유되는 중간 소스 세트로 `iosMain`을 고려해 보세요. 일반적으로 `iosMain`만 실제 선언을 포함하며 플랫폼 소스 세트는 포함하지 않습니다. Kotlin 컴파일러는 이 실제 선언을 사용하여 해당 플랫폼의 결과 코드를 생성합니다.

IDE는 다음을 포함한 일반적인 문제에 대해 도움을 줍니다.

*   누락된 선언
*   구현을 포함하는 예상 선언
*   일치하지 않는 선언 시그니처
*   다른 패키지의 선언

또한 IDE를 사용하여 예상 선언에서 실제 선언으로 이동할 수 있습니다. 거터 아이콘을 선택하여 실제 선언을 보거나 [단축키](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)를 사용하세요.

![예상 선언에서 실제 선언으로 이동하는 IDE](expect-actual-gutter.png){width=500}

## 예상 및 실제 선언을 사용하는 다양한 접근 방식

플랫폼 API에 접근하면서도 공통 코드에서 작업할 수 있는 방법을 제공하는 문제를 해결하기 위해 expect/actual 메커니즘을 사용하는 다양한 옵션을 살펴보겠습니다.

사용자 로그인 이름과 현재 프로세스 ID를 포함해야 하는 `Identity` 타입을 구현해야 하는 Kotlin 멀티플랫폼 프로젝트를 고려해 보세요. 이 프로젝트에는 JVM 및 iOS와 같은 네이티브 환경에서 애플리케이션이 작동하도록 `commonMain`, `jvmMain`, `nativeMain` 소스 세트가 있습니다.

### 예상 및 실제 함수

`Identity` 타입과 팩토리 함수 `buildIdentity()`를 정의할 수 있습니다. 이 함수는 공통 소스 세트에 선언되고 플랫폼 소스 세트에서 다르게 구현됩니다.

1.  `commonMain`에서 간단한 타입을 선언하고 팩토리 함수를 예상합니다.

    ```kotlin
    package identity

    class Identity(val userName: String, val processID: Long)
    
    expect fun buildIdentity(): Identity
    ```

2.  `jvmMain` 소스 세트에서 표준 Java 라이브러리를 사용하여 솔루션을 구현합니다.

    ```kotlin
    package identity
    
    import java.lang.System
    import java.lang.ProcessHandle

    actual fun buildIdentity() = Identity(
        System.getProperty("user.name") ?: "None",
        ProcessHandle.current().pid()
    )
    ```

3.  `nativeMain` 소스 세트에서 네이티브 의존성을 사용하여 [POSIX](https://en.wikipedia.org/wiki/POSIX)로 솔루션을 구현합니다.

    ```kotlin
    package identity
    
    import kotlinx.cinterop.toKString
    import platform.posix.getlogin
    import platform.posix.getpid

    actual fun buildIdentity() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
    ```

    여기서 플랫폼 함수는 플랫폼별 `Identity` 인스턴스를 반환합니다.

> Kotlin 1.9.0부터 `getlogin()` 및 `getpid()` 함수를 사용하려면 `@OptIn` 어노테이션이 필요합니다.
>
{style="note"}

### 예상 및 실제 함수를 가진 인터페이스

팩토리 함수가 너무 커지면 공통 `Identity` 인터페이스를 사용하고 이를 다른 플랫폼에서 다르게 구현하는 것을 고려해 보세요.

`buildIdentity()` 팩토리 함수는 `Identity`를 반환해야 하지만, 이번에는 공통 인터페이스를 구현하는 객체입니다.

1.  `commonMain`에서 `Identity` 인터페이스와 `buildIdentity()` 팩토리 함수를 정의합니다.

    ```kotlin
    // In the commonMain source set:
    expect fun buildIdentity(): Identity
    
    interface Identity {
        val userName: String
        val processID: Long
    }
    ```

2.  예상 및 실제 선언을 추가로 사용하지 않고 인터페이스의 플랫폼별 구현을 생성합니다.

    ```kotlin
    // In the jvmMain source set:
    actual fun buildIdentity(): Identity = JVMIdentity()

    class JVMIdentity(
        override val userName: String = System.getProperty("user.name") ?: "none",
        override val processID: Long = ProcessHandle.current().pid()
    ) : Identity
    ```

    ```kotlin
    // In the nativeMain source set:
    actual fun buildIdentity(): Identity = NativeIdentity()
    
    class NativeIdentity(
        override val userName: String = getlogin()?.toKString() ?: "None",
        override val processID: Long = getpid().toLong()
    ) : Identity
    ```

이 플랫폼 함수는 `JVMIdentity` 및 `NativeIdentity` 플랫폼 타입으로 구현된 플랫폼별 `Identity` 인스턴스를 반환합니다.

#### 예상 및 실제 프로퍼티

이전 예제를 수정하여 `Identity`를 저장할 `val` 프로퍼티를 예상할 수 있습니다.

이 프로퍼티를 `expect val`로 표시한 다음 플랫폼 소스 세트에서 실제화(actualize)합니다.

```kotlin
//In commonMain source set:
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//In jvmMain source set:
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//In nativeMain source set:
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 예상 및 실제 객체

`IdentityBuilder`가 각 플랫폼에서 싱글톤으로 예상되는 경우, 이를 예상 객체로 정의하고 플랫폼이 이를 실제화하도록 할 수 있습니다.

```kotlin
// In the commonMain source set:
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// In the jvmMain source set:
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// In the nativeMain source set:
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 의존성 주입에 대한 권장 사항

느슨하게 결합된 아키텍처를 생성하기 위해 많은 Kotlin 프로젝트는 의존성 주입(DI) 프레임워크를 채택합니다. DI 프레임워크는 현재 환경에 따라 컴포넌트에 의존성을 주입할 수 있도록 합니다.

예를 들어, 로컬에서 호스팅하는 것과 비교하여 테스트 및 프로덕션 환경에서 또는 클라우드에 배포할 때 다른 의존성을 주입할 수 있습니다. 의존성이 인터페이스를 통해 표현되는 한, 컴파일 타임 또는 런타임에 다양한 수의 구현이 주입될 수 있습니다.

동일한 원칙은 의존성이 플랫폼별일 때도 적용됩니다. 공통 코드에서 컴포넌트는 일반 [Kotlin 인터페이스](https://kotlinlang.org/docs/interfaces.html)를 사용하여 의존성을 표현할 수 있습니다. 그런 다음 DI 프레임워크는 예를 들어 JVM 또는 iOS 모듈에서 플랫폼별 구현을 주입하도록 구성될 수 있습니다.

이는 예상 및 실제 선언이 DI 프레임워크의 구성에만 필요하다는 것을 의미합니다. 예시는 [플랫폼별 API 사용](multiplatform-connect-to-apis.md#dependency-injection-framework)을 참조하세요.

이 접근 방식을 사용하면 인터페이스와 팩토리 함수를 사용하여 Kotlin 멀티플랫폼을 간단히 채택할 수 있습니다. 프로젝트에서 의존성 관리를 위해 이미 DI 프레임워크를 사용하고 있다면, 플랫폼 의존성 관리에도 동일한 접근 방식을 사용하는 것을 권장합니다.

### 예상 및 실제 클래스

> 예상 및 실제 클래스는 [베타](supported-platforms.md#general-kotlin-stability-levels) 상태입니다.
> 거의 안정적이지만, 향후 마이그레이션 단계가 필요할 수 있습니다.
> 추가적인 변경 사항을 최소화하도록 최선을 다할 것입니다.
>
{style="warning"}

동일한 솔루션을 구현하기 위해 예상 및 실제 클래스를 사용할 수 있습니다.

```kotlin
// In the commonMain source set:
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// In the jvmMain source set:
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// In the nativeMain source set:
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

이 접근 방식은 데모 자료에서 이미 보셨을 수도 있습니다. 하지만 인터페이스로 충분할 간단한 경우에 클래스를 사용하는 것은 _권장되지 않습니다_.

인터페이스를 사용하면 디자인을 타겟 플랫폼당 하나의 구현으로 제한하지 않습니다. 또한, 테스트에서 가짜 구현으로 대체하거나 단일 플랫폼에서 여러 구현을 제공하는 것이 훨씬 쉽습니다.

일반적인 규칙으로, 예상 및 실제 선언을 사용하는 대신 가능한 한 표준 언어 구성 요소를 활용하세요.

예상 및 실제 클래스를 사용하기로 결정하면 Kotlin 컴파일러가 이 기능의 베타 상태에 대해 경고합니다. 이 경고를 억제하려면 Gradle 빌드 파일에 다음 컴파일러 옵션을 추가하세요.

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 플랫폼 클래스 상속

클래스에 `expect` 키워드를 사용하는 것이 최선의 접근 방식일 수 있는 특별한 경우가 있습니다. `Identity` 타입이 JVM에 이미 존재한다고 가정해 봅시다.

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

기존 코드베이스와 프레임워크에 맞추기 위해, `Identity` 타입의 구현은 이 타입으로부터 상속받고 기능을 재사용할 수 있습니다.

1.  이 문제를 해결하려면 `commonMain`에서 `expect` 키워드를 사용하여 클래스를 선언합니다.

    ```kotlin
    expect class CommonIdentity() {
        val userName: String
        val processID: Long
    }
    ```

2.  `nativeMain`에서 기능을 구현하는 실제 선언을 제공합니다.

    ```kotlin
    actual class CommonIdentity {
        actual val userName = getlogin()?.toKString() ?: "None"
        actual val processID = getpid().toLong()
    }
    ```

3.  `jvmMain`에서 플랫폼별 기본 클래스로부터 상속받는 실제 선언을 제공합니다.

    ```kotlin
    actual class CommonIdentity : Identity() {
        actual val userName = login
        actual val processID = pid
    }
    ```

여기서 `CommonIdentity` 타입은 자체 디자인과 호환되며 JVM의 기존 타입을 활용합니다.

#### 프레임워크에서의 적용

프레임워크 개발자로서 예상 및 실제 선언이 프레임워크에 유용하다는 것을 알 수 있습니다.

위 예제가 프레임워크의 일부라면, 사용자는 표시 이름을 제공하기 위해 `CommonIdentity`로부터 타입을 파생시켜야 합니다.

이 경우, 예상 선언은 추상적이며 추상 메서드를 선언합니다.

```kotlin
// In commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

유사하게, 실제 구현도 추상적이며 `displayName` 메서드를 선언합니다.

```kotlin
// In nativeMain of the framework codebase:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// In jvmMain of the framework codebase:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

프레임워크 사용자는 예상 선언을 상속받고 누락된 메서드를 직접 구현하는 공통 코드를 작성해야 합니다.

```kotlin
// In commonMain of the users' codebase:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 고급 사용 사례

예상 및 실제 선언과 관련된 몇 가지 특별한 경우가 있습니다.

### 타입 별칭을 사용하여 실제 선언 충족하기

실제 선언의 구현은 처음부터 작성될 필요가 없습니다. 서드파티 라이브러리에서 제공하는 클래스와 같은 기존 타입일 수 있습니다.

이 타입이 예상 선언과 관련된 모든 요구 사항을 충족하는 한 사용할 수 있습니다. 예를 들어, 다음 두 예상 선언을 고려해 보세요.

```kotlin
expect enum class Month {
    JANUARY, FEBRUARY, MARCH, APRIL, MAY, JUNE, JULY,
    AUGUST, SEPTEMBER, OCTOBER, NOVEMBER, DECEMBER
}

expect class MyDate {
    fun getYear(): Int
    fun getMonth(): Month
    fun getDayOfMonth(): Int
}
```

JVM 모듈 내에서 `java.time.Month` 열거형은 첫 번째 예상 선언을 구현하는 데 사용될 수 있고, `java.time.LocalDate` 클래스는 두 번째 예상 선언을 구현하는 데 사용될 수 있습니다. 하지만 이 타입에 `actual` 키워드를 직접 추가할 방법은 없습니다.

대신 [타입 별칭](https://kotlinlang.org/docs/type-aliases.html)을 사용하여 예상 선언과 플랫폼별 타입을 연결할 수 있습니다.

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

이 경우 `typealias` 선언은 예상 선언과 동일한 패키지에 정의하고, 참조된 클래스는 다른 곳에 생성합니다.

> `LocalDate` 타입은 `Month` 열거형을 사용하므로, 둘 다 공통 코드에서 예상 클래스로 선언해야 합니다.
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 실제 선언에서 확장된 가시성

실제 구현을 해당 예상 선언보다 더 가시적으로 만들 수 있습니다. 이는 공통 클라이언트에 API를 공개하고 싶지 않을 때 유용합니다.

현재 Kotlin 컴파일러는 가시성 변경 시 오류를 발생시킵니다. 실제 타입 별칭 선언에 `@Suppress("ACTUAL_WITHOUT_EXPECT")`를 적용하여 이 오류를 억제할 수 있습니다. Kotlin 2.0부터는 이 제한이 적용되지 않습니다.

예를 들어, 공통 소스 세트에서 다음 예상 선언을 선언하는 경우:

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

플랫폼별 소스 세트에서도 다음 실제 구현을 사용할 수 있습니다.

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

여기서는 내부 예상 클래스가 타입 별칭을 사용하여 기존 공개 `MyMessenger`와 실제 구현을 가집니다.

### 실제화 시 추가 열거형 항목

열거형이 공통 소스 세트에서 `expect`로 선언될 때, 각 플랫폼 모듈은 해당 `actual` 선언을 가져야 합니다. 이 선언들은 동일한 열거형 상수를 포함해야 하지만, 추가 상수도 가질 수 있습니다.

이는 기존 플랫폼 열거형으로 예상 열거형을 실제화할 때 유용합니다. 예를 들어, 공통 소스 세트의 다음 열거형을 고려해 보세요.

```kotlin
// In the commonMain source set:
expect enum class Department { IT, HR, Sales }
```

플랫폼 소스 세트에서 `Department`에 대한 실제 선언을 제공할 때 추가 상수를 추가할 수 있습니다.

```kotlin
// In the jvmMain source set:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// In the nativeMain source set:
actual enum class Department { IT, HR, Sales, Marketing }
```

그러나 이 경우 플랫폼 소스 세트의 이러한 추가 상수는 공통 코드의 상수와 일치하지 않습니다.
따라서 컴파일러는 모든 추가 사례를 처리하도록 요구합니다.

`Department`에 대한 `when` 구문을 구현하는 함수는 `else` 절이 필요합니다.

```kotlin
// An else clause is required:
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT -> println("The IT Department")
        Department.HR -> println("The HR Department")
        Department.Sales -> println("The Sales Department")
        else -> println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### 예상 어노테이션 클래스

예상 및 실제 선언은 어노테이션과 함께 사용될 수 있습니다. 예를 들어, 각 플랫폼 소스 세트에 해당 실제 선언이 있어야 하는 `@XmlSerializable` 어노테이션을 선언할 수 있습니다.

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

특정 플랫폼에서 기존 타입을 재사용하는 것이 도움이 될 수 있습니다. 예를 들어, JVM에서는 [JAXB 명세](https://javaee.github.io/jaxb-v2/)의 기존 타입을 사용하여 어노테이션을 정의할 수 있습니다.

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

어노테이션 클래스와 함께 `expect`를 사용할 때는 추가적인 고려 사항이 있습니다. 어노테이션은 코드에 메타데이터를 첨부하는 데 사용되며 시그니처에 타입으로 나타나지 않습니다. 예상 어노테이션이 필요 없는 플랫폼에서 실제 클래스를 가지는 것이 필수적이지는 않습니다.

어노테이션이 사용되는 플랫폼에서만 `actual` 선언을 제공하면 됩니다. 이 동작은 기본적으로 활성화되어 있지 않으며, 타입에 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)으로 표시되어야 합니다.

위에 선언된 `@XmlSerializable` 어노테이션에 `OptionalExpectation`을 추가해 보세요.

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

필요 없는 플랫폼에서 실제 선언이 누락된 경우, 컴파일러는 오류를 생성하지 않습니다.

## 다음 단계

플랫폼별 API를 사용하는 다양한 방법에 대한 일반적인 권장 사항은 [플랫폼별 API 사용](multiplatform-connect-to-apis.md)을 참조하세요.