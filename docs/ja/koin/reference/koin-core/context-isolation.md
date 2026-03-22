---
title: コンテキストの分離
---

コンテキストの分離（Context isolation）を使用すると、SDK開発者はホストアプリケーションのKoinインスタンスと競合することなくKoinを使用できるようになります。

:::info
標準的なKoinのセットアップについては、**[Koinの開始](/docs/reference/koin-core/starting-koin)**を参照してください。
:::

## いつコンテキストの分離を使用するか

- **SDK/ライブラリ開発** - ライブラリ内部でKoinを使用する場合
- **競合の回避** - ホストアプリもKoinを使用している可能性がある場合
- **カプセル化** - DIコンテナをプライベートに保つ場合

## 分離されたコンテキストの作成

`GlobalContext` に登録を行う `startKoin` を使用する代わりに、 `koinApplication` を使用します：

```kotlin
// SDK用の分離されたKoinコンテキスト
object MySdkKoinContext {

    private val koinApp = koinApplication {
        modules(sdkModule)
    }

    val koin = koinApp.koin
}

val sdkModule = module {
    single<SdkService>()
    single<SdkRepository>()
}
```

## カスタムKoinComponent

分離されたコンテキストを使用するカスタムの `KoinComponent` を作成します：

```kotlin
internal interface SdkKoinComponent : KoinComponent {
    // 分離されたコンテキストを使用するようにオーバーライドする
    override fun getKoin(): Koin = MySdkKoinContext.koin
}

// SDKクラスでの使用例
class MySdkClass : SdkKoinComponent {
    private val service: SdkService by inject()  // 分離されたコンテキストを使用する
}
```

## 分離されたコンテキストのテスト

テストで分離されたコンテキストを使用するには、 `getKoin()` をオーバーライドします：

```kotlin
class SdkTest : KoinTest {
    override fun getKoin(): Koin = MySdkKoinContext.koin

    @Before
    fun setUp() {
        val testModule = module {
            single<SdkService> { MockSdkService() }
        }
        koin.loadModules(listOf(testModule))
    }

    @After
    fun tearDown() {
        koin.unloadModules(listOf(testModule))
    }
}
```

## 関連項目

- **[Koinの開始](/docs/reference/koin-core/starting-koin)** - 標準的なKoinのセットアップ
- **[Composeの分離されたコンテキスト](/docs/reference/koin-compose/isolated-context)** - Composeアプリにおける分離