---
title: "Ktor & 註解 (Annotations)"
---
> Ktor 是一個框架，用於使用強大的 Kotlin 程式語言在連線系統中構建非同步伺服器和客戶端。 我們將在此處使用 Ktor 來構建一個簡單的 Web 應用程式。

Let's go 🚀

:::note
update - 2024-10-21
:::

## Get the code

:::info
[The source code is available at on Github](https://github.com/InsertKoinIO/koin-getting-started/tree/main/ktor-annotations)
:::

## Gradle 設定

首先，像下面這樣添加 Koin 依賴項（dependency）：

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

## 應用程式概述

該應用程式的想法是管理一個用戶列表，並將其顯示在我們的 `UserApplication` 類別中：

> Users -> UserRepository -> UserService -> UserApplication

## "User" 資料

我們將管理一個 User (用戶) 集合。 這是資料類別：

```kotlin
data class User(val name : String)
```

我們創建一個 "Repository" (儲存庫) 組件來管理用戶列表 (添加用戶或按名稱查找一個)。 下面是 `UserRepository` 介面及其實現：

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

使用 `@Module` 註解，從給定的 Kotlin 類別宣告一個 Koin 模組。 Koin 模組是我們定義所有要注入 (inject) 的組件的地方。

```kotlin
@Module
@ComponentScan("org.koin.sample")
class AppModule
```

`@ComponentScan("org.koin.sample")` 將有助於掃描來自目標包的註解類別。

讓我們宣告我們的第一個組件。 我們想要一個 `UserRepository` 的單例，方法是創建 `UserRepositoryImpl` 的一個實例。 我們使用 `@Single` 標記它

```kotlin
@Single
class UserRepositoryImpl : UserRepository
```

## UserService 組件

讓我們編寫 UserService 組件來請求預設用戶：

```kotlin
class UserService(private val userRepository: UserRepository) {

    fun getDefaultUser() : User = userRepository.findUser(DefaultData.DEFAULT_USER.name) ?: error("Can't find default user")
}
```

> UserRepository 在 UserPresenter 的建構函式中被引用

我們在 Koin 模組中宣告 `UserService`。 我們使用 `@Single` 註解進行標記：

```kotlin
@Single
class UserService(private val userRepository: UserRepository)
```

## HTTP 控制器

最後，我們需要一個 HTTP Controller (控制器) 來創建 HTTP Route (路由)。 在 Ktor 中，它將透過 Ktor 擴展函式 (extension function) 來表示：

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

檢查您的 `application.conf` 是否配置如下，以幫助啟動 `Application.main` 函式：

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

## 啟動和注入

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

透過編寫 `AppModule().module`，我們使用 `AppModule` 類別上生成的擴展。

讓我們啟動 Ktor：

```kotlin
fun main(args: Array<String>) {
    // Start Ktor
    embeddedServer(Netty, commandLineEnvironment(args)).start(wait = true)
}
```

就這樣！ 你已經準備好出發了。 檢查 `http://localhost:8080/hello` 這個網址！