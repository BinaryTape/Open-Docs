---
title: Kotlin Multiplatform の依存関係注入
---

## ソースプロジェクト

:::info
 Kotlin Multiplatform プロジェクトはこちらにあります: https://github.com/InsertKoinIO/hello-kmp
:::

## Gradle の依存関係

Koin は純粋な Kotlin ライブラリであり、共有 Kotlin プロジェクトで使用できます。コアの依存関係を追加するだけです。

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

## 共有 Koin モジュール

プラットフォーム固有のコンポーネントをここで宣言し、後で Android または iOS で使用できます（実際のクラスまたは実際のモジュールを使用して直接宣言します）。

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

## Android アプリ

`koin-android` の機能を引き続き使用し、共通のモジュールやクラスを再利用できます。

Android アプリのコードはこちらにあります: https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOS アプリ

iOS アプリのコードはこちらにあります: https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### Koin の呼び出し

Koin 関数へのラッパーを用意しましょう（共有コード内）:

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

メインアプリのエントリポイントで初期化できます:

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

### インジェクトされたクラス

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

### 新しいネイティブメモリ管理

ルートの [gradle.properties](https://kotlinlang.org/docs/native-memory-manager.html) で実験的機能を有効にします。