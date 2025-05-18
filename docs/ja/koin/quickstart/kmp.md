---
title: "Kotlin Multiplatform - UIの共有なし"
---
> このチュートリアルでは、Androidアプリケーションを作成し、Koinの依存性注入を使用してコンポーネントを取得する方法を説明します。
> チュートリアルの所要時間は約 __15分__ です。

:::note
更新 - 2024-10-21
:::

## コードを取得する

:::info
[ソースコードはGithubで入手できます](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## アプリケーション概要 (Application Overview)

このアプリケーションのアイデアは、ユーザーのリストを管理し、共有のPresenterを使用してネイティブUIに表示することです。

`Users -> UserRepository -> Shared Presenter -> Native UI`

## 「ユーザー (User)」データ

> すべての共通/共有コードは、`shared` Gradleプロジェクトにあります。

ユーザーのコレクションを管理します。データクラスを以下に示します。

```kotlin
data class User(val name : String)
```

ユーザーのリストを管理する「リポジトリ (Repository)」コンポーネントを作成します（ユーザーの追加または名前による検索）。以下に、`UserRepository`インターフェースとその実装を示します。

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

## 共有Koinモジュール (Shared Koin module)

`module`関数を使用して、Koinモジュールを宣言します。Koinモジュールは、注入されるすべてのコンポーネントを定義する場所です。

最初のコンポーネントを宣言しましょう。`UserRepository`のシングルトンが必要なので、`UserRepositoryImpl`のインスタンスを作成します。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共有Presenter (Shared Presenter)

ユーザーを表示するPresenterコンポーネントを作成しましょう。

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepositoryは、UserPresenterのコンストラクタで参照されています。

`UserPresenter`をKoinモジュールで宣言します。`factoryOf`定義として宣言し、インスタンスをメモリに保持せず、ネイティブシステムに保持させます。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koinモジュールは、iOS側から`initKoin()`関数で簡単に実行できるように、実行する関数（ここでは`appModule`）として使用できます。
:::

## ネイティブコンポーネント (Native Component)

次のネイティブコンポーネントは、AndroidとiOSで定義されています。

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

どちらもローカルプラットフォームの実装を取得します。

## Androidでの注入 (Injecting in Android)

> すべてのAndroidアプリは、`androidApp` Gradleプロジェクトにあります。

`UserPresenter`コンポーネントが作成され、それと共に`UserRepository`インスタンスが解決されます。Activityに取得するには、`koinInject`コンポーズ関数を使用して注入します。

```kotlin
// in App()

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

これでアプリの準備が整いました。

:::info
`koinInject()`関数を使用すると、Android ComposeランタイムでKoinインスタンスを取得できます。
:::

AndroidアプリケーションでKoinを起動する必要があります。Composeアプリケーション関数`App`で`KoinApplication()`関数を呼び出すだけです。

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

共有KMP構成からKoin Android構成を収集します。

```kotlin
// Android config
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
`LocalContext.current`を使用して、Composeから現在のAndroidコンテキストを取得します。
:::

そして、共有KMP構成：

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()`関数は、指定されたモジュールのリストをロードします。
:::

## iOSでの注入 (Injecting in iOS)

> すべてのiOSアプリは、`iosApp`フォルダーにあります。

`UserPresenter`コンポーネントが作成され、それと共に`UserRepository`インスタンスが解決されます。`ContentView`に取得するには、iOSのKoin依存関係を取得する関数を作成する必要があります。

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

それだけです。iOS側から`KoinKt.getUserPresenter().sayHello()`関数を呼び出すことができます。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

iOSアプリケーションでKoinを起動する必要があります。Kotlin共有コードでは、`initKoin()`関数を使用して共有構成を使用できます。
最後に、iOSメインエントリで、上記のヘルパー関数を呼び出す`KoinAppKt.doInitKoin()`関数を呼び出すことができます。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}
```
```