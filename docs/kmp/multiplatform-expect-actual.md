[//]: # (title: 预期与实际声明)

预期与实际声明允许你从 Kotlin Multiplatform 模块访问平台特有的 API。你可以在公共代码中提供平台无关的 API。

> 本文描述了预期与实际声明的语言机制。有关使用平台特有 API 的不同方式的通用建议，请参见[使用平台特有的 API](multiplatform-connect-to-apis.md)。
>
{style="tip"}

## 预期与实际声明的规则

要定义预期与实际声明，请遵循以下规则：

1.  在公共源代码集中，声明一个标准 Kotlin 构造。这可以是一个函数、属性、类、接口、枚举或注解。
2.  使用 `expect` 关键字标记此构造。这就是你的*预期声明*。这些声明可以在公共代码中使用，但不应包含任何实现。相反，平台特有的代码提供了此实现。
3.  在每个平台特有的源代码集中，在相同的包中声明相同的构造，并使用 `actual` 关键字标记它。这就是你的*实际声明*，它通常包含使用平台特有库的实现。

在针对特定目标进行编译期间，编译器会尝试将找到的每个 *actual* 声明与公共代码中对应的 *expected* 声明进行匹配。编译器确保：

*   公共源代码集中的每个预期声明在每个平台特有的源代码集中都有一个匹配的实际声明。
*   预期声明不包含任何实现。
*   每个实际声明与相应的预期声明共享相同的包，例如 `org.mygroup.myapp.MyType`。

在为不同平台生成最终代码时，Kotlin 编译器会合并相互对应的预期与实际声明。它为每个平台生成一个带其实际实现的声明。公共代码中对预期声明的每次使用都会调用最终平台代码中正确的实际声明。

在使用不同目标平台之间共享的中间源代码集时，你可以声明实际声明。例如，考虑 `iosMain` 作为一个在 `iosX64Main`、`iosArm64Main` 和 `iosSimulatorArm64Main` 平台源代码集之间共享的中间源代码集。通常只有 `iosMain` 包含实际声明，而不是平台源代码集。Kotlin 编译器随后会使用这些实际声明为相应的平台生成最终代码。

IDE 协助解决常见问题，包括：

*   缺失声明
*   包含实现的预期声明
*   不匹配的声明签名
*   不同包中的声明

你还可以使用 IDE 从预期声明导航到实际声明。选择边栏图标以查看实际声明或使用[快捷键](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)。

![IDE navigation from expected to actual declarations](expect-actual-gutter.png){width=500}

## 使用预期与实际声明的不同方法

让我们探讨使用 expect/actual 机制的不同选项，以解决访问平台 API 的问题，同时仍提供在公共代码中与之协作的方式。

考虑一个 Kotlin Multiplatform 项目，你需要实现 `Identity` 类型，它应该包含用户的登录名和当前进程 ID。该项目有 `commonMain`、`jvmMain` 和 `nativeMain` 源代码集，以使应用程序在 JVM 和诸如 iOS 等原生环境中工作。

### 预期与实际函数

你可以定义一个 `Identity` 类型和一个工厂函数 `buildIdentity()`，它在公共源代码集中声明，并在平台源代码集中以不同方式实现：

1.  在 `commonMain` 中，声明一个简单类型并预期一个工厂函数：

    ```kotlin
    package identity

    class Identity(val userName: String, val processID: Long)

    expect fun buildIdentity(): Identity
    ```

2.  在 `jvmMain` 源代码集中，使用标准 Java 库实现解决方案：

    ```kotlin
    package identity

    import java.lang.System
    import java.lang.ProcessHandle

    actual fun buildIdentity() = Identity(
        System.getProperty("user.name") ?: "None",
        ProcessHandle.current().pid()
    )
    ```

3.  在 `nativeMain` 源代码集中，使用带原生依赖项的 [POSIX](https://en.wikipedia.org/wiki/POSIX) 实现解决方案：

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

    这里，平台函数返回平台特有的 `Identity` 实例。

> 从 Kotlin 1.9.0 开始，使用 `getlogin()` 和 `getpid()` 函数需要 `@OptIn` 注解。
>
{style="note"}

### 带预期与实际函数的接口

如果工厂函数变得过大，可以考虑使用公共 `Identity` 接口并在不同平台上以不同方式实现它。

`buildIdentity()` 工厂函数应该返回 `Identity`，但这次它是一个实现公共接口的对象：

1.  在 `commonMain` 中，定义 `Identity` 接口和 `buildIdentity()` 工厂函数：

    ```kotlin
    // In the commonMain source set:
    expect fun buildIdentity(): Identity

    interface Identity {
        val userName: String
        val processID: Long
    }
    ```

2.  创建接口的平台特有实现，无需额外使用预期与实际声明：

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

这些平台函数返回平台特有的 `Identity` 实例，它们被实现为 `JVMIdentity` 和 `NativeIdentity` 平台类型。

#### 预期与实际属性

你可以修改上一个示例，并预期一个 `val` 属性来存储 `Identity`。

将此属性标记为 `expect val`，然后在平台源代码集中将其实际化：

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

#### 预期与实际对象

当 `IdentityBuilder` 预期在每个平台上都是一个单例时，你可以将其定义为一个预期对象，并让平台将其实际化：

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

#### 关于依赖注入的建议

为了创建松耦合架构，许多 Kotlin 项目采用了依赖注入 (DI) 框架。DI 框架允许根据当前环境将依赖项注入组件。

例如，你可能在测试和生产环境中注入不同的依赖项，或者在部署到云端时与本地托管时注入不同的依赖项。只要依赖项通过接口表达，就可以在编译期或运行时注入任意数量的不同实现。

当依赖项是平台特有时，同样的原则也适用。在公共代码中，组件可以使用常规 [Kotlin 接口](https://kotlinlang.org/docs/interfaces.html)表达其依赖项。然后可以配置 DI 框架以注入平台特有的实现，例如，来自 JVM 或 iOS 模块的实现。

这意味着预期与实际声明仅在 DI 框架的配置中需要。有关示例，请参见[使用平台特有的 API](multiplatform-connect-to-apis.md#dependency-injection-framework)。

通过这种方法，你可以通过简单地使用接口和工厂函数来采用 Kotlin Multiplatform。如果你的项目中已经使用 DI 框架来管理依赖项，我们建议使用相同的方法来管理平台依赖项。

### 预期与实际类

> 预期与实际类处于 [Beta](supported-platforms.md#general-kotlin-stability-levels) 阶段。它们几乎稳定，但将来可能需要迁移步骤。我们将尽力为你最大程度地减少未来的任何更改。
>
{style="warning"}

你可以使用预期与实际类来实现相同的解决方案：

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

你可能已经在演示材料中看到过这种方法。然而，在接口足以满足的简单情况下使用类是*不推荐的*。

使用接口，你不会将设计限制为每个目标平台一个实现。此外，在测试中替换模拟实现或在单一平台上提供多个实现要容易得多。

作为一般规则，尽可能依赖标准语言构造，而不是使用预期与实际声明。

如果你确实决定使用预期与实际类，Kotlin 编译器会警告你该特性的 Beta 状态。要抑制此警告，请将以下编译器选项添加到你的 Gradle 构建文件中：

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 从平台类继承

在某些特殊情况下，将 `expect` 关键字与类一起使用可能是最佳方法。假设 `Identity` 类型已在 JVM 上存在：

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

为了适应现有代码库和框架，你的 `Identity` 类型实现可以继承此类型并重用其功能：

1.  为了解决这个问题，在 `commonMain` 中使用 `expect` 关键字声明一个类：

    ```kotlin
    expect class CommonIdentity() {
        val userName: String
        val processID: Long
    }
    ```

2.  在 `nativeMain` 中，提供一个实现此功能的实际声明：

    ```kotlin
    actual class CommonIdentity {
        actual val userName = getlogin()?.toKString() ?: "None"
        actual val processID = getpid().toLong()
    }
    ```

3.  在 `jvmMain` 中，提供一个从平台特有基类继承的实际声明：

    ```kotlin
    actual class CommonIdentity : Identity() {
        actual val userName = login
        actual val processID = pid
    }
    ```

在这里，`CommonIdentity` 类型与你自己的设计兼容，同时利用了 JVM 上现有类型的优势。

#### 在框架中的应用

作为框架作者，你也会发现预期与实际声明对你的框架很有用。

如果上面的示例是框架的一部分，用户必须从 `CommonIdentity` 派生一个类型以提供显示名称。

在这种情况下，预期声明是抽象的并声明一个抽象方法：

```kotlin
// In commonMain of the framework codebase:
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

类似地，实际实现是抽象的并声明 `displayName` 方法：

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

框架用户需要编写继承自预期声明的公共代码，并自行实现缺失的方法：

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

## 高级用例

关于预期与实际声明有一些特殊情况。

### 使用类型别名来满足实际声明

实际声明的实现不必从头编写。它可以是现有类型，例如第三方库提供的类。

你可以使用此类型，只要它满足与预期声明相关的所有要求。例如，考虑这两个预期声明：

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

在 JVM 模块中，`java.time.Month` 枚举可用于实现第一个预期声明，`java.time.LocalDate` 类可用于实现第二个。但是，无法直接将 `actual` 关键字添加到这些类型。

相反，你可以使用[类型别名](https://kotlinlang.org/docs/type-aliases.html)来连接预期声明和平台特有类型：

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

在这种情况下，在与预期声明相同的包中定义 `typealias` 声明，并在其他地方创建引用的类。

> 由于 `LocalDate` 类型使用 `Month` 枚举，你需要将它们都声明为公共代码中的预期类。
>
{style="note"}

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis.md#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 实际声明中的可见性扩展

你可以使实际实现比相应的预期声明更可见。如果你不想将 API 作为公共 API 暴露给公共客户端，这将很有用。

目前，在可见性更改的情况下，Kotlin 编译器会发出错误。你可以通过对实际类型别名声明应用 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 来抑制此错误。从 Kotlin 2.0 开始，此限制将不再适用。

例如，如果你在公共源代码集中声明以下预期声明：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

你也可以在平台特有的源代码集中使用以下实际实现：

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

这里，一个内部预期类有一个实际实现，使用类型别名和一个现有的公共 `MyMessenger`。

### 实际化时的额外枚举条目

当枚举在公共源代码集中使用 `expect` 声明时，每个平台模块都应该有一个相应的 `actual` 声明。这些声明必须包含相同的枚举常量，但它们也可以有额外的常量。

当你使用现有平台枚举实际化一个预期枚举时，这很有用。例如，考虑公共源代码集中的以下枚举：

```kotlin
// In the commonMain source set:
expect enum class Department { IT, HR, Sales }
```

当你在平台源代码集中为 `Department` 提供实际声明时，可以添加额外的常量：

```kotlin
// In the jvmMain source set:
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// In the nativeMain source set:
actual enum class Department { IT, HR, Sales, Marketing }
```

然而，在这种情况下，平台源代码集中的这些额外常量将与公共代码中的不匹配。因此，编译器要求你处理所有额外情况。

实现 `when` 构造在 `Department` 上的函数需要一个 `else` 子句：

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

### 预期注解类

预期与实际声明可以与注解一起使用。例如，你可以声明一个 `@XmlSerializable` 注解，它必须在每个平台源代码集中有对应的实际声明：

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

在特定平台上重用现有类型可能会有所帮助。例如，在 JVM 上，你可以使用 [JAXB 规范](https://javaee.github.io/jaxb-v2/)中的现有类型定义你的注解：

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

使用 `expect` 与注解类时还有一个额外的考虑。注解用于将元数据附加到代码，并且不会作为类型出现在签名中。对于预期注解而言，在不需要它的平台上没有实际类并不重要。

你只需要在用到注解的平台上提供 `actual` 声明。此行为默认未启用，并且它要求该类型标记有 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/)。

以上面声明的 `@XmlSerializable` 注解为例，并添加 `OptionalExpectation`：

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

如果某个平台上缺少实际声明（在该平台上不需要该声明），编译器将不会生成错误。

## 接下来？

有关使用平台特有 API 的不同方式的通用建议，请参见[使用平台特有的 API](multiplatform-connect-to-apis.md)。