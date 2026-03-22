---
title: 限定詞
---

# 限定詞 (Qualifiers)

限定詞允許您在 Koin 模組中區分相同型別的多個定義。

## 什麼時候需要限定詞

您在以下情況需要限定詞：
- 您有同一個介面的多種實作
- 您需要同一個型別的不同配置
- 您想要區分具有不同用途的執行個體

```kotlin
// 沒有限定詞 - 衝突！
val networkModule = module {
    single { OkHttpClient.Builder()...build() }
    single { OkHttpClient.Builder()...build() }  // 哪一個？
}
```

## 具名限定詞 (Named Qualifiers)

使用 `named()` 來區分定義：

### 定義

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
// 在模組定義中
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

### 搭配註解

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
對於編譯器外掛程式 DSL 和經典 DSL 自動裝配 (`singleOf`、`factoryOf`)，限定詞無法自動解析。當定義需要限定詞時，請使用搭配 Lambda 的經典 DSL 或註解。
:::

## 型別安全限定詞

### 使用型別

將任何型別搭配 `named<T>()` 作為限定詞使用：

```kotlin
// 定義限定詞型別
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

### 使用列舉 (Enums)

為了獲得更好的 IDE 支援，請使用列舉：

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

// 注入 - 不可能發生拼寫錯誤！
val client: OkHttpClient = get(named(NetworkClient.ENCRYPTED))
```

**型別安全限定詞的優點：**
- 編譯時期型別安全
- 沒有字串拼寫錯誤
- IDE 自動補全與重構支援

## JSR-330 @Qualifier

Koin 支援標準的 JSR-330 `@Qualifier` 註解：

```kotlin
import jakarta.inject.Qualifier

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class EncryptedClient

// 在定義中使用
@Single
@IoDispatcher
fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO

// 在注入中使用
@Single
class MyRepository(
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
)
```

## 常見使用案例

### 多個 API 版本

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

### 不同的超時配置

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

### 環境配置

```kotlin
val configModule = module {
    single(named("debug")) {
        AppConfig(apiUrl = "https://dev.example.com", loggingEnabled = true)
    }

    single(named("release")) {
        AppConfig(apiUrl = "https://api.example.com", loggingEnabled = false)
    }

    // 根據環境選擇
    single<AppConfig> {
        if (isDebug) get(named("debug")) else get(named("release"))
    }
}
```

## 最佳實務

### 1. 謹慎使用限定詞

```kotlin
// 佳 - 僅在必要時使用限定詞
val appModule = module {
    single { UserRepository(get()) }  // 不需要限定詞
    single { AuthRepository(get()) }   // 型別不同
}

// 過度限定 - 請避免
val appModule = module {
    single(named("user_repository")) { UserRepository(get()) }
    single(named("auth_repository")) { AuthRepository(get()) }
    // 不必要 - 型別已經不同了
}
```

### 2. 優先考慮型別區分

```kotlin
// 較佳 - 使用不同的型別
interface EncryptedHttpClient
interface LoggingHttpClient

class EncryptedOkHttpClient : OkHttpClient(), EncryptedHttpClient
class LoggingOkHttpClient : OkHttpClient(), LoggingHttpClient

val networkModule = module {
    single<EncryptedHttpClient> { EncryptedOkHttpClient() }
    single<LoggingHttpClient> { LoggingOkHttpClient() }
}
```

### 3. 避免限定詞鏈

```kotlin
// 差 - 複雜的限定詞相依性
val badModule = module {
    single(named("a")) { A() }
    single(named("b")) { B(get(named("a"))) }
    single(named("c")) { C(get(named("b"))) }
}

// 較佳 - 扁平化或使用不同的型別
val goodModule = module {
    single { A() }
    single { B(get()) }
    single { C(get()) }
}
```

### 4. 為限定詞編寫文件

```kotlin
val networkModule = module {
    // 用於具有加密功能的安全 API 呼叫的用戶端
    single(named("encrypted")) { ... }

    // 用於具有完整請求/回應記錄偵錯的用戶端
    single(named("logging")) { ... }
}
```

## 命名慣例

### 基於字串

```kotlin
// 佳 - 具描述性，小寫並使用底線
single(named("encrypted_client")) { ... }
single(named("user_database")) { ... }
single(named("api_v2")) { ... }

// 避免 - 不清晰或不一致
single(named("client1")) { ... }  // "1" 代表什麼意思？
```

### 基於列舉 (Enum-Based)

```kotlin
// 佳 - 清晰的列舉名稱
enum class DatabaseType {
    USER_DATA,
    CACHE,
    ANALYTICS
}

enum class ApiVersion {
    V1, V2, V3
}
```

## 常見陷阱

### 注入時忘記限定詞

```kotlin
val module = module {
    single(named("encrypted")) { OkHttpClient() }
}

val repoModule = module {
    single {
        MyRepository(get())  // ❌ 錯誤：沒有 OkHttpClient 的定義
        // 應為：get(named("encrypted"))
    }
}
```

### 限定詞名稱不符

```kotlin
val module = module {
    single(named("encrypted_client")) { OkHttpClient() }
}

val repoModule = module {
    single {
        ApiService(
            get(named("encrypted"))  // ❌ 拼寫錯誤！應為 "encrypted_client"
        )
    }
}
```

請使用列舉限定詞來避免拼寫錯誤！

## 後續步驟

- **[定義](/docs/reference/koin-core/definitions)** - 定義型別與繫結
- **[模組](/docs/reference/koin-core/modules)** - 模組組織
- **[注入](/docs/reference/koin-core/injection)** - 擷取相依性