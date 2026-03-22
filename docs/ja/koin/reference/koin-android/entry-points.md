---
title: Androidのエントリーポイント
---

このガイドでは、Koinを使用してさまざまなAndroidコンポーネントに依存関係を注入する方法について説明します。各Androidコンポーネントのタイプには、依存関係の注入方法に影響を与える固有のライフサイクルの特性があります。

:::info
このページでは、**どこで**注入するか（エントリーポイント）に焦点を当てています。注入用API（`by inject()`、`get()`、`by viewModel()`）は、定義をどのように宣言したかに関係なく同じように動作します。定義の宣言については、[定義（Definitions）](/docs/reference/koin-core/definitions)を参照してください。
:::

## 概要

Androidアプリケーションはさまざまなコンポーネントタイプで構成されており、それぞれ独自のライフサイクルと初期化パターンを持っています。Koinは、これらすべてに依存関係を注入するための柔軟な方法を提供します。

### クイックリファレンス

| コンポーネント | 注入方法 | ビルトインサポート | 備考 |
|-----------|-----------------|------------------|-------|
| **Application** | `onCreate()` 内で `startKoin {}` | ✅ あり | Koinセットアップのエントリーポイント |
| **Activity** | `by inject()` または `get()` | ✅ あり | 直接注入をサポート |
| **Fragment** | `by inject()` または `get()` | ✅ あり | 直接注入をサポート |
| **ViewModel** | `by viewModel()` | ✅ あり | ライフサイクルを認識した注入 |
| **Service** | `by inject()` または `get()` | ✅ あり | 直接注入をサポート |
| **BroadcastReceiver** | `KoinComponent` + `get()` | ⚠️ 手動 | `KoinComponent` を実装 |
| **ContentProvider** | `KoinComponent` + `get()` | ⚠️ 手動 | 初期化タイミングに特別な考慮が必要 |
| **Custom View** | コンストラクタ または `KoinComponent` | ⚠️ 手動 | DIの回避を検討 |

## Applicationクラス

ApplicationクラスはKoinを初期化する場所です。これがアプリ内のすべての依存関係注入の基盤となります。

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
Applicationの完全なセットアップ手順については、[AndroidでKoinを開始する](/docs/reference/koin-android/start)を参照してください。
:::

## Activityへの注入

Activityは、拡張関数を通じてKoinのビルトインサポートを利用できます。

### by inject() を使用する

```kotlin
class UserActivity : AppCompatActivity() {
    // 遅延注入 - 最初にアクセスされた時に作成される
    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        presenter.loadUser()  // ここでPresenterが作成される
    }
}
```

### get() を使用する

```kotlin
class UserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        // 即時注入 - すぐに作成される
        val presenter: UserPresenter = get()
        presenter.loadUser()
    }
}
```

### パラメータを渡す場合

```kotlin
class UserDetailActivity : AppCompatActivity() {
    private val userId: String by lazy { intent.getStringExtra("USER_ID") ?: "" }

    // ランタイムパラメータを渡す
    private val presenter: UserDetailPresenter by inject { parametersOf(userId) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        presenter.loadUserDetails()
    }
}
```

