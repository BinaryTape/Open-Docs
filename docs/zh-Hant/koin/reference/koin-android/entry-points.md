---
title: Android 入口點
---

本指南介紹如何使用 Koin 將相依性注入到不同的 Android 組件中。每種 Android 組件類型都有特定的生命週期特性，這會影響您使用相依注入的方式。

:::info
本頁面重點在於 **何處** 進行注入（入口點）。不論您如何宣告定義，注入 API（`by inject()`、`get()`、`by viewModel()`）的工作方式都相同。關於宣告定義，請參閱 [定義](/docs/reference/koin-core/definitions)。
:::

## 概覽

Android 應用程式由各種組件類型組成，每種組件都有自己的生命週期和初始化模式。Koin 提供了靈活的方式將相依性注入到所有這些組件中。

### 快速參考

| 組件 | 注入方法 | 內建支援 | 備註 |
|-----------|-----------------|------------------|-------|
| **Application** | 在 `onCreate()` 中呼叫 `startKoin {}` | ✅ 是 | Koin 設定的入口點 |
| **Activity** | `by inject()` 或 `get()` | ✅ 是 | 直接注入支援 |
| **Fragment** | `by inject()` 或 `get()` | ✅ 是 | 直接注入支援 |
| **ViewModel** | `by viewModel()` | ✅ 是 | 生命週期感知注入 |
| **Service** | `by inject()` 或 `get()` | ✅ 是 | 直接注入支援 |
| **BroadcastReceiver** | `KoinComponent` + `get()` | ⚠️ 手動 | 實作 `KoinComponent` |
| **ContentProvider** | `KoinComponent` + `get()` | ⚠️ 手動 | 特殊的時機考量 |
| **自訂視圖 (Custom View)** | 建構函式或 `KoinComponent` | ⚠️ 手動 | 考慮避免使用相依注入 |

## Application 類別

Application 類別是您初始化 Koin 的地方。這是應用程式中所有相依注入的基礎。

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
如需完整的 Application 設定說明，請參閱 [在 Android 上啟動 Koin](/docs/reference/koin-android/start)。
:::

## Activity 注入

Activity 透過擴充函式獲得了內建的 Koin 支援。

### 使用 by inject()

```kotlin
class UserActivity : AppCompatActivity() {
    // 延遲注入 - 第一次存取時建立
    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        presenter.loadUser()  // Presenter 在此處建立
    }
}
```

### 使用 get()

```kotlin
class UserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        // 立即注入 - 立即建立
        val presenter: UserPresenter = get()
        presenter.loadUser()
    }
}
```

### 帶有參數

```kotlin
class UserDetailActivity : AppCompatActivity() {
    private val userId: String by lazy { intent.getStringExtra("USER_ID") ?: "" }

    // 傳遞執行時參數
    private val presenter: UserDetailPresenter by inject { parametersOf(userId) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenter.loadUserDetails()
    }
}
```

關於如何宣告帶有參數的定義，請參閱 [注入參數](/docs/reference/koin-core/definitions#injected-parameters)。

:::info
如需更多 Activity 注入模式，請參閱 [在 Android 中注入](/docs/reference/koin-android/get-instances)。
:::

## Fragment 注入

Fragment 的工作方式與 Activity 相同，皆使用 Koin 擴充功能。

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

### 共用 ViewModel

在 Activity 與 Fragment 之間共用 ViewModel：

```kotlin
class UserDetailFragment : Fragment() {
    // 獲取作用域限於 Activity 的 ViewModel
    private val sharedViewModel: UserViewModel by activityViewModel()

    // 獲取作用域限於此 Fragment 的 ViewModel
    private val fragmentViewModel: DetailViewModel by viewModel()
}
```

:::info
關於 Fragment 與 ViewModel 注入的詳細資訊，請參閱：
- [在 Android 中注入](/docs/reference/koin-android/get-instances)
- [Android ViewModel](/docs/reference/koin-android/viewmodel)
:::

## Service 注入

Service 與 Activity 和 Fragment 一樣，透過擴充函式獲得了內建的 Koin 支援。

### 使用 by inject()

```kotlin
class MusicPlayerService : Service() {
    // 延遲注入 - 第一次存取時建立
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

### 使用 get()

```kotlin
class DownloadService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 立即注入 - 立即建立
        val downloader: FileDownloader = get()
        val url = intent?.getStringExtra("URL") ?: ""

        downloader.start(url)
        return START_STICKY
    }
}
```

### 生命週期考量

- **Service 是長期存活的**：對於昂貴的資源請使用 `single`。
- **清理至關重要**：在 `onDestroy()` 中釋放資源。
- **背景執行緒**：考慮正確地設定背景工作的作用域。

### 最佳實務

```kotlin
class DownloadService : Service() {
    // 使用延遲注入來延遲初始化
    private val downloader: FileDownloader by inject()
    private val notificationManager: NotificationManager by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 只有當 Service 真正啟動時，相依性才會建立
        downloader.start(intent?.getStringExtra("URL") ?: "")
        return START_STICKY
    }

    override fun onDestroy() {
        // 務必進行清理
        downloader.cancel()
        super.onDestroy()
    }
}
```

:::note
**替代方案：** 對於 `WorkManager` 背景任務，請使用 Koin 內建的 `WorkManager` 支援來代替 Service。請參閱 [WorkManager 整合](/docs/reference/koin-android/workmanager)。
:::

## BroadcastReceiver 注入

BroadcastReceiver 也需要 `KoinComponent` 來進行相依性注入。

### 動態註冊的 Receiver

```kotlin
class NetworkChangeReceiver : BroadcastReceiver(), KoinComponent {
    // 使用 get() 進行立即注入 (Receiver 是短暫存活的)
    private val networkMonitor: NetworkMonitor by inject()

    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            ConnectivityManager.CONNECTIVITY_ACTION -> {
                networkMonitor.checkConnectivity()
            }
        }
    }
}

