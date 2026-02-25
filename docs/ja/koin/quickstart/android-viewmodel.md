---
title: Android - ViewModel
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入（DI）を使用してコンポーネントを取得する方法について説明します。
> このチュートリアルの所要時間は約 **10分** です。

:::note
更新日 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
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

このアプリケーションの目的は、ユーザーのリストを管理し、PresenterまたはViewModelを使用して `MainActivity` クラスに表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name : String)
```

ユーザーリストを管理する（ユーザーの追加や名前による検索を行う）「Repository」コンポーネントを作成します。以下に `UserRepository` インターフェースとその実装を示します。

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

Koinモジュールを宣言するには `module` 関数を使用します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl` のインスタンスを作成して、`UserRepository` のシングルトンを定義します。

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## ViewModelを使用したユーザーの表示

ユーザーを表示するためのViewModelコンポーネントを記述しましょう。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` は `UserViewModel` のコンストラクタで参照されます。

Koinモジュールで `UserViewModel` を宣言します。インスタンスをメモリに保持し続けないように（Androidのライフサイクルによるメモリリークを避けるため）、`viewModelOf` 定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## AndroidでのViewModelの注入

`UserViewModel` コンポーネントが作成され、その際に `UserRepository` インスタンスが解決（注入）されます。これをActivityで取得するには、`by viewModel()` デリゲート関数を使用して注入します。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

これでアプリの準備は完了です。

:::info
`by viewModel()` 関数を使用すると、ViewModelのインスタンスを取得し、適切なViewModel Factoryを自動的に作成してライフサイクルにバインドします。
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリーポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出します。

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

## Koinモジュール：従来のDSLか、コンストラクタDSLか？

このアプリのKoinモジュール宣言は以下の通りです。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

コンストラクタを使用することで、より簡潔に記述することもできます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## アプリの検証

簡単なJUnitテストを使用してKoinの構成を検証することで、アプリを起動する前にKoinの設定が正しいことを確認できます。

### Gradleの設定

以下のようにKoin Androidのテスト用依存関係を追加します。

```groovy
// 必要に応じてリポジトリにMaven Centralを追加してください
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
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

JUnitテストを実行するだけで、定義の設定に不足がないことを確認できます。