---
title: アノテーションによる定義
---

Koin Annotationsを使用すると、通常のKoin DSLと同じ種類の定義を宣言できますが、アノテーションを使って行います。必要なアノテーションでクラスをタグ付けするだけで、すべてが自動的に生成されます！

例えば、`single { MyComponent(get()) }`というDSL宣言に相当するものは、次のように`@Single`でタグ付けするだけで実現できます。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotationsは、Koin DSLと同じセマンティクスを維持します。以下の定義でコンポーネントを宣言できます。

- `@Single` - シングルトンインスタンス（DSLでは`single { }`として宣言されます）
- `@Factory` - ファクトリーインスタンス。インスタンスが必要になるたびに再作成されるインスタンス用。（DSLでは`factory { }`として宣言されます）
- `@KoinViewModel` - Android ViewModelインスタンス（DSLでは`viewModel { }`として宣言されます）
- `@KoinWorker` - Android Worker Workmanagerインスタンス（DSLでは`worker { }`として宣言されます）

スコープについては、[Declaring Scopes](/docs/reference/koin-core/scopes.md)セクションを参照してください。

### Kotlin Multiplatform向けCompose ViewModelの生成 (1.4.0以降)

`@KoinViewModel`アノテーションは、デフォルトで`koin-core-viewmodel`メインDSLを使用してViewModelを生成します（2.2.0以降で有効）。これにより、Kotlin Multiplatformの互換性が提供され、統合されたViewModel APIが使用されます。

`KOIN_USE_COMPOSE_VIEWMODEL`オプションはデフォルトで有効になっています。

```groovy
ksp {
    // This is the default behavior since 2.2.0
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

これにより、マルチプラットフォームの互換性のために、`org.koin.compose.viewmodel.dsl.viewModel`で`viewModel`定義が生成されます。

:::info
- `KOIN_USE_COMPOSE_VIEWMODEL`はAnnotations 2.2.0以降、デフォルトで有効です。
- これにより、すべてのプラットフォームで統合されたViewModel APIとの一貫性が保証されます。
- 古い`USE_COMPOSE_VIEWMODEL`キーは削除されました。
:::

## 自動または特定バインディング

コンポーネントを宣言する際、検出されたすべての「バインディング」（関連するスーパークラス）は、すでに準備されています。例えば、以下の定義の場合：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koinは、`MyComponent`コンポーネントが`MyInterface`にも紐付けられることを宣言します。DSLでは`single { MyComponent(get()) } bind MyInterface::class`に相当します。

Koinに自動で検出させる代わりに、`binds`アノテーションパラメータを使用して、実際にバインドしたい型を指定することもできます。

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## Nullableな依存関係

コンポーネントがnullableな依存関係を使用している場合、心配はいりません、自動的に処理されます。定義アノテーションを使い続けるだけで、Koinが何をすべきかを推測します。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成されるDSLの等価なものは`single { MyComponent(getOrNull()) }`となります。

> これは、注入されたパラメータとプロパティにも機能することに注意してください。

## `@Named`によるQualifier

同じ型に対する複数の定義を区別するために、`@Named`アノテーションを使用して、定義に「名前」（qualifierとも呼ばれる）を追加することができます。

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

依存関係を解決する際、`named`関数でqualifierを使用するだけです。

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

カスタムqualifierアノテーションを作成することも可能です。前の例を使用すると：

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

## `@InjectedParam`による注入パラメータ

コンストラクタのメンバーを「注入パラメータ」としてタグ付けできます。これは、解決を呼び出す際に依存関係がグラフに渡されることを意味します。

例えば：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

その後、`MyComponent`を呼び出し、`MyDependency`のインスタンスを渡すことができます。

```kotlin
val m = MyDependency()
// Resolve MyComponent while passing MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

生成されるDSLの等価なものは`single { params -> MyComponent(params.get()) }`となります。

## 遅延依存関係の注入 - `Lazy<T>`

Koinは遅延依存関係を自動的に検出して解決できます。ここでは、例えば、`LoggerDataSource`定義を遅延解決したいとします。`Lazy` Kotlin型を次のように使用するだけです。

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

内部的には、`get()`の代わりに`inject()`を使用したDSLが生成されます。

```kotlin
single { LoggerAggregator(inject()) }
```

## 依存関係のリストの注入 - `List<T>`

Koinは、すべての依存関係のリストを自動的に検出して解決できます。ここでは、例えば、すべての`LoggerDataSource`定義を解決したいとします。`List` Kotlin型を次のように使用するだけです。

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

内部的には、`getAll()`関数を使用したDSLが生成されます。

```kotlin
single { LoggerAggregator(getAll()) }
```

## `@Property`によるプロパティ

定義内のKoinプロパティを解決するには、コンストラクタのメンバーに`@Property`をタグ付けするだけです。これにより、アノテーションに渡された値に基づいてKoinプロパティが解決されます。

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成されるDSLの等価なものは`factory { ComponentWithProps(getProperty("id")) }`となります。

### `@PropertyValue` - デフォルト値を持つプロパティ (1.4以降)

Koin Annotationsは、`@PropertyValue`アノテーションを使用して、コードから直接プロパティのデフォルト値を定義する機能を提供します。
例を見てみましょう：

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

生成されるDSLの等価なものは`factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAULT_ID)) }`となります。

## JSR-330互換アノテーション

Koin Annotationsは、`koin-jsr330`モジュールを介してJSR-330（Jakarta Inject）互換のアノテーションを提供します。これらのアノテーションは、Hilt、Dagger、Guiceなどの他のJSR-330互換フレームワークから移行する開発者にとって特に有用です。

### セットアップ

プロジェクトに`koin-jsr330`依存関係を追加します。

```kotlin
dependencies {
    implementation "io.insert-koin:koin-jsr330:$koin_version"
}
```

### 利用可能なJSR-330アノテーション

#### @Singleton (jakarta.inject.Singleton)

JSR-330標準のシングルトンアノテーションで、Koinの`@Single`と同等です。

```kotlin
import jakarta.inject.Singleton

@Singleton
class DatabaseService
```

これは`@Single`と同じ結果、つまりKoin内のシングルトンインスタンスを生成します。

#### @Named (jakarta.inject.Named)

文字列ベースのqualifierのためのJSR-330標準qualifierアノテーションです。

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

JSR-330標準のインジェクションアノテーションです。Koin Annotationsは明示的なコンストラクタのマーキングを必要としませんが、`@Inject`はJSR-330互換性のために使用できます。

```kotlin
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Singleton
class UserService @Inject constructor(
    private val repository: UserRepository
)
```

#### @Qualifier (jakarta.inject.Qualifier)

カスタムqualifierアノテーションを作成するためのメタアノテーションです。

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

// Use with Koin's scope system
@Scope(name = "request") 
@RequestScoped
class RequestProcessor
```

### 混合使用

同じプロジェクト内でJSR-330アノテーションとKoinアノテーションを自由に混用できます。

```kotlin
// JSR-330 style
@Singleton
@Named("primary")
class PrimaryDatabase : Database

// Koin style  
@Single
@Named("secondary")
class SecondaryDatabase : Database

// Mixed in same class
@Factory
class DatabaseManager @Inject constructor(
    @Named("primary") private val primary: Database,
    @Named("secondary") private val secondary: Database  
)
```

### フレームワーク移行のメリット

JSR-330アノテーションを使用すると、フレームワーク移行においていくつかの利点があります。

- **使い慣れたAPI**: Hilt、Dagger、Guice出身の開発者は、使い慣れたアノテーションを使用できます。
- **段階的な移行**: 既存のJSR-330アノテーション付きコードが最小限の変更で動作します。
- **標準への準拠**: JSR-330に準拠することで、依存性注入（Dependency Injection）の標準との互換性が保証されます。
- **チームのオンボーディング**: 他のDIフレームワークに慣れているチームにとって、より簡単になります。

:::info
KoinにおけるJSR-330アノテーションは、Koinの同等のものと同じ基盤となるDSLを生成します。JSR-330とKoinアノテーションのどちらを選択するかは、純粋にスタイルの問題であり、チームの好みや移行要件に基づきます。
:::