---
title: Ktor & Annotations
---

> Ktorは、強力なKotlinプログラミング言語を使用して、接続されたシステムで非同期サーバーおよびクライアントを構築するためのフレームワークです。ここでは、Ktorを使用してシンプルなウェブアプリケーションを構築します。

さあ、始めましょう 🚀

:::note
更新 - 2024-10-21
:::

## コードを取得する

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradleのセットアップ

まず、以下のようにKoinの依存関係を追加します。

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Kotlinアプリ用Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、それを `UserApplication` クラスで表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「Repository」コンポーネントを作成します。以下は、`UserRepository` インターフェースとその実装です。

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

指定されたKotlinクラスからKoinモジュールを宣言するには、`@Module` アノテーションを使用します。Koinモジュールは、注入（Inject）されるすべてのコンポーネントを定義する場所です。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")` は、対象となるパッケージからアノテーション付きのクラスをスキャンするのに役立ちます。

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトン（Singleton）を作成します。これに `@Single` とタグ付けします。

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserServiceコンポーネント

デフォルトユーザーを要求するための `UserService` コンポーネントを作成しましょう。

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepositoryは `UserPresenter` のコンストラクターで参照されています。

Koinモジュールで `UserService` を宣言します。`@Single` アノテーションを付与します。

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTPコントローラー

最後に、HTTPルートを作成するためのHTTPコントローラーが必要です。Ktorでは、これはKtorの拡張関数として表現されます。

```kotlin
fun Application.main() {

    // UserServiceを遅延注入（Lazy inject）
    val service by inject<UserService>()

    // ルーティングセクション
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`Application.main` 関数を起動するために、`application.conf` が以下のように設定されているか確認してください。

```kotlin
ktor {
    deployment {
        port = 8080

        // 開発用設定
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

    // UserServiceを遅延注入（Lazy inject）
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // ルーティングセクション
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`AppModule().module` と記述することで、`AppModule` クラスに対して生成された拡張プロパティを使用します。

Ktorを起動しましょう。

```kotlin
fun main(args: Array<String>) {
    // Ktorを起動
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

以上です！これで準備が整いました。`http://localhost:8080/hello` にアクセスして確認してみてください！