---
title: マルチモジュールAndroidアプリ
---

このガイドでは、Koinを使用したマルチモジュールアーキテクチャのAndroid特有の側面について説明します。

:::info
モジュールの中心的な概念（`includes()`、構成、オーバーライド）については、[Modules](/docs/reference/koin-core/modules)を参照してください。
:::

## Androidアプリケーションのセットアップ

### アノテーションを使用する場合

```kotlin
@KoinApplication(AppModule::class)
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin<MyApplication> {
            androidLogger()
            androidContext(this@MyApplication)
        }
    }
}

// ルートモジュールにすべての機能を含めます
@Module(includes = [LoginModule::class, HomeModule::class, ProfileModule::class])
class AppModule
```

### DSLを使用する場合

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(appModule)  // 単一のルートモジュール
        }
    }
}

// ルートモジュールにすべての機能を含めます
val appModule = module {
    includes(
        loginModule,
        homeModule,
        profileModule
    )
}
```

## フィーチャーモジュールの例

```kotlin
// :feature:login モジュール
@KoinViewModel
class LoginViewModel(
    private val loginUseCase: LoginUseCase,
    private val userRepository: UserRepository
) : ViewModel()

@Factory
class LoginUseCase(private val authService: AuthService)

@Module(includes = [DataModule::class])
@ComponentScan("com.app.feature.login")
class LoginModule
```

```kotlin
// DSLでの同等コード
val loginModule = module {
    includes(dataModule)
    viewModel<LoginViewModel>()
    factory<LoginUseCase>()
}
```

## 動的なモジュールのロード

Activityのライフサイクルに合わせて、必要に応じて（オンデマンドで）フィーチャーモジュールをロードします。

```kotlin
class FeatureActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        loadKoinModules(featureModule)
        super.onCreate(savedInstanceState)
    }

    override fun onDestroy() {
        super.onDestroy()
        unloadKoinModules(featureModule)
    }
}
```

## KoinとHiltの比較

| Hilt | Koin |
|------|------|
| `@HiltAndroidApp` | `startKoin { androidContext() }` |
| `@InstallIn(SingletonComponent)` | `startKoin {}` 内でロードされたモジュール |
| モジュール間連携のための `@EntryPoint` | 自動解決 |
| コンポーネントの依存関係 | `includes()` |
| `@ApplicationContext` | `androidContext()` (自動) |

:::info
**Koinの利点:** `@EntryPoint` インターフェースは不要です。すべてのモジュールがロードされている限り、依存関係はモジュールをまたいで自動的に解決されます。
:::

## Androidでのテスト

### モジュールを単体でテストする

```kotlin
class LoginViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            loginModule,
            module {
                single<UserRepository> { mockk() }
                single<AuthService> { mockk() }
            }
        )
    }

    private val viewModel: LoginViewModel by inject()

    @Test
    fun `test login`() {
        // モック化された依存関係を使用してテストする
    }
}
```

### すべてのモジュールを検証する

```kotlin
class ModuleCheckTest : KoinTest {

    @Test
    fun `verify all modules`() {
        appModule.verify()  // 含まれているモジュールも検証します
    }
}
```

## 関連項目

- **[Modules](/docs/reference/koin-core/modules)** - `includes()` を使用したコアモジュールの概念
- **[Android Module Loading](/docs/reference/koin-android/modules-android)** - 動的なモジュールのロード
- **[Lazy Modules](/docs/reference/koin-core/lazy-modules)** - バックグラウンドでのモジュールのロード
- **[Testing](/docs/reference/koin-android/instrumented-testing)** - Androidテストガイド