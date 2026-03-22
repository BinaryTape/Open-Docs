---
title: Android
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存関係注入（Dependency Injection）を使用してコンポーネントを取得する方法を説明します。
> チュートリアルを完了するのに必要な時間は約 **10分** です。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradleの設定

以下のように、Koin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの構想は、ユーザーのリストを管理し、それを Presenter または ViewModel を使用して `MainActivity` クラスに表示することです。

> Users -> UserRepository -> UserService -> (Presenter または ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name: String, val email: String)
```

ユーザーのリストを管理する（ユーザーの追加や名前による検索）ための「Repository」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です。

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

## UserService コンポーネント

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

Koinモジュールを宣言するには `module` 関数を使用します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {

}
```

コンポーネントを宣言しましょう。`UserRepository` と `UserService` のシングルトンが必要であると定義します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
このチュートリアルでは、コンパイル時に自動配線（auto-wiring）を提供する **Koin Compiler Plugin DSL**（`single<T>()`、`factory<T>()`）を使用しています。設定については [Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。
:::

## Presenterを使用したユーザーの表示

ユーザーを表示するためのプレゼンターコンポーネントを記述しましょう。

```kotlin
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> UserService は UserPresenter のコンストラクターで参照されています。

Koinモジュールに `UserPresenter` を宣言します。Androidのライフサイクルに伴うメモリリークを避けるため、インスタンスをメモリに保持しないよう `factory` 定義として宣言します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

## Androidでの依存関係の注入

`UserPresenter` コンポーネントが作成される際、併せて `UserService` インスタンスも解決されます。これをActivityで取得するために、`by inject()` デリゲート関数を使用して注入しましょう。

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

これで、アプリの準備が整いました。

:::info
`by inject()` 関数を使用すると、Androidコンポーネントのランタイム（Activity、Fragment、Serviceなど）でKoinインスタンスを取得できます。
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリーポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出すだけです。

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

**Classic DSL**（手動配線）を使用したKoinモジュールの宣言は以下の通りです。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    factory { UserPresenter(get()) }
}
```

**Compiler Plugin DSL**（コンパイル時の自動配線）を使用した場合：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    factory<UserPresenter>()
}
```

:::tip
Compiler Plugin DSL を使用するには、[Koin Compiler Plugin](/docs/setup/compiler-plugin) が必要です。これにより、コンパイル時の依存関係解決と、よりクリーンな構文が提供されます。
:::