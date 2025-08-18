`[//]: # (title: 使用平台特有的 API)`

在本文中，你将学习如何在开发多平台应用程序和库时使用平台特有的 API。

## Kotlin 多平台库

在编写使用平台特有的 API 的代码之前，检测你是否可以使用多平台库来替代。这类库提供一个通用的 Kotlin API，该 API 在不同平台上有不同的实现。

已经有许多可用的库，你可以使用它们来实现网络、日志记录和分析功能，以及访问设备功能等。关于更多信息，请参见 [此精选列表](https://github.com/terrakok/kmm-awesome)。

## 期望与实际函数及属性

Kotlin 提供一种语言机制，用于在开发通用逻辑时访问平台特有的 API：[期望与实际声明](multiplatform-expect-actual.md)。

通过此机制，多平台模块的公共源代码集定义一个期望声明，并且每个平台源代码集都必须提供与该期望声明对应的实际声明。编译器确保公共源代码集中用 `expect` 关键字标记的每个声明都在所有目标平台源代码集中具有用 `actual` 关键字标记的对应声明。

这适用于大多数 Kotlin 声明，例如函数、类、接口、枚举、属性和注解。本节侧重于使用期望与实际函数及属性。

![使用期望与实际函数及属性](expect-functions-properties.svg){width=700}

在此示例中，你将在公共源代码集中定义一个期望的 `platform()` 函数，并在平台源代码集中提供实际实现。在为特定平台生成代码时，Kotlin 编译器会合并期望与实际声明。它会生成一个 `platform()` 函数及其实际实现。期望与实际声明应在同一个包中定义，并在结果平台代码中合并为 _一个声明_。在生成的平台代码中，对期望 `platform()` 函数的任何调用都将调用正确的实际实现。

### 示例：生成一个 UUID

假设你正在使用 Kotlin Multiplatform 开发 iOS 和 Android 应用程序，并且想要生成一个通用唯一标识符 (UUID)。

为此，在你的 Kotlin Multiplatform 模块的公共源代码集中，用 `expect` 关键字声明期望函数 `randomUUID()`。**不要** 包含任何实现代码。

```kotlin
// 在公共源代码集中：
expect fun randomUUID(): String
```

在每个平台特有的源代码集（iOS 和 Android）中，为公共模块中期望的 `randomUUID()` 函数提供实际实现。使用 `actual` 关键字来标记这些实际实现。

![使用期望与实际声明生成 UUID](expect-generate-uuid.svg){width=700}

以下代码片段展示了 Android 和 iOS 的实现。平台特有的代码使用 `actual` 关键字和相同的函数名称：

```kotlin
// 在 android 源代码集中：
import java.util.*

actual fun randomUUID() = UUID.randomUUID().toString()
```

```kotlin
// 在 iOS 源代码集中：
import platform.Foundation.NSUUID

actual fun randomUUID(): String = NSUUID().UUIDString()
```

Android 实现使用 Android 上可用的 API，而 iOS 实现使用 iOS 上可用的 API。你可以从 Kotlin/Native 代码访问 iOS API。

在为 Android 生成结果平台代码时，Kotlin 编译器自动合并期望与实际声明，并生成一个 `randomUUID()` 函数及其 Android 特有的实际实现。iOS 也重复同样的过程。

为简化起见，本示例和以下示例使用简化的源代码集名称 “common”、“ios” 和 “android”。通常，这表示 `commonMain`、`iosMain` 和 `androidMain`，并且类似的逻辑可以定义在测试源代码集 `commonTest`、`iosTest` 和 `androidTest` 中。

与期望与实际函数类似，期望与实际属性允许你在不同平台使用不同的值。期望与实际函数及属性对于简单情况最有用。

## 通用代码中的接口

如果平台特有的逻辑过大且复杂，你可以通过在通用代码中定义一个接口来表示它，然后在平台源代码集中提供不同的实现，从而简化你的代码。

![使用接口](expect-interfaces.svg){width=700}

平台源代码集中的实现使用它们对应的依赖项：

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

当需要通用接口时，为了注入合适的平台实现，你可以选择以下选项之一，每个选项都将在下面详细解释：

*   [使用期望与实际函数](#expected-and-actual-functions)
*   [通过不同入口点提供实现](#different-entry-points)
*   [使用依赖注入框架](#dependency-injection-framework)

### 期望与实际函数

定义一个返回此接口值的期望函数，然后定义返回其子类的实际函数：

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

当你在通用代码中调用 `platform()` 函数时，它可以使用 `Platform` 类型的对象。当你在 Android 上运行此通用代码时，`platform()` 调用将返回 `AndroidPlatform` 类的一个实例。当你在 iOS 上运行它时，`platform()` 将返回 `IOSPlatform` 类的一个实例。

### 不同入口点

如果你控制入口点，则无需使用期望与实际声明即可构造每个平台构件的实现。为此，在共享 Kotlin Multiplatform 模块中定义平台实现，但在平台模块中实例化它们：

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
// 在 iosApp 平台模块中（在 Swift 中）：
import shared

@main
struct iOSApp : App {
    init() {
        application(IOSPlatform())
    }
}
```

在 Android 上，你应该创建一个 `AndroidPlatform` 实例并将其传递给 `application()` 函数，而在 iOS 上，你应该类似地创建并传递一个 `IOSPlatform` 实例。这些入口点不必是你的应用程序的入口点，但你可以在这里调用共享模块的特定功能。

通过期望与实际函数或直接通过入口点提供正确的实现对于简单场景效果良好。然而，如果你的项目中使用依赖注入框架，我们建议在简单情况下也使用它以确保一致性。

### 依赖注入框架

现代应用程序通常使用依赖注入 (DI) 框架来创建松散耦合架构。DI 框架允许根据当前环境将依赖项注入组件。

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

在这里，Koin DSL 创建定义用于注入组件的模块。你在通用代码中使用 `expect` 关键字声明一个模块，然后使用 `actual` 关键字为每个平台提供一个平台特有的实现。框架负责在运行时选择正确的实现。

当你使用 DI 框架时，你会通过此框架注入所有依赖项。同样的逻辑也适用于处理平台依赖项。如果你的项目中已经使用了 DI，我们建议继续使用它，而不是手动使用期望与实际函数。这样，你可以避免混合两种不同的依赖注入方式。

你也不必总是在 Kotlin 中实现通用接口。你可以在另一种语言（例如 Swift）中，在不同的 _平台模块_ 中完成。如果你选择这种方法，你应该然后使用 DI 框架从 iOS 平台模块提供实现：

![使用依赖注入框架](expect-di-framework.svg){width=700}

这种方法仅在你将实现放在平台模块中时有效。它并不是很可伸缩，因为你的 Kotlin Multiplatform 模块无法自给自足，并且你需要在不同的模块中实现通用接口。

<!-- If you're interested in having this functionality expanded to a shared module, please vote for this issue in Youtrack and describe your use case. -->

## 下一步是什么？

*   观看 [在 KMP 应用程序中使用平台特有的 API](https://youtu.be/bSNumV04y_w) 的视频演练。
*   关于期望/实际机制的更多示例和信息，请参见 [期望与实际声明](multiplatform-expect-actual.md)。