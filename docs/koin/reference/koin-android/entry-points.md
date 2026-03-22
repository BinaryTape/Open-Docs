---
title: Android 入口点
---

本指南介绍如何使用 Koin 向不同的 Android 组件注入依赖项。每种 Android 组件类型都具有特定的生命周期特性，这会影响您使用依赖注入的方式。

:::info
本页面重点介绍在**何处**进行注入（入口点）。无论您如何声明定义，注入 API（`by inject()`、`get()`、`by viewModel()`）的工作方式都是相同的。有关声明定义的信息，请参阅 [定义](/docs/reference/koin-core/definitions)。
:::

## 概览

Android 应用程序由各种组件类型组成，每种组件都有自己的生命周期和初始化模式。Koin 提供了灵活的方式向所有这些组件注入依赖项。

### 快速参考

| 组件 | 注入方法 | 内置支持 | 备注 |
|-----------|-----------------|------------------|-------|
| **Application** | 在 `onCreate()` 中调用 `startKoin {}` | ✅ 是 | Koin 设置的入口点 |
| **Activity** | `by inject()` 或 `get()` | ✅ 是 | 直接注入支持 |
| **Fragment** | `by inject()` 或 `get()` | ✅ 是 | 直接注入支持 |
| **ViewModel** | `by viewModel()` | ✅ 是 | 生命周期感知型注入 |
| **Service** | `by inject()` 或 `get()` | ✅ 是 | 直接注入支持 |
| **BroadcastReceiver** | `KoinComponent` + `get()` | ⚠️ 手动 | 实现 `KoinComponent` |
| **ContentProvider** | `KoinComponent` + `get()` | ⚠️ 手动 | 特殊的时机考虑 |
| **自定义 View** | 构造函数或 `KoinComponent` | ⚠️ 手动 | 考虑避免使用依赖注入 |

## Application 类

Application 类是您初始化 Koin 的地方。这是应用中所有依赖注入的基础。

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
有关完整的 Application 设置说明，请参阅 [在 Android 上启动 Koin](/docs/reference/koin-android/start)。
:::

## Activity 注入

Activity 通过扩展函数获得了内置的 Koin 支持。

### 使用 by inject()

```kotlin
class UserActivity : AppCompatActivity() {
    // 延迟注入 - 在首次访问时创建
    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        presenter.loadUser()  // Presenter 在此处创建
    }
}
```

### 使用 get()

```kotlin
class UserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        // 立即注入 - 立即创建
        val presenter: UserPresenter = get()
        presenter.loadUser()
    }
}
```

### 带有参数

```kotlin
class UserDetailActivity : AppCompatActivity() {
    private val userId: String by lazy { intent.getStringExtra("USER_ID") ?: "" }

    // 传递运行时参数
    private val presenter: UserDetailPresenter by inject { parametersOf(userId) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenter.loadUserDetails()
    }
}
```

