[//]: # (title: Kotlin/Nativeバイナリオプション)

このページでは、Kotlin/Nativeの[最終バイナリ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)を設定するために使用できる、役立つKotlin/Nativeバイナリオプションと、プロジェクトでバイナリオプションを設定する方法を一覧表示します。

## 有効化する方法

バイナリオプションは、`gradle.properties`ファイル、ビルドファイルで有効にするか、コンパイラ引数として渡すことができます。

### Gradleプロパティでの設定

プロジェクトの`gradle.properties`ファイルで、`kotlin.native.binary`プロパティを使用してバイナリオプションを設定できます。例：

```none
kotlin.native.binary.gc=cms
kotlin.native.binary.latin1Strings=true
```

### ビルドファイルでの設定

プロジェクトの`build.gradle.kts`ファイルでバイナリオプションを設定できます。

*   `binaryOption`属性を使用して特定のバイナリに設定する場合。例：

  ```kotlin
  kotlin {
      iosArm64 {
          binaries {
              framework {
                  binaryOption("smallBinary", "true")
              }
          }
      }
  }
  ```

*   `freeCompilerArgs`属性に`-Xbinary=$option=$value`コンパイラオプションとして設定する場合。例：

  ```kotlin
  kotlin {
      iosArm64 {
          compilations.configureEach {
              compilerOptions.configure {
                  freeCompilerArgs.add("-Xbinary=smallBinary=true")
              }
          }
      }
  }
  ```

### コマンドラインコンパイラでの設定

[Kotlin/Nativeコンパイラ](native-get-started.md#using-the-command-line-compiler)を実行する際に、コマンドラインで直接`-Xbinary=$option=$value`としてバイナリオプションを渡すことができます。例：

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true
```

## バイナリオプション

> この表は、既存のすべてのオプションを網羅したものではなく、特に注目すべきもののみを記載しています。
>
{style="note"}

<table column-width="fixed">
    <tr>
        <td width="240">オプション</td>
        <td width="170">値</td>
        <td>説明</td>
        <td width="110">ステータス</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#smaller-binary-size-for-release-binaries"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (デフォルト)</li>
            </list>
        </td>
        <td>リリースバイナリのサイズを縮小します。</td>
        <td>2.2.20から実験的</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#support-for-stack-canaries-in-binaries"><code>stackProtector</code></a></td>
        <td>
            <list>
                <li><code>yes</code></li>
                <li><code>strong</code></li>
                <li><code>all</code></li>
                <li><code>no</code> (デフォルト)</li>
            </list>
        </td>
        <td>スタックカナリアを有効にします。脆弱な関数には<code>yes</code>、すべての関数には<code>all</code>、より強力なヒューリスティックを使用する場合は<code>strong</code>を使用します。</td>
        <td>2.2.20から利用可能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#disable-allocator-paging"><code>pagedAllocator</code></a></td>
        <td>
            <list>
                <li><code>true</code> (デフォルト)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>アロケーションのページング（バッファリング）を制御します。<code>false</code>の場合、メモリアロケーターはオブジェクトごとにメモリを予約します。</td>
        <td>2.2.0から実験的</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (デフォルト)</li>
            </list>
        </td>
        <td>アプリケーションのバイナリサイズを削減し、メモリ消費量を調整するために、Latin-1エンコードされた文字列のサポートを制御します。</td>
        <td>2.2.0から実験的</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>Appleプラットフォームでのメモリ消費量追跡に必要なメモリータグ付けを制御します。値<code>240</code>-<code>255</code>が利用可能です（デフォルトは<code>246</code>）。<code>0</code>はタグ付けを無効にします。</td>
        <td>2.2.0から利用可能</td>
    </tr>
    <tr>
        <td><code>disableMmap</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (デフォルト)</li>
            </list>
        </td>
        <td>デフォルトのアロケーターを制御します。<code>true</code>の場合、<code>mmap</code>ではなく<code>malloc</code>メモリアロケーターを使用します。</td>
        <td>2.2.0から利用可能</td>
    </tr>
    <tr>
        <td><code>gc</code></td>
        <td>
            <list>
                <li><code>pmcs</code> (デフォルト)</li>
                <li><code>stwms</code></li>
                <li><a href="native-memory-manager.md#optimize-gc-performance"><code>cms</code></a></li>
                <li><a href="native-memory-manager.md#disable-garbage-collection"><code>noop</code></a></li>
            </list>
        </td>
        <td>ガベージコレクションの動作を制御します。
            <list>
                <li><code>pmcs</code>は並行マーク同時スイープを使用します</li>
                <li><code>stwms</code>はシンプルなストップ・ザ・ワールドマークアンドスイープを使用します</li>
                <li><code>cms</code>はGCの一時停止時間を短縮するのに役立つ同時マークを有効にします</li>
                <li><code>noop</code>はガベージコレクションを無効にします</li>
            </list>
        </td>
        <td><code>cms</code>は2.0.20から実験的</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (デフォルト)</li>
            </list>
        </td>
        <td>ガベージコレクションのマークフェーズの並列化を無効にします。大規模なヒープではGCの一時停止時間が増加する可能性があります。</td>
        <td>1.7.20から利用可能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#monitor-gc-performance"><code>enableSafepointSignposts</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (デフォルト)</li>
            </list>
        </td>
        <td>Xcode Instrumentsでのデバッグのために、プロジェクト内のGC関連の一時停止の追跡を有効にします。</td>
        <td>2.0.20から利用可能</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>
            <p>Kotlin IRコンパイラにおけるインライン化最適化パスを設定します。これは実際のコード生成フェーズの前に実行されます（デフォルトでは無効）。</p>
            <p>推奨されるトークン数（コンパイラによって解析されるコード単位）は40です。</p>
        </td>
        <td>2.1.20から実験的</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (デフォルト)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>Swift/Objective-Cオブジェクトのデアロケーションを制御します。<code>false</code>の場合、デアロケーションはメインスレッドではなく、特別なGCスレッドで発生します。</td>
        <td>1.9.0から利用可能</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#support-for-background-state-and-app-extensions"><code>appStateTracking</code></a></td>
        <td>
            <list>
                <li><code>enabled</code></li>
                <li><code>disabled</code> (デフォルト)</li>
            </list>
        </td>
        <td>
            <p>アプリケーションがバックグラウンドで実行されている場合の、タイマーベースのガベージコレクタ呼び出しを制御します。</p>
            <p><code>enabled</code>の場合、GCはメモリ消費量が過度に高くなった場合にのみ呼び出されます。</p>
       </td>
        <td>1.7.20から実験的</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td><code>Info.plst</code>ファイルにバンドルID（<code>CFBundleIdentifier</code>）を設定します。</td>
        <td>1.7.20から利用可能</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td><code>Info.plst</code>ファイルに短いバンドルバージョン（<code>CFBundleShortVersionString</code>）を設定します。</td>
        <td>1.7.20から利用可能</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td><code>Info.plst</code>ファイルにバンドルバージョン（<code>CFBundleVersion</code>）を設定します。</td>
        <td>1.7.20から利用可能</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code> (Appleターゲット)</li>
                <li><code>noop</code> (デフォルト)</li>
            </list>
        </td>
        <td>
            <p>例外のスタックトレースにファイルの位置と行番号を追加します。</p>
            <p><code>coresymbolication</code>はAppleターゲットでのみ利用可能であり、デバッグモードではmacOSおよびAppleシミュレータでデフォルトで有効になります。</p>
        </td>
        <td>1.6.20から実験的</td>
    </tr>
    <!-- <tr>
        <td><code>objcExportReportNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>When <code>enabled</code>, reports warnings in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>objcExportErrorOnNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>When <code>true</code>, issues errors in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>debugCompilationDir</code></td>
        <td><code>String</code></td>
        <td>Specifies the directory path to use for debug information in the compiled binary.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>fixedBlockPageSize</code></td>
        <td><code>UInt</code></td>
        <td>Controls the page size for fixed memory blocks in the memory allocator. Affects memory allocation performance and fragmentation.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>gcMutatorsCooperate</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (default)</li>
            </list>
        </td>
        <td>Controls cooperation between mutator threads and the garbage collector.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>auxGCThreads</code></td>
        <td><code>UInt</code></td>
        <td>Specifies the number of auxiliary threads to use for garbage collection.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>sanitizer</code></td>
        <td>
            <list>
                <li><code>address</code></li>
                <li><code>thread</code></li>
            </list>
        </td>
        <td>Enables runtime sanitizers for detecting various issues like memory errors, data races, and undefined behavior.</td>
        <td>Experimental</td>
    </tr> -->
</table>

> 安定性レベルの詳細については、[ドキュメント](components-stability.md#stability-levels-explained)を参照してください。
>
{style="tip"}

## 次のステップ

[最終ネイティブバイナリをビルドする](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)方法を学びましょう。