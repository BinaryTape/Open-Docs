---
title: Compose におけるスコープ
---

# Compose におけるスコープ

Koin は、シンプルな Composable に紐づくスコープから、ナビゲーションに統合されたスコープまで、Compose アプリケーション内のスコープを管理するためのいくつかの API を提供します。

## KoinScope

Composable のライフサイクルに紐づく Koin スコープを作成します：

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
        // すべての子コンポーネントがスコープ内の依存関係にアクセスできます
        FeatureContent()
    }
}

@Composable
fun FeatureContent() {
    // 親の KoinScope から解決されます
    val cache = koinInject<FeatureCache>()
}
```

スコープは、Composable が Composition から離れるとき（`onForgotten` または `onAbandoned` 時）に自動的にクローズされます。

## KoinNavigationScope

ナビゲーションのバックスタックエントリに紐づくスコープを作成します：

```kotlin
val appModule = module {
    // ナビゲーションスコープの依存関係を定義
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenCache>()
        viewModel<ScreenViewModel>()
    }
}

// NavHost 内
NavHost(navController, startDestination = "home") {
    composable("detail/{id}") { backStackEntry ->
        KoinNavigationScope(backStackEntry) {
            DetailScreen()
        }
    }
}

@Composable
fun DetailScreen() {
    // このナビゲーション先にスコープされた依存関係
    val repository = koinInject<ScreenRepository>()
    val viewModel = koinViewModel<ScreenViewModel>()
}
```

**主な特徴:**
- スコープ ID は `NavBackStackEntry.id` から派生します。
- スコープはナビゲーションが破棄されたときにのみクローズされます（再構成（recomposition）時ではありません）。
- 画面ごとの依存関係に最適です。

:::info
`koin-compose-viewmodel-navigation` パッケージが必要です。
:::

### navigationScope DSL

モジュール内でナビゲーションスコープの依存関係を定義します：

```kotlin
val appModule = module {
    // ナビゲーション先にスコープされた依存関係
    navigationScope {
        scoped<ScreenRepository>()
        scoped<ScreenStateHolder>()
        viewModel<ScreenViewModel>()
    }
}
```

これにより、`KoinNavigationScope()` で使用するための `NavBackStackEntry` で修飾されたスコープが作成されます。

## UnboundKoinScope

ライフサイクルの紐付けなしで、外部で管理されるスコープを提供します：

```kotlin
@Composable
fun MyFeature(externalScope: Scope) {
    UnboundKoinScope(scope = externalScope) {
        // 子コンポーネントはスコープにアクセス可能
        val service = koinInject<MyService>()
        FeatureContent()
    }
}
```

:::warning
**注意が必要な API** - スコープは自動的にクローズされません。メモリリークを防ぐために、スコープのライフサイクルを手動で管理する必要があります。
:::

**ユースケース:**
- 外部システムによって管理されるスコープ
- 複数の Composable ツリー間で共有されるスコープ
- スコープのライフサイクルが Composable のライフサイクルと一致しない場合

```kotlin
@Composable
fun MyFeature(externalScope: Scope, onClose: () -> Unit) {
    UnboundKoinScope(scope = externalScope) {
        FeatureContent()

        // 必要に応じて手動でクリーンアップ
        DisposableEffect(Unit) {
            onDispose { onClose() }
        }
    }
}
```

## currentKoinScope

Composition から現在の Koin スコープを取得します：

```kotlin
@Composable
fun MyScreen() {
    val scope = currentKoinScope()

    // スコープを直接使用
    val service = scope.get<MyService>()
}
```

これは `LocalKoinScopeContext` からスコープを取得します。`koinInject()` で使用されるデフォルトのスコープです。

## rememberKoinScope

自動ライフサイクル管理機能を備えた、再構成（recomposition）をまたいで Koin スコープを保持（remember）します：

```kotlin
@Composable
fun FeatureScreen() {
    val scope = rememberKoinScope(scopeOf<FeatureScope>())

    // インジェクションにスコープを使用
    val repository = scope.get<FeatureRepository>()

    // FeatureScreen が Composition から離れるとき、スコープはクローズされます
}
```

## Android 固有のスコープ

### KoinActivityScope

Activity スコープを Composable 階層に提供します：

```kotlin
class MainActivity : ComponentActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            KoinActivityScope {
                // すべての子コンポーネントが Activity のスコープにアクセス可能
                MainScreen()
            }
        }
    }
}

@Composable
fun MainScreen() {
    // Activity のスコープから解決
    val presenter = koinInject<ActivityPresenter>()
}
```

### KoinFragmentScope

Fragment スコープを Composable 階層に提供します：

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

任意の Composable 内で Activity スコープからインジェクトします：

```kotlin
val appModule = module {
    scope<MainActivity> {
        scoped<SessionManager>()
    }
}

@Composable
fun DeepNestedScreen() {
    // ツリー内のどこからでも Activity のスコープから解決
    val sessionManager: SessionManager = koinActivityInject()
}
```

## スコープの比較

| API | ライフサイクル | ユースケース |
|-----|-----------|----------|
| `KoinScope` | Composable | カスタムスコープを持つ Composable |
| `KoinNavigationScope` | NavBackStackEntry | ナビゲーション先ごとのスコープ |
| `UnboundKoinScope` | 手動 | 外部スコーププロバイダー |
| `KoinActivityScope` | Activity | Activity 全体の依存関係 |
| `KoinFragmentScope` | Fragment | Fragment 全体の依存関係 |

## ユースケース

### 画面ごとのナビゲーションスコープ

各画面が独自のスコープを持ちます：

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
            ListScreen() // 独自の ScreenStateHolder を持つ
        }
    }
    composable("detail/{id}") { entry ->
        KoinNavigationScope(entry) {
            DetailScreen() // 独自の ScreenStateHolder を持つ
        }
    }
}
```

### セッションスコープのデータ

セッション内の画面間でデータを共有します：

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
    // セッション内のすべての画面で同じ ShoppingCart インスタンスを使用
    val cart = koinInject<ShoppingCart>()
}
```

### 共有 ViewModel スコープ

関連する画面間で ViewModel とその依存関係を共有します：

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

// すべての画面で同じ CheckoutViewModel インスタンスを共有
@Composable
fun CartScreen() {
    val viewModel = koinViewModel<CheckoutViewModel>()
}
```

## ベストプラクティス

1. **画面ごとの依存関係には `KoinNavigationScope` を使用する** - ナビゲーションに伴う自動ライフサイクル。

2. **`UnboundKoinScope` よりも管理されたスコープを優先する** - 手動クリーンアップを避ける。

3. **モジュール内でナビゲーションスコープを定義する** - インラインでのスコープ作成よりもクリーン。
   ```kotlin
   module {
       navigationScope {
           scoped<MyRepository>()
       }
   }
   ```

4. **複数画面のフローには `KoinScope` を使用する** - チェックアウト、オンボーディング、ウィザードなど。

5. **複雑な状態には ViewModel と組み合わせる** - スコープは共有状態を保持し、ViewModel は UI ロジックを処理する。

## 次のステップ

- **[動的モジュール](/docs/reference/koin-compose/compose-modules)** - モジュールを動的にロードする
- **[Compose の概要](/docs/reference/koin-compose/compose)** - セットアップと基本的なインジェクション
- **[コアスコープ](/docs/reference/koin-core/scopes)** - スコープの概念