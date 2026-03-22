---
title: ダイナミックモジュール
---

# Compose におけるダイナミックモジュール

Koin は、Composable のライフサイクルに紐づけてモジュールを動的にロードおよびアンロードするための API を提供します。これは、機能（フィーチャー）モジュール、遅延読み込み、およびオンデマンドの依存関係において非常に有用です。

## rememberKoinModules

Composable がコンポジション（Composition）を開始したときに Koin モジュールをロードします：

```kotlin
val featureModule = module {
    factory<FeatureRepository>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    // この Composable がコンポジションを開始したときにモジュールをロード
    rememberKoinModules(featureModule)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

### 複数のモジュール

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

### モジュールのアンロード

モジュールをアンロードするタイミングを制御できます：

```kotlin
@Composable
fun FeatureScreen() {
    rememberKoinModules(
        featureModule,
        unloadOnForgotten = true,  // Composable がコンポジションを離れたときにアンロード
        unloadOnAbandoned = true   // コンポジションが失敗したときにアンロード
    )
}
```

| オプション | トリガーされるタイミング |
|--------|----------------|
| `unloadOnForgotten` | Composable がコンポジションから削除されたとき |
| `unloadOnAbandoned` | コンポジションが失敗した、または破棄（abandoned）されたとき |

## ユースケース

### 機能モジュール

機能固有の依存関係をオンデマンドでロードします：

```kotlin
// 別個の Gradle モジュールにある機能モジュール
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

### 機能の遅延読み込み

ナビゲーションと組み合わせて、機能の遅延読み込み（Lazy Loading）を実現します：

```kotlin
NavHost(navController, startDestination = "home") {
    composable("home") {
        HomeScreen()  // 追加のモジュールは不要
    }
    composable("checkout") {
        // ここにナビゲートされたときのみ checkout モジュールをロード
        rememberKoinModules(checkoutModule, unloadOnForgotten = true)
        CheckoutScreen()
    }
    composable("profile") {
        // ここにナビゲートされたときのみ profile モジュールをロード
        rememberKoinModules(profileModule, unloadOnForgotten = true)
        ProfileScreen()
    }
}
```

### デバッグ／プレビュー用モジュール

プレビュー用に実装を差し替えます：

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

### 条件付きモジュール

条件に基づいてモジュールをロードします：

```kotlin
@Composable
fun App(isDebug: Boolean) {
    if (isDebug) {
        rememberKoinModules(debugModule)
    }

    MainScreen()
}
```

## Lazy Modules との併用

パフォーマンス向上のために、Koin の Lazy Module ロードと組み合わせることができます：

```kotlin
val featureModule = lazyModule {
    // モジュールがロードされるときに、定義が遅延解析される
    factory<HeavyService>()
    viewModel<FeatureViewModel>()
}

@Composable
fun FeatureScreen() {
    rememberKoinModules(featureModule, unloadOnForgotten = true)

    val viewModel = koinViewModel<FeatureViewModel>()
}
```

## ベストプラクティス

1. **`unloadOnForgotten = true` を使用する** - メモリーリークを防止します
   ```kotlin
   rememberKoinModules(featureModule, unloadOnForgotten = true)
   ```

2. **1つの機能につき1つのモジュール** - モジュールはフォーカスを絞り、独立性を保つようにします。

3. **Lazy Module と組み合わせる** - 多くの機能を備えた大規模なアプリに有効です。
   ```kotlin
   val featureModule = lazyModule { /* ... */ }
   ```

4. **ナビゲーションレベルでロードする** - `NavHost` の Composable 内でモジュールをロードします。

5. **循環依存を避ける** - 機能モジュール同士が互いに依存しないようにします。

## 次のステップ

- **[Compose におけるスコープ](/docs/reference/koin-compose/compose-scopes)** - スコープ API について
- **[Compose の概要](/docs/reference/koin-compose/compose)** - セットアップと基本的なインジェクション
- **[Isolated Context](/docs/reference/koin-compose/isolated-context)** - SDK の分離