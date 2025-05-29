[//]: # (title: Kotlin/Nativeのメモリ管理)

Kotlin/Nativeは、JVM、Go、その他主流の技術と同様のモダンなメモリマネージャーを使用しており、以下の機能を備えています。

*   オブジェクトは共有ヒープに格納され、どのスレッドからもアクセスできます。
*   ローカル変数やグローバル変数などの「ルート」から到達不能になったオブジェクトを収集するために、トレーシングガベージコレクションが定期的に実行されます。

## ガベージコレクター

Kotlin/Nativeのガベージコレクター (GC) アルゴリズムは常に進化しています。現在、ヒープを世代に分割しないStop-the-world方式のマーク・アンド・コンカレント・スイープコレクターとして機能します。

GCは別のスレッドで実行され、メモリ負荷のヒューリスティクスまたはタイマーに基づいて開始されます。あるいは、[手動で呼び出す](#enable-garbage-collection-manually)ことも可能です。

GCは、アプリケーションスレッド、GCスレッド、およびオプションのマーカースレッドを含む複数のスレッドで並行してマークキューを処理します。アプリケーションスレッドと少なくとも1つのGCスレッドがマーキングプロセスに参加します。デフォルトでは、GCがヒープ内のオブジェクトをマークしている間、アプリケーションスレッドは一時停止する必要があります。

> マークフェーズの並列化は、`kotlin.native.binary.gcMarkSingleThreaded=true` コンパイラオプションで無効にできます。
> ただし、これにより大規模なヒープでのガベージコレクターの一時停止時間が増加する可能性があります。
>
{style="tip"}

マーキングフェーズが完了すると、GCは弱参照を処理し、マークされていないオブジェクトへの参照ポインタをnull化します。デフォルトでは、GCの一時停止時間を短縮するために弱参照は並行して処理されます。

ガベージコレクションの[監視](#monitor-gc-performance)方法と[最適化](#optimize-gc-performance)方法については、こちらをご覧ください。

### ガベージコレクションを手動で有効にする

ガベージコレクターを強制的に開始するには、`kotlin.native.internal.GC.collect()` を呼び出します。このメソッドは新しいコレクションをトリガーし、その完了を待ちます。

### GCパフォーマンスを監視する

GCのパフォーマンスを監視するには、ログを確認し、問題を診断できます。ロギングを有効にするには、Gradleビルドスクリプトで以下のコンパイラオプションを設定します。

```none
-Xruntime-logs=gc=info
```

現在、ログは `stderr` にのみ出力されます。

Appleプラットフォームでは、Xcode Instrumentsツールキットを活用して、iOSアプリのパフォーマンスをデバッグできます。ガベージコレクターは、Instrumentsで利用可能なサインポストで一時停止を報告します。サインポストを使用すると、アプリ内でカスタムロギングが可能になり、GCの一時停止がアプリケーションのフリーズに対応するかどうかを確認できます。

アプリ内のGC関連の一時停止を追跡するには：

1.  この機能を有効にするには、`gradle.properties` ファイルで以下のコンパイラオプションを設定します。
  
    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  Xcodeを開き、**Product** | **Profile** に移動するか、<shortcut>Cmd + I</shortcut> を押します。この操作により、アプリがコンパイルされ、Instrumentsが起動します。
3.  テンプレート選択で、**os_signpost** を選択します。
4.  **subsystem** に `org.kotlinlang.native.runtime` を、**category** に `safepoint` を指定して設定します。
5.  赤い録画ボタンをクリックしてアプリを実行し、サインポストイベントの記録を開始します。

    ![サインポストとしてGC一時停止を追跡する](native-gc-signposts.png){width=700}

    ここで、最下部のグラフにある各青い点線は、個別のサインポストイベント、つまりGCの一時停止を表しています。

### GCパフォーマンスを最適化する

GCパフォーマンスを改善するには、並行マーキングを有効にしてGCの一時停止時間を短縮できます。これにより、ガベージコレクションのマーキングフェーズがアプリケーションスレッドと同時に実行されます。

この機能は現在、[実験的](components-stability.md#stability-levels-explained)です。これを有効にするには、`gradle.properties` ファイルで以下のコンパイラオプションを設定します。
  
```none
kotlin.native.binary.gc=cms
```

### ガベージコレクションを無効にする

GCは有効にしておくことを推奨します。ただし、テスト目的や、問題が発生した場合、あるいは短命なプログラムの場合など、特定の状況で無効にすることができます。これを行うには、`gradle.properties` ファイルで以下のバイナリオプションを設定します。

```none
kotlin.native.binary.gc=noop
```

> このオプションが有効になっている場合、GCはKotlinオブジェクトを収集しないため、プログラムの実行中はメモリ消費が増加し続けます。システムメモリを使い果たさないように注意してください。
>
{style="warning"}

## メモリ消費

Kotlin/Nativeは独自の[メモリマネージャー](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を使用しています。システムメモリをページに分割し、連続した順序で独立したスイープを可能にします。各アロケーションはページ内のメモリブロックとなり、ページはブロックサイズを追跡します。異なるページタイプは、さまざまなアロケーションサイズに合わせて最適化されています。メモリブロックの連続的な配置により、割り当てられたすべてのブロックを効率的に反復処理できます。

スレッドがメモリを割り当てる際、アロケーションサイズに基づいて適切なページを検索します。スレッドは、さまざまなサイズカテゴリのページセットを維持します。通常、特定のサイズに対する現在のページでアロケーションを収容できます。そうでない場合、スレッドは共有アロケーションスペースから別のページを要求します。このページは、すでに利用可能であるか、スイープが必要であるか、または最初に作成される必要がある場合があります。

Kotlin/Nativeのメモリマネージャーは、メモリアロケーションの急激なスパイクに対する保護機能を備えています。これは、ミューテーターが大量のガベージを迅速に割り当て始め、GCスレッドがそれに追いつけず、メモリ使用量が際限なく増加する状況を防ぎます。この場合、GCはイテレーションが完了するまでStop-the-worldフェーズを強制します。

自分でメモリ消費を監視し、メモリリークをチェックし、メモリ消費を調整できます。

### メモリリークをチェックする

メモリマネージャーのメトリクスにアクセスするには、`kotlin.native.internal.GC.lastGCInfo()` を呼び出します。このメソッドは、ガベージコレクターの最後の実行に関する統計を返します。この統計は、以下の状況で役立ちます。

*   グローバル変数を使用している場合のメモリリークのデバッグ
*   テスト実行時のリークの確認

```kotlin
import kotlin.native.internal.*
import kotlin.test.*

class Resource

val global = mutableListOf<Resource>()

@OptIn(ExperimentalStdlibApi::class)
fun getUsage(): Long {
    GC.collect()
    return GC.lastGCInfo!!.memoryUsageAfter["heap"]!!.totalObjectsSizeBytes
}

fun run() {
    global.add(Resource())
    // The test will fail if you remove the next line
    // この行を削除するとテストは失敗します
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // A separate function is used to ensure that all temporary objects are cleared
    // 一時オブジェクトがすべてクリアされていることを確認するために、別の関数を使用しています
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

### メモリ消費を調整する

プログラムにメモリリークがないにもかかわらず、予想外に高いメモリ消費が見られる場合は、Kotlinを最新バージョンに更新してみてください。私たちはメモリマネージャーを常に改善しているため、単純なコンパイラの更新でもメモリ消費が改善する可能性があります。

更新後も高いメモリ消費が続く場合は、Gradleビルドスクリプトで以下のコンパイラオプションを使用して、システムメモリマネージャーに切り替えてください。

```none
-Xallocator=std
```

これでもメモリ消費が改善しない場合は、[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt) で問題を報告してください。

## バックグラウンドでの単体テスト

単体テストでは、メインスレッドキューは何も処理しないため、モックされていない限り `Dispatchers.Main` を使用しないでください。モックは `kotlinx-coroutines-test` から `Dispatchers.setMain` を呼び出すことで可能です。

`kotlinx.coroutines` に依存していない場合、または何らかの理由で `Dispatchers.setMain` が機能しない場合は、テストランチャーを実装するための以下の回避策を試してください。

```kotlin
package testlauncher

import platform.CoreFoundation.*
import kotlin.native.concurrent.*
import kotlin.native.internal.test.*
import kotlin.system.*

fun mainBackground(args: Array<String>) {
    val worker = Worker.start(name = "main-background")
    worker.execute(TransferMode.SAFE, { args.freeze() }) {
        val result = testLauncherEntryPoint(it)
        exitProcess(result)
    }
    CFRunLoopRun()
    error("CFRunLoopRun should never return")
}
```
{initial-collapse-state="collapsed" collapsible="true"}

次に、`-e testlauncher.mainBackground` コンパイラオプションを使用してテストバイナリをコンパイルします。

## 次のステップ

*   [従来のメモリマネージャーからの移行](native-migration-guide.md)
*   [Swift/Objective-C ARC との統合の具体例を確認する](native-arc-integration.md)