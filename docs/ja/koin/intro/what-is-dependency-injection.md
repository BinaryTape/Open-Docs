---
title: 依存性の注入（Dependency Injection）とは？
---

# 依存性の注入（Dependency Injection）とは？

依存性の注入（Dependency Injection: DI）は、オブジェクトが自身の依存関係を内部で作成するのではなく、外部から受け取るようにするデザインパターンです。これにより、疎結合（loose coupling）、テスト可能性の向上、そしてよりクリーンなコードアーキテクチャが促進されます。

## 依存関係（Dependency）とは？

依存関係とは、あるオブジェクトが機能するために必要とする別のオブジェクトのことです。例えば、`Car`（車）が走行するためには `Engine`（エンジン）に依存します。

### 依存性の注入を使用しない場合

```kotlin
class Engine {
    fun start() {
        println("Engine starting...")
    }
}

class Car {
    private val engine = Engine()  // Car が自身でエンジンを作成している

    fun drive() {
        engine.start()
        println("Car is driving")
    }
}
```

**このアプローチの問題点:**
- `Car` が特定の `Engine` 実装に密結合している
- `Car` を単体でテストするのが困難
- エンジンの種類（電気、ディーゼルなど）を切り替えるのが難しい
- `Car` が `Engine` のライフサイクルを制御してしまっている

### 依存性の注入を使用する場合

```kotlin
class Car(private val engine: Engine) {  // Engine が注入される
    fun drive() {
        engine.start()
        println("Car is driving")
    }
}

// これにより、異なるエンジンを簡単に提供できる
val gasolineCar = Car(GasEngine())
val electricCar = Car(ElectricEngine())
```

**メリット:**
- `Car` は `Engine` がどのように作成されるかを知る必要がない
- モックエンジンを使用して簡単にテストできる
- 柔軟性が高く、実装を入れ替えることができる
- コンストラクタで依存関係が明確に可視化される

## 依存関係を提供するための3つの方法

### 1. コンストラクタ注入（推奨）

依存関係がコンストラクタを通じて渡されます。

```kotlin
class UserRepository(
    private val database: Database,
    private val apiClient: ApiClient
) {
    fun getUser(id: String): User {
        return database.query(id) ?: apiClient.fetchUser(id)
    }
}
```

**利点:**
- 依存関係が明示的かつ必須となる
- 不変（`val` を使用）
- テストが容易
- 依存関係グラフが明確

**Koin を使用した場合:**

```kotlin
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()  // Koin が依存関係を自動的に解決（自動配線）します
}
```

:::info
コンストラクタ注入は Koin において **推奨される手法** です。これにより、ユニットテストにおいて Koin を必要とせずにコードをテストできるようになります。
:::

### 2. フィールド注入

依存関係がクラスのプロパティに注入されます。

```kotlin
class UserActivity : AppCompatActivity() {
    // 遅延注入 - 最初にアクセスされたときにインスタンスが作成される
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        viewModel.loadUser()  // ここで ViewModel インスタンスが作成される
    }
}
```

**いつ使用するか:**
- コンストラクション（生成）を自分自身で制御できない Android フレームワークのクラス（Activity、Fragment、Service など）
- コンストラクタ注入が不可能な場合

**Koin を使用した場合:**

```kotlin
// 遅延注入（Lazy injection）
val presenter: Presenter by inject()

// 即時注入（Eager injection）
val presenter: Presenter = get()
```

### 3. メソッド注入

依存関係がメソッドを通じて渡されます（あまり一般的ではありません）。

```kotlin
class ReportGenerator {
    fun generateReport(data: DataSource) {
        // data を使用してレポートを生成
    }
}
```

**いつ使用するか:**
- オプションの依存関係
- オブジェクトの生存期間中に変化する依存関係
- コールバックパターン

## 手動 DI vs 自動 DI

### 手動 DI の問題点

