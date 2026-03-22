---
title: Kotlin 與註解
---

> 本教學將引導您編寫 Kotlin 應用程式，並使用帶有註解的 Koin 相依注入來取得您的組件。
> 完成本教學大約需要 **10 分鐘**。

:::note
更新 - 2024-11-12
:::

## 取得程式碼

:::info
[原始碼可在 GitHub 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin-annotations)
:::

## 設定

首先，請檢查 Koin 註解相依性是否已如下所示加入：

```groovy
plugins {
    id("com.google.devtools.ksp") version kspVersion
}

dependencies {
    // 適用於 Kotlin 應用程式的 Koin
    implementation("io.insert-koin:koin-core:$koin_version")

    // Koin 註解
    implementation("io.insert-koin:koin-annotations:$koin_annotations_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_annotations_version")
}
```

## 應用程式概覽

此應用程式的構思是管理使用者清單，並將其顯示在我們的 `UserApplication` 類別中：

> Users -> UserRepository -> UserService -> UserApplication

## 「User」資料

我們將管理一個 User 集合。以下是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個「存儲庫」組件來管理使用者清單（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實作：

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

@Singleton
class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUserOrNull(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users: List<User>) {
        _users.addAll(users)
    }
}
```

:::note
此專案使用 Koin 的 `@Singleton` 註解（來自 `org.koin.core.annotation`）來宣告單例組件。
:::

## Koin 模組

使用 `@Module` 註解來宣告 Koin 模組：

```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule
```

* `@Module` - 將此宣告為 Koin 模組
* `@ComponentScan("org.koin.sample")` - 掃描並註冊來自該套件的受註解類別
* `@Configuration` - 透過 `@KoinApplication` 啟用自動模組發現

讓我們透過加入 `@Singleton` 註解來宣告我們的組件：

```kotlin
@Singleton
class UserRepositoryImpl : UserRepository {
    // ...
}
```

## UserService 組件

讓我們編寫 `UserService` 組件來管理使用者作業：

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

@Singleton
class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    override fun getUserOrNull(name: String): User? = userRepository.findUserOrNull(name)

    override fun loadUsers() {
        userRepository.addUsers(listOf(
            User("Alice", "alice@example.com"),
            User("Bob", "bob@example.com"),
            User("Charlie", "charlie@example.com")
        ))
    }

    override fun prepareHelloMessage(user: User?): String {
        return user?.let { "Hello '${user.name}' (${user.email})! 👋" } ?: "❌ User not found"
    }
}
```

> `UserRepository` 在 `UserServiceImpl` 的建構函式中被引用

我們使用 `@Singleton` 註解來宣告 `UserService`。

## UserApplication

`UserApplication` 類別使用建構函式注入來接收 `UserService`：

```kotlin
@Singleton
class UserApplication(
    private val userService: UserService
) {

    init {
        userService.loadUsers()
    }

    fun sayHello(name: String) {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        println(message)
    }
}
```

:::info
建構函式注入是注入相依性的首選方式。Koin 在建立 `UserApplication` 時會自動解析並注入 `UserService`。
:::

## Koin 應用程式物件

建立一個 `@KoinApplication` 物件，作為 Koin 基於註解配置的入口點：

```kotlin
@KoinApplication
object KoinUserApplication
```

`@KoinApplication` 註解與 KSP 處理器搭配運作，為該物件產生 `startKoin()` 擴充方法。

## 啟動 Koin

我們需要隨應用程式啟動 Koin。只需在應用程式的主要入口點呼叫產生的 `startKoin()` 函式即可：

```kotlin
fun main() {
    KoinUserApplication.startKoin()

    val userApplication = KoinPlatform.getKoin().get<UserApplication>()
    userApplication.sayHello("Alice")
}
```

**關鍵點：**
* `KoinUserApplication.startKoin()` - 自動發現並載入所有模組的產生成式函式
* 無須手動呼叫 `modules()` - 所有受註解的相依性都會在編譯期被發現！
* 我們使用 `KoinPlatform.getKoin().get<UserApplication>()` 從 Koin 取得 `UserApplication` 執行個體

:::info
模組上的 `@KoinApplication` 註解搭配 `@Configuration`，可透過 KSP 在編譯期自動發現並載入所有受註解的相依性。
:::

## 註解 vs 編譯器外掛程式 DSL

以下是我們基於註解的配置與編譯器外掛程式 DSL 的比較：

**使用註解：**
```kotlin
@Module
@ComponentScan("org.koin.sample")
@Configuration
class AppModule

@Singleton
class UserApplication(private val userService: UserService)

@Singleton
class UserRepositoryImpl : UserRepository

@Singleton
class UserServiceImpl(private val userRepository: UserRepository) : UserService
```

**編譯器外掛程式 DSL（來自 kotlin.md）：**
```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

兩種方法都能達到相同的結果：
- **註解**：透過 KSP 進行編譯期驗證、自動模組發現
- **編譯器外掛程式 DSL**：在編譯期進行自動裝配、更簡潔的 `single<T>()` 語法