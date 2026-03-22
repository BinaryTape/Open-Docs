---
title: 限定符
---

# 限定符

限定符允许您在 Koin 模块中区分相同类型的多个定义。

## 何时需要限定符

在以下情况下，您需要使用限定符：
- 同一个接口有多个实现
- 同一个类型需要不同的配置
- 您想要区分具有不同用途的实例

```kotlin
// 没有限定符 - 冲突！
val networkModule = module {
    single { OkHttpClient.Builder()...build() }
    single { OkHttpClient.Builder()...build() }  // 哪一个？
}
```

## 命名限定符

使用 `named()` 来区分定义：

### 定义

```kotlin
import org.koin.core.qualifier.named

val networkModule = module {
    single(named("encrypted")) {
        OkHttpClient.Builder()
            .addInterceptor(EncryptionInterceptor())
            .build()
    }

    single(named("logging")) {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .build()
    }
}
```

### 注入

```kotlin
// 在模块定义中
val apiModule = module {
    single {
        ApiService(
            encryptedClient = get(named("encrypted")),
            loggingClient = get(named("logging"))
        )
    }
}

// 使用 KoinComponent
class MyService : KoinComponent {
    private val encryptedClient: OkHttpClient by inject(named("encrypted"))
}
```

### 使用注解

```kotlin
import org.koin.core.annotation.Named
import org.koin.core.annotation.Single

@Single
@Named("encrypted")
class EncryptedHttpClient : OkHttpClient()

@Single
@Named("logging")
class LoggingHttpClient : OkHttpClient()

@Single
class ApiService(
    @Named("encrypted") private val encryptedClient: OkHttpClient,
    @Named("logging") private val loggingClient: OkHttpClient
)
```

:::note
对于编译器插件 DSL 和经典 DSL 自动装配（`singleOf`、`factoryOf`），限定符无法自动解析。当定义需要限定符时，请使用带有 lambda 的经典 DSL 或注解。
:::

## 类型安全限定符

### 使用类型

可以使用任何类型作为限定符配合 `named<T>()` 使用：

```kotlin
// 定义限定符类型
object EncryptedClient
object LoggingClient

val networkModule = module {
    single(named<EncryptedClient>()) {
        OkHttpClient.Builder()
            .addInterceptor(EncryptionInterceptor())
            .build()
    }

    single(named<LoggingClient>()) {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .build()
    }
}

// 注入
val client: OkHttpClient = get(named<EncryptedClient>())
```

### 使用枚举

为了获得更好的 IDE 支持，请使用枚举：

```kotlin
enum class NetworkClient {
    ENCRYPTED,
    LOGGING,
    FAST
}

val networkModule = module {
    single(named(NetworkClient.ENCRYPTED)) {
        OkHttpClient.Builder()
            .addInterceptor(EncryptionInterceptor())
            .build()
    }

    single(named(NetworkClient.LOGGING)) {
        OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .build()
    }
}

// 注入 - 不可能出现拼写错误！
val client: OkHttpClient = get(named(NetworkClient.ENCRYPTED))
```

**类型安全限定符的优点：**
- 编译时类型安全
- 没有字符串拼写错误
- IDE 自动补全和重构支持

## JSR-330 @Qualifier

Koin 支持标准的 JSR-330 `@Qualifier` 注解：

```kotlin
import jakarta.inject.Qualifier

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class EncryptedClient

// 在定义中使用
@Single
@IoDispatcher
fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO

// 在注入中使用
@Single
class MyRepository(
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
)
```

## 常见用例

### 多个 API 版本

```kotlin
val networkModule = module {
    single(named("api_v1")) {
        Retrofit.Builder()
            .baseUrl("https://api.example.com/v1/")
            .build()
    }

    single(named("api_v2")) {
        Retrofit.Builder()
            .baseUrl("https://api.example.com/v2/")
            .build()
    }
}
```

### 不同的超时配置

```kotlin
val networkModule = module {
    single(named("fast")) {
        OkHttpClient.Builder()
            .connectTimeout(5, TimeUnit.SECONDS)
            .build()
    }

    single(named("slow")) {
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }
}
```

### 环境配置

```kotlin
val configModule = module {
    single(named("debug")) {
        AppConfig(apiUrl = "https://dev.example.com", loggingEnabled = true)
    }

    single(named("release")) {
        AppConfig(apiUrl = "https://api.example.com", loggingEnabled = false)
    }

    // 根据环境选择
    single<AppConfig> {
        if (isDebug) get(named("debug")) else get(named("release"))
    }
}
```

## 最佳做法

### 1. 克制地使用限定符

```kotlin
// 推荐 - 仅在必要时使用限定符
val appModule = module {
    single { UserRepository(get()) }  // 无需限定符
    single { AuthRepository(get()) }   // 不同的类型
}

// 过度限定 - 应当避免
val appModule = module {
    single(named("user_repository")) { UserRepository(get()) }
    single(named("auth_repository")) { AuthRepository(get()) }
    // 没必要 - 类型本身已经不同了
}
```

### 2. 优先考虑类型区分

```kotlin
// 更好 - 使用不同的类型
interface EncryptedHttpClient
interface LoggingHttpClient

class EncryptedOkHttpClient : OkHttpClient(), EncryptedHttpClient
class LoggingOkHttpClient : OkHttpClient(), LoggingHttpClient

val networkModule = module {
    single<EncryptedHttpClient> { EncryptedOkHttpClient() }
    single<LoggingHttpClient> { LoggingOkHttpClient() }
}
```

### 3. 避免限定符链

```kotlin
// 糟糕 - 复杂的限定符依赖
val badModule = module {
    single(named("a")) { A() }
    single(named("b")) { B(get(named("a"))) }
    single(named("c")) { C(get(named("b"))) }
}

// 更好 - 扁平化或使用不同类型
val goodModule = module {
    single { A() }
    single { B(get()) }
    single { C(get()) }
}
```

### 4. 为限定符编写文档

```kotlin
val networkModule = module {
    // 用于带加密的安全 API 调用客户端
    single(named("encrypted")) { ... }

    // 用于带完整请求/响应日志记录的调试客户端
    single(named("logging")) { ... }
}
```

## 命名约定

### 基于字符串

```kotlin
// 推荐 - 描述性强，小写并使用下划线
single(named("encrypted_client")) { ... }
single(named("user_database")) { ... }
single(named("api_v2")) { ... }

// 避免 - 不明确或不一致
single(named("client1")) { ... }  // "1" 代表什么意思？
```

### 基于枚举

```kotlin
// 推荐 - 清晰的枚举名称
enum class DatabaseType {
    USER_DATA,
    CACHE,
    ANALYTICS
}

enum class ApiVersion {
    V1, V2, V3
}
```

## 常见陷阱

### 注入时忘记限定符

```kotlin
val module = module {
    single(named("encrypted")) { OkHttpClient() }
}

val repoModule = module {
    single {
        MyRepository(get())  // ❌ 错误：找不到 OkHttpClient 的定义
        // 应当为：get(named("encrypted"))
    }
}
```

### 限定符名称不匹配

```kotlin
val module = module {
    single(named("encrypted_client")) { OkHttpClient() }
}

val repoModule = module {
    single {
        ApiService(
            get(named("encrypted"))  // ❌ 拼写错误！应当为 "encrypted_client"
        )
    }
}
```

请使用枚举限定符来避免拼写错误！

## 后续步骤

- **[定义](/docs/reference/koin-core/definitions)** - 定义类型与绑定
- **[模块](/docs/reference/koin-core/modules)** - 模块组织
- **[注入](/docs/reference/koin-core/injection)** - 检索依赖项