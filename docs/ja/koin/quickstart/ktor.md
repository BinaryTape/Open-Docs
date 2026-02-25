---
title: Ktor
---

> Ktorは、強力なKotlinプログラミング言語を使用して、接続されたシステムで非同期のサーバーおよびクライアントを構築するためのフレームワークです。ここではKtorを使用して、シンプルなWebアプリケーションを構築します。

さあ、始めましょう 🚀

:::note
更新 - 2024-10-21
:::

## コードを取得する

:::info
[ソースコードはGitHubで入手可能です](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor)
:::

## Gradleの設定

まず、以下のようにKoinの依存関係を追加します：

```kotlin
dependencies {
    // Kotlinアプリ用のKoin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、それを `UserApplication` クラスで表示することです：

> Users -> UserRepository -> UserService -> UserApplication

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです：

```kotlin
data class User(val name : String)
```

ユーザーリストを管理する（ユーザーの追加や名前による検索）ための「Repository」コンポーネントを作成します。以下に `UserRepository` インターフェースとその実装を示します：

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

`module` 関数を使用してKoinモジュールを宣言します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトン（singleton）を作成します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## UserServiceコンポーネント

デフォルトユーザーをリクエストするための `UserService` コンポーネントを作成しましょう：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepositoryは `UserPresenter` のコンストラクタで参照されます

Koinモジュールで `UserService` を宣言します。`singleOf` 定義として宣言します：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## HTTPコントローラー

最後に、HTTPルートを作成するためのHTTPコントローラーが必要です。Ktorでは、これはKtor拡張関数（extension function）を通じて表現されます：

```kotlin
fun Application.main() {

    // UserServiceをレイジー注入（Lazy inject）する
    val service by inject<UserService>()

    // ルーティングセクション
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

`Application.main` 関数を起動しやすくするために、`application.conf` が以下のように設定されていることを確認してください：

```kotlin
ktor {
    deployment {
        port = 8080

        // 開発用
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 依存関係を宣言する

コンポーネントをKoinモジュールで組み立てましょう：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```

## 開始と注入

最後に、KtorからKoinを開始しましょう：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(appModule)
    }

    // UserServiceをレイジー注入する
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

Ktorを開始します：

```kotlin
fun main(args: Array<String>) {
    // Ktorを開始
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

以上です！これで準備が整いました。`http://localhost:8080/hello` のURLを確認してください！