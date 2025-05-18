---
title: "Android 中使用多個 Koin 模組"
---
透過使用 Koin，你可以在模組（module）中描述定義（definitions）。在本節中，我們將了解如何宣告、組織和連結你的模組。

## 使用多個模組（Using several modules）

元件（Components）不一定需要在同一個模組中。模組是一個邏輯空間，可以幫助你組織你的定義，並且可以依賴另一個模組中的定義。定義是延遲的（lazy），它們只有在元件請求時才被解析。

讓我們看一個例子，其中連結的元件位於不同的模組中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // Singleton ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // Singleton ComponentB with linked instance ComponentA
    single { ComponentB(get()) }
}
```

當我們啟動 Koin 容器（container）時，我們只需要宣告使用的模組列表：

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 載入模組（Load modules）
            modules(moduleA, moduleB)
        }
        
    }
}
```
你可以根據 Gradle 模組自行組織，並收集多個 Koin 模組。

> 更多詳細資訊，請參閱 [Koin 模組章節](/reference/koin-core/modules.md)

## 模組包含（Module Includes）（自 3.2 起）

`Module` 類別中提供了一個新的函式 `includes()`，它允許你透過包含其他模組，以有組織和結構化的方式組合模組。

此新功能的主要用例有兩個：

- 將大型模組拆分為更小且更集中的模組。
- 在模組化專案中，它允許你更精細地控制模組的可見性（請參閱下面的範例）。

它是如何運作的？讓我們採用一些模組，並在 `parentModule` 中包含模組：

```kotlin
// `:feature` 模組（module）
val childModule1 = module {
    /* 此處的其他定義（Other definitions here）. */
}
val childModule2 = module {
    /* 此處的其他定義（Other definitions here）. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 模組（module）
startKoin { modules(parentModule) }
```

請注意，我們不需要明確設定所有模組：透過包含 `parentModule`，所有在 `includes` 中宣告的模組將自動載入（`childModule1` 和 `childModule2`）。換句話說，Koin 實際上載入的是：`parentModule`、`childModule1` 和 `childModule2`。

一個需要注意的重要細節是，你也可以使用 `includes` 來新增 `internal` 和 `private` 模組 - 這使你可以更靈活地控制在模組化專案中公開的內容。

:::info
模組載入現在已最佳化，可以展平所有模組圖，並避免重複定義模組。
:::

最後，你可以包含多個巢狀或重複的模組，Koin 將展平所有包含的模組並刪除重複項：

```kotlin
// :feature 模組（module）
val dataModule = module {
    /* 此處的其他定義（Other definitions here）. */
}
val domainModule = module {
    /* 此處的其他定義（Other definitions here）. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` 模組（module）
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // 載入模組（Load modules）
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

請注意，所有模組只會被包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

## 透過背景模組載入減少啟動時間（Reducing Startup time with background module loading）

你現在可以宣告「延遲（lazy）」Koin 模組，以避免觸發任何資源的預先分配，並在 Koin 啟動時在背景載入它們。這可以透過傳遞要在背景載入的延遲模組，來幫助避免阻止 Android 啟動過程。

- `lazyModule` - 宣告 Koin 模組的 Lazy Kotlin 版本
- `Module.includes` - 允許包含延遲模組
- `KoinApplication.lazyModules` - 使用協程在背景載入延遲模組，關於平台預設 Dispatchers
- `Koin.waitAllStartJobs` - 等待啟動工作完成
- `Koin.runOnKoinStarted` - 在啟動完成後執行程式碼區塊

一個好的例子總是有助於理解：

```kotlin

// 延遲載入模組（Lazy loaded module）
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同步模組載入（sync module loading）
    modules(m1)
    // 在背景載入延遲模組（load lazy Modules in background）
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 等待啟動完成（wait for start completion）
koin.waitAllStartJobs()

// 或在啟動後執行程式碼（or run code after start）
koin.runOnKoinStarted { koin ->
    // 在背景載入完成後執行（run after background load complete）
}
```