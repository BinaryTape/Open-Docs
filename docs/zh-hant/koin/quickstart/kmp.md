---
title: "Kotlin Multiplatform - 無共用 UI (No shared UI)"
---
> 本教學課程將引導您撰寫一個 Android 應用程式，並使用 Koin 依賴注入（dependency injection）來檢索您的元件。
> 完成本教學課程大約需要 __15 分鐘__。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始程式碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/KotlinMultiplatform)
:::

## 應用程式概觀（Application Overview）

此應用程式的想法是管理一個使用者列表，並使用共享的 Presenter 在我們的原生 UI 中顯示它：

`Users -> UserRepository -> Shared Presenter -> Native UI`

## "User" 資料

> 所有 common/shared 程式碼都位於 `shared` Gradle 專案中

我們將管理一個 Users 集合。以下是資料類別（data class）：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 元件來管理使用者列表（新增使用者或按名稱查找使用者）。以下是 `UserRepository` 介面及其實現：

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

## 共享的 Koin 模組（Shared Koin module）

使用 `module` 函數來宣告 Koin 模組。 Koin 模組是我們定義所有要注入的元件的地方。

讓我們宣告我們的第一個元件。我們想要一個 `UserRepository` 的 singleton（單例），透過建立一個 `UserRepositoryImpl` 的實例：

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共享的 Presenter

讓我們編寫一個 presenter 元件來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserPresenter 的建構函式（constructor）中被引用

我們在 Koin 模組中宣告 `UserPresenter` 。我們將它宣告為 `factoryOf` 定義，以不在記憶體中保留任何實例，並讓原生系統持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

:::note
Koin 模組可用作要執行的函數（此處為 `appModule` ），以便可以輕鬆地從 iOS 端使用 `initKoin()` 函數執行。
:::

## 原生元件（Native Component）

以下原生元件在 Android 和 iOS 中定義：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

兩者都取得本機平台實現（local platform implementation）

## 在 Android 中注入（Injecting in Android）

> 所有 Android 應用程式都位於 `androidApp` Gradle 專案中

將會建立 `UserPresenter` 元件，並使用它來解析 `UserRepository` 實例。為了將它放入我們的 Activity 中，讓我們使用 `koinInject` compose 函數注入它：

```kotlin
// in App()

val greeting = koinInject<UserPresenter>().sayHello("Koin")

Column(Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
    Image(painterResource(Res.drawable.compose_multiplatform), null)
    Text("Compose: $greeting")
}
```

這樣就完成了，您的應用程式已準備就緒。

:::info
`koinInject()` 函數允許我們在 Android Compose 執行時（runtime）檢索 Koin 實例
:::

我們需要使用我們的 Android 應用程式啟動 Koin。只需在 compose 應用程式函數 `App` 中呼叫 `KoinApplication()` 函數：

```kotlin
fun App() {
    
    KoinApplication(application = koinAndroidConfiguration(LocalContext.current)){
        // ...
    }
}
```

我們從共享的 KMP 配置（configuration）收集 Koin android 配置：

```kotlin
// Android config
fun koinAndroidConfiguration(context: Context) : KoinAppDeclaration = {
    androidContext(context)
    androidLogger()
    koinSharedConfiguration()
}
```

:::note
我們使用 `LocalContext.current` 從 Compose 取得目前的 Android context
:::

以及共享的 KMP config：

```kotlin
// Common config
fun koinSharedConfiguration() : KoinAppDeclaration = {
    modules(appModule)
}
```

:::info
`modules()` 函數載入給定的模組列表
:::

## 在 iOS 中注入

> 所有 iOS 應用程式都位於 `iosApp` 資料夾中

將會建立 `UserPresenter` 元件，並使用它來解析 `UserRepository` 實例。為了將它放入我們的 `ContentView` 中，我們需要建立一個函數來檢索 iOS 的 Koin 依賴項：

```kotlin
// Koin.kt

fun getUserPresenter() : UserPresenter = KoinPlatform.getKoin().get()
```

這樣就完成了，您可以從 iOS 部分呼叫 `KoinKt.getUserPresenter().sayHello()` 函數。

```swift
import Shared

struct ContentView: View {

    // ...
    let greet = KoinKt.getUserPresenter().sayHello(name: "Koin")
}
```

我們需要使用我們的 iOS 應用程式啟動 Koin。在 Kotlin 共享程式碼中，我們可以使用帶有 `initKoin()` 函數的共享配置。
最後，在 iOS 主入口點中，我們可以呼叫 `KoinAppKt.doInitKoin()` 函數，該函數正在呼叫我們上面的輔助函數。

```swift
@main
struct iOSApp: App {
    
    init() {
        KoinAppKt.doInitKoin()
    }

    //...
}
```