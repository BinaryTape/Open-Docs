---
title: JUnit テスト
---

> このチュートリアルでは、Kotlin アプリケーションをテストし、Koin を使用してコンポーネントを注入 (inject) および取得する方法を説明します。

:::note
更新 - 2025-01-28
:::

## コードの取得

:::info
[ソースコードは GitHub で公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/kotlin)
:::

## Gradle の設定

まず、以下のように Koin の依存関係を追加します。

```groovy
dependencies {
    // Koin テストツール
    testImplementation "io.insert-koin:koin-test:$koin_version"
    // 必要な JUnit バージョン
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

## 宣言された依存関係

`koin-core` の入門プロジェクトを再利用して、Koin モジュールを使用します。

```kotlin
val appModule = module {
    single<UserApplication>()
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

## モジュールの検証

:::tip
Koin Compiler Plugin がコンパイル時の依存関係検証を提供し、テストコードを書かなくてもビルド時に不足している依存関係を検出できるようになりました。[コンパイル時の安全性 (Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety) を参照してください。
:::

コンパイラプラグインを使用していない場合は、実行時にモジュールを検証できます。`verify()` 関数は、すべての依存関係が解決可能であることを確認するためのドライラン (dry-run) チェックを実行します。

```kotlin
class ModuleVerificationTest : AutoCloseKoinTest() {

    @Test
    fun verifyModules() {
        appModule.verify()
    }
}
```

依存関係の定義が無効な場合や、必要な依存関係が不足している場合、このテストは失敗します。

## KoinTestRule を使用したテストの作成

依存関係を注入するテストを作成するには、`KoinTest` を継承し、`KoinTestRule` を使用します。

```kotlin
class UserAppTest : KoinTest {

    val userService by inject<UserService>()
    val userRepository by inject<UserRepository>()

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger()
        modules(appModule)
    }

    @Test
    fun `test user service`() {
        // サービス経由でユーザーを読み込む
        userService.loadUsers()

        // ユーザーが見つかることを検証する
        val user = userService.getUserOrNull("Alice")
        assertNotNull(user)
        assertEquals("Alice", user?.name)
    }
}
```

> Koin の `KoinTestRule` ルールを使用して、各テストで Koin コンテキストの開始と停止を行います。

## 依存関係のモック

`declareMock` を使用して、テスト内の依存関係をモック化できます。これにより、実際の実装がモックに置き換えられます。

```kotlin
class UserMockTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        printLogger(Level.DEBUG)
        modules(appModule)
    }

    @get:Rule
    val mockProvider = MockProviderRule.create { clazz ->
        Mockito.mock(clazz.java)
    }

    @Test
    fun `mock test`() {
        // UserRepository のモックを宣言
        val repository = declareMock<UserRepository> {
            given(findUserOrNull(anyString())).willReturn(
                User("Mock", "mock@example.com")
            )
        }

        // モック化されたリポジトリを使用してアプリケーションを使用
        getKoin().get<UserApplication>().sayHello("Mock")

        // モックが呼び出されたことを検証
        Mockito.verify(repository, times(1)).findUserOrNull(anyString())
    }
}
```

`MockProviderRule` は Mockito をモックフレームワークとして設定し、`declareMock` は実際の `UserRepository` を制御されたデータを返すモックに置き換えます。

## テストの主要な概念

| 概念 | 説明 |
|---------|-------------|
| `KoinTest` | Koin テストをサポートするために継承するインターフェース |
| `AutoCloseKoinTest` | 各テストの後に Koin を自動的にクローズする |
| `KoinTestRule` | Koin コンテキストを開始・停止するための JUnit ルール |
| `MockProviderRule` | モックフレームワークを設定する |
| `verify()` | 実行せずにモジュール設定を検証する |
| `declareMock<T>()` | 定義をモックに置き換える |
| `by inject<T>()` | テスト内で依存関係を遅延注入 (lazy inject) する |

## 関連項目

- **[テストリファレンス](/docs/reference/koin-test/testing)** - 完全なテストドキュメント
- **[モジュールの検証](/docs/reference/koin-test/verify)** - `verify()` および `checkModules()` の詳細