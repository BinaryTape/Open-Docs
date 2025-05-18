---
title: "Compose Multiplatform - Shared UI（共有UI）"
---
> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得する方法を説明します。
> チュートリアル完了まで約 __15分__ かかります。

:::note
更新 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## アプリケーションの概要 (Application Overview)

このアプリケーションの目的は、ユーザーのリストを管理し、共有のViewModelを使用してネイティブUIに表示することです。

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## 「ユーザー (User)」データ

> すべての共通/共有コードは、`shared` Gradleプロジェクトにあります。

ユーザーのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する「リポジトリ (Repository)」コンポーネントを作成します（ユーザーの追加または名前による検索）。以下は、`UserRepository`インターフェースとその実装です。

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

## 共有Koinモジュール (Shared Koin module)

`module`関数を使用して、Koinモジュールを宣言します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

最初のコンポーネントを宣言しましょう。`UserRepository`のシングルトンが必要なので、`UserRepositoryImpl`のインスタンスを作成します。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共有ViewModel (Shared ViewModel)

ユーザーを表示するためのViewModelコンポーネントを作成しましょう。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserPresenterのコンストラクタで参照されます。

Koinモジュールで`UserViewModel`を宣言します。`viewModelOf`定義として宣言し、メモリにインスタンスを保持せず、ネイティブシステムに保持させます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
Koinモジュールは、`initKoin()`関数を使用してiOS側から簡単に実行できるように、実行する関数（ここでは`appModule`）として利用できます。
:::

## ネイティブコンポーネント (Native Component)

次のネイティブコンポーネントは、AndroidとiOSで定義されています。

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

どちらもローカルプラットフォームの実装を取得します。

## Composeへの注入 (Injecting in Compose)

> すべての共通Composeアプリは、`composeApp` Gradleモジュールの`commonMain`にあります。

`UserViewModel`コンポーネントが作成され、それとともに`UserRepository`インスタンスが解決されます。Activityに取得するには、`koinViewModel`または`koinNavViewModel` compose関数を使用して注入します。

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

AndroidアプリケーションでKoinを起動する必要があります。composeアプリケーション関数`App`で`KoinApplication()`関数を呼び出すだけです。

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

## iOSでのComposeアプリ (Compose app in iOS)

> すべてのiOSアプリは、`iosMain`フォルダにあります。

`MainViewController.kt`は、iOS用のComposeを起動する準備ができています。

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }
```