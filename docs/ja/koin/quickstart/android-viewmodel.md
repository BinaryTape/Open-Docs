---
title: Android - ViewModel
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入（DI）を使用してコンポーネントを取得する方法について説明します。
> このチュートリアルの所要時間は約 **10分** です。

:::note
更新日 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、PresenterまたはViewModelを使用して `MainActivity` クラスに表示することです。

> Users -> UserRepository -> UserService -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name: String, val email: String)
```

ユーザーリストを管理する（ユーザーの追加や名前による検索を行う）「Repository」コンポーネントを作成します。以下に `UserRepository` インターフェースとその実装を示します。

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUserOrNull(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users: List<User>) {
        _users.addAll(users)
    }
}
```

## UserServiceコンポーネント

ユーザー操作を管理するためのサービスコンポーネントを記述しましょう。

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    override fun getUserOrNull(name: String): User? = userRepository.findUserOrNull(name)

    override fun loadUsers() {
        userRepository.addUsers(listOf(
            User("Alice", "alice@example.com"),
            User("Bob", "bob@example.com"),
            User("Charlie", "charlie@example.com")
        ))
    }

    override fun prepareHelloMessage(user: User?): String {
        return user?.let { "Hello '${user.name}' (${user.email})! 👋" } ?: "❌ User not found"
    }
}
```

## Koinモジュール

Koinモジュールを宣言するには `module` 関数を使用します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {

}
```

コンポーネントを宣言しましょう。`UserRepository` と `UserService` のシングルトンを定義します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
このチュートリアルでは、コンパイル時に自動配線（auto-wiring）を提供する **Koin Compiler Plugin DSL** (`single<T>()`, `viewModel<T>()`) を使用しています。設定については [Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。
:::

## ViewModelを使用したユーザーの表示

ユーザーを表示するためのViewModelコンポーネントを記述しましょう。

```kotlin
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> `UserService` は `UserViewModel` のコンストラクタで参照されます。

Koinモジュールで `UserViewModel` を宣言します。インスタンスをメモリに保持し続けないように（Androidのライフサイクルによるメモリリークを避けるため）、`viewModel` 定義として宣言します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## AndroidでのViewModelの注入

`UserViewModel` コンポーネントが作成され、その際に `UserService` インスタンスが解決（注入）されます。これをActivityで取得するには、`by viewModel()` デリゲート関数を使用して注入します。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

これでアプリの準備は完了です。

:::info
`by viewModel()` 関数を使用すると、ViewModelのインスタンスを取得し、適切なViewModel Factoryを自動的に作成してライフサイクルにバインドします。
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリーポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出します。

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin` 内の `modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## Koinモジュール：DSLの比較

**従来のDSL**（手動配線）を使用したKoinモジュールの宣言は以下の通りです。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

**Compiler Plugin DSL**（コンパイル時の自動配線）を使用した場合：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
Compiler Plugin DSLを使用するには、[Koin Compiler Plugin](/docs/setup/compiler-plugin) が必要です。これにより、コンパイル時の依存関係解決とよりクリーンな構文が提供されます。
:::