---
title: Android
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存関係注入（Dependency Injection）を使用してコンポーネントを取得する方法を説明します。
> チュートリアルを完了するのに必要な時間は約 **10分** です。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradleの設定

以下のように、Koin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの構想は、ユーザーのリストを管理し、それを Presenter または ViewModel を使用して `MainActivity` クラスに表示することです。

> Users -> UserRepository -> (Presenter または ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する（ユーザーの追加や名前による検索）ための「Repository」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です。

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

Koinモジュールを宣言するには `module` 関数を使用します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成することで、`UserRepository` のシングルトンが必要であると定義します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## Presenterを使用したユーザーの表示

ユーザーを表示するためのプレゼンターコンポーネントを記述しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository は UserPresenter のコンストラクターで参照されています。

Koinモジュールに `UserPresenter` を宣言します。Androidのライフサイクルに伴うメモリリークを避けるため、インスタンスをメモリに保持しないよう `factoryOf` 定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()` 関数を使用すると、必要な依存関係を解決するようにKoinに要求できます。

## Androidでの依存関係の注入

`UserPresenter` コンポーネントが作成される際、併せて `UserRepository` インスタンスも解決されます。これをActivityで取得するために、`by inject()` デリゲート関数を使用して注入しましょう。

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

これで、アプリの準備が整いました。

:::info
`by inject()` 関数を使用すると、Androidコンポーネントのランタイム（Activity、Fragment、Serviceなど）でKoinインスタンスを取得できます。
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリーポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出すだけです。

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
`startKoin` 内の `modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## Koinモジュール：クラシックDSLかコンストラクターDSLか？

本アプリのKoinモジュール宣言は以下の通りです。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    factory { MyPresenter(get()) }
}
```

コンストラクターを使用することで、より簡潔に記述することもできます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

## アプリの検証

アプリを起動する前に、シンプルなJUnitテストでKoinの設定を検証し、正しく設定されているか確認できます。

### Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
// 必要に応じてリポジトリに Maven Central を追加してください
repositories {
	mavenCentral()    
}

dependencies {
    
    // テスト用のKoin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### モジュールのチェック

`verify()` 関数を使用すると、指定されたKoinモジュールを検証できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

JUnitテストを実行するだけで、定義の設定に不足がないことを確認できます！