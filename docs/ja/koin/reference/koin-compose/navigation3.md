---
title: Navigation 3
---

# Navigation 3

Koin は、依存関係の注入（DI）を備えた、型安全でマルチプラットフォームなナビゲーションのために [AndroidX Navigation 3](https://developer.android.com/guide/navigation/navigation-3) との統合を提供します。

## Navigation 3 とは？

Navigation 3 は、Compose 専用に設計された Jetpack の新しいナビゲーションライブラリです。

- **バックスタックの完全な制御** - リストへの項目の追加・削除によってナビゲーションを行います。
- **型安全なルート** - ルートは `@Serializable` が付与された Kotlin クラスです。
- **適応型レイアウト（Adaptive layouts）** - 複数の目的地を同時に表示します（リスト/詳細など）。
- **自動アニメーション** - トランジション（遷移）のサポートが組み込まれています。

## セットアップ

### マルチプラットフォームプロジェクト

```kotlin
// shared/build.gradle.kts
commonMain.dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

### Android 専用プロジェクト

```kotlin
dependencies {
    implementation("io.insert-koin:koin-compose-navigation3:$koin_version")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:$serialization_version")
}
```

serialization プラグインを適用します：

```kotlin
plugins {
    kotlin("plugin.serialization")
}
```

### プラットフォームのサポート状況

| プラットフォーム | ステータス |
|----------|--------|
| Android | フルサポート |
| iOS | フルサポート |
| Desktop | フルサポート |
| Web | フルサポート |

## 基本概念

### Kotlin クラスとしてのルート

`@Serializable` を使用して、型安全なルートを定義します：

```kotlin
@Serializable
data object HomeRoute

@Serializable
data object ProfileRoute

@Serializable
data class DetailRoute(val itemId: String)

@Serializable
data class SettingsRoute(val section: String? = null)
```

### バックスタック

Navigation 3 は、シンプルなリストベースのバックスタックを使用します：

```kotlin
// 基本的なバックスタック
val backStack = remember { mutableStateListOf<Any>(HomeRoute) }

// 永続的なバックスタック（設定変更後も維持される）
val backStack = rememberNavBackStack(HomeRoute)

// 前に進む（ナビゲート）
backStack.add(DetailRoute("123"))

// 戻る
backStack.removeLastOrNull()
```

### NavDisplay

`NavDisplay` は、アニメーションを伴ってバックスタックをレンダリングします：

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = { route -> /* NavEntry */ }
)
```

## Koin との統合

### ナビゲーションエントリーの宣言

モジュール内で `navigation<T>` DSL を使用します：

```kotlin
val appModule = module {
    // 依存関係
    single<ApiClient>()
    viewModel<HomeViewModel>()
    viewModel<DetailViewModel>()

    // Koin インジェクションを使用したナビゲーションエントリー
    navigation<HomeRoute> { route ->
        HomeScreen(viewModel = koinViewModel())
    }

    navigation<DetailRoute> { route ->
        DetailScreen(
            itemId = route.itemId,
            viewModel = koinViewModel { parametersOf(route.itemId) }
        )
    }

    navigation<ProfileRoute> { route ->
        ProfileScreen(viewModel = koinViewModel())
    }
}
```

### koinEntryProvider の使用

Koin から集約されたすべてのナビゲーションエントリーを取得します：

```kotlin
@Composable
fun App() {
    val backStack = rememberNavBackStack(HomeRoute)
    val entryProvider = koinEntryProvider<Any>()

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider
    )
}
```

:::tip NavDisplay が型指定されている場合はルート型を渡してください
`koinEntryProvider<T>()` はジェネリックであり、`T` はルート型です。`koinEntryProvider<Any>()` のままにしておき、`NavDisplay` が（例えば `rememberSupportingPaneSceneStrategy<Route>()` のような型指定された `SceneStrategy` を通じて）型指定された場合、コンパイラは `NavDisplay<Route>` と推論し、`(Route) -> NavEntry<Route>` を期待します。そのため、`Any` 型のプロバイダーは一致しません。

```
Argument type mismatch: actual type is 'Function1<Any, NavEntry<Any>>',
but 'Function1<Route, NavEntry<Route>>' was expected.
```

一致するようにルート型を渡してください：

```kotlin
val sceneStrategy = rememberSupportingPaneSceneStrategy<Route>()
val entryProvider = koinEntryProvider<Route>()   // (Route) -> NavEntry<Route>

NavDisplay(
    backStack = backStack,
    onBack = onBack,
    sceneStrategy = sceneStrategy,
    entryProvider = entryProvider,               // ✅ NavDisplay<Route> と一致します
)
```

（同様に、`val entryProvider: EntryProvider<Route> = koinEntryProvider()` とすることも可能です。この場合、型引数は期待される型から推論されます。）
:::

### 完全な例

```kotlin
// ルート
@Serializable data object ConversationList
@Serializable data class ConversationDetail(val id: Int)
@Serializable data object Profile

// ナビゲーションを簡潔にするための Navigator クラス
class Navigator(startDestination: Any) {
    val backStack = mutableStateListOf(startDestination)

    fun goTo(destination: Any) {
        backStack.add(destination)
    }

    fun goBack() {
        backStack.removeLastOrNull()
    }
}

// Koin モジュール
val appModule = module {
    includes(conversationModule, profileModule)

    activityRetainedScope {
        scoped { Navigator(startDestination = ConversationList) }
    }
}

val conversationModule = module {
    activityRetainedScope {
        navigation<ConversationList> {
            val navigator = get<Navigator>()
            ConversationListScreen(
                onConversationClicked = { detail ->
                    navigator.goTo(detail)
                }
            )
        }

        navigation<ConversationDetail> { route ->
            val navigator = get<Navigator>()
            ConversationDetailScreen(
                conversationId = route.id,
                onProfileClicked = { navigator.goTo(Profile) }
            )
        }
    }
}

val profileModule = module {
    activityRetainedScope {
        navigation<Profile> {
            ProfileScreen()
        }
    }
}

// Activity
class MainActivity : ComponentActivity(), AndroidScopeComponent {
    override val scope: Scope by activityRetainedScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            val navigator: Navigator = get()

            Scaffold { padding ->
                NavDisplay(
                    backStack = navigator.backStack,
                    modifier = Modifier.padding(padding),
                    onBack = { navigator.goBack() },
                    entryProvider = getEntryProvider()
                )
            }
        }
    }
}
```

## スコープ付きナビゲーション

Koin スコープ内でナビゲーションエントリーを宣言します：

```kotlin
val appModule = module {
    // Activity-retained スコープ (設定変更後も維持される)
    activityRetainedScope {
        scoped { UserSession() }
        viewModel<ProfileViewModel>()

        navigation<ProfileRoute> { route ->
            ProfileScreen(viewModel = koinViewModel())
        }
    }

    // カスタムスコープ
    scope<CheckoutFlow> {
        scoped { CheckoutState() }
        viewModel<CheckoutViewModel>()

        navigation<CartRoute> { route ->
            CartScreen(viewModel = koinViewModel())
        }

        navigation<PaymentRoute> { route ->
            PaymentScreen(viewModel = koinViewModel())
        }
    }
}
```

## ViewModel との統合

### ナビゲーション引数を使用する場合

ルートのデータを ViewModel に渡します：

```kotlin
@Serializable
data class DetailRoute(val itemId: String, val fromSearch: Boolean = false)

class DetailViewModel(
    val route: DetailRoute,
    private val repository: Repository
) : ViewModel() {
    val item = repository.getItem(route.itemId)
}

val appModule = module {
    viewModelOf(::DetailViewModel)

    navigation<DetailRoute> { route ->
        DetailScreen(
            viewModel = koinViewModel { parametersOf(route) }
        )
    }
}
```

### エントリーデコレーター（Entry Decorators）を使用する場合

ViewModel の状態保持のためにデコレーターを使用します：

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryDecorators = listOf(
        rememberSaveableStateHolderNavEntryDecorator(),
        rememberViewModelStoreNavEntryDecorator()
    ),
    entryProvider = entryProvider {
        entry<DetailRoute> { route ->
            val viewModel = koinViewModel<DetailViewModel> {
                parametersOf(route)
            }
            DetailScreen(viewModel)
        }
    }
)
```

## アニメーション

### デフォルトのトランジション

```kotlin
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = entryProvider,
    // 前に進むときのアニメーション
    transitionSpec = {
        slideInHorizontally(initialOffsetX = { it }) togetherWith
        slideOutHorizontally(targetOffsetX = { -it })
    },
    // 戻るときのアニメーション
    popTransitionSpec = {
        slideInHorizontally(initialOffsetX = { -it }) togetherWith
        slideOutHorizontally(targetOffsetX = { it })
    }
)
```

### ルートごとのアニメーション

```kotlin
navigation<ModalRoute>(
    metadata = NavDisplay.transitionSpec {
        slideInVertically(initialOffsetY = { it }) togetherWith
        ExitTransition.KeepUntilTransitionsFinished
    } + NavDisplay.popTransitionSpec {
        EnterTransition.None togetherWith
        slideOutVertically(targetOffsetY = { it })
    }
) { route ->
    ModalScreen()
}
```

## 適応型レイアウト (Adaptive Layouts)

### リスト/詳細パターン

適応型レイアウトにはシーン戦略（scene strategies）を使用します：

```kotlin
@Composable
fun App() {
    val backStack = rememberNavBackStack(ConversationList)
    val listDetailStrategy = rememberListDetailSceneStrategy<Any>()

    NavDisplay(
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        sceneStrategy = listDetailStrategy,
        entryProvider = entryProvider {
            entry<ConversationList>(
                metadata = ListDetailSceneStrategy.listPane()
            ) {
                ConversationListScreen()
            }

            entry<ConversationDetail>(
                metadata = ListDetailSceneStrategy.detailPane()
            ) { route ->
                ConversationDetailScreen(route.id)
            }
        }
    )
}
```

### Koin モジュールを使用する場合

```kotlin
val appModule = module {
    navigation<ConversationList>(
        metadata = ListDetailSceneStrategy.listPane()
    ) {
        ConversationListScreen(
            onItemClick = { get<Navigator>().goTo(it) }
        )
    }

    navigation<ConversationDetail>(
        metadata = ListDetailSceneStrategy.detailPane()
    ) { route ->
        ConversationDetailScreen(route.id)
    }
}
```

## Android 拡張機能

### 遅延エントリープロバイダー (Lazy Entry Provider)

```kotlin
class MainActivity : ComponentActivity() {
    // 遅延初期化
    private val entryProvider by entryProvider<Any>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val backStack = rememberNavBackStack(HomeRoute)

