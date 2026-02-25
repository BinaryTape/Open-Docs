---
title: Compose Multiplatform - 共用 UI
---

> 此教學將引導您撰寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組件。
> 完成此教學大約需要 **15 分鐘**。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## 應用程式總覽

此應用程式的構想是管理使用者列表，並透過共用的 ViewModel 將其顯示在原生 UI 中：

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## 「User」資料

> 所有通用／共用程式碼皆位於 `shared` Gradle 專案中

我們將管理 User 的集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」組建來管理使用者列表（新增使用者或依名稱尋找）。下方為 `UserRepository` 介面及其實作：

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入之組建的地方。

讓我們宣告第一個組建。我們希望透過建立 `UserRepositoryImpl` 的執行個體來取得 `UserRepository` 的單例：

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共用 ViewModel

讓我們撰寫一個 ViewModel 組建來顯示使用者：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        val platform = getPlatform()
        return foundUser?.let { "Hello '$it' from ${platform.name}" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被引用

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModelOf` 定義，以便不將任何執行個體保留在記憶體中，並讓原生系統持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
Koin 模組以可執行的函式形式提供（此處為 `appModule`），以便透過 `initKoin()` 函式從 iOS 端輕鬆執行。
:::

## 原生組件

以下原生組建定義於 Android 與 iOS 中：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

兩者皆取得當地平台實作

## 在 Compose 中進行注入

> 所有通用 Compose 應用程式皆位於 `composeApp` Gradle 模組的 `commonMain` 中：

`UserViewModel` 組建將被建立，並隨之解析 `UserRepository` 執行個體。若要在 Activity 中取得它，讓我們使用 `koinViewModel` 或 `koinNavViewModel` 的 Compose 函式來進行注入：

```kotlin
@Composable
fun MainScreen() {

    MaterialTheme {

        val userViewModel = koinViewModel<UserViewModel>()
        
        //...
    }
}
```

就是這樣，您的應用程式已準備就緒。

我們需要在 Android 應用程式中啟動 Koin。只需在 Compose 應用程式函式 `App` 中呼叫 `KoinApplication()` 函式即可：

```kotlin
fun App() {
    
    KoinApplication(
        application = {
            modules(appModule)
        }
    )
{
// Compose content
}
}
```

:::info
`modules()` 函式會載入指定的模組列表
:::

## iOS 中的 Compose 應用程式

> 所有 iOS 應用程式皆位於 `iosMain` 資料夾中

`MainViewController.kt` 已準備好啟動 iOS 版 Compose：

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }