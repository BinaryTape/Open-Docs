---
title: 预期声明和实际声明
---
预期声明和实际声明允许你从 Kotlin 多平台模块访问特定于平台的 API (Application Programming Interface)。
你可以在通用代码中提供平台无关的 API。

:::note
本文介绍了预期声明和实际声明的语言机制。有关使用平台特定 API 的不同方式的一般建议，请参阅[使用平台特定 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)。

## 预期声明和实际声明的规则

要定义预期声明和实际声明，请遵循以下规则：

1. 在通用源集 (common source set) 中，声明一个标准的 Kotlin 构造。这可以是一个函数、属性、类、接口、枚举或注解。
2. 使用 `expect` 关键字标记此构造。这是你的*预期声明*。这些声明可以在通用代码中使用，但不应包含任何实现。相反，特定于平台的代码会提供此实现。
3. 在每个特定于平台的源集中，在同一包中声明相同的构造，并使用 `actual` 关键字标记它。这是你的*实际声明*，它通常包含使用特定于平台的库的实现。

在为特定目标编译期间，编译器会尝试将它找到的每个*实际*声明与通用代码中相应的*预期*声明进行匹配。编译器确保：

* 通用源集中的每个预期声明在每个特定于平台的源集中都有一个匹配的实际声明。
* 预期声明不包含任何实现。
* 每个实际声明与相应的预期声明共享同一个包，例如 `org.mygroup.myapp.MyType`。

在为不同平台生成结果代码时，Kotlin 编译器会合并彼此对应的预期声明和实际声明。它为每个平台生成一个带有其实际实现的声明。通用代码中对预期声明的每次使用都会调用结果平台代码中正确的实际声明。

当使用在不同目标平台之间共享的中间源集时，可以声明实际声明。例如，考虑 `iosMain` 作为一个在 `iosX64Main`、`iosArm64Main` 和 `iosSimulatorArm64Main` 平台源集之间共享的中间源集。通常只有 `iosMain` 包含实际声明，而不是平台源集。然后，Kotlin 编译器将使用这些实际声明来生成相应平台的结果代码。

IDE 帮助解决常见问题，包括：

* 缺失的声明
* 包含实现的预期声明
* 不匹配的声明签名
* 不同包中的声明

