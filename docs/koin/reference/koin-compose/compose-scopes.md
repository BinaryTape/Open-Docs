---
title: Compose 中的作用域
---

# Compose 中的作用域

Koin 提供了多种 API 来管理 Compose 应用程序中的作用域，从简单的可组合项绑定作用域到与导航集成的作用域。

## KoinScope

创建一个与可组合项生命周期绑定的 Koin 作用域：

```kotlin
val featureModule = module {
    scope<FeatureScope> {
        scoped<FeatureCache>()
        scoped<FeatureRepository>()
    }
}

@Composable
fun FeatureScreen() {
    KoinScope(scopeOf<FeatureScope>()) {
        // 所有子项都可以访问作用域内的依赖项
        FeatureContent()
    }
}

@Composable
fun FeatureContent() {
    // 从父级 KoinScope 解析
    val cache = koinInject<FeatureCache>()
}
```

当可组合项离开组合时（在 `onForgotten` 或 `onAbandoned` 时），作用域会自动关闭。

## KoinNavigationScope

创建一个与导航回退栈条目绑定的作用域：

```kotlin
val appModule = module {
    // 定义导航作用域的依赖项
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenCache>()
        viewModel<ScreenViewModel>()
    }
}

// 在您的 NavHost 中
NavHost(navController, startDestination = "home") {
    composable("detail/{id}") { backStackEntry ->
        KoinNavigationScope(backStackEntry) {
            DetailScreen()
        }
    }
}

@Composable
fun DetailScreen() {
    // 作用域限定为此导航目的地的依赖项
    val repository = koinInject<ScreenRepository>()
    val viewModel = koinViewModel<ScreenViewModel>()
}
```

**关键特性：**
- 作用域 ID 派生自 `NavBackStackEntry.id`
- 仅在导航被放弃时关闭作用域（不在重组时关闭）
- 非常适合每个屏幕的依赖项

:::info
需要 `koin-compose-viewmodel-navigation` 软件包。
:::

### navigationScope DSL

在模块中定义导航作用域的依赖项：

```kotlin
val appModule = module {
    // 作用域限定为导航目的地的依赖项
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenStateHolder>()
        viewModel<ScreenViewModel>()
    }
}
```

这将创建一个由 `NavBackStackEntry` 限定的作用域，用于 `KoinNavigationScope()`。

## UnboundKoinScope

提供一个没有生命周期绑定的外部管理的作用域：

```kotlin
@Composable
fun MyFeature(externalScope: Scope) {
    UnboundKoinScope(scope = externalScope) {
        // 子项可以访问该作用域
        val service = koinInject<MyService>()
        FeatureContent()
    }
}
```

:::warning
**敏感 API** —— 作用域**不会**自动关闭。您必须手动管理作用域生命周期，以防止内存泄漏。
:::

**用例：**
- 由外部系统管理的作用域
- 在多个可组合项树之间共享的作用域
- 当作用域生命周期与可组合项生命周期不匹配时

```kotlin
@Composable
fun MyFeature(externalScope: Scope, onClose: () -> Unit) {
    UnboundKoinScope(scope = externalScope) {
        FeatureContent()

        // 需要时手动清理
        DisposableEffect(Unit) {
            onDispose { onClose() }
        }
    }
}
```

## currentKoinScope

从组合中获取当前 Koin 作用域：

```kotlin
@Composable
fun MyScreen() {
    val scope = currentKoinScope()

    // 直接使用作用域
    val service = scope.get<MyService>()
}
```

这将从 `LocalKoinScopeContext` 中检索作用域。这是 `koinInject()` 使用的默认作用域。

## rememberKoinScope

跨重组记住具有自动生命周期管理的 Koin 作用域：

```kotlin
@Composable
fun FeatureScreen() {
    val scope = rememberKoinScope(scopeOf<FeatureScope>())

    // 使用作用域进行注入
    val repository = scope.get<FeatureRepository>()

    // 当 FeatureScreen 离开组合时，作用域将关闭
}
```

## Android 特定作用域

### KoinActivityScope

为可组合项层次结构提供 Activity 作用域：

```kotlin
class MainActivity : ComponentActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            KoinActivityScope {
                // 所有子项都可以访问 Activity 的作用域
                MainScreen()
            }
        }
    }
}

@Composable
fun MainScreen() {
    // 从 Activity 的作用域解析
    val presenter = koinInject<ActivityPresenter>()
}
```

