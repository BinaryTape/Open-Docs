---
title: 高度なパターン
---

# 高度なパターン

このガイドでは、複雑なシナリオ向けの高度な依存関係注入（Dependency Injection）パターンについて説明します。

## 外部ライブラリのバインディング

アノテーションを追加できないサードパーティライブラリの場合、`create()` を使用したビルダー関数を使用します：

```kotlin
// ビルダー関数 - Koin はパラメータを自動的に解決します
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

または、アノテーションを使用して `@Module` 関数で定義する場合：

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

## 依存関係のコレクション

### 複数の実装

Qualifier（限定子）を使用して、インターフェースの複数の実装を集約します：

```kotlin
interface PaymentProcessor {
    fun process(amount: Double): Boolean
    fun getName(): String
}

class CreditCardProcessor : PaymentProcessor { ... }
class PayPalProcessor : PaymentProcessor { ... }
class CryptoProcessor : PaymentProcessor { ... }
```

#### コンパイラプラグイン DSL

クラスに `@Named` 限定子アノテーションを使用します：

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

#### アノテーション

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

#### クラシック DSL

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

## ジェネリック型

Koin はジェネリック型の情報を保持します：

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

// インジェクション - 型は明確に区別されます
val userRepo: Repository<User> = get()
val productRepo: Repository<Product> = get()
```

## プロバイダーパターン

実行時パラメータを使用してオブジェクトを作成する必要がある場合は、実行時インスタンス用のファクトリを作成します：

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

// 使用方法
class MyScreen(private val dialogFactory: DialogFactory) {
    fun showConfirmation() {
        dialogFactory.createConfirmDialog("Confirm") { /* アクション */ }.show()
    }
}
```

## デコレータパターン

デリゲーション（委譲）を使用して振る舞いを積み重ねます：

```kotlin
interface NotificationService {
    fun send(message: String)
}

@Singleton
class BasicNotificationService : NotificationService {
    override fun send(message: String) { /* 送信処理 */ }
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

モジュール内でデコレータをスタックします：

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

## 次のステップ

- **[定義](/docs/reference/koin-core/definitions)** - 基本的な定義タイプ
- **[限定子](/docs/reference/koin-core/qualifiers)** - 名前付きおよび型付きの限定子（Qualifiers）
- **[トラブルシューティング](/docs/reference/koin-core/troubleshooting)** - 問題のデバッグと修正