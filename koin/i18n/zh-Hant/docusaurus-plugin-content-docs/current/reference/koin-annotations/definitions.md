---
title: 帶註解的定義
---
Koin Annotations 允許宣告與常規 Koin DSL 相同類型的定義，但使用註解（annotations）。只需用所需的註解標記您的類別，它就會為您生成一切！

例如，等效於 `single { MyComponent(get()) }` DSL 宣告，只需用 `@Single` 標記，如下所示：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency)
```

Koin Annotations 保持與 Koin DSL 相同的語意。您可以使用以下定義宣告您的元件：

- `@Single` - 單例實例 (在 DSL 中用 `single { }` 宣告)
- `@Factory` - 工廠實例。用於每次需要實例時重新建立的實例。(在 DSL 中用 `factory { }` 宣告)
- `@KoinViewModel` - Android ViewModel 實例 (在 DSL 中用 `viewModel { }` 宣告)
- `@KoinWorker` - Android Worker Workmanager 實例 (在 DSL 中用 `worker { }` 宣告)

對於 Scopes，請查看 [宣告 Scopes](/reference/koin-core/scopes.md) 部分。

### 為 Kotlin Multipaltform 產生 Compose ViewModel (自 1.4.0 起)

`@KoinViewModel` 註解可用於產生 Android 或 Compsoe KMP ViewModel。若要使用 `org.koin.compose.viewmodel.dsl.viewModel` 而不是常規 `org.koin.androidx.viewmodel.dsl.viewModel` 產生 `viewModel` Koin 定義，您需要啟用 `KOIN_USE_COMPOSE_VIEWMODEL` 選項：

```groovy
ksp {
    arg("KOIN_USE_COMPOSE_VIEWMODEL","true")
}
```

:::note
    `USE_COMPOSE_VIEWMODEL` 鍵已棄用，改用 `KOIN_USE_COMPOSE_VIEWMODEL`
:::

:::note
    Koin 4.0 應將這 2 個 ViewModel DSL 合併為只有一個，因為 ViewModel 類型引數來自同一個庫
:::

## 自動或特定綁定 (Binding)

當宣告一個元件時，所有檢測到的「綁定」（關聯的超類型）都將為您準備好。例如，以下定義：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency) : MyInterface
```

Koin 將宣告您的 `MyComponent` 元件也與 `MyInterface` 綁定。DSL 等效項是 `single { MyComponent(get()) } bind MyInterface::class`。

除了讓 Koin 為您檢測外，您還可以指定您真正想要綁定的類型，使用 `binds` 註解參數：

 ```kotlin
@Single(binds = [MyBoundType::class])
```

## 可為 Null 的依賴 (Nullable Dependencies)

如果您的元件正在使用可為 null 的依賴，請不要擔心，它會自動為您處理。繼續使用您的定義註解，Koin 會猜測該怎麼做：

```kotlin
@Single
class MyComponent(val myDependency : MyDependency?)
```

產生的 DSL 等效項將是 `single { MyComponent(getOrNull()) }`

> 請注意，這也適用於注入的參數和屬性

## 使用 @Named 的 Qualifier

您可以向定義添加一個「名稱」（也稱為 qualifier），以區分同一類型的多個定義，使用 `@Named` 註解：

```kotlin
@Single
@Named("InMemoryLogger")
class LoggerInMemoryDataSource : LoggerDataSource

@Single
@Named("DatabaseLogger")
class LoggerLocalDataSource(private val logDao: LogDao) : LoggerDataSource
```

當解析依賴時，只需使用帶有 `named` 函數的 qualifier：

```kotlin
val logger: LoggerDataSource by inject(named("InMemoryLogger"))
```

也可以建立自定義 qualifier 註解。使用前面的例子：

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

## 使用 @InjectedParam 注入的參數 (Injected Parameters)

您可以將建構函數成員標記為「注入的參數」，這表示在呼叫解析時，依賴將在圖表中傳遞。

例如：

```kotlin
@Single
class MyComponent(@InjectedParam val myDependency : MyDependency)
```

然後您可以呼叫您的 `MyComponent` 並傳遞一個 `MyDependency` 的實例：

```kotlin
val m = MyDependency
// 解析 MyComponent，同時傳遞 MyDependency
koin.get<MyComponent> { parametersOf(m) }
```

產生的 DSL 等效項將是 `single { params -> MyComponent(params.get()) }`

## 注入延遲依賴 - `Lazy<T>`

Koin 可以自動檢測和解析延遲依賴。例如，在這裡，我們希望延遲解析 `LoggerDataSource` 定義。您只需要使用 `Lazy` Kotlin 類型，如下所示：

```kotlin
@Single
class LoggerInMemoryDataSource : LoggerDataSource

@Single
class LoggerAggregator(val lazyLogger : Lazy<LoggerDataSource>)
```

它將在後台生成類似於 `inject()` 而不是 `get()` 的 DSL：

```kotlin
single { LoggerAggregator(inject()) }
```

## 注入依賴列表 - `List<T>`

Koin 可以自動檢測和解析所有依賴列表。例如，在這裡，我們想要解析所有 `LoggerDataSource` 定義。您只需要使用 `List` Kotlin 類型，如下所示：

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

它將在後台生成類似於 `getAll()` 函數的 DSL：

```kotlin
single { LoggerAggregator(getAll()) }
```

## 使用 @Property 的屬性 (Properties)

若要在您的定義中解析 Koin 屬性，只需用 `@Property` 標記建構函數成員。Ths 將解析 Koin 屬性，這要歸功於傳遞給註解的值：

```kotlin
@Factory
public class ComponentWithProps(
    @Property("id") public val id : String
)
```

產生的 DSL 等效項將是 `factory { ComponentWithProps(getProperty("id")) }`

### @PropertyValue - 具有預設值的屬性 (自 1.4 起)

Koin Annotations 使您可以直接從您的程式碼中使用 `@PropertyValue` 註解為屬性定義預設值。
讓我們繼續我們的範例：

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

產生的 DSL 等效項將是 `factory { ComponentWithProps(getProperty("id", ComponentWithProps.DEFAAULT_ID)) }`