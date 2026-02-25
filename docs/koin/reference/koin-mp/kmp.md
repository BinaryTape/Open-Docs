---
title: Kotlin Multiplatform 依赖注入
---

## 源码项目

:::info
 您可以在这里找到 Kotlin Multiplatform 项目：https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle 依赖项

Koin 是一个纯 Kotlin 库，可以在您的共享 Kotlin 项目中使用。只需添加核心依赖项：

在 common 项目中添加 `koin-core`，声明您的依赖项：[https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

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

平台特定组件可以在这里声明，随后可在 Android 或 iOS 中使用（直接使用 `actual` 类甚至 `actual` 模块声明）。

您可以在这里找到共享模块源码：https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

```kotlin
// platform 模块
val platformModule = module {
    singleOf(::Platform)
}

// KMP 类定义
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

Koin 模块需要通过一个函数进行收集：

```kotlin
// 通用应用定义
fun appModule() = listOf(commonModule, platformModule)
```

## Android 应用

您可以继续使用 `koin-android` 功能并重用 common 模块/类。

Android 应用的代码可以在这里找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS 应用

iOS 应用的代码可以在这里找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### 调用 Koin

让我们为 Koin 函数准备一个包装器（在共享代码中）：

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

我们可以在主应用入口中对其进行初始化：

```kotlin
@main
struct iOSApp: App {
    
    // KMM - Koin 调用
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
// 注入引导辅助程序
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

在我们的 Swift 应用中：

```kotlin
struct ContentView: View {
        // 创建辅助程序实例
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### 新的原生内存管理

在根目录 [gradle.properties](https://kotlinlang.org/docs/native-memory-manager.html) 中激活实验性功能。