パラメータを持つ定義の宣言については、[注入パラメータ（Injected Parameters）](/docs/reference/koin-core/definitions#injected-parameters)を参照してください。

:::info
Activityへの注入パターンの詳細については、[Androidでの注入](/docs/reference/koin-android/get-instances)を参照してください。
:::

## Fragmentへの注入

Fragmentでも、Activityと同様にKoinの拡張関数を使用できます。

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

### 共有ViewModel

ActivityとFragmentの間でViewModelを共有する場合：

```kotlin
class UserDetailFragment : Fragment() {
    // Activityのスコープに属するViewModelを取得
    private val sharedViewModel: UserViewModel by activityViewModel()

    // このFragmentのスコープに属するViewModelを取得
    private val fragmentViewModel: DetailViewModel by viewModel()
}
```

:::info
FragmentおよびViewModelの注入の詳細については、以下を参照してください：
- [Androidでの注入](/docs/reference/koin-android/get-instances)
- [Android ViewModels](/docs/reference/koin-android/viewmodel)
:::

## Serviceへの注入

ServiceもActivityやFragmentと同様に、拡張関数によるKoinのビルトインサポートがあります。

### by inject() を使用する

```kotlin
class MusicPlayerService : Service() {
    // 遅延注入 - 最初にアクセスされた時に作成される
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

### get() を使用する

```kotlin
class DownloadService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // 即時注入 - すぐに作成される
        val downloader: FileDownloader = get()
        val url = intent?.getStringExtra("URL") ?: ""

        downloader.start(url)
        return START_STICKY
    }
}
```

### ライフサイクルに関する考慮事項

- **Serviceは長時間実行される**: コストの高いリソースには `single` を使用してください。
- **クリーンアップが重要**: `onDestroy()` でリソースを解放してください。
- **バックグラウンドスレッド**: バックグラウンドでの作業が適切にスコープされるように考慮してください。

### ベストプラクティス

```kotlin
class DownloadService : Service() {
    // 遅延注入を使用して初期化を遅らせる
    private val downloader: FileDownloader by inject()
    private val notificationManager: NotificationManager by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Serviceが実際に開始された時にのみ依存関係が作成される
        downloader.start(intent?.getStringExtra("URL") ?: "")
        return START_STICKY
    }

    override fun onDestroy() {
        // 常にクリーンアップを行う
        downloader.cancel()
        super.onDestroy()
    }
}
```

:::note
**代替案:** `WorkManager` によるバックグラウンドタスクの場合は、Serviceの代わりにKoinの組み込み `WorkManager` サポートを使用してください。[WorkManagerの統合](/docs/reference/koin-android/workmanager)を参照してください。
:::

## BroadcastReceiverへの注入

BroadcastReceiverで依存関係を注入するには、`KoinComponent` が必要です。

### 動的に登録されるReceiver

```kotlin
class NetworkChangeReceiver : BroadcastReceiver(), KoinComponent {
    // 即時注入のために get() を使用（Receiverは短命なため）
    private val networkMonitor: NetworkMonitor by inject()

    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            ConnectivityManager.CONNECTIVITY_ACTION -> {
                networkMonitor.checkConnectivity()
            }
        }
    }
}

// ActivityまたはServiceで登録
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

### 静的に登録されるReceiver (Manifest)

```kotlin
class BootReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            // Koinが初期化されていることを確認
            val app = context?.applicationContext as? MyApplication

            // 注入が安全に行える
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

### 重要な考慮事項

**ライフサイクル:**
- Receiverは**極めて短命**です（通常10秒未満）。
- 高速な初期化のために、`by inject()` よりも `get()` の使用を検討してください。
- `onReceive()` 内での重い処理は避けてください。

**Koinの初期化:**
- Manifestで宣言されたReceiverの場合、`Application.onCreate()` でKoinが初期化されていることを確認してください。
- 動的に登録されたReceiverの場合、Koinは既に初期化されています。

**ベストプラクティス:**

```kotlin
class AlarmReceiver : BroadcastReceiver(), KoinComponent {
    override fun onReceive(context: Context?, intent: Intent?) {
        // 即時アクセスのために get() を使用（Receiverにとってより効率的）
        val repository: AlarmRepository = get()

        // 実際の処理はServiceまたはWorkManagerに委譲する
        val workRequest = OneTimeWorkRequestBuilder<AlarmWorker>()
            .setInputData(workDataOf("alarm_id" to intent?.getIntExtra("ID", -1)))
            .build()

        WorkManager.getInstance(context!!).enqueue(workRequest)
    }
}
```

:::warning
BroadcastReceiverには厳しい時間制限（約10秒）があります。大規模な処理を行う場合は、代わりに `Service`、`WorkManager`、または `JobScheduler` を使用してください。
:::

## ContentProviderへの注入

ContentProviderは、`Application.onCreate()` よりも**前**に作成されるため、タイミングに関して特別な考慮が必要です。

### 課題

```kotlin
// ❌ 問題: これは動作しません！
class MyContentProvider : ContentProvider(), KoinComponent {
    // ContentProviderが作成される際、Koinはまだ初期化されていません！
    private val database: Database by inject()  // クラッシュします