有关使用参数声明定义的信息，请参阅 [注入参数](/docs/reference/koin-core/definitions#injected-parameters)。

:::info
有关更多 Activity 注入模式，请参阅 [在 Android 中注入](/docs/reference/koin-android/get-instances)。
:::

## Fragment 注入

Fragment 的工作方式与 Activity 相同，均使用 Koin 扩展。

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

### 共享 ViewModel

在 Activity 和 Fragment 之间共享 ViewModel：

```kotlin
class UserDetailFragment : Fragment() {
    // 获取作用域限定为 Activity 的 ViewModel
    private val sharedViewModel: UserViewModel by activityViewModel()

    // 获取作用域限定为此 Fragment 的 ViewModel
    private val fragmentViewModel: DetailViewModel by viewModel()
}
```

:::info
有关 Fragment 和 ViewModel 注入的详细信息，请参阅：
- [在 Android 中注入](/docs/reference/koin-android/get-instances)
- [Android ViewModel](/docs/reference/koin-android/viewmodel)
:::

## Service 注入

Service 与 Activity 和 Fragment 一样，通过扩展函数获得了内置的 Koin 支持。

### 使用 by inject()

```kotlin
class MusicPlayerService : Service() {
    // 延迟注入 - 在首次访问时创建
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
        // 立即注入 - 立即创建
        val downloader: FileDownloader = get()
        val url = intent?.getStringExtra("URL") ?: ""

        downloader.start(url)
        return START_STICKY
    }
}
```

### 生命周期考虑因素

- **Service 是长生命周期的**：对昂贵的资源使用 `single`。
- **清理工作至关重要**：在 `onDestroy()` 中释放资源。
- **后台线程**：考虑妥善限定后台工作的范围。

### 最佳做法

```kotlin
class DownloadService : Service() {
    // 使用延迟注入以延迟初始化
    private val downloader: FileDownloader by inject()
    private val notificationManager: NotificationManager by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 仅在 Service 实际启动时才创建依赖项
        downloader.start(intent?.getStringExtra("URL") ?: "")
        return START_STICKY
    }

    override fun onDestroy() {
        // 始终进行清理
        downloader.cancel()
        super.onDestroy()
    }
}
```

:::note
**替代方案：** 对于 `WorkManager` 后台任务，请使用 Koin 内置的 `WorkManager` 支持来代替 Service。请参阅 [WorkManager 集成](/docs/reference/koin-android/workmanager)。
:::

## BroadcastReceiver 注入

BroadcastReceiver 也需要使用 `KoinComponent` 来进行依赖注入。

### 动态注册的 Receiver

```kotlin
class NetworkChangeReceiver : BroadcastReceiver(), KoinComponent {
    // 对立即注入使用 get()（Receiver 是短生命周期的）
    private val networkMonitor: NetworkMonitor by inject()

    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            ConnectivityManager.CONNECTIVITY_ACTION -> {
                networkMonitor.checkConnectivity()
            }
        }
    }
}

// 在 Activity 或 Service 中注册
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

### 静态注册的 Receiver（清单文件）

```kotlin
class BootReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            // 确保 Koin 已初始化
            val app = context?.applicationContext as? MyApplication

            // 现在可以安全地注入
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

### 重要考虑因素

**生命周期：**
- Receiver 的**生命周期极短**（通常 < 10 秒）。
- 使用 `get()` 代替 `by inject()` 以获得更快的初始化速度。
- 避免在 `onReceive()` 中进行繁重操作。

**Koin 初始化：**
- 对于在清单文件中声明的 Receiver，请确保在 `Application.onCreate()` 中初始化 Koin。
- 对于动态注册的 Receiver，Koin 通常已经初始化。

**最佳做法：**

```kotlin
class AlarmReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        // 使用 get() 立即访问（对 Receiver 来说更高效）
        val repository: AlarmRepository = get()

        // 将工作分流给 Service 或 WorkManager
        val workRequest = OneTimeWorkRequestBuilder<AlarmWorker>()
            .setInputData(workDataOf("alarm_id" to intent?.getIntExtra("ID", -1)))
            .build()

        WorkManager.getInstance(context!!).enqueue(workRequest)
    }
}
```

:::warning
BroadcastReceiver 有严格的时间限制（约 10 秒）。对于任何重要的工作，请改用 `Service`、`WorkManager` 或 `JobScheduler`。
:::

## ContentProvider 注入

ContentProvider 具有特殊的初始化时机考虑，因为它们在 `Application.onCreate()` **之前**创建。

### 挑战

```kotlin
// ❌ 问题：这行不通！
class MyContentProvider : ContentProvider(), KoinComponent {
    // 创建 ContentProvider 时 Koin 尚未初始化！
    private val database: Database by inject()  // 将崩溃

    override fun onCreate(): Boolean {
        // 这在 Application.onCreate() 之前运行
        return true
    }
}
```

### 解决方案 1：延迟初始化

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    // 使用 lazy 延迟初始化
    private val database: Database by lazy {
        // 在第一次查询发生时，Koin 已经准备就绪
        get<Database>()
    }

    override fun onCreate(): Boolean {
        // 不要在此处访问注入的依赖项！
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // 在此处使用数据库是安全的（在 Application.onCreate 之后）
        return database.query(uri)
    }
}
```

### 解决方案 2：手动 Koin 初始化

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    private lateinit var database: Database

    override fun onCreate(): Boolean {
        // 如果尚未初始化，则初始化 Koin
        val context = context ?: return false

        if (GlobalContext.getOrNull() == null) {
            startKoin {
                androidContext(context.applicationContext)
                modules(databaseModule)
            }
        }

        // 现在可以安全注入
        database = get()
        return true
    }

    override fun query(/* ... */): Cursor? {
        return database.query(uri)
    }
}
```

### 最佳做法

```kotlin
class DataContentProvider : ContentProvider(), KoinComponent {
    // 延迟初始化模式
    private val repository: DataRepository by lazy { get() }

    override fun onCreate(): Boolean {
        // 最小化初始化
        // 不要在此处访问 Koin
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // 此时 Koin 肯定已经准备就绪
        return repository.getData(uri)
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return repository.insert(uri, values)
    }
}
```

:::warning
**关键点：** ContentProvider 在 `Application.onCreate()` **之前**创建。注入依赖项之前，请务必使用延迟初始化或检查 Koin 是否已初始化。
:::

