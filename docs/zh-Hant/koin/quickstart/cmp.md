---
title: Compose Multiplatform - 共享 UI
---

> 本教學會教您如何編寫一個 Android 應用程式，並使用 Koin 依賴注入來取得您的組件。
> 您大約需要 __15 分鐘__ 來完成本教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ComposeMultiplatform)
:::

## 應用程式概覽

此應用程式的理念是管理使用者列表，並透過共享的 ViewModel 將其顯示在我們的原生 UI 中：

`Users -> UserRepository -> Shared Presenter -> Compose UI`

## 「使用者」資料

> 所有通用/共享的程式碼都位於 `shared` Gradle 專案中

我們將管理使用者集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」組件來管理使用者列表（新增使用者或按名稱查找）。以下是 `UserRepository` 介面及其實作：

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

## 共享的 Koin 模組

使用 `module` 函數來宣告一個 Koin 模組。Koin 模組是我們定義所有要注入的組件的地方。

讓我們宣告第一個組件。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的實例來實現。

```kotlin
module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 共享的 ViewModel

讓我們編寫一個 ViewModel 組件來顯示使用者：

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

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModelOf` 定義，以便不將任何實例保留在記憶體中，並讓原生系統持有它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

:::note
Koin 模組可作為可執行的函數（此處為 `appModule`），以便從 iOS 端透過 `initKoin()` 函數輕鬆運行。
:::

## 原生組件

以下原生組件在 Android 和 iOS 中定義：

```kotlin
interface Platform {
    val name: String
}

expect fun getPlatform(): Platform
```

兩者都取得本機平台實作

## 在 Compose 中注入

> 所有通用 Compose 應用程式都位於 `composeApp` Gradle 模組的 `commonMain` 中：

`UserViewModel` 組件將會被建立，同時解析其所需的 `UserRepository` 實例。為了在我們的 Activity 中取得它，讓我們使用 `koinViewModel` 或 `koinNavViewModel` Compose 函數來注入它：

```kotlin
@Composable
fun MainScreen() {

    MaterialTheme {

        val userViewModel = koinViewModel<UserViewModel>()
        
        //...
    }
}
```

就這樣，您的應用程式已準備就緒。

我們需要將 Koin 與我們的 Android 應用程式一起啟動。只需在 Compose 應用程式函數 `App` 中呼叫 `KoinApplication()` 函數即可：

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
`modules()` 函數會載入給定的模組列表
:::

## iOS 中的 Compose 應用程式

> 所有 iOS 應用程式都位於 `iosMain` 資料夾中

`MainViewController.kt` 已準備好在 iOS 中啟動 Compose：

```kotlin
// Koin.kt

fun MainViewController() = ComposeUIViewController { App() }
```