你还可以使用 IDE 从预期声明导航到实际声明。选择装订线图标以查看实际声明，或使用[快捷方式](https://www.jetbrains.com/help/idea/navigating-through-the-source-code.html#go_to_implementation)。

<img src="/img/expect-actual-gutter.png" alt="IDE navigation from expected to actual declarations" width="500" style={{verticalAlign: 'middle'}}/>

## 使用预期声明和实际声明的不同方法

让我们探讨使用 expect/actual 机制来解决访问平台 API 的问题的不同选项，同时仍然提供一种在通用代码中使用它们的方法。

考虑一个 Kotlin 多平台项目，你需要实现 `Identity` 类型，它应该包含用户的登录名和当前进程 ID。该项目具有 `commonMain`、`jvmMain` 和 `nativeMain` 源集，以使应用程序在 JVM 和本机环境（如 iOS）中工作。

### 预期和实际函数

你可以定义一个 `Identity` 类型和一个工厂函数 `buildIdentity()`，该函数在通用源集中声明，并在平台源集中以不同的方式实现：

1. 在 `commonMain` 中，声明一个简单的类型并预期一个工厂函数：

   ```kotlin
   package identity

   class Identity(val userName: String, val processID: Long)
  
   expect fun buildIdentity(): Identity
   ```

2. 在 `jvmMain` 源集中，使用标准的 Java 库实现一个解决方案：

   ```kotlin
   package identity
  
   import java.lang.System
   import java.lang.ProcessHandle

   actual fun buildIdentity() = Identity(
       System.getProperty("user.name") ?: "None",
       ProcessHandle.current().pid()
   )
   ```

3. 在 `nativeMain` 源集中，使用本机依赖项实现一个带有 [POSIX](https://en.wikipedia.org/wiki/POSIX) 的解决方案：

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

  这里，平台函数返回特定于平台的 `Identity` 实例。

从 Kotlin 1.9.0 开始，使用 `getlogin()` 和 `getpid()` 函数需要 `@OptIn` 注解。

:::

### 带有预期和实际接口的函数

如果工厂函数变得太大，请考虑使用通用的 `Identity` 接口，并在不同的平台上以不同的方式实现它。

`buildIdentity()` 工厂函数应该返回 `Identity`，但这次，它是一个实现通用接口的对象：

1. 在 `commonMain` 中，定义 `Identity` 接口和 `buildIdentity()` 工厂函数：

   ```kotlin
   // 在 commonMain 源集中：
   expect fun buildIdentity(): Identity
   
   interface Identity {
       val userName: String
       val processID: Long
   }
   ```

2. 创建接口的平台特定实现，而无需额外使用预期声明和实际声明：

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

这些平台函数返回特定于平台的 `Identity` 实例，这些实例被实现为 `JVMIdentity` 和 `NativeIdentity` 平台类型。

#### 预期和实际属性

你可以修改前面的示例，并预期一个 `val` 属性来存储 `Identity`。

将此属性标记为 `expect val`，然后在平台源集中实现它：

```kotlin
//在 commonMain 源集中：
expect val identity: Identity

interface Identity {
    val userName: String
    val processID: Long
}
```

```kotlin
//在 jvmMain 源集中：
actual val identity: Identity = JVMIdentity()

class JVMIdentity(
    override val userName: String = System.getProperty("user.name") ?: "none",
    override val processID: Long = ProcessHandle.current().pid()
) : Identity
```

```kotlin
//在 nativeMain 源集中：
actual val identity: Identity = NativeIdentity()

class NativeIdentity(
    override val userName: String = getlogin()?.toKString() ?: "None",
    override val processID: Long = getpid().toLong()
) : Identity
```

#### 预期和实际对象

当 `IdentityBuilder` 预计在每个平台上都是单例时，你可以将其定义为预期对象，并让平台实现它：

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

#### 依赖注入建议

为了创建松散耦合的架构，许多 Kotlin 项目采用了依赖注入 (DI, Dependency Injection) 框架。DI 框架允许基于当前环境将依赖项注入到组件中。

例如，你可能会在测试和生产中注入不同的依赖项，或者在部署到云与本地托管时注入不同的依赖项。只要通过接口表达依赖项，就可以注入任意数量的不同实现，无论是在编译时还是在运行时。

当依赖项是特定于平台的时，相同的原则也适用。在通用代码中，组件可以使用常规的 [Kotlin 接口](interfaces) 来表达其依赖项。然后，可以配置 DI 框架以注入特定于平台的实现，例如，来自 JVM 或 iOS 模块。

这意味着预期声明和实际声明仅在 DI 框架的配置中才需要。有关示例，请参阅[使用平台特定 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html#dependency-injection-framework)。

使用这种方法，你可以简单地通过使用接口和工厂函数来采用 Kotlin 多平台。如果已经使用 DI 框架来管理项目中的依赖项，我们建议使用相同的方法来管理平台依赖项。

### 预期和实际类

:::note
预期类和实际类处于 [Beta](components-stability) 阶段。
它们几乎是稳定的，但将来可能需要迁移步骤。
我们将尽最大努力尽量减少你需要进行的任何进一步更改。

你可以使用预期类和实际类来实现相同的解决方案：

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

你可能已经在演示材料中看到过这种方法。但是，在接口足以满足简单需求的情况下使用类是*不推荐的*。

使用接口，你不必将设计限制为每个目标平台一个实现。此外，在测试中替换伪实现或在单个平台上提供多个实现要容易得多。

作为一般规则，尽可能依赖标准语言构造，而不是使用预期声明和实际声明。

如果你确实决定使用预期类和实际类，Kotlin 编译器将警告你该功能处于 Beta 状态。要禁止此警告，请将以下编译器选项添加到你的 Gradle 构建文件中：

```kotlin
kotlin {
    compilerOptions {
        // Common compiler options applied to all Kotlin source sets
        freeCompilerArgs.add("-Xexpect-actual-classes")
    }
}
```

#### 从平台类继承

在某些特殊情况下，将 `expect` 关键字与类一起使用可能是最佳方法。假设 `Identity` 类型已经在 JVM 上存在：

```kotlin
open class Identity {
    val login: String = System.getProperty("user.name") ?: "none"
    val pid: Long = ProcessHandle.current().pid()
}
```

为了使其适应现有的代码库和框架，你的 `Identity` 类型的实现可以从此类型继承并重用其功能：

1. 要解决此问题，请使用 `expect` 关键字在 `commonMain` 中声明一个类：

   ```kotlin
   expect class CommonIdentity() {
       val userName: String
       val processID: Long
   }
   ```

2. 在 `nativeMain` 中，提供一个实现该功能的实际声明：

   ```kotlin
   actual class CommonIdentity {
       actual val userName = getlogin()?.toKString() ?: "None"
       actual val processID = getpid().toLong()
   }
   ```

3. 在 `jvmMain` 中，提供一个从平台特定基类继承的实际声明：

   ```kotlin
   actual class CommonIdentity : Identity() {
       actual val userName = login
       actual val processID = pid
   }
   ```

在这里，`CommonIdentity` 类型与你自己的设计兼容，同时利用了 JVM 上现有的类型。

#### 在框架中的应用

作为框架作者，你还可以发现预期声明和实际声明对你的框架很有用。

如果上面的示例是框架的一部分，则用户必须从 `CommonIdentity` 派生出一个类型以提供显示名称。

在这种情况下，预期声明是抽象的并声明一个抽象方法：

```kotlin
// 在框架代码库的 commonMain 中：
expect abstract class CommonIdentity() {
    val userName: String
    val processID: Long
    abstract val displayName: String
}
```

类似地，实际实现是抽象的并声明 `displayName` 方法：

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

框架用户需要编写从预期声明继承并自己实现缺失方法的通用代码：

```kotlin
// 在用户代码库的 commonMain 中：
class MyCommonIdentity : CommonIdentity() {
    override val displayName = "Admin"
}
```

<!-- A similar scheme works in any library that provides a common `ViewModel` for Android or iOS development. Such a library
typically provides an expected `CommonViewModel` class whose actual Android counterpart extends the `ViewModel` class
from the Android framework. See [Use platform-specific APIs](multiplatform-connect-to-apis#adapting-to-an-existing-hierarchy-using-expected-actual-classes)
for a detailed description of this example. -->

## 高级用例

关于预期声明和实际声明，存在许多特殊情况。

### 使用类型别名来满足实际声明

实际声明的实现不必从头开始编写。它可以是现有类型，例如第三方库提供的类。

只要此类型满足与预期声明关联的所有要求，你就可以使用它。例如，考虑以下两个预期声明：

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

在 JVM 模块中，`java.time.Month` 枚举可用于实现第一个预期声明，而 `java.time.LocalDate` 类可用于实现第二个预期声明。但是，没有办法直接将 `actual` 关键字添加到这些类型。

相反，你可以使用[类型别名](type-aliases)来连接预期声明和平台特定类型：

```kotlin
actual typealias Month = java.time.Month
actual typealias MyDate = java.time.LocalDate
```

在这种情况下，在与预期声明相同的包中定义 `typealias` 声明，并在其他地方创建被引用的类。

由于 `LocalDate` 类型使用 `Month` 枚举，因此你需要将它们都声明为通用代码中的预期类。

:::

<!-- See [Using platform-specific APIs](multiplatform-connect-to-apis#actualizing-an-interface-or-a-class-with-an-existing-platform-class-using-typealiases)
for an Android-specific example of this pattern. -->

### 实际声明中扩展的可见性

你可以使实际实现的可见性高于相应的预期声明。如果你不想将你的 API 作为公共 API 暴露给通用客户端，这将非常有用。

目前，Kotlin 编译器在可见性更改的情况下会发出错误。你可以通过将 `@Suppress("ACTUAL_WITHOUT_EXPECT")` 应用于实际类型别名声明来禁止此错误。从 Kotlin 2.0 开始，此限制将不适用。

例如，如果在通用源集中声明以下预期声明：

```kotlin
internal expect class Messenger {
    fun sendMessage(message: String)
}
```

你也可以在特定于平台的源集中使用以下实际实现：

```kotlin
@Suppress("ACTUAL_WITHOUT_EXPECT")
public actual typealias Messenger = MyMessenger
```

在这里，一个内部预期类有一个带有现有公共 `MyMessenger` 的实际实现，该实现使用类型别名。

### 实际化中的其他枚举条目

当使用 `expect` 在通用源集中声明枚举时，每个平台模块都应具有相应的 `actual` 声明。这些声明必须包含相同的枚举常量，但它们也可以具有其他常量。

当你使用现有平台枚举来实现预期的枚举时，这非常有用。例如，考虑通用源集中的以下枚举：

```kotlin
// 在 commonMain 源集中：
expect enum class Department { IT, HR, Sales }
```

当你为平台源集中的 `Department` 提供实际声明时，你可以添加额外的常量：

```kotlin
// 在 jvmMain 源集中：
actual enum class Department { IT, HR, Sales, Legal }
```

```kotlin
// 在 nativeMain 源集中：
actual enum class Department { IT, HR, Sales, Marketing }
```

但是，在这种情况下，平台源集中的这些额外常量将与通用代码中的常量不匹配。因此，编译器要求你处理所有其他情况。

在 `Department` 上实现 `when` 构造的函数需要一个 `else` 子句：

```kotlin
// 需要一个 else 子句：
fun matchOnDepartment(dept: Department) {
    when (dept) {
        Department.IT `->` println("The IT Department")
        Department.HR `->` println("The HR Department")
        Department.Sales `->` println("The Sales Department")
        else `->` println("Some other department")
    }
}
```

<!-- If you'd like to forbid adding new constants in the actual enum, please vote for this issue [TODO]. -->

### 预期注解类

预期声明和实际声明可以与注解一起使用。例如，你可以声明一个 `@XmlSerializable` 注解，该注解必须在每个平台源集中具有相应的实际声明：

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
expect annotation class XmlSerializable()

@XmlSerializable
class Person(val name: String, val age: Int)
```

重用特定平台上的现有类型可能会很有帮助。例如，在 JVM 上，你可以使用 [JAXB 规范](https://javaee.github.com/jaxb-v2/)中的现有类型定义你的注解：

```kotlin
import javax.xml.bind.annotation.XmlRootElement

actual typealias XmlSerializable = XmlRootElement
```

将 `expect` 与注解类一起使用时，还需要考虑其他事项。注解用于将元数据附加到代码，并且不会作为类型出现在签名中。对于预期注解来说，在不需要它的平台上拥有一个实际类并不是必不可少的。

你只需要在使用注解的平台上提供 `actual` 声明。默认情况下不启用此行为，它需要使用 [`OptionalExpectation`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-optional-expectation/) 标记类型。

获取上面声明的 `@XmlSerializable` 注解并添加 `OptionalExpectation`：

```kotlin
@OptIn(ExperimentalMultiplatform::class)
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@OptionalExpectation
expect annotation class XmlSerializable()
```

如果一个实际声明在不需要它的平台上缺失，编译器不会生成错误。

## 接下来是什么？

有关使用平台特定 API 的不同方式的一般建议，请参阅[使用平台特定 API](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html)。