アプリケーションが成長するにつれて、手動での依存関係管理は複雑になります。

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 依存関係グラフ全体を手動で作成している
        val database = Database()
        val apiClient = ApiClient()
        val userRepository = UserRepository(database, apiClient)
        val authRepository = AuthRepository(database, apiClient)
        val userService = UserService(userRepository, authRepository)
        val viewModel = UserViewModel(userService)

        // ようやく viewModel が使える...
    }
}
```

**問題点:**
- 多くの Activity/Fragment で同様のコードが繰り返される
- 依存関係の順序を間違えやすい
- アプリの成長に伴いメンテナンスが困難になる
- ライフサイクルの管理（シングルトン、スコープオブジェクトなど）が難しい
- 中央集権的な設定が存在しない

### コンテナパターン（手動アプローチ）

開発者はオブジェクト作成を集中管理するためにコンテナを作成することがよくあります。

```kotlin
object AppContainer {
    private val database by lazy { Database() }
    private val apiClient by lazy { ApiClient() }

    val userRepository by lazy { UserRepository(database, apiClient) }
    val authRepository by lazy { AuthRepository(database, apiClient) }

    fun createUserViewModel() = UserViewModel(
        UserService(userRepository, authRepository)
    )
}

// 使用例
class MainActivity : AppCompatActivity() {
    private val viewModel = AppContainer.createUserViewModel()
}
```

**依然として残る課題:**
- 依存関係の手動接続（wiring）
- 自動的なライフサイクル管理がない
- グローバルな状態（シングルトンコンテナ）
- 複雑なグラフになると依然として反復作業が発生する

### Koin がどのように解決するか

Koin は、**DSL またはアノテーション** のどちらか好きな方を選択して、依存関係の自動解決を提供します。

```kotlin
// 依存関係を一度だけ定義する
val appModule = module {
    single<Database>()
    single<ApiClient>()
    single<UserRepository>()
    single<AuthRepository>()
    single<UserService>()
    viewModel<UserViewModel>()
}

// Koin を一度だけ起動する
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(appModule)
        }
    }
}

// どこでも使用可能 - Koin が依存関係グラフ全体を処理
class MainActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
    // これだけです！ Koin が UserViewModel とそのすべての依存関係を作成します
}
```

**Koin の利点:**
- 宣言的な依存関係設定
- 自動的な依存関係解決
- ライフサイクル管理（シングルトン、ファクトリ、スコープ）
- 型安全な注入
- 簡単なテストとモジュールの差し替え

## 自動 DI ソリューション

自動化された依存性の注入には、さまざまなアプローチがあります。

| アプローチ | 例 | 仕組み |
|----------|----------|--------------|
| **リフレクションベース** | (古いフレームワーク) | 実行時にリフレクションを使用する |
| **コード生成** | Dagger, Hilt | コンパイル時にコードを生成する (アノテーション処理) |
| **コンパイラプラグイン** | Koin コンパイラプラグイン | DSL とアノテーションのためのネイティブコンパイラ統合 |
| **DSLベース** | Koin (クラシック) | 実行時の DSL 設定 |

**Koin のアプローチ - DSL とアノテーションの両方が同様に強力:**
- **DSL スタイル:** クリーンな Kotlin DSL 設定 (`single<MyService>()`, `viewModel<MyVM>()`)
- **アノテーションスタイル:** 使い慣れたアノテーション (`@Singleton`, `@KoinViewModel`)
- どちらも同じコンパイラプラグインによって駆動され、コンパイル時の安全性が確保される
- リフレクションを使用せず、軽量
- チームに合ったスタイルを選択可能

## サービスロケーター vs 依存性の注入

これらの違いを理解することが重要です。

### サービスロケーターパターン

コンポーネントがレジストリに対して能動的に依存関係を要求します。

```kotlin
class UserService : KoinComponent {
    private val repository: UserRepository by inject()  // 依存関係を「引き出す」
}
```

### 依存性の注入パターン

依存関係が外部から提供されます。

```kotlin
class UserService(
    private val repository: UserRepository  // コンポーネントに「押し込まれる」
)
```

### 比較

| 項目 | サービスロケーター | 依存性の注入 |
|--------|----------------|---------------------|
| 依存関係の可視性 | クラス内部に隠蔽される | コンストラクタで明示される |
| テスト | フレームワークを必要とする | 容易 - テストダブルを渡すだけ |
| 結合度 | コンテナに依存する | インターフェースに依存する |
| Koin での用法 | `get()`, `by inject()` | Koin モジュールでのコンストラクタ定義 |
| 適した用途 | Android フレームワーククラス | ビジネスロジック、サービス |

### Koin におけるベストプラクティス

1. ビジネスロジックには **コンストラクタ注入を優先** する:

```kotlin
// 良好 - Koin なしでテスト可能
class UserViewModel(private val userService: UserService) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()  // Koin が依存関係を解決する
}
```

2. **サービスロケーター** は必要な場合にのみ使用する:

```kotlin
// 許容範囲 - Activity の生成は Android によって制御されるため
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()
}
```

3. **ビジネスロジック内での `KoinComponent` の使用を避ける:**

```kotlin
// 非推奨 - テストが困難
class UserService : KoinComponent {
    private val repository: UserRepository = get()
}

// 推奨 - 明示的な依存関係
class UserService(private val repository: UserRepository)
```

## 依存性の注入のメリット

### 1. テスト可能性

DI がないと、テストは困難になります。

```kotlin
class UserService {
    private val repository = UserRepository()  // モック化できない！
}
```

DI があれば、テストは簡単です。

```kotlin
class UserService(private val repository: UserRepository)

@Test
fun testGetUser() {
    val mockRepository = mockk<UserRepository>()
    val service = UserService(mockRepository)  // 完全に制御可能

    every { mockRepository.findUser("123") } returns testUser
    assertEquals(testUser, service.getUser("123"))
}
```

### 2. 柔軟性

実装を簡単に切り替えることができます。

```kotlin
val appModule = module {
    single<EmailService> { GmailService() }  // 本番環境用
}

val testModule = module {
    single<EmailService> { MockEmailService() }  // テスト用
}
```

### 3. コードの整理

依存関係の設定を一元管理できます。

```kotlin
val dataModule = module {
    single<Database>()
    single<ApiClient>()
}

val domainModule = module {
    single<UserRepository>()
    single<AuthRepository>()
}

val presentationModule = module {
    viewModel<UserViewModel>()
}

startKoin {
    modules(dataModule, domainModule, presentationModule)
}
```

### 4. ライフサイクル管理

Koin がオブジェクトのライフサイクルを処理します。

```kotlin
val appModule = module {
    single<Database>()       // アプリ全体で1つのインスタンス
    factory<Presenter>()     // 毎回新しいインスタンス
    scoped<SessionData>()    // スコープごとのインスタンス
}
```

## まとめ

依存性の注入は、以下のことを実現する強力なパターンです。
- コンポーネントをその依存関係から **分離（デカップリング）** する
- 依存関係の差し替えを可能にし、 **テスト可能性を向上** させる
- 中央集権的な設定により **メンテナンスを簡素化** する
- 手動の依存関係管理よりも **スケーラビリティに優れる**

Koin は、以下の方法で Kotlin における DI をシンプルにします。
- **2つの強力なスタイル**（DSL またはアノテーション）を自由に選択可能
- **コンストラクタ注入**（推奨）と **フィールド注入**（必要な場合）の両方をサポート
- コンパイラプラグインによる **コンパイル時の安全性** の提供
- **リフレクションを一切使用しない** 純粋な Kotlin 実装

## 次のステップ

- **[Koin とは？](/docs/intro/what-is-koin)** - Koin のアプローチについて学ぶ
- **[Koin コンパイラプラグイン](/docs/intro/koin-compiler-plugin)** - 推奨される、より安全なアプローチ
- **[セットアップガイド](/docs/setup/gradle)** - プロジェクトに Koin を追加する