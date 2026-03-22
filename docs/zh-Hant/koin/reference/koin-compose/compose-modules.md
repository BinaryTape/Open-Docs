---
title: 動態模組
---

# Compose 中的動態模組

Koin 提供的 API 可動態載入與卸載與 Composable 生命週期繫結的模組。這對於功能模組、延遲載入與按需相依性非常有用。

## rememberKoinModules

當 Composable 進入組合 (composition) 時載入 Koin 模組：

```kotlin
val featureModule = module {
    factory<FeatureRepository>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    // 當此 Composable 進入組合時載入模組
    rememberKoinModules(featureModule)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

### 多個模組

```kotlin
@Composable
fun FeatureScreen() {
    rememberKoinModules(
        featureDataModule,
        featureDomainModule,
        featureUiModule
    )
}
```

### 卸載模組

控制何時卸載模組：

```kotlin
@Composable
fun FeatureScreen() {
    rememberKoinModules(
        featureModule,
        unloadOnForgotten = true,  // 當 Composable 離開時卸載
        unloadOnAbandoned = true   // 如果組合失敗則卸載
    )
}
```

| 選項 | 觸發時機 |
|--------|----------------|
| `unloadOnForgotten` | Composable 從組合中移除 |
| `unloadOnAbandoned` | 組合失敗或被捨棄 |

## 使用案例

### 功能模組

根據需求載入特定功能的相依性：

```kotlin
// 位於獨立 Gradle 模組中的功能模組
val checkoutModule = module {
    factory<PaymentProcessor>()
    factory<CheckoutRepository>()
    viewModel<CheckoutViewModel>()
}

@Composable
fun CheckoutScreen() {
    rememberKoinModules(checkoutModule, unloadOnForgotten = true)

    val viewModel = koinViewModel<CheckoutViewModel>()
    CheckoutContent(viewModel)
}
```

### 延遲功能載入

與導航結合以進行延遲功能載入：

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        HomeScreen()  // 不需要額外模組
    }
    composable("checkout") {
        // 僅在導航至此處時載入 checkout 模組
        rememberKoinModules(checkoutModule, unloadOnForgotten = true)
        CheckoutScreen()
    }
    composable("profile") {
        // 僅在導航至此處時載入 profile 模組
        rememberKoinModules(profileModule, unloadOnForgotten = true)
        ProfileScreen()
    }
}
```

### 偵錯/預覽模組

為預覽切換實作：

```kotlin
val debugModule = module {
    single<ApiClient> { MockApiClient() }
}

@Preview
@Composable
fun FeatureScreenPreview() {
    rememberKoinModules(debugModule)
    FeatureScreen()
}
```

### 條件模組

根據條件載入模組：

```kotlin
@Composable
fun App(isDebug: Boolean) {
    if (isDebug) {
        rememberKoinModules(debugModule)
    }

    MainScreen()
}
```

## 搭配延遲模組 (Lazy Modules)

結合 Koin 的延遲模組載入以獲得更好的效能：

```kotlin
val featureModule = lazyModule {
    // 載入模組時才會延遲剖析定義
    factory<HeavyService>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    rememberKoinModules(featureModule, unloadOnForgotten = true)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

## 最佳實務

1. **使用 `unloadOnForgotten = true`** - 防止記憶體洩漏
   ```kotlin
   rememberKoinModules(featureModule, unloadOnForgotten = true)
   ```

2. **每個功能一個模組** - 保持模組專注且獨立

3. **結合延遲模組** - 適用於具有許多功能的大型應用程式
   ```kotlin
   val featureModule = lazyModule { /* ... */ }
   ```

4. **在導航層級載入** - 在 `NavHost` Composable 中載入模組

5. **避免循環相依性** - 功能模組不應互相依賴

## 後續步驟

- **[Compose 中的作用域](/docs/reference/koin-compose/compose-scopes)** - 作用域 API
- **[Compose 總覽](/docs/reference/koin-compose/compose)** - 設定與基礎注入
- **[獨立上下文](/docs/reference/koin-compose/isolated-context)** - SDK 隔離