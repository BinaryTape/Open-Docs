---
title: Koin 対 Hilt/Dagger
---

# Koin 対 Hilt/Dagger

このページでは、Koin を Hilt および Dagger と比較し、それらの違いを理解して、どのフレームワークがあなたのニーズに適しているかを判断するのに役立つ情報を提供します。

:::info
Koin は **DSL とアノテーション** の両方をサポートしています。チームに合った方を選択してください。どちらも第一級市民（first-class citizens）であり、同じコンパイラプラグインによって同等に強力な機能が提供されます。この比較では、Hilt と公平に比較するためにアノテーションの例を示しますが、Koin の DSL はさらに少ないボイラープレートで同等の機能を提供します。
:::

## 哲学の違い

| 項目 | Koin | Hilt/Dagger |
|--------|------|-------------|
| **学習曲線** | 数分で習得可能 | 習得に数時間から数日かかる |
| **コードの複雑さ** | シンプルな DSL またはアノテーション | 複雑なアノテーションルール |
| **デバッグ** | 明確なエラー、生成されたコードの迷路がない | 生成されたコードの追跡が困難な場合がある |
| **セットアップ** | 1つのプラグイン、最小限の設定 | 複数のアノテーション、厳格なルール |
| **コンパイル時の安全性** | ✅ コンパイラプラグインを使用 | ✅ 常に確保 |
| **実行時の柔軟性** | ✅ 動的な機能 | ❌ 静的な構成のみ |

## アノテーションの比較

Koin ではアノテーションさえもよりシンプルです：

| タスク | Koin | Hilt |
|------|------|------|
| **シングルトン** | `@Singleton class MyService` | `@Singleton class MyService @Inject constructor(...)` |
| **インターフェースのバインディング** | 自動 | 抽象モジュール内での `@Binds` が必要 |
| **コンポーネントのスキャン** | `@ComponentScan("package")` | 利用不可 |
| **モジュールの検出** | `@Configuration` - 自動検出 | モジュールごとの手動での `@InstallIn` |
| **サードパーティ製の提供** | `@Singleton fun provide()` | `@Module` 内の `@Provides` + `@InstallIn` |
| **ViewModel** | `@KoinViewModel class MyVM` | `@HiltViewModel class MyVM @Inject constructor` |

## コードの比較

### シンプルなシングルトン

**Koin:**
```kotlin
@Singleton
class MyRepository(val api: ApiService)

@Module
@ComponentScan("com.app")
class AppModule
```

**Hilt:**
```kotlin
@Singleton
class MyRepository @Inject constructor(val api: ApiService)

@Module
@InstallIn(SingletonComponent::class)
abstract class AppModule {
    @Binds
    abstract fun bindRepository(impl: MyRepository): Repository
}
```

### インターフェースのバインディング

**Koin - 自動:**
```kotlin
@Singleton
class UserRepositoryImpl(val db: Database) : UserRepository

// これだけです！ Koin は自動的に UserRepository インターフェースにバインドします
```

**Hilt - 明示的なバインディングが必要:**
```kotlin
@Singleton
class UserRepositoryImpl @Inject constructor(val db: Database) : UserRepository

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    @Binds
    abstract fun bindUserRepository(impl: UserRepositoryImpl): UserRepository
}
```

### マルチモジュールアプリ

**Koin - モジュールの自動検出:**
```kotlin
// feature/auth/AuthModule.kt
@Module
@ComponentScan
@Configuration  // 自動検出されます！
class AuthModule

// feature/profile/ProfileModule.kt
@Module
@ComponentScan
@Configuration  // 自動検出されます！
class ProfileModule

// app/MyApp.kt
@KoinApplication  // モジュールをリストアップする必要はありません
class MyApp
```

**Hilt - 各モジュールを手動でインストールする必要がある:**
```kotlin
// feature/auth/AuthModule.kt
@Module
@InstallIn(SingletonComponent::class)
class AuthModule { ... }

// feature/profile/ProfileModule.kt
@Module
@InstallIn(SingletonComponent::class)
class ProfileModule { ... }

// app/MyApp.kt
@HiltAndroidApp
class MyApp  // いたるところで正しい @InstallIn が必要です
```

### ViewModel

**Koin:**
```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()

// Activity/Fragment 内
val viewModel: UserViewModel by viewModel()

// Compose 内
val viewModel: UserViewModel = koinViewModel()
```

**Hilt:**
```kotlin
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel()

// Activity/Fragment 内
val viewModel: UserViewModel by viewModels()

// Compose 内
val viewModel: UserViewModel = hiltViewModel()
```

### サードパーティ製ライブラリの提供

**Koin:**
```kotlin
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()

    @Singleton
    fun provideApi(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

**Hilt:**
```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .build()

    @Provides
    @Singleton
    fun provideApi(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

## 動的な機能：Koin 独自の強み

Koin は **実行時（runtime）ベースですが、パフォーマンスに優れ、コンパイル時の安全性も確保されています**。これにより、Hilt では提供できない動的な機能が可能になります。

| 動的な機能 | Koin | Hilt |
|-----------------|------|------|
| 実行時にモジュールをロード | ✅ `loadKoinModules()` | ❌ 不可能 |
| モジュールのアンロード | ✅ `unloadKoinModules()` | ❌ 不可能 |
| バックグラウンドでの遅延ロード | ✅ `lazyModules()` | ❌ 不可能 |
| フィーチャーフラグによる注入 | ✅ 容易 | ⚠️ 複雑な回避策が必要 |
| プラグインアーキテクチャ | ✅ 自然に適合 | ❌ 非常に困難 |
| A/B テストの実装 | ✅ 実行時の入れ替え | ⚠️ コンパイル時のみ |
| 動的な構成 | ✅ サポート済み | ❌ 不可、再コンパイルが必要 |

### 例：動的なモジュールロード

```kotlin
// KOIN - 動的なモジュールロード
if (userHasPremium) {
    loadKoinModules(premiumFeatureModule)
}

// その後、サブスクリプションが期限切れになった場合
unloadKoinModules(premiumFeatureModule)

// 起動を高速化するための遅延ロード
startKoin {
    modules(coreModule)
    lazyModules(
        analyticsModule,  // バックグラウンドでロード
        heavyFeatureModule
    )
}
```

**これは Hilt では不可能です**。すべての依存関係はコンパイル時に接続されます。

### 例：フィーチャーフラグ

```kotlin
// KOIN - 実行時に実装を切り替える
val featureModule = module {
    if (FeatureFlags.useNewApi) {
        single<ApiService> { NewApiService() }
    } else {
        single<ApiService> { LegacyApiService() }
    }
}

// または動的に
fun updateApiImplementation(useNew: Boolean) {
    unloadKoinModules(apiModule)
    loadKoinModules(if (useNew) newApiModule else legacyApiModule)
}
```

## セットアップの比較

### Koin のセットアップ

詳細な手順については、**[コンパイラプラグインセットアップガイド](/docs/setup/compiler-plugin)**を参照してください。

### Hilt のセットアップ

```kotlin
// settings.gradle.kts
plugins {
    id("com.google.dagger.hilt.android") version "2.x" apply false
}

// app/build.gradle.kts
plugins {
    id("com.google.devtools.ksp")
    id("dagger.hilt.android.plugin")
}

dependencies {
    implementation("com.google.dagger:hilt-android:2.x")
    ksp("com.google.dagger:hilt-compiler:2.x")
}
```

## エラーメッセージ

### Koin

```
org.koin.core.error.NoBeanDefFoundException:
No definition found for class 'com.app.UserRepository'.
Check your module definitions.
```

明確で、問題の箇所を直接示します。

### Hilt/Dagger

```
error: [Dagger/MissingBinding] com.app.UserRepository cannot be provided
without an @Inject constructor or an @Provides-annotated method.
com.app.UserRepository is injected at
    com.app.UserService(repository)
com.app.UserService is injected at
    com.app.UserActivity.service
com.app.UserActivity is injected at
    dagger.hilt.android.internal.managers.ActivityComponentManager.inject
```

より長く、コンポーネントグラフを理解する必要があります。

## どちらを選ぶべきか

### 次のような場合は Koin を選択してください：

- **生産性とシンプルさ**を重視する場合
- **実行時の柔軟性**（動的なモジュール、フィーチャーフラグ）が必要な場合
- **Kotlin Multiplatform** アプリを構築している場合
- チームが**迅速に習得**することを望んでいる場合
- **ボイラープレートを減らしたい**場合
- **デバッグを容易に**したい場合

### 次のような場合は Hilt を選択してください：

- チームが**すでに Dagger を熟知している**場合
- **Google 第一のエコシステム**との互換性が必要な場合
- **Dagger 特有の機能**が必要な場合

## Hilt から Koin への移行

移行を検討している場合：

### コンセプトのマッピング

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `@KoinApplication` および `startKoin<T> { }` |
| `@AndroidEntryPoint` | `by inject()` |
| `@HiltViewModel` と `by viewModels()` | `@KoinViewModel` と `by viewModel()` |
| `@Inject constructor` | コンストラクタのみ（自動検出） |
| `@Binds` | 自動または `bind` |
| `@InstallIn(SingletonComponent)` | `@Configuration` |
| 関数に対する `@Provides` | 関数に対する `@Factory` |

### 段階的な移行

段階的に移行することができます：

1. プロジェクトに Koin を追加する
2. 一度に 1 つの機能モジュールを移行する
3. 移行期間中は両方の DI フレームワークを共存させることができます（Koin は `@ComponentScan` で対象パッケージをスキャンできます）
4. 移行が完了したら Hilt を削除する

詳細な手順については、[Hilt からの移行](/docs/migration/from-hilt)を参照してください。

## まとめ

**Koin: シンプルかつ強力**

- Hilt のような**コンパイル時の安全性**（コンパイラプラグイン使用時）
- **DSL またはアノテーション** - どちらも同等に強力で、選択は自由
- Hilt では太刀打ちできない**シンプルさと生産性**
- Hilt では不可能な**動的な実行時機能**

安全性とシンプルさのどちらかを選ぶ必要はありません。Koin なら、その両方が手に入ります。

## 次のステップ

- **[Koin とは？](/docs/intro/what-is-koin)** - Koin について詳しく学ぶ
- **[セットアップガイド](/docs/setup/gradle)** - プロジェクトに Koin を追加する
- **[Hilt からの移行](/docs/migration/from-hilt)** - ステップバイステップの移行ガイド