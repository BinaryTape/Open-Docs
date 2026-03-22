---
title: 高级模式
---

# 高级模式

本指南涵盖了复杂场景下的高级依赖注入模式。

## 外部库绑定

对于无法添加注解的第三方库，请使用带有 `create()` 的构建器函数：

```kotlin
// 构建器函数 - Koin 会自动解析参数
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

或者通过注解使用 `@Module` 函数：

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

## 依赖项集合

### 多重实现

使用限定符聚合接口的多重实现：

```kotlin
interface PaymentProcessor {
    fun process(amount: Double): Boolean
    fun getName(): String
}

class CreditCardProcessor : PaymentProcessor { ... }
class PayPalProcessor : PaymentProcessor { ... }
class CryptoProcessor : PaymentProcessor { ... }
```

#### 编译器插件 DSL

在类上使用 `@Named` 限定符注解：

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

#### 注解

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

#### 经典 DSL

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

## 泛型类型

Koin 保留了泛型类型信息：

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

// 注入 - 类型是不同的
val userRepo: Repository<User> = get()
val productRepo: Repository<Product> = get()
```

## 提供者模式

当您需要使用运行时参数创建对象时，请为运行时实例创建工厂：

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

// 用法
class MyScreen(private val dialogFactory: DialogFactory) {
    fun showConfirmation() {
        dialogFactory.createConfirmDialog("Confirm") { /* 操作 */ }.show()
    }
}
```

## 装饰器模式

使用委托堆叠行为：

```kotlin
interface NotificationService {
    fun send(message: String)
}

@Singleton
class BasicNotificationService : NotificationService {
    override fun send(message: String) { /* 发送 */ }
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

在模块中堆叠装饰器：

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

- **[定义](/docs/reference/koin-core/definitions)** - 基本定义类型
- **[限定符](/docs/reference/koin-core/qualifiers)** - 命名和类型化限定符
- **[故障排除](/docs/reference/koin-core/troubleshooting)** - 调试并修复问题