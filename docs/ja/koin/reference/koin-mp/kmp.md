---
title: Kotlin Multiplatform 依存性の注入
---

## ソースプロジェクト

:::info
Kotlin Multiplatformプロジェクトはこちらでご覧いただけます: https://github.com/InsertKoinIO/hello-kmp
:::

## Gradleの依存関係

KoinはピュアKotlinライブラリであり、共有Kotlinプロジェクトで使用できます。コアの依存関係を追加するだけです。

commonプロジェクトに`koin-core`を追加し、依存関係を宣言します: [https://github.com/InsertKoinIO/hello-kmp/tree/main/buildSrc](https://github.com/InsertKoinIO/hello-kmp/blob/main/buildSrc/src/main/java/Dependencies.kt)

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

## 共有Koinモジュール

プラットフォーム固有のコンポーネントはここで宣言でき、後でAndroidやiOSで使用できます（実際のクラスまたはactualモジュールで直接宣言されます）。

共有モジュールのソースはこちらでご覧いただけます: https://github.com/InsertKoinIO/hello-kmp/tree/main/shared

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

Koinモジュールは関数を介して収集される必要があります:

```kotlin
// Common App Definitions
fun appModule() = listOf(commonModule, platformModule)
```

## Androidアプリ

`koin-android`の機能を引き続き使用し、commonモジュール/クラスを再利用できます。

Androidアプリのコードはこちらでご覧いただけます: https://github.com/InsertKoinIO/hello-kmp/tree/main/androidApp

## iOSアプリ

iOSアプリのコードはこちらでご覧いただけます: https://github.com/InsertKoinIO/hello-kmp/tree/main/iosApp

### Koinの呼び出し

Koin関数 (共有コード内) のラッパーを準備しましょう:

```kotlin
// Helper.kt

fun initKoin(){
    startKoin {
        modules(appModule())
    }
}
```

それをメインアプリのエントリで初期化できます:

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

### 注入されたクラス

SwiftからKotlinクラスのインスタンスを呼び出しましょう。

私たちのKotlinコンポーネント:

```kotlin
// Injection Boostrap Helper
class GreetingHelper : KoinComponent {
    private val greeting : Greeting by inject()
    fun greet() : String = greeting.greeting()
}
```

Swiftアプリで:

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