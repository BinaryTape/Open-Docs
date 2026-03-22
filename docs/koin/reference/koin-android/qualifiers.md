---
title: Android Context 与限定符
---

本指南涵盖了 Android 特有的限定符模式，特别是围绕 Context 处理的内容。

:::info
有关通用限定符概念（命名、类型安全、枚举、JSR-330），请参阅 [限定符](/docs/reference/koin-core/qualifiers)。
:::

## Android Context - 无需限定符

与 Hilt 不同，Koin 会自动提供 Android Context，不需要限定符。

### Koin 的 Context 解析

```kotlin
val androidModule = module {
    // Context 自动可用
    single {
        SharedPreferences(
            androidContext()  // 自动提供 Application context
        )
    }

    single {
        NotificationManager(
            androidContext().getSystemService(Context.NOTIFICATION_SERVICE)
        )
    }
}
```

### 无需 @ApplicationContext 或 @ActivityContext

**在 Hilt 中，你需要：**
```kotlin
// Hilt 需要显式限定符
class MyRepository @Inject constructor(
    @ApplicationContext private val context: Context
)
```

**在 Koin 中，它是自动的：**
```kotlin
class MyRepository(
    private val context: Context  // 直接使用 Context 即可
)

val appModule = module {
    single { MyRepository(androidContext()) }
}
```

:::info
**Koin 优势：** `androidContext()` 函数始终提供 Application context。无需使用限定符来区分 Application 和 Activity context。
:::

## 当你需要 Activity Context 时

对于需要 Activity context 的情况，不要注入它——直接使用即可：

```kotlin
class ScreenMetrics(private val activity: Activity) {
    fun getScreenSize(): Point {
        val display = activity.windowManager.defaultDisplay
        return Point().also { display.getSize(it) }
    }
}

// 不要在模块中定义 - 直接在 Activity 中创建
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val metrics = ScreenMetrics(this)  // 直接使用 Activity context
    }
}
```

:::warning
**最佳做法：** 避免将 Activity context 注入到长生命周期对象中。这会导致内存泄漏。对于生命周期长于 Activity 的依赖项，请使用 Application context (`androidContext()`)。
:::

## 限定 Android 依赖项

当你需要 Android 特有依赖项的多种配置时：

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

## 后续步骤

- **[限定符](/docs/reference/koin-core/qualifiers)** - 完整的限定符文档
- **[Android 最佳做法](/docs/reference/koin-android/best-practices)** - 内存管理
- **[Android 作用域](/docs/reference/koin-android/scope)** - 生命周期感知的作用域