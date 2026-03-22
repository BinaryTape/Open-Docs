---
title: Compose 中的作用域
---

# Compose 中的作用域

Koin 提供了多個 API 來管理 Compose 應用程式中的作用域，從簡單的與可組合項（composable）繫結的作用域到導航整合的作用域。

## KoinScope

建立一個與 Composable 生命周期繫結的 Koin 作用域：

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
        // 所有子項都可以存取作用域內的相依性
        FeatureContent()
    }
}

@Composable
fun FeatureContent() {
    // 從父級 KoinScope 解析
    val cache = koinInject<FeatureCache>()
}
```

當 Composable 離開組合（在 `onForgotten` 或 `onAbandoned` 時）時，作用域會自動關閉。

## KoinNavigationScope

建立一個與導航返回堆疊項目（navigation back stack entry）繫結的作用域：

```kotlin
val appModule = module {
    // 定義導航作用域的相依性
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
    // 作用域限於此導航目的地的相依性
    val repository = koinInject<ScreenRepository>()
    val viewModel = koinViewModel<ScreenViewModel>()
}
```

**核心特性：**
- 作用域 ID 源自 `NavBackStackEntry.id`
- 僅在導航被捨棄時關閉作用域（而非在重組時）
- 非常適合用於各個螢幕專屬的相依性

:::info
需要 `koin-compose-viewmodel-navigation` 套件。
:::

### navigationScope DSL

在模組中定義導航作用域的相依性：

```kotlin
val appModule = module {
    // 作用域限於導航目的地的相依性
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenStateHolder>()
        viewModel<ScreenViewModel>()
    }
}
```

這會建立一個由 `NavBackStackEntry` 限定的作用域，供 `KoinNavigationScope()` 使用。

## UnboundKoinScope

提供一個不具備生命週期繫結、由外部管理的作用域：

```kotlin
@Composable
fun MyFeature(externalScope: Scope) {
    UnboundKoinScope(scope = externalScope) {
        // 子項可以存取該作用域
        val service = koinInject<MyService>()
        FeatureContent()
    }
}
```

:::warning
**敏感的 API** — 作用域**不會**自動關閉。您必須手動管理作用域生命週期以防止記憶體洩漏。
:::

**使用案例：**
- 由外部系統管理的作用域
- 跨多個可組合項樹共享的作用域
- 當作用域生命週期與 Composable 生命周期不符時

```kotlin
@Composable
fun MyFeature(externalScope: Scope, onClose: () -> Unit) {
    UnboundKoinScope(scope = externalScope) {
        FeatureContent()

        // 需要時手動清理
        DisposableEffect(Unit) {
            onDispose { onClose() }
        }
    }
}
```

## currentKoinScope

從組合（composition）中獲取目前的 Koin 作用域：

```kotlin
@Composable
fun MyScreen() {
    val scope = currentKoinScope()

    // 直接使用作用域
    val service = scope.get<MyService>()
}
```

這會從 `LocalKoinScopeContext` 檢索作用域。它是 `koinInject()` 使用的預設作用域。

## rememberKoinScope

在重組（recomposition）之間記住 Koin 作用域，並具備自動生命週期管理功能：

```kotlin
@Composable
fun FeatureScreen() {
    val scope = rememberKoinScope(scopeOf<FeatureScope>())

    // 使用作用域進行注入
    val repository = scope.get<FeatureRepository>()

    // 當 FeatureScreen 離開組合時，作用域會關閉
}
```

## Android 專屬作用域

### KoinActivityScope

將 Activity 作用域提供給可組合項階層結構：

```kotlin
class MainActivity : ComponentActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            KoinActivityScope {
                // 所有子項皆可存取 Activity 的作用域
                MainScreen()
            }
        }
    }
}

@Composable
fun MainScreen() {
    // 從 Activity 的作用域解析
    val presenter = koinInject<ActivityPresenter>()
}
```

### KoinFragmentScope

將 Fragment 作用域提供給可組合項階層結構：

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

在任何 Composable 中從 Activity 作用域進行注入：

```kotlin
val appModule = module {
    scope<MainActivity> {
        scoped<SessionManager>()
    }
}

@Composable
fun DeepNestedScreen() {
    // 在樹中的任何位置從 Activity 的作用域解析
    val sessionManager: SessionManager = koinActivityInject()
}
```

## 作用域比較

| API | 生命週期 | 使用案例 |
|-----|-----------|----------|
| `KoinScope` | Composable | 自訂作用域的可組合項 |
| `KoinNavigationScope` | NavBackStackEntry | 各個目的地的作用域 |
| `UnboundKoinScope` | 手動 | 外部作用域提供者 |
| `KoinActivityScope` | Activity | Activity 範圍內的相依性 |
| `KoinFragmentScope` | Fragment | Fragment 範圍內的相依性 |

## 使用案例

### 單一螢幕導航作用域

每個螢幕都有自己的作用域：

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
            ListScreen() // 擁有自己的 ScreenStateHolder
        }
    }
    composable("detail/{id}") { entry ->
        KoinNavigationScope(entry) {
            DetailScreen() // 擁有自己的 ScreenStateHolder
        }
    }
}
```

### 工作階段作用域資料

在一個工作階段內的螢幕之間共享資料：

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
    // 在工作階段的所有螢幕中共享同一個購物車執行個體
    val cart = koinInject<ShoppingCart>()
}
```

### 共享的 ViewModel 作用域

在相關螢幕之間共享一個 ViewModel 及其相依性：

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

// 所有螢幕共用同一個 CheckoutViewModel 執行個體
@Composable
fun CartScreen() {
    val viewModel = koinViewModel<CheckoutViewModel>()
}
```

## 最佳實務

1. **針對單一螢幕相依性使用 `KoinNavigationScope`** — 配合導航自動管理生命週期。

2. **優先使用受控作用域而非 `UnboundKoinScope`** — 避免手動清理。

3. **在模組中定義導航作用域** — 比在行內建立作用域更整潔。
   ```kotlin
   module {
       navigationScope {
           scoped<MyRepository>()
       }
   }
   ```

4. **針對多螢幕流程使用 `KoinScope`** — 例如結帳、新手引導、精靈介面。

5. **結合 ViewModel 處理複雜狀態** — 作用域持有共享狀態，ViewModel 處理 UI 邏輯。

## 後續步驟

- **[動態模組](/docs/reference/koin-compose/compose-modules)** — 動態載入模組
- **[Compose 概覽](/docs/reference/koin-compose/compose)** — 設定與基礎注入
- **[核心作用域](/docs/reference/koin-core/scopes)** — 作用域概念