### KoinFragmentScope

为可组合项层次结构提供 Fragment 作用域：

```kotlin
class MyFragment : Fragment(), AndroidScopeComponent {
    override val scope: Scope by fragmentScope()

    override fun onCreateView(...): View {
        return ComposeView(requireContext()).apply {
            setContent {
                KoinFragmentScope {
                    FragmentScreen()
                }
            }
        }
    }
}
```

### koinActivityInject

在任何可组合项中从 Activity 作用域进行注入：

```kotlin
val appModule = module {
    scope<MainActivity> {
        scoped<SessionManager>()
    }
}

@Composable
fun DeepNestedScreen() {
    // 在树中的任何位置从 Activity 的作用域解析
    val sessionManager: SessionManager = koinActivityInject()
}
```

## 作用域对比

| API | 生命周期 | 用例 |
|-----|-----------|----------|
| `KoinScope` | 可组合项 | 自定义作用域可组合项 |
| `KoinNavigationScope` | NavBackStackEntry | 每个目的地的作用域 |
| `UnboundKoinScope` | 手动 | 外部作用域提供者 |
| `KoinActivityScope` | Activity | Activity 范围的依赖项 |
| `KoinFragmentScope` | Fragment | Fragment 范围的依赖项 |

## 用例

### 按屏幕划分的导航作用域

每个屏幕都有自己的作用域：

```kotlin
val appModule = module {
    navigationScope {
        scoped<ScreenStateHolder>()
        viewModel<ScreenViewModel>()
    }
}

NavHost(navController, startDestination = "list") {
    composable("list") { entry ->
        KoinNavigationScope(entry) {
            ListScreen() // 拥有自己的 ScreenStateHolder
        }
    }
    composable("detail/{id}") { entry ->
        KoinNavigationScope(entry) {
            DetailScreen() // 拥有自己的 ScreenStateHolder
        }
    }
}
```

### 会话作用域数据

在会话内的屏幕之间共享数据：

```kotlin
val sessionModule = module {
    scope<UserSession> {
        scoped { ShoppingCart() }
        scoped { UserPreferences() }
    }
}

@Composable
fun ShopApp() {
    KoinScope(scopeOf<UserSession>()) {
        NavHost(/*...*/) {
            composable("catalog") { CatalogScreen() }
            composable("cart") { CartScreen() }
        }
    }
}

@Composable
fun CartScreen() {
    // 会话中所有屏幕都使用同一个购物车实例
    val cart = koinInject<ShoppingCart>()
}
```

### 共享 ViewModel 作用域

在相关屏幕之间共享 ViewModel 及其依赖项：

```kotlin
val appModule = module {
    scope<CheckoutFlow> {
        scoped<CheckoutState>()
        viewModel<CheckoutViewModel>()
    }
}

@Composable
fun CheckoutFlow() {
    KoinScope(scopeOf<CheckoutFlow>()) {
        NavHost(/*...*/) {
            composable("cart") { CartScreen() }
            composable("shipping") { ShippingScreen() }
            composable("payment") { PaymentScreen() }
            composable("confirmation") { ConfirmationScreen() }
        }
    }
}

// 所有屏幕共享同一个 CheckoutViewModel 实例
@Composable
fun CartScreen() {
    val viewModel = koinViewModel<CheckoutViewModel>()
}
```

## 最佳做法

1. **为每个屏幕的依赖项使用 `KoinNavigationScope`** —— 随导航自动管理生命周期。

2. **优先使用受管作用域而非 `UnboundKoinScope`** —— 避免手动清理。

3. **在模块中定义导航作用域** —— 比内联创建作用域更简洁。
   ```kotlin
   module {
       navigationScope {
           scoped<MyRepository>()
       }
   }
   ```

4. **为多屏幕流程使用 `KoinScope`** —— 结账、入职引导、向导。

5. **与 ViewModel 结合处理复杂状态** —— 作用域持有共享状态，ViewModel 处理 UI 逻辑。

## 后续步骤

- **[动态模块](/docs/reference/koin-compose/compose-modules)** —— 动态加载模块
- **[Compose 概览](/docs/reference/koin-compose/compose)** —— 设置和基本注入
- **[核心作用域](/docs/reference/koin-core/scopes)** —— 作用域概念