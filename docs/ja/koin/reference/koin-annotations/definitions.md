---
title: アノテーションによる定義
---

Koin Annotations を使用すると、通常の Koin DSL と同じ種類の定義をアノテーションで宣言できます。クラスに必要なアノテーションを付与するだけで、すべてが自動生成されます。

例えば、DSL 宣言の `single { MyComponent(get()) }` に相当するものは、次のように `@Single` を付与するだけで完了します。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotations は、Koin DSL と同じセマンティクス（意味合い）を保持しています。コンポーネントは以下の定義を使用して宣言できます。

- `@Single` - シングルトンインスタンス（DSL の `single { }` で宣言されるもの）
- `@Factory` - ファクトリインスタンス。インスタンスが必要になるたびに再作成されます。（DSL の `factory { }` で宣言されるもの）
- `@KoinViewModel` - Android ViewModel インスタンス（DSL の `viewModel { }` で宣言されるもの）
- `@KoinWorker` - Android Worker Workmanager インスタンス（DSL の `worker { }` で宣言されるもの）

スコープについては、[スコープの宣言](/docs/reference/koin-core/scopes) セクションを確認してください。

## アノテーション付きトップレベル関数

アノテーションはクラスだけでなく、**トップレベル関数**にも使用できます。これは、外部ライブラリのインスタンスやビルダーパターンを提供する場合に便利です。トップレベル関数はクラスと同様に `@ComponentScan` によって検出されます。

```kotlin
import org.koin.core.annotation.Singleton
import org.koin.core.annotation.Factory
import org.koin.core.annotation.Named

// Room データベースのインスタンスを提供
@Singleton
fun provideDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()

// JSON シリアライザーを提供
@Singleton
fun provideJson(): Json = Json { ignoreUnknownKeys = true }

// HTTP クライアントを提供
@Singleton
@Named("api")
fun provideHttpClient(json: Json): HttpClient = HttpClient { install(ContentNegotiation) { json(json) } }
```

パラメータは DI コンテナから自動的に解決されます。クオリファイア（`@Named`、カスタム `@Qualifier`）は、関数とそのパラメータの両方で使用できます。

## モジュール関数（プロバイダー関数）

`@Module` クラス内では、`@Singleton` や `@Factory` などが付与された関数が、Dagger/Hilt の `@Provides` と同様にプロバイダー関数として動作します。

```kotlin
import org.koin.core.annotation.Module
import org.koin.core.annotation.Singleton

@Module
internal object DatabaseModule {

    @Singleton
    fun providesDatabase(context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "my-db").build()
}

@Module(includes = [DatabaseModule::class])
class DaosModule {

    @Singleton
    fun providesTopicDao(database: AppDatabase): TopicDao = database.topicDao()

    @Singleton
    fun providesNewsDao(database: AppDatabase): NewsResourceDao = database.newsResourceDao()
}
```

これは、所有していない、あるいは直接アノテーションを付与できない外部ライブラリ（Room、Retrofit、OkHttp など）をラップするためのパターンです。

## カスタムクオリファイアアノテーション

`@Named` 以外にも、`@Qualifier` を使用してパラメータを持つカスタムクオリファイアアノテーションを作成できます。

```kotlin
import org.koin.core.annotation.Qualifier

@Qualifier
@Retention(AnnotationRetention.RUNTIME)
annotation class Dispatcher(val niaDispatcher: NiaDispatchers)

enum class NiaDispatchers { Default, IO }
```

これをプロバイダー関数や注入ポイントで使用します。

```kotlin
import org.koin.core.annotation.Module
import org.koin.core.annotation.Configuration
import org.koin.core.annotation.Singleton

@Module
@Configuration
class DispatchersModule {

    @Singleton
    @Dispatcher(NiaDispatchers.IO)
    fun providesIODispatcher(): CoroutineDispatcher = Dispatchers.IO

    @Singleton
    @Dispatcher(NiaDispatchers.Default)
    fun providesDefaultDispatcher(): CoroutineDispatcher = Dispatchers.Default

    @Singleton
    fun providesApplicationScope(
        @Dispatcher(NiaDispatchers.Default) dispatcher: CoroutineDispatcher,
    ): CoroutineScope = CoroutineScope(SupervisorJob() + dispatcher)
}
```

カスタムクオリファイアはコンパイル時に検証されます。プロバイダーと注入ポイントのクオリファイアが一致しない場合は、ビルドエラーが発生します。

### Kotlin Multiplatform 用の ViewModel

`@KoinViewModel` アノテーションは、統一された `koin-core-viewmodel` API を使用して ViewModel を生成し、Kotlin Multiplatform との互換性を提供します。

```kotlin
@KoinViewModel
class UserViewModel(val repository: UserRepository) : ViewModel()
```

これにより、Android と Compose Multiplatform の両方に対応した `viewModel` 定義が生成されます。

## 自動または特定のバインディング

コンポーネントを宣言すると、検出されたすべての「バインディング」（関連するスーパータイプ）が自動的に準備されます。例えば、以下の定義を見てみましょう。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin は、`MyComponent` コンポーネントが `MyInterface` にも紐付いていることを宣言します。DSL での同等の表現は `single { MyComponent(get()) } bind MyInterface::class` です。

Koin に自動検出させる代わりに、`binds` アノテーションパラメータを使用して、実際にバインドしたい型を指定することもできます。

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## Null 許容の依存関係 (Nullable Dependencies)

コンポーネントが Null 許容の依存関係（nullable dependency）を使用している場合でも、自動的に処理されるので心配ありません。通常通り定義アノテーションを使用し続けるだけで、Koin が適切に判断します。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成される DSL の同等表現は `single { MyComponent(getOrNull()) }` になります。

> これは、注入されたパラメータ（Parameters）やプロパティ（Properties）でも同様に動作します。

## @Named によるクオリファイア

`@Named` アノテーションを使用して、定義に「名前」（クオリファイアとも呼ばれます）を付け、同じ型の複数の定義を区別することができます。

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

依存関係を解決する際は、`named` 関数を使用してクオリファイアを指定するだけです。

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

また、カスタムクオリファイアアノテーションを作成することも可能です。先ほどの例を使用すると以下のようになります。

```kotlin
@Named
annotation class InMemoryLogger

@Named
annotation class DatabaseLogger

@Single
@InMemoryLogger
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@DatabaseLogger
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

```kotlin
val logger: LoggerDataSource by inject(named<InMemoryLogger>())
```

## @InjectedParam による注入パラメータ

コンストラクタのメンバーに「注入パラメータ（injected parameter）」としてタグを付けることができます。これは、解決（resolution）を呼び出す際に、依存関係がグラフに渡されることを意味します。

例：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

その後、`MyComponent` を呼び出し、`MyDependency` のインスタンスを渡すことができます。

```kotlin
val m = MyDependency()
// MyDependency を渡しつつ MyComponent を解決する
koin.get<MyComponent> { parametersOf(m) }
```

生成される DSL の同等表現は `single { params -> MyComponent(params.get()) }` になります。

## 遅延依存関係の注入 - `Lazy<T>`

Koin は、遅延依存関係を自動的に検出して解決できます。ここでは例として、`LoggerDataSource` の定義を遅延解決したいとします。次のように Kotlin の `Lazy` 型を使用するだけです。

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

内部的には、`get()` の代わりに `inject()` を使用した DSL が生成されます。

```kotlin
single { LoggerAggregator(inject()) }
```

## 依存関係リストの注入 - `List<T>`

Koin は、依存関係のリストを自動的に検出して解決できます。ここでは例として、すべての `LoggerDataSource` 定義を解決したいとします。次のように Kotlin の `List` 型を使用するだけです。

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource

@Single
class LoggerAggregator(val datasource : List<LoggerDataSource>)
```

