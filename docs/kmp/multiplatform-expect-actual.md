[//]: # (title: Expect 与 actual 声明)

Expect 与 actual 声明允许您从 Kotlin Multiplatform 模块中访问特定于平台的 API。
您可以在通用代码中提供与平台无关的 API。

> 本文介绍了 expect 与 actual 声明的语言机制。有关使用特定于平台的 API 的不同方式的常规建议，请参阅[使用特定于平台的 API](multiplatform-connect-to-apis.md)。
>
{style="tip"}

## Expect 与 actual 声明的规则

要定义 expect 与 actual 声明，请遵循以下规则：

1. 在通用源集中，声明一个标准的 Kotlin 结构。这可以是函数、属性、类、接口、枚举或注解。
2. 使用 `expect` 关键字标记此结构。这就是您的**预期声明**（expected declaration）。这些声明可以在通用代码中使用，但不应包含任何实现。相反，由特定于平台的代码提供此实现。
3. 在每个特定于平台的源集中，在相同的包中声明相同的结构，并使用 `actual` 关键字标记。这就是您的**实际声明**（actual declaration），它通常包含使用特定于平台的库的实现。

在为特定目标进行编译期间，编译器会尝试将它找到的每个 `actual` 声明与通用代码中相应的 `expect` 声明进行匹配。编译器确保：

* 通用源集中的每个预期声明在每个特定于平台的源集中都有一个匹配的实际声明。
* 预期声明不包含任何实现。
* 每个实际声明与其对应的预期声明共享相同的包名，例如 `org.mygroup.myapp.MyType`。

在为不同平台生成结果代码时，Kotlin 编译器会合并彼此对应的预期声明和实际声明。它为每个平台生成一个带有其实际实现的声明。通用代码中对预期声明的每次使用都会调用结果平台代码中正确的实际声明。

当您使用在不同目标平台之间共享的中间源集时，也可以声明实际声明。例如，考虑将 `iosMain` 作为在 `iosArm64Main` 和 `iosSimulatorArm64Main` 平台源集之间共享的中间源集。通常只有 `iosMain` 包含实际声明，而平台源集则不包含。然后，Kotlin 编译器将使用这些实际声明为相应平台生成结果代码。

IDE 会协助处理常见问题，包括：

* 缺少声明
* 预期声明包含实现
* 声明签名不匹配
* 声明位于不同的包中

您还可以使用 IDE 从预期声明导航到实际声明。点击装订区域图标以查看实际声明，或使用[快捷键](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)。

![从预期声明到实际声明的 IDE 导航](expect-actual-gutter.png){width=500}

## 使用 expect 与 actual 声明的不同方法

让我们探索使用 expect/actual 机制来解决访问平台 API 问题、同时仍提供在通用代码中操作它们的方法的不同选项。

考虑一个 Kotlin Multiplatform 项目，您需要实现 `Identity` 类型，该类型应包含用户的登录名和当前进程 ID。该项目具有 `commonMain`、`jvmMain` 和 `nativeMain` 源集，以使应用程序在 JVM 和 iOS 等原生环境中运行。

### 预期函数与实际函数

您可以定义一个 `Identity` 类型和一个工厂函数 `buildIdentity()`，该函数在通用源集中声明，并在平台源集中以不同方式实现：

1. 在 `commonMain` 中，声明一个简单的类型并预期一个工厂函数：

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. 在 `jvmMain` 源集中，使用标准 Java 库实现一个解决方案：

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. 在 `nativeMain` 源集中，使用 [POSIX](https://en.wikipedia.org/wiki/POSIX) 并通过原生依赖项实现一个解决方案：

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

  在这里，平台函数返回特定于平台的 `Identity` 实例。

> 从 Kotlin 1.9.0 开始，使用 `getlogin()` 和 `getpid()` 函数需要 `@OptIn` 注解。
>
{style="note"}

### 带有预期函数与实际函数的接口

如果工厂函数变得太大，请考虑使用通用的 `Identity` 接口，并在不同平台上以不同方式实现它。

`buildIdentity()` 工厂函数应返回 `Identity`，但这一次，它是一个实现通用接口的对象：

1. 在 `commonMain` 中，定义 `Identity` 接口和 `buildIdentity()` 工厂函数：

   ```kotlin
   // 在 commonMain 源集中：
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 创建接口的特定于平台的实现，而无需额外使用 expect 与 actual 声明：

   ```kotlin
   // 在 jvmMain 源集中：
   actual fun buildIdentity(): Identity = JVMIdentity()

   class JVMIdentity(
       override val userName: String = System.getProperty("user.name") ?: "none",
       override val processID: Long = ProcessHandle.current().pid()
   ) : Identity
   ```

   ```kotlin
   // 在 nativeMain 源集中：
   actual fun buildIdentity(): Identity = NativeIdentity()
  
   class NativeIdentity(
       override val userName: String = getlogin()?.toKString() ?: "None",
       override val processID: Long = getpid().toLong()
   ) : Identity
   ```

这些平台函数返回特定于平台的 `Identity` 实例，它们分别实现为 `JVMIdentity` 和 `NativeIdentity` 平台类型。

#### 预期属性与实际属性

您可以修改前面的示例，并预期一个 `val` 属性来存储 `Identity`。

将此属性标记为 `expect val`，然后在平台源集中将其实现：

```kotlin
// 在 commonMain 源集中：
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
// 在 jvmMain 源集中：
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
// 在 nativeMain 源集中：
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 预期对象与实际对象

当 `IdentityBuilder` 在每个平台上预期为单例时，您可以将其定义为 `expect object`，并让平台将其实现为 `actual object`：

```kotlin
// 在 commonMain 源集中：
expect object IdentityBuilder {
    fun build(): Identity
}

class Identity(
    val userName: String,
    val processID: Long
)
```

```kotlin
// 在 jvmMain 源集中：
actual object IdentityBuilder {
    actual fun build() = Identity(
        System.getProperty("user.name") ?: "none",
        ProcessHandle.current().pid()
    )
}
```

```kotlin
// 在 nativeMain 源集中：
actual object IdentityBuilder {
    actual fun build() = Identity(
        getlogin()?.toKString() ?: "None",
        getpid().toLong()
    )
}
```

#### 关于依赖注入的建议

为了创建松耦合架构，许多 Kotlin 项目采用了依赖注入 (DI) 框架。DI 框架允许根据当前环境将依赖项注入组件。

例如，您可能会在测试和生产环境中，或在部署到云端与在本地托管时注入不同的依赖项。只要依赖项通过接口表达，就可以在编译时或运行时注入任意数量的不同实现。

当依赖项是特定于平台的时，同样的原则也适用。在通用代码中，组件可以使用常规的 [Kotlin 接口](https://kotlinlang.org/docs/interfaces.html)来表达其依赖关系。然后可以配置 DI 框架来注入特定于平台的实现，例如，来自 JVM 或 iOS 模块的实现。

这意味着 expect 与 actual 声明仅在 DI 框架的配置中需要。有关示例，请参阅[使用特定于平台的 API](multiplatform-connect-to-apis.md#dependency-injection-framework)。

通过这种方法，您可以简单地通过使用接口和工厂函数来采用 Kotlin Multiplatform。如果您已经在项目中使用 DI 框架来管理依赖项，我们建议使用相同的方法来管理平台依赖项。

### 预期类与实际类

> 预期类与实际类处于 [Beta](supported-platforms.md#general-kotlin-stability-levels) 阶段。
> 它们已经接近稳定，但在未来可能需要迁移步骤。
> 我们将尽力减少您需要进行的进一步更改。
>
{style="warning"}

您可以使用预期类和实际类来实现相同的解决方案：

```kotlin
// 在 commonMain 源集中：
expect class Identity() {
    val userName: String
    val processID: Int
}
```

```kotlin
// 在 jvmMain 源集中：
actual class Identity {
    actual val userName: String = System.getProperty("user.name") ?: "None"
    actual val processID: Long = ProcessHandle.current().pid()
}
```

```kotlin
// 在 nativeMain 源集中：
actual class Identity {
    actual val userName: String = getlogin()?.toKString() ?: "None"
    actual val processID: Long = getpid().toLong()
}
```

您可能已经在演示材料中看过这种方法。然而，在接口已经足够的简单情况下，使用类是**不建议的**。

使用接口，您的设计不会受限于每个目标平台仅有一个实现。此外，在测试中替换假实现或在单个平台上提供多个实现也要容易得多。

作为一般规则，只要可能，就应依赖标准的语言结构，而不是使用 expect 与 actual 声明。

如果您确实决定使用预期类和实际类，Kotlin 编译器将警告您该功能处于 Beta 状态。要消除此警告，请将以下编译器选项添加到您的 Gradle 构建文件中：

```kotlin
kotlin {
    compilerOptions {
        // 通用编译器选项应用于所有 Kotlin 源集
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 继承自平台类

在某些特殊情况下，在类中使用 `expect` 关键字可能是最佳方法。假设 `Identity` 类型在 JVM 上已经存在：

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

为了使其适应现有的代码库和框架，您的 `Identity` 类型实现可以继承自该类型并重用其功能：

1. 要解决此问题，请在 `commonMain` 中使用 `expect` 关键字声明一个类：

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. 在 `nativeMain` 中，提供实现该功能的实际声明：

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. 在 `jvmMain` 中，提供继承自特定于平台的基类的实际声明：

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

在这里，`CommonIdentity` 类型与您自己的设计兼容，同时利用了 JVM 上现有的类型。

#### 在框架中的应用

作为框架作者，您可能还会发现 expect 与 actual 声明对您的框架很有用。

如果上面的示例是框架的一部分，用户必须从 `CommonIdentity` 派生一个类型来提供显示名称。

在这种情况下，预期声明是抽象的并声明了一个抽象方法：

```kotlin
// 在框架代码库的 commonMain 中：
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

类似地，实际实现也是抽象的并声明了 `displayName` 方法：

```kotlin
// 在框架代码库的 nativeMain 中：
actual abstract class CommonIdentity {
    actual val userName = getlogin()?.toKString() ?: "None"
    actual val processID = getpid().toLong()
    actual abstract val displayName: String
}
```

```kotlin
// 在框架代码库的 jvmMain 中：
actual abstract class CommonIdentity : Identity() {
    actual val userName = login
    actual val processID = pid
    actual abstract val displayName: String
}
```

框架用户需要编写继承自预期声明的通用代码，并亲自实现缺失的方法：

```kotlin
// 在用户代码库的 commonMain 中：
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis.md#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 高级用例

关于 expect 与 actual 声明，还有一些特殊情况。

### 使用类型别名满足实际声明

实际声明的实现不必从头开始编写。它可以是一个现有的类型，例如由第三方库提供的类。

只要该类型满足与预期声明相关联的所有要求，您就可以使用它。例如，考虑这两个预期声明：

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

在 JVM 模块中，`java.time.Month` 枚举可用于实现第一个预期声明，而 `java.time.LocalDate` 类可用于实现第二个。然而，无法直接向这些类型添加 `actual` 关键字。

相反，您可以使用[类型别名](https://kotlinlang.org/docs/type-aliases.html)来连接预期声明和特定于平台的类型：

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

在这种情况下，在与预期声明相同的包中定义 `typealias` 声明，并在其他地方创建引用的类。

> 由于 `LocalDate` 类型使用了 `Month` 枚举，您需要将它们都声明为通用代码中的预期类。
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 实际声明中扩展的可见性

您可以使实际实现的可见性高于相应的预期声明。如果您不想向通用客户端公开您的 API 为 public，这将非常有用。

目前，在更改可见性的情况下，Kotlin 编译器会发出错误。您可以通过将 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 应用于实际类型别名声明来抑制此错误。从 Kotlin 2.0 开始，此限制将不再适用。

例如，如果您在通用源集中声明了以下预期声明：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

您也可以在特定于平台的源集中使用以下实际实现：

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

在这里，一个 internal 预期类通过类型别名拥有一个使用现有 public `MyMessenger` 的实际实现。

### 实现时的附加枚举项

当在通用源集中使用 `expect` 声明枚举时，每个平台模块都应有一个相应的 `actual` 声明。这些声明必须包含相同的枚举常量，但它们也可以包含额外的常量。

当您使用现有的平台枚举实现预期的枚举时，这非常有用。例如，考虑通用源集中的以下枚举：

```kotlin
// 在 commonMain 源集中：
expect enum class Department { IT, HR, Sales }
```

当您在平台源集中为 `Department` 提供实际声明时，可以添加额外的常量：

```kotlin
// 在 jvmMain 源集中：
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// 在 nativeMain 源集中：
actual enum class Department { IT, HR, Sales, Marketing }
```

但是，在这种情况下，平台源集中的 these 额外常量将无法与通用代码中的常量匹配。因此，编译器要求您处理所有额外的情况。

在 `Department` 上实现 `when` 结构的函数需要一个 `else` 子句：

```kotlin
// 需要 else 子句：
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

### 预期注解类

Expect 与 actual 声明可以与注解一起使用。例如，您可以声明一个 `@XmlSerializable` 注解，它在每个平台源集中必须有一个对应的实际声明：

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

在特定平台上重用现有类型可能会有所帮助。例如，在 JVM 上，您可以使用 [JAXB 规范](https://javaee.github.io/jaxb-v2/)中的现有类型来定义您的注解：

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

对注解类使用 `expect` 时还有一个额外的考虑。注解用于将元数据附加到代码，并且不会作为类型出现在签名中。对于在从未需要该注解的平台上，预期注解不一定非要有实际类。

您只需要在使用了该注解的平台上提供 `actual` 声明。此行为默认情况下未启用，它要求该类型使用 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/) 进行标记。

以上面声明的 `@XmlSerializable` 注解为例，添加 `OptionalExpectation`：

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

如果某个平台上缺少实际声明且该平台不需要它，编译器将不会生成错误。

## 下一步

有关使用特定于平台的 API 的不同方式的常规建议，请参阅[使用特定于平台的 API](multiplatform-connect-to-apis.md)。