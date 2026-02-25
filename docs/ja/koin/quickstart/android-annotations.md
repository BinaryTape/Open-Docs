---
title: Android とアノテーション
---

> このチュートリアルでは、Android アプリケーションを作成し、Koin の依存性の注入（DI）を使用してコンポーネントを取得する方法を学びます。
> 所要時間は約 **10 分** です。

:::note
更新 - 2024-10-21
:::

## コードの取得

:::info
[ソースコードは GitHub で公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-annotations)
:::

## Gradle の設定

KSP プラグインと以下の依存関係を次のように設定しましょう。

```groovy
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    // ...

    implementation(libs.koin.annotations)
    ksp(libs.koin.ksp)
}

// コンパイル時のチェック
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

:::note
現在のバージョンについては `libs.versions.toml` を参照してください。
:::

## アプリケーションの概要

このアプリケーションの構成は、ユーザーのリストを管理し、Presenter または ViewModel を使用して `MainActivity` クラスに表示するというものです。

> Users -> UserRepository -> (Presenter または ViewModel) -> MainActivity

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

## Koin モジュール

以下のように `AppModule` モジュールクラスを宣言しましょう。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

* `@Module` を使用して、このクラスを Koin モジュールとして宣言します。
* `@ComponentScan("org.koin.sample")` により、`"org.koin.sample"` パッケージ内のすべての Koin 定義をスキャンできます。

`UserRepositoryImpl` クラスに `@Single` を追加するだけで、シングルトンとして宣言できます。

```kotlin
@Single
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## Presenter によるユーザーの表示

ユーザーを表示するための Presenter コンポーネントを作成しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` は `UserPresenter` のコンストラクタで参照されています。

Koin モジュールで `UserPresenter` を宣言します。Android のライフサイクルによるメモリリークを避けるため、インスタンスをメモリに保持しないよう、 `@Factory` アノテーションを使用して `factory` 定義として宣言します。

```kotlin
@Factory
class UserPresenter(private val repository: UserRepository) {
    // ...
}
```

## Android での依存性の注入

`UserPresenter` コンポーネントが作成され、その際に `UserRepository` インスタンスが解決されます。これを Activity で取得するには、`by inject()` デリゲート関数を使用して注入します。

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
`by inject()` 関数を使用すると、Android コンポーネントの実行時（Activity、Fragment、Service など）に Koin インスタンスを取得できます。
:::

## Koin の開始

Android アプリケーションで Koin を開始する必要があります。アプリケーションのメインエントリポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出すだけです。

```kotlin
// 生成されたコード
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

Koin モジュールは、`.module` 拡張機能を使用して `AppModule` から生成されます。アノテーションから Koin モジュールを取得するには、`AppModule().module` という式を使用します。

:::info
生成された Koin モジュールの内容を使用できるようにするには、`import org.koin.ksp.generated.*` のインポートが必要です。
:::

## ViewModel によるユーザーの表示

ユーザーを表示するための ViewModel コンポーネントを作成しましょう。

```kotlin
@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` は `UserViewModel` のコンストラクタで参照されています。

`UserViewModel` は、`@KoinViewModel` アノテーションでタグ付けされ、Koin の ViewModel 定義として宣言されます。これにより、Android のライフサイクルに伴うメモリリークを避けるため、インスタンスがメモリに保持されなくなります。

## Android での ViewModel の注入

`UserViewModel` コンポーネントが作成され、その際に `UserRepository` インスタンスが解決されます。これを Activity で取得するには、`by viewModel()` デリゲート関数を使用して注入します。

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

## コンパイル時のチェック

Koin Annotations を使用すると、コンパイル時に Koin の設定をチェックできます。これは、以下の Gradle オプションを使用することで利用可能です。

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK","true")
}
```

## アプリの検証

シンプルな JUnit テストで Koin の設定を検証することで、アプリを起動する前に Koin の設定が正しいことを確認できます。

### Gradle の設定

以下のように Koin Android のテスト用依存関係を追加します。

```groovy
// 必要に応じて Maven Central をリポジトリに追加してください
repositories {
	mavenCentral()    
}

dependencies {
    
    // テスト用 Koin
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### モジュールのチェック

`androidVerify()` 関数を使用すると、指定した Koin モジュールを検証できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {

        AppModule().module.androidVerify()
    }
}
```

JUnit テストだけで、定義の設定に不足がないことを確認できます。