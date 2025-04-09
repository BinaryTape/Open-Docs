---
title: "예상 선언 및 실제 선언"
---
예상 및 실제 선언을 사용하면 Kotlin Multiplatform 모듈에서 플랫폼별 API에 접근할 수 있습니다.
공통 코드에서 플랫폼에 구애받지 않는 API를 제공할 수 있습니다.

:::note
이 글에서는 예상 및 실제 선언의 언어 메커니즘에 대해 설명합니다. 플랫폼별 API 사용에 대한 일반적인 권장 사항은 [플랫폼별 API 사용](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)을 참조하십시오.

## 예상 및 실제 선언 규칙

예상 및 실제 선언을 정의하려면 다음 규칙을 따르세요.

1. 공통 소스 세트에서 표준 Kotlin 구문을 선언합니다. 함수, 속성, 클래스, 인터페이스,
   열거형 또는 어노테이션이 될 수 있습니다.
2. 이 구문을 `expect` 키워드로 표시합니다. 이것이 _예상 선언_입니다. 이러한 선언은
   공통 코드에서 사용할 수 있지만 구현을 포함해서는 안 됩니다. 대신 플랫폼별 코드가 이 구현을 제공합니다.
3. 각 플랫폼별 소스 세트에서 동일한 구문을 동일한 패키지에 선언하고 `actual`
   키워드로 표시합니다. 이것은 _실제 선언_이며 일반적으로 플랫폼별 라이브러리를 사용하는 구현을 포함합니다.

특정 타겟에 대한 컴파일 중에 컴파일러는 찾은 각 _실제_ 선언을
공통 코드에 있는 해당 _예상_ 선언과 일치시키려고 시도합니다. 컴파일러는 다음을 확인합니다.

* 공통 소스 세트의 모든 예상 선언에는 모든 플랫폼별
  소스 세트에 일치하는 실제 선언이 있습니다.
* 예상 선언에는 구현이 포함되어 있지 않습니다.
* 모든 실제 선언은 `org.mygroup.myapp.MyType`과 같이 해당 예상 선언과 동일한 패키지를 공유합니다.

Kotlin 컴파일러는 다양한 플랫폼에 대한 결과 코드를 생성하는 동안 서로 해당하는 예상 및 실제
선언을 병합합니다. 각 플랫폼에 대한 실제 구현이 포함된 하나의 선언을 생성합니다.
공통 코드에서 예상 선언을 사용할 때마다 결과 플랫폼 코드에서 올바른 실제 선언을 호출합니다.

서로 다른 타겟 플랫폼 간에 공유되는 중간 소스 세트를 사용할 때 실제 선언을 선언할 수 있습니다.
예를 들어 `iosX64Main`, `iosArm64Main` 및
`iosSimulatorArm64Main` 플랫폼 소스 세트 간에 공유되는 중간 소스 세트인 `iosMain`을 생각해 보세요. 일반적으로 `iosMain`만 실제 선언을 포함하고 플랫폼 소스 세트는 포함하지 않습니다. 그러면 Kotlin 컴파일러는 이러한 실제 선언을 사용하여 해당 플랫폼에 대한 결과 코드를 생성합니다.

IDE는 다음과 같은 일반적인 문제를 지원합니다.

* 누락된 선언
* 구현이 포함된 예상 선언
* 일치하지 않는 선언 시그니처
* 서로 다른 패키지의 선언

IDE를 사용하여 예상 선언에서 실제 선언으로 이동할 수도 있습니다. 거터 아이콘을 선택하여 실제
선언을 보거나 [바로 가기](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)를 사용합니다.

<img src="/img/expect-actual-gutter.png" alt="예상 선언에서 실제 선언으로의 IDE 탐색" width="500" style={{verticalAlign: 'middle'}}/>

## 예상 및 실제 선언을 사용하는 다양한 접근 방식

예상/실제 메커니즘을 사용하여 플랫폼 API에 접근하는 문제를 해결하는 다양한 옵션을 살펴보겠습니다.
공통 코드에서 이러한 API를 사용할 수 있는 방법을 제공합니다.

사용자 로그인 이름과 현재 프로세스 ID를 포함해야 하는 `Identity` 유형을 구현해야 하는 Kotlin Multiplatform 프로젝트를 생각해 보세요. 이 프로젝트에는 `commonMain`, `jvmMain` 및 `nativeMain` 소스 세트가 있어
애플리케이션이 JVM과 iOS와 같은 네이티브 환경에서 작동합니다.

### 예상 및 실제 함수