// 在 Activity 或 Service 中註冊
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

### 靜態註冊的 Receiver (Manifest)

```kotlin
class BootReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            // 確保 Koin 已初始化
            val app = context?.applicationContext as? MyApplication

            // 現在可以安全注入
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

### 重要考量

**生命週期：**
- Receiver 的**存活時間極短**（通常小於 10 秒）。
- 使用 `get()` 代替 `by inject()` 以實現更快的初始化。
- 避免在 `onReceive()` 中執行繁重的操作。

**Koin 初始化：**
- 對於在清單檔案中宣告的 Receiver，請確保在 `Application.onCreate()` 中初始化 Koin。
- 對於動態註冊的 Receiver，Koin 通常已經初始化。

**最佳實務：**

```kotlin
class AlarmReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        // 使用 get() 立即存取 (對 Receiver 而言更有效率)
        val repository: AlarmRepository = get()

        // 將工作卸載到 Service 或 WorkManager
        val workRequest = OneTimeWorkRequestBuilder<AlarmWorker>()
            .setInputData(workDataOf("alarm_id" to intent?.getIntExtra("ID", -1)))
            .build()

        WorkManager.getInstance(context!!).enqueue(workRequest)
    }
}
```

:::warning
BroadcastReceiver 有嚴格的時間限制（約 10 秒）。對於任何重大的工作，請改用 `Service`、`WorkManager` 或 `JobScheduler`。
:::

## ContentProvider 注入

ContentProvider 有特殊的時機考量，因為它們是在 `Application.onCreate()` **之前** 建立的。

### 挑戰

```kotlin
// ❌ 問題：這將無法運作！
class MyContentProvider : ContentProvider(), KoinComponent {
    // 建立 ContentProvider 時 Koin 尚未初始化！
    private val database: Database by inject()  // 將會崩潰

    override fun onCreate(): Boolean {
        // 這會在 Application.onCreate() 之前執行
        return true
    }
}
```

### 解決方案 1：延遲初始化

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    // 使用 lazy 延遲初始化
    private val database: Database by lazy {
        // 當第一次查詢發生時，Koin 已經準備好了
        get<Database>()
    }

    override fun onCreate(): Boolean {
        // 不要在此處存取注入的相依性！
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // 在此處使用 database 是安全的 (在 Application.onCreate 之後)
        return database.query(uri)
    }
}
```

### 解決方案 2：手動 Koin 初始化

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    private lateinit var database: Database

    override fun onCreate(): Boolean {
        // 如果 Koin 尚未初始化，則進行初始化
        val context = context ?: return false

        if (GlobalContext.getOrNull() == null) {
            startKoin {
                androidContext(context.applicationContext)
                modules(databaseModule)
            }
        }

        // 現在可以安全注入
        database = get()
        return true
    }

    override fun query(/* ... */): Cursor? {
        return database.query(uri)
    }
}
```

### 最佳實務

```kotlin
class DataContentProvider : ContentProvider(), KoinComponent {
    // 延遲初始化模式
    private val repository: DataRepository by lazy { get() }