            NavDisplay(
                backStack = backStack,
                onBack = { backStack.removeLastOrNull() },
                entryProvider = entryProvider
            )
        }
    }
}
```

### 即時エントリープロバイダー (Eager Entry Provider)

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val entryProvider = getEntryProvider<Any>()

        setContent {
            NavDisplay(
                backStack = backStack,
                entryProvider = entryProvider,
                onBack = { backStack.removeLastOrNull() }
            )
        }
    }
}
```

## API リファレンス

### DSL 関数

| 関数 | 説明 |
|----------|-------------|
| `Module.navigation<T> { }` | モジュールレベルでナビゲーションエントリーを宣言します |
| `ScopeDSL.navigation<T> { }` | スコープ内でナビゲーションエントリーを宣言します |

### Composable 関数

| 関数 | 説明 |
|----------|-------------|
| `koinEntryProvider<T>()` | Koin から集約されたエントリープロバイダーを取得します |

### Android 拡張機能

| 関数 | 説明 |
|----------|-------------|
| `entryProvider<T>()` | 遅延エントリープロバイダーのデリゲート |
| `getEntryProvider<T>()` | 即時エントリープロバイダー |

## Navigation 2.x からの移行

### 以前 (Navigation 2.x)

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        HomeScreen(viewModel = koinViewModel())
    }
    composable("detail/{id}") { backStackEntry ->
        val id = backStackEntry.arguments?.getString("id")
        DetailScreen(id = id, viewModel = koinViewModel())
    }
}
```

### 以降 (Navigation 3)

```kotlin
// 型安全なルート
@Serializable data object HomeRoute
@Serializable data class DetailRoute(val id: String)

// モジュール宣言
val appModule = module {
    navigation<HomeRoute> { HomeScreen(viewModel = koinViewModel()) }
    navigation<DetailRoute> { route ->
        DetailScreen(id = route.id, viewModel = koinViewModel())
    }
}

// 使用方法
val backStack = rememberNavBackStack(HomeRoute)
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = koinEntryProvider()
)
```

## リソース

- [Navigation 3 公式ガイド](https://developer.android.com/guide/navigation/navigation-3)
- [Nav3 レシピリポジトリ](https://github.com/android/nav3-recipes)
- [Koin Compose ドキュメント](/docs/reference/koin-compose/compose)