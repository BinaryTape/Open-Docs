[//]: # (title: 平台函式庫)

為了提供對作業系統原生服務的存取，Kotlin/Native 發行版包含了一組針對每個目標的預建函式庫。這些被稱為_平台函式庫_。

平台函式庫中的套件預設可用。您不需要指定額外的連結選項即可使用它們。Kotlin/Native 編譯器會自動偵測哪些平台函式庫被存取並連結必要的函式庫。

然而，編譯器發行版中的平台函式庫僅僅是原生函式庫的包裝器和繫結。這表示您需要將原生函式庫本身（`.so`、`.a`、`.dylib`、`.dll` 等）安裝在您的本機上。

## POSIX 繫結

Kotlin 為所有基於 UNIX 和 Windows 的目標（包括 Android 和 iOS）提供了 POSIX 平台函式庫。這些平台函式庫包含對平台實作的繫結，該實作遵循 [POSIX 標準](https://en.wikipedia.org/wiki/POSIX)。

若要使用該函式庫，請將其匯入您的專案：

```kotlin
import platform.posix.*
```

> `platform.posix` 的內容因 POSIX 實作的差異而在不同平台之間有所不同。
>
{style="note"}

您可以在此處探索每個支援平台的 `posix.def` 檔案內容：

* [iOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/ios/posix.def)
* [macOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/osx/posix.def)
* [tvOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/tvos/posix.def)
* [watchOS](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/watchos/posix.def)
* [Linux](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/linux/posix.def)
* [Windows (MinGW)](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/mingw/posix.def)
* [Android](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/platformLibs/src/platform/android/posix.def)

POSIX 平台函式庫不適用於 [WebAssembly](wasm-overview.md) 目標。

## 常見的原生函式庫

Kotlin/Native 為各種在不同平台常用、常見的原生函式庫（例如 OpenGL、zlib 和 Foundation）提供了繫結。

在 Apple 平台上，包含 `objc` 函式庫以啟用與 [Objective-C](native-objc-interop.md) API 的互通性。

您可以根據您的設定，在您的編譯器發行版中探索適用於 Kotlin/Native 目標的原生函式庫：

* 如果您[安裝了獨立的 Kotlin/Native 編譯器](native-get-started.md#download-and-install-the-compiler)：

  1. 前往編譯器發行版的解壓縮壓縮檔，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  2. 導覽至 `klib/platform` 目錄。
  3. 選擇包含對應目標的資料夾。

* 如果您在 IDE 中使用 Kotlin 外掛程式（與 IntelliJ IDEA 和 Android Studio 綁定）：

  1. 在您的命令列工具中，執行以下指令以導覽至 `.konan` 資料夾：

     <tabs>
     <tab title="macOS 和 Linux">

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

  2. 開啟 Kotlin/Native 編譯器發行版，例如 `kotlin-native-prebuilt-macos-aarch64-2.1.0`。
  3. 導覽至 `klib/platform` 目錄。
  4. 選擇包含對應目標的資料夾。

> 如果您想探索每個支援平台函式庫的定義檔：在編譯器發行版資料夾中，
> 導覽至 `konan/platformDef` 目錄並選擇必要的目標。
> 
{style="tip"}

## 接下來

[進一步了解與 Swift/Objective-C 的互通性](native-objc-interop.md)