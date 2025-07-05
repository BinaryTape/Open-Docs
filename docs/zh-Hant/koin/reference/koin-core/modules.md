---
title: 模組
---

使用 Koin，您可以在模組中描述定義。本節我們將探討如何宣告、組織及連結您的模組。

## 什麼是模組？

Koin 模組是一個用於彙集 Koin 定義的「空間」。它使用 `module` 函式來宣告。

```kotlin
val myModule = module {
    // Your definitions ...
}
```

## 使用多個模組

元件不一定必須在同一個模組中。模組是一個邏輯空間，可幫助您組織定義，並且可以依賴其他模組中的定義。定義是延遲載入的，僅在元件請求時才被解析。

讓我們舉一個範例，其中包含在獨立模組中連結的元件：

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
Koin 沒有任何匯入概念。Koin 定義是延遲載入的：Koin 定義會隨 Koin 容器啟動，但不會立即實例化。僅當該型別被請求時才會建立實例。
:::

我們只需在啟動 Koin 容器時宣告所使用的模組清單：

```kotlin
// Start Koin with moduleA & moduleB
startKoin {
    modules(moduleA,moduleB)
}
```

Koin 接著將解析所有提供的模組中的依賴項。

## 覆寫定義或模組 (3.1.0+)

新的 Koin 覆寫策略預設允許覆寫任何定義。您不再需要在模組中指定 `override = true`。

如果您在不同模組中有兩個具有相同映射的定義，後一個將會覆寫當前定義。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp will override ServiceImp definition
    modules(myModuleA,myModuleB)
}
```

您可以在 Koin 日誌中查看有關定義映射覆寫的資訊。

您可以在 Koin 應用程式配置中使用 `allowOverride(false)` 指定不允許覆寫：

```kotlin
startKoin {
    // Forbid definition override
    allowOverride(false)
}
```

在禁用覆寫的情況下，Koin 將在任何嘗試覆寫時拋出 `DefinitionOverrideException` 異常。

## 共享模組

當使用 `module { }` 函式時，Koin 會預先分配所有實例工廠。如果您需要共享模組，請考慮使用函式回傳您的模組。

```kotlin
fun sharedModule() = module {
    // Your definitions ...
}
```

這樣，您就可以共享這些定義，並避免將工廠預先分配到一個值中。

## 覆寫定義或模組 (3.1.0 之前)

Koin 不允許您重新定義一個已存在的定義（型別、名稱、路徑等）。如果您嘗試這樣做，將會收到一個錯誤：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// Will throw an BeanOverrideException
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

    // override for this definition
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// Allow override for all definitions from module
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
列出模組和覆寫定義時，順序很重要。您必須將覆寫定義放在模組清單的末尾。
:::

## 連結模組策略

*由於模組之間的定義是延遲載入的*，我們可以利用模組來實作不同的策略：每個模組宣告一個實作。

讓我們舉一個 Repository (儲存庫) 和 Datasource (資料來源) 的範例。一個 Repository 需要一個 Datasource，而 Datasource 可以透過兩種方式實作：本機 (Local) 或遠端 (Remote)。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

我們可以在三個模組中宣告這些元件：Repository 模組，以及每個 Datasource 實作各一個模組：

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

然後我們只需以正確的模組組合啟動 Koin：

```kotlin
// Load Repository + Local Datasource definitions
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Load Repository + Remote Datasource definitions
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 模組包含 (自 3.2 版起)

`Module` 類別中新增了一個 `includes()` 函式，讓您可以透過包含其他模組，以有組織且結構化的方式組成一個模組。

這項新功能的兩個主要使用案例是：
- 將大型模組拆分成更小、更專注的模組。
- 在模組化專案中，它讓您對模組可見性有更精細的控制（請參閱以下範例）。

它是如何運作的？讓我們以一些模組為例，我們將模組包含在 `parentModule` 中：

```kotlin
// `:feature` module
val childModule1 = module {
    /* Other definitions here. */
}
val childModule2 = module {
    /* Other definitions here. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

請注意，我們不需要明確地設定所有模組：透過包含 `parentModule`，在 `includes` 中宣告的所有模組都將自動載入（`childModule1` 和 `childModule2`）。換句話說，Koin 實際上載入的是：`parentModule`、`childModule1` 和 `childModule2`。

一個需要注意的重要細節是，您也可以使用 `includes` 來新增 `internal` 和 `private` 模組 — 這讓您在模組化專案中對要公開的內容有更大的彈性。

:::info
模組載入現在已最佳化，可以平坦化所有模組圖並避免模組的重複定義。
:::

最後，您可以包含多個巢狀或重複的模組，Koin 將會平坦化所有包含的模組並移除重複項：

```kotlin
// :feature module
val dataModule = module {
    /* Other definitions here. */
}
val domainModule = module {
    /* Other definitions here. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` module
startKoin { modules(featureModule1, featureModule2) }
```

請注意，所有模組將只被包含一次：`dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

:::info
如果您在包含來自同一個檔案的模組時遇到任何編譯問題，您可以選擇在您的模組上使用 `get()` Kotlin 屬性運算子，或將每個模組分離到不同的檔案中。請參閱 https://github.com/InsertKoinIO/koin/issues/1341 解決方案
:::