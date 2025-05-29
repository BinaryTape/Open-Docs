---
title: CheckModules - 檢查 Koin 設定 (已棄用)
---

:::warning
此 API 現已棄用 - 自 Koin 4.0 起
:::

Koin 允許您驗證您的設定模組，避免在執行時才發現依賴注入問題。

### Koin 動態檢查 - CheckModules()

在簡單的 JUnit 測試中調用 `checkModules()` 函式。這將啟動您的模組並嘗試執行每個可能的定義。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(module1,module2)
            checkModules()
        }
    }
}
```

也可以使用 `checkKoinModules`：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

對於任何使用注入參數、屬性或動態實例的定義，`checkModules` DSL 允許指定如何處理以下情況：

*   `withInstance(value)` - 將 `value` 實例添加到 Koin 圖中 (可用於依賴或參數)
*   `withInstance<MyType>()` - 將添加 `MyType` 的模擬實例。使用 MockProviderRule。(可用於依賴或參數)
*   `withParameter<Type>(qualifier){ qualifier -> value }` - 將添加 `value` 實例以作為參數注入
*   `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 將添加 `value` 實例以作為參數注入
*   `withProperty(key,value)` - 向 Koin 添加屬性

#### 允許使用 JUnit 規則進行模擬

要將模擬與 `checkModules` 一起使用，您需要提供一個 `MockProviderRule`

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Mock with your framework here given clazz 
}
```

#### 驗證具有動態行為的模組 (3.1.3+)

為了驗證以下動態行為，我們可以使用 CheckKoinModules DSL 為我們的測試提供缺失的實例資料：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

您可以透過以下方式驗證它：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // value to add to Koin, used by definition
                withInstance("_my_id_value")
            }
        }
    }
}
```

如此一來，`FactoryPresenter` 定義將會被注入上方定義的 `"_my_id_value"`。

您也可以使用模擬實例來填充您的圖。您可以注意到我們需要一個 `MockProviderRule` 宣告，以允許 Koin 模擬任何注入的定義

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// or
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // Setup your nock framework
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // add a mock of ComponentA to Koin 
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### 檢查 Android 模組 (3.1.3)

以下是您如何測試典型 Android 應用程式的圖：

```kotlin
class CheckModulesTest {

    @get:Rule
    val rule: TestRule = InstantTaskExecutorRule()

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `test DI modules`(){
        koinApplication {
            modules(allModules)
            checkModules(){
                withInstance<Context>()
                withInstance<Application>()
                withInstance<SavedStateHandle>()
                withInstance<WorkerParameters>()
            }
        }
    }
}
```

也可以使用 `checkKoinModules`：

```kotlin
class CheckModulesTest {

    @get:Rule
    val rule: TestRule = InstantTaskExecutorRule()

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `test DI modules`(){
        checkKoinModules(allModules) {
            withInstance<Context>()
            withInstance<Application>()
            withInstance<SavedStateHandle>()
            withInstance<WorkerParameters>()
        }
    }
}
```

#### 提供預設值 (3.1.4)

如果需要，您可以為已檢查模組中的所有類型設定預設值。例如，我們可以覆寫所有注入的字串值：

讓我們在 `checkModules` 區塊中使用 `withInstance()` 函式，為所有定義設定預設值：

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(allModules)
        checkModules(){
            withInstance("_ID_")
        }
    }
}
```

所有使用注入 `String` 參數的注入定義都將收到 `"_ID_"`：

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### 提供 ParametersOf 值 (3.1.4)

您可以為一個特定定義設定要注入的預設值，使用 `withParameter` 或 `withParameters` 函式：

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(allModules)
        checkModules(){
            withParameter<FactoryPresenter> { "_FactoryId_" }
            withParameters<FactoryPresenter> { parametersOf("_FactoryId_",...) }
        }
    }
}
```

#### 提供範圍連結

您可以在 `checkModules` 區塊中使用 `withScopeLink` 函式來連結範圍，以從另一個範圍的定義注入實例：

```kotlin
val myModule = module {
    scope(named("scope1")) {
        scoped { ComponentA() }
    }
    scope(named("scope2")) {
        scoped { ComponentB(get()) }
    }
}
```

```kotlin
@Test
fun `test DI modules`(){
    koinApplication {
        modules(myModule)
        checkModules(){
            withScopeLink(named("scope2"), named("scope1"))
        }
    }
}