---
title: Ktor
---
> Ktorは、強力なKotlinプログラミング言語を使用して、接続されたシステムで非同期サーバーとクライアントを構築するためのフレームワークです。ここではKtorを使用して、簡単なWebアプリケーションを構築します。

さあ始めましょう🚀

:::note
update - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradle のセットアップ

まず、以下のようにKoinの依存関係を追加します。

```kotlin
dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、`UserApplication`クラスに表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## "User"データ

Userのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する（ユーザーを追加したり、名前で検索したりする）ための「Repository（リポジトリ）」コンポーネントを作成します。以下は、`UserRepository`インターフェースとその実装です。

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

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成して、`UserRepository`のシングルトンが必要になります。

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

> UserRepositoryはUserPresenterのコンストラクタで参照されます。

Koinモジュールで`UserService`を宣言します。`singleOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTPコントローラー

最後に、HTTPルートを作成するためのHTTPコントローラーが必要です。Ktorでは、Ktor拡張関数で表現されます。

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

`application.conf`が以下のように構成されていることを確認して、`Application.main`関数の開始を支援してください。

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

## 依存関係を宣言する

Koinモジュールでコンポーネントを組み立てましょう。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 開始と注入

最後に、KtorからKoinを開始しましょう。

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

Ktorを開始しましょう。

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

以上です！準備ができました。`http://localhost:8080/hello`のURLを確認してください！
```