공통 소스 세트에 선언되고 플랫폼 소스 세트에서 다르게 구현되는 `Identity` 유형과 팩토리 함수 `buildIdentity()`를 정의할 수 있습니다.

1. `commonMain`에서 간단한 유형을 선언하고 팩토리 함수를 예상합니다.

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. `jvmMain` 소스 세트에서 표준 Java 라이브러리를 사용하여 솔루션을 구현합니다.

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. `nativeMain` 소스 세트에서 네이티브를 사용하여 [POSIX](https://en.wikipedia.org/wiki/POSIX)로 솔루션을 구현합니다.
   종속성:

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

Kotlin 1.9.0부터 `getlogin()` 및 `getpid()` 함수를 사용하려면 `@OptIn` 어노테이션이 필요합니다.

:::

### 예상 및 실제 함수가 있는 인터페이스

팩토리 함수가 너무 커지면 공통 `Identity` 인터페이스를 사용하고 다른 플랫폼에서 다르게 구현하는 것이 좋습니다.

`buildIdentity()` 팩토리 함수는 `Identity`를 반환해야 하지만 이번에는 공통 인터페이스를 구현하는 객체입니다.

1. `commonMain`에서 `Identity` 인터페이스와 `buildIdentity()` 팩토리 함수를 정의합니다.

   ```kotlin
   // commonMain 소스 세트에서:
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 예상 및 실제 선언을 추가로 사용하지 않고 인터페이스의 플랫폼별 구현을 만듭니다.

   ```kotlin
   // jvmMain 소스 세트에서:
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // nativeMain 소스 세트에서:
   actual fun buildIdentity(): Identity = NativeIdentity()
  
   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

이러한 플랫폼 함수는 `JVMIdentity`
및 `NativeIdentity` 플랫폼 유형으로 구현되는 플랫폼별 `Identity` 인스턴스를 반환합니다.

#### 예상 및 실제 속성

이전 예제를 수정하고 `Identity`를 저장할 `val` 속성을 예상할 수 있습니다.

이 속성을 `expect val`로 표시한 다음 플랫폼 소스 세트에서 실제화합니다.

```kotlin
//commonMain 소스 세트에서:
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//jvmMain 소스 세트에서:
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//nativeMain 소스 세트에서:
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 예상 및 실제 객체

`IdentityBuilder`가 각 플랫폼에서 싱글톤이 되도록 예상되는 경우 예상 객체로 정의하고
플랫폼에서 실제화하도록 할 수 있습니다.

```kotlin
// commonMain 소스 세트에서:
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// jvmMain 소스 세트에서:
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// nativeMain 소스 세트에서:
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 종속성 주입에 대한 권장 사항

느슨하게 결합된 아키텍처를 만들기 위해 많은 Kotlin 프로젝트에서 DI(종속성 주입) 프레임워크를 채택합니다. DI
프레임워크를 사용하면 현재 환경을 기반으로 종속성을 구성 요소에 주입할 수 있습니다.

예를 들어 테스트와 프로덕션에서 또는 로컬로 호스팅하는 것과 비교하여 클라우드에 배포할 때 다른 종속성을 주입할 수 있습니다. 종속성이 인터페이스를 통해 표현되는 한 여러 가지 다른
구현을 컴파일 시간 또는 런타임에 주입할 수 있습니다.

종속성이 플랫폼별인 경우에도 동일한 원칙이 적용됩니다. 공통 코드에서 구성 요소는 일반 [Kotlin 인터페이스](interfaces)를 사용하여
종속성을 표현할 수 있습니다. 그런 다음 DI 프레임워크를 구성하여 예를 들어 JVM 또는 iOS 모듈에서
플랫폼별 구현을 주입할 수 있습니다.

즉, 예상 및 실제 선언은 DI
프레임워크의 구성에만 필요합니다. 예제는 [플랫폼별 API 사용](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html#dependency-injection-framework)을 참조하세요.

이 접근 방식을 사용하면 인터페이스와 팩토리 함수를 사용하여 Kotlin Multiplatform을 간단히 채택할 수 있습니다. 프로젝트에서 종속성을 관리하기 위해 DI 프레임워크를 이미 사용하고 있는 경우 플랫폼
종속성을 관리하는 데에도 동일한 접근 방식을 사용하는 것이 좋습니다.

### 예상 및 실제 클래스

:::note
예상 및 실제 클래스는 [베타](components-stability)에 있습니다.
거의 안정적이지만 향후 마이그레이션 단계가 필요할 수 있습니다.
최대한 변경 사항을 최소화하도록 최선을 다하겠습니다.

예상 및 실제 클래스를 사용하여 동일한 솔루션을 구현할 수 있습니다.

```kotlin
// commonMain 소스 세트에서:
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// jvmMain 소스 세트에서:
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// nativeMain 소스 세트에서:
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

데모 자료에서 이 접근 방식을 이미 보셨을 수도 있습니다. 그러나 인터페이스가 충분한 간단한 경우에는
클래스를 사용하는 것이 _권장되지 않습니다_.

인터페이스를 사용하면 디자인을 타겟 플랫폼당 하나의 구현으로 제한하지 않습니다. 또한 테스트에서 가짜 구현을 대체하거나 단일 플랫폼에서 여러 구현을 제공하는 것이 훨씬 쉽습니다.

일반적으로 예상 및 실제 선언을 사용하는 대신 가능한 경우 표준 언어 구문을 사용하는 것이 좋습니다.

예상 및 실제 클래스를 사용하기로 결정한 경우 Kotlin 컴파일러는 베타 상태에 대한 경고를 표시합니다. 이 경고를 표시하지 않으려면 Gradle 빌드 파일에 다음 컴파일러 옵션을 추가합니다.

```kotlin
kotlin {
    compilerOptions {
        // 모든 Kotlin 소스 세트에 적용되는 공통 컴파일러 옵션
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 플랫폼 클래스에서 상속

클래스와 함께 `expect` 키워드를 사용하는 것이 가장 좋은 접근 방식일 수 있는 특별한 경우가 있습니다. `Identity` 유형이 JVM에 이미 있다고 가정해 보겠습니다.

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

기존 코드베이스 및 프레임워크에 맞추기 위해 `Identity` 유형의 구현은 이 유형에서 상속하고
해당 기능을 재사용할 수 있습니다.

1. 이 문제를 해결하려면 `expect` 키워드를 사용하여 `commonMain`에서 클래스를 선언합니다.

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. `nativeMain`에서 기능을 구현하는 실제 선언을 제공합니다.

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. `jvmMain`에서 플랫폼별 기본 클래스에서 상속하는 실제 선언을 제공합니다.

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

여기서 `CommonIdentity` 유형은 JVM의 기존 유형을 활용하면서 자체 디자인과 호환됩니다.

#### 프레임워크의 애플리케이션

프레임워크 작성자인 경우 프레임워크에 유용한 예상 및 실제 선언을 찾을 수도 있습니다.

위의 예제가 프레임워크의 일부인 경우 사용자는 `CommonIdentity`에서 유형을 파생시켜
표시 이름을 제공해야 합니다.

이 경우 예상 선언은 추상적이며 추상 메서드를 선언합니다.

```kotlin
// 프레임워크 코드베이스의 commonMain에서:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

마찬가지로 실제 구현은 추상적이며 `displayName` 메서드를 선언합니다.

```kotlin
// 프레임워크 코드베이스의 nativeMain에서:
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// 프레임워크 코드베이스의 jvmMain에서:
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

프레임워크 사용자는 예상 선언에서 상속하고 누락된
메서드를 직접 구현하는 공통 코드를 작성해야 합니다.

```kotlin
// 사용자 코드베이스의 commonMain에서:
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- Android 또는 iOS 개발을 위한 공통 `ViewModel`을 제공하는 모든 라이브러리에서 유사한 체계가 작동합니다. 이러한 라이브러리는 일반적으로 예상되는 `CommonViewModel` 클래스를 제공하며, 해당 Android 대응 클래스는 Android 프레임워크의 `ViewModel` 클래스를 확장합니다. 이 예에 대한 자세한 설명은 [플랫폼별 API 사용](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)을 참조하세요. -->

## 고급 사용 사례

예상 및 실제 선언과 관련하여 여러 가지 특별한 경우가 있습니다.

### 유형 별칭을 사용하여 실제 선언 충족

실제 선언의 구현을 처음부터 작성할 필요는 없습니다. 타사 라이브러리에서 제공하는 클래스와 같은 기존 유형일 수 있습니다.

이 유형이 예상 선언과 관련된 모든 요구 사항을 충족하는 한 이 유형을 사용할 수 있습니다. 예를 들어 다음 두 가지 예상 선언을 생각해 보세요.

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

JVM 모듈 내에서 `java.time.Month` 열거형을 사용하여 첫 번째 예상 선언을 구현하고
`java.time.LocalDate` 클래스를 사용하여 두 번째 선언을 구현할 수 있습니다. 그러나 이러한 유형에 `actual` 키워드를 직접 추가할 방법은 없습니다.

대신 [유형 별칭](type-aliases)을 사용하여 예상 선언과 플랫폼별
유형을 연결할 수 있습니다.

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

이 경우 예상 선언과 동일한 패키지에서 `typealias` 선언을 정의하고
다른 곳에서 참조되는 클래스를 만듭니다.

`LocalDate` 유형은 `Month` 열거형을 사용하므로 공통 코드에서 둘 다 예상 클래스로 선언해야 합니다.

:::

<!-- 이 패턴의 Android 관련 예는 [플랫폼별 API 사용](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)을 참조하세요. -->

### 실제 선언에서 확장된 가시성

실제 구현을 해당 예상 선언보다 더 잘 보이게 만들 수 있습니다. 이는 API를 공통 클라이언트에 공개하고 싶지 않은 경우에 유용합니다.

현재 Kotlin 컴파일러는 가시성 변경이 있는 경우 오류를 발생시킵니다. `@Suppress("ACTUAL_WITHOUT_EXPECT")`를 실제 유형 별칭 선언에 적용하여 이 오류를 표시하지 않을 수 있습니다. Kotlin 2.0부터는
이 제한 사항이 적용되지 않습니다.

예를 들어 공통 소스 세트에서 다음 예상 선언을 선언하는 경우:

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

플랫폼별 소스 세트에서 다음과 같은 실제 구현도 사용할 수 있습니다.

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

여기서 내부 예상 클래스는 유형 별칭을 사용하여 기존 공개 `MyMessenger`를 사용하여 실제 구현을 가지고 있습니다.

### 실제화에 대한 추가 열거형 항목

열거형이 공통 소스 세트에서 `expect`로 선언된 경우 각 플랫폼 모듈에는
해당하는 `actual` 선언이 있어야 합니다. 이러한 선언에는 동일한 열거형 상수가 포함되어야 하지만 추가 상수를 가질 수도 있습니다.

이는 기존 플랫폼 열거형을 사용하여 예상 열거형을 실제화할 때 유용합니다. 예를 들어 공통 소스 세트에서
다음 열거형을 고려해 보세요.

```kotlin
// commonMain 소스 세트에서:
expect enum class Department { IT, HR, Sales }
```

플랫폼 소스 세트에서 `Department`에 대한 실제 선언을 제공하는 경우 추가 상수를 추가할 수 있습니다.

```kotlin
// jvmMain 소스 세트에서:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// nativeMain 소스 세트에서:
actual enum class Department { IT, HR, Sales, Marketing }
```

그러나 이 경우 플랫폼 소스 세트의 이러한 추가 상수는 공통 코드의 상수와 일치하지 않습니다.
따라서 컴파일러는 모든 추가 사례를 처리하도록 요구합니다.

`Department`에서 `when` 구성을 구현하는 함수에는 `else` 절이 필요합니다.

```kotlin
// else 절이 필요합니다.
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT `->` println("The IT Department")
        Department.HR `->` println("The HR Department")
        Department.Sales `->` println("The Sales Department")
        else `->` println("Some other department")
    }
}
```

<!-- 실제 열거형에 새 상수를 추가하는 것을 금지하려면 이 문제 [TODO]에 투표하세요. -->

### 예상 어노테이션 클래스

예상 및 실제 선언을 어노테이션과 함께 사용할 수 있습니다. 예를 들어 `@XmlSerializable`
어노테이션을 선언할 수 있으며, 각 플랫폼 소스 세트에 해당하는 실제 선언이 있어야 합니다.

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

특정 플랫폼에서 기존 유형을 재사용하는 것이 유용할 수 있습니다. 예를 들어 JVM에서는 [JAXB 사양](https://javaee.github.io/jaxb-v2/)의 기존 유형을 사용하여
어노테이션을 정의할 수 있습니다.

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

어노테이션 클래스와 함께 `expect`를 사용하는 경우 추가 고려 사항이 있습니다. 어노테이션은 코드에
메타데이터를 첨부하는 데 사용되며 시그니처에서 유형으로 나타나지 않습니다. 예상 어노테이션에 필요하지 않은 플랫폼에 실제 클래스가 있는 것은 필수적이지 않습니다.

어노테이션이 사용되는 플랫폼에서만 `actual` 선언을 제공해야 합니다. 이
동작은 기본적으로 활성화되지 않으며 유형을 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)으로 표시해야 합니다.

위에서 선언된 `@XmlSerializable` 어노테이션을 가져와서 `OptionalExpectation`을 추가합니다.

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

필요하지 않은 플랫폼에서 실제 선언이 누락된 경우 컴파일러는
오류를 생성하지 않습니다.

## 다음 단계

플랫폼별 API 사용에 대한 일반적인 권장 사항은 [플랫폼별 API 사용](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)을 참조하십시오.