[//]: # (title: 使用平台特有的 API)

在本文中，你将学习如何在开发多平台应用程序和库时使用平台特有的 API。

## Kotlin 多平台库

在编写使用平台特有 API 的代码之前，请检查是否可以使用多平台库代替。这类库提供公共 Kotlin API，但针对不同平台有不同的实现。

目前已有许多可用库，可用于实现网络、日志和分析，以及访问设备功能等。更多信息，请参见 [此精选列表](https://github.com/terrakok/kmm-awesome)。

## 预期与实际函数和属性

Kotlin 提供一种语言机制，用于在开发公共逻辑时访问平台特有 API：[预期与实际声明](multiplatform-expect-actual.md)。

借助此机制，多平台模块的公共源代码集定义预期声明，并且每个平台源代码集都必须提供与预期声明相对应的实际声明。编译器会确保公共源代码集中所有用 `expect` 关键字标记的声明，在所有目标平台源代码集中都有用 `actual` 关键字标记的相应声明。

这适用于大多数 Kotlin 声明，例如函数、类、接口、枚举、属性和注解。本节重点介绍如何使用预期与实际函数和属性。

![使用预期与实际函数和属性](expect-functions-properties.svg){width=700}

在此示例中，你将在公共源代码集中定义预期 `platform()` 函数，并在平台源代码集中提供实际实现。在为特定平台生成代码时，Kotlin 编译器会合并预期与实际声明。它会生成一个带有实际实现的 `platform()` 函数。预期与实际声明应定义在同一包中，并在生成的平台代码中合并为_一个声明_。对生成的平台代码中预期 `platform()` 函数的任何调用都将调用正确的实际实现。

### 示例：生成 UUID

假设你正在使用 Kotlin Multiplatform 开发 iOS 和 Android 应用程序，并希望生成一个全局唯一标识符 (UUID)。

为此，在 Kotlin Multiplatform 模块的公共源代码集中，使用 `expect` 关键字声明预期函数 `randomUUID()`。**不要**包含任何实现代码。

```kotlin
// 在公共源代码集中：
expect fun randomUUID(): String
```

在每个平台特有的源代码集（iOS 和 Android）中，为公共模块中预期的 `randomUUID()` 函数提供实际实现。使用 `actual` 关键字标记这些实际实现。

![使用预期与实际声明生成 UUID](expect-generate-uuid.svg){width=700}

以下代码片段展示了 Android 和 iOS 的实现。平台特有的代码使用 `actual` 关键字和相同的函数名：

```kotlin
// 在 Android 源代码集中：
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// 在 iOS 源代码集中：
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Android 实现使用 Android 上可用的 API，而 iOS 实现使用 iOS 上可用的 API。你可以从 Kotlin/Native 代码访问 iOS API。

在为 Android 生成结果平台代码时，Kotlin 编译器会自动合并预期与实际声明，并生成一个带有实际 Android 特有实现的 `randomUUID()` 函数。iOS 也重复同样的过程。

为简化起见，本例及后续示例使用简化过的源代码集名称 “common”、“ios”和“android”。通常，这意味着 `commonMain`、`iosMain` 和 `androidMain`，类似的逻辑也可以定义在测试源代码集 `commonTest`、`iosTest` 和 `androidTest` 中。

与预期与实际函数类似，预期与实际属性允许你在不同平台上使用不同的值。预期与实际函数和属性最适用于简单情况。

## 公共代码中的接口

如果平台特有逻辑过于庞大和复杂，你可以通过在公共代码中定义一个接口来表示它，然后在平台源代码集中提供不同的实现，从而简化代码。

![使用接口](expect-interfaces.svg){width=700}

平台源代码集中的这些实现使用其对应的依赖项：

```kotlin
// 在 commonMain 源代码集中：
interface Platform {
    val name: String
}
```

```kotlin
// 在 androidMain 源代码集中：
import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
}
```

```kotlin
// 在 iosMain 源代码集中：
import platform.UIKit.UIDevice

class IOSPlatform : Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}
```

当你需要公共接口时，要注入合适的平台实现，可以选择以下选项之一，每个选项将在下面详细解释：

*   [使用预期与实际函数](#expected-and-actual-functions)
*   [通过不同入口点提供实现](#different-entry-points)
*   [使用依赖注入框架](#dependency-injection-framework)

### 预期与实际函数

定义一个返回此接口值的预期函数，然后定义返回其子类的实际函数：

```kotlin
// 在 commonMain 源代码集中：
interface Platform

expect fun platform(): Platform
```

```kotlin
// 在 androidMain 源代码集中：
class AndroidPlatform : Platform

actual fun platform() = AndroidPlatform()
```

```kotlin
// 在 iosMain 源代码集中：
class IOSPlatform : Platform

actual fun platform() = IOSPlatform()
```

当你在公共代码中调用 `platform()` 函数时，它可处理 `Platform` 类型的对象。当你在 Android 上运行此公共代码时，`platform()` 调用将返回 `AndroidPlatform` 类的实例。当你在 iOS 上运行时，`platform()` 返回 `IOSPlatform` 类的实例。

### 不同入口点

如果你控制入口点，则无需使用预期与实际声明即可构建每个平台构件的实现。为此，请在共享 Kotlin Multiplatform 模块中定义平台实现，但在平台模块中实例化它们：

```kotlin
// 共享 Kotlin Multiplatform 模块
// 在 commonMain 源代码集中：
interface Platform

fun application(p: Platform) {
    // application logic
}
```

```kotlin
// 在 androidMain 源代码集中：
class AndroidPlatform : Platform
```

```kotlin
// 在 iosMain 源代码集中：
class IOSPlatform : Platform
```

```kotlin
// 在 androidApp 平台模块中：
import android.app.Application
import mysharedpackage.*

class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        application(AndroidPlatform())
    }
}
```

```Swift
// 在 iosApp 平台模块中（使用 Swift）：
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

在 Android 上，你应该创建 `AndroidPlatform` 的实例并将其传递给 `application()` 函数；而在 iOS 上，你也应同样创建并传递 `IOSPlatform` 的实例。这些入口点不必是你应用程序的入口点，但这是你可以调用共享模块特有功能的地方。

通过预期与实际函数或直接通过入口点提供正确的实现，对于简单场景来说效果良好。然而，如果你在项目中使用了依赖注入框架，我们建议在简单情况下也使用它，以确保一致性。

### 依赖注入框架

现代应用程序通常使用依赖注入 (DI) 框架来创建松散耦合的架构。DI 框架允许基于当前环境将依赖项注入组件。

任何支持 Kotlin Multiplatform 的 DI 框架都可以帮助你为不同平台注入不同的依赖项。

例如，[Koin](https://insert-koin.io/) 是一个支持 Kotlin Multiplatform 的依赖注入框架：

```kotlin
// 在公共源代码集中：
import org.koin.dsl.module

interface Platform

expect val platformModule: Module
```

```kotlin
// 在 androidMain 源代码集中：
class AndroidPlatform : Platform

actual val platformModule: Module = module {
    single<Platform> {
        AndroidPlatform()
    }
}
```

```kotlin
// 在 iosMain 源代码集中：
class IOSPlatform : Platform

actual val platformModule = module {
    single<Platform> { IOSPlatform() }
}
```

这里，Koin DSL 创建模块，定义用于注入的组件。你使用 `expect` 关键字在公共代码中声明一个模块，然后为每个平台提供平台特有的实现，使用 `actual` 关键字。该框架负责在运行时选择正确的实现。

当你使用 DI 框架时，你将通过此框架注入所有依赖项。同样的逻辑也适用于处理平台依赖项。如果你的项目中已经使用了 DI，我们建议继续使用它，而不是手动使用预期与实际函数。这样，你可以避免混用两种不同的依赖注入方式。

你不必总是在 Kotlin 中实现公共接口。你可以在另一种语言（例如 Swift）中，在另一个_平台模块_中实现它。如果你选择这种方法，则应该使用 DI 框架从 iOS 平台模块提供实现：

![使用依赖注入框架](expect-di-framework.svg){width=700}

这种方法只有在你将实现放在平台模块中时才有效。它不是非常可伸缩，因为你的 Kotlin Multiplatform 模块无法自给自足，并且你需要在一个不同的模块中实现公共接口。

<!-- 如果你对将此功能扩展到共享模块感兴趣，请在 Youtrack 中为该问题投票并描述你的用例。 -->

## 接下来呢？

*   观看 [在 KMP 应用中使用平台特有 API](https://youtu.be/bSNumV04y_w) 的视频演示。
*   有关预期/实际机制的更多示例和信息，请参见 [预期与实际声明](multiplatform-expect-actual.md)。