## 自定义 View 注入

自定义 View 可以使用依赖注入，但应谨慎对待。

### 选项 1：构造函数注入（推荐用于业务逻辑）

```kotlin
// 领域/ViewModel 层 - 使用构造函数注入
class ChartViewModel(
    private val dataRepository: ChartDataRepository
) : ViewModel() {
    fun loadChartData(): LiveData<ChartData> {
        return dataRepository.getChartData()
    }
}

// 视图层 - 接收数据，无需依赖注入
class ChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    // 未注入依赖项 - 仅根据提供的数据进行绘制
    fun setData(data: ChartData) {
        // 绘制图表
        invalidate()
    }
}

// Activity 将它们连接在一起
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

### 选项 2：KoinComponent（当 View 具有复杂逻辑时）

```kotlin
class SmartChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr), KoinComponent {

    // 仅当 View 具有重要逻辑时才进行注入
    private val chartRenderer: ChartRenderer by inject()
    private val colorScheme: ColorScheme by inject()

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        chartRenderer.render(canvas, colorScheme)
    }
}
```

### 何时应避免在 View 中使用依赖注入

❌ **在以下情况避免在 View 中注入：**
- View 纯粹是展示性的（仅绘制数据）。
- View 用于布局预览（预览中无法使用依赖注入）。
- View 是从 XML 填充的（无法传递构造函数形参）。
- 依赖项可以作为方法参数传递。

✅ **在以下情况可以考虑在 View 中注入：**
- View 具有在应用中共享的复杂渲染逻辑。
- View 需要根据构建变体而更改的配置。
- View 管理重要的状态或业务逻辑（但请考虑移动到 ViewModel）。

### 最佳做法：保持 View 简单

```kotlin
// ❌ View 中逻辑过多
class UserCardView(context: Context) : FrameLayout(context), KoinComponent {
    private val userRepository: UserRepository by inject()
    private val imageLoader: ImageLoader by inject()

    fun loadUser(userId: String) {
        val user = userRepository.getUser(userId)  // View 中的业务逻辑！
        imageLoader.load(user.imageUrl, imageView)
    }
}

// ✅ 更好：将逻辑移动到 ViewModel
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
    // 仅显示数据 - 无需依赖注入
    fun bind(state: UserUiState) {
        textView.text = state.name
        imageView.setImageBitmap(state.image)
    }
}
```

:::info
**建议：** 倾向于保持 View 为“哑”展示组件。将业务逻辑移动到 ViewModel 或 Presenter 中，那里的构造函数注入更整洁且更易于测试。
:::

## 总结

### 选择正确的注入方式

| 组件 | 推荐方式 | 原理 |
|-----------|---------------------|-----------|
| **Application** | `startKoin {}` | 入口点 - 在此处初始化 Koin |
| **Activity/Fragment** | `by inject()` 或 `by viewModel()` | 内置支持，语法简洁 |
| **ViewModel** | 通过 `viewModel {}` 进行构造函数注入 | 最佳可测试性 |
| **Service** | `by inject()` 或 `get()` | 内置支持，长生命周期 |
| **BroadcastReceiver** | `KoinComponent` + `get()` | 无内置支持，短生命周期 |
| **ContentProvider** | `KoinComponent` + `lazy { get() }` | 初始化时机问题，使用延迟初始化 |
| **自定义 View** | 避免依赖注入，通过方法传递数据 | 保持 View 简单，将逻辑移至 ViewModel |

### 通用最佳做法

1. **优先对业务逻辑类使用构造函数注入**（Repository、UseCase、ViewModel）。
2. **对 Android 框架类使用字段注入** (`by inject()`)（Activity、Fragment、Service）。
3. **仅在必要时实现 KoinComponent**（BroadcastReceiver、ContentProvider、自定义 View）。
4. **对短生命周期组件使用 `get()` 而非 `by inject()`**（BroadcastReceiver）。
5. **保持 View 简单** - 尽可能避免在 View 中注入。
6. **关注生命周期时机** - ContentProvider 需要特殊处理。

## 后续步骤

- **[定义](/docs/reference/koin-core/definitions)** - 声明依赖项
- **[在 Android 中注入](/docs/reference/koin-android/get-instances)** - 详细的 Activity/Fragment 注入
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 特有的模式
- **[WorkManager 集成](/docs/reference/koin-android/workmanager)** - 使用 Koin 进行后台工作
- **[Android 作用域](/docs/reference/koin-android/scope)** - 将依赖项的作用域限定为组件生命周期