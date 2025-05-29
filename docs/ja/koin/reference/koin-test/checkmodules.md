---
title: CheckModules - Koin設定の確認 (非推奨)
---

:::warning
このAPIは非推奨になりました - Koin 4.0以降
:::

Koinは、設定モジュールを検証することで、実行時（runtime）に依存性注入（dependency injection）の問題が発覚するのを防ぎます。

### Koin動的チェック - CheckModules()

シンプルなJUnitテスト内で`checkModules()`関数を呼び出します。これにより、モジュールが起動され、各可能な定義が実行を試みられます。

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

`checkKoinModules`も使用できます。

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

注入されたパラメータ、プロパティ、または動的なインスタンスを使用する任意の定義では、`checkModules` DSLを使用すると、以下のケースにどのように対応するかを指定できます。

*   `withInstance(value)` - `value`インスタンスをKoinグラフに追加します (依存性またはパラメータとして使用可能)

*   `withInstance<MyType>()` - `MyType`のモックインスタンスを追加します。`MockProviderRule`を使用します。(依存性またはパラメータとして使用可能)

*   `withParameter<Type>(qualifier){ qualifier -> value }` - `value`インスタンスがパラメータとして注入されるように追加します

*   `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - `value`インスタンスがパラメータとして注入されるように追加します

*   `withProperty(key,value)` - Koinにプロパティを追加します

#### JUnitルールを使ったモックの許可

`checkModules`でモックを使用するには、`MockProviderRule`を提供する必要があります。

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // Mock with your framework here given clazz 
}
```

#### 動的な振る舞いを持つモジュールの検証 (3.1.3+)

以下のような動的な振る舞いを検証するには、テストに不足しているインスタンスデータを提供するためにCheckKoinModules DSLを使用します。

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

以下のように検証できます。

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

このようにして、`FactoryPresenter`の定義は、上記で定義された`"_my_id_value"`で注入されます。

グラフを埋めるために、モックされたインスタンスを使用することもできます。Koinが注入された任意の定義をモックできるようにするためには、`MockProviderRule`の宣言が必要であることに気づくでしょう。

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

#### Android用モジュールのチェック (3.1.3)

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

`checkKoinModules`も使用できます。

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

必要であれば、チェック対象のモジュール内のすべての型にデフォルト値を設定できます。例えば、注入されたすべての文字列値をオーバーライドできます。

すべての定義に対してデフォルト値を定義するために、`checkModules`ブロック内で`withInstance()`関数を使用しましょう。

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

注入された`String`パラメータを使用しているすべての定義は、`"_ID_"`を受け取ります。

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### ParametersOf値の提供 (3.1.4)

`withParameter`または`withParameters`関数を使って、特定の定義に注入されるデフォルト値を定義できます。

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

`checkModules`ブロック内で`withScopeLink`関数を使用することで、スコープをリンクし、別のスコープの定義からインスタンスを注入できます。

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