    override fun onCreate(): Boolean {
        // これは Application.onCreate() よりも前に実行されます
        return true
    }
}
```

### 解決策 1: 遅延初期化 (Lazy Initialization)

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    // lazy を使用して初期化を遅らせる
    private val database: Database by lazy {
        // 最初のクエリが発生する頃には、Koinの準備は整っています
        get<Database>()
    }

    override fun onCreate(): Boolean {
        // ここで注入された依存関係にアクセスしてはいけません！
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // ここ（Application.onCreateの後）でdatabaseを使用するのは安全です
        return database.query(uri)
    }
}
```

### 解決策 2: 手動によるKoinの初期化

```kotlin
class UserContentProvider : ContentProvider(), KoinComponent {
    private lateinit var database: Database

    override fun onCreate(): Boolean {
        // まだ初期化されていない場合はKoinを初期化する
        val context = context ?: return false

        if (GlobalContext.getOrNull() == null) {
            startKoin {
                androidContext(context.applicationContext)
                modules(databaseModule)
            }
        }

        // これで注入が安全に行える
        database = get()
        return true
    }

    override fun query(/* ... */): Cursor? {
        return database.query(uri)
    }
}
```

### ベストプラクティス

```kotlin
class DataContentProvider : ContentProvider(), KoinComponent {
    // 遅延初期化パターン
    private val repository: DataRepository by lazy { get() }

    override fun onCreate(): Boolean {
        // 最小限の初期化に留める
        // ここではKoinにアクセスしない
        return true
    }

    override fun query(
        uri: Uri,
        projection: Array<out String>?,
        selection: String?,
        selectionArgs: Array<out String>?,
        sortOrder: String?
    ): Cursor? {
        // この時点ではKoinは確実に準備できています
        return repository.getData(uri)
    }

    override fun insert(uri: Uri, values: ContentValues?): Uri? {
        return repository.insert(uri, values)
    }
}
```

:::warning
**重要:** ContentProviderは `Application.onCreate()` よりも**前**に作成されます。常に遅延初期化（lazy initialization）を使用するか、依存関係を注入する前にKoinが初期化されているかを確認してください。
:::

## カスタムビューへの注入

カスタムビューでも依存関係の注入を使用できますが、慎重に検討する必要があります。

### オプション 1: コンストラクタ注入 (ビジネスロジックに推奨)

```kotlin
// ドメイン/ViewModel層 - コンストラクタ注入を使用
class ChartViewModel(
    private val dataRepository: ChartDataRepository
) : ViewModel() {
    fun loadChartData(): LiveData<ChartData> {
        return dataRepository.getChartData()
    }
}

// ビュー層 - データを受け取るだけでDIは不要
class ChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    // 依存関係の注入なし - 与えられたものを描画するだけ
    fun setData(data: ChartData) {
        // チャートを描画
        invalidate()
    }
}

// Activityがそれらを結びつける
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

### オプション 2: KoinComponent (ビューに複雑なロジックがある場合)

```kotlin
class SmartChartView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr), KoinComponent {

