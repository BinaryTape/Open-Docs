---
title: KMP 進階模式
---

# KMP 進階模式

本指南涵蓋了 Koin 在 Kotlin Multiplatform 專案中的進階模式。

:::info
關於基本設定，請參閱 [KMP 設定](/docs/reference/koin-core/kmp-setup)。關於模組組織，請參閱 [共享模式](/docs/reference/koin-core/kmp-shared-modules)。關於 ViewModel，請參閱 [ViewModel](/docs/reference/koin-core/viewmodel)。
:::

## 來源專案

:::info
您可以在此處找到 Kotlin Multiplatform 專案：https://github.com/InsertKoinIO/hello-kmp
:::

## 進階 expect/actual 模式

除了基本的 `expect val platformModule: Module` 模式之外，以下是處理平台相關程式碼的進階方法。

### 模式 1：expect/actual 類別

當您需要平台特定的 API（Android `Context`、iOS `UIDevice` 等）時使用：

```kotlin
// commonMain - 宣告
expect class PlatformContext

expect fun createPlatformModule(): Module

// androidMain - Android 實作
actual class PlatformContext(val context: Context)

actual fun createPlatformModule() = module {
    single<PlatformContext>()  // 編譯器外掛程式 DSL
}

// iosMain - iOS 實作
actual class PlatformContext

actual fun createPlatformModule() = module {
    single<PlatformContext>()
}
```

### 模式 2：介面 + 平台實作

當您想為每個平台注入不同的實作時使用：

```kotlin
// commonMain - 介面
interface Logger {
    fun log(message: String)
}

// androidMain
class AndroidLogger : Logger {
    override fun log(message: String) {
        android.util.Log.d("App", message)
    }
}

val androidModule = module {
    single<AndroidLogger>() bind Logger::class
}

// iosMain
class IOSLogger : Logger {
    override fun log(message: String) {
        println("iOS: $message")
    }
}

val iosModule = module {
    single<IOSLogger>() bind Logger::class
}
```

### 模式 3：帶有註解的 expect 模組

將 `expect`/`actual` 與註解結合使用，使程式碼更簡潔：

```kotlin
// commonMain
expect val platformModule: Module

// androidMain
@Module
@ComponentScan("com.myapp.android")
class AndroidPlatformModule

actual val platformModule = AndroidPlatformModule().module

// iosMain
@Module
@ComponentScan("com.myapp.ios")
class IosPlatformModule

actual val platformModule = IosPlatformModule().module
```

:::info
**何時使用哪種模式：**
- **expect/actual 類別**：平台 API（`Context`、`UIDevice`）、簡單的平台差異。
- **介面**：隨平台變化的商務邏輯、可測試的程式碼。
- **expect 模組**：複雜的平台相關相依圖。
:::

## 共享程式碼中的 Android Context

在共享程式碼中存取 Android `Context` 是一個常見需求。以下是推薦的模式：

### ContextWrapper 模式

```kotlin
// commonMain - 包裝器介面
interface AppContext

// androidMain - Android 實作
class AndroidAppContext(val context: Context) : AppContext

val androidContextModule = module {
    single<AndroidAppContext>() bind AppContext::class
}

// iosMain - 空實作
class IOSAppContext : AppContext

val iosContextModule = module {
    single<IOSAppContext>() bind AppContext::class
}
```

在共享程式碼中的用法：

```kotlin
// commonMain - Repository 使用平台 context
class FileRepository(private val appContext: AppContext) {
    fun saveFile(data: String) {
        when (appContext) {
            is AndroidAppContext -> {
                val file = File(appContext.context.filesDir, "data.txt")
                file.writeText(data)
            }
            is IOSAppContext -> {
                // iOS 特有的檔案操作
            }
        }
    }
}

val sharedModule = module {
    single<FileRepository>()
}
```

:::note
對於純粹的共享邏輯，建議將平台操作抽象化為介面，而不是使用 `when` 陳述式。
:::

## 架構模式

### 搭配 Ktor 的 Repository 模式

```kotlin
// commonMain
interface UserRepository {
    suspend fun getUser(id: String): User
    suspend fun saveUser(user: User)
}

@Singleton
class UserRepositoryImpl(
    private val api: UserApi,
    private val database: UserDatabase
) : UserRepository {
    override suspend fun getUser(id: String): User {
        return try {
            api.fetchUser(id).also { database.saveUser(it) }
        } catch (e: Exception) {
            database.getUser(id)
        }
    }

    override suspend fun saveUser(user: User) {
        database.saveUser(user)
        api.updateUser(user)
    }
}

val dataModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

### 網路層 (Ktor + Koin)

```kotlin
// commonMain
@Singleton
class ApiClient(private val client: HttpClient) {
    suspend fun fetchUser(id: String): User {
        return client.get("https://api.example.com/users/$id").body()
    }
}

val networkModule = module {
    single {
        HttpClient {
            install(ContentNegotiation) {
                json()
            }
        }
    }
    single<ApiClient>()
}
```

### 資料庫層 (SqlDelight)

```kotlin
// commonMain
expect class DriverFactory {
    fun createDriver(): SqlDriver
}

val databaseModule = module {
    single { DriverFactory().createDriver() }
    single { AppDatabase(get()) }
    single { get<AppDatabase>().userQueries }
}

