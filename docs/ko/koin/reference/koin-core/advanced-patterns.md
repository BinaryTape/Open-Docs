---
title: 고급 패턴
---

# 고급 패턴

이 가이드는 복잡한 시나리오를 위한 고급 의존성 주입(dependency injection) 패턴을 다룹니다.

## 외부 라이브러리 바인딩

어노테이션을 추가할 수 없는 서드파티 라이브러리의 경우, `create()`와 함께 빌더 함수를 사용하세요:

```kotlin
// 빌더 함수 - Koin이 파라미터를 자동으로 해결합니다
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

또는 `@Module` 함수를 사용하는 어노테이션 방식입니다:

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

## 의존성 컬렉션

### 다중 구현

한정자(qualifier)를 사용하여 인터페이스의 여러 구현체를 집계합니다:

```kotlin
interface PaymentProcessor {
    fun process(amount: Double): Boolean
    fun getName(): String
}

class CreditCardProcessor : PaymentProcessor { ... }
class PayPalProcessor : PaymentProcessor { ... }
class CryptoProcessor : PaymentProcessor { ... }
```

#### 컴파일러 플러그인 DSL

클래스에 `@Named` 한정자 어노테이션을 사용합니다:

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

#### 어노테이션

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

#### 기존 DSL

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

## 제네릭 타입

Koin은 제네릭 타입 정보를 유지합니다:

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

// 주입 - 타입이 서로 구분됩니다
val userRepo: Repository<User> = get()
val productRepo: Repository<Product> = get()
```

## 프로바이더(Provider) 패턴

런타임 파라미터를 사용하여 객체를 생성해야 하는 경우, 런타임 인스턴스를 위한 팩토리를 만듭니다:

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

// 사용법
class MyScreen(private val dialogFactory: DialogFactory) {
    fun showConfirmation() {
        dialogFactory.createConfirmDialog("Confirm") { /* action */ }.show()
    }
}
```

## 데코레이터 패턴

위임(delegation)을 사용하여 동작을 중첩합니다:

```kotlin
interface NotificationService {
    fun send(message: String)
}

@Singleton
class BasicNotificationService : NotificationService {
    override fun send(message: String) { /* send */ }
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

모듈에서 데코레이터를 중첩합니다:

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

## 다음 단계

- **[정의(Definitions)](/docs/reference/koin-core/definitions)** - 기본 정의 타입
- **[한정자(Qualifiers)](/docs/reference/koin-core/qualifiers)** - 이름 기반 및 타입 기반 한정자
- **[문제 해결(Troubleshooting)](/docs/reference/koin-core/troubleshooting)** - 이슈 디버깅 및 해결 방법