---
title: Androidのスコープ
---

このガイドでは、Android固有のスコープ実装について説明します。

:::info
コアスコープの概念については、[スコープ](/docs/reference/koin-core/scopes)を参照してください。
:::

## 概要

Koinのスコープを使用すると、Androidコンポーネントのライフサイクルに合わせて依存関係のライフサイクルを管理できます。これにより、メモリリークを防ぎ、適切なリソース管理を確実に行うことができます。

### スコープの階層

| スコープの種類 | 生存期間 | 画面回転後も保持されるか | DSL | アノテーション |
|------------|----------|-------------------|-----|------------|
| **Application** | アプリ全体 | ✅ はい | `single { }` | `@Singleton` |
| **Activity** | Activityのライフサイクル | ❌ いいえ | `activityScope { }` | `@ActivityScope` |
| **Activity Retained** | finish()まで | ✅ はい | `activityRetainedScope { }` | `@ActivityRetainedScope` |
| **Fragment** | Fragmentのライフサイクル | ❌ いいえ | `fragmentScope { }` | `@FragmentScope` |
| **ViewModel** | ViewModelのライフサイクル | ✅ はい | `viewModelScope { }` | `@ViewModelScope` |

### スコープの関係性

```
Application Scope (single { })
    └── Activity Retained Scope (画面回転後も保持)
            └── Activity Scope
                    ├── Fragment Scope 1
                    └── Fragment Scope 2
            └── ViewModel Scope (Activity/Fragmentスコープにはアクセス不可)
```

:::info
**重要な原則:** 子スコープは親スコープの定義にアクセスできますが、その逆はできません。
:::

## スコープされた依存関係の宣言

### コンパイラプラグインDSL

```kotlin
val appModule = module {
    // Activityスコープ
    activityScope {
        scoped<ActivityPresenter>()
        scoped<ActivityNavigator>()
    }

    // Fragmentスコープ
    fragmentScope {
        scoped<FragmentPresenter>()
    }

    // ViewModelスコープ
    viewModelScope {
        scoped<UserCache>()
        viewModel<UserViewModel>()
    }
}
```

### アノテーション

```kotlin
// Activityスコープ
@ActivityScope
class ActivityPresenter(private val repository: UserRepository)

@ActivityScope
class ActivityNavigator

// Activityリテインスコープ (画面回転後も保持)
@ActivityRetainedScope
class RetainedPresenter

// Fragmentスコープ
@FragmentScope
class FragmentPresenter

// ViewModelスコープ
@ViewModelScope
class UserCache

@KoinViewModel
@ViewModelScope
class UserViewModel(private val cache: UserCache) : ViewModel()
```

### 従来のDSL

```kotlin
val appModule = module {
    activityScope {
        scoped { ActivityPresenter(get()) }
        scoped { ActivityNavigator() }
    }

    fragmentScope {
        scoped { FragmentPresenter(get()) }
    }

    viewModelScope {
        scoped { UserCache() }
        viewModel { UserViewModel(get()) }
    }
}
```

## Androidコンポーネントでのスコープの使用

### Activityスコープ

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // Activityのライフサイクルに紐付いたスコープを作成
    override val scope: Scope by activityScope()

    // スコープから注入
    private val presenter: ActivityPresenter by inject()
}
```

または、便利なベースクラスを使用します：

```kotlin
class MyActivity : ScopeActivity() {

    // スコープはすでにセットアップされています
    private val presenter: ActivityPresenter by inject()
}
```

### Activityリテインスコープ

設定変更（回転、テーマの変更など）後も保持されます：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    // ViewModelのライフサイクルに支えられており、画面回転後も保持されます
    override val scope: Scope by activityRetainedScope()

    private val presenter: RetainedPresenter by inject()
}
```

または、便利なベースクラスを使用します：

```kotlin
class MyActivity : RetainedScopeActivity() {

    private val presenter: RetainedPresenter by inject()
}
```

### Fragmentスコープ

Fragmentスコープは自動的に親Activityのスコープにリンクされます：

```kotlin
class MyFragment : Fragment(), AndroidScopeComponent {

    override val scope: Scope by fragmentScope()

    // Fragmentスコープから取得
    private val presenter: FragmentPresenter by inject()

    // Activityスコープの依存関係にもアクセス可能
    private val activityPresenter: ActivityPresenter by inject()
}
```

または、便利なベースクラスを使用します：

```kotlin
class MyFragment : ScopeFragment() {

    private val presenter: FragmentPresenter by inject()
}
```

## 型ベース vs アーキタイプスコープ

### アーキタイプスコープ (推奨)

任意のActivity/Fragmentで動作する汎用的なスコープです：

```kotlin
module {
    activityScope {
        scoped<MyPresenter>()
    }
}

// 任意のActivityで使用可能
class ActivityA : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}

class ActivityB : ScopeActivity() {
    private val presenter: MyPresenter by inject()
}
```

### 型ベースのスコープ

特定のクラスに紐付いたスコープです：

```kotlin
module {
    scope<MyActivity> {
        scoped<MyPresenter>()
    }
}

// MyActivityでのみ動作します
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    override val scope: Scope by activityScope()
    private val presenter: MyPresenter by inject()
}
```

## ViewModelスコープ

ViewModelは（メモリリークを防ぐために）ActivityやFragmentのスコープにアクセスできません。スコープされた依存関係にはViewModelスコープを使用してください：

```kotlin
module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

ViewModelスコープの詳細な使用方法については、[スコープ - ViewModelスコープ](/docs/reference/koin-core/scopes#viewmodel-scope)を参照してください。

## スコープのライフサイクル

### スコープ終了の処理

スコープが破棄される前にクリーンアップを実行するには、`onCloseScope()` をオーバーライドします：

```kotlin
class MyActivity : AppCompatActivity(), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // scope.close() の直前に呼び出されます
        // ここではまだスコープにアクセス可能です
    }
}
```

:::warning
`onDestroy()` 内でスコープにアクセスしないでください。その時点ですでにスコープは閉じられています。
:::

## スコープのリンク

カスタムスコープを使用して、コンポーネント間でインスタンスを共有します：

```kotlin
module {
    scope(named("session")) {
        scoped<UserSession>()
    }
}
```

```kotlin
class MyActivity : ScopeActivity() {

    fun startSession() {
        val sessionScope = getKoin().createScope("session", named("session"))

        // 現在のスコープにリンク
        scope.linkTo(sessionScope)

        // これでUserSessionにアクセス可能になります
        val session: UserSession = get()
    }
}
```

## クイックリファレンス

| コンポーネント | デリゲート | ベースクラス |
|-----------|----------|------------|
| Activity | `by activityScope()` | `ScopeActivity` |
| Activity (retained) | `by activityRetainedScope()` | `RetainedScopeActivity` |
| Fragment | `by fragmentScope()` | `ScopeFragment` |

| スコープ | 画面回転後も保持されるか | ユースケース |
|-------|-------------------|----------|
| `activityScope` | ❌ いいえ | UI状態、Presenter |
| `activityRetainedScope` | ✅ はい | フォームの状態、保留中のリクエスト |
| `fragmentScope` | ❌ いいえ | Fragment固有のPresenter |
| `viewModelScope` | ✅ はい | ViewModelの依存関係 |

## ベストプラクティス

1. **アーキタイプを使用する** - 再利用性のために、`scope<MyActivity> { }` よりも `activityScope { }` を優先してください。
2. **回転時はリテインを使用する** - 画面回転後も保持すべき状態には `activityRetainedScope` を使用してください。
3. **リークさせない** - SingletonにActivityやFragmentを注入しないでください。
4. **カスタムスコープを閉じる** - 手動で作成したスコープは必ず閉じてください。
5. **onCloseScopeを使用する** - スコープ破棄前のクリーンアップに使用してください。

## 次のステップ

- **[コアスコープ](/docs/reference/koin-core/scopes)** - スコープの基本とViewModelスコープ
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModelの注入
- **[テスト](/docs/reference/koin-test/testing)** - スコープされた依存関係のテスト