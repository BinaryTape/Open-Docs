---
title: "Android - ViewModel"
---
> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入（Dependency Injection）を使用してコンポーネントを取得する方法を説明します。
> チュートリアルの所要時間は約 __10分__ です。

:::note
更新 - 2024-10-21
:::

## コードを取得する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
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

このアプリケーションのアイデアは、ユーザーのリストを管理し、PresenterまたはViewModelを使用して`MainActivity`クラスに表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する（ユーザーを追加したり、名前で検索したりする）ための「Repository」（リポジトリ）コンポーネントを作成します。以下は、`UserRepository`インターフェースとその実装です。

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

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成して、`UserRepository`のシングルトン（singleton）が必要です。

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## ViewModelを使用してユーザーを表示する

ユーザーを表示するためのViewModelコンポーネントを作成しましょう。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されます。

Koinモジュールで`UserViewModel`を宣言します。メモリにインスタンスを保持しないように（Androidライフサイクルでのリークを避けるため）、`viewModelOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## AndroidでのViewModelのインジェクション

`UserViewModel`コンポーネントが作成され、それとともに`UserRepository`インスタンスが解決されます。Activityに取得するには、`by viewModel()`デリゲート関数を使用してインジェクトします。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

これで、アプリの準備ができました。

:::info
`by viewModel()`関数を使用すると、ViewModelインスタンスを取得し、関連付けられたViewModel Factoryを作成し、ライフサイクルにバインドできます。
:::

## Koinを開始する

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリポイントである`MainApplication`クラスで`startKoin()`関数を呼び出すだけです。

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

## Koinモジュール：従来型またはコンストラクタDSL？

アプリのKoinモジュールの宣言を以下に示します。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

コンストラクタを使用すると、よりコンパクトな方法で記述できます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## アプリの検証！

簡単なJUnitテストでKoin構成を検証することで、アプリを起動する前にKoin構成が正しいことを確認できます。

### Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
// 必要に応じて、Maven Centralをリポジトリに追加します
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

JUnitテストだけで、定義構成に不足がないことを確認できます。