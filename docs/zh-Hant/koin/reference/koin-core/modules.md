---
title: 模組
---

透過使用 Koin，您可以在模組中描述定義。在此章節中，我們將了解如何宣告、組織與連結您的模組。

## 什麼是模組？

Koin 模組是一個用來收集 Koin 定義的「空間」。它是使用 `module` 函式來宣告的。

```kotlin
val myModule = module {
    // 您的定義 ...
}
```

## 使用多個模組

元件不一定非得在同一個模組中。模組是一個邏輯空間，可以協助您組織定義，並且可以相依於來自其他模組的定義。定義是延遲的，只有在元件請求它們時才會進行解析。

讓我們看一個範例，其中連結的元件位於不同的模組中：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // 單例（Singleton）ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // 連結了 ComponentA 執行個體的單例 ComponentB
    single { ComponentB(get()) }
}
```

:::info 
Koin 沒有任何匯入的概念。Koin 定義是延遲的：Koin 定義會隨 Koin 容器啟動，但不會被具現化。只有在對該型別發出請求時，才會建立執行個體。
:::

我們只需要在啟動 Koin 容器時宣告所使用的模組清單：

```kotlin
// 使用 moduleA 與 moduleB 啟動 Koin
startKoin {
    modules(moduleA,moduleB)
}
```

Koin 接著會解析來自所有給定模組的相依性。

## 覆寫定義或模組 (3.1.0+)

新的 Koin 覆寫策略預設允許覆寫任何定義。您不再需要在模組中指定 `override = true`。

如果您在不同的模組中有兩個具有相同對應的定義，則最後一個將會覆寫目前的定義。

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

您可以檢查 Koin 記錄，以了解定義對應的覆寫情況。

您可以在 Koin 應用程式配置中使用 `allowOverride(false)` 來指定不允許覆寫：

```kotlin
startKoin {
    // 禁止定義覆寫
    allowOverride(false)
}
```

在停用覆寫的情況下，Koin 會在任何嘗試覆寫時拋出 `DefinitionOverrideException` 例外。

## 共享模組

當使用 `module { }` 函式時，Koin 會預先分配所有執行個體工廠。如果您需要共享模組，請考慮使用函式傳回您的模組。

```kotlin
fun sharedModule() = module {
    // 您的定義 ...
}
```

透過這種方式，您可以共享定義，並避免在變數中預先分配工廠。

## 覆寫定義或模組 (3.1.0 之前)

Koin 不允許您重新定義已存在的定義（型別、名稱、路徑 ...）。如果您嘗試這樣做，將會收到錯誤：

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

若要允許定義覆寫，您必須使用 `override` 參數：

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

// 允許模組中所有定義的覆寫
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
 列出模組與覆寫定義時，順序非常重要。您的覆寫定義必須位於模組清單的最後。
:::

## 連結模組策略

*由於模組間的定義是延遲的*，我們可以使用模組來實作不同的策略實作：為每個模組宣告一個實作。

讓我們以 Repository（存儲庫）和 Datasource（資料來源）為例。Repository 需要 Datasource，而 Datasource 可以透過兩種方式實作：本機或遠端。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

我們可以在 3 個模組中宣告這些元件：Repository 以及每個 Datasource 實作各一個：

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

接著我們只需要使用正確的模組組合來啟動 Koin：

```kotlin
// 載入 Repository + 本機 Datasource 定義
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// 載入 Repository + 遠端 Datasource 定義
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 模組包含 (自 3.2 起)

`Module` 類別中提供了一個新的函式 `includes()`，它讓您可以透過有組織且結構化的方式包含其他模組來組合模組。

此新功能的兩個主要使用案例為：
- 將大型模組拆分為更小且更專注的模組。
- 在模組化專案中，它讓您能更精細地控制模組的可見性（請參閱下方範例）。

它是如何運作的？讓我們取得一些模組，並將模組包含在 `parentModule` 中：

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

請注意，我們不需要顯式設定所有模組：透過包含 `parentModule`，宣告在 `includes` 中的所有模組都將被自動載入（`childModule1` 與 `childModule2`）。換句話說，Koin 實際上載入了：`parentModule`、`childModule1` 與 `childModule2`。

一個值得注意的重要細節是，您也可以使用 `includes` 來加入 `internal` 與 `private` 模組——這為您在模組化專案中要公開的內容提供了靈活性。

:::info
模組載入現在已針對扁平化所有模組圖進行優化，並避免模組的重複定義。
:::

最後，您可以包含多個巢狀或重複的模組，Koin 將扁平化所有包含的模組並移除重複項：

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

// `:app` 模組
startKoin { modules(featureModule1, featureModule2) }
```

請注意，所有模組都將僅被包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

:::info
如果您在包含來自同一檔案的模組時遇到任何編譯問題，請在您的模組上使用 `get()` Kotlin 屬性運算子，或將每個模組拆分到不同檔案中。請參閱 https://github.com/InsertKoinIO/koin/issues/1341 的因應措施
:::