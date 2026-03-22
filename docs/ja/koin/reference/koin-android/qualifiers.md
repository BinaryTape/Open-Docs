---
title: Android の Context と Qualifier
---

このガイドでは、特に Context の取り扱いに焦点を当てた Android 特有の Qualifier パターンについて説明します。

:::info
一般的な Qualifier の概念（named、型安全、enum、JSR-330）については、[Qualifiers](/docs/reference/koin-core/qualifiers) を参照してください。
:::

## Android Context - Qualifier は不要

Hilt とは異なり、Koin は Qualifier を必要とせずに Android の Context を自動的に提供します。

### Koin による Context の解決

```kotlin
val androidModule = module {
    // Context は自動的に利用可能
    single {
        SharedPreferences(
            androidContext()  // Application context が自動的に提供される
        )
    }

    single {
        NotificationManager(
            androidContext().getSystemService(Context.NOTIFICATION_SERVICE)
        )
    }
}
```

### @ApplicationContext や @ActivityContext は不要

**Hilt では以下が必要です：**
```kotlin
// Hilt では明示的な Qualifier が必要
class MyRepository @Inject constructor(
    @ApplicationContext private val context: Context
)
```

**Koin では自動的に行われます：**
```kotlin
class MyRepository(
    private val context: Context  // Context を使用するだけ
)

val appModule = module {
    single { MyRepository(androidContext()) }
}
```

:::info
**Koin の利点:** `androidContext()` 関数は常に Application context を提供します。Application context と Activity context を区別するための Qualifier は必要ありません。
:::

## Activity Context が必要な場合

Activity context が必要な場合は、それを注入（Inject）するのではなく、直接使用してください。

```kotlin
class ScreenMetrics(private val activity: Activity) {
    fun getScreenSize(): Point {
        val display = activity.windowManager.defaultDisplay
        return Point().also { display.getSize(it) }
    }
}

// モジュールで定義せず、Activity 内で直接作成する
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val metrics = ScreenMetrics(this)  // Activity context を直接使用
    }
}
```

:::warning
**ベストプラクティス:** Activity context を生存期間の長いオブジェクトに注入しないでください。これはメモリリークの原因となります。Activity よりも長く生存する依存関係には、Application context（`androidContext()`）を使用してください。
:::

## Qualifier を使用した Android の依存関係

Android 特有の依存関係に対して複数の構成が必要な場合：

```kotlin
val databaseModule = module {
    single(named("user_db")) {
        Room.databaseBuilder(
            androidContext(),
            UserDatabase::class.java,
            "user-database"
        ).build()
    }

    single(named("cache_db")) {
        Room.databaseBuilder(
            androidContext(),
            CacheDatabase::class.java,
            "cache-database"
        ).build()
    }
}
```

## 次のステップ

- **[Qualifiers](/docs/reference/koin-core/qualifiers)** - Qualifier に関する完全なドキュメント
- **[Android Best Practices](/docs/reference/koin-android/best-practices)** - メモリ管理
- **[Android Scopes](/docs/reference/koin-android/scope)** - ライフサイクルを認識したスコープ管理