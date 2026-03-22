---
title: 안드로이드 진입점
---

이 가이드는 Koin을 사용하여 다양한 안드로이드 컴포넌트에 의존성을 주입하는 방법을 다룹니다. 각 안드로이드 컴포넌트 유형은 의존성 주입 방식에 영향을 미치는 고유한 생명주기(lifecycle) 특성을 가지고 있습니다.

:::info
이 페이지는 **어디에** 주입할 것인지(진입점)에 초점을 맞춥니다. 주입 API(`by inject()`, `get()`, `by viewModel()`)는 정의를 어떻게 선언하느냐와 상관없이 동일하게 작동합니다. 정의 선언에 대해서는 [정의 (Definitions)](/docs/reference/koin-core/definitions)를 참조하세요.
:::

## 개요 (Overview)

안드로이드 애플리케이션은 다양한 컴포넌트 유형으로 구성되며, 각 컴포넌트는 고유한 생명주기와 초기화 패턴을 가집니다. Koin은 이 모든 컴포넌트에 의존성을 주입할 수 있는 유연한 방법을 제공합니다.

### 빠른 참조 (Quick Reference)

| 컴포넌트 | 주입 방법 | 내장 지원 | 참고 사항 |
|-----------|-----------------|------------------|-------|
| **Application** | `onCreate()`에서 `startKoin {}` | ✅ 예 | Koin 설정의 진입점 |
| **Activity** | `by inject()` 또는 `get()` | ✅ 예 | 직접 주입 지원 |
| **Fragment** | `by inject()` 또는 `get()` | ✅ 예 | 직접 주입 지원 |
| **ViewModel** | `by viewModel()` | ✅ 예 | 생명주기 인식 주입 |
| **Service** | `by inject()` 또는 `get()` | ✅ 예 | 직접 주입 지원 |
| **BroadcastReceiver** | `KoinComponent` + `get()` | ⚠️ 수동 | `KoinComponent` 구현 필요 |
| **ContentProvider** | `KoinComponent` + `get()` | ⚠️ 수동 | 특별한 타이밍 고려 사항 있음 |
| **Custom View** | 생성자 또는 `KoinComponent` | ⚠️ 수동 | DI 사용 지양 권장 |

## Application 클래스

Application 클래스는 Koin을 초기화하는 곳입니다. 이는 앱의 모든 의존성 주입을 위한 기반이 됩니다.

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(appModule, networkModule, dataModule)
        }
    }
}
```

:::info
전체 Application 설정 지침은 [안드로이드에서 Koin 시작하기](/docs/reference/koin-android/start)를 참조하세요.
:::

## Activity 주입

Activity는 확장 함수를 통해 Koin 내장 지원을 제공받습니다.

### by inject() 사용하기

```kotlin
class UserActivity : AppCompatActivity() {
    // 지연 주입(Lazy injection) - 처음 접근할 때 생성됨
    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        presenter.loadUser()  // Presenter가 여기서 생성됨
    }
}
```

### get() 사용하기

```kotlin
class UserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        // 즉시 주입(Eager injection) - 즉시 생성됨
        val presenter: UserPresenter = get()
        presenter.loadUser()
    }
}
```

### 파라미터와 함께 사용하기

```kotlin
class UserDetailActivity : AppCompatActivity() {
    private val userId: String by lazy { intent.getStringExtra("USER_ID") ?: "" }

    // 런타임 파라미터 전달
    private val presenter: UserDetailPresenter by inject { parametersOf(userId) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenter.loadUserDetails()
    }
}
```

파라미터가 있는 정의를 선언하는 방법은 [주입된 파라미터 (Injected Parameters)](/docs/reference/koin-core/definitions#injected-parameters)를 참조하세요.

:::info
더 많은 Activity 주입 패턴은 [안드로이드에서 주입하기](/docs/reference/koin-android/get-instances)를 참조하세요.
:::

## Fragment 주입

Fragment는 Koin 확장 기능을 통해 Activity와 동일하게 작동합니다.

```kotlin
class UserListFragment : Fragment() {
    private val viewModel: UserListViewModel by viewModel()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        return inflater.inflate(R.layout.fragment_user_list, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        viewModel.loadUsers()
    }
}
```

### 공유 ViewModel (Shared ViewModels)

Activity와 Fragment 간에 ViewModel을 공유합니다.

```kotlin
class UserDetailFragment : Fragment() {
    // Activity 스코프의 ViewModel 가져오기
    private val sharedViewModel: UserViewModel by activityViewModel()

    // 이 Fragment 스코프의 ViewModel 가져오기
    private val fragmentViewModel: DetailViewModel by viewModel()
}
```

:::info
Fragment 및 ViewModel 주입에 대한 자세한 내용은 다음을 참조하세요:
- [안드로이드에서 주입하기](/docs/reference/koin-android/get-instances)
- [안드로이드 ViewModel](/docs/reference/koin-android/viewmodel)
:::

## Service 주입

Service는 Activity나 Fragment와 마찬가지로 확장 함수를 통해 Koin 내장 지원을 제공받습니다.

### by inject() 사용하기

```kotlin
class MusicPlayerService : Service() {
    // 지연 주입 - 처음 접근할 때 생성됨
    private val player: MediaPlayer by inject()
    private val repository: MusicRepository by inject()

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val songId = intent?.getStringExtra("SONG_ID")
        if (songId != null) {
            val song = repository.getSong(songId)
            player.play(song)
        }
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        player.release()
        super.onDestroy()
    }
}
```

### get() 사용하기

```kotlin
class DownloadService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 즉시 주입 - 즉시 생성됨
        val downloader: FileDownloader = get()
        val url = intent?.getStringExtra("URL") ?: ""

        downloader.start(url)
        return START_STICKY
    }
}
```

### 생명주기 고려 사항

- **Service는 수명이 깁니다**: 비용이 많이 드는 리소스에는 `single`을 사용하세요.
- **정리는 필수입니다**: `onDestroy()`에서 리소스를 해제하세요.
- **백그라운드 스레드**: 백그라운드 작업의 스코프를 적절히 지정하는 것을 고려하세요.

### 권장 사항 (Best Practices)

```kotlin
class DownloadService : Service() {
    // 초기화를 늦추기 위해 지연 주입 사용
    private val downloader: FileDownloader by inject()
    private val notificationManager: NotificationManager by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 서비스가 실제로 시작될 때만 의존성이 생성됨
        downloader.start(intent?.getStringExtra("URL") ?: "")
        return START_STICKY
    }

    override fun onDestroy() {
        // 항상 정리 수행
        downloader.cancel()
        super.onDestroy()
    }
}
```

:::note
**대안:** `WorkManager` 백그라운드 작업의 경우, Service 대신 Koin의 내장 `WorkManager` 지원을 사용하세요. [WorkManager 통합](/docs/reference/koin-android/workmanager)을 참조하세요.
:::

## BroadcastReceiver 주입

BroadcastReceiver에서도 의존성 주입을 위해 `KoinComponent`가 필요합니다.

### 동적으로 등록된 Receiver

```kotlin
class NetworkChangeReceiver : BroadcastReceiver(), KoinComponent {
    // 즉시 주입을 위해 get() 사용 (receiver는 수명이 짧음)
    private val networkMonitor: NetworkMonitor by inject()

    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            ConnectivityManager.CONNECTIVITY_ACTION -> {
                networkMonitor.checkConnectivity()
            }
        }
    }
}

// Activity 또는 Service에서 등록
class MainActivity : AppCompatActivity() {
    private val receiver = NetworkChangeReceiver()

    override fun onResume() {
        super.onResume()
        val filter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
        registerReceiver(receiver, filter)
    }

    override fun onPause() {
        unregisterReceiver(receiver)
        super.onPause()
    }
}
```

### 정적으로 등록된 Receiver (Manifest)

```kotlin
class BootReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            // Koin이 초기화되었는지 확인
            val app = context?.applicationContext as? MyApplication

            // 이제 주입 가능
            val scheduler: JobScheduler by inject()
            scheduler.scheduleWork()
        }
    }
}
```

```xml
<!-- AndroidManifest.xml -->
<receiver android:name=".BootReceiver"
    android:exported="false">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>
