---
title: Android のベストプラクティス
---

このガイドでは、メモリ管理、セキュリティ、および Hilt からの移行に関する Android 特有のベストプラクティスについて説明します。

:::info
モジュールの一般的な概念については、**[Modules](/docs/reference/koin-core/modules)** を参照してください。スコープについては、**[Scopes](/docs/reference/koin-core/scopes)** および **[Android Scopes](/docs/reference/koin-android/scope)** を参照してください。
:::

## メモリ管理 {id="memory-management"}

### Activity/Fragment のリークを避ける {id="avoid-activity-fragment-leaks"}

```kotlin
// ❌ 悪い例 - Activity のリーク
module {
    single { SomeService(get<Activity>()) }  // シングルトン内での Activity 参照！
}

// ✅ 良い例 - Application コンテキストを使用する
module {
    single { SomeService(androidContext()) }  // Application コンテキスト、安全
}

// ✅ 良い例 - Activity スコープを使用する
module {
    activityScope {
        scoped { SomeService(/* activity スコープの依存関係 */) }
    }
}
```

### スコープを適切に閉じる {id="close-scopes-properly"}

```kotlin
// ✅ 良い例 - 自動スコープ管理
class MyActivity : ScopeActivity() {
    override val scope: Scope by activityScope()
    // onDestroy でスコープが自動的に閉じられる
}

// ❌ 悪い例 - クリーンアップなしの手動スコープ
class MyActivity : AppCompatActivity() {
    private val myScope = createScope<MyActivity>()
    // スコープが閉じられない - メモリリーク！
}

// ✅ 良い例 - クリーンアップを伴う手動スコープ
class MyActivity : AppCompatActivity() {
    private lateinit var myScope: Scope

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        myScope = createScope<MyActivity>()
    }

    override fun onDestroy() {
        myScope.close()
        super.onDestroy()
    }
}
```

### 長命なオブジェクト内の参照をクリアする {id="clear-references-in-long-lived-objects"}

```kotlin
// ❌ 悪い例 - UI への参照を保持している
class UserRepository {
    private val listeners = mutableListOf<UserUpdateListener>()  // Activity の参照を保持する可能性がある

    fun addListener(listener: UserUpdateListener) {
        listeners.add(listener)
    }
}

// ✅ 良い例 - 弱参照（WeakReference）または手動でのクリーンアップ
class UserRepository {
    private val listeners = mutableListOf<WeakReference<UserUpdateListener>>()

    fun addListener(listener: UserUpdateListener) {
        listeners.add(WeakReference(listener))
    }

    fun removeListener(listener: UserUpdateListener) {
        listeners.removeAll { it.get() == listener || it.get() == null }
    }
}
```

## Android でのデバッグ {id="android-debugging"}

### Android ロガーを有効にする {id="enable-android-logger"}

```kotlin
startKoin {
    androidLogger(Level.DEBUG)  // すべての Koin 操作を表示
    androidContext(this@MyApplication)
    modules(appModules)
}
```

### デバッグビルドでモジュールを検証する {id="verify-modules-in-debug-builds"}

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidContext(this@MyApplication)
            modules(allModules)
        }

        // コンパイル時の検証には Koin コンパイラプラグインを使用するか、
        // ユニットテストで verify() を使用します：appModule.verify()
    }
}
```

### デバッグ用のスコープコールバック {id="scope-callbacks-for-debugging"}

```kotlin
class DebugActivity : ScopeActivity() {
    override val scope: Scope by activityScope()

    init {
        scope.registerCallback(object : ScopeCallback {
            override fun onScopeClose(scope: Scope) {
                Log.d("Koin", "Scope ${scope.id} closing")
            }
        })
    }
}
```

## セキュリティのベストプラクティス {id="security-best-practices"}

### モジュール内にシークレットを保存しない {id="don-t-store-secrets-in-modules"}

```kotlin
// ❌ 悪い例 - ハードコードされたシークレット
module {
    single {
        Retrofit.Builder()
            .addInterceptor { chain ->
                chain.proceed(
                    chain.request().newBuilder()
                        .header("API-Key", "super-secret-key")  // 不可！
                        .build()
                )
            }
            .build()
    }
}

// ✅ 良い例 - 安全なストレージからのシークレット
module {
    single {
        val securePrefs = get<SecurePreferences>()
        Retrofit.Builder()
            .addInterceptor(AuthInterceptor(securePrefs))
            .build()
    }
}
```

## Dagger/Hilt からの移行 {id="migration-from-dagger-hilt"}

:::info
Koin は `jakarta.inject` の JSR-330 アノテーション（`@Singleton`、`@Inject`、`@Named`）をサポートしています。使い慣れたアノテーションをそのまま使用し続けることができます。[JSR-330 Compatibility](/docs/reference/koin-android/jsr330) を参照してください。
:::

### アノテーションのマッピング {id="annotation-mapping"}

| Hilt | Koin アノテーション |
|------|------------------|
| `@Singleton` | `@Singleton` (JSR-330 互換) |
| `@Provides` | `@Factory` |
| `@Binds` | `@Singleton ... bind Interface::class` |
| `@Inject` | `@Inject` (JSR-330 互換) |
| `@HiltViewModel` | `@KoinViewModel` |
| `@InstallIn(SingletonComponent)` | `@Module` + `@ComponentScan` |
| `@InstallIn(ActivityComponent)` | `@Scope(ActivityScope::class)` |

### 移行の例 {id="example-migration"}

```kotlin
// 移行前 (Hilt)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel()

@Singleton
class UserRepositoryImpl @Inject constructor(
    private val api: ApiService
) : UserRepository

// 移行後 (Koin) - 最小限の変更！
@KoinViewModel
class HomeViewModel(
    private val repository: UserRepository
) : ViewModel()

@Singleton  // JSR-330 を引き続き使用
class UserRepositoryImpl(
    private val api: ApiService
) : UserRepository
```

### モジュールの移行 {id="module-migration"}

```kotlin
// 移行前 (Hilt)
@InstallIn(SingletonComponent::class)
@Module
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}

// 移行後 (Koin アノテーション)
@Module
class NetworkModule {
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder().build()
}
```

### 段階的な移行 {id="gradual-migration"}

```kotlin
// ステップ 1: 新機能のために Hilt と並行して Koin を追加
@KoinViewModel
class NewFeatureViewModel(
    private val repository: NewFeatureRepository
) : ViewModel()

@Singleton
class NewFeatureRepository(private val api: ApiService)

// ステップ 2: 既存の機能を一つずつ移行
@Singleton
class MigratedRepository(private val api: ApiService) : UserRepository

// ステップ 3: 移行完了後に Hilt を削除
```

## 関連項目 {id="see-also"}

- **[Scopes](/docs/reference/koin-core/scopes)** - コアとなるスコープの概念
- **[Android Scopes](/docs/reference/koin-android/scope)** - Android ライフサイクルスコープ
- **[Testing](/docs/reference/koin-android/instrumented-testing)** - Android テストガイド
- **[Multi-Module Apps](/docs/reference/koin-android/multi-module)** - Android モジュールの整理