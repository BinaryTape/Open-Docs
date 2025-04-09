---
title: Kotlin/Nativeのメモリ管理
---
Kotlin/Nativeは、JVM、Go、およびその他の主流技術と同様の最新のメモリマネージャーを使用しており、以下の機能が含まれています。

* オブジェクトは共有ヒープに格納され、どのスレッドからでもアクセスできます。
* トレースガベージコレクションが定期的に実行され、ローカル変数やグローバル変数などの「ルート」から到達できないオブジェクトを収集します。

## ガベージコレクター

Kotlin/Nativeのガベージコレクター（GC）アルゴリズムは常に進化しています。現在、これはstop-the-worldマークであり、ヒープを世代に分離しない同時スイープコレクターとして機能します。

GCは別のスレッドで実行され、メモリープレッシャーのヒューリスティクスまたはタイマーに基づいて開始されます。または、[手動で呼び出す](#enable-garbage-collection-manually)こともできます。

GCは、アプリケーションスレッド、GCスレッド、およびオプションのマーカースレッドを含む複数のスレッドでマークキューを並行して処理します。アプリケーションスレッドと少なくとも1つのGCスレッドがマーキングプロセスに参加します。デフォルトでは、GCがヒープ内のオブジェクトをマーキングしている間、アプリケーションスレッドは一時停止する必要があります。

:::tip
コンパイラーオプション`kotlin.native.binary.gcMarkSingleThreaded=true`を使用すると、マークフェーズの並列処理を無効にできます。
ただし、これにより、大きなヒープでのガベージコレクターの一時停止時間が増加する可能性があります。

:::

マーキングフェーズが完了すると、GCは弱い参照を処理し、マークされていないオブジェクトへの参照ポイントをnullにします。デフォルトでは、GCの一時停止時間を短縮するために、弱い参照は同時に処理されます。

ガベージコレクションを[監視](#monitor-gc-performance)および[最適化](#optimize-gc-performance)する方法をご覧ください。

### ガベージコレクションを手動で有効にする

ガベージコレクターを強制的に開始するには、`kotlin.native.internal.GC.collect()`を呼び出します。このメソッドは新しいコレクションをトリガーし、その完了を待ちます。

### GCパフォーマンスの監視

GCパフォーマンスを監視するには、ログを確認して問題を診断します。ロギングを有効にするには、Gradleビルドスクリプトで次のコンパイラーオプションを設定します。

```none
-Xruntime-logs=gc=info
```

現在、ログは`stderr`にのみ出力されます。

Appleプラットフォームでは、Xcode Instrumentsツールキットを利用してiOSアプリのパフォーマンスをデバッグできます。
ガベージコレクターは、Instrumentsで使用可能なサインポストで一時停止を報告します。
サインポストを使用すると、アプリ内でカスタムロギングが可能になり、GCの一時停止がアプリケーションのフリーズに対応するかどうかを確認できます。

アプリでGC関連の一時停止を追跡するには:

1. この機能を有効にするには、`gradle.properties`ファイルで次のコンパイラーオプションを設定します。
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. Xcodeを開き、**Product** | **Profile**に移動するか、<shortcut>Cmd + I</shortcut>を押します。この操作により、アプリがコンパイルされ、Instrumentsが起動されます。
3. テンプレートの選択で、**os_signpost**を選択します。
4. **subsystem**として`org.kotlinlang.native.runtime`、**category**として`safepoint`を指定して構成します。
5. 赤い記録ボタンをクリックしてアプリを実行し、サインポストイベントの記録を開始します。

   <img src="/img/native-gc-signposts.png" alt="Tracking GC pauses as signposts" width="700" style={{verticalAlign: 'middle'}}/>

   ここで、一番下のグラフの青いblobは、GCの一時停止である個別のサインポストイベントを表しています。

### GCパフォーマンスの最適化

GCパフォーマンスを向上させるには、同時マーキングを有効にして、GCの一時停止時間を短縮できます。これにより、ガベージコレクションのマーキングフェーズをアプリケーションスレッドと同時に実行できます。

この機能は現在[Experimental](components-stability#stability-levels-explained)です。有効にするには、`gradle.properties`ファイルで次のコンパイラーオプションを設定します。
  
```none
kotlin.native.binary.gc=cms
```

### ガベージコレクションの無効化

GCを有効にしておくことをお勧めします。ただし、テスト目的など、特定のケースで無効にしたり、問題が発生してプログラムの寿命が短い場合に無効にしたりできます。これを行うには、`gradle.properties`ファイルで次のバイナリオプションを設定します。

```none
kotlin.native.binary.gc=noop
```

:::caution
このオプションを有効にすると、GCはKotlinオブジェクトを収集しないため、プログラムの実行中にメモリ消費量が増加し続けます。システムメモリーを使い果たさないように注意してください。

:::

## メモリ消費量

Kotlin/Nativeは、独自の[メモリアロケーター](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)を使用します。
これは、システムメモリーをページに分割し、連続した順序で独立したスイープを可能にします。各割り当てはページ内のメモリーブロックになり、ページはブロックサイズを追跡します。さまざまなページタイプは、さまざまな割り当てサイズに最適化されています。メモリーブロックの連続した配置により、割り当てられたすべてのブロックを効率的に反復処理できます。

スレッドがメモリーを割り当てる場合、割り当てサイズに基づいて適切なページを検索します。スレッドは、さまざまなサイズカテゴリのページのセットを維持します。通常、特定のサイズの現在のページは割り当てに対応できます。そうでない場合、スレッドは共有割り当てスペースから別のページを要求します。このページはすでに利用可能であるか、スイープが必要であるか、最初に作成する必要があります。

Kotlin/Nativeメモリアロケーターには、メモリー割り当ての急激なスパイクに対する保護機能が付属しています。これにより、ミューテーターがすぐに大量のガベージを割り当て始め、GCスレッドがそれに追いつけず、メモリー使用量が際限なく増加する状況を防ぎます。この場合、GCは反復が完了するまでstop-the-worldフェーズを強制します。

メモリー消費量を自分で監視したり、メモリーリークを確認したり、メモリー消費量を調整したりできます。

### メモリーリークの確認

メモリーマネージャーのメトリックにアクセスするには、`kotlin.native.internal.GC.lastGCInfo()`を呼び出します。このメソッドは、ガベージコレクターの最後の実行に関する統計を返します。統計は、次の目的で役立ちます。

* グローバル変数を使用する場合のメモリーリークのデバッグ
* テスト実行時のリークの確認

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
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // A separate function is used to ensure that all temporary objects are cleared
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

### メモリ消費量の調整

プログラムにメモリーリークがない場合でも、予期しないほど高いメモリー消費量が表示される場合は、Kotlinを最新バージョンに更新してみてください。メモリーマネージャーは常に改善されているため、単純なコンパイラーの更新でもメモリー消費量が改善される可能性があります。

更新後もメモリー消費量が高い場合は、Gradleビルドスクリプトで次のコンパイラーオプションを使用して、システムメモリアロケーターに切り替えます。

```none
-Xallocator=std
```

これでメモリー消費量が改善されない場合は、[YouTrack](https://youtrack.jetbrains.com/newissue?project=kt)で問題を報告してください。

## バックグラウンドでの単体テスト

単体テストでは、メインスレッドキューを処理するものが何もないため、モックされていない限り、`Dispatchers.Main`を使用しないでください。モックは、`kotlinx-coroutines-test`から`Dispatchers.setMain`を呼び出すことで実行できます。

`kotlinx.coroutines`に依存していない場合、または`Dispatchers.setMain`が何らかの理由で機能しない場合は、テストランチャーを実装するために次の回避策を試してください。

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

次に、`-e testlauncher.mainBackground`コンパイラーオプションを使用してテストバイナリをコンパイルします。

## 次のステップ

* [レガシーメモリマネージャーからの移行](native-migration-guide)
* [Swift/Objective-C ARCとの統合の具体的な内容を確認する](native-arc-integration)

  ```