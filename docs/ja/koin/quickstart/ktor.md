---
title: Ktor
---

> Ktorは、強力なKotlinプログラミング言語を使用して、接続されたシステムで非同期のサーバーおよびクライアントを構築するためのフレームワークです。ここではKtorを使用して、シンプルなWebアプリケーションを構築します。

さあ、始めましょう 🚀

:::note
更新 - 2024-10-21
:::

:::tip
このチュートリアルの**アノテーション版**をお探しですか？コンパイル時の検証のために Jakarta `@Singleton` を伴う Koin Annotations を使用している [Ktor & Annotations](./ktor-annotations.md) を確認してください。
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
data class User(val name: String, val email: String)
```

ユーザーリストを管理する（ユーザーの追加や名前による検索）ための「Repository」コンポーネントを作成します。以下に `UserRepository` インターフェースとその実装を示します：

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

`module` 関数を使用してKoinモジュールを宣言します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {

}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトン（singleton）を作成します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

:::info
このチュートリアルでは、コンパイル時にオートワイヤリング（auto-wiring）を提供する **Koin Compiler Plugin DSL** (`single<T>()`) を使用しています。設定については [Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。
:::

## UserServiceコンポーネント

ユーザー操作を管理するための `UserService` コンポーネントを作成しましょう：

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

> UserRepositoryは UserServiceImpl のコンストラクタで参照されます

Koinモジュールで `UserService` を宣言します。`single` 定義として宣言します：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## HTTPコントローラー

最後に、HTTPルートを作成するためのHTTPコントローラーが必要です。Ktorでは、これはKtor拡張関数（extension function）を通じて表現されます：

```kotlin
fun Application.main() {

    // UserServiceをレイジー注入（Lazy inject）する
    val service by inject<UserService>()
    service.loadUsers()

    // ルーティングセクション
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

`/hello` エンドポイントは、オプションの `name` クエリパラメータを受け取ります。指定されない場合は、デフォルトで "Alice" になります。

リクエスト例：
- `http://localhost:8080/hello` - Aliceに挨拶（デフォルト）
- `http://localhost:8080/hello?name=Bob` - Bobに挨拶

## 依存関係を宣言する

コンポーネントをKoinモジュールで組み立てましょう：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## 開始と注入

最後に、KtorからKoinを開始しましょう：

```kotlin
fun Application.main() {
    // Koinをインストール
    install(Koin) {
        modules(appModule)
    }

    // UserServiceをレイジー注入する
    val service by inject<UserService>()
    service.loadUsers()

    // ルーティングセクション
    routing {
        get("/hello") {
            val userName = call.queryParameters["name"] ?: "Alice"
            val user = service.getUserOrNull(userName)
            val message = service.prepareHelloMessage(user)
            call.respondText(message)
        }
    }
}
```

Ktorを開始します：

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

以上です！これで準備が整いました。以下のURLを確認してください：
- `http://localhost:8080/hello` - Aliceに挨拶（デフォルトユーザー）
- `http://localhost:8080/hello?name=Bob` - Bobに挨拶