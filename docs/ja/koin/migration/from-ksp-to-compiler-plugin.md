---
title: KSP から Compiler Plugin への Koin Annotations の移行
---

# Koin Annotations の移行: KSP から Compiler Plugin へ

このガイドでは、Koin Annotations プロジェクトを KSP ベースの処理から新しい Koin Compiler Plugin（コンパイラプラグイン）へ移行する手順を説明します。

:::info 朗報です！
**アノテーションは以前とまったく同じままです。** 変更が必要なのは、ビルド設定と Koin の起動（startup）コードのみです。
:::

## 何が変わるのか？

| 項目 | KSP プロセッシング | Compiler Plugin |
|--------|----------------|-----------------|
| **処理方式** | KSP (別ステップ) | K2 コンパイラ (統合済み) |
| **生成ファイル** | `build/generated/ksp` で確認可能 | なし - インライン変換 |
| **ビルド速度** | 低速 | 高速 |
| **KMP セットアップ** | プラットフォームごとの KSP 設定 | 単一のプラグイン適用 |
| **Koin の起動** | `modules(AppModule().module)` | `startKoin<MyApp>()` |
| **今後のサポート** | 非推奨 (Deprecated) | 活発に開発中 |

## 要件

- **Kotlin 2.3.20+** (K2 コンパイラが必須)
- **Gradle 8.x+**

## 移行ステップ

### ステップ 1: Kotlin バージョンの更新

Compiler Plugin には Kotlin 2.3.20 以降が必要です：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20" // 最小バージョン 2.3.20
}
```

### ステップ 2: バージョンカタログの更新

**変更前 (KSP):**
```toml
[versions]
koin = "4.0.0"
koin-ksp = "2.0.0"  # KSP アノテーション用の個別のバージョン管理
ksp = "2.0.0-1.0.22"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-ksp" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-ksp" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

**変更後 (Compiler Plugin):**
```toml
[versions]
koin = "4.2.0"
koin-plugin = "1.0.0"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

:::note
`koin-annotations` は Koin のメインプロジェクトの一部となり、`koin-core` と同じバージョンを使用するようになりました。
:::

### ステップ 3: ビルド設定の更新

**変更前 (KSP):**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // KSP バージョン (個別のバージョン管理)
    ksp(libs.koin.ksp.compiler)
}

ksp {
    arg("KOIN_CONFIG_CHECK", "true")
}
```

**変更後 (Compiler Plugin):**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // koin-core と同じバージョン
}

// オプション設定
koinCompiler {
    userLogs = true  // コンポーネント検出をログ出力
}
```

### ステップ 4: Koin 起動コードの更新

これが主なコード変更点です。KSP アプローチでは生成された `.module` 拡張関数（extensions）を使用していましたが、Compiler Plugin では `@KoinApplication` と型付き API（typed APIs）を使用します。

**変更前 (KSP):**
```kotlin
import org.koin.ksp.generated.*  // 生成された拡張関数のインポート

@Module
@ComponentScan("com.myapp")
class AppModule

fun main() {
    startKoin {
        modules(AppModule().module)  // 生成された .module 拡張関数
    }
}
```

**変更後 (Compiler Plugin):**

```kotlin
// 生成されたファイルのインポートは不要

@Module
@ComponentScan("com.myapp")
class AppModule

@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp>()  // 型付き API
}
```

#### Android の例

**変更前 (KSP):**
```kotlin
import org.koin.ksp.generated.*

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            modules(AppModule().module)
        }
    }
}
```

**変更後 (Compiler Plugin):**
```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp> {
            androidContext(this@MyApplication)
        }
    }
}
```

### ステップ 5: クリーンアップ

KSP によって生成されたファイルを削除してリビルドします：

```bash
rm -rf build/generated/ksp
./gradlew clean build
```

## アノテーションはそのまま

アノテーションが付与されたすべてのクラスは変更の必要がありません：

```kotlin
// 変更不要！
@Singleton
class UserRepository(private val database: Database)

@Factory
class GetUserUseCase(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val useCase: GetUserUseCase) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

すべてのアノテーションは以前と同様に動作します。完全なリストについては、**[Annotations Reference](/docs/reference/koin-annotations/definitions)** を参照してください。

### インポートの変更: `@KoinViewModel`

`@KoinViewModel` アノテーションのパッケージが変更されました：

```kotlin
// 変更前 (KSP)
import org.koin.android.annotation.KoinViewModel

// 変更後 (Compiler Plugin)
import org.koin.core.annotation.KoinViewModel
```

### トップレベル関数の定義 (新機能)

Compiler Plugin は、`@ComponentScan` によって検出されるトップレベル関数へのアノテーションをサポートしています：

```kotlin
@Singleton
fun provideDatabase(): DatabaseService = PostgresDatabase()

@Factory
fun provideCache(db: DatabaseService): CacheService = RedisCache(db)

@Module
@ComponentScan("com.myapp")
class AppModule
```

関数の戻り値の型によってバインディング型が決まります。関数のパラメータは依存関係として注入されます。

## DSL 構文の変更

