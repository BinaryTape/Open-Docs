[//]: # (title: Kotlin/Nativeのメモリ管理)

Kotlin/Nativeは、JVM、Go、その他の主要なテクノロジーに似たモダンなメモリマネージャーを使用しており、以下の機能を備えています。

*   オブジェクトは共有ヒープに格納され、どのスレッドからもアクセスできます。
*   ローカル変数やグローバル変数などの「ルート」から到達不能なオブジェクトを収集するために、トレース型ガベージコレクションが定期的に実行されます。

## ガベージコレクター

Kotlin/Nativeのガベージコレクター (GC) アルゴリズムは常に進化しています。現在、これはヒープを世代に分割しない、Stop-the-world方式のマーク&コンカレントスイープコレクターとして機能します。

GCは独立したスレッドで実行され、メモリ負荷のヒューリスティクスに基づいて、またはタイマーによって開始されます。あるいは、[手動で呼び出す](#enable-garbage-collection-manually)こともできます。

GCは、アプリケーションスレッド、GCスレッド、オプションのマーカースレッドを含む複数のスレッドでマークキューを並行して処理します。アプリケーションスレッドと少なくとも1つのGCスレッドがマーキングプロセスに参加します。デフォルトでは、GCがヒープ内のオブジェクトをマーキングしている間、アプリケーションスレッドは一時停止する必要があります。

> マークフェーズの並列化は、`kotlin.native.binary.gcMarkSingleThreaded=true`コンパイラオプションで無効にできます。
> ただし、これにより大規模なヒープではガベージコレクターの一時停止時間が増加する可能性があります。
>
{style="tip"}

マーキングフェーズが完了すると、GCは弱参照を処理し、マークされていないオブジェクトへの参照をnull化します。デフォルトでは、弱参照はGCの一時停止時間を短縮するために並行して処理されます。

ガベージコレクションの[監視](#monitor-gc-performance)と[最適化](#optimize-gc-performance)の方法については、こちらをご覧ください。

### ガベージコレクションを手動で有効にする

ガベージコレクターを強制的に開始するには、`kotlin.native.internal.GC.collect()`を呼び出します。このメソッドは新しいコレクションをトリガーし、その完了を待ちます。

### GCパフォーマンスを監視する

GCパフォーマンスを監視するには、そのログを確認し、問題を診断できます。ロギングを有効にするには、Gradleビルドスクリプトで以下のコンパイラオプションを設定します。

```none
-Xruntime-logs=gc=info
```

現在、ログは`stderr`にのみ出力されます。

Appleプラットフォームでは、Xcode Instrumentsツールキットを利用してiOSアプリのパフォーマンスをデバッグできます。ガベージコレクターは、Instrumentsで利用可能なサインポストを使用して一時停止をレポートします。サインポストはアプリ内でカスタムロギングを可能にし、GCの一時停止がアプリケーションのフリーズに対応しているかを確認できます。

アプリでGC関連の一時停止を追跡するには：

1.  この機能を有効にするには、`gradle.properties`ファイルに以下のコンパイラオプションを設定します。
    ```none
    kotlin.native.binary.enableSafepointSignposts=true
    ```

2.  Xcodeを開き、**Product** | **Profile** に移動するか、<shortcut>Cmd + I</shortcut>を押します。このアクションにより、アプリがコンパイルされ、Instrumentsが起動します。
3.  テンプレート選択で、**os_signpost**を選択します。
4.  **subsystem**に`org.kotlinlang.native.runtime`、**category**に`safepoint`を指定して設定します。
5.  赤い記録ボタンをクリックしてアプリを実行し、サインポストイベントの記録を開始します。

    ![Tracking GC pauses as signposts](native-gc-signposts.png){width=700}

    ここで、一番下のグラフの各青い塊は、個別のサインポストイベントであり、GCの一時停止です。

### GCパフォーマンスを最適化する

GCパフォーマンスを改善するには、並行マーキングを有効にしてGCの一時停止時間を短縮できます。これにより、ガベージコレクションのマーキングフェーズがアプリケーションスレッドと同時に実行されるようになります。

この機能は現在[Experimental](components-stability.md#stability-levels-explained)です。有効にするには、`gradle.properties`ファイルに以下のコンパイラオプションを設定します。

```none
kotlin.native.binary.gc=cms
```

### ガベージコレクションを無効にする

GCを有効にしておくことをお勧めします。ただし、テスト目的や、問題が発生し短命なプログラムである場合など、特定のケースでは無効にできます。そうするには、`gradle.properties`ファイルに以下のバイナリオプションを設定します。

```none
kotlin.native.binary.gc=noop
```

> このオプションを有効にすると、GCはKotlinオブジェクトを収集しないため、プログラムの実行中はメモリ消費量が継続的に増加します。システムメモリを使い果たさないように注意してください。
>
{style="warning"}

## メモリ消費

Kotlin/Nativeは独自の[メモリ確保機能](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md)を使用しています。これはシステムメモリをページに分割し、連続した順序で独立したスイープを可能にします。各割り当てはページ内のメモリブロックとなり、ページはブロックサイズを追跡します。異なるページタイプは様々な割り当てサイズに合わせて最適化されています。メモリブロックの連続的な配置により、割り当てられたすべてのブロックを効率的に反復処理できます。

スレッドがメモリを割り当てる際、割り当てサイズに基づいて適切なページを検索します。スレッドは異なるサイズカテゴリのページセットを維持します。通常、特定のサイズに対する現在のページが割り当てを収容できます。そうでない場合、スレッドは共有割り当てスペースから別のページを要求します。このページはすでに利用可能であるか、スイープが必要であるか、または最初に作成する必要があります。

Kotlin/Nativeのメモリ確保機能には、メモリ割り当ての急激なスパイクに対する保護機能が備わっています。これは、ミューテーターが大量のガベージを高速で割り当て始め、GCスレッドがそれについていけないために、メモリ使用量が無限に増加してしまう状況を防ぎます。この場合、イテレーションが完了するまでGCはStop-the-worldフェーズを強制します。

メモリ消費量を自身で監視し、メモリリークをチェックし、メモリ消費量を調整できます。

### メモリ消費量を監視する

メモリの問題をデバッグするには、メモリマネージャーのメトリクスを確認できます。さらに、AppleプラットフォームでのKotlinのメモリ消費量を追跡することも可能です。

#### メモリリークをチェックする

メモリマネージャーのメトリクスにアクセスするには、`kotlin.native.internal.GC.lastGCInfo()`を呼び出します。このメソッドは、ガベージコレクターの最後の実行に関する統計を返します。この統計は、以下の点で役立ちます。

*   グローバル変数使用時のメモリリークのデバッグ
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

#### Appleプラットフォームでメモリ消費量を追跡する

Appleプラットフォームでメモリの問題をデバッグする際、Kotlinコードによって確保されているメモリ量を視覚的に確認できます。Kotlinの共有分は識別子でタグ付けされており、Xcode InstrumentsのVM Trackerのようなツールを通じて追跡できます。

この機能は、以下の条件がすべて満たされている場合にのみ、デフォルトのKotlin/Nativeメモリ確保機能で利用可能です。

*   **タグ付けが有効であること**。メモリは有効な識別子でタグ付けされている必要があります。Appleは240から255の間の数値を推奨しており、デフォルト値は246です。

    `kotlin.native.binary.mmapTag=0` Gradleプロパティを設定すると、タグ付けが無効になります。

*   **`mmap`による割り当て**。アロケーターは`mmap`システムコールを使用してファイルをメモリにマッピングする必要があります。

    `kotlin.native.binary.disableMmap=true` Gradleプロパティを設定すると、デフォルトのアロケーターは`mmap`の代わりに`malloc`を使用します。

*   **ページングが有効であること**。割り当てのページング（バッファリング）が有効である必要があります。

    [`kotlin.native.binary.pagedAllocator=false`](#disable-allocator-paging) Gradleプロパティを設定すると、メモリは代わりにオブジェクトごとに確保されます。

### メモリ消費量を調整する

予期せず高いメモリ消費が発生した場合は、以下の解決策を試してください。

#### Kotlinを更新する

Kotlinを最新バージョンに更新してください。メモリマネージャーは継続的に改善されているため、簡単なコンパイラの更新でもメモリ消費が改善する可能性があります。

#### アロケーターのページングを無効にする
<primary-label ref="experimental-opt-in"/>

割り当てのページング（バッファリング）を無効にして、メモリ確保機能がオブジェクトごとにメモリを確保するようにできます。場合によっては、これにより厳密なメモリ制限を満たしたり、アプリケーションの起動時のメモリ消費を削減したりするのに役立つ場合があります。

そうするには、`gradle.properties`ファイルに以下のオプションを設定します。

```none
kotlin.native.binary.pagedAllocator=false
```

> アロケーターのページングが無効になっている場合、[Appleプラットフォームでのメモリ消費量の追跡](#track-memory-consumption-on-apple-platforms)はできません。
>
{style="note"}

#### Latin-1文字列のサポートを有効にする
<primary-label ref="experimental-opt-in"/>

デフォルトでは、Kotlinの文字列はUTF-16エンコーディングを使用して格納され、各文字は2バイトで表現されます。場合によっては、これにより文字列がバイナリ内でソースコードの2倍のスペースを占め、データの読み込みが2倍のメモリを消費することがあります。

アプリケーションのバイナリサイズを削減し、メモリ消費量を調整するには、Latin-1エンコードされた文字列のサポートを有効にできます。[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1)エンコーディングは、Unicodeの最初の256文字をそれぞれ1バイトで表現します。

これを有効にするには、`gradle.properties`ファイルに以下のオプションを設定します。

```none
kotlin.native.binary.latin1Strings=true
```

Latin-1サポートを有効にすると、すべての文字がその範囲内にある限り、文字列はLatin-1エンコーディングで格納されます。そうでない場合は、デフォルトのUTF-16エンコーディングが使用されます。

> この機能はExperimentalですが、cinterop拡張関数[`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)、および[`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html)の効率が低下します。それらへの各呼び出しは、UTF-16への自動的な文字列変換をトリガーする可能性があります。
>
{style="note"}

これらのオプションのいずれも役に立たない場合は、[YouTrack](https://kotl.in/issue)でイシューを作成してください。

## バックグラウンドでの単体テスト

単体テストでは、メインスレッドキューを処理するものがないため、`Dispatchers.Main`はモックされていない限り使用しないでください。モックは`kotlinx-coroutines-test`から`Dispatchers.setMain`を呼び出すことで可能です。

`kotlinx.coroutines`に依存していない場合や、何らかの理由で`Dispatchers.setMain`が機能しない場合は、テストランチャーを実装するための以下の回避策を試してください。

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

次に、コンパイラオプション`-e testlauncher.mainBackground`を指定してテストバイナリをコンパイルします。

## 次のステップ

*   [レガシーメモリマネージャーからの移行](native-migration-guide.md)
*   [Swift/Objective-C ARCとの統合の具体例を確認する](native-arc-integration.md)