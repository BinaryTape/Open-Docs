[//]: # (title: 平台庫)

為了提供對作業系統原生服務的存取，Kotlin/Native 發行版包含了一組針對每個目標特定的預建庫。這些被稱為「平台庫」。

來自平台庫的軟件包預設情況下即可使用。你不需要指定額外的連結選項來使用它們。Kotlin/Native 編譯器會自動地偵測存取了哪些平台庫並連結必要的庫。

然而，編譯器發行版中的平台庫僅僅是原生庫的包裝函式與繫結。這意味著你需要在本機電腦上自行安裝原生庫本身（`.so`、`.a`、`.dylib`、`.dll` 等）。

## POSIX 繫結

Kotlin 為所有基於 UNIX 和 Windows 的目標（包括 Android 和 iOS）提供 POSIX 平台程式庫。這些平台庫包含對該平台實作的繫結，並遵循 [POSIX 標準](https://en.wikipedia.org/wiki/POSIX)。

要使用該程式庫，請將其匯入你的專案中：

```kotlin
import platform.posix.*
```

> 由於 POSIX 實作的差異，`platform.posix` 的內容在不同平台之間會有所不同。
>
{style="note"}

你可以在這裡探索每個受支援平台的 `posix.def` 檔案內容：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台程式庫不適用於 [WebAssembly](wasm-overview.md) 目標。

## 熱門原生庫

Kotlin/Native 為各種不同平台上常用的熱門原生庫提供繫結，例如 OpenGL、zlib 和 Foundation。

在 Apple 平台上，包含了 `objc` 庫以實現與 [Objective-C 互通性](native-objc-interop.md) API 的整合。

你可以根據你的設定，在編譯器發行版中探索適用於 Kotlin/Native 目標的原生庫：

* 如果你[安裝了獨立 Kotlin/Native 編譯器](native-get-started.md#download-and-install-the-compiler)：

  1. 前往編譯器發行版解包後的封存檔，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  2. 導航至 `klib/platform` 目錄。
  3. 選擇對應目標的資料夾。

* 如果你在 IDE 中使用 Kotlin 外掛程式（與 IntelliJ IDEA 和 Android Studio 隨附）：

  1. 在你的命令列工具中，執行以下指令以導航至 `.konan` 資料夾：

     <tabs>
     <tab title="macOS 與 Linux">

     ```none
     ~/.konan/
     ```

     </tab>
     <tab title="Windows">

     ```none
     %\USERPROFILE%\.konan
     ```

     </tab>
     </tabs>

  2. 打開 Kotlin/Native 編譯器發行版，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  3. 導航至 `klib/platform` 目錄。
  4. 選擇對應目標的資料夾。

> 如果你想探索每個受支援平台庫的定義檔案：在編譯器發行版資料夾中，導航至 `konan/platformDef` 目錄並選擇需要的目標。
> 
{style="tip"}

## 下一步

[進一步了解與 Swift/Objective-C 的互通性](native-objc-interop.md)