アノテーションと併せて Koin DSL モジュールを使用している場合、Compiler Plugin ではよりクリーンな構文が導入されています。

| KSP / クラシックスタイル | Compiler Plugin スタイル |
|---------------------|----------------------|
| `singleOf(::MyService)` | `single<MyService>()` |
| `factoryOf(::MyRepo)` | `factory<MyRepo>()` |
| `viewModelOf(::MyVM)` | `viewModel<MyVM>()` |
| `scopedOf(::MyScoped)` | `scoped<MyScoped>()` |
| `workerOf(::MyWorker)` | `worker<MyWorker>()` |
| `single { fn(get()) }` | `single { create(::fn) }` |

```kotlin
// 変更前
val myModule = module {
    singleOf(::MyService)
    factoryOf(::MyRepository)
    viewModelOf(::MyViewModel)
}

// 変更後
import org.koin.plugin.module.dsl.*

val myModule = module {
    single<MyService>()
    factory<MyRepository>()
    viewModel<MyViewModel>()
}

// 関数ビルダー — 外部ライブラリ (Room, Retrofit など) 用
fun createDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "db").build()

val dbModule = module {
    single { create(::createDatabase) }
}
```

:::note
Compiler Plugin DSL は **`org.koin.plugin.module.dsl`** パッケージにあります。従来の DSL は引き続き `org.koin.dsl` に存在します。
:::

## モジュールを跨いだ検出 (Cross-Module Discovery)

Gradle モジュール間での自動モジュール検出には `@Configuration` を使用します：

```kotlin
// フィーチャー（feature）モジュール内
@Module
@ComponentScan
@Configuration
class FeatureModule

// アプリ（app）モジュール内 - FeatureModule が自動的に検出される
@KoinApplication
object MyApp

startKoin<MyApp>()  // FeatureModule が自動的に含まれる
```

## KMP の移行

Compiler Plugin は KMP（Kotlin Multiplatform）のセットアップを大幅に簡素化します。

**変更前 (KSP) - プラットフォームごとの設定：**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.insert-koin:koin-core:$koin_version")
            implementation("io.insert-koin:koin-annotations:$koin_ksp_version")  // 個別のバージョン
        }
    }
}

dependencies {
    // 各プラットフォームに KSP コンパイラが必要
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

**変更後 (Compiler Plugin) - 単一のプラグイン：**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
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

## 型付き起動 API (Typed Startup APIs)

Compiler Plugin は、`startKoin<T>()`、`koinApplication<T>()`、`koinConfiguration<T>()` といった型付き API を提供します。

詳細は **[Starting with Annotations](/docs/reference/koin-annotations/start)** を参照してください。

## 構成ラベル (Configuration Labels) (新機能)

Compiler Plugin では、条件付きモジュール読み込みのための構成ラベル（Configuration Labels）が追加されています。

詳細は **[Modules - Configuration](/docs/reference/koin-annotations/modules)** を参照してください。

## Compiler Plugin オプション

すべての設定オプションについては、**[Compiler Plugin Options](/docs/reference/koin-annotations/options)** を参照してください。

## トラブルシューティング

### KSP 削除後にビルドが失敗する

1. `./gradlew clean` を実行する
2. `rm -rf build/generated/ksp` を実行する
3. IDE のキャッシュを破棄する (Invalidate IDE caches)
4. リビルドする

### アノテーションが検出されない

ログを有効にして確認してください：
```kotlin
koinCompiler {
    userLogs = true
}
```

### 実行時に依存関係が不足している

1. `@ComponentScan` のパッケージ指定を確認する
2. `@KoinApplication(modules = [...])` 内のモジュールを確認する
3. 外部の依存関係には `@Provided` を使用する

## 移行チェックリスト

- [ ] Kotlin を 2.3.20 以降に更新した
- [ ] Koin を 4.2.0 以降に更新した
- [ ] KSP プラグインを削除した
- [ ] `koin-ksp-compiler` の依存関係を削除した
- [ ] `koin-annotations` をメインの Koin バージョン (`io.insert-koin:koin-annotations:$koin_version`) に更新した
- [ ] Koin Compiler Plugin (`io.insert-koin.compiler.plugin`) を追加した
- [ ] `@KoinViewModel` のインポートを `org.koin.core.annotation` に更新した
- [ ] `@KoinApplication` クラスを作成し、`modules(X().module)` を `startKoin<MyApp>()` に置き換えた
- [ ] DSL モジュールを使用している場合、DSL のインポートを `org.koin.plugin.module.dsl.*` に更新した
- [ ] DSL 構文を更新した: `singleOf(::X)` → `single<X>()`
- [ ] `import org.koin.ksp.generated.*` を削除した
- [ ] クリーンアップしてリビルドした (`rm -rf build/generated/ksp && ./gradlew clean build`)

## 関連項目

- **[Compiler Plugin Setup](/docs/setup/compiler-plugin)** - 完全なセットアップガイド
- **[Annotations Reference](/docs/reference/koin-annotations/start)** - すべてのアノテーション
- **[KSP Processor Setup (Deprecated)](/docs/setup/annotations-ksp)** — レガシーな `koin-ksp-compiler` のリファレンス