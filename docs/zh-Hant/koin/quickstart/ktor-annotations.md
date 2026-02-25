---
title: Ktor 與註解
---

> Ktor 是一個使用強大的 Kotlin 程式語言，在連網系統中建置非同步伺服器和用戶端的架構。我們將在此使用 Ktor 來建置一個簡單的 Web 應用程式。

出發吧 🚀

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可以在 GitHub 上找到](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 設定

首先，如下所示加入 Koin 相依性：

```kotlin
plugins {

    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // 適用於 Kotlin 應用程式的 Koin
    implementation("io.insert-koin:koin-ktor:$koin_version")
    implementation("io.insert-koin:koin-logger-slf4j:$koin_version")

    implementation("io.insert-koin:koin-annotations:$koinAnnotationsVersion")
    ksp("io.insert-koin:koin-ksp-compiler:$koinAnnotationsVersion")
}
```

## 應用程式概覽

此應用程式的想法是管理使用者列表，並將其顯示在我們的 `UserApplication` 類別中：

> Users -> UserRepository -> UserService -> UserApplication

## 「User」資料

我們將管理一個使用者集合。這是資料類別： 

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」組件來管理使用者列表（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

使用 `@Module` 註解從指定的 Kotlin 類別宣告 Koin 模組。Koin 模組是我們定義所有要被注入的組件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")` 將協助掃描目標套件中帶有註解的類別。

讓我們宣告第一個組件。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的執行個體。我們將其標記為 `@Single`。

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserService 組件

讓我們撰寫 `UserService` 組件來請求預設使用者：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被引用

我們在 Koin 模組中宣告 `UserService`。我們使用 `@Single` 註解進行標記：

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 控制器

最後，我們需要一個 HTTP 控制器來建立 HTTP 路由。在 Ktor 中，這將透過一個 Ktor 擴充函式來表示：

```kotlin
fun Application.main() {

    // 延遲注入 UserService
    val service by inject<UserService>()

    // 路由區段
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

檢查您的 `application.conf` 配置如下，以協助啟動 `Application.main` 函式：

```kotlin
ktor {
    deployment {
        port = 8080

        // 開發用途
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

    // 延遲注入 UserService
    val service by inject<UserService>()
    service.saveDefaultUsers()

    // 路由區段
    routing {
        get("/hello") {
            call.respondText(service.sayHello())
        }
    }
}
```

透過撰寫 `AppModule().module`，我們使用了一個在 `AppModule` 類別上產生的擴充功能。

讓我們啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    // 啟動 Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就這樣！您已經準備就緒。請查看 `http://localhost:8080/hello` 網址！