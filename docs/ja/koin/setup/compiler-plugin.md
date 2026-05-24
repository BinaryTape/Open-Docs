---
title: コンパイラプラグインのセットアップ
---

# Koinコンパイラプラグインのセットアップ

**Koinコンパイラプラグイン**は、すべての新しいKotlin 2.xプロジェクトにおいて推奨されるアプローチです。オートワイヤリング（auto-wiring）、コンパイル時の安全性、そしてよりクリーンなDSL構文を提供します。

## コンパイラプラグインとは？

Koinコンパイラプラグインは、以下の特徴を持つ**ネイティブなKotlinコンパイラプラグイン（K2）**です：

- コンストラクタの依存関係を自動検出
- コンパイル時の解析を提供
- DSLとアノテーションの両方で動作
- 可視ファイルの生成なし

機能とメリットの詳細については、[Koinコンパイラプラグインの導入](/docs/intro/koin-compiler-plugin)を参照してください。

:::tip IDEプラグイン
Android StudioおよびIntelliJ IDEA用の**[Koin IDEプラグイン](https://plugins.jetbrains.com/plugin/26131-koin-dependency-injection-official-)**をインストールしてください。定義と注入ポイント（injection points）間のコードナビゲーション、ライブセーフティチェック、依存関係グラフの可視化機能が提供されます。
:::

## 要件

- **Kotlin 2.3.20+** (K2コンパイラ)
- **Gradle 8.x+**

## セットアップ

### ステップ 1: バージョンカタログへのKoinの追加

まず、最新バージョンを確認してください：
- Koin: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-core?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-core)
- Koinコンパイラプラグイン: [![Maven Central](https://img.shields.io/maven-central/v/io.insert-koin/koin-compiler-plugin?label=latest)](https://mvnrepository.com/artifact/io.insert-koin/koin-compiler-plugin)

次に、`gradle/libs.versions.toml`に以下を記述します：

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### ステップ 2: 設定の構成

`settings.gradle.kts`にて：

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### ステップ 3: プラグインの適用

モジュールの `build.gradle.kts`にて：

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // アノテーションサポートを利用する場合
}
```

:::tip
**`@KoinViewModel` や `@KoinWorker` を使用していますか？** これらのアノテーションを使用する場合、ランタイムDSLがクラスパスに含まれている必要があります：

- `@KoinViewModel` → `implementation("io.insert-koin:koin-core-viewmodel")`
- `@KoinWorker` → `implementation("io.insert-koin:koin-android-workmanager")`

ランタイムを追加せずにアノテーションを使用すると、コンパイラが不足しているアーティファクト名を明示したエラーを表示してビルドに失敗します。これにより、起動時に発生していた原因不明の `NoDefinitionFoundException` を防ぐことができます。
:::

## 完全な例

### gradle/libs.versions.toml

```toml
[versions]
koin = "<KOIN_VERSION>"
koin-plugin = "<KOIN_PLUGIN_VERSION>"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

### settings.gradle.kts

```kotlin
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### build.gradle.kts

```kotlin
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

## コンパイラプラグインの使用

### DSLスタイル

コンパイラプラグインのパッケージからインポートします：

```kotlin
import org.koin.plugin.module.dsl.*
import org.koin.dsl.module

val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    viewModel<UserViewModel>()
}
```

:::info
コンパイラプラグインのDSLは、パッケージ **`org.koin.plugin.module.dsl`** にあります。従来のDSLは `org.koin.dsl` に残っています。
:::

### アノテーションスタイル

クラスにアノテーションを使用します：

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

@Module
@ComponentScan("com.myapp")
class AppModule
```

### アノテーションによるKoinの開始

コンパイラプラグインを使用すると、型指定されたAPIを使用してKoinを開始できます。**コード生成は不要です**：

```kotlin
@KoinApplication
@ComponentScan("com.myapp")
class MyApp

// 型指定されたAPIでKoinを開始
startKoin<MyApp>()

// または追加の設定を行う場合
startKoin<MyApp> {
    androidContext(this@MyApplication)
    printLogger()
}
```

**利用可能な型指定API:**

| API | 説明 |
|-----|-------------|
| `startKoin<T>()` | アプリケーションTを使用してKoinをグローバルに開始する |
| `startKoin<T> { }` | アプリケーションTと設定ブロックを使用してKoinを開始する |
| `koinApplication<T>()` | Tを使用してアイソレートされたKoinApplicationを作成する |
| `koinConfiguration<T>()` | TからKoinConfigurationを作成する（ComposeのKoinApplicationやKtorなどで使用） |

ここで `T` は `@KoinApplication` アノテーションが付与されたクラスです。

**個別のモジュールのロード:**

`@KoinApplication` を使用せずに、`module<T>()` や `modules()` を使用して `@Module` クラスを直接ロードすることも可能です：

```kotlin
startKoin {
    module<NetworkModule>()                              // 単一のモジュールをロード
    modules(DataModule::class, CacheModule::class)       // 複数のモジュールをロード
}
```

| API | 説明 |
|-----|-------------|
| `module<T>()` | 単一の `@Module` クラスを KoinApplication にロードする |
| `modules(vararg KClass)` | 複数の `@Module` クラスを KoinApplication にロードする |

ここで `T` または各 `KClass` は `@Module` アノテーションが付与されたクラスです。これはテスト時や、アノテーションとDSLモジュールを混在させる場合に便利です：

```kotlin
// テストでの例
@get:Rule
val koinTestRule = KoinTestRule.create {
    module<NetworkModule>()
}
```

## 設定オプション

`build.gradle.kts` でコンパイラプラグインの設定を行えます：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    unsafeDslChecks = true
}
```

### 利用可能なオプション

| オプション | 説明 | デフォルト値 |
|--------|-------------|---------|
| `compileSafety` | コンパイル時の依存関係検証 (A2/A3/A4) | `true` |
| `strictSafety` | アグリゲーターのセーフティパスをビルドごとに強制再実行する（Kotlinのインクリメンタルコンパイルをバイパス） | アグリゲーターモジュールで自動検出 |
| `skipDefaultValues` | Kotlinのデフォルト値を持つパラメータへの注入をスキップする | `true` |
| `userLogs` | コンポーネント検出およびDSL/アノテーション処理のログを有効にする | `false` |
| `debugLogs` | 内部プラグイン処理の詳細なデバッグログを有効にする | `false` |
| `unsafeDslChecks` | ラムダ内の `create()` 呼び出しが唯一の命令であることを検証する | `true` |

:::tip
開発中は `userLogs = true` に設定して、どのコンポーネントがプラグインによって検出・処理されているかを確認することをお勧めします。
:::

## コンパイル時の安全性

Koinコンパイラプラグインは、**コンパイル時の依存関係検証**を提供します。これにより、実行時に失敗するのではなく、ビルド時にすべての依存関係が解決可能であることを検証できます。これはデフォルトで有効になっています。

```kotlin
koinCompiler {
    compileSafety = true       // デフォルトで有効
    skipDefaultValues = true   // デフォルトで有効
}
```

プラグインは、モジュール単位（A2）、`startKoin<T>()` 時のグラフ全体（A3）、および各呼び出し箇所（A4）の3つのレベルでグラフを検証します。詳細は [コンパイル時の安全性](/docs/reference/koin-compiler/compile-safety) を参照してください。

## マルチモジュールプロジェクト

複数のGradleモジュールを持つプロジェクトの場合：

### ライブラリモジュール

```kotlin
// feature/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// feature/src/main/kotlin/FeatureModule.kt
@Module
@ComponentScan("com.myapp.feature")
class FeatureModule
```

### アプリモジュール

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(project(":feature"))
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)
}
```

```kotlin
// app/src/main/kotlin/MyModule.kt
@Module
@Configuration
class MyModule

