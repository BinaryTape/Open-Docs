---
title: Kotlin Multiplatform - UI共有なし
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得する方法を説明します。
> このチュートリアルを完了するには、約**15分**かかります。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで入手可能です](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、共有Presenterを使ってネイティブUIに表示することです。

`Users -> UserRepository -> Shared Presenter -> Native UI`

## 「User」データ

> すべての共通/共有コードは、`shared` Gradleプロジェクトにあります

Userのコレクションを管理します。以下にデータクラスを示します。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「Repository」コンポーネントを作成します（ユーザーを追加したり、名前でユーザーを検索したりします）。以下に、`UserRepository`インターフェースとその実装を示します。

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

## 共有Koinモジュール

Koinモジュールを宣言するには、`module`関数を使用します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成することで、`UserRepository`のシングルトンを取得します。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共有Presenter

ユーザーを表示するためのpresenterコンポーネントを記述しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserPresenterのコンストラクタで参照されます

Koinモジュールに`UserPresenter`を宣言します。メモリにインスタンスを保持せず、ネイティブシステムにそれを保持させるため、`factoryOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koinモジュールは実行可能な関数（ここでは`appModule`）として利用でき、`initKoin()`関数を使ってiOS側から簡単に実行できます。
:::

## ネイティブコンポーネント

以下のネイティブコンポーネントはAndroidとiOSで定義されています。

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

どちらもローカルプラットフォームの実装を取得します

## Androidでの注入

> Androidアプリ全体は`androidApp` Gradleプロジェクトにあります

`UserPresenter`コンポーネントは作成され、それとともに`UserRepository`インスタンスが解決されます。これをActivityで取得するには、`koinInject` Compose関数を使って注入しましょう。

```kotlin
// in App()

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

これで、アプリの準備ができました。

:::info
`koinInject()`関数を使用すると、Android ComposeランタイムでKoinインスタンスを取得できます
:::

AndroidアプリケーションでKoinを開始する必要があります。Composeアプリケーション関数`App`内で`KoinApplication()`関数を呼び出すだけです。

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

共有KMP設定からKoinのAndroid設定を収集します。

```kotlin
// Android config
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
`LocalContext.current`を使用して、Composeから現在のAndroidコンテキストを取得します
:::

そして共有KMP設定です。

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()`関数は、指定されたモジュールのリストをロードします
:::

## iOSでの注入

> iOSアプリ全体は`iosApp`フォルダーにあります

`UserPresenter`コンポーネントは作成され、それとともに`UserRepository`インスタンスが解決されます。これを`ContentView`で取得するには、iOS用のKoin依存関係を取得する関数を作成する必要があります。

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

これで終わりです。iOS側から`KoinKt.getUserPresenter().sayHello()`関数を呼び出すだけで済みます。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

iOSアプリケーションでKoinを開始する必要があります。Kotlinの共有コードでは、`initKoin()`関数で共有設定を使用できます。最後に、iOSのメインエントリでは、上記のヘルパー関数を呼び出す`KoinAppKt.doInitKoin()`関数を呼び出すことができます。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}