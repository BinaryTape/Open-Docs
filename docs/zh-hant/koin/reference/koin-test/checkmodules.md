---
title: "CheckModules - 檢查 Koin 配置 (已棄用)"
---
:::warning
此 API 已被棄用 - 自 Koin 4.0 起
:::

Koin 允許您驗證您的配置模組，避免在運行時才發現依賴注入（dependency injection）問題。

### Koin 動態檢查 - CheckModules()

在一個簡單的 JUnit 測試中調用 `checkModules()` 函數。 這將啟動您的模組並嘗試為您運行每個可能的定義。

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

* `withInstance(value)` - 將 `value` 實例添加到 Koin 圖（可以在依賴或參數中使用）

* `withInstance<MyType>()` - 將 `MyType` 的模擬實例（mocked instance）添加到 Koin 圖。 使用 MockProviderRule。（可以在依賴或參數中使用）

* `withParameter<Type>(qualifier){ qualifier -> value }` - 將 `value` 實例添加為要注入的參數

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 將 `value` 實例添加為要注入的參數

* `withProperty(key,value)` - 將屬性添加到 Koin

#### 允許使用 Junit 規則進行模擬

要將 mock 與 `checkModules` 一起使用，您需要提供 `MockProviderRule`

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 在此處使用您的框架模擬給定的 clazz
    // Mock with your framework here given clazz 
}
```

#### 驗證具有動態行為的模組 (3.1.3+)

為了驗證如下的動態行為，讓我們使用 CheckKoinModules DSL 來為我們的測試提供缺少的實例數據：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

您可以使用以下方法驗證它：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // 要添加到 Koin 的值，由定義使用
                // value to add to Koin, used by definition
                withInstance("_my_id_value")
            }
        }
    }
}
```

這樣，`FactoryPresenter` 定義將被注入上面定義的 `"_my_id_value"`。

您還可以使用模擬的實例來填充您的圖。 您可以注意到，我們需要一個 `MockProviderRule` 聲明，以允許 Koin 模擬任何注入的定義

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
        // 設置您的 mock 框架
        // Setup your nock framework
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // 將 ComponentA 的 mock 添加到 Koin
                // add a mock of ComponentA to Koin 
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### 檢查 Android 的模組 (3.1.3)

以下是如何為典型的 Android 應用程式測試您的圖：

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

如果需要，您可以為已檢查模組中的所有類型設置預設值。 例如，我們可以覆蓋所有注入的字串值：

讓我們在 `checkModules` 塊中使用 `withInstance()` 函數，為所有定義定義一個預設值：

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

所有使用注入的 `String` 參數的注入定義都將收到 `"_ID_"`：

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### 提供 ParametersOf 值 (3.1.4)

您可以使用 `withParameter` 或 `withParameters` 函數定義要為一個特定定義注入的預設值：

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

#### 提供 Scope Links

您可以使用 `checkModules` 塊中的 `withScopeLink` 函數鏈接作用域（scope），以從另一個作用域的定義中注入實例：

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
```