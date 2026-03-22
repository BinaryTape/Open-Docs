---
title: Android 컨텍스트 및 한정자(Qualifiers)
---

이 가이드는 특히 컨텍스트(Context) 처리를 중심으로 Android 전용 한정자(qualifier) 패턴에 대해 설명합니다.

:::info
일반적인 한정자 개념(named, type-safe, enums, JSR-330)에 대해서는 [한정자(Qualifiers)](/docs/reference/koin-core/qualifiers)를 참고하세요.
:::

## Android 컨텍스트 - 한정자가 필요하지 않음

Hilt와 달리, Koin은 한정자를 요구하지 않고 자동으로 Android 컨텍스트를 제공합니다.

### Koin의 컨텍스트 분석(Context Resolution)

```kotlin
val androidModule = module {
    // 컨텍스트를 자동으로 사용할 수 있습니다.
    single {
        SharedPreferences(
            androidContext()  // 애플리케이션 컨텍스트가 자동으로 제공됨
        )
    }

    single {
        NotificationManager(
            androidContext().getSystemService(Context.NOTIFICATION_SERVICE)
        )
    }
}
```

### @ApplicationContext 또는 @ActivityContext가 필요 없음

**Hilt에서는 다음과 같이 작성해야 합니다:**
```kotlin
// Hilt는 명시적인 한정자가 필요합니다.
class MyRepository @Inject constructor(
    @ApplicationContext private val context: Context
)
```

**Koin에서는 자동으로 처리됩니다:**
```kotlin
class MyRepository(
    private val context: Context  // 그저 Context를 사용하면 됩니다.
)

val appModule = module {
    single { MyRepository(androidContext()) }
}
```

:::info
**Koin의 장점:** `androidContext()` 함수는 항상 애플리케이션 컨텍스트를 제공합니다. 애플리케이션 컨텍스트와 액티비티 컨텍스트를 구분하기 위한 별도의 한정자가 필요하지 않습니다.
:::

## 액티비티 컨텍스트가 필요한 경우

액티비티 컨텍스트가 필요한 경우에는 이를 주입하지 말고 직접 사용하세요:

```kotlin
class ScreenMetrics(private val activity: Activity) {
    fun getScreenSize(): Point {
        val display = activity.windowManager.defaultDisplay
        return Point().also { display.getSize(it) }
    }
}

// 모듈에 정의하지 마세요 - 액티비티에서 직접 생성하세요.
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val metrics = ScreenMetrics(this)  // 액티비티 컨텍스트가 직접 사용됨
    }
}
```

:::warning
**권장 사항:** 생명 주기가 긴 객체에 액티비티 컨텍스트를 주입하지 마세요. 이는 메모리 누수를 유발합니다. 액티비티보다 오래 지속되는 의존성에는 애플리케이션 컨텍스트(`androidContext()`)를 사용하세요.
:::

## 한정자가 지정된 Android 의존성

Android 전용 의존성에 대해 여러 설정이 필요한 경우 다음과 같이 사용합니다:

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

## 다음 단계

- **[한정자(Qualifiers)](/docs/reference/koin-core/qualifiers)** - 전체 한정자 문서
- **[Android 권장 사항](/docs/reference/koin-android/best-practices)** - 메모리 관리
- **[Android 스코프(Scopes)](/docs/reference/koin-android/scope)** - 생명 주기 인식 스코핑(scoping)