[//]: # (title: Kotlin/Native 二进制选项)

本页面列出了有用的 Kotlin/Native 二进制选项，你可以使用它们来配置 Kotlin/Native [最终二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)，以及在你的项目中设置二进制选项的方式。

## 如何启用

你可以在 `gradle.properties` 文件、你的构建文件或作为编译器实参传递来启用二进制选项。

### 在 Gradle 属性中

你可以在项目的 `gradle.properties` 文件中使用 `kotlin.native.binary` 属性设置二进制选项。例如：

```none
kotlin.native.binary.gc=cms
kotlin.native.binary.latin1Strings=true
```

### 在你的构建文件中

你可以在 `build.gradle.kts` 文件中为你的项目设置二进制选项：

*   对于特定的二进制文件，使用 `binaryOption` 属性。例如：

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

*   作为 `-Xbinary=$option=$value` 编译器选项，在 `freeCompilerArgs` 属性中。例如：

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

当执行 [Kotlin/Native 编译器](native-get-started.md#using-the-command-line-compiler)时，你可以在命令行中直接传递 `-Xbinary=$option=$value` 作为二进制选项。例如：

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true
```

## 二进制选项

> 此表格并非所有现有选项的详尽列表，仅包含最值得注意的选项。
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
                <li><code>true</code> (默认)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>为导出的 Objective-C 头文件中的函数类型添加显式形参名称。</td>
        <td>自 2.3.0 起默认</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#smaller-binary-size-for-release-binaries"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>减小发行版二进制文件的大小。</td>
        <td>自 2.2.20 起为实验性的</td>
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
        <td>启用栈金丝雀：`yes` 用于易受攻击的函数，`all` 用于所有函数，`strong` 用于更强的启发式方法。</td>
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
        <td>控制分配（缓冲）的分页。当为 <code>false</code> 时，内存分配器会按对象预留内存。</td>
        <td>自 2.2.0 起为实验性的</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>控制对 Latin-1 编码字符串的支持，以减小应用程序二进制文件大小并调整内存消耗。</td>
        <td>自 2.2.0 起为实验性的</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>控制内存标记，对于 Apple 平台上的内存消耗跟踪是必需的。可用值 <code>240</code>-<code>255</code>（默认为 <code>246</code>）；<code>0</code> 禁用标记。</td>
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
        <td>控制默认分配器。当为 <code>true</code> 时，使用 <code>malloc</code> 内存分配器而不是 <code>mmap</code>。</td>
        <td>自 2.2.0 起可用</td>
    </tr>
    <tr>
        <td><code>gc</code></td>
        <td>
            <list>
                <li><code>pmcs</code> (默认)</li>
                <li><code>stwms</code></li>
                <li><a href="native-memory-manager.md#optimize-gc-performance"><code>cms</code></a></li>
                <li><a href="native-memory-manager.md#disable-garbage-collection"><code>noop</code></a></li>
            </list>
        </td>
        <td>控制垃圾回收行为：
            <list>
                <li><code>pmcs</code> 使用并行标记并发清除</li>
                <li><code>stwms</code> 使用简单的全停顿标记清除</li>
                <li><code>cms</code> 启用并发标记，有助于减少 GC 暂停时间</li>
                <li><code>noop</code> 禁用垃圾回收</li>
            </list>
        </td>
        <td><code>cms</code> 自 2.0.20 起为实验性的</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认)</li>
            </list>
        </td>
        <td>禁用垃圾回收中标记阶段的并行化。在大型堆上可能会增加 GC 暂停时间。</td>
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
        <td>在项目中启用 GC 相关暂停的跟踪，以便在 Xcode Instruments 中进行调试。</td>
        <td>自 2.0.20 起可用</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>
            <p>配置 Kotlin IR 编译器中的内联优化过程，该过程在实际代码生成阶段之前（默认为禁用）。</p>
            <p>建议的 token 数量（由编译器解析的代码单元）为 40。</p>
        </td>
        <td>自 2.1.20 起为实验性的</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (默认)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制 Swift/Objective-C 对象的去初始化。当为 <code>false</code> 时，去初始化发生在特殊的 GC 线程而不是主线程上。</td>
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
            <p>控制应用程序在后台运行时，基于计时器调用垃圾回收器。</p>
            <p>当 <code>enabled</code> 时，仅当内存消耗过高时才调用 GC。</p>
       </td>
        <td>自 1.7.20 起为实验性的</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 bundle ID (<code>CFBundleIdentifier</code>)。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置短 bundle 版本 (<code>CFBundleShortVersionString</code>)。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 bundle 版本 (<code>CFBundleVersion</code>)。</td>
        <td>自 1.7.20 起可用</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code> (Apple 目标平台)</li>
                <li><code>noop</code> (默认)</li>
            </list>
        </td>
        <td>
            <p>将文件位置和行号添加到异常栈追踪中。</p>
            <p><code>coresymbolication</code> 仅适用于 Apple 目标平台，并且在调试模式下为 macOS 和 Apple 模拟器默认启用。</p>
        </td>
        <td>自 1.6.20 起为实验性的</td>
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

> 关于稳定性级别的更多信息，请参见[文档](components-stability.md#stability-levels-explained)。
>
{style="tip"}

## 接下来

了解如何[构建最终的原生二进制文件](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html)。