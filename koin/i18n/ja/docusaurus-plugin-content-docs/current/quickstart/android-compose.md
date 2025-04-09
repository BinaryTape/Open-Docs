---
title: "Android - Jetpack Compose"
---
> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得する方法を説明します。
> チュートリアルの所要時間は約__10分__です。

:::note
更新 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
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

このアプリケーションのアイデアは、ユーザーのリストを管理し、PresenterまたはViewModelを使用して`MainActivity`クラスに表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> Composable

## "User"データ

ユーザーのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する（ユーザーを追加したり、名前で検索したりする）ための"Repository"コンポーネントを作成します。以下は、`UserRepository`インターフェースとその実装です。

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

`module`関数を使用してKoinモジュールを宣言します。 Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {
    
}
```

最初のコンポーネントを宣言しましょう。 `UserRepositoryImpl`のインスタンスを作成して、`UserRepository`のシングルトンが必要です。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## UserViewModelを使用したユーザーの表示

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

Koinモジュールで`UserViewModel`を宣言します。 メモリにインスタンスを保持しないように（Androidライフサイクルでのリークを回避するため）、`viewModelOf`定義として宣言します。

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()`関数を使用すると、Koinに必要な依存関係を解決するように依頼できます。

### ComposeでのViewModelの注入

`UserViewModel`コンポーネントが作成され、`UserRepository`インスタンスが解決されます。 Activityに取得するには、`koinViewModel()`関数を使用して注入しましょう。

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel`関数を使用すると、ViewModelインスタンスを取得し、関連するViewModel Factoryを作成して、ライフサイクルにバインドできます
:::

## UserStateHolderを使用したユーザーの表示

### `UserStateHolder`クラス

ユーザーを表示するためのState holderコンポーネントを作成しましょう。

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されています

Koinモジュールで`UserStateHolder`を宣言します。 メモリにインスタンスを保持しないように（Androidライフサイクルでのリークを回避するため）、`factoryOf`定義として宣言します。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### ComposeでのUserStateHolderの注入

`UserStateHolder`コンポーネントが作成され、`UserRepository`インスタンスが解決されます。 Activityに取得するには、`koinInject()`関数を使用して注入しましょう。

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject`関数を使用すると、ViewModelインスタンスを取得し、関連するViewModel Factoryを作成して、ライフサイクルにバインドできます
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。 アプリケーションのメインエントリポイントである`MainApplication`クラスで、`startKoin()`関数を呼び出すだけです。

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
`startKoin`の`modules()`関数は、指定されたモジュールのリストをロードします
:::

Composeアプリケーションを開始するときは、`KoinAndroidContext`を使用して、Koinを現在のComposeアプリケーションにリンクする必要があります。

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

## Koinモジュール：クラシックまたはコンストラクタDSL？

アプリのKoinモジュールの宣言を次に示します。

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

Koin構成が適切であることを確認するために、簡単なJUnitテストでKoin構成を検証できます。

### Gradleの設定

以下のようにKoin Androidの依存関係を追加します。

```groovy
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

JUnitテストだけで、定義の構成に不足がないことを確認できます。