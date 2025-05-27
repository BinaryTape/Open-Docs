---
title: Kotlin 多平台依赖注入
---

## 源代码项目

:::info
您可以在此处找到 Kotlin 多平台项目：https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle 依赖

Koin 是一个纯 Kotlin 库，可在您的共享 Kotlin 项目中使用。只需添加核心依赖项：

在公共项目中添加 `koin-core`，声明您的依赖项：[https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

```kotlin
// Dependencies.kt

object Versions {
    const val koin = "3.2.0"
}

object Deps {

    object Koin {
        const val core = "io.insert-koin:koin-core:${Versions.koin}"
        const val test = "io.insert-koin:koin-test:${Versions.koin}"
        const val android = "io.insert-koin:koin-android:${Versions.koin}"
    }

}
```

## 共享 Koin 模块

平台特定组件可在此处声明，并可在 Android 或 iOS 中使用（直接使用实际类或实际模块声明）。

您可以在此处找到共享模块的源代码：https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

```kotlin
// platform Module
val platformModule = module {
    singleOf(::Platform)
}

// KMP Class Definition
expect class Platform() {
    val name: String
}

// iOS
actual class Platform actual constructor() {
    actual val name: String =
        UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}

// Android
actual class Platform actual constructor() {
    actual val name: String = "Android ${android.os.Build.VERSION.SDK_INT}"
}
```

Koin 模块需要通过一个函数进行聚合：

```kotlin
// Common App Definitions
fun appModule() = listOf(commonModule, platformModule)
```

## Android 应用

您可以继续使用 `koin-android` 功能并复用公共模块/类。

Android 应用的代码可以在此处找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS 应用

iOS 应用的代码可以在此处找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### 调用 Koin

让我们为 Koin 函数（在我们的共享代码中）准备一个包装器：

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

我们可以在主应用入口对其进行初始化：

```kotlin
@main
struct iOSApp: App {
    
    // KMM - Koin Call
    init() {
        HelperKt.doInitKoin()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

### 注入的类

让我们从 Swift 调用一个 Kotlin 类实例。

我们的 Kotlin 组件：

```kotlin
// Injection Boostrap Helper
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

在我们的 Swift 应用中：

```kotlin
struct ContentView: View {
        // Create helper instance
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### 新的原生内存管理

通过根 [gradle.properties](https://kotlinlang.org/docs/native-memory-manager.html) 激活实验性功能。