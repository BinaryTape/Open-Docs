---
title: Compose Multiplatform - 共有 UI
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存関係注入（Dependency Injection）を使用してコンポーネントを取得する方法を学びます。
> チュートリアルの所要時間は約 **15分** です。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## アプリケーションの概要

このアプリケーションのコンセプトは、共有の ViewModel を使用してユーザーのリストを管理し、それをネイティブUIに表示することです。

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## 「User」データ

> すべての共通/共有コードは `shared` Gradleプロジェクト内にあります。

ユーザーのコレクションを管理します。以下がデータクラスです：

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「リポジトリ（Repository）」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です：

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

Koinモジュールを宣言するには、`module` 関数を使用します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトンを定義します。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共有 ViewModel

ユーザーを表示するための ViewModel コンポーネントを作成しましょう：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` は `UserPresenter` のコンストラクタで参照されます。

`UserViewModel` をKoinモジュールで宣言します。メモリ内にインスタンスを保持せず、ネイティブシステムに保持させるために、`viewModelOf` 定義として宣言します：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
Koinモジュールは実行可能な関数（ここでは `appModule`）として利用でき、`initKoin()` 関数を使用してiOS側から簡単に実行できます。
:::

## ネイティブコンポーネント

以下のネイティブコンポーネントが Android と iOS で定義されています：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

どちらもローカルプラットフォームの実装を取得します。

## Compose での注入

> すべての共通 Compose アプリは `composeApp` Gradleモジュールの `commonMain` に配置されています：

`UserViewModel` コンポーネントが作成され、それとともに `UserRepository` インスタンスが解決されます。これを Activity に取得するために、`koinViewModel` または `koinNavViewModel` Compose 関数を使用して注入しましょう：

```kotlin
@Composable
fun MainScreen() {

    MaterialTheme {

        val userViewModel = koinViewModel<UserViewModel>()
        
        //...
    }
}
```

これで、アプリの準備が整いました。

AndroidアプリケーションでKoinを開始する必要があります。Composeのアプリケーション関数 `App` 内で `KoinApplication()` 関数を呼び出すだけです：

```kotlin
fun App() {
    
    KoinApplication(
        application = {
            modules(appModule)
        }
    )
{
// Compose content
}
}
```

:::info
`modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## iOS での Compose アプリ

> すべての iOS アプリは `iosMain` フォルダにあります。

`MainViewController.kt` で iOS 用の Compose を開始する準備ができています：

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }