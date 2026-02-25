---
title: Kotlin Multiplatform - UI共有なし
---

> このチュートリアルでは、Android アプリケーションを作成し、Koin の依存関係注入（Dependency Injection）を使用してコンポーネントを取得する方法を学びます。
> チュートリアルの所要時間は約 **15 分** です。

:::note
更新日 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードは GitHub で公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、共有の Presenter を使用してネイティブ UI に表示することです。

`Users -> UserRepository -> 共有 Presenter -> ネイティブ UI`

## 「User」データ

> すべての共通/共有コードは `shared` Gradle プロジェクト内にあります。

ユーザーのコレクションを管理します。データクラスは以下の通りです：

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「Repository」コンポーネントを作成します。以下は、`UserRepository` インターフェースとその実装です：

```kotlin
interface UserRepository {
    fun findUser(name : String): User?
    fun addUsers(users : List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUser(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users : List<User>) {
        _users.addAll(users)
    }
}
```

## 共有 Koin モジュール

Koin モジュールを宣言するには `module` 関数を使用します。Koin モジュールは、注入されるすべてのコンポーネントを定義する場所です。

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトンを作成します。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共有 Presenter

ユーザーを表示するための Presenter コンポーネントを記述します：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` は `UserPresenter` のコンストラクターで参照されています。

Koin モジュールで `UserPresenter` を宣言します。インスタンスをメモリに保持し続けず、ネイティブ側のシステムに保持させるために、`factoryOf` 定義として宣言します：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin モジュールは、iOS 側から `initKoin()` 関数を使用して簡単に実行できるように、実行可能な関数（ここでは `appModule`）として利用可能です。
:::

## ネイティブコンポーネント

以下のネイティブコンポーネントが Android と iOS で定義されています：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

両方のプラットフォームでローカルのプラットフォーム実装を取得します。

## Android でのインジェクション

> Android アプリのコードはすべて `androidApp` Gradle プロジェクト内にあります。

`UserPresenter` コンポーネントが作成され、その際に `UserRepository` インスタンスが解決されます。これを Activity で取得するために、Compose 関数の `koinInject` を使用して注入しましょう：

```kotlin
// App() 内

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

これでアプリの準備は完了です。

:::info
`koinInject()` 関数を使用すると、Android Compose のランタイムで Koin インスタンスを取得できます。
:::

Android アプリケーションで Koin を開始する必要があります。Compose のアプリケーション関数 `App` 内で `KoinApplication()` 関数を呼び出すだけです：

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

共有の KMP 設定から、Android 用の Koin 設定を収集します：

```kotlin
// Android 設定
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
Compose から現在の Android context を取得するには `LocalContext.current` を使用します。
:::

そして、共有の KMP 設定は以下の通りです：

```kotlin
// 共通設定
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## iOS でのインジェクション

> iOS アプリのコードはすべて `iosApp` フォルダ内にあります。

`UserPresenter` コンポーネントが作成され、その際に `UserRepository` インスタンスが解決されます。これを `ContentView` で取得するには、iOS 用に Koin の依存関係を取得するための関数を作成する必要があります：

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

これで完了です。iOS 側から `KoinKt.getUserPresenter().sayHello()` 関数を呼び出すことができます。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

iOS アプリケーションで Koin を開始する必要があります。Kotlin の共有コードでは、`initKoin()` 関数を使用して共有設定を利用できます。
最後に、iOS のメインエントリで、上記のヘルパー関数を呼び出す `KoinAppKt.doInitKoin()` 関数を呼び出します。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}