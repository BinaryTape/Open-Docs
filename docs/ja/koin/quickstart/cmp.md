---
title: Compose Multiplatform - 共有UI
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得します。
> チュートリアルの所要時間は約__15分__です。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## アプリケーションの概要

このアプリケーションは、ユーザーのリストを管理し、共有ViewModelを使ってネイティブUIに表示することを目的としています。

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## 「User」データ

> すべての共通/共有コードは`shared` Gradleプロジェクトにあります

ユーザーのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「Repository」コンポーネント（ユーザーの追加や名前での検索）を作成します。以下に、`UserRepository`インターフェースとその実装を示します。

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

`module`関数を使用してKoinモジュールを宣言します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成することで、`UserRepository`のシングルトンを宣言します。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共有ViewModel

ユーザーを表示するためのViewModelコンポーネントを記述します。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されます

Koinモジュールで`UserViewModel`を宣言します。これを`viewModelOf`定義として宣言することで、メモリ内にインスタンスを保持せず、ネイティブシステムにそれを保持させます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
Koinモジュールは、`initKoin()`関数を使ってiOS側から簡単に実行できるように、関数として利用可能です（ここでは`appModule`）。
:::

## ネイティブコンポーネント

以下のネイティブコンポーネントはAndroidとiOSで定義されています。

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

どちらもローカルのプラットフォーム実装を取得します。

## Composeでの注入

> すべての共通Composeアプリは、`composeApp` Gradleモジュールの`commonMain`にあります。

`UserViewModel`コンポーネントは、`UserRepository`インスタンスを解決して作成されます。これをActivityに取得するには、`koinViewModel`または`koinNavViewModel` Compose関数を使って注入します。

```kotlin
@Composable
fun MainScreen() {

    MaterialTheme {

        val userViewModel = koinViewModel<UserViewModel>()
        
        //...
    }
}
```

これで、アプリの準備ができました。

AndroidアプリケーションでKoinを開始する必要があります。`KoinApplication()`関数をComposeアプリケーション関数`App`内で呼び出すだけです。

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
`modules()`関数は、指定されたモジュールのリストをロードします。
:::

## iOSでのComposeアプリ

> すべてのiOSアプリは`iosMain`フォルダにあります

`MainViewController.kt`はiOS向けComposeを開始する準備ができています。

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }