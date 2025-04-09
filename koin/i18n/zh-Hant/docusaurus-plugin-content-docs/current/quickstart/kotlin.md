---
title: Kotlin
---
> 本教學將引導您撰寫一個 Kotlin 應用程式，並使用 Koin 依賴注入（Dependency Injection）來取得您的元件（Component）。
> 完成本教學約需 __10 分鐘__。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## 設定（Setup）

首先，確認 `koin-core` 依賴（Dependency）已如下方範例新增：

```groovy
dependencies {
    
    // Koin for Kotlin apps
    compile "io.insert-koin:koin-core:$koin_version"
}
```

## 應用程式概觀（Application Overview）

此應用程式的構想是管理使用者（User）列表，並在我們的 `UserApplication` 類別中顯示：

> Users -> UserRepository -> UserService -> UserApplication

## "User" 資料

我們將管理一個使用者（User）集合。以下是資料類別（Data Class）：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 元件（Component）來管理使用者（User）列表（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面（Interface）及其實現（Implementation）：

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

## Koin 模組（Module）

使用 `module` 函數來宣告 Koin 模組。 Koin 模組是我們定義所有要注入（Inject）的元件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告我們的第一個元件（Component）。我們希望 `UserRepository` 是一個單例（Singleton），透過建立 `UserRepositoryImpl` 的一個實例（Instance）：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
}
```

## UserService 元件（Component）

讓我們編寫 UserService 元件（Component）來請求預設使用者（Default User）：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepository 在 UserPresenter 的建構子（Constructor）中被引用

我們在 Koin 模組中宣告 `UserService`。 我們將其宣告為 `single` 定義（Definition）：

```kotlin
val appModule = module {
     single<UserRepository> { UserRepositoryImpl() }
     single { UserService(get()) }
}
```

> `get()` 函數允許要求 Koin 解析（Resolve）所需的依賴（Dependency）。

## 在 UserApplication 中注入依賴（Injecting Dependencies）

`UserApplication` 類別將協助從 Koin 中啟動實例（Bootstrap Instance）。 它將解析（Resolve） `UserService`，這要歸功於 `KoinComponent` 介面（Interface）。 這允許使用 `by inject()` 委派函數（Delegate Function）注入它：

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

這樣就完成了，您的應用程式已準備就緒。

:::info
`by inject()` 函數允許我們在任何繼承 `KoinComponent` 的類別中檢索 Koin 實例（Instance）
:::

## 啟動 Koin（Start Koin）

我們需要使用我們的應用程式啟動 Koin。 只需在應用程式的主要入口點（Entry Point），也就是我們的 `main` 函數中呼叫 `startKoin()` 函數：

```kotlin
fun main() {
    startKoin {
        modules(appModule)
    }

    UserApplication().sayHello()
}
```

:::info
`startKoin` 中的 `modules()` 函數載入給定的模組（Module）列表
:::

## Koin 模組：經典或建構子 DSL？（Koin module: classic or constructor DSL?）

以下是我們的應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single { UserService(get()) }
}
```

我們可以透過使用建構子（Constructor）以更緊湊的方式編寫它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    singleOf(::UserService)
}
```