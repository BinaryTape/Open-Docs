---
title: "CheckModules - Koin構成のチェック (非推奨)"
---
:::warning
このAPIは現在非推奨です - Koin 4.0 以降
:::

Koinを使用すると、構成モジュールを検証して、実行時の依存性注入の問題を回避できます。

### Koin Dynamic Check - CheckModules()

JUnitテスト内で`checkModules()`関数を呼び出します。これにより、モジュールが起動され、可能な定義ごとに実行が試行されます。

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

`checkKoinModules`を使用することもできます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

注入されたパラメータ、プロパティ、または動的インスタンスを使用する定義の場合、`checkModules` DSLを使用すると、次のケースでの動作を指定できます。

* `withInstance(value)` - `value` インスタンスをKoinグラフに追加します（依存関係またはパラメータで使用できます）。

* `withInstance<MyType>()` - `MyType`のモックインスタンスを追加します。 MockProviderRuleを使用してください。（依存関係またはパラメータで使用できます）。

* `withParameter<Type>(qualifier){ qualifier -> value }` - `value` インスタンスをパラメータとして注入するように追加します。

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - `value` インスタンスをパラメータとして注入するように追加します。

* `withProperty(key,value)` - プロパティをKoinに追加します。

#### Junitルールによるモックの許可

`checkModules`でモックを使用するには、`MockProviderRule`を提供する必要があります。

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Mock with your framework here given clazz 
}
```

#### 動的動作を持つモジュールの検証 (3.1.3+)

次のような動的な動作を検証するには、CheckKoinModules DSLを使用して、テストに必要なインスタンスデータを提供しましょう。

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

次のようにして検証できます。

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

このようにして、`FactoryPresenter`の定義は、上記で定義した`"_my_id_value"`で注入されます。

モックインスタンスを使用して、グラフを埋めることもできます。Koinが注入された定義をモックできるようにするには、`MockProviderRule`の宣言が必要であることに注意してください。

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

#### Android 用モジュールのチェック (3.1.3)

以下に、典型的なAndroidアプリのグラフをテストする方法を示します。

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

`checkKoinModules`を使用することもできます。

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

#### デフォルト値の提供 (3.1.4)

必要に応じて、チェックされたモジュールのすべてのタイプにデフォルト値を設定できます。たとえば、注入されたすべての文字列値をオーバーライドできます。

`checkModules`ブロックで`withInstance()`関数を使用して、すべての定義のデフォルト値を定義しましょう。

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

注入された`String`パラメータを使用している注入された定義はすべて、`"_ID_"`を受け取ります。

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### ParametersOf 値の提供 (3.1.4)

`withParameter`または`withParameters`関数を使用して、特定の定義に注入されるデフォルト値を定義できます。

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

#### スコープリンクの提供

`checkModules`ブロックで`withScopeLink`関数を使用してスコープをリンクし、別のスコープの定義からインスタンスを注入できます。

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
```