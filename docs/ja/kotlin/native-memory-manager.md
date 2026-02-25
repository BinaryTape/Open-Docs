[//]: # (title: Kotlin/Nativeのメモリ管理)

Kotlin/Nativeは、JVM、Go、およびその他の主要な技術と同様のモダンなメモリマネージャーを使用しており、以下の機能を備えています。

* オブジェクトは共有ヒープに格納され、任意のスレッドからアクセスできます。
* ローカル変数やグローバル変数などの「ルート」から到達不能なオブジェクトを回収するために、トレース型ガベージコレクション（tracing garbage collection）が定期的に実行されます。

## ガベージコレクター

Kotlin/Nativeのガベージコレクター（GC）アルゴリズムは絶えず進化しています。現在は、世代別ヒープを採用しない、ストップ・ザ・ワールド（stop-the-world）方式のマーク、およびコンカレント・スイープ（concurrent sweep）方式のコレクターとして機能しています。

GCは独立したスレッドで実行され、メモリ負荷のヒューリスティクスまたはタイマーに基づいて開始されます。あるいは、[手動で呼び出す](#enable-garbage-collection-manually)ことも可能です。

GCは、アプリケーションスレッド、GCスレッド、およびオプションのマーカースレッドを含む複数のスレッドで並列にマークキューを処理します。アプリケーションスレッドと少なくとも1つのGCスレッドがマーキングプロセスに参加します。デフォルトでは、GCがヒープ内のオブジェクトをマークしている間、アプリケーションスレッドは一時停止する必要があります。

> `kotlin.native.binary.gcMarkSingleThreaded=true` コンパイラオプションを使用して、マークフェーズの並列化を無効にできます。ただし、これにより大規模なヒープでのガベージコレクターの一時停止時間が長くなる可能性があります。
>
{style="tip"}

マークフェーズが完了すると、GCは弱参照を処理し、マークされていないオブジェクトへの参照ポイントをnullにします。デフォルトでは、GCの一時停止時間を短縮するために、弱参照は並行して処理されます。

ガベージコレクションを[監視](#monitor-gc-performance)および[最適化](#optimize-gc-performance)する方法については、各セクションを参照してください。

### ガベージコレクションを手動で有効にする

ガベージコレクターを強制的に開始するには、`kotlin.native.internal.GC.collect()` を呼び出します。このメソッドは新しいコレクションをトリガーし、その完了を待ちます。

### GCのパフォーマンスを監視する

GCのパフォーマンスを監視するために、ログを確認して問題を診断できます。ログを有効にするには、Gradleビルドスクリプトで以下のコンパイラオプションを設定します。

```none
-Xruntime-logs=gc=info
```

現在、ログは `stderr`（標準エラー出力）にのみ出力されます。

Appleプラットフォームでは、XcodeのInstrumentsツールキットを利用してiOSアプリのパフォーマンスをデバッグできます。ガベージコレクターは、Instrumentsで利用可能なサインポスト（signposts）を使用して一時停止を報告します。サインポストを使用すると、アプリ内でカスタムログを記録でき、GCによる一時停止がアプリケーションのフリーズに対応しているかどうかを確認できます。

アプリ内のGC関連の一時停止を追跡するには：

1. この機能を有効にするには、`gradle.properties` ファイルに以下のコンパイラオプションを設定します。
  
   ```none
   kotlin.native.binary.enableSafepointSignposts=true
   ```

2. Xcodeを開き、**Product** | **Profile** を選択するか、<shortcut>Cmd + I</shortcut> を押します。この操作によりアプリがコンパイルされ、Instrumentsが起動します。
3. テンプレート選択で **os_signpost** を選択します。
4. **subsystem** に `org.kotlinlang.native.runtime`、**category** に `safepoint` を指定して設定します。
5. 赤い録画ボタンをクリックしてアプリを実行し、サインポストイベントの記録を開始します。

   ![Tracking GC pauses as signposts](native-gc-signposts.png){width=700}

   ここでは、一番下のグラフにある各青い塊が個別のサインポストイベント、つまりGCの一時停止を表しています。

### GCのパフォーマンスを最適化する

GCのパフォーマンスを向上させるために、コンカレント・マーキング（concurrent marking）を有効にしてGCの一時停止時間を短縮できます。これにより、ガベージコレクションのマークフェーズをアプリケーションスレッドと同時に実行できるようになります。

この機能は現在[試験的（Experimental）](components-stability.md#stability-levels-explained)です。有効にするには、`gradle.properties` ファイルに以下のコンパイラオプションを設定します。
  
```none
kotlin.native.binary.gc=cms
```

### ガベージコレクションを無効にする

GCは有効のままにしておくことが推奨されます。ただし、テスト目的や、プログラムの実行時間が短く問題が発生する場合など、特定のケースでは無効にすることができます。そのためには、`gradle.properties` ファイルに以下のバイナリオプションを設定します。

```none
kotlin.native.binary.gc=noop
```

> このオプションを有効にすると、GCはKotlinオブジェクトを回収しないため、プログラムが実行されている限りメモリ消費量が増え続けます。システムメモリを使い果たさないように注意してください。
>
{style="warning"}

## メモリ消費

Kotlin/Nativeは独自の[メモリアロケータ](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を使用しています。システムメモリをページに分割し、連続した順序で独立したスイープを可能にします。各アロケーション（割り当て）はページ内のメモリブロックとなり、ページはブロックサイズを追跡します。異なるページタイプが、さまざまなアロケーションサイズに合わせて最適化されています。メモリブロックを連続して配置することで、すべてのアロケート済みブロックを効率的に反復処理できます。

スレッドがメモリを割り当てる際、アロケーションサイズに基づいて適切なページを検索します。スレッドは、異なるサイズカテゴリごとに一連のページを保持しています。通常、特定のサイズの現在のページでアロケーションを収容できます。収容できない場合、スレッドは共有アロケーションスペースから別のページを要求します。このページはすでに利用可能であるか、スイープが必要であるか、あるいは最初に作成される必要があります。

Kotlin/Nativeのメモリアロケータには、メモリ割り当ての急激なスパイクに対する保護機能が備わっています。これは、ミューテータ（mutator）が大量のゴミを素早く割り当て始め、GCスレッドがそれに追いつけなくなり、メモリ使用量が際限なく増加する状況を防ぎます。この場合、GCは反復処理が完了するまでストップ・ザ・ワールド（stop-the-world）フェーズを強制します。

メモリ消費量を自分で監視し、メモリリークをチェックし、メモリ消費量を調整することができます。

### メモリ消費量を監視する

メモリの問題をデバッグするために、メモリマネージャーのメトリクスを確認できます。さらに、AppleプラットフォームではKotlinのメモリ消費量を追跡することも可能です。

#### メモリリークをチェックする

メモリマネージャーのメトリクスにアクセスするには、`kotlin.native.internal.GC.lastGCInfo()` を呼び出します。このメソッドは、最後に実行されたガベージコレクターの統計情報を返します。統計情報は以下の用途に役立ちます。

* グローバル変数を使用している場合のメモリリークのデバッグ
* テスト実行時のリークのチェック

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
    // 次の行を削除するとテストは失敗します
    global.clear()
}

@Test
fun test() {
    val before = getUsage()
    // すべてのテンポラリオブジェクトがクリアされることを確実にするため、別の関数を使用しています
    run()
    val after = getUsage()
    assertEquals(before, after)
}
```

#### Appleプラットフォームでメモリ消費を追跡する

Appleプラットフォームでメモリの問題をデバッグする際、Kotlinコードによってどの程度のメモリが確保されているかを確認できます。Kotlinのシェアには識別子のタグが付けられ、Xcode InstrumentsのVM Trackerなどのツールを通じて追跡できます。

この機能は、以下の条件が**すべて**満たされている場合にのみ、デフォルトのKotlin/Nativeメモリアロケータで利用可能です。

* **タギングが有効であること**。メモリに有効な識別子でタグを付ける必要があります。Appleは240から255の間の数値を推奨しており、デフォルト値は246です。

  `kotlin.native.binary.mmapTag=0` Gradleプロパティを設定すると、タギングは無効になります。

* **mmapによるアロケーション**。アロケータは `mmap` システムコールを使用してファイルをメモリにマップする必要があります。

  `kotlin.native.binary.disableMmap=true` Gradleプロパティを設定すると、デフォルトのアロケータは `mmap` の代わりに `malloc` を使用します。

* **ページングが有効であること**。アロケーションのページング（バッファリング）を有効にする必要があります。

  [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradleプロパティを設定すると、代わりにオブジェクト単位でメモリが確保されます。

### メモリ消費量を調整する

予期せずメモリ消費量が高くなった場合は、以下の解決策を試してください。

#### Kotlinをアップデートする

Kotlinを最新バージョンにアップデートしてください。メモリマネージャーは常に改善されているため、単純なコンパイラのアップデートだけでもメモリ消費が改善される可能性があります。

#### アロケータのページングを無効にする
<primary-label ref="experimental-opt-in"/>

アロケーションのページング（バッファリング）を無効にして、メモリアロケータがオブジェクト単位でメモリを確保するようにできます。場合によっては、厳しいメモリ制限を満たしたり、アプリケーションの起動時のメモリ消費を抑えたりするのに役立ちます。

そのためには、`gradle.properties` ファイルに以下のオプションを設定します。

```none
kotlin.native.binary.pagedAllocator=false
```

> アロケータのページングを無効にすると、[Appleプラットフォームでのメモリ消費量の追跡](#track-memory-consumption-on-apple-platforms)はできなくなります。
> 
{style="note"}

#### Latin-1文字列のサポートを有効にする
<primary-label ref="experimental-opt-in"/>

デフォルトでは、Kotlinの文字列はUTF-16エンコーディングを使用して格納され、各文字は2バイトで表されます。場合によっては、バイナリ内で文字列がソースコードの2倍のスペースを占有し、データの読み込みに2倍のメモリを消費することにつながります。

アプリケーションのバイナリサイズを削減し、メモリ消費を調整するために、Latin-1エンコードされた文字列のサポートを有効にできます。[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) エンコーディングは、最初の256個のUnicode文字をそれぞれ1バイトだけで表します。

有効にするには、`gradle.properties` ファイルに以下のオプションを設定します。

```none
kotlin.native.binary.latin1Strings=true
```

Latin-1サポートを有効にすると、すべての文字がその範囲内に収まる限り、文字列はLatin-1エンコーディングで格納されます。そうでない場合は、デフォルトのUTF-16エンコーディングが使用されます。

> この機能が試験的（Experimental）である間、cinterop拡張関数である [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)、および [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) の効率が低下します。これらの呼び出しのたびに、UTF-16への自動文字列変換がトリガーされる可能性があります。
> 
{style="note"}

これらのオプションのどれも役に立たなかった場合は、[YouTrack](https://kotl.in/issue) で問題を作成してください。

## バックグラウンドでのユニットテスト

ユニットテストでは、メインスレッドのキューを処理するものが何もないため、モック化されていない限り `Dispatchers.Main` を使用しないでください。モック化は、`kotlinx-coroutines-test` から `Dispatchers.setMain` を呼び出すことで行えます。

`kotlinx.coroutines` に依存していない場合、あるいは何らかの理由で `Dispatchers.setMain` が機能しない場合は、テストランチャーを実装するために以下の回避策を試してください。

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

* [レガシーメモリマネージャーからの移行](native-migration-guide.md)
* [Swift/Objective-C ARCとの統合の詳細を確認する](native-arc-integration.md)