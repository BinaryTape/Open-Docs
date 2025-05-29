---
title: Androidとアノテーション
---

> このチュートリアルでは、Androidアプリケーションを記述し、Koinの依存性注入を使用してコンポーネントを取得する方法を学びます。
> チュートリアルにはおよそ**10分**かかります。

:::note
更新日 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradleのセットアップ

KSPプラグインと以下の依存関係をこのように設定しましょう。

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// Compile time check
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
現在のバージョンは `libs.versions.toml` を参照してください。
:::

## アプリケーションの概要

このアプリケーションのアイデアは、ユーザーのリストを管理し、それをPresenterまたはViewModelを使用して`MainActivity`クラスに表示することです。

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」データ

Userのコレクションを管理します。データクラスは次のとおりです。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理するための「Repository」コンポーネント（ユーザーの追加や名前での検索）を作成します。以下に`UserRepository`インターフェースとその実装を示します。

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

以下のように`AppModule`モジュールクラスを宣言しましょう。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* `@Module`を使用して、クラスをKoinモジュールとして宣言します。
* `@ComponentScan("org.koin.sample")`は、`"org.koin.sample"`パッケージ内のすべてのKoin定義をスキャンすることを可能にします。

`UserRepositoryImpl`クラスに`@Single`をシンプルに追加して、シングルトンとして宣言しましょう。

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## Presenterでのユーザー表示

ユーザーを表示するためのPresenterコンポーネントを記述しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`は`UserPresenter`のコンストラクタで参照されています。

Koinモジュールで`UserPresenter`を宣言します。Androidのライフサイクルによるメモリリークを避けるために、インスタンスをメモリに保持しないよう、`@Factory`アノテーションを使用して`factory`定義として宣言します。

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## Androidでの依存性注入

`UserPresenter`コンポーネントは、`UserRepository`インスタンスを解決して作成されます。Activityでそれらを取得するために、`by inject()`デリゲート関数で注入しましょう。

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
`by inject()`関数を使用すると、Androidコンポーネントの実行時（Activity、Fragment、Serviceなど）にKoinインスタンスを取得できます。
:::

## Koinの開始

AndroidアプリケーションでKoinを開始する必要があります。アプリケーションのメインエントリポイントである`MainApplication`クラスで`startKoin()`関数を呼び出すだけです。

```kotlin
// generated
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

Koinモジュールは`AppModule`から`.module`拡張関数で生成されます。アノテーションからKoinモジュールを取得するには、`AppModule().module`式を使用するだけです。

:::info
生成されたKoinモジュールコンテンツを使用できるようにするためには、`import org.koin.ksp.generated.*`インポートが必要です。
:::

## ViewModelでのユーザー表示

ユーザーを表示するためのViewModelコンポーネントを記述しましょう。

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository`は`UserViewModel`のコンストラクタで参照されています。

`UserViewModel`には`@KoinViewModel`アノテーションがタグ付けされており、Koin ViewModel定義を宣言し、インスタンスをメモリに保持しない（Androidのライフサイクルによるメモリリークを避ける）ようにします。

## AndroidでのViewModelの注入

`UserViewModel`コンポーネントは、`UserRepository`インスタンスを解決して作成されます。Activityでそれらを取得するために、`by viewModel()`デリゲート関数で注入しましょう。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## コンパイル時チェック

Koin Annotationsを使用すると、コンパイル時にKoinの設定をチェックできます。これは、以下のGradleオプションを使用することで利用可能です。

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## アプリの検証！

アプリを起動する前に、簡単なJUnitテストでKoinの設定を検証することで、Koinの設定が適切であることを確認できます。

### Gradleのセットアップ

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

### モジュールのチェック

`androidVerify()`関数は、指定されたKoinモジュールを検証することを可能にします。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

JUnitテストだけで、定義の設定に不足がないことを確認できます！