// app/src/main/kotlin/MyApp.kt
@KoinApplication
class MyApp

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp>()
    }
}
```

メインのアプリケーションクラスに `@KoinApplication` を使用し、型指定されたスタートアップAPIを使用してください。

## Kotlin Multiplatform

コンパイラプラグインはKMPプロジェクトでも動作します：

```kotlin
// shared/build.gradle.kts
plugins {
    id("org.jetbrains.kotlin.multiplatform")
    alias(libs.plugins.koin.compiler)
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.annotations)
        }
    }
}
```

## トラブルシューティング

### プラグインが見つからない

プラグインがプラグインリポジトリに含まれていることを確認してください：

```kotlin
// settings.gradle.kts
pluginManagement {
    repositories {
        mavenCentral()
        gradlePluginPortal()
    }
}
```

### Kotlinバージョンの不一致

コンパイラプラグインにはKotlin 2.3.20+が必要です。Kotlinのバージョンを確認してください：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20"  // 2.3.20+ が必要
}
```

### インポートエラー

正しいパッケージからインポートしていることを確認してください：

```kotlin
// コンパイラプラグイン DSL
import org.koin.plugin.module.dsl.*

// 従来の DSL
import org.koin.dsl.*
```

### インクリメンタルコンパイルとキャッシュの問題

