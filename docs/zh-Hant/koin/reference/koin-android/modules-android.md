---
title: Android 中的多個 Koin 模組
---

透過使用 Koin，您可以在模組中描述定義。本節中，我們將探討如何宣告、組織及連結您的模組。

## 使用多個模組

元件不一定要在同一個模組中。模組是一個邏輯空間，能幫助您組織定義，並且可以依賴來自其他模組的定義。定義是惰性（lazy）的，它們只會在元件請求時才被解析（resolved）。

讓我們來看一個範例，其中連結的元件位於不同的模組中：

```kotlin
// ComponentB 依賴 ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // 單例 ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // 單例 ComponentB，連結了 ComponentA 的實例
    single { ComponentB(get()) }
}
```

當我們啟動 Koin 容器時，只需宣告使用的模組列表：

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
您可以自行決定如何按照 Gradle 模組來組織，並彙集多個 Koin 模組。

> 查閱 [Koin 模組章節](/docs/reference/koin-core/modules) 以了解更多詳情

## 模組包含 (Module Includes) (自 3.2 版起)

`Module` 類別中新增了 `includes()` 函式，它允許您透過有組織且結構化的方式，將其他模組包含進來以組成一個模組。

此新功能的兩個主要用途是：
- 將大型模組拆分為更小、更專注的模組。
- 在模組化專案中，它能讓您更精細地控制模組的可見性（請參閱下方範例）。

它是如何運作的呢？讓我們以一些模組為例，我們將模組包含在 `parentModule` 中：

```kotlin
// :feature 模組
val childModule1 = module {
    /* 其他定義在此。*/
}
val childModule2 = module {
    /* 其他定義在此。*/
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// :app 模組
startKoin { modules(parentModule) }
```

請注意，我們不需要明確地設定所有模組：透過包含 `parentModule`，所有在 `includes` 中宣告的模組（`childModule1` 和 `childModule2`）將會自動載入。換句話說，Koin 實際上正在載入：`parentModule`、`childModule1` 和 `childModule2`。

一個需要注意的重要細節是，您也可以使用 `includes` 來新增 `internal` 和 `private` 模組——這讓您在模組化專案中，對於要公開的內容擁有更高的彈性。

:::info
模組載入現在已最佳化，可以扁平化（flatten）所有模組圖，並避免模組的重複定義。
:::

最後，您可以包含多個巢狀或重複的模組，Koin 將會扁平化所有包含的模組，並移除重複項：

```kotlin
// :feature 模組
val dataModule = module {
    /* 其他定義在此。*/
}
val domainModule = module {
    /* 其他定義在此。*/
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// :app 模組
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

請注意，所有模組都將只被包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

## 透過背景模組載入減少啟動時間

您現在可以宣告「惰性（lazy）」Koin 模組，以避免觸發任何資源預先分配，並在 Koin 啟動時於背景載入它們。這有助於避免阻擋 Android 啟動程序，透過傳遞惰性模組在背景載入。

- `lazyModule` – 宣告 Koin 模組的惰性 Kotlin 版本。
- `Module.includes` – 允許包含惰性模組。
- `KoinApplication.lazyModules` – 考量平台預設的 Dispatchers，使用協程在背景載入惰性模組。
- `Koin.waitAllStartJobs` – 等待啟動任務完成。
- `Koin.runOnKoinStarted` – 在啟動完成後執行程式碼區塊。

一個好的範例總是有助於理解：

```kotlin

// 惰性載入模組
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同步模組載入
    modules(m1)
    // 在背景載入惰性模組
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 等待啟動完成
koin.waitAllStartJobs()

// 或在啟動後執行程式碼
koin.runOnKoinStarted { koin ->
    // 在背景載入完成後執行
}
```