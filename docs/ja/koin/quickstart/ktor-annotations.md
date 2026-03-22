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
data class User(val name: String, val email: String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「Repository」コンポーネントを作成します。以下は、`UserRepository` インターフェースとその実装です。

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

## Koinモジュール

指定されたKotlinクラスからKoinモジュールを宣言するには、`@Module` アノテーションを使用します。Koinモジュールは、注入（Inject）されるすべてのコンポーネントを定義する場所です。

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - これをKoinモジュールとして宣言します
* `@ComponentScan("org.koin.sample")` - パッケージからアノテーション付きのクラスをスキャンして登録します
* `@Configuration` - `@KoinApplication` による自動モジュール検出を有効にします

:::note
このプロジェクトでは、シングルトン（Singleton）コンポーネントを宣言するために（`org.koin.core.annotation` の）Koinの `@Singleton` アノテーションを使用しています。
:::

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトンを作成します。これに `@Singleton` とタグ付けします。

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository
```

## UserServiceコンポーネント

ユーザー操作を管理するための `UserService` コンポーネントを作成しましょう。

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

> UserRepositoryは `UserServiceImpl` のコンストラクターで参照されています。

`@Singleton` アノテーションを使用して `UserService` を宣言します。

## HTTPコントローラーとKoinアプリケーション

最後に、`@KoinApplication` オブジェクトを作成し、HTTPルートを設定する必要があります。

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` アノテーションは、これをKoinのアノテーションベースの設定のエントリポイントとしてマークします。KSPプロセッサは、Koinを初期化するために `withConfiguration<T>()` で使用できる設定を生成します。

## 起動と注入

それでは、KtorアプリケーションでKoinを設定しましょう。

```kotlin
fun Application.main() {
    // 生成された設定を使用してKoinをインストール
    install(Koin) {
        slf4jLogger()
        withConfiguration<KoinUserApplication>()
    }

    // UserServiceを遅延注入（Lazy inject）
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

**主なポイント:**
* `withConfiguration<KoinUserApplication>()` - アノテーションが付与されたアプリケーションオブジェクトから生成されたKoin設定を使用します。
* 手動で `modules(AppModule().module)` を呼び出す必要はありません。自動的に含まれます！
* `/hello` エンドポイントは、オプションの `name` クエリパラメータを受け取ります。

Ktorを起動しましょう。

```kotlin
fun main(args: Array<String>) {
    embeddedServer(Netty, port = 8080) {
        main()
    }.start(wait = true)
}
```

以上です！これで準備が整いました。以下のURLを確認してください：
- `http://localhost:8080/hello` - Alice（デフォルトユーザー）に挨拶します
- `http://localhost:8080/hello?name=Bob` - Bobに挨拶します

:::info
モジュール上の `@Configuration` と併用される `@KoinApplication` アノテーションは、コンパイル時にすべてのアノテーション付き依存関係を自動的に検出し、ロードします。
:::