```

### 중요한 고려 사항

**생명주기:**
- Receiver는 **매우 짧은 수명**을 가집니다 (일반적으로 10초 미만).
- 빠른 초기화를 위해 `by inject()` 대신 `get()`을 사용하세요.
- `onReceive()`에서 무거운 작업을 수행하지 마세요.

**Koin 초기화:**
- Manifest에 선언된 receiver의 경우, `Application.onCreate()`에서 Koin이 초기화되었는지 확인하세요.
- 동적으로 등록된 receiver의 경우, Koin은 이미 초기화되어 있습니다.

**권장 사항 (Best Practices):**

```kotlin
class AlarmReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        // 즉각적인 액세스를 위해 get() 사용 (receiver에 더 효율적임)
        val repository: AlarmRepository = get()

        // 작업을 Service나 WorkManager로 위임
        val workRequest = OneTimeWorkRequestBuilder<AlarmWorker>()
            .setInputData(workDataOf("alarm_id" to intent?.getIntExtra("ID", -1)))
            .build()

        WorkManager.getInstance(context!!).enqueue(workRequest)
    }
}
```

:::warning
BroadcastReceiver에는 엄격한 시간 제한(~10초)이 있습니다. 중요한 작업의 경우 `Service`, `WorkManager` 또는 `JobScheduler`를 대신 사용하세요.
:::

## ContentProvider 주입

ContentProvider는 `Application.onCreate()` **이전**에 생성되기 때문에 특별한 타이밍 고려 사항이 있습니다.

### 문제 상황 (The Challenge)

```kotlin
// ❌ 문제: 작동하지 않습니다!
class MyContentProvider : ContentProvider(), KoinComponent {
    // ContentProvider가 생성될 때 Koin이 아직 초기화되지 않았습니다!
    private val database: Database by inject()  // 크래시 발생

    override fun onCreate(): Boolean {
        // 이 메서드는 Application.onCreate() 이전에 실행됩니다.
        return true
    }
}
```

### 해결책 1: 지연 초기화 (Lazy Initialization)

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    // 초기화를 늦추기 위해 lazy 사용
    private val database: Database by lazy {
        // 첫 번째 쿼리가 발생할 때쯤이면 Koin은 준비되어 있습니다.
        get<Database>()
    }

    override fun onCreate(): Boolean {
        // 여기에서 주입된 의존성에 접근하지 마세요!
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // 여기서 database를 사용하는 것은 안전합니다 (Application.onCreate 이후).
        return database.query(uri)
    }
}
```

### 해결책 2: 수동 Koin 초기화

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    private lateinit var database: Database

    override fun onCreate(): Boolean {
        // 아직 초기화되지 않았다면 Koin을 초기화합니다.
        val context = context ?: return false

        if (GlobalContext.getOrNull() == null) {
            startKoin {
                androidContext(context.applicationContext)
                modules(databaseModule)
            }
        }

        // 이제 주입 가능
        database = get()
        return true
    }

    override fun query(/* ... */): Cursor? {
        return database.query(uri)
    }
}
```

### 권장 사항 (Best Practices)

```kotlin
class DataContentProvider : ContentProvider(), KoinComponent {
    // 지연 초기화 패턴
    private val repository: DataRepository by lazy { get() }

    override fun onCreate(): Boolean {
        // 최소한의 초기화만 수행
        // 여기서 Koin에 접근하지 마세요.
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // 이제 Koin은 확실히 준비된 상태입니다.
        return repository.getData(uri)
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return repository.insert(uri, values)
    }
}
```

:::warning
**중요:** ContentProvider는 `Application.onCreate()` **이전**에 생성됩니다. 항상 지연 초기화를 사용하거나 의존성을 주입하기 전에 Koin이 초기화되었는지 확인하세요.
:::

## 커스텀 뷰(Custom View) 주입

커스텀 뷰에서도 의존성 주입을 사용할 수 있지만, 신중하게 접근해야 합니다.

### 옵션 1: 생성자 주입 (비즈니스 로직에 권장)

```kotlin
// 도메인/ViewModel 레이어 - 생성자 주입 사용
class ChartViewModel(
    private val dataRepository: ChartDataRepository
) : ViewModel() {
    fun loadChartData(): LiveData<ChartData> {
        return dataRepository.getChartData()
    }
}

// 뷰 레이어 - 데이터를 받기만 하며 DI는 필요 없음
class ChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    // 주입된 의존성 없음 - 제공된 데이터만 그림
    fun setData(data: ChartData) {
        // 차트 그리기
        invalidate()
    }
}

// Activity에서 이들을 연결
class ChartActivity : AppCompatActivity() {
    private val viewModel: ChartViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val chartView = findViewById<ChartView>(R.id.chart)

        viewModel.loadChartData().observe(this) { data ->
            chartView.setData(data)
        }
    }
}
```

### 옵션 2: KoinComponent (뷰에 복잡한 로직이 있는 경우)

```kotlin
class SmartChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr), KoinComponent {

