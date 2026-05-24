---
title: Koinとは？
---

# Koinとは？

### 実用的（Pragmatic）なKotlin向け依存性注入フレームワーク - シンプル、かつ強力

Koinは、Kotlin専用に設計された軽量な依存性注入（Dependency Injection: DI）フレームワークです。コード生成やリフレクションに依存する従来のDIフレームワークとは異なり、Koinは2つの強力なアプローチを提供します。クリーンな **Kotlin DSL** と、直感的な **アノテーション** です。チームに最適な方を選択してください。どちらも第一級の機能としてサポートされています。

## Koinの核心となる価値（Core Values）

| 価値 | 意味 |
|-------|---------------|
| **生産的** | 学習しやすく、書きやすい。DIを数時間ではなく数分で稼働させることができます。 |
| **開発者フレンドリー** | DSLかアノテーション、好きな方を選べます。明確なエラー、簡単なデバッグ、最高のDX（開発体験）。 |
| **拡張性** | 複雑な依存関係グラフを持つ大規模なエンタープライズアプリケーションにも対応します。 |
| **安全** | Koinコンパイラプラグインによるコンパイル時の安全性。 |
| **動的** | 実行時の柔軟性：モジュールの動的ロード、遅延ロード、機能フラグ。 |

## 開発者にKoinが選ばれる理由

- **数分で学習可能** - 複雑な概念はなく、直感的なDSLとシンプルなアノテーション。
- **コード量の削減** - DSLまたはアノテーション、コンパイラプラグインが依存関係を自動的に接続（オートワイヤリング）します。
- **スタイルの選択** - Kotlin愛好家にはDSL、馴染みのあるパターンにはアノテーション。どちらも同様に強力です。
- **簡単なデバッグ** - 明確なエラーメッセージ。追跡すべき生成コードはありません。
- **自信を持って拡張** - 世界中の企業で本番環境に使用されています。
- **安全性の維持** - コンパイル時の検証により、実行前にエラーをキャッチします。
- **柔軟性の維持** - 実行時ベースでありながらパフォーマンスに優れています。動的モジュール、遅延ロード、機能フラグに対応。
- **IDEサポート** - Android StudioおよびIntelliJ IDEA用の公式プラグイン。定義へのジャンプ、ライブ安全チェック、グラフの可視化。

## 2つのスタイル、1つのフレームワーク - どちらも同様に強力

Koinは依存関係を定義するための2つのスタイルをサポートしています。どちらも完全な機能の同等性を備えた第一級の機能です。チームに合う方を選択してください。

### DSLスタイル

Kotlin DSL構文を使用して依存関係を定義します。

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

### アノテーションスタイル

アノテーションを使用して依存関係を定義します。

```kotlin
@Singleton
class Database

@Singleton
class ApiClient

@Singleton
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

どちらのスタイルも、コンパイル時の安全性を確保するために **Koinコンパイラプラグイン** によって処理されます。

## よりシンプルなKoinのアノテーション

HiltやDaggerを使用したことがあるなら、Koinのアノテーションは儀式（冗長な記述）が少ないことに気づくでしょう。

| タスク | Koin | Hilt |
|------|------|------|
| **シングルトン** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **インターフェースのバインド** | 自動（インターフェースを実装するだけ） | 抽象モジュール内で`@Binds`が必要 |
| **コンポーネントスキャン** | `@ComponentScan("package")` | 利用不可 |
| **モジュールの発見** | `@Configuration` - 自動発見 | モジュールごとの手動`@InstallIn` |

**例による比較:**

```kotlin
// KOIN - これだけです！
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

