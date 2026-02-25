---
title: Kotlin
---

> 本教學將引導您編寫 Kotlin 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 **10 分鐘** 來完成本教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼已發佈於 Github](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 設定

首先，檢查是否已如下所示添加了 `koin-core` 相依性：

```groovy
dependencies {
    
    // 適用於 Kotlin 應用程式的 Koin
    implementation "io.insert-koin:koin-core:$koin_version"
}
```

## 應用程式概覽

此應用程式的概念是管理使用者清單，並將其顯示在我們的 `UserApplication` 類別中：

> Users -> UserRepository -> UserService -> UserApplication

## "User" 資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 組建來管理使用者清單（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有待注入組建的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告第一個組建。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的執行個體來實現：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserService 組建

讓我們編寫 `UserService` 組建來請求預設使用者：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被參照

我們在 Koin 模組中宣告 `UserService`。我們將其宣告為 `single` 定義：

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 函式允許向 Koin 請求解析所需的相依性。

## 在 UserApplication 中注入相依性

`UserApplication` 類別將協助從 Koin 引導執行個體。得益於 `KoinComponent` 介面，它將解析 `UserService`。這允許透過 `by inject()` 委派函式進行注入：

```kotlin
class UserApplication : KoinComponent {

    private val userService : UserService by inject()

    // 顯示我們的資料
    fun sayHello(){
        val user = userService.getDefaultUser()
        val message = "Hello '$user'!"
        println(message)
    }
}
```

就這樣，您的應用程式已準備就緒。

:::info
`by inject()` 函式讓我們能在任何擴充 `KoinComponent` 的類別中取得 Koin 執行個體。
:::

## 啟動 Koin

我們需要在應用程式中啟動 Koin。只需在應用程式的主要入口點（即我們的 `main` 函式）中呼叫 `startKoin()` 函式：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin` 中的 `modules()` 函式會載入指定的模組列表。
:::

## Koin 模組：傳統方式或建構函式 DSL？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

我們可以使用建構函式以更精簡的方式編寫它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}