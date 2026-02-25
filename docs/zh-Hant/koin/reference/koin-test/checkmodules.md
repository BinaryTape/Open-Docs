---
title: CheckModules - 檢查 Koin 配置 (已棄用)
---

:::warning
此 API 目前已棄用 - 自 Koin 4.0 起
:::

Koin 允許您驗證您的配置模組，避免在執行時才發現相依注入問題。

### Koin 動態檢查 - CheckModules()  

在簡單的 JUnit 測試中呼叫 `checkModules()` 函式。這將啟動您的模組，並嘗試為您執行每個可能的定義。

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

對於任何使用注入參數、屬性或動態執行個體的定義，`checkModules` DSL 允許指定如何處理以下情況：

* `withInstance(value)` - 將 `value` 執行個體新增到 Koin 圖中 (可用於相依性或參數)

* `withInstance<MyType>()` - 將新增 `MyType` 的模擬執行個體。使用 MockProviderRule。(可用於相依性或參數)

* `withParameter<Type>(qualifier){ qualifier -> value }` - 將新增要作為參數注入的 `value` 執行個體

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - 將新增要作為參數注入的 `value` 執行個體

* `withProperty(key,value)` - 將屬性新增到 Koin

#### 允許使用 JUnit 規則進行模擬

若要在 `checkModules` 中使用模擬 (mocks)，您需要提供一個 `MockProviderRule`

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // 在此根據 clazz 使用您的框架進行模擬 
}
```

#### 驗證具備動態行為的模組 (3.1.3+)

若要驗證如下所示的動態行為，讓我們使用 CheckKoinModules DSL 為我們的測試提供缺失的執行個體資料：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

您可以使用以下方式進行驗證：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // 要新增到 Koin 的值，供定義使用
                withInstance("_my_id_value")
            }
        }
    }
}
```

透過這種方式，`FactoryPresenter` 定義將被注入上方定義的 `"_my_id_value"`。

您也可以使用模擬執行個體來填充您的圖。您可以注意到我們需要一個 `MockProviderRule` 宣告，以允許 Koin 模擬任何注入的定義

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// 或
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // 設定您的模擬框架
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // 將 ComponentA 的模擬物件新增到 Koin 
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### 針對 Android 檢查模組 (3.1.3)

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

如果需要，您可以為檢查模組中的所有型別設定預設值。例如，我們可以覆寫所有注入的字串值：

讓我們在 `checkModules` 區塊中使用 `withInstance()` 函式，為所有定義定義一個預設值：

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

#### 提供 parametersOf 值 (3.1.4)

您可以使用 `withParameter` 或 `withParameters` 函式為一個特定的定義定義要注入的預設值：

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

#### 提供作用域連結

您可以在 `checkModules` 區塊中使用 `withScopeLink` 函式來連結作用域 (Scope)，以便從另一個作用域的定義中注入執行個體：

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