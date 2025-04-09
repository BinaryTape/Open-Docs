---
title: "Kotlin Multiplatform における依存性注入 (Dependency Injection)"
---
## Source Project

:::info
 Kotlin Multiplatform プロジェクトはこちらにあります: https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle Dependencies

Koin は純粋な Kotlin ライブラリであり、共有 Kotlin プロジェクトで使用できます。コア依存関係を追加するだけです。

共通プロジェクトに `koin-core` を追加し、依存関係を宣言します: [https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

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

## Shared Koin Module

プラットフォーム固有のコンポーネントはここに宣言でき、Android または iOS で後で使用できます（実際のクラスまたは実際のモジュールで直接宣言されます）。

共有モジュールのソースはこちらにあります: https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

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

Koin モジュールは、関数を介して収集する必要があります。

```kotlin
// Common App Definitions
fun appModule() = listOf(commonModule, platformModule)
```

## Android App

`koin-android` の機能を引き続き使用し、共通のモジュール/クラスを再利用できます。

Android アプリのコードはこちらにあります: https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS App

iOS アプリのコードはこちらにあります: https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### Calling Koin

Koin 関数へのラッパーを準備しましょう（共有コード内）：

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

メインアプリのエントリで初期化できます。

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

### Injected Classes

Swift から Kotlin クラスのインスタンスを呼び出してみましょう。

Kotlin コンポーネント:

```kotlin
// Injection Boostrap Helper
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

Swift アプリ内:

```kotlin
struct ContentView: View {
        // Create helper instance
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### New Native Memory Management

ルートの [gradle.properties](https://kotlinlang.org/docs/native-memory-manager.html) で実験的な機能をアクティブにします。

    ```