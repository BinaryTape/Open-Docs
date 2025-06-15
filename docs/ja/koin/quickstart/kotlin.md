---
title: Kotlin
---

> このチュートリアルでは、Kotlinアプリケーションを記述し、Koinの依存性注入を使用してコンポーネントを取得する方法を学びます。
> チュートリアルを完了するのに約__10分__かかります。

:::note
更新日 - 2024-10-21
:::

## コードの入手

:::info
[ソースコードはGitHubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## セットアップ

まず、`koin-core`の依存関係が以下のように追加されていることを確認してください。

```groovy
dependencies {
    
    // Koin for Kotlin apps
    implementation "io.insert-koin:koin-core:$koin_version"
}
```

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、それを`UserApplication`クラスで表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## 「ユーザー」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するために「Repository」コンポーネントを作成します（ユーザーを追加したり、名前でユーザーを見つけたりする）。以下に、`UserRepository`インターフェースとその実装を示します。

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

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成することで、`UserRepository`のシングルトンが必要となります。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserServiceコンポーネント

デフォルトユーザーをリクエストするためにUserServiceコンポーネントを記述しましょう。

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository`は`UserPresenter`のコンストラクタで参照されています。

Koinモジュールで`UserService`を宣言します。これを`single`定義として宣言します。

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()`関数は、Koinに必要な依存関係を解決するよう要求することを可能にします。

## UserApplicationでの依存関係の注入

`UserApplication`クラスは、Koinからインスタンスをブートストラップするのに役立ちます。`KoinComponent`インターフェースのおかげで、`UserService`を解決します。これにより、`by inject()`デリゲート関数でそれを注入できます。

```kotlin
class UserApplication : KoinComponent {

    private val userService : UserService by inject()

    // display our data
    fun sayHello(){
        val user = userService.getDefaultUser()
        val message = "Hello '$user'!"
        println(message)
    }
}
```

これで、アプリの準備ができました。

:::info
`by inject()`関数を使用すると、`KoinComponent`を継承する任意のクラスでKoinインスタンスを取得できます。
:::

## Koinの開始

アプリケーションと一緒にKoinを開始する必要があります。アプリケーションのメインエントリーポイントである`main`関数で`startKoin()`関数を呼び出すだけです。

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin`内の`modules()`関数は、指定されたモジュールリストをロードします。
:::

## Koinモジュール：クラシックまたはコンストラクタDSL？

これが私たちのアプリのKoinモジュール宣言です。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

コンストラクタを使用することで、より簡潔な方法で記述できます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```