// androidMain
actual class DriverFactory(private val context: Context) {
    actual fun createDriver(): SqlDriver {
        return AndroidSqliteDriver(AppDatabase.Schema, context, "app.db")
    }
}

// iosMain
actual class DriverFactory {
    actual fun createDriver(): SqlDriver {
        return NativeSqliteDriver(AppDatabase.Schema, "app.db")
    }
}
```

## 測試 KMP 模組

### 單元測試共享模組

```kotlin
// commonTest
class UserRepositoryTest : KoinTest {

    @Test
    fun testGetUser() = runTest {
        startKoin {
            modules(module {
                single<UserApi> { FakeUserApi() }
                single<UserDatabase> { FakeUserDatabase() }
                single<UserRepositoryImpl>() bind UserRepository::class
            })
        }

        val repository: UserRepository = get()
        val user = repository.getUser("123")

        assertEquals("John", user.name)

        stopKoin()
    }
}
```

### 使用平台相關相依性進行測試

```kotlin
// commonTest
expect fun createTestPlatformModule(): Module

// androidTest
actual fun createTestPlatformModule() = module {
    single<PlatformContext> { TestAndroidContext() }
}

// iosTest
actual fun createTestPlatformModule() = module {
    single<PlatformContext> { TestIOSContext() }
}

// commonTest - 使用平台模組進行測試
class PlatformDependentTest : KoinTest {
    @Test
    fun testWithPlatformContext() {
        startKoin {
            modules(
                createTestPlatformModule(),
                module {
                    single<MyService>()
                }
            )
        }

        val service: MyService = get()
        // 測試服務

        stopKoin()
    }
}
```

## 常見陷阱

### 應該 (DO)：為可測試的共享程式碼使用介面

```kotlin
// 良好 - 可測試
interface Logger {
    fun log(message: String)
}

val sharedModule = module {
    single<UserService>()  // 相依於 Logger 介面
}
```

### 不該 (DON'T)：為商務邏輯使用 expect 類別

```kotlin
// 不良 - 難以測試，與平台高度耦合
expect class Logger {
    fun log(message: String)
}
```

### 應該 (DO)：保持平台模組獨立

```kotlin
// 良好 - 清晰分離
fun initKoin() {
    startKoin {
        modules(commonModules() + platformModule)
    }
}
```

### 不該 (DON'T)：在共享模組中混入平台特有程式碼

```kotlin
// 不良 - 在 commonMain 中包含平台特有程式碼
val sharedModule = module {
    single {
        if (Platform.isAndroid) { /* ... */ } // 不要這樣做！
    }
}
```

### 應該 (DO)：為大型應用程式使用延遲載入模組

```kotlin
// 良好 - 優化啟動速度
val lazyFeatureModule = lazyModule {
    single<HeavyService>()
}

startKoin {
    modules(coreModules)
    lazyModules(lazyFeatureModule)
}
```

### 不該 (DON'T)：忘記關閉作用域 (scope)

```kotlin
// 不良 - 記憶體洩漏
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()
    // 忘記關閉作用域！
}

// 良好 - 正確清理
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()

    fun onDestroy() {
        scope.close()
    }
}
```

## 桌面平台整合

對於 JVM 桌面應用程式 (Compose Desktop)：

```kotlin
// desktopMain
fun main() = application {
    startKoin {
        modules(
            sharedModule,
            desktopModule
        )
    }

    Window(onCloseRequest = ::exitApplication) {
        App()
    }
}

val desktopModule = module {
    single<DesktopLogger>() bind Logger::class
    single<DesktopFileManager>()
}
```

## Web 平台整合（實驗性）

對於 Kotlin/JS 和 Kotlin/WASM：

```kotlin
// jsMain 或 wasmJsMain
fun main() {
    startKoin {
        modules(
            sharedModule,
            webModule
        )
    }
    // 您的 Web 應用程式初始化
}

val webModule = module {
    single<ConsoleLogger>() bind Logger::class
    single<BrowserStorage>()
}
```

:::warning
WASM 支援目前處於實驗性階段。某些功能可能無法如預期運作。
:::

## iOS Swift 互通性

### 供 Swift 使用的 KoinComponent

```kotlin
// shared/src/iosMain/kotlin/Helper.kt
class GreetingHelper : KoinComponent {
    private val greeting: Greeting by inject()
    fun greet(): String = greeting.greeting()
}
```

在 Swift 中：

```swift
struct ContentView: View {
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### 執行緒考量

在 iOS 和其他 Native 目標上，Koin 執行個體可以無縫配合新的記憶體模型運作：

- Koin 定義是執行緒安全的
- 作用域 (scope) 可以跨執行緒建立和使用
- 如果需要，請為全域 Koin 執行個體使用 `@SharedImmutable`

:::note
新的 Kotlin/Native 記憶體模型（Kotlin 1.7.20+ 的預設值）使 Koin 的使用變得更加簡單。
:::

## 後續步驟

- **[KMP 設定](/docs/reference/koin-core/kmp-setup)** - 基本 KMP 組態
- **[共享模式](/docs/reference/koin-core/kmp-shared-modules)** - 模組組織
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 多平台 ViewModel
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose 整合
- **[註解 KMP](/docs/reference/koin-annotations/kmp)** - KMP 中基於註解的相依注入 (DI)