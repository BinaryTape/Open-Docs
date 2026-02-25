---
title: Kotlin Multiplatform - 無共享 UI
---

> 本教學將引導您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 __15 分鐘__ 來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可於 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 應用程式概覽

此應用程式的構想是管理使用者列表，並透過共享的 Presenter 在原生 UI 中顯示：

`Users -> UserRepository -> Shared Presenter -> 原生 UI`

## 「User」資料

> 所有的共通／共享程式碼皆位於 `shared` Gradle 專案中

我們將管理一個 User 集合。以下是資料類別： 

```kotlin
data class User(val name : String)
```

我們建立了一個「Repository」組建來管理使用者列表（新增使用者或按名稱查找）。以下是 `UserRepository` 介面及其實作：

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

## 共享 Koin 模組

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要被注入的組建的地方。

讓我們宣告第一個組建。我們想要一個 `UserRepository` 的單例（singleton），透過建立 `UserRepositoryImpl` 的執行個體來實現：

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共享 Presenter

讓我們編寫一個 Presenter 組建來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被參照

我們在 Koin 模組中宣告 `UserPresenter`。我們將其宣告為 `factoryOf` 定義，以便不在記憶體中保留任何執行個體，並讓原生系統持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 模組可作為可執行的函式（此處為 `appModule`），以便透過 `initKoin()` 函式輕鬆地從 iOS 端執行。 
:::

## 原生組建

以下原生組建定義於 Android 和 iOS 中：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

兩者皆取得本地平台實作

## 在 Android 中注入

> 所有的 Android 應用程式皆位於 `androidApp` Gradle 專案中

`UserPresenter` 組建將被建立，並隨之解析 `UserRepository` 執行個體。若要在我們的 Activity 中取得它，讓我們使用 `koinInject` Compose 函式來注入： 

```kotlin
// 在 App() 中

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

就這樣，您的應用程式已準備就緒。

:::info
`koinInject()` 函式讓我們能在 Android Compose 執行階段中擷取 Koin 執行個體
:::

我們需要在 Android 應用程式中啟動 Koin。只需在 Compose 應用程式函式 `App` 中呼叫 `KoinApplication()` 函式即可：

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

我們從共享的 KMP 配置中收集 Koin Android 配置：

```kotlin
// Android 配置
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
我們透過 `LocalContext.current` 從 Compose 取得目前的 Android context
:::

以及共享的 KMP 配置：

```kotlin
// 共通配置
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 函式會載入指定的模組列表
:::

## 在 iOS 中注入

> 所有的 iOS 應用程式皆位於 `iosApp` 資料夾中

`UserPresenter` 組建將被建立，並隨之解析 `UserRepository` 執行個體。若要在我們的 `ContentView` 中取得它，我們需要建立一個函式來為 iOS 擷取 Koin 相依性： 

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

就這樣，您可以直接從 iOS 部分呼叫 `KoinKt.getUserPresenter().sayHello()` 函式。 

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

我們需要在 iOS 應用程式中啟動 Koin。在 Kotlin 共享程式碼中，我們可以使用 `initKoin()` 函式來使用共享配置。 
最後在 iOS 主要進入點中，我們可以呼叫 `KoinAppKt.doInitKoin()` 函式，該函式會呼叫上述的幫助程式函式。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}