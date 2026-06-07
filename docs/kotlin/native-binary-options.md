[//]: # (title: Kotlin/Native 二进制选项)

本页列出了有助于配置 Kotlin/Native [最终二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)的 Kotlin/Native 二进制选项，以及在项目中设置二进制选项的方法。

## 如何启用

您可以在 `gradle.properties` 文件、构建文件中启用二进制选项，或者将它们作为编译器参数传递。

### 在 Gradle 属性中

您可以使用 `kotlin.native.binary` 属性在项目的 `gradle.properties` 文件中设置二进制选项。例如：

```none
kotlin.native.binary.latin1Strings=true
```

### 在构建文件中

您可以在 `build.gradle.kts` 文件中为项目设置二进制选项：

* 使用 `binaryOption` 属性为特定二进制文件设置。例如：

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

* 在 `freeCompilerArgs` 属性中作为 `-Xbinary=$option=$value` 编译器选项设置。例如：

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

### 在命令行编译器中

在执行 [Kotlin/Native 编译器](native-get-started.md#using-the-command-line-compiler)时，您可以直接在命令行中以 `-Xbinary=$option=$value` 形式传递二进制选项。
例如：

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true
```

## 二进制选项

> 此表并非所有现有选项的详尽列表，仅列出了最值得注意的选项。
>
{style="note"}

<table column-width="fixed">
    <tr>
        <td width="240">选项</td>
        <td width="170">值</td>
        <td>描述</td>
        <td width="110">状态</td>
    </tr>
    <tr>
        <td><a href="native-objc-interop.md#explicit-parameter-names-in-objective-c-block-types"><code>objcExportBlockExplicitParameterNames</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false (默认)</code></li>
            </list>
        </td>
        <td>为导出的 Objective-C 头文件中的函数类型添加显式形参名称。</td>
        <td>自 2.2.20 起处于实验性阶段</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#smaller-binary-size-for-release-binaries"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>减小发布二进制文件的二进制文件大小。</td>
        <td>自 2.2.20 起处于实验性阶段</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#support-for-stack-canaries-in-binaries"><code>stackProtector</code></a></td>
        <td>
            <list>
                <li><code>yes</code></li>
                <li><code>strong</code></li>
                <li><code>all</code></li>
                <li><code>no</code> (默认)</li>
            </list>
        </td>
        <td>启用栈保护 (stack canaries)：对易受攻击的函数使用 <code>yes</code>，对所有函数使用 <code>all</code>，使用 <code>strong</code> 则采用更强大的启发式。</td>
        <td>自 2.2.20 起可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#disable-allocator-paging"><code>pagedAllocator</code></a></td>
        <td>
            <list>
                <li><code>true</code> (默认)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制分配的分页（缓冲）。当为 <code>false</code> 时，内存分配器按对象保留内存。</td>
        <td>自 2.2.0 起处于实验性阶段</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>控制对 Latin-1 编码字符串的支持，以减小应用二进制文件大小并调整内存消耗。</td>
        <td>自 2.2.0 起处于实验性阶段</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>控制内存标记，这是在 Apple 平台上跟踪内存消耗所必需的。可用值为 <code>240</code>–<code>255</code>（默认值为 <code>246</code>）；<code>0</code> 表示禁用标记。</td>
        <td>自 2.2.0 起可用</td>
    </tr>
    <tr>
        <td><code>disableMmap</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>控制默认分配器。当为 <code>true</code> 时，使用 <code>malloc</code> 内存分配器代替 <code>mmap</code>。</td>
        <td>自 2.2.0 起可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gc</code></a></td>
        <td>
            <list>
                <li><code>cms</code> (默认)</li>
                <li><code>pmcs</code></li>
                <li><code>stwms</code></li>
                <li><a href="native-memory-manager.md#disable-garbage-collection"><code>noop</code></a></li>
            </list>
        </td>
        <td>控制垃圾回收行为：
            <list>
                <li><code>cms</code> 使用并发标记清除 (concurrent mark and sweep)</li>
                <li><code>pmcs</code> 使用并行标记并发清除 (parallel mark concurrent sweep)</li>
                <li><code>stwms</code> 使用简单的 Stop-The-World 标记清除 (simple stop-the-world mark and sweep)</li>
                <li><code>noop</code> 禁用垃圾回收</li>
            </list>
        </td>
        <td><code>cms</code> 自 2.4.0 起为默认设置</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>禁用垃圾回收中标记阶段的并行化。在大堆上可能会增加垃圾回收暂停时间。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#monitor-gc-performance"><code>enableSafepointSignposts</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>在项目中启用跟踪与垃圾回收相关的暂停，以便在 Xcode Instruments 中进行调试。</td>
        <td>自 2.0.20 起可用</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>
            <p>在 Kotlin IR 编译器中配置内联优化传递，该步骤在实际的代码生成阶段之前执行（默认禁用）。</p> 
            <p>建议的令牌（编译器解析的代码单元）数量为 40。</p>
        </td>
        <td>自 2.1.20 起处于实验性阶段</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (默认)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制 Swift/Objective-C 对象的去初始化。当为 <code>false</code> 时，去初始化发生在特殊的垃圾回收线程上，而不是主线程上。</td>
        <td>自 1.9.0 起可用</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#support-for-background-state-and-app-extensions"><code>appStateTracking</code></a></td>
        <td>
            <list>
                <li><code>enabled</code></li>
                <li><code>disabled</code> (默认)</li>
            </list>
        </td>
        <td>
            <p>当应用在后台运行时，控制基于定时器的垃圾回收器调用。</p>
            <p>当设置为 <code>enabled</code> 时，仅在内存消耗过高时才调用垃圾回收。</p>
       </td>
        <td>自 1.7.20 起处于实验性阶段</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 Bundle ID (<code>CFBundleIdentifier</code>)。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置短 Bundle 版本 (<code>CFBundleShortVersionString</code>)。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 Bundle 版本 (<code>CFBundleVersion</code>)。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code> (Apple 目标)</li>
                <li><code>noop</code> (默认)</li>
            </list>
        </td>
        <td>
            <p>向异常堆栈跟踪中添加文件位置和行号。</p>
            <p><code>coresymbolication</code> 仅适用于 Apple 目标，并在调试模式下默认对 macOS 和 Apple 模拟器启用。</p>
        </td>
        <td>自 1.6.20 起处于实验性阶段</td>
    </tr>
    <!-- <tr>
        <td><code>objcExportReportNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>当启用 (enabled) 时，如果在 Objective-C 导出期间发生名称冲突，则报告警告。</td>
        <td></td>
    </tr>
    <tr>
        <td><code>objcExportErrorOnNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>当为 <code>true</code> 时，如果在 Objective-C 导出期间发生名称冲突，则发布错误。</td>
        <td></td>
    </tr>
    <tr>
        <td><code>debugCompilationDir</code></td>
        <td><code>String</code></td>
        <td>指定用于编译后的二进制文件中调试信息的目录路径。</td>
        <td></td>
    </tr>
    <tr>
        <td><code>fixedBlockPageSize</code></td>
        <td><code>UInt</code></td>
        <td>控制内存分配器中固定内存块的页大小。影响内存分配性能和碎片化。</td>
        <td></td>
    </tr>
    <tr>
        <td><code>gcMutatorsCooperate</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>控制 mutator 线程与垃圾回收器之间的协作。</td>
        <td></td>
    </tr>
    <tr>
        <td><code>auxGCThreads</code></td>
        <td><code>UInt</code></td>
        <td>指定用于垃圾回收的辅助线程数。</td>
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
        <td>启用运行时清理程序 (sanitizer)，用于检测内存错误、数据竞争和未定义行为等各种问题。</td>
        <td>实验性阶段</td>
    </tr> -->
</table>

> 有关稳定性级别的更多信息，请参阅[文档](components-stability.md#stability-levels-explained)。
> 
{style="tip"}

## 下一步

了解如何[构建最终原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。