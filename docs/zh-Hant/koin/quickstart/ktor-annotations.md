---
title: Ktor 與註解
---

> Ktor 是一個用於使用強大 Kotlin 程式語言，在連線系統中建構非同步伺服器與客戶端的框架。我們將在此處使用 Ktor 來建構一個簡單的網路應用程式。

開始吧 🚀

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 設定

首先，新增 Koin 依賴項，如下所示：

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // Koin for Kotlin apps
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 應用程式概觀

此應用程式的理念是管理使用者列表，並在我們的 `UserApplication` 類別中顯示它：

> Users -> UserRepository -> UserService -> UserApplication

## 「使用者」資料

我們將管理一系列使用者。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「儲存庫 (Repository)」元件來管理使用者列表（新增使用者或依名稱尋找使用者）。以下是 `UserRepository` 介面及其實作：

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

使用 `@Module` 註解從給定的 Kotlin 類別宣告一個 Koin 模組。Koin 模組是我們定義所有要注入之元件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")` 將有助於掃描目標套件中帶有註解的類別。

讓我們宣告第一個元件。我們希望透過建立 `UserRepositoryImpl` 的實例來取得 `UserRepository` 的單例 (singleton)。我們將其標記為 `@Single`。

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserService 元件

讓我們編寫 UserService 元件來請求預設使用者：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被引用。

我們在 Koin 模組中宣告 `UserService`。我們使用 `@Single` 註解標記它：

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 控制器

最後，我們需要一個 HTTP 控制器來建立 HTTP 路由 (Route)。在 Ktor 中，這將透過 Ktor 擴充函數來表達：

```kotlin
fun Application.main() {

    // Lazy inject HelloService
    val service by inject<UserService>()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

請確認您的 `application.conf` 已配置如下，以幫助啟動 `Application.main` 函數：

```kotlin
ktor {
    deployment {
        port = 8080

        // For dev purpose
        //autoreload = true
        //watch = [org.koin.sample]
    }

    application {
        modules = [ org.koin.sample.UserApplicationKt.main ]
    }
}
```

## 啟動與注入

最後，讓我們從 Ktor 啟動 Koin：

```kotlin
fun Application.main() {
    install(Koin) {
        slf4jLogger()
        modules(AppModule().module)
    }

    // Lazy inject HelloService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // Routing section
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

透過編寫 `AppModule().module`，我們使用了 `AppModule` 類別上的一個生成擴充功能。

讓我們啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就這樣！您已經準備就緒。請檢查 `http://localhost:8080/hello` 網址！