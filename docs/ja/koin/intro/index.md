---
title: はじめに
---

# Koin へようこそ

**Kotlin のための実用的な依存性注入（DI）フレームワーク - シンプル、かつパワフル**

Koin は Kotlin 開発者のための軽量な依存性注入フレームワークです。Android アプリ、Kotlin Multiplatform プロジェクト、Ktor を使用したバックエンドサービス、あるいはその他のあらゆる Kotlin アプリケーションを構築している場合でも、Koin は依存性注入をシンプルかつ直感的なものにします。

## なぜ Koin なのか？

Koin は明確な哲学に基づいて設計されました。それは、**「シンプルさ」と「機能性」のどちらかを選ぶ必要はない**ということです。Koin を使えば、その両方が手に入ります。

### DSL とアノテーション - 好きな方を選択可能

Koin はどちらのアプローチでも強力です。クリーンな Kotlin DSL を好みますか？ それなら DSL を使いましょう。アノテーションが好きですか？ それならアノテーションを使いましょう。どちらも第一級市民（ファーストクラス・シチズン）であり、同等に強力です。

| 価値 | 意味 |
|-------|---------------|
| **高い生産性** | 習得しやすく、書きやすい。数時間ではなく、数分で DI を動作させることができます |
| **開発者に優しい** | DSL またはアノテーション、お好みのほうを。明確なエラー、容易なデバッグ、最高の開発者体験（DX） |
| **スケーラブル** | 複雑な依存関係グラフを持つ大規模なエンタープライズアプリケーションにも対応可能 |
| **安全** | Koin Compiler Plugin によるコンパイル時の安全性 |
| **ダイナミック** | ランタイムの柔軟性：モジュールの動的ロード、遅延読み込み（Lazy loading）、フィーチャーフラグ |

## どこから始める？

あなたの経験レベルに合わせてパスを選択してください：

### 依存性注入（DI）が初めての方

まずは基本から始めましょう：
- **[依存性注入とは？](/docs/intro/what-is-dependency-injection)** - コアコンセプトを理解する

### DI は知っているが、Koin は初めての方

すぐに Koin の詳細に進みましょう：
- **[Koin とは？](/docs/intro/what-is-koin)** - Koin の DI へのアプローチを知る
- **[Koin Compiler Plugin](/docs/intro/koin-compiler-plugin)** - 推奨される、より安全な Koin の使用方法

### Hilt や Dagger から移行する方

Koin との比較を確認してください：
- **[Koin vs Hilt/Dagger](/docs/intro/koin-vs-hilt)** - 違いと移行パスを理解する

### すぐにコードを書きたい方

- **[セットアップガイド](/docs/setup/gradle)** - プロジェクトに Koin を追加する
- **[チュートリアル](/docs/tutorials/your-first-app)** - 初めての Koin アプリを構築する
- **[Koin IDE Plugin](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)** - Android Studio および IntelliJ IDEA 用の公式プラグインをインストール：コードナビゲーション、ライブセーフティチェック、依存関係グラフの可視化が可能になります

## Koin のアプローチ

Koin は、依存関係の定義方法に柔軟性を提供します：

| アプローチ | ステータス | 説明 |
|----------|--------|-------------|
| **Koin Compiler Plugin** (Kotlin 2.x) | 推奨 | DSL: `single<MyService>()`, `factory<MyRepo>()`, `viewModel<MyVM>()` |
| **Koin Compiler Plugin** (Kotlin 2.x) | 推奨 | アノテーション: `@Singleton`, `@Factory`, `@KoinViewModel`。依存関係を自動検出し、コンパイル時の安全性を確保 |
| **Classic DSL** | フルサポート | `singleOf(::MyService)`, `single { MyService(get()) }`。任意の Kotlin バージョンで動作。準備ができたら Compiler Plugin を追加して安全性を強化可能 |
| **KSP Processor** (`koin-ksp-compiler`) | 非推奨 | Koin Annotations 用のレガシープロセッサ。Compiler Plugin への移行を推奨（同じアノテーション、ネイティブなコンパイラ統合） |

詳細は [Koin とは？](/docs/intro/what-is-koin) および [Koin Compiler Plugin](/docs/intro/koin-compiler-plugin) をご覧ください。

## プラットフォームのサポート

Koin は Kotlin が動作するすべての場所で利用可能です：

| プラットフォーム | パッケージ | ステータス |
|----------|---------|--------|
| **Kotlin/JVM** | `koin-core` | ✅ フルサポート |
| **Android** | `koin-android` | ✅ フルサポート |
| **Compose (Android & Multiplatform)** | `koin-compose` | ✅ フルサポート |
| **iOS** | `koin-core` | ✅ フルサポート |
| **Desktop** | `koin-core` | ✅ フルサポート |
| **Web (JS/Wasm)** | `koin-core` | ✅ フルサポート |
| **Ktor** | `koin-ktor` | ✅ フルサポート |

## クイック例

Koin のコードがどのようなものか、以下に示します：

```kotlin
// クラスを定義する
class UserRepository(private val api: ApiService)
class UserViewModel(private val repository: UserRepository) : ViewModel()

// Compiler Plugin DSL を使用してモジュールを定義する
val appModule = module {
    single<ApiService>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}

// Koin を開始する
startKoin {
    modules(appModule)
}

// Activity で注入する
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

またはアノテーションを使用する場合：

```kotlin
@Singleton
class UserRepository(private val api: ApiService)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

準備はできましたか？ [セットアップガイド](/docs/setup/gradle) へ進みましょう。