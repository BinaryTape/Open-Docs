---
title: Android とアノテーション
---

> このチュートリアルでは、Android アプリケーションを作成し、Koin の依存性の注入（DI）を使用してコンポーネントを取得する方法を学びます。
> 所要時間は約 **10 分** です。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードは GitHub で公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle の設定

KSP プラグインと以下の依存関係を次のように設定しましょう。

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// コンパイル時のチェック
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
現在のバージョンについては `libs.versions.toml` を参照してください。
:::

## アプリケーションの概要

このアプリケーションの構成は、ユーザーのリストを管理し、Presenter または ViewModel を使用して `MainActivity` クラスに表示するというものです。

> Users -> UserRepository -> UserService -> (Presenter または ViewModel) -> MainActivity

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

@Singleton
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

ユーザー操作を管理するためのサービスコンポーネントを作成しましょう。

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

@Singleton
class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    init {
        loadUsers()
    }

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

## Koin モジュール

以下のように `AppModule` モジュールクラスを宣言しましょう。

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - このクラスを Koin モジュールとして宣言します。
* `@ComponentScan("org.koin.sample")` - `"org.koin.sample"` パッケージ内のすべての Koin 定義を自動的にスキャンして登録します。
* `@Configuration` - `@KoinApplication` と併用した際に、モジュールの自動検出を有効にします。

コンポーネントスキャンが有効になっているため、クラスにアノテーションを追加するだけで済みます。

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService {
    // ...
}
```

`@Singleton` アノテーションは、これらのクラスを Koin のシングルトンとして宣言します。

## Presenter によるユーザーの表示

ユーザーを表示するための Presenter コンポーネントを作成しましょう。

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserPresenter] $message"
    }
}
```

> `UserService` は `UserPresenter` のコンストラクタで参照されています。

Android のライフサイクルによるメモリリークを避けるため、リクエストされるたびに新しいインスタンスを作成するように、`UserPresenter` を `@Factory` アノテーションで宣言します。

```kotlin
@Factory
class UserPresenter(private val userService: UserService) {
    // ...
}
```

## Android での依存性の注入

`UserPresenter` コンポーネントが作成され、その際に `UserService` インスタンスが解決されます。これを Activity で取得するには、`by inject()` デリゲート関数を使用して注入します。

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
`by inject()` 関数を使用すると、Android コンポーネントの実行時（Activity、Fragment、Service など）に Koin インスタンスを取得できます。
:::

## Koin の開始

Android アプリケーションで Koin を開始する必要があります。`@KoinApplication` アノテーションを使用すると、Koin は `@Configuration` が付与されたすべてのモジュールを自動的に検出し、ロードします。

```kotlin
import org.koin.android.ext.koin.androidContext
import org.koin.core.annotation.KoinApplication
import org.koin.ksp.generated.*

@KoinApplication
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MainApplication)
        }
    }
}
```

**重要なポイント:**
* `@KoinApplication` - `@Module` および `@Configuration` アノテーションが付いたすべてのモジュールを自動的に検出します。
* `modules(AppModule().module)` を手動で呼び出す必要はありません。モジュールは自動的にロードされます！
* 生成された Koin の内容を使用するには、`import org.koin.ksp.generated.*` のインポートが必要です。
* `androidContext` のような Android 固有の設定のみを行う必要があります。

:::info
`@KoinApplication` アノテーションはモジュールの `@Configuration` と連携し、KSP を通じてコンパイル時にすべての依存関係を自動的に検出し、ロードします。
:::

## ViewModel によるユーザーの表示

ユーザーを表示するための ViewModel コンポーネントを作成しましょう。

```kotlin
@KoinViewModel
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> `UserService` は `UserViewModel` のコンストラクタで参照されています。

`UserViewModel` は、`@KoinViewModel` アノテーションでタグ付けされ、Koin の ViewModel 定義として宣言されます。これにより、適切なライフサイクル管理が行われ、メモリリークが回避されます。

## Android での ViewModel の注入

`UserViewModel` コンポーネントが作成され、その際に `UserService` インスタンスが解決されます。これを Activity で取得するには、`by viewModel()` デリゲート関数を使用して注入します。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## コンパイル時のチェック

Koin Annotations を使用すると、コンパイル時に Koin の設定をチェックできます。これは、以下の Gradle オプションを使用することで利用可能です。

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
この KSP ベースのオプションは、ネイティブなコンパイル時の安全性を提供する **Koin Compiler Plugin** に置き換えられる予定です。将来のアプローチについては [Compiler Plugin](/docs/setup/compiler-plugin) を参照してください。
:::