    override fun onCreate(): Boolean {
        // 最小化初始化
        // 不要在此處存取 Koin
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // 到此時 Koin 肯定已經準備就緒
        return repository.getData(uri)
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return repository.insert(uri, values)
    }
}
```

:::warning
**關鍵：** ContentProvider 是在 `Application.onCreate()` **之前** 建立的。注入相依性之前，請務必使用延遲初始化或檢查 Koin 是否已初始化。
:::

## 自訂視圖注入

自訂視圖 (Custom View) 可以使用相依注入，但應謹慎處理。

### 選項 1：建構函式注入（推薦用於商業邏輯）

```kotlin
// 領域/ViewModel 層 - 使用建構函式注入
class ChartViewModel(
    private val dataRepository: ChartDataRepository
) : ViewModel() {
    fun loadChartData(): LiveData<ChartData> {
        return dataRepository.getChartData()
    }
}

// 視圖層 - 接收資料，不需要相依注入
class ChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    // 沒有注入相依性 - 僅根據提供的資料進行繪製
    fun setData(data: ChartData) {
        // 繪製圖表
        invalidate()
    }
}

// Activity 將它們連結在一起
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

### 選項 2：KoinComponent（當視圖具有複雜邏輯時）

```kotlin
class SmartChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr), KoinComponent {

    // 僅在視圖具有重大邏輯時才進行注入
    private val chartRenderer: ChartRenderer by inject()
    private val colorScheme: ColorScheme by inject()

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        chartRenderer.render(canvas, colorScheme)
    }
}
```

### 何時應避免在視圖中使用相依注入

❌ **在以下情況，請避免在視圖中進行注入：**
- 視圖僅用於呈現（僅繪製資料）。
- 視圖用於版面配置預覽（預覽中無法使用相依注入）。
- 視圖是從 XML 充氣（Inflate）的（無法傳遞建構函式參數）。
- 相依性可以作為方法參數傳遞。

✅ **在以下情況，請考慮在視圖中進行注入：**
- 視圖具有在整個應用程式中共用的複雜渲染邏輯。
- 視圖需要根據組建變體（Build Variant）而變化的配置。
- 視圖管理重大的狀態或商業邏輯（儘管應考慮將其移至 ViewModel）。

### 最佳實務：保持視圖簡潔

```kotlin
// ❌ 視圖中邏輯過多
class UserCardView(context: Context) : FrameLayout(context), KoinComponent {
    private val userRepository: UserRepository by inject()
    private val imageLoader: ImageLoader by inject()

    fun loadUser(userId: String) {
        val user = userRepository.getUser(userId)  // 視圖中的商業邏輯！
        imageLoader.load(user.imageUrl, imageView)
    }
}

// ✅ 更好：將邏輯移至 ViewModel
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
    // 僅顯示資料 - 不需要相依注入
    fun bind(state: UserUiState) {
        textView.text = state.name
        imageView.setImageBitmap(state.image)
    }
}
```

:::info
**建議：** 傾向於讓視圖保持為「笨拙」的呈現組件。將商業邏輯移至 ViewModel 或 Presenter，在那裡建構函式注入會更乾淨且更易於測試。
:::

## 總結

### 選擇正確的注入方式

| 組件 | 推薦做法 | 理由 |
|-----------|---------------------|-----------|
| **Application** | `startKoin {}` | 入口點 - 在此初始化 Koin |
| **Activity/Fragment** | `by inject()` 或 `by viewModel()` | 內建支援，語法簡潔 |
| **ViewModel** | 透過 `viewModel {}` 進行建構函式注入 | 最佳的可測試性 |
| **Service** | `by inject()` 或 `get()` | 內建支援，長期存活 |
| **BroadcastReceiver** | `KoinComponent` + `get()` | 無內建支援，短暫存活 |
| **ContentProvider** | `KoinComponent` + `lazy { get() }` | 時機問題，使用延遲初始化 |
| **自訂視圖** | 避免相依注入，透過方法傳遞資料 | 保持視圖簡潔，將邏輯移至 ViewModel |

### 一般最佳實務

1. 對商業邏輯類別（Repository、UseCase、ViewModel）**優先使用建構函式注入**。
2. 對 Android 架構類別（Activity、Fragment、Service）**使用欄位注入** (`by inject()`)。
3. 僅在必要時（BroadcastReceiver、ContentProvider、自訂視圖）**實作 KoinComponent**。
4. 對於短暫存活的組件（BroadcastReceiver）**使用 `get()` 優於 `by inject()`**。
5. **保持視圖簡潔** - 盡可能避免在視圖中進行注入。
6. **注意生命週期時機** - ContentProvider 需要特殊處理。

## 後續步驟

- **[定義](/docs/reference/koin-core/definitions)** - 宣告相依性
- **[在 Android 中注入](/docs/reference/koin-android/get-instances)** - 詳細的 Activity/Fragment 注入
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 特定模式
- **[WorkManager 整合](/docs/reference/koin-android/workmanager)** - 使用 Koin 進行背景工作
- **[Android 作用域](/docs/reference/koin-android/scope)** - 將相依性的作用域限制在組件生命週期中