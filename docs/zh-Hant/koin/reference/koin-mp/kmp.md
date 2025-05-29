---
title: Kotlin Multiplatform 依賴注入
---

## 原始專案

:::info
您可以在此找到 Kotlin Multiplatform 專案：https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle 依賴項

Koin 是一個純 Kotlin 函式庫，可以在您的共享 Kotlin 專案中使用。只需添加核心依賴項：

在 common 專案中添加 `koin-core`，宣告您的依賴項：[https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

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

## 共享 Koin 模組

平台特定 (Platform specific) 的元件可以在此處宣告，並稍後用於 Android 或 iOS (直接透過實際類別或甚至實際模組宣告)。

您可以在此處找到共享模組的原始碼：https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

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

Koin 模組需要透過函式來收集：

```kotlin
// Common App Definitions
fun appModule() = listOf(commonModule, platformModule)
```

## Android 應用程式

您可以繼續使用 `koin-android` 的功能並重複使用共同模組/類別。

Android 應用程式的程式碼可以在此處找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS 應用程式

iOS 應用程式的程式碼可以在此處找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### 呼叫 Koin

讓我們為 Koin 函式準備一個包裝器 (wrapper)（在我們的共享程式碼中）：

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

我們可以在主應用程式入口處將其初始化：

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

### 注入的類別

讓我們從 Swift 呼叫一個 Kotlin 類別實例。

我們的 Kotlin 元件：

```kotlin
// Injection Boostrap Helper
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

在我們的 Swift 應用程式中：

```kotlin
struct ContentView: View {
        // Create helper instance
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### 新的原生記憶體管理

透過根級 [gradle.properties](https://kotlinlang.org/docs/native-memory-manager.html) 啟用實驗性功能。