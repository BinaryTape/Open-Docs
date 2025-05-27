---
title: Ktorとアノテーション
---

> Ktorは、強力なKotlinプログラミング言語を使用して、接続システムにおける非同期サーバーとクライアントを構築するためのフレームワークです。ここでは、シンプルなWebアプリケーションを構築するためにKtorを使用します。

始めましょう 🚀

:::note
更新 - 2024-10-21
:::

## コードを取得する

:::info
ソースコードは[GitHub](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)で入手できます。
:::

## Gradleのセットアップ

まず、以下のようにKoinの依存関係を追加します。

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、それを`UserApplication`クラスに表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## 「User」データ

ユーザーのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「リポジトリ」コンポーネント（ユーザーを追加したり、名前でユーザーを見つけたりする）を作成します。以下に、`UserRepository`インターフェースとその実装を示します。

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

指定されたKotlinクラスからKoinモジュールを宣言するには、`@Module`アノテーションを使用します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")`は、ターゲットパッケージからアノテーション付きクラスをスキャンするのに役立ちます。

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成することで、`UserRepository`のシングルトンを構築します。これを`@Single`とタグ付けします。

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserServiceコンポーネント

デフォルトユーザーを要求するUserServiceコンポーネントを記述しましょう。

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepositoryはUserPresenterのコンストラクタで参照されています

Koinモジュールで`UserService`を宣言します。`@Single`アノテーションをタグ付けします。

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTPコントローラ

最後に、HTTPルートを作成するためにHTTPコントローラが必要です。Ktorでは、Ktor拡張関数を通じて表現されます。

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

`Application.main`関数を起動できるよう、`application.conf`が以下のように構成されていることを確認してください。

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

## 起動と注入

最後に、KtorからKoinを起動しましょう。

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(AppModule().module)
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

`AppModule().module`を記述することで、`AppModule`クラスの生成された拡張機能を使用します。

Ktorを起動しましょう。

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

それだけです！準備ができました。`http://localhost:8080/hello`のURLを確認してください！