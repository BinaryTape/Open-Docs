---
title: Kotlin
---

> このチュートリアルでは、Kotlinアプリケーションを作成し、Koinの依存関係注入（Dependency Injection）を使用してコンポーネントを取得する方法を説明します。
> チュートリアルの所要時間は約 **10分** です。

:::note
更新 - 2024-10-21
:::

:::tip
このチュートリアルの**アノテーション版（annotations version）**をお探しですか？コンパイル時の検証と自動モジュール検出に Koin Annotations を使用する [Kotlin & Annotations](./kotlin-annotations.md) を確認してください。
:::

## コードの取得

:::info
[ソースコードはGithubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## セットアップ

まず、以下のように `koin-core` の依存関係が追加されていることを確認してください。

```groovy
dependencies {
    
    // Kotlinアプリ用のKoin
    implementation "io.insert-koin:koin-core:$koin_version"
}
```

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、それを `UserApplication` クラスで表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name: String, val email: String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「Repository」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です。

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

## Koinモジュール

`module` 関数を使用してKoinモジュールを宣言します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {

}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成することで、`UserRepository` のシングルトンを作成します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
このチュートリアルでは、コンパイル時に自動ワイヤリング（auto-wiring）を提供する **Koin Compiler Plugin DSL** (`single<T>()`) を使用しています。設定については [Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。
:::

## UserServiceコンポーネント

ユーザー操作を管理するための `UserService` コンポーネントを作成します。

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

> `UserRepository` は `UserServiceImpl` のコンストラクタで参照されています。

Koinモジュールで `UserService` を宣言します。`single` 定義として宣言します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## UserApplicationでの依存関係の注入

`UserApplication` クラスは、Koinからインスタンスを起動（bootstrap）するのに役立ちます。コンストラクタ注入を通じて `UserService` を解決します。

```kotlin
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    // データの表示
    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

これで、アプリケーションの準備が整いました。

:::info
コンストラクタ注入は、Kotlinアプリケーションにおいて依存関係を注入する推奨される方法です。Koinは `UserApplication` を作成する際に、自動的に `UserService` を解決して注入します。
:::

## Koinの開始

アプリケーションでKoinを開始し、モジュールに `UserApplication` を追加する必要があります。アプリケーションのメインエントリポイントである `main` 関数で `startKoin()` 関数を呼び出すだけです。

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}

fun main() {
    startKoin {
        modules(appModule)
    }

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

:::info
`startKoin` 内の `modules()` 関数は、指定されたモジュールのリストをロードします。`KoinPlatform.getKoin().get<UserApplication>()` を使用して、Koinから `UserApplication` インスタンスを取得します。
:::

## Koinモジュール：DSLの比較

以下は、**クラシックDSL**（手動ワイヤリング）を使用したKoinモジュールの宣言です。

```kotlin
val appModule = module {
    single { UserApplication(get()) }
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
}
```

**Compiler Plugin DSL**（コンパイル時の自動ワイヤリング）を使用した場合：

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::tip
Compiler Plugin DSLには [Koin Compiler Plugin](/docs/setup/compiler-plugin) が必要です。これにより、コンパイル時の依存関係解決と、よりクリーンな構文が提供されます。
:::