---
title: Android - ViewModel
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性の注入を使用してコンポーネントを取得する方法を学びます。
> チュートリアルを完了するには、約**10分**かかります。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGithubで入手可能です](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradleセットアップ

以下のようにKoin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの目的は、ユーザーのリストを管理し、それを`MainActivity`クラスでPresenterまたはViewModelを使って表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

Userのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「Repository」コンポーネントを作成します（ユーザーの追加や名前での検索）。以下に、`UserRepository`インターフェースとその実装を示します。

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

Koinモジュールを宣言するには、`module`関数を使用します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成することで、`UserRepository`のシングルトンを宣言します。

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## ViewModelを使ったユーザー表示

ユーザーを表示するためのViewModelコンポーネントを作成しましょう。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`は`UserViewModel`のコンストラクタで参照されます

`UserViewModel`をKoinモジュール内で宣言します。Androidのライフサイクルとのメモリリークを避けるために、`viewModelOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## AndroidにおけるViewModelの注入

`UserViewModel`コンポーネントは作成され、それに伴い`UserRepository`インスタンスが解決されます。それをActivityで取得するには、`by viewModel()`デリゲート関数を使って注入します。

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
`by viewModel()`関数を使用すると、ViewModelインスタンスを取得し、関連するViewModel Factoryを自動で作成して、ライフサイクルにバインドできます
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリポイントである`MainApplication`クラスで、`startKoin()`関数を呼び出すだけです。

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
`startKoin`内の`modules()`関数は、指定されたモジュールリストをロードします
:::

## Koinモジュール: 従来の書き方とコンストラクタDSL

こちらがアプリのKoinモジュールの宣言です。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

コンストラクタを使用することで、よりコンパクトな方法で記述できます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## アプリの検証！

簡単なJUnitテストでKoin設定を検証することで、アプリを起動する前にKoin設定が適切であることを確認できます。

### Gradleセットアップ

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

`verify()`関数を使用すると、指定されたKoinモジュールを検証できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

JUnitテストだけで、定義の設定に不足がないことを確認できます！