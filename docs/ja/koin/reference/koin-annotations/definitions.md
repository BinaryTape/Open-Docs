---
title: アノテーションによる定義
---

Koinアノテーションを使用すると、通常のKoin DSLと同じ種類の定義を宣言できますが、アノテーションを使って行います。クラスに必要なアノテーションをタグ付けするだけで、すべてが自動的に生成されます！

例えば、`single { MyComponent(get()) }`というDSL宣言に相当するものは、次のように`@Single`でタグ付けするだけで実現できます。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koinアノテーションは、Koin DSLと同じセマンティクスを維持します。以下の定義でコンポーネントを宣言できます。

- `@Single` - シングルトンインスタンス（DSLでは`single { }`として宣言されます）
- `@Factory` - ファクトリーインスタンス。インスタンスが必要になるたびに再作成されるインスタンス用。（DSLでは`factory { }`として宣言されます）
- `@KoinViewModel` - Android ViewModelインスタンス（DSLでは`viewModel { }`として宣言されます）
- `@KoinWorker` - Android Worker Workmanagerインスタンス（DSLでは`worker { }`として宣言されます）

スコープについては、[Declaring Scopes](/docs/reference/koin-core/scopes.md)セクションを参照してください。

### Kotlin Multipaltform向けCompose ViewModelの生成 (1.4.0以降)

`@KoinViewModel`アノテーションは、AndroidまたはCompsoe KMP ViewModelのいずれかを生成するために使用できます。通常の`org.koin.androidx.viewmodel.dsl.viewModel`の代わりに`org.koin.compose.viewmodel.dsl.viewModel`を使用して`viewModel` Koin定義を生成するには、`KOIN_USE_COMPOSE_VIEWMODEL`オプションを有効にする必要があります。

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
`USE_COMPOSE_VIEWMODEL`キーは、`KOIN_USE_COMPOSE_VIEWMODEL`の使用が推奨されるため、非推奨です。
:::

:::note
Koin 4.0では、ViewModel型argiumentが同じライブラリから提供されるため、これら2つのViewModel DSLが1つに統合される予定です。
:::

## 自動バインディングまたは特定バインディング

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

カスタムQualifierアノテーションを作成することも可能です。前の例を使用すると：

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
val m = MyDependency
// Resolve MyComponent while passing  MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

生成されるDSLの等価なものは`single { params -> MyComponent(params.get()) }`となります。

## 遅延依存関係の注入 - `Lazy<T>`

Koinは遅延依存関係を自動的に検出して解決できます。例えば、ここでは`LoggerDataSource`の定義を遅延解決したいとします。`Lazy` Kotlin型を次のように使用するだけです。

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

Koinは、すべての依存関係のリストを自動的に検出して解決できます。例えば、ここではすべての`LoggerDataSource`定義を解決したいとします。`List` Kotlin型を次のように使用するだけです。

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

Koinアノテーションは、`@PropertyValue`アノテーションを使用して、コードから直接プロパティのデフォルト値を定義する機能を提供します。
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

生成されるDSLの等価なものは`factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`となります。