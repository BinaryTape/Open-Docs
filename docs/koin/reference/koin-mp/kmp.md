---
title: KMP 高级模式
---

# KMP 高级模式

本指南涵盖了 Kotlin Multiplatform 项目中 Koin 的高级模式。

:::info
有关基础设置，请参阅 [KMP 设置](/docs/reference/koin-core/kmp-setup)。有关模块组织，请参阅 [共享模式](/docs/reference/koin-core/kmp-shared-modules)。有关 ViewModel，请参阅 [ViewModel](/docs/reference/koin-core/viewmodel)。
:::

## 源码项目

:::info
您可以在这里找到 Kotlin Multiplatform 项目：https://github.com/InsertKoinIO/hello-kmp
:::

## 高级 expect/actual 模式

除了基础的 `expect val platformModule: Module` 模式之外，以下是处理平台特定代码的高级方法。

### 模式 1：expect/actual 类

当您需要平台特定 API（如 Android Context、iOS UIDevice 等）时使用：

```kotlin
// commonMain - 声明
expect class PlatformContext

expect fun createPlatformModule(): Module

// androidMain - Android 实现
actual class PlatformContext(val context: Context)

actual fun createPlatformModule() = module {
    single<PlatformContext>()  // 编译器插件 DSL
}

// iosMain - iOS 实现
actual class PlatformContext

actual fun createPlatformModule() = module {
    single<PlatformContext>()
}
```

### 模式 2：接口 + 平台实现

当您想为每个平台注入不同的实现时使用：

```kotlin
// commonMain - 接口
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

### 模式 3：带注解的 expect 模块

将 expect/actual 与注解结合使用，使代码更整洁：

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
**如何选择模式：**
- **expect/actual 类**：适用于平台 API（Context、UIDevice）和简单的平台差异。
- **接口**：适用于因平台而异的业务逻辑和可测试的代码。
- **expect 模块**：适用于复杂的平台特定依赖关系图。
:::

## 共享代码中的 Android Context

在共享代码中访问 Android `Context` 是一个常见的需求。以下是推荐的模式：

### ContextWrapper 模式

```kotlin
// commonMain - 包装器接口
interface AppContext

// androidMain - Android 实现
class AndroidAppContext(val context: Context) : AppContext

val androidContextModule = module {
    single<AndroidAppContext>() bind AppContext::class
}

// iosMain - 空实现
class IOSAppContext : AppContext

val iosContextModule = module {
    single<IOSAppContext>() bind AppContext::class
}
```

在共享代码中使用：

```kotlin
// commonMain - 仓库使用平台上下文
class FileRepository(private val appContext: AppContext) {
    fun saveFile(data: String) {
        when (appContext) {
            is AndroidAppContext -> {
                val file = File(appContext.context.filesDir, "data.txt")
                file.writeText(data)
            }
            is IOSAppContext -> {
                // iOS 特定的文件操作
            }
        }
    }
}

val sharedModule = module {
    single<FileRepository>()
}
```

:::note
对于纯共享逻辑，首选将平台操作抽象为接口，而不是使用 `when` 语句。
:::

## 架构模式

### 结合 Ktor 的仓库模式

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

### 网络层 (Ktor + Koin)

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

### 数据库层 (SqlDelight)

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

## 测试 KMP 模块

### 单元测试共享模块

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

### 测试平台特定依赖项

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

// commonTest - 使用平台模块进行测试
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
        // 测试服务

        stopKoin()
    }
}
```

## 常见陷阱

### 推荐 (DO)：为可测试的共享代码使用接口

```kotlin
// 推荐 - 可测试
interface Logger {
    fun log(message: String)
}

val sharedModule = module {
    single<UserService>()  // 依赖于 Logger 接口
}
```

### 避免 (DON'T)：为业务逻辑使用 expect 类

```kotlin
// 避免 - 难以测试，与平台耦合紧密
expect class Logger {
    fun log(message: String)
}
```

### 推荐 (DO)：保持平台模块独立

```kotlin
// 推荐 - 职责分离清晰
fun initKoin() {
    startKoin {
        modules(commonModules() + platformModule)
    }
}
```

### 避免 (DON'T)：在共享模块中混入平台特定代码

```kotlin
// 避免 - 在 commonMain 中包含平台特定代码
val sharedModule = module {
    single {
        if (Platform.isAndroid) { /* ... */ } // 不要这样做！
    }
}
```

### 推荐 (DO)：大型应用使用延迟加载模块

```kotlin
// 推荐 - 优化启动速度
val lazyFeatureModule = lazyModule {
    single<HeavyService>()
}

startKoin {
    modules(coreModules)
    lazyModules(lazyFeatureModule)
}
```

### 避免 (DON'T)：忘记关闭作用域

```kotlin
// 避免 - 内存泄漏
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()
    // 忘记关闭作用域了！
}

// 推荐 - 正确清理
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()

    fun onDestroy() {
        scope.close()
    }
}
```

## 桌面平台集成

对于 JVM 桌面应用 (Compose Desktop)：

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

## Web 平台集成（实验性）

对于 Kotlin/JS 和 Kotlin/WASM：

```kotlin
// jsMain 或 wasmJsMain
fun main() {
    startKoin {
        modules(
            sharedModule,
            webModule
        )
    }
    // 您的 Web 应用初始化
}

val webModule = module {
    single<ConsoleLogger>() bind Logger::class
    single<BrowserStorage>()
}
```

:::warning
WASM 支持处于实验阶段。某些功能可能无法按预期工作。
:::

## iOS Swift 互操作

### 适用于 Swift 的 KoinComponent

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

### 线程注意事项

在 iOS 和其他 Native 目标上，Koin 实例可以与新的内存模型无缝协作：

- Koin 定义是线程安全的
- 作用域可以跨线程创建和使用
- 如果需要，对全局 Koin 实例使用 `@SharedImmutable`

:::note
新的 Kotlin/Native 内存模型（在 Kotlin 1.7.20+ 中为默认）使 Koin 的使用变得简单得多。
:::

## 后续步骤

- **[KMP 设置](/docs/reference/koin-core/kmp-setup)** - 基础 KMP 配置
- **[共享模式](/docs/reference/koin-core/kmp-shared-modules)** - 模块组织
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - 多平台 ViewModel
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose 集成
- **[Annotations KMP](/docs/reference/koin-annotations/kmp)** - KMP 中基于注解的 DI