---
title: "模組 (Modules)"
---
使用 Koin 時，你可以在模組中描述定義。在本節中，我們將了解如何宣告、組織和連結你的模組。

## 什麼是模組？

Koin 模組是用於收集 Koin 定義的「空間」。它使用 `module` 函數宣告。

```kotlin
val myModule = module {
    // 你的定義 ...
}
```

## 使用多個模組

元件不一定需要在同一個模組中。模組是一個邏輯空間，可幫助你組織定義，並且可以依賴於其他模組的定義。定義是惰性的，因此僅在元件請求時才解析。

讓我們舉一個例子，其中連結的元件位於不同的模組中：

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

:::info
Koin 沒有任何匯入的概念。 Koin 定義是惰性的：Koin 定義隨著 Koin 容器啟動，但不會實例化。僅在請求其類型後才會建立實例。
:::

我們只需要在啟動 Koin 容器時宣告使用的模組列表：

```kotlin
// 使用 moduleA 和 moduleB 啟動 Koin
startKoin {
    modules(moduleA,moduleB)
}
```

然後，Koin 將解析所有給定模組中的依賴項。

## 覆寫定義或模組 (3.1.0+)

新的 Koin 覆寫策略允許預設情況下覆寫任何定義。 你不再需要在模組中指定 `override = true`。

如果你在不同的模組中有 2 個具有相同映射的定義，則最後一個定義將覆寫當前定義。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp 將覆寫 ServiceImp 定義
    modules(myModuleA,myModuleB)
}
```

你可以在 Koin 日誌中查看有關定義映射覆寫的信息。

你可以使用 `allowOverride(false)` 在 Koin 應用程式配置中指定不允許覆寫：

```kotlin
startKoin {
    // 禁止定義覆寫
    allowOverride(false)
}
```

如果禁用覆寫，則 Koin 將在任何覆寫嘗試時拋出 `DefinitionOverrideException` 異常。

## 分享模組

使用 `module { }` 函數時，Koin 會預先分配所有實例工廠。如果你需要分享模組，請考慮使用函數返回你的模組。

```kotlin
fun sharedModule() = module {
    // 你的定義 ...
}
```

這樣，你就可以分享定義並避免在值中預先分配工廠。

## 覆寫定義或模組 (3.1.0 之前)

Koin 不允許你重新定義已存在的定義（類型、名稱、路徑 ...）。如果嘗試執行此操作，將會收到錯誤：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// 將拋出 BeanOverrideException
startKoin {
    modules(myModuleA,myModuleB)
}
```

要允許定義覆寫，你必須使用 `override` 參數：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 此定義的覆寫
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// 允許覆寫模組中的所有定義
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
列出模組和覆寫定義時，順序很重要。 你必須將覆寫定義放在模組列表的末尾。
:::

## 連結模組策略

*由於模組之間的定義是惰性的*，因此我們可以使用模組來實現不同的策略實現：為每個模組宣告一個實現。

讓我們舉一個 Repository（儲存庫）和 Datasource（資料來源）的例子。一個 Repository 需要一個 Datasource，一個 Datasource 可以用兩種方式實現：Local（本地）或 Remote（遠端）。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

我們可以在 3 個模組中宣告這些元件：Repository 以及每個 Datasource 實現一個模組：

```kotlin
val repositoryModule = module {
    single { Repository(get()) }
}

val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}
```

然後，我們只需要使用正確的模組組合啟動 Koin：

```kotlin
// 加載 Repository + Local Datasource 定義
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// 加載 Repository + Remote Datasource 定義
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 模組包含 (自 3.2 起)

`Module` 類別中提供了一個新的函數 `includes()`，它允許你透過以有組織且結構化的方式包含其他模組來組合一個模組。

新功能的兩個突出用例是：
- 將大型模組拆分為更小、更集中的模組。
- 在模組化專案中，它允許你更精細地控制模組的可見性（請參閱以下範例）。

它是如何運作的？ 讓我們採用一些模組，然後我們在 `parentModule` 中包含模組：

```kotlin
// `:feature` 模組
val childModule1 = module {
    /* 此處的其他定義。 */
}
val childModule2 = module {
    /* 此處的其他定義。 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 模組
startKoin { modules(parentModule) }
```

請注意，我們不需要顯式設定所有模組：透過包含 `parentModule`，將自動加載在 `includes` 中宣告的所有模組（`childModule1` 和 `childModule2`）。 換句話說，Koin 正在有效地加載：`parentModule`、`childModule1` 和 `childModule2`。

需要注意的一個重要細節是，你也可以使用 `includes` 來添加 `internal` 和 `private` 模組 - 這使你可以靈活地控制在模組化專案中要公開的內容。

:::info
現在已優化模組加載以展平所有模組圖，並避免模組的重複定義。
:::

最後，你可以包含多個巢狀或重複的模組，Koin 將展平所有包含的模組，刪除重複項：

```kotlin
// :feature 模組
val dataModule = module {
    /* 此處的其他定義。 */
}
val domainModule = module {
    /* 此處的其他定義。 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` 模組
startKoin { modules(featureModule1, featureModule2) }
```

請注意，所有模組只會包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

:::info
如果在包含來自同一檔案的模組時遇到任何編譯問題，請在模組上使用 `get()` Kotlin 屬性運算符，或將每個模組分開在檔案中。 請參閱 https://github.com/InsertKoinIO/koin/issues/1341 解決方法
:::