---
title: CheckModules - Koin設定のチェック (非推奨)
---

:::warning
このAPIは現在非推奨です - Koin 4.0以降
:::

Koinを使用すると、設定モジュールを検証し、実行時に依存関係注入の問題が発生するのを防ぐことができます。

### Koin動的チェック - CheckModules()  

単純なJUnitテスト内で `checkModules()` 関数を呼び出します。これにより、モジュールが起動され、可能なすべての定義の実行が試行されます。

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

`checkKoinModules` を使用することも可能です：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        checkKoinModules(listOf(module1,module2))
    }
}
```

#### CheckModule DSL

注入されたパラメータ、プロパティ、または動的なインスタンスを使用する定義に対して、`checkModules` DSLを使用すると、以下のケースをどのように処理するか指定できます：

* `withInstance(value)` - `value` インスタンスをKoinグラフに追加します（依存関係またはパラメータで使用可能）。

* `withInstance<MyType>()` - `MyType` のモックインスタンスを追加します。`MockProviderRule` を使用してください（依存関係またはパラメータで使用可能）。

* `withParameter<Type>(qualifier){ qualifier -> value }` - パラメータとして注入される `value` インスタンスを追加します。

* `withParameter<Type>(qualifier){ qualifier -> parametersOf(...) }` - パラメータとして注入される `value` インスタンスを追加します。

* `withProperty(key,value)` - Koinにプロパティを追加します。

#### JUnitルールによるモックの許可

`checkModules` でモックを使用するには、`MockProviderRule` を提供する必要があります。

```kotlin
@get:Rule
val mockProvider = MockProviderRule.create { clazz ->
    // ここで clazz に基づいて使用するフレームワークでモックを作成します 
}
```

#### 動的動作を伴うモジュールの検証 (3.1.3+)

以下のような動的な動作を検証するには、`CheckKoinModules` DSLを使用して、テストに不足しているインスタンスデータを提供しましょう：

```kotlin
val myModule = module {
    factory { (id: String) -> FactoryPresenter(id) }
}
```

以下のように検証できます：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule)
            checkModules(){
                // Koinに追加する値。定義で使用されます
                withInstance("_my_id_value")
            }
        }
    }
}
```

これにより、`FactoryPresenter` の定義には、上記で定義した `"_my_id_value"` が注入されます。

また、モックインスタンスを使用してグラフを埋めることもできます。Koinがいずれの注入定義もモックできるようにするために、`MockProviderRule` の宣言が必要であることに注意してください。

```kotlin
val myModule1 = module {
    factory { (a : ComponentA) -> ComponentB(a) }
}
// または
val myModule2 = module {
    factory { ComponentB(get()) }
}
```

```kotlin
class CheckModulesTest : KoinTest {
    
    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        // モックフレームワークをセットアップします
        Mockito.mock(clazz.java)
    }

    @Test
    fun verifyKoinApp() {
        
        koinApplication {
            modules(myModule1)
            checkModules(){
                // ComponentA のモックを Koin に追加 
                withInstance<ComponentA>()
            }
        }
    }
}
```

#### Android用モジュールのチェック (3.1.3)

以下は、一般的なAndroidアプリのグラフをテストする方法です：

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

`checkKoinModules` を使用することも可能です：

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

必要に応じて、チェック対象のモジュール内のすべての型に対してデフォルト値を設定できます。例えば、注入されるすべての文字列の値をオーバーライドできます：

すべての定義に対してデフォルト値を定義するために、`checkModules` ブロック内で `withInstance()` 関数を使用しましょう：

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

注入された `String` パラメータを使用するすべての注入定義は、`"_ID_"` を受け取ります：

```kotlin
module {
    single { (i: String) -> Simple.ComponentC(i) }
    factory { (id: String) -> FactoryPresenter(id) }
}
```

#### ParametersOf 値の提供 (3.1.4)

`withParameter` または `withParameters` 関数を使用して、特定の定義に対して注入されるデフォルト値を定義できます：

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

`checkModules` ブロックで `withScopeLink` 関数を使用してスコープをリンクし、別のスコープの定義からインスタンスを注入できます：

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