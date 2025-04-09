---
title: Androidとアノテーション（Annotations）
---
> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得します。
> チュートリアルに必要な時間は約 __10分__ です。

:::note
更新 - 2024-10-21
:::

## コードを入手する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradleの設定 (Gradle Setup)

以下のようにKSPプラグインを設定し、以下の依存関係を追加します。

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// コンパイル時チェック (Compile time check)
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
現在のバージョンについては、`libs.versions.toml`を参照してください。
:::

## アプリケーションの概要 (Application Overview)

このアプリケーションのアイデアは、ユーザーのリストを管理し、`MainActivity`クラスでPresenterまたはViewModelを使って表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

ユーザーのコレクションを管理します。以下はデータクラスです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「Repository」コンポーネントを作成します（ユーザーの追加や名前による検索など）。以下は、`UserRepository`インターフェースとその実装です。

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

## Koinモジュール (Koin module)

以下のように`AppModule`モジュールクラスを宣言しましょう。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* `@Module`を使用して、クラスをKoinモジュールとして宣言します。
* `@ComponentScan("org.koin.sample")`を使用すると、`"org.koin.sample"`パッケージ内のKoin定義をスキャンできます。

`UserRepositoryImpl`クラスに`@Single`を追加して、シングルトンとして宣言しましょう。

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## Presenterを使ったユーザーの表示 (Displaying User with Presenter)

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

Koinモジュールで`UserPresenter`を宣言します。`@Factory`アノテーションを使用して`factory`定義として宣言し、インスタンスをメモリに保持しないようにします（Androidのライフサイクルでのリークを回避するため）。

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## Androidでの依存性の注入 (Injecting Dependencies in Android)

`UserPresenter`コンポーネントが作成され、それとともに`UserRepository`インスタンスが解決されます。Activityでそれを取得するには、`by inject()`デリゲート関数を使って注入しましょう。

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

## Koinの起動 (Start Koin)

AndroidアプリケーションでKoinを起動する必要があります。アプリケーションのメインエントリポイントである`MainApplication`クラスで`startKoin()`関数を呼び出すだけです。

```kotlin
// 生成されました (generated)
import org.koin.ksp.generated.*

class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()
        
        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(AppModule().module)
        }
    }
}
```

Koinモジュールは、`.module`拡張子を持つ`AppModule`から生成されます。`AppModule().module`式を使用して、アノテーションからKoinモジュールを取得するだけです。

:::info
生成されたKoinモジュールコンテンツを使用するには、`import org.koin.ksp.generated.*`インポートが必要です。
:::

## ViewModelを使ったユーザーの表示 (Displaying User with ViewModel)

ユーザーを表示するためのViewModelコンポーネントを作成しましょう。

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryはUserViewModelのコンストラクタで参照されます。

`UserViewModel`には`@KoinViewModel`アノテーションが付けられており、Koin ViewModel定義を宣言し、インスタンスをメモリに保持しないようにします（Androidのライフサイクルでのリークを回避するため）。

## AndroidでのViewModelの注入 (Injecting ViewModel in Android)

`UserViewModel`コンポーネントが作成され、それとともに`UserRepository`インスタンスが解決されます。Activityでそれを取得するには、`by viewModel()`デリゲート関数を使って注入しましょう。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## コンパイル時チェック (Compile Time Checks)

Koin Annotationsを使用すると、コンパイル時にKoin構成をチェックできます。これは、次のGradleオプションを使用することで利用できます。

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## アプリの検証 (Verifying your App!)

単純なJUnitテストでKoin構成を検証することで、Koin構成が正しく設定されていることを確認できます。

### Gradleの設定 (Gradle Setup)

必要に応じて、Maven Centralをリポジトリに追加します。

```groovy
// 必要に応じて、Maven Centralをリポジトリに追加します (Add Maven Central to your repositories if needed)
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### モジュールのチェック (Checking your modules)

`androidVerify()`関数を使用すると、指定されたKoinモジュールを検証できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

JUnitテストだけで、定義構成に不足がないことを確認できます。
```