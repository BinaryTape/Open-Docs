---
title: Kotlin Multiplatform - 無共用 UI
---

> 本教學將引導您編寫一個 Android 應用程式，並使用 Koin 依賴注入來取得您的組件。
> 您大約需要 **15 分鐘**來完成本教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 應用程式概覽

此應用程式的理念是管理使用者清單，並使用共用 Presenter 將其顯示在我們的原生 UI 中：

`Users -> UserRepository -> Shared Presenter -> Native UI`

## 「User」資料

> 所有通用/共用程式碼都位於 `shared` Gradle 專案中

我們將管理使用者集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」組件來管理使用者清單（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

## 共用 Koin 模組

使用 `module` 函式來宣告一個 Koin 模組。Koin 模組是我們定義所有要注入之組件的地方。

讓我們宣告我們的第一個組件。我們想要一個 `UserRepository` 的單例 (singleton)，透過建立 `UserRepositoryImpl` 的實例：

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共用 Presenter

讓我們編寫一個 Presenter 組件來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被參考

我們在 Koin 模組中宣告 `UserPresenter`。我們將其宣告為 `factoryOf` 定義，以便不在記憶體中保留任何實例並讓原生系統持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 模組可作為函式執行（此處為 `appModule`），方便從 iOS 端透過 `initKoin()` 函式執行。
:::

## 原生組件

以下原生組件在 Android 和 iOS 中定義：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

兩者都取得本地平台實作。

## 在 Android 中注入

> 整個 Android 應用程式位於 `androidApp` Gradle 專案中

`UserPresenter` 組件將被建立，並隨之解析 `UserRepository` 實例。要將其取得並放入我們的 Activity 中，讓我們使用 `koinInject` compose 函式注入它：

```kotlin
// in App()

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

就這樣，您的應用程式已準備就緒。

:::info
`koinInject()` 函式允許我們在 Android Compose 執行時取得 Koin 實例。
:::

我們需要在我們的 Android 應用程式中啟動 Koin。只需在 compose 應用程式函式 `App` 中呼叫 `KoinApplication()` 函式：

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

我們從共用 KMP 配置中收集 Koin Android 配置：

```kotlin
// Android config
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
我們從 Compose 透過 `LocalContext.current` 取得目前的 Android context。
:::

以及共用 KMP 配置：

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 函式載入給定的模組清單。
:::

## 在 iOS 中注入

> 整個 iOS 應用程式位於 `iosApp` 資料夾中

`UserPresenter` 組件將被建立，並隨之解析 `UserRepository` 實例。要將其取得並放入我們的 `ContentView` 中，我們需要建立一個函式來為 iOS 取得 Koin 依賴項：

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

就這樣，您可以從 iOS 端呼叫 `KoinKt.getUserPresenter().sayHello()` 函式。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

我們需要在我們的 iOS 應用程式中啟動 Koin。在 Kotlin 共用程式碼中，我們可以使用 `initKoin()` 函式進行共用配置。最後，在 iOS 的主要入口中，我們可以呼叫 `KoinAppKt.doInitKoin()` 函式，該函式會呼叫我們上面定義的輔助函式。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}
```