内部的には、`getAll()` 関数を使用した DSL が生成されます。

```kotlin
single { LoggerAggregator(getAll()) }
```

## @Property によるプロパティ

定義内で Koin プロパティを解決するには、コンストラクタのメンバーに `@Property` を付与します。これにより、アノテーションに渡された値を使用して Koin プロパティが解決されます。

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成される DSL の同等表現は `factory { ComponentWithProps(getProperty("id")) }` になります。

### @PropertyValue - デフォルト値付きプロパティ (1.4 以降)

Koin Annotations では、`@PropertyValue` アノテーションを使用して、コードから直接プロパティのデフォルト値を定義することができます。
サンプルを見てみましょう。

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
){
    public companion object {
        @PropertyValue("id")
        public const val DEFAULT_ID : String = "_empty_id"
    }
}
```

生成される DSL の同等表現は `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }` になります。

## JSR-330 互換アノテーション

Koin Annotations は、`koin-jsr330` モジュールを通じて JSR-330 (Jakarta Inject) 互換のアノテーションを提供します。これらのアノテーションは、Hilt、Dagger、Guice などの他の JSR-330 互換フレームワークから移行する開発者にとって特に有用です。

### セットアップ

プロジェクトに `koin-jsr330` 依存関係を追加します。

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 利用可能な JSR-330 アノテーション

#### @Singleton (jakarta.inject.Singleton)

JSR-330 標準のシングルトンアノテーションで、Koin の `@Single` と同等です。

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

これは `@Single` と同じ結果（Koin におけるシングルトンインスタンス）を生成します。

#### @Named (jakarta.inject.Named)

文字列ベースのクオリファイアのための JSR-330 標準クオリファイアアノテーションです。

```kotlin
import jakarta.inject.Named
import jakarta.inject.Singleton

@Singleton
@Named("inMemory")
class InMemoryCache : Cache

@Singleton  
@Named("redis")
class RedisCache : Cache
```

#### @Inject (jakarta.inject.Inject)

JSR-330 標準の注入アノテーションです。Koin Annotations は明示的なコンストラクタのマーキングを必要としませんが、JSR-330 との互換性のために `@Inject` を使用できます。

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

カスタムクオリファイアアノテーションを作成するためのメタアノテーションです。

```kotlin
import jakarta.inject.Qualifier

@Qualifier
annotation class Database

@Qualifier  
annotation class Cache

@Singleton
@Database
class DatabaseConfig

@Singleton
@Cache  
class CacheConfig
```

#### @Scope (jakarta.inject.Scope)

カスタムスコープアノテーションを作成するためのメタアノテーションです。

```kotlin
import jakarta.inject.Scope

@Scope
annotation class RequestScoped

// Koin のスコープシステムで使用
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 混合利用

同じプロジェクト内で JSR-330 アノテーションと Koin アノテーションを自由に混ぜて使用できます。

```kotlin
// JSR-330 スタイル
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin スタイル  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// 同一クラス内での混合
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### フレームワーク移行のメリット

JSR-330 アノテーションを使用することで、フレームワークの移行においていくつかの利点があります。

- **馴染みのある API**: Hilt、Dagger、Guice から移行する開発者は、既知のアノテーションを使用できます。
- **段階的な移行**: 既存の JSR-330 アノテーションが付与されたコードを、最小限の変更で動作させることができます。
- **標準への準拠**: JSR-330 に従うことで、依存性の注入に関する標準との互換性が確保されます。
- **チームのオンボーディング**: 他の DI フレームワークに慣れているチームにとって、導入が容易になります。

:::info
Koin における JSR-330 アノテーションは、対応する Koin のアノテーションと同じ基盤となる DSL を生成します。JSR-330 アノテーションと Koin アノテーションのどちらを選択するかは、純粋にスタイルの問題であり、チームの好みや移行の要件に基づきます。
:::