---
title: Android Context 與限定詞
---

本指南涵蓋了 Android 特有的限定詞模式，特別是關於 Context 處理的部分。

:::info
關於一般的限定詞概念（具名、型別安全、列舉、JSR-330），請參閱 [限定詞](/docs/reference/koin-core/qualifiers)。
:::

## Android Context - 無需限定詞

與 Hilt 不同，Koin 會自動提供 Android Context，而不需要限定詞。

### Koin 的 Context 解析

```kotlin
val androidModule = module {
    // Context 自動可用
    single {
        SharedPreferences(
            androidContext()  // 自動提供 Application Context
        )
    }

    single {
        NotificationManager(
            androidContext().getSystemService(Context.NOTIFICATION_SERVICE)
        )
    }
}
```

### 不需要 @ApplicationContext 或 @ActivityContext

**在 Hilt 中，你需要：**
```kotlin
// Hilt 需要明確的限定詞
class MyRepository @Inject constructor(
    @ApplicationContext private val context: Context
)
```

**在 Koin 中則是自動的：**
```kotlin
class MyRepository(
    private val context: Context  // 直接使用 Context 即可
)

val appModule = module {
    single { MyRepository(androidContext()) }
}
```

:::info
**Koin 優點：** `androidContext()` 函式一律提供 Application Context。不需要限定詞來區分 Application 與 Activity Context。
:::

## 當你需要 Activity Context 時

在需要 Activity Context 的情況下，請不要注入它——直接使用即可：

```kotlin
class ScreenMetrics(private val activity: Activity) {
    fun getScreenSize(): Point {
        val display = activity.windowManager.defaultDisplay
        return Point().also { display.getSize(it) }
    }
}

// 不要定義在模組中——直接在 Activity 中建立
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val metrics = ScreenMetrics(this)  // 直接使用 Activity Context
    }
}
```

:::warning
**最佳實務：** 避免將 Activity Context 注入到長生命週期的物件中。這會導致記憶體洩漏。對於生命週期比 Activity 更長的相依性，請使用 Application Context (`androidContext()`)。
:::

## 具備限定詞的 Android 相依性

當你需要多個 Android 特有相依性的配置時：

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

## 後續步驟

- **[限定詞](/docs/reference/koin-core/qualifiers)** - 完整的限定詞文件
- **[Android 最佳實務](/docs/reference/koin-android/best-practices)** - 記憶體管理
- **[Android 作用域](/docs/reference/koin-android/scope)** - 生命週期感知的作用域