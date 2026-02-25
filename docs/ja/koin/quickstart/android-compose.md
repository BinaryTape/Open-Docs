---
title: Android - Jetpack Compose
---

> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存関係注入（dependency injection）を使用してコンポーネントを取得する方法を学びます。
> 所要時間は約 **10分** です。

:::note
更新日 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## アプリケーションの概要

このアプリケーションの構成は、ユーザーのリストを管理し、PresenterまたはViewModelを使用して `MainActivity` クラスに表示するというものです。

> Users -> UserRepository -> (Presenter または ViewModel) -> Composable

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

Koinモジュールを宣言するには `module` 関数を使用します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。 `UserRepositoryImpl` のインスタンスを作成して、 `UserRepository` のシングルトンを作成します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## UserViewModelでユーザーを表示する

### `UserViewModel` クラス

ユーザーを表示するためのViewModelコンポーネントを作成します。

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されています。

Koinモジュールで `UserViewModel` を宣言します。メモリ内にインスタンスを保持し続けないように（Androidのライフサイクルによるリークを避けるため）、 `viewModelOf` 定義として宣言します。

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 関数を使用すると、Koinに必要な依存関係の解決を依頼できます。

### ComposeでのViewModelの注入

`UserViewModel` コンポーネントが作成され、それとともに `UserRepository` インスタンスが解決されます。これをActivityで使用するために、 `koinViewModel()` 関数を使って注入しましょう。

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 関数を使用すると、ViewModelのインスタンスを取得し、関連するViewModel Factoryを自動的に作成してライフサイクルにバインドすることができます。
:::

## UserStateHolderでユーザーを表示する

### `UserStateHolder` クラス

ユーザーを表示するためのステートホルダー（State holder）コンポーネントを作成します。

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されています。

Koinモジュールで `UserStateHolder` を宣言します。メモリ内にインスタンスを保持し続けないように（Androidのライフサイクルによるリークを避けるため）、 `factoryOf` 定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### ComposeでのUserStateHolderの注入

`UserStateHolder` コンポーネントが作成され、それとともに `UserRepository` インスタンスが解決されます。これをActivityで使用するために、 `koinInject()` 関数を使って注入しましょう。

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 関数を使用すると、インスタンスを取得し、関連するViewModel Factoryを自動的に作成してライフサイクルにバインドすることができます。
:::

## Koinの起動

AndroidアプリケーションでKoinを起動する必要があります。アプリケーションのメインエントリポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出すだけです。

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

Composeアプリケーションの起動時に、 `KoinAndroidContext` を使用してKoinを現在のComposeアプリケーションにリンクする必要があります。

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

このアプリのKoinモジュール宣言は以下の通りです。

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

コンストラクタを使用することで、よりコンパクトに記述することができます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## アプリの検証！

アプリを起動する前に、シンプルなJUnitテストを使用してKoinの設定を検証し、Koinの設定が正しいことを確認できます。

### Gradleの設定

以下のようにKoin Androidのテスト用依存関係を追加します。

```groovy
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

JUnitテストを実行するだけで、定義の設定に不足がないかを確認できます。