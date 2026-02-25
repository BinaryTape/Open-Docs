---
title: Kotlin Multiplatform 相依注入
---

## 來源專案

:::info
 您可以在此處找到 Kotlin Multiplatform 專案：https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle 相依性

Koin 是一個純 Kotlin 程式庫，可以在您的共享 Kotlin 專案中使用。只需新增核心相依性即可：

在一般專案中新增 `koin-core`，宣告您的相依性：[https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

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

平台相關元件可以在此處宣告，並稍後在 Android 或 iOS 中使用（直接使用實際類別或甚至是實際模組來宣告）

您可以在此處找到共享模組原始碼：https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

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

Koin 模組需要透過一個函式進行彙整：

```kotlin
// Common App Definitions
fun appModule() = listOf(commonModule, platformModule)
```

## Android 應用程式

您可以繼續使用 `koin-android` 功能，並重複使用一般模組／類別。

Android 應用程式的程式碼可以在此處找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS 應用程式

iOS 應用程式的程式碼可以在此處找到：https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### 呼叫 Koin

讓我們為我們的 Koin 函式準備一個包裝函式（在我們的共享程式碼中）：

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

我們可以在應用程式主入口進行初始化：

```kotlin
@main
struct iOSApp: App {
    
    // KMM - Koin 呼叫
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

讓我們從 Swift 呼叫一個 Kotlin 類別執行個體。

我們的 Kotlin 元件：

```kotlin
// 注入引導協助工具
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

在我們的 Swift 應用程式中：

```kotlin
struct ContentView: View {
        // 建立協助工具執行個體
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### 新的原生記憶體管理

在根目錄的 `gradle.properties` 中啟用[實驗功能](https://kotlinlang.org/docs/native-memory-manager.html)。