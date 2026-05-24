---
title: トラブルシューティング
---

# トラブルシューティング

このガイドでは、デバッグ、一般的なエラー、および避けるべきアンチパターンについて説明します。

## 循環依存 (Circular Dependencies)

### 問題

```kotlin
// 循環依存
class ServiceA(val serviceB: ServiceB)
class ServiceB(val serviceA: ServiceA)

module {
    single { ServiceA(get()) }
    single { ServiceB(get()) }  // エラー: 循環依存が発生しています！
}
```

:::tip コンパイラプラグインによるコンパイル時の検出
[Koin Compiler Plugin](/docs/reference/koin-compiler/compile-safety) は、コンパイル時（A2/A3 フェーズ）に循環依存を検出します。実行時まで待つ必要はありません。プラグインを使用しない場合、サイクルは起動時に実行時エラーで失敗します。
:::

### 解決策 1: 遅延インジェクション (Lazy Injection)

遅延解決を使用してサイクルを解消します。

```kotlin
class ServiceA : KoinComponent {
    val serviceB: ServiceB by inject()  // 遅延 (Lazy)
}

class ServiceB : KoinComponent {
    val serviceA: ServiceA by inject()  // 遅延 (Lazy)
}

module {
    single { ServiceA() }
    single { ServiceB() }
}
```

### 解決策 2: 共有依存関係の抽出

リファクタリングしてサイクルを削除します（推奨）。

```kotlin
// 共有ロジックを抽出
@Singleton
class SharedService

@Singleton
class ServiceA(private val shared: SharedService)

@Singleton
class ServiceB(private val shared: SharedService)
```

### 解決策 3: インターフェースの使用

```kotlin
interface ServiceBContract {
    fun doSomething()
}

@Singleton
class ServiceA(private val serviceB: ServiceBContract)

@Singleton
class ServiceB(private val serviceA: ServiceA) : ServiceBContract
```

## デバッグ

### ロギングを有効にする

```kotlin
startKoin {
    // ログレベルの設定
    printLogger(Level.DEBUG)  // DEBUG, INFO, ERROR, NONE

    modules(appModule)
}
```

### `verify()` によるモジュールの検証

すべての定義が解決可能であることを検証します。

```kotlin
// テスト内
@Test
fun `verify all modules`() {
    appModule.verify()  // 依存関係が欠落している場合に失敗します
}
```

:::tip
Koin Compiler Plugin はコンパイル時の依存関係検証を提供するようになったため、`verify()` や `checkModules()` の必要性はなくなります。詳細は [コンパイル時の安全性 (Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety) を参照してください。
:::

## 一般的なエラー

**定義が見つからない (Missing Definition):**
```
No definition found for class 'UserRepository'
```
解決策: モジュールに不足している定義を追加します。

**循環依存 (Circular Dependency):**
```
Circular dependency detected
```
解決策: 遅延インジェクションを使用するか、リファクタリングを行います（上記参照）。

**スコープが見つからない (Scope Not Found):**
```
No scope definition found for 'MyScope'
```
解決策: スコープされた依存関係にアクセスする前に、スコープが作成されていることを確認します。

**複数の定義 (Multiple Definitions):**
```
Multiple definitions found for type 'ApiClient'
```
解決策: 限定子 (qualifier) を使用して定義を区別します。

## 一般的なアンチパターン

### 1. サービスロケータの過剰な使用

```kotlin
// 良くない例 - サービスロケータパターン
class UserViewModel : ViewModel(), KoinComponent {
    fun loadUser() {
        val repository = get<UserRepository>()  // 手動解決
        // ...
    }
}

// 良い例 - コンストラクタインジェクション
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    fun loadUser() {
        // 依存関係はすでに注入されています
    }
}
```

### 2. 巨大なモジュール (God Modules)

```kotlin
// 良くない例 - すべてを1つのモジュールにまとめている
val appModule = module {
    // ここに100以上の定義がある
}

// 良い例 - 整理されたモジュール
val databaseModule = module { /* ... */ }
val networkModule = module { /* ... */ }
val homeModule = module { /* ... */ }
```

### 3. 過剰な限定子 (Qualifiers)

```kotlin
// 良くない例 - 異なる型に対して限定子を使用している
module {
    single(named("user_repository")) { UserRepository() }
    single(named("order_repository")) { OrderRepository() }
}

// 良い例 - 型によって区別される
module {
    singleOf(::UserRepository)
    singleOf(::OrderRepository)
}
```

### 4. 関心の混在

```kotlin
// 良くない例 - モジュール内での副作用
module {
    single {
        println("Loading database...")  // 副作用
        Database()
    }
}

// 良い例 - 純粋な依存関係の作成
module {
    single { Database() }
}
```

### 5. 隠れた依存関係

```kotlin
// 良くない例 - 内部に隠された依存関係
class UserService {
    private val api = ApiClient()  // 隠れた依存関係
}

// 良い例 - 明示的な依存関係
class UserService(private val api: ApiClient)
```

## ベストプラクティスのまとめ

1. **コンストラクタインジェクションを優先する** - クラス内での `get()` 呼び出しを避ける
2. **Koin Compiler Plugin を使用する** - 定義の欠落をコンパイル時に発見する（またはテストで `verify()` を使用する）
3. **モジュールの責務を絞る** - 1つのモジュールにつき1つの責任 (Single responsibility) とする
4. **循環依存を避ける** - リファクタリングするか、遅延インジェクションを使用する
5. **限定子の使用は控えめにする** - 同じ型に対して複数のインスタンスがある場合のみ使用する

## 次のステップ

- **[モジュール](/docs/reference/koin-core/modules)** - モジュールの構成
- **[テスト](/docs/reference/koin-test/testing)** - Koin によるテスト
- **[スコープ](/docs/reference/koin-core/scopes)** - ライフサイクルの管理