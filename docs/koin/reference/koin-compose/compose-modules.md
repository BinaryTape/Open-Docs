---
title: 动态模块
---

# Compose 中的动态模块

Koin 提供了 API 来动态加载和卸载与 Composable 生命周期绑定的模块。这对于功能模块、延迟加载和按需依赖项非常有用。

## rememberKoinModules

在 Composable 进入组合 (composition) 时加载 Koin 模块：

```kotlin
val featureModule = module {
    factory<FeatureRepository>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    // 当此 Composable 进入组合时加载模块
    rememberKoinModules(featureModule)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

### 多个模块

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

### 卸载模块

控制模块卸载的时机：

```kotlin
@Composable
fun FeatureScreen() {
    rememberKoinModules(
        featureModule,
        unloadOnForgotten = true,  // 当 Composable 离开组合时卸载
        unloadOnAbandoned = true   // 如果组合失败则卸载
    )
}
```

| 选项 | 触发时机 |
|--------|----------------|
| `unloadOnForgotten` | Composable 从组合中移除 |
| `unloadOnAbandoned` | 组合失败或被放弃 |

## 用例

### 功能模块

按需加载特定功能的依赖项：

```kotlin
// 功能模块位于独立的 Gradle 模块中
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

### 延迟功能加载

结合导航进行延迟功能加载：

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        HomeScreen()  // 无需额外模块
    }
    composable("checkout") {
        // 仅在导航到此处时加载 checkout 模块
        rememberKoinModules(checkoutModule, unloadOnForgotten = true)
        CheckoutScreen()
    }
    composable("profile") {
        // 仅在导航到此处时加载 profile 模块
        rememberKoinModules(profileModule, unloadOnForgotten = true)
        ProfileScreen()
    }
}
```

### 调试/预览模块

为预览交换实现：

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

### 条件模块

根据条件加载模块：

```kotlin
@Composable
fun App(isDebug: Boolean) {
    if (isDebug) {
        rememberKoinModules(debugModule)
    }

    MainScreen()
}
```

## 结合延迟模块 (Lazy Modules)

结合 Koin 的延迟模块加载以获得更好的性能：

```kotlin
val featureModule = lazyModule {
    // 模块加载时延迟解析定义
    factory<HeavyService>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    rememberKoinModules(featureModule, unloadOnForgotten = true)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

## 最佳做法

1. **使用 `unloadOnForgotten = true`** - 防止内存泄漏
   ```kotlin
   rememberKoinModules(featureModule, unloadOnForgotten = true)
   ```

2. **每个功能一个模块** - 保持模块专注且独立

3. **结合延迟模块** - 适用于具有许多功能的大型应用
   ```kotlin
   val featureModule = lazyModule { /* ... */ }
   ```

4. **在导航层级加载** - 在 `NavHost` 的 Composable 中加载模块

5. **避免循环依赖** - 功能模块不应相互依赖

## 后续步骤

- **[Compose 中的作用域](/docs/reference/koin-compose/compose-scopes)** - Scope API
- **[Compose 概览](/docs/reference/koin-compose/compose)** - 设置与基础注入
- **[隔离上下文](/docs/reference/koin-compose/isolated-context)** - SDK 隔离