    // ビューに重要なロジックがある場合にのみ注入する
    private val chartRenderer: ChartRenderer by inject()
    private val colorScheme: ColorScheme by inject()

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        chartRenderer.render(canvas, colorScheme)
    }
}
```

### ビューでのDIを避けるべきケース

❌ **以下のような場合は、ビューへの注入を避けてください：**
- ビューが純粋に表示用である場合（単にデータを描画するだけ）
- ビューがレイアウトプレビューで使用される場合（プレビューではDIが利用できない）
- ビューがXMLからインフレートされる場合（コンストラクタパラメータを渡せない）
- 依存関係をメソッドの引数として渡せる場合

✅ **以下のような場合は、ビューへの注入を検討してください：**
- アプリ全体で共有される複雑なレンダリングロジックをビューが持っている場合
- ビルドバリアントごとに変わる設定をビューが必要とする場合
- ビューが重要な状態やビジネスロジックを管理している場合（ただし、その場合はViewModelへの移行も検討すべきです）

### ベストプラクティス: ビューはシンプルに保つ

```kotlin
// ❌ ビューにロジックが多すぎる例
class UserCardView(context: Context) : FrameLayout(context), KoinComponent {
    private val userRepository: UserRepository by inject()
    private val imageLoader: ImageLoader by inject()

    fun loadUser(userId: String) {
        val user = userRepository.getUser(userId)  // ビューの中にビジネスロジックがある！
        imageLoader.load(user.imageUrl, imageView)
    }
}

// ✅ 改善案: ロジックをViewModelに移動する
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
    // データを表示するだけ - DIは不要
    fun bind(state: UserUiState) {
        textView.text = state.name
        imageView.setImageBitmap(state.image)
    }
}
```

:::info
**推奨事項:** ビューは「表示に徹する（dumb）」コンポーネントとして保つことを優先してください。ビジネスロジックは、コンストラクタ注入がよりクリーンでテストしやすいViewModelやPresenterに移動させてください。
:::

## まとめ

### 適切な注入アプローチの選択

| コンポーネント | 推奨されるアプローチ | 理由 |
|-----------|---------------------|-----------|
| **Application** | `startKoin {}` | エントリーポイント - ここでKoinを初期化する |
| **Activity/Fragment** | `by inject()` または `by viewModel()` | ビルトインサポートがあり、構文がクリーン |
| **ViewModel** | `viewModel {}` を介したコンストラクタ注入 | 最高のテスト容易性 |
| **Service** | `by inject()` または `get()` | ビルトインサポートがあり、長時間実行される |
| **BroadcastReceiver** | `KoinComponent` + `get()` | ビルトインサポートがなく、短命である |
| **ContentProvider** | `KoinComponent` + `lazy { get() }` | タイミングの問題があるため、遅延初期化を使用する |
| **Custom View** | DIを避け、メソッド経由でデータを渡す | ビューをシンプルに保ち、ロジックをViewModelに移動する |

### 全般的なベストプラクティス

1. ビジネスロジッククラス（Repository、UseCase、ViewModel）には**コンストラクタ注入を優先**してください。
2. Androidフレームワーククラス（Activity、Fragment、Service）には**フィールド注入**（`by inject()`）を使用してください。
3. **KoinComponentの実装**は、必要な場合にのみ行ってください（BroadcastReceiver、ContentProvider、カスタムビュー）。
4. 短命なコンポーネント（BroadcastReceiver）では、`by inject()` よりも **`get()` を使用**してください。
5. **ビューはシンプルに保つ** - 可能な限りビューへの注入は避けてください。
6. **ライフサイクルのタイミングに注意** - ContentProviderには特別な処理が必要です。

## 次のステップ

- **[定義（Definitions）](/docs/reference/koin-core/definitions)** - 依存関係の宣言
- **[Androidでの注入](/docs/reference/koin-android/get-instances)** - Activity/Fragmentでの注入の詳細
- **[Android ViewModels](/docs/reference/koin-android/viewmodel)** - ViewModel固有のパターン
- **[WorkManagerの統合](/docs/reference/koin-android/workmanager)** - Koinを使用したバックグラウンドワーク
- **[Androidスコープ](/docs/reference/koin-android/scope)** - コンポーネントのライフサイクルに依存関係をスコープする