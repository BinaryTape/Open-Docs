---
title: Android 中的多個 Koin 模組
---

透過使用 Koin，您可以在模組中描述定義。在本節中，我們將介紹如何宣告、組織以及連結您的模組。

## 使用多個模組

元件不一定非得位於同一個模組中。模組是一個邏輯空間，可協助您組織定義，並且可以相依於來自另一個模組的定義。定義是延遲載入（lazy）的，只有在元件請求它們時才會進行解析。

讓我們來看一個範例，其中連結的元件位於不同的模組中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // 單例 ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // 具有連結執行個體 ComponentA 的單例 ComponentB
    single { ComponentB(get()) }
}
```

我們只需在啟動 Koin 容器時宣告所使用的模組清單：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 載入模組
            modules(moduleA, moduleB)
        }
        
    }
}
```
您可以根據 Gradle 模組自行組織，並收集多個 Koin 模組。

> 欲瞭解更多詳情，請參閱 [Koin 模組章節](/docs/reference/koin-core/modules)

## 模組包含 (自 3.2 版本起)

`Module` 類別中提供了一個新的函式 `includes()`，它讓您能透過包含其他模組，以有組織且結構化的方式來組合模組。

此新功能的兩個主要使用案例為：
- 將大型模組拆分為更小且更專注的模組。
- 在模組化專案中，它讓您能更精細地控制模組的可見性（見下方範例）。

它是如何運行的？讓我們定義一些模組，並將這些模組包含在 `parentModule` 中：

```kotlin
// `:feature` 模組
val childModule1 = module {
    /* 此處為其他定義。 */
}
val childModule2 = module {
    /* 此處為其他定義。 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 模組
startKoin { modules(parentModule) }
```

請注意，我們不需要明確設定所有模組：透過包含 `parentModule`，所有在 `includes` 中宣告的模組都將被自動載入（`childModule1` 和 `childModule2`）。換句話說，Koin 實際上載入了：`parentModule`、`childModule1` 和 `childModule2`。

一個值得注意的重要細節是，您也可以使用 `includes` 來新增 `internal` 和 `private` 模組——這讓您在模組化專案中能彈性地決定要公開哪些內容。

:::info
模組載入現在已針對展平（flatten）所有模組圖進行了最佳化，並能避免重複的模組定義。
:::

最後，您可以包含多個巢狀或重複的模組，Koin 會展平所有包含的模組並移除重複項：

```kotlin
// :feature 模組
val dataModule = module {
    /* 此處為其他定義。 */
}
val domainModule = module {
    /* 此處為其他定義。 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` 模組
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 載入模組
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

請注意，所有模組都將僅被包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

## 透過背景模組載入縮短啟動時間

您現在可以宣告「延遲（lazy）」Koin 模組，以避免觸發任何資源的預先分配，並在 Koin 啟動時於背景載入它們。這可以透過傳遞要在背景載入的延遲模組，來協助避免阻塞 Android 啟動程序。

- `lazyModule` - 宣告 Koin 模組的延遲 Kotlin 版本
- `Module.includes` - 允許包含延遲模組
- `KoinApplication.lazyModules` - 根據平台預設的 `Dispatchers`，使用協同程式在背景載入延遲模組
- `Koin.waitAllStartJobs` - 等待啟動任務完成
- `Koin.runOnKoinStarted` - 在啟動完成後執行程式碼區塊

透過範例會更容易理解：

```kotlin

// 延遲載入的模組
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同步模組載入
    modules(m1)
    // 在背景載入延遲模組
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 等待啟動完成
koin.waitAllStartJobs()

// 或在啟動後執行程式碼
koin.runOnKoinStarted { koin ->
    // 在背景載入完成後執行
}