---
title: Kotlin
---

> 本教學讓您撰寫一個 Kotlin 應用程式，並使用 Koin 依賴注入 (dependency injection) 來取得您的元件。
> 您大約需要 __10 分鐘__來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 設定

首先，請確認 `koin-core` 依賴項已依下方所示加入：

```groovy
dependencies {
    
    // Koin for Kotlin apps
    compile "io.insert-koin:koin-core:$koin_version"
}
```

## 應用程式概覽

此應用程式的理念是管理使用者清單，並在我們的 `UserApplication` 類別中顯示它：

> Users -> UserRepository -> UserService -> UserApplication

## 「使用者」資料

我們將管理使用者集合。以下是資料類別： 

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」元件以管理使用者清單 (新增使用者或依名稱尋找使用者)。下方是 `UserRepository` 介面及其實作：

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

## Koin 模組

使用 `module` 函數來宣告一個 Koin 模組。Koin 模組是我們定義所有要注入之元件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告第一個元件。我們需要一個 `UserRepository` 的單例 (singleton)，透過建立 `UserRepositoryImpl` 的實例 (instance)。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserService 元件

讓我們編寫 `UserService` 元件以請求預設使用者：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式 (constructor) 中被引用。

我們在 Koin 模組中宣告 `UserService`。我們將其宣告為 `single` 定義：

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 函數允許請求 Koin 解析所需的依賴項。

## 在 UserApplication 中注入依賴項

`UserApplication` 類別將有助於從 Koin 引導實例。它將解析 `UserService`，歸功於 `KoinComponent` 介面。這允許透過 `by inject()` 委託函數來注入它： 

```kotlin
class UserApplication : KoinComponent {

    private val userService : UserService by inject()

    // display our data
    fun sayHello(){
        val user = userService.getDefaultUser()
        val message = "Hello '$user'!"
        println(message)
    }
}
```

就是這樣，您的應用程式已準備就緒。

:::info
`by inject()` 函數允許我們在任何延伸 `KoinComponent` 的類別中取得 Koin 實例。
:::

## 啟動 Koin

我們需要與應用程式一起啟動 Koin。只需在應用程式的主要入口點，我們的 `main` 函數中呼叫 `startKoin()` 函數即可：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin` 中的 `modules()` 函數會載入給定的模組清單。
:::

## Koin 模組：經典 (classic) 模式還是建構函式 DSL (constructor DSL)？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

我們可以透過使用建構函式以更精簡的方式來編寫它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```