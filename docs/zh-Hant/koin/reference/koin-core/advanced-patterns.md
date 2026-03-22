---
title: 高階模式
---

# 高階模式

本指南涵蓋了適用於複雜情境的高階相依注入模式。

## 外部程式庫繫結

對於無法加入註解的第三方程式庫，請使用帶有 `create()` 的建置器函式：

```kotlin
// 建置器函式 - Koin 會自動解析參數
fun createOkHttpClient(): OkHttpClient =
    OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .build()

fun createRetrofit(client: OkHttpClient): Retrofit =
    Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .client(client)
        .build()

fun createApiService(retrofit: Retrofit): ApiService =
    retrofit.create(ApiService::class.java)

val networkModule = module {
    single { create(::createOkHttpClient) }
    single { create(::createRetrofit) }
    single { create(::createApiService) }
}
```

或使用 `@Module` 函式的註解方式：

```kotlin
@Module
class NetworkModule {
    @Single
    fun provideOkHttpClient(): OkHttpClient =
        OkHttpClient.Builder().connectTimeout(30, TimeUnit.SECONDS).build()

    @Single
    fun provideRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder().baseUrl("https://api.example.com/").client(client).build()

    @Single
    fun provideApiService(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

## 相依性集合

### 多個實作

使用限定詞彙總一個介面的多個實作：

```kotlin
interface PaymentProcessor {
    fun process(amount: Double): Boolean
    fun getName(): String
}

class CreditCardProcessor : PaymentProcessor { ... }
class PayPalProcessor : PaymentProcessor { ... }
class CryptoProcessor : PaymentProcessor { ... }
```

#### 編譯器外掛程式 DSL

在類別上使用 `@Named` 限定詞註解：

```kotlin
@Named("creditCard")
class CreditCardProcessor : PaymentProcessor { ... }

@Named("paypal")
class PayPalProcessor : PaymentProcessor { ... }

@Named("crypto")
class CryptoProcessor : PaymentProcessor { ... }

class PaymentManager(
    @Named("creditCard") creditCard: PaymentProcessor,
    @Named("paypal") paypal: PaymentProcessor,
    @Named("crypto") crypto: PaymentProcessor
) {
    private val processors = listOf(creditCard, paypal, crypto)
}
```

```kotlin
val paymentModule = module {
    single<CreditCardProcessor>()
    single<PayPalProcessor>()
    single<CryptoProcessor>()
    single<PaymentManager>()
}
```

#### 註解

```kotlin
@Module
class PaymentModule {
    @Single
    @Named("creditCard")
    fun provideCreditCard(): PaymentProcessor = CreditCardProcessor()

    @Single
    @Named("paypal")
    fun providePayPal(): PaymentProcessor = PayPalProcessor()

    @Single
    @Named("crypto")
    fun provideCrypto(): PaymentProcessor = CryptoProcessor()

    @Single
    fun providePaymentManager(
        @Named("creditCard") creditCard: PaymentProcessor,
        @Named("paypal") paypal: PaymentProcessor,
        @Named("crypto") crypto: PaymentProcessor
    ): PaymentManager = PaymentManager(listOf(creditCard, paypal, crypto))
}
```

#### 經典 DSL

```kotlin
val paymentModule = module {
    single(named("creditCard")) { CreditCardProcessor() }
    single(named("paypal")) { PayPalProcessor() }
    single(named("crypto")) { CryptoProcessor() }

    single {
        PaymentManager(
            listOf(
                get(named("creditCard")),
                get(named("paypal")),
                get(named("crypto"))
            )
        )
    }
}
```

## 泛型型別

Koin 會保留泛型型別資訊：

```kotlin
interface Repository<T> {
    suspend fun get(id: String): T
    suspend fun save(item: T)
}

@Singleton
class UserRepository : Repository<User> { ... }

@Singleton
class ProductRepository : Repository<Product> { ... }
```

```kotlin
// DSL
val repositoryModule = module {
    single<Repository<User>> { UserRepository() }
    single<Repository<Product>> { ProductRepository() }
}

// 注入 - 型別是區分的
val userRepo: Repository<User> = get()
val productRepo: Repository<Product> = get()
```

## 提供者模式

當您需要使用執行時參數建立物件時，請為執行時實體建立工廠：

```kotlin
@Factory
class DialogFactory(private val context: Context) {
    fun createConfirmDialog(title: String, onConfirm: () -> Unit): AlertDialog =
        AlertDialog.Builder(context)
            .setTitle(title)
            .setPositiveButton("OK") { _, _ -> onConfirm() }
            .create()

    fun createErrorDialog(message: String): AlertDialog =
        AlertDialog.Builder(context)
            .setTitle("Error")
            .setMessage(message)
            .create()
}

// 使用方式
class MyScreen(private val dialogFactory: DialogFactory) {
    fun showConfirmation() {
        dialogFactory.createConfirmDialog("Confirm") { /* 操作 */ }.show()
    }
}
```

## 裝飾者模式

使用委派來堆疊行為：

```kotlin
interface NotificationService {
    fun send(message: String)
}

@Singleton
class BasicNotificationService : NotificationService {
    override fun send(message: String) { /* 傳送 */ }
}

class LoggingNotificationDecorator(
    private val delegate: NotificationService,
    private val logger: Logger
) : NotificationService {
    override fun send(message: String) {
        logger.log("Sending: $message")
        delegate.send(message)
    }
}

class RateLimitedNotificationDecorator(
    private val delegate: NotificationService,
    private val rateLimiter: RateLimiter
) : NotificationService {
    override fun send(message: String) {
        if (rateLimiter.tryAcquire()) delegate.send(message)
    }
}
```

在模組中堆疊裝飾者：

```kotlin
fun createLogger(): Logger = ConsoleLogger()
fun createRateLimiter(): RateLimiter = TokenBucketRateLimiter()

val notificationModule = module {
    single { BasicNotificationService() }
    single { create(::createLogger) }
    single { create(::createRateLimiter) }

    single<NotificationService> {
        RateLimitedNotificationDecorator(
            delegate = LoggingNotificationDecorator(
                delegate = get<BasicNotificationService>(),
                logger = get()
            ),
            rateLimiter = get()
        )
    }
}
```

## 下一步

- **[Definitions](/docs/reference/koin-core/definitions)** - 基礎定義型別
- **[Qualifiers](/docs/reference/koin-core/qualifiers)** - 命名與型別限定詞
- **[Troubleshooting](/docs/reference/koin-core/troubleshooting)** - 偵錯與修正問題