他のKotlinコンパイラプラグイン（Compose CompilerやMetroなど）と同様に、KoinコンパイラプラグインはIRレベルで動作します。Kotlinのインクリメンタルコンパイル（増分コンパイル）により、特定の変更後に**古い結果や不整合な結果**が生じることがあります。

**症状:**
- 本来表示されないはずのコンパイル安全性エラー（偽陽性）
- 定義を削除した後に表示されるべきコンパイル安全性エラーが表示されない（偽陰性）
- リファクタリング後に実行時で発生する `NoSuchMethodError` や `ClassNotFoundException`

**典型的な発生ケース:**
- クラスのアノテーションの変更（`@Single` → `@Factory`、`@Named` の追加/削除）
- クラスのパッケージ間移動（`@ComponentScan` の検出に影響）
- モジュールの `includes` や `@Configuration` ラベルの変更
- 他のモジュールが依存しているライブラリモジュールでの定義の追加/削除

**解決策:** クリーンビルドを実行してください：

```bash
./gradlew clean build
```

または Android Studio で：**Build → Clean Project** を実行した後、**Build → Rebuild Project** を実行します。

:::tip
リファクタリング後に予期しないコンパイル安全性エラーが発生した場合は、まずクリーンビルドを試してください。これはコンパイラプラグインにおけるインクリメンタルコンパイルの既知の制限であり、Koin特有の問題ではありません。

グラフレベルの変更（`module { }` ラムダ内のDSL定義、`@ComponentScan` パッケージへのクラス追加）については、プラグインの `strictSafety` オプションがアグリゲーターモジュールで自動的に有効になり、ビルドごとにフルグラフのセーフティパスを強制的に再実行します。詳細は [`strictSafety`](/docs/reference/koin-annotations/options#strictsafety) を参照してください。
:::

### マルチモジュールプロジェクトでのコンパイル安全性の偽陽性

ライブラリモジュールに存在する依存関係が不足していると報告される場合は、以下を確認してください：

1. **ライブラリモジュールにもKoinコンパイラプラグインが適用されていること** — プラグインは後続のモジュールが読み取るためのヒント関数を生成します。
2. **ライブラリが利用側モジュールの前にビルドされていること** — 通常、Gradleは `implementation(project(":lib"))` を通じてこれを処理しますが、タスクの依存関係を確認してください。
3. ライブラリモジュールに初めてプラグインを追加した後は、**クリーンビルドを実行**してください。

## 移行

### 従来のDSLからの移行

1. コンパイラプラグインを追加する
2. インポートを `org.koin.plugin.module.dsl.*` に更新する
3. `single { Class(get() ...) }` または `singleOf(::Class)` を `single<Class>()` に置き換える

コンパイル時に安全な構文については、上記の [DSLスタイル](#dsl-style) リファレンスを参照してください。

### KSPプロセッサ (`koin-ksp-compiler`) からの移行

1. KSPプラグインと `koin-ksp-compiler` の依存関係を削除する
2. Koinコンパイラプラグインを追加する
3. `startKoin { modules(...) }` を `startKoin<MyApp>()` に更新する
4. **アノテーションはそのまま使用できます！** `koin-annotations` ライブラリは引き続き使用し、プロセッサのみが変更されます。

完全なガイドについては、**[KSPからコンパイラプラグインへの移行](/docs/migration/from-ksp-to-compiler-plugin)** を参照してください。

## 次のステップ

- **[DSLリファレンス](/docs/reference/dsl-reference)** - DSLの詳細ドキュメント
- **[アノテーションリファレンス](/docs/reference/annotations-reference)** - アノテーションの詳細ドキュメント
- **[Koinの開始](/docs/reference/koin-core/starting-koin)** - アプリケーションの設定