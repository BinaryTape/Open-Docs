---
title: "注釈付きの定義 (Definitions with Annotations)"
---
Koin Annotationsを使用すると、通常のKoin DSLと同じ種類の定義をアノテーションで宣言できます。必要なアノテーションでクラスをタグ付けするだけで、すべてが自動的に生成されます。

たとえば、`single { MyComponent(get()) }` DSL宣言と同等のものは、次のように`@Single`でタグ付けするだけで実現できます。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotationsは、Koin DSLと同じセマンティクスを維持します。次の定義でコンポーネントを宣言できます。

- `@Single` - シングルトンインスタンス（DSLでは`single { }`で宣言）
- `@Factory` - ファクトリインスタンス。インスタンスが必要になるたびに再作成されます（DSLでは`factory { }`で宣言）
- `@KoinViewModel` - Android ViewModelインスタンス（DSLでは`viewModel { }`で宣言）
- `@KoinWorker` - Android Worker Workmanagerインスタンス（DSLでは`worker { }`で宣言）

スコープについては、[スコープの宣言](/reference/koin-core/scopes.md)セクションを確認してください。

### Kotlin Multiplatform 用の Compose ViewModel を生成 (1.4.0 以降)

`@KoinViewModel` アノテーションを使用して、Android または Compsoe KMP ViewModel を生成できます。通常の `org.koin.androidx.viewmodel.dsl.viewModel` の代わりに、`org.koin.compose.viewmodel.dsl.viewModel` で `viewModel` Koin 定義を生成するには、`KOIN_USE_COMPOSE_VIEWMODEL` オプションを有効にする必要があります。

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
    `USE_COMPOSE_VIEWMODEL` キーは非推奨となり、`KOIN_USE_COMPOSE_VIEWMODEL` が推奨されます。
:::

:::note
    Koin 4.0 では、ViewModel の型引数が同じライブラリから提供されるため、これら 2 つの ViewModel DSL が 1 つにマージされる予定です。
:::

## 自動または特定のバインディング

コンポーネントを宣言するときに、検出されたすべての「バインディング」（関連するスーパークラス）がすでに準備されています。たとえば、次の定義を見てください。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koinは、`MyComponent`コンポーネントが`MyInterface`にも関連付けられていることを宣言します。 DSLの同等物は`single { MyComponent(get()) } bind MyInterface::class`です。

Koinに自動検出させる代わりに、`binds`アノテーションパラメータを使用して、実際にバインドするタイプを指定することもできます。

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## Null許容の依存関係 (Nullable Dependencies)

コンポーネントがnull許容の依存関係を使用している場合でも、心配する必要はありません。自動的に処理されます。定義アノテーションを引き続き使用すると、Koinが何をすべきかを推測します。

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

生成されるDSLの同等物は`single { MyComponent(getOrNull()) }`です。

> これは、注入されたパラメータとプロパティにも適用されることに注意してください。

## @Named による限定子 (Qualifier)

定義に「名前」（別名限定子 (qualifier)）を追加して、同じタイプの複数の定義を区別するために、`@Named`アノテーションを使用します。

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

依存関係を解決するときは、`named`関数で限定子 (qualifier)を使用します。

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

カスタム限定子 (qualifier)アノテーションを作成することも可能です。前の例を使用すると、次のようになります。

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

## @InjectedParam を使用した注入されたパラメータ

コンストラクタメンバーを「注入されたパラメータ」としてタグ付けできます。これは、解決を呼び出すときに依存関係がグラフに渡されることを意味します。

例：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

次に、`MyComponent`を呼び出して、`MyDependency`のインスタンスを渡すことができます。

```kotlin
val m = MyDependency
// MyDependencyを渡しながらMyComponentを解決する
koin.get<MyComponent> { parametersOf(m) }
```

生成されるDSLの同等物は`single { params -> MyComponent(params.get()) }`です。

## 遅延依存関係の注入 - `Lazy<T>`

Koinは、遅延依存関係を自動的に検出し、解決できます。たとえば、ここでは`LoggerDataSource`定義を遅延的に解決します。 `Lazy` Kotlinタイプを次のように使用するだけです。

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

背後では、`get()`ではなく`inject()`のようなDSLが生成されます。

```kotlin
single { LoggerAggregator(inject()) }
```

## 依存関係のリストの注入 - `List<T>`

Koinは、依存関係のリストをすべて自動的に検出し、解決できます。たとえば、ここではすべての`LoggerDataSource`定義を解決します。 `List` Kotlinタイプを次のように使用するだけです。

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

背後では、`getAll()`関数のようなDSLが生成されます。

```kotlin
single { LoggerAggregator(getAll()) }
```

## @Property を使用したプロパティ

定義でKoinプロパティを解決するには、コンストラクタメンバーに`@Property`のタグを付けます。 これにより、アノテーションに渡される値のおかげでKoinプロパティが解決されます。

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

生成されるDSLの同等物は`factory { ComponentWithProps(getProperty("id")) }`です。

### @PropertyValue - デフォルト値を持つプロパティ (1.4以降)

Koin Annotationsは、`@PropertyValue`アノテーションを使用して、コードから直接プロパティのデフォルト値を定義する可能性を提供します。
サンプルに従いましょう。

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

生成されるDSLの同等物は`factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`です。