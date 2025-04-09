---
title: Kotlin（コトリン）
---
> このチュートリアルでは、Kotlinアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得する方法を学びます。
> チュートリアルに必要な時間は約__10分__です。

:::note
更新 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## セットアップ

まず、`koin-core` の依存関係が以下のように追加されていることを確認してください。

```groovy
dependencies {
    
    // Koin for Kotlin apps
    compile "io.insert-koin:koin-core:$koin_version"
}
```

## アプリケーションの概要

アプリケーションのアイデアは、ユーザーのリストを管理し、それを `UserApplication` クラスに表示することです。

> Users -> UserRepository -> UserService -> UserApplication

## "User"データ

ユーザーのコレクションを管理します。以下はデータクラスです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する "Repository" (リポジトリ)コンポーネントを作成します (ユーザーの追加または名前による検索)。以下に、`UserRepository` インターフェースとその実装を示します。

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

最初のコンポーネントを宣言しましょう。`UserRepository` のシングルトンが必要なので、`UserRepositoryImpl` のインスタンスを作成します。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserServiceコンポーネント

デフォルトユーザーをリクエストするUserServiceコンポーネントを作成しましょう。

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepositoryはUserPresenterのコンストラクタで参照されます。

`UserService`をKoinモジュールで宣言します。`single`定義として宣言します。

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 関数を使用すると、Koinに必要な依存関係を解決するように要求できます。

## UserApplicationでの依存性注入

`UserApplication` クラスは、Koinからインスタンスをブートストラップするのに役立ちます。`KoinComponent` インターフェースのおかげで、`UserService` を解決します。これにより、`by inject()` デリゲート関数で注入できます。

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
`by inject()` 関数を使用すると、`KoinComponent` を拡張する任意のクラスでKoinインスタンスを取得できます。
:::

## Koinを起動する

アプリケーションでKoinを起動する必要があります。アプリケーションのメインエントリポイントである `main` 関数で `startKoin()` 関数を呼び出すだけです。

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin` の `modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## Koinモジュール：classic または constructor DSL？

以下は、アプリのKoinモジュールの宣言です。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

コンストラクタを使用すると、より簡潔に記述できます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```