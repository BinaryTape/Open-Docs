---
title: Kotlin
---

> このチュートリアルでは、Kotlinアプリケーションを作成し、Koinの依存関係注入（Dependency Injection）を使用してコンポーネントを取得する方法を説明します。
> チュートリアルの所要時間は約 **10分** です。

:::note
更新 - 2024-10-21
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
data class User(val name : String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「Repository」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です。

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

`module` 関数を使用してKoinモジュールを宣言します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成することで、`UserRepository` のシングルトンを作成します。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserServiceコンポーネント

デフォルトユーザーをリクエストするための `UserService` コンポーネントを作成します。

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` は `UserService` のコンストラクタで参照されています。

Koinモジュールで `UserService` を宣言します。`single` 定義として宣言します。

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 関数を使用すると、必要な依存関係を解決するようにKoinに要求できます。

## UserApplicationでの依存関係の注入

`UserApplication` クラスは、Koinからインスタンスを起動（bootstrap）するのに役立ちます。`KoinComponent` インターフェースにより、`UserService` を解決できるようになります。これにより、`by inject()` デリゲート関数を使用して注入することが可能になります。

```kotlin
class UserApplication : KoinComponent {

    private val userService : UserService by inject()

    // データの表示
    fun sayHello(){
        val user = userService.getDefaultUser()
        val message = "Hello '$user'!"
        println(message)
    }
}
```

これで、アプリケーションの準備が整いました。

:::info
`by inject()` 関数を使用すると、`KoinComponent` を拡張する任意のクラスでKoinインスタンスを取得できます。
:::

## Koinの開始

アプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリポイントである `main` 関数で `startKoin()` 関数を呼び出すだけです。

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin` 内の `modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## Koinモジュール：クラシックDSLかコンストラクタDSLか？

このアプリのKoinモジュール宣言は以下の通りです。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

コンストラクタを使用することで、より簡潔に記述することができます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}