    // 뷰에 상당한 로직이 있는 경우에만 주입
    private val chartRenderer: ChartRenderer by inject()
    private val colorScheme: ColorScheme by inject()

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        chartRenderer.render(canvas, colorScheme)
    }
}
```

### 뷰에서 DI를 피해야 할 때

❌ **다음과 같은 경우 뷰에서 주입을 피하세요:**
- 뷰가 단순히 데이터를 보여주기만 하는 경우 (프레젠테이션 전용)
- 레이아웃 프리뷰에서 뷰를 사용하는 경우 (프리뷰에서는 DI를 사용할 수 없음)
- 뷰가 XML에서 인플레이트되는 경우 (생성자 파라미터를 전달할 수 없음)
- 의존성을 메서드 파라미터로 전달할 수 있는 경우

✅ **다음과 같은 경우 뷰에서 주입을 고려하세요:**
- 앱 전체에서 공유되는 복잡한 렌더링 로직을 뷰가 가지고 있는 경우
- 빌드 변리에 따라 달라지는 설정이 뷰에 필요한 경우
- 뷰가 상당한 상태나 비즈니스 로직을 관리하는 경우 (단, ViewModel로 옮기는 것을 먼저 고려하세요)

### 권장 사항: 뷰를 단순하게 유지하기

```kotlin
// ❌ 뷰에 로직이 너무 많음
class UserCardView(context: Context) : FrameLayout(context), KoinComponent {
    private val userRepository: UserRepository by inject()
    private val imageLoader: ImageLoader by inject()

    fun loadUser(userId: String) {
        val user = userRepository.getUser(userId)  // 뷰에 비즈니스 로직이 있음!
        imageLoader.load(user.imageUrl, imageView)
    }
}

// ✅ 개선: 로직을 ViewModel로 이동
class UserViewModel(
    private val userRepository: UserRepository,
    private val imageLoader: ImageLoader
) : ViewModel() {
    fun loadUser(userId: String): UserUiState {
        val user = userRepository.getUser(userId)
        return UserUiState(user, imageLoader.load(user.imageUrl))
    }
}

class UserCardView(context: Context) : FrameLayout(context) {
    // 데이터만 표시 - DI 불필요
    fun bind(state: UserUiState) {
        textView.text = state.name
        imageView.setImageBitmap(state.image)
    }
}
```

:::info
**권장 사항:** 뷰는 가능한 데이터를 표시만 하는 "단순한(dumb)" 프레젠테이션 컴포넌트로 유지하는 것이 좋습니다. 비즈니스 로직은 생성자 주입이 더 깔끔하고 테스트하기 쉬운 ViewModel이나 Presenter로 옮기세요.
:::

## 요약 (Summary)

### 적절한 주입 방식 선택하기

| 컴포넌트 | 권장 방식 | 이유 |
|-----------|---------------------|-----------|
| **Application** | `startKoin {}` | 진입점 - 여기서 Koin을 초기화함 |
| **Activity/Fragment** | `by inject()` 또는 `by viewModel()` | 내장 지원, 깔끔한 구문 |
| **ViewModel** | `viewModel {}`을 통한 생성자 주입 | 최고의 테스트 가능성 |
| **Service** | `by inject()` 또는 `get()` | 내장 지원, 긴 수명 |
| **BroadcastReceiver** | `KoinComponent` + `get()` | 내장 지원 없음, 짧은 수명 |
| **ContentProvider** | `KoinComponent` + `lazy { get() }` | 타이밍 문제, 지연 초기화 사용 |
| **Custom View** | DI 지양, 메서드를 통해 데이터 전달 | 뷰를 단순하게 유지, 로직은 ViewModel로 이동 |

### 일반적인 권장 사항

1. 비즈니스 로직 클래스(Repository, UseCase, ViewModel)에는 **생성자 주입을 선호**하세요.
2. 안드로이드 프레임워크 클래스(Activity, Fragment, Service)에는 **필드 주입**(`by inject()`)을 사용하세요.
3. 필요한 경우에만 **KoinComponent를 구현**하세요 (BroadcastReceiver, ContentProvider, Custom View).
4. 수명이 짧은 컴포넌트(BroadcastReceiver)에는 **`by inject()`보다 `get()`을 사용**하세요.
5. **뷰를 단순하게 유지**하세요. 가능한 한 뷰에 주입하는 것을 피하세요.
6. **생명주기 타이밍을 주의**하세요. ContentProvider는 특별한 처리가 필요합니다.

## 다음 단계

- **[정의 (Definitions)](/docs/reference/koin-core/definitions)** - 의존성 선언하기
- **[안드로이드에서 주입하기](/docs/reference/koin-android/get-instances)** - 상세한 Activity/Fragment 주입
- **[안드로이드 ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 관련 패턴
- **[WorkManager 통합](/docs/reference/koin-android/workmanager)** - Koin을 사용한 백그라운드 작업
- **[안드로이드 스코프](/docs/reference/koin-android/scope)** - 컴포넌트 생명주기에 의존성 스코프 지정하기