```kotlin
// HILT - より多くの儀式が必要
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

## Koinコンパイラプラグインによる強化

**Koinコンパイラプラグイン**は、すべての新規プロジェクトでKoinを使用する際に推奨される方法です。

- **ネイティブKotlinコンパイラプラグイン (K2)** - KSPではなく、直接的なコンパイラ統合。
- **コンストラクタパラメータの自動検出** - 手動での接続（配線）が減少。
- **コンパイル時の安全性** - ビルド中にエラーをキャッチ。
- **DSLとアノテーションの両方で動作** - 好きな方を選択可能。
- **簡単なセットアップ** - 1つのGradleプラグインのみ。

### コンパイラプラグインによるクリーンな構文

| クラシックDSL | コンパイラプラグインDSL |
|-------------|---------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `single { MyService(get(), get()) }` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |

詳細は[Koinコンパイラプラグイン](/docs/intro/koin-compiler-plugin)をご覧ください。

## クラシックDSL（完全サポート）

クラシックDSLは、すべてのKotlinバージョンで引き続き完全にサポートされています。

```kotlin
val appModule = module {
    singleOf(::Database)
    singleOf(::ApiClient)
    singleOf(::UserRepository)
    viewModelOf(::UserViewModel)
}
```

または、明示的な接続を行う場合：

```kotlin
val appModule = module {
    single { Database() }
    single { ApiClient() }
    single { UserRepository(get(), get()) }
    viewModel { UserViewModel(get()) }
}
```

:::info
クラシックDSLは非推奨ではありません。Koinはこれを使用して完璧に動作します。コンパイラプラグインは、移行の準備ができたときに、その上でコンパイル時解析を追加するものです。
:::

## Koin AnnotationsがKoinプロジェクトの一部になりました

`koin-annotations`ライブラリ（`@Singleton`、`@Factory`、`@KoinViewModel`、`@Module`、`@ComponentScan`など）は、メインのKoinバージョンとしてリリースされ、完全にサポートされています。これは非推奨では**ありません**。

```kotlin
dependencies {
    implementation(platform("io.insert-koin:koin-bom:$koin_version"))
    implementation("io.insert-koin:koin-core")
    implementation("io.insert-koin:koin-annotations") // 同じKoinバージョン
}
```

アノテーションは **Koinコンパイラプラグイン** によって処理されます。[Koinコンパイラプラグイン](/docs/intro/koin-compiler-plugin)および[アノテーションリファレンス](/docs/reference/koin-annotations/start)を参照してください。

## Koin KSPコンパイラはKoinコンパイラプラグインに置き換わり非推奨となりました

:::info
レガシーなKSPプロセッサである`koin-ksp-compiler`は**非推奨（deprecated）**となり、将来のKoinバージョンで削除される予定です。代替となるのは **Koinコンパイラプラグイン** です。これはネイティブなK2コンパイラ統合であり、ファイルの生成がなく、KMP（Kotlin Multiplatform）のセットアップもより簡単になります。
:::

`koin-ksp-compiler`でKoin Annotationsを使用している場合は、コンパイラプラグインに移行してください。

- **アノテーションは同じ** — コードの変更は不要
- **より優れた処理** — ネイティブコンパイラ統合、生成ファイルなし
- **セットアップの簡略化** — KSPの設定が不要

詳細は[KSPからコンパイラプラグインへの移行](/docs/migration/from-ksp-to-compiler-plugin)をご覧ください。

## 実行時 + コンパイル時の安全性 = 両方の長所を享受

Koinは**実行時ベースですが、パフォーマンスが高く、コンパイル時にも安全**です。このユニークな組み合わせにより、以下が可能になります。

**コンパイル時の安全性**（コンパイラプラグイン使用時）:
- ビルド中に依存関係グラフを検証
- コンストラクタパラメータを自動検出
- 実行前に不足している依存関係をキャッチ

**実行時の柔軟性**（コンパイル時のみのフレームワークでは提供できないもの）:
- 動的なモジュールのロード/アンロード
- モジュールの遅延ロード（バックグラウンド）
- 機能フラグ（Feature flag）による注入
- プラグインアーキテクチャ
- 異なる実装によるA/Bテスト

```kotlin
// 動的なモジュールロード - Hiltでは不可能です
if (featureEnabled) {
    loadKoinModules(premiumFeatureModule)
}

// その後、機能が無効になった場合
unloadKoinModules(premiumFeatureModule)
```

## Koinはどのような人に向いていますか？

Koinは以下のような方に最適です：

- **生産性を重視するチーム** - ボイラープレートを減らし、開発をスピードアップ
- **Android開発者** - Hilt/DaggerよりもクリーンなDIを求める方
- **Kotlin Multiplatformプロジェクト** - Android, iOS, Desktop, Web, Backend
- **拡張が必要なエンタープライズプロジェクト**
- **DIは複雑であるべきではないと考えているすべての人**

## 次へのステップ

- **[依存性注入とは？](/docs/intro/what-is-dependency-injection)** - DIの基礎を学ぶ
- **[Koinコンパイラプラグイン](/docs/intro/koin-compiler-plugin)** - 推奨されるアプローチ
- **[セットアップガイド](/docs/setup/gradle)** - プロジェクトにKoinを追加する
- **[チュートリアル](/docs/tutorials/your-first-app)** - Koinを使用して最初のアプリを作成する