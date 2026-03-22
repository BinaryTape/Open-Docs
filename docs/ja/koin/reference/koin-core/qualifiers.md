---
title: クオリファイア
---

# クオリファイア (Qualifiers)

クオリファイアを使用すると、Koinモジュール内にある同じ型の複数の定義を区別することができます。

## クオリファイアが必要な場合

以下のような場合にクオリファイアが必要になります：
- 同じインターフェースの複数の実装がある場合
- 同じ型の異なる設定が必要な場合
- 目的の異なるインスタンスを区別したい場合

```kotlin
// クオリファイアなし - 衝突が発生！
val networkModule = module {
    single { OkHttpClient.Builder()...build() }
    single { OkHttpClient.Builder()...build() }  // どちらを使用すべきか不明
}
```

## 名前付きクオリファイア (Named Qualifiers)

`named()` を使用して定義を区別します：

### 定義方法

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

### 注入方法

```kotlin
// モジュール定義内での使用
val apiModule = module {
    single {
        ApiService(
            encryptedClient = get(named("encrypted")),
            loggingClient = get(named("logging"))
        )
    }
}

// KoinComponent での使用
class MyService : KoinComponent {
    private val encryptedClient: OkHttpClient by inject(named("encrypted"))
}
```

### アノテーションでの使用

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
コンパイラプラグインDSLおよびClassic DSLの自動ワイヤリング（`singleOf`、`factoryOf`）では、クオリファイアを自動的に解決することはできません。クオリファイアが必要な定義には、ラムダを使用したClassic DSLまたはアノテーションを使用してください。
:::

## 型安全なクオリファイア (Type-Safe Qualifiers)

### 型の使用

任意の型をクオリファイアとして `named<T>()` で使用できます：

```kotlin
// クオリファイア用の型を定義
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

### Enum の使用

IDEのサポートをより活用するために、Enumを使用できます：

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

// 注入 - タイポの心配がありません！
val client: OkHttpClient = get(named(NetworkClient.ENCRYPTED))
```

**型安全なクオリファイアの利点:**
- コンパイル時の型安全性
- 文字列のタイポの排除
- IDEのオートコンプリートとリファクタリングのサポート

## JSR-330 @Qualifier

Koinは標準の JSR-330 `@Qualifier` アノテーションをサポートしています：

```kotlin
import jakarta.inject.Qualifier

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class EncryptedClient

// 定義での使用
@Single
@IoDispatcher
fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO

// 注入での使用
@Single
class MyRepository(
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher
)
```

## 一般的なユースケース

### 複数のAPIバージョン

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

### 異なるタイムアウト設定

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

### 環境ごとの設定

```kotlin
val configModule = module {
    single(named("debug")) {
        AppConfig(apiUrl = "https://dev.example.com", loggingEnabled = true)
    }

    single(named("release")) {
        AppConfig(apiUrl = "https://api.example.com", loggingEnabled = false)
    }

    // 環境に基づいて選択
    single<AppConfig> {
        if (isDebug) get(named("debug")) else get(named("release"))
    }
}
```

## ベストプラクティス

### 1. クオリファイアの使用は控えめにする

```kotlin
// 良い例 - 必要な場合のみクオリファイアを使用
val appModule = module {
    single { UserRepository(get()) }  // クオリファイア不要
    single { AuthRepository(get()) }  // 型が異なるため不要
}

// 過剰なクオリファイア - 避けるべき
val appModule = module {
    single(named("user_repository")) { UserRepository(get()) }
    single(named("auth_repository")) { AuthRepository(get()) }
    // 不必要 - 型ですでに区別されている
}
```

### 2. 型による区別を優先する

```kotlin
// より良い例 - 異なる型を使用する
interface EncryptedHttpClient
interface LoggingHttpClient

class EncryptedOkHttpClient : OkHttpClient(), EncryptedHttpClient
class LoggingOkHttpClient : OkHttpClient(), LoggingHttpClient

val networkModule = module {
    single<EncryptedHttpClient> { EncryptedOkHttpClient() }
    single<LoggingHttpClient> { LoggingOkHttpClient() }
}
```

### 3. クオリファイアの連鎖を避ける

```kotlin
// 悪い例 - 複雑なクオリファイアの依存関係
val badModule = module {
    single(named("a")) { A() }
    single(named("b")) { B(get(named("a"))) }
    single(named("c")) { C(get(named("b"))) }
}

// より良い例 - フラットにするか、異なる型を使用する
val goodModule = module {
    single { A() }
    single { B(get()) }
    single { C(get()) }
}
```

### 4. クオリファイアをドキュメント化する

```kotlin
val networkModule = module {
    // 暗号化を伴うセキュアなAPI呼び出し用クライアント
    single(named("encrypted")) { ... }

    // リクエスト/レスポンスのフルログを出力するデバッグ用クライアント
    single(named("logging")) { ... }
}
```

## 命名規則

### 文字列ベース

```kotlin
// 良い例 - 内容が分かりやすく、スネークケースの小文字
single(named("encrypted_client")) { ... }
single(named("user_database")) { ... }
single(named("api_v2")) { ... }

// 避けるべき例 - 不明瞭または一貫性がない
single(named("client1")) { ... }  // "1" が何を意味するのか不明
```

### Enumベース

```kotlin
// 良い例 - 明確な Enum 名
enum class DatabaseType {
    USER_DATA,
    CACHE,
    ANALYTICS
}

enum class ApiVersion {
    V1, V2, V3
}
```

## よくある落とし穴

### 注入時にクオリファイアを忘れる

```kotlin
val module = module {
    single(named("encrypted")) { OkHttpClient() }
}

val repoModule = module {
    single {
        MyRepository(get())  // ❌ エラー: OkHttpClient の定義が見つかりません
        // 正しくは: get(named("encrypted"))
    }
}
```

### クオリファイア名の不一致

```kotlin
val module = module {
    single(named("encrypted_client")) { OkHttpClient() }
}

val repoModule = module {
    single {
        ApiService(
            get(named("encrypted"))  // ❌ タイポ！正しくは "encrypted_client"
        )
    }
}
```

タイポを避けるために、Enumクオリファイアを使用しましょう！

## 次のステップ

- **[定義 (Definitions)](/docs/reference/koin-core/definitions)** - 定義の種類とバインディング
- **[モジュール (Modules)](/docs/reference/koin-core/modules)** - モジュールの構成
- **[注入 (Injection)](/docs/reference/koin-core/injection)** - 依存関係の取得