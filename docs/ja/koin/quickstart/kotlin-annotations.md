---
title: Kotlin とアノテーション
---

> このチュートリアルでは、Kotlin アプリケーションを作成し、アノテーションを使用した Koin の依存性注入（DI）を利用してコンポーネントを取得する方法を学びます。
> チュートリアルの所要時間は約 **10 分** です。

:::note
更新 - 2024-11-12
:::

## コードの取得

:::info
[ソースコードは GitHub で公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin-annotations)
:::

## セットアップ

まず、以下のように Koin アノテーションの依存関係が追加されていることを確認してください。

```groovy
plugins {
    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Kotlin アプリ用 Koin
    implementation("io.insert-koin:koin-core:$koin_version")

    // Koin アノテーション
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、それを `UserApplication` クラスで表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## "User" データ

User のコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name: String, val email: String)
```

ユーザーリストを管理（ユーザーの追加や名前による検索）するための「リポジトリ」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です。

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

:::note
このプロジェクトでは、シングルトンコンポーネントを宣言するために Koin の `@Singleton` アノテーション（`org.koin.core.annotation` 由来）を使用しています。
:::

## Koin モジュール

`@Module` アノテーションを使用して Koin モジュールを宣言します。

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - これを Koin モジュールとして宣言します
* `@ComponentScan("org.koin.sample")` - 指定したパッケージからアノテーション付きクラスをスキャンして登録します
* `@Configuration` - `@KoinApplication` による自動モジュール検出を有効にします

`@Singleton` アノテーションを追加してコンポーネントを宣言しましょう。

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## UserService コンポーネント

ユーザー操作を管理する `UserService` コンポーネントを作成します。

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

`UserService` を `@Singleton` アノテーションで宣言します。

## UserApplication

`UserApplication` クラスは、コンストラクタ注入を使用して `UserService` を受け取ります。

```kotlin
@Singleton
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

:::info
コンストラクタ注入は、依存関係を注入するための推奨される方法です。Koin は `UserApplication` を作成する際、自動的に `UserService` を解決して注入します。
:::

## Koin アプリケーションオブジェクト

Koin のアノテーションベースの設定のエントリーポイントを示すために、`@KoinApplication` オブジェクトを作成します。

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` アノテーションは KSP プロセッサと連携し、このオブジェクトに対して `startKoin()` 拡張関数を生成します。

## Koin の開始

アプリケーションで Koin を開始する必要があります。アプリケーションのメインエントリーポイントで、生成された `startKoin()` 関数を呼び出すだけです。

```kotlin
fun main() {
    KoinUserApplication.startKoin()

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

**主なポイント:**
* `KoinUserApplication.startKoin()` - すべてのモジュールを自動的に検出してロードする生成関数です。
* `modules()` を手動で呼び出す必要はありません。すべてのアノテーション付きの依存関係はコンパイル時に検出されます。
* `KoinPlatform.getKoin().get<UserApplication>()` を使用して、Koin から `UserApplication` インスタンスを取得します。

:::info
モジュールに `@Configuration` を付与し、`@KoinApplication` アノテーションを使用することで、KSP を介してコンパイル時にすべてのアノテーション付き依存関係を自動的に検出し、ロードします。
:::

## アノテーション vs Compiler Plugin DSL

アノテーションベースの設定と Compiler Plugin DSL の比較は以下の通りです。

**アノテーションを使用する場合:**
```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule

@Singleton
class UserApplication(private val userService: UserService)

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService
```

**Compiler Plugin DSL (kotlin.md より):**
```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

どちらのアプローチも同じ結果をもたらします：
- **アノテーション**: KSP によるコンパイル時の検証、自動モジュール検出。
- **Compiler Plugin DSL**: コンパイル時の自動配線（Auto-wiring）、よりクリーンな `single<T>()` 構文。