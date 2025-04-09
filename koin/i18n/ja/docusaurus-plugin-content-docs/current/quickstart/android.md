---
title: Android
---
> このチュートリアルでは、Androidアプリケーションを作成し、KoinのDependency Injection（依存性注入）を使用してコンポーネントを取得する方法を説明します。
> チュートリアルの所要時間は約__10分__です。

:::note
更新 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradleの設定

Koin Androidの依存関係を以下のように追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、`MainActivity`クラスでPresenterまたはViewModelを使用して表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。以下はデータクラスです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理（ユーザーの追加、名前による検索）する「Repository」（リポジトリ）コンポーネントを作成します。以下は、`UserRepository`インターフェースとその実装です。

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

`module`関数を使用してKoinモジュールを宣言します。Koinモジュールは、インジェクトされるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepository`のシングルトン（単一インスタンス）を作成し、`UserRepositoryImpl`のインスタンスを作成します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## Presenterを使用したユーザーの表示

ユーザーを表示するためのPresenterコンポーネントを作成しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserPresenterのコンストラクタで参照されます。

`UserPresenter`をKoinモジュールで宣言します。メモリにインスタンスを保持しないように（Androidのライフサイクルによるリークを避けるため）、`factoryOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()`関数を使用すると、Koinに必要な依存関係の解決を依頼できます。

## Androidでの依存性の注入

`UserPresenter`コンポーネントが作成され、それとともに`UserRepository`インスタンスが解決されます。それをActivityに取得するには、`by inject()`デリゲート関数を使用してインジェクトします。

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

## Koinの起動

AndroidアプリケーションでKoinを起動する必要があります。アプリケーションのメインエントリポイントである`MainApplication`クラスで`startKoin()`関数を呼び出すだけです。

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
`startKoin`の`modules()`関数は、指定されたモジュールのリストをロードします。
:::

## Koinモジュール: クラシックまたはコンストラクタDSL？

以下は、アプリのKoinモジュールの宣言です。

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

JUnitテストを使用してKoinの構成を検証することで、アプリを起動する前にKoin構成が正しいことを確認できます。

### Gradleの設定

Koin Androidの依存関係を以下のように追加します。

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

### モジュールのチェック

`verify()`関数を使用すると、指定されたKoinモジュールを検証できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

JUnitテストだけで、定義構成に不足がないことを確認できます！
```