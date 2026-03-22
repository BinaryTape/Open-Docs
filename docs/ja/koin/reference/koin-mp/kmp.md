---
title: KMP の高度なパターン
---

# KMP の高度なパターン

このガイドでは、Kotlin Multiplatform プロジェクトにおける Koin の高度なパターンについて説明します。

:::info
基本的なセットアップについては [KMP セットアップ](/docs/reference/koin-core/kmp-setup)を、モジュールの構成については [共有パターン](/docs/reference/koin-core/kmp-shared-modules)を、ViewModel については [ViewModel](/docs/reference/koin-core/viewmodel) を参照してください。
:::

## ソースプロジェクト

:::info
Kotlin Multiplatform プロジェクトはこちらにあります: https://github.com/InsertKoinIO/hello-kmp
:::

## 高度な expect/actual パターン

基本的な `expect val platformModule: Module` パターンに加えて、プラットフォーム固有のコードに対する高度なアプローチをいくつか紹介します。

### パターン 1: expect/actual クラス

プラットフォーム固有の API（Android の Context、iOS の UIDevice など）が必要な場合に使用します：

```kotlin
// commonMain - 宣言
expect class PlatformContext

expect fun createPlatformModule(): Module

// androidMain - Android での実装
actual class PlatformContext(val context: Context)

actual fun createPlatformModule() = module {
    single<PlatformContext>()  // コンパイラプラグイン DSL
}

// iosMain - iOS での実装
actual class PlatformContext

actual fun createPlatformModule() = module {
    single<PlatformContext>()
}
```

### パターン 2: インターフェース + プラットフォームの実装

プラットフォームごとに異なる実装を注入したい場合に使用します：

```kotlin
// commonMain - インターフェース
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

### パターン 3: アノテーションを使用した expect モジュール

expect/actual とアノテーションを組み合わせて、コードをよりクリーンにします：

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
**どのパターンを使用すべきか:**
- **expect/actual クラス**: プラットフォーム API（Context、UIDevice）や、単純なプラットフォーム間の差異に使用します。
- **インターフェース**: プラットフォームごとに異なるビジネスロジックや、テスト可能なコードに使用します。
- **expect モジュール**: 複雑なプラットフォーム固有の依存関係グラフに使用します。
:::

## 共有コード内での Android Context

共有コード内で Android の `Context` にアクセスすることは、よくあるニーズです。推奨されるパターンは次のとおりです：

### ContextWrapper パターン

```kotlin
// commonMain - ラッパーインターフェース
interface AppContext

// androidMain - Android での実装
class AndroidAppContext(val context: Context) : AppContext

val androidContextModule = module {
    single<AndroidAppContext>() bind AppContext::class
}

// iosMain - 空の実装
class IOSAppContext : AppContext

val iosContextModule = module {
    single<IOSAppContext>() bind AppContext::class
}
```

共有コードでの使用例：

```kotlin
// commonMain - リポジトリがプラットフォームコンテキストを使用する
class FileRepository(private val appContext: AppContext) {
    fun saveFile(data: String) {
        when (appContext) {
            is AndroidAppContext -> {
                val file = File(appContext.context.filesDir, "data.txt")
                file.writeText(data)
            }
            is IOSAppContext -> {
                // iOS 固有のファイル操作
            }
        }
    }
}

val sharedModule = module {
    single<FileRepository>()
}
```

:::note
純粋な共有ロジックの場合は、`when` 文を使用するよりも、プラットフォームの操作をインターフェースに抽象化することを優先してください。
:::

## アーキテクチャパターン

### Ktor を使用したリポジトリパターン

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

### ネットワークレイヤー (Ktor + Koin)

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

### データベースレイヤー (SqlDelight)

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

## KMP モジュールのテスト

### 共有モジュールのユニットテスト

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

### プラットフォーム固有の依存関係を伴うテスト

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

// commonTest - プラットフォームモジュールを使用したテスト
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
        // サービスのテスト

        stopKoin()
    }
}
```

## よくある落とし穴

### 推奨 (DO): テスト可能な共有コードのためにインターフェースを使用する

```kotlin
// 良い例 - テスト可能
interface Logger {
    fun log(message: String)
}

val sharedModule = module {
    single<UserService>()  // Logger インターフェースに依存
}
```

### 非推奨 (DON'T): ビジネスロジックに expect クラスを使用しない

```kotlin
// 悪い例 - テストが困難で、プラットフォームとの結合が強すぎる
expect class Logger {
    fun log(message: String)
}
```

### 推奨 (DO): プラットフォームモジュールを分離しておく

```kotlin
// 良い例 - 明確な分離
fun initKoin() {
    startKoin {
        modules(commonModules() + platformModule)
    }
}
```

### 非推奨 (DON'T): 共有モジュール内にプラットフォーム固有のコードを混ぜない

```kotlin
// 悪い例 - commonMain 内にプラットフォーム固有のコードがある
val sharedModule = module {
    single {
        if (Platform.isAndroid) { /* ... */ } // これは避けてください！
    }
}
```

### 推奨 (DO): 大規模なアプリでは遅延（lazy）モジュールを使用する

```kotlin
// 良い例 - 起動の最適化
val lazyFeatureModule = lazyModule {
    single<HeavyService>()
}

startKoin {
    modules(coreModules)
    lazyModules(lazyFeatureModule)
}
```

### 非推奨 (DON'T): スコープのクローズを忘れない

```kotlin
// 悪い例 - メモリリーク
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()
    // スコープのクローズを忘れている！
}

// 良い例 - 適切なクリーンアップ
class FeatureScreen : KoinComponent {
    val scope = getKoin().createScope<FeatureScreen>()

    fun onDestroy() {
        scope.close()
    }
}
```

## デスクトッププラットフォームの統合

JVM デスクトップアプリ（Compose Desktop）の場合：

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

## Web プラットフォームの統合（実験的）

Kotlin/JS および Kotlin/WASM の場合：

```kotlin
// jsMain または wasmJsMain
fun main() {
    startKoin {
        modules(
            sharedModule,
            webModule
        )
    }
    // Web アプリの初期化
}

val webModule = module {
    single<ConsoleLogger>() bind Logger::class
    single<BrowserStorage>()
}
```

:::warning
WASM サポートは実験的です。一部の機能が期待通りに動作しない場合があります。
:::

## iOS Swift 相互運用

### Swift のための KoinComponent

```kotlin
// shared/src/iosMain/kotlin/Helper.kt
class GreetingHelper : KoinComponent {
    private val greeting: Greeting by inject()
    fun greet(): String = greeting.greeting()
}
```

Swift 内での記述：

```swift
struct ContentView: View {
    let greet = GreetingHelper().greet()

    var body: some View {
        Text(greet)
    }
}
```

### スレッドに関する考慮事項

iOS やその他の Native ターゲットでは、Koin インスタンスは新しいメモリモデルとシームレスに動作します：

- Koin の定義はスレッドセーフです
- スコープはスレッドをまたいで作成・使用できます
- 必要に応じて、グローバルな Koin インスタンスに `@SharedImmutable` を使用してください

:::note
新しい Kotlin/Native メモリモデル（Kotlin 1.7.20 以降でデフォルト）により、Koin の使用が大幅に簡素化されました。
:::

## 次のステップ

- **[KMP セットアップ](/docs/reference/koin-core/kmp-setup)** - 基本的な KMP 設定
- **[共有パターン](/docs/reference/koin-core/kmp-shared-modules)** - モジュールの構成
- **[ViewModel](/docs/reference/koin-core/viewmodel)** - マルチプラットフォーム ViewModel
- **[Koin for Compose](/docs/reference/koin-compose/compose)** - Compose との統合
- **[アノテーション KMP](/docs/reference/koin-annotations/kmp)** - KMP におけるアノテーションベースの DI