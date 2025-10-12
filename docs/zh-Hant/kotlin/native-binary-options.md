[//]: # (title: Kotlin/Native 二進位選項)

本頁列出了實用的 Kotlin/Native 二進位選項，您可以用它們來設定 Kotlin/Native [最終二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)，以及在您的專案中設定二進位選項的方式。

## 如何啟用

您可以在 `gradle.properties` 檔案、建置檔案中啟用二進位選項，或將其作為編譯器引數傳遞。

### 在 Gradle 屬性中

您可以使用 `kotlin.native.binary` 屬性在專案的 `gradle.properties` 檔案中設定二進位選項。例如：

```none
kotlin.native.binary.gc=cms
kotlin.native.binary.latin1Strings=true
```

### 在您的建置檔案中

您可以在 `build.gradle.kts` 檔案中為您的專案設定二進位選項：

*   使用 `binaryOption` 屬性針對特定二進位檔。例如：

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

*   作為 `freeCompilerArgs` 屬性中的 `-Xbinary=$option=$value` 編譯器選項。例如：

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

### 在命令列編譯器中

您可以在執行 [Kotlin/Native 編譯器](native-get-started.md#using-the-command-line-compiler)時，直接在命令列中將二進位選項作為 `-Xbinary=$option=$value` 傳遞。例如：

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true
```

## 二進位選項

> 此表格並非所有現有選項的詳盡列表，僅列出最值得注意的選項。
>
{style="note"}

<table column-width="fixed">
    <tr>
        <td width="240">選項</td>
        <td width="170">值</td>
        <td>描述</td>
        <td width="110">狀態</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#smaller-binary-size-for-release-binaries"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (預設)</li>
            </list>
        </td>
        <td>減少發行版二進位檔的大小。</td>
        <td>從 2.2.20 起為實驗性功能</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#support-for-stack-canaries-in-binaries"><code>stackProtector</code></a></td>
        <td>
            <list>
                <li><code>yes</code></li>
                <li><code>strong</code></li>
                <li><code>all</code></li>
                <li><code>no</code> (預設)</li>
            </list>
        </td>
        <td>啟用堆疊保護（stack canaries）：`yes` 用於易受攻擊的函式，`all` 用於所有函式，`strong` 則使用更強的啟發式方法。</td>
        <td>從 2.2.20 起可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#disable-allocator-paging"><code>pagedAllocator</code></a></td>
        <td>
            <list>
                <li><code>true</code> (預設)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制分配的分頁（緩衝）。當 `false` 時，記憶體分配器會按物件保留記憶體。</td>
        <td>從 2.2.0 起為實驗性功能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (預設)</li>
            </list>
        </td>
        <td>控制對 Latin-1 編碼字串的支援，以減少應用程式二進位檔大小並調整記憶體消耗。</td>
        <td>從 2.2.0 起為實驗性功能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>控制記憶體標記，這對於 Apple 平台上的記憶體消耗追蹤是必需的。值 `240`-`255` 可用（預設為 `246`）；`0` 禁用標記。</td>
        <td>從 2.2.0 起可用</td>
    </tr>
    <tr>
        <td><code>disableMmap</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (預設)</li>
            </list>
        </td>
        <td>控制預設的分配器。當 `true` 時，使用 `malloc` 記憶體分配器而不是 `mmap`。</td>
        <td>從 2.2.0 起可用</td>
    </tr>
    <tr>
        <td><code>gc</code></td>
        <td>
            <list>
                <li><code>pmcs</code> (預設)</li>
                <li><code>stwms</code></li>
                <li><a href="native-memory-manager.md#optimize-gc-performance"><code>cms</code></a></li>
                <li><a href="native-memory-manager.md#disable-garbage-collection"><code>noop</code></a></li>
            </list>
        </td>
        <td>控制垃圾回收行為：
            <list>
                <li><code>pmcs</code> 使用平行標記並行清除（parallel mark concurrent sweep）</li>
                <li><code>stwms</code> 使用簡單的停頓世界標記清除（stop-the-world mark and sweep）</li>
                <li><code>cms</code> 啟用並行標記，有助於減少 GC 暫停時間</li>
                <li><code>noop</code> 禁用垃圾回收</li>
            </list>
        </td>
        <td><code>cms</code> 從 2.0.20 起為實驗性功能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (預設)</li>
            </list>
        </td>
        <td>禁用垃圾回收中標記階段的平行化。可能會增加大型堆積上的 GC 暫停時間。</td>
        <td>從 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#monitor-gc-performance"><code>enableSafepointSignposts</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (預設)</li>
            </list>
        </td>
        <td>啟用追蹤專案中與 GC 相關的暫停，以便在 Xcode Instruments 中進行除錯。</td>
        <td>從 2.0.20 起可用</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>
            <p>設定 Kotlin IR 編譯器中的內嵌優化傳遞，此傳遞在實際程式碼生成階段之前進行（預設為禁用）。</p> 
            <p>建議的令牌（編譯器解析的程式碼單元）數量為 40。</p>
        </td>
        <td>從 2.1.20 起為實驗性功能</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (預設)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制 Swift/Objective-C 物件的解除初始化。當 `false` 時，解除初始化會在一個特殊的 GC 執行緒上進行，而不是在主執行緒上。</td>
        <td>從 1.9.0 起可用</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#support-for-background-state-and-app-extensions"><code>appStateTracking</code></a></td>
        <td>
            <list>
                <li><code>enabled</code></li>
                <li><code>disabled</code> (預設)</li>
            </list>
        </td>
        <td>
            <p>控制應用程式在背景執行時基於計時器的垃圾回收器調用。</p>
            <p>當 `enabled` 時，GC 僅在記憶體消耗過高時才被調用。</p>
       </td>
        <td>從 1.7.20 起為實驗性功能</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 `Info.plst` 檔案中設定 bundle ID (`CFBundleIdentifier`)。</td>
        <td>從 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 `Info.plst` 檔案中設定簡短 bundle 版本 (`CFBundleShortVersionString`)。</td>
        <td>從 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 `Info.plst` 檔案中設定 bundle 版本 (`CFBundleVersion`)。</td>
        <td>從 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code> (Apple 目標)</li>
                <li><code>noop</code> (預設)</li>
            </list>
        </td>
        <td>
            <p>將檔案位置和行號添加到例外堆疊追蹤中。</p>
            <p>`coresymbolication` 僅適用於 Apple 目標，並且在偵錯模式下預設為 macOS 和 Apple 模擬器啟用。</p>
        </td>
        <td>從 1.6.20 起為實驗性功能</td>
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

> 有關穩定性等級的更多資訊，請參閱 [文件](components-stability.md#stability-levels-explained)。
> 
{style="tip"}

## 接下來是什麼

了解如何 [建置最終原生二進位檔](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-build-native-binaries.html)。