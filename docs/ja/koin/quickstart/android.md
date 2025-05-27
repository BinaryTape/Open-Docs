---
title: Android
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得します。
> このチュートリアルは、完了までに約__10分__かかります。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで入手可能です](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、それをPresenterまたはViewModelを使用して`MainActivity`クラスに表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「Repository」コンポーネントを作成します（ユーザーの追加や名前による検索など）。以下に、`UserRepository`インターフェースとその実装を示します。

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

Koinモジュールを宣言するには、`module`関数を使用します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成して、`UserRepository`のシングルトンを取得します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## Presenterでユーザーを表示する

ユーザーを表示するためのプレゼンターコンポーネントを記述しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserPresenter`のコンストラクタで`UserRepository`が参照されます。

Koinモジュールに`UserPresenter`を宣言します。これを`factoryOf`定義として宣言します。これは、メモリにインスタンスを保持しないためです（Androidライフサイクルでのメモリリークを回避します）。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()`関数を使用すると、Koinに必要な依存関係を解決するように要求できます。

## Androidでの依存性注入

`UserPresenter`コンポーネントが作成され、それに伴い`UserRepository`インスタンスが解決されます。Activityでこれを利用するには、`by inject()`デリゲート関数を使用して注入します。

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

これで、アプリの準備ができました。

:::info
`by inject()`関数を使用すると、Androidコンポーネントのランタイム（Activity、fragment、Serviceなど）でKoinインスタンスを取得できます。
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションの主要なエントリーポイントである`MainApplication`クラスで、`startKoin()`関数を呼び出すだけです。

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin`内の`modules()`関数は、指定されたモジュールのリストを読み込みます。
:::

## Koinモジュール：クラシックDSLとコンストラクタDSL

アプリケーションのKoinモジュール宣言は以下の通りです。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    factory { MyPresenter(get()) }
}
```

コンストラクタを使用することで、よりコンパクトに記述できます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

## アプリの検証！

アプリケーションを起動する前にKoinの設定が適切であることを確認できます。シンプルなJUnitテストでKoinの設定を検証することで。

### Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
// Add Maven Central to your repositories if needed
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### モジュールの確認

`verify()`関数は、指定されたKoinモジュールを検証できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

わずかなJUnitテストで、定義の設定に不足がないことを確認できます！