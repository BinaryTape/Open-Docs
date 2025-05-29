---
title: Ktor
---

> Ktorは、強力なKotlinプログラミング言語を使用して、接続されたシステムで非同期サーバーとクライアントを構築するためのフレームワークです。ここでは、Ktorを使用してシンプルなウェブアプリケーションを構築します。

始めましょう 🚀

:::note
更新日 - 2024-10-21
:::

## コードを入手

:::info
[ソースコードはGithubで利用可能です](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradleの設定

まず、Koinの依存関係を以下のように追加します。

```kotlin
dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、それを`UserApplication`クラスで表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## 「User」データ

ユーザーのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーリストを管理するための「Repository」コンポーネント（ユーザーの追加や名前による検索）を作成します。以下に、`UserRepository`インターフェースとその実装を示します。

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

## Koinモジュール

`module`関数を使用してKoinモジュールを宣言します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成して、`UserRepository`のシングルトンを定義します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## UserServiceコンポーネント

デフォルトユーザーを要求するUserServiceコンポーネントを記述しましょう。

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepositoryはUserPresenterのコンストラクタで参照されます

`UserService`をKoinモジュールで宣言します。`singleOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTPコントローラー

最後に、HTTPルートを作成するためにHTTPコントローラーが必要です。Ktorでは、Ktor拡張関数を介して表現されます。

```kotlin
fun Application.main() {

    // Lazy inject HelloService
    val service by inject<UserService>()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`application.conf`が以下のように設定されていることを確認してください。これは`Application.main`関数の起動に役立ちます。

```kotlin
ktor {
    deployment {
        port = 8080

        // For dev purpose
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 依存関係の宣言

Koinモジュールでコンポーネントを組み立てましょう。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 起動と注入

最後に、KtorからKoinを起動しましょう。

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    // Lazy inject HelloService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

Ktorを起動しましょう。

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

これで完了です！準備万端です。`http://localhost:8080/hello`のURLをチェックしてください！