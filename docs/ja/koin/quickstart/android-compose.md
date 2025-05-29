---
title: Android - Jetpack Compose
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得する方法を学びます。
> チュートリアルの完了には約**10分**かかります。

:::note
更新日 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradleのセットアップ

以下のようにKoin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## アプリケーションの概要

このアプリケーションは、ユーザーのリストを管理し、それを`MainActivity`クラスにPresenterまたはViewModelを使って表示することを目的としています。

> Users -> UserRepository -> (Presenter or ViewModel) -> Composable

## 「User」データ

Userのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーリストを管理する「Repository」コンポーネント (ユーザーの追加や名前による検索) を作成します。以下に、`UserRepository`インターフェースとその実装を示します。

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

最初のコンポーネントを宣言しましょう。`UserRepositoryImpl`のインスタンスを作成することで、`UserRepository`のシングルトンが必要になります。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## UserViewModelでユーザーを表示する

### `UserViewModel`クラス

ユーザーを表示するためのViewModelコンポーネントを作成しましょう。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されています

Koinモジュールで`UserViewModel`を宣言します。メモリにインスタンスを保持しないように（Androidライフサイクルでのメモリリークを避けるため）、`viewModelOf`定義として宣言します。

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()`関数は、Koinに必要な依存関係を解決するように要求することを可能にします。

### ComposeでViewModelを注入する

`UserViewModel`コンポーネントが作成され、それに`UserRepository`インスタンスが解決されます。それをActivityに取得するには、`koinViewModel()`関数で注入しましょう。

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel`関数を使用すると、ViewModelインスタンスを取得し、関連するViewModelファクトリーを自動的に作成し、ライフサイクルにバインドできます。
:::

## UserStateHolderでユーザーを表示する

### `UserStateHolder`クラス

ユーザーを表示するためのStateホルダーコンポーネントを作成しましょう。

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されています

Koinモジュールで`UserStateHolder`を宣言します。メモリにインスタンスを保持しないように（Androidライフサイクルでのメモリリークを避けるため）、`factoryOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### ComposeでUserStateHolderを注入する

`UserStateHolder`コンポーネントが作成され、それに`UserRepository`インスタンスが解決されます。それをActivityに取得するには、`koinInject()`関数で注入しましょう。

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject`関数を使用すると、ViewModelインスタンスを取得し、関連するViewModelファクトリーを自動的に作成し、ライフサイクルにバインドできます。
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
`startKoin`内の`modules()`関数は、指定されたモジュールのリストを読み込みます。
:::

Composeアプリケーションの起動時に、`KoinAndroidContext`を使用してKoinを現在のComposeアプリケーションにリンクする必要があります。

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                KoinAndroidContext {
                    App()
                }
            }
        }
    }
}
```

## Koinモジュール: クラシックDSLかコンストラクタDSLか？

以下に、私たちのアプリのKoinモジュールの宣言を示します。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

コンストラクタを使用することで、よりコンパクトに記述できます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## アプリケーションの検証！

アプリケーションを起動する前に、シンプルなJUnitテストでKoinの設定を検証することで、Koinの設定が適切であることを確認できます。

### Gradleのセットアップ

以下のようにKoin Androidの依存関係を追加します。

```groovy
dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### モジュールの確認

`verify()`関数は、指定されたKoinモジュールを検証することを可能にします。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

JUnitテストだけで、